import { QuizQuestion } from '../types';

export const MIPS_QUIZZES: QuizQuestion[] = [
  {
    id: "mips-overwritten-ra",
    langId: "mips",
    trapCategory: "Procedure Call Contract",
    question: "What catastrophic runtime bug occurs if a non-leaf function fails to push `$ra` onto the stack before invoking `jal`?",
    codeSnippet: `factorial:\n  blez $a0, base\n  jal  factorial   # Invoked without saving $ra!\nbase:\n  jr   $ra`,
    options: [
      "`jal` overwrites `$ra` with the internal return address, causing `jr $ra` to loop infinitely to the recursive call site instead of returning to the original caller",
      "Throws a hardware StackOverflow exception immediately",
      "Returns $a0 multiplied by 0",
      "`$zero` is overwritten"
    ],
    correctIndex: 0,
    explanation: "Whenever `jal` executes, hardware writes `PC + 4` (or `PC + 8`) into `$ra`. If `$ra` was not saved on the stack, the return address to the caller in `main` is irreversibly lost, and `jr $ra` jumps back to the recursive call forever."
  },
  {
    id: "mips-branch-pc4-formula",
    langId: "mips",
    trapCategory: "Branch Calculations",
    question: "In MIPS, why is the immediate field of a conditional branch instruction calculated from `(PC + 4)` rather than `PC`?",
    codeSnippet: `Target = (PC + 4) + (SignExt(imm16) << 2)`,
    options: [
      "Because by the time the branch instruction is decoded in hardware, the Program Counter has already advanced by 4 bytes",
      "Because MIPS uses 8-byte instruction words",
      "Because branch offsets are 2's complement",
      "Because of the stack pointer offset"
    ],
    correctIndex: 0,
    explanation: "In the MIPS pipeline, the instruction fetch unit increments PC by 4 immediately during the IF stage. When the branch offset is added in the ID stage, the base reference address in hardware is already `PC + 4`."
  },
  {
    id: "mips-branch-delay-slot",
    langId: "mips",
    trapCategory: "Pipelining & Delay Slots",
    question: "Given a MIPS pipeline with branch delay slots enabled, what is the final value of `$t0`?",
    codeSnippet: `addi $t0, $zero, 5\naddi $t1, $zero, 5\nbeq  $t0, $t1, target\naddi $t0, $t0, 1    # Delay slot instruction!\naddi $t0, $t0, 10\ntarget:\nadd  $v0, $t0, $zero`,
    options: [
      "5 (delay slot skipped because branch was taken)",
      "6 (delay slot executes unconditionally before jumping to target)",
      "16 (all instructions executed)",
      "0"
    ],
    correctIndex: 1,
    explanation: "In a MIPS branch delay slot, the single instruction directly sequential to the branch is executed unconditionally, regardless of whether the branch condition evaluates to true or false. `$t0` becomes 5 + 1 = 6."
  },
  {
    id: "mips-lb-vs-lbu",
    langId: "mips",
    trapCategory: "Memory & Sign Extension",
    question: "Memory at address `0x1000` contains byte `0x9A`. What are the values loaded into `$t0` by `lb $t0, 0($s0)` and `$t1` by `lbu $t1, 0($s0)`?",
    codeSnippet: `lb  $t0, 0($s0)   # byte is 0x9A (binary 1001 1010)\nlbu $t1, 0($s0)`,
    options: [
      "`$t0 = 0xFFFFFF9A` (sign-extended), `$t1 = 0x0000009A` (zero-extended)",
      "`$t0 = 0x0000009A`, `$t1 = 0xFFFFFF9A`",
      "Both are `0x0000009A`",
      "Both are `0xFFFFFF9A`"
    ],
    correctIndex: 0,
    explanation: "Bit 7 of `0x9A` is 1. `lb` sign-extends bit 7 into bits 8 through 31, producing `0xFFFFFF9A` (a negative decimal number -102). `lbu` fills bits 8-31 with zeros, producing `0x0000009A` (+154)."
  },
  {
    id: "mips-word-alignment-exception",
    langId: "mips",
    trapCategory: "Memory Alignment",
    question: "What happens if a program attempts to execute `lw $t0, 3($s0)` when `$s0 = 0x10000000`?",
    codeSnippet: `lw $t0, 3($s0)   # $s0 = 0x10000000`,
    options: [
      "Hardware raises an unaligned memory access trap (Bus Error / AlignmentException)",
      "Loads the 4 bytes starting at address 0x10000003 seamlessly",
      "Truncates the address to 0x10000000",
      "Reverses byte endianness"
    ],
    correctIndex: 0,
    explanation: "MIPS 32-bit words must be aligned on 4-byte boundaries (`address % 4 == 0`). Accessing address `0x10000003` violates this hardware invariant and raises a fatal AlignmentException."
  },
  {
    id: "mips-callee-saved-regs",
    langId: "mips",
    trapCategory: "Calling Conventions",
    question: "Which group of registers MUST be saved to the stack and restored by a procedure if that procedure modifies them?",
    codeSnippet: `# Preserved across calls (Callee-saved)`,
    options: [
      "`$s0–$s7` and `$ra`",
      "`$t0–$t9` and `$a0–$a3`",
      "`$v0–$v1` and `$k0–$k1`",
      "`$at` and `$zero`"
    ],
    correctIndex: 0,
    explanation: "Under the standard MIPS ABI, registers `$s0–$s7`, `$sp`, `$fp`, and `$ra` are callee-saved: any function that modifies them must restore their exact original values before returning via `jr $ra`."
  },
  {
    id: "mips-array-indexing-stride",
    langId: "mips",
    trapCategory: "Array Indexing",
    question: "Why must array index `i` in register `$t0` be shifted left by 2 (`sll $t1, $t0, 2`) before accessing 32-bit integer array `A`?",
    codeSnippet: `sll $t1, $t0, 2\nadd $t2, $s0, $t1\nlw  $s1, 0($t2)`,
    options: [
      "Because MIPS memory is byte-addressed, and each 32-bit integer occupies 4 bytes ($2^2 = 4$)",
      "Because shifting left by 2 clears the sign bit",
      "Because MIPS uses 16-bit register pointers",
      "Because index 0 is invalid in MIPS"
    ],
    correctIndex: 0,
    explanation: "MIPS addresses memory by single bytes. A 32-bit word consists of 4 bytes. Accessing element $i$ requires a byte offset of $i \times 4$, which is computed by shifting left by 2 bits (`sll $t1, $t0, 2`)."
  },
  {
    id: "mips-zero-register",
    langId: "mips",
    trapCategory: "Hardware Invariants",
    question: "What is the result of executing `addi $zero, $zero, 100`?",
    codeSnippet: `addi $zero, $zero, 100`,
    options: [
      "The instruction executes without error, but `$zero` remains 0x00000000",
      "Hardware raises an illegal write exception",
      "`$zero` becomes 100",
      "The CPU resets"
    ],
    correctIndex: 0,
    explanation: "Register `$0` (`$zero`) is physically hardwired to ground (0 volts). Writes to `$zero` are discarded by hardware logic without raising any exception."
  }
];
