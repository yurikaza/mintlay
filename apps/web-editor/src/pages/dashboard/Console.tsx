import { useProjects } from "../../hooks/useProject";

const Console = () => {
  const { projects, loading } = useProjects();

  return (
    <div className="p-8 bg-black text-white">
      <h2 className="text-4xl font-black italic tracking-tighter mb-8">
        ARCHITECT_CONSOLE
      </h2>

      <div className="space-y-4">
        {loading ? (
          <p className="animate-pulse text-purple-500">
            SYNCING_DATA_STREAM...
          </p>
        ) : (
          projects.map((project, index) => (
            <div
              key={project.id}
              className="border border-zinc-800 bg-zinc-900/50 p-6 flex justify-between items-center group hover:border-purple-500 transition-all"
            >
              <div className="flex items-center gap-6">
                <span className="text-purple-500 font-mono text-xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-widest">
                    {project.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    HASH: {project.id.slice(-8).toUpperCase()} // DEPLOYED:{" "}
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button className="border border-zinc-700 px-4 py-2 text-xs hover:bg-white hover:text-black transition-colors uppercase font-bold">
                MANAGE_NODE
              </button>
            </div>
          ))
        )}

        {/* Initialize Button */}
        <button className="w-full border-2 border-dashed border-zinc-800 p-8 text-zinc-600 hover:text-purple-400 hover:border-purple-900 transition-all uppercase tracking-widest font-bold">
          + INITIALIZE_NEW_BLUEPRINT
        </button>
      </div>
    </div>
  );
};

export default Console;
