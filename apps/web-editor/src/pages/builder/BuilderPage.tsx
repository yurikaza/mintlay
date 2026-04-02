import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../../hooks/useProject";
import { BuilderSidebar } from "../../components/builder/BuilderSidebar";
import { BuilderCanvas } from "../../components/builder/BuilderCanvas";
import { PropertyPanel } from "../../components/builder/PropertyPanel";
import { logout } from "../../store/slices/authSlice";
import { useAutoSave } from "../../hooks/useAutoSave";
// ... other imports

const BuilderPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { loading, error } = useProject(projectId);

  useEffect(() => {
    // 1. Check for Authentication (No Token)
    const token = localStorage.getItem("auth_token");
    if (!token) {
      logout(); // Clear any existing auth state
      navigate("/"); // Redirect to Home
      return;
    }

    // 2. Check for "Not Found" or "Unauthorized" from Server
    if (error === 404 || error === 401) {
      navigate("/dashboard"); // Redirect to Dashboard
    }
  }, [error, navigate]);

  const saveStatus = useAutoSave(projectId, !loading);
  // 3. Handle Loading State
  if (loading) return <div>SYNCING_ARCHITECT_STREAM...</div>;
  if (error) return <div>UNAUTHORIZED_OR_NOT_FOUND</div>;

  // If we reach here, we have a project
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <BuilderSidebar />
      <BuilderCanvas loading={loading} />
      <PropertyPanel saveStatus={saveStatus} />
    </div>
  );
};

export default BuilderPage;
