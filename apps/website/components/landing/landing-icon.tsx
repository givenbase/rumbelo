import { ICON_PATHS, type IconName } from '../../lib/landing-content';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

export function LandingIcon({ name, size = 20, color = 'currentColor', className }: IconProps) {
  const paths = ICON_PATHS[name] ?? [];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
