// components/builder/ContractsPanel.tsx
import { useState } from "react";
import {
  Plus, Trash2, ChevronDown, ChevronRight,
  FileCode2, Zap, Eye, Cpu, Rocket,
} from "lucide-react";
import { ContractDeploymentWizard } from "./ContractDeploymentWizard";
import { useBuilderStore } from "../../store/slices/useBuilderStore";
import { PRESET_ABIS } from "../../types/builder";
import type { ContractConfig, ContractABIEntry } from "../../types/builder";

const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  137: "Polygon",
  8453: "Base",
  42161: "Arbitrum",
  10: "Optimism",
  56: "BNB Chain",
  43114: "Avalanche",
  11155111: "Sepolia",
  80001: "Mumbai",
};

const PRESET_LABELS = {
  ERC721: { label: "ERC-721 (NFT)", color: "#8b5cf6", icon: "🎨" },
  ERC20: { label: "ERC-20 (Token)", color: "#3b82f6", icon: "🪙" },
  ERC1155: { label: "ERC-1155 (Multi)", color: "#10b981", icon: "🎮" },
};

const MUTABILITY_BADGE: Record<string, { label: string; color: string }> = {
  view: { label: "read", color: "#10b981" },
  pure: { label: "pure", color: "#6b7280" },
  nonpayable: { label: "write", color: "#f59e0b" },
  payable: { label: "payable", color: "#ef4444" },
};

type FormMode = "closed" | "preset" | "custom";

const blankForm = {
  name: "",
  address: "",
  chainId: 1,
  abiText: "",
  preset: "" as "" | "ERC721" | "ERC20" | "ERC1155",
};

export const ContractsPanel = () => {
  const contracts    = useBuilderStore((s) => s.contracts);
  const addContract  = useBuilderStore((s) => s.addContract);
  const removeContract = useBuilderStore((s) => s.removeContract);

  const [mode, setMode]           = useState<FormMode>("closed");
  const [form, setForm]           = useState(blankForm);
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [error, setError]         = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);

  const openPreset = (p: "ERC721" | "ERC20" | "ERC1155") => {
    setForm({ ...blankForm, preset: p });
    setMode("preset");
    setError("");
  };

  const openCustom = () => {
    setForm(blankForm);
    setMode("custom");
    setError("");
  };

  const handleAdd = () => {
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!form.address.trim()) { setError("Contract address is required"); return; }

    let abi: ContractABIEntry[] = [];
    if (mode === "preset" && form.preset) {
      abi = PRESET_ABIS[form.preset];
    } else {
      try {
        abi = JSON.parse(form.abiText);
        if (!Array.isArray(abi)) throw new Error("ABI must be an array");
      } catch {
        setError("Invalid ABI JSON — paste a valid ABI array");
        return;
      }
    }

    const config: Omit<ContractConfig, "id"> = {
      name: form.name.trim(),
      address: form.address.trim(),
      chainId: form.chainId,
      abi,
      preset: form.preset || "custom",
    };
    addContract(config);
    setForm(blankForm);
    setMode("closed");
    setError("");
  };

  const getFunctions = (contract: ContractConfig) =>
    contract.abi.filter((e) => e.type === "function");

  const getReadFns = (contract: ContractConfig) =>
    getFunctions(contract).filter((f) =>
      f.stateMutability === "view" || f.stateMutability === "pure",
    );

  const getWriteFns = (contract: ContractConfig) =>
    getFunctions(contract).filter((f) =>
      f.stateMutability === "nonpayable" || f.stateMutability === "payable",
    );

  return (
    <div className="flex flex-col gap-0 text-xs">
      {/* Header */}
      <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Smart Contracts</span>
        <div className="flex gap-1">
          <button
            onClick={openCustom}
            title="Add custom contract"
            className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Deploy wizard CTA */}
      {mode === "closed" && (
        <div className="px-3 py-2 border-b border-zinc-800 shrink-0">
          <button
            onClick={() => setWizardOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-800/40 text-violet-300 hover:border-violet-600/60 hover:text-violet-200 text-[11px] font-semibold transition-all"
          >
            <Rocket className="w-3.5 h-3.5" />
            Deploy New Contract
          </button>
        </div>
      )}

      {/* Quick preset buttons */}
      {mode === "closed" && (
        <div className="px-3 py-2 border-b border-zinc-800 flex flex-col gap-1.5 shrink-0">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-0.5">Quick Add</p>
          {(["ERC721", "ERC20", "ERC1155"] as const).map((p) => (
            <button
              key={p}
              onClick={() => openPreset(p)}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors text-left"
            >
              <span className="text-sm">{PRESET_LABELS[p].icon}</span>
              <span className="text-[11px]">{PRESET_LABELS[p].label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Add contract form */}
      {mode !== "closed" && (
        <div className="px-3 py-2 border-b border-zinc-800 flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              {mode === "preset" && form.preset ? `Add ${PRESET_LABELS[form.preset as keyof typeof PRESET_LABELS].label}` : "Add Custom Contract"}
            </p>
            <button onClick={() => setMode("closed")} className="text-zinc-600 hover:text-zinc-300">✕</button>
          </div>

          <div className="flex flex-col gap-1.5">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Contract name..."
              className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-zinc-200 placeholder-zinc-600 text-[11px] outline-none focus:border-zinc-500"
            />
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="0x... contract address"
              className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-zinc-200 placeholder-zinc-600 text-[11px] font-mono outline-none focus:border-zinc-500"
            />
            <select
              value={form.chainId}
              onChange={(e) => setForm({ ...form, chainId: Number(e.target.value) })}
              className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-zinc-200 text-[11px] outline-none focus:border-zinc-500"
            >
              {Object.entries(CHAIN_NAMES).map(([id, name]) => (
                <option key={id} value={Number(id)}>{name} ({id})</option>
              ))}
            </select>

            {mode === "custom" && (
              <textarea
                value={form.abiText}
                onChange={(e) => setForm({ ...form, abiText: e.target.value })}
                placeholder='Paste ABI JSON array: [{"name":"mint","type":"function",...}]'
                rows={4}
                className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-zinc-200 placeholder-zinc-600 text-[10px] font-mono outline-none focus:border-zinc-500 resize-none"
              />
            )}

            {mode === "preset" && form.preset && (
              <div className="px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-500 text-[10px]">
                {PRESET_ABIS[form.preset as keyof typeof PRESET_ABIS].length} standard methods pre-loaded
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-[10px]">{error}</p>}

          <button
            onClick={handleAdd}
            className="w-full py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded text-[11px] font-medium transition-colors"
          >
            Add Contract
          </button>
        </div>
      )}

      {/* Contract list */}
      <div className="flex-1 overflow-y-auto">
        {contracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
              <FileCode2 className="w-4 h-4 text-zinc-600" />
            </div>
            <p className="text-zinc-600 text-[11px] leading-relaxed">
              No contracts yet. Add an ERC-721, ERC-20, or paste your own ABI.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {contracts.map((c) => {
              const isExpanded = expanded === c.id;
              const reads = getReadFns(c);
              const writes = getWriteFns(c);
              const preset = c.preset && c.preset !== "custom" ? PRESET_LABELS[c.preset as keyof typeof PRESET_LABELS] : null;

              return (
                <div key={c.id} className="flex flex-col">
                  {/* Contract header */}
                  <div
                    className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-900/50 cursor-pointer group"
                    onClick={() => setExpanded(isExpanded ? null : c.id)}
                  >
                    <div
                      className="shrink-0"
                      style={{ color: preset?.color ?? "#6b7280" }}
                    >
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {preset && <span className="text-sm">{preset.icon}</span>}
                        <span className="text-zinc-200 text-[11px] font-medium truncate">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {c.address ? (
                          <span className="text-zinc-600 font-mono text-[9px]">
                            {c.address.slice(0, 6)}…{c.address.slice(-4)}
                          </span>
                        ) : (
                          <span className="text-amber-600 text-[9px]">Not deployed</span>
                        )}
                        <span className="text-zinc-700 text-[9px]">{CHAIN_NAMES[c.chainId] ?? `Chain ${c.chainId}`}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="flex items-center gap-0.5 text-emerald-500 text-[9px]">
                        <Eye className="w-2.5 h-2.5" />{reads.length}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-500 text-[9px]">
                        <Zap className="w-2.5 h-2.5" />{writes.length}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeContract(c.id); }}
                        className="opacity-0 group-hover:opacity-100 ml-1 text-zinc-600 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded methods */}
                  {isExpanded && (
                    <div className="px-3 pb-2 flex flex-col gap-1 bg-zinc-950/50">
                      {reads.length > 0 && (
                        <>
                          <p className="text-[9px] font-mono text-emerald-600 uppercase tracking-widest mt-1 mb-0.5 flex items-center gap-1">
                            <Eye className="w-2.5 h-2.5" /> Read
                          </p>
                          {reads.map((fn) => (
                            <MethodRow key={fn.name} fn={fn} />
                          ))}
                        </>
                      )}
                      {writes.length > 0 && (
                        <>
                          <p className="text-[9px] font-mono text-amber-600 uppercase tracking-widest mt-1.5 mb-0.5 flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5" /> Write
                          </p>
                          {writes.map((fn) => (
                            <MethodRow key={fn.name} fn={fn} />
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deployment wizard */}
      <ContractDeploymentWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </div>
  );
};

const MethodRow = ({ fn }: { fn: ContractABIEntry }) => {
  const badge = fn.stateMutability ? MUTABILITY_BADGE[fn.stateMutability] : null;
  const args = (fn.inputs ?? []).map((i) => `${i.name}: ${i.type}`).join(", ");

  return (
    <div className="flex items-start gap-1.5 py-0.5">
      <Cpu className="w-2.5 h-2.5 mt-0.5 text-zinc-600 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-300 text-[10px] font-mono">{fn.name}</span>
          {badge && (
            <span className="text-[8px] px-1 rounded" style={{ color: badge.color, backgroundColor: badge.color + "20" }}>
              {badge.label}
            </span>
          )}
        </div>
        {args && (
          <p className="text-zinc-600 text-[9px] font-mono truncate">({args})</p>
        )}
      </div>
    </div>
  );
};
