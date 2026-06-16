'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useIncidentStore, selectFilteredIncidents } from '@/store/incidentStore';
import { Incident } from '@/types';
import { severityConfig, statusConfig, formatDate } from '@/lib/utils';
import IncidentFormModal from '@/components/IncidentForm/IncidentFormModal';
import Sidebar from '@/components/UI/Sidebar';
import { MousePointerClick, Navigation, AlertCircle } from 'lucide-react';
import styles from './MapView.module.scss';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const {
    initIncidents,
    setSelectedLocation,
    setIsFormOpen,
    isFormOpen,
    selectedLocation,
    incidents,
  } = useIncidentStore();

  const filteredIncidents = useIncidentStore(selectFilteredIncidents);

  const [mapReady, setMapReady] = useState(false);

  // init
  useEffect(() => {
    initIncidents();
  }, [initIncidents]);

  // build map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.058399, 4.653031],
      zoom: 15,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    map.on('load', () => {
      setMapReady(true);
    });

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      setSelectedLocation({ lat, lng });
      setIsFormOpen(true);
    });

    map.getCanvas().style.cursor = 'crosshair';

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // sync markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const currentIds = new Set(filteredIncidents.map((i) => i.id));

    // remove stale markers
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // add new markers
    filteredIncidents.forEach((incident) => {
      if (markersRef.current.has(incident.id)) return;

      const cfg = severityConfig[incident.priority] ?? { markerColor: '#8b92a8' };
      const el = createMarkerEl(incident, cfg.markerColor);

      const popup = new mapboxgl.Popup({
        offset: 14,
        closeButton: true,
        maxWidth: '300px',
      }).setHTML(buildPopupHtml(incident));

      const marker = new mapboxgl.Marker(el)
        .setLngLat([incident.coordinates.lng, incident.coordinates.lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      markersRef.current.set(incident.id, marker);
    });
  }, [filteredIncidents, mapReady]);

  return (
    <div className={styles.mapLayout}>
      <Sidebar />

      <div className={styles.mapContainer}>
        <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

        {/* Top bar */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <div className={styles.projectBadge}>
              <span className={styles.dot} />
              Torre Acqua — Etapa 2
            </div>
            <div className={styles.hintBadge}>
              <MousePointerClick size={13} />
              Clic en el mapa para crear incidencia
            </div>
          </div>
          <div className={styles.topBarRight}>
            <button
              className={`${styles.topBtn} ${styles.primary}`}
              onClick={() => {
                if (mapRef.current) {
                  const center = mapRef.current.getCenter();
                  setSelectedLocation({ lat: center.lat, lng: center.lng });
                  setIsFormOpen(true);
                }
              }}
            >
              <AlertCircle size={14} />
              Nueva incidencia
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className={styles.statsBar}>
          {(['high', 'medium', 'low'] as const).map((sev) => {
            const count = filteredIncidents.filter((i) => i.priority === sev).length;
            const cfg = severityConfig[sev];
            return (
              <div key={sev} className={styles.statPill}>
                <span className={styles.statDot} style={{ background: cfg.markerColor }} />
                <span className={styles.statCount}>{count}</span>
                <span className={styles.statLabel}>{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {isFormOpen && selectedLocation && (
        <IncidentFormModal
          coordinates={selectedLocation}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedLocation(null);
          }}
        />
      )}
    </div>
  );
}

function createMarkerEl(incident: Incident, color: string): HTMLDivElement {
  const el = document.createElement('div');
  el.style.cssText = `
    width: 32px;
    height: 32px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    background: ${color};
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    cursor: pointer;
    transition: transform 150ms ease, box-shadow 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  el.addEventListener('mouseenter', () => {
    el.style.transform = 'rotate(-45deg) scale(1.15)';
    el.style.boxShadow = `0 4px 16px ${color}66`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'rotate(-45deg) scale(1)';
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';
  });

  return el;
}

function buildPopupHtml(inc: Incident): string {
  const fallbackCfg = { label: '—', color: '#8b92a8', bg: 'rgba(139,146,168,0.12)', markerColor: '#8b92a8' };
  const sevCfg = severityConfig[inc.priority] ?? { ...fallbackCfg, label: inc.priority };
  const staCfg = statusConfig[inc.status] ?? { ...fallbackCfg, label: inc.status };
  return `
    <div style="padding:16px;min-width:240px">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px">
        <span style="font-size:10px;color:#8b92a8;font-family:monospace">#${inc.sequenceId}</span>
        <div style="display:flex;gap:6px">
          <span style="padding:2px 8px;border-radius:99px;font-size:11px;font-weight:500;color:${sevCfg.color};background:${sevCfg.bg}">${sevCfg.label}</span>
          <span style="padding:2px 8px;border-radius:99px;font-size:11px;font-weight:500;color:${staCfg.color};background:${staCfg.bg}">${staCfg.label}</span>
        </div>
      </div>
      <div style="font-size:14px;font-weight:600;color:#e8eaf0;margin-bottom:6px;line-height:1.4">${inc.title}</div>
      <div style="font-size:12px;color:#8b92a8;line-height:1.5;margin-bottom:10px">${inc.description.slice(0, 100)}${inc.description.length > 100 ? '…' : ''}</div>
      <div style="font-size:11px;color:#4d546a;display:flex;align-items:center;gap:4px">
        📍 ${inc.locationDescription || ''}
      </div>
      <div style="font-size:11px;color:#4d546a;margin-top:4px">
        ${formatDate(inc.createdAt)}
      </div>
    </div>
  `;
}
