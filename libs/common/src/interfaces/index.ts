// Shared interfaces for service communication

export interface ServiceRoute {
  baseUrl: string;
  protected: boolean;
}

export interface ProxyOptions {
  baseUrl: string;
  method: string;
  path: string;
  headers: Record<string, any>;
  query: any;
  body: any;
}

export interface ProxyResponse {
  status: number;
  data: any;
  headers: any;
}

export interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}
