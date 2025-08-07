// Error Types
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export class OpenMartError extends Error {
  code?: string;
  statusCode?: number;
  details?: any;

  constructor(
    message: string,
    code?: string,
    statusCode?: number,
    details?: any
  ) {
    super(message);
    this.name = "OpenMartError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}