import type { HTMLAttributes, InputHTMLAttributes } from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  enterKeyHint?: InputHTMLAttributes<HTMLInputElement>['enterKeyHint'];
  disabled?: boolean;
  type?: string;
  name?: string;
}

export function FormField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  autoComplete,
  inputMode,
  enterKeyHint,
  disabled,
  type = 'text',
  name,
}: Props) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="px-1 text-meta text-ink-muted">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        inputMode={inputMode}
        enterKeyHint={enterKeyHint}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        className={`h-[58px] w-full rounded-xl3 border bg-white px-5 text-[16px] leading-[22px] text-ink
          shadow-card outline-none transition-[border-color,box-shadow]
          placeholder:text-ink-subtle
          focus:border-accent focus:ring-2 focus:ring-accent-ring
          disabled:cursor-not-allowed disabled:opacity-70
          ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-line'}`}
      />
      {error && <span className="px-1 text-[12.5px] text-red-600">{error}</span>}
    </label>
  );
}
