export function toLocDate(dateString?: string, options?: {hideTime?: boolean}) {
    if (!dateString) return "-";

  const date = new Date(dateString);

  return options?.hideTime
    ? date.toLocaleDateString("id", {
        dateStyle: "medium",
      })
    : date.toLocaleString("id", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}