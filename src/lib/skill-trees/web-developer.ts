import type { SkillTree } from "./types";

export const webDeveloper: SkillTree = {
  id: "web-developer",
  title: "Web Developer",
  summary: "How the web really works underneath, from protocols and backends to databases, security and AI coding tools.",
  branches: [
    {
      title: "How the web works",
      concepts: [
        {
          id: "internet-design",
          title: "The internet's design",
          why: "Why the internet is built the way it is, from the people who built it.",
          papers: ["W3141527788"],
        },
        {
          id: "http-2",
          title: "HTTP/2",
          why: "The protocol behind nearly every page load today.",
          papers: ["W2187970900"],
        },
        {
          id: "http-3",
          title: "HTTP/3",
          why: "QUIC makes connections faster and survives switching networks.",
          papers: ["W2745034467"],
        },
        {
          id: "https",
          title: "HTTPS",
          why: "How TLS keeps traffic between browser and server private.",
          papers: ["W2916447643"],
        },
        {
          id: "webassembly",
          title: "WebAssembly",
          why: "Run fast compiled code in the browser, next to JavaScript.",
          papers: ["W2625141509"],
        },
        {
          id: "dependencies",
          title: "Dependencies",
          why: "What goes wrong when sites ship outdated JavaScript libraries.",
          papers: ["W2614073125"],
        },
      ],
    },
    {
      title: "APIs and backend",
      concepts: [
        {
          id: "microservices",
          title: "Microservices",
          why: "Splitting a backend into small services, explained by one of the people who named the idea.",
          papers: ["W4244787281"],
        },
        {
          id: "serverless",
          title: "Serverless",
          why: "Run code without managing servers, and what that trades away.",
          papers: ["W3158207578"],
        },
        {
          id: "scaling",
          title: "Scaling",
          why: "Add and remove servers automatically as traffic changes.",
          papers: ["W2525833315"],
        },
        {
          id: "testing",
          title: "Testing",
          why: "Automatically test web apps that change the page as you use them.",
          papers: ["W2111607551"],
        },
      ],
    },
    {
      title: "Databases",
      concepts: [
        {
          id: "relational-model",
          title: "The relational model",
          why: "The 1970 idea behind every SQL database you'll use.",
          papers: ["W2185907055"],
        },
        {
          id: "isolation-levels",
          title: "Isolation levels",
          why: "What can go wrong when two users change the same data at once.",
          papers: ["W2117917070"],
        },
        {
          id: "nosql",
          title: "NoSQL",
          why: "When key-value and document stores beat SQL, and when they don't.",
          papers: ["W2120113879"],
        },
      ],
    },
    {
      title: "Speed and security",
      concepts: [
        {
          id: "caching",
          title: "Caching",
          why: "Serve repeat requests without redoing the work.",
          papers: ["W2001414591"],
        },
        {
          id: "cdns",
          title: "CDNs",
          why: "Serve files from servers close to each user, as Akamai does.",
          papers: ["W1976986662"],
        },
        {
          id: "sql-injection",
          title: "SQL injection",
          why: "The classic attack on databases, and how to block it.",
          papers: ["W2147478478"],
        },
        {
          id: "xss",
          title: "Cross-site scripting",
          why: "How attackers run their scripts on your site, and how to stop them.",
          papers: ["W2166381878"],
        },
      ],
    },
    {
      title: "AI tools",
      concepts: [
        {
          id: "code-models",
          title: "Code models",
          why: "Codex, the model behind GitHub Copilot, and how code models are tested.",
          papers: ["W3177813494"],
        },
        {
          id: "copilot",
          title: "Copilot",
          why: "How good AI-suggested code really is.",
          papers: ["W4308627320"],
        },
        {
          id: "checking-ai-code",
          title: "Checking AI code",
          why: "Why passing a few tests doesn't mean generated code is correct.",
          papers: ["W7133198585"],
        },
        {
          id: "productivity",
          title: "Productivity",
          why: "What AI assistants actually change for working developers.",
          papers: ["W4392023437"],
        },
      ],
    },
  ],
};
