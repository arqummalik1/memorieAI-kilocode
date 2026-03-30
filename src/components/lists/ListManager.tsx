'use client';

import { useState } from 'react';
import { useListStore } from '@/store/useListStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ListCard } from './ListCard';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { EmptyState } from '@/components/shared/EmptyState';

const LIST_ICONS = ['📝', '🛒', '🎬', '📚', '🎯', '💼', '🏠', '✈️', '💡', '🎵'];
const LIST_COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];

export function ListManager() {
  const { user } = useAuthStore();
  const { lists, createList } = useListStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('📝');
  const [newColor, setNewColor] = useState('#6366f1');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newName.trim()) return;
    await createList({
      user_id: user.id,
      name: newName.trim(),
      icon: newIcon,
      color: newColor,
    });
    setNewName('');
    setNewIcon('📝');
    setNewColor('#6366f1');
    setShowCreate(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Lists</h1>
          <p className="text-sm text-gray-500 mt-1">
            {lists.length} list{lists.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ New List</Button>
      </div>

      {lists.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No lists yet"
          description="Create your first list or try saying 'Create a grocery list' in chat"
          action={
            <Button onClick={() => setShowCreate(true)}>Create List</Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create New List"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Grocery List"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Icon
            </label>
            <div className="flex gap-2 flex-wrap">
              {LIST_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setNewIcon(icon)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors ${
                    newIcon === icon
                      ? 'bg-violet-600 border-violet-500'
                      : 'bg-gray-800 border border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {LIST_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewColor(color)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    newColor === color ? 'ring-2 ring-white scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!newName.trim()}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
