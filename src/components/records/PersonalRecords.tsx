'use client';

import { useState, useEffect } from 'react';
import type { PersonalRecord } from '@/types/database';

const DISTANCES = ['1-mile', '5k', '10k', 'Half Marathon', 'Full Marathon'];

interface PersonalRecordsProps {
  onUpdate: (records: Partial<PersonalRecord>[]) => void;
  initialRecords?: Partial<PersonalRecord>[];
}

export default function PersonalRecords({ onUpdate, initialRecords }: PersonalRecordsProps) {
  const [records, setRecords] = useState<Partial<PersonalRecord>[]>(
    initialRecords || DISTANCES.map(distance => ({ distance }))
  );

  useEffect(() => {
    if (initialRecords) {
      const allRecords = DISTANCES.map(distance => {
        const existingRecord = initialRecords.find(r => r.distance === distance);
        return existingRecord || { distance };
      });
      setRecords(allRecords);
    }
  }, [initialRecords]);

  const handleRecordChange = (index: number, field: keyof PersonalRecord, value: string) => {
    const updatedRecords = records.map((record, i) => {
      if (i === index) {
        return { ...record, [field]: value };
      }
      return record;
    });
    setRecords(updatedRecords);
    onUpdate(updatedRecords);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Personal Records</h2>
        <div className="text-sm text-[var(--text-secondary)]">
          Track your best times
        </div>
      </div>

      <div className="space-y-4">
        {records.map((record, index) => (
          <div 
            key={record.distance}
            className="bg-[var(--background)] p-4 rounded-xl space-y-3"
          >
            <div className="font-medium text-[var(--primary-blue)]">
              {record.distance}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="HH:MM:SS"
                value={record.time || ''}
                onChange={(e) => handleRecordChange(index, 'time', e.target.value)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] bg-white"
              />
              <input
                type="text"
                placeholder="Location/Race"
                value={record.location || ''}
                onChange={(e) => handleRecordChange(index, 'location', e.target.value)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] bg-white"
              />
              <input
                type="date"
                value={record.date || ''}
                onChange={(e) => handleRecordChange(index, 'date', e.target.value)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] bg-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 