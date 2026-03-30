'use client';

import Link from 'next/link';
import { type SmartList } from '@/store/useListStore';

interface ListCardProps {
  list: SmartList;
}

export function ListCard({ list }: ListCardProps) {
  const items = list.items || [];
  const total = items.length;
  const done = items.filter((i) => i.done).length;
  const progress = total > 0 ? (done / total) * 100 : 0;

  return (
    <Link href={`/lists/${list.id}`}>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 hover:bg-gray-800/80 transition-colors cursor-pointer">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{list.icon}</span>
          <div>
            <h3 className="text-sm font-semibold text-white">{list.name}</h3>
            <p className="text-xs text-gray-500">
              {done}/{total} done
            </p>
          </div>
        </div>
        {total > 0 && (
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${progress}%`,
                backgroundColor: list.color,
              }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}
