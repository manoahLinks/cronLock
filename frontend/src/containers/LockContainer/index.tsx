import { useState, useEffect } from 'react';
import { Lock, Unlock, CreditCard, Check, AlertCircle, Loader2, Clock, Wallet } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { useX402Flow } from '../../hooks/useX402Flow';

export interface LockContainerProps {
  apiBase: string;
}

interface Device {
  id: string;
  name: string;
  isActive: boolean;
}


export default function LockerPayment(props: LockContainerProps) {
  const [deviceId, setDeviceId] = useState('locker_001');
  const [countdown, setCountdown] = useState(60);
  
  const SERVER_URL = 'https://cron-lock.vercel.app';

  let flowError = null;
  
  // Fetch available devices
  const { data: devices } = useFetch<Device[]>(`${SERVER_URL}/api/devices`);

  // const {data: device} = useFetch(`${SERVER_URL}/api/devices/${deviceId}`);
  
  // X402 payment flow - THIS IS THE SOURCE OF TRUTH
  const { 
    status: flowStatus,      // ← Display this directly
    data: unlockData, 
    paymentId,               // ← Show when this exists
    fetchSecret,             // ← Initial unlock request
    retryWithPaymentId,      // ← Call when paymentId is ready
    // error: flowError 
  } = useX402Flow({
    apiBase: props.apiBase,
  });

  // Simple derived states
  const isIdle = !flowStatus && !paymentId && !unlockData ;
  const isLoading = flowStatus === 'loading';
  const needsPayment = flowStatus === 'payment-required' && !paymentId;
  const hasPaymentId = !!paymentId;
  const isSuccess = !!unlockData;
  const hasError = !!flowError;

  // Auto-lock countdown after success
  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.reload();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCountdown(30);
    }
  }, [isSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isSuccess ? 'bg-green-100' :
            hasError ? 'bg-red-100' :
            hasPaymentId ? 'bg-blue-100' :
            needsPayment ? 'bg-yellow-100' :
            'bg-indigo-100'
          }`}>
            {isSuccess ? (
              <Unlock className="w-8 h-8 text-green-600" />
            ) : hasError ? (
              <AlertCircle className="w-8 h-8 text-red-600" />
            ) : hasPaymentId ? (
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            ) : needsPayment ? (
              <Wallet className="w-8 h-8 text-yellow-600" />
            ) : isLoading ? (
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            ) : (
              <Lock className="w-8 h-8 text-indigo-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">CronLock</h1>
          <p className="text-gray-600">
            Pay-per-use with crypto <span className="text-green-600 font-bold">x402</span>
          </p>
        </div>

        {/* LIVE STATUS DISPLAY - Shows flowStatus directly */}
        {flowStatus && (
          <div className="mb-4 bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-indigo-900">
                Current Status: <span className="font-mono">{flowStatus}</span>
              </span>
            </div>
          </div>
        )}

        {/* PAYMENT ID DISPLAY - Shows when paymentId exists */}
        {paymentId && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700 mb-1 font-semibold"> Payment ID Ready</p>
            <p className="text-xs text-blue-900 font-mono break-all">{paymentId}</p>
          </div>
        )}

        {/* ERROR DISPLAY */}
        {flowError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-red-700 font-semibold mb-1">Error</p>
                <p className="text-xs text-red-900">{flowError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Locker Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Locker
          </label>
          <select
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={!isIdle}
          >
            {devices && devices?.map((device: any) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.description}
              </option>
            ))}
          </select>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-3">
          {/* Button 1: Initial Unlock Request */}
          {isIdle && (
            <button
              onClick={() => fetchSecret()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Unlock className="w-5 h-5" />
              Request Unlock (Fetch Secret)
            </button>
          )}

          {/* Button 2: Retry with Payment ID */}
          {paymentId && (
            <button
              disabled
              onClick={() => retryWithPaymentId()}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Retry with Payment ID
            </button>
          )}

          {/* Loading State */}
          {isLoading && !paymentId && (
            <div className="text-center py-4">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Processing request...</p>
            </div>
          )}

          {/* Payment Required (402) */}
          {needsPayment && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">Payment Required</h3>
                  <p className="text-sm text-yellow-800">Amount: <span className="font-bold">5 USDC.e</span></p>
                  <p className="text-xs text-yellow-700 mt-1">Network: Cronos Testnet</p>
                  <p className="text-xs text-yellow-600 mt-2">
                    Sign the transaction in MetaMask to get a Payment ID
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {isSuccess && (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-600 mb-2">🎉 Unlocked!</h3>
              <p className="text-gray-600 mb-4">Your locker is now open</p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 inline-block">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">Auto-lock in <span className="font-bold text-lg">{countdown}s</span></span>
                </div>
              </div>

              {unlockData && (
                <details className="mt-4 text-left">
                  <summary className="text-xs text-gray-600 cursor-pointer">Show response data</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(unlockData, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Error State - Retry */}
          {hasError && (
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Price per hour</span>
            <span className="font-semibold text-gray-800">1 USDC.e</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-500">Network</span>
            <span className="font-semibold text-gray-800">Cronos Testnet</span>
          </div>

          {/* Debug State Summary */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <details className="text-xs">
              <summary className="text-gray-500 cursor-pointer hover:text-gray-700">
                Debug Info
              </summary>
              <div className="mt-2 space-y-1 bg-gray-50 p-2 rounded">
                <p><span className="font-semibold">flowStatus:</span> {flowStatus || 'null'}</p>
                <p><span className="font-semibold">paymentId:</span> {paymentId ? 'Yes ✓' : 'No'}</p>
                <p><span className="font-semibold">unlockData:</span> {unlockData ? 'Yes ✓' : 'No'}</p>
                <p><span className="font-semibold">flowError:</span> {flowError || 'None'}</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}