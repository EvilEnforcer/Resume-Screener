export const CATEGORY_LABELS = {
  technicalSkills: "Technical Skills Match",
  experience: "Job Experience Relevance",
  education: "Educational Background",
  projects: "Projects & Initiatives",
  communication: "Communication & Clarity",
} as const;

export type CategoryKey = keyof typeof CATEGORY_LABELS;

export const CATEGORY_ORDER: CategoryKey[] = [
  "technicalSkills",
  "experience",
  "education",
  "projects",
  "communication",
];

export type Section = { score: number; outOf: number; comment: string };

export type AnalysisResult = {
  score: number;
  summary: string;
  sections: Record<CategoryKey, Section>;
};

export type ResumeFile = {
  id: number;
  filename: string;
  uploadedAt: string;
};
