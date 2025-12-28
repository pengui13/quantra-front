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
      defaultHeaders.Authorization = `Bearer ${getCookieValue("access")}`;
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
      throw new Error(errorData?.error?.[0] || "Request failed");
    }

    const data = await response.json();
    onSuccess(data);
    return data;
  } catch (error) {
    onError({ message: error.message });
    throw error; // Re-throw so UnStake can catch it
  }
}
export async function SetFiat({ asset_id }) {
  if (!asset_id) {
    throw new Error("asset_id is required");
  }

  return apiRequest({
    endpoint: `${BASE_URL}auth/set_fiat/`,
    method: "POST",
    body: { asset_id },

    onSuccess: (data) => {
      console.log("Preferred fiat updated:", data);
    },

    onError: (error) => {
      console.error("Failed to set fiat currency", error);
    },
  });
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
export async function ValidateAddress(symbol, address, network, onSuccess, onError) {
  return apiRequest({
    endpoint: `${BASE_URL}assets/validate-address/`,
    method: "POST",
    body: {
      symbol: symbol.toUpperCase().trim(),
      address: address.trim(),
      network: network,
    },
    onSuccess,
    onError,
  });
}
export async function Stake(symbol, amount, onError, onSuccess) {
  return apiRequest({
    endpoint: `${BASE_URL}staking/stake_asset/`,
    method: "POST",
    body: {
      symbol: symbol.toUpperCase().trim(),
      amount: parseFloat(amount),
    },
    onSuccess,
    onError: (errorObj) => {
      let errorMessage = "Staking failed";
      
      if (typeof errorObj === 'string') {
        errorMessage = errorObj;
      } else if (errorObj?.data?.error) {
        const errorData = errorObj.data.error;
        errorMessage = Array.isArray(errorData) ? errorData[0] : errorData;
      } else if (errorObj?.message) {
        errorMessage = errorObj.message;
      }
      
      onError(errorMessage);
    },
  });
}
export async function UnStake(symbol, amount) {
  const response = await apiRequest({
    endpoint: `${BASE_URL}staking/unstake_asset/`,
    method: "POST",
    body: {
      symbol: symbol.toUpperCase().trim(),
      amount: parseFloat(amount),
    },
  });

  return response;
}
export async function Withdraw(symbol, address, network, amount, onSuccess, onError) {
  return apiRequest({
    endpoint: `${BASE_URL}assets/withdraw/`,
    method: "POST",
    body: {
      symbol: symbol.toUpperCase().trim(),
      address: address.trim(),
      network: network.trim(),
      amount: amount.trim(),
    },
    onSuccess,
    onError,
  });
}


export async function GetWithdrawalHistory(symbol, limit, onSuccess, onError) {
  const params = new URLSearchParams();
  if (symbol) params.append("symbol", symbol.toUpperCase().trim());
  if (limit) params.append("limit", limit);

  return apiRequest({
    endpoint: `${BASE_URL}assets/withdrawal-history/?${params.toString()}`,
    method: "GET",
    onSuccess,
    onError,
  });
}


export async function GetWithdrawalStatus(transactionId, onSuccess, onError) {
  return apiRequest({
    endpoint: `${BASE_URL}assets/withdrawal-status/${transactionId}/`,
    method: "GET",
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

export async function GetAssets(setAssets) {
  apiRequest({
    endpoint: `${BASE_URL}assets/?section=fiat`,
    onSuccess: (jsonData) => setAssets(jsonData),
    onError: (error) => console.error("Fetching assets failed", error),
  });
}
export async function FetchChartData(setData) {
  apiRequest({
    endpoint: `${BASE_URL}assets/?section=fiat`,
    onSuccess: (jsonData) => setData(jsonData),
    onError: (error) => console.error("Fetching assets failed", error),
  });
}
export async function GetStakedAssets(setData) {
  apiRequest({
    endpoint: `${BASE_URL}assets/?section=fiat`,
    onSuccess: (jsonData) => setData(jsonData),
    onError: (error) => console.error("Fetching assets failed", error),
  });
}
export async function GetWithdrawAssets(setData) {
  apiRequest({
    endpoint: `${BASE_URL}assets/?section=withdraw`,
    onSuccess: (jsonData) => setData(Array.isArray(jsonData) ? jsonData : []),
    onError: (error) =>
      console.error("Fetching withdraw assets failed", error),
  });
}


export async function GetTransExternalAll(setTrans) {
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
    endpoint: `${BASE_URL}${symbol}/${network}/deposit/`,
    onSuccess: (jsonData) => {
      if (jsonData.address) setDepo(jsonData.address);
      setSpinner(false);
    },
    onError: (error) => console.error("Fetching address failed", error),
  });
}

export async function GetPing(setPing) {
  apiRequest({
    endpoint: `${BASE_URL}auth/ping/`,
    onSuccess: (jsonData) => setPing(jsonData?.message === "pong"),
    onError: () => setPing(false),
  });
}
