import crypto from 'crypto';
import connectDB from '../../../utils/connectDB';
import User from '../../../models/shema'; // Make sure path & filename are correct
import { ethers } from 'ethers';

export async function POST(req) {
  try {
    await connectDB();

    const { address } = await req.json();
    console.log("📩 Received address from client:", address);

    if (!address) {
      return new Response(JSON.stringify({ message: "Address is required" }), { status: 400 });
    }

    const stringAddress = address.toString().trim();

    // Validate Ethereum address format
    if (!ethers.utils.isAddress(stringAddress)) {
      return new Response(JSON.stringify({ message: "Invalid Ethereum address" }), { status: 400 });
    }

    // Debug: print all users
    const allUsers = await User.find({});
    console.log("📦 All users in DB:", allUsers);

    // Find user by exact blockchain address (case sensitive)
    const addressExist = await User.findOne({ blockChainAddress: stringAddress });
    console.log("🔍 Matched user from DB:", addressExist);

    if (!addressExist) {
      return new Response(JSON.stringify({ message: "Address not found" }), { status: 400 });
    }

    // Generate nonce and save
    const nonce = crypto.randomBytes(32).toString('hex');
    addressExist.nonce = nonce;
    await addressExist.save();

    console.log("✅ New nonce saved for user:", nonce);

    return new Response(JSON.stringify({ message: nonce }), { status: 200 });

  } catch (err) {
    console.error("❌ Server error:", err);
    return new Response(JSON.stringify({ message: "An error occurred" }), { status: 500 });
  }
}
