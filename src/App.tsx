import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount, useConnect, useDisconnect, useSendTransaction, useSignMessage, useSwitchChain } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { parseEther } from 'viem';
import { base } from 'wagmi/chains';
import { Sun, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';
import { WarpCanvas } from './game/WarpCanvas';
import { BASE_DENIM_CONFIG } from './lib/wagmi';

export default function App() {
  const { address, isConnected, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  
  const [screen, setScreen] = useState<'title' | 'game' | 'fate_shattered'>('title');
  const [score, setScore] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { sendTransaction, isPending: isSendingTx } = useSendTransaction();
  const { signMessage, isPending: isSigning } = useSignMessage();

  const isBaseMainnet = chain?.id === base.id;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const sendGMTransaction = () => {
    if (chain && chain.id !== base.id && switchChain) {
      switchChain({ chainId: base.id });
      return;
    }

    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      value: parseEther('0'),
      data: '0x',
      chainId: base.id,
    }, {
      onSuccess: (hash) => {
        showToast(`GM Sent on Base Denim! 200ms confirmation: ${hash.slice(0, 10)}...${hash.slice(-6)}`);
      },
      onError: (err) => {
        showToast(`GM failed: ${err.message}`);
      }
    });
  };

  const recordProphecy = () => {
    if (!address) return;
    const message = `Record Highest Prophecy Score [Base Denim 200ms]: \nScore: ${score}\nNetwork: Base Mainnet (${base.id})\nAddress: ${address}\nNonce: ${Math.random().toString(36).substring(7)}`;
    signMessage({ account: address as `0x${string}`, message }, {
      onSuccess: (signature) => {
        showToast(`Prophecy recorded on Base Denim! Signature: ${signature.slice(0, 10)}...`);
      },
      onError: (err) => {
        showToast(`Failed to record: ${err.message}`);
      }
    });
  };

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    setScreen('fate_shattered');
  };

  return (
    <div className="w-full h-full bg-[#050507] text-[#e0e0e0] font-sans flex flex-col relative overflow-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#120f24] border border-fuchsia-500/40 text-purple-200 text-xs font-mono px-4 py-2.5 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center gap-2 backdrop-blur-md max-w-sm"
          >
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet / Navbar */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="font-serif font-bold text-[#b490fc] tracking-widest text-lg drop-shadow-[0_0_10px_rgba(180,144,252,0.8)]">
            WARP PROPHETS
          </div>

          {/* Denim Mainnet Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-500/40 text-[10px] font-mono text-blue-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Base Mainnet</span>
            <span className="text-[9px] px-1 py-0.2 bg-blue-500/20 text-blue-200 rounded font-semibold uppercase">
              Denim 200ms
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isConnected && !isBaseMainnet && (
            <button
              onClick={() => switchChain && switchChain({ chainId: base.id })}
              className="px-2.5 py-1.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-1"
            >
              <AlertTriangle size={12} />
              Switch to Base
            </button>
          )}

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
              className="px-3 py-2 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/50 rounded text-xs text-purple-200 transition-all font-mono"
            >
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </button>
          ) : (
            <button 
              onClick={() => connect({ connector: injected() })}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-700 hover:from-purple-500 hover:to-fuchsia-600 text-white rounded text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all font-mono"
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
              <div className="relative mb-6 text-center flex flex-col items-center">
                <div className="absolute w-[300px] h-[300px] bg-purple-600/20 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"></div>
                <h1 className="font-serif font-black text-6xl md:text-8xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-200 via-purple-400 to-indigo-900 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)] mb-2">
                  WARP
                </h1>
                <h1 className="font-serif font-black text-6xl md:text-8xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-200 via-purple-400 to-indigo-900 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  PROPHETS
                </h1>
              </div>
              
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-400/30 text-blue-300 text-xs font-mono">
                <Zap size={13} className="text-cyan-400 animate-pulse" />
                <span>Base Mainnet Denim Active • 200ms Canonical Blocks</span>
              </div>

              <p className="text-purple-200/80 max-w-md text-sm md:text-base leading-relaxed mb-10 font-mono">
                Glimpse into fractured futures. Manipulate probability. Shape destiny. Real-time vision battles on the Base Denim network.
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
              className="flex flex-col items-center text-center p-8 bg-black/85 backdrop-blur-md rounded-2xl border border-purple-900/50 shadow-2xl z-10 w-full max-w-lg mx-4"
            >
              <h2 className="font-serif text-4xl text-red-400 mb-2 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]">FATE SHATTERED</h2>
              <p className="text-purple-300 font-mono text-sm mb-4">The timestream collapses, but your visions echo in eternity.</p>
              
              <div className="flex items-center gap-1.5 text-xs text-blue-300 font-mono mb-6 bg-blue-950/40 px-3 py-1 rounded-full border border-blue-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Base Denim Mainnet (200ms Settlement)</span>
              </div>

              <div className="text-6xl font-bold font-mono text-fuchsia-300 mb-8 drop-shadow-[0_0_20px_rgba(217,70,239,0.5)]">
                {score}
              </div>

              <div className="flex flex-col gap-3.5 w-full">
                {isConnected ? (
                  <>
                    <button
                      onClick={recordProphecy}
                      disabled={isSigning}
                      className="w-full py-3.5 rounded bg-gradient-to-r from-fuchsia-700 to-purple-800 text-white font-bold font-mono shadow-[0_0_20px_rgba(192,38,211,0.4)] hover:brightness-110 active:scale-95 transition-all outline-none text-sm"
                    >
                      {isSigning ? "Signing..." : "Record This Prophecy on-chain"}
                    </button>

                    <button 
                      onClick={sendGMTransaction}
                      disabled={isSendingTx}
                      className="w-full py-3 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center justify-center gap-2 font-['Cinzel'] text-xs font-bold"
                    >
                      <Sun size={14} className={isSendingTx ? "animate-spin" : ""} />
                      {isSendingTx ? "Saying GM on Base Denim..." : "Say GM (Base Mainnet 200ms)"}
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => connect({ connector: injected() })}
                    className="w-full py-3.5 rounded border border-purple-500/50 bg-black/50 text-purple-300 font-mono hover:bg-purple-900/30 transition-all font-bold text-sm"
                  >
                    Connect Wallet to Record Prophecy
                  </button>
                )}

                <button
                  onClick={() => setScreen('title')}
                  className="w-full py-3 rounded bg-transparent text-purple-400 font-mono border border-purple-800/50 hover:bg-purple-900/20 active:scale-95 transition-all outline-none text-sm"
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
