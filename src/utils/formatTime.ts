export const formatTime = (t?: string | null) => {
  if (!t) return "—";

  // "00:52:37" → "00:52"
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) {
    return t.slice(0, 5);
  }

  // "00:52"
  if (/^\d{2}:\d{2}$/.test(t)) {
    return t;
  }

  return "—";
};
