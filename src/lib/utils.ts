import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatComplex(re: number, im: number): string {
  const threshold = 1e-4;
  const absRe = Math.abs(re);
  const absIm = Math.abs(im);

  if (absRe < threshold && absIm < threshold) return "0";
  if (absIm < threshold) return re.toFixed(3);
  if (absRe < threshold) {
    if (Math.abs(im - 1) < threshold) return "i";
    if (Math.abs(im + 1) < threshold) return "-i";
    return `${im.toFixed(3)}i`;
  }

  const sign = im >= 0 ? "+" : "-";
  const imPart = Math.abs(absIm - 1) < threshold ? "i" : `${absIm.toFixed(3)}i`;
  return `${re.toFixed(3)} ${sign} ${imPart}`;
}

export function formatPercentage(val: number): string {
  return `${(val * 100).toFixed(1)}%`;
}

export function getGateColor(type: string): { bg: string; text: string; border: string; glow: string } {
  switch (type) {
    case "H":
      return {
        bg: "bg-cyan-50 hover:bg-cyan-100",
        text: "text-cyan-700",
        border: "border-cyan-400",
        glow: "shadow-sm shadow-cyan-500/20",
      };
    case "X":
    case "Y":
    case "Z":
      return {
        bg: "bg-purple-50 hover:bg-purple-100",
        text: "text-purple-700",
        border: "border-purple-400",
        glow: "shadow-sm shadow-purple-500/20",
      };
    case "S":
    case "T":
    case "Rx":
    case "Ry":
    case "Rz":
      return {
        bg: "bg-pink-50 hover:bg-pink-100",
        text: "text-pink-700",
        border: "border-pink-400",
        glow: "shadow-sm shadow-pink-500/20",
      };
    case "CNOT":
    case "CZ":
    case "CCX":
    case "SWAP":
      return {
        bg: "bg-emerald-50 hover:bg-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-400",
        glow: "shadow-sm shadow-emerald-500/20",
      };
    case "M":
      return {
        bg: "bg-amber-50 hover:bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-400",
        glow: "shadow-sm shadow-amber-500/20",
      };
    case "BARRIER":
      return {
        bg: "bg-slate-100 hover:bg-slate-200",
        text: "text-slate-600",
        border: "border-slate-400",
        glow: "none",
      };
    default:
      return {
        bg: "bg-blue-50 hover:bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-400",
        glow: "shadow-sm shadow-blue-500/20",
      };
  }
}
