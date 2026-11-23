import type { SkillTree } from "./types";

export const dataVisualizationEngineer: SkillTree = {
  id: "data-visualization-engineer",
  title: "Data Visualization Engineer",
  summary: "Turn data into charts people understand, from encoding and color to dashboards and complex data.",
  branches: [
    {
      title: "Foundations",
      concepts: [
        {
          id: "encoding-data",
          title: "Encoding data",
          why: "Which visual channels (position, length, color) show data most accurately.",
          papers: ["W2132881639"],
        },
        {
          id: "visual-analytics",
          title: "Visual analytics",
          why: "Using interactive visuals to reason about data, not just display it.",
          papers: ["W2004657296"],
        },
      ],
    },
    {
      title: "Grammars and tools",
      concepts: [
        {
          id: "queries-to-charts",
          title: "From queries to charts",
          why: "Polaris, the research system that became Tableau.",
          papers: ["W2023758372"],
        },
        {
          id: "grammar-of-graphics",
          title: "Grammar of graphics",
          why: "Describe any chart in a few lines, as Vega-Lite does.",
          papers: ["W2516678343"],
        },
        {
          id: "plotting-in-python",
          title: "Plotting in Python",
          why: "seaborn, the go-to library for statistical charts.",
          papers: ["W3128261063"],
        },
      ],
    },
    {
      title: "Chart design",
      concepts: [
        {
          id: "color",
          title: "Color",
          why: "Pick color maps that are honest and readable by colorblind viewers.",
          papers: ["W2573800174", "W4399612697"],
        },
        {
          id: "survey-data",
          title: "Survey data",
          why: "The right chart for agree-to-disagree answers.",
          papers: ["W1762789331"],
        },
        {
          id: "uncertainty",
          title: "Uncertainty",
          why: "Show how sure you are, not just the average.",
          papers: ["W4213165903"],
        },
        {
          id: "dashboards",
          title: "Dashboards",
          why: "Patterns for dashboards people can actually use.",
          papers: ["W4297094534"],
        },
        {
          id: "storytelling",
          title: "Storytelling",
          why: "Lead readers through data with a narrative.",
          papers: ["W1983425941"],
        },
      ],
    },
    {
      title: "Complex data",
      concepts: [
        {
          id: "hierarchies",
          title: "Hierarchies",
          why: "Treemaps fit nested data, like folders, into a rectangle.",
          papers: ["W395227168"],
        },
        {
          id: "many-dimensions",
          title: "Many dimensions",
          why: "Parallel coordinates show many variables at once.",
          papers: ["W2221590122"],
        },
        {
          id: "graphs",
          title: "Graphs",
          why: "Make networks of connections readable instead of a hairball.",
          papers: ["W2107139603", "W2138488235"],
        },
      ],
    },
    {
      title: "How analysts work",
      concepts: [
        {
          id: "exploring-data",
          title: "Exploring data",
          why: "What exploratory analysis really looks like day to day.",
          papers: ["W2986595342"],
        },
        {
          id: "in-practice",
          title: "In practice",
          why: "Interviews with professional analysts about how they explore data.",
          papers: ["W2904955348"],
        },
      ],
    },
  ],
};
