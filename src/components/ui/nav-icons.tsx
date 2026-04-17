type IconProps = {
  className?: string;
};

export function DashboardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M4 5h7v6H4V5Zm9 0h7v4h-7V5ZM4 13h7v6H4v-6Zm9-2h7v8h-7v-8Z" fill="currentColor" />
    </svg>
  );
}

export function ProjectsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h3.4l1.6 2H17.5A2.5 2.5 0 0 1 20 9.5v7A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LogoutIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M10 4.75A2.75 2.75 0 0 0 7.25 7.5v9A2.75 2.75 0 0 0 10 19.25h4.5a.75.75 0 0 0 0-1.5H10c-.69 0-1.25-.56-1.25-1.25v-9c0-.69.56-1.25 1.25-1.25h4.5a.75.75 0 0 0 0-1.5H10Zm5.47 4.22a.75.75 0 0 0 0 1.06l1.22 1.22H12a.75.75 0 0 0 0 1.5h4.69l-1.22 1.22a.75.75 0 1 0 1.06 1.06l2.5-2.5a.75.75 0 0 0 0-1.06l-2.5-2.5a.75.75 0 0 0-1.06 0Z"
        fill="currentColor"
      />
    </svg>
  );
}