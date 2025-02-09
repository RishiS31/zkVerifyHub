import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useChainId, useSwitchChain } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Wallet, LogOut, AlertTriangle, Loader2 } from 'lucide-react';
import { arbitrum } from 'wagmi/chains';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [isHovered, setIsHovered] = useState(false);

  const isWrongNetwork = chainId !== arbitrum.id;

  const handleConnect = async () => {
    try {
      await connect({ connector: injected() });
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: arbitrum.id });
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {isWrongNetwork && (
          <button
            onClick={handleSwitchNetwork}
            disabled={isSwitching}
            className="flex items-center px-4 py-2 space-x-2 text-yellow-400 bg-yellow-900/20 rounded-lg hover:bg-yellow-900/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {isSwitching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span className="whitespace-nowrap">Switch to Arbitrum</span>
          </button>
        )}
        <button
          onClick={() => disconnect()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex items-center px-4 py-2 space-x-2 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">
            {isHovered ? 'Disconnect' : `${address.slice(0, 6)}...${address.slice(-4)}`}
          </span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center px-4 py-2 space-x-2 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] justify-center"
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Wallet className="w-5 h-5" />
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  );
}