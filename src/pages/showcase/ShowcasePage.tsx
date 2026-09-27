import type { FormEvent } from "react";
import { Save } from "lucide-react";
import ShowcaseHero from "./ShowcaseHero";
import GarmentGallery from "./GarmentGallery";
import useShowcase from "./useShowcase";

export default function ShowcasePage() {
  const { showcase, setShowcase, updatePhoto, save } = useShowcase();
  const handleSave = (event: FormEvent<HTMLFormElement>) => save(event);
  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f6f2] text-[#19251f]">
      <form onSubmit={handleSave}>
        <ShowcaseHero
          data={showcase}
          onPhoto={updatePhoto}
          onName={(ownerName) =>
            setShowcase((current) => ({ ...current, ownerName }))
          }
          onBio={(ownerBio) =>
            setShowcase((current) => ({ ...current, ownerBio }))
          }
        />
        <GarmentGallery data={showcase} onPhoto={updatePhoto} />
        <div className="mx-auto flex w-full max-w-7xl justify-end px-5 pb-8 sm:px-8">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 font-bold text-white hover:bg-primary-dark"
          >
            <Save className="size-4" />
            حفظ بيانات المعرض
          </button>
        </div>
      </form>
      <footer className="border-t border-slate-200 bg-white px-5 py-6 text-center text-sm text-slate-500">
        تفصيل الجلابيب · شغل متقن على مقاسك
      </footer>
    </main>
  );
}
