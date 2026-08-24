"use client";

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}) {
  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((id) => id !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  if (options.length === 0) {
    return <p className="text-sm text-text-muted">{placeholder ?? "Nenhuma opção disponível"}</p>;
  }

  return (
    <div className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-xl border border-divider bg-background p-2">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-surface"
        >
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() => toggle(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
