import { useProfile } from "../../hooks/useProfile"; // The hook from your screenshot
import { useProjects } from "../../hooks/useProject";
import { createProject } from "../../hooks/useProjectServices";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { ErrorMessage } from "../ui/ErrorMessage";

const InitializeButton = () => {
  // 1. ALL HOOKS FIRST (Top Level)
  const navigate = useNavigate();
  const { projects, loading: projectsLoading, refetch } = useProjects();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const { address } = useAccount();

  // 2. LOGIC AFTER HOOKS
  const limits: Record<string, number> = {
    free: 1,
    pro: 10,
    architect: 100,
  };

  const userPlan = profile?.plan || "free";
  const currentCount = projects?.length || 0;
  const maxSlots = limits[userPlan] || 1;
  const hasSlots = currentCount < maxSlots;
  console.log("projects profile gwrgawrgrwag", profile);

  // 3. CONDITIONAL RENDERING LAST
  if (projectsLoading || profileLoading) {
    return (
      <div className="text-purple-500 animate-pulse p-10">
        SYNCING_SYSTEM_DATA...
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Your UI code here */}
      <div className="text-right mb-4">
        <span className={hasSlots ? "text-white" : "text-red-500"}>
          {currentCount} / {maxSlots} ACTIVE_SLOTS
        </span>
      </div>

      {hasSlots ? (
        <button
          onClick={() => {
            if (!address) {
              console.error("Wallet address not connected");
              <ErrorMessage
                message={
                  "WALLET_NOT_CONNECTED please connect your wallet to initialize a project."
                }
                onRetry={() => refetch()}
              />;
              return;
            }
            createProject("My Project", address, userPlan)
              .then((data) => {
                console.log("Created Project: ", data);
                // Redirect to builder with new project ID
              })
              .catch((err) => {
                console.error("Project creation failed: ", err);
                <ErrorMessage
                  message={
                    "PROJECT_CREATION_FAILED An error occurred while creating your project. Please try again."
                  }
                  onRetry={() => refetch()}
                />;
              });
          }}
        >
          + INITIALIZE
        </button>
      ) : (
        <div className="err-msg">LIMIT_REACHED_UPGRADE_PLAN</div>
      )}
    </div>
  );
};

export default InitializeButton;
//  navigate(`/dashboard/builder/${data.id}`);
