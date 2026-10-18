'use client';

import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import Pagination from '../utils/Pagination';
import StatusBadge from '../utils/StatusBadge';
import { EmptyTableRow, TableShell } from '../utils/DataTable';
import { companyService } from '../../../lib/api/services/companyService';
import {
  CompanyInviteDto,
  CompanyMemberDto,
  CompanyRideDto,
  PaginatedResponse,
} from '../../../lib/types/company.types';
import { dateTime, errorMessage, inviteStatusKey, money, orderStatusKey } from './companyAdminUtils';

type Tab = 'members' | 'invites' | 'rides';

const RIDES_PAGE_SIZE = 10;

const TH = 'px-4 py-2 text-left';
const TD = 'px-4 py-2';
const ROW = 'border-t border-slate-200 dark:border-slate-800';
const SUB = 'text-xs text-slate-500 dark:text-slate-400';

// Members, invites and company-paid rides for one company. Each tab loads on first open.
export default function CompanyActivityTabs({ device, companyId }: { device: string; companyId: string }) {
  const [tab, setTab] = useState<Tab>('members');
  const [members, setMembers] = useState<CompanyMemberDto[] | null>(null);
  const [invites, setInvites] = useState<CompanyInviteDto[] | null>(null);
  const [rides, setRides] = useState<PaginatedResponse<CompanyRideDto> | null>(null);
  const [ridesPage, setRidesPage] = useState(1);
  // Which request the shown data/error belongs to; loading = it isn't the current request yet.
  const [settled, setSettled] = useState<{ key: string; error: string | null } | null>(null);
  const requestKey = `${companyId}:${tab}:${tab === 'rides' ? ridesPage : ''}`;

  useEffect(() => {
    let cancelled = false;
    const done = () => !cancelled && setSettled({ key: requestKey, error: null });
    const request =
      tab === 'members'
        ? companyService.getMembers(device, companyId).then((response) => {
            if (!cancelled) setMembers(response.data);
          })
        : tab === 'invites'
          ? companyService.getInvites(device, companyId).then((response) => {
              if (!cancelled) setInvites(response.data);
            })
          : companyService
              .getRides(device, companyId, { page: ridesPage - 1, size: RIDES_PAGE_SIZE })
              .then((response) => {
                if (!cancelled) setRides(response.data);
              });
    request.then(done).catch((requestError) => {
      if (!cancelled) setSettled({ key: requestKey, error: errorMessage(requestError, `Failed to load ${tab}`) });
    });
    return () => {
      cancelled = true;
    };
  }, [device, companyId, tab, ridesPage, requestKey]);

  const loading = settled?.key !== requestKey;
  const error = settled?.key === requestKey ? settled.error : null;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'members', label: `Members${members ? ` (${members.length})` : ''}` },
    { key: 'invites', label: `Invites${invites ? ` (${invites.length})` : ''}` },
    { key: 'rides', label: `Rides${rides ? ` (${rides.totalElements})` : ''}` },
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${
              tab === item.key
                ? 'border-blue-600 text-blue-700 dark:text-blue-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
        {loading && <Loader className="ml-auto mt-2 h-4 w-4 animate-spin text-blue-600" />}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {tab === 'members' && (
        <TableShell>
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className={TH}>Member</th>
                <th className={TH}>Role</th>
                <th className={TH}>Department</th>
                <th className={TH}>Spent this month</th>
                <th className={TH}>Monthly budget</th>
                <th className={TH}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {(members ?? []).map((member) => (
                <tr key={member.id} className={ROW}>
                  <td className={TD}>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{member.name || member.userId}</div>
                    <div className={SUB}>{member.email || member.phoneNumber || '—'}</div>
                  </td>
                  <td className={TD}>{member.role}</td>
                  <td className={TD}>{member.department || '—'}</td>
                  <td className={TD}>{money(member.spentThisMonth)}</td>
                  <td className={TD}>
                    {member.effectiveMonthlyBudget == null ? 'Unlimited' : money(member.effectiveMonthlyBudget)}
                    {member.monthlyBudget == null && member.effectiveMonthlyBudget != null && (
                      <div className={SUB}>Company default</div>
                    )}
                  </td>
                  <td className={TD}>{dateTime(member.joinedAt)}</td>
                </tr>
              ))}
              {members?.length === 0 && <EmptyTableRow colSpan={6} message="No active members." />}
            </tbody>
          </table>
        </TableShell>
      )}

      {tab === 'invites' && (
        <TableShell>
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className={TH}>Invitee</th>
                <th className={TH}>Code</th>
                <th className={TH}>Role</th>
                <th className={TH}>Status</th>
                <th className={TH}>Expires</th>
                <th className={TH}>Sent</th>
              </tr>
            </thead>
            <tbody>
              {(invites ?? []).map((invite) => (
                <tr key={invite.id} className={ROW}>
                  <td className={TD}>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {invite.name || invite.email || invite.phoneNumber || '—'}
                    </div>
                    <div className={SUB}>{invite.name ? invite.email || invite.phoneNumber : invite.department}</div>
                  </td>
                  <td className={`${TD} font-mono`}>{invite.code}</td>
                  <td className={TD}>{invite.role}</td>
                  <td className={TD}>
                    <StatusBadge
                      status={inviteStatusKey(invite.status, invite.expired)}
                      label={invite.expired ? 'Expired' : invite.status}
                    />
                  </td>
                  <td className={TD}>{dateTime(invite.expiresAt)}</td>
                  <td className={TD}>{dateTime(invite.lastSentAt || invite.createdAt)}</td>
                </tr>
              ))}
              {invites?.length === 0 && <EmptyTableRow colSpan={6} message="No invites." />}
            </tbody>
          </table>
        </TableShell>
      )}

      {tab === 'rides' && (
        <>
          <TableShell>
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className={TH}>Order</th>
                  <th className={TH}>Staff</th>
                  <th className={TH}>Fare</th>
                  <th className={TH}>Discount</th>
                  <th className={TH}>Status</th>
                  <th className={TH}>Booked</th>
                </tr>
              </thead>
              <tbody>
                {(rides?.content ?? []).map((ride) => (
                  <tr key={ride.orderId} className={ROW}>
                    <td className={TD}>
                      <div className="font-medium text-slate-900 dark:text-slate-100">{ride.orderId}</div>
                      <div className={SUB}>Ride {ride.rideId}</div>
                    </td>
                    <td className={TD}>
                      <div>{ride.passengerName || ride.passengerId}</div>
                      <div className={SUB}>{ride.passengerEmail || ''}</div>
                    </td>
                    <td className={TD}>
                      <div>{money(ride.fare)}</div>
                      <div className={SUB}>Gross {money(ride.grossFare)}</div>
                    </td>
                    <td className={TD}>{money(ride.companyDiscountAmount)}</td>
                    <td className={TD}>
                      <StatusBadge status={orderStatusKey(ride.status)} label={ride.status} />
                    </td>
                    <td className={TD}>{dateTime(ride.createdAt)}</td>
                  </tr>
                ))}
                {rides?.content.length === 0 && <EmptyTableRow colSpan={6} message="No company-paid rides yet." />}
              </tbody>
            </table>
          </TableShell>
          {(rides?.totalPages ?? 1) > 1 && (
            <Pagination page={ridesPage} totalPages={rides?.totalPages ?? 1} onPageChange={setRidesPage} />
          )}
        </>
      )}
    </div>
  );
}
