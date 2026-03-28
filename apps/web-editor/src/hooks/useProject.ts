import { useState, useEffect } from "react";
import axios from "axios";
import type { Project } from "../types/project";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // We hit the Gateway. Auth is handled by the 'Authorization' header
      const token = localStorage.getItem("token");
      console.log(token);

      const response = await axios.get(
        "http://localhost:3000/api/projects/my-projects",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("Project Response: ", response.data);

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
