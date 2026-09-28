export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  problem: string;
  solution: string;
  technologies: string[];
  contribution: string[];
  results: string[];
  githubUrl?: string;
  demoUrl?: string;
  categories: string[];
};

export const projects: Project[] = [
  {
    slug: "alpine-explorer-2",
    title: "Alpine Explorer 2.0",
    shortDescription: "A quality-aware multispectral geospatial AI and offline travel-risk decision-support platform for hill stations.",
    problem: "Hill-station travel involves rapidly changing terrain, weather, snow/ice, road accessibility, and limited connectivity. Existing travel applications generally provide maps or forecasts separately, but do not combine quality-controlled multispectral satellite analysis, route-level risk assessment, uncertainty, evidence-based explanations, and offline journey recovery in one system.",
    solution: "Building a quality-aware multispectral geospatial AI and offline travel-risk decision-support platform for hill stations. The system processes PlanetScope four/eight-band imagery with UDM2/UDM2.1 quality masks, performs Swin-based semantic segmentation, fuses terrain, elevation, weather, route, incident, freshness, and historical evidence through a deterministic risk engine, and provides separate hazard-risk, travel-suitability, confidence, and insufficient-data outputs.",
    technologies: ["Python", "PyTorch", "Swin Transformer", "FastAPI", "PostgreSQL", "Next.js", "LangGraph"],
    contribution: [
      "Leading the AI/ML and research subsystem covering PlanetScope data ingestion, sensor-aware band mapping, and geographic/temporal train-validation-test design.",
      "Developing the Swin-based eight-band semantic-segmentation pipeline for georeferenced terrain probability maps.",
      "Designing experiments comparing RGB vs. eight-band imagery, UDM2 quality masking, and DEM-derived features.",
      "Contributing to the integrated decision-support architecture by connecting terrain intelligence with route-level risk and offline cached analysis."
    ],
    results: [
      "Developing a research-grade geospatial AI prototype that progresses from quality-controlled multispectral satellite imagery to georeferenced terrain segmentation.",
      "Planned evaluation includes mean IoU, per-class F1, IoU, Dice, calibration, false-safe rate, unseen-location/date generalisation.",
      "The intended outcome is a reproducible academic platform combining multispectral terrain segmentation and multimodal route-risk analysis."
    ],
    githubUrl: "#", // Placeholder
    demoUrl: "#", // Placeholder
    categories: ["AI/ML", "Data Science", "Web Dev"]
  },
  {
    slug: "digital-advertising-analytics",
    title: "Digital Advertising Analytics",
    shortDescription: "An end-to-end digital advertising analytics platform for ML workflows and automated natural-language campaign recommendations.",
    problem: "Marketing teams often struggle to derive actionable insights from massive volumes of fragmented campaign data. The manual process of analyzing structured advertising datasets, identifying underperforming segments, and generating strategic recommendations is slow and error-prone.",
    solution: "As part of my Data Science Internship at IBM, I collaborated to build a comprehensive analytics platform. This system handles data preparation and orchestration of machine learning workflows. It utilizes advanced clustering and anomaly detection algorithms to segment audiences and identify outliers, ultimately piping the ML insights into the Google Gemini API to generate easily digestible, natural-language campaign strategies for non-technical stakeholders.",
    technologies: ["Python", "Scikit-Learn", "Pandas", "Google Gemini API", "Flask", "SQL", "K-Means"],
    contribution: [
      "Collaborated in a three-member team to build the end-to-end analytics platform covering data preparation and cloud-hosted data pipelines.",
      "Developed and evaluated K-Means clustering workflows to segment advertising audiences effectively.",
      "Implemented anomaly-detection models to instantly flag irregular campaign performance metrics (e.g., sudden spikes in CPC or drop in conversions).",
      "Integrated the backend ML outputs directly with the Google Gemini API to translate complex data into natural-language marketing recommendations."
    ],
    results: [
      "Automated the generation of campaign insights, significantly reducing the manual reporting hours required by marketing teams.",
      "Improved the precision of ad targeting through dynamic audience segmentation and real-time anomaly flagging."
    ],
    githubUrl: "#", // Placeholder
    categories: ["Data Science", "Web Dev"]
  },
  {
    slug: "multi-agent-rag-system",
    title: "Multi-Agent RAG System",
    shortDescription: "A sophisticated Retrieval-Augmented Generation system using LangGraph and hybrid search to process complex queries.",
    problem: "Standard LLMs often hallucinate or fail to retrieve contextually accurate information from large proprietary knowledge bases, especially when queries require multi-step reasoning or combining dense embeddings with keyword search.",
    solution: "Developed an intelligent, multi-agent AI architecture using LangGraph. The system features a Hybrid RAG approach (combining dense vector embeddings with sparse keyword search) to maximize retrieval accuracy. A supervisor agent routes queries to specialized sub-agents that fetch, summarize, and synthesize verified information before delivering a grounded final response.",
    technologies: ["Python", "LangGraph", "PyTorch", "Transformers", "Google Gemini API", "Vector Databases", "FastAPI"],
    contribution: [
      "Architected the multi-agent state graph using LangGraph to enable deterministic reasoning and tool usage.",
      "Implemented a Hybrid RAG pipeline that combines dense vector embeddings with traditional keyword search for optimal recall.",
      "Integrated prompt engineering techniques with the Google Gemini API to ensure the agent's responses are accurate and properly cited.",
      "Developed a robust FastAPI backend to serve the agentic workflows to frontend client applications."
    ],
    results: [
      "Achieved significantly lower hallucination rates compared to naive RAG implementations.",
      "Created a scalable foundation for deploying deterministic, enterprise-grade AI assistants that rely on verified proprietary data."
    ],
    githubUrl: "#", // Placeholder
    categories: ["AI/ML", "Web Dev"]
  }
];
