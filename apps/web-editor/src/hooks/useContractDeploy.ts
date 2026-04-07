// hooks/useContractDeploy.ts
// Real on-chain deployment via wagmi v3 + viem
import { useState, useCallback } from "react";
import { useDeployContract, usePublicClient, useAccount, useSwitchChain } from "wagmi";
import { useBuilderStore } from "../store/slices/useBuilderStore";
import type { DeployConfig } from "../contracts";

export type DeployStatus =
  | { step: "idle" }
  | { step: "switching_chain"; chainId: number }
  | { step: "awaiting_signature" }
  | { step: "broadcasting"; txHash: string }
  | { step: "confirming"; txHash: string }
  | { step: "success"; txHash: string; contractAddress: string }
  | { step: "error"; message: string };

export function useContractDeploy() {
  const [status, setStatus] = useState<DeployStatus>({ step: "idle" });

  const { deployContractAsync } = useDeployContract();
  const publicClient = usePublicClient();
  const { chainId: walletChainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const updateContract = useBuilderStore((s) => s.updateContract);

  const deploy = useCallback(
    async (
      config: DeployConfig,
      params: Record<string, string>,
      targetChainId: number,
      contractStoreId: string, // ID in the builder store to update with deployed address
    ) => {
      if (config.artifact.bytecode === "0x" || config.artifact.bytecode.length < 10) {
        setStatus({
          step: "error",
          message:
            "Contract bytecode not compiled. Run `pnpm --filter @mintlay/contracts compile` to generate bytecode, then update apps/web-editor/src/contracts/index.ts.",
        });
        return;
      }

      setStatus({ step: "idle" });

      try {
        // 1. Switch chain if needed
        if (walletChainId !== targetChainId) {
          setStatus({ step: "switching_chain", chainId: targetChainId });
          await switchChainAsync({ chainId: targetChainId });
        }

        // 2. Prompt user signature
        setStatus({ step: "awaiting_signature" });
        const args = config.buildArgs(params, targetChainId);

        const txHash = await deployContractAsync({
          abi: config.artifact.abi,
          bytecode: config.artifact.bytecode,
          args,
        });

        // 3. Wait for broadcast confirmation
        setStatus({ step: "broadcasting", txHash });

        // 4. Wait for receipt
        setStatus({ step: "confirming", txHash });
        const receipt = await publicClient!.waitForTransactionReceipt({
          hash: txHash as `0x${string}`,
          confirmations: 1,
        });

        const contractAddress = receipt.contractAddress ?? "";

        // 5. Save the deployed address to the builder store
        if (contractStoreId && contractAddress) {
          updateContract(contractStoreId, { address: contractAddress });
        }

        setStatus({ step: "success", txHash, contractAddress });
      } catch (err: any) {
        const message =
          err?.shortMessage ??
          err?.message ??
          "Deployment failed. Check your wallet and try again.";
        setStatus({ step: "error", message });
      }
    },
    [deployContractAsync, publicClient, walletChainId, switchChainAsync, updateContract],
  );

  const reset = useCallback(() => setStatus({ step: "idle" }), []);

  return { status, deploy, reset };
}
