import React, { useState } from 'react';
import { useAccount, useSignMessage, useSendTransaction } from 'wagmi';
import { withERC8021Attribution } from '../lib/erc8021';
import { stringToHex, Hex } from 'viem';

import { base } from 'wagmi/chains';

export const ScoreSubmitter = ({ score }: { score: number }) => {
  const { isConnected, address, chain } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { sendTransactionAsync } = useSendTransaction();
  const [status, setStatus] = useState<string>('');

  const submitScore = async () => {
    if (!isConnected) {
      setStatus('Please connect wallet first.');
      return;
    }
    try {
      setStatus('Prompting signature...');
      // SIWE-like score submission
      const message = `I, Prophet ${address}, have reached an Enlightenment Score of ${score} on Prophets.\n\nSign this message to record your ascension.`;
      
      const signature = await signMessageAsync({ account: address as "0x${string}", message });
      console.log('Signature:', signature);

      // In a real app we would send this signature to our backend to verify and record.
      setStatus('Score successfully recorded to the heavens!');
    } catch (e: any) {
      console.error(e);
      setStatus(`Failed: ${e.message}`);
    }
  };

  const sayGM = async () => {
    if (!isConnected) {
      setStatus('Please connect wallet first.');
      return;
    }
    try {
      setStatus(chain?.id !== base.id ? 'Please switch to Base Mainnet in your wallet.' : 'Sending GM transaction...');
      // A simple burn transaction to self with data appended using ERC-8021
      const defaultData: Hex = stringToHex('GM Prophets!');
      const dataWithAttribution = withERC8021Attribution(defaultData);
      
      const hash = await sendTransactionAsync({
        to: address, // Send to self as a simple on-chain action
        value: 0n,
        data: dataWithAttribution,
        chainId: base.id, // Enforce Base chain
      });
      console.log('Tx hash:', hash);
      setStatus('GM sent successfully on Base!');
    } catch(e: any) {
      console.error(e);
      setStatus(`Failed: ${e.message}`);
    }
  };

  if (!isConnected) return <p className="text-sm opacity-50 text-center">Connect wallet to submit scores.</p>;

  return (
    <div className="flex flex-col items-center gap-4 mt-6 w-full">
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button onClick={submitScore} className="w-full sm:flex-1 h-12 px-6 bg-gradient-to-r from-yellow-600 to-amber-700 border border-yellow-500 text-black font-bold uppercase tracking-[0.1em] rounded-md shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:brightness-110 transition-all text-xs">
          Record Prophecy
        </button>
        <button onClick={sayGM} className="w-full sm:flex-1 h-12 px-6 bg-blue-600/20 border border-blue-500/50 text-blue-300 text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-blue-600/30 transition-all">
          Say GM (On-Chain)
        </button>
      </div>
      {status && <p className="text-xs text-yellow-500 text-center font-mono mt-2">{status}</p>}
    </div>
  );
};
