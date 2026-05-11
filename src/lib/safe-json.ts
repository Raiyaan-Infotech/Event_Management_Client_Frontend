export function safeParseArray<T = unknown>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value !== "string" || !value.trim()) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export interface NormalizedHomeBlock {
  block_type: string;
  variant: string;
  is_visible: boolean;
}

const coerceBoolean = (value: unknown, fallback = true): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
  }
  return fallback;
};

export function normalizeHomeBlocks(value: unknown): NormalizedHomeBlock[] {
  return safeParseArray<Record<string, unknown>>(value)
    .map((block) => {
      const blockType = block.block_type ?? block.blockType ?? block.type ?? block.key;
      if (typeof blockType !== "string" || !blockType.trim()) return null;

      const variant = block.variant ?? block.variant_id ?? block.variantId;

      return {
        block_type: blockType.trim(),
        variant: typeof variant === "string" && variant.trim() ? variant.trim() : "variant_1",
        is_visible: coerceBoolean(block.is_visible ?? block.isVisible ?? block.visible, true),
      };
    })
    .filter((block): block is NormalizedHomeBlock => block !== null);
}
