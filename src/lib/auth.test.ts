import { getAuthToken } from "./auth";
import { cookies } from "next/headers";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("auth - getAuthToken", () => {
  const originalEnv = process.env.ENV;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env.ENV = originalEnv;
  });

  it("devuelve el token de la cookie si está presente", async () => {
    process.env.ENV = "develop";
    (cookies as jest.Mock).mockResolvedValue({
      get: (name: string) => (name === "authToken" ? { value: "cookie-token-123" } : undefined),
    });

    const token = await getAuthToken();
    expect(token).toBe("cookie-token-123");
  });

  it("devuelve 'mock-token' si no hay cookie pero ENV es develop (isMockMode)", async () => {
    process.env.ENV = "develop";
    (cookies as jest.Mock).mockResolvedValue({
      get: () => undefined,
    });

    const token = await getAuthToken();
    expect(token).toBe("mock-token");
  });

  it("devuelve undefined si no hay cookie y ENV es stg", async () => {
    process.env.ENV = "stg";
    (cookies as jest.Mock).mockResolvedValue({
      get: () => undefined,
    });

    const token = await getAuthToken();
    expect(token).toBeUndefined();
  });

  it("devuelve undefined si no hay cookie y ENV es prod", async () => {
    process.env.ENV = "prod";
    (cookies as jest.Mock).mockResolvedValue({
      get: () => undefined,
    });

    const token = await getAuthToken();
    expect(token).toBeUndefined();
  });
});
