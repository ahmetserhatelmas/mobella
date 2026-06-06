import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const supabase = createAdminClient();
  const { error } = await supabase.from("experience_dates").update(body).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { count } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("experience_date_id", id);

  if (count && count > 0) {
    return NextResponse.json(
      { error: "Bu tarihe ait rezervasyonlar var, silinemez." },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("experience_dates").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
