'use client';

import { useState } from 'react';
import { DashboardFilter } from '../../../lib/types/dashboard.types';

interface DateRangeFilterProps {
  onChange: (filter: Partial<DashboardFilter>) => void;
  onExport: () => void;
  value?: DashboardFilter;
}

export default function DateRangeFilter({ onChange, onExport, value }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState(value?.startDate ?? '');
  const [endDate, setEndDate] = useState(value?.endDate ?? '');
  const period = value?.period ?? 'TODAY';

  function applyCustom(nextStart = startDate, nextEnd = endDate) {
    if (period === 'CUSTOM' && nextStart && nextEnd) {
      onChange({ period: 'CUSTOM', startDate: nextStart, endDate: nextEnd });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={period}
        onChange={(event) =>
          onChange({
            period: event.target.value as DashboardFilter['period'],
            ...(event.target.value === 'CUSTOM' && startDate && endDate
              ? { startDate, endDate }
              : { startDate: undefined, endDate: undefined }),
          })
        }
        className="input"
        title="Filter dashboard period"
      >
        <option value="TODAY">Today</option>
        <option value="LAST_7_DAYS">Last 7 days</option>
        <option value="LAST_30_DAYS">Last 30 days</option>
        <option value="LAST_3_MONTHS">Last 3 months</option>
        <option value="LAST_1_YEAR">Last 1 year</option>
        <option value="CUSTOM">Custom</option>
      </select>

      {period === 'CUSTOM' && (
        <>
          <input
            type="date"
            value={startDate}
            onChange={(event) => {
              setStartDate(event.target.value);
              applyCustom(event.target.value, endDate);
            }}
            className="input"
            title="Custom start date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(event) => {
              setEndDate(event.target.value);
              applyCustom(startDate, event.target.value);
            }}
            className="input"
            title="Custom end date"
          />
        </>
      )}

      <button onClick={onExport} className="btn-primary" title="Export ride volume CSV">
        Export CSV
      </button>
    </div>
  );
}
