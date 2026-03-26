import { useAccount, useSignMessage, useChainId } from "wagmi";
import { SiweMessage } from "siwe";
import api from "../api"; // Your axios instance

export function useSiwe() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  const login = async () => {
    try {
      // 1. Get nonce from Auth Service
      const { data: nonce } = await api.get("/auth/nonce");

      // 2. Create SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to MintLay Web Editor",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // 3. Verify on Backend
      await api.post("/auth/verify", {
        message,
        signature,
      });

      console.log("Successfully logged into MintLay!");
    } catch (error) {
      console.error("SIWE Login failed:", error);
    }
  };

  return { login };
}
