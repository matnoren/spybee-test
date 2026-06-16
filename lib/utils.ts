import { Severity, Status } from '@/types';

export const severityConfig: Record<
  Severity,
  { label: string; color: string; bg: string; markerColor: string }
> = {
  low: {
    label: 'Baja',
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.12)',
    markerColor: '#22c55e',
  },
  medium: {
    label: 'Media',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    markerColor: '#f59e0b',
  },
  high: {
    label: 'Alta',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    markerColor: '#ef4444',
  },
};

export const statusConfig: Record<
  Status,
  { label: string; color: string; bg: string }
> = {
  open: {
    label: 'Abierta',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
  },
  'in-progress': {
    label: 'En progreso',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.12)',
  },
  closed: {
    label: 'Cerrada',
    color: '#6b7280',
    bg: 'rgba(107, 114, 128, 0.12)',
  },
};

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}
