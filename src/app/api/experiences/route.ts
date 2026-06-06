import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("experiences")
      .insert(body)
      .select("id")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
