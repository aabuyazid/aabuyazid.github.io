---
layout: page
title: CGRA Compilation Framework 20.04
description: An open-source framework to explore and further compiler research for the CGRA hardware accelerator 
img: assets/img/ASU.jpg
importance: 3
category: work
---
CCF (CGRA Compilation Framework) is an end-to-end prototype that generates 
machine code for CGRAs (Coarse-Grained Reconfigurable Arrays) from C/C++
programs and simulate their performance. Through CCF, users can benchmark how 
CGRAs accelerate kernels designed for general-purpose applications. 
It is named CCF 20.04 because this framework has been migrated and its functionality 
verified on Ubuntu 20.04.

To understand the motivation behind any hardware accelerator endeavors, one must 
be familiar with Moore's law and why it does not ring true in this day and age.
Moore's law is the observation that the number of transistors in a computer chip doubles
about every two years. In the past, this means that in order to build a faster
computer chip, one can simply increase the number of transistors with relative
ease. However, there is only so many transistors that we can fit into a chip
before we reach the physical asymptote; thus, speeding up computations would
require more ingenuity than just packing more transistors. One solution is
creating hardware that computes specific algorithms. For example, GPUs are
hardware accelerators that solely computes matrix multiplications and other
embarrassingly parallel algorithms. The hardware accelerator I would like to
focus here is the CGRA.

<div class="row">
    <div class="col-sm-6 mt-3 mt-md-0">
        CGRAs are a grid of processing elements that share their inputs and outputs with
        each other by way of nearest neighbors. CGRAs' main purpose is to accelerate loops 
        that are not embarrassingly parallel and potentially loops that have complex control flow.
        Because the CGRA's architecture is relatively simple, the onus to effectively
        delegate and utilize its resources falls on the intelligence of the
        compiler. In other words, <b>compiling machine code for CGRAs is difficult</b>.
    </div>
    <div class="col-sm-6 mt-3 mt-md-0">
        {% include figure.html path="assets/img/ccf/CGRA-Arch.png" title="example image" class="img-fluid rounded z-depth-1" %}
        <div class="caption">
            The architecture of a 4x4 CGRA {% cite Balasubramanian2021THESIS %}. 
        </div>
    </div>
</div>

It requires converting the dataflow graph (DFG) of the loop into 3-dimensional graph
that conforms to the spacial constraints of the CGRA's grid structure and
temporal constraints of the data and control dependencies of the program. This
is achieved by placing and routing computation nodes similar to FPGA programming 
as well as scheduling them. This process is the crux of CGRA programming as finding 
a 3-dimensional graph that optimally compacts the loop to ensure fast
computation speeds while respecting all the restrictions is an NP-Hard problem.
As such, efforts in CGRA programming are focused in developing an algorithm that
outputs a 3-dimensional graph that is approximately optimal.

<div class="row">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.html path="assets/img/ccf/App-to-map.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
        (a) An example loop. (b) A 2x2 CGRA. (c) The DFG of the loop. (d) The
        DFG transformed into a 3D graph, meeting CGRA structural and data dependency 
        constraints {% cite Balasubramanian2021THESIS %}. 
</div>

Due to the nature of the problem, a need to develop, simulate, and test
various compiler algorithms quickly arises, and CCF is created to meet that demand. 
With CCF, a compilers researcher can easily switch out the default algorithm with 
an experimental one due to the framework's modularity and run comprehensive performance 
benchmarks on it. This results in fast algorithm prototyping, accelerating the
throughput of CGRA research at large.

This project's tech stack is as follows:
- LLVM, a popular cross-compiler used to compiler C/C++ programs to CGRA machine
  code
- Gem5, an academically recognized computer architecture simulator used to
  simulate CGRA execution
- SCons, a Python-based build tool that wraps C++ classes and abstracts C++
  compilation

