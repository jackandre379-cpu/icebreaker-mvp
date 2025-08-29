/**
 * Convert raw lat/lng into a coarse "venue bucket" string.
 * This avoids storing exact location. We round to ~0.002 degrees (~200m).
 */
export function venueBucketFromLatLng(lat, lng, precision = 3) {
  const round = (v, p) => Number(v).toFixed(p);
  // precision=3 -> ~0.001 degrees; adjust as needed
  return `${round(lat, precision)}:${round(lng, precision)}`;
}
