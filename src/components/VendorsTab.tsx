import React, { useState } from 'react';
import { EventPlan, VendorItem } from '../types/event';
import {
  Users,
  Plus,
  Trash2,
  Mail,
  Phone,
  FileCheck,
  Sparkles,
  Star,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';
import { VendorInquiryModal } from './VendorInquiryModal';

interface VendorsTabProps {
  plan: EventPlan;
  onUpdatePlan: (updated: EventPlan) => void;
}

export const VendorsTab: React.FC<VendorsTabProps> = ({ plan, onUpdatePlan }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeVendorForInquiry, setActiveVendorForInquiry] = useState<VendorItem | null>(null);

  // Add Vendor Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [vName, setVName] = useState('');
  const [vCategory, setVCategory] = useState('Venue');
  const [vContactPerson, setVContactPerson] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vAmount, setVAmount] = useState('');
  const [vStatus, setVStatus] = useState<VendorItem['status']>('researching');
  const [vNotes, setVNotes] = useState('');

  const currency = plan.budget.currency || 'USD';

  const categories = [
    'Venue',
    'Catering',
    'Florist',
    'Photography',
    'Entertainment',
    'Bakery',
    'Decor',
    'Infrastructure',
    'Permits',
    'Other',
  ];

  const filteredVendors = selectedStatus === 'all'
    ? plan.vendors
    : plan.vendors.filter((v) => v.status === selectedStatus);

  const toggleContractSigned = (id: string) => {
    onUpdatePlan({
      ...plan,
      vendors: plan.vendors.map((v) =>
        v.id === id ? { ...v, contractSigned: !v.contractSigned } : v
      ),
    });
  };

  const updateVendorStatus = (id: string, newStatus: VendorItem['status']) => {
    onUpdatePlan({
      ...plan,
      vendors: plan.vendors.map((v) =>
        v.id === id ? { ...v, status: newStatus } : v
      ),
    });
  };

  const deleteVendor = (id: string) => {
    onUpdatePlan({
      ...plan,
      vendors: plan.vendors.filter((v) => v.id !== id),
    });
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName.trim()) return;

    const newVendor: VendorItem = {
      id: `v-${Date.now()}`,
      name: vName.trim(),
      category: vCategory,
      contactPerson: vContactPerson.trim(),
      contactEmail: vEmail.trim(),
      contactPhone: vPhone.trim(),
      quotedAmount: Number(vAmount) || 0,
      status: vStatus,
      rating: 5,
      contractSigned: vStatus === 'booked',
      notes: vNotes.trim(),
    };

    onUpdatePlan({
      ...plan,
      vendors: [...plan.vendors, newVendor],
    });

    setVName('');
    setVContactPerson('');
    setVEmail('');
    setVPhone('');
    setVAmount('');
    setVNotes('');
    setShowAddModal(false);
  };

  const bookedCount = plan.vendors.filter((v) => v.status === 'booked').length;
  const totalQuoted = plan.vendors.reduce((sum, v) => sum + (Number(v.quotedAmount) || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Actions */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 font-display">
            Vendor Directory & Procurement Tracker
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage quotes, contract states, direct contact lines, and generate AI inquiry drafts
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs">
            {['all', 'booked', 'proposal_received', 'contacted', 'researching'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer capitalize whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vendor</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center justify-between">
          <span className="text-stone-500 font-medium">Secured Vendors:</span>
          <span className="font-bold font-mono text-stone-900 text-sm">
            {bookedCount} / {plan.vendors.length} booked
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center justify-between">
          <span className="text-stone-500 font-medium">Total Quoted Commitments:</span>
          <span className="font-bold font-mono text-stone-900 text-sm">
            {currency} {totalQuoted.toLocaleString()}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center justify-between">
          <span className="text-stone-500 font-medium">Contracts Signed:</span>
          <span className="font-bold font-mono text-stone-900 text-sm">
            {plan.vendors.filter((v) => v.contractSigned).length} signed
          </span>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white p-5 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header: Category · Status */}
              <div className="flex items-center justify-between text-2xs mb-1.5">
                <div className="text-stone-500 font-medium uppercase tracking-wider">
                  {vendor.category}
                </div>

                <select
                  value={vendor.status}
                  onChange={(e: any) => updateVendorStatus(vendor.id, e.target.value)}
                  className={`text-2xs font-semibold px-2 py-0.5 rounded border cursor-pointer capitalize ${
                    vendor.status === 'booked'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : vendor.status === 'proposal_received'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  <option value="researching">Researching</option>
                  <option value="contacted">Contacted</option>
                  <option value="proposal_received">Proposal Received</option>
                  <option value="booked">Booked</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              {/* Vendor Title */}
              <h3 className="text-base font-bold text-stone-900 font-display">
                {vendor.name}
              </h3>

              {/* Quoted Price */}
              <div className="mt-1 font-mono tabular-nums text-sm font-semibold text-stone-800">
                {currency} {vendor.quotedAmount.toLocaleString()}
              </div>

              {/* Contact Info */}
              <div className="mt-3 space-y-1 text-xs text-stone-600">
                {vendor.contactPerson && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-400">Lead:</span>
                    <span>{vendor.contactPerson}</span>
                  </div>
                )}
                {vendor.contactEmail && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                    <a href={`mailto:${vendor.contactEmail}`} className="hover:underline text-stone-700 truncate">
                      {vendor.contactEmail}
                    </a>
                  </div>
                )}
                {vendor.contactPhone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                    <span>{vendor.contactPhone}</span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {vendor.notes && (
                <p className="mt-3 text-xs text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-100 leading-relaxed">
                  {vendor.notes}
                </p>
              )}
            </div>

            {/* Bottom Actions: Contract Toggle & AI Inquiry Generator */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={vendor.contractSigned}
                  onChange={() => toggleContractSigned(vendor.id)}
                  className="rounded text-stone-900 focus:ring-0 cursor-pointer"
                />
                <span className={`text-2xs font-medium ${vendor.contractSigned ? 'text-stone-900 font-semibold' : 'text-stone-500'}`}>
                  {vendor.contractSigned ? 'Contract Signed ✓' : 'Contract Pending'}
                </span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveVendorForInquiry(vendor)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-2xs font-semibold text-stone-800 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Draft AI Inquiry</span>
                </button>

                <button
                  onClick={() => deleteVendor(vendor.id)}
                  title="Remove vendor"
                  className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}

        {filteredVendors.length === 0 && (
          <div className="col-span-full py-12 text-center text-stone-400 border border-dashed border-stone-200 rounded-xl bg-white">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">No vendors matching this filter state.</p>
          </div>
        )}
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-stone-200 text-xs">
            <h3 className="text-base font-bold text-stone-900 font-display mb-3">
              Add Vendor to Directory
            </h3>
            <form onSubmit={handleAddVendor} className="space-y-4">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Company / Vendor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wildflower & Twig Florals"
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={vCategory}
                    onChange={(e) => setVCategory(e.target.value)}
                    className="w-full px-2.5 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Status</label>
                  <select
                    value={vStatus}
                    onChange={(e: any) => setVStatus(e.target.value)}
                    className="w-full px-2.5 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="researching">Researching</option>
                    <option value="contacted">Contacted</option>
                    <option value="proposal_received">Proposal Received</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Chef Marcus"
                    value={vContactPerson}
                    onChange={(e) => setVContactPerson(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Quoted Cost ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={vAmount}
                    onChange={(e) => setVAmount(e.target.value)}
                    className="w-full font-mono tabular-nums px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="events@vendor.com"
                    value={vEmail}
                    onChange={(e) => setVEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={vPhone}
                    onChange={(e) => setVPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Notes / Deliverables</label>
                <input
                  type="text"
                  placeholder="e.g. Contract signed, tasting scheduled for Nov 2nd"
                  value={vNotes}
                  onChange={(e) => setVNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Vendor AI Inquiry Modal */}
      {activeVendorForInquiry && (
        <VendorInquiryModal
          vendor={activeVendorForInquiry}
          plan={plan}
          onClose={() => setActiveVendorForInquiry(null)}
        />
      )}

    </div>
  );
};
