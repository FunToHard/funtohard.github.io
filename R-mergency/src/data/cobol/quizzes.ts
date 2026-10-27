import { QuizQuestion } from '../types';

export const COBOL_QUIZZES: QuizQuestion[] = [
  {
    id: "cobol-division-order",
    langId: "cobol",
    trapCategory: "Program Structure",
    question: "What is the mandatory chronological order of the 4 COBOL divisions?",
    codeSnippet: `* In what order must COBOL divisions appear?`,
    options: [
      "IDENTIFICATION, ENVIRONMENT, DATA, PROCEDURE",
      "DATA, IDENTIFICATION, PROCEDURE, ENVIRONMENT",
      "IDENTIFICATION, DATA, ENVIRONMENT, PROCEDURE",
      "ENVIRONMENT, IDENTIFICATION, DATA, PROCEDURE"
    ],
    correctIndex: 0,
    explanation: "COBOL strictly enforces this order: 1. IDENTIFICATION DIVISION, 2. ENVIRONMENT DIVISION, 3. DATA DIVISION, 4. PROCEDURE DIVISION. Any deviation will fail compilation."
  },
  {
    id: "cobol-implied-decimal-bytes",
    langId: "cobol",
    trapCategory: "PICTURE Clauses",
    question: "How many physical bytes of computer storage does a field declared as `01 WS-AMOUNT PIC 9(4)V99.` occupy?",
    codeSnippet: `01 WS-AMOUNT PIC 9(4)V99.`,
    options: [
      "6 bytes (4 integer digits + 2 decimal digits)",
      "7 bytes (including the decimal point character)",
      "8 bytes (word aligned)",
      "4 bytes"
    ],
    correctIndex: 0,
    explanation: "The 'V' symbol represents an implied (virtual) decimal point used by the compiler for calculations; it does NOT store a physical period character and consumes zero bytes of memory. Total bytes = 4 + 2 = 6."
  },
  {
    id: "cobol-area-a-vs-b",
    langId: "cobol",
    trapCategory: "Fixed Column Format",
    question: "In classical COBOL format, what column range represents Area A, and what MUST start there?",
    codeSnippet: `* Area A rules in COBOL`,
    options: [
      "Columns 8-11: Division headers, section headers, paragraph names, 01 and 77 level records",
      "Columns 1-6: Comment indicators only",
      "Columns 12-72: All arithmetic verbs",
      "Columns 73-80: Program identification"
    ],
    correctIndex: 0,
    explanation: "Area A occupies columns 8 to 11. All division, section, paragraph headers, as well as level-01 and level-77 declarations, must begin in Area A. Executable statements start in Area B (columns 12-72)."
  },
  {
    id: "cobol-numeric-move-truncation",
    langId: "cobol",
    trapCategory: "MOVE Verbs & Data Movement",
    question: "What is stored in `WS-TARGET` after executing `MOVE 98765 TO WS-TARGET.` where `WS-TARGET` is declared as `01 WS-TARGET PIC 9(3).`?",
    codeSnippet: `01 WS-TARGET PIC 9(3).\nMOVE 98765 TO WS-TARGET.`,
    options: [
      "765 (leading digits 9 and 8 are truncated from the left)",
      "987 (trailing digits 6 and 5 are truncated from the right)",
      "Throws an integer overflow exception",
      "999 (saturated maximum)"
    ],
    correctIndex: 0,
    explanation: "In COBOL, moving numeric data into a smaller numeric target truncates excess digits from the high-order (LEFT) side. Thus, 98765 becomes 765."
  },
  {
    id: "cobol-level-88",
    langId: "cobol",
    trapCategory: "Level Numbers",
    question: "What is the purpose of Level 88 in COBOL DATA DIVISION?",
    codeSnippet: `01 WS-STATUS PIC X(1).\n   88 IS-ACTIVE VALUE "A".\n   88 IS-INACTIVE VALUE "I".`,
    options: [
      "Defines condition names (boolean flags mapped to specific values of the parent field)",
      "Defines a 64-bit floating point number",
      "Defines an external database pointer",
      "Defines a sub-record containing 88 characters"
    ],
    correctIndex: 0,
    explanation: "Level 88 specifies condition names (analogous to enums). In the PROCEDURE DIVISION, you can write `IF IS-ACTIVE` instead of `IF WS-STATUS = 'A'`."
  },
  {
    id: "cobol-comment-indicator",
    langId: "cobol",
    trapCategory: "Column Layout",
    question: "In classical fixed-format COBOL, which column and character designate a comment line?",
    codeSnippet: `* Designating comments in COBOL`,
    options: [
      "An asterisk '*' in Column 7",
      "Double slashes '//' in Column 1",
      "A hash '#' in Column 8",
      "A semicolon ';' anywhere"
    ],
    correctIndex: 0,
    explanation: "Column 7 is the Indicator Area. Placing an asterisk '*' in column 7 marks the entire line as a comment."
  },
  {
    id: "cobol-alphanumeric-move-padding",
    langId: "cobol",
    trapCategory: "MOVE Verbs",
    question: "What is the result of `MOVE 'R' TO WS-TEXT.` where `WS-TEXT` is `PIC X(4)`?",
    codeSnippet: `01 WS-TEXT PIC X(4).\nMOVE "R" TO WS-TEXT.`,
    options: [
      "'R   ' (left-aligned, padded with 3 spaces on the right)",
      "'   R' (right-aligned, padded with 3 spaces on the left)",
      "'R000'",
      "Compilation error: length mismatch"
    ],
    correctIndex: 0,
    explanation: "Alphanumeric (PIC X) moves are left-justified. Unused trailing positions are padded with space characters (' ')."
  },
  {
    id: "cobol-period-scope",
    langId: "cobol",
    trapCategory: "Scope Terminators",
    question: "Why can placing an unintended period '.' inside a nested IF statement cause a severe bug?",
    codeSnippet: `IF WS-A = 1\n    DISPLAY "ONE".\nELSE\n    DISPLAY "OTHER".`,
    options: [
      "The period after 'ONE' terminates the entire IF statement, so 'ELSE' becomes an orphaned syntax error",
      "Periods can only be used at the end of paragraphs",
      "COBOL requires semicolons between IF and ELSE",
      "The compiler treats the period as multiplication"
    ],
    correctIndex: 0,
    explanation: "In COBOL, a period '.' terminates all open scope constructs. Placing a period after DISPLAY 'ONE' terminates the IF block immediately, leaving the following ELSE dangling without an associated IF."
  }
];
