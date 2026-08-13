import React, { useState } from 'react';
import subscriptionService from '../services/subscriptionService';

/**
 * EasyPaisa Payment Modal component.
 * EasyPaisa Receiver Number: 03229240140
 * Account Title: Muhammad Ehtasham
 * Amount: PKR 500 / month
 */
const EasyPaisaPaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('03229240140');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trxId.trim()) {
      setError('Please enter your EasyPaisa Transaction ID (Trx ID)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await subscriptionService.submitEasyPaisaPayment(trxId, senderPhone);
      if (response && response.status === 'success') {
        if (onPaymentSuccess) onPaymentSuccess(response.data);
        onClose();
      } else {
        setError(response?.message || 'Failed to verify transaction. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit payment. Please verify your Trx ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0D1F38] border border-emerald-500/30 rounded-2xl p-6 shadow-2xl shadow-emerald-500/10 text-white">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-lg"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* EasyPaisa Brand Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
            💸
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">EasyPaisa Premium Payment</h3>
            <p className="text-xs text-emerald-400 font-medium">Instant Activation · PKR 500/month</p>
          </div>
        </div>

        {/* EasyPaisa Payment Instructions */}
        <div className="bg-[#050D1A] border border-white/10 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">EasyPaisa Account:</span>
            <span className="font-bold text-white">03229240140</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Account Title:</span>
            <span className="font-semibold text-emerald-400">Muhammad Ehtasham</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Amount Due:</span>
            <span className="font-extrabold text-white text-sm">PKR 500 / month</span>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Copy EasyPaisa Number:</span>
            <button
              type="button"
              onClick={handleCopyNumber}
              className="px-3 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold transition-all"
            >
              {copied ? '✓ Copied!' : '📋 Copy 03229240140'}
            </button>
          </div>
        </div>

        {/* Step Guide */}
        <ol className="text-xs text-slate-300 space-y-1.5 mb-6 list-decimal list-inside bg-white/5 p-3 rounded-lg border border-white/5">
          <li>Open your EasyPaisa app on your mobile phone.</li>
          <li>Send <strong>PKR 500</strong> to <strong>03229240140</strong> (Muhammad Ehtasham).</li>
          <li>Copy the 11-digit <strong>Transaction ID (Trx ID)</strong> from your SMS receipt.</li>
          <li>Paste the Trx ID below and click <strong>Activate Premium</strong>.</li>
        </ol>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              EasyPaisa Transaction ID (Trx ID) *
            </label>
            <input
              type="text"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="e.g. TRX-94827104 or 11283928174"
              className="w-full px-3.5 py-2.5 bg-[#050D1A] border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your EasyPaisa Mobile Number (Optional)
            </label>
            <input
              type="tel"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="e.g. 03001234567"
              className="w-full px-3.5 py-2.5 bg-[#050D1A] border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            {loading ? 'Activating Premium...' : '⚡ Activate Premium Subscription (PKR 500)'}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-500 mt-4">
          Instant 30-day Premium activation · EasyPaisa Account 03229240140
        </p>
      </div>
    </div>
  );
};

export default EasyPaisaPaymentModal;
