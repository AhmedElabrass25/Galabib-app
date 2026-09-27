import type { ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
import type { GarmentPhoto } from "./showcase-types";

interface GarmentCardProps {
  id: GarmentPhoto;
  title: string;
  note: string;
  image: string;
  onPhoto: (key: GarmentPhoto, event: ChangeEvent<HTMLInputElement>) => void;
}

export default function GarmentCard({
  id,
  title,
  note,
  image,
  onPhoto,
}: GarmentCardProps) {
  return (
    <article className="group min-w-0">
      <div className="relative aspect-4/5 overflow-hidden rounded-md bg-[#e2e8e2]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3 text-slate-500">
            <ImagePlus className="size-9" />
            <span className="text-sm font-semibold">أضف صورة الموديل</span>
          </div>
        )}
        <label className="absolute bottom-3 left-3 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md bg-white/95 px-3 text-sm font-bold text-slate-800 shadow-sm hover:bg-white">
          <ImagePlus className="size-4" />
          {image ? "تغيير الصورة" : "إضافة صورة"}
          <input
            type="file"
            accept="image/*"
            aria-label={`${image ? "تغيير" : "إضافة"} صورة ${title}`}
            className="sr-only"
            onChange={(event) => onPhoto(id, event)}
          />
        </label>
      </div>
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 py-4">
        <h3 className="font-bold">{title}</h3>
        <span className="text-sm text-slate-500">{note}</span>
      </div>
    </article>
  );
}
