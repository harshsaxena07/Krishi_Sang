import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "user_location";

function readStoredLocation() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    const lat = Number(parsed?.lat);
    const lng = Number(parsed?.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return { lat, lng };
  } catch (err) {
    console.error("Unable to read saved location:", err);
    return null;
  }
}

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLocation = useCallback(() => {
    const storedLocation = readStoredLocation();
    setLocation(storedLocation);
    setLoading(false);
    return storedLocation;
  }, []);

  const saveLocation = useCallback((nextLocation) => {
    const lat = Number(nextLocation?.lat);
    const lng = Number(nextLocation?.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    const normalizedLocation = { lat, lng };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedLocation));
    setLocation(normalizedLocation);
    setLoading(false);
    return normalizedLocation;
  }, []);

  const clearLocation = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLocation(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return {
    lat: location?.lat ?? null,
    lng: location?.lng ?? null,
    loading,
    getLocation,
    saveLocation,
    clearLocation,
  };
}
