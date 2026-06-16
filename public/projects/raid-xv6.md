# RAID Subsystem for xv6 OS

## About the project

This project represents a fully functional subsystem for RAID (Redundant Array of Independent Disks) implementation inside the xv6 operating system. It is completely made from scratch in the C language, directly modifying the xv6 kernel to extend it with RAID functionality. No external libraries were used.  


## RAID Subsystem overview

The implemented system organizes multiple physical disks into a single logical disk, improving both performance and fault tolerance.  

It supports:
- **RAID0** (striping – performance oriented)
- **RAID1** (mirroring – redundancy oriented)
- **RAID0+1** (combination of striping and mirroring)
- **RAID4** (striping with dedicated parity disk)
- **RAID5** (striping with distributed parity)

Key features include:
- Initialization of RAID structures
- Read/write operations on logical blocks
- Handling disk failures and repairs during runtime
- Recovery of lost data after disk repair
- Destruction of RAID structure (cleanup)
- Concurrency support for multiple processes accessing the RAID simultaneously

## Important notes

- xv6 is modified only to add RAID support. No other system functionalities are broken or removed.  
- RAID operations are exposed to user programs **only via system calls**.  
- The project runs inside the provided xv6 environment using QEMU on Linux (x64).  
- Since this is kernel-level code, the standard C library is not available.  

## System calls

The RAID subsystem is controlled via these system calls:

| code |system call | function |
| --- | ---- | ----- |
| 0x22 |  int init_raid(enum RAID_TYPE raid);  |  Initializes RAID structure, writes metadata to disks for persistence.  |
| 0x23 | int read_raid(int blkn, uchar* data);  | Reads a single block at logical block number.  |
| 0x24 |  int write_raid(int blkn, uchar* data);  | Writes a single block at logical block number. |
| 0x25 |  int disk_fail_raid(int diskn);  | Marks a disk as failed; RAID continues working if redundancy allows.   |
| 0x26 |  int disk_repaired_raid(int diskn);  |  Marks disk as repaired and restores lost data.  | 
| 0x27 |  int info_raid(uint *blkn, uint *blks, uint *diskn); |   Retrieves info (number of logical blocks, block size, number of disks).   |
| 0x28 |  int destroy_raid();  | Deletes RAID structure, data on disks becomes invalid.   |

Each call returns **0 on success**, or a negative error code on failure.  


## Example of systemcall implementation

**in usys.pl**, which generates a stub for the system calls that are declared in an array in syscall.c
```c
sub entry {
    my $name = shift;
    print ".global $name\n";
    print "${name}:\n";
    print " li a7, SYS_${name}\n";
    print " ecall\n";
    print " ret\n";
}
	
entry("init_raid");
```

**in raid.c** in true xv6 spirit, argument fetcher and real function 
```c
uint64 sys_init_raid(void){
    int raid;
    argint(0, &raid);
    return (uint64)init_raid((enum RAID_TYPE) raid);

};
int init_raid(enum RAID_TYPE raid){
    raidInfo.type = raid; //raid0
    raidInfo.diskNum = DISKS; //2
    ...

    for(int i = 0; i < DISKS; i++){
        disks[i].isOk = 1;
    }
    return 0;
};
```

## Disk access, concurrency, and recovery

Disk operations are done via provided low-level xv6 functions (in `virtio_disk.c`):

```c
void write_block(int diskn, int blkn, uchar* data);
void read_block(int diskn, int blkn, uchar* data);
```

- Only one block is transferred per call.  
- Transfers use interrupts but block the caller until complete.  
- All RAID system calls are **thread-safe** and can be used concurrently by multiple processes.  
- Repairing a failed disk triggers data restoration from redundant disks.  

## Development environment

- OS: Linux (x64)  
- Emulator: QEMU (provided in the official VM)  
- IDE: CLion (recommended, free academic license available)  
- Toolchain: xv6 source + GNU toolchain for RISC-V  
The Standard C library is **not available** in kernel space; all required low-level functions are provided.  

## Want to see more?

It is recommended to understand:
- RAID concepts (striping, mirroring, parity)  
- xv6 disk subsystem and system calls  
- Synchronization and concurrent access in operating systems  

Helpful resources:
- [RAID Wikipedia](https://en.wikipedia.org/wiki/RAID)  
- [MIT xv6 book](https://pdos.csail.mit.edu/6.S081/2023/xv6/book-riscv-rev3.pdf)  

## Build and run

1. Clone xv6 with the RAID project integrated.  
2. Use the provided `Makefile` to configure the number and size of disks.  
3. Build with:
   ```bash
   make qemu
   ```
   Runs xv6 with RAID support.  
4. Test with:
   ```bash
   javni_test      # edit user program for testing
   make clean      # cleanup build files
   ```
