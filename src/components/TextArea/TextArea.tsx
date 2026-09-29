import { forwardRef, useId, useState } from "react";
import type { ChangeEvent, ReactNode, TextareaHTMLAttributes } from "react";
import { InformationIcon } from "../Input/icons";
import { ResizeIcon } from "./icons";

// Built from the Figma component set "TextArea" (Published! Design System, node 2933:8245).
// Colors, radius, stroke, shadows, text styles and most sizes come from design tokens.
// Error uses the Figma "Red-danger" mode, the hint the "Grey" mode, like Input.
// Values the design hardcodes and the tokens do not have are collected in NO_TOKEN below.

export type TextAreaSize = "md" | "lg";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Figma `Size`. Default `md`. */
  size?: TextAreaSize;
  /** Text above the field. A `*` is added when `required` is set. */
  label?: ReactNode;
  /** Helper text under the field. Turns red when `error` is set. */
  hint?: ReactNode;
  /** Figma `State=Error`: red border, error shine and a red hint. */
  error?: boolean;
  /** Information icon next to the label. */
  showLabelIcon?: boolean;
  /** Information icon next to the hint. */
  showHintIcon?: boolean;
  /** Shows "count/maxLength" in the corner. Needs `maxLength`. Default true. */
  showCounter?: boolean;
  /** Lets the user drag the corner to change the height (Figma "Resize"). Default true. */
  resizable?: boolean;
}

// Hardcoded in Figma, no design token for them (agreed: keep the Figma value).
const NO_TOKEN = {
  fieldHeight112: "h-[112px]",
  padX14: "px-[14px]",
  icon14: "size-[14px]",
  // Figma sets 60% opacity on the hint of the Disabled state.
  hintOpacity60: "opacity-60",
};

const sizes: Record<TextAreaSize, { radius: string; padX: string; text: string; label: string; required: string; icon: string }> = {
  md: {
    radius: "rounded-ds-md",
    padX: NO_TOKEN.padX14,
    text: "[font:var(--typography-body-sm-regular)]",
    label: "[font:var(--typography-body-xs-regular)]",
    required: "[font:var(--typography-body-xs-medium)]",
    icon: NO_TOKEN.icon14,
  },
  lg: {
    radius: "rounded-ds-lg",
    padX: "px-[var(--spacing-16)]",
    text: "[font:var(--typography-body-md-regular)]",
    label: "[font:var(--typography-body-sm-regular)]",
    required: "[font:var(--typography-body-sm-medium)]",
    icon: "size-[var(--spacing-16)]",
  },
};

const fieldBase =
  "relative box-border flex w-full flex-col overflow-hidden border-solid border-[length:var(--stroke-sm)] " +
  "bg-background-default transition-colors";

// Figma: Focused = primary/5 stroke + Focus shine; Error = Border/theme (Red-danger) + Error shine.
// Disabled keeps the white field and default border; only the content turns grey.
const fieldState = {
  idle: "border-border-default focus-within:border-primary-5 focus-within:shadow-[var(--shadow-focus-shine)]",
  error: "border-border-theme shadow-[var(--shadow-error-shine)]",
  disabled: "border-border-default cursor-not-allowed",
};

const iconSlot = "flex shrink-0 items-center justify-center [&>svg]:size-full";

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    size = "md",
    label,
    hint,
    error = false,
    showLabelIcon = true,
    showHintIcon = true,
    showCounter = true,
    resizable = true,
    disabled,
    required,
    maxLength,
    id,
    value,
    defaultValue,
    onChange,
    className,
    "aria-describedby": describedBy,
    ...props
  },
  ref,
) {
  const autoId = useId();
  const textareaId = id ?? `textarea-${autoId}`;
  const hintId = hint ? `${textareaId}-hint` : undefined;
  const counterId = maxLength !== undefined && showCounter ? `${textareaId}-counter` : undefined;
  const s = sizes[size];
  const state = disabled ? "disabled" : error ? "error" : "idle";

  // Track the length for the counter in both controlled and uncontrolled use.
  const [innerLength, setInnerLength] = useState(String(defaultValue ?? "").length);
  const length = value !== undefined ? String(value).length : innerLength;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInnerLength(event.target.value.length);
    onChange?.(event);
  };

  return (
    <div className={["box-border flex w-full flex-col gap-[var(--spacing-4)]", className].filter(Boolean).join(" ")}>
      {label && (
        <div className="flex items-center gap-[var(--spacing-2)] text-text-default">
          <label htmlFor={textareaId} className={`flex items-center gap-[var(--spacing-1)] ${s.label}`}>
            {label}
            {required && (
              <span aria-hidden="true" className={`text-danger-5 ${s.required}`}>
                *
              </span>
            )}
          </label>
          {showLabelIcon && (
            <span className={`${iconSlot} ${s.icon} text-grey-5`}>
              <InformationIcon />
            </span>
          )}
        </div>
      )}

      <div
        data-theme={error ? "red-danger" : undefined}
        className={[
          fieldBase,
          NO_TOKEN.fieldHeight112,
          s.radius,
          fieldState[state],
          resizable && !disabled ? "resize-y [&::-webkit-resizer]:bg-transparent" : "",
        ].join(" ")}
      >
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={error || undefined}
          aria-describedby={[describedBy, hintId, counterId].filter(Boolean).join(" ") || undefined}
          className={
            `block min-h-0 w-full flex-1 resize-none appearance-none border-0 bg-transparent py-[var(--spacing-10)] ` +
            `outline-none ${s.padX} ${s.text} text-text-default placeholder:text-text-placeholder ` +
            "disabled:cursor-not-allowed disabled:text-text-disabled"
          }
          {...props}
        />
        <div
          className={
            "pointer-events-none flex h-[var(--spacing-20)] shrink-0 items-center justify-end gap-[var(--spacing-2)] " +
            "px-[var(--spacing-8)] [font:var(--typography-body-2xs-medium)]"
          }
        >
          {counterId && (
            <span id={counterId} className={disabled ? "text-text-disabled" : "text-text-placeholder"}>
              <span className={disabled || length === 0 ? "" : "text-text-default"}>{length}</span>/{maxLength}
            </span>
          )}
          {resizable && (
            <span className={`${iconSlot} size-[var(--spacing-12)] ${disabled ? "text-text-disabled" : "text-text-placeholder"}`}>
              <ResizeIcon />
            </span>
          )}
        </div>
      </div>

      {hint && (
        <div
          id={hintId}
          data-theme={error ? "red-danger" : "grey"}
          className={[
            "flex items-center gap-[var(--spacing-2)]",
            s.label,
            disabled ? `text-text-disabled ${NO_TOKEN.hintOpacity60}` : "text-text-theme",
          ].join(" ")}
        >
          {showHintIcon && (
            <span className={`${iconSlot} ${s.icon} ${disabled ? "text-text-disabled" : "text-icon-theme"}`}>
              <InformationIcon />
            </span>
          )}
          <span>{hint}</span>
        </div>
      )}
    </div>
  );
});
