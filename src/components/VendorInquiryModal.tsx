import React, { useState } from 'react';
import { VendorItem, EventPlan } from '../types/event';
import { Mail, Copy, Check, Sparkles, RefreshCw, X } from 'lucide-react';

interface VendorInquiryModalProps {
  vendor: VendorItem;
  plan: EventPlan;
  onClose: () => void;
}

export const VendorInquiryModal: React.FC<VendorInquiryModalProps> = ({
  vendor,
  plan,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState(
    `Inquiry: ${vendor.category} services for ${plan.title} on ${plan.date}`
  );
  const [body, setBody] = useState('');
  const [specificNotes, setSpecificNotes] = useState('');

  const generateInquiry = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vendor-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorCategory: vendor.category,
          vendorName: vendor.name,
          eventTitle: plan.title,
          eventDate: plan.date,
          location: plan.location,
          guestCount: plan.guestCount,
          budgetRange: `${plan.budget.currency} ${vendor.quotedAmount || 'Flexible'}`,
          specificRequirements: specificNotes || vendor.notes || 'Package details, availability, and sample portfolio',
        }),
      });
      const data = await res.json();
      if (data.inquiry) {
        setSubject(data.inquiry.subjectLine);
        setBody(data.inquiry.emailBody);
      }
    } catch (err) {
      console.error('Failed to generate vendor inquiry:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    generateInquiry();
  }, []);

  const handleCopy = () => {
    const fullText = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-stone-200 text-xs space-y-4">
        
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900 font-display">
              AI Vendor RFP & Inquiry Generator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-stone-50 rounded-lg text-stone-600 text-2xs space-y-1">
          <div><strong className="text-stone-800">Vendor:</strong> {vendor.name} ({vendor.category})</div>
          <div><strong className="text-stone-800">Event:</strong> {plan.title} · {plan.date} · {plan.guestCount} guests</div>
          <div><strong className="text-stone-800">Target Budget:</strong> {plan.budget.currency} {vendor.quotedAmount}</div>
        </div>

        <div>
          <label className="font-semibold text-stone-700 block mb-1">Subject Line</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 font-medium text-stone-900"
          />
        </div>

        <div>
          <label className="font-semibold text-stone-700 block mb-1">Message Body</label>
          {loading ? (
            <div className="h-44 flex flex-col items-center justify-center border border-stone-200 rounded-lg bg-stone-50 text-stone-500">
              <RefreshCw className="w-5 h-5 animate-spin mb-2 text-amber-600" />
              <span>Drafting customized professional inquiry...</span>
            </div>
          ) : (
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono text-2xs leading-relaxed"
            />
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={generateInquiry}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate Wording</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              disabled={loading || !body}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Message'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
