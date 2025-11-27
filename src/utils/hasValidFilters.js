export default function hasValidFilters(filters) {
  if (!filters || typeof filters !== "object") {
    return false;
  }

  return Object.keys(filters).some((key) => {
    const value = filters[key];
    if (typeof value === "string" && value.trim() !== "") return true;
    if (typeof value === "number") return true;
    if (Array.isArray(value) && value.length > 0) return true;
    if (
      typeof value === "object" &&
      value !== null &&
      Object.keys(value).length > 0
    )
      return true;
    return false;
  });
}
