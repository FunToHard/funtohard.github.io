import { ExamModule } from '../types';

export const MATLAB_MODULES: ExamModule[] = [
  {
    id: "matlab-mental-model",
    sectionNumber: "§ 01",
    title: "MATLAB Mental Model: Matrices & Semicolon Suppression",
    cramTimeMinutes: 15,
    overview: "MATLAB (Matrix Laboratory) treats every variable as a multi-dimensional array or matrix. 1-based indexing and semicolon output suppression are the first rules to master.",
    sections: [
      {
        heading: "1. The Semicolon Suppression Trap (;)",
        explanation: "In MATLAB, terminating a statement with a semicolon ';' suppresses the output from printing to the command window. Omitting ';' prints the full result. During an exam, forgetting ';' when creating a 10,000-element matrix freezes the console and evaluator computers, leading to immediate deductions.",
        code: `% FLOODS THE SCREEN (BAD FOR EXAMS):
x = linspace(0, 10, 10000)

% SUPPRESSES OUTPUT (CORRECT):
x = linspace(0, 10, 10000);`,
        trapNote: "[EXAM RULE] Put a semicolon ';' at the end of every line in script and function files unless you specifically intend to display that variable."
      },
      {
        heading: "2. 1-Based Indexing & Shape Conventions",
        explanation: "MATLAB arrays start at index 1. Attempting to access index 0 throws an 'Array indices must be positive integers' error.",
        code: `arr = [10, 20, 30, 40];
arr(1)    % Returns 10
% arr(0)  % ERROR: Subscript indices must either be real positive integers or logicals.`
      }
    ]
  },
  {
    id: "matlab-array-construction",
    sectionNumber: "§ 02",
    title: "Array Construction & The Colon Operator",
    cramTimeMinutes: 18,
    overview: "Creating row vectors, column vectors, and matrices using commas, spaces, and semicolons.",
    sections: [
      {
        heading: "1. Rows vs Columns vs Matrices",
        explanation: `• Spaces or commas separate COLUMNS (elements in the same row).
• Semicolons separate ROWS.`,
        code: `row_vec = [1, 2, 3];        % 1x3 row vector
col_vec = [1; 2; 3];        % 3x1 column vector

% 2x3 Matrix:
A = [1, 2, 3; 
     4, 5, 6];

% Transpose operator:
A_transposed = A';          % 3x2 matrix`
      },
      {
        heading: "2. Colon Sequences & linspace",
        explanation: `• 'start:end' generates steps of 1.
• 'start:step:end' generates custom steps.
• 'linspace(a, b, n)' generates n equally spaced points between a and b inclusive.`,
        code: `seq1 = 1:5;             % [1, 2, 3, 4, 5]
seq2 = 0:2:10;          % [0, 2, 4, 6, 8, 10]
seq3 = 10:-1:1;         % [10, 9, 8, ..., 1]

% Exactly 50 points between 0 and 2*pi:
t = linspace(0, 2*pi, 50);`
      },
      {
        heading: "3. Special Matrix Constructors",
        explanation: "Pre-allocating matrices for lab exam algorithms.",
        code: `Z = zeros(3, 4);        % 3 rows, 4 cols of zeros
O = ones(2, 5);         % 2 rows, 5 cols of ones
I = eye(3);             % 3x3 Identity matrix
R = rand(3, 3);         % 3x3 uniform random numbers in [0, 1]`
      }
    ]
  },
  {
    id: "matlab-elementwise-vs-matrix",
    sectionNumber: "§ 03",
    title: "Element-Wise (.*, ./, .^) vs Matrix Operators (*, /, ^)",
    cramTimeMinutes: 20,
    overview: "The most common bug in engineering lab exams: confusing linear algebra matrix operations with element-wise array operations.",
    sections: [
      {
        heading: "1. The Dot Operators (.*, ./, .^)",
        explanation: `• '*' is true linear algebra matrix multiplication (inner dimensions must match).
• '.*' multiplies corresponding elements individually (matrices must have identical dimensions).
• '^' raises a square matrix to a power.
• '.^' raises each individual number to that power.`,
        code: `A = [1, 2; 3, 4];
B = [2, 0; 1, 2];

% Matrix Multiplication:
C_mat = A * B;          % [1*2 + 2*1, 1*0 + 2*2; 3*2 + 4*1, 3*0 + 4*2]
                        % Result: [4, 4; 10, 8]

% Element-Wise Multiplication:
C_elem = A .* B;        % [1*2, 2*0; 3*1, 4*2]
                        % Result: [2, 0; 3, 8]

% Squaring every element:
x = [1, 2, 3, 4];
y = x .^ 2;             % [1, 4, 9, 16] - (x^2 throws error: inputs must be scalar or square matrix)`
      },
      {
        heading: "2. Vectorized Function Evaluation",
        explanation: "When plotting a mathematical function like y = (x^2 * sin(x)) / (x + 1), EVERY operator must use dot notation.",
        code: `x = linspace(0, 10, 100);

% WRONG (Fails on vectors):
% y = x^2 * sin(x) / (x + 1);

% CORRECT:
y = (x.^2 .* sin(x)) ./ (x + 1);`
      }
    ]
  },
  {
    id: "matlab-logical-indexing",
    sectionNumber: "§ 04",
    title: "Logical Indexing & Filtering",
    cramTimeMinutes: 18,
    overview: "Filtering elements without writing slow for-loops using boolean masks and find().",
    sections: [
      {
        heading: "1. Boolean Mask Subsetting",
        explanation: "Passing a logical array directly into the subscript extracts only the matching elements.",
        code: `scores = [45, 82, 91, 58, 73, 95, 30];

% Mask of passing scores:
pass_mask = scores >= 60;       % [0, 1, 1, 0, 1, 1, 0]

% Extract passing scores:
passed = scores(pass_mask);     % [82, 91, 73, 95]

% Replace failing scores with zero:
scores(scores < 60) = 0;        % [0, 82, 91, 0, 73, 95, 0]`
      },
      {
        heading: "2. The find() Function",
        explanation: "find() returns the integer linear indices where a condition is true.",
        code: `indices = find(scores > 80);  % [2, 3, 6]`
      }
    ]
  },
  {
    id: "matlab-functions-scripts",
    sectionNumber: "§ 05",
    title: "Functions, Scripts & Array Pre-Allocation",
    cramTimeMinutes: 18,
    overview: "Understanding function syntax, multiple return values, and avoiding dynamic array resizing penalties.",
    sections: [
      {
        heading: "1. Function Header Syntax",
        explanation: "A function must reside in a file with the same name as the function ('my_stats.m').",
        code: `function [mean_val, std_val] = my_stats(data)
  % Computes mean and standard deviation
  n = length(data);
  mean_val = sum(data) / n;
  std_val = sqrt(sum((data - mean_val).^2) / (n - 1));
end`,
        trapNote: "[TRAP] In MATLAB, multiple outputs are enclosed in square brackets '[out1, out2]', NOT parentheses!"
      },
      {
        heading: "2. Array Pre-Allocation in Loops",
        explanation: "Growing an array dynamically inside a loop (`arr(i) = ...`) reallocates memory on every iteration, which professors specifically test for and penalize.",
        code: `% BAD (Loses style marks on lab exams):
% for i = 1:10000
%   res(i) = i^2;
% end

% GOOD (Pre-allocated with zeros):
res = zeros(1, 10000);
for i = 1:10000
  res(i) = i^2;
end`
      }
    ]
  },
  {
    id: "matlab-lab-plotting",
    sectionNumber: "§ 06",
    title: "Lab Exam Plotting & Subplots",
    cramTimeMinutes: 20,
    overview: "Plotting requirements for lab practical exams: lines, styles, labels, legends, and multi-panel figures.",
    sections: [
      {
        heading: "1. Standard 2D Plot with Labels",
        explanation: "Always include title, xlabel, ylabel, and grid on for full credit in lab exams.",
        code: `t = linspace(0, 2*pi, 100);
y1 = sin(t);
y2 = cos(t);

figure;
plot(t, y1, 'b-o', 'LineWidth', 1.5);   % Blue solid line with circle markers
hold on;                                 % Retain current plot
plot(t, y2, 'r--', 'LineWidth', 1.5);   % Red dashed line
hold off;

title('Trigonometric Waveforms');
xlabel('Time (rad)');
ylabel('Amplitude');
legend('sin(t)', 'cos(t)');
grid on;`
      },
      {
        heading: "2. The subplot(m, n, p) Grid",
        explanation: "Splits the figure window into m rows and n columns, selecting panel p.",
        code: `% 2 rows, 1 column:
subplot(2, 1, 1);
plot(t, sin(t));
title('Sine');

subplot(2, 1, 2);
plot(t, cos(t));
title('Cosine');`
      }
    ]
  },
  {
    id: "matlab-exam-linear-algebra",
    sectionNumber: "§ 07",
    title: "Top Lab Practical Algorithms: Ax = b & ODEs",
    cramTimeMinutes: 25,
    overview: "Standard 10-mark lab practical questions: Solving systems of linear equations and integrating ODEs.",
    sections: [
      {
        heading: "Q1: Solving Linear System Ax = b (Backslash vs inv)",
        explanation: "Why `x = A \\ b` is mandatory on exams instead of `inv(A) * b`.",
        code: `A = [3, 2, -1; 
     2, -2, 4; 
     -1, 0.5, -1];
b = [1; -2; 0];

% CORRECT (Backslash operator uses Gaussian elimination):
x = A \\ b;

% NEVER write x = inv(A) * b on exams (slower, numerically unstable)!`
      },
      {
        heading: "Q2: Numerical ODE Solution with ode45",
        explanation: "Solve dy/dt = -2*y + sin(t) with y(0) = 1 on t in [0, 10].",
        code: `dydt = @(t, y) -2*y + sin(t);
tspan = [0, 10];
y0 = 1;

[t, y] = ode45(dydt, tspan, y0);

plot(t, y, 'k-', 'LineWidth', 2);
title('ODE Solution dy/dt = -2y + sin(t)');
xlabel('Time t'); ylabel('y(t)');
grid on;`
      }
    ]
  }
];
