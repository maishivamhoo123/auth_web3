import { ethers } from "ethers";
import connectDB from "../../../utils/connectDB";
import User from "../../../models/shema";

connectDB();

export async function POST(req) {
    try {
        const { name, email } = await req.json();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ message: "Email already registered" }), {
                status: 400,
            });
        }

        const wallet = ethers.Wallet.createRandom();
        const blockChainAddress = wallet.address;
        const blockchainPrivateKey = wallet.privateKey;

        const newUser = new User({ name, email, blockChainAddress });
        await newUser.save();

        return new Response(JSON.stringify({
            message: "User created successfully",
            address: blockChainAddress,
            privateKey: blockchainPrivateKey  // ✅ Send private key in response
        }), {
            status: 200,
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
        });
    }
}
