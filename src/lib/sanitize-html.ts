const DANGEROUS_TAGS = /<(script|style|iframe|object|embed|link|meta)[^>]*>[\s\S]*?<\/\1>/gi;
const SELF_CLOSING_DANGEROUS_TAGS = /<(script|style|iframe|object|embed|link|meta)[^>]*\/?>/gi;
const EVENT_HANDLER_ATTRS = /\son[a-z]+\s*=\s*(['"]).*?\1/gi;
const JS_PROTOCOL_ATTRS = /\s(href|src)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi;

export function sanitizeHtml(html?: string | null): string {
  if (!html) return "";

  return html
    .replace(DANGEROUS_TAGS, "")
    .replace(SELF_CLOSING_DANGEROUS_TAGS, "")
    .replace(EVENT_HANDLER_ATTRS, "")
    .replace(JS_PROTOCOL_ATTRS, ' $1="#"');
}
