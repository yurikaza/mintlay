import InitializeButton from "../../components/dashboard/InitializeButton";
import ProjectCard from "../../components/dashboard/ProjectCard";
import { useProjects } from "../../hooks/useProject";

const Console = () => {
  const { projects, loading } = useProjects();
  const projectList = projects || [];
  return (
    <div className="p-8 bg-black text-white">
      <h2 className="text-4xl font-black italic tracking-tighter mb-8">
        ARCHITECT_CONSOLE
      </h2>

      <div className="space-y-4">
        {projectList.length > 0 ? (
          projectList.map((project, index) => (
            <ProjectCard key={project.id} data={project} index={index} />
          ))
        ) : (
          <p className="text-zinc-500 italic">NO_ACTIVE_BLUEPRINTS_FOUND</p>
        )}

        {/* Initialize Button */}
        <InitializeButton />
      </div>
    </div>
  );
};

export default Console;
