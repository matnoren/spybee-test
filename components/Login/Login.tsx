'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import BeeIcon from '@/components/UI/icons/BeeIcon';
import styles from './Login.module.scss';

export default function Login() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        router.replace('/dashboard');
      } else {
        setError('Correo o contraseña incorrectos.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <BeeIcon size={20} />
          </div>
          <span className={styles.logoText}>Spybee Control</span>
        </div>

        <h1 className={styles.title}>Inicia sesión</h1>
        <p className={styles.subtitle}>Gestión de incidencias — Torre Acqua, Etapa 2</p>

        <label className={styles.field}>
          <span>Correo</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@spybee.com.co"
            required
          />
        </label>

        <label className={styles.field}>
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Verificando…' : 'Ingresar'}
        </button>

        <div className={styles.hint}>
          Demo: <code>admin@spybee.com.co</code> / <code>spybee2026</code>
        </div>
      </form>
    </div>
  );
}