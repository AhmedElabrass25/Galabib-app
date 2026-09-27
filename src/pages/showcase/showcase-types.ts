import heroImage from "@/assets/hero.png";

export const STORAGE_KEY = "jalabib-showcase";
export type ShowcasePhoto = "owner" | "balady" | "afrangy" | "saudi";
export type GarmentPhoto = Exclude<ShowcasePhoto, "owner">;

export interface ShowcaseData {
  ownerName: string;
  ownerBio: string;
  photos: Record<ShowcasePhoto, string>;
}

export const DEFAULT_SHOWCASE: ShowcaseData = {
  ownerName: "",
  ownerBio: "",
  photos: { owner: "", balady: heroImage, afrangy: "", saudi: "" },
};

export const GARMENTS: { id: GarmentPhoto; title: string; note: string }[] = [
  { id: "balady", title: "الجلابية البلدي", note: "تفصيل على المقاس" },
  { id: "afrangy", title: "الجلابية الأفرنجي", note: "أناقة بتفاصيل دقيقة" },
  { id: "saudi", title: "الجلابية السعودي", note: "راحة وجودة في كل غرزة" },
];
