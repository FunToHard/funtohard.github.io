import { QuizQuestion } from '../types';

export const SCHEME_QUIZZES: QuizQuestion[] = [
  {
    id: "scheme-truthiness-empty-list",
    langId: "scheme",
    trapCategory: "Truthiness Semantics",
    question: "What does the following Scheme expression evaluate to in standard R5RS/R6RS Scheme?",
    codeSnippet: `(if '() 'yes 'no)`,
    options: [
      "'yes",
      "'no",
      "Error: empty list cannot be evaluated as boolean",
      "undefined"
    ],
    correctIndex: 0,
    explanation: "In Scheme (R5RS/R6RS/Racket), ONLY #f is falsy! Every other object—including the empty list '(), the number 0, and the empty string \"\"—evaluates to true. (Common Lisp considers nil/() false, but Scheme does not)."
  },
  {
    id: "scheme-let-parallel-binding",
    langId: "scheme",
    trapCategory: "Lexical Scope Binding",
    question: "What is the evaluated output of the following Scheme code?",
    codeSnippet: `(define x 10)

(let ((x 1)
      (y (+ x 5)))
  (+ x y))`,
    options: [
      "16",
      "7",
      "15",
      "Error: identifier x is unbound in let definition"
    ],
    correctIndex: 0,
    explanation: "In a standard 'let' form, bindings are evaluated in PARALLEL in the outer enclosing scope before any local bindings take effect. Therefore, '(+ x 5)' references the outer x (10), resulting in y = 15. The body then computes 1 + 15 = 16. To bind sequentially, 'let*' must be used."
  },
  {
    id: "scheme-pair-vs-list-predicates",
    langId: "scheme",
    trapCategory: "Data Structure Predicates",
    question: "What do `(pair? '())` and `(list? '())` evaluate to?",
    codeSnippet: `(cons (pair? '()) (cons (list? '()) '()))`,
    options: [
      "(#f #t)",
      "(#t #t)",
      "(#f #f)",
      "(#t #f)"
    ],
    correctIndex: 0,
    explanation: "The empty list '() is NOT a pair (it contains zero cons cells, so (pair? '()) => #f). However, '() IS a proper list by mathematical induction, so (list? '()) => #t."
  },
  {
    id: "scheme-cons-inverted-dotted",
    langId: "scheme",
    trapCategory: "Cons Cell Construction",
    question: "What is printed when evaluating `(cons '(1 2) 3)` in Scheme?",
    codeSnippet: `(cons '(1 2) 3)`,
    options: [
      "((1 2) . 3)",
      "(1 2 3)",
      "((1 2) 3)",
      "Error: cdr must be a list"
    ],
    correctIndex: 0,
    explanation: "cons builds a pair (car . cdr). Here, car is the list '(1 2)' and cdr is the atom '3'. Because the cdr is not a list ending in '(), Scheme prints this improper list as a dotted pair: '((1 2) . 3)'."
  },
  {
    id: "scheme-unquote-splicing",
    langId: "scheme",
    trapCategory: "Quasiquotation & Macros",
    question: "What is the value of `\\`(1 ,@(list 2 3) 4)`?",
    codeSnippet: `\`(1 ,@(list 2 3) 4)`,
    options: [
      "(1 2 3 4)",
      "(1 (2 3) 4)",
      "(1 ,@(2 3) 4)",
      "Error: unquote-splicing invalid outside macro"
    ],
    correctIndex: 0,
    explanation: "Unquote-splicing (,@) evaluates the enclosed expression (which must return a list) and strips off its outer parentheses, splicing its elements directly into the parent list: '(1 2 3 4)'. Regular unquote (,) would have produced '(1 (2 3) 4)'."
  },
  {
    id: "scheme-tail-call-detection",
    langId: "scheme",
    trapCategory: "Tail Call Optimization",
    question: "Which of the following recursive function definitions is properly TAIL RECURSIVE (executes in O(1) stack space in Scheme)?",
    codeSnippet: `; Option A:
(define (sum-a lst)
  (if (null? lst) 0 (+ (car lst) (sum-a (cdr lst)))))

; Option B:
(define (sum-b lst acc)
  (if (null? lst) acc (sum-b (cdr lst) (+ acc (car lst)))))`,
    options: [
      "Option B only",
      "Option A only",
      "Both Option A and Option B",
      "Neither (all recursion consumes stack frames)"
    ],
    correctIndex: 0,
    explanation: "In Option A, the '+' operator is deferred until (sum-a (cdr lst)) returns, requiring O(N) stack frames. In Option B, (sum-b ...) is the very last operation in tail position with an accumulator, which Scheme guarantees to optimize into a constant-space jump (O(1) stack)."
  },
  {
    id: "scheme-eq-vs-equal",
    langId: "scheme",
    trapCategory: "Equality Predicates",
    question: "Given `(define a (list 1 2))` and `(define b (list 1 2))`, what is the result of `(eq? a b)` vs `(equal? a b)`?",
    codeSnippet: `(define a (list 1 2))
(define b (list 1 2))
(cons (eq? a b) (cons (equal? a b) '()))`,
    options: [
      "(#f #t)",
      "(#t #t)",
      "(#t #f)",
      "(#f #f)"
    ],
    correctIndex: 0,
    explanation: "eq? tests identity (pointer equality/memory address). Since 'a' and 'b' were created via separate allocations, they point to different memory locations (#f). equal? recursively compares structure and content (#t). eqv? compares numbers and characters."
  },
  {
    id: "scheme-cadr-composition",
    langId: "scheme",
    trapCategory: "List Navigation",
    question: "What does `(cadar '(((1 2) 3) 4))` evaluate to?",
    codeSnippet: `(cadar '(((1 2) 3) 4))`,
    options: [
      "3",
      "(1 2)",
      "2",
      "1"
    ],
    correctIndex: 0,
    explanation: "Read composed accessors from right to left: car of '(((1 2) 3) 4)' is '((1 2) 3)'. Then cadr means car of cdr. The cdr of '((1 2) 3)' is '(3)'. The car of '(3)' is '3'."
  }
];
