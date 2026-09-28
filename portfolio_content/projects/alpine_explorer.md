# Alpine Explorer 2.0

**Problem:**

Hill-station travel involves rapidly changing terrain, weather, snow/ice, road accessibility, and limited connectivity. Existing travel applications generally provide maps or forecasts separately, but do not combine quality-controlled multispectral satellite analysis, route-level risk assessment, uncertainty, evidence-based explanations, and offline journey recovery in one system.

**Solution:**

Building a quality-aware multispectral geospatial AI and offline travel-risk decision-support platform for hill stations. The system processes PlanetScope four/eight-band imagery with UDM2/UDM2.1 quality masks, performs Swin-based semantic segmentation, fuses terrain, elevation, weather, route, incident, freshness, and historical evidence through a deterministic risk engine, and provides separate hazard-risk, travel-suitability, confidence, and insufficient-data outputs.

**Technologies:**

Python, Rasterio, GDAL, NumPy, GeoPandas, PyTorch, Swin Transformer, Swin-UPerNet, SegFormer, PlanetScope, UDM2/UDM2.1, GeoTIFF, FastAPI, PostgreSQL/PostGIS, Redis, Next.js, TypeScript, Tailwind CSS, MapLibre, React Native, SQLite, Docker, LangGraph, Structured Tool Calling

**Your Contribution:**

* Leading the AI/ML and research subsystem covering PlanetScope data ingestion, sensor-aware band mapping, UDM2/UDM2.1 quality masking, reflectance preprocessing, dataset construction, ground-truth masks, and leakage-resistant geographic/temporal train-validation-test design.
* Developing the Swin-based eight-band semantic-segmentation pipeline for georeferenced terrain probability maps, with RGB and multispectral baselines, GPU training, confidence estimation, calibration, and controlled ablation studies.
* Designing experiments comparing RGB vs. eight-band imagery, UDM2 quality masking, DEM-derived features, and model compression to measure their contribution to segmentation performance and generalisation.
* Contributing to the integrated decision-support architecture by connecting terrain intelligence with route-level risk, offline cached analysis, breadcrumb-based journey recovery, and a grounded read-only agentic copilot that explains deterministic results using verified tools and evidence.

**Results:**

* Developing a research-grade geospatial AI prototype that progresses from quality-controlled multispectral satellite imagery to georeferenced terrain segmentation, calibrated confidence, and route-level risk decision support.
* Planned evaluation includes mean IoU, per-class F1, IoU, Dice, calibration, false-safe rate, unseen-location/date generalisation, GPU inference performance, offline reliability, synchronization, and agent grounding.
* The intended outcome is a reproducible academic platform combining multispectral terrain segmentation, multimodal route-risk analysis, offline journey recovery, and grounded agentic explanations.

**GitHub Link:** [Add Alpine Explorer 2.0 GitHub repository]

**Live Demo Link:** [Add deployment link when available]

