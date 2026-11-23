# Skill trees: draft roles

Draft for roadmap step 17 (Goals). Each role is a small tree:

- **Branches** are areas of the role.
- **Numbered concepts** inside a branch are in prerequisite order: each one unlocks the next.
- **Requires** names another role's branch to finish first.

Every anchor paper below was checked against the library by title on 2026-11-14, after the rebalance that swapped 10,000 AI papers for papers in Theory, Information Systems, HCI and Graphics. That rebalance added four roles (Data Engineer, Game Developer, Data Visualization Engineer, Health Tech Developer), split Graphics & XR in two, and moved HCI and Algorithms & Theory up from Thin.

**Topics** lists the library's own topic names for each role. They can fill extra papers into a concept once the anchor is read.

**Coverage**, for each role:

- **Strong:** almost every concept has a landmark paper.
- **Solid:** good anchors, with a few classics missing.
- **Thin:** usable, but leans on surveys.

| Area | Roles |
|---|---|
| AI and machine learning | 1–13 |
| Systems and software | 14–20 |
| Graphics, design and interaction | 21–25 |
| Other fields | 26–31 |

---

## AI and machine learning

### 1. Machine Learning Engineer — Strong
Topics: Machine Learning and Data Classification, Neural Networks and Applications, Stochastic Gradient Optimization Techniques, Domain Adaptation and Few-Shot Learning

**Classic ML**
1. Scikit-learn: *Scikit-learn: Machine Learning in Python* (2012)
2. Gradient boosting: *LightGBM: A Highly Efficient Gradient Boosting Decision Tree* (2017)

**Neural network basics**
1. Convolutional networks: *Gradient-based learning applied to document recognition* (1998)
2. Deep CNNs: *ImageNet classification with deep convolutional neural networks* (2017)
3. Residual networks: *Deep Residual Learning for Image Recognition* (2016)

**Training deep networks**
1. Optimizers: *Adam: A Method for Stochastic Optimization* (2015)
2. Initialization: *Delving Deep into Rectifiers* (2015)
3. Normalization: *Batch Normalization: Accelerating Deep Network Training…* (2015), *Layer Normalization* (2016)
4. Mixed precision: *Mixed Precision Training* (2017)

**Learning from little data**
1. Transfer learning: *How transferable are features in deep neural networks?* (2014)
2. Domain adaptation: *Domain-Adversarial Training of Neural Networks* (2015)
3. Few-shot learning: *Prototypical Networks for Few-shot Learning* (2017), *Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks* (2017)

**Small, fast models**
1. Distillation: *Distilling the Knowledge in a Neural Network* (2015)
2. Compression: *Deep Compression* (2015)
3. Mobile architectures: *MobileNets* (2017), *EfficientNetV2* (2021)

### 2. NLP / LLM Engineer — Strong
Requires: Machine Learning Engineer → Neural network basics
Topics: Natural Language Processing Techniques, Topic Modeling, Sentiment Analysis and Opinion Mining

**Word meaning**
1. Word vectors: *Efficient Estimation of Word Representations in Vector Space* (2013)
2. Phrases: *Distributed Representations of Words and Phrases and their Compositionality* (2013)
3. Words in context: *Deep Contextualized Word Representations* (2018)

**Transformers**
1. Seq2seq: *Sequence to Sequence Learning with Neural Networks* (2014)
2. Attention: *Neural Machine Translation by Jointly Learning to Align and Translate* (2014)
3. The Transformer: *Attention Is All You Need*
4. Pretraining: *BERT: Pre-training of Deep Bidirectional Transformers…* (2018), *Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer* (2019)
5. Large language models: *Language Models are Few-Shot Learners* (2020)
6. Scaling: *Scaling Laws for Neural Language Models* (2020)

**Making models helpful**
1. Instruction tuning: *Scaling Instruction-Finetuned Language Models* (2022)
2. RLHF: *Training language models to follow instructions with human feedback* (2022)
3. Preference optimization: *Direct Preference Optimization* (2023)
4. AI feedback: *Constitutional AI: Harmlessness from AI Feedback* (2022)

**Cheap fine-tuning**
1. Prefix-tuning: *Prefix-Tuning: Optimizing Continuous Prompts for Generation* (2021)
2. LoRA: *LoRA: Low-Rank Adaptation of Large Language Models* (2021)
3. QLoRA: *QLoRA: Efficient Finetuning of Quantized LLMs* (2023)

### 3. AI Application Developer — Strong
Requires: NLP / LLM Engineer → Transformers (steps 1–5)
Topics: Multimodal Machine Learning Applications, Speech and dialogue systems

**Prompting and reasoning**
1. Chain of thought: *Chain-Of-Thought Prompting Elicits Reasoning in Large Language Models* (2022)
2. Self-consistency: *Self-Consistency Improves Chain of Thought Reasoning…* (2022)
3. Search over thoughts: *Tree of Thoughts* (2023)

**Retrieval (RAG)**
1. Sentence embeddings: *Sentence-BERT* (2019)
2. Dense retrieval: *Dense Passage Retrieval for Open-Domain Question Answering* (2020)
3. RAG: *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks* (2020)
4. Long contexts: *Lost in the Middle: How Language Models Use Long Contexts* (2024)

**Agents and tools**
1. Reason and act: *ReAct: Synergizing Reasoning and Acting in Language Models* (2022)
2. Tool use: *Toolformer* (2023)
3. Self-correction: *Reflexion* (2023)
4. Overview: *A survey on large language model based autonomous agents* (2024)

**Evaluation and safety**
1. Benchmarks: *Measuring Massive Multitask Language Understanding* (2020), *Holistic Evaluation of Language Models* (2022)
2. LLM judges: *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena* (2023)
3. Attacks: *GPTFUZZER: Red Teaming LLMs with Auto-Generated Jailbreak Prompts* (2023), *Benchmarking and Defending against Indirect Prompt Injection Attacks…* (2025)

### 4. Computer Vision Engineer — Strong
Requires: Machine Learning Engineer → Neural network basics
Topics: Advanced Neural Network Applications, Advanced Image and Video Retrieval Techniques, Human Pose and Action Recognition, Video Surveillance and Tracking Methods

**Classifying images**
1. Deeper networks: *Very Deep Convolutional Networks for Large-Scale Image Recognition* (2014), *Going Deeper with Convolutions* (2014)
2. Dense connections: *Densely Connected Convolutional Networks* (2017)
3. Attention in CNNs: *Squeeze-and-Excitation Networks* (2019)
4. Vision transformers: *An Image is Worth 16x16 Words* (2020)

**Finding objects**
1. Region proposals: *Rich Feature Hierarchies for Accurate Object Detection…* (2014)
2. Fast R-CNN: *Fast R-CNN* (2015)
3. Faster R-CNN: *Faster R-CNN: Towards Real-Time Object Detection…* (2016)
4. One-stage detection: *You Only Look Once: Unified, Real-Time Object Detection* (2016)
5. Multi-scale features: *Feature Pyramid Networks for Object Detection* (2016)

**Segmentation**
1. Fully convolutional networks: *Fully Convolutional Networks for Semantic Segmentation* (2016)
2. U-Net: *U-Net: Convolutional Networks for Biomedical Image Segmentation* (2015)
3. DeepLab: *DeepLab: Semantic Image Segmentation…* (2017)
4. Instance segmentation: *Mask R-CNN* (2017)

**Learning without labels**
1. Contrastive learning: *A Simple Framework for Contrastive Learning of Visual Representations* (2020)
2. Momentum contrast: *Momentum Contrast for Unsupervised Visual Representation Learning* (2020)
3. Masked autoencoders: *Masked Autoencoders Are Scalable Vision Learners* (2022)
4. Images and text: *Learning Transferable Visual Models From Natural Language Supervision* (2021)

**People and video**
1. Pose estimation: *Realtime Multi-Person 2D Pose Estimation using Part Affinity Fields* (2016)
2. Action recognition: *Two-Stream Convolutional Networks for Action Recognition in Videos* (2014), *Learning Spatiotemporal Features with 3D Convolutional Networks* (2015)
3. Tracking: *Simple online and realtime tracking* (2016), *…with a Deep Association Metric* (2017)
4. Face recognition: *ArcFace* (2019)

### 5. Generative AI Engineer — Strong
Requires: Computer Vision Engineer → Classifying images
Topics: Generative Adversarial Networks and Image Synthesis, Digital Media Forensic Detection

**Autoencoders**
1. VAE: *Auto-Encoding Variational Bayes* (2013)
2. Discrete codes: *Neural Discrete Representation Learning* (2017)

**GANs**
1. GAN: *Generative Adversarial Networks* (2014)
2. DCGAN: *Unsupervised Representation Learning with Deep Convolutional Generative Adversarial Networks* (2015)
3. Image translation: *Image-to-Image Translation with Conditional Adversarial Networks* (2017), *Unpaired Image-to-Image Translation Using Cycle-Consistent…* (2017)
4. High-resolution GANs: *Progressive Growing of GANs* (2017), *A Style-Based Generator Architecture for Generative Adversarial Networks* (2019)

**Diffusion**
1. Denoising diffusion: *Denoising Diffusion Probabilistic Models* (2020)
2. Score-based view: *Score-Based Generative Modeling through Stochastic Differential Equations* (2020)
3. Diffusion overtakes GANs: *Diffusion Models Beat GANs on Image Synthesis* (2021)
4. Guidance: *Classifier-Free Diffusion Guidance* (2022)
5. Latent diffusion: *High-Resolution Image Synthesis with Latent Diffusion Models* (2021)
6. Control: *Adding Conditional Control to Text-to-Image Diffusion Models* (2023)

**Text to image**
1. DALL·E: *Zero-Shot Text-to-Image Generation* (2021)
2. DALL·E 2: *Hierarchical Text-Conditional Image Generation with CLIP Latents* (2022)
3. Imagen: *Photorealistic Text-to-Image Diffusion Models with Deep Language Understanding* (2022)
4. Deepfakes: *Deepfake Generation and Detection: A Benchmark and Survey* (2026)

### 6. ML Infrastructure / MLOps Engineer — Strong
Requires: Machine Learning Engineer → Training deep networks
Topics: Parallel Computing and Optimization Techniques, Cloud Computing and Resource Management

**Frameworks**
1. TensorFlow: *TensorFlow: A system for large-scale machine learning* (2016)
2. Ray: *Ray: A Distributed Framework for Emerging AI Applications* (2017)
3. Compilers: *TVM: An Automated End-to-End Optimizing Compiler for Deep Learning* (2018)

**Distributed training**
1. Parameter servers: *Scaling Distributed Machine Learning with the Parameter Server* (2014)
2. Data parallel: *Horovod* (2018)
3. Pipeline parallel: *GPipe* (2018)
4. Model parallel: *Megatron-LM* (2019)
5. At scale: *Using DeepSpeed and Megatron to Train Megatron-Turing NLG 530B* (2022)

**Fast inference**
1. Model serving: *Clipper: A Low-Latency Online Prediction Serving System* (2016)
2. Quantization: *Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference* (2018)
3. LLM quantization: *LLM.int8()* (2022), *GPTQ* (2022)
4. Attention kernels: *FlashAttention* (2022)
5. LLM serving: *Efficient Memory Management for Large Language Model Serving with PagedAttention* (2023), *Fast Inference from Transformers via Speculative Decoding* (2022)

**Running in production**
1. Pipelines: *TFX* (2017)
2. Deployment problems: *Challenges in Deploying Machine Learning: A Survey of Case Studies* (2022)
3. Drift: *Learning under Concept Drift: A Review* (2018)
4. MLOps: *MLOps: A Taxonomy and a Methodology* (2022)

### 7. Data Scientist — Solid
Topics: Data Mining Algorithms and Applications, Time Series Analysis and Forecasting, Anomaly Detection Techniques and Applications

**Python toolkit**
1. NumPy: *Array programming with NumPy* (2020)
2. pandas: *Data Structures for Statistical Computing in Python* (2010)
3. SciPy: *SciPy 1.0* (2020)
4. Plotting: *seaborn: statistical data visualization* (2021)
5. Modeling: *Scikit-learn: Machine Learning in Python* (2012)

**Finding structure**
1. k-means: *Least squares quantization in PCM* (1982)
2. EM algorithm: *Maximum Likelihood from Incomplete Data Via the EM Algorithm* (1977)
3. Visualizing high dimensions: *An Analysis of the t-SNE Algorithm for Data Visualization* (2018), *UMAP* (2018)

**Experiments and causality**
1. A/B testing: *Controlled experiments on the web: survey and practical guide* (2008)
2. Validation: *Cross-validation pitfalls when selecting and assessing regression and classification models* (2014)
3. Causal inference: *Interventions and Causal Inference* (2007)

**Forecasting and anomalies**
1. Gaussian processes: *Gaussian Processes for Machine Learning* (2005)
2. Transformers for forecasting: *Informer* (2021), *Temporal Fusion Transformers…* (2021)
3. A skeptical take: *Are Transformers Effective for Time Series Forecasting?* (2023)
4. Anomaly detection: *Deep Learning for Anomaly Detection: A Survey* (2019)

### 8. Reinforcement Learning Researcher — Solid
Requires: Machine Learning Engineer → Neural network basics
Topics: Reinforcement Learning in Robotics, Advanced Bandit Algorithms Research, Adaptive Dynamic Programming Control

**Foundations**
1. The textbook: *Reinforcement Learning: An Introduction* (2005)
2. Q-learning: *Double Q-learning* (2010)
3. Bandits: *A contextual-bandit approach to personalized news article recommendation* (2010)

**Deep value methods**
1. DQN: *Playing Atari with Deep Reinforcement Learning* (2013)
2. Double DQN: *Deep Reinforcement Learning with Double Q-Learning* (2016)

**Policy methods**
1. Trust regions: *Trust Region Policy Optimization* (2015)
2. PPO: *Proximal Policy Optimization Algorithms* (2017)
3. Continuous control: *Continuous control with deep reinforcement learning* (2015)
4. Asynchronous training: *Asynchronous Methods for Deep Reinforcement Learning* (2016)
5. Max-entropy RL: *Soft Actor-Critic* (2018)

**Beyond one agent**
1. Multi-agent: *Multi-Agent Actor-Critic for Mixed Cooperative-Competitive Environments* (2017)
2. Human feedback: *Deep reinforcement learning from human preferences* (2017)
3. RL as sequence modeling: *Decision Transformer* (2021)

### 9. Speech & Audio Engineer — Solid
Requires: Machine Learning Engineer → Neural network basics
Topics: Speech Recognition and Synthesis, Speech and Audio Processing, Music and Audio Processing

**Speech recognition**
1. End to end: *Deep Speech: Scaling up end-to-end speech recognition* (2014)
2. Attention: *Listen, Attend and Spell* (2015)
3. At scale: *Deep Speech 2* (2015)
4. Self-supervised: *wav2vec 2.0* (2020), *HuBERT* (2021)
5. Whisper: *Robust Speech Recognition via Large-Scale Weak Supervision* (2022)

**Speech synthesis**
1. Raw audio: *WaveNet: A Generative Model for Raw Audio* (2016)
2. Text to speech: *Tacotron* (2017)
3. Faster synthesis: *Parallel WaveNet* (2017)
4. Diffusion TTS: *Diff-TTS* (2021)

**Understanding voices**
1. Speaker verification: *Generalized End-to-End Loss for Speaker Verification* (2018), *VoxCeleb* (2019)
2. Cleaning audio: *Real Time Speech Enhancement in the Waveform Domain* (2020)
3. Emotion: *Emotion Recognition from Speech Using wav2vec 2.0 Embeddings* (2021)

### 10. Recommender & Search Engineer — Solid
Topics: Recommender Systems and Techniques, Information Retrieval and Search Behavior

**Recommenders**
1. Implicit feedback: *BPR: Bayesian Personalized Ranking from Implicit Feedback* (2012)
2. Neural CF: *Neural Collaborative Filtering* (2017)
3. Industry systems: *Wide & Deep Learning for Recommender Systems* (2016), *Deep Neural Networks for YouTube Recommendations* (2016)
4. Sessions: *Session-based Recommendations with Recurrent Neural Networks* (2015)
5. Sequential: *Self-Attentive Sequential Recommendation* (2018), *BERT4Rec* (2019)
6. Graphs: *LightGCN* (2020)

**Search**
1. Link analysis: *Deeper Inside PageRank* (2004), *Authoritative sources in a hyperlinked environment* (1999)
2. Learning to rank: *A Short Introduction to Learning to Rank* (2011)
3. Dense retrieval: *Dense Passage Retrieval for Open-Domain Question Answering* (2020)
4. Late interaction: *ColBERT* (2020), *ColBERTv2* (2022)

**Vector search**
1. Approximate nearest neighbors: *Fast approximate nearest neighbors with automatic algorithm configuration* (2009)
2. GPU search: *Billion-Scale Similarity Search with GPUs* (2019)
3. Graph indexes: *Fast approximate nearest neighbor search with the navigating spreading-out graph* (2019)
4. Vector databases: *A Comprehensive Survey on Vector Database* (2023)

### 11. Graph ML Engineer — Solid (small)
Requires: Machine Learning Engineer → Neural network basics
Topics: Advanced Graph Neural Networks, Complex Network Analysis Techniques

**Graph neural networks**
1. The original GNN: *The Graph Neural Network Model* (2008)
2. GCN: *Semi-Supervised Classification with Graph Convolutional Networks* (2016)
3. Sampling: *Inductive Representation Learning on Large Graphs* (2017)
4. Attention: *Graph Attention Networks* (2017)
5. Overview: *A Comprehensive Survey on Graph Neural Networks* (2020)

**Embeddings**
1. Node embeddings: *node2vec* (2016)
2. Knowledge graphs: *Translating Embeddings for Modeling Multi-relational Data* (2013)

### 12. Medical AI Engineer — Solid
Requires: Computer Vision Engineer → Segmentation (steps 1–2)
Topics: Medical Image Segmentation Techniques, AI in cancer detection, Radiomics and Machine Learning in Medical Imaging, Brain Tumor Detection and Classification

**Segmenting scans**
1. 3D segmentation: *V-Net* (2016)
2. Attention: *Attention U-Net: Learning Where to Look for the Pancreas* (2018)
3. Skip connections: *UNet++* (2019)
4. Self-configuring: *nnU-Net* (2018)
5. Transformers: *TransUNet* (2021)
6. Foundation models: *Segment anything in medical images* (2024)

**Clinical use**
1. Benchmarks: *The Multimodal Brain Tumor Image Segmentation Benchmark (BRATS)* (2014)
2. Screening: *Use of artificial intelligence for image analysis in breast cancer screening programmes* (2021)
3. Trust: *Should AI models be explainable to clinicians?* (2024)
4. Bias: *Dissecting racial bias in an algorithm used to manage the health of populations* (2019)

### 13. Trustworthy AI Engineer (safety, privacy, fairness) — Strong
Requires: Machine Learning Engineer → Neural network basics
Topics: Adversarial Robustness in Machine Learning, Privacy-Preserving Technologies in Data, Explainable Artificial Intelligence (XAI), Ethics and Social Impacts of AI

**Adversarial attacks**
1. Adversarial examples: *Intriguing properties of neural networks* (2013)
2. Fast attacks: *Explaining and Harnessing Adversarial Examples* (2014)
3. Strong attacks: *Towards Evaluating the Robustness of Neural Networks* (2017)
4. Robust training: *Towards Deep Learning Models Resistant to Adversarial Attacks* (2017)
5. Backdoors: *Blind Backdoors in Deep Learning Models* (2020)

**Privacy**
1. Anonymity: *k-ANONYMITY: A MODEL FOR PROTECTING PRIVACY* (2002)
2. Differential privacy: *Calibrating Noise to Sensitivity in Private Data Analysis*, *The Algorithmic Foundations of Differential Privacy* (2014)
3. Private deep learning: *Deep Learning with Differential Privacy* (2016)
4. Federated learning: *Communication-Efficient Learning of Deep Networks from Decentralized Data* (2016)
5. Attacks on privacy: *Membership Inference Attacks on Machine Learning: A Survey* (2022)

**Explainability**
1. Local explanations: *"Why Should I Trust You?": Explaining the Predictions of Any Classifier* (2016)
2. SHAP: *A Unified Approach to Interpreting Model Predictions* (2017)
3. Gradients: *Axiomatic Attribution for Deep Networks* (2017), *Learning Important Features Through Propagating Activation Differences* (2017)
4. Rigor: *Towards A Rigorous Science of Interpretable Machine Learning* (2017)

**Fairness and responsibility**
1. Individual fairness: *Fairness Through Awareness* (2011)
2. Group fairness: *Equality of Opportunity in Supervised Learning* (2016)
3. Overview: *A Survey on Bias and Fairness in Machine Learning* (2021)
4. Documentation: *Model Cards for Model Reporting* (2019)
5. Risks of LLMs: *On the Dangers of Stochastic Parrots* (2021), *Concrete Problems in AI Safety* (2016)

---

## Systems and software

### 14. Backend & Distributed Systems Engineer — Solid
Topics: Distributed systems and fault tolerance, Distributed and Parallel Computing Systems, Cloud Computing and Resource Management

**Distributed systems theory**
1. Time and ordering: *Time, clocks, and the ordering of events in a distributed system* (1978)
2. Snapshots: *Distributed snapshots* (1985)
3. Correctness: *Linearizability: a correctness condition for concurrent objects* (1990)
4. Replication: *Implementing fault-tolerant services using the state machine approach: a tutorial* (1990)
5. What's impossible: *Impossibility of distributed consensus with one faulty process* (1985)
6. Paxos: *The part-time parliament* (1998)
7. Byzantine faults: *The Byzantine Generals Problem* (1982), *HotStuff: BFT Consensus in the Lens of Blockchain* (2018)

**Google-scale systems**
1. MapReduce: *MapReduce* (2008)
2. Global databases: *Spanner* (2013)
3. Cluster management: *Large-scale cluster management at Google with Borg* (2015)
4. Containers: *Borg, Omega, and Kubernetes* (2016)

**Modern backends**
1. Microservices: *Microservices* (2014, an interview with James Lewis)
2. Serverless: *What serverless computing is and should become* (2021)
3. Load balancing: *Load balancing in cloud computing: A big picture* (2018)
4. Gossip: *Gossip-based aggregation in large dynamic networks* (2005)

### 15. Database Engineer — Solid
Topics: Advanced Database Systems and Queries, Data Management and Algorithms, Advanced Data Storage Technologies

**Relational foundations**
1. The relational model: *A relational model of data for large shared data banks* (1970)
2. A real system: *The design of POSTGRES* (1986)
3. Consistency: *The notions of consistency and predicate locks in a database system* (1976)
4. Isolation levels: *A critique of ANSI SQL isolation levels* (1995)
5. In-memory concurrency: *High-performance concurrency control mechanisms for main-memory databases* (2011)

**Running queries**
1. Iterator model: *Encapsulation of parallelism in the Volcano query processing system* (1990)
2. Column execution: *MonetDB/X100: Hyper-Pipelining Query Execution* (2005)
3. Embedded analytics: *DuckDB* (2019)
4. Learned optimizers: *Bao: Making Learned Query Optimization Practical* (2021)

**Storage and indexes**
1. B-trees: *Efficient locking for concurrent operations on B-trees* (1981)
2. Key-value stores: *RocksDB: Evolution of Development Priorities in a Key-value Store…* (2021)
3. Learned indexes: *The Case for Learned Index Structures* (2018)
4. Vector databases: *A Comprehensive Survey on Vector Database* (2023)

**Beyond SQL**
1. NoSQL: *Data management in cloud environments: NoSQL and NewSQL data stores* (2013)
2. Graph databases: *Foundations of Modern Query Languages for Graph Databases* (2017)
3. Plain English to SQL: *RAT-SQL* (2020)

### 16. Data Engineer — Solid (new)
Requires: Database Engineer → Relational foundations (steps 1–2)
Topics: Data Management and Algorithms, Scientific Computing and Data Management, Research Data Management Practices, Semantic Web and Ontologies

**Warehouses and analytics**
1. OLAP: *OLAP, relational, and multidimensional database systems* (1996)
2. Materialized views: *Materialized views and data warehouses* (1998)
3. ETL: *Optimizing ETL Processes in Data Warehouses* (2005)
4. Cloud warehouses: *Amazon Redshift and the Case for Simpler Data Warehouses* (2015)

**Big data processing**
1. MapReduce: *MapReduce* (2008)
2. The Hadoop stack: *Hadoop, MapReduce and HDFS: A Developers Perspective* (2015)
3. ML on clusters: *MLlib: Machine Learning in Apache Spark* (2015)
4. Streaming: *Apache flink: Stream and batch processing in a single engine* (2015)
5. Overview: *A survey on the evolution of stream processing systems* (2023)

**Data lakes and integration**
1. Data lakes: *Data Lakes: A Survey of Functions and Systems* (2023)
2. Finding datasets: *Dataset Discovery in Data Lakes* (2020)
3. Matching schemas: *Generic Schema Matching with Cupid* (2001)
4. Matching records: *(Almost) all of entity resolution* (2022)

**Trustworthy data**
1. Data quality: *Data quality in context* (1997), *The costs of poor data quality* (2011)
2. Provenance: *Provenance semirings* (2007)
3. Sharing data: *The FAIR Guiding Principles for scientific data management and stewardship* (2016)
4. Linked data: *Cool URIs for the semantic web* (2007), *Knowledge Graphs* (2021)

### 17. Web Developer — Solid
This is your sketch with the HTML/CSS/JS branch replaced: the library has no papers on those basics, so the first branch covers how the web works instead.
Topics: Mobile and Web Applications, Caching and Content Delivery, Web Data Mining and Analysis

**How the web works**
1. The internet's design: *The design philosophy of the DARPA internet protocols* (1988)
2. HTTP/2: *Hypertext Transfer Protocol Version 2 (HTTP/2)* (2015)
3. HTTP/3: *The QUIC Transport Protocol* (2017)
4. HTTPS: *The Transport Layer Security (TLS) Protocol Version 1.3*
5. WebAssembly: *Bringing the web up to speed with WebAssembly* (2017)
6. Dependencies: *Thou Shalt Not Depend on Me: Analysing the Use of Outdated JavaScript Libraries on the Web* (2017)

**APIs and backend**
1. Microservices: *Microservices* (2014, an interview with James Lewis)
2. Serverless: *What serverless computing is and should become* (2021)
3. Scaling: *Auto-Scaling Web Applications in Clouds* (2018)
4. Testing: *Invariant-Based Automatic Testing of Modern Web Applications* (2011)

**Databases**
1. The relational model: *A relational model of data for large shared data banks* (1970)
2. Isolation levels: *A critique of ANSI SQL isolation levels* (1995)
3. NoSQL: *Data management in cloud environments: NoSQL and NewSQL data stores* (2013)

**Speed and security**
1. Caching: *A survey of web caching schemes for the Internet* (1999)
2. CDNs: *The Akamai network* (2010)
3. SQL injection: *Using positive tainting and syntax-aware evaluation to counter SQL injection attacks* (2006)
4. XSS: *Automatic creation of SQL Injection and cross-site scripting attacks* (2009)

**AI tools**
1. Code models: *Evaluating Large Language Models Trained on Code* (2021)
2. Copilot: *Assessing the quality of GitHub copilot's code generation* (2022)
3. Checking AI code: *Is Your Code Generated by ChatGPT Really Correct?* (2023)
4. Productivity: *Measuring GitHub Copilot's Impact on Productivity* (2024)

### 18. Software Engineer — Solid
Topics: Software Engineering Research, Software Testing and Debugging Techniques, Software Engineering Techniques and Practices

**Design**
1. Structured code: *Go to statement considered harmful* (1968)
2. Modules: *On the criteria to be used in decomposing systems into modules* (1972)
3. Technical debt: *A systematic mapping study on technical debt and its management* (2014)

**Testing**
1. Fuzz testing: *An empirical study of the reliability of UNIX utilities* (1990)
2. Property-based testing: *QuickCheck* (2000)
3. Mutation testing: *PIT: a practical mutation testing tool for Java* (2016)

**Team process**
1. Code review: *Expectations, outcomes, and challenges of modern code review* (2013)
2. CI: *Usage, costs, and benefits of continuous integration in open-source projects* (2016)
3. CI/CD: *Continuous Integration, Delivery and Deployment: A Systematic Review* (2017)
4. DevOps: *A Survey of DevOps Concepts and Challenges* (2019)

**AI-assisted coding**
1. Code models: *Evaluating Large Language Models Trained on Code* (2021), *CodeBERT* (2020)
2. Open code LLMs: *Code Llama* (2023)
3. Evaluating generated code: *Is Your Code Generated by ChatGPT Really Correct?* (2023)
4. Fixing bugs: *Copiloting the Copilots: Fusing LLMs with Completion Engines for Automated Program Repair* (2023)
5. Real issues: *SWE-bench Multimodal* (2024)
6. Overview: *Large Language Models for Software Engineering: Survey and Open Problems* (2023)

### 19. Security Engineer — Strong
Topics: Network Security and Intrusion Detection, Cryptography and Data Security, Security and Verification in Computing, Advanced Malware Detection Techniques

**Cryptography**
1. Public keys: *A method for obtaining digital signatures and public-key cryptosystems* (1978)
2. TLS: *The Transport Layer Security (TLS) Protocol Version 1.3*
3. Computing on encrypted data: *Efficient Fully Homomorphic Encryption from (Standard) LWE* (2014)
4. After quantum computers: *Post-Quantum Key Exchange for the TLS Protocol from the Ring Learning with Errors Problem* (2015)

**Systems security**
1. Buffer overflows: *Statically detecting likely buffer overflow vulnerabilities* (2001)
2. Control-flow integrity: *Control-Flow Integrity* (2017), *Out of Control: Overcoming Control-Flow Integrity* (2014)
3. Cache attacks: *Last-Level Cache Side-Channel Attacks are Practical* (2015)
4. CPU attacks: *Meltdown* (2018), *Spectre Attacks: Exploiting Speculative Execution* (2019)

**Finding bugs**
1. Fuzzing: *An empirical study of the reliability of UNIX utilities* (1990)
2. Whitebox fuzzing: *SAGE: Whitebox Fuzzing for Security Testing* (2012)
3. Smarter fuzzing: *Angora: Efficient Fuzzing by Principled Search* (2018)

**Defending networks**
1. Intrusion detection: *Kitsune: An Ensemble of Autoencoders for Online Network Intrusion Detection* (2018)
2. Dataset pitfalls: *Troubleshooting an Intrusion Detection Dataset: the CICIDS2017 Case Study* (2021)
3. Phishing: *PhishStorm: Detecting Phishing With Streaming Analytics* (2014)
4. Malware: *Yes, Machine Learning Can Be More Secure! A Case Study on Android Malware Detection* (2017)
5. Web certificates: *Analysis of the HTTPS certificate ecosystem* (2013)

### 20. Programming Languages & Verification — Solid
Requires: Algorithms & Theory → Automata and languages (for Compilers)
Topics: Logic, programming, and type systems, Formal Methods in Verification, Petri Nets in System Modeling

**Reasoning about programs**
1. Hoare logic: *An axiomatic basis for computer programming* (1969)
2. Static analysis: *Abstract interpretation* (1996)
3. Separation logic: *Iris from the ground up* (2018)

**Compilers**
1. Lexing: *Derivatives of Regular Expressions* (1964)
2. Parsing: *An efficient context-free parsing algorithm* (1970)
3. Typed lambda calculus: *Lambda Calculi with Types* (1992)
4. Register allocation: *Register allocation & spilling via graph coloring* (1982)

**Concurrency**
1. CSP: *Communicating sequential processes* (1983)
2. Linearizability: *Linearizability: a correctness condition for concurrent objects* (1990)

**Model checking**
1. Model checking: *Model checking large software specifications* (1996)
2. Symbolic: *Sequential circuit verification using symbolic model checking* (1990)
3. SMT solvers: *Lazy Satisfiability Modulo Theories* (2007)

**Proof assistants**
1. Isabelle: *ISABELLE - THE NEXT 700 THEOREM PROVERS* (1988)
2. Coq: *The Coq Proof Assistant - Reference Manual* (1997)
3. Verified compiler: *Formal verification of a realistic compiler* (2009)
4. Verified kernel: *seL4: From General Purpose to a Proof of Information Flow Enforcement* (2013)
5. Rust: *RustBelt: securing the foundations of the Rust programming language* (2017)
6. AI provers: *DeepSeek-Prover-V2* (2025)

---

## Graphics, design and interaction

### 21. Graphics Engineer — Strong (split from Graphics & XR)
Topics: Computer Graphics and Visualization Techniques, 3D Shape Modeling and Analysis, Computational Geometry and Mesh Generation

**Rendering**
1. A textbook start: *Interactive Computer Graphics: A Top-Down Approach Using OpenGL* (1997)
2. Lighting: *An improved illumination model for shaded display* (1980)
3. Ray tracing: *Distributed ray tracing* (1984), *Ray tracing complex scenes* (1986)
4. The rendering equation: *The rendering equation* (1986)
5. Path tracing: *Gradient-domain path tracing* (2015), *Real-time neural radiance caching for path tracing* (2021)
6. Real time: *Real-Time Rendering* (2018)

**Geometry processing**
1. Surfaces from volumes: *Marching cubes* (1987)
2. Simplifying meshes: *Mesh optimization* (1993)
3. Smooth surfaces: *Subdivision surfaces in character animation* (1998)
4. Editing: *Poisson image editing* (2003), *Laplacian surface editing* (2004)
5. Spectral methods: *Laplacian Mesh Processing* (2005), *Spectral Geometry Processing with Manifold Harmonics* (2008)

**Neural 3D**
1. Shapes as functions: *DeepSDF* (2019)
2. NeRF: *NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis* (2020)
3. Fast NeRF: *Instant neural graphics primitives with a multiresolution hash encoding* (2022)
4. Gaussian splatting: *3D Gaussian Splatting for Real-Time Radiance Field Rendering* (2023)

**GPU programming**
1. GPUs: *GPU Computing* (2008)
2. CUDA: *Scalable Parallel Programming with CUDA* (2008)

### 22. Game Developer — Solid (new)
Requires: Graphics Engineer → Rendering (steps 1–2)
Topics: Human Motion and Animation, Artificial Intelligence in Games, Computer Graphics and Visualization Techniques

**Game engines**
1. Spatial data structures: *The Tree That Finds Itself: A Narrative Review of Spatial Data Structures in Game Development* (2026)
2. Scenes and assets: *The Stage and Its Wardrobe: A Narrative Review of Scene and Asset Management in Game Engines* (2026)
3. Physically based rendering: *Light as It Is: A Narrative Review of Physically Based Rendering…* (2026)
4. Shadows: *Real-time Soft Shadow Mapping by Backprojection* (2006)

**Physics**
1. Collisions: *Collision Detection and Response for Computer Animation* (1988)
2. Fast collisions: *Fast Continuous Collision Detection between Rigid Bodies* (2002)
3. Cloth: *Large steps in cloth simulation* (1998)
4. Fluids: *Stable fluids* (1999)

**Animation**
1. Skinning: *Skinning with dual quaternions* (2007)
2. Motion graphs: *Evaluating motion graphs for character animation* (2007)
3. Neural character control: *Phase-functioned neural networks for character control* (2017)
4. Learned physics skills: *DeepMimic* (2018)

**Procedural content**
1. Noise: *An image synthesizer* (1985), *A Survey of Procedural Noise Functions* (2010)
2. What it is: *What is procedural content generation?* (2011)
3. Search-based: *Search-Based Procedural Content Generation: A Taxonomy and Survey* (2011)
4. Machine-learned levels: *Super Mario as a String: Platformer Level Generation Via LSTMs* (2016), *Procedural Content Generation via Machine Learning (PCGML)* (2018)
5. Neural game engines: *Diffusion Models Are Real-Time Game Engines* (2024)

### 23. XR Developer (AR / VR) — Solid (split from Graphics & XR)
Requires: Graphics Engineer → Rendering (steps 1–2)
Topics: Virtual Reality Applications and Impacts, Augmented Reality Applications, Interactive and Immersive Displays

**AR and mixed reality**
1. AR basics: *A Survey of Augmented Reality* (1997)
2. Mixed reality: *Mixed reality: a model of mixed interaction* (2006)
3. Interaction: *Interactions in Augmented and Mixed Reality: An Overview* (2021)
4. Headsets: *Review of Microsoft HoloLens Applications over the Past Five Years* (2021)
5. Mobile AR: *A Survey on Mobile Augmented Reality With 5G Mobile Edge Computing* (2021)

**Presence and comfort**
1. Embodiment: *The Sense of Embodiment in Virtual Reality* (2012)
2. Measuring presence: *The Factor Structure of the Presence Questionnaire* (2005), *Avatar Embodiment. A Standardized Questionnaire* (2021)
3. Motion sickness: *Cybersickness is Not Simulator Sickness* (1997), *Simulator Sickness Questionnaire: Twenty Years Later* (2013)
4. Moving around: *VR locomotion* (2016), *15 Years of Research on Redirected Walking in Immersive Virtual Environments* (2018)

**Input and rendering**
1. Hands: *MediaPipe Hands: On-device Real-time Hand Tracking* (2020)
2. Eyes: *Eye tracking in virtual reality* (2019)
3. Pointing in 3D: *A Fitts' Law Study of Gaze-Hand Alignment for Selection in 3D User Interfaces* (2023)
4. Touch: *Pseudo-Haptic Weight* (2019)
5. Foveated rendering: *FoV-NeRF: Foveated Neural Radiance Fields for Virtual Reality* (2022)

### 24. HCI / UX Researcher — Solid (was Thin)
Topics: Usability and User Interface Design, Innovative Human-Technology Interaction, Gaze Tracking and Assistive Technology

**Big ideas**
1. Memex: *As we may think* (1996 reprint)
2. Augmentation: *A research center for augmenting human intellect* (1968)
3. Affordances: *Affordances: Clarifying and Evolving a Concept* (2000)

**Understanding users**
1. Contextual inquiry: *Using contextual inquiry to learn about your audiences* (1996)
2. Interviews: *Semi-structured interviewing for user-centered design* (1997)
3. Designing with users: *The Methodology of Participatory Design* (2005)
4. Values: *Twenty years of value sensitive design* (2018)

**Prototyping**
1. Paper prototypes: *Prototyping for tiny fingers* (1994)
2. Sketched interfaces: *SILK: sketching interfaces like krazy* (1996)
3. Faking the system: *Prototyping an intelligent agent through Wizard of Oz* (1993)
4. Sketching experiences: *Sketching user experiences* (2012)

**Evaluating designs**
1. Methods: *Usability testing vs. heuristic evaluation* (1992)
2. Measuring: *Measuring usability* (2000)
3. Think-aloud: *Thinking About Thinking Aloud…* (2004)
4. Pointing: *How does Fitts' law fit pointing and dragging?* (1990)
5. UX questionnaires: *Construction of a Benchmark for the User Experience Questionnaire (UEQ)* (2017)
6. Testing with children: *Guidelines for usability testing with children* (1997)

**Ethics and AI**
1. Accessibility: *Usability, user experience and accessibility: towards an integrative model* (2020)
2. Dark patterns: *Dark Patterns: Past, Present, and Future* (2020)
3. Explaining to users: *Trust building with explanation interfaces* (2006)
4. Working with AI: *Human-AI Collaboration in Data Science* (2019), *Bridging the Gulf of Envisioning* (2024)
5. Simulated people: *Social Simulacra* (2022), *Generative Agents: Interactive Simulacra of Human Behavior* (2023)

### 25. Data Visualization Engineer — Solid (new)
Topics: Data Visualization and Analytics, Computer Graphics and Visualization Techniques

**Foundations**
1. Encoding data: *Automating the design of graphical presentations of relational information* (1986)
2. Visual analytics: *Visual analytics* (2010)

**Grammars and tools**
1. From queries to charts: *Polaris* (2008)
2. Grammar of graphics: *Vega-Lite: A Grammar of Interactive Graphics* (2016)
3. Plotting in Python: *seaborn: statistical data visualization* (2021)

**Chart design**
1. Color: *Why We Use Bad Color Maps and What You Can Do About It* (2016), *viridis: Colorblind-Friendly Color Maps for R* (2015)
2. Survey data: *Design of Diverging Stacked Bar Charts for Likert Scales and Other Applications* (2014)
3. Uncertainty: *Uncertainty Visualization: Concepts, Methods, and Applications in Biological Data Visualization* (2022)
4. Dashboards: *Dashboard Design Patterns* (2022)
5. Storytelling: *Storytelling in Information Visualizations* (2015)

**Complex data**
1. Hierarchies: *Ordered treemap layouts* (2005)
2. Many dimensions: *State of the Art of Parallel Coordinates* (2012)
3. Graphs: *Task taxonomy for graph visualization* (2006), *Edge bundling in information visualization* (2013)

**How analysts work**
1. Exploring data: *Goals, Process, and Challenges of Exploratory Data Analysis: An Interview Study* (2019)
2. In practice: *Futzing and Moseying: Interviews with Professional Data Analysts on Exploration Practices* (2018)

---

## Other fields

### 26. Algorithms & Theory — Strong (was Thin)
Topics: Complexity and Algorithms in Graphs, Graph Theory and Algorithms, Advanced Graph Theory Research, semigroups and automata theory, Computational Geometry and Mesh Generation

**Algorithms**
1. FFT: *An Algorithm for the Machine Calculation of Complex Fourier Series* (1965)
2. Spanning trees: *Computing minimum spanning trees efficiently* (1972)
3. Planar graphs: *Efficient Planarity Testing* (1974)
4. Heaps: *Fibonacci heaps and their uses in improved network optimization algorithms* (1987)
5. Max flow: *A Fast and Simple Algorithm for the Maximum Flow Problem* (1989), *Maximum Flow and Minimum-Cost Flow in Almost-Linear Time* (2022)
6. Shortest paths: *Finding the k shortest paths* (2002)
7. Randomness: *Randomized Algorithms* (1995)
8. Strings: *A guided tour to approximate string matching* (2001)

**Complexity**
1. Information theory: *A Mathematical Theory of Communication* (1948)
2. NP-completeness: *The complexity of theorem-proving procedures* (1971), *Some simplified NP-complete problems* (1974)
3. Hard to approximate: *P-Complete Approximation Problems* (1976)
4. Communication: *Communication complexity* (1982)
5. Parameterized: *Parameterized Complexity* (2002)
6. Limits: *NP-complete problems and physical reality* (2005)

**Automata and languages**
1. Regular expressions: *Derivatives of Regular Expressions* (1964)
2. Context-free languages: *On Context-Free Languages* (1966)
3. Turing machines: *Small universal Turing machines* (1996)
4. Concurrency models: *Decidability questions for Petri nets* (1979)

**Optimization**
1. Simplex method: *The Product Form for the Inverse in the Simplex Method* (1954)
2. Duality: *Duality in nonlinear programming* (1962)
3. Faster LP: *A subexponential bound for linear programming* (1992)
4. Approximation: *Improved approximation algorithms for maximum cut and satisfiability problems using semidefinite programming* (1995)
5. Convex optimization: *Convex Optimization: Algorithms and Complexity* (2015)

**Geometry and graph theory**
1. Overview: *Computational geometry* (1998)
2. Convex hulls: *A New Convex Hull Algorithm for Planar Sets* (1977), *The quickhull algorithm for convex hulls* (1996)
3. Triangulation: *Improved incremental randomized Delaunay triangulation* (1998)
4. A famous proof: *Every planar map is four colorable* (1976)

**Algorithms for big data**
1. Counting: *A linear-time probabilistic counting algorithm for database applications* (1990)
2. Sublinear time: *Sublinear Time Algorithms* (2011)
3. Sketches: *Coresets and Sketches* (2016)
4. Randomized linear algebra: *Randomized algorithms for the low-rank approximation of matrices* (2007)

### 27. Quantum Computing Engineer — Strong
Topics: Quantum Computing Algorithms and Architecture, Quantum Information and Cryptography

**Foundations**
1. The textbook: *Quantum computation and quantum information* (2005)
2. Hands-on: *Quantum computing with Qiskit* (2024)

**Algorithms**
1. Search: *A fast quantum mechanical algorithm for database search* (1996)
2. Factoring: *Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms…* (1997)
3. Fourier transform: *Implementation of the Quantum Fourier Transform* (2001)
4. Linear systems: *Quantum Algorithm for Linear Systems of Equations* (2009)

**Today's hardware**
1. Noisy computers: *Quantum Computing in the NISQ era and beyond* (2018)
2. VQE: *A variational eigenvalue solver on a photonic quantum processor* (2014)
3. QAOA: *A Quantum Approximate Optimization Algorithm* (2014)
4. Supremacy: *Quantum supremacy using a programmable superconducting processor* (2019)
5. Training problems: *An initialization strategy for addressing barren plateaus…* (2019), *Training Variational Quantum Algorithms Is NP-Hard* (2021)

**Error correction**
1. Basics: *Quantum Error Correction for Communication* (1996)
2. Surface codes: *Surface codes: Towards practical large-scale quantum computation* (2012)
3. At scale: *A Game of Surface Codes* (2019)

### 28. Robotics & Self-Driving Engineer — Solid
Requires: Reinforcement Learning Researcher → Foundations (for Learning to act)
Topics: Robotics and Sensor-Based Localization, Robot Manipulation and Learning, Autonomous Vehicle Technology and Safety, Robotic Path Planning Algorithms

**Localization and mapping**
1. Localization: *Monte Carlo localization for mobile robots* (2003)
2. Visual SLAM: *ORB-SLAM: A Versatile and Accurate Monocular SLAM System* (2015)
3. Stereo and RGB-D: *ORB-SLAM2* (2017), *ORB-SLAM3* (2021)
4. Lidar: *F-LOAM: Fast LiDAR Odometry and Mapping* (2021)

**Seeing the road**
1. Datasets: *SemanticKITTI* (2019)
2. Point clouds: *VoxelNet* (2018)
3. Fast lidar detection: *PointPillars* (2019)
4. Fusing sensors: *Multi-view 3D Object Detection Network for Autonomous Driving* (2017)
5. Bird's-eye view: *BEVFormer v2* (2023)

**Learning to act**
1. Imitation: *A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning* (2010)
2. Vision to motion: *End-to-End Training of Deep Visuomotor Policies* (2015)
3. Simulation: *Domain randomization for transferring deep neural networks from simulation to the real world* (2017)
4. Sim to real: *Sim-to-Real Transfer in Deep Reinforcement Learning for Robotics: a Survey* (2020)
5. Diffusion policies: *Diffusion Policy: Visuomotor Policy Learning via Action Diffusion* (2023)

### 29. Blockchain Engineer — Thin
Requires: Backend & Distributed Systems Engineer → Distributed systems theory
Topics: Blockchain Technology Applications and Security

**Consensus**
1. Byzantine faults: *The Byzantine Generals Problem* (1982)
2. BFT for blockchains: *HotStuff: BFT Consensus in the Lens of Blockchain* (2018)
3. Proof of stake: *Algorand: A secure and efficient distributed ledger* (2019), *Ouroboros Genesis* (2018)

**Platforms and contracts**
1. Permissioned chains: *Hyperledger Fabric* (2018)
2. Ethereum security: *A Survey on Ethereum Systems Security* (2020)
3. Contract bugs: *Defining Smart Contract Defects on Ethereum* (2020)
4. Verification: *VERISMART: A Highly Precise Safety Verifier for Ethereum Smart Contracts* (2020)
5. Fees: *Transaction Fee Mechanism Design for the Ethereum Blockchain* (2020)
6. Private payments: *Zerocash* (2014)

### 30. Health Tech Developer — Thin (new)
Topics: Electronic Health Records Systems, Mobile Health and mHealth Applications, Digital Mental Health Interventions

**Health data**
1. Health records: *Mining Electronic Health Records (EHRs)* (2018)
2. An open dataset: *MIMIC-IV, a freely accessible electronic health record dataset* (2023)
3. Models for records: *BEHRT: Transformer for Electronic Health Records* (2020), *A large language model for electronic health records* (2022)

**Health apps and devices**
1. Designing with clinicians: *User-Centered Design Process of an mHealth App for Health Professionals: Case Study* (2020)
2. Usability: *System Usability Scale Benchmarking for Digital Health Apps: Meta-analysis* (2022)
3. Wearables: *Wearable-Based Affect Recognition—A Review* (2019)
4. Sharing records: *FHIRChain: Applying Blockchain to Securely and Scalably Share Clinical Data* (2018)

**Decision support**
1. Explainability: *To explain or not to explain?—Artificial intelligence explainability in clinical decision support systems* (2022)
2. Co-design: *Co-design of Human-centered, Explainable AI for Clinical Decision Support* (2023)

### 31. Learning Engineer (EdTech) — Thin
Topics: Intelligent Tutoring Systems and Adaptive Learning, Online Learning and Analytics, Teaching and Learning Programming

**Adaptive learning**
1. Tutoring systems: *Intelligent tutoring systems: a systematic review…* (2018)
2. Knowledge tracing: *Dynamic Key-Value Memory Networks for Knowledge Tracing* (2017)
3. Attention-based tracing: *A Self-Attentive model for Knowledge Tracing* (2019), *Context-Aware Attentive Knowledge Tracing* (2020)

**Learning at scale**
1. MOOCs: *Supporting learners' self-regulated learning in Massive Open Online Courses* (2019)
2. Analytics: *Educational Data Mining and Learning Analytics in Programming* (2015)
3. Grading: *Automated Grading and Feedback Tools for Programming Education: A Systematic Review* (2023)
4. LLMs in class: *ChatGPT for good?* (2023), *The Impact of Large Language Models on Programming Education…* (2024)

---

## Classics the library is missing

The rebalance added the original *Denoising Diffusion Probabilistic Models* and *3D Gaussian Splatting*, and re-imported PPO and Codex, whose earlier records had the wrong titles. MapReduce and QUIC were already here under shorter titles.

These classics would strengthen the trees, but OpenAlex has no open PDF for them, so the importer skips them. Many are free on their authors' own sites, so each would need a hand-entered PDF link:

- **ML:**
  - *Long Short-Term Memory*
  - *Dropout*
  - *Random Forests*
  - *Human-level control through deep reinforcement learning*
  - *Mastering the game of Go*
  - GPT-2
  - SIFT
  - CTC
  - PointNet
  - t-SNE
  - DBSCAN
  - Lasso
  - Isolation Forest
- **Systems:**
  - *The Google File System*
  - Bigtable
  - *Dynamo*
  - Raft
  - *Paxos Made Simple*
  - Spark (RDDs)
  - ZooKeeper
  - *The Tail at Scale*
  - the LSM-tree
  - Bitcoin
  - *End-to-End Arguments in System Design*
  - *The UNIX Time-Sharing System*
- **Web:** Fielding's REST dissertation
- **Theory:** Dijkstra's shortest paths; Karp's *Reducibility Among Combinatorial Problems*
- **Software engineering:** *No Silver Bullet*
- **HCI:**
  - Fitts' law (1954)
  - SUS
  - NASA-TLX
  - *The Computer for the 21st Century*
