interface DangerZoneProps {
  title: string;
  body: string;
  action: string;
  onAction?: () => void;
  disabled?: boolean;
}

export type { DangerZoneProps };
export default DangerZoneProps;
