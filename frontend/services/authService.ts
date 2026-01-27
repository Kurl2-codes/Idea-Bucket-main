export interface User {
    id: string;
    name: string;
    email: string;
    department: string;
    userLevel: number;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

const API_URL = process.env.VITE_API_URL || "http://127.0.0.1:8000";

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/api/v1/auth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
    }

    return response.json();
};

export const register = async (name: string, email: string, password: string, department: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, department, userLevel: 2 }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
};

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { "Authorization": `Bearer ${token}` } : {};
};

export const getUsers = async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/api/v1/auth/users`, {
        headers: {
            ...getAuthHeader()
        }
    });

    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
};

export const updateUserLevel = async (userId: string, level: number): Promise<any> => {
    const response = await fetch(`${API_URL}/api/v1/auth/users/${userId}/level?level=${level}`, {
        method: 'PATCH',
        headers: {
            ...getAuthHeader()
        }
    });

    if (!response.ok) throw new Error('Failed to update user level');
    return response.json();
};

export const deleteUser = async (userId: string): Promise<any> => {
    const response = await fetch(`${API_URL}/api/v1/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeader()
        }
    });

    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
};

export const updateUserDetails = async (userId: string, data: Partial<User> & { password?: string }): Promise<any> => {
    const response = await fetch(`${API_URL}/api/v1/auth/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update user details');
    }
    return response.json();
};

