import React from 'react';
import type { ComputedBreakdown, EstimatedExpenses } from '../types/trip';
import {
  BedDouble,
  Utensils,
  Compass,
  Train,
  Car,
  Wallet,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Coins,
  ShieldCheck,
  Lightbulb,
  Info,
  Users,
} from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';
import { formatINR } from '../lib/formatters';

interface ExpenseBreakdownProps {
  expenses: EstimatedExpenses;
  totalCost: number;
  budget: number;
  breakdown?: ComputedBreakdown;
  travellers?: number;
}

export const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({
  expenses,
  totalCost,
  budget,
  breakdown,
  travellers = 2,
}) => {
  const animatedTotalCost = useCountUp(totalCost, 900);
  const animatedBudget = useCountUp(budget, 700);

  const percentUsed = Math.min(Math.round((totalCost / budget) * 100), 200);
  const isOverBudget = totalCost > budget;
  const isNearBudget = percentUsed >= 90 && percentUsed <= 100;
  const diff = Math.abs(budget - totalCost);
  const costPerPerson = breakdown?.costPerPerson || Math.round(totalCost / Math.max(1, travellers));

  // Determine line items
  const intercityAmount = breakdown?.intercityTransport?.roundTripTotal || Math.round(expenses.transport * 0.65);
  const localTransportAmount = breakdown?.localTransport?.total || Math.round(expenses.transport * 0.35);
  const stayAmount = breakdown?.stay?.total || expenses.stay;
  const foodAmount = breakdown?.food?.total || expenses.food;
  const activitiesAmount = breakdown?.activities?.total || expenses.activities;
  const bufferAmount = breakdown?.buffer?.total || expenses.miscellaneous;

  const categories = [
    {
      name: 'Intercity Round-Trip Transit',
      amount: intercityAmount,
      icon: Train,
      subtitle: breakdown?.intercityTransport
        ? `Via ${breakdown.intercityTransport.suggestedMode} (~${formatINR(breakdown.intercityTransport.oneWayFarePerPerson)}/person one-way)`
        : 'Outward & return travel',
      cardBg: 'bg-teal-50/70 border-teal-200/80',
      iconBg: 'bg-teal-100 text-teal-800',
    },
    {
      name: 'Accommodation & Stay',
      amount: stayAmount,
      icon: BedDouble,
      subtitle: breakdown?.stay
        ? breakdown.stay.nights > 0
          ? `${breakdown.stay.nights} night(s) • ${breakdown.stay.unitLabel}`
          : 'Day trip (no overnight lodging)'
        : 'Hotels / Guesthouses',
      cardBg: 'bg-blue-50/70 border-blue-200/80',
      iconBg: 'bg-blue-100 text-blue-800',
    },
    {
      name: 'Food & Regional Dining',
      amount: foodAmount,
      icon: Utensils,
      subtitle: breakdown?.food
        ? `~${formatINR(breakdown.food.perPersonPerDay)}/person/day for all meals`
        : 'Meals, tea & snacks',
      cardBg: 'bg-amber-50/70 border-amber-200/80',
      iconBg: 'bg-amber-100 text-amber-800',
    },
    {
      name: 'Local City Transit',
      amount: localTransportAmount,
      icon: Car,
      subtitle: 'Autos, metro, local cabs & rentals',
      cardBg: 'bg-emerald-50/70 border-emerald-200/80',
      iconBg: 'bg-emerald-100 text-emerald-800',
    },
    {
      name: 'Sightseeing & Entry Tickets',
      amount: activitiesAmount,
      icon: Compass,
      subtitle: 'Monument tickets, boat rides & activities',
      cardBg: 'bg-orange-50/70 border-orange-200/80',
      iconBg: 'bg-orange-100 text-orange-800',
    },
    {
      name: 'Buffer for Surprises',
      amount: bufferAmount,
      icon: ShieldCheck,
      subtitle: '8% contingency reserve for emergencies',
      cardBg: 'bg-stone-50/90 border-stone-200/80',
      iconBg: 'bg-stone-200/80 text-stone-800',
    },
  ];

  return (
    <div className="card bg-base-100 border border-base-200/90 shadow-sm p-6 sm:p-9 rounded-3xl space-y-8 animate-fade-in-up">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-base-200/80 gap-4">
        <div>
          <h3 className="text-2xl font-black text-base-content flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </span>
            <span>Comprehensive Expense Breakdown</span>
          </h3>
          <p className="text-xs sm:text-sm text-base-content/65 mt-1 font-medium">
            Realistic Indian rupee allocations covering round-trip travel, stay, and daily expenses.
          </p>
        </div>

        {/* Status Badge */}
        <div>
          {isOverBudget ? (
            <div className="badge badge-warning gap-1.5 py-3.5 px-4 text-xs font-black rounded-xl border border-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-800" />
              <span className="text-amber-900">
                Exceeds Target Budget by {formatINR(diff)}
              </span>
            </div>
          ) : isNearBudget ? (
            <div className="badge badge-info gap-1.5 py-3.5 px-4 text-xs font-black rounded-xl text-white bg-teal-600 border-0">
              <CheckCircle2 className="w-4 h-4" />
              <span>Nearly Balanced ({formatINR(diff)} safety margin)</span>
            </div>
          ) : (
            <div className="badge badge-success gap-1.5 py-3.5 px-4 text-xs font-black rounded-xl text-white bg-emerald-600 border-0">
              <CheckCircle2 className="w-4 h-4" />
              <span>Under Budget by {formatINR(diff)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Totals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-base-200/60 p-5 rounded-2xl border border-base-200/90 space-y-1">
          <span className="text-xs uppercase tracking-wider font-extrabold text-base-content/60">
            Target Group Budget
          </span>
          <p className="text-2xl sm:text-3xl font-black text-base-content tabular-nums tracking-tight">
            {formatINR(animatedBudget)}
          </p>
          <span className="text-[11px] text-base-content/50 font-medium block">
            Budget for entire group
          </span>
        </div>

        <div
          className={`p-5 rounded-2xl border space-y-1 ${
            isOverBudget
              ? 'bg-rose-50/70 border-rose-200 text-rose-950'
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-extrabold opacity-75">
              Calculated Total Estimate
            </span>
            <TrendingUp className="w-4 h-4 opacity-75" />
          </div>
          <p className="text-2xl sm:text-3xl font-black tabular-nums tracking-tight">
            {formatINR(animatedTotalCost)}
          </p>
          <span className="text-[11px] opacity-75 font-medium block">
            All categories + 8% buffer
          </span>
        </div>

        <div className="bg-base-200/60 p-5 rounded-2xl border border-base-200/90 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-extrabold text-base-content/60">
              Cost Per Person
            </span>
            <Users className="w-4 h-4 text-teal-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-base-content tabular-nums tracking-tight">
            {formatINR(costPerPerson)}
          </p>
          <span className="text-[11px] text-base-content/50 font-medium block">
            Shared cost for {travellers} traveller(s)
          </span>
        </div>
      </div>

      {/* Animated Budget Progress Meter */}
      <div className="space-y-2.5">
        <div className="flex justify-between text-xs font-bold text-base-content/75 px-1">
          <span className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-primary" />
            Budget Utilization
          </span>
          <span className="tabular-nums font-black text-base-content">
            {percentUsed}% of total budget
          </span>
        </div>
        <div className="w-full bg-base-200 rounded-full h-3.5 overflow-hidden p-0.5 border border-base-300/40">
          <div
            className={`h-2.5 rounded-full transition-all duration-700 ease-out ${
              percentUsed > 100
                ? 'bg-rose-500'
                : percentUsed > 85
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
      </div>

      {/* 6-Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {categories.map((cat) => {
          const CatIcon = cat.icon;
          const share = totalCost > 0 ? Math.round((cat.amount / totalCost) * 100) : 0;
          return (
            <div
              key={cat.name}
              className={`flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 hover:shadow-xs min-h-[110px] ${cat.cardBg}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cat.iconBg}`}>
                    <CatIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-base-content leading-tight">
                      {cat.name}
                    </h4>
                    <span className="text-[10px] text-base-content/60 font-medium">
                      {cat.subtitle}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-black/5 mt-2">
                <span className="text-[11px] text-base-content/50 font-semibold tabular-nums">
                  {share}% of total
                </span>
                <span className="text-base font-black text-base-content tabular-nums">
                  {formatINR(cat.amount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actionable Computed Savings Tips (if Over Budget) */}
      {isOverBudget && breakdown?.savingsTips && breakdown.savingsTips.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900">
            <Lightbulb className="w-4 h-4 text-amber-700" />
            <span>Practical Tips to Bring This Under Budget</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-amber-950 font-medium">
            {breakdown.savingsTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Surplus Suggestion (if well under budget) */}
      {!isOverBudget && breakdown?.surplusSuggestions && breakdown.surplusSuggestions.length > 0 && (
        <div className="bg-teal-50/80 border border-teal-200/90 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-900">
            <Lightbulb className="w-4 h-4 text-teal-700" />
            <span>Headroom Opportunity</span>
          </div>
          <p className="text-xs sm:text-sm text-teal-950 font-medium">
            {breakdown.surplusSuggestions[0]}
          </p>
        </div>
      )}

      {/* Transparent Assumptions List */}
      <div className="pt-2 border-t border-base-200/70">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-base-content/60 mb-2.5">
          <Info className="w-3.5 h-3.5" />
          <span>Trip Assumptions</span>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-base-content/65 font-medium">
          {(
            breakdown?.assumptions || [
              'Transit calculated based on typical railway and intercity routes',
              'Stay based on shared double room occupancy',
              'Food estimates cover full daily breakfast, lunch, and dinner',
              'Includes an 8% buffer for incidental expenses and local tips',
            ]
          ).map((assumption, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-primary font-bold">•</span>
              <span>{assumption}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
