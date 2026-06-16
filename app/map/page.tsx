import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/Map/MapView'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0b0d',
        color: '#4d546a',
        fontSize: 13,
        gap: 10,
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '2px solid #4f6ef7',
          borderTopColor: 'transparent',
          animation: 'spin 0.8s linear infinite',
          display: 'inline-block',
        }}
      />
      Cargando mapa…
    </div>
  ),
});

export default function MapPage() {
  return <MapView />;
}
