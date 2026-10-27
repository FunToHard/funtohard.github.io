import { CramCard } from '../types';

export const FORTRAN_CRAM_SHEET: CramCard[] = [
  {
    title: "1. Structure & Golden Rule",
    items: [
      { label: "Golden Rule", snippet: "IMPLICIT NONE", note: "Prevents silent I-N integer typing" },
      { label: "Program block", snippet: "PROGRAM name ... END PROGRAM", note: "Main entry point" },
      { label: "Case Insensitive", snippet: "INTEGER == integer == InTeGeR", note: "Fortran ignores casing" },
      { label: "Comments", snippet: "! in F90; 'C' in col 1 in F77", note: "Explanatory notes" },
      { label: "Continuation", snippet: "& at end of line in F90", note: "Col 6 in F77" }
    ]
  },
  {
    title: "2. Types & Declarations",
    items: [
      { label: "Integer", snippet: "INTEGER :: i, count = 0", note: "Exact whole numbers" },
      { label: "Single Float", snippet: "REAL :: x = 1.5", note: "32-bit floating point" },
      { label: "Double Float", snippet: "DOUBLE PRECISION :: d = 3.14D0", note: "64-bit precision (D exponent)" },
      { label: "Logical", snippet: "LOGICAL :: flag = .TRUE.", note: ".TRUE. or .FALSE. with dots" },
      { label: "Character", snippet: "CHARACTER(LEN=30) :: name", note: "Fixed-length string" }
    ]
  },
  {
    title: "3. Arrays & Memory Layout",
    items: [
      { label: "Column-Major", snippet: "1st index varies fastest", note: "Contiguous in column order" },
      { label: "1-Based Default", snippet: "A(1, 1) is first element", note: "Not 0-indexed" },
      { label: "Custom Bounds", snippet: "REAL, DIMENSION(-5:5) :: arr", note: "Upper - lower + 1 elements" },
      { label: "Inner Loop Rule", snippet: "Inner loop must match 1st index", note: "DO j=1,N ... DO i=1,M ... A(i,j)" },
      { label: "Array Operations", snippet: "C = A + B", note: "Element-wise matrix addition" }
    ]
  },
  {
    title: "4. Control Flow & Loops",
    items: [
      { label: "DO Loop", snippet: "DO i = 1, N, step ... END DO", note: "Inclusive range" },
      { label: "DO WHILE", snippet: "DO WHILE (condition) ... END DO", note: "Conditional loop" },
      { label: "Skip (continue)", snippet: "CYCLE", note: "Skips to next iteration" },
      { label: "Break (exit)", snippet: "EXIT", note: "Breaks out of loop immediately" },
      { label: "IF block", snippet: "IF (cond) THEN ... ELSE ... END IF", note: "Parentheses mandatory" }
    ]
  },
  {
    title: "5. Subroutines & Procedures",
    items: [
      { label: "Subroutine Call", snippet: "CALL my_sub(x, y)", note: "Invokes subroutine" },
      { label: "Pass-by-reference", snippet: "All arguments passed by reference", note: "Changes affect caller" },
      { label: "INTENT(IN)", snippet: "REAL, INTENT(IN) :: x", note: "Read-only input" },
      { label: "INTENT(OUT)", snippet: "REAL, INTENT(OUT) :: y", note: "Output returned to caller" },
      { label: "INTENT(INOUT)", snippet: "REAL, INTENT(INOUT) :: z", note: "Read and modify in place" }
    ]
  },
  {
    title: "6. Exam Gotchas & Traps",
    items: [
      { label: "Integer Division", snippet: "5 / 2 = 2 (NOT 2.5!)", note: "Use 5.0 / 2.0" },
      { label: "I-N Default", snippet: "index = 4.5 => truncated to 4", note: "IMPLICIT NONE avoids this" },
      { label: "Col 1-6 in F77", snippet: "Code must start at col 7", note: "Cols 1-5 for labels, 6 for cont" },
      { label: "Power operator", snippet: "x**2 (NOT x^2!)", note: "Double asterisk is exponent" },
      { label: "Formatted PRINT", snippet: "PRINT *, var", note: "Asterisk = default format" }
    ]
  }
];
