import React, { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { getProphetReputation, ProphetReputation } from '../lib/erc8004';

export const NavBar = () => {
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  const [rep, setRep] = useState<ProphetReputation | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      getProphetReputation(address).then(setRep);
    }
  }, [isConnected, address]);

  // Use the first injected connector (e.g. MetaMask / Coinbase Wallet)
  const connector = connectors[0];

  return (
    <header className="h-20 w-full border-b border-yellow-900/30 bg-[#0a0a0c] flex items-center justify-between px-4 sm:px-8 z-50 relative">
      <div className="font-serif font-black text-xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">
        PROPHETS
      </div>
      
      <div className="flex items-center space-x-4">
        {isConnected ? (
          <div className="flex items-center gap-3">
            {rep && (
              <div className="hidden sm:flex flex-col items-end text-[10px] text-slate-300">
                <span className="text-[10px] text-gray-500">PROPHET STATUS</span>
                <span className="text-sm text-yellow-500 font-serif">{rep.rank}</span>
              </div>
            )}
            <div className="flex flex-col items-end ml-4">
               <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-gray-300">
                 {address?.slice(0,6)}...{address?.slice(-4)}
               </div>
               <button onClick={() => disconnect()} className="text-[10px] text-red-500/70 hover:text-red-400 mt-1 uppercase tracking-widest">
                 Disconnect
               </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => { if (connector) connect({ connector }) }}
            disabled={!connector}
            className="px-6 py-2 bg-gradient-to-r from-yellow-900 to-amber-900 border border-yellow-700/50 hover:bg-yellow-800 text-yellow-100 rounded text-xs uppercase tracking-widest font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
