import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { experience_id, start_date, end_date, price_per_person, max_capacity } = await req.json();

    if (!experience_id || !start_date || !end_date || !price_per_person) {
      return NextResponse.json({ error: "Eksik bilgi." }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("experience_dates").insert({
      experience_id,
      start_date,
      end_date,
      price_per_person: Number(price_per_person),
      max_capacity: Number(max_capacity ?? 12),
      booked_count: 0,
      is_active: true,
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
