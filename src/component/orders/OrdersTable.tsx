'use client';

import { AlertTriangle } from 'lucide-react';
import { OrderDto } from '../../../lib/types/order.types';
import { EmptyTableRow, TableShell, ViewButton } from '../utils/DataTable';
import StatusBadge from '../utils/StatusBadge';
import { dateTime, money, orderFlags, statusKey } from './orderAdminUtils';

export default function OrdersTable({
  orders,
  onView,
}: {
  orders: OrderDto[];
  onView: (order: OrderDto) => void;
}) {
  return (
    <TableShell>
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 text-left">Order</th>
            <th className="px-4 py-3 text-left">Participants</th>
            <th className="px-4 py-3 text-left">Ride time</th>
            <th className="px-4 py-3 text-left">Fare</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Payment</th>
            <th className="px-4 py-3 text-left">Flags</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const flags = orderFlags(order);
            return (
              <tr
                key={order.id}
                className="border-t border-slate-200 transition hover:bg-blue-50/60 dark:border-slate-800 dark:hover:bg-slate-800/70"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900 dark:text-slate-100">{order.id}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Ride {order.rideId}</div>
                  {order.occurrenceId && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">Occurrence {order.occurrenceId}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div>Passenger {order.passengerId}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Driver {order.driverId}</div>
                </td>
                <td className="px-4 py-3">{dateTime(order.requestedDepartureTimeUtc || order.requestedDepartureTime)}</td>
                <td className="px-4 py-3">
                  <div>{money(order.fare)}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{order.seatsBooked} seat(s)</div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={statusKey(order.status)} label={String(order.status).split('_').join(' ')} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <StatusBadge status={statusKey(order.payment)} label={order.payment} />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Wallet {order.walletDebited ? 'debited' : 'not debited'} / Driver{' '}
                      {order.driverCredited ? 'credited' : 'not credited'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {flags.length ? (
                    <div className="flex items-center gap-2 text-xs font-medium text-orange-700 dark:text-orange-300">
                      <AlertTriangle className="h-4 w-4" />
                      {flags.length} issue{flags.length === 1 ? '' : 's'}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 dark:text-slate-400">Clear</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <ViewButton onClick={() => onView(order)} />
                </td>
              </tr>
            );
          })}
          {orders.length === 0 && <EmptyTableRow colSpan={8} message="No orders found." />}
        </tbody>
      </table>
    </TableShell>
  );
}
