export interface RExamMeta {
  title: string;
  subtitle: string;
  syllabusScope: string[];
  examPrerequisites: string;
  goldenRule: string;
  coreGotchasCount: number;
}

export const R_EXAM_META: RExamMeta = {
  title: "R Language Emergency Kit",
  subtitle: "High-yield academic exam cram guide for CS and engineering students.",
  syllabusScope: [
    "Vectors, matrices, data frames, lists, and factors",
    "Vectorized operations vs. loops (for, while, ifelse)",
    "The apply family: apply, lapply, sapply, tapply",
    "Data manipulation in Base R without external libraries",
    "Statistical tests: summary, t.test, chisq.test, lm, ANOVA",
    "Base graphics: plot, hist, boxplot, barplot, par(mfrow)",
    "Common exam traps: 1-based indexing, recycling rule, NA/NULL propagation"
  ],
  examPrerequisites: "Assumes basic programming knowledge in Python, C++, or Java. Focuses strictly on the delta and R's unique quirks.",
  goldenRule: "Do not use tidyverse, dplyr, or ggplot2 unless explicitly allowed in the prompt. University exam graders grade strictly against Base R.",
  coreGotchasCount: 8
};
