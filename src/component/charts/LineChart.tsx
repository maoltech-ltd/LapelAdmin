// export default function LineChart() {
//   return (
//     <div className="flex h-64 items-center justify-center text-gray-400">
//       Line Chart Placeholder
//     </div>
//   );
// }
interface LineChartProps {
  data: any;
  options: any;
  loading?: boolean;
}

export default function LineChart({
  data,
  options,
  loading = false,
}: LineChartProps) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        Loading chart...
      </div>
    );
  }

  return (
    <div className="flex h-64 items-center justify-center text-gray-400">
      {/* Replace with real chart lib later */}
      Line Chart Placeholder
    </div>
  );
}
