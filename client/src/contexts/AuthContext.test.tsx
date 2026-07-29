import { describe, expect, it, vi } from "vitest"
import { act, renderHook, waitFor } from "@testing-library/react"
import { AuthProvider, useAuth } from "./AuthContext"
import type { User } from "../types/auth"

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  logoutApi: vi.fn(),
  refreshToken: vi.fn(),
  setAccessToken: vi.fn(),
}))

vi.mock("../api/authApi", () => ({
  getCurrentUser: mocks.getCurrentUser,
  logoutApi: mocks.logoutApi,
  refreshToken: mocks.refreshToken,
}))

vi.mock("../api/tokenStore", () => ({
  setAccessToken: mocks.setAccessToken,
  getAccessToken: vi.fn(),
}))

const user: User = {
  id: "u1",
  name: "Jane",
  email: "jane@test.com",
  role: "CUSTOMER",
  createdAt: "2024-01-01",
}

describe("AuthContext", () => {
  it("restores the session on mount when the refresh call succeeds", async () => {
    mocks.refreshToken.mockResolvedValue({ accessToken: "tok1", user })

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(mocks.setAccessToken).toHaveBeenCalledWith("tok1")
    expect(result.current.user).toEqual(user)
  })

  it("clears auth state when the refresh call fails", async () => {
    mocks.refreshToken.mockRejectedValue(new Error("no refresh cookie"))

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(mocks.setAccessToken).toHaveBeenCalledWith(null)
    expect(result.current.user).toBeNull()
  })

  it("login() with a provided user sets state directly, without fetching", async () => {
    mocks.refreshToken.mockRejectedValue(new Error("no session"))
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })
    await waitFor(() => expect(result.current.loading).toBe(false))

    mocks.setAccessToken.mockClear()
    mocks.getCurrentUser.mockClear()

    await act(async () => {
      await result.current.login("tok2", user)
    })

    expect(mocks.setAccessToken).toHaveBeenCalledWith("tok2")
    expect(mocks.getCurrentUser).not.toHaveBeenCalled()
    expect(result.current.user).toEqual(user)
  })

  it("login() without a user fetches the current user instead", async () => {
    mocks.refreshToken.mockRejectedValue(new Error("no session"))
    mocks.getCurrentUser.mockResolvedValue(user)
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.login("tok3")
    })

    expect(mocks.getCurrentUser).toHaveBeenCalled()
    expect(result.current.user).toEqual(user)
  })

  it("logout() clears state even if the API call fails", async () => {
    mocks.refreshToken.mockResolvedValue({ accessToken: "tok1", user })
    mocks.logoutApi.mockRejectedValue(new Error("network error"))

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toEqual(user)

    await act(async () => {
      await result.current.logout()
    })

    expect(mocks.setAccessToken).toHaveBeenLastCalledWith(null)
    expect(result.current.user).toBeNull()
  })
})
