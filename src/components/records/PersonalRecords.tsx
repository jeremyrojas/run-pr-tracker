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
    <div className="w-full space-y-4">
      <h2 className="text-xl font-semibold">Personal Records</h2>
      {records.map((record, index) => (
        <div key={record.distance} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <label className="md:col-span-2 flex items-center font-medium">
            {record.distance}
          </label>
          <input
            type="text"
            placeholder="HH:MM:SS"
            value={record.time || ''}
            onChange={(e) => handleRecordChange(index, 'time', e.target.value)}
            className="md:col-span-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Location/Race"
            value={record.location || ''}
            onChange={(e) => handleRecordChange(index, 'location', e.target.value)}
            className="md:col-span-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={record.date || ''}
            onChange={(e) => handleRecordChange(index, 'date', e.target.value)}
            className="md:col-span-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
      ))}
    </div>
  );
} 