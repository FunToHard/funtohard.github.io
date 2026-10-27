import { CramCard } from '../types';

export const SCHEME_CRAM_SHEET: CramCard[] = [
  {
    title: "1. Core Syntax & Basic Forms",
    items: [
      { label: "Function call", snippet: "(operator arg1 arg2 ...)", note: "Prefix notation; (+ 2 3) not (2 + 3)" },
      { label: "Define var", snippet: "(define x 42)", note: "Binds identifier in current environment" },
      { label: "Define func", snippet: "(define (f x y) (+ x y))", note: "Sugar for (define f (lambda (x y) ...))" },
      { label: "Anonymous func", snippet: "(lambda (x) (* x 2))", note: "First-class lexical closure" },
      { label: "Conditional", snippet: "(if test then else)", note: "Or (cond [test1 expr1] [else exprN])" },
      { label: "Quote data", snippet: "'(1 2 3) or (quote (1 2))", note: "Suppresses evaluation to return literal symbols" }
    ]
  },
  {
    title: "2. Cons Cells & List Manipulation",
    items: [
      { label: "Construct pair", snippet: "(cons 1 2)", note: "Creates (1 . 2); improper dotted pair" },
      { label: "Proper list", snippet: "(cons 1 (cons 2 '()))", note: "Evaluates to (1 2); terminated by empty list" },
      { label: "Head element", snippet: "(car '(a b c))", note: "Returns 'a (contents of address register)" },
      { label: "Tail list", snippet: "(cdr '(a b c))", note: "Returns '(b c) (contents of decrement register)" },
      { label: "2nd element", snippet: "(cadr lst) or (car (cdr lst))", note: "Third is caddr, etc." },
      { label: "List constructor", snippet: "(list 1 2 3)", note: "Evaluates each argument and chains with cons" }
    ]
  },
  {
    title: "3. Truthiness & Predicate Matrix",
    items: [
      { label: "Only #f is false", snippet: "(if '() 'true 'false) => 'true", note: "Empty list '() and 0 are TRUTHY in Scheme!" },
      { label: "Empty list test", snippet: "(null? x)", note: "True only for '()" },
      { label: "Pair check", snippet: "(pair? '(1 . 2)) => #t", note: "(pair? '()) is #f!" },
      { label: "Proper list check", snippet: "(list? '()) => #t", note: "(list? '(1 . 2)) is #f!" },
      { label: "Identity eq?", snippet: "(eq? '(a) '(a)) => #f", note: "Pointer/address identity comparison" },
      { label: "Structural equal?", snippet: "(equal? '(a) '(a)) => #t", note: "Deep structural equality of data" }
    ]
  },
  {
    title: "4. Scoping: let vs let* vs letrec",
    items: [
      { label: "let (parallel)", snippet: "(let ((x 1) (y (+ x 5))) ...)", note: "TRAP: (+ x 5) uses outer x, NOT 1!" },
      { label: "let* (sequential)", snippet: "(let* ((x 1) (y (+ x 5))) ...)", note: "y sees x = 1 => y = 6" },
      { label: "letrec (recursive)", snippet: "(letrec ((f (lambda ... (f ...)))) ...)", note: "Mandatory for local recursive/mutual functions" },
      { label: "Set variable", snippet: "(set! var value)", note: "Mutates existing binding in-place" },
      { label: "Begin block", snippet: "(begin e1 e2 e3)", note: "Evaluates in sequence, returns last expression" }
    ]
  },
  {
    title: "5. Tail Recursion & Higher-Order Functions",
    items: [
      { label: "TCO rule", snippet: "Recursive call must be in TAIL POSITION", note: "No pending operators on the call stack (O(1) memory)" },
      { label: "Accumulator", snippet: "(define (sum l acc) (if (null? l) acc (sum (cdr l) (+ acc (car l)))))", note: "Iterative process via recursion" },
      { label: "map", snippet: "(map (lambda (x) (* x 2)) '(1 2 3))", note: "Returns '(2 4 6)" },
      { label: "filter", snippet: "(filter even? '(1 2 3 4))", note: "Returns '(2 4)" },
      { label: "foldl (left)", snippet: "(foldl f init lst)", note: "Tail-recursive left-associative reduction" },
      { label: "foldr (right)", snippet: "(foldr f init lst)", note: "Right-associative structural fold" }
    ]
  },
  {
    title: "6. Exam Traps & Quasiquotation",
    items: [
      { label: "Quasiquote (`)", snippet: "`(1 ,(+ 2 3) 4) => (1 5 4)", note: "Comma (,) selectively evaluates" },
      { label: "Splicing (,@)", snippet: "`(1 ,@(list 2 3) 4) => (1 2 3 4)", note: "Peels off list parentheses and flattens" },
      { label: "Dotted pair trap", snippet: "(cons '(1 2) 3) => ((1 2) . 3)", note: "Improper list because cdr is atom 3" },
      { label: "Empty list pair?", snippet: "(pair? '()) => #f", note: "Empty list has no cons cells" },
      { label: "Math prefix trap", snippet: "(/ 10 2) => 5, (/ 10 2 5) => 1", note: "Multi-argument division folds left" },
      { label: "cond syntax", snippet: "(cond [(p1) e1] [(p2) e2] [else e3])", note: "Square brackets are synonymous with parens" }
    ]
  }
];
