import { QuizQuestion } from '../types';

export const MATLAB_QUIZZES: QuizQuestion[] = [
  {
    id: "matlab-semicolon-suppression",
    langId: "matlab",
    trapCategory: "Syntax Rules",
    question: "What happens when a statement in MATLAB is executed without a terminating semicolon (;)?",
    codeSnippet: `A = rand(1000, 1000)`,
    options: [
      "Throws a syntax error: missing terminator",
      "Calculates the result and prints all 1,000,000 values to the command window",
      "Saves the variable only into temporary cache",
      "Executes in debug mode"
    ],
    correctIndex: 1,
    explanation: "In MATLAB, terminating a statement with a semicolon suppresses output display. Omitting the semicolon forces MATLAB to format and print every element of the result to the console, freezing evaluator terminals in exams."
  },
  {
    id: "matlab-dot-operator",
    langId: "matlab",
    trapCategory: "Operators",
    question: "Given `x = [1, 2, 3]`, what is the difference between `x .^ 2` and `x ^ 2`?",
    codeSnippet: `x = [1, 2, 3];\ny1 = x .^ 2;\ny2 = x ^ 2;`,
    options: [
      "`x .^ 2` yields `[1, 4, 9]`; `x ^ 2` throws an error because matrix power requires a square matrix",
      "They are identical synonyms",
      "`x ^ 2` squares the elements, `x .^ 2` computes bitwise XOR",
      "Both produce `[1, 4, 9]`"
    ],
    correctIndex: 0,
    explanation: "`x .^ 2` is element-wise exponentiation, returning [1, 4, 9]. `x ^ 2` is matrix multiplication `x * x`, which is mathematically invalid for a 1x3 row vector and raises an error: 'Inputs must be a scalar and a square matrix'."
  },
  {
    id: "matlab-backslash-vs-inv",
    langId: "matlab",
    trapCategory: "Numerical Stability",
    question: "Why do professors require `x = A \\ b` instead of `x = inv(A) * b` to solve linear system Ax = b?",
    codeSnippet: `x = A \\ b;   % vs x = inv(A) * b;`,
    options: [
      "`A \\ b` uses Gaussian elimination with partial pivoting; it is faster ($O(N^3/3)$ vs $O(N^3)$) and numerically more stable",
      "`inv()` is deprecated in modern MATLAB",
      "`A \\ b` only works for integer matrices",
      "`inv(A)` transposes the matrix before inverting"
    ],
    correctIndex: 0,
    explanation: "`A \\ b` (the mldivide backslash operator) directly solves the linear system using LU decomposition with partial pivoting without computing the explicit matrix inverse. It is roughly 3x faster and significantly less prone to floating-point rounding errors."
  },
  {
    id: "matlab-size-vs-length",
    langId: "matlab",
    trapCategory: "Array Properties",
    question: "Given matrix `M = zeros(3, 8)`, what are the outputs of `size(M)` and `length(M)`?",
    codeSnippet: `M = zeros(3, 8);\ns = size(M);\nl = length(M);`,
    options: [
      "`size(M) = [3, 8]`, `length(M) = 8`",
      "`size(M) = 24`, `length(M) = 3`",
      "`size(M) = [3, 8]`, `length(M) = 3`",
      "`size(M) = [3, 8]`, `length(M) = 24`"
    ],
    correctIndex: 0,
    explanation: "`size(M)` returns the dimensions vector `[rows, columns]` = `[3, 8]`. `length(M)` returns the MAXIMUM dimension: `max(size(M))` = 8. To find total elements, use `numel(M)` (24)."
  },
  {
    id: "matlab-logical-masking",
    langId: "matlab",
    trapCategory: "Subsetting & Filtering",
    question: "Given `v = [10, -5, 20, -1]`, what does `v(v < 0) = 0` do?",
    codeSnippet: `v = [10, -5, 20, -1];\nv(v < 0) = 0;`,
    options: [
      "Replaces all negative numbers with zero, yielding `[10, 0, 20, 0]`",
      "Throws an indexing error",
      "Deletes all negative numbers",
      "Sets the entire vector `v` to 0"
    ],
    correctIndex: 0,
    explanation: "Logical indexing creates a boolean mask `[0, 1, 0, 1]`. Subscript assignment `v(v < 0) = 0` replaces exactly those elements matching the mask with zero."
  },
  {
    id: "matlab-colon-operator-step",
    langId: "matlab",
    trapCategory: "Sequences",
    question: "What is the evaluated output of `10:-3:1` in MATLAB?",
    codeSnippet: `10:-3:1`,
    options: [
      "`[10, 7, 4, 1]`",
      "`[10, 7, 4]`",
      "`[10, 7, 4, 1, -2]`",
      "Empty array `[]`"
    ],
    correctIndex: 0,
    explanation: "The syntax is `start:step:end`. Starting at 10, subtracting 3 gives 7, 4, and 1. Because 1 >= 1, 1 is included. The next value would be -2 < 1, so the sequence stops at 1: `[10, 7, 4, 1]`."
  },
  {
    id: "matlab-1-based-indexing",
    langId: "matlab",
    trapCategory: "Indexing Traps",
    question: "What happens when you evaluate `A(0)` in MATLAB?",
    codeSnippet: `A = [5, 10, 15];\nA(0)`,
    options: [
      "Returns 5 (first element)",
      "Returns 15 (last element like Python)",
      "Throws an error: Subscript indices must either be real positive integers or logicals",
      "Returns empty array `[]`"
    ],
    correctIndex: 2,
    explanation: "MATLAB is strictly 1-indexed. Index 0 is illegal and triggers a fatal runtime subscript error."
  },
  {
    id: "matlab-dynamic-array-growth",
    langId: "matlab",
    trapCategory: "Performance & Best Practices",
    question: "Why do professors deduct marks if you write `for i = 1:N; v(i) = i^2; end` without pre-allocation?",
    codeSnippet: `for i = 1:N\n  v(i) = i^2;  % without v = zeros(1, N)\nend`,
    options: [
      "Because dynamically resizing an array on each iteration causes quadratic $O(N^2)$ memory reallocation overhead",
      "Because `v(i)` syntax is only valid for matrices, not vectors",
      "Because `i` is a reserved constant for imaginary $\\sqrt{-1}$ and cannot be used as a loop index",
      "Because `end` must be replaced with `next`"
    ],
    correctIndex: 0,
    explanation: "Without pre-allocating `v = zeros(1, N)`, MATLAB must allocate a larger chunk of memory and copy the existing array on EVERY single iteration, leading to $O(N^2)$ running time."
  }
];
