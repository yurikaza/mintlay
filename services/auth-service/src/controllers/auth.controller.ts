import { Request, Response } from "express";
import { verifyMessage } from "viem";

export const verifyHandshake = async (req: Request, res: Response) => {
  const { address, signature, message } = req.body;

  try {
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message: message,
      signature: signature as `0x${string}`,
    });

    if (isValid) {
      // Generate a JWT or Session Token here
      return res.status(200).json({ status: "AUTHENTICATED", token: "..." });
    }

    res.status(401).json({ error: "INVALID_SIGNATURE" });
  } catch (error) {
    res.status(500).json({ error: "INTERNAL_PROTOCOL_ERROR" });
  }
};
