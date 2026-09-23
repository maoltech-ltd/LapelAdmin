export interface CatalogHeader {
  name: string;
  description: string;
  required: boolean;
  sample: string;
}

export interface ApiCatalogEndpoint {
  id: string;
  method: string;
  path: string;
  description: string;
  category: string;
  headers: CatalogHeader[];
  sampleBody?: string | null;
  sideEffectNote?: string | null;
  authNote?: string | null;
}

export interface ApiCatalogService {
  key: string;
  name: string;
  description: string;
  baseUrl: string;
  endpoints: ApiCatalogEndpoint[];
}

export interface ConsoleExecuteRequest {
  serviceKey: string;
  method: string;
  path: string;
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
  body?: unknown;
}

export interface ConsoleExecuteResult {
  requestUrl: string;
  requestMethod: string;
  status: number;
  responseHeaders: Record<string, string>;
  responseBody: string | null;
  durationMs: number;
  error?: string | null;
}

export interface ApiLogEntry {
  id: string;
  requestMethod: string;
  requestUrl: string;
  requestHeaders: string;
  requestBody: string | null;
  responseStatus: string;
  responseHeaders: string;
  responseBody: string | null;
  microserviceName: string;
  calledMethod: string;
  processingTimeMs: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  code: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
