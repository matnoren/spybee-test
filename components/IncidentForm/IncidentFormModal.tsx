'use client';

import { useState } from 'react';
import { Coordinates, Severity, Status } from '@/types';
import { useIncidentStore } from '@/store/incidentStore';
import { AlertCircle, X, MapPin, CheckCircle2 } from 'lucide-react';
import styles from './IncidentFormModal.module.scss';

interface Props {
  coordinates: Coordinates;
  onClose: () => void;
}

interface FormState {
  title: string;
  description: string;
  severity: Severity;
  status: Status;
}

const initialForm: FormState = {
  title: '',
  description: '',
  severity: 'medium',
  status: 'open',
};

export default function IncidentFormModal({ coordinates, onClose }: Props) {
  const addIncident = useIncidentStore((s) => s.addIncident);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = 'El título es requerido';
    if (!form.description.trim()) errs.description = 'La descripción es requerida';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500)); // simulate async
    addIncident({ ...form, coordinates });
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleChange =
    <K extends keyof FormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <AlertCircle size={17} />
            </div>
            <div className={styles.headerText}>
              <h2>Nueva incidencia</h2>
              <p>
                {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.coordsBadge}>
            <MapPin size={12} />
            Ubicación: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </div>

          <div className={styles.field}>
            <label>
              Título <span>*</span>
            </label>
            <input
              className={styles.input}
              type="text"
              placeholder="ej. Fuga en montante de aguas residuales"
              value={form.title}
              onChange={handleChange('title')}
              autoFocus
            />
            {errors.title && <p className={styles.error}>{errors.title}</p>}
          </div>

          <div className={styles.field}>
            <label>
              Descripción <span>*</span>
            </label>
            <textarea
              className={styles.input}
              placeholder="Describe la incidencia con el máximo detalle posible…"
              value={form.description}
              onChange={handleChange('description')}
            />
            {errors.description && <p className={styles.error}>{errors.description}</p>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Severidad</label>
              <select className={styles.select} value={form.severity} onChange={handleChange('severity')}>
                <option value="low">🟢 Baja</option>
                <option value="medium">🟡 Media</option>
                <option value="high">🔴 Alta</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Estado</label>
              <select className={styles.select} value={form.status} onChange={handleChange('status')}>
                <option value="open">Abierta</option>
                <option value="in-progress">En progreso</option>
                <option value="closed">Cerrada</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.btnSave} onClick={handleSave} disabled={saving || saved}>
            {saved ? (
              <>
                <CheckCircle2 size={14} />
                Guardada
              </>
            ) : saving ? (
              'Guardando…'
            ) : (
              'Crear incidencia'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
