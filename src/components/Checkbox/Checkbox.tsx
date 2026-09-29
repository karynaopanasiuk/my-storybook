import { forwardRef, useEffect, useRef } from "react";
import type { InputHTMLAttributes } from "react";
import { CheckIcon, MinusIcon } from "./icons";

// Built from the Figma component set "Checkbox" (Published! Design System, node 2998:6996).
// A native <input type="checkbox"> with appearance-none, so keyboard, forms and a11y work as usual.
// Colors and the 1px stroke come from design tokens; Error uses the Figma "Red-danger" mode.
// Figma "Hovered" is :hover and "Focused" is :focus-visible. Figma draws some strokes as
// 0.625-1.17px; those are scaling artifacts between sizes, so the 1px stroke token is used.

export type CheckboxSize = "xs" | "sm" | "md" | "lg";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Figma `Size`: xs 14px, sm 16px, md 18px, lg 20px. Default `md`. */
  size?: CheckboxSize;
  /** Figma `Type=Indeterminate`: a minus instead of a check. */
  indeterminate?: boolean;
  /** Figma `State=Error`. */
  error?: boolean;
}

// Hardcoded in Figma, no design token for them (agreed: keep the Figma value).
const NO_TOKEN = {
  box14: "size-[14px]",
  box18: "size-[18px]",
  radius4_5: "rounded-[4.5px]",
  radius5: "rounded-[5px]",
  radius5_5: "rounded-[5.5px]",
  glyph9: "size-[9px]",
  glyph11: "size-[11px]",
};

const sizes: Record<CheckboxSize, { box: string; radius: string; glyph: string }> = {
  xs: { box: NO_TOKEN.box14, radius: "rounded-ds-xs", glyph: NO_TOKEN.glyph9 },
  sm: { box: "size-[var(--spacing-16)]", radius: NO_TOKEN.radius4_5, glyph: "size-[var(--spacing-10)]" },
  md: { box: NO_TOKEN.box18, radius: NO_TOKEN.radius5, glyph: NO_TOKEN.glyph11 },
  lg: { box: "size-[var(--spacing-20)]", radius: NO_TOKEN.radius5_5, glyph: "size-[var(--spacing-12)]" },
};

const inputBase =
  "peer m-0 box-border size-full cursor-pointer appearance-none border-solid border-[length:var(--stroke-sm)] " +
  "outline-none transition-colors bg-background-default " +
  // Unchecked: Default / Hovered / Focused
  "enabled:hover:bg-background-default-hover focus-visible:border-border-theme " +
  // Checked and Indeterminate: Default / Hovered / Focused
  "checked:bg-background-theme-filled indeterminate:bg-background-theme-filled " +
  "enabled:checked:hover:bg-background-theme-filled-hover enabled:indeterminate:hover:bg-background-theme-filled-hover " +
  "checked:focus-visible:bg-background-theme-filled-hover indeterminate:focus-visible:bg-background-theme-filled-hover " +
  // Disabled
  "disabled:cursor-not-allowed disabled:bg-background-disabled disabled:border-transparent " +
  "disabled:checked:bg-background-disabled disabled:indeterminate:bg-background-disabled";

// Border per state. Error keeps its (red) border in every type, like Figma.
const borders = {
  normal:
    "border-border-default checked:border-transparent indeterminate:border-transparent " +
    "checked:focus-visible:border-border-theme indeterminate:focus-visible:border-border-theme",
  error: "border-border-theme",
};

const glyphBase =
  "pointer-events-none absolute inset-0 m-auto hidden text-neutral-white peer-disabled:text-text-disabled";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { size = "md", indeterminate = false, error = false, className, ...props },
  ref,
) {
  const inner = useRef<HTMLInputElement>(null);
  const s = sizes[size];

  // `indeterminate` is a DOM property only; it has no HTML attribute.
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const setRef = (node: HTMLInputElement | null) => {
    inner.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <span
      data-theme={error ? "red-danger" : undefined}
      className={["relative inline-flex shrink-0", s.box, className].filter(Boolean).join(" ")}
    >
      <input
        ref={setRef}
        type="checkbox"
        aria-invalid={error || undefined}
        aria-checked={indeterminate ? "mixed" : undefined}
        className={`${inputBase} ${error ? borders.error : borders.normal} ${s.radius}`}
        {...props}
      />
      {indeterminate ? (
        <MinusIcon className={`${glyphBase} ${s.glyph} peer-indeterminate:block`} />
      ) : (
        <CheckIcon className={`${glyphBase} ${s.glyph} peer-checked:block`} />
      )}
    </span>
  );
});
