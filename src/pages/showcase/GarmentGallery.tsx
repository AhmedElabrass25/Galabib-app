import type { ChangeEvent } from "react";
import {
  GARMENTS,
  type ShowcaseData,
  type ShowcasePhoto,
} from "./showcase-types";
import GarmentCard from "./GarmentCard";

export default function GarmentGallery({
  data,
  onPhoto,
}: {
  data: ShowcaseData;
  onPhoto: (key: ShowcasePhoto, event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <section
      id="collection"
      className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20"
    >
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#176b59]">اختار تفصيلك</p>
          <h2 className="mt-2 text-3xl font-extrabold">موديلات الجلابيب</h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-slate-600">
          ثلاث موديلات مختلفة، وكل قطعة تتفصل بعناية على المقاس.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GARMENTS.map((garment) => (
          <GarmentCard
            key={garment.id}
            {...garment}
            image={data.photos[garment.id]}
            onPhoto={onPhoto}
          />
        ))}
      </div>
    </section>
  );
}
