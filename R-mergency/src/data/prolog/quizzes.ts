import { QuizQuestion } from '../types';

export const PROLOG_QUIZZES: QuizQuestion[] = [
  {
    id: "prolog-arithmetic-is",
    langId: "prolog",
    trapCategory: "Arithmetic Evaluation",
    question: "What is the result of the query `?- X = 3 + 4.` in standard Prolog?",
    codeSnippet: `?- X = 3 + 4.`,
    options: [
      "X = 7.",
      "X = 3 + 4.",
      "Syntax error: + is not defined for =",
      "false."
    ],
    correctIndex: 1,
    explanation: "The '=' operator performs structural unification, NOT arithmetic calculation. It unifies X with the compound term '+(3, 4)'. To calculate 7, you must use 'X is 3 + 4.'."
  },
  {
    id: "prolog-variable-capitalization",
    langId: "prolog",
    trapCategory: "Syntax Rules",
    question: "Why does the clause `likes(Bob, pizza).` cause unintended behavior in Prolog?",
    codeSnippet: `likes(Bob, pizza).`,
    options: [
      "'Bob' starts with an uppercase letter, so Prolog treats it as a VARIABLE, meaning EVERYONE likes pizza!",
      "Atoms cannot be longer than 3 letters in SWI-Prolog",
      "Pizza must be enclosed in single quotes",
      "Facts cannot have two arguments without an explicit rule"
    ],
    correctIndex: 0,
    explanation: "In Prolog, any identifier starting with a Capital letter is a free variable. Writing `likes(Bob, pizza).` creates a universal fact: for ANY variable Bob, likes(Bob, pizza) is true!"
  },
  {
    id: "prolog-cut-operator",
    langId: "prolog",
    trapCategory: "Cut Operator (!)",
    question: "What does the Cut operator `!` do when encountered during query evaluation?",
    codeSnippet: `p(X) :- a(X), !, b(X).\np(X) :- c(X).`,
    options: [
      "Terminates the entire Prolog interpreter process",
      "Commits to the current clause and prunes all alternative choice points for p/1 and a/1",
      "Evaluates b(X) in parallel with c(X)",
      "Inverts the truth value of a(X)"
    ],
    correctIndex: 1,
    explanation: "The cut '!' prunes all alternative choice points created since the parent goal was invoked. Once passed, Prolog will not try other clauses of p(X) or other solutions to a(X)."
  },
  {
    id: "prolog-list-tail-single",
    langId: "prolog",
    trapCategory: "Lists & Pattern Matching",
    question: "Given `[H | T] = [42]`, what is the binding of `T`?",
    codeSnippet: `?- [H | T] = [42].`,
    options: [
      "T = 42.",
      "T = nil.",
      "T = [].",
      "Unification fails because there is no tail"
    ],
    correctIndex: 2,
    explanation: "A list of 1 element `[42]` is equivalent to the cons cell `[42 | []]`. Therefore, H = 42 and T = [] (the empty list)."
  },
  {
    id: "prolog-is-uninstantiated",
    langId: "prolog",
    trapCategory: "Arithmetic Evaluation",
    question: "What happens when you run `?- 10 is X + 3.` in Prolog?",
    codeSnippet: `?- 10 is X + 3.`,
    options: [
      "X binds to 7 (algebraic solving)",
      "Throws an 'Arguments are not sufficiently instantiated' runtime error",
      "Returns false",
      "X binds to 10 - 3"
    ],
    correctIndex: 1,
    explanation: "The 'is' operator in Prolog is NOT an equation solver. The expression on the right-hand side MUST be completely ground (fully instantiated numbers with no variables). It throws an instantiation error."
  },
  {
    id: "prolog-green-vs-red-cut",
    langId: "prolog",
    trapCategory: "Cut Classification",
    question: "What distinguishes a RED cut from a GREEN cut?",
    codeSnippet: `% Which statement correctly defines a Red Cut?`,
    options: [
      "A red cut is syntax-highlighted in red by IDEs",
      "A red cut changes the logical meaning (declarative semantics) and answer set of the program",
      "A red cut produces a syntax error during compilation",
      "A red cut can only appear in the first line of a knowledge base"
    ],
    correctIndex: 1,
    explanation: "A green cut only improves efficiency without altering which answers succeed or fail. A red cut alters the declarative semantics; removing a red cut produces different (or incorrect) solutions."
  },
  {
    id: "prolog-negation-failure",
    langId: "prolog",
    trapCategory: "Negation as Failure",
    question: "Under Prolog's Closed World Assumption, what does `\\+ p(a)` evaluate to if `p(a)` is NOT in the database?",
    codeSnippet: `\\+ p(a)`,
    options: [
      "true (since p(a) cannot be proven, its negation succeeds)",
      "false (Prolog requires positive proof)",
      "unknown",
      "Exception: undefined predicate"
    ],
    correctIndex: 0,
    explanation: "Prolog uses Negation as Failure (NAF). If a goal fails to prove true from facts and rules, `\\+ Goal` succeeds and returns true."
  },
  {
    id: "prolog-anonymous-variable",
    langId: "prolog",
    trapCategory: "Variables",
    question: "What is the result of unifying `foo(X, X) = foo(1, 2)` vs `foo(_, _) = foo(1, 2)`?",
    codeSnippet: `?- foo(X, X) = foo(1, 2).\n?- foo(_, _) = foo(1, 2).`,
    options: [
      "Both fail",
      "Both succeed",
      "First fails (X cannot be 1 and 2 simultaneously), second succeeds",
      "First succeeds, second fails"
    ],
    correctIndex: 2,
    explanation: "Named variables like `X` must retain identical values across occurrences in a term. In contrast, each underscore `_` is an independent anonymous variable, so `foo(_, _) = foo(1, 2)` succeeds."
  }
];
