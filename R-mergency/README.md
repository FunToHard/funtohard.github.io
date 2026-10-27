# R-mergency: The Academic Exam Cram Kit for Obsolete & Mandatory Languages

> **Mandate**: Computer science and engineering degree programs frequently force students to take exams in outdated, legacy, or domain-specific languages (R, MIPS, Scheme/Lisp, Prolog, Fortran, MATLAB, COBOL). Students waste dozens of hours debugging esoteric syntax and memorizing professor trick questions instead of learning modern systems, compilers, or software engineering.
>
> **R-mergency** provides high-density, zero-fluff, exam-oriented cram kits. Learn just what is required to pass university midterms, finals, and lab practicals with minimal time investment.

---

## Implemented Language Curriculums

1. **R Programming Language** (`languages/r/`):
   - § 1. Developer Mental Model (Python/C++ to R conversion, 1-based indexing, no scalars)
   - § 2. Core Data Structures (Vectors, Matrices, Lists, Factors, DataFrames)
   - § 3. Control Flow & The Apply Family (`ifelse`, `apply`, `lapply`, `sapply`, `tapply`)
   - § 4. The University Exam Gotcha Matrix (`1:n-1` bug, empty vector loops, NA/NULL/NaN, recycling rule)
   - § 5. Pure Base R Data Wrangling (Subsetting, boolean masks, `order()`, merging without tidyverse)
   - § 6. Hypothesis Testing & Regression (`summary()`, `t.test()`, `chisq.test()`, `lm()`, ANOVA table)
   - § 7. Base Graphics for Lab Exams (`plot()`, `hist()`, `boxplot()`, `par(mfrow)`)
   - § 8. 1-Page Printable Emergency Cram Sheet & Interactive Gotcha Drill

2. **MIPS Assembly** (`languages/mips/`):
   - § 1. Patterson-Hennessy Mental Model (Register Map, $zero, $at, $v0-$v1, $a0-$a3, $t0-$t9, $s0-$s7, $sp, $ra)
   - § 2. R-Type, I-Type, and J-Type Instruction Encoding & Bitfields
   - § 3. Memory Alignment & Byte-Addressing Traps (`lw`, `sw`, 4-byte offset scaling)
   - § 4. Branch vs. Jump Target Address Computation & Delay Slot Traps
   - § 5. Calling Conventions, Stack Frames & Preserving $ra
   - § 6. Syscall Matrix (MARS/SPIM print integer, print string, read int, exit)
   - § 7. High-Yield Exam Synthesis (Recursive procedures, string reversal, array search)

3. **Scheme & Lisp** (`languages/scheme/`):
   - § 1. Prefix S-Expressions & Truthiness Semantics (Only `#f` is falsy; `'()` and `0` are truthy!)
   - § 2. Cons Cells, Pairs, and Proper vs. Dotted Lists
   - § 3. Quotation Semantics (`quote`, `quasiquote`, `unquote`, `unquote-splicing`)
   - § 4. Scoping Traps: Parallel `let` vs. Sequential `let*` vs. Recursive `letrec`
   - § 5. Tail Call Optimization (TCO) & Accumulator Recursion Pattern
   - § 6. Higher-Order Functions: `map`, `filter`, `foldl` vs. `foldr`
   - § 7. High-Yield Exam Problems (Tail-recursive tree flattening, deep reverse)

4. **Prolog** (`languages/prolog/`):
   - § 1. Facts, Rules & Queries (Atoms vs. Variables capitalized)
   - § 2. Unification vs. Arithmetic Evaluation (`=` vs. `is`)
   - § 3. Backtracking, SLD-Resolution & Search Trees
   - § 4. The Green Cut vs. Red Cut Operator (`!`)
   - § 5. List Processing & Accumulator Recursion (`[H|T]`, `member/2`, `append/3`)
   - § 6. Standard University Exam Problems (Family trees, graph reachability)

5. **Fortran 77 / 90** (`languages/fortran/`):
   - § 1. Fixed-Format Column Rules (Columns 1-5, 6, 7-72) vs. Free-Format Fortran 90
   - § 2. Implicit Typing (I-N integer rule) and `IMPLICIT NONE`
   - § 3. Column-Major 2D Array Memory Traps & Matrix Multiplication
   - § 4. DO Loops, Loop Bounds & EXIT/CYCLE Semantics
   - § 5. Subroutines, Functions, and `INTENT(IN, OUT, INOUT)`
   - § 6. High-Yield Numerical Exam Problems (Gaussian elimination, trapezoidal numerical integration)

6. **MATLAB / Octave** (`languages/matlab/`):
   - § 1. 1-Based Indexing, Semicolon Output Suppression & Vector Orientation
   - § 2. Matrix Colon Operator & Logical Indexing Subsetting
   - § 3. Array Operations vs. Linear Algebra Operators (`.*`, `./`, `.^` vs. `*`, `/`, `^`)
   - § 4. Vectorization vs. For-Loops in University Benchmarks
   - § 5. Functions, Sub-functions & Return Tuple Variables
   - § 6. Built-in ODE Solvers (`ode45`) & Curve Fitting
   - § 7. Standard University Exam Problems (Eigenvalues, finite difference PDE step)

7. **COBOL** (`languages/cobol/`):
   - § 1. The 4 Mandatory Divisions (IDENTIFICATION, ENVIRONMENT, DATA, PROCEDURE)
   - § 2. Column Punch-Card Rules (Area A vs Area B)
   - § 3. PICTURE Clauses (PIC 9, PIC X, PIC V decimal point scaling, PIC S)
   - § 4. Level Numbers: 01 Record, 05 Group, 77 Standalone, 88 Condition Names
   - § 5. PROCEDURE Control Flow: PERFORM, PERFORM UNTIL, EVALUATE
   - § 6. Sequential File Processing: OPEN, READ ... AT END, WRITE, CLOSE

---

## Features

- **Apple HIG Developer Tooling Aesthetic**: High-density typography, tabular figures, neutral zinc surfaces, zero emoji pollution.
- **Persistent Sprint Timer**: 15m / 30m / 60m pre-exam sprints calculated via epoch delta with Web Audio API chime.
- **Gotcha Drill with Bookmarking**: Practice trick exam questions, flag tricky traps (`F`), and review flagged questions right before entering the examination hall.
- **Interactive Cheat Sheet with Instant Filter**: Live `/` keystroke search across all syntax and traps, with dedicated 2-column A4/Letter print optimization.
- **Unified Command Palette (⌘K)**: Instant full-text search across 47 exam modules and all 7 languages.

---

## Local Development & Build

```bash
# Clone the repository
git clone https://github.com/FunToHard/R-mergency.git
cd R-mergency

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

---

## License

MIT License. Free for students everywhere.
