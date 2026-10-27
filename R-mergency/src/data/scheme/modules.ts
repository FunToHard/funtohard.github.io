import { ExamModule } from '../types';

export const SCHEME_MODULES: ExamModule[] = [
  {
    id: "scheme-mental-model",
    sectionNumber: "§ 01",
    title: "Scheme Mental Model: Prefix S-Expressions & Truthiness",
    cramTimeMinutes: 15,
    overview: "Scheme (Lisp dialect) is a homoiconic functional language based on the lambda calculus. Everything is an expression enclosed in parentheses: (operator operand1 operand2 ...).",
    sections: [
      {
        heading: "1. Prefix Notation & Applicative-Order Evaluation",
        explanation: `In Scheme, operators precede their operands. All sub-expressions are evaluated left-to-right before the procedure is applied. Writing '(4 + 5)' attempts to call 4 as a function and throws a fatal runtime error.`,
        code: `(+ 2 3)          ; 5
(* (+ 2 3) 4)    ; 20

; FUNCTION DEFINITION:
(define (square x)
  (* x x))

(square 5)       ; 25`
      },
      {
        heading: "2. The Truthiness Rule (The #1 Scheme Exam Trap)",
        explanation: `In standard Scheme (R5RS/R6RS/Racket), ONLY #f is false!
Everything else—including the empty list '(), the number 0, and the empty string ""—evaluates to TRUTHY!
In Python or C, 0 and empty lists are falsy. In Scheme, (if '() 'yes 'no) returns 'yes!`,
        code: `(if '() 'truthy 'falsy)   ; Returns 'truthy!
(if 0   'truthy 'falsy)   ; Returns 'truthy!
(if #f  'truthy 'falsy)   ; Returns 'falsy`,
        trapNote: "[TRAP] In Scheme: (if '() ...) triggers the TRUE branch! Only #f is false. In Common Lisp, nil and '() are false. Professors love testing this cross-dialect distinction."
      }
    ]
  },
  {
    id: "scheme-pairs-lists",
    sectionNumber: "§ 02",
    title: "Pairs, Cons Cells & Proper vs. Dotted Lists",
    cramTimeMinutes: 20,
    overview: "The cons cell (pair) is Scheme's fundamental building block. Understanding the structural difference between proper lists and dotted pairs is guaranteed to be tested.",
    sections: [
      {
        heading: "1. Cons, Car, and Cdr",
        explanation: `A pair is created via (cons a b).
• (car pair): Extracts the first pointer (head).
• (cdr pair): Extracts the second pointer (tail).`,
        code: `(define p (cons 1 2))
(car p)   ; 1
(cdr p)   ; 2`
      },
      {
        heading: "2. Proper Lists vs. Dotted Pairs (Improper Lists)",
        explanation: `• Proper List: Either the empty list '(), or a pair whose cdr is a PROPER LIST.
• Dotted Pair (Improper List): A pair whose cdr is NOT a list (it is an atom or number). Printed with a dot '.'`,
        code: `; Proper list (cdr terminates in '()):
(cons 1 (cons 2 '()))   ; Prints: (1 2)

; Improper dotted pair (cdr is the number 2):
(cons 1 2)              ; Prints: (1 . 2)

; PREDICATE MATRIX TRAPS:
(pair? '(1 . 2))        ; #t
(list? '(1 . 2))        ; #f (NOT a list!)
(pair? '())             ; #f (empty list is NOT a pair!)
(list? '())             ; #t (empty list IS a list!)`,
        trapNote: "[TRAP] (pair? '()) is #f! The empty list contains no cons cell. However, (list? '()) is #t."
      }
    ]
  },
  {
    id: "scheme-quotation-semantics",
    sectionNumber: "§ 03",
    title: "Quotation Semantics: Quote, Quasiquote, Unquote & Splice",
    cramTimeMinutes: 18,
    overview: "Quotation prevents evaluation, converting code into literal symbolic data. Metalinguistic abstraction and macros rely on quasiquote templates.",
    sections: [
      {
        heading: "1. Quote (') vs. Literal Evaluation",
        explanation: `'expr is syntactic sugar for (quote expr). It returns the unevaluated symbolic data structure.`,
        code: `(+ 1 2)      ; Evaluates to number: 3
'(+ 1 2)     ; Unevaluated list of 3 symbols: (+ 1 2)
'x           ; The symbol x (not the variable x's value!)`
      },
      {
        heading: "2. Quasiquote (`), Unquote (,), and Unquote-Splicing (,@)",
        explanation: `• Quasiquote (\`): Like quote, but enables selective evaluation via unquote.
• Unquote (,): Evaluates the enclosed expression and inserts its value.
• Unquote-Splicing (,@): Evaluates the enclosed expression (must produce a list) and peels off its outer parentheses, splicing the elements into the outer list.`,
        code: `(define items '(b c))

\`(a ,items d)    ; => (a (b c) d)   <- Unquote keeps list intact
\`(a ,@items d)   ; => (a b c d)     <- Unquote-splicing flattens elements!`
      }
    ]
  },
  {
    id: "scheme-scoping-let",
    sectionNumber: "§ 04",
    title: "Scoping Traps: let vs. let* vs. letrec",
    cramTimeMinutes: 22,
    overview: "Environment frames govern variable binding. Parallel binding in let vs. sequential in let* vs. mutual recursion in letrec.",
    sections: [
      {
        heading: "1. The let Parallel Binding Trap",
        explanation: `In (let ((x e1) (y e2)) body), all right-hand side expressions are evaluated in the ENCLOSING outer environment before ANY new bindings are created!`,
        code: `(define x 10)

(let ((x 1)
      (y (+ x 5)))   ; Trap! (+ x 5) uses the OUTER x (10), NOT 1!
  (+ x y))           ; Body uses local x (1) and y (15) => 16!`,
        trapNote: "[TRAP] In (let ((x 1) (y (+ x 5))) ...), y evaluates to 15, NOT 6! To use local x in subsequent bindings, you must use let*."
      },
      {
        heading: "2. let* (Sequential Binding)",
        explanation: `let* evaluates each binding sequentially, making previous bindings available to later ones.`,
        code: `(let* ((x 1)
       (y (+ x 5)))  ; y uses local x (1) => y = 6
  (+ x y))           ; 1 + 6 = 7`
      },
      {
        heading: "3. letrec (Recursive / Mutual Binding)",
        explanation: `letrec allocates all variables first, allowing bindings to refer to each other. Mandatory for defining local recursive functions!`,
        code: `(letrec ((is-even? (lambda (n) (if (zero? n) #t (is-odd? (- n 1))))))
         (is-odd?  (lambda (n) (if (zero? n) #f (is-even? (- n 1))))))
  (is-even? 4))      ; #t`
      }
    ]
  },
  {
    id: "scheme-tail-recursion-tco",
    sectionNumber: "§ 05",
    title: "Tail Recursion & Tail Call Optimization (TCO)",
    cramTimeMinutes: 20,
    overview: "Standard Scheme mandates Tail Call Optimization (TCO). Iterative processes must run in O(1) stack frames using accumulators.",
    sections: [
      {
        heading: "1. Deferred Operations (Non-Tail Recursive)",
        explanation: `If any operation (like + or *) must be performed AFTER a recursive call returns, the call is NOT in tail position, requiring O(N) call stack frames.`,
        code: `; NON-TAIL RECURSIVE (O(N) memory):
(define (factorial n)
  (if (<= n 1)
      1
      (* n (factorial (- n 1))))) ; Pending multiplication '*' deferred on stack!`
      },
      {
        heading: "2. Accumulator Pattern (Tail-Recursive O(1) Space)",
        explanation: `Pass the intermediate result forward in an accumulator parameter so that the recursive call is the very last operation.`,
        code: `; TAIL RECURSIVE (O(1) memory):
(define (factorial n)
  (define (iter count acc)
    (if (> count n)
        acc
        (iter (+ count 1) (* acc count)))) ; Tail call: nothing deferred!
  (iter 1 1))`
      }
    ]
  },
  {
    id: "scheme-higher-order-fold",
    sectionNumber: "§ 06",
    title: "Higher-Order Functions: map, filter, foldl vs. foldr",
    cramTimeMinutes: 20,
    overview: "Functions as first-class citizens. The directional and recursion differences between foldl and foldr.",
    sections: [
      {
        heading: "1. foldl (Left-Associative, Tail-Recursive)",
        explanation: `foldl processes elements from left to right using tail recursion ($O(1)$ stack space).
(foldl f init '(x1 x2 x3)) -> (f x3 (f x2 (f x1 init)))`,
        code: `(foldl - 0 '(1 2 3))   ; 3 - (2 - (1 - 0)) => 2`
      },
      {
        heading: "2. foldr (Right-Associative, Non-Tail)",
        explanation: `foldr processes from right to left by descending to the end of the list first ($O(N)$ stack space).
(foldr f init '(x1 x2 x3)) -> (f x1 (f x2 (f x3 init)))`,
        code: `(foldr - 0 '(1 2 3))   ; 1 - (2 - (3 - 0)) => 2`
      }
    ]
  },
  {
    id: "scheme-exam-practical",
    sectionNumber: "§ 07",
    title: "Top University Exam Problems & Model Solutions",
    cramTimeMinutes: 25,
    overview: "High-yield functional exam questions: Tail-recursive flattening and deep list reversals.",
    sections: [
      {
        heading: "Q1: Tail-Recursive Deep List Flattening",
        explanation: "Flatten an arbitrarily nested tree of lists into a single 1D list in $O(1)$ auxiliary stack space.",
        code: `(define (flatten-tail lst)
  (define (iter remaining stack acc)
    (cond
      [(and (null? remaining) (null? stack))
       (reverse acc)]
      [(null? remaining)
       (iter (car stack) (cdr stack) acc)]
      [(pair? (car remaining))
       (iter (car remaining) (cons (cdr remaining) stack) acc)]
      [else
       (iter (cdr remaining) stack (cons (car remaining) acc))]))
  (iter lst '() '()))

; Test:
; (flatten-tail '(1 (2 (3 4) 5) (6))) => '(1 2 3 4 5 6)`
      },
      {
        heading: "Q2: Implement map and filter using foldr",
        explanation: "Standard 10-mark functional programming synthesis question.",
        code: `; map via foldr:
(define (my-map f lst)
  (foldr (lambda (x acc) (cons (f x) acc)) '() lst))

; filter via foldr:
(define (my-filter pred lst)
  (foldr (lambda (x acc)
           (if (pred x) (cons x acc) acc))
         '()
         lst))`
      }
    ]
  }
];
