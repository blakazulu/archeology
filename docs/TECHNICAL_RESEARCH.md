# Archeology Web App - Technical Research & AI Options

## Project Overview

This document outlines the technical analysis and AI model options for building the Archeology web application consisting of two parts:

1. **Save The Past** - 3D reconstruction and artifact documentation
2. **PastPalette** - Multiple color reconstructions of artifacts

---

## Project Requirements Summary

### Part 1: Save The Past

- Multi-angle photo capture from phone/tablet
- 3D model reconstruction using image recognition and 3D reconstruction technology
- Digital information card generation including:
  - Discovery location
  - Excavation layer
  - Raw materials
  - Estimated age
  - Possible use
  - Historical significance
- Cloud/local storage for preservation

### Part 2: PastPalette

- Photo capture of archaeological finds
- Multiple color reconstruction variants based on:
  - Pigments that were found
  - Historical period and culture
  - Similar artifacts from other regions
- Interactive display for choosing between reconstructions

---

## FREE / OPEN SOURCE OPTIONS

### 3D Reconstruction Technologies

#### Tier 1: Photogrammetry (Multiple Images to 3D)

Best for archaeological artifacts where accuracy is critical.

| Tool | License | GPU Required | Notes |
|------|---------|--------------|-------|
| **Meshroom (AliceVision)** | Open Source | NVIDIA (CUDA 3.0+) | Best all-around option. Includes AI segmentation plugin (MrSegmentation), Gaussian Splatting support (MrGSplat), and depth estimation (MrDepthEstimation). Draft mode available for non-NVIDIA GPUs. |
| **OpenSplat** | AGPLv3 | NVIDIA/AMD/Apple Metal/CPU | Production-grade 3D Gaussian Splatting. Works with COLMAP output. Commercial use allowed. |
| **COLMAP** | BSD | Optional | Industry standard Structure-from-Motion and Multi-View Stereo pipeline. Very robust and well-documented. |
| **OpenDroneMap** | AGPL | Optional | Excellent for larger scenes. Includes NodeODM server for web integration. |
| **Regard3D** | Open Source | No | Simpler alternative, good for beginners. |
| **MicMac** | Open Source | No | Advanced features for aerial triangulation. |
| **SlicerMorph Photogrammetry** | Open Source | No | New in 2025. Integrates SAM (Segment Anything Model). 10-15% better accuracy than previous open-source workflows. |

**Links:**
- Meshroom: https://github.com/alicevision/Meshroom
- AliceVision: https://alicevision.org/
- OpenSplat: https://github.com/pierotofy/OpenSplat
- COLMAP: https://colmap.github.io/
- OpenDroneMap: https://www.opendronemap.org/

#### Tier 2: Single Image to 3D (Faster, Less Accurate)

Useful for quick field captures or when multiple angles aren't possible.

| Tool | License | Speed | Notes |
|------|---------|-------|-------|
| **TripoSR** | MIT | <1 second | Stability AI + Tripo collaboration. Excellent for quick previews. Open source on GitHub. |
| **TRELLIS-2** | Open | Seconds | Microsoft's 4B parameter model. CVPR 2025 Spotlight paper. Generates PBR materials. Free demo on HuggingFace. |
| **Apple SHARP** | Apache 2.0 | 2 seconds | Released December 2025. Single image to Gaussian Splat. Uses Depth Pro. |
| **OpenAI Shap-E** | MIT | Fast | Text or image to 3D. Good for experimentation. |
| **FreeSplatter** | Apache 2.0 | Fast | Tencent. Pose-free Gaussian Splatting. ICCV 2025. |

**Links:**
- TripoSR: https://github.com/VAST-AI-Research/TripoSR
- TRELLIS-2: https://trellis-2.org/
- Apple SHARP: https://github.com/apple/ml-sharp
- Shap-E: https://github.com/openai/shap-e
- FreeSplatter: https://github.com/TencentARC/FreeSplatter

#### Tier 3: Neural Radiance Fields (NeRF)

High quality but slower training times.

| Tool | Notes |
|------|-------|
| **Nerfstudio** | Modular framework. Includes Instant-NGP. SIGGRAPH 2023. |
| **Original NeRF** | Reference implementation. ~5MB model, single GPU training. |
| **pixelNeRF** | Works from sparse views (as few as one image). |
| **Nerfies** | Deformable NeRFs for moving subjects. |

**Links:**
- Nerfstudio: https://docs.nerf.studio/
- Original NeRF: https://github.com/bmild/nerf
- pixelNeRF: https://alexyu.net/pixelnerf/

#### 3D Gaussian Splatting Tools

Newer alternative to NeRF, often faster.

| Tool | License | Notes |
|------|---------|-------|
| **gsplat** | Open Source | CUDA accelerated. 4x less GPU memory, 15% faster than reference. |
| **LichtFeld Studio** | GPLv3 | C++23 and CUDA 12.8+. High performance. |
| **SuperSplat** | Open Source | Edit, publish, and browse Gaussian Splats online. |
| **Original Implementation** | Open Source | Reference from the SIGGRAPH paper. |

**Links:**
- gsplat: https://github.com/nerfstudio-project/gsplat
- LichtFeld Studio: https://github.com/MrNeRF/LichtFeld-Studio
- SuperSplat: https://superspl.at/
- Awesome 3D Gaussian Splatting: https://github.com/MrNeRF/awesome-3D-gaussian-splatting

---

### Artifact Recognition & Classification

Research shows 92-100% accuracy is achievable with deep learning on archaeological datasets.

#### Pre-trained Models for Fine-tuning

| Model | Use Case |
|-------|----------|
| **ResNet-50/101** | General image classification, transfer learning |
| **EfficientNet** | Efficient, accurate classification |
| **YOLO v8/v11** | Real-time object detection and localization |
| **Vision Transformer (ViT)** | State-of-the-art image classification |

#### Tools and Frameworks

| Tool | Notes |
|------|-------|
| **Ultralytics YOLO** | Easy to use, real-time detection. https://github.com/ultralytics/ultralytics |
| **Google Teachable Machine** | Free, browser-based, no coding required. Good for prototyping. |
| **Hugging Face Transformers** | Pre-trained vision models with easy fine-tuning. |
| **PyTorch / TensorFlow** | Full control for custom training. |

#### Archaeological ML Research Findings

- CNN approaches achieve 92.58% precision on Chinese Neolithic pottery classification
- Faster R-CNN ResNet-50 achieved 100% agreement with human experts on stone artifact identification
- Transfer learning on pre-trained models works well with limited archaeological datasets
- Models can identify: pottery, vessel pieces, jewelry, stone tools, metal objects
- Can classify by material: earthenware, glass, metal alloy, stone

**Research Links:**
- Automatic inventory paper: https://www.sciencedirect.com/science/article/pii/S2212054825000608
- Stone artifact identification: https://pmc.ncbi.nlm.nih.gov/articles/PMC9365149/
- Pottery classification: https://www.sciencedirect.com/science/article/abs/pii/S2212054823000140

---

### Artifact Information Card Generation (LLMs)

#### Free LLM API Providers

| Provider | Available Models | Free Tier Details |
|----------|------------------|-------------------|
| **Groq** | Llama 3.3 70B, Mixtral | Generous free tier, extremely fast inference |
| **Cerebras** | Llama 3.3 70B | Free tier available |
| **Together AI** | Various open models | $25 free credits to start |
| **HuggingFace Inference** | Many models | Monthly free credits |
| **Sambanova** | Llama models | Free tier/preview |
| **OVH** | Various | European provider with free tier |

**Free Tier Limits (typical):**
- 30 requests/minute
- 60,000 tokens/minute
- 900 requests/hour
- 1,000,000 tokens/day

#### Best Open Source Models

| Model | Context | Notes |
|-------|---------|-------|
| **Llama 3.3 70B** | 128k | Excellent reasoning, widely available free |
| **Mistral Large 3** | 256k | Apache 2.0, multimodal capable |
| **Qwen 2.5** | Various | Strong multilingual support |
| **DeepSeek R1** | Large | Strong reasoning capabilities |

#### Local LLM Options (Completely Free)

| Tool | Notes |
|------|-------|
| **Ollama** | One-command setup. Runs Llama, Mistral, Qwen locally. https://ollama.ai/ |
| **LM Studio** | GUI for running local models. User-friendly. |
| **OpenLLM** | OpenAI-compatible API from local models. https://github.com/bentoml/OpenLLM |

**Links:**
- Free LLM API Resources List: https://github.com/cheahjs/free-llm-api-resources
- Open Source LLM Comparison: https://huggingface.co/blog/daya-shankar/open-source-llms

---

### Image Colorization (PastPalette)

#### Dedicated Colorization Models

| Tool | License | Notes |
|------|---------|-------|
| **DeOldify** | Open Source | Best-in-class for historical images. Uses NoGAN training. Free Google Colab notebooks available. Handles photos and video. |
| **GenAI-Image-Colorizer** | Open Source | CNN-based, trained on CIFAR-10. Simpler approach. |

**Links:**
- DeOldify: https://github.com/jantic/DeOldify
- DeOldify Website: https://deoldify.ai/
- GenAI-Image-Colorizer: https://github.com/satvikx/GenAI-Image-Colorizer
- Awesome Image Colorization (papers): https://github.com/MarkMoHR/Awesome-Image-Colorization

#### Multiple Color Variants with Stable Diffusion

For generating multiple historically-plausible color reconstructions:

| Method | How It Works |
|--------|--------------|
| **ControlNet Canny** | Detects edges, preserves shape while allowing color changes |
| **ControlNet T2I Color** | Creates color grid from source, guides generation |
| **Multi-ControlNet** | Combine Reference + Canny + T2I for maximum control |
| **Instruct-Pix2Pix** | Prompt-based: "change the color to terracotta red" |
| **img2img with low strength** | Multiple iterations with low denoising for subtle changes |
| **Inpainting** | Selective area colorization |

#### Stable Diffusion Tools

| Tool | Notes |
|------|-------|
| **AUTOMATIC1111 WebUI** | Most popular, full-featured. https://github.com/AUTOMATIC1111/stable-diffusion-webui |
| **ComfyUI** | Node-based, highly customizable. Better for complex workflows. https://github.com/comfyanonymous/ComfyUI |
| **Fooocus** | Simplified interface, good for beginners. |
| **InvokeAI** | Professional features, good UI. |

#### Workflow for PastPalette Color Variants

1. Load artifact image into img2img
2. Enable ControlNet with Canny preprocessor (preserves shape)
3. Create multiple generations with different prompts:
   - "Ancient Roman pigments, red ochre and Egyptian blue"
   - "Mesopotamian gold and lapis lazuli colors"
   - "Natural weathered earth tones, aged patina"
   - "Vibrant original colors, fresh paint"
4. Use consistent seed with varied prompts for coherent variations

---

### Free Compute Options

#### Cloud GPU Access

| Platform | GPU | Free Tier |
|----------|-----|-----------|
| **HuggingFace Spaces ZeroGPU** | NVIDIA H200 | Daily quota, free for all users. PRO ($9/mo) gets 7x more quota. |
| **Google Colab** | T4/V100 | ~12 hours/session, limited GPU time |
| **Kaggle Notebooks** | P100/T4 | 30 GPU hours/week |
| **Lightning.ai** | Various | Free tier with credits |
| **Paperspace Gradient** | Various | Free tier available |

**Links:**
- HuggingFace ZeroGPU: https://huggingface.co/docs/hub/spaces-zerogpu
- HuggingFace Pricing: https://huggingface.co/pricing

#### Browser-Based AI (WebGPU)

2025 is the year all major browsers support WebGPU:
- Chrome 113+ (2023)
- Edge 113+ (2023)
- Firefox 141+ (mid-2025)
- Safari 26 (expected 2025)

| Framework | Use Case | Notes |
|-----------|----------|-------|
| **Transformers.js** | General ML | 1200+ pre-converted models, WebGPU accelerated |
| **WebLLM** | LLMs in browser | No server required, chat interfaces |
| **ONNX Runtime Web** | CV/ML models | 19x speedup with WebGPU on SAM |
| **TensorFlow.js** | General ML | Popular pretrained models |

**Performance:** Up to 100x faster than WebAssembly. 64x speedup documented for embeddings.

**Benefits:**
- No server costs
- Privacy (data stays on device)
- Works offline (with cached models)
- Reduced latency

**Links:**
- Transformers.js: https://huggingface.co/docs/transformers.js
- WebLLM: https://github.com/mlc-ai/web-llm

---

## PAID / COMMERCIAL OPTIONS

### 3D Reconstruction APIs

| Service | Pricing | Notes |
|---------|---------|-------|
| **Polycam** | Subscription + Enterprise | Mobile-first, LiDAR support, API available. https://poly.cam/pricing |
| **Luma AI** | Credit-based (~800 credits/10s video) | Cinematic NeRFs, high quality |
| **RealityCapture** | $10/3500 credits or $3750 perpetual | Industry standard, highest quality |
| **Replicate** | ~$0.37/run for 3D models | TRELLIS, TripoSR, various models. https://replicate.com/pricing |
| **Meshy AI** | Credits/subscription | Easy image-to-3D. https://www.meshy.ai/ |
| **Beholder** | Custom pricing | Cloud photogrammetry with REST API |

### Cloud Photogrammetry Services

| Service | Pricing Model |
|---------|--------------|
| **Agisoft Metashape SaaS** | Pay-per-use via partners |
| **3Dsurvey** | ~$120/month |
| **DroneDeploy** | $499/month individual |
| **AR Code Object Capture** | SaaS subscription |

### Vision & Description APIs

| Service | Pricing | Notes |
|---------|---------|-------|
| **OpenAI GPT-4o** | ~$0.0075/image (low detail, 85 tokens) | Excellent multimodal, accurate descriptions |
| **OpenAI GPT-4o-mini** | ~33x cheaper than 4o | Good for high volume |
| **Claude Opus 4.5** | $5/$25 per M tokens (input/output) | Strong vision + reasoning |
| **Claude Sonnet 4.5** | $3/$15 per M tokens | Balanced cost/quality |
| **Google Cloud Vision** | $1.50/1000 units | First 1000/month free. Object detection, labels, OCR. |

**Google Cloud Vision Features:**
- Label Detection: $1.50/1000 units
- Object Localization: $2.25/1000 units
- Web Detection: $3.50/1000 units
- New customers: $300 free credits

**Links:**
- OpenAI Pricing: https://openai.com/api/pricing/
- Claude Pricing: https://claude.com/pricing
- Google Cloud Vision: https://cloud.google.com/vision/pricing

---

## RECOMMENDED ARCHITECTURE

### Phase 1: Free/Low-Cost MVP

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SAVE THE PAST                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Frontend - Web App]                                               │
│  ├── Camera capture (Browser MediaDevices API)                     │
│  ├── Image upload interface                                         │
│  └── 3D model viewer (Three.js / model-viewer)                     │
│                                                                     │
│  [3D Reconstruction]                                                │
│  ├── Primary: TripoSR or TRELLIS-2 (HuggingFace Spaces)           │
│  ├── Alternative: Meshroom (self-hosted for higher quality)        │
│  └── Output: GLB/OBJ/PLY files                                     │
│                                                                     │
│  [Artifact Classification]                                          │
│  ├── Fine-tuned YOLO or ResNet (HuggingFace Spaces)                │
│  └── Categories: pottery, tools, jewelry, etc.                     │
│                                                                     │
│  [Information Card Generation]                                      │
│  ├── Llama 3.3 70B via Groq API (free tier)                        │
│  ├── Input: Image + classification + user metadata                 │
│  └── Output: Structured artifact description                       │
│                                                                     │
│  [Storage]                                                          │
│  ├── Local: IndexedDB for offline support                          │
│  ├── Cloud: Firebase/Supabase free tier                            │
│  └── 3D models: Local files or cloud storage                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         PASTPALETTE                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Frontend - Web App]                                               │
│  ├── Image upload                                                   │
│  ├── Color variant gallery                                          │
│  └── Comparison slider interface                                    │
│                                                                     │
│  [Base Colorization]                                                │
│  ├── DeOldify (HuggingFace Spaces or self-hosted)                  │
│  └── Initial color reconstruction                                   │
│                                                                     │
│  [Multiple Color Variants]                                          │
│  ├── Stable Diffusion + ControlNet (ComfyUI workflow)              │
│  ├── Hosted on: HuggingFace Spaces or Replicate                    │
│  └── Prompt templates for different periods/cultures               │
│                                                                     │
│  [Prompt Templates]                                                 │
│  ├── "Roman period: red ochre, Egyptian blue, gold leaf"           │
│  ├── "Greek classical: white marble, bronze, terracotta"           │
│  ├── "Mesopotamian: lapis lazuli, gold, carnelian"                 │
│  ├── "Egyptian: turquoise, gold, black kohl"                       │
│  └── "Natural weathered: earth tones, patina, aged"                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Phase 2: Production Scale

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PRODUCTION ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Frontend]                                                         │
│  ├── React/Vue/Svelte web app                                       │
│  ├── React Native / Flutter mobile app                              │
│  └── PWA for offline field work                                     │
│                                                                     │
│  [3D Reconstruction - Upgraded]                                     │
│  ├── Replicate API (TRELLIS) for quick captures                    │
│  ├── Self-hosted Meshroom on GPU server for quality                │
│  └── Polycam SDK for mobile with LiDAR                             │
│                                                                     │
│  [AI Services - Upgraded]                                           │
│  ├── Claude/GPT-4o for rich descriptions                           │
│  ├── Custom fine-tuned classifier                                   │
│  └── Google Cloud Vision for backup                                │
│                                                                     │
│  [Infrastructure]                                                   │
│  ├── AWS/GCP/Azure with GPU instances                              │
│  ├── CDN for 3D model delivery                                      │
│  └── Database: PostgreSQL + vector search                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## TECHNOLOGY FEASIBILITY MATRIX

| Requirement | Technical Feasibility | Free Option Available | Quality Level |
|-------------|----------------------|----------------------|---------------|
| Multi-angle photo to 3D model | Fully feasible | Yes (Meshroom, COLMAP) | High |
| Single photo to 3D model | Feasible | Yes (TripoSR, TRELLIS) | Medium |
| Artifact type recognition | Fully feasible (90%+ accuracy) | Yes (YOLO, custom CNN) | High |
| Material classification | Feasible with training data | Yes (fine-tuned models) | Medium-High |
| Age estimation | Challenging, needs context | Partially (LLM reasoning) | Low-Medium |
| Information card generation | Fully feasible | Yes (Groq/Llama free tier) | High |
| Base colorization | Fully feasible | Yes (DeOldify) | High |
| Multiple color variants | Fully feasible | Yes (SD + ControlNet) | High |
| Historical color accuracy | Challenging | Partially (prompt engineering) | Medium |
| Browser-based processing | Feasible for smaller models | Yes (WebGPU/Transformers.js) | Medium |
| Offline functionality | Fully feasible | Yes (PWA + IndexedDB) | High |

---

## IMPLEMENTATION ROADMAP

### Sprint 1: Core Infrastructure
- [ ] Set up web app framework (React/Vue recommended)
- [ ] Implement camera capture interface
- [ ] Create basic image upload flow
- [ ] Set up local storage (IndexedDB)

### Sprint 2: 3D Reconstruction MVP
- [ ] Integrate TripoSR via HuggingFace Spaces API
- [ ] Implement 3D model viewer (Three.js)
- [ ] Add GLB/OBJ export functionality
- [ ] Test with sample artifact images

### Sprint 3: Artifact Classification
- [ ] Gather/create training dataset
- [ ] Fine-tune YOLO or ResNet model
- [ ] Deploy to HuggingFace Spaces
- [ ] Integrate classification into upload flow

### Sprint 4: Information Card Generation
- [ ] Set up Groq API integration
- [ ] Design prompt template for artifact descriptions
- [ ] Create information card UI component
- [ ] Add manual editing capability

### Sprint 5: PastPalette Colorization
- [ ] Integrate DeOldify for base colorization
- [ ] Set up Stable Diffusion + ControlNet workflow
- [ ] Create culture/period prompt templates
- [ ] Build comparison gallery UI

### Sprint 6: Polish & Scale
- [ ] Add user authentication
- [ ] Implement cloud sync
- [ ] Optimize performance
- [ ] Add offline PWA support

---

## OPEN SOURCE ARCHAEOLOGY RESOURCES

### Platforms and Communities
- **Open-Archaeo**: https://open-archaeo.info/ - Curated list of open source archaeological software
- **GitHub open-archaeo**: https://github.com/zackbatist/open-archaeo
- **Sketchfab**: Free 3D model hosting, widely used in archaeology

### Notable Projects
- **DINAA** (Digital Index of North American Archaeology): Open government data, QGIS integration
- **Gabii Project**: Interactive 3D site models with stratigraphic data
- **Jefferson Patterson Park**: Photogrammetry as Open Educational Resources

### Research Publications
- "Machine Learning Arrives in Archaeology" - Cambridge Core
- "Automatic inventory of archaeological artifacts" - ScienceDirect
- "CNN-based approach for retrieving painted pottery images" - ScienceDirect

---

## CONCLUSION

**This project is 100% achievable with free/open-source tools.**

The recommended approach:
1. Start with free tiers (HuggingFace Spaces, Groq API, DeOldify)
2. Build working prototype to validate concept
3. Scale to paid services only when needed for production volume

**Key free stack:**
- 3D: TripoSR/TRELLIS on HuggingFace Spaces
- Classification: Fine-tuned YOLO on HuggingFace Spaces
- LLM: Llama 3.3 via Groq (free tier)
- Colorization: DeOldify + Stable Diffusion ControlNet
- Hosting: Vercel/Netlify (free tier) + HuggingFace Spaces

**Estimated cost for MVP: $0**
**Estimated cost for production (1000 users/day): $50-200/month**

---

*Document generated: January 2026*
*Research conducted using web searches and verified against official documentation*
