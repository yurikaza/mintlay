// components/builder/NftDeployBanner.tsx
// Shows when an NFT project has an undeployed or unminted contract — prompts action.
import { useState } from "react";
import { Rocket, X, Zap } from "lucide-react";
import { useBuilderStore } from "../../store/slices/useBuilderStore";
import { ContractDeploymentWizard } from "./ContractDeploymentWizard";
import { useAccount, useWriteContract } from "wagmi";
import { MINTLAY_NFT_ABI } from "../../contracts";

export function NftDeployBanner() {
  const contracts      = useBuilderStore((s) => s.contracts);
  const isPreviewMode  = useBuilderStore((s) => s.isPreviewMode);
  const updateContract = useBuilderStore((s) => s.updateContract);

  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [wizardOpen, setWizardOpen]   = useState(false);
  const [dismissed, setDismissed]     = useState(false);
  const [minting, setMinting]         = useState(false);
  const [mintDone, setMintDone]       = useState(false);

  // Undeployed NFT contract
  const undeployedNft = contracts.find(
    (c) => c.preset === "ERC721" && (!c.address || c.address === ""),
  );

  // Deployed but no test mint done yet
  const deployedNft = contracts.find(
    (c) => c.preset === "ERC721" && c.address && c.address.startsWith("0x"),
  );

  if (isPreviewMode || dismissed) return null;

  // Nothing to show if no NFT contracts at all
  if (!undeployedNft && !deployedNft) return null;

  const handleDeploySuccess = (addr: string, chainId: number) => {
    if (undeployedNft) updateContract(undeployedNft.id, { address: addr, chainId });
    setWizardOpen(false);
  };

  const handleMintTestNFTs = async () => {
    if (!address || !deployedNft?.address) return;
    setMinting(true);
    try {
      await writeContractAsync({
        address: deployedNft.address as `0x${string}`,
        abi: MINTLAY_NFT_ABI,
        functionName: "ownerMint",
        args: [address, BigInt(5)],
        chainId: deployedNft.chainId,
      });
      // Prompt MetaMask to track each minted token
      if (window.ethereum) {
        for (let i = 1; i <= 5; i++) {
          try {
            await (window.ethereum as any).request({
              method: "wallet_watchAsset",
              params: {
                type: "ERC721",
                options: { address: deployedNft.address, tokenId: String(i) },
              },
            });
          } catch { /* user dismissed — continue */ }
        }
      }
      setMintDone(true);
    } catch {
      // user rejected or already minted — ignore
    } finally {
      setMinting(false);
    }
  };

  // ── Deployed, test mint done ─────────────────────────────────────────────
  if (mintDone) {
    return (
      <div
        className="flex items-center justify-between gap-3 px-5 py-2.5 shrink-0 z-10"
        style={{
          background: "linear-gradient(90deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.08) 100%)",
          borderBottom: "1px solid rgba(16,185,129,0.2)",
        }}
      >
        <p className="text-sm text-emerald-300">
          <span className="font-semibold">5 test NFTs minted!</span>
          {" "}Check MetaMask → NFTs tab. If they don't appear, tap <strong>Import NFT</strong> and enter the contract address + token IDs 1–5.
        </p>
        <button onClick={() => setDismissed(true)} className="text-zinc-600 hover:text-zinc-400 transition-colors shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // ── Contract deployed, prompt to mint test NFTs ──────────────────────────
  if (!undeployedNft && deployedNft) {
    return (
      <>
        <div
          className="flex items-center justify-between gap-3 px-5 py-2.5 shrink-0 z-10"
          style={{
            background: "linear-gradient(90deg, rgba(124,58,237,0.12) 0%, rgba(139,92,246,0.08) 100%)",
            borderBottom: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Zap className="w-4 h-4 text-violet-400 shrink-0" />
            <p className="text-sm text-zinc-300 truncate">
              <span className="font-semibold text-violet-300">Contract deployed!</span>
              {" "}Mint 5 test NFTs to your wallet so they appear in MetaMask and your gallery.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleMintTestNFTs}
              disabled={minting || !address}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
                boxShadow: "0 0 14px rgba(139,92,246,0.3)",
              }}
            >
              <Zap className="w-3 h-3" />
              {minting ? "Minting…" : !address ? "Connect Wallet First" : "Mint 5 Test NFTs"}
            </button>
            <button onClick={() => setDismissed(true)} className="text-zinc-600 hover:text-zinc-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── No contract deployed yet ─────────────────────────────────────────────
  return (
    <>
      <div
        className="flex items-center justify-between gap-3 px-5 py-2.5 shrink-0 z-10"
        style={{
          background: "linear-gradient(90deg, rgba(124,58,237,0.15) 0%, rgba(219,39,119,0.1) 100%)",
          borderBottom: "1px solid rgba(139,92,246,0.2)",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Rocket className="w-4 h-4 text-violet-400 shrink-0" />
          <p className="text-sm text-zinc-300 truncate">
            <span className="font-semibold text-violet-300">Your NFT contract isn't deployed yet.</span>
            {" "}Deploy to Sepolia testnet to activate minting and see live data in your site.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setWizardOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
              boxShadow: "0 0 16px rgba(139,92,246,0.35)",
            }}
          >
            <Rocket className="w-3 h-3" />
            Deploy Contract
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-zinc-600 hover:text-zinc-400 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ContractDeploymentWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        preselectedCategory="NFT"
        contractStoreId={undeployedNft?.id}
        testnetOnly={true}
        onDeploySuccess={handleDeploySuccess}
      />
    </>
  );
}
