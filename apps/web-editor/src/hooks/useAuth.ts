import { useSignMessage, useAccount, useDisconnect } from "wagmi";
import { api } from "../lib/api";

export const useAuth = () => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();

  const login = async () => {
    if (!address) return;

    try {
      // 1. GET NONCE: "The Challenge"
      const {
        data: { nonce },
      } = await api.get(`/auth/nonce?address=${address}`);

      // 2. SIGN MESSAGE: "The Proof"
      const message = `Sign this to verify your identity: ${nonce}`;
      const signature = await signMessageAsync({ message });

      // 3. VERIFY: "The Handshake"
      const { data } = await api.post("/auth/verify", {
        address,
        signature,
        message,
      });

      // 4. PERSIST: Save the session
      localStorage.setItem("auth_token", data.token);
      console.log("PROTOCOL_SECURED: Session_Active");

      return data.user;
    } catch (error) {
      console.error("AUTH_FAILURE:", error);
      disconnect(); // Safety: disconnect if auth fails
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    disconnect();
  };

  return { login, logout, isConnected };
};
