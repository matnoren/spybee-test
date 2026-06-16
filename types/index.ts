export type Severity = 'low' | 'medium' | 'high';
export type Status = 'open' | 'in-progress' | 'closed';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface IncidentType {
  id: string;
  key: string;
  name: string;
  name_en: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Media {
  id: string;
  name: string;
  type: 'image' | 'video';
  format: string;
  size: number;
  status: string;
  url: string;
}

export interface Incident {
  id: string;
  sequenceId: string;
  order: number;
  title: string;
  description: string;
  type: IncidentType;
  priority: Severity;
  status: Status;
  approval: boolean;
  project: {
    id: string;
    name: string;
  };
  owner: User;
  assignees: User[];
  observers: User[];
  coordinates: Coordinates;
  locationDescription: string;
  dueDate: string | null;
  closingDate: string | null;
  media: Media[];
  tags: Tag[];
  deleted: null;
  createdAt: string;
  updatedAt: string;
}

// Form data for creating new incidents
export interface NewIncidentForm {
  title: string;
  description: string;
  severity: Severity;
  status: Status;
  coordinates: Coordinates;
}

export interface Filters {
  status: Status | 'all';
  severity: Severity | 'all';
  search: string;
}
