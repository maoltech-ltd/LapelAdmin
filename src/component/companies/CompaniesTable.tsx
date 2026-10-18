'use client';

import { CompanyDto } from '../../../lib/types/company.types';
import { EmptyTableRow, TableShell, ViewButton } from '../utils/DataTable';
import StatusBadge from '../utils/StatusBadge';
import { companyStatusKey, companyStatusLabel, dateTime, money } from './companyAdminUtils';

export default function CompaniesTable({
  companies,
  onView,
}: {
  companies: CompanyDto[];
  onView: (company: CompanyDto) => void;
}) {
  return (
    <TableShell>
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 text-left">Company</th>
            <th className="px-4 py-3 text-left">Owner / contact</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Members</th>
            <th className="px-4 py-3 text-left">Discount</th>
            <th className="px-4 py-3 text-left">Wallet</th>
            <th className="px-4 py-3 text-left">Created</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr
              key={company.id}
              onClick={() => onView(company)}
              className="cursor-pointer border-t border-slate-200 transition hover:bg-blue-50/60 dark:border-slate-800 dark:hover:bg-slate-800/70"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900 dark:text-slate-100">{company.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {[company.industry, company.city].filter(Boolean).join(' · ') || company.id}
                </div>
              </td>
              <td className="px-4 py-3">
                <div>{company.ownerName || company.ownerEmail || '—'}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {company.contactEmail || company.ownerEmail || '—'}
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={companyStatusKey(company.status)} label={companyStatusLabel(company.status)} />
              </td>
              <td className="px-4 py-3">{company.activeMemberCount ?? '—'}</td>
              <td className="px-4 py-3">
                {company.discountActive && company.discountPercentage ? `${company.discountPercentage}%` : 'Off'}
              </td>
              <td className="px-4 py-3">{money(company.walletBalance)}</td>
              <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{dateTime(company.createdAt)}</td>
              <td className="px-4 py-3 text-right" onClick={(event) => event.stopPropagation()}>
                <ViewButton onClick={() => onView(company)} />
              </td>
            </tr>
          ))}
          {companies.length === 0 && <EmptyTableRow colSpan={8} message="No companies found." />}
        </tbody>
      </table>
    </TableShell>
  );
}
