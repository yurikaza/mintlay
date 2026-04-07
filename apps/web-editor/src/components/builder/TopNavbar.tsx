// components/builder/TopNavbar.tsx
import { Link } from "react-router-dom";
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Play,
  Pencil,
  ChevronLeft,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { useBuilderStore } from "../../store/slices/useBuilderStore";

interface TopNavbarProps {
  projectName: string;
  saveStatus: "idle" | "saving" | "saved" | "error";
}

export const TopNavbar = ({ projectName, saveStatus }: TopNavbarProps) => {
  const { viewport, setViewport, undo, redo, past, future, isPreviewMode, setPreviewMode } =
    useBuilderStore();

  return (
    <div className="h-full px-3 flex items-center justify-between bg-zinc-950 text-xs text-zinc-400">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          className="flex items-center gap-1 text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px] uppercase tracking-widest">
            Mintlay
          </span>
        </Link>

        <div className="w-px h-4 bg-zinc-800" />

        <span className="text-zinc-300 font-medium truncate max-w-[180px]">
          {projectName}
        </span>

        {/* Save status */}
        <div className="flex items-center gap-1.5 ml-1">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />
              <span className="text-zinc-600 text-[10px]">Saving...</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600 text-[10px]">Saved</span>
            </>
          )}
          {saveStatus === "error" && (
            <>
              <AlertCircle className="w-3 h-3 text-red-500" />
              <span className="text-red-500 text-[10px]">Save failed</span>
            </>
          )}
        </div>
      </div>

      {/* Center: Viewport */}
      <div className="flex items-center bg-zinc-900 rounded p-0.5 border border-zinc-800">
        <ViewBtn
          icon={<Monitor className="w-3.5 h-3.5" />}
          label="Desktop"
          active={viewport === "desktop"}
          onClick={() => setViewport("desktop")}
        />
        <ViewBtn
          icon={<Tablet className="w-3.5 h-3.5" />}
          label="Tablet"
          active={viewport === "tablet"}
          onClick={() => setViewport("tablet")}
        />
        <ViewBtn
          icon={<Smartphone className="w-3.5 h-3.5" />}
          label="Mobile"
          active={viewport === "mobile"}
          onClick={() => setViewport("mobile")}
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={!past.length}
          title="Undo (Ctrl+Z)"
          className="p-1.5 rounded hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={redo}
          disabled={!future.length}
          title="Redo (Ctrl+Shift+Z)"
          className="p-1.5 rounded hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-zinc-800" />

        {/* Preview / Edit toggle */}
        <button
          onClick={() => setPreviewMode(!isPreviewMode)}
          title={isPreviewMode ? "Back to editor" : "Preview (buttons become functional)"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            isPreviewMode
              ? "bg-amber-500 hover:bg-amber-400 text-zinc-950"
              : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
          }`}
        >
          {isPreviewMode
            ? <><Pencil className="w-3 h-3" /> Edit</>
            : <><Play className="w-3 h-3" /> Preview</>
          }
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium transition-colors">
          <Play className="w-3 h-3 fill-current" />
          Publish
        </button>
      </div>
    </div>
  );
};

const ViewBtn = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    title={label}
    className={`p-1.5 rounded transition-colors ${
      active
        ? "bg-zinc-700 text-white"
        : "text-zinc-500 hover:text-zinc-300"
    }`}
  >
    {icon}
  </button>
);
