'use client';

import { useState } from 'react';
import SettingsSection from './SettingsSection';

export default function CommissionSettings() {
  const [commission, setCommission] = useState(10);
  const [seatLimit, setSeatLimit] = useState(4);

  return (
    <SettingsSection
      title="Pricing & Commission"
      description="Control platform earnings and ride limits"
    >
      <div className="flex items-center justify-between">
        <label>Commission (%)</label>
        <input
          type="number"
          className="input w-24"
          value={commission}
          onChange={(e) => setCommission(+e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <label>Max seats per ride</label>
        <input
          type="number"
          className="input w-24"
          value={seatLimit}
          onChange={(e) => setSeatLimit(+e.target.value)}
        />
      </div>

      <button className="btn-primary w-fit">
        Save Changes
      </button>
    </SettingsSection>
  );
}
