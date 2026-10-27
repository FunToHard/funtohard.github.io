import { LanguageInfo, LanguageBundle, ExamModule, QuizQuestion, CramCard } from './types';
import { LANGUAGES } from './languages';

import { R_MODULES } from './r/modules';
import { R_QUIZZES } from './r/quizzes';
import { R_CRAM_SHEET } from './r/cramSheet';

import { PROLOG_MODULES } from './prolog/modules';
import { PROLOG_QUIZZES } from './prolog/quizzes';
import { PROLOG_CRAM_SHEET } from './prolog/cramSheet';

import { FORTRAN_MODULES } from './fortran/modules';
import { FORTRAN_QUIZZES } from './fortran/quizzes';
import { FORTRAN_CRAM_SHEET } from './fortran/cramSheet';

import { MATLAB_MODULES } from './matlab/modules';
import { MATLAB_QUIZZES } from './matlab/quizzes';
import { MATLAB_CRAM_SHEET } from './matlab/cramSheet';

import { COBOL_MODULES } from './cobol/modules';
import { COBOL_QUIZZES } from './cobol/quizzes';
import { COBOL_CRAM_SHEET } from './cobol/cramSheet';

import { MIPS_MODULES } from './mips/modules';
import { MIPS_QUIZZES } from './mips/quizzes';
import { MIPS_CRAM_SHEET } from './mips/cramSheet';

import { SCHEME_MODULES } from './scheme/modules';
import { SCHEME_QUIZZES } from './scheme/quizzes';
import { SCHEME_CRAM_SHEET } from './scheme/cramSheet';

const bundles: Record<string, { modules: ExamModule[]; quizzes: QuizQuestion[]; cramSheet: CramCard[] }> = {
  r: { modules: R_MODULES, quizzes: R_QUIZZES, cramSheet: R_CRAM_SHEET },
  mips: { modules: MIPS_MODULES, quizzes: MIPS_QUIZZES, cramSheet: MIPS_CRAM_SHEET },
  scheme: { modules: SCHEME_MODULES, quizzes: SCHEME_QUIZZES, cramSheet: SCHEME_CRAM_SHEET },
  prolog: { modules: PROLOG_MODULES, quizzes: PROLOG_QUIZZES, cramSheet: PROLOG_CRAM_SHEET },
  fortran: { modules: FORTRAN_MODULES, quizzes: FORTRAN_QUIZZES, cramSheet: FORTRAN_CRAM_SHEET },
  matlab: { modules: MATLAB_MODULES, quizzes: MATLAB_QUIZZES, cramSheet: MATLAB_CRAM_SHEET },
  cobol: { modules: COBOL_MODULES, quizzes: COBOL_QUIZZES, cramSheet: COBOL_CRAM_SHEET },
};

export function getLanguageInfo(langId: string): LanguageInfo {
  return LANGUAGES.find((l) => l.id === langId) || LANGUAGES[0];
}

export function getLanguageBundle(langId: string): LanguageBundle {
  const info = getLanguageInfo(langId);
  const bundle = bundles[info.id] || bundles.r;
  return {
    info,
    modules: bundle.modules,
    quizzes: bundle.quizzes,
    cramSheet: bundle.cramSheet,
  };
}

export function getAllQuizzes(): QuizQuestion[] {
  return [
    ...R_QUIZZES,
    ...MIPS_QUIZZES,
    ...SCHEME_QUIZZES,
    ...PROLOG_QUIZZES,
    ...FORTRAN_QUIZZES,
    ...MATLAB_QUIZZES,
    ...COBOL_QUIZZES,
  ];
}

export interface SearchResult {
  langId: string;
  langName: string;
  moduleId: string;
  moduleTitle: string;
  sectionHeading: string;
  snippet: string;
}

export function searchAllContent(query: string): SearchResult[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed || trimmed.length < 2) return [];

  const results: SearchResult[] = [];

  for (const lang of LANGUAGES) {
    const bundle = bundles[lang.id];
    if (!bundle) continue;

    for (const mod of bundle.modules) {
      for (const sec of mod.sections) {
        const inHeading = sec.heading.toLowerCase().includes(trimmed);
        const inExp = sec.explanation.toLowerCase().includes(trimmed);
        const inCode = sec.code?.toLowerCase().includes(trimmed);
        const inTrap = sec.trapNote?.toLowerCase().includes(trimmed);

        if (inHeading || inExp || inCode || inTrap) {
          let snippet = sec.explanation;
          if (inTrap && sec.trapNote) snippet = sec.trapNote;
          if (snippet.length > 140) snippet = snippet.slice(0, 140) + '...';

          results.push({
            langId: lang.id,
            langName: lang.name,
            moduleId: mod.id,
            moduleTitle: mod.title,
            sectionHeading: sec.heading,
            snippet,
          });

          if (results.length >= 15) return results;
        }
      }
    }
  }

  return results;
}
