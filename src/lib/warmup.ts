export interface WarmupExercise {
  title: string;
  description: string;
  type: "Nefes" | "Tekerleme" | "Artikülasyon";
}

export const WARMUP_EXERCISES: WarmupExercise[] = [
  {
    title: "4-7-8 Nefes Tekniği",
    description:
      "4 saniye burundan derin nefes al, 7 saniye tut, 8 saniye ağzından yavaşça ver. Omuzların düşük kalsın, nefes karından gelsin.",
    type: "Nefes",
  },
  {
    title: "Berber Tekerlemesi",
    description:
      "\"Bir berber bir berbere gel birader beraber bir berber dükkânı açalım demiş.\" 3 kez, hız artırarak söyle.",
    type: "Tekerleme",
  },
  {
    title: "Kırk Kapı Tekerlemesi",
    description: "\"Kırk kapı kırkar kırkar, kırk kapıyı kim kırkar?\" Net ve yüksek sesle 3 kez tekrar et.",
    type: "Tekerleme",
  },
  {
    title: "P-T-K Patlama Egzersizi",
    description:
      "\"Pa-Ta-Ka, Pe-Te-Ke, Pı-Tı-Kı, Pi-Ti-Ki\" — sessiz harfleri dudak ve dilden net patlatarak ritmik tekrar et.",
    type: "Artikülasyon",
  },
];
