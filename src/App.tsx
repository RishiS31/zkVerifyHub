import React from 'react';
import { createConfig, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletConnect } from './components/WalletConnect';
import { ProofSubmission } from './components/ProofSubmission';
import { Shield, Blocks } from 'lucide-react';
import { arbitrum } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { http } from 'viem';

const config = createConfig({
  chains: [arbitrum],
  connectors: [injected()],
  transports: {
    [arbitrum.id]: http()
  }
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
          <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-lg border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center">
                  <Blocks className="w-8 h-8 text-blue-500 animate-pulse" />
                  <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                    zkVerify DApp
                  </span>
                </div>
                <WalletConnect />
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text animate-gradient">
                Zero-Knowledge Proof Verification
              </h1>
              <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
                Secure and private verification on Arbitrum using ZK-SNARKs
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start max-w-7xl mx-auto">
              <div className="space-y-6 text-gray-300 p-6 bg-black/20 backdrop-blur-lg rounded-xl border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 transform hover:scale-105 transition-transform">
                    <div className="bg-blue-500/10 p-3 rounded-lg">
                      <Shield className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Privacy-First Verification</h3>
                      <p className="text-gray-400">Verify your credentials without revealing sensitive information using zero-knowledge proofs.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 transform hover:scale-105 transition-transform">
                    <div className="bg-purple-500/10 p-3 rounded-lg">
                      <Blocks className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Arbitrum Powered</h3>
                      <p className="text-gray-400">Leverage the speed and cost-effectiveness of Arbitrum for secure blockchain verification.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <ProofSubmission />
              </div>
            </div>
          </main>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;