/**
 * Supabase henüz yapılandırılmamışsa (placeholder URL) anında null döner.
 * Yapılandırılmışsa 5 sn içinde sonuç dönmezse de null döner.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.length > 0 && !url.includes("your-project");
}

export async function safeQuery<T>(
  fn: () => Promise<{ data: T | null; error: unknown }>
): Promise<T | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const result = await Promise.race([
      fn(),
      new Promise<{ data: null; error: string }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: "timeout" }), 5000)
      ),
    ]);
    return result.data;
  } catch {
    return null;
  }
}
