# Multithreaded, time-sharing kernel for RISC-V ISA

## About the project

This project represents a simple yet fully functional kernel for the RISC-V architecture. It is completely made from scratch, meaning it is based on the most fundamental concepts of C/C++ programming languages. Additionally, no external (nor internal) library is used in the creation process.

## Kernel overview

- Memory allocator
- Threads
- Semaphores
- HW and SW interrupts
- System and user modes
- Process FIFO Scheduler
- Many more are discussed in the following paragraphs

## Important notes

**userMain** is used as the ordinary main in other projects, where **main** in this case is used only in system mode, it prepares the whole kernel for user activities - initialization of memory and preparing for userMain and user mode.

Kernel and user app are compiled as one .exe file, which is then run on the host OS - modified version of MIT's xv6 OS. Using the QEMU emulator, xv6 creates a virtual space for our .exe file, making it see the whole system as its own HW with one whole available memory space.

Kernel supports 3 different layers connected to the user's app:

- Application Binary Interface / ABI
- C Application Programming Interface / C API
- C++ Application Programming Interface / C++ API

![Hijerarhija](https://user-images.githubusercontent.com/115867204/201788720-e1cd77fc-ed25-4e16-a2bf-0a2fe7487f8a.jpg)

## Application Binary Interface - ABI

ABI is the lowest layer in the kernel hierarchy and is completely made for system mode, or more precisely, it is a set of system calls that are used in higher levels. It transfers all the variables and return values from the upper level to the processor's registers.

ABI is made of the following classes:

- MemoryAllocator - for dynamic allocations in user apps and for initial instantiation of the  whole memory
- Machine - a set of methods that are composed of assembly code, working with the processor's registers
- threadHandler - a handler class that wraps real thread procedures, made in the  C API
- semaphoreHandler - a handler class that wraps real semaphore procedures, made in the C API

### Memory Allocation

The smallest blocklike unit in memory is an object of a structure called FreeMem, which stores info about how much of size (size_t, in bytes) does the block use (without structure header), and a pointer to the next available FreeMem.

Initially, MemoryAllocator allocates the whole memory as one available block.

MemoryAllocator uses 2 fundamental methods in all the upper layers as well as in the user apps:

- `void* mem_alloc(size_t sz)` -> returns a pointer to the newly allocated block in memory, or returns nullptr if some error occurred
  - It uses the `FirstFit` algorithm for block choosing.
- `int mem_free(void* ptr)` -> returns 0 if everything is good, otherwise it returns the corresponding error code
  - It is a must to pass a pointer of a previously allocated block from `mem_alloc` to this function for this function to work properly!
  - `mem_free` appends the block pointed by the passed argument to the `tail` - the last available block tracked in MemoryAllocator.

Table of used constants in Memory management defined in hw.lib (all are extern)
| Return type | Name | About |
| ----------- | ---- | ----- |
| const void* | HEAP_START_ADDR | Start address of the virtual memory used by processes and the kernel itself |
| const void* | HEAP_END_ADDR | End address of the virtual memory used by processes and the kernel itself |
| const size_t | MEM_BLOCK_SIZE | The unit used for memory allocation |

Initial memory size is then (size_t)HEAP_END_ADDR - (size_t)HEAP_START_ADDR - sizeof(FreeMem), or one whole block.

### Interrupt handling

Every computer system has SW and HW interrupts, as a way to do different tasks. Kernel handles interrupts in a void Machine::handleSuperVisorTrap() method, called from the trap routine (assembly code[^1]). It distinguishes several interrupt causes; here are some:

- Timer interrupt, for time-sharing processor context change
- Console interrupt
- External hardware interrupt
- Illegal instruction
- Read permission denied
- Write permission denied
- Software interrupt
  - This one is used most of the time since it calls void Machine::callerFunction(...), the true wrapper that calls a particular system call according to the function code passed as the first argument

## C Application Programming Interface - C API

C API is a layer above the ABI. It consists of the classic methods as wrappers of ABI methods, making it an ABI wrapper.

C API provides a classical, procedural programming interface of system calls in the C language. It implements these methods:

| Code | Function | About |
| ---- | -------- | ----- |
| 0x01 |` void* mem_alloc(size_t size);` |Allocates space of (at least) size bytes of memory, rounded and aligned to size blocks MEM_BLOCK_SIZE. Returns a pointer to the allocated portion of space from which to the end of the given space, there are (at least) size bytes in case of success, and null in case of failure. MEM_BLOCK_SIZE is an integer constant greater than or equal to 64 and less than or equal to 1024. |
| 0x02 | `int mem_free(void* ptr);` |Frees space previously allocated by mem_alloc. Returns 0 on success, a negative error value (error code). The argument must have the value returned from mem_alloc. If not, the behavior is undefined: core can return an error if it can detect it or manifest any other foreseeable or unforeseeable behavior. |
| 0x11 | `int thread_create(thread_t* handle, void(*start_routine)(void*), void* arg); `| Starts a thread on the start_routine function, calling it with argument arg. In case of success, it writes to *handle "handle" of the newly created thread and returns 0, and in case of failure, returns a negative value (error code). The "handle" is an internal identifier used by the kernel to identify a thread (pointer to some internal core structure/object whose name is hidden behind a synonym _thread). |
| 0x12 |` int thread_exit();` | Kills current thread and changes context of processor. Returns 0 if everything is good, otherwise returns error code |
| 0x13 |` void thread_dispatch();` | Potentially changes context of processor, giving the  processor to another, or the same thread |
| 0x21 |` int sem_open(sem_t* handle, unsigned init);` |Creates a semaphore with an initial value of init. In case of success, *handle writes the handle of the newly created semaphore and returns 0, and in case of failure, returns a negative value (code errors). The "handle" is an internal identifier used by the kernel to identify semaphores (a pointer to some internal core structure/object whose name is hidden behind a synonym _sem). |
| 0x22 | `int sem_close(sem_t handle);` | Frees the semaphore with the given handle. All threads that are found waiting at the traffic lights are unblocked, while those that wait return an error. In case of success, it returns 0, and in case of failure returns a negative value (error code). |
| 0x23 | `int sem_wait(sem_t handle);` |A wait operation on a semaphore with a given handle. In case of success returns 0, and on failure, including the case when a semaphore is deallocated while the calling thread is on it, it returns a negative value (error code). |
| 0x24 | `int sem_signal(sem_t handle);` | Operation signal on the traffic light with the given handle. In case of success, it returns 0, and on failure, it returns a negative value (error code). |
| 0x26 | `int sem_trywait(sem_t id); ` | The wait operation on the traffic light with the given handle, which  does not wait. In case of a semaphore lock, it returns 0, u  in case the traffic light is not locked 1, and in case of failure  returns a negative value (on error).|

Special function code is also 0x25 when the processor enters the system mode.

## C++ Application Programming Interface - C++ API

C++ API is a layer above the C API. It provides an object-oriented programming interface for Threads and Semaphores, as well as OOP C++ dynamic memory management.

Threads:
```C++
public:
    Thread (void (*body)(void*), void* arg);//
    virtual ~Thread ();//
    int start ();//
    static void dispatch ();//
    static int sleep (time_t);
protected:
    Thread ();//
    virtual void run () {}//
private:
    thread_t myHandle;
    void (*body)(void*); void* arg;
    static void threadWrapper(void *thread);//
};
```
The Thread class supports 2 ways of creating Threads: 
- POSIX way: creating a thread also starts it
- Object-oriented way: thread starts with start() method

Semaphores:
```C++
class Semaphore {
        public:
    Semaphore (unsigned init = 1);
        virtual ~Semaphore ();//
        int wait ();//
        int signal ();//
        int timedWait (time_t);
        int tryWait();//
        private:
        sem_t myHandle;
};
```

## Threads implementation

The core functionality of threads is behind the internal class called TCB. TCB stands for Thread Control Block and works together with the System Scheduler.

### Scheduler

Scheduler is implemented as a Singleton[^2] class for scheduling of active threads.
It is made of a dynamic list seen as a Queue for ready threads. It uses 2 simple methods: get and put, which dynamically unblock/block threads. Scheduler uses the FIFO algorithm.

### TCB

TCB provides different static and non-static methods necessary for thread creation, deletion, and watching:

- TCB(Body body, uint64 timeSlice, void * args) -> makes an active thread with the corresponding function body and its arguments, as well as timeSlice[^3], and puts it in the Scheduler
- deleteThread(TCB *thread);
- setBlocked(bool b);
- yield() -> change of processor context on request. Scheduler puts the current thread in, and chooses a new one according to the FIFO algorithm
- exitThread();
- isFinished()
- setFinished(bool value)
- getTimeSlice()

TCB tracks which thread is current. Context change is completely processed in the assembly block.

## Semaphores implementation

The core functionality of semaphores is behind the internal class called ksempaphore.

Sempahores in this kernel work as expected: there are simple methods for signal and wait. Each semaphore has its own queue for blocked threads.

## Differences between the modes

There are 3 modes in RISC-V, though only 2 are used in this kernel:
- User mode / Unprivileged regime
- System mode / Privileged regime

While System mode has permission to access every register and use every instruction in processor, User mode is restricted. The kernel is entirely made to be run in system mode, as well as the main method.

For that reason, the userMain method is made and set in a different source file. User mode for userMain is prepared in the main method, so all the threads made in userMain can run in Unprivileged regime, and the main method remains as privileged one.

When all unprivileged threads from userMain are finished, userMain finishes and changes context to the main method, which terminates the whole kernel.

## Want to see more?

The whole text project is available in the Serbian language on the courses [website](http://os.etf.rs/OS1/index.html) in the section Project.

It is recommended to understand basic terms and concepts used in this project, such as:
- Memory management and organisation
- Basics of assembly for RISC-V (available in the  documentation previously mentioned)
- Processes and threads
- Process sync using Semaphores

# Prepare project for use

1. Get CLion, as it is shown that this IDE works great with the qemu emulator and the xv6 OS
2. Install these Linux packages:

- build-essential
- qemu-system-misc
- gcc-riscv64-linux-gnu
- binutils-riscv64-linux-gnu
- gdb-multiarch
- g++-riscv64-linux-gnu

3. Get the project using `git clone https://github.com/markovicb1/riscv-kernel.git`. Open the folder in CLion
4. There are several make commands:

- make qemu -> used to start the kernel
- make qemu-gdb -> used for debugging (uses GNU debugger)
- make all -> used to compile the project, produces the kernel.asm
- make clean -> cleans the result of make all and several extra files

For the first time, the order should be: clean->all->qemu

5. In order to run a particular test, such as the C Threads test, the corresponding method in userMain should be uncommented.

# Future changes :exclamation:

Even though the project works well, it is always under construction. There are several things intended to be done in the near future:

- Asynchronous context change on whichever interrupt
- Console support (HW interrupts)
- Change the Scheduler algorithm from FIFO to something better
- Solve grammar errors in README.md
- ...

[^1]: RISC-V ISA Assembly guide, as well as other important staff, are available in the project's official documentation [here](https://riscv.org/technical/specifications/), ISA Specification
[^2]: A class that cannot be instantiated. It uses static methods since it doesn't make objects. It is considered a service class
[^3]: Unfortunately, the current version of the kernel doesn't support sleeping threads, so timeSlice doesn't play a big role
