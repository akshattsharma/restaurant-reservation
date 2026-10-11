const BASE = "https://restaurantdata.onrender.com";

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

const toOptions = (data) =>
  (Array.isArray(data) ? data : [])
    .map((x) => (typeof x === "string" ? x : x?.name ?? Object.values(x ?? {})[0]))
    .filter(Boolean)
    .map(String);

export const fetchStates = async () => toOptions(await get("/states"));
export const fetchCities = async (state) =>
  toOptions(await get(`/cities/${encodeURIComponent(state)}`));

// Field names can vary in casing/spacing, so match them loosely.
const norm = (k) => k.toLowerCase().replace(/[^a-z0-9]/g, "");
const pick = (obj, keys) => {
  const m = {};
  Object.keys(obj).forEach((k) => (m[norm(k)] = obj[k]));
  for (const k of keys) if (m[k] !== undefined && m[k] !== null) return m[k];
  return "";
};

export async function fetchRestaurants(state, city) {
  const data = await get(
    `/restaurants?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`
  );
  return (Array.isArray(data) ? data : []).map((r, i) => {
    const name = String(pick(r, ["restaurantname", "name"]));
    const address = String(pick(r, ["address"]));
    return {
      id: String(pick(r, ["id", "_id"]) || `${name}-${address}-${i}`),
      name,
      address,
      city: String(pick(r, ["city"])) || city,
      state: String(pick(r, ["state"])) || state,
      rating: pick(r, ["overallrating", "rating"]),
    };
  });
}