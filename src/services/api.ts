import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Interceptor de Requisição: Injetar token JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('potiguara_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta: Tratar erros comuns de forma amigável
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;

      if (status === 401) {
        console.warn('Sessão expirada ou não autorizada (401).');
        // Pode limpar token se inválido
      } else if (status === 404) {
        console.warn('Recurso não encontrado no servidor Spring Boot (404).', message);
      } else if (status >= 500) {
        console.error('Erro interno no servidor Spring Boot (500):', message);
      }
    } else if (error.request) {
      console.warn('Servidor Spring Boot em http://localhost:8080 ainda não está acessível ou inicializando.');
    }
    return Promise.reject(error);
  }
);

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await axios.get(`${BASE_URL}/api/auth/me`, { timeout: 2000 });
    return res.status >= 200 && res.status < 500;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      // Se respondeu 401 ou 403, significa que o servidor está rodando!
      return true;
    }
    return false;
  }
}
