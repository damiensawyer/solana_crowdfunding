import React, { useEffect } from 'react';
import './App.css';
import { Connection, clusterApiUrl } from '@solana/web3.js';

const App: React.FC = () => {
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      // Initialize connection
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      
      // Example usage: Fetch recent blockhash
      const { blockhash } = await connection.getRecentBlockhash();
      console.log('Recent blockhash:', blockhash);
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  return (
    <div className="App">
      {
        <p>hello</p>

      }
    </div>
  );
};

export default App;