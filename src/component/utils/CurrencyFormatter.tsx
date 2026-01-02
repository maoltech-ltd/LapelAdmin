export default function CurrencyFormatter({
  amount,
  currency = 'NGN',
}: {
  amount: number;
  currency?: string;
}) {
  return (
    <span className="font-medium">
      {new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency,
      }).format(amount)}
    </span>
  );
}
