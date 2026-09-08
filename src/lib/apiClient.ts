import { getMockResponse } from "./mocks";
import { isMockMode, getApiUrl } from "./env";

export { isMockMode };

export async function fetchAPI<T = unknown>(
  endpoint: string,
  tokenBase64?: string,
  options: RequestInit = {}
): Promise<T> {
  if (isMockMode()) {
    return getMockResponse(endpoint) as T;
  }

  const apiUrl = getApiUrl();

  if (!apiUrl) {
    throw new Error(
      `NEXT_PUBLIC_API_URL no está definida para el entorno "${process.env.ENV}".`
    );
  }

  const url = `${apiUrl}${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (tokenBase64) {
    headers.set("Authorization", `Basic ${tokenBase64}`);
  }

  const response = await fetch(url, { ...options, headers, cache: "no-store" });

  if (!response.ok) {
    let errorMessage = `Error en la API: ${response.status} ${response.statusText}`;
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorJson = await response.json();
        if (errorJson.mensaje) {
          errorMessage = errorJson.mensaje;
        } else if (errorJson.errors && typeof errorJson.errors === "object") {
          const details = Object.entries(errorJson.errors)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
            .join(" | ");
          errorMessage = errorJson.title ? `${errorJson.title} (${details})` : details;
        } else if (errorJson.title) {
          errorMessage = errorJson.title;
        }
      } else {
        const text = await response.text();
        if (text && text.trim().length > 0) {
          errorMessage = text;
        }
      }
    } catch {
      // Usar mensaje fallback
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  if (!text || text.trim().length === 0) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

