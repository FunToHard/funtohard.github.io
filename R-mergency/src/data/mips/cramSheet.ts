import { CramCard } from '../types';

export const MIPS_CRAM_SHEET: CramCard[] = [
  {
    title: "1. Core Register Conventions",
    items: [
      { label: "$zero ($0)", snippet: "Hardwired 0", note: "Writes discarded" },
      { label: "$v0-$v1 ($2-$3)", snippet: "Return values & syscall code", note: "li $v0, 10 for exit" },
      { label: "$a0-$a3 ($4-$7)", snippet: "Procedure arguments 1-4", note: "Caller-saved" },
      { label: "$t0-$t9 ($8-$15,$24-$25)", snippet: "Temporary registers", note: "Caller-saved (clobbered)" },
      { label: "$s0-$s7 ($16-$23)", snippet: "Saved registers", note: "Callee-saved (must restore)" },
      { label: "$sp ($29) / $ra ($31)", snippet: "Stack ptr / Return addr", note: "Full-descending stack" }
    ]
  },
  {
    title: "2. Instruction Formats (32-bit)",
    items: [
      { label: "R-Type", snippet: "[op:6|rs:5|rt:5|rd:5|shamt:5|funct:6]", note: "add, sub, and, slt (op=0)" },
      { label: "I-Type", snippet: "[op:6|rs:5|rt:5|imm:16]", note: "addi, lw, sw, beq, bne" },
      { label: "J-Type", snippet: "[op:6|target:26]", note: "j, jal (26-bit pseudo-direct)" },
      { label: "Load dest", snippet: "lw $rt, offset($rs)", note: "$rt is destination in loads" },
      { label: "Shift logic", snippet: "sll $rd, $rt, shamt", note: "Shift left logical by shamt" }
    ]
  },
  {
    title: "3. Memory & Word Alignment",
    items: [
      { label: "Alignment Rule", snippet: "address % 4 == 0", note: "Unaligned word load crashes CPU" },
      { label: "Array Indexing", snippet: "sll $t1, $i, 2 => add => lw", note: "Multiply index by 4 byte offset" },
      { label: "Load Byte (lb)", snippet: "Sign-extended to 32 bits", note: "Bit 7 extended (can be negative)" },
      { label: "Load Byte Unsigned", snippet: "Zero-extended to 32 bits", note: "Fills upper bits with zeros" },
      { label: "Stack Push", snippet: "addi $sp, $sp, -4; sw $r, 0($sp)", note: "Stack grows downward" }
    ]
  },
  {
    title: "4. Branch & Jump Target Formulas",
    items: [
      { label: "Branch Target", snippet: "(PC+4) + (SignExt(imm16) << 2)", note: "Relative to next instruction" },
      { label: "Branch Immediate", snippet: "imm16 = (Target - (PC+4)) / 4", note: "Word offset, NOT byte offset" },
      { label: "Jump Target", snippet: "[(PC+4)_{31..28}] || (addr << 2)", note: "Cannot cross 256MB boundary" },
      { label: "Absolute Jump", snippet: "jr $reg (e.g. jr $ra)", note: "Full 32-bit register jump" },
      { label: "Call function", snippet: "jal func (writes PC+4 to $ra)", note: "Jump and link" }
    ]
  },
  {
    title: "5. Pipelining & Delay Slots",
    items: [
      { label: "5 Stages", snippet: "IF -> ID -> EX -> MEM -> WB", note: "Classic RISC pipeline" },
      { label: "Delay Slot", snippet: "Instruction after branch always runs", note: "Executes even if branch taken" },
      { label: "Load-Use Hazard", snippet: "lw followed by use requires 1 stall", note: "Data ready at end of MEM" },
      { label: "Data Forwarding", snippet: "EX/MEM -> EX or MEM/WB -> EX", note: "Bypasses register file delay" },
      { label: "NOP fill", snippet: "sll $zero, $zero, 0", note: "Hardware no-operation" }
    ]
  },
  {
    title: "6. Exam Gotchas & Traps",
    items: [
      { label: "Overwritten $ra", snippet: "jal in recursion overwrites $ra", note: "Always save $ra on stack" },
      { label: "Subtract from PC", snippet: "imm = (Target - PC)/4 => WRONG", note: "Must subtract (PC + 4)" },
      { label: "Clobbering $s0", snippet: "Modifying $s0 without stack save", note: "Violates ABI callee-save rule" },
      { label: "Offset in register", snippet: "lw $t0, $t1($s0) => INVALID SYNTAX", note: "Offset must be immediate constant" }
    ]
  }
];
