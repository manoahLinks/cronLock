import React, { useState } from 'react';
import { Lock, Unlock, CreditCard, Check, AlertCircle, Currency } from 'lucide-react';

export default function LockerPayment() {
  const [deviceId, setDeviceId] = useState('locker_001');
  const [status, setStatus] = useState('idle'); // idle, requesting, paying, unlocking, success, error
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 5,
    currency: 'USDC.e',
    network: 'Cronos_testnet'
  });
  const [error, setError] = useState('');
  
  const SERVER_URL = 'https://cron-lock.vercel.app';

  const requestUnlock = async () => {
    setStatus('requesting');
    setError('');
    
    try {
      const response = await fetch(`${SERVER_URL}/api/devices/${deviceId}/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      const data = await response.json();
      
      if (response.status === 402) {
        // Payment required
        setPaymentDetails(data.payment);
        setStatus('paying');
      } else if (response.ok) {
        // Already unlocked
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setError(data.error || 'Failed to request unlock');
        setStatus('error');
      }
    } catch (err) {
      setError('Network error. Check server connection.');
      setStatus('error');
    }
  };

  const processPayment = async () => {
    setStatus('unlocking');
    
    // Simulate payment (in production, use Web3 wallet)
    const mockPaymentProof = '0x' + Math.random().toString(16).slice(2, 66);
    
    try {
      const response = await fetch(`${SERVER_URL}/api/devices/${deviceId}/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          paymentProof: mockPaymentProof
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          setStatus('idle');
          // setPaymentDetails(null);
        }, 5000);
      } else {
        setError(data.error || 'Payment verification failed');
        setStatus('error');
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            {status === 'success' ? (
              <Unlock className="w-8 h-8 text-green-600" />
            ) : (
              <Lock className="w-8 h-8 text-indigo-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Smart Locker</h1>
          <p className="text-gray-600">Pay-per-use with crypto</p>
        </div>

        {/* Locker Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Locker
          </label>
          <select
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={status !== 'idle'}
          >
            <option value="locker_001">Locker #1</option>
            <option value="locker_002">Locker #2</option>
            <option value="locker_003">Locker #3</option>
          </select>
        </div>

        {/* Status Display */}
        {status === 'idle' && (
          <button
            onClick={requestUnlock}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Unlock className="w-5 h-5" />
            Request Unlock
          </button>
        )}

        {status === 'requesting' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking availability...</p>
          </div>
        )}

        {status === 'paying' && paymentDetails && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-1">Payment Required</h3>
                  <p className="text-sm text-yellow-800">
                    Amount: <span className="font-bold">{paymentDetails.amount} {paymentDetails.currency}</span>
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Network: {paymentDetails.network}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={processPayment}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Pay {paymentDetails.amount} {paymentDetails.currency}
            </button>

            <p className="text-xs text-gray-500 text-center">
              In production, this will connect to your wallet
            </p>
          </div>
        )}

        {status === 'unlocking' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying payment...</p>
            <p className="text-sm text-gray-500 mt-2">Sending unlock command</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-600 mb-2">Unlocked!</h3>
            <p className="text-gray-600">Your locker is now open</p>
            <p className="text-sm text-gray-500 mt-2">Auto-locks in 30 seconds</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setStatus('idle');
                setError('');
                // setPaymentDetails(null);
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Price per hour</span>
            <span className="font-semibold text-gray-800">0.05 USDC</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-500">Network</span>
            <span className="font-semibold text-gray-800">Base</span>
          </div>
        </div>
      </div>
    </div>
  );
}