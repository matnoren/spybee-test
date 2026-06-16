'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Map,
  LayoutDashboard,
  Settings,
  Users,
  LogOut,
  ChevronUp,
} from 'lucide-react';
import BeeIcon from './icons/BeeIcon';
import { useAuthStore } from '@/store/authStore';
import styles from './Sidebar.module.scss';

const navItems = [
  { href: '/map', label: 'Mapa', icon: Map },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const secondaryItems = [
  { href: '/team', label: 'Equipo', icon: Users },
  { href: '/settings', label: 'Configuración', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <BeeIcon size={18} />
        </div>
        <span className={styles.logoText}>Spybee Control</span>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>Principal</div>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${pathname === href ? styles.active : ''}`}
          >
            <Icon size={16} />
            <span>{label}</span>
          </Link>
        ))}

        <div className={styles.navSection}>General</div>
        {secondaryItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className={`${styles.navItem} ${pathname === href ? styles.active : ''}`}
          >
            <Icon size={16} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer con dropdown */}
      <div className={styles.footer} ref={menuRef}>

        {/* Dropdown — aparece encima del usuario */}
        {menuOpen && (
          <div className={styles.userMenu}>
            <div className={styles.userMenuHeader}>
              <div className={styles.userMenuAvatar}>{initials}</div>
              <div>
                <div className={styles.userMenuName}>{user?.name}</div>
                <div className={styles.userMenuEmail}>{user?.email}</div>
              </div>
            </div>
            <div className={styles.userMenuDivider} />
            <button className={styles.userMenuLogout} onClick={handleLogout}>
              <LogOut size={14} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}

        {/* Trigger */}
        <button
          className={styles.user}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
        >
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name ?? 'Usuario'}</div>
            <div className={styles.userRole}>{user?.role ?? ''}</div>
          </div>
          <ChevronUp
            size={14}
            className={styles.chevron}
            style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          />
        </button>

      </div>
    </aside>
  );
}