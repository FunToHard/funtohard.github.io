import { CramCard } from '../types';

export const COBOL_CRAM_SHEET: CramCard[] = [
  {
    title: "1. The 4 Divisions in Order",
    items: [
      { label: "1. IDENTIFICATION", snippet: "PROGRAM-ID. name.", note: "Program metadata" },
      { label: "2. ENVIRONMENT", snippet: "INPUT-OUTPUT SECTION.", note: "File & device bindings" },
      { label: "3. DATA", snippet: "WORKING-STORAGE SECTION.", note: "Variable declarations" },
      { label: "4. PROCEDURE", snippet: "Executable code statements", note: "Procedural logic" },
      { label: "Period Rule", snippet: "Must terminate headers & sentences", note: "Premature period closes IF scopes" }
    ]
  },
  {
    title: "2. Column Positions (Punch Card)",
    items: [
      { label: "Cols 1-6", snippet: "Sequence numbers (optional/blank)", note: "Ignored by modern compilers" },
      { label: "Col 7", snippet: "* for comment, - for continuation", note: "Indicator Area" },
      { label: "Cols 8-11 (Area A)", snippet: "Divisions, sections, paragraphs, 01, 77", note: "Headers must start in Area A" },
      { label: "Cols 12-72 (Area B)", snippet: "Statements, subordinate levels 02-49", note: "Executable instructions" },
      { label: "Cols 73-80", snippet: "Program identification (ignored)", note: "Historical card metadata" }
    ]
  },
  {
    title: "3. PICTURE Clause & Level Numbers",
    items: [
      { label: "PIC 9(n)", snippet: "Numeric digits (0-9)", note: "e.g. PIC 9(4) = 0000-9999" },
      { label: "PIC X(n)", snippet: "Alphanumeric characters", note: "e.g. PIC X(20) text string" },
      { label: "PIC 9(n)V99", snippet: "Implied decimal (0 bytes virtual)", note: "PIC 9(3)V99 = 5 bytes total" },
      { label: "Level 01", snippet: "Top-level record container", note: "Area A" },
      { label: "Level 88", snippet: "Condition name (enum / boolean)", note: "e.g. 88 IS-ACTIVE VALUE 'A'" }
    ]
  },
  {
    title: "4. MOVE & Arithmetic Verbs",
    items: [
      { label: "Alphanumeric MOVE", snippet: "Left-aligned, space padded on right", note: "Truncates on right if too long" },
      { label: "Numeric MOVE", snippet: "Decimal aligned, zero padded", note: "Truncates on LEFT (drops high digits!)" },
      { label: "COMPUTE", snippet: "COMPUTE x = (a * b) + c", note: "General algebraic expressions" },
      { label: "ADD / SUBTRACT", snippet: "ADD 1 TO counter", note: "Simple counter manipulation" },
      { label: "DISPLAY / ACCEPT", snippet: "DISPLAY 'Hi' ACCEPT val", note: "Standard console I/O" }
    ]
  },
  {
    title: "5. PERFORM Loops",
    items: [
      { label: "Call paragraph", snippet: "PERFORM 0100-CALC", note: "Jumps to paragraph and returns" },
      { label: "N Times", snippet: "PERFORM 0100-CALC 5 TIMES", note: "Fixed iteration count" },
      { label: "While (UNTIL)", snippet: "PERFORM 0100-CALC UNTIL cond", note: "Tested BEFORE execution by default" },
      { label: "For (VARYING)", snippet: "PERFORM VARYING i FROM 1 BY 1 UNTIL i > N", note: "Standard counted loop" },
      { label: "STOP RUN", snippet: "STOP RUN.", note: "Halts program execution" }
    ]
  },
  {
    title: "6. Exam Traps & Gotchas",
    items: [
      { label: "Virtual Decimal V", snippet: "PIC 9(4)V99 = 6 bytes, NOT 7", note: "Virtual decimal uses 0 storage bytes" },
      { label: "Left Truncation", snippet: "MOVE 12345 TO PIC 9(3) => 345", note: "Drops leftmost digits silently" },
      { label: "Missing Period", snippet: "Missing . after division header", note: "Immediate syntax error" },
      { label: "Area A Violation", snippet: "01 level in Col 12 (Area B)", note: "01 and 77 must start in Area A (Cols 8-11)" }
    ]
  }
];
