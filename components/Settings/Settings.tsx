'use client';

import { useState } from 'react';
import { Bell, Palette, Shield, Building2, CheckCircle2 } from 'lucide-react';
import styles from './Settings.module.scss';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    newIncident: true,
    highPriority: true,
    statusChange: false,
    weeklyReport: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Configuración</h1>
          <p>Torre Acqua — Etapa 2</p>
        </div>
      </div>

      <div className={styles.sections}>

        {/* Proyecto */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Building2 size={15} />
            Proyecto
          </div>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label>Nombre del proyecto</label>
              <input defaultValue="Torre Acqua" className={styles.input} />
            </div>
            <div className={styles.field}>
              <label>Etapa</label>
              <input defaultValue="Etapa 2" className={styles.input} />
            </div>
            <div className={styles.field}>
              <label>Ubicación</label>
              <input defaultValue="Bogotá, Colombia" className={styles.input} />
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Bell size={15} />
            Notificaciones
          </div>
          <div className={styles.toggles}>
            {[
              { key: 'newIncident', label: 'Nueva incidencia creada' },
              { key: 'highPriority', label: 'Incidencia de alta prioridad' },
              { key: 'statusChange', label: 'Cambio de estado' },
              { key: 'weeklyReport', label: 'Reporte semanal' },
            ].map(({ key, label }) => (
              <div key={key} className={styles.toggle}>
                <span>{label}</span>
                <button
                  className={`${styles.toggleBtn} ${notifications[key as keyof typeof notifications] ? styles.on : ''}`}
                  onClick={() =>
                    setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))
                  }
                >
                  <span className={styles.toggleThumb} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Apariencia */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Palette size={15} />
            Apariencia
          </div>
          <div className={styles.field}>
            <label>Tema</label>
            <select className={styles.select} defaultValue="dark">
              <option value="dark">Oscuro</option>
              <option value="light">Claro (próximamente)</option>
            </select>
          </div>
        </div>

        {/* Seguridad */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Shield size={15} />
            Seguridad
          </div>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label>Correo</label>
              <input defaultValue="admin@spybee.com.co" className={styles.input} disabled />
            </div>
            <div className={styles.field}>
              <label>Nueva contraseña</label>
              <input type="password" placeholder="••••••••" className={styles.input} />
            </div>
          </div>
        </div>

        <button className={styles.saveBtn} onClick={handleSave}>
          {saved ? <><CheckCircle2 size={14} /> Guardado</> : 'Guardar cambios'}
        </button>

      </div>
    </div>
  );
}