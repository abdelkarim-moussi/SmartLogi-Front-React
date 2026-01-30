// User types
export type UserRole = 'ADMIN' | 'MANAGER' | 'CLIENT' | 'LIVREUR';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  nom?: string;
  prenom?: string;
  telephone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Role & Permission types
export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
}

// Package (Colis) types
export type ColisStatus =
  | 'CREE'
  | 'PREPARATION'
  | 'EN_COURS'
  | 'LIVRE'
  | 'RETOURNE'
  | 'ANNULE';

export type ColisPriority = 'EXPRESS' | 'NORMAL';

export interface Produit {
  id: string;
  nom: string;
  quantite: number;
  poids?: number;
}

export interface HistoriqueLivraison {
  id: string;
  status: ColisStatus;
  date: string;
  commentaire?: string;
}

export interface Destinataire {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string | null;
  adresse: string;
}

export interface Zone {
  id: string;
  codePostal: string;
}

export interface Colis {
  id: string;
  poids: number;
  description: string;
  destination: string;
  priority: ColisPriority;
  status: string; // Backend uses different status values like 'IN_STOCK'
  produits: Produit[] | null;
  livreur?: Livreur | null;
  clientExpediteur?: Client;
  destinataire: Destinataire;
  historiqueLivraison: HistoriqueLivraison[];
  zone?: Zone;
  createdAt?: string;
  updatedAt?: string;
}

// Livreur (Delivery Person) types
export interface Livreur {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  vehicule: string;
  zoneId?: string;
}

// Client types
export interface Client {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse?: string;
}

export interface CreateColisFormData {
  poids: number;
  description: string;
  adresse: string;
  villeDestination: string;
  priority: ColisPriority;
  destinataire: string;
  produits: Omit<Produit, 'id'>[];
}

// Navigation types
export interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles?: UserRole[];
}
