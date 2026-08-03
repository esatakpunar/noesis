export const CATEGORIES = [
  { id: "diksiyon", label: "Diksiyon" },
  { id: "psikoloji", label: "Psikoloji" },
  { id: "felsefe", label: "Felsefe" },
  { id: "bilim", label: "Tuhaf Bilim" },
  { id: "nadir", label: "Nadir Kavram" },
  { id: "etimoloji", label: "Etimoloji" },
  { id: "sanat", label: "Sanat" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Difficulty = "kolay" | "orta" | "zor";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  kolay: "Kolay",
  orta: "Orta",
  zor: "Zor",
};

export interface Topic {
  id: string;
  title: string;
  category: CategoryId;
  difficulty: Difficulty;
  pronunciation: string | null;
  origin: string | null;
  researchPrompts: string[];
  fromPool?: boolean;
  source?: "seed" | "ai" | "user";
}
