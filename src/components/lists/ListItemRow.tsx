'use client';

import { useState } from 'react';
import { GripVertical, X, Check } from 'lucide-react';
import { type ListItem, useListStore } from '@/store/useListStore';

interface ListItemRowProps {
  item: ListItem;
  dragHandleProps?: Record<string, unknown>;
}

export function ListItemRow({ item, dragHandleProps }: ListItemRowProps) {
  const { updateItem, deleteItem } = useListStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const handleToggle = () => {
    updateItem(item.id, { done: !item.done });
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      updateItem(item.id, { text: editText.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 group py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors">
      <button
        className="text-gray-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        {...dragHandleProps}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <button
        onClick={handleToggle}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          item.done
            ? 'bg-violet-600 border-violet-600'
            : 'border-gray-600 hover:border-violet-500'
        }`}
      >
        {item.done && <Check className="w-3 h-3 text-white" />}
      </button>

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveEdit();
            if (e.key === 'Escape') setIsEditing(false);
          }}
          className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-violet-500"
          autoFocus
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className={`flex-1 text-sm cursor-text ${
            item.done ? 'text-gray-500 line-through' : 'text-gray-200'
          }`}
        >
          {item.text}
        </span>
      )}

      <button
        onClick={() => deleteItem(item.id)}
        className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
