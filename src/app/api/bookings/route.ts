import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function generateRef(): string {
  return "MOB-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      experience_id,
      experience_date_id,
      customer_name,
      customer_email,
      customer_phone,
      num_persons,
      special_requests,
      total_price,
    } = body;

    if (!experience_date_id || !customer_name || !customer_email || !customer_phone) {
      return NextResponse.json({ error: "Eksik bilgi." }, { status: 400 });
    }

    const supabase = await createClient();

    // Check capacity
    const { data: date } = await supabase
      .from("experience_dates")
      .select("max_capacity, booked_count")
      .eq("id", experience_date_id)
      .single();

    if (!date) return NextResponse.json({ error: "Tarih bulunamadı." }, { status: 404 });
    if ((date.booked_count + num_persons) > date.max_capacity) {
      return NextResponse.json({ error: "Yeterli yer yok." }, { status: 409 });
    }

    const { error } = await supabase.from("bookings").insert({
      booking_ref: generateRef(),
      experience_id,
      experience_date_id,
      customer_name,
      customer_email,
      customer_phone,
      num_persons: Number(num_persons),
      special_requests: special_requests || null,
      status: "pending",
      total_price: Number(total_price),
    });

    if (error) throw error;

    // Update booked count
    await supabase
      .from("experience_dates")
      .update({ booked_count: date.booked_count + Number(num_persons) })
      .eq("id", experience_date_id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, experience_dates(start_date, end_date), experiences(name_tr, name_en, code)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
