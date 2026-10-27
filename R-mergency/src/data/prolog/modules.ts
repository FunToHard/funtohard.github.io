import { ExamModule } from '../types';

export const PROLOG_MODULES: ExamModule[] = [
  {
    id: "prolog-mental-model",
    sectionNumber: "§ 01",
    title: "Prolog Mental Model: Declarative Logic & Syntax",
    cramTimeMinutes: 15,
    overview: "Prolog is declarative. You do NOT instruct the computer how to calculate an answer step-by-step; you state relationships (facts and rules) and ask queries. Prolog searches for bindings that satisfy your logic.",
    sections: [
      {
        heading: "1. Variables vs Atoms (The Uppercase Rule)",
        explanation: "This is the #1 syntax error that fails Prolog exams: Variable names MUST begin with an UPPERCASE letter or underscore (_). Atoms (constants, names, predicates) MUST begin with a LOWERCASE letter.",
        code: `% Facts:
likes(john, pizza).      % john and pizza are lowercase atoms
likes(mary, apple).

% Query with a variable:
?- likes(X, pizza).      % X is uppercase (variable)
% Output: X = john.

% ERROR TRAP:
% ?- likes(John, pizza). % Evaluates John as a variable, not the person John!`,
        trapNote: "[TRAP] Writing 'Parent(X, Y)' is a syntax error because predicates cannot be uppercase. Writing 'parent(x, y)' makes 'x' and 'y' atoms, so it never binds to actual names!"
      },
      {
        heading: "2. Facts, Rules & The Neck Operator (:-)",
        explanation: "A rule consists of a Head and a Body separated by ':-' (read as 'IF'). A comma ',' represents logical AND. A semicolon ';' represents logical OR. Every statement MUST end with a period ('.').",
        code: `% Fact:
parent(bob, charlie).
male(bob).

% Rule: Father(X, Y) if Parent(X, Y) and Male(X):
father(X, Y) :-
    parent(X, Y),        % Comma = AND
    male(X).             % Period = End of clause`,
        trapNote: "[EXAM RULE] Forgetting the trailing period '.' at the end of a clause is the most common reason Prolog scripts fail to compile during lab tests."
      },
      {
        heading: "3. Queries & The Semicolon Prompt",
        explanation: "When running a query in an interactive Prolog terminal (SWI-Prolog), hitting ENTER accepts the first answer. Hitting semicolon (';') forces Prolog to backtrack and search for the NEXT valid solution.",
        code: `?- likes(X, Y).
X = john, Y = pizza ;    % User types ';' to ask for more answers
X = mary, Y = apple ;    % Semicolon = 'give me next solution'
false.                   % No more solutions exist`
      }
    ]
  },
  {
    id: "prolog-unification",
    sectionNumber: "§ 02",
    title: "Unification & Pattern Matching",
    cramTimeMinutes: 18,
    overview: "Unification is Prolog's core mechanism for variable assignment and pattern matching. It attempts to find variable substitutions that make two terms identical.",
    sections: [
      {
        heading: "1. The Equality Operator (=) is Structural Unification",
        explanation: "The '=' operator in Prolog does NOT evaluate arithmetic. It succeeds if two terms can structurally unify by binding free variables.",
        code: `% Structural unification:
?- X = 5.
X = 5.

?- foo(X, b) = foo(a, Y).
X = a,
Y = b.

% ARITHMETIC TRAP:
?- X = 2 + 3.
X = 2 + 3.               % Binds to the literal tree +(2, 3), NOT 5!`
      },
      {
        heading: "2. The 'is' Operator vs '=' vs '=:='",
        explanation: "Prolog has 3 distinct equality-like operators that professors test on every midterm:",
        code: `% 1. '=' (Structural unification):
?- X = 2 + 3.            % X = 2 + 3

% 2. 'is' (Arithmetic evaluation & unification):
?- X is 2 + 3.           % X = 5

% 3. '=:=' (Arithmetic value equivalence comparison):
?- 2 + 3 =:= 4 + 1.      % true (both evaluate to 5)

% 4. '=\\=' (Arithmetic inequality comparison):
?- 5 =\\= 6.              % true`,
        trapNote: "[TRAP] The right-hand side of 'is' MUST be fully instantiated (no free variables). '5 is X + 2' will throw an 'Arguments are not sufficiently instantiated' runtime error!"
      },
      {
        heading: "3. The Anonymous Variable (_)",
        explanation: "Use underscore '_' when you do not care about the value of an argument. Each occurrence of '_' is an independent blank variable that unifies with anything without keeping a binding.",
        code: `% Does Bob have any children? (We don't care who they are):
has_children(X) :-
    parent(X, _).`
      }
    ]
  },
  {
    id: "prolog-lists-recursion",
    sectionNumber: "§ 03",
    title: "Lists, Pattern Matching & Recursion",
    cramTimeMinutes: 22,
    overview: "Prolog lists are singly linked cons cells written as [Head | Tail]. Every exam contains at least one 10-mark question requiring custom recursive list processing.",
    sections: [
      {
        heading: "1. The [Head | Tail] Syntax",
        explanation: "Head is the FIRST element. Tail is the REST of the list (which is always a list). For an empty list '[]', Head and Tail are undefined.",
        code: `% Pattern matching:
?- [H | T] = [1, 2, 3, 4].
H = 1,
T = [2, 3, 4].

?- [H | T] = [single].
H = single,
T = [].                  % Tail of a 1-item list is the empty list!

?- [A, B | Rest] = [apple, banana, cherry, date].
A = apple,
B = banana,
Rest = [cherry, date].`
      },
      {
        heading: "2. Standard List Operations: Membership (member/2)",
        explanation: "Check or generate elements belonging to a list.",
        code: `% Base Case: Item is the Head of the list
my_member(X, [X | _]).

% Recursive Case: Item is somewhere in the Tail
my_member(X, [_ | Tail]) :-
    my_member(X, Tail).

% Queries:
% ?- my_member(3, [1, 2, 3, 4]). -> true.
% ?- my_member(X, [a, b, c]).    -> X = a ; X = b ; X = c.`
      },
      {
        heading: "3. List Length with Accumulator Pattern",
        explanation: "Direct recursion vs tail-recursive accumulator. Exams reward the tail-recursive accumulator approach for performance.",
        code: `% Tail-recursive length with accumulator:
list_length(List, Len) :-
    len_acc(List, 0, Len).

len_acc([], Acc, Acc).
len_acc([_ | Tail], Acc, Len) :-
    NewAcc is Acc + 1,
    len_acc(Tail, NewAcc, Len).`
      },
      {
        heading: "4. Concatenation: append/3",
        explanation: "append(List1, List2, Combined) can concatenate lists OR split lists backward!",
        code: `% Definition:
my_append([], L, L).
my_append([H | T1], L2, [H | T3]) :-
    my_append(T1, L2, T3).

% Multidirectional power:
% Concatenate:
?- my_append([1, 2], [3, 4], X).      % X = [1, 2, 3, 4]

% Partition:
?- my_append(A, B, [1, 2]).           % A = [], B = [1,2] ; A = [1], B = [2] ; A = [1,2], B = []`
      }
    ]
  },
  {
    id: "prolog-cut-negation",
    sectionNumber: "§ 04",
    title: "The Cut Operator (!) & Negation as Failure",
    cramTimeMinutes: 20,
    overview: "The Cut operator (!) prunes backtracking search branches. Understanding the difference between Green Cuts (efficiency) and Red Cuts (alters logic) is an exam staple.",
    sections: [
      {
        heading: "1. The Cut Operator (!)",
        explanation: "The Cut operator '!' always succeeds immediately. Once passed, it commits Prolog to all choices made in the current rule: no alternative clauses for this predicate will be tried upon backtracking.",
        code: `% Maximum of two numbers using Cut:
max(X, Y, X) :- X >= Y, !.
max(_, Y, Y).            % Only reached if X < Y because cut pruned alternative!`,
        trapNote: "[TRAP] If you remove the cut in 'max(X, Y, X)', calling max(5, 3, 3) might erroneously succeed on backtracking! Cuts that change program semantics are RED cuts."
      },
      {
        heading: "2. Green Cut vs Red Cut",
        explanation: `Exam questions will ask you to classify a cut:
• Green Cut: Merely optimizes execution speed by discarding redundant branches. Removing a green cut does NOT alter the set of answers.
• Red Cut: Prunes branches containing different logical conclusions. Removing a red cut CHANGES the program's output.`,
        code: `% Green Cut (Omitting ! would produce identical solutions, just slower):
grade(Marks, 'A') :- Marks >= 90, !.
grade(Marks, 'B') :- Marks >= 80, Marks < 90, !.

% Red Cut (Omitting ! causes incorrect answers):
grade_red(Marks, 'A') :- Marks >= 90, !.
grade_red(_, 'B').       % Relies entirely on the cut above to prevent execution!`
      },
      {
        heading: "3. Negation as Failure (\\+)",
        explanation: "Prolog uses Closed World Assumption (CWA): whatever cannot be proven true from the knowledge base is assumed false. '\\+ Goal' succeeds if Goal fails.",
        code: `% Unmarried if not married:
unmarried(X) :-
    person(X),
    \\+ married(X).`,
        trapNote: "[TRAP] Always instantiate variables BEFORE applying '\\+'. '\\+ married(X)' tests whether ANYONE is married, not whether X is unmarried!"
      }
    ]
  },
  {
    id: "prolog-backtracking",
    sectionNumber: "§ 05",
    title: "Backtracking Engine & Search Trees",
    cramTimeMinutes: 15,
    overview: "Prolog explores possibilities using Depth-First Search with chronological backtracking. Clauses are tried top-to-bottom; subgoals within a clause are evaluated left-to-right.",
    sections: [
      {
        heading: "1. Clause Order Matters (Infinite Loop Trap)",
        explanation: "Putting the recursive case before the base case, or placing the recursive step on the left, can cause infinite recursion stack overflow.",
        code: `% DANGEROUS (Left Recursion):
ancestor(X, Y) :- ancestor(X, Z), parent(Z, Y).  % Infinite loop!
ancestor(X, Y) :- parent(X, Y).

% SAFE (Base case first, tail recursion):
ancestor(X, Y) :- parent(X, Y).                  % Base case first
ancestor(X, Y) :- parent(X, Z), ancestor(Z, Y).  % Tail recursive`
      },
      {
        heading: "2. Generating Combinations (fail loop)",
        explanation: "The 'fail' predicate forces backtracking. Combined with repeat or write, it prints all solutions.",
        code: `print_all_parents :-
    parent(X, Y),
    format('~w is parent of ~w~n', [X, Y]),
    fail.                % Forces Prolog to backtrack to next parent
print_all_parents.`
      }
    ]
  },
  {
    id: "prolog-exam-qa",
    sectionNumber: "§ 06",
    title: "Top University Exam Questions & Model Solutions",
    cramTimeMinutes: 20,
    overview: "Model 5-mark and 10-mark Prolog exam questions with complete code and explanation.",
    sections: [
      {
        heading: "Q1: Family Tree Knowledge Base (Grandparent, Sibling, Uncle)",
        explanation: "The standard university midterm problem.",
        code: `parent(pam, bob).
parent(tom, bob).
parent(tom, liz).
parent(bob, ann).
parent(bob, pat).

female(pam). female(liz). female(ann). female(pat).
male(tom).   male(bob).

% Grandparent:
grandparent(X, Z) :- parent(X, Y), parent(Y, Z).

% Sibling (must ensure X \\= Y):
sibling(X, Y) :-
    parent(P, X),
    parent(P, Y),
    X \\= Y.

% Sister:
sister(X, Y) :- sibling(X, Y), female(X).`
      },
      {
        heading: "Q2: Reverse a List (Naive vs Tail-Recursive Accumulator)",
        explanation: "Frequently tested for computational complexity difference ($O(N^2)$ vs $O(N)$).",
        code: `% Efficient O(N) accumulator reverse:
my_reverse(List, Reversed) :-
    rev_acc(List, [], Reversed).

rev_acc([], Acc, Acc).
rev_acc([H | T], Acc, Reversed) :-
    rev_acc(T, [H | Acc], Reversed).`
      },
      {
        heading: "Q3: Find Path in a Directed Graph",
        explanation: "Graph connectivity with cycle prevention.",
        code: `edge(a, b). edge(b, c). edge(c, d). edge(b, d).

path(X, Y) :- edge(X, Y).
path(X, Y) :- edge(X, Z), path(Z, Y).`
      }
    ]
  }
];
