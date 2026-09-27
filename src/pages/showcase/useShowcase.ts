import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import {
  DEFAULT_SHOWCASE,
  STORAGE_KEY,
  type ShowcaseData,
  type ShowcasePhoto,
} from "./showcase-types";

function loadShowcase(): ShowcaseData {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "null",
    ) as Partial<ShowcaseData> | null;
    return parsed
      ? {
          ...DEFAULT_SHOWCASE,
          ...parsed,
          photos: { ...DEFAULT_SHOWCASE.photos, ...parsed.photos },
        }
      : DEFAULT_SHOWCASE;
  } catch {
    return DEFAULT_SHOWCASE;
  }
}

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string" ? resolve(reader.result) : reject();
    reader.onerror = () => reject();
    reader.readAsDataURL(file);
  });
}

export default function useShowcase() {
  const [showcase, setShowcase] = useState(loadShowcase);
  const updatePhoto = async (
    key: ShowcasePhoto,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return toast.error("اختر ملف صورة صالحًا");
    try {
      const image = await readImage(file);
      setShowcase((current) => ({
        ...current,
        photos: { ...current.photos, [key]: image },
      }));
    } catch {
      toast.error("تعذر قراءة الصورة");
    }
    event.target.value = "";
  };
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(showcase));
      toast.success("تم حفظ بيانات المعرض في هذا المتصفح");
    } catch {
      toast.error("تعذر الحفظ، جرّب صورًا أصغر حجمًا");
    }
  };
  return { showcase, setShowcase, updatePhoto, save };
}
