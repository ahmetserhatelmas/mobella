import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hesabım — Mobella",
};

export default async function HesabimPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/giris?from=hesabim`);
  }

  // Fetch user's bookings with experience and date details
  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      `
      id,
      booking_ref,
      status,
      num_persons,
      total_price,
      special_requests,
      created_at,
      customer_name,
      customer_email,
      experience_dates (start_date, end_date),
      experiences (name_tr, name_en, slug, cover_image_url, code)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const userName =
    (user.user_metadata?.full_name as string | undefined) ?? "";

  return (
    <DashboardClient
      bookings={(bookings ?? []) as unknown as Parameters<typeof DashboardClient>[0]["bookings"]}
      userEmail={user.email ?? ""}
      userName={userName}
    />
  );
}
