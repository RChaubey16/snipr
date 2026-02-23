import Cookies from "js-cookie";

export function useAuth() {
  const token = Cookies.get("auth_token");

  const logout = () => {
    Cookies.remove("auth_token");
    window.location.href = "/";
  };

  return { isAuthenticated: !!token, token, logout };
}
