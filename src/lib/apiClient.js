const API_BASE = "https://dummyjson.com";

export function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, value);
  });
  return url.toString();
}

export async function apiFetch(path, { method = "GET", params, body, token } = {}) {
  const url = buildUrl(path, params);
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "API request failed");
  }

  return response.json();
}

export function buildCacheKey(path, params = {}) {
  return `${path}:${JSON.stringify(params)}`;
}

