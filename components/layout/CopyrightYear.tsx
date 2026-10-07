/** Cached so `new Date()` is prerendered once instead of being an unstable value. */
export async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}
