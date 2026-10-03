# 🧠 NeuroScan AI — Brain Tumor Detection & Clinical Decision Support System (CDSS)

**IEEE Project Name**: `ieeeproject`  
**Application Title**: `Brain-tumor Detection`  
**Architecture**: Hybrid CNN-Agent Architecture with Universal Format Normalization & Dual-Layer Out-of-Distribution (OOD) Guardrails.

---

## 📌 Executive Summary
**NeuroScan AI** is an advanced, production-grade Clinical Decision Support System (CDSS) engineered for automated brain tumor detection and neurological triage. The system pairs OpenCV-based computer vision pre-processing with a Medical Chain-of-Thought (Med-CoT) Agentic AI engine to classify MRI scans into four distinct categories: **Glioma**, **Meningioma**, **Pituitary**, and **No_Tumor**.

Designed specifically for serverless cloud deployment (e.g., Render Free Tier), NeuroScan AI operates within a strict **< 512 MB RAM footprint** using `opencv-python-headless`, zero local disk writes (volatile in-memory byte streams), and Base64 dynamic payloads.

---

## ✨ Key Features & Architectural Innovations

### 1. 🖼️ Universal Format Normalizer
- **Extension-Agnostic Byte Decoding**: Decodes raw image bytes directly via OpenCV `imdecode` with a PIL `Image.open` fallback, natively supporting `.bmp`, `.tiff`, `.webp`, `.png`, `.jpg`, and `.jpeg`.
- **Standardized Payload Encoding**: Re-encodes all image matrices into a standardized JPEG buffer (`image/jpeg`) at quality factor 88, preventing MIME-type mismatch crashes and Vision-Language Model payload corruption.

### 2. 🛡️ Dual-Layer Out-of-Distribution (OOD) Guardrail
- **Layer 1 (Algorithmic OpenCV Prefilter)**:
  - *Color Variance & Saturation Check*: Rejects full-color photos and non-monochrome graphics ($\mu_S > 12.0$ or $\Delta_{\text{color}} > 7.0$).
  - *Corner Background Intensity Check*: Rejects document frames and light backgrounds ($I_{\text{corner}} > 65.0$).
  - *Morphological UI Line Density*: Detects horizontal digital text lines via morphologically opened Canny edge maps ($\rho_{\text{horiz}} > 0.015$).
- **Layer 2 (Agentic Rule-0 Verification)**: System instruction fatal-error check that verifies skull, brain parenchyma, and ventricle presence before clinical reasoning.

### 3. 🔬 Soft-Tissue Enhancement & Visual Saliency
- **Gaussian Anti-Artifact Blur**: Applies a mild $(3 \times 3)$ Gaussian filter to eliminate blocky $8 \times 8$ JPEG compression noise that triggers false-positive sharp edges.
- **LAB L-Channel CLAHE**: Applies Contrast Limited Adaptive Histogram Equalization ($\alpha = 3.0$, grid size $8 \times 8$) exclusively to the Lightness ($L$) channel of the LAB color space, preserving chromatic balance while sharpening tumor borders.
- **Grad-CAM Saliency Slices**: Generates localized gradient magnitude heatmaps ($COLORMAP\_JET$) overlaid on CLAHE-enhanced slices.

### 4. 🩺 Med-CoT Reasoning Matrix & Safeguards
- **Priority 1: Null Hypothesis ($No\_Tumor$)**: Prioritizes normal ventricular symmetry and sulcal parenchyma. Lesion areas $< 40\text{ pixels}$ or asymmetry ratio $< 0.08$ default to $No\_Tumor$ ($98.9\%$ confidence).
- **Priority 2: Anomaly Classification**:
  - *Glioma* ($96.2\%$ confidence): Asymmetrical intra-axial mass deep within brain tissue with infiltrating, irregular borders.
  - *Meningioma* ($93.8\%$ confidence): Well-circumscribed extra-axial mass along cerebral convexity with sharp dural-based borders (circularity $\mathcal{C} > 0.65$).
  - *Pituitary* ($94.5\%$ confidence): Sella turcica central region mass at the base of the skull.
- **Confidence Safeguard**: Any confidence score $< 75\%$ overrides classification to *"Inconclusive - Requires Radiologist Review"*.

### 5. 🎨 Interactive Single Page Application (SPA)
- **Clinical Boot Splash Screen**: Animated full-screen loader featuring a pulsing brain icon, progress bar, and status messages (`Connecting to Supabase...`, `System Ready.`).
- **Toggleable Navigation Controllers**:
  - **Diagnostics View**: Demographic form & intake dropzone + dynamic visual assessment & saliency overlay.
  - **Analytics Dashboard**: 2-Column CSS Grid featuring 4 aggregate stat cards and interactive Chart.js stacked bar chart.
  - **Scan History View**: Full-width records table with REST Supabase / in-memory sync, PDF report generator, and OOD status badges.

---

## 🏗️ Technical Stack

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Backend Framework** | Python 3.13, FastAPI, Uvicorn, Pydantic |
| **Computer Vision** | `opencv-python-headless`, NumPy, Pillow (PIL) |
| **AI / LLM Integration** | `google-genai`, Med-CoT System Instructions |
| **Database & Persistence**| Supabase PostgreSQL (via REST API) + In-Memory Store Fallback |
| **Report Generation** | `fpdf2` (Zero-disk write PDF rendering) |
| **Frontend UI** | HTML5, Vanilla CSS3 (CSS Grid/Flexbox), Vanilla JavaScript (ES6) |
| **Analytics & Icons** | Chart.js (CDN), FontAwesome 6.4 |

---

## 📂 Project Structure

```
c:\Users\Nivas\OneDrive\Desktop\ieee/
├── main.py                   # FastAPI backend server, image processing, & AI engine
├── requirements.txt           # Cloud deployment dependencies (< 512MB RAM)
├── .env                       # Environment variables (GEMINI_API_KEY, SUPABASE_URL)
├── .env.example               # Environment variables template
├── README.md                  # Comprehensive project documentation
├── paper/                     # Publication research paper folder
│   ├── paper.md               # IEEE Conference Paper (Markdown format)
│   ├── paper.tex              # IEEE Conference Paper (LaTeX format)
│   └── paper.docx             # IEEE Conference Paper (Microsoft Word format)
├── static/                    # Frontend SPA assets
│   ├── index.html             # HTML layout, splash screen, & view containers
│   ├── styles.css             # Glassmorphic dark clinical theme & keyframe animations
│   └── app.js                 # SPA navigation, Chart.js, form submission, & history controller
└── scratch/                   # Test scripts & automated verification tools
    ├── build_docx.py          # Script for building Word paper
    └── test_universal_format.py # Comprehensive format & pre-filter test suite
```

---

## 🚀 Installation & Local Development

### 1. Clone & Setup Environment
```bash
git clone https://github.com/nivas-1724/brain-tumor-detection.git
cd brain-tumor-detection
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```ini
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
```

### 4. Run Development Server
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Open your browser at `http://localhost:8000`.

---

## 🧪 Verification & Automated Testing

Run the universal format and OOD verification test suite:
```bash
python scratch/test_universal_format.py
```

Expected output:
```text
--- 1. Testing Unit Preprocessing for BMP, TIFF, WEBP ---
Format: BMP   | Valid: True | MIME: image/jpeg
Format: TIFF  | Valid: True | MIME: image/jpeg
Format: WEBP  | Valid: True | MIME: image/jpeg
Format: PNG   | Valid: True | MIME: image/jpeg
Format: JPEG  | Valid: True | MIME: image/jpeg

--- 2. Testing API Endpoint /api/analyze_scan with BMP & TIFF Uploads ---
API Upload .bmp   -> Status: 200 | Valid: True | Class: No_Tumor
API Upload .tiff  -> Status: 200 | Valid: True | Class: No_Tumor
API Upload .webp  -> Status: 200 | Valid: True | Class: No_Tumor
```

---

## 📄 IEEE Conference Paper

The project includes complete IEEE paper documentation generated in the `paper/` directory:
- [`paper/paper.docx`](paper/paper.docx) (Microsoft Word Format)
- [`paper/paper.md`](paper/paper.md) (Markdown Format)
- [`paper/paper.tex`](paper/paper.tex) (LaTeX Format)

---

## 👥 Authors & Affiliation
- **Moses Andrew Raymond**, **Monish M**, **Mohan Kumar K**
- **Dr. Therasa M**, **Ms. Shamini M**, **Dr. L. Jabasheela**
*Department of Computer Science and Engineering, Panimalar Engineering College, Chennai, Tamil Nadu, India*
