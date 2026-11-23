import type { SkillTree } from "./types";

export const machineLearningEngineer: SkillTree = {
  id: "machine-learning-engineer",
  title: "Machine Learning Engineer",
  summary: "Train, tune and shrink models, from classic ML to the deep networks behind modern AI.",
  branches: [
    {
      title: "Classic ML",
      concepts: [
        {
          id: "scikit-learn",
          title: "Scikit-learn",
          why: "The standard toolkit for everyday machine learning in Python.",
          papers: ["W2101234009"],
        },
        {
          id: "gradient-boosting",
          title: "Gradient boosting",
          why: "Still the model to beat on tables of data, from spreadsheets to logs.",
          papers: ["W2768348081"],
        },
      ],
    },
    {
      title: "Neural network basics",
      concepts: [
        {
          id: "convolutional-networks",
          title: "Convolutional networks",
          why: "How a network learns to see, starting with handwritten digits.",
          papers: ["W2112796928"],
        },
        {
          id: "deep-cnns",
          title: "Deep CNNs",
          why: "The 2012 result that started the deep learning boom.",
          papers: ["W2163605009"],
        },
        {
          id: "residual-networks",
          title: "Residual networks",
          why: "Skip connections made very deep networks trainable, and they're in almost every model since.",
          papers: ["W2194775991"],
        },
      ],
    },
    {
      title: "Training deep networks",
      concepts: [
        {
          id: "optimizers",
          title: "Optimizers",
          why: "Adam is the default way networks learn from their mistakes.",
          papers: ["W2964121744"],
        },
        {
          id: "initialization",
          title: "Initialization",
          why: "Starting weights decide whether a deep network trains at all.",
          papers: ["W1677182931"],
        },
        {
          id: "normalization",
          title: "Normalization",
          why: "Keeps training stable and fast, in CNNs and transformers alike.",
          papers: ["W1836465849", "W3037932933"],
        },
        {
          id: "mixed-precision",
          title: "Mixed precision",
          why: "Trains with half the memory by using smaller numbers where it's safe.",
          papers: ["W2763421725"],
        },
      ],
    },
    {
      title: "Learning from little data",
      concepts: [
        {
          id: "transfer-learning",
          title: "Transfer learning",
          why: "Reuse what a big model already learned instead of starting from scratch.",
          papers: ["W2149933564"],
        },
        {
          id: "domain-adaptation",
          title: "Domain adaptation",
          why: "Keep a model working when real data looks different from training data.",
          papers: ["W2758609995"],
        },
        {
          id: "few-shot-learning",
          title: "Few-shot learning",
          why: "Learn a new class from just a handful of examples.",
          papers: ["W2601450892", "W2604763608"],
        },
      ],
    },
    {
      title: "Small, fast models",
      concepts: [
        {
          id: "distillation",
          title: "Distillation",
          why: "Teach a small model to copy a big one.",
          papers: ["W1821462560"],
        },
        {
          id: "compression",
          title: "Compression",
          why: "Prune and quantize a trained model until it fits on a phone.",
          papers: ["W2119144962"],
        },
        {
          id: "mobile-architectures",
          title: "Mobile architectures",
          why: "Networks designed from the start to run fast on small devices.",
          papers: ["W2612445135", "W3145444543"],
        },
      ],
    },
  ],
};
