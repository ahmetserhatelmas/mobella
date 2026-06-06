import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default function YeniDeneyimPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Yeni Deneyim</h1>
        <p className="text-gray-500 text-sm mt-1">Yeni bir deneyim oluşturun. Kaydettikten sonra tarih ekleyebilirsiniz.</p>
      </div>
      <ExperienceForm />
    </div>
  );
}
