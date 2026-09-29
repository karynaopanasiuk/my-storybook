import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { InformationIcon } from "./icons";

// Built from the Figma component set "Input" (Published! Design System, node 2732:15558).
// Every value comes from a design token (src/styles/tokens*.css, generated from tokens.json):
// colors as Tailwind theme utilities, sizes as var(--spacing-*) / var(--radius-ds-*), type as
// var(--typography-*). Error uses the Figma "Red-danger" mode, the hint the "Grey" mode.

export type InputSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Figma `Size`. Default `md` (40px). */
  size?: InputSize;
  /** Text above the field. A `*` is added when `required` is set. */
  label?: ReactNode;
  /** Helper text under the field. Turns red when `error` is set. */
  hint?: ReactNode;
  /** Figma `State=Error`: red border, error shine and a red hint. */
  error?: boolean;
  /** Icon at the start of the field (Figma `Show Left Icon`). */
  leftIcon?: ReactNode;
  /** Icon at the end of the field (Figma `Show Right Icon`). */
  rightIcon?: ReactNode;
  /** Information icon next to the label. */
  showLabelIcon?: boolean;
  /** Information icon next to the hint. */
  showHintIcon?: boolean;
}

interface SizeStyles {
  field: string;
  text: string;
  icon: string;
  label: string;
  required: string;
  smallIcon: string;
}

const sizes: Record<InputSize, SizeStyles> = {
  xs: {
    field: "h-[var(--spacing-24)] px-[var(--spacing-10)] py-[var(--spacing-4)] gap-[var(--spacing-4)] rounded-ds-sm",
    text: "[font:var(--typography-body-xs-regular)]",
    icon: "size-[var(--spacing-12)]", // Figma 14px, no token
    label: "[font:var(--typography-body-2xs-regular)]",
    required: "[font:var(--typography-body-2xs-medium)]",
    smallIcon: "size-[var(--spacing-12)]",
  },
  sm: {
    field: "h-[var(--spacing-32)] px-[var(--spacing-12)] py-[var(--spacing-8)] gap-[var(--spacing-4)] rounded-ds-sm", // Figma gap 5px
    text: "[font:var(--typography-body-xs-regular)]",
    icon: "size-[var(--spacing-16)]",
    label: "[font:var(--typography-body-2xs-regular)]",
    required: "[font:var(--typography-body-2xs-medium)]",
    smallIcon: "size-[var(--spacing-12)]",
  },
  md: {
    field: "h-[var(--spacing-40)] px-[var(--spacing-12)] py-[var(--spacing-10)] gap-[var(--spacing-6)] rounded-ds-md", // Figma px 14
    text: "[font:var(--typography-body-sm-regular)]",
    icon: "size-[var(--spacing-16)]", // Figma 18px, no token
    label: "[font:var(--typography-body-xs-regular)]",
    required: "[font:var(--typography-body-xs-medium)]",
    smallIcon: "size-[var(--spacing-12)]", // Figma 14px, no token
  },
  lg: {
    field: "h-[var(--spacing-48)] px-[var(--spacing-16)] py-[var(--spacing-10)] gap-[var(--spacing-8)] rounded-ds-lg",
    text: "[font:var(--typography-body-md-regular)]",
    icon: "size-[var(--spacing-20)]",
    label: "[font:var(--typography-body-sm-regular)]",
    required: "[font:var(--typography-body-sm-medium)]",
    smallIcon: "size-[var(--spacing-16)]",
  },
  xl: {
    field: "h-[var(--spacing-56)] px-[var(--spacing-16)] py-[var(--spacing-10)] gap-[var(--spacing-10)] rounded-ds-xl", // Figma px 18
    text: "[font:var(--typography-body-lg-regular)]",
    icon: "size-[var(--spacing-24)]",
    label: "[font:var(--typography-body-md-regular)]",
    required: "[font:var(--typography-body-md-medium)]",
    smallIcon: "size-[var(--spacing-16)]", // Figma 18px, no token
  },
};

const fieldBase =
  "box-border flex w-full items-center border-solid border-[length:var(--stroke-sm)] " +
  "bg-background-default border-border-default transition-colors";

const fieldState = {
  // Figma State=Hovered / Typing (focus). Filled only changes the text color, which the value does.
  idle:
    "hover:bg-background-default-hover focus-within:border-border-theme " +
    "focus-within:shadow-[var(--shadow-focus-shine)]",
  // Figma State=Error: Border/theme in the Red-danger mode + Error shine.
  error: "hover:bg-background-default-hover border-border-theme shadow-[var(--shadow-error-shine)]",
  // Figma State=Disabled: no stroke, disabled background. Figma also sets opacity 60%, which has
  // no token, so it is left out; the disabled colors come from background/text.disabled.
  disabled: "bg-background-disabled border-transparent cursor-not-allowed",
};

const iconSlot = "flex shrink-0 items-center justify-center [&>svg]:size-full";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = "md",
    label,
    hint,
    error = false,
    leftIcon,
    rightIcon,
    showLabelIcon = true,
    showHintIcon = true,
    disabled,
    required,
    id,
    className,
    "aria-describedby": describedBy,
    ...props
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `input-${autoId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const s = sizes[size];
  const state = disabled ? "disabled" : error ? "error" : "idle";

  return (
    <div
      data-theme={error ? "red-danger" : undefined}
      className={["box-border flex w-full flex-col gap-[var(--spacing-4)]", className].filter(Boolean).join(" ")}
    >
      {label && (
        <div className="flex items-center gap-[var(--spacing-2)] text-text-default">
          <label htmlFor={inputId} className={`flex items-center gap-[var(--spacing-1)] ${s.label}`}>
            {label}
            {required && (
              <span aria-hidden="true" className={`text-danger-5 ${s.required}`}>
                *
              </span>
            )}
          </label>
          {showLabelIcon && (
            <span className={`${iconSlot} ${s.smallIcon} text-grey-5`}>
              <InformationIcon />
            </span>
          )}
        </div>
      )}

      <div className={`${fieldBase} ${s.field} ${fieldState[state]}`}>
        {leftIcon && <span className={`${iconSlot} ${s.icon} text-text-placeholder`}>{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={error || undefined}
          aria-describedby={[describedBy, hintId].filter(Boolean).join(" ") || undefined}
          className={
            `min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 outline-none ${s.text} ` +
            "text-text-default placeholder:text-text-placeholder disabled:cursor-not-allowed disabled:text-text-disabled"
          }
          {...props}
        />
        {rightIcon && <span className={`${iconSlot} ${s.icon} text-text-placeholder`}>{rightIcon}</span>}
      </div>

      {hint && (
        <div
          id={hintId}
          data-theme={error ? "red-danger" : "grey"}
          className={`flex items-center gap-[var(--spacing-2)] ${s.label} ${
            disabled ? "text-text-disabled" : error ? "text-text-theme" : "text-text-dimmed"
          }`}
        >
          {showHintIcon && (
            <span className={`${iconSlot} ${s.smallIcon} ${disabled ? "text-text-disabled" : "text-icon-theme"}`}>
              <InformationIcon />
            </span>
          )}
          <span>{hint}</span>
        </div>
      )}
    </div>
  );
});
