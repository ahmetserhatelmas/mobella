import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: "Geçersiz dosya türü." }, { status: 400 });
    }

    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const supabase = createAdminClient();
    const { error } = await supabase.storage.from("experiences").upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from("experiences").getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Yükleme başarısız." }, { status: 500 });
  }
}
