import { useSignMessage, useAccount, useDisconnect } from "wagmi";
import { api } from "../lib/api";
import { useEffect, useCallback } from "react";
import {
  setCredentials,
  setVerifying,
  logout,
} from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const dispatch = useDispatch();

  const login = useCallback(async () => {
    if (!address) return;
    dispatch(setVerifying(true)); // Lock the gate
    try {
      // 1. GET NONCE: "The Challenge"
      const {
        data: { nonce },
      } = await api.get(`/auth/nonce?address=${address}`);

      // 2. SIGN MESSAGE: "The Proof"
      const message = `Sign this to verify your identity: ${nonce}`;
      const signature = await signMessageAsync({ message });

      // 3. VERIFY: "The Handshake"
      const { data: authData } = await api.post("/auth/verify", {
        address,
        signature,
        message,
      });

      // 4. PERSIST: Save the session
      // Update Redux immediately to trigger the ProtectedRoute re-render
      dispatch(
        setCredentials({
          user: authData.user,
          token: authData.token,
        }),
      );
      console.log("PROTOCOL_SECURED: Session_Active:", authData);
    } catch (error) {
      console.error("AUTH_FAILURE:", error);
      disconnect(); // Safety: disconnect if auth fails
    }
  }, [address, signMessageAsync, disconnect]);

  const logout = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return { login, logout, isConnected };
};
