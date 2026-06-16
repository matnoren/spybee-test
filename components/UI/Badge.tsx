import React from 'react';
import { Severity, Status } from '@/types';
import { severityConfig, statusConfig } from '@/lib/utils';
import styles from './Badge.module.scss';

interface SeverityBadgeProps {
  severity: Severity;
}

interface StatusBadgeProps {
  status: Status;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const cfg = severityConfig[severity] ?? { label: severity, color: '#8b92a8', bg: 'rgba(139,146,168,0.12)' };
  return (
    <span
      className={styles.badge}
      style={{ color: cfg.color, background: cfg.bg }}
    >
      <span className={styles.dot} style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status] ?? { label: status, color: '#8b92a8', bg: 'rgba(139,146,168,0.12)' };
  return (
    <span
      className={styles.badge}
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}
