'use client';

import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { CompanyDto } from '../../../lib/types/company.types';
import { companyService } from '../../../lib/api/services/companyService';
import { DetailGrid, DetailSection, StatSummaryGrid } from '../utils/DetailBlocks';
import DetailDrawer from '../utils/DetailDrawer';
import StatusBadge from '../utils/StatusBadge';
import PermissionGuard from '../guards/PermissionGuard';
import CompanyStatusActions from './CompanyStatusActions';
import CompanyDiscountForm from './CompanyDiscountForm';
import CompanyActivityTabs from './CompanyActivityTabs';
import {
  companyStatusKey,
  companyStatusLabel,
  dateTime,
  discountSummary,
  errorMessage,
  money,
} from './companyAdminUtils';

export default function CompanyDetailsDrawer({
  device,
  company: summary,
  open,
  onClose,
  onUpdated,
}: {
  device: string;
  company: CompanyDto | null;
  open: boolean;
  onClose: () => void;
  onUpdated: (updated: CompanyDto) => void;
}) {
  // Keyed by company id so a stale result for a previously opened company is ignored.
  const [result, setResult] = useState<{ id: string; data: CompanyDto | null; error: string | null } | null>(null);
  const summaryId = open ? summary?.id : undefined;

  // The list row is shown immediately; the detail call adds spend, invite counts and owner phone.
  useEffect(() => {
    if (!summaryId) return;
    let cancelled = false;
    companyService
      .getCompany(device, summaryId)
      .then((response) => {
        if (!cancelled) setResult({ id: summaryId, data: response.data, error: null });
      })
      .catch((requestError) => {
        if (!cancelled) setResult({ id: summaryId, data: null, error: errorMessage(requestError, 'Failed to load company') });
      });
    return () => {
      cancelled = true;
    };
  }, [device, summaryId]);

  if (!open || !summary) return null;
  const current = result?.id === summary.id ? result : null;
  const loading = !current;
  const error = current?.error ?? null;
  const company = current?.data ?? summary;

  const handleUpdated = (updated: CompanyDto) => {
    setResult({ id: updated.id, data: updated, error: null });
    onUpdated(updated);
  };

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      widthClassName="max-w-5xl"
      title={company.name}
      subtitle={[company.industry, company.city, company.companySize && `${company.companySize} staff`]
        .filter(Boolean)
        .join(' · ')}
      badge={<StatusBadge status={companyStatusKey(company.status)} label={companyStatusLabel(company.status)} />}
    >
      <div className="space-y-5">
        {loading && <Loader className="h-5 w-5 animate-spin text-blue-600" />}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <PermissionGuard permissions={['COMPANY_UPDATE']}>
          <CompanyStatusActions device={device} company={company} onUpdated={handleUpdated} />
        </PermissionGuard>

        <StatSummaryGrid
          stats={[
            { label: 'Wallet balance', value: money(company.walletBalance), hint: 'Company ride wallet' },
            { label: 'Spent this month', value: money(company.spentThisMonth), hint: 'Company-paid rides' },
            {
              label: 'Active members',
              value: company.activeMemberCount ?? '—',
              hint: `${company.pendingInviteCount ?? '—'} pending invite(s)`,
            },
            {
              label: 'Business rate',
              value: company.discountActive && company.discountPercentage ? `${company.discountPercentage}%` : 'Off',
              hint: discountSummary(company),
            },
          ]}
        />

        <DetailSection title="Status">
          <DetailGrid
            items={[
              { label: 'Status', value: companyStatusLabel(company.status) },
              { label: 'Reason', value: company.statusReason || 'N/A' },
              { label: 'Approved at', value: dateTime(company.approvedAt) },
              { label: 'Approved by', value: company.approvedBy || 'N/A' },
              { label: 'Registered', value: dateTime(company.createdAt) },
              { label: 'Last updated', value: dateTime(company.updatedAt) },
            ]}
          />
        </DetailSection>

        <DetailSection title="Profile">
          <DetailGrid
            items={[
              { label: 'Company ID', value: company.id },
              { label: 'Registration number', value: company.registrationNumber || 'N/A' },
              { label: 'Industry', value: company.industry || 'N/A' },
              { label: 'Company size', value: company.companySize || 'N/A' },
              { label: 'Address', value: [company.address, company.city].filter(Boolean).join(', ') || 'N/A' },
              { label: 'Website', value: company.website || 'N/A' },
              { label: 'Contact email', value: company.contactEmail || 'N/A' },
              { label: 'Contact phone', value: company.contactPhone || 'N/A' },
              {
                label: 'Default monthly budget',
                value: company.defaultMonthlyBudget == null ? 'Unlimited' : money(company.defaultMonthlyBudget),
              },
              { label: 'Wallet user ID', value: company.walletUserId || 'N/A' },
            ]}
          />
        </DetailSection>

        <DetailSection title="Owner">
          <DetailGrid
            items={[
              { label: 'Name', value: company.ownerName || 'N/A' },
              { label: 'Email', value: company.ownerEmail || 'N/A' },
              { label: 'Phone', value: company.ownerPhoneNumber || 'N/A' },
              { label: 'User ID', value: company.ownerUserId || 'N/A' },
            ]}
          />
        </DetailSection>

        <DetailSection title="Business rate">
          <div className="space-y-4">
            <DetailGrid
              items={[
                { label: 'Current rate', value: discountSummary(company) },
                {
                  label: 'Window',
                  value:
                    company.discountStartsAt || company.discountEndsAt
                      ? `${company.discountStartsAt ? dateTime(company.discountStartsAt) : 'Any time'} – ${
                          company.discountEndsAt ? dateTime(company.discountEndsAt) : 'no end'
                        }`
                      : 'Always',
                },
                { label: 'Note', value: company.discountNote || 'N/A' },
                {
                  label: 'Last changed',
                  value: company.discountUpdatedAt
                    ? `${dateTime(company.discountUpdatedAt)} by ${company.discountUpdatedBy || 'N/A'}`
                    : 'Never',
                },
              ]}
            />
            <PermissionGuard permissions={['COMPANY_UPDATE']}>
              <CompanyDiscountForm
                key={company.id}
                device={device}
                company={company}
                onUpdated={handleUpdated}
              />
            </PermissionGuard>
          </div>
        </DetailSection>

        <DetailSection title="Activity">
          <CompanyActivityTabs key={company.id} device={device} companyId={company.id} />
        </DetailSection>
      </div>
    </DetailDrawer>
  );
}
