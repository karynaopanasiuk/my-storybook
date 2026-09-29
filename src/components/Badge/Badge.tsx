import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

// Built from the Figma component set "Badge" (Published! Design System, node 2888:13529).
// Colors, radius, stroke and the 10/12/14px text come from design tokens (src/styles/tokens*.css).
// The badge color is a Figma variable mode, applied here as [data-theme="<mode>"].
// Values the design hardcodes and the tokens do not have are collected in NO_TOKEN below.

export type BadgeVariant = "filled" | "light" | "outline" | "default" | "grey" | "dot";
export type BadgeSize = "xs" | "sm" | "md" | "lg" | "xl";
export type BadgeColor = "primary" | "grey" | "danger" | "warning" | "info" | "success" | "violet" | "cyan" | "dark";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Figma `Style`. Default `filled`. */
  variant?: BadgeVariant;
  /** Figma `Size`: xs 16px, sm 18px, md 20px, lg 24px, xl 28px. Default `md`. */
  size?: BadgeSize;
  /**
   * Figma variable mode. Defaults follow Figma: `primary`, `grey` for the grey variant,
   * `success` for the dot variant. Ignored by the `default` variant.
   */
  color?: BadgeColor;
  /** Figma `Circle=True`: a round counter, e.g. a number. */
  circle?: boolean;
  /** Icon before the text (Figma `Show Left Icon`). Not used by the dot and circle badges. */
  leftIcon?: ReactNode;
  /** Icon after the text (Figma `Show Right Icon`). Not used by the dot and circle badges. */
  rightIcon?: ReactNode;
}

// Figma mode names (tokens.modes.css). `primary` is the default mode, so it needs no attribute.
const modes: Record<BadgeColor, string | undefined> = {
  primary: undefined,
  grey: "grey",
  danger: "red-danger",
  warning: "yellow-warning",
  info: "blue-info",
  success: "green-success",
  violet: "violet",
  cyan: "cian",
  dark: "dark",
};

const defaultColor: Partial<Record<BadgeVariant, BadgeColor>> = { grey: "grey", dot: "success" };

const variants: Record<BadgeVariant, { badge: string; icon: string }> = {
  filled: { badge: "bg-background-theme-filled text-neutral-white", icon: "" },
  light: { badge: "bg-background-theme-light text-text-theme", icon: "" },
  // Figma "Grey" is the light style in the Grey mode.
  grey: { badge: "bg-background-theme-light text-text-theme", icon: "" },
  outline: { badge: "border-border-theme text-text-theme", icon: "" },
  default: { badge: "bg-background-default border-border-default text-text-default", icon: "" },
  dot: { badge: "border-border-default text-text-default", icon: "bg-background-theme-filled" },
};
const bordered: BadgeVariant[] = ["outline", "default", "dot"];

// Hardcoded in Figma, no design token for them (agreed: keep the Figma value).
const NO_TOKEN = {
  height18: "h-[18px]",
  height28: "h-[28px]",
  minWidth18: "min-w-[18px]",
  minWidth28: "min-w-[28px]",
  padX5: "px-[5px]",
  padX7: "px-[7px]",
  gap3: "gap-[3px]",
  icon14: "size-[14px]",
  dot5: "size-[5px]",
  dot7: "size-[7px]",
  // Figma text 9px/11px, line height 130%, letter spacing -0.25%. The family matches the tokens.
  text9Medium: "[font:500_9px/1.3_'Inter_Variable'] tracking-[-0.0025em]",
  text11Medium: "[font:500_11px/1.3_'Inter_Variable'] tracking-[-0.0025em]",
  text9SemiBold: "[font:600_9px/1.3_'Inter_Variable'] tracking-[-0.0025em]",
  text11SemiBold: "[font:600_11px/1.3_'Inter_Variable'] tracking-[-0.0025em]",
};

interface SizeStyles {
  height: string;
  width: string; // circle: same as the height
  padX: string;
  gap: string;
  text: string;
  circleText: string;
  icon: string;
  dotWrap: string;
  dot: string;
}

const sizes: Record<BadgeSize, SizeStyles> = {
  xs: {
    height: "h-[var(--spacing-16)]",
    width: "min-w-[var(--spacing-16)]",
    padX: NO_TOKEN.padX5,
    gap: "gap-[var(--spacing-2)]",
    text: NO_TOKEN.text9Medium,
    circleText: NO_TOKEN.text9SemiBold,
    icon: "size-[var(--spacing-10)]",
    dotWrap: "size-[var(--spacing-10)]",
    dot: NO_TOKEN.dot5,
  },
  sm: {
    height: NO_TOKEN.height18,
    width: NO_TOKEN.minWidth18,
    padX: "px-[var(--spacing-6)]",
    gap: "gap-[var(--spacing-2)]",
    text: "[font:var(--typography-body-2xs-medium)]",
    circleText: "[font:var(--typography-body-2xs-semibold)]",
    icon: "size-[var(--spacing-10)]",
    dotWrap: "size-[var(--spacing-10)]",
    dot: NO_TOKEN.dot5,
  },
  md: {
    height: "h-[var(--spacing-20)]",
    width: "min-w-[var(--spacing-20)]",
    padX: NO_TOKEN.padX7,
    gap: "gap-[var(--spacing-2)]",
    text: NO_TOKEN.text11Medium,
    circleText: NO_TOKEN.text11SemiBold,
    icon: "size-[var(--spacing-10)]",
    dotWrap: "size-[var(--spacing-10)]",
    dot: NO_TOKEN.dot5,
  },
  lg: {
    height: "h-[var(--spacing-24)]",
    width: "min-w-[var(--spacing-24)]",
    padX: "px-[var(--spacing-8)]",
    gap: NO_TOKEN.gap3,
    text: "[font:var(--typography-body-xs-medium)]",
    circleText: "[font:var(--typography-body-xs-semibold)]",
    icon: "size-[var(--spacing-12)]",
    dotWrap: "size-[var(--spacing-12)]",
    dot: "size-[var(--spacing-6)]",
  },
  xl: {
    height: NO_TOKEN.height28,
    width: NO_TOKEN.minWidth28,
    padX: "px-[var(--spacing-10)]",
    gap: "gap-[var(--spacing-4)]",
    text: "[font:var(--typography-body-sm-medium)]",
    circleText: "[font:var(--typography-body-sm-semibold)]",
    icon: NO_TOKEN.icon14,
    dotWrap: NO_TOKEN.icon14,
    dot: NO_TOKEN.dot7,
  },
};

const iconSlot = "flex shrink-0 items-center justify-center [&>svg]:size-full";

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "filled", size = "md", color, circle = false, leftIcon, rightIcon, className, children, ...props },
  ref,
) {
  const s = sizes[size];
  const v = variants[variant];
  const mode = variant === "default" ? undefined : modes[color ?? defaultColor[variant] ?? "primary"];

  const classes = [
    "box-border inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-ds-rounded",
    bordered.includes(variant) && "border-solid border-[length:var(--stroke-sm)]",
    v.badge,
    s.height,
    circle ? `${s.width} px-[var(--spacing-4)] ${s.circleText}` : `${s.padX} ${s.gap} ${s.text}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span ref={ref} data-theme={mode} className={classes} {...props}>
      {!circle && variant === "dot" && (
        <span className={`${iconSlot} ${s.dotWrap}`} aria-hidden="true">
          <span className={`${s.dot} rounded-ds-rounded ${v.icon}`} />
        </span>
      )}
      {!circle && variant !== "dot" && leftIcon && <span className={`${iconSlot} ${s.icon}`}>{leftIcon}</span>}
      {children}
      {!circle && variant !== "dot" && rightIcon && <span className={`${iconSlot} ${s.icon}`}>{rightIcon}</span>}
    </span>
  );
});
