const API_BASE_URL = 'http://localhost:8080/api';

interface RequestOptions extends RequestInit {
    skipAuth?: boolean;
}

class ApiService {
    private getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    }

    private async request<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        const { skipAuth = false, headers = {}, ...restOptions } = options;

        const requestHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            ...headers,
        };

        if (!skipAuth) {
            const token = this.getToken();

            if (token) {
                (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
            }
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...restOptions,
            headers: requestHeaders,
        });


        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.error || `Request failed: ${response.statusText}`);
        }

        // Handle empty responses
        const text = await response.text();
        if (!text) return {} as T;

        const parsed = JSON.parse(text);
        console.log(parsed)
        return parsed as T;
    }

    // Auth endpoints
    async login(email: string, password: string) {
        return this.request<{ token: string; user?: unknown }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            skipAuth: true,
        });
    }

    async register(data: { email: string; password: string; role?: string }) {
        return this.request<{ token: string; user?: unknown }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
            skipAuth: true,
        });
    }

    // Role endpoints
    async getRoles() {
        return this.request<{ id: string; name: string; permissions: unknown[] }[]>('/roles');
    }

    async createRole(name: string) {
        return this.request('/roles', {
            method: 'POST',
            body: JSON.stringify({ name }),
        });
    }

    async deleteRole(roleName: string) {
        return this.request(`/roles/${roleName}`, { method: 'DELETE' });
    }

    // Permission endpoints
    async getPermissions() {
        return this.request<{ id: string; name: string }[]>('/permissions');
    }

    async createPermission(name: string) {
        return this.request('/permissions', {
            method: 'POST',
            body: JSON.stringify({ name }),
        });
    }

    async deletePermission(permissionName: string) {
        return this.request(`/permissions/${permissionName}`, { method: 'DELETE' });
    }

    // Colis endpoints
    async getAllColis() {
        const response = await this.request<{ content: unknown[] } | unknown[]>('/colis');
        // Handle Spring Boot paginated response
        if (response && typeof response === 'object' && 'content' in response) {
            return response.content;
        }
        return Array.isArray(response) ? response : [];
    }

    async getColisById(id: string) {
        return this.request<unknown>(`/colis/${id}`);
    }

    async getMyColis() {
        const response = await this.request<{ content: unknown[] } | unknown[]>('/colis/myColis');
        // Handle Spring Boot paginated response
        if (response && typeof response === 'object' && 'content' in response) {
            return response.content;
        }
        return Array.isArray(response) ? response : [];
    }

    async getColisByUser(userId: string) {
        const response = await this.request<{ content: unknown[] } | unknown[]>(`/colis/user/${userId}`);
        // Handle Spring Boot paginated response
        if (response && typeof response === 'object' && 'content' in response) {
            return response.content;
        }
        return Array.isArray(response) ? response : [];
    }

    async createColis(data: unknown) {
        return this.request('/colis/create', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateColis(id: string, data: unknown) {
        return this.request(`/colis/${id}/update`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async updateColisStatus(id: string, status: string) {
        return this.request(`/colis/${id}/status/${status}`, {
            method: 'PUT',
        });
    }

    async deleteColis(id: string) {
        return this.request(`/colis/${id}/delete`, { method: 'DELETE' });
    }

    // Livreur endpoints
    async getAllLivreurs() {
        const response = await this.request<{ content: unknown[] } | unknown[]>('/livreurs');
        // Handle Spring Boot paginated response
        if (response && typeof response === 'object' && 'content' in response) {
            return response.content;
        }
        return Array.isArray(response) ? response : [];
    }

    async getLivreurById(id: string) {
        return this.request<unknown>(`/livreurs/${id}`);
    }

    async createLivreur(data: unknown) {
        return this.request('/livreurs/create', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateLivreur(id: string, data: unknown) {
        console.log(data)
        return this.request(`/livreurs/${id}/update`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteLivreur(id: string) {
        return this.request(`/livreurs/${id}/delete`, { method: 'DELETE' });
    }

    // Client endpoints
    async getAllClients() {
        const response = await this.request<{ content: unknown[] } | unknown[]>('/clients');
        // Handle Spring Boot paginated response
        if (response && typeof response === 'object' && 'content' in response) {
            return response.content;
        }
        return Array.isArray(response) ? response : [];
    }

    async getClientById(id: string) {
        return this.request<unknown>(`/clients/${id}`);
    }

    async createClient(data: unknown) {
        return this.request('/clients', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async deleteClient(id: string) {
        return this.request(`/clients/${id}`, { method: 'DELETE' });
    }

    // Livraison (assignment) endpoints
    async assignLivreurToColis(colisId: string, livreurId: string) {
        return this.request(`/livraison/${colisId}/livreur/${livreurId}`, {
            method: 'POST',
        });

    }

    async getUsers(){
        return this.request<{ id: string; email: string; roles: unknown[], status: string, createdAt: string }[]>("/users"),{
            method : 'GET'
        }
    }
}

export const api = new ApiService();
export default api;
