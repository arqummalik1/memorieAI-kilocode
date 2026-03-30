'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useListStore, type ListItem } from '@/store/useListStore';
import { ListItemRow } from './ListItemRow';
import { Button } from '@/components/shared/Button';
import { EmptyState } from '@/components/shared/EmptyState';

function SortableItem({ item }: { item: ListItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ListItemRow
        item={item}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function DraggableList() {
  const params = useParams();
  const listId = params?.id as string;
  const { lists, fetchLists, getListWithItems, addItem, reorderItems, updateItem } =
    useListStore();
  const [newItemText, setNewItemText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [listName, setListName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  const userId =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('sb-auth-token') || '{}')?.user?.id
      : null;

  const list = lists.find((l) => l.id === listId);
  const items = list?.items || [];

  useEffect(() => {
    if (listId) {
      getListWithItems(listId).then((l) => {
        if (l) setListName(l.name);
      });
    }
  }, [listId, getListWithItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !list) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    reorderItems(listId, newItems);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim() || !listId) return;
    addItem(listId, newItemText.trim());
    setNewItemText('');
  };

  const clearCompleted = () => {
    items.filter((i) => i.done).forEach((i) => updateItem(i.id, { done: false }));
    // Actually delete completed items
    items.filter((i) => i.done).forEach((i) => {
      const { deleteItem } = useListStore.getState();
      deleteItem(i.id);
    });
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'active') return !item.done;
    if (filter === 'completed') return item.done;
    return true;
  });

  if (!list) {
    return <EmptyState icon="📝" title="List not found" />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {isEditingName ? (
        <input
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          onBlur={() => setIsEditingName(false)}
          onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
          className="text-2xl font-bold text-white bg-transparent border-b border-violet-500 focus:outline-none mb-6 w-full"
          autoFocus
        />
      ) : (
        <h1
          onClick={() => setIsEditingName(true)}
          className="text-2xl font-bold text-white mb-1 cursor-text"
        >
          <span className="mr-2">{list.icon}</span>
          {listName}
        </h1>
      )}
      <p className="text-sm text-gray-500 mb-6">
        {items.filter((i) => i.done).length}/{items.length} completed
      </p>

      <form onSubmit={handleAddItem} className="mb-4">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="+ Add item (press Enter)"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
        />
      </form>

      <div className="flex gap-2 mb-4">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
              filter === f
                ? 'bg-violet-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredItems.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {filteredItems.map((item) => (
              <SortableItem key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {items.some((i) => i.done) && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <Button variant="ghost" size="sm" onClick={clearCompleted}>
            Clear Completed
          </Button>
        </div>
      )}
    </div>
  );
}
