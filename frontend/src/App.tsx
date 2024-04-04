import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import React, { useState, useEffect } from "react";

const App: React.FC = () => {
  const [phantomPresent, setPhantomPresent] = useState<boolean>(false);
  const [walletBallance, setWalletBalance] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    // Function to check if Phantom is installed
    const checkIfPhantomIsInstalled = () => {
      const { solana } = window as any;

      if (solana && solana.isPhantom) {
        setPhantomPresent(true);
      } else {
        setPhantomPresent(false);
      }
    };

    checkIfPhantomIsInstalled();

    // Optional: Listen for the Phantom extension to be installed while the page is open
    window.addEventListener("solana#initialized", checkIfPhantomIsInstalled, {
      once: true,
    });

    return () => {
      window.removeEventListener("solana#initialized", checkIfPhantomIsInstalled);
    };
  }, []);

  useEffect(() => {
    // Function to check if Phantom is installed
    const getBalance = async () => {
      if (!phantomPresent) {
        setWalletBalance(0);
      } else {
        const connection = new Connection(clusterApiUrl("devnet"));

        // Get the user's public key
        const { solana } = window as any;
        const response = await solana.connect({ onlyIfTrusted: false });
        const publicKey = new PublicKey(response.publicKey.toString());
        setWalletAddress(publicKey.toString())
        // Fetch and set the balance
        const balance = await connection.getBalance(publicKey);
        setWalletBalance(balance / 10 ** 9); // Convert the balance from lamports to SOL
      }
    };

    getBalance();
  }, [phantomPresent, walletAddress]);

  return (
    <div>
      {phantomPresent ? (
        <div>
          <p>Phantom wallet is installed.</p>
          <p>Balance: {walletBallance.toFixed(2)} SOL</p> {/* Display the balance here */}
          <p>Address: {walletAddress}</p>
        </div>
      ) : (
        <p>Phantom wallet is not installed.</p>
      )}
    </div>
  );
};
export default App;
