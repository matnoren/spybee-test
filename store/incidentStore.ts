import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Incident, NewIncidentForm, Filters, Coordinates, Severity, Status } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import mockData from '@/public/data/incidents_mock.json';

interface IncidentStore {
  // State
  incidents: Incident[];
  selectedLocation: Coordinates | null;
  selectedIncidentId: string | null;
  filters: Filters;
  isFormOpen: boolean;
  isLoaded: boolean;

  // Actions
  initIncidents: () => void;
  addIncident: (form: NewIncidentForm) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
  setSelectedLocation: (coords: Coordinates | null) => void;
  setSelectedIncidentId: (id: string | null) => void;
  setFilters: (filters: Partial<Filters>) => void;
  setIsFormOpen: (open: boolean) => void;

  // Computed helpers (selectors, not stored)
}

const defaultFilters: Filters = {
  status: 'all',
  severity: 'all',
  search: '',
};

export const useIncidentStore = create<IncidentStore>()(
  persist(
    (set, get) => ({
      incidents: [],
      selectedLocation: null,
      selectedIncidentId: null,
      filters: defaultFilters,
      isFormOpen: false,
      isLoaded: false,

      initIncidents: () => {
        const { isLoaded } = get();
        if (!isLoaded) {
          set({ incidents: mockData as Incident[], isLoaded: true });
        }
      },

      addIncident: (form: NewIncidentForm) => {
        const now = new Date().toISOString();
        const newIncident: Incident = {
          id: uuidv4(),
          sequenceId: String(get().incidents.length + 1).padStart(4, '0'),
          order: get().incidents.length + 1,
          title: form.title,
          description: form.description,
          type: {
            id: uuidv4(),
            key: 'general',
            name: 'General',
            name_en: 'General',
          },
          priority: form.severity,
          status: form.status,
          approval: false,
          project: {
            id: 'local',
            name: 'Mi Proyecto',
          },
          owner: {
            id: 'user-local',
            name: 'Julian Superadmin',
            email: 'julian@spybee.co',
            avatarUrl: 'https://i.pravatar.cc/150?u=julian',
          },
          assignees: [],
          observers: [],
          coordinates: form.coordinates,
          locationDescription: `${form.coordinates.lat.toFixed(5)}, ${form.coordinates.lng.toFixed(5)}`,
          dueDate: null,
          closingDate: null,
          media: [],
          tags: [],
          deleted: null,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          incidents: [newIncident, ...state.incidents],
          isFormOpen: false,
          selectedLocation: null,
        }));
      },

      updateIncident: (id: string, updates: Partial<Incident>) => {
        set((state) => ({
          incidents: state.incidents.map((inc) =>
            inc.id === id ? { ...inc, ...updates, updatedAt: new Date().toISOString() } : inc
          ),
        }));
      },

      deleteIncident: (id: string) => {
        set((state) => ({
          incidents: state.incidents.filter((inc) => inc.id !== id),
          selectedIncidentId: state.selectedIncidentId === id ? null : state.selectedIncidentId,
        }));
      },

      setSelectedLocation: (coords) => set({ selectedLocation: coords }),

      setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),

      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),

      setIsFormOpen: (open) => set({ isFormOpen: open }),
    }),
    {
      name: 'sitemap-incidents',
      partialize: (state) => ({
        incidents: state.incidents,
        isLoaded: state.isLoaded,
      }),
    }
  )
);

// Selector: get filtered incidents
export const selectFilteredIncidents = (state: IncidentStore) => {
  const { incidents, filters } = state;
  return incidents.filter((inc) => {
    const matchStatus = filters.status === 'all' || inc.status === filters.status;
    const matchSeverity = filters.severity === 'all' || inc.priority === filters.severity;
    const matchSearch =
      !filters.search ||
      inc.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      inc.description.toLowerCase().includes(filters.search.toLowerCase());
    return matchStatus && matchSeverity && matchSearch;
  });
};
