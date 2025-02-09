import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Shield, ShieldCheck, ShieldX, Loader2, UserCheck, CreditCard, Calendar, ArrowLeft } from 'lucide-react';
import { useZkVerify, VerificationType } from '../hooks/useZkVerify';

interface VerificationOption {
  type: VerificationType;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const verificationOptions: VerificationOption[] = [
  {
    type: VerificationType.KYC,
    title: "KYC Verification",
    description: "Verify your identity without revealing personal information",
    icon: <UserCheck className="w-6 h-6 text-blue-500" />,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    type: VerificationType.CREDIT_SCORE,
    title: "Credit Score Verification",
    description: "Prove your credit worthiness while maintaining privacy",
    icon: <CreditCard className="w-6 h-6 text-green-500" />,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    type: VerificationType.AGE_VERIFICATION,
    title: "Age Verification",
    description: "Verify your age eligibility privately",
    icon: <Calendar className="w-6 h-6 text-purple-500" />,
    gradient: "from-purple-500 to-pink-500"
  }
];

export function ProofSubmission() {
  const { isConnected } = useAccount();
  const [selectedType, setSelectedType] = useState<VerificationType | null>(null);
  const [proofData, setProofData] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const {
    verifyProof,
    verificationStatus,
    isVerified,
    verificationTimestamp,
    isTransactionPending
  } = useZkVerify(selectedType || VerificationType.KYC);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isTyping) {
      timeout = setTimeout(() => setIsTyping(false), 1000);
    }
    return () => clearTimeout(timeout);
  }, [isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofData || selectedType === null) return;

    try {
      await verifyProof(proofData);
    } catch (error) {
      console.error('Error submitting proof:', error);
    }
  };

  const handleProofDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProofData(e.target.value);
    setIsTyping(true);
  };

  const isLoading = verificationStatus === 'verifying' || isTransactionPending;

  if (!isConnected) {
    return (
      <div className="w-full max-w-md p-8 bg-black/20 backdrop-blur-lg rounded-xl border border-gray-800 transform hover:scale-105 transition-all duration-300">
        <Shield className="w-16 h-16 mx-auto text-gray-600 mb-4 animate-pulse" />
        <p className="text-gray-400 text-center">Connect your wallet to submit proofs</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl p-6 md:p-8 bg-black/20 backdrop-blur-lg rounded-xl border border-gray-800 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-white">Zero-Knowledge Verification</h2>
      
      {!selectedType ? (
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Select Verification Type</h3>
          {verificationOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => setSelectedType(option.type)}
              className={`flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-300 transform hover:scale-102 hover:shadow-glow group`}
            >
              <div className={`flex-shrink-0 p-3 rounded-lg bg-gradient-to-br ${option.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}>
                {option.icon}
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {option.title}
                </h4>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {option.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {verificationOptions[selectedType].title}
            </h3>
            <button
              type="button"
              onClick={() => setSelectedType(null)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              <span>Change Type</span>
            </button>
          </div>
          
          <div className="relative">
            <label htmlFor="proof" className="block text-sm font-medium text-gray-300 mb-2">
              Proof Data
            </label>
            <textarea
              id="proof"
              value={proofData}
              onChange={handleProofDataChange}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-300 placeholder-gray-500 form-input-focus"
              rows={4}
              placeholder="Enter your ZK-SNARK proof data in JSON format..."
            />
            <div className={`absolute bottom-2 right-2 transition-opacity duration-300 ${isTyping ? 'opacity-100' : 'opacity-0'}`}>
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Format: {"{ \"a\": [1, 2], \"b\": [[3, 4], [5, 6]], \"c\": [7, 8], \"input\": [1] }"}
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !proofData}
            className="w-full flex items-center justify-center px-6 py-3 rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-102 button-hover"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isTransactionPending ? 'Confirming...' : 'Verifying...'}</span>
              </div>
            ) : (
              <span>Submit Proof</span>
            )}
          </button>

          {verificationStatus === 'success' && (
            <div className="mt-6 p-4 bg-green-900/20 border border-green-800 rounded-lg transform hover:scale-102 transition-transform">
              <div className="flex items-center mb-2">
                <ShieldCheck className="w-5 h-5 text-green-500 mr-2 animate-bounce-slow" />
                <span className="text-green-400 font-semibold">Verification Successful!</span>
              </div>
              {verificationTimestamp && (
                <p className="text-gray-400 text-sm">
                  Verified on: {new Date(verificationTimestamp * 1000).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center transform hover:scale-102 transition-transform">
              <ShieldX className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-400">Verification failed. Please try again.</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}