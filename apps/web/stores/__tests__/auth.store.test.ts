import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "../auth.store";
import { apiClient } from "@/lib/api-client";

jest.mock("@/lib/api-client", () => ({
  apiClient: { post: jest.fn() },
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("useAuthStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    useAuthStore.setState({
      user: null, accessToken: null, isAuthenticated: false, isLoading: false, error: null,
    });
  });

  it("should login successfully", async () => {
    const mockResponse = { accessToken: "token", user: { id: "1", email: "test@example.com", roles: ["ADMIN"] } };
    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useAuthStore());
    await act(async () => { await result.current.login("test@example.com", "password123"); });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockResponse.user);
  });

  it("should logout and clear state", () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => { useAuthStore.setState({ user: { id: "1", email: "test@example.com", roles: [] }, accessToken: "token", isAuthenticated: true }); });
    act(() => { result.current.logout(); });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
