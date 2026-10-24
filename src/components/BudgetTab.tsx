import React, { useState } from 'react';
import { EventPlan, BudgetItem } from '../types/event';
import {
  DollarSign,
  Plus,
  Trash2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Edit2,
  RefreshCw,
} from 'lucide-react';

interface BudgetTabProps {
  plan: EventPlan;
  onUpdatePlan: (updated: EventPlan) => void;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({ plan, onUpdatePlan }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

  // Form State
  const [itemName, setItemName] = useState('');
  const [itemCat, setItemCat] = useState('Venue');
  const [itemEst, setItemEst] = useState('');
  const [itemAct, setItemAct] = useState('');
  const [itemStatus, setItemStatus] = useState<'planned' | 'deposit_paid' | 'paid_in_full'>('planned');
  const [itemNotes, setItemNotes] = useState('');

  // AI Optimizer State
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizerResults, setOptimizerResults] = useState<{
    overallHealth: string;
    spentPercentage: number;
    topSavingsOpportunities: string[];
    hiddenCostsToWatch: string[];
    recommendedAdjustments: Array<{ category: string; currentAllocated: number; recommendedAllocated: number; reason: string }>;
  } | null>(null);

  const currency = plan.budget.currency || 'USD';
  const totalBudget = plan.budget.totalBudget;

  const totalEstimated = plan.budget.items.reduce((acc, i) => acc + (Number(i.estimatedCost) || 0), 0);
  const totalActual = plan.budget.items.reduce((acc, i) => acc + (Number(i.actualCost) || 0), 0);
  const variance = totalBudget - totalEstimated;
  const isOverBudget = variance < 0;

  // Categories list
  const categories = ['Venue', 'Catering', 'Florals & Decor', 'Photography & Media', 'Music & Sound', 'Attire & Beauty', 'Stationery & Favors', 'Permits & Municipal', 'Contingency Fund', 'Other'];

  // Handle total budget change
  const handleBudgetChange = (newBudget: number) => {
    onUpdatePlan({
      ...plan,
      budget: {
        ...plan.budget,
        totalBudget: Math.max(0, newBudget),
      },
    });
  };

  const handleCurrencyChange = (newCurr: string) => {
    onUpdatePlan({
      ...plan,
      budget: {
        ...plan.budget,
        currency: newCurr,
      },
    });
  };

  // Add / Edit Item
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    if (editingItem) {
      const updatedItems = plan.budget.items.map((i) =>
        i.id === editingItem.id
          ? {
              ...i,
              name: itemName.trim(),
              category: itemCat,
              estimatedCost: Number(itemEst) || 0,
              actualCost: Number(itemAct) || 0,
              status: itemStatus,
              notes: itemNotes.trim(),
            }
          : i
      );
      onUpdatePlan({
        ...plan,
        budget: { ...plan.budget, items: updatedItems },
      });
      setEditingItem(null);
    } else {
      const newItem: BudgetItem = {
        id: `b-${Date.now()}`,
        name: itemName.trim(),
        category: itemCat,
        estimatedCost: Number(itemEst) || 0,
        actualCost: Number(itemAct) || 0,
        status: itemStatus,
        notes: itemNotes.trim(),
      };
      onUpdatePlan({
        ...plan,
        budget: { ...plan.budget, items: [...plan.budget.items, newItem] },
      });
    }

    resetForm();
  };

  const openEditModal = (item: BudgetItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemCat(item.category);
    setItemEst(item.estimatedCost.toString());
    setItemAct(item.actualCost.toString());
    setItemStatus(item.status);
    setItemNotes(item.notes || '');
    setShowAddModal(true);
  };

  const resetForm = () => {
    setItemName('');
    setItemCat('Venue');
    setItemEst('');
    setItemAct('');
    setItemStatus('planned');
    setItemNotes('');
    setShowAddModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    onUpdatePlan({
      ...plan,
      budget: {
        ...plan.budget,
        items: plan.budget.items.filter((i) => i.id !== id),
      },
    });
  };

  const toggleStatus = (item: BudgetItem) => {
    const nextStatus = item.status === 'planned' ? 'deposit_paid' : item.status === 'deposit_paid' ? 'paid_in_full' : 'planned';
    onUpdatePlan({
      ...plan,
      budget: {
        ...plan.budget,
        items: plan.budget.items.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i)),
      },
    });
  };

  // Run AI Budget Optimizer
  const handleOptimizeBudget = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/optimize-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: plan.budget.items,
          totalBudget: plan.budget.totalBudget,
          currency: plan.budget.currency,
          eventType: plan.type,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setOptimizerResults(data.analysis);
      }
    } catch (err) {
      console.error('Failed to optimize budget:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Controls: Currency & Target Budget */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold text-stone-900 font-display">
            Interactive Budget Allocator
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time financial tracking, expense categorizations, and payment milestones
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Currency selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">Currency:</span>
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-md py-1.5 px-2.5 text-stone-800 text-xs font-medium cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>

          {/* Target budget editor */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">Target Budget:</span>
            <input
              type="number"
              min="0"
              step="500"
              value={totalBudget}
              onChange={(e) => handleBudgetChange(Number(e.target.value))}
              className="w-28 text-xs font-mono tabular-nums px-2.5 py-1.5 border border-stone-300 rounded-md bg-stone-50 font-semibold text-stone-900"
            />
          </div>

          <button
            onClick={handleOptimizeBudget}
            disabled={isOptimizing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer border border-amber-200"
          >
            {isOptimizing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-700" />}
            <span>AI Budget Optimizer</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Financial Health Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Total Cap</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-stone-900">
            {currency} {totalBudget.toLocaleString()}
          </div>
          <div className="mt-2 text-2xs text-stone-500">Planned ceiling limit</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Allocated (Est.)</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-stone-900">
            {currency} {totalEstimated.toLocaleString()}
          </div>
          <div className="mt-2 text-2xs text-stone-500">
            {totalBudget > 0 ? Math.round((totalEstimated / totalBudget) * 100) : 0}% of target
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Actual Paid</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-stone-900">
            {currency} {totalActual.toLocaleString()}
          </div>
          <div className="mt-2 text-2xs text-stone-500">
            Deposits & payments settled
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">
            {isOverBudget ? 'Budget Overrun' : 'Remaining Buffer'}
          </div>
          <div className={`mt-1 text-2xl font-bold font-mono tabular-nums ${isOverBudget ? 'text-red-600' : 'text-emerald-700'}`}>
            {currency} {Math.abs(variance).toLocaleString()}
          </div>
          <div className="mt-2 text-2xs text-stone-500">
            {isOverBudget ? 'Needs category rebalancing' : 'Safe reserve available'}
          </div>
        </div>

      </div>

      {/* AI Budget Optimizer Results Panel */}
      {optimizerResults && (
        <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-stone-900 font-display">
                AI Budget Optimization Analysis
              </h3>
            </div>
            <div className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
              Health: {optimizerResults.overallHealth} ({optimizerResults.spentPercentage}% Allocated)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                Top Savings Opportunities
              </h4>
              <ul className="space-y-2 text-xs text-stone-600">
                {optimizerResults.topSavingsOpportunities?.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                Hidden Costs To Watch
              </h4>
              <ul className="space-y-2 text-xs text-stone-600">
                {optimizerResults.hiddenCostsToWatch?.map((cost, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">!</span>
                    <span>{cost}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {optimizerResults.recommendedAdjustments && optimizerResults.recommendedAdjustments.length > 0 && (
            <div className="pt-3 border-t border-stone-100">
              <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                Target Rebalance Suggestions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {optimizerResults.recommendedAdjustments.map((adj, i) => (
                  <div key={i} className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="font-semibold text-stone-900 flex justify-between">
                      <span>{adj.category}</span>
                      <span className="font-mono text-stone-700">
                        {currency} {adj.currentAllocated} → {currency} {adj.recommendedAllocated}
                      </span>
                    </div>
                    <p className="text-2xs text-stone-600 mt-1">{adj.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Budget Items Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 font-display">
            Itemized Expense Register ({plan.budget.items.length} line items)
          </h3>
          <span className="text-xs text-stone-500">
            Click status to toggle payment state
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200 uppercase tracking-wider text-2xs">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Expense / Service</th>
                <th className="py-3 px-4 text-right">Estimated</th>
                <th className="py-3 px-4 text-right">Actual Paid</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {plan.budget.items.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-stone-800 whitespace-nowrap">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-stone-900">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-stone-900">
                    {currency} {item.estimatedCost.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-stone-700">
                    {currency} {item.actualCost.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(item)}
                      title="Click to cycle status"
                      className={`inline-block px-2.5 py-0.5 text-2xs font-medium rounded transition-colors cursor-pointer capitalize border ${
                        item.status === 'paid_in_full'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : item.status === 'deposit_paid'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {item.status.replace(/_/g, ' ')}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-stone-500 max-w-xs truncate">
                    {item.notes || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(item)}
                        title="Edit expense"
                        className="p-1 text-stone-400 hover:text-stone-900 rounded cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        title="Delete expense"
                        className="p-1 text-stone-400 hover:text-red-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-50 font-semibold border-t border-stone-200 text-stone-900">
              <tr>
                <td className="py-3 px-4 font-bold" colSpan={2}>Totals</td>
                <td className="py-3 px-4 text-right font-mono tabular-nums">
                  {currency} {totalEstimated.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums">
                  {currency} {totalActual.toLocaleString()}
                </td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 font-display mb-3">
              {editingItem ? 'Edit Expense Item' : 'Add New Budget Item'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Expense Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding Cake & Pastries"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={itemCat}
                    onChange={(e) => setItemCat(e.target.value)}
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
                    value={itemStatus}
                    onChange={(e: any) => setItemStatus(e.target.value)}
                    className="w-full px-2.5 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="planned">Planned</option>
                    <option value="deposit_paid">Deposit Paid</option>
                    <option value="paid_in_full">Paid in Full</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Estimated Cost ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="0"
                    value={itemEst}
                    onChange={(e) => setItemEst(e.target.value)}
                    className="w-full font-mono tabular-nums px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Actual Paid ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={itemAct}
                    onChange={(e) => setItemAct(e.target.value)}
                    className="w-full font-mono tabular-nums px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Notes / Inclusions</label>
                <input
                  type="text"
                  placeholder="e.g. Includes delivery & tiered stand rental"
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
