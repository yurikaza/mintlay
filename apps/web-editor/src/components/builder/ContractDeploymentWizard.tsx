// components/builder/ContractDeploymentWizard.tsx
// No-code smart contract deployment wizard
import { useState } from "react";
import {
  X, ChevronRight, ChevronLeft, CheckCircle2, Loader2,
  AlertTriangle, ExternalLink, Copy, Wallet, Zap, Shield,
} from "lucide-react";
import { useAccount, useConnect } from "wagmi";
import { DEPLOY_CONFIGS, SUPPORTED_CHAINS } from "../../contracts";
import type { DeployConfig } from "../../contracts";
import { useContractDeploy } from "../../hooks/useContractDeploy";
import { useBuilderStore } from "../../store/slices/useBuilderStore";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Pre-select a contract type when opened from a template */
  preselectedCategory?: "NFT" | "Token" | "DAO" | null;
  /** If provided, this contract store ID will be updated with the deployed address */
  contractStoreId?: string | null;
}

type WizardStep = "type" | "params" | "network" | "review" | "deploy";

const STEP_LABELS: Record<WizardStep, string> = {
  type: "Contract Type",
  params: "Configuration",
  network: "Network",
  review: "Review",
  deploy: "Deploy",
};
const STEPS: WizardStep[] = ["type", "params", "network", "review", "deploy"];

export const ContractDeploymentWizard = ({ open, onClose, preselectedCategory, contractStoreId }: Props) => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  const [step, setStep]             = useState<WizardStep>("type");
  const [selectedConfig, setConfig] = useState<DeployConfig | null>(
    preselectedCategory ? DEPLOY_CONFIGS.find((c) => c.category === preselectedCategory) ?? null : null,
  );
  const [params, setParams]         = useState<Record<string, string>>({});
  const [chainId, setChainId]       = useState<number>(11155111); // default: Sepolia testnet

  const { status, deploy, reset } = useContractDeploy();
  const addContract = useBuilderStore((s) => s.addContract);

  if (!open) return null;

  const stepIndex = STEPS.indexOf(step);

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  };

  const goBack = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  };

  const handleDeploy = async () => {
    if (!selectedConfig) return;

    // Add to store first (with empty address) so we have an ID
    const storeId = contractStoreId ?? `deploy-${Date.now()}`;
    if (!contractStoreId) {
      addContract({
        name: params.name || selectedConfig.label,
        address: "",
        chainId,
        abi: [...selectedConfig.artifact.abi] as any,
        preset: selectedConfig.category === "NFT" ? "ERC721" : "ERC20",
      });
    }

    await deploy(selectedConfig, params, chainId, storeId);
  };

  const chainInfo = SUPPORTED_CHAINS.find((c) => c.id === chainId);
  const isDeploying = status.step === "switching_chain" || status.step === "awaiting_signature" || status.step === "broadcasting" || status.step === "confirming";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 0 80px rgba(139,92,246,0.15)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-white font-bold text-base">Deploy Smart Contract</h2>
            <p className="text-zinc-500 text-xs">No code required — we handle the technical details</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step progress */}
        <div className="flex px-6 pt-4 gap-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 flex-1">
              <div className={`w-full h-1 rounded-full transition-colors ${
                i < stepIndex ? "bg-violet-500" : i === stepIndex ? "bg-violet-500" : "bg-zinc-800"
              }`} />
            </div>
          ))}
        </div>
        <p className="px-6 pt-1.5 pb-3 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          Step {stepIndex + 1}/{STEPS.length} — {STEP_LABELS[step]}
        </p>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4 max-h-[500px] overflow-y-auto">

          {/* ── Step 1: Contract type ── */}
          {step === "type" && (
            <div className="space-y-3">
              <p className="text-zinc-400 text-sm">What would you like to deploy?</p>
              {DEPLOY_CONFIGS.map((c) => (
                <button
                  key={c.artifact.contractName}
                  onClick={() => { setConfig(c); setParams(Object.fromEntries(c.params.map((p) => [p.key, p.defaultValue ?? ""]))); }}
                  className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all ${
                    selectedConfig?.artifact.contractName === c.artifact.contractName
                      ? "border-violet-500 bg-violet-600/10"
                      : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-3xl shrink-0 mt-0.5">{c.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-sm">{c.label}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 uppercase tracking-wider">{c.category}</span>
                    </div>
                    <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{c.description}</p>
                    {c.artifact.bytecode === "0x" && (
                      <p className="text-amber-500 text-[10px] mt-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Needs compilation — run <code className="bg-zinc-800 px-1 rounded">pnpm contracts compile</code>
                      </p>
                    )}
                  </div>
                  {selectedConfig?.artifact.contractName === c.artifact.contractName && (
                    <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ── Step 2: Parameters ── */}
          {step === "params" && selectedConfig && (
            <div className="space-y-3">
              <p className="text-zinc-400 text-sm">Configure your {selectedConfig.label}</p>
              {selectedConfig.params.map((param) => (
                <div key={param.key} className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <label className="text-zinc-300 text-xs font-semibold">{param.label}</label>
                    {param.required && <span className="text-red-400 text-xs">*</span>}
                  </div>
                  <p className="text-zinc-600 text-[10px]">{param.description}</p>
                  <input
                    type={param.type === "number" ? "number" : "text"}
                    value={params[param.key] ?? ""}
                    onChange={(e) => setParams((p) => ({ ...p, [param.key]: e.target.value }))}
                    placeholder={param.placeholder}
                    className="w-full h-9 px-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                  />
                  {param.type === "eth" && params[param.key] && (
                    <p className="text-zinc-600 text-[10px]">
                      = {(parseFloat(params[param.key] || "0") * 1e18).toLocaleString()} wei
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Step 3: Network ── */}
          {step === "network" && (
            <div className="space-y-3">
              <p className="text-zinc-400 text-sm">Choose the blockchain to deploy on</p>
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Testnets (recommended for testing)</p>
                {SUPPORTED_CHAINS.filter((c) => c.testnet).map((c) => (
                  <NetworkRow key={c.id} chain={c} selected={chainId === c.id} onSelect={() => setChainId(c.id)} />
                ))}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Mainnets</p>
                {SUPPORTED_CHAINS.filter((c) => !c.testnet).map((c) => (
                  <NetworkRow key={c.id} chain={c} selected={chainId === c.id} onSelect={() => setChainId(c.id)} />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Review ── */}
          {step === "review" && selectedConfig && (
            <div className="space-y-4">
              {/* Contract summary */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedConfig.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{selectedConfig.label}</p>
                    <p className="text-zinc-500 text-xs">{chainInfo?.name}</p>
                  </div>
                </div>
                <div className="divide-y divide-zinc-800">
                  {selectedConfig.params.map((param) => {
                    const val = params[param.key];
                    if (!val) return null;
                    return (
                      <div key={param.key} className="flex justify-between py-1.5">
                        <span className="text-zinc-500 text-xs">{param.label}</span>
                        <span className="text-zinc-200 text-xs font-mono">{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Security notes */}
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/40 flex gap-3">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-300 text-xs font-semibold">Mintlay Standard Contract</p>
                  <p className="text-emerald-700 text-[10px] mt-0.5 leading-relaxed">
                    Sourced from <code>packages/contracts/src/MintlayNFT.sol</code>. Minimal, auditable, no hidden logic. You are the contract owner.
                  </p>
                </div>
              </div>

              {/* Wallet connection */}
              {!isConnected ? (
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm font-semibold">Wallet not connected</span>
                  </div>
                  <p className="text-zinc-500 text-xs">Connect your wallet to deploy the contract.</p>
                  <button
                    onClick={() => connectors[0] && connect({ connector: connectors[0] })}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-950/30 border border-emerald-900/40 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-300 text-xs font-mono">{address?.slice(0, 6)}…{address?.slice(-4)}</span>
                  <span className="text-emerald-700 text-xs ml-auto">Wallet connected</span>
                </div>
              )}
            </div>
          )}

          {/* ── Step 5: Deploy ── */}
          {step === "deploy" && (
            <div className="space-y-4">
              {status.step === "idle" && (
                <div className="space-y-4">
                  <p className="text-zinc-400 text-sm">Ready to deploy. This will open MetaMask to confirm the transaction.</p>
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <DeployStep n={1} label="MetaMask opens for signature" done={false} active={false} />
                    <DeployStep n={2} label="Transaction broadcast to network" done={false} active={false} />
                    <DeployStep n={3} label="Waiting for block confirmation" done={false} active={false} />
                    <DeployStep n={4} label="Contract address saved to project" done={false} active={false} />
                  </div>
                  <button
                    onClick={handleDeploy}
                    disabled={!isConnected}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                    style={{ boxShadow: "0 0 30px rgba(139,92,246,0.3)" }}
                  >
                    <Zap className="w-4 h-4" />
                    Deploy to {chainInfo?.name}
                  </button>
                </div>
              )}

              {(status.step === "switching_chain" || status.step === "awaiting_signature" || status.step === "broadcasting" || status.step === "confirming") && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <DeployStep n={1} label="MetaMask opens for signature" done={status.step !== "awaiting_signature" && status.step !== "switching_chain"} active={status.step === "awaiting_signature" || status.step === "switching_chain"} />
                    <DeployStep n={2} label="Transaction broadcast to network" done={status.step === "confirming"} active={status.step === "broadcasting"} />
                    <DeployStep n={3} label="Waiting for block confirmation" done={false} active={status.step === "confirming"} />
                    <DeployStep n={4} label="Contract address saved to project" done={false} active={false} />
                  </div>
                  <div className="flex items-center justify-center gap-2 py-2">
                    <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                    <span className="text-zinc-400 text-sm">
                      {status.step === "switching_chain" && "Switching network in wallet…"}
                      {status.step === "awaiting_signature" && "Waiting for MetaMask signature…"}
                      {status.step === "broadcasting" && "Broadcasting transaction…"}
                      {status.step === "confirming" && "Confirming on-chain…"}
                    </span>
                  </div>
                  {(status.step === "broadcasting" || status.step === "confirming") && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-lg border border-zinc-800">
                      <span className="text-zinc-600 text-[10px] font-mono">tx:</span>
                      <span className="text-zinc-400 text-[10px] font-mono truncate flex-1">{(status as any).txHash}</span>
                    </div>
                  )}
                </div>
              )}

              {status.step === "success" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <DeployStep n={1} label="MetaMask signature" done={true} active={false} />
                    <DeployStep n={2} label="Transaction broadcast" done={true} active={false} />
                    <DeployStep n={3} label="Block confirmation received" done={true} active={false} />
                    <DeployStep n={4} label="Contract address saved to project" done={true} active={false} />
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-600/30">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-300 font-bold text-sm">Contract Deployed!</span>
                    </div>
                    <p className="text-zinc-500 text-[10px] mb-1">Contract Address</p>
                    <div className="flex items-center gap-2">
                      <code className="text-emerald-300 text-xs font-mono flex-1 truncate">{status.contractAddress}</code>
                      <button
                        onClick={() => navigator.clipboard.writeText(status.contractAddress)}
                        className="text-zinc-500 hover:text-zinc-300"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={`https://${chainInfo?.testnet ? (chainId === 11155111 ? "sepolia." : chainId === 80001 ? "mumbai." : "") : ""}etherscan.io/address/${status.contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-zinc-300"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-zinc-600 text-[10px] mt-3">
                      The contract address has been saved to your project. You can now bind elements to it in the Web3 property panel.
                    </p>
                  </div>
                  <button onClick={onClose} className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-xl transition-colors">
                    Done
                  </button>
                </div>
              )}

              {status.step === "error" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/40 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-300 font-semibold text-sm">Deployment Failed</p>
                      <p className="text-red-700 text-xs mt-1 leading-relaxed">{status.message}</p>
                    </div>
                  </div>
                  <button onClick={reset} className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-xl transition-colors">
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer nav */}
        {status.step === "idle" && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800">
            <button
              onClick={step === "type" ? onClose : goBack}
              className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === "type" ? "Cancel" : "Back"}
            </button>

            {step !== "deploy" && (
              <button
                onClick={goNext}
                disabled={step === "type" && !selectedConfig}
                className="flex items-center gap-1 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {step === "review" ? "Let's Deploy →" : "Next"}
                {step !== "review" && <ChevronRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const NetworkRow = ({
  chain,
  selected,
  onSelect,
}: {
  chain: typeof SUPPORTED_CHAINS[number];
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    onClick={onSelect}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left ${
      selected ? "border-violet-500 bg-violet-600/10" : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
    }`}
  >
    <span className="text-lg w-6 text-center" style={{ color: chain.color }}>{chain.icon}</span>
    <div className="flex-1">
      <p className="text-zinc-200 text-sm font-medium">{chain.name}</p>
      <p className="text-zinc-600 text-[10px]">Chain ID: {chain.id}</p>
    </div>
    {chain.testnet && (
      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-900/40 text-amber-400 border border-amber-900/40">TESTNET</span>
    )}
    {selected && <CheckCircle2 className="w-4 h-4 text-violet-400" />}
  </button>
);

const DeployStep = ({ n, label, done, active }: { n: number; label: string; done: boolean; active: boolean }) => (
  <div className="flex items-center gap-3">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
      done ? "bg-emerald-600" : active ? "bg-violet-600" : "bg-zinc-800"
    }`}>
      {done ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
      ) : active ? (
        <Loader2 className="w-3 h-3 text-white animate-spin" />
      ) : (
        <span className="text-[10px] text-zinc-600 font-bold">{n}</span>
      )}
    </div>
    <span className={`text-sm transition-colors ${done ? "text-emerald-400" : active ? "text-white" : "text-zinc-600"}`}>
      {label}
    </span>
  </div>
);
