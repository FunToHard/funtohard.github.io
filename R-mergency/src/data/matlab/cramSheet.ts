import { CramCard } from '../types';

export const MATLAB_CRAM_SHEET: CramCard[] = [
  {
    title: "1. Syntax & Semicolon Rule",
    items: [
      { label: "Semicolon (;)", snippet: "x = calculation;", note: "ALWAYS terminate lines to suppress output" },
      { label: "1-Based Indexing", snippet: "v(1) is first element", note: "v(0) throws illegal index error" },
      { label: "Comments", snippet: "% comment or %{ block %}", note: "Percent sign denotes comments" },
      { label: "Continuation", snippet: "... at end of line", note: "Triple ellipsis continues statement" },
      { label: "Clear & Clc", snippet: "clc; clear all; close all;", note: "Standard top-of-script reset" }
    ]
  },
  {
    title: "2. Array Construction",
    items: [
      { label: "Row Vector", snippet: "[1, 2, 3] or [1 2 3]", note: "Spaces/commas separate columns" },
      { label: "Column Vector", snippet: "[1; 2; 3]", note: "Semicolons separate rows" },
      { label: "Matrix", snippet: "[1 2; 3 4]", note: "2x2 2D array" },
      { label: "Colon Sequence", snippet: "start:step:end (e.g. 1:2:9)", note: "Inclusive integer/float step" },
      { label: "Linspace", snippet: "linspace(a, b, N)", note: "N linearly spaced points" },
      { label: "Pre-allocation", snippet: "zeros(M, N) or ones(M, N)", note: "Pre-allocates memory for loops" }
    ]
  },
  {
    title: "3. Matrix vs Element-Wise Operators",
    items: [
      { label: "Matrix Multiply", snippet: "A * B", note: "Linear algebra inner product" },
      { label: "Element Multiply", snippet: "A .* B", note: "Dot operator multiplies element-by-element" },
      { label: "Element Power", snippet: "A .^ 2", note: "Squares each element individually" },
      { label: "Element Divide", snippet: "A ./ B", note: "Divides corresponding elements" },
      { label: "Transpose", snippet: "A' (complex conj) or A.' (non-conj)", note: "Inverts rows and columns" }
    ]
  },
  {
    title: "4. Linear Algebra & Equations",
    items: [
      { label: "Solve Ax = b", snippet: "x = A \\ b", note: "Backslash operator (Gaussian elimination)" },
      { label: "Eigenvalues", snippet: "[V, D] = eig(A)", note: "D = diagonal eigenvalues, V = eigenvectors" },
      { label: "Determinant", snippet: "det(A)", note: "Scalar determinant" },
      { label: "Matrix Rank", snippet: "rank(A)", note: "Number of linearly independent rows" },
      { label: "Condition num", snippet: "cond(A)", note: "Sensitivity to numerical error" }
    ]
  },
  {
    title: "5. Plotting in Lab Exams",
    items: [
      { label: "Basic 2D Plot", snippet: "plot(x, y, 'r--o')", note: "Color, line style, marker style" },
      { label: "Hold plot", snippet: "hold on ... hold off", note: "Overlay multiple curves on 1 axes" },
      { label: "Labels", snippet: "xlabel('X'); ylabel('Y');", note: "Mandatory for full exam credit" },
      { label: "Title & Grid", snippet: "title('Text'); grid on;", note: "Standard lab formatting" },
      { label: "Subplots", snippet: "subplot(rows, cols, idx)", note: "Multi-figure grid partition" }
    ]
  },
  {
    title: "6. Exam Traps & Gotchas",
    items: [
      { label: "Missing dot .*", snippet: "x^2 instead of x.^2", note: "Throws non-square matrix error" },
      { label: "inv(A) * b", snippet: "NEVER use inv(A)*b", note: "Always write A \\ b for numerical stability" },
      { label: "size vs length", snippet: "size(M) = [R, C]; length = max(R, C)", note: "numel(M) = R * C total elements" },
      { label: "Dynamic loop growth", snippet: "v(i) = i inside loop", note: "Causes O(N^2) penalty; preallocate with zeros" }
    ]
  }
];
