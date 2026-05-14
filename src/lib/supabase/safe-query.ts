/**
 * Supabase henüz yapılandırılmamışsa (placeholder URL) anında null döner.
 * Yapılandırılmışsa 5 sn içinde sonuç dönmezse de null döner.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.length > 0 && !url.includes("your-project");
}

type SupabaseQueryResult<T> = { data: T | null; error: unknown };

/** Supabase `.from().select()` zinciri `Promise` değil `PromiseLike` döndürür; Vercel build buna takılıyordu. */
export async function safeQuery<T>(
  fn: () => PromiseLike<SupabaseQueryResult<T>>
): Promise<T | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const result = await Promise.race([
      Promise.resolve(fn()),
      new Promise<SupabaseQueryResult<T>>((resolve) =>
        setTimeout(() => resolve({ data: null, error: "timeout" }), 5000)
      ),
    ]);
    return result.data;
  } catch {
    return null;
  }
}
