'use client';

import { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { OrderDto } from '../../../lib/types/order.types';
import { DetailGrid, DetailSection, StatSummaryGrid } from '../utils/DetailBlocks';
import DetailDrawer from '../utils/DetailDrawer';
import StatusBadge from '../utils/StatusBadge';
import { dateTime, money, orderFlags, statusKey } from './orderAdminUtils';

export default function OrderDetailsDrawer({
  order,
  open,
  onClose,
  footer,
}: {
  order: OrderDto | null;
  open: boolean;
  onClose: () => void;
  footer?: ReactNode;
}) {
  if (!open || !order) return null;

  const flags = orderFlags(order);
  const driverNet = order.driverEarning || Math.max((order.grossFare || order.fare || 0) - (order.commissionAmount || 0), 0);

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      widthClassName="max-w-5xl"
      title="Order details"
      subtitle={`${order.passengerId} -> ${order.driverId}`}
      badge={<StatusBadge status={statusKey(order.status)} label={String(order.status).split('_').join(' ')} />}
      footer={footer}
    >
      <div className="space-y-5">
        {flags.length > 0 && (
          <section className="rounded-md border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-200">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4" />
              Operational flags
            </div>
            <ul className="list-disc space-y-1 pl-5">
              {flags.map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
          </section>
        )}

        <StatSummaryGrid
          stats={[
            { label: 'Passenger paid', value: money(order.fare), hint: order.payment },
            { label: 'Gross fare', value: money(order.grossFare || order.fare), hint: `${order.seatsBooked} seat(s)` },
            { label: 'Commission', value: money(order.commissionAmount), hint: order.platformChargeType || 'Platform charge' },
            { label: 'Driver earning', value: money(driverNet), hint: order.driverCredited ? 'Released' : 'Not released' },
          ]}
        />

        <DetailSection title="Lifecycle">
          <DetailGrid
            items={[
              { label: 'Order ID', value: order.id },
              { label: 'Ride ID', value: order.rideId },
              { label: 'Occurrence ID', value: order.occurrenceId || 'N/A' },
              { label: 'Order status', value: <StatusBadge status={statusKey(order.status)} label={order.status} /> },
              { label: 'Ride status', value: <StatusBadge status={statusKey(order.rideStatus)} label={order.rideStatus} /> },
              { label: 'Payment status', value: <StatusBadge status={statusKey(order.payment)} label={order.payment} /> },
              { label: 'Requested departure', value: dateTime(order.requestedDepartureTimeUtc || order.requestedDepartureTime) },
              { label: 'Arrival window', value: `${dateTime(order.arrivalWindowStartUtc)} - ${dateTime(order.arrivalWindowEndUtc)}` },
            ]}
          />
        </DetailSection>

        <DetailSection title="Payment controls">
          <DetailGrid
            items={[
              { label: 'Wallet debited', value: order.walletDebited ? 'Yes' : 'No' },
              { label: 'Driver credited', value: order.driverCredited ? 'Yes' : 'No' },
              { label: 'Discount', value: money(order.discountAmount) },
              { label: 'Device charge', value: money(order.deviceChargeAmount) },
              { label: 'Notification charge', value: money(order.notificationChargeAmount) },
              { label: 'Coupon', value: order.couponCode || 'N/A' },
              { label: 'First ride free', value: order.firstRideFreeApplied ? 'Applied' : 'No' },
              { label: 'Device', value: order.device || 'N/A' },
            ]}
          />
        </DetailSection>

        <DetailSection title="Support trail">
          <DetailGrid
            items={[
              { label: 'Cancel requested by', value: order.cancelRequestedBy || 'N/A' },
              { label: 'Cancel requested at', value: dateTime(order.cancelRequestedAt) },
              { label: 'Disputed by', value: order.disputedBy || 'N/A' },
              { label: 'Disputed at', value: dateTime(order.disputedAt) },
              { label: 'Driver completed at', value: dateTime(order.driverCompletedAt) },
              { label: 'Customer confirmed at', value: dateTime(order.customerConfirmedAt) },
              { label: 'Emergency alerted by', value: order.emergencyAlertedBy || 'N/A' },
              { label: 'Emergency alerted at', value: dateTime(order.emergencyAlertedAt) },
            ]}
          />
        </DetailSection>
      </div>
    </DetailDrawer>
  );
}
