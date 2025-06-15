import { cn } from "@/lib/utils";

export default function ToggleSwitch({ checked, onChange, leftLabel, rightLabel }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("text-sm font-medium", !checked && "text-indigo-600")}>{leftLabel}</span>
      <button
        type="button"
        className={cn(
          "relative inline-flex h-8 w-16 rounded-full transition-colors duration-300 focus:outline-none",
          checked ? "bg-indigo-400" : "bg-indigo-200"
        )}
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
      >
        <span
          className={cn(
            "absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300",
            checked ? "translate-x-8" : "translate-x-0"
          )}
        />
      </button>
      <span className={cn("text-sm font-medium", checked && "text-indigo-600")}>{rightLabel}</span>
    </div>
  );
}