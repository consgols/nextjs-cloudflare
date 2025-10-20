'use client';

import { FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useState, useMemo, ChangeEvent, useEffect } from 'react';

type PropsType = {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeHolder?: string;
  maxText?: number;
  minText?: number;
  className?: string;
  textRows?: number;
  htmlFor?: string;
};

// Drop this component anywhere in a Next.js (App Router) page.
// It enforces an 800 character limit and shows a live counter below the textarea.
// The helper text nudges users toward the 600–800 ideal range.
export default function TextAreaFieldWithLimit({
  className,
  value,
  maxText,
  minText,
  placeHolder,
  label,
  textRows,
  htmlFor,
  onChange,
}: PropsType) {
  const MAX = maxText ?? 800; // ideal/recommended hard limit
  const MIN_RECOMMENDED = minText ?? 600; // soft guidance (no hard restriction)

  const [about, setAbout] = useState(value);

  useEffect(() => {
    setAbout(value);
  }, [value]);

  const remaining = MAX - about.length;

  const handler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // Hard limit at MAX
    const next = e.target.value.slice(0, MAX);
    setAbout(next);
    onChange(next);
  };

  const counterClass = useMemo(() => {
    // Green when within the recommended range (>= 600 chars)
    if (about.length >= MIN_RECOMMENDED && about.length <= MAX) return 'text-green-700';
    // Warn gently as the user nears the max
    if (remaining <= 40) return 'text-red-600';
    // Neutral/default before reaching the recommended floor
    return 'text-gray-600';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [about.length, remaining]);

  return (
    <FieldGroup className={cn('space-y-2', className)}>
      {label && <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>}

      <Textarea
        id={htmlFor}
        value={about}
        onChange={handler}
        maxLength={MAX}
        rows={textRows ?? 10}
        placeholder={placeHolder}
        className="field-sizing-fixed"
        aria-describedby="about-help about-counter"
      />

      <div className="flex items-baseline justify-between">
        <FieldDescription>
          Tip: Aim for <span className="font-medium">{`${MIN_RECOMMENDED}-${MAX}`}</span>.
        </FieldDescription>
        <FieldDescription className={counterClass} aria-live="polite">
          {about.length} / {MAX}
        </FieldDescription>
      </div>
    </FieldGroup>
  );
}
