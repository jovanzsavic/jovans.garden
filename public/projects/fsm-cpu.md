# Finite State Machine CPU

This readme will describe contents of `./synthesis` folder and provide information on how to synthesize it on **Cyclone-III** and **Cyclone-V** FPGA.
## Folder Structure

```
synthesis/
├── DE0_TOP.v           # Top-level wrapper for DE0 board (Cyclone III)
├── DE0_CV_TOP.v        # Top-level wrapper for DE0-CV board (Cyclone V)
└── modules/            # RTL modules instantiated by the top-level
    ├── top.v           # System top-level (instantiates all subsystems)
    ├── cpu.v           # FSM-based CPU
    ├── alu.v           # Arithmetic Logic Unit
    ├── register.v      # General-purpose register
    ├── memory.v        # Synchronous RAM (initialised from a .mif file)
    ├── clk_div.v       # Clock divider
    ├── ps2.v           # PS/2 keyboard receiver
    ├── scan_codes.v    # PS/2 scan-code to digit decoder
    ├── debouncer.v     # Digital debouncer
    ├── vga.v           # VGA controller (800×600 @ 60 Hz)
    ├── color_codes.v   # Number-to-colour LUT for VGA output
    ├── bcd.v           # Binary-to-BCD converter
    ├── ssd.v           # Seven-segment display decoder
    └── red.v           # Rising-edge detector
```

## Board Targets

| File | Board | Device Family |
|------|-------|---------------|
| `DE0_TOP.v` | Terasic DE0 | Cyclone III |
| `DE0_CV_TOP.v` | Terasic DE0-CV | Cyclone V |

Both wrappers instantiate `top` with the same parameters and declare which pins to use:

| Parameter | Value | Description |
|-----------|-------|-------------|
| `DIVISOR` | `10_000_000` | Clock divider ratio (50 MHz → 5 Hz CPU clock) |
| `FILE_NAME` | `"mem_init.mif"` | Memory initialisation file |
| `ADDR_WIDTH` | `6` | Address bus width (64 locations) |
| `DATA_WIDTH` | `16` | Data bus width |

## Module Descriptions

### `top`
System-level integrator. Connects the clock divider, memory, CPU, PS/2 interface, VGA controller, and seven-segment displays. Exposes clock, reset, switches, LEDs, seven-segment outputs, PS/2 pins, and VGA signals to the board top-level.

<img width="698" height="325" alt="image" src="https://github.com/user-attachments/assets/802f0525-abd2-489a-8eae-e1736dd97c94" />


### `cpu`
Finite-state-machine (FSM) CPU. Implements fetch–decode–execute cycles using a MAR/MDR/IR/PC/SP register file. Supported instructions:

| Mnemonic | Opcode | Operation |
|----------|--------|-----------|
| `MOV`    | `0000` | Copy value between registers / write immediate |
| `ADD`    | `0001` | Addition (supports immediate second operand) |
| `SUB`    | `0010` | Subtraction |
| `MUL`    | `0011` | Multiplication |
| `DIV`    | `0100` | Division |
| `BEQ`    | `0101` | Branch if equal |
| `IN`     | `0111` | Read value from keyboard input |
| `OUT`    | `1000` | Write value to output register |
| `PUSH`   | `1001` | Push register onto stack |
| `POP`    | `1010` | Pop value from stack into register |
| `JSR`    | `1011` | Jump to subroutine (saves return address) |
| `RST`    | `1100` | Return from subroutine |
| `STOP`   | `1111` | Halt and display up to three register values |

Addressing modes: direct and indirect (pointer) for all register operands.

### `alu`
Combinational ALU supporting eight operations selected by a 3-bit opcode:
`ADD`, `SUB`, `MUL`, `DIV`, `NOT`, `XOR`, `OR`, `AND`.

### `register`
Parameterisable synchronous register with active-low reset. Supports load, clear, increment, decrement, shift-right, and shift-left operations.

### `memory`
Single-port synchronous RAM. Content is pre-loaded from a `.mif` file using Altera's `ram_init_file` attribute. Address and data widths are parameterisable.

<img width="711" height="408" alt="image" src="https://github.com/user-attachments/assets/22b3f3f0-c6a3-4c84-a069-1764b44552b8" />



### `clk_div`
Divides the 50 MHz board clock by a configurable `DIVISOR` to produce the slower CPU clock.

### `ps2`
PS/2 keyboard receiver. Shifts in serial frames (start, 8 data bits, parity, stop), verifies odd parity, and outputs a 16-bit register holding the last two received scan-code bytes.

### `scan_codes`
Translates PS/2 scan codes (break codes `F0 xx`) for the digit keys 0–9 into a 4-bit numeric value. Asserts `control` to signal the CPU that valid keyboard input is ready.

### `debouncer`
Two-flip-flop synchroniser followed by a saturating counter used to debounce the PS/2 clock line.

### `vga`
Generates 800×600 @ 60 Hz VGA timing (active-high sync). The visible area is split into two equal halves; each half is filled with a solid colour taken from the 24-bit `code` input (upper 12 bits for the left half, lower 12 bits for the right half).

### `color_codes`
Look-up table that maps a 6-bit number (0–63) to a 24-bit VGA colour code. The tens digit and units digit of the number are each mapped to a distinct 12-bit RGB colour.

<img width="692" height="203" alt="image" src="https://github.com/user-attachments/assets/d3d709f7-3c33-4fc0-b418-34bd24c008c7" />


### `bcd`
Converts a 6-bit binary value to two 4-bit BCD digits (ones and tens).

### `ssd`
Seven-segment display decoder. Converts a 4-bit hexadecimal digit (0–F) to an active-low 7-segment pattern.

### `red`
Rising-edge detector implemented as a two-flip-flop pipeline. Outputs a single-cycle pulse on each rising edge of the input signal.

## Synthesis Flow

The project is built with **Quartus Prime**. Board-specific constraint files (`.qdf`, `.sdc`) and the list of source files used during synthesis are located in [`tooling/config/`](../../tooling/config/):

- `list-src-files-synth.lst` — ordered list of all synthesis source files
- `boards/cyclone3/` — pin assignments and constraints for DE0
- `boards/cyclone5/` — pin assignments and timing constraints for DE0-CV

To synthesize the code, connect the FPGA device, make changes in makefile for corresponding device, open bash, position yourself in `./tooling` folder and run `./xpack/bin/make synth_pgm` to start the synthesis and programming the device.
For help, type  `./xpack/bin/make help` to list all commands
