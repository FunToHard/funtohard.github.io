export interface CramCard {
  title: string;
  items: { label: string; snippet: string; note?: string }[];
}

export const R_CRAM_SHEET: CramCard[] = [
  {
    title: "1. Python to R Mental Translation",
    items: [
      { label: "Index 1st item", snippet: "vec[1]", note: "1-based, NOT 0-based" },
      { label: "Length", snippet: "length(x)", note: "len(x) in Python" },
      { label: "Assignment", snippet: "x <- 10", note: "Use <- for procedural code" },
      { label: "Range seq", snippet: "1:10 or seq(1, 10, by=2)", note: "Inclusive on both ends" },
      { label: "Print string", snippet: "cat('Val:', x, '\\n')", note: "cat() concatenates without quotes" },
      { label: "Ternary if", snippet: "ifelse(cond, yes, no)", note: "Vectorized across entire array" }
    ]
  },
  {
    title: "2. The 5 Core Data Structures",
    items: [
      { label: "Atomic Vector", snippet: "c(1, 2, 3)", note: "Single type only; auto-coerces" },
      { label: "Matrix", snippet: "matrix(data, nrow=2, byrow=T)", note: "Col-fill by default, '%*%' for dot product" },
      { label: "List", snippet: "list(a=1, b='str')", note: "[[i]] for item, [i] for sublist" },
      { label: "Factor", snippet: "factor(c('low','high'))", note: "as.numeric(as.character(f))" },
      { label: "Data Frame", snippet: "data.frame(x=1:3, y=c('a','b','c'))", note: "df$x or df[['x']]" }
    ]
  },
  {
    title: "3. The Apply Family at a Glance",
    items: [
      { label: "apply(M, 1, sum)", snippet: "Row sums of 2D matrix", note: "1 = Rows" },
      { label: "apply(M, 2, mean)", snippet: "Col means of 2D matrix", note: "2 = Columns" },
      { label: "lapply(L, fn)", snippet: "Applies fn, returns LIST", note: "Always returns list" },
      { label: "sapply(L, fn)", snippet: "Applies fn, returns VECTOR/MATRIX", note: "Simplifies if possible" },
      { label: "tapply(X, G, fn)", snippet: "Groups X by factor G, applies fn", note: "Grouped statistics" }
    ]
  },
  {
    title: "4. Base R Data Wrangling",
    items: [
      { label: "Filter rows", snippet: "df[df$col > 50, ]", note: "Notice trailing comma!" },
      { label: "Sort asc", snippet: "df[order(df$col), ]", note: "Never use sort(df)" },
      { label: "Sort desc", snippet: "df[order(-df$col), ]", note: "Minus sign for reverse" },
      { label: "Join tables", snippet: "merge(df1, df2, by='id', all.x=T)", note: "all.x=TRUE is Left Join" },
      { label: "Aggregate", snippet: "aggregate(y ~ grp, data=df, FUN=mean)", note: "Formula syntax" }
    ]
  },
  {
    title: "5. Lab Statistics & Hypothesis Tests",
    items: [
      { label: "Decision Rule", snippet: "p < 0.05 => Reject H0", note: "p >= 0.05 => Fail to reject H0" },
      { label: "Two-sample t", snippet: "t.test(x, y, var.equal=TRUE)", note: "Reports t, df, and p-value" },
      { label: "Chi-Square", snippet: "chisq.test(table(cat1, cat2))", note: "Independence of categories" },
      { label: "Linear Model", snippet: "fit <- lm(y ~ x1 + x2, data=df)", note: "OLS regression" },
      { label: "Regression Eq", snippet: "y = b0 + b1*x", note: "b0=Intercept, b1=Slope (Estimate col)" },
      { label: "One-Way ANOVA", snippet: "summary(aov(y ~ group, data=df))", note: "F-test for 3+ group means" }
    ]
  },
  {
    title: "6. Emergency Gotchas & Traps",
    items: [
      { label: "1:n - 1", snippet: "Evaluates to (1:n) - 1 => 0:(n-1)", note: "Trap: sequence operator binds first" },
      { label: "1:length(v)", snippet: "If length=0, runs for 1 then 0", note: "Use seq_along(v) instead" },
      { label: "NA vs NULL", snippet: "NA = missing (len 1); NULL = empty (len 0)", note: "is.na() vs is.null()" },
      { label: "Recycling", snippet: "c(1,2,3,4) + c(10,20) = 11,22,13,24", note: "Shorter repeats silently" },
      { label: "Drop dim", snippet: "mat[, 1, drop=FALSE]", note: "Prevents vector downgrade" },
      { label: "&& vs &", snippet: "& is vectorized; && checks 1st element only", note: "Use & in data frame masks" }
    ]
  }
];
