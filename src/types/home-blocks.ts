import * as Icons from 'lucide-react';

export interface HomeBlock {
  block_type: string;
  variant: string;
  is_visible: boolean;
}

export interface BlockVariant {
  id: string;
  label: string;
}

export interface BlockCatalogEntry {
  block_type: string;
  label: string;
  icon: string;
  description: string;
  variants: BlockVariant[];
}

export function resolveIcon(iconName: string): Icons.LucideIcon {
  // @ts-ignore
  const Icon = Icons[iconName] || Icons.HelpCircle;
  return Icon;
}
