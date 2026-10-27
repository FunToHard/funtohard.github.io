import { QuizQuestion } from '../types';

export const FORTRAN_QUIZZES: QuizQuestion[] = [
  {
    id: "fortran-implicit-typing",
    langId: "fortran",
    trapCategory: "Implicit Typing",
    question: "Without 'IMPLICIT NONE', what is the default type of a variable named `lambda_val`?",
    codeSnippet: `PROGRAM test\n  lambda_val = 4.5\nEND PROGRAM test`,
    options: [
      "REAL (4.5)",
      "INTEGER (truncated to 4)",
      "DOUBLE PRECISION",
      "Compilation Error: undeclared variable"
    ],
    correctIndex: 1,
    explanation: "Under the classical I-N convention, any variable whose name begins with I, J, K, L, M, or N is implicitly typed as an INTEGER. Because `lambda_val` starts with 'L', it is created as an integer and 4.5 is truncated to 4!"
  },
  {
    id: "fortran-integer-division",
    langId: "fortran",
    trapCategory: "Arithmetic Traps",
    question: "Given `REAL :: res`, what is the value of `res` after `res = 7 / 2`?",
    codeSnippet: `REAL :: res\nres = 7 / 2`,
    options: [
      "3.5",
      "3.0",
      "4.0",
      "7.2"
    ],
    correctIndex: 1,
    explanation: "Both 7 and 2 are integer literals. The division evaluates entirely in integer arithmetic first: 7 / 2 = 3. Only then is 3 coerced to the REAL variable `res`, yielding 3.0. To get 3.5, write `7.0 / 2.0`."
  },
  {
    id: "fortran-column-major-stride",
    langId: "fortran",
    trapCategory: "Memory Layout",
    question: "In a 2D array `A(3, 3)`, which element is stored in memory immediately adjacent to `A(1, 1)`?",
    codeSnippet: `INTEGER, DIMENSION(3, 3) :: A`,
    options: [
      "A(1, 2) (same row, next column)",
      "A(2, 1) (same column, next row)",
      "A(2, 2) (diagonal element)",
      "A(3, 1)"
    ],
    correctIndex: 1,
    explanation: "Fortran is COLUMN-MAJOR. The first index varies fastest in contiguous memory. Therefore, element A(2, 1) immediately follows A(1, 1) in memory."
  },
  {
    id: "fortran-do-loop-step",
    langId: "fortran",
    trapCategory: "Control Flow",
    question: "How many times does the loop `DO i = 1, 10, 3` iterate?",
    codeSnippet: `DO i = 1, 10, 3\n  ! Loop body\nEND DO`,
    options: [
      "3 times (i = 1, 4, 7)",
      "4 times (i = 1, 4, 7, 10)",
      "10 times",
      "Infinite loop"
    ],
    correctIndex: 1,
    explanation: "The loop executes for i = 1, 4, 7, and 10 (since 10 <= 10). That is a total of 4 iterations. On the next step, i would be 13 > 10, so the loop terminates."
  },
  {
    id: "fortran-cycle-vs-exit",
    langId: "fortran",
    trapCategory: "Control Flow",
    question: "What is the Fortran equivalent of the C/Python `continue` statement?",
    codeSnippet: `! Which statement skips to the next loop iteration?`,
    options: [
      "CONTINUE",
      "CYCLE",
      "NEXT",
      "PASS"
    ],
    correctIndex: 1,
    explanation: "In Fortran 90, `CYCLE` skips the remainder of the current loop body and begins the next iteration (identical to `continue` in C/Python). Note: Fortran has an archaic `CONTINUE` keyword, but it is merely a no-op placeholder for statement labels!"
  },
  {
    id: "fortran-pass-by-reference",
    langId: "fortran",
    trapCategory: "Subroutines & Functions",
    question: "How does Fortran pass arguments to subroutines and functions by default?",
    codeSnippet: `CALL compute(val)`,
    options: [
      "Pass-by-value (a copy is created)",
      "Pass-by-reference (the memory address is passed)",
      "Pass-by-name (lazy macro expansion)",
      "Pass-by-pointer exclusively via explicit pointers"
    ],
    correctIndex: 1,
    explanation: "Fortran passes all parameters by reference. Any modification to a dummy parameter inside a subroutine directly alters the argument in the caller unless guarded by `INTENT(IN)`."
  },
  {
    id: "fortran-custom-array-bounds",
    langId: "fortran",
    trapCategory: "Array Bounds",
    question: "What is the total number of elements allocated in `INTEGER, DIMENSION(-3:3) :: vec`?",
    codeSnippet: `INTEGER, DIMENSION(-3:3) :: vec`,
    options: [
      "6 elements",
      "7 elements (-3, -2, -1, 0, 1, 2, 3)",
      "3 elements",
      "Error: negative indices are prohibited"
    ],
    correctIndex: 1,
    explanation: "Fortran supports custom lower and upper bounds. The size is calculated as `upper - lower + 1` = `3 - (-3) + 1` = 7 elements."
  },
  {
    id: "fortran-f77-continuation",
    langId: "fortran",
    trapCategory: "Fixed Format F77",
    question: "In fixed-format Fortran 77, which column is reserved for the continuation character?",
    codeSnippet: `! In which column do you place a character to continue a line?`,
    options: [
      "Column 1",
      "Column 6",
      "Column 7",
      "Column 73"
    ],
    correctIndex: 1,
    explanation: "In Fortran 77, column 6 is the continuation column. Any non-blank, non-zero character in column 6 instructs the compiler that this line continues the previous statement."
  }
];
