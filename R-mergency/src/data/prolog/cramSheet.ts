import { CramCard } from '../types';

export const PROLOG_CRAM_SHEET: CramCard[] = [
  {
    title: "1. Core Syntax & Rules",
    items: [
      { label: "Variables", snippet: "Uppercase or _ (X, Person, _)", note: "Must start with capital" },
      { label: "Atoms/Constants", snippet: "Lowercase (john, pizza, 'Spaced')", note: "Lowercase or single-quoted" },
      { label: "Rules (IF)", snippet: "Head :- Body1, Body2.", note: "':-' means IF, ',' means AND" },
      { label: "Disjunction (OR)", snippet: "Goal1 ; Goal2", note: "Semicolon means OR" },
      { label: "Terminator", snippet: ".", note: "Every clause must end with period" }
    ]
  },
  {
    title: "2. Unification vs Arithmetic",
    items: [
      { label: "Unification (=)", snippet: "X = 2 + 3 => X = 2 + 3", note: "Matches structures, no calculation" },
      { label: "Arithmetic (is)", snippet: "X is 2 + 3 => X = 5", note: "RHS must be fully instantiated" },
      { label: "Equal Value (=:=)", snippet: "2 + 2 =:= 1 + 3 => true", note: "Compares evaluated values" },
      { label: "Not Equal (=\\=)", snippet: "2 + 3 =\\= 6 => true", note: "Evaluated arithmetic inequality" },
      { label: "Not Identical (\\=)", snippet: "a \\= b => true", note: "Structural non-unifiability" }
    ]
  },
  {
    title: "3. List Manipulation [H|T]",
    items: [
      { label: "Head & Tail", snippet: "[H|T] = [1, 2, 3]", note: "H=1, T=[2, 3]" },
      { label: "Single Item", snippet: "[H|T] = [a] => H=a, T=[]", note: "Tail of [a] is empty list" },
      { label: "Member check", snippet: "member(X, [1, 2, 3])", note: "Base: member(X,[X|_])." },
      { label: "Append / Split", snippet: "append(L1, L2, Res)", note: "append([], L, L)." },
      { label: "Length acc", snippet: "len([], Acc, Acc).", note: "Tail-recursive accumulator" }
    ]
  },
  {
    title: "4. Control Flow & The Cut (!)",
    items: [
      { label: "The Cut (!)", snippet: "p(X) :- cond, !, action.", note: "Prunes alternative choice points" },
      { label: "Green Cut", snippet: "grade(M,'A') :- M>=90, !.", note: "Improves speed without changing logic" },
      { label: "Red Cut", snippet: "Alters declarative semantics", note: "Removing red cut changes answers" },
      { label: "Fail predicate", snippet: "fail", note: "Always fails; triggers backtracking" },
      { label: "Negation (\\+)", snippet: "\\+ Goal", note: "Succeeds if Goal cannot be proven" }
    ]
  },
  {
    title: "5. Search & Backtracking",
    items: [
      { label: "Clause Order", snippet: "Top to bottom", note: "Place base cases before recursive rules" },
      { label: "Subgoal Order", snippet: "Left to right", note: "Avoid left recursion (infinite loop)" },
      { label: "Terminal Semicolon", snippet: "Type ; in terminal", note: "Requests next valid solution" },
      { label: "Print all solutions", snippet: "repeat / fail loop", note: "Forces complete search tree traversal" }
    ]
  },
  {
    title: "6. Golden Exam Gotchas",
    items: [
      { label: "Uninstantiated 'is'", snippet: "5 is X + 2 => ERROR", note: "RHS cannot contain free variables" },
      { label: "Uppercase fact", snippet: "Parent(X, Y) => SYNTAX ERROR", note: "Predicates must be lowercase" },
      { label: "Single quote vs double", snippet: "'atom' vs \"string/codes\"", note: "Use single quotes for atoms" },
      { label: "Empty list", snippet: "length([]) = 0", note: "Head of [] is undefined" }
    ]
  }
];
