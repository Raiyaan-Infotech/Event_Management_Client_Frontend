'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon } from '@iconify/react';
import { Search, X, LayoutGrid } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const COLLECTIONS = [
  { prefix: 'simple-icons', label: 'Social' },
  { prefix: 'lucide',       label: 'Lucide' },
  { prefix: 'mdi',          label: 'Material' },
  { prefix: 'tabler',       label: 'Tabler' },
  { prefix: 'ph',           label: 'Phosphor' },
  { prefix: 'heroicons',    label: 'Heroicons' },
];

function toFieldValue(prefix: string, iconName: string): string {
  if (prefix === 'lucide') {
    return iconName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  }
  return `${prefix}:${iconName}`;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: string) => void;
}

export function IconPickerDialog({ open, onOpenChange, onSelect }: Props) {
  const [collection, setCollection] = useState('simple-icons');
  const [search, setSearch] = useState('');
  const { data: allIcons = [], isLoading, isFetching } = useQuery({
    queryKey: ['iconify-collection', collection],
    queryFn: async () => {
      const response = await fetch(`https://api.iconify.design/collection?prefix=${collection}&pretty=0`);
      if (!response.ok) throw new Error('Failed to load icons');
      const data = await response.json();
      return [
        ...(data.uncategorized || []),
        ...Object.values(data.categories || {}).flatMap(v => v as string[]),
      ] as string[];
    },
    enabled: open,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 1,
  });
  const loading = isLoading || isFetching;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q ? allIcons.filter(n => n.includes(q)) : allIcons;
    return list.slice(0, 240);
  }, [allIcons, search]);

  const handleSelect = (iconName: string) => {
    onSelect(toFieldValue(collection, iconName));
    onOpenChange(false);
    setSearch('');
  };

  const switchCollection = (prefix: string) => {
    setCollection(prefix);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl flex flex-col overflow-y-hidden gap-3 p-4">
        <DialogHeader className="pb-0">
          <DialogTitle className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Icon Picker
          </DialogTitle>
        </DialogHeader>

        {/* Collection tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {COLLECTIONS.map(c => (
            <Button
              key={c.prefix}
              type="button"
              size="sm"
              variant={collection === c.prefix ? 'default' : 'outline'}
              className="h-7 text-xs px-3"
              onClick={() => switchCollection(c.prefix)}
            >
              {c.label}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-9 pr-9"
            placeholder="Search icons..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Icon grid */}
        <ScrollArea className="h-[380px] rounded-md border border-border">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
              Loading icons…
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
              No icons found{search ? ` for "${search}"` : ''}
            </div>
          ) : (
            <div className="grid grid-cols-8 gap-0.5 p-2">
              {filtered.map(name => (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => handleSelect(name)}
                  className="flex flex-col items-center justify-center gap-1 rounded-md p-2 hover:bg-accent transition-colors group"
                >
                  <Icon icon={`${collection}:${name}`} className="h-5 w-5 shrink-0" />
                  <span className="text-[9px] text-muted-foreground truncate w-full text-center group-hover:text-foreground leading-none">
                    {name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        <p className="text-[11px] text-muted-foreground">
          {loading ? 'Loading…' : `Showing ${filtered.length} of ${allIcons.length} icons`}
        </p>
      </DialogContent>
    </Dialog>
  );
}
