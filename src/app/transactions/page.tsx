// "use client";

// import { useEffect, useState } from 'react';
// import Pagination from '@/component/utils/Pagination';
// import TableFilterBar from '@/component/filters/TableFilterBar';
// import { useTransaction } from '../../../lib/hooks/useTransaction';
// import TransactionsTable from '@/component/transactions/TransactionTable';
// import TransactionDrawer from '@/component/transactions/TransactionDrawer';

// const PAGE_SIZE = 10;

// export default function TransactionsPage() {

//   const {
//     transactions,
//     currentTransaction,
//     loading,
//     getTransactions,
//     getTransactionByReference,
//     clearTransaction
//   } = useTransaction();

//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState('');
//   const [status, setStatus] = useState('all');
//   const [from, setFrom] = useState('');
//   const [to, setTo] = useState('');

//   useEffect(() => {

//     getTransactions('admin', {
//       page: page - 1,
//       size: PAGE_SIZE,
//       reference: search || undefined
//     });

//   }, [page, search]);

//   const transactionList = transactions?.content ?? [];
//   const totalPages = transactions?.totalPages ?? 1;

//   return (
//     <div className="space-y-6">

//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-semibold">Payments & Transactions</h1>
//         <p className="text-sm text-gray-500">
//           Monitor deposits, withdrawals and transfers
//         </p>
//       </div>

//       {/* Filters */}
//     <TableFilterBar
//         search={search}
//         status={status}
//         from={from}
//         to={to}
//         onSearch={setSearch}
//         onStatusChange={setStatus}
//         onFromChange={setFrom}
//         onToChange={setTo}
//         statusOptions={[
//         { label: 'All', value: 'all' },
//         { label: 'Completed', value: 'COMPLETED' },
//         { label: 'Failed', value: 'FAILED' },
//         { label: 'Pending', value: 'PENDING' },
//         { label: 'Cancelled', value: 'CANCELLED' },
//         { label: 'Refunded', value: 'REFUNDED' },
//         { label: 'Success', value: 'SUCCESS' },
//         ]}
//     />

//       {/* Table */}
//       <TransactionsTable
//         transactions={transactionList}
//         onView={(tx) =>
//           getTransactionByReference('admin', tx.reference)
//         }
//       />

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <Pagination
//           page={page}
//           totalPages={totalPages}
//           onPageChange={setPage}
//         />
//       )}

//       {/* Drawer */}
//       <TransactionDrawer
//         transaction={currentTransaction}
//         open={!!currentTransaction}
//         onClose={clearTransaction}
//       />

//     </div>
//   );
// }

"use client";

import { useEffect, useState } from 'react';
import Pagination from '@/component/utils/Pagination';
import TableFilterBar from '@/component/filters/TableFilterBar';
import { useTransaction } from '../../../lib/hooks/useTransaction';
import TransactionsTable from '@/component/transactions/TransactionTable';
import TransactionDrawer from '@/component/transactions/TransactionDrawer';

const PAGE_SIZE = 10;

export default function TransactionsPage() {

  const {
    transactions,
    currentTransaction,
    loading,
    getTransactions,
    getTransactionByReference,
    clearTransaction
  } = useTransaction();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  // ✅ Reset page when filters change
  // useEffect(() => {
  //   // setPage(1);
  // }, [search, status, from, to]);

  // ✅ Fetch transactions
  useEffect(() => {

    getTransactions('admin', {
      page: page - 1,
      size: PAGE_SIZE,

      // Backend compatible filters
      reference: search || undefined,

      status: status !== 'all' ? status : undefined,

      fromDate: from || undefined,
      toDate: to || undefined
    });

  }, [page, search, status, from, to]);

  const transactionList = transactions?.content ?? [];
  const totalPages = transactions?.totalPages ?? 1;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Payments & Transactions</h1>
        <p className="text-sm text-gray-500">
          Monitor deposits, withdrawals and transfers
        </p>
      </div>

      {/* Filters */}
      <TableFilterBar
        search={search}
        status={status}
        from={from}
        to={to}
        onSearch={setSearch}
        onStatusChange={setStatus}
        onFromChange={setFrom}
        onToChange={setTo}
        statusOptions={[
          { label: 'All', value: 'all' },
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'Failed', value: 'FAILED' },
          { label: 'Pending', value: 'PENDING' },
          { label: 'Cancelled', value: 'CANCELLED' },
          { label: 'Refunded', value: 'REFUNDED' },
          { label: 'Success', value: 'SUCCESS' },
        ]}
      />

      {/* Table */}
      <TransactionsTable
        transactions={transactionList}
        onView={(tx) =>
          getTransactionByReference('admin', tx.reference)
        }
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Drawer */}
      <TransactionDrawer
        transaction={currentTransaction}
        open={!!currentTransaction}
        onClose={clearTransaction}
      />

    </div>
  );
}
