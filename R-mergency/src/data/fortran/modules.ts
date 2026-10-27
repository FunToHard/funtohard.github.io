import { ExamModule } from '../types';

export const FORTRAN_MODULES: ExamModule[] = [
  {
    id: "fortran-mental-model",
    sectionNumber: "§ 01",
    title: "Fortran Mental Model: Format Rules & Program Skeleton",
    cramTimeMinutes: 15,
    overview: "Fortran is designed for high-performance numerical computing. Older university lab environments use Fortran 77 (rigid column rules) while modern exams allow Fortran 90 (free format).",
    sections: [
      {
        heading: "1. Fortran 77 Fixed Format vs Fortran 90 Free Format",
        explanation: `In Fortran 77 (.f or .for), column positions are strictly enforced:
• Col 1-5: Statement label (line number)
• Col 6: Continuation character (any character except 0/blank)
• Col 7-72: Actual Fortran statements
• Col 73-80: Ignored (historical punch card sequence numbers)
• Col 1 'C' or '*': Comment line

Fortran 90 (.f90) uses Free Format: statements start anywhere, '!' is a comment, and '&' at the end of a line indicates continuation.`,
        code: `! Fortran 90 Free-Format Skeleton:
PROGRAM hello_exam
  IMPLICIT NONE
  
  PRINT *, "Welcome to Fortran Numerical Computing"
END PROGRAM hello_exam`,
        trapNote: "[TRAP] In Fortran 77, putting code in columns 1 through 6 causes severe compiler syntax errors. Col 7 is the first valid code column!"
      },
      {
        heading: "2. Case Insensitivity",
        explanation: "Fortran is completely case-insensitive. 'PROGRAM', 'program', and 'Program' are identical. Academic convention traditionally capitalizes keywords ('REAL', 'INTEGER', 'DO') for readability.",
        code: `INTEGER :: count
integer :: COUNT ! Refers to the EXACT same variable`
      }
    ]
  },
  {
    id: "fortran-implicit-typing",
    sectionNumber: "§ 02",
    title: "Implicit Typing & The Golden Rule: IMPLICIT NONE",
    cramTimeMinutes: 18,
    overview: "Fortran's original 1957 rule: variables are typed automatically based on their first letter. If you do not declare IMPLICIT NONE, typos create silent new variables.",
    sections: [
      {
        heading: "1. The I-N Implicit Typing Convention",
        explanation: `By historical default:
• Variable names beginning with I, J, K, L, M, N (or lowercase i through n) are automatically INTEGER.
• Variable names beginning with any other letter (A-H, O-Z) are automatically REAL (single precision float).`,
        code: `! WITHOUT IMPLICIT NONE:
count = 5.8     ! Starts with C => REAL (5.8)
index = 5.8     ! Starts with I => INTEGER (truncated to 5!)
total = 100     ! Starts with T => REAL (100.0)`,
        trapNote: "[EXAM RULE] ALWAYS write 'IMPLICIT NONE' as the very first line after PROGRAM or SUBROUTINE. Evaluators immediately dock marks if this is absent."
      },
      {
        heading: "2. Integer Division Truncation",
        explanation: "Dividing two integers in Fortran truncates the fractional part toward zero. 5 / 2 yields 2, NOT 2.5.",
        code: `REAL :: result
result = 5 / 2        ! Evaluates integer 5/2 = 2, then assigns 2.0 to result!
result = 5.0 / 2.0    ! Correct: 2.5`
      },
      {
        heading: "3. Modern Type Declarations (Fortran 90)",
        explanation: "Use '::' to declare variables and set initial values.",
        code: `PROGRAM types_demo
  IMPLICIT NONE
  INTEGER :: i = 0, n = 100
  REAL :: tolerance = 1.0E-5
  DOUBLE PRECISION :: pi = 3.141592653589793D0
  LOGICAL :: converged = .FALSE.
  CHARACTER(LEN=20) :: student_name = "Alice"
END PROGRAM types_demo`
      }
    ]
  },
  {
    id: "fortran-arrays-memory",
    sectionNumber: "§ 03",
    title: "Arrays & Column-Major Ordering",
    cramTimeMinutes: 20,
    overview: "Unlike C and Python (which are row-major), Fortran stores multidimensional arrays in COLUMN-MAJOR order. Arrays are 1-indexed by default.",
    sections: [
      {
        heading: "1. Column-Major Memory Layout",
        explanation: "In memory, the FIRST index varies fastest. In a 2D matrix A(i, j), column elements A(1, 1), A(2, 1), A(3, 1) are stored in contiguous memory addresses.",
        code: `INTEGER, DIMENSION(2, 2) :: A
A(1, 1) = 10; A(2, 1) = 20  ! Column 1 (contiguous)
A(1, 2) = 30; A(2, 2) = 40  ! Column 2 (contiguous)

! Loop Order Exam Trap:
! CORRECT (Fast cache traversal: Outer loop over J, Inner loop over I):
DO j = 1, 2
  DO i = 1, 2
    A(i, j) = A(i, j) * 2
  END DO
END DO`,
        trapNote: "[TRAP] If you nest loops with I on the outside and J on the inside, Fortran jumps across columns, thrashing the CPU cache. Always iterate column-first (Inner loop = 1st index)!"
      },
      {
        heading: "2. Custom Array Index Bounds",
        explanation: "Fortran allows arrays to start at arbitrary lower bounds, including zero or negative numbers.",
        code: `REAL, DIMENSION(-5:5) :: temperature_offset
temperature_offset(0) = 25.0
temperature_offset(-5) = 12.5`
      }
    ]
  },
  {
    id: "fortran-control-flow",
    sectionNumber: "§ 04",
    title: "Control Flow: DO Loops & I/O",
    cramTimeMinutes: 18,
    overview: "Fortran uses DO loops instead of for-loops. 'EXIT' breaks out of a loop, and 'CYCLE' jumps to the next iteration.",
    sections: [
      {
        heading: "1. The DO Loop Syntax",
        explanation: "DO var = start, end [, step]. The loop is inclusive on both ends.",
        code: `INTEGER :: i, sum_val = 0

! Sum 1 to 10 with step 2 (1, 3, 5, 7, 9):
DO i = 1, 10, 2
  sum_val = sum_val + i
END DO

! EXIT (break) and CYCLE (continue):
DO i = 1, 100
  IF (i == 13) CYCLE   ! Skip 13
  IF (i > 50) EXIT     ! Stop loop
END DO`
      },
      {
        heading: "2. Formatted & Unformatted I/O (READ & PRINT)",
        explanation: "Standard terminal I/O uses PRINT * or READ *.",
        code: `INTEGER :: n
REAL :: x

PRINT *, "Enter integer N and real X:"
READ *, n, x

! Formatted output: (I5 = integer width 5, F8.3 = float with 3 decimals)
WRITE(*, '(A, I5, A, F8.3)') "N = ", n, " | X = ", x`
      }
    ]
  },
  {
    id: "fortran-subroutines-functions",
    sectionNumber: "§ 05",
    title: "Subroutines vs Functions (Pass-by-Reference & INTENT)",
    cramTimeMinutes: 20,
    overview: "Fortran passes all parameters by reference. A FUNCTION returns a single scalar or array; a SUBROUTINE is invoked with CALL and returns multiple values through argument modification.",
    sections: [
      {
        heading: "1. Subroutines and the INTENT Attribute",
        explanation: "Use INTENT(IN), INTENT(OUT), and INTENT(INOUT) to prevent unintended side effects and satisfy exam rubrics.",
        code: `SUBROUTINE swap(a, b)
  IMPLICIT NONE
  REAL, INTENT(INOUT) :: a, b
  REAL :: temp
  
  temp = a
  a = b
  b = temp
END SUBROUTINE swap

! Invocation:
! CALL swap(x, y)`
      },
      {
        heading: "2. Pure Functions",
        explanation: "Functions must compute and return a result via the function name or RESULT clause.",
        code: `FUNCTION factorial(n) RESULT(res)
  IMPLICIT NONE
  INTEGER, INTENT(IN) :: n
  INTEGER :: res, i
  
  res = 1
  DO i = 2, n
    res = res * i
  END DO
END FUNCTION factorial`
      }
    ]
  },
  {
    id: "fortran-exam-numerical",
    sectionNumber: "§ 06",
    title: "Top Numerical Exam Questions & Algorithms",
    cramTimeMinutes: 25,
    overview: "Classic university lab exam algorithms: Matrix multiplication and numerical integration.",
    sections: [
      {
        heading: "Q1: Matrix Multiplication (C = A * B in O(N^3))",
        explanation: "Write a subroutine to multiply two NxN matrices.",
        code: `SUBROUTINE mat_mult(A, B, C, n)
  IMPLICIT NONE
  INTEGER, INTENT(IN) :: n
  REAL, DIMENSION(n, n), INTENT(IN) :: A, B
  REAL, DIMENSION(n, n), INTENT(OUT) :: C
  INTEGER :: i, j, k

  C = 0.0
  DO j = 1, n
    DO k = 1, n
      DO i = 1, n
        C(i, j) = C(i, j) + A(i, k) * B(k, j)
      END DO
    END DO
  END DO
END SUBROUTINE mat_mult`
      },
      {
        heading: "Q2: Trapezoidal Rule for Numerical Integration",
        explanation: "Approximate the integral of f(x) from a to b with n panels.",
        code: `FUNCTION trapezoidal(a, b, n) RESULT(integral)
  IMPLICIT NONE
  REAL, INTENT(IN) :: a, b
  INTEGER, INTENT(IN) :: n
  REAL :: integral, h, x
  INTEGER :: i

  h = (b - a) / REAL(n)
  integral = 0.5 * (func(a) + func(b))

  DO i = 1, n - 1
    x = a + i * h
    integral = integral + func(x)
  END DO

  integral = integral * h
CONTAINS
  REAL FUNCTION func(x)
    REAL, INTENT(IN) :: x
    func = x**2 + 2.0 * x  ! f(x) = x^2 + 2x
  END FUNCTION func
END FUNCTION trapezoidal`
      }
    ]
  }
];
