'use client';

import { useMemo } from 'react';
import { useIncidentStore } from '@/store/incidentStore';
import { Shield, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import styles from './Team.module.scss';

const MOCK_TEAM = [
  { id: 'user-local', name: 'Julian Superadmin', email: 'julian@spybee.co', role: 'Superadmin', avatarUrl: '' },
  { id: 'owner-1', name: 'Ana Gómez', email: 'ana@spybee.co', role: 'Residente de obra', avatarUrl: '' },
  { id: 'owner-2', name: 'Carlos Mejía', email: 'carlos@spybee.co', role: 'Inspector', avatarUrl: '' },
  { id: 'owner-3', name: 'Laura Torres', email: 'laura@spybee.co', role: 'Arquitecta', avatarUrl: '' },
  { id: 'owner-4', name: 'Diego Ríos', email: 'diego@spybee.co', role: 'Ingeniero civil', avatarUrl: '' },
];

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function Team() {
  const incidents = useIncidentStore((s) => s.incidents);

  const members = useMemo(() => {
    return MOCK_TEAM.map((member) => {
      const owned = incidents.filter((i) => i.owner?.id === member.id);
      const open = owned.filter((i) => i.status === 'open').length;
      const inProgress = owned.filter((i) => i.status === 'in-progress').length;
      const closed = owned.filter((i) => i.status === 'closed').length;
      const high = owned.filter((i) => i.priority === 'high').length;
      return { ...member, total: owned.length, open, inProgress, closed, high };
    });
  }, [incidents]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Equipo</h1>
          <p>Torre Acqua — Etapa 2</p>
        </div>
        <div className={styles.badge}>{MOCK_TEAM.length} miembros</div>
      </div>

      <div className={styles.grid}>
        {members.map((member) => (
          <div key={member.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>{getInitials(member.name)}</div>
              <div className={styles.info}>
                <div className={styles.name}>{member.name}</div>
                <div className={styles.role}>
                  <Shield size={11} />
                  {member.role}
                </div>
                <div className={styles.email}>{member.email}</div>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.stats}>
              <div className={styles.stat}>
                <AlertCircle size={13} className={styles.iconOpen} />
                <span>{member.open} abiertas</span>
              </div>
              <div className={styles.stat}>
                <Clock size={13} className={styles.iconProgress} />
                <span>{member.inProgress} en progreso</span>
              </div>
              <div className={styles.stat}>
                <CheckCircle size={13} className={styles.iconClosed} />
                <span>{member.closed} cerradas</span>
              </div>
            </div>

            {member.high > 0 && (
              <div className={styles.highAlert}>
                🔴 {member.high} incidencia{member.high > 1 ? 's' : ''} de alta prioridad
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}