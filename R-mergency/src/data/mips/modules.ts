import { ExamModule } from '../types';

export const MIPS_MODULES: ExamModule[] = [
  {
    id: "mips-registers-abi",
    sectionNumber: "§ 01",
    title: "MIPS Architecture & Register Conventions (The ABI Contract)",
    cramTimeMinutes: 18,
    overview: "MIPS is a 32-bit RISC load-store architecture with 32 general-purpose registers. The caller-saved vs. callee-saved contract is the foundation of university assembly exams.",
    sections: [
      {
        heading: "1. The 32 General-Purpose Registers",
        explanation: `Every 32-bit register has a specific architectural and ABI purpose:
• $zero ($0): Constant 0. Writes are silently ignored; reads always yield 0.
• $v0–$v1 ($2–$3): Function return values and syscall codes.
• $a0–$a3 ($4–$7): First 4 function arguments (Caller-saved).
• $t0–$t9 ($8–$15, $24–$25): Temporary registers (Caller-saved).
• $s0–$s7 ($16–$23): Saved variables. Must be preserved across calls (Callee-saved).
• $gp ($28): Global pointer. Points to static data.
• $sp ($29): Stack pointer. Points to top of full-descending stack.
• $fp ($30): Frame pointer. Points to base of current stack frame.
• $ra ($31): Return address. Written automatically by jal and jalr.`,
        code: `# Invariant check:
addi $zero, $zero, 50   # Executes with no error!
add  $t0, $zero, $zero  # $zero is STILL 0x00000000; $t0 becomes 0`,
        trapNote: "[TRAP] $zero can never be modified. Writing to $zero is a valid instruction used as a no-op (nop is encoded as sll $zero, $zero, 0)."
      },
      {
        heading: "2. Caller-Saved vs. Callee-Saved Contract",
        explanation: `• Caller-Saved ($t0-$t9, $a0-$a3, $v0-$v1): If function F uses $t0 and calls function G, F MUST push $t0 to the stack before jal, because G is legally permitted to clobber $t0.
• Callee-Saved ($s0-$s7, $ra, $sp): If function G wants to use $s0, G MUST save $s0 to the stack in its prologue and restore it before returning.`,
        code: `# Calling a sub-procedure safely:
addi $sp, $sp, -4
sw   $t0, 0($sp)       # Caller saves $t0
jal  compute_tax
lw   $t0, 0($sp)       # Caller restores $t0
addi $sp, $sp, 4`
      }
    ]
  },
  {
    id: "mips-instruction-formats",
    sectionNumber: "§ 02",
    title: "Instruction Encoding: R, I, and J Formats",
    cramTimeMinutes: 20,
    overview: "All MIPS instructions are strictly 32 bits wide. Exams routinely ask students to encode instructions into hex or decode binary machine code.",
    sections: [
      {
        heading: "1. The 3 Canonical Formats",
        explanation: `• R-Type (Register): [ opcode(6) | rs(5) | rt(5) | rd(5) | shamt(5) | funct(6) ]
  - Used for register math: add, sub, and, or, slt, sll, srl. Opcode is always 000000!
• I-Type (Immediate): [ opcode(6) | rs(5) | rt(5) | immediate(16) ]
  - Used for immediates, loads, stores, branches: addi, andi, lw, sw, beq, bne.
• J-Type (Jump): [ opcode(6) | target_address(26) ]
  - Used for unconditional jumps: j (opcode 000010) and jal (opcode 000011).`,
        code: `# Encoding: add $t0, $s1, $s2
# opcode: 0 (6 bits)
# rs: $s1 = 17 (01001)
# rt: $s2 = 18 (01010)
# rd: $t0 = 8  (01000)
# shamt: 0 (00000)
# funct: 32 (100000)
# Binary: 000000 10001 10010 01000 00000 100000
# Hex: 0x02324020`
      },
      {
        heading: "2. Load/Store Format ($rt is destination in lw!)",
        explanation: `In standard R-type instructions, the destination is $rd (the 3rd register written). But in I-type arithmetic and loads (addi, lw), $rt is the DESTINATION, and $rs is the base register!`,
        code: `lw  $t0, 8($s0)    # $t0 (rt) = Memory[$s0 (rs) + 8]
sw  $t0, 8($s0)    # Memory[$s0 (rs) + 8] = $t0 (rt)`
      }
    ]
  },
  {
    id: "mips-memory-alignment",
    sectionNumber: "§ 03",
    title: "Memory Model, Byte Alignment & Array Offsets",
    cramTimeMinutes: 20,
    overview: "MIPS is byte-addressable with strict 4-byte word alignment boundaries. Accessing unaligned addresses triggers fatal bus error traps.",
    sections: [
      {
        heading: "1. The 4-Byte Word Alignment Rule",
        explanation: `Every 32-bit word in memory must reside at an address that is a multiple of 4 (the bottom 2 bits of the address must be 00).
• lw $t0, 0($s0) -> Valid if $s0 is aligned.
• lw $t0, 1($s0) -> CRASH! AlignmentException / Bus Error.`,
        code: `# Accessing integer array element A[i]:
# Let $s0 = base address of array A, $t0 = index i
sll $t1, $t0, 2     # $t1 = i * 4 (scale index to byte offset!)
add $t2, $s0, $t1   # $t2 = address of A[i]
lw  $s1, 0($t2)     # $s1 = A[i]`,
        trapNote: "[TRAP] In C/Python you write arr[i]. In MIPS you MUST multiply i by 4 (sll $t1, $t0, 2) before adding to base address!"
      },
      {
        heading: "2. Byte Loading: lb vs lbu (Sign Extension Trap)",
        explanation: `• lb (Load Byte): Sign-extends the 8-bit byte to 32 bits (bit 7 copied to bits 8-31). If the byte has high bit 1 (e.g. 0x80 to 0xFF), the loaded register becomes negative (0xFFFFFFxx)!
• lbu (Load Byte Unsigned): Zero-extends the byte, filling bits 8-31 with zeros (0x000000xx).`,
        code: `# Memory has byte 0x8F:
lb  $t0, 0($s0)     # $t0 = 0xFFFFFF8F (sign-extended to -113)
lbu $t1, 0($s0)     # $t1 = 0x0000008F (zero-extended to +143)`
      }
    ]
  },
  {
    id: "mips-branch-jump-formulas",
    sectionNumber: "§ 04",
    title: "Branch & Jump Target Calculations (The PC + 4 Rule)",
    cramTimeMinutes: 22,
    overview: "The most frequently tested math problem on architecture exams: calculating exact immediate field offsets for beq, bne, and j.",
    sections: [
      {
        heading: "1. Conditional Branch Formula (PC-Relative)",
        explanation: `In beq $rs, $rt, offset:
The 16-bit immediate offset is relative to the instruction AFTER the branch (PC + 4), measured in 4-byte WORDS:
Target Address = (PC + 4) + (SignExt(imm16) << 2)

Solving for Immediate:
imm16 = (Target Address - (PC + 4)) / 4`,
        code: `# Example:
# 0x00400010: beq $s0, $s1, target
# 0x00400014: addi $t0, $t0, 1
# 0x00400018: sll  $t1, $t1, 2
# 0x0040001C: target: sub $s2, $s2, $s3

# PC of beq is 0x00400010 => PC + 4 = 0x00400014
# Target = 0x0040001C
# Byte diff = 0x0040001C - 0x00400014 = 8 bytes
# imm16 = 8 / 4 = 2 (0x0002)`,
        trapNote: "[TRAP] Never subtract from PC! Always subtract from (PC + 4). Subtracting from PC produces an off-by-one word error."
      },
      {
        heading: "2. Unconditional Jumps (26-bit Pseudo-Direct)",
        explanation: `In j target:
The 26-bit address is shifted left by 2 bits, and the top 4 bits are taken from (PC + 4):
Target Address = [(PC + 4)_{31..28}] || (instr_index << 2)

Consequence: j cannot jump across a 256 MB aligned boundary! To jump anywhere in the 32-bit address space, use jr $reg (R-type).`,
        code: `la $t0, distant_function
jr $t0              # Full 32-bit jump`
      }
    ]
  },
  {
    id: "mips-stack-frame-recursion",
    sectionNumber: "§ 05",
    title: "Stack Frames, Calling Conventions & Recursion",
    cramTimeMinutes: 25,
    overview: "Managing the full-descending stack pointer ($sp) across function calls and avoiding infinite return address clobbering in recursion.",
    sections: [
      {
        heading: "1. Full-Descending Stack (Push / Pop)",
        explanation: `The MIPS stack grows DOWNWARD toward lower memory addresses.
• Push: Decrement $sp by number of bytes, then sw.
• Pop: lw from stack, then increment $sp by same number of bytes.`,
        code: `# Push $s0 and $ra (8 bytes = 2 words):
addi $sp, $sp, -8
sw   $ra, 4($sp)
sw   $s0, 0($sp)

# ... function body ...

# Pop $s0 and $ra:
lw   $s0, 0($sp)
lw   $ra, 4($sp)
addi $sp, $sp, 8
jr   $ra`
      },
      {
        heading: "2. The Overwritten $ra Trap in Recursion",
        explanation: `When function F calls jal G, the hardware automatically writes the return address into $ra. If F was itself called via jal, the original value of $ra is destroyed unless F saved $ra on the stack!`,
        code: `# CRITICAL EXAM BUG:
factorial:
    # BUG: Forgot sw $ra, 0($sp)!
    blez $a0, base
    jal  factorial    # OVERWRITES $ra!
    # Calling jr $ra now will infinitely loop to this jal!
base:
    jr   $ra`,
        trapNote: "[TRAP] Any non-leaf function (a function that invokes jal) MUST save $ra on the stack. Failing to do so causes an infinite loop."
      }
    ]
  },
  {
    id: "mips-pipelining-delay-slots",
    sectionNumber: "§ 06",
    title: "Classic 5-Stage Pipeline Hazards & Branch Delay Slots",
    cramTimeMinutes: 20,
    overview: "The MIPS 5-stage pipeline (IF, ID, EX, MEM, WB), data forwarding, load-use stalls, and the famous branch delay slot.",
    sections: [
      {
        heading: "1. The Branch Delay Slot Semantics",
        explanation: `In hardware MIPS pipelines, branch decisions resolve in the ID stage. The instruction sequentially immediately following the branch has already been fetched into IF!
Rule: The instruction in the delay slot ALWAYS executes unconditionally, whether the branch is taken or not!`,
        code: `    addi $t0, $zero, 5
    addi $t1, $zero, 5
    beq  $t0, $t1, target
    addi $t0, $t0, 1        # DELAY SLOT! Executes even though branch is taken!
    addi $t0, $t0, 10       # Skipped
target:
    # Here $t0 is 6, NOT 5!`
      },
      {
        heading: "2. Load-Use Data Hazard",
        explanation: `Data loaded via lw is only available at the end of the MEM stage. An immediately subsequent instruction that uses that register in EX cannot forward it in time, requiring 1 stall cycle (bubble).`,
        code: `lw   $t0, 0($s0)
add  $t1, $t0, $s1   # Load-use hazard! Requires 1 stall cycle or reordering.`
      }
    ]
  },
  {
    id: "mips-exam-model-questions",
    sectionNumber: "§ 07",
    title: "Top University Exam Problems & Worked Solutions",
    cramTimeMinutes: 25,
    overview: "Full-credit, ABI-compliant MIPS assembly solutions for classic written and lab practical exam questions.",
    sections: [
      {
        heading: "Q1: Recursive Sum of 1 to N with Full Stack Frame",
        explanation: "Recursive function calculating sum(n) = n + sum(n - 1) with complete prologue and epilogue.",
        code: `.text
.globl rec_sum

rec_sum:
    addi $sp, $sp, -8       # Allocate 8-byte frame
    sw   $ra, 4($sp)        # Save return address
    sw   $s0, 0($sp)        # Save callee-saved $s0

    blez $a0, base_case     # Base case: if n <= 0 return 0

    move $s0, $a0           # Save current n in $s0
    addi $a0, $a0, -1       # Arg = n - 1
    jal  rec_sum            # Recursive call ($v0 = rec_sum(n - 1))

    add  $v0, $s0, $v0      # Return n + rec_sum(n - 1)
    j    epilogue

base_case:
    li   $v0, 0

epilogue:
    lw   $s0, 0($sp)        # Restore $s0
    lw   $ra, 4($sp)        # Restore $ra
    addi $sp, $sp, 8        # Deallocate stack
    jr   $ra`
      },
      {
        heading: "Q2: In-Place String Capitalization",
        explanation: "Iterate through ASCII string, convert 'a'-'z' (97-122) to 'A'-'Z' by subtracting 32.",
        code: `.text
.globl capitalize

capitalize:
    move $t0, $a0           # $t0 = string pointer

cap_loop:
    lbu  $t1, 0($t0)        # Load char byte
    beqz $t1, cap_done      # If '\0', exit

    li   $t2, 97            # 'a'
    blt  $t1, $t2, cap_next
    li   $t2, 122           # 'z'
    bgt  $t1, $t2, cap_next

    addi $t1, $t1, -32      # Convert to uppercase
    sb   $t1, 0($t0)        # Write back

cap_next:
    addi $t0, $t0, 1        # Next byte
    j    cap_loop

cap_done:
    jr   $ra`
      }
    ]
  }
];
