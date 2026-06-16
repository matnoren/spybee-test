type BeeIconProps = {
  size?: number;
  className?: string;
};

export default function BeeIcon({ size = 24, className }: BeeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="6.5" r="2" />
      <path d="M10.5 4.5 9 2.5" />
      <path d="M13.5 4.5 15 2.5" />
      <ellipse cx="7.5" cy="10" rx="3" ry="2" transform="rotate(-25 7.5 10)" />
      <ellipse cx="16.5" cy="10" rx="3" ry="2" transform="rotate(25 16.5 10)" />
      <path d="M8 13c0-2.2 1.8-4 4-4s4 1.8 4 4v3c0 2.2-1.8 4-4 4s-4-1.8-4-4v-3z" />
      <path d="M8 12.5h8" />
      <path d="M8.3 16h7.4" />
      <path d="M12 20v1.5" />
    </svg>
  );
}