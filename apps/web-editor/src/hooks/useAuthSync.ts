import { useEffect } from "react";
import { useAccount } from "wagmi";
import axios from "axios";

export const useAuthSync = () => {
  const { address, isConnected, status } = useAccount();

  useEffect(() => {
    const recordUser = async () => {
      if (isConnected && address && status === "connected") {
        try {
          // We hit the Gateway (Port 3000)
          await axios.post("http://localhost:3000/api/auth/sync", {
            address: address,
          });
          console.log("PROTOCOL: Identity_Synced_With_Cloud");
        } catch (err) {
          console.error("PROTOCOL_ERROR: Sync_Failed", err);
        }
      }
    };

    recordUser();
  }, [isConnected, address, status]);
};
