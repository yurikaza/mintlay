import { Request, Response } from "express";
import { verifyMessage } from "viem";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { v4 as uuidv4 } from "uuid";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "SYSTEM_RECOVERY_KEY_000";

export const getNonce = async (req: Request, res: Response) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "ADDRESS_REQUIRED_FOR_PROTOCOL" });
  }

  try {
    const nonce = uuidv4(); // Generate a random unique ID

    // We use findOneAndUpdate with 'upsert: true' so we create the user
    // the first time they ever request a nonce.
    await User.findOneAndUpdate(
      { walletAddress: (address as string).toLowerCase() },
      { $set: { nonce } },
      { upsert: true, new: true },
    );

    return res.status(200).json({ nonce });
  } catch (error) {
    console.error("NONCE_GEN_ERROR:", error);
    return res.status(500).json({ error: "INTERNAL_NONCE_FAILURE" });
  }
};

export const syncWallet = async (req: Request, res: Response) => {
  const { address } = req.body;

  if (!address) return res.status(400).json({ error: "MISSING_ADDRESS" });

  try {
    // 1. Check if user exists, if not, create them (Upsert)
    const result = await User.findOneAndUpdate(
      { walletAddress: address.toLowerCase() },
      {
        $setOnInsert: { username: `ARCHITECT_${address.slice(-4)}` },
        $set: { lastLogin: new Date() },
      },
      { upsert: true, new: true },
    );

    const isNew = !result || result.createdAt === result.lastLogin;

    return res.status(200).json({
      status: "SYNC_COMPLETE",
      user: {
        id: result._id,
        address: result.walletAddress,
        isNew: isNew,
      },
    });
  } catch (error) {
    console.error("DB_SYNC_ERROR:", error);
    res.status(500).json({ error: "INTERNAL_DATABASE_FAILURE" });
  }
};

export const verifySignature = async (req: Request, res: Response) => {
  const { address, signature, message } = req.body;

  // 1. Basic Protocol Validation
  if (!address || !signature || !message) {
    return res.status(400).json({ error: "MISSING_HANDSHAKE_PARAMETERS" });
  }

  try {
    // 2. Locate User in MongoDB
    const user = await User.findOne({ walletAddress: address.toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: "IDENTITY_NOT_FOUND" });
    }

    // 3. Nonce Integrity Check
    // Verify that the message the user signed actually contains the nonce we generated
    if (!message.includes(user.nonce)) {
      return res.status(401).json({ error: "NONCE_MISMATCH_SECURITY_BREACH" });
    }

    // 4. Cryptographic Verification (The Math)
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message: message,
      signature: signature as `0x${string}`,
    });

    if (!isValid) {
      return res.status(401).json({ error: "INVALID_SIGNATURE_PROXIMITY" });
    }

    // 5. Rotate Nonce (Prevent Replay Attacks)
    // Once used, the old nonce is burned and a new one is set for the next login
    user.nonce = uuidv4();
    user.lastLogin = new Date();
    await user.save();

    // 6. Issue Authorization Token (JWT)
    // We embed the plan tier so the Gateway can read it without hitting the DB
    const token = jwt.sign(
      {
        id: user._id,
        address: user.walletAddress,
        plan: user.plan.tier,
      },
      JWT_SECRET,
      { expiresIn: "1Year" },
    );

    // 7. Final Handshake Response
    return res.status(200).json({
      status: "AUTHENTICATED",
      token: token,
      user: {
        username: user.username,
        plan: user.plan.tier,
        status: user.plan.status,
      },
    });
  } catch (error) {
    console.error("AUTH_CRITICAL_FAILURE:", error);
    return res.status(500).json({ error: "INTERNAL_CORE_ERROR" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // Assuming you have a 'req.user' from a middleware that decodes the JWT
    console.log(req);
    jwt.verify(
      req.headers.authorization || "",
      JWT_SECRET,
      async (err, decoded) => {
        if (err) {
          console.error("JWT_VERIFICATION_FAILED:", err);

          res.json({
            error: "INVALID_OR_EXPIRED_TOKEN",
            details: err.message,
          });
        } else {
          console.log("JWT_DECODED_PAYLOAD:", decoded);
          req.user = decoded as { id: string };
          if (!req.user) return res.status(401).json({ error: "UNAUTHORIZED" });
          const user = await User.findById(req.user.id);
          console.log(user);

          if (!user) return res.status(404).json({ error: "NOT_FOUND" });

          res.json({
            user: {
              address: user.walletAddress,
              username: user.username,
              plan: user.plan.tier,
            },
          });
        }
      },
    );
  } catch (err) {
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};
