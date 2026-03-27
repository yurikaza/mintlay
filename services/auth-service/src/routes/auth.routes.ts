import { Router } from "express";
import {
  getMe,
  getNonce,
  syncWallet,
  verifySignature,
} from "../controllers/auth.controller";

const router = Router();

/**
 * PROTOCOL: Public Handshake
 * GET /nonce?address=0x...
 * Generates a unique challenge for the wallet to sign.
 */
router.get("/nonce", getNonce);
router.get("/me", getMe); // Add this route to fetch user data based on JWT session

/**
 * PROTOCOL: Secure Verification
 * POST /verify
 * Verifies the signature and issues a JWT session.
 */
router.post("/verify", verifySignature);
router.post("/sync", syncWallet);

/**
 * PROTOCOL: Identity Sync
 * POST /sync
 * Silently records the user in MongoDB upon connection.
 */
// router.post('/sync', syncWallet); // Add this once you import your sync controller

export default router;
