import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [phantomPresent, setPhantomPresent] = useState<boolean>(false);

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
    window.addEventListener('solana#initialized', checkIfPhantomIsInstalled, {
      once: true,
    });

    return () => {
      window.removeEventListener('solana#initialized', checkIfPhantomIsInstalled);
    };
  }, []);

  return (
    <div>
      {phantomPresent ? (
        <p>Phantom wallet is installed.</p>
      ) : (
        <p>Phantom wallet is not installed.</p>
      )}
    </div>
  );
};

export default App;
