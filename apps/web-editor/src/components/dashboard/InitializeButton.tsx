import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useProfile } from "../../hooks/useProfile";
import { useProjects, updateProjectData } from "../../hooks/useProject";
import { createProject } from "../../hooks/useProjectServices";
import { TemplatePicker } from "../../pages/builder/TemplatePicker";
import { instantiateTemplate, WEBSITE_TEMPLATES } from "../../pages/builder/web3-templates";
import type { NodeData } from "../../types/builder";

// Minimal local shape — mirrors SavedProject in types/builder
interface SavedProject {
  version: number;
  pages: Array<{ id: string; name: string; slug: string; isDynamic?: boolean; dynamicParam?: string }>;
  pageNodes: Record<string, NodeData[]>;
  currentPageId: string;
  contracts?: Array<{ id: string; name: string; address: string; chainId: number; abi: any[]; preset?: string }>;
}

// Plan slot limits — kept consistent with original component
const PLAN_SLOT_LIMITS: Record<string, number> = {
  free: 1,
  pro: 10,
  architect: 100,
};

const InitializeButton = () => {
  // ── Hooks (always at top level) ───────────────────────────────────────────
  const navigate = useNavigate();
  const { address } = useAccount();
  const { projects, loading: projectsLoading, refetch } = useProjects();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Derived state ─────────────────────────────────────────────────────────
  const userPlan: string = profile?.plan ?? "free";
  const maxSlots = PLAN_SLOT_LIMITS[userPlan] ?? 1;
  const currentCount = projects?.length ?? 0;
  const hasSlots = currentCount < maxSlots;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleButtonClick = () => {
    if (!hasSlots) {
      setError(
        `Slot limit reached (${currentCount}/${maxSlots}). Upgrade your plan to create more projects.`,
      );
      return;
    }
    setError(null);
    setPickerOpen(true);
  };

  const handleCreate = async (templateId: string, projectName: string) => {
    if (!address) {
      setError("Wallet not connected. Please connect your wallet first.");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const data = await createProject(projectName, address, userPlan);
      const projectId = data.id;

      const template = WEBSITE_TEMPLATES.find((t) => t.id === templateId);

      if (template && template.category !== "Blank") {
        const pages = template.pages.map((p, i) => ({
          id: `page-${i}`,
          name: p.name,
          slug: p.slug,
          isDynamic: p.isDynamic,
          dynamicParam: p.dynamicParam,
        }));

        const pageNodes: Record<string, NodeData[]> = {};
        template.pages.forEach((_, i) => {
          pageNodes[`page-${i}`] = instantiateTemplate(template, i);
        });

        // Seed template contracts with generated IDs
        const contracts = (template.contracts ?? []).map((c, i) => ({
          ...c,
          id: `contract-${i}`,
        }));

        const saved: SavedProject = {
          version: 2,
          pages,
          pageNodes,
          currentPageId: pages[0].id,
          ...(contracts.length > 0 ? { contracts } : {}),
        };

        await updateProjectData(projectId, saved);
      }

      await refetch();
      navigate(`/dashboard/builder/${projectId}`);
    } catch (err) {
      console.error("Project creation failed:", err);
      setError("Project creation failed. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  // ── Loading state (mirrors original behaviour) ────────────────────────────
  if (projectsLoading || profileLoading) {
    return (
      <div className="text-purple-500 animate-pulse text-sm px-1 py-2">
        SYNCING_SYSTEM_DATA...
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex flex-col gap-2">
        {/* Slot counter */}
        <div className="flex items-center justify-end">
          <span className={`text-xs font-mono ${hasSlots ? "text-zinc-500" : "text-red-500"}`}>
            {currentCount} / {maxSlots} slots used
          </span>
        </div>

        {/* Button */}
        <button
          onClick={handleButtonClick}
          disabled={creating || !hasSlots}
          className={`
            group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl
            border font-semibold text-sm transition-all duration-200 select-none
            ${creating || !hasSlots
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:shadow-lg hover:shadow-purple-600/25 active:scale-95"
            }
            ${hasSlots && !creating
              ? "border-purple-600/50 text-purple-300 bg-purple-950/30 hover:bg-purple-600 hover:border-purple-500 hover:text-white"
              : "border-zinc-700 text-zinc-500 bg-zinc-900/40"
            }
          `}
          title={
            !hasSlots
              ? `Upgrade your plan to create more than ${maxSlots} project${maxSlots !== 1 ? "s" : ""}`
              : "Create a new project from a template"
          }
        >
          {creating ? (
            <>
              <svg
                className="w-4 h-4 animate-spin text-purple-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>Creating project…</span>
            </>
          ) : (
            <>
              {/* Plus icon badge */}
              <span
                className={`
                  flex items-center justify-center w-5 h-5 rounded-md text-xs font-black
                  flex-shrink-0 transition-colors
                  ${hasSlots
                    ? "bg-purple-600/40 group-hover:bg-white/20"
                    : "bg-zinc-800"
                  }
                `}
              >
                +
              </span>
              <span>New Project</span>
              {!hasSlots && (
                <span className="ml-1 text-xs font-normal text-zinc-600 truncate">
                  (limit reached)
                </span>
              )}
            </>
          )}
        </button>

        {/* Inline error message */}
        {error && (
          <p className="text-xs text-red-400 max-w-xs leading-relaxed mt-1">{error}</p>
        )}
      </div>

      {/* Template picker modal */}
      <TemplatePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectTemplate={(templateId, name) => {
          setPickerOpen(false);
          handleCreate(templateId, name);
        }}
      />
    </>
  );
};

export default InitializeButton;
