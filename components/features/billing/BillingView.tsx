'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  CreditCard,
  CheckCircle2,
  Download,
  DollarSign,
  Activity,
  Layers,
  ArrowUpRight,
  Shield,
  X,
} from 'lucide-react';

export default function BillingView() {
  const { clients, showToast } = useApp();

  const [agencyCredits, setAgencyCredits] = useState(48200);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

  const agencyMRR = clients.reduce((acc, c) => acc + c.monthlySpend, 0);

  const invoices = [
    {
      id: 'INV-2026-009',
      date: 'Oct 01, 2026',
      amount: 899,
      status: 'Paid',
      plan: 'ROSE AI OS Agency Enterprise',
    },
    {
      id: 'INV-2026-008',
      date: 'Sep 01, 2026',
      amount: 899,
      status: 'Paid',
      plan: 'ROSE AI OS Agency Enterprise',
    },
    {
      id: 'INV-2026-007',
      date: 'Aug 01, 2026',
      amount: 899,
      status: 'Paid',
      plan: 'ROSE AI OS Agency Enterprise',
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full space-y-2">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Billing &amp; Subscriptions
        </h1>
        <p className="text-xs text-neutral-500">
          Manage your agency OS license, client billing allocations, and computational credit balances.
        </p>
      </div>

      {/* Top Cards Grid */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Agency Plan */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Agency License
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              Active Tier
            </span>
          </div>

          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              ROSE OS Enterprise
            </h2>
            <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
              $899 <span className="text-xs font-normal text-neutral-400">/ month</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
              <span>Unlimited Autonomous Agents</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
              <span>Up to 25 Client Workspaces</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
              <span>Dedicated Vector Knowledge Stores</span>
            </div>
          </div>
        </div>

        {/* Agency Execution Credits */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Credit Pool
            </span>
            <button
              onClick={() => setIsCreditModalOpen(true)}
              className="text-xs text-neutral-700 dark:text-neutral-300 hover:underline"
            >
              Add Credits +
            </button>
          </div>

          <div>
            <div className="text-xs text-neutral-500">Available Execution Balance</div>
            <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
              {agencyCredits.toLocaleString()}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-neutral-500 font-mono text-[11px]">
              <span>Monthly Allocation</span>
              <span>48.2k / 100k</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-neutral-900 dark:bg-neutral-100" style={{ width: '48%' }} />
            </div>
          </div>
        </div>

        {/* Agency Client Revenue (MRR) */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Client Revenue
            </span>
            <span className="text-[10px] font-mono text-neutral-500">Stripe Billing Synced</span>
          </div>

          <div>
            <div className="text-xs text-neutral-500">Total Client Retainers (MRR)</div>
            <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
              ${agencyMRR.toLocaleString()}
            </div>
          </div>

          <div className="text-xs text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            Across 5 client accounts · 100% on-time subscription collection.
          </div>
        </div>
      </div>

      {/* Client Subscriptions Breakdown */}
      <div className="max-w-6xl mx-auto w-full p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Client Subscription &amp; Retainer Roster
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Client</th>
                <th className="p-3">Monthly Spend</th>
                <th className="p-3">Billing Status</th>
                <th className="p-3">Assigned Capacity</th>
                <th className="p-3">Next Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono text-[11px]">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                  <td className="p-3 font-sans font-medium text-neutral-900 dark:text-neutral-100">
                    {c.name}
                  </td>
                  <td className="p-3 text-neutral-800 dark:text-neutral-200 font-semibold">
                    ${c.monthlySpend.toLocaleString()} / mo
                  </td>
                  <td className="p-3">
                    <span className="capitalize px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {c.status === 'paused' ? 'Paused' : 'Active Auto-Pay'}
                    </span>
                  </td>
                  <td className="p-3 text-neutral-500 font-sans">
                    {c.assignedAgentIds.length} Agents · {c.automationsCount} Workflows
                  </td>
                  <td className="p-3 text-neutral-400">Nov 01, 2026</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice History */}
      <div className="max-w-6xl mx-auto w-full p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] space-y-3">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Agency Invoices &amp; Receipts
        </h2>

        <div className="space-y-2">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="p-3.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {inv.id} · {inv.plan}
                </div>
                <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  Billed: {inv.date} · Paid via Visa ending in 4242
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  ${inv.amount}.00
                </span>
                <button
                  onClick={() => showToast(`Downloaded receipt ${inv.id}`)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded"
                  title="Download receipt"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Modal */}
      {isCreditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-[#171717] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Top Up Agency Execution Credits
              </h3>
              <button onClick={() => setIsCreditModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Select credit bundle to simulate agency capacity expansion.
            </p>
            <div className="space-y-2">
              {[
                { credits: 25000, price: '$199' },
                { credits: 100000, price: '$699' },
                { credits: 500000, price: '$2,499' },
              ].map((pack, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAgencyCredits((c) => c + pack.credits);
                    setIsCreditModalOpen(false);
                    showToast(`Purchased ${pack.credits.toLocaleString()} agency credits`);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs"
                >
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    +{pack.credits.toLocaleString()} Credits
                  </span>
                  <span className="font-mono text-neutral-500">{pack.price}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
