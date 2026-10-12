// Single source of truth for every piece of text, link and asset on the site.
// Station order here defines the camera path order and the nav order.

export const site = {
  name: 'Arkan T. Abuyazid',
  shortName: 'Arkan Abuyazid',
  role: "Computer Science Master's Student, Texas A&M University",
  email: 'arkan.2.abuyazid@gmail.com',
  github: 'aabuyazid',
  linkedin: 'arkan_abuyazid',
  description:
    'Portfolio of Arkan T. Abuyazid — computer science master’s student at Texas A&M working across GPUs, parallel computing, compilers, and computer vision.',
};

export const stations = [
  {
    id: 'about',
    label: 'About',
    object: 'frame',
    title: 'Quick Introduction',
    kicker: 'About',
    body: [
      "My name is Arkan Abuyazid, and I am a computer science master's student at Texas A&M University.",
      'My journey as an engineer in tech began with two career missions. One, I aim to support scientists and artists achieve the impossible by supplying solutions in the forms of software and hardware to address their computing needs. Two, I strive to build consumer products that drastically improve the lives of the common person. I have explored the fields of electrical engineering and computer science to find my place in the world, from computer architecture and compiler design for hardware accelerators to high-level applications such as deep learning and image processing.',
      'With those two missions as my compass, I have decided to explore different algorithms that utilize GPUs and parallel computing as well as their applications. The problems scientists, artists, and the world at large face are only getting more complex; therefore, my solutions must become that much smarter. In my next phase of my career as a master’s student, I intend to explore graphics, scientific disciplines outside of computing, and current deep learning models. I also intend to broaden my understanding of the GPU’s architecture and master how to design parallel algorithms.',
      'To accomplish these tasks, I am involved in various clubs and organizations, being active in academia, and taking computational science courses. I am currently building embedded AI/ML models for a start-up whose mission is to provide full home automation at an affordable price. My aim is to extend the capabilities of their flagship product by applying my knowledge in image processing and embedded systems. I am also engaged in the Aggies Coding Club, where I am contributing to their own game engine.',
    ],
    callout:
      'I am open to opportunities in Scientific Computing, AI Software/Algorithms, GPU Software, and Backend Engineering.',
    image: { src: 'img/profile/prof-pic.webp', alt: 'Portrait of Arkan Abuyazid' },
  },

  {
    id: 'ccf',
    label: 'CCF',
    object: 'chip',
    kind: 'project',
    title: 'CGRA Compilation Framework 20.04',
    kicker: 'Project · Compilers',
    tagline:
      'An open-source framework to explore and further compiler research for the CGRA hardware accelerator.',
    body: [
      'CCF (CGRA Compilation Framework) is an end-to-end prototype that generates machine code for CGRAs (Coarse-Grained Reconfigurable Arrays) from C/C++ programs and simulates their performance. Through CCF, users can benchmark how CGRAs accelerate kernels designed for general-purpose applications. It is named CCF 20.04 because this framework has been migrated and its functionality verified on Ubuntu 20.04.',
      'To understand the motivation behind any hardware accelerator endeavors, one must be familiar with Moore’s law and why it does not ring true in this day and age. There are only so many transistors that we can fit into a chip before we reach the physical asymptote; thus, speeding up computations requires more ingenuity than just packing more transistors. One solution is creating hardware that computes specific algorithms.',
      'CGRAs are a grid of processing elements that share their inputs and outputs with each other by way of nearest neighbors. Their main purpose is to accelerate loops that are not embarrassingly parallel, and potentially loops with complex control flow. Because the CGRA’s architecture is relatively simple, the onus to effectively delegate and utilize its resources falls on the intelligence of the compiler. In other words, compiling machine code for CGRAs is difficult.',
      'It requires converting the dataflow graph (DFG) of the loop into a 3-dimensional graph that conforms to the spatial constraints of the CGRA’s grid structure and the temporal constraints of the data and control dependencies of the program. Finding a 3-dimensional graph that optimally compacts the loop while respecting all the restrictions is an NP-hard problem.',
      'With CCF, a compilers researcher can easily switch out the default algorithm with an experimental one thanks to the framework’s modularity, and run comprehensive performance benchmarks on it. This results in fast algorithm prototyping, accelerating the throughput of CGRA research at large.',
    ],
    stack: ['LLVM', 'gem5', 'SCons', 'C++', 'Python'],
    figures: [
      {
        src: 'img/ccf/CGRA-Arch.webp',
        alt: 'Architecture diagram of a 4x4 CGRA',
        caption: 'The architecture of a 4×4 CGRA.',
      },
      {
        src: 'img/ccf/App-to-map.webp',
        alt: 'Loop mapped onto a 2x2 CGRA via its dataflow graph',
        caption:
          '(a) An example loop. (b) A 2×2 CGRA. (c) The DFG of the loop. (d) The DFG transformed into a 3D graph, meeting CGRA structural and data dependency constraints.',
      },
    ],
    links: [{ label: 'Repository', href: 'https://github.com/MPSLab-ASU/ccf', kind: 'repo' }],
    reference:
      'Mahesh Balasubramanian, “Compiler Design for Accelerating Applications on Coarse-Grained Reconfigurable Architectures,” PhD thesis, Arizona State University, 2021.',
  },

  {
    id: 'trashcan',
    label: 'Assistive Wearable',
    object: 'wearable',
    kind: 'project',
    title: 'Trashcan Detection System for the Blind',
    kicker: 'Project · Computer Vision',
    tagline: 'A prototype exploring assistive technology for the blind.',
    body: [
      'Formally titled Real-Time Trashcan Recognizer and Localizer for the Blind and Visually Impaired, this project explores the realm of assistive wearable technology. As someone who loves playing around with photography and film-making, and all-in-all revels in the beauty of everything in this world, the ability to see is something I wholeheartedly value. That is why I decided to prototype something that can help blind people experience the world the way I do, to the best of my ability.',
      'By tackling a small problem — in this case, how to inform the user how far the closest trashcan is from them — we learn more about the greater problem at large: informing the user what is in front of them and how far away it is.',
      'Using haptic motors, a stereoscopic camera, and some machine learning, my friends and I designed an assistive prototype that told the user the general direction and distance of the nearest trashcan in front of them. When a trashcan is detected, a row of haptic motors representing its direction vibrates at an intensity inversely related to distance: the closer the trashcan, the stronger the vibration.',
    ],
    stack: [
      'Intel RealSense D435',
      'Raspberry Pi',
      'PyTorch',
      'ADE20K',
      'Python',
    ],
    figures: [
      {
        src: 'img/trashcan/device.webp',
        alt: 'The wearable prototype device',
        caption: 'The wearable device.',
      },
      {
        src: 'img/trashcan/haptic-motor-grid.webp',
        alt: 'Grid of haptic motors with testing LEDs',
        caption:
          'The grid of haptic motors used to tell the user where the trashcan is in their vicinity. The LEDs are for testing and light up with their respective motor.',
      },
      {
        src: 'img/trashcan/testing.webp',
        alt: 'A tester using the prototype',
        caption:
          'The prototype in action. Because we did not build a casing for the camera, the tester is holding it in her hand.',
      },
    ],
    links: [
      { label: 'Final report (PDF)', href: 'pdf/trashcan/FinalReport.pdf', kind: 'pdf' },
      {
        label: 'Repository',
        href: 'https://github.com/MKSwaminathan/Toad-Learns-Trash',
        kind: 'repo',
      },
    ],
  },

  {
    id: 'crowdsource',
    label: 'Image Quality',
    object: 'monitor',
    kind: 'project',
    title: 'Crowdsource Study and Predictor of Compressed Picture Quality',
    kicker: 'Project · Deep Learning',
    tagline:
      'Optimizing the tradeoffs between image quality and compression through human eyes.',
    body: [
      'We are exposed to an astounding number of digital images and videos, through films, video games, and the ads that pervade our social media feeds. From an engineering perspective this poses a serious data concern in terms of storage and transmission. This project aims to minimize the data used for a given image while maximizing its quality: finding the largest JPEG quantization parameter for an image such that any further compression produces a stark difference in quality.',
      'Previous works used metrics defined by an image’s quantitative properties (PSNR, SSIM) to determine quality. There are two flaws. First, these metrics require comparing the compressed image against the original, pristine image — which usually does not exist, since images on the internet go through an innumerable number of transformations. Second, metrics computed from quantitative information alone only approximate how real humans perceive quality.',
      'What this project does instead is capture how humans perceive image quality and compress an image accordingly. The dataset of human decisions is collected through Amazon Mechanical Turk, where workers control image quality with a real-time slider that compresses the image to the slider value, letting them find the perceived optimal point of compression. That dataset then trains a neural network that learns to predict the optimal quantization parameter for any input image.',
    ],
    stack: ['Amazon MTurk', 'AWS S3', 'JavaScript', 'PyTorch', 'HPC'],
    figures: [
      {
        src: 'img/crowdsource/system-diagram.webp',
        alt: 'System design diagram of the crowdsourcing pipeline',
        caption: 'The system design of the project.',
      },
      {
        src: 'img/crowdsource/task.webp',
        alt: 'The Mechanical Turk worker task interface',
        caption: 'The task that workers at Amazon MTurk complete for data collection.',
      },
      {
        src: 'img/crowdsource/GUI.webp',
        alt: 'The graphical user interface of the compression tool',
        caption: 'The graphical user interface of the project.',
      },
    ],
    links: [
      {
        label: 'System design report (PDF)',
        href: 'pdf/crowdsource/system-design-report.pdf',
        kind: 'pdf',
      },
      {
        label: 'Final presentation (PDF)',
        href: 'pdf/crowdsource/final-presentation.pdf',
        kind: 'pdf',
      },
      {
        label: 'Repository',
        href: 'https://github.com/akashukla/MTurk_Bovik',
        kind: 'repo',
      },
    ],
  },

  {
    id: 'inverse-cooking',
    label: 'Inverse Cooking',
    object: 'plate',
    kind: 'project',
    title: 'Recipe Generation from Images of Food',
    kicker: 'Project · Computer Vision',
    tagline:
      'An exercise in developing and training models in PyTorch, delving deeper into computer vision and image analysis.',
    body: [
      'I have strong interests in image processing and computer vision, and I believe there is untapped potential in these fields to assist others day-to-day and improve the overall human condition. To further familiarize myself with the field, I explored imaginative use cases that push its boundaries. One of them is a model that analyzes an image of a dish and outputs a recipe, complete with ingredients, measurements, and instructions — the subject of Meta’s paper Inverse Cooking: Recipe Generation from Food Images.',
      'By training the underlying model and comparing its performance against the benchmarks listed in the paper, I developed further intuition in computer vision, introduced myself to natural language processing, strengthened my skills building and training convolutional neural networks and transformer models in PyTorch, and refamiliarized myself with high-performance computing clusters.',
    ],
    stack: ['PyTorch', 'CNNs', 'Transformers', 'HPC'],
    figures: [],
    links: [
      {
        label: 'Paper (PDF)',
        href: 'pdf/inverse-cooking/inverse-cooking-paper.pdf',
        kind: 'pdf',
      },
      {
        label: 'Repository',
        href: 'https://github.com/aabuyazid/inverse-cooking-training',
        kind: 'repo',
      },
    ],
    reference:
      'Salvador, Drozdzal, Giró-i-Nieto and Romero, “Inverse Cooking: Recipe Generation from Food Images,” arXiv:1812.06164, 2019.',
  },

  {
    id: 'cv',
    label: 'CV',
    object: 'laptop',
    title: 'Curriculum Vitae',
    kicker: 'Experience',
    cv: {
      education: [
        {
          title: 'M.S. Computer Science',
          institution: 'Texas A&M University — College Station',
          year: '2025',
          points: [
            'GPA: 4.0 / 4.0',
            'Coursework: Parallel Computing, Operating Systems, Machine Learning, Database Systems & Computational Sciences',
          ],
        },
        {
          title: 'B.S. Electrical and Computer Engineering',
          institution: 'University of Texas at Austin',
          year: '2020',
          points: [
            'GPA: 3.60 / 4.0',
            'Coursework: Embedded Systems, Computer Architecture, Signal/Image Processing, Data Science, Data Structures & Algorithms',
          ],
        },
      ],
      experience: [
        {
          title: 'Software Development Engineer',
          institution: 'DANA Indonesia — digital wallet platform valued at $1.2B',
          year: '2022 – 2023',
          points: [
            'Engineered backend APIs for bank and ATM transactions and payment methods using Java and Spring Boot',
            'Spearheaded a payroll feature producing new revenue streams totaling $1.8M per year',
            'Developed microservices conducting and verifying millions of transactions between partners daily, attracting 100,000+ users',
            'Coordinated with accounting, front-end and HR departments to deploy features meeting business requirements',
            'Shortened the onboarding period for 2 hires through mentorship',
          ],
        },
        {
          title: 'Compilers Research Assistant',
          institution: 'Arizona State University — MPS Lab',
          year: '2020 – 2021',
          points: [
            'Advanced compiler development to program CGRA hardware accelerators using C++, Python, gem5 and LLVM',
            "Contributed to the lab's open-source toolchain and standardized performance benchmarking for compiler algorithms",
            'Earned 24 forks and 77 stars on the toolchain through research community engagement',
            'Peer-reviewed 16 papers in top engineering venues (IEEE ESL, TCSI, FCCM)',
          ],
        },
      ],
      leadership: [
        {
          title: 'Embedded AI/ML Engineer',
          institution: 'Switchless — home automation start-up',
          year: '2024',
          points: [
            'Building AI/ML models in PyTorch and ONNX to extend the sensor capabilities and data processing of the flagship edge device',
            'Devising a system design that adheres to the power and memory limitations of the edge device while maintaining performance',
          ],
        },
        {
          title: 'Teaching Assistant',
          institution: 'UT Austin / Texas A&M University',
          year: '2018 – 2024',
          points: [
            'Instructed Verilog, C++ and architecture courses of ~75 students',
            'Mentored students with differing strengths and aspirations in their academic and professional goals',
          ],
        },
        {
          title: 'Contributor',
          institution: 'Aggies Coding Club',
          year: '2024',
          points: [
            'Contributing to an in-house game engine and assisting others in C++ development',
          ],
        },
        {
          title: 'Volunteer',
          institution: 'S.E.E.K (Student Engineers Educating Kids)',
          year: '2020',
          points: [
            'Promoted enthusiasm for STEM topics in low-income schools by designing and demoing hands-on experiments',
          ],
        },
      ],
      skills: [
        {
          group: 'Programming Languages',
          items: ['Python', 'C/C++', 'Bash', 'MATLAB', 'MySQL', 'PostgreSQL', 'Java'],
        },
        {
          group: 'AI/ML & Systems',
          items: [
            'PyTorch',
            'OpenCV',
            'scikit-learn',
            'Pandas',
            'Jupyter',
            'CUDA',
            'MPI',
            'POSIX Threads',
            'Linux/UNIX',
            'Docker',
            'Git',
          ],
        },
        {
          group: 'Back-End',
          items: [
            'Spring Framework',
            'Maven',
            'Mockito',
            'JUnit',
            'Jackson',
            'Postman',
            'AWS',
          ],
        },
        {
          group: 'Spoken Languages',
          items: ['English', 'Bahasa Indonesia', 'Japanese'],
        },
      ],
      awards: [
        { year: '2020', text: 'Best Final Project, UT Austin Image Processing course' },
        {
          year: '2020',
          text: '3rd Best Final Project, UT Austin Embedded Systems course',
        },
      ],
      certificates: [
        'NVIDIA Deep Learning Institute — Fundamentals of Accelerated Computing with CUDA Python',
        'Forage — Lyft Back-End Engineering Job Simulation',
        'AT&T — 2024 Technology Academy',
      ],
    },
    // Set to a path under public/ once a real CV PDF exists; the button stays hidden until then.
    pdf: null,
  },

  {
    id: 'repositories',
    label: 'Repositories',
    object: 'shelf',
    title: 'Repositories',
    kicker: 'Open Source',
    body: ['Open-source projects that I would like to showcase.'],
    repos: [
      {
        name: 'inverse-cooking-training',
        owner: 'aabuyazid',
        description: 'Training and benchmarking Meta’s Inverse Cooking model.',
      },
      {
        name: 'Toad-Learns-Trash',
        owner: 'MKSwaminathan',
        description: 'Real-time trashcan recognizer and localizer for the visually impaired.',
      },
      {
        name: 'ccf',
        owner: 'MPSLab-ASU',
        description: 'CGRA Compilation Framework — C/C++ to CGRA machine code.',
      },
      {
        name: 'MTurk_Bovik',
        owner: 'akashukla',
        description: 'Crowdsourced study of compressed picture quality.',
      },
    ],
  },

  {
    id: 'hobbies',
    label: 'Off the Clock',
    object: 'hobbies',
    title: 'Off the Clock',
    kicker: 'Interests',
    body: [
      'The things I do when I am not in front of a compiler.',
    ],
    hobbies: [
      {
        name: 'Photography & Film',
        text: 'I revel in the beauty of everything in this world, and I like capturing it. It is also what drew me to building assistive technology for the blind.',
      },
      {
        name: 'Game Development',
        text: 'Contributing to the Aggies Coding Club game engine in C++, and tinkering with graphics APIs like Vulkan.',
      },
      {
        name: 'Music Composition',
        text: 'Writing and arranging music — another way of turning structure into something people feel.',
      },
      {
        name: 'Basketball',
        text: 'The reliable antidote to too many hours at a desk.',
      },
      {
        name: 'Tinkering with Linux',
        text: 'Breaking and fixing my own setup, which is how a lot of the systems knowledge actually sticks.',
      },
    ],
  },

  {
    id: 'contact',
    label: 'Contact',
    object: 'mailbox',
    title: 'Get in Touch',
    kicker: 'Contact',
    body: ['I respond to e-mails and LinkedIn messages the quickest.'],
    callout:
      'I am open to opportunities in Scientific Computing, AI Software/Algorithms, GPU Software, and Backend Engineering.',
    links: [
      { label: 'arkan.2.abuyazid@gmail.com', href: 'mailto:arkan.2.abuyazid@gmail.com', kind: 'email' },
      { label: 'github.com/aabuyazid', href: 'https://github.com/aabuyazid', kind: 'repo' },
      {
        label: 'linkedin.com/in/arkan_abuyazid',
        href: 'https://www.linkedin.com/in/arkan_abuyazid',
        kind: 'linkedin',
      },
    ],
  },
];

export const stationById = Object.fromEntries(stations.map((s) => [s.id, s]));
