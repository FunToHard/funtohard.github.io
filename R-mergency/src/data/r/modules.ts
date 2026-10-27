export interface ModuleSection {
  heading: string;
  explanation: string;
  code?: string;
  trapNote?: string;
  outputExample?: string;
}

export interface ExamModule {
  id: string;
  sectionNumber: string;
  title: string;
  cramTimeMinutes: number;
  overview: string;
  sections: ModuleSection[];
}

export const R_MODULES: ExamModule[] = [
  {
    id: "mental-model",
    sectionNumber: "§ 01",
    title: "Developer Mental Model (R vs Python/C++)",
    cramTimeMinutes: 12,
    overview: "R is a functional, vector-oriented language designed by statisticians, not software engineers. If you try to write C-style loops and scalar manipulations, you will write slow code and lose marks on exams.",
    sections: [
      {
        heading: "1. 1-Based Indexing & No Primitive Scalars",
        explanation: "In R, arrays start at index 1, not 0. Furthermore, there is NO primitive scalar type: a single number like 42 is an atomic vector of length 1.",
        code: `# In Python: arr[0] is the first element
# In R: vec[1] is the first element!
x <- 42
is.vector(x)      # TRUE
length(x)         # 1
x[1]              # 42

# Indexing with 0 returns an empty vector of that type:
x[0]              # numeric(0)`,
        trapNote: "[TRAP] If you write arr[0] out of muscle memory, R will NOT throw an IndexError! It returns numeric(0) or character(0), silently corrupting calculations."
      },
      {
        heading: "2. Assignment Operators: <- vs =",
        explanation: "Both '<-' and '=' assign values, but academic graders and exam rubrics penalize '='. Always use '<-' for top-level assignments. '=' is reserved for named arguments inside function calls.",
        code: `# Always write this in exam scripts:
student_marks <- c(85, 92, 78)

# Use '=' inside function signatures:
mean(x = student_marks, trim = 0.1)`,
        trapNote: "[EXAM RULE] Use '<-' everywhere for assignment. Exam evaluators will deduct marks if they see '=' in procedural code."
      },
      {
        heading: "3. Vectorization Over Loops",
        explanation: "Arithmetic and logical operations in R are element-wise by default across entire vectors. Writing a for-loop to add two arrays is considered an anti-pattern in R exam rubrics.",
        code: `a <- c(1, 2, 3, 4)
b <- c(10, 20, 30, 40)

# WRONG (Loop approach - loses marks on style):
# res <- numeric(4)
# for (i in 1:4) { res[i] <- a[i] + b[i] }

# CORRECT (Vectorized):
res <- a + b      # c(11, 22, 33, 44)`
      },
      {
        heading: "4. Pass-by-Value Semantics",
        explanation: "R passes all arguments by value (with copy-on-modify optimization). Modifying an argument inside a function NEVER alters the caller's variable outside.",
        code: `increment <- function(num) {
  num <- num + 10
  return(num)
}

val <- 5
increment(val)    # Returns 15
print(val)        # Still 5!`
      }
    ]
  },
  {
    id: "core-types",
    sectionNumber: "§ 02",
    title: "Core Data Structures & Coercion Rules",
    cramTimeMinutes: 18,
    overview: "Every exam contains questions identifying types, conversions, and indexing. Master the five fundamental structures: Vector, Matrix, List, Factor, and Data Frame.",
    sections: [
      {
        heading: "1. Atomic Vectors & Coercion Hierarchy",
        explanation: "Atomic vectors hold elements of ONE single type. If you mix types inside c(), R automatically coerces them without throwing an error following this strict hierarchy: logical -> integer -> double (numeric) -> character.",
        code: `v1 <- c(TRUE, 1L)        # integer: c(1L, 1L)
v2 <- c(1L, 3.14)        # double: c(1.0, 3.14)
v3 <- c(3.14, "hello")   # character: c("3.14", "hello")
v4 <- c(TRUE, 0, "test") # character: c("TRUE", "0", "test")`,
        trapNote: "[TRAP] c(TRUE, 2, FALSE) becomes numeric c(1, 2, 0). TRUE coerces to 1, FALSE coerces to 0."
      },
      {
        heading: "2. Matrices: Construction & Multiplication",
        explanation: "Matrices are 2-dimensional atomic vectors. By default, matrix() fills COLUMN-BY-COLUMN. Matrix multiplication requires the '%*%' operator, whereas '*' does element-wise multiplication.",
        code: `# Default: Column-wise fill
M <- matrix(1:6, nrow = 2, ncol = 3)
#      [,1] [,2] [,3]
# [1,]    1    3    5
# [2,]    2    4    6

# Row-wise fill:
M_row <- matrix(1:6, nrow = 2, ncol = 3, byrow = TRUE)

# Matrix multiplication vs Element-wise:
A <- matrix(1:4, 2, 2)
B <- matrix(5:8, 2, 2)
ElemProduct <- A * B      # Element-wise
DotProduct  <- A %*% B    # True matrix product`
      },
      {
        heading: "3. Lists: Single Bracket [ ] vs Double Bracket [[ ]]",
        explanation: "Lists are heterogeneous containers (can hold vectors of varying types, data frames, or other lists). The difference between [ ] and [[ ]] is an exam guarantee.",
        code: `my_list <- list(name = "Alice", scores = c(90, 85, 95), active = TRUE)

# Single bracket [ ] returns a SUBLIST (container of 1 element)
sub <- my_list[1]         # Type is still list, length 1

# Double bracket [[ ]] drills down and extracts the RAW CONTENT
val <- my_list[[1]]       # Type is character ("Alice")

# Dollar sign $ is syntactic sugar for double brackets:
scores <- my_list$scores  # c(90, 85, 95)`
      },
      {
        heading: "4. Factors: Categorical Traps",
        explanation: "Factors store categorical variables using an integer vector mapping to text levels. Converting a factor of numbers directly with as.numeric() gives the INTERNAL LEVEL CODES, not the numbers!",
        code: `f <- factor(c("100", "200", "100"))

# CRITICAL EXAM TRAP:
as.numeric(f)                 # Returns c(1, 2, 1) - WRONG!

# CORRECT CONVERSION:
as.numeric(as.character(f))   # Returns c(100, 200, 100) - CORRECT!`,
        trapNote: "[TRAP] Always convert factor -> character -> numeric. as.numeric(factor) is a standard university trick question."
      },
      {
        heading: "5. Data Frames",
        explanation: "A data frame is a list of equal-length vectors. Each column can have a distinct type. Access columns via df$col or df[['col']].",
        code: `df <- data.frame(
  id = 1:3,
  name = c("Bob", "Carol", "Dan"),
  score = c(88.5, 92.0, 79.5),
  stringsAsFactors = FALSE
)

# Dimension & overview functions:
dim(df)       # c(3, 3) (rows, columns)
nrow(df)      # 3
ncol(df)      # 3
str(df)       # Structure summary
summary(df)   # 5-number statistics`
      }
    ]
  },
  {
    id: "control-and-apply",
    sectionNumber: "§ 03",
    title: "Loops, Vectorization & The Apply Family",
    cramTimeMinutes: 20,
    overview: "Professors frequently test the apply family (apply, lapply, sapply, tapply) because it distinguishes competent functional R programmers from beginner loop coders.",
    sections: [
      {
        heading: "1. For Loops & The 0-Length Bug",
        explanation: "If you must write a for loop in an exam, NEVER loop with 1:length(vec). If vec is empty (length 0), 1:0 iterates twice (1, then 0). Always use seq_along(vec).",
        code: `vec <- numeric(0)

# WRONG (Crashes or iterates 1 then 0):
# for (i in 1:length(vec)) { ... }

# CORRECT:
for (i in seq_along(vec)) {
  # Iterates 0 times if empty
  print(vec[i])
}`
      },
      {
        heading: "2. Vectorized Conditionals: ifelse()",
        explanation: "Base R 'if' only checks a scalar condition (length 1). To classify an entire vector based on a condition, use ifelse(test, yes, no).",
        code: `scores <- c(45, 78, 92, 58, 81)

# Categorize into Pass / Fail:
result <- ifelse(scores >= 60, "Pass", "Fail")
# c("Fail", "Pass", "Pass", "Fail", "Pass")`
      },
      {
        heading: "3. apply(): 2D Matrices and Arrays",
        explanation: "apply(X, MARGIN, FUN) applies a function across rows or columns. MARGIN = 1 means ROW-wise; MARGIN = 2 means COLUMN-wise.",
        code: `mat <- matrix(1:12, nrow = 3, ncol = 4)

# Sum across ROWS (MARGIN = 1):
row_sums <- apply(mat, 1, sum)

# Mean across COLUMNS (MARGIN = 2):
col_means <- apply(mat, 2, mean)`,
        trapNote: "[MNEMONIC] 1 looks like a horizontal line across -> Rows. 2 has two upright halves -> Columns."
      },
      {
        heading: "4. lapply() vs sapply()",
        explanation: "lapply always returns a LIST. sapply tries to 'simplify' the result into an atomic vector or matrix if the outputs have consistent lengths.",
        code: `vals <- list(a = 1:5, b = 10:15)

# lapply returns a list:
res_list <- lapply(vals, mean)
# $a: 3, $b: 12.5 (class: list)

# sapply returns a simplified named vector:
res_vec <- sapply(vals, mean)
# a: 3.0, b: 12.5 (class: numeric vector)`
      },
      {
        heading: "5. tapply(): Grouped Aggregations",
        explanation: "tapply(X, INDEX, FUN) computes a summary statistic on X grouped by factor/category INDEX. Essential for lab exam questions.",
        code: `salaries <- c(50000, 60000, 80000, 90000, 55000)
dept <- factor(c("Sales", "Sales", "Eng", "Eng", "Sales"))

# Average salary by department:
avg_by_dept <- tapply(salaries, dept, mean)
#   Eng  Sales 
# 85000  55000`
      }
    ]
  },
  {
    id: "exam-gotchas",
    sectionNumber: "§ 04",
    title: "The Professor Trap Matrix (Top 8 Gotchas)",
    cramTimeMinutes: 15,
    overview: "Exams love trick questions based on operator precedence, vector recycling, and missing value behavior. Memorize this matrix to score easy points.",
    sections: [
      {
        heading: "Gotcha 1: The Colon Precedence Trap (1:n - 1)",
        explanation: "The sequence operator ':' has HIGHER precedence than subtraction or addition. '1:n - 1' evaluates as '(1:n) - 1', NOT '1:(n - 1)'.",
        code: `n <- 5
1:n - 1       # Returns c(0, 1, 2, 3, 4) - TRAP!
1:(n - 1)     # Returns c(1, 2, 3, 4) - What the examiner intended!`,
        trapNote: "[TRAP] Questions will ask: 'What is the output of 1:4 - 1?' Answer is 0 1 2 3, NOT 1 2 3."
      },
      {
        heading: "Gotcha 2: The Silent Recycling Rule",
        explanation: "When performing arithmetic on two vectors of unequal lengths, R repeats (recycles) the shorter vector to match the longer one. If the longer length is a multiple of the shorter, NO WARNING is issued.",
        code: `a <- c(1, 2, 3, 4)
b <- c(10, 20)

a + b
# Evaluates as: c(1+10, 2+20, 3+10, 4+20)
# Output: c(11, 22, 13, 24) without any error or warning!`
      },
      {
        heading: "Gotcha 3: NA vs NULL vs NaN vs Inf",
        explanation: "R has four distinct special values that professors love distinguishing in multiple-choice and short-answer sections.",
        code: `# NA: Not Available (Missing value, retains type, length 1)
is.na(NA)          # TRUE
length(NA)         # 1

# NULL: Empty object (Represents absence of an object, length 0)
is.null(NULL)      # TRUE
length(NULL)       # 0

# NaN: Not a Number (Invalid numeric calculation, e.g. 0/0)
0 / 0              # NaN
is.nan(NaN)        # TRUE

# Inf / -Inf: Infinite value (e.g. 1/0, -1/0)
1 / 0              # Inf
is.infinite(Inf)   # TRUE`
      },
      {
        heading: "Gotcha 4: NA Propagation in Calculations",
        explanation: "Any arithmetic or statistical calculation involving NA returns NA unless na.rm = TRUE is explicitly passed.",
        code: `nums <- c(10, 20, NA, 40)
mean(nums)                 # Returns NA!
mean(nums, na.rm = TRUE)   # Returns 23.333`
      },
      {
        heading: "Gotcha 5: Dimension Drop During Subsetting",
        explanation: "Extracting a single column from a data frame or matrix using [ , 1] drops the 2D structure and returns an atomic vector, which can break downstream matrix code. Prevent it with drop = FALSE.",
        code: `mat <- matrix(1:4, 2, 2)
col1 <- mat[, 1]                # numeric vector c(1, 2)
col1_mat <- mat[, 1, drop = FALSE] # 2x1 matrix preserved!`
      },
      {
        heading: "Gotcha 6: Vectorised & vs Short-Circuit &&",
        explanation: "'&' and '|' are element-wise logical operators across vectors. '&&' and '||' evaluate ONLY the first element (short-circuiting). Using '&&' inside ifelse() or with vectors is an error.",
        code: `v1 <- c(TRUE, FALSE, TRUE)
v2 <- c(TRUE, TRUE, FALSE)

v1 & v2    # c(TRUE, FALSE, FALSE) -> Element-wise
v1 && v2   # TRUE -> Checks ONLY the 1st elements (v1[1] && v2[1])`
      },
      {
        heading: "Gotcha 7: The Default String Conversion in Older Base R",
        explanation: "In older R versions (pre-4.0) and in many outdated university exam environments, data.frame() converts strings to factors by default unless stringsAsFactors = FALSE is specified.",
        code: `df <- data.frame(id = 1:2, role = c("Admin", "User"), stringsAsFactors = FALSE)`
      },
      {
        heading: "Gotcha 8: Identical() vs ==",
        explanation: "'==' checks element-wise equality and propagates NA. To test whether two objects are strictly identical, use identical(x, y).",
        code: `c(1, 2) == c(1, 3)          # c(TRUE, FALSE)
NA == NA                    # Returns NA (unknown!)
identical(NA, NA)           # Returns TRUE`
      }
    ]
  },
  {
    id: "base-wrangling",
    sectionNumber: "§ 05",
    title: "Pure Base R Data Wrangling (No Tidyverse)",
    cramTimeMinutes: 20,
    overview: "University lab exams test data manipulation without dplyr. You must know how to filter, sort, aggregate, and merge using standard Base R indexing.",
    sections: [
      {
        heading: "1. Filtering Rows via Boolean Masking",
        explanation: "Select rows by passing a logical condition into the row slot df[condition, ]. Don't forget the trailing comma!",
        code: `df <- data.frame(
  name = c("Alex", "Beth", "Charlie", "David"),
  age = c(19, 22, 21, 20),
  gpa = c(3.2, 3.8, 2.9, 3.9),
  major = c("CS", "EE", "CS", "CS")
)

# Filter: CS majors with GPA >= 3.5:
top_cs <- df[df$major == "CS" & df$gpa >= 3.5, ]
# Trailing comma is mandatory: df[rows, columns]`
      },
      {
        heading: "2. Sorting Data Frames with order()",
        explanation: "sort() sorts an atomic vector, NOT a data frame. To sort a data frame, use order() which returns the permutation index vector.",
        code: `# WRONG: sort(df) throws an error!

# CORRECT: Sort by GPA ascending:
sorted_asc <- df[order(df$gpa), ]

# Sort by GPA descending:
sorted_desc <- df[order(-df$gpa), ]

# Multi-column sort: Major ascending, GPA descending:
multi_sort <- df[order(df$major, -df$gpa), ]`
      },
      {
        heading: "3. Merging (SQL Joins in Base R)",
        explanation: "The merge() function performs inner, left, and full outer joins between two data frames.",
        code: `students <- data.frame(id = c(1, 2, 3), name = c("Ann", "Ben", "Cam"))
grades <- data.frame(id = c(2, 3, 4), grade = c("A", "B", "A+"))

# Inner Join (default):
inner <- merge(students, grades, by = "id")

# Left Outer Join:
left <- merge(students, grades, by = "id", all.x = TRUE)

# Full Outer Join:
full <- merge(students, grades, by = "id", all = TRUE)`
      },
      {
        heading: "4. Grouped Summaries with aggregate()",
        explanation: "aggregate(formula, data, FUN) computes summary statistics by group using formula syntax: target ~ group_col.",
        code: `# Mean GPA by Major:
gpa_by_major <- aggregate(gpa ~ major, data = df, FUN = mean)

# Multiple groupings:
# aggregate(score ~ major + semester, data = df, FUN = mean)`
      },
      {
        heading: "5. Renaming Columns & Creating New Variables",
        explanation: "Direct assignment to names() or column references.",
        code: `# Add a new computed column:
df$honor_roll <- df$gpa >= 3.5

# Rename a column:
colnames(df)[colnames(df) == "gpa"] <- "grade_point_avg"`
      }
    ]
  },
  {
    id: "statistics-tests",
    sectionNumber: "§ 06",
    title: "Hypothesis Testing, t-Tests & Regression Output",
    cramTimeMinutes: 25,
    overview: "Lab and written exams frequently require running a statistical test and interpreting the summary output table. Know the p-value rule and linear model output structure.",
    sections: [
      {
        heading: "1. The Universal Exam Decision Rule (p-value vs Alpha)",
        explanation: "In all hypothesis tests: If p-value < 0.05, REJECT the null hypothesis (H0) - statistically significant difference exists. If p-value >= 0.05, FAIL TO REJECT H0 - insufficient evidence.",
        code: `# Rule of thumb to write on paper:
# p < 0.05  => Reject H0 (Significant)
# p >= 0.05 => Fail to reject H0 (Not significant)`
      },
      {
        heading: "2. Student's t-Test (t.test)",
        explanation: "Tests whether means of two groups are significantly different.",
        code: `group1 <- c(78, 82, 85, 90, 88)
group2 <- c(65, 70, 72, 68, 74)

# Two-sample t-test (independent):
test_res <- t.test(group1, group2, var.equal = TRUE)
print(test_res)

# Extract key statistics for written answers:
test_res$p.value       # Exact p-value
test_res$statistic     # Calculated t-value
test_res$parameter     # Degrees of freedom (df)`
      },
      {
        heading: "3. Chi-Square Test of Independence (chisq.test)",
        explanation: "Tests whether two categorical variables are independent. Input is usually a contingency table created via table().",
        code: `gender <- c("M", "M", "F", "F", "M", "F")
vote <- c("Yes", "No", "Yes", "Yes", "No", "Yes")

# Create contingency table:
tbl <- table(gender, vote)

# Run Chi-Square test:
chisq_res <- chisq.test(tbl)`
      },
      {
        heading: "4. Linear Regression (lm) & Output Deconstruction",
        explanation: "lm(formula, data) fits an ordinary least squares regression model. The summary(lm_model) table is guaranteed to appear on written exams.",
        code: `x <- c(1, 2, 3, 4, 5)
y <- c(2.1, 3.9, 6.2, 8.0, 10.1)

model <- lm(y ~ x)
summary(model)`,
        outputExample: `Coefficients:
            Estimate Std. Error t value Pr(>|t|)    
(Intercept)  0.07000    0.20149   0.347 0.7513    
x            2.00000    0.06055  33.029 7.62e-05 ***
---
Multiple R-squared:  0.9973,  Adjusted R-squared:  0.9963 
F-statistic:  1091 on 1 and 3 DF,  p-value: 7.618e-05`,
        trapNote: `[HOW TO READ THE TABLE]
1. Estimate column: Gives the intercept (b0 = 0.07) and slope (b1 = 2.00). The regression line equation is: y = 0.07 + 2.00 * x.
2. Pr(>|t|) column: The p-value for each coefficient. For x, p = 7.62e-05 < 0.05, meaning x is a statistically significant predictor of y.
3. Multiple R-squared: 0.9973 means 99.73% of the variance in y is explained by x.
4. F-statistic & overall p-value: Tests if the model as a whole is statistically significant.`
      },
      {
        heading: "5. One-Way ANOVA (aov)",
        explanation: "Used to test differences between 3 or more group means.",
        code: `scores <- c(82, 85, 90, 72, 75, 78, 60, 65, 70)
method <- factor(rep(c("MethodA", "MethodB", "MethodC"), each = 3))

fit_anova <- aov(scores ~ method)
summary(fit_anova)
# Look at 'Pr(>F)' in the summary table for significance.`
      }
    ]
  },
  {
    id: "plotting",
    sectionNumber: "§ 07",
    title: "Base Graphics for Lab Practical Exams",
    cramTimeMinutes: 15,
    overview: "Lab examiners test standard base R plotting functions. You do not need ggplot2; standard plot(), hist(), boxplot(), and par(mfrow) satisfy 100% of exam requirements.",
    sections: [
      {
        heading: "1. Scatter Plots: plot()",
        explanation: "Syntax: plot(x, y, type, col, pch, xlab, ylab, main). pch specifies point symbol, col specifies color.",
        code: `x <- 1:10
y <- x^2

plot(x, y,
     type = "b",          # "p"=points, "l"=lines, "b"=both
     col = "darkblue",
     pch = 19,            # Solid circle
     main = "Quadratic Growth",
     xlab = "Input X",
     ylab = "X Squared")

# Add a horizontal reference line:
abline(h = 50, col = "red", lty = 2) # lty = 2 is dashed`
      },
      {
        heading: "2. Histograms: hist()",
        explanation: "Used for distribution of a continuous variable. 'breaks' controls bin count.",
        code: `data <- rnorm(100, mean = 50, sd = 10)

hist(data,
     breaks = 8,
     col = "lightgray",
     border = "black",
     main = "Distribution of Marks",
     xlab = "Marks")`
      },
      {
        heading: "3. Boxplots: boxplot()",
        explanation: "Formula syntax: boxplot(numeric_var ~ grouping_factor, data = df). Shows median, quartiles, and outliers.",
        code: `boxplot(Sepal.Length ~ Species, data = iris,
        col = c("lightblue", "lightgreen", "pink"),
        main = "Sepal Length by Species",
        xlab = "Species",
        ylab = "Sepal Length (cm)")`
      },
      {
        heading: "4. Multi-Plot Canvas: par(mfrow)",
        explanation: "To place multiple plots on a single window/canvas, set par(mfrow = c(rows, cols)). Always reset par() afterwards.",
        code: `# 1 row, 2 columns layout:
par(mfrow = c(1, 2))

plot(1:5, 1:5, main = "Plot 1")
hist(rnorm(50), main = "Plot 2")

# Reset canvas back to 1x1:
par(mfrow = c(1, 1))`
      }
    ]
  },
  {
    id: "model-questions",
    sectionNumber: "§ 08",
    title: "Top 10 University Exam Questions & Model Answers",
    cramTimeMinutes: 25,
    overview: "Real exam problems (5-mark and 10-mark lab practical questions) with idiomatic, full-credit Base R solutions.",
    sections: [
      {
        heading: "Q1: Write an R function to calculate the Fibonacci series up to N terms.",
        explanation: "Classic 5-mark question testing vector pre-allocation and indexing.",
        code: `fibonacci <- function(n) {
  if (n <= 0) return(numeric(0))
  if (n == 1) return(0)
  if (n == 2) return(c(0, 1))
  
  fib <- numeric(n)
  fib[1] <- 0
  fib[2] <- 1
  for (i in 3:n) {
    fib[i] <- fib[i - 1] + fib[i - 2]
  }
  return(fib)
}

# Test:
fibonacci(8)  # 0 1 1 2 3 5 8 13`
      },
      {
        heading: "Q2: Filter and compute summaries on the built-in 'mtcars' dataset.",
        explanation: "Exam task: 'Find the average horsepower (hp) and miles per gallon (mpg) for cars with 6 cylinders.'",
        code: `# Step 1: Subset cars with 6 cylinders
sub_cars <- mtcars[mtcars$cyl == 6, ]

# Step 2: Calculate means
avg_hp  <- mean(sub_cars$hp)
avg_mpg <- mean(sub_cars$mpg)

cat("Average HP:", avg_hp, "\\nAverage MPG:", avg_mpg, "\\n")`
      },
      {
        heading: "Q3: Matrix Operations & System of Linear Equations",
        explanation: "Solve the system: 2x + 3y = 8 and 4x - y = 2 using matrix algebra in R.",
        code: `# Coefficient matrix A and constant vector B
A <- matrix(c(2, 4, 3, -1), nrow = 2, ncol = 2) # Note column-fill!
B <- c(8, 2)

# Solve using solve(A, B):
solution <- solve(A, B)
# solution[1] is x = 1, solution[2] is y = 2`
      },
      {
        heading: "Q4: Custom apply function to standardize a data matrix",
        explanation: "Standardize each column of a matrix (zero mean, unit variance) using apply() or scale().",
        code: `# Using Base apply:
standardize_cols <- function(mat) {
  apply(mat, 2, function(col) {
    (col - mean(col)) / sd(col)
  })
}

# Or built-in:
# scaled_mat <- scale(mat)`
      },
      {
        heading: "Q5: Import CSV, handle missing values (NAs), and export cleaned data",
        explanation: "Standard 10-mark lab exam practical.",
        code: `# Reading:
# data <- read.csv("students.csv", header = TRUE, stringsAsFactors = FALSE)

# Detect missing counts per column:
# na_counts <- sapply(data, function(col) sum(is.na(col)))

# Replace NA in numeric column with column median:
# data$marks[is.na(data$marks)] <- median(data$marks, na.rm = TRUE)

# Omit remaining rows with any NA:
# clean_data <- na.omit(data)

# Writing:
# write.csv(clean_data, "cleaned_students.csv", row.names = FALSE)`
      }
    ]
  }
];
