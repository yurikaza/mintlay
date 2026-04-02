import React from "react";
import { useProject } from "../../hooks/useProject";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({
  data,
  index,
}: {
  data: any;
  index: number;
}) {
  const project = data;
  const navigate = useNavigate();
  return (
    <div
      key={project.id || index}
      className="border border-zinc-800 bg-zinc-900/50 p-6 flex justify-between items-center group hover:border-purple-500 transition-all"
    >
      <div
        className="flex items-center gap-6"
        onClick={() => useProject(project.id)}
      >
        <span className="text-purple-500 font-mono text-xl">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div
          onClick={() => navigate(`/dashboard/builder/${project.id}`)}
          className="cursor-pointer"
        >
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
  );
}
