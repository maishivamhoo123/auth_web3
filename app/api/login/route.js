import { ethers } from "ethers";
import jwt from "jsonwebtoken"; 

const secretKey = process.env.JWT_SECRET || "mySecretKey"; // Use env variable in production!

export async function POST(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method Not Allowed" }), { status: 405 });
  }

  try {
    const { signedMessage, nonce, address } = await req.json();

    if (!signedMessage || !nonce || !address) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    // Recover address from signature
    const recoveredAddress = ethers.utils.verifyMessage(nonce, signedMessage);

    // Compare ignoring case
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return new Response(JSON.stringify({ message: "Invalid Signature" }), { status: 401 });
    }

    // Create JWT token with original address casing
    const token = jwt.sign({ address }, secretKey, { expiresIn: "10m" });

    return new Response(JSON.stringify({
      message: "Authentication successful",
      token,
    }), { status: 200 });

  } catch (err) {
    console.error("Signature verification error:", err);
    return new Response(JSON.stringify({ message: "Server Error" }), { status: 500 });
  }
}
