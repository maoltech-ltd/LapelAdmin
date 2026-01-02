'use client';

export default function RatingSummary({
  rating,
  trips,
}: {
  rating: number;
  trips: number;
}) {
  return (
    <div className="text-sm">
      <div className="font-medium">{rating.toFixed(1)} ⭐</div>
      <div className="text-xs text-gray-500">{trips} trips</div>
    </div>
  );
}
