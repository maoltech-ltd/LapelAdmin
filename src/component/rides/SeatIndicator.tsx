'use client';

export default function SeatsIndicator({
  total,
  booked,
}: {
  total: number;
  booked: number;
}) {
  return (
    <div className="text-sm">
      <div className="font-medium">
        {total - booked} / {total}
      </div>
      <div className="text-xs text-gray-500">Seats available</div>
    </div>
  );
}
