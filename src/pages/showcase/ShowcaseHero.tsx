import type { ChangeEvent } from "react";
import {
  ArrowDown,
  ImagePlus,
  LayoutDashboard,
  Scissors,
  UserRound,
} from "lucide-react";
import type { ShowcaseData, ShowcasePhoto } from "./showcase-types";

interface ShowcaseHeroProps {
  data: ShowcaseData;
  onPhoto: (key: ShowcasePhoto, event: ChangeEvent<HTMLInputElement>) => void;
  onName: (value: string) => void;
  onBio: (value: string) => void;
}

export default function ShowcaseHero({
  data,
  onPhoto,
  onName,
  onBio,
}: ShowcaseHeroProps) {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-155 items-end overflow-hidden bg-bg-sidebar text-white sm:min-h-175"
    >
      <img
        src={data.photos.balady}
        alt=""
        className="absolute inset-0 -z-20 size-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-[#10231e]/70" />
      <header className="absolute inset-x-0 top-0 z-10 border-b border-white/20 text-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-2 font-bold">
            <Scissors className="size-5 text-emerald-300" />
            تفصيل الجلابيب
          </a>
          <nav className="flex items-center gap-3 sm:gap-5">
            <a
              href="#collection"
              className="hidden min-h-10 items-center gap-2 text-sm font-semibold text-white/90 hover:text-white sm:inline-flex"
            >
              الموديلات
              <ArrowDown className="size-4" />
            </a>
            <a
              href="/"
              aria-label="العودة إلى لوحة الإدارة"
              className="inline-flex min-h-10 items-center rounded-md border border-white/40 px-3 text-sm font-semibold hover:bg-white/10 sm:px-4"
            >
              <LayoutDashboard className="size-4 sm:hidden" />
              <span className="hidden sm:inline">لوحة الإدارة</span>
            </a>
          </nav>
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 pb-14 pt-28 sm:px-8 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
        <div className="max-w-2xl">
          <span className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200">
            <span className="h-px w-8 bg-emerald-300" />
            تفصيل يليق بك
          </span>
          <h1 className="text-4xl font-black leading-tight sm:text-6xl">
            جلابيتك، على مقاسك
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
            شغل يدوي بعناية، ومقاسات مضبوطة، وتفاصيل تختارها بنفسك.
          </p>
          <a
            href="#collection"
            className="mt-8 inline-flex min-h-12 items-center rounded-md bg-emerald-300 px-6 font-bold text-bg-sidebar hover:bg-emerald-200"
          >
            اكتشف الموديلات
          </a>
        </div>
        <div className="flex items-end gap-4 border-t border-white/30 pt-5 lg:border-r lg:border-t-0 lg:pr-5 lg:pt-0">
          <label className="group relative flex size-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-white/10 sm:size-28">
            {data.photos.owner ? (
              <img
                src={data.photos.owner}
                alt={data.ownerName || "صاحب المكان"}
                className="size-full object-cover"
              />
            ) : (
              <UserRound className="size-10 text-white/80" />
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
              <ImagePlus className="size-6" />
            </span>
            <input
              type="file"
              accept="image/*"
              aria-label="إضافة صورة صاحب المكان"
              className="sr-only"
              onChange={(event) => onPhoto("owner", event)}
            />
          </label>
          <div className="min-w-0 flex-1 space-y-2">
            <input
              value={data.ownerName}
              onChange={(event) => onName(event.target.value)}
              placeholder="اسم صاحب المكان"
              aria-label="اسم صاحب المكان"
              className="w-full border-b border-white/40 bg-transparent py-1 text-lg font-bold text-white outline-none placeholder:text-white/65"
            />
            <textarea
              value={data.ownerBio}
              onChange={(event) => onBio(event.target.value)}
              placeholder="نبذة قصيرة عن صاحب المكان"
              aria-label="نبذة عن صاحب المكان"
              rows={2}
              className="w-full resize-none border-b border-white/30 bg-transparent py-1 text-sm leading-6 text-white/85 outline-none placeholder:text-white/60"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
