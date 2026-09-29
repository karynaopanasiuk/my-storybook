import type { SVGProps } from "react";

// Resize grip exported from the Figma design system (TextArea "Resize") via the figmosha bridge.
// The stroke is set to currentColor so the color comes from a token class; the 0.6 group
// opacity is part of the Figma asset.

/** Figma: TextArea / Corner / Resize */
export function ResizeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false" {...props}>
      <g opacity="0.6">
        <path d="M3 9L9 3M7 9L10 6" stroke="currentColor" strokeLinecap="round" />
      </g>
    </svg>
  );
}
