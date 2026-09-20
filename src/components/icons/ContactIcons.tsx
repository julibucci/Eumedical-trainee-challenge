type ContactIconProps = {
  size?: number;
  className?: string;
};



export function MailIcon({ size = 20, className = "" }: ContactIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="7" width="26" height="18" rx="7" stroke="currentColor" strokeWidth="2.5" />
      <path d="M6.5 10.5 L16 18 L25.5 10.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PhoneIcon({ size = 20, className = "" }: ContactIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <rect x="9" y="3" width="14" height="26" rx="6" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="16" cy="23.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function LocationIcon({ size = 20, className = "" }: ContactIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path
        d="M16 4 C10.5 4 6 8.4 6 13.8 C6 21 16 29 16 29 C16 29 26 21 26 13.8 C26 8.4 21.5 4 16 4 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="14" r="4" fill="currentColor" />
    </svg>
  );
}

export function ClockIcon({ size = 20, className = "" }: ContactIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16 9 V16 L21 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
