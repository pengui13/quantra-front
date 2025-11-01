import Cookies from "universal-cookie";

const cookies = new Cookies();

export const BASE_URL = "http://127.0.0.1:8000/api/";

export function getCookieValue(name) {
  return cookies.get(name);
}
export function setCookieValue(name, value, options = { path: "/" }) {
  cookies.set(name, value, options);
}

export async function refreshToken() {
  try {
    const refresh = getCookieValue("refresh");
    if (!refresh) return null;

    const response = await fetch(`${BASE_URL}auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) throw new Error("Failed to refresh token");

    const data = await response.json();
    setCookieValue("access", data.access);
    return data.access;
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}

async function apiRequest({
  endpoint,
  method = "GET",
  headers = {},
  body = null,
  onSuccess = () => {},
  onError = (error) => console.error(error),
  skipAuth = false,
}) {
  try {
    const defaultHeaders = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    if (!skipAuth) {
      defaultHeaders.Authorization = `JWT ${getCookieValue("access")}`;
    }

    const mergedHeaders = { ...defaultHeaders, ...headers };

    if (body instanceof FormData) {
      delete mergedHeaders["Content-Type"];
    }

    let response = await fetch(endpoint, {
      method,
      headers: mergedHeaders,
      body:
        body instanceof FormData ? body : body ? JSON.stringify(body) : null,
    });

    // Auto-refresh token if expired
    if (response.status === 401 && !skipAuth) {
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        mergedHeaders.Authorization = `JWT ${newAccessToken}`;
        response = await fetch(endpoint, {
          method,
          headers: mergedHeaders,
          body:
            body instanceof FormData ? body : body ? JSON.stringify(body) : null,
        });
      } else {
        throw new Error("Token refresh failed");
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      onError({ status: response.status, data: errorData });
      return;
    }

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    onError({ message: error.message });
  }
}

export async function registerUser(email, password, onSuccess, onError) {
  return apiRequest({
    endpoint: `${BASE_URL}auth/register/`,
    method: "POST",
    body: { email, password },
    skipAuth: true,
    onSuccess,
    onError,
  });
}

export async function loginUser(email, password, onSuccess, onError) {
  return apiRequest({
    endpoint: `${BASE_URL}auth/token/`,
    method: "POST",
    body: { email, password },
    skipAuth: true,
    onSuccess: (data) => {
      setCookieValue("access", data.access);
      setCookieValue("refresh", data.refresh);
      onSuccess(data);
    },
    onError,
  });
}

// Logout
export function logoutUser() {
  cookies.remove("access");
  cookies.remove("refresh");
}

//
// ==========================
// 💸 Existing business functions
// ==========================
//

export async function DepositPortfolio(setAssets) {
  apiRequest({
    endpoint: `${BASE_URL}assets/`,
    onSuccess: (jsonData) => setAssets(jsonData),
    onError: (error) => console.error("Fetching assets failed", error),
  });
}

export async function GetTransExternalAll(setTrans) {
  apiRequest({
    endpoint: `${BASE_URL}transactions/get_depowith/`,
    onSuccess: (jsonData) => setTrans(jsonData),
    onError: (error) => console.error("Fetching transactions failed", error),
  });
}
export async function Stake(setTrans) {
  apiRequest({
    endpoint: `${BASE_URL}transactions/get_depowith/`,
    onSuccess: (jsonData) => setTrans(jsonData),
    onError: (error) => console.error("Fetching transactions failed", error),
  });
}
export async function GetStakingTx(setTrans) {
  apiRequest({
    endpoint: `${BASE_URL}transactions/get_depowith/`,
    onSuccess: (jsonData) => setTrans(jsonData),
    onError: (error) => console.error("Fetching transactions failed", error),
  });
}

export async function GetPending(setTrans) {
  apiRequest({
    endpoint: `${BASE_URL}transactions/get_depowith/`,
    onSuccess: (jsonData) => setTrans(jsonData),
    onError: (error) => console.error("Fetching transactions failed", error),
  });
}
export async function GetTotalReward(setTrans) {
  apiRequest({
    endpoint: `${BASE_URL}transactions/get_depowith/`,
    onSuccess: (jsonData) => setTrans(jsonData),
    onError: (error) => console.error("Fetching transactions failed", error),
  });
} 
export async function GetStakeAssets(setTrans) {
  apiRequest({
    endpoint: `${BASE_URL}assets?section=stake`,
    onSuccess: (jsonData) => setTrans(jsonData),
    onError: (error) => console.error("Fetching transactions failed", error),
  });
}
export async function getAddress(setDepo, symbol, network, setSpinner) {
  setSpinner(true);
  apiRequest({
    endpoint: `${BASE_URL}assets/${symbol}/${network}/addresses/`,
    onSuccess: (jsonData) => {
      if (jsonData.address) setDepo(jsonData.address);
      setSpinner(false);
    },
    onError: (error) => console.error("Fetching address failed", error),
  });
}
