/** Route and public asset paths share Astro's configurable deployment base. */
export function sitePath(path = ''): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
