import { useState, useEffect } from "react";
import axios from "axios";
import type { Project } from "../types/project";
import { useBuilderStore } from "../store/slices/useBuilderStore";
import { useAccount } from "wagmi";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hydrateStore = useBuilderStore((state) => state.hydrateStore);
  const { address } = useAccount();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // We hit the Gateway. Auth is handled by the 'Authorization' header
      const token = localStorage.getItem("auth_token");
      console.log(token);

      const response = await axios.get(
        "http://localhost:3000/api/projects/my-projects?wallet=" +
          address +
          "&authorization=" +
          token,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("Project Response: ", response);

      if (response.data.scripts && response.data.scripts[0]) {
        const dbComponents = JSON.parse(response.data.scripts[0]);
        hydrateStore(dbComponents);
      }

      setProjects(response.data);
    } catch (err) {
      setError("FAILED_TO_SYNC_BLUEPRINTS");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, error, refetch: fetchProjects };
};

export const updateProjectData = async (
  projectId: string,
  components: any[],
) => {
  const token = localStorage.getItem("auth_token");
  console.log([JSON.stringify(JSON.stringify(components))]);

  const response = await axios.put(
    `http://localhost:3000/api/projects/update/${projectId}`,
    {
      // Storing the builder state in the first index of the scripts array
      scripts: [JSON.stringify(components)],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const useProject = (projectId: string | undefined) => {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<number | null>(null);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const response = await axios.get(
        `http://localhost:3000/api/projects/detail/${projectId}?authorization=${token}`,
      );
      setProject(response.data);
      console.log(response.data);
    } catch (err: any) {
      setError(err.response?.status || 500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchProject();
  }, [projectId]);

  // Now this returns the object immediately, not a Promise
  return { project, loading, error };
};
