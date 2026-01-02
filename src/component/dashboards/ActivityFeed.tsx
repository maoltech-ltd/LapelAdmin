const activities = [
  { type: 'ride', message: 'New ride created from Ikeja to Lekki' },
  { type: 'booking', message: 'New booking by John Doe' },
  { type: 'cancel', message: 'Ride cancelled by driver' },
];

export default function ActivityFeed() {
  return (
    <ul className="space-y-3">
      {activities.map((activity, index) => (
        <li
          key={index}
          className="flex items-start gap-3 rounded-lg border p-3"
        >
          <span
            className={`mt-1 h-2 w-2 rounded-full ${
              activity.type === 'ride'
                ? 'bg-blue-500'
                : activity.type === 'booking'
                ? 'bg-green-500'
                : 'bg-red-500'
            }`}
          />
          <p className="text-sm text-gray-700">{activity.message}</p>
        </li>
      ))}
    </ul>
  );
}
