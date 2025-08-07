import axios, { AxiosInstance, AxiosError } from "axios";
import { OpenMartConfig, OpenMartError } from "./types";
import { SearchNamespace } from "./namespaces";

const DEFAULT_BASE_URL = "https://api.openmart.ai";

export class OpenMart {
  private readonly client: AxiosInstance;
  public readonly search: SearchNamespace;

  constructor(private config: OpenMartConfig) {
    this.client = axios.create({
      baseURL: DEFAULT_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": config.apiKey,
        ...config.headers,
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: AxiosError<any>) => {
        if (error.response) {
          const { status, data } = error.response;
          const errorMessage =
            (data as any)?.detail ||
            (data as any)?.error ||
            (data as any)?.message ||
            error.message ||
            "Unknown error occurred";
          const errorCode = (data as any)?.code || "UNKNOWN_ERROR";
          const errorDetails = (data as any)?.details;

          throw new OpenMartError(
            errorMessage,
            errorCode,
            status,
            errorDetails
          );
        } else if (error.request) {
          throw new OpenMartError(
            "No response received from server",
            "NETWORK_ERROR"
          );
        } else {
          throw new OpenMartError(
            error.message || "Request failed",
            "REQUEST_ERROR"
          );
        }
      }
    );

    // Initialize namespaces
    this.search = new SearchNamespace(this.client);
  }

  /**
   * Update the API key
   * @param apiKey New API key
   */
  updateApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    this.client.defaults.headers.common["X-API-Key"] = apiKey;
  }
}
