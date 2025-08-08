"use client";
import Link from "next/link";
import styles from "./styles/styles.module.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
function HomePage() {
  const [isMetamaskInstalled, setMetamaskInstalled] = useState(false);

  useEffect(() => {
    setMetamaskInstalled(!!window.ethereum);
  }, []);

  async function handleMetamaskLogin() {
    try {
      if (!isMetamaskInstalled) {
        alert("Install MetaMask");
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log("Connected wallet address:", address);

      // Step 1: Request nonce from server
      const response = await fetch("/api/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Server error:", error);
        return;
      }

      const { message: nonce } = await response.json();
      console.log("Nonce from server:", nonce);

      // Step 2: Sign nonce
      const signedMessage = await signer.signMessage(nonce);

      // Step 3: Send signed message to server for verification
      const authResponse = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signedMessage, nonce, address }),
      });

      const tokenData = await authResponse.json();
      console.log(tokenData);

      if (authResponse.ok) {
        // Step 4: Store token in localStorage with address as key
        localStorage.setItem(address, tokenData.token);
       window.location.href = "/protected-route";
      } else {
        alert(tokenData.message || "Authentication failed");
      }

    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to login with MetaMask");
    }
  }

  return (
    <div className={styles.container}>
      <h1>Haii from MetaMask</h1>
      <div>
        <button className={styles.btn} onClick={handleMetamaskLogin}>
          Login Via MetaMask
        </button>
        <br /><br />
      </div>
      <Link href="signup">
        <button className={styles.btn}>Signup button</button>
      </Link>
    </div>
  );
}

export default HomePage;
