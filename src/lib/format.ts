export const formatDZD = (n: number): string => `${n.toLocaleString("fr-FR")} DA`;

export const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(" ");
