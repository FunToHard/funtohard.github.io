import { QuizQuestion } from '../types';

export const R_QUIZZES: QuizQuestion[] = [
  {
    id: "r-precedence-1",
    langId: "r",
    trapCategory: "Operator Precedence",
    question: "What is the evaluated output of the following R expression?",
    codeSnippet: `n <- 4\n1:n - 1`,
    options: [
      "c(1, 2, 3)",
      "c(0, 1, 2, 3)",
      "c(1, 2, 3, 4)",
      "Error: invalid sequence syntax"
    ],
    correctIndex: 1,
    explanation: "The ':' sequence operator has higher precedence than '-' or '+'. '1:4 - 1' first generates 'c(1, 2, 3, 4)', and then subtracts 1 from every element, resulting in '0 1 2 3'."
  },
  {
    id: "r-indexing-zero",
    langId: "r",
    trapCategory: "1-Based Indexing",
    question: "Given `vec <- c(10, 20, 30)`, what does `vec[0]` return in R?",
    codeSnippet: `vec <- c(10, 20, 30)\nvec[0]`,
    options: [
      "10 (the first element)",
      "IndexError: index out of range",
      "numeric(0)",
      "NA"
    ],
    correctIndex: 2,
    explanation: "R is 1-indexed. Index 0 does not raise an error; it returns a zero-length atomic vector of that type (numeric(0))."
  },
  {
    id: "r-recycling-rule",
    langId: "r",
    trapCategory: "Vector Recycling",
    question: "What does `c(1, 2, 3, 4) + c(10, 20)` evaluate to?",
    codeSnippet: `c(1, 2, 3, 4) + c(10, 20)`,
    options: [
      "c(11, 22, 13, 24)",
      "c(11, 22)",
      "Error: non-conformable arrays",
      "c(11, 22, NA, NA)"
    ],
    correctIndex: 0,
    explanation: "The silent recycling rule repeats the shorter vector c(10, 20) twice to match length 4: c(1+10, 2+20, 3+10, 4+20) = c(11, 22, 13, 24)."
  },
  {
    id: "r-factor-coercion",
    langId: "r",
    trapCategory: "Type Coercion",
    question: "What is the value of `as.numeric(f)` when `f <- factor(c('50', '60', '50'))`?",
    codeSnippet: `f <- factor(c("50", "60", "50"))\nas.numeric(f)`,
    options: [
      "c(50, 60, 50)",
      "c(1, 2, 1)",
      "c('50', '60', '50')",
      "Warning: NAs introduced by coercion"
    ],
    correctIndex: 1,
    explanation: "as.numeric() on a factor retrieves the internal integer level IDs (1 for '50', 2 for '60'), NOT the underlying string values. To get the actual values, write as.numeric(as.character(f))."
  },
  {
    id: "r-na-propagation",
    langId: "r",
    trapCategory: "Missing Values",
    question: "What does `mean(c(10, 20, NA, 30))` evaluate to?",
    codeSnippet: `mean(c(10, 20, NA, 30))`,
    options: [
      "20",
      "NA",
      "NaN",
      "15"
    ],
    correctIndex: 1,
    explanation: "NA propagates through mathematical functions. Without passing `na.rm = TRUE`, the calculation returns NA."
  },
  {
    id: "r-single-vs-double-bracket",
    langId: "r",
    trapCategory: "List Subsetting",
    question: "Given `lst <- list(name = 'John', age = 22)`, what is the class of `lst[1]`?",
    codeSnippet: `lst <- list(name = "John", age = 22)\nclass(lst[1])`,
    options: [
      "'character'",
      "'list'",
      "'vector'",
      "'data.frame'"
    ],
    correctIndex: 1,
    explanation: "Single bracket `lst[1]` extracts a slice/sublist, whose class remains 'list'. Double bracket `lst[[1]]` or `lst$name` extracts the element itself ('character')."
  },
  {
    id: "r-empty-loop",
    langId: "r",
    trapCategory: "Loop Traps",
    question: "How many times does `for (i in 1:length(v))` execute if `v <- numeric(0)`?",
    codeSnippet: `v <- numeric(0)\nfor (i in 1:length(v)) { ... }`,
    options: [
      "0 times",
      "1 time",
      "2 times",
      "Throws an execution error"
    ],
    correctIndex: 2,
    explanation: "length(v) is 0, so `1:length(v)` becomes `1:0`, which creates the sequence c(1, 0). The loop runs 2 times! Always use `seq_along(v)`."
  },
  {
    id: "r-logical-and-trap",
    langId: "r",
    trapCategory: "Logical Operators",
    question: "Why does `df[df$age > 18 && df$score > 80, ]` fail to filter correctly across rows?",
    codeSnippet: `df[df$age > 18 && df$score > 80, ]`,
    options: [
      "`&&` evaluates only the first element (scalar short-circuit), ignoring subsequent rows",
      "`&&` does not exist in R; only `and` is valid",
      "Data frames require square brackets with commas removed",
      "`df$score` must be converted to numeric first"
    ],
    correctIndex: 0,
    explanation: "In R, `&` is the vectorized element-wise AND operator across arrays. `&&` is a short-circuit operator that strictly tests ONLY the first element of each vector."
  },
  {
    id: "r-sorting-data-frame",
    langId: "r",
    trapCategory: "Data Manipulation",
    question: "What is the correct way to sort a data frame `df` by column `score` in ascending order?",
    codeSnippet: `# Which command correctly sorts df by score?`,
    options: [
      "sort(df$score)",
      "df[order(df$score), ]",
      "sort(df, by = 'score')",
      "df.sort('score')"
    ],
    correctIndex: 1,
    explanation: "`sort()` sorts atomic vectors. To reorder entire rows of a data frame, you must use `order()`, which returns the row permutation indices: `df[order(df$score), ]`."
  },
  {
    id: "r-matrix-dimension-drop",
    langId: "r",
    trapCategory: "Matrix Dimensions",
    question: "When subsetting a single column `M[, 1]` from a 3x3 matrix `M`, what is the class of the returned object?",
    codeSnippet: `M <- matrix(1:9, 3, 3)\nclass(M[, 1])`,
    options: [
      "'matrix' of dimension 3x1",
      "'integer' or 'numeric' (vector)",
      "'list'",
      "'data.frame'"
    ],
    correctIndex: 1,
    explanation: "By default, 2D subsetting in R automatically drops dimensions if a single row or column remains, returning an atomic vector. To preserve matrix dimensions, pass `drop = FALSE`: `M[, 1, drop = FALSE]`."
  }
];
