'use client';

import { useEffect, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useIncidentStore, selectFilteredIncidents } from '@/store/incidentStore';
import { Severity, Status } from '@/types';
import { severityConfig, statusConfig, formatDate, getInitials } from '@/lib/utils';
import { SeverityBadge, StatusBadge } from '@/components/UI/Badge';
import Sidebar from '@/components/UI/Sidebar';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart2,
  Search,
  Filter,
} from 'lucide-react';
import styles from './Dashboard.module.scss';

const SEVERITY_ORDER: Severity[] = ['high', 'medium', 'low'];
const STATUS_ORDER: Status[] = ['open', 'in-progress', 'closed'];

export default function Dashboard() {
  const {
    initIncidents,
    incidents,
    filters,
    setFilters,
  } = useIncidentStore();
  const filtered = useIncidentStore(selectFilteredIncidents);

  useEffect(() => {
    initIncidents();
  }, [initIncidents]);

  // Metrics
  const totalCount = incidents.length;
  const openCount = incidents.filter((i) => i.status === 'open').length;
  const inProgressCount = incidents.filter((i) => i.status === 'in-progress').length;
  const highCount = incidents.filter((i) => i.priority === 'high').length;

  // Chart data
  const severityData = SEVERITY_ORDER.map((sev) => ({
    name: severityConfig[sev].label,
    value: incidents.filter((i) => i.priority === sev).length,
    color: severityConfig[sev].color,
  }));

  const statusData = STATUS_ORDER.map((s) => ({
    name: statusConfig[s].label,
    value: incidents.filter((i) => i.status === s).length,
    color: statusConfig[s].color,
  }));

  // Timeline: incidents per month
  const timelineData = useMemo(() => {
    const map: Record<string, number> = {};
    incidents.forEach((i) => {
      const d = new Date(i.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .sort()
      .slice(-8)
      .map(([month, count]) => ({
        month: month.slice(5), // MM
        count,
      }));
  }, [incidents]);

  const metricCards = [
    {
      label: 'Total',
      value: totalCount,
      icon: <BarChart2 size={14} />,
      color: '#4f6ef7',
      sub: 'todas las incidencias',
    },
    {
      label: 'Abiertas',
      value: openCount,
      icon: <AlertCircle size={14} />,
      color: '#ef4444',
      sub: `${totalCount ? Math.round((openCount / totalCount) * 100) : 0}% del total`,
    },
    {
      label: 'En progreso',
      value: inProgressCount,
      icon: <Clock size={14} />,
      color: '#8b5cf6',
      sub: 'siendo atendidas',
    },
    {
      label: 'Alta prioridad',
      value: highCount,
      icon: <CheckCircle2 size={14} />,
      color: '#f59e0b',
      sub: 'requieren atención urgente',
    },
  ];

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <h1>Dashboard de Incidencias</h1>
            <p>Torre Acqua — Etapa 2</p>
          </div>
        </div>

        <div className={styles.content}>
          {/* Metrics */}
          <div className={styles.metricsGrid}>
            {metricCards.map((card) => (
              <div key={card.label} className={styles.metricCard}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricLabel}>{card.label}</span>
                  <div
                    className={styles.metricIcon}
                    style={{ background: `${card.color}20`, color: card.color }}
                  >
                    {card.icon}
                  </div>
                </div>
                <div className={styles.metricValue} style={{ color: card.color }}>
                  {card.value}
                </div>
                <div className={styles.metricSub}>{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className={styles.chartsRow}>
            {/* Severity donut */}
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>Por Severidad</div>
              <div className={styles.chartSub}>Distribución de incidencias</div>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {severityData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1a1d24',
                      border: '1px solid #2d3348',
                      borderRadius: 8,
                      fontSize: 12,
                      color: '#e8eaf0',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.legendList}>
                {severityData.map((d) => (
                  <div key={d.name} className={styles.legendItem}>
                    <div className={styles.legendLabel}>
                      <span className={styles.legendDot} style={{ background: d.color }} />
                      {d.name}
                    </div>
                    <div className={styles.legendBar}>
                      <div
                        className={styles.legendBarFill}
                        style={{
                          width: `${totalCount ? (d.value / totalCount) * 100 : 0}%`,
                          background: d.color,
                        }}
                      />
                    </div>
                    <div className={styles.legendValue}>{d.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline bar */}
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>Creadas por mes</div>
              <div className={styles.chartSub}>Últimos 8 meses</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={timelineData} barSize={22}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1f2330"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#4d546a', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#4d546a', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1d24',
                      border: '1px solid #2d3348',
                      borderRadius: 8,
                      fontSize: 12,
                      color: '#e8eaf0',
                    }}
                    cursor={{ fill: '#22262f' }}
                  />
                  <Bar dataKey="count" fill="#4f6ef7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filters */}
          <div className={styles.filtersRow}>
            <div className={styles.searchWrapper}>
              <Search size={13} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Buscar incidencias…"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
              />
            </div>

            <div className={styles.filterGroup}>
              {(['all', 'open', 'in-progress', 'closed'] as const).map((s) => (
                <button
                  key={s}
                  className={`${styles.filterOption} ${filters.status === s ? styles.selected : ''}`}
                  onClick={() => setFilters({ status: s })}
                >
                  {s === 'all' ? 'Todos' : statusConfig[s as Status].label}
                </button>
              ))}
            </div>

            <div className={styles.filterGroup}>
              {(['all', 'high', 'medium', 'low'] as const).map((sev) => (
                <button
                  key={sev}
                  className={`${styles.filterOption} ${filters.severity === sev ? styles.selected : ''}`}
                  onClick={() => setFilters({ severity: sev })}
                >
                  {sev === 'all' ? 'Severidad' : severityConfig[sev as Severity].label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Listado de incidencias</span>
              <span className={styles.tableCount}>{filtered.length} resultados</span>
            </div>

            {filtered.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3>Sin resultados</h3>
                <p>Ajusta los filtros para ver más incidencias.</p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>#</th>
                      <th className={styles.th}>Título</th>
                      <th className={styles.th}>Tipo</th>
                      <th className={styles.th}>Severidad</th>
                      <th className={styles.th}>Estado</th>
                      <th className={styles.th}>Responsable</th>
                      <th className={styles.th}>Creada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 100).map((inc) => (
                      <tr key={inc.id} className={styles.tableRow}>
                        <td className={styles.td}>
                          <span className={styles.seqId}>#{inc.sequenceId}</span>
                        </td>
                        <td className={styles.td}>
                          <span className={styles.titleCell} title={inc.title}>
                            {inc.title}
                          </span>
                        </td>
                        <td className={styles.td}>{inc.type.name}</td>
                        <td className={styles.td}>
                          <SeverityBadge severity={inc.priority} />
                        </td>
                        <td className={styles.td}>
                          <StatusBadge status={inc.status} />
                        </td>
                        <td className={styles.td}>
                          <div className={styles.ownerCell}>
                            {inc.owner?.avatarUrl ? (
                          <img
                            className={styles.avatar}
                            src={inc.owner.avatarUrl}
                            alt={inc.owner.name}
                          />
                            ) : inc.owner ? (
                            <div className={styles.avatarFallback}>
                          {getInitials(inc.owner.name)}
                          </div>
                          ) : (
                            <div className={styles.avatarFallback}>—</div>
                          )}
                            {inc.owner ? inc.owner.name.split(' ')[0] : 'Sin asignar'}
                          </div>
                        </td>
                        <td className={styles.td}>{formatDate(inc.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
