import type { SVGProps } from "react";

// Default Badge icons exported from the Figma design system (MingCute set) via the figmosha bridge.
// Fills are set to currentColor so the color comes from the badge text color token.

type IconProps = SVGProps<SVGSVGElement>;

/** Figma: mgc_left_regular */
export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <g clipPath="url(#chevronlefticon-clip)">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.29303 12.7069C8.10556 12.5193 8.00024 12.265 8.00024 11.9999C8.00024 11.7347 8.10556 11.4804 8.29303 11.2929L13.95 5.63585C14.0423 5.54034 14.1526 5.46416 14.2746 5.41175C14.3966 5.35934 14.5279 5.33176 14.6606 5.3306C14.7934 5.32945 14.9251 5.35475 15.048 5.40503C15.1709 5.45531 15.2825 5.52957 15.3764 5.62346C15.4703 5.71735 15.5446 5.829 15.5949 5.9519C15.6451 6.0748 15.6704 6.20648 15.6693 6.33926C15.6681 6.47204 15.6405 6.60325 15.5881 6.72526C15.5357 6.84726 15.4595 6.95761 15.364 7.04985L10.414 11.9999L15.364 16.9499C15.5462 17.1385 15.647 17.3911 15.6447 17.6533C15.6424 17.9155 15.5373 18.1663 15.3518 18.3517C15.1664 18.5371 14.9156 18.6423 14.6534 18.6445C14.3912 18.6468 14.1386 18.546 13.95 18.3639L8.29303 12.7069Z" fill="currentColor"/>
      </g>
      <defs>
      <clipPath id="chevronlefticon-clip">
      <rect width="24" height="24" fill="currentColor"/>
      </clipPath>
      </defs>
    </svg>
  );
}

/** Figma: mgc_right_regular */
export function ChevronRightIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <g clipPath="url(#chevronrighticon-clip)">
      <path fillRule="evenodd" clipRule="evenodd" d="M15.7071 11.2932C15.8946 11.4807 15.9999 11.735 15.9999 12.0002C15.9999 12.2653 15.8946 12.5197 15.7071 12.7072L10.0501 18.3642C9.95785 18.4597 9.84751 18.5359 9.7255 18.5883C9.6035 18.6407 9.47228 18.6683 9.3395 18.6694C9.20672 18.6706 9.07504 18.6453 8.95215 18.595C8.82925 18.5447 8.7176 18.4705 8.6237 18.3766C8.52981 18.2827 8.45556 18.171 8.40528 18.0481C8.355 17.9252 8.32969 17.7936 8.33085 17.6608C8.332 17.528 8.35959 17.3968 8.412 17.2748C8.46441 17.1528 8.54059 17.0424 8.6361 16.9502L13.5861 12.0002L8.6361 7.05018C8.45394 6.86158 8.35315 6.60898 8.35542 6.34678C8.3577 6.08458 8.46287 5.83377 8.64828 5.64836C8.83369 5.46295 9.0845 5.35778 9.3467 5.35551C9.60889 5.35323 9.8615 5.45402 10.0501 5.63618L15.7071 11.2932Z" fill="currentColor"/>
      </g>
      <defs>
      <clipPath id="chevronrighticon-clip">
      <rect width="24" height="24" fill="currentColor"/>
      </clipPath>
      </defs>
    </svg>
  );
}
