import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import type { Experience, ExperienceDate } from "@/lib/supabase/types";

export default async function EditDeneyimPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [expRes, datesRes] = await Promise.all([
    supabase.from("experiences").select("*").eq("id", id).single(),
    supabase.from("experience_dates").select("*").eq("experience_id", id).order("start_date"),
  ]);

  if (!expRes.data) notFound();

  const experience = expRes.data as Experience;
  const dates = (datesRes.data ?? []) as ExperienceDate[];

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{experience.name_tr}</h1>
        <p className="text-gray-500 text-sm mt-1 font-mono">{experience.code}</p>
      </div>
      <ExperienceForm experience={experience} dates={dates} />
    </div>
  );
}
