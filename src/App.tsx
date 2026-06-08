import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount, useConnect, useDisconnect, useSendTransaction, useSignMessage } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { parseEther } from 'viem';
import { Sun } from 'lucide-react';
import { WarpCanvas } from './game/WarpCanvas';

export default function App() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [screen, setScreen] = useState<'title' | 'game' | 'fate_shattered'>('title');
  const [score, setScore] = useState(0);

  const { sendTransaction, isPending: isSendingTx } = useSendTransaction();
  const { signMessage, isPending: isSigning } = useSignMessage();

  const sendGMTransaction = () => {
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      value: parseEther('0'), // Sending 0 ETH with a simple transaction
      data: '0x' // Add some basic caller data in real implementation
    }, {
      onSuccess: (hash) => {
        alert('GM Transaction sent! Hash: ' + hash);
      },
      onError: (err) => {
        alert('Failed to send GM: ' + err.message);
      }
    });
  };

  const recordProphecy = () => {
    const message = `Record Highest Prophecy Score: \nScore: ${score}\nAddress: ${address}\nNonce: ${Math.random().toString(36).substring(7)}`;
    signMessage({ message }, {
      onSuccess: (signature) => {
        alert('Prophecy recorded on-chain! Signature: ' + signature);
      },
      onError: (err) => {
        alert('Failed to sign: ' + err.message);
      }
    });
  };

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    setScreen('fate_shattered');
  };

  return (
    <div className="w-full h-full bg-[#050507] text-[#e0e0e0] font-sans flex flex-col relative overflow-hidden">
      
      {/* Wallet / Navbar */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50">
        <div className="font-serif font-bold text-[#b490fc] tracking-widest text-lg drop-shadow-[0_0_10px_rgba(180,144,252,0.8)]">
          WARP PROPHETS
        </div>
        <div className="flex items-center gap-3">
          {isConnected && (
            <button 
              onClick={sendGMTransaction}
              disabled={isSendingTx}
              className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
            >
              <Sun size={14} className={isSendingTx ? "animate-spin" : ""} />
              {isSendingTx ? "Saying GM..." : "Say GM"}
            </button>
          )}

          {isConnected ? (
            <button 
              onClick={() => disconnect()}
              className="px-4 py-2 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/50 rounded text-sm text-purple-200 transition-all font-mono"
            >
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </button>
          ) : (
            <button 
              onClick={() => connect({ connector: injected() })}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-700 hover:from-purple-500 hover:to-fuchsia-600 text-white rounded text-sm font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all font-mono"
            >
              Connect Prophet
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full h-full">
        
        {/* Ambient background particles for all screens */}
        <div className="absolute inset-0 pointer-events-none -z-10 mix-blend-screen opacity-50 bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.2)_0%,rgba(0,0,0,1)_100%)]"></div>

        <AnimatePresence mode="wait">
          {screen === 'title' && (
            <motion.div
              key="title"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center text-center p-6 z-10"
            >
              <div className="relative mb-8 text-center flex flex-col items-center">
                <div className="absolute w-[300px] h-[300px] bg-purple-600/20 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"></div>
                <h1 className="font-serif font-black text-6xl md:text-8xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-200 via-purple-400 to-indigo-900 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)] mb-2">
                  WARP
                </h1>
                <h1 className="font-serif font-black text-6xl md:text-8xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-200 via-purple-400 to-indigo-900 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  PROPHETS
                </h1>
              </div>
              
              <p className="text-purple-200/80 max-w-md text-sm md:text-base leading-relaxed mb-12 font-mono">
                Glimpse into fractured futures. Manipulate probability. Shape destiny. A mystical battle of visions on the Base network.
              </p>
              
              <button
                onClick={() => setScreen('game')}
                className="h-14 px-12 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_0_30px_rgba(88,28,135,0.8)] hover:brightness-125 active:scale-95 transition-all outline-none font-sans"
              >
                Open The Warp
              </button>
            </motion.div>
          )}

          {screen === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <WarpCanvas onGameOver={handleGameOver} />
            </motion.div>
          )}

          {screen === 'fate_shattered' && (
            <motion.div
              key="fate_shattered"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center p-8 bg-black/80 backdrop-blur-md rounded-2xl border border-purple-900/50 shadow-2xl z-10 w-full max-w-lg"
            >
              <h2 className="font-serif text-4xl text-red-400 mb-2 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]">FATE SHATTERED</h2>
              <p className="text-purple-300 font-mono mb-8">The timestream collapses, but your visions echo in eternity.</p>
              
              <div className="text-6xl font-bold font-mono text-fuchsia-300 mb-10 drop-shadow-[0_0_20px_rgba(217,70,239,0.5)]">
                {score}
              </div>

              <div className="flex flex-col gap-4 w-full">
                {isConnected ? (
                  <button
                    onClick={recordProphecy}
                    disabled={isSigning}
                    className="w-full py-4 rounded bg-gradient-to-r from-fuchsia-700 to-purple-800 text-white font-bold font-mono shadow-[0_0_20px_rgba(192,38,211,0.4)] hover:brightness-110 active:scale-95 transition-all outline-none"
                  >
                    {isSigning ? "Signing..." : "Record This Prophecy on-chain"}
                  </button>
                ) : (
                  <button 
                    onClick={() => connect({ connector: injected() })}
                    className="w-full py-4 rounded border border-purple-500/50 bg-black/50 text-purple-300 font-mono hover:bg-purple-900/30 transition-all font-bold"
                  >
                    Connect Wallet to Record Prophecy
                  </button>
                )}

                <button
                  onClick={() => setScreen('title')}
                  className="w-full py-4 rounded bg-transparent text-purple-400 font-mono border border-purple-800/50 hover:bg-purple-900/20 active:scale-95 transition-all outline-none"
                >
                  Return to Sanctum
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
