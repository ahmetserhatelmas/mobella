import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, kvkk_consent } = await req.json();

    if (!email) return NextResponse.json({ error: "E-posta gerekli." }, { status: 400 });
    if (!kvkk_consent) return NextResponse.json({ error: "KVKK onayı gerekli." }, { status: 400 });

    const supabase = await createClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, kvkk_consent: true });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Bu e-posta zaten kayıtlı." }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
