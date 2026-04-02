// apps/web-editor/src/pages/builder/BuilderCanvas.tsx
import { motion } from "framer-motion";
import { useBuilderStore } from "../../store/slices/useBuilderStore";

export const BuilderCanvas = ({ loading }: { loading: any }) => {
  const { components, selectComponent, selectedId } = useBuilderStore();

  if (loading) return <div>SYNCING...</div>;

  return (
    <div className="flex-1 bg-zinc-950 overflow-y-auto p-12">
      <div className="max-w-5xl mx-auto min-h-screen bg-black border border-zinc-800">
        {components.map((comp: any) => (
          <motion.div
            key={comp.id}
            onClick={() => selectComponent(comp.id)}
            style={{ backgroundColor: comp.props.backgroundColor }}
            className={`relative group p-10 border-2 ${selectedId === comp.id ? "border-purple-500" : "border-transparent"}`}
          >
            <h2 className="text-white font-bold uppercase">{comp.type}</h2>
            {/* Render dynamic props here */}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
