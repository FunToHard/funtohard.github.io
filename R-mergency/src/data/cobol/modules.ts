import { ExamModule } from '../types';

export const COBOL_MODULES: ExamModule[] = [
  {
    id: "cobol-mental-model",
    sectionNumber: "§ 01",
    title: "COBOL Mental Model: The 4 Rigid Divisions",
    cramTimeMinutes: 15,
    overview: "COBOL (Common Business-Oriented Language) was designed in 1959 to read like English. Programs have an unyielding hierarchical structure: Divisions, Sections, Paragraphs, Sentences, and Statements.",
    sections: [
      {
        heading: "1. The 4 Required Divisions (In Exact Order)",
        explanation: `Every COBOL program must declare four divisions in this precise, unalterable sequence:
1. IDENTIFICATION DIVISION: Program metadata (PROGRAM-ID is mandatory).
2. ENVIRONMENT DIVISION: Hardware & external file bindings (INPUT-OUTPUT SECTION).
3. DATA DIVISION: Variable declarations, records, and files (WORKING-STORAGE SECTION).
4. PROCEDURE DIVISION: Executable procedural logic.`,
        code: `       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLO-EXAM.

       ENVIRONMENT DIVISION.

       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-MESSAGE PIC X(20) VALUE "PASS THE EXAM".

       PROCEDURE DIVISION.
       0001-MAIN.
           DISPLAY WS-MESSAGE.
           STOP RUN.`,
        trapNote: "[TRAP] Rearranging division order or omitting IDENTIFICATION DIVISION causes immediate compilation failure on university mainframes."
      },
      {
        heading: "2. The Period Rule (.)",
        explanation: "A period terminates a sentence or division header. Forgetting a period, or adding an extra period inside an IF statement before an ELSE, prematurely closes the IF block and breaks logic.",
        code: `* CORRECT IF BLOCK (Notice: Period ONLY after END-IF or after the entire statement):
           IF WS-SCORE >= 60
               DISPLAY "PASS"
           ELSE
               DISPLAY "FAIL"
           END-IF.`
      }
    ]
  },
  {
    id: "cobol-column-layout",
    sectionNumber: "§ 02",
    title: "Fixed Column Layout: Area A vs Area B",
    cramTimeMinutes: 15,
    overview: "Classical COBOL follows strict punch card column rules. Modern exams test whether you know what belongs in Area A vs Area B.",
    sections: [
      {
        heading: "1. Column Margins Breakdown",
        explanation: `• Columns 1-6: Sequence numbers (ignored by compiler, usually blank or 000100).
• Column 7: Indicator area ('*' = Comment, '-' = Continuation of literal string, 'D' = Debug line).
• Columns 8-11: Area A (Division headers, Section headers, Paragraph names, 01 and 77 level records MUST begin here).
• Columns 12-72: Area B (All executable statements, subordinate level numbers 02-49, continuations, and PICTURE clauses).
• Columns 73-80: Identification area (ignored).`,
        code: `*Col 7: Comment indicator
*Col 8-11: Area A | Col 12-72: Area B
       IDENTIFICATION DIVISION.
       PROGRAM-ID. COLUMN-DEMO.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-STUDENT.                           <- Area A (01 level)
          05 WS-ID       PIC 9(5).              <- Area B (05 level)
          05 WS-NAME     PIC X(20).             <- Area B
       PROCEDURE DIVISION.
       0100-PROCESS.                            <- Area A (Paragraph name)
           MOVE 12345 TO WS-ID.                 <- Area B (Statements)
           STOP RUN.`
      }
    ]
  },
  {
    id: "cobol-picture-clauses",
    sectionNumber: "§ 03",
    title: "PICTURE Clauses, Level Numbers & Implied Decimals (V)",
    cramTimeMinutes: 20,
    overview: "COBOL data definitions use PIC (PICTURE) strings. The implied decimal point 'V' is guaranteed to be tested on exams.",
    sections: [
      {
        heading: "1. Data Type Characters (9, X, A, S, V)",
        explanation: `• '9': Numeric digit (0-9).
• 'X': Alphanumeric (any character).
• 'A': Alphabetic letter or space only.
• 'S': Operational sign (allows negative numbers).
• 'V': IMPLIED decimal point (does NOT take up a physical byte of storage!).`,
        code: `       01 WS-INTEGER       PIC 9(4).         *> 4 digits (e.g. 1234)
       01 WS-NAME          PIC X(15).        *> 15 characters
       01 WS-SIGNED-VAL    PIC S9(3).        *> -999 to +999
       01 WS-PRICE         PIC 9(3)V99.      *> 3 integer digits, 2 decimals (e.g. 123.45)`
      },
      {
        heading: "2. The Implied Decimal Point Trap (V)",
        explanation: `'V' tells the compiler where the decimal belongs logically during math, but it takes 0 BYTES in memory. If you move 12345 to a field with PIC 9(3)V99, it represents 123.45 in arithmetic!`,
        code: `* PIC 9(3)V99 occupies exactly 5 bytes of storage, NOT 6!
       01 WS-PRICE   PIC 9(3)V99.
       01 WS-TOTAL   PIC 9(4)V99.
       ...
       MOVE 123.45 TO WS-PRICE.
       COMPUTE WS-TOTAL = WS-PRICE * 2.  *> Correctly computes 246.90`,
        trapNote: "[TRAP] Exam questions often ask: 'How many bytes of storage does PIC 9(4)V99 occupy?' The answer is 6 bytes (4+2), NOT 7 bytes! 'V' is virtual and consumes zero storage."
      },
      {
        heading: "3. Level Numbers (01, 02-49, 77, 88)",
        explanation: `• 01: Top-level record.
• 02-49: Subordinate fields (nested sub-records).
• 77: Standalone elementary item (independent variable).
• 88: Condition name (boolean enumeration on a field).`,
        code: `       01 WS-USER-ROLE     PIC X(1).
          88 IS-ADMIN      VALUE "A".
          88 IS-STUDENT    VALUE "S".
          88 IS-FACULTY    VALUE "F".
       ...
       * Usage in Procedure:
       SET IS-ADMIN TO TRUE.
       IF IS-ADMIN
           DISPLAY "ACCESS GRANTED".`
      }
    ]
  },
  {
    id: "cobol-procedure-verbs",
    sectionNumber: "§ 04",
    title: "Procedure Division Verbs & Truncation Rules",
    cramTimeMinutes: 18,
    overview: "COBOL uses English verbs for execution: MOVE, COMPUTE, ADD, SUBTRACT, PERFORM, DISPLAY.",
    sections: [
      {
        heading: "1. The MOVE Statement: Truncation & Padding",
        explanation: `• Alphanumeric (PIC X): Left-aligned. If the source is shorter, padded on the RIGHT with spaces. If longer, truncated on the RIGHT.
• Numeric (PIC 9): Aligned on decimal point. If shorter, padded with ZEROS. If longer, truncated on the LEFT (for integer part) or RIGHT (for decimal part)!`,
        code: `       01 WS-SHORT-STR PIC X(3).
       01 WS-SHORT-NUM PIC 9(3).

       MOVE "HELLOWORLD" TO WS-SHORT-STR.  *> Result: "HEL" (truncated right)
       MOVE 12345        TO WS-SHORT-NUM.  *> Result: 345 (truncated LEFT!)`,
        trapNote: "[TRAP] Moving a large number like 12345 into PIC 9(3) silently drops the leading digits, giving 345! Numeric overflow truncates from the left."
      },
      {
        heading: "2. COMPUTE vs ADD / SUBTRACT",
        explanation: "COMPUTE allows standard algebraic expressions with parentheses.",
        code: `       COMPUTE WS-TOTAL = (WS-PRICE * WS-QTY) - WS-DISCOUNT.
       ADD 1 TO WS-COUNTER.
       SUBTRACT WS-TAX FROM WS-GROSS GIVING WS-NET.`
      }
    ]
  },
  {
    id: "cobol-perform-loops",
    sectionNumber: "§ 05",
    title: "PERFORM Loops & Subroutine Execution",
    cramTimeMinutes: 18,
    overview: "COBOL executes loops and internal procedures using the PERFORM statement.",
    sections: [
      {
        heading: "1. PERFORM UNTIL & PERFORM VARYING",
        explanation: "PERFORM tests conditions BEFORE execution by default (WITH TEST BEFORE).",
        code: `* Loop N times:
           PERFORM 0200-PRINT-LINE 5 TIMES.

* While loop (UNTIL condition):
           MOVE 1 TO WS-I.
           PERFORM 0300-PROCESS-ITEM
               UNTIL WS-I > 10.

* For loop (VARYING):
           PERFORM 0400-CALCULATE
               VARYING WS-I FROM 1 BY 1
               UNTIL WS-I > 100.`
      }
    ]
  },
  {
    id: "cobol-exam-files",
    sectionNumber: "§ 06",
    title: "Top University Exam Problems: Sequential File Processing",
    cramTimeMinutes: 20,
    overview: "The quintessential 10-mark COBOL exam question: Reading an input file until EOF and calculating totals.",
    sections: [
      {
        heading: "Q1: Read Sequential File Until EOF and Display Record Count",
        explanation: "Tests File Section, OPEN, READ AT END, and CLOSE.",
        code: `       IDENTIFICATION DIVISION.
       PROGRAM-ID. FILE-PROCESSOR.

       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMP-FILE ASSIGN TO "EMP.DAT"
           ORGANIZATION IS LINE SEQUENTIAL.

       DATA DIVISION.
       FILE SECTION.
       FD EMP-FILE.
       01 EMP-RECORD.
          05 EMP-ID       PIC 9(4).
          05 EMP-NAME     PIC X(20).
          05 EMP-SALARY   PIC 9(6)V99.

       WORKING-STORAGE SECTION.
       01 WS-EOF-FLAG     PIC X(1) VALUE "N".
          88 EOF-REACHED  VALUE "Y".
       01 WS-REC-COUNT    PIC 9(4) VALUE 0.

       PROCEDURE DIVISION.
       0001-MAIN.
           OPEN INPUT EMP-FILE.
           PERFORM 0100-READ-RECORD.
           PERFORM 0200-PROCESS-RECORDS
               UNTIL EOF-REACHED.
           CLOSE EMP-FILE.
           DISPLAY "TOTAL RECORDS PROCESSED: " WS-REC-COUNT.
           STOP RUN.

       0100-READ-RECORD.
           READ EMP-FILE
               AT END
                   SET EOF-REACHED TO TRUE
           END-READ.

       0200-PROCESS-RECORDS.
           ADD 1 TO WS-REC-COUNT.
           DISPLAY "ID: " EMP-ID " NAME: " EMP-NAME.
           PERFORM 0100-READ-RECORD.`
      }
    ]
  }
];
