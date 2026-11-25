import type { SkillTree } from "./types";

export const softwareEngineer: SkillTree = {
  id: "software-engineer",
  title: "Software Engineer",
  summary: "Design, test and ship software with a team, and work well with the AI tools now writing code alongside you.",
  branches: [
    {
      title: "Design",
      concepts: [
        {
          id: "modules",
          title: "Modules",
          why: "The 1972 idea of hiding design decisions behind modules, still how good code is split up.",
          papers: ["W2134119432"],
        },
        {
          id: "microservices",
          title: "Microservices",
          why: "Splitting a system into small services, explained by one of the people who named the idea.",
          papers: ["W4244787281"],
        },
        {
          id: "technical-debt",
          title: "Technical debt",
          why: "Why shortcuts slow teams down later, and how teams pay that debt back.",
          papers: ["W2028836139"],
        },
      ],
    },
    {
      title: "Testing",
      concepts: [
        {
          id: "fuzz-testing",
          title: "Fuzz testing",
          why: "Throwing random input at programs, which crashed or hung about a quarter of UNIX tools.",
          papers: ["W2002934700"],
        },
        {
          id: "property-based-testing",
          title: "Property-based testing",
          why: "Describe what should always be true and let the tool find counterexamples.",
          papers: ["W4242126179"],
        },
        {
          id: "mutation-testing",
          title: "Mutation testing",
          why: "Plant small bugs on purpose to check whether your tests notice.",
          papers: ["W2466388701"],
        },
      ],
    },
    {
      title: "Team process",
      concepts: [
        {
          id: "code-review",
          title: "Code review",
          why: "What reviews really catch, from a study of developers at Microsoft.",
          papers: ["W4235786747"],
        },
        {
          id: "continuous-integration",
          title: "Continuous integration",
          why: "Build and test every change automatically, and what it costs and saves.",
          papers: ["W2347053969"],
        },
        {
          id: "ci-cd",
          title: "Delivery and deployment",
          why: "From merging code to shipping it to users many times a day.",
          papers: ["W2603119212"],
        },
        {
          id: "devops",
          title: "DevOps",
          why: "How development and operations teams share responsibility for running software.",
          papers: ["W2986642681"],
        },
      ],
    },
    {
      title: "AI-assisted coding",
      concepts: [
        {
          id: "big-picture",
          title: "The big picture",
          why: "A survey of where language models already help with software engineering.",
          papers: ["W4392414327"],
        },
        {
          id: "code-models",
          title: "Code models",
          why: "Codex, the model behind GitHub Copilot, and how code models are tested.",
          papers: ["W3177813494"],
        },
        {
          id: "open-code-models",
          title: "Open code models",
          why: "Code Llama, a code model anyone can download and run.",
          papers: ["W4386185625"],
        },
        {
          id: "checking-ai-code",
          title: "Checking AI code",
          why: "Why passing a few tests doesn't mean generated code is correct.",
          papers: ["W7133198585"],
        },
        {
          id: "fixing-bugs",
          title: "Fixing bugs with AI",
          why: "Combining a model with the compiler's knowledge to repair real bugs.",
          papers: ["W4386436496"],
        },
        {
          id: "real-issues",
          title: "Real-world issues",
          why: "Can AI resolve real GitHub issues, including ones with screenshots?",
          papers: ["W4403322180"],
        },
      ],
    },
  ],
};
