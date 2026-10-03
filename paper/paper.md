# NeuroScan AI: A Graph-Based Cyber Governance Architecture for Dynamic MRI Trust Management, Adaptive Containment, and Deception-Driven Recovery in Serverless Medical Decision Support Systems

**Moses Andrew Raymond, Monish M, Mohan Kumar K, Dr. Therasa M, Ms. Shamini M, Dr. L. Jabasheela**  
*Department of Computer Science and Engineering, Panimalar Engineering College, Chennai, Tamil Nadu, India*  
`mosesandrewraymond@gmail.com, monish0924@gmail.com, mohan906kee@gmail.com`

---

## Abstract
Most clinical healthcare organizations still defend their diagnostic imaging networks with a fragmented patchwork of narrow point-solution tools—SIEM platforms for central log correlation, EDR agents for endpoint isolation, DLP systems for outbound data filtering, and standalone deep convolutional neural networks (CNNs) for medical slice analysis. Each tool covers one isolated phase of the medical incident lifecycle and operates without continuous cross-layer communication. That fragmented patchwork buys surface-level detection coverage but fails to provide operational command: once an out-of-distribution (OOD) payload upload, adversarial sample injection, or DICOM header corruption occurs, no single enterprise tool maintains a live, organization-wide answer to a fundamental clinical question—who and what image scan payload can still be trusted right now. This paper introduces NeuroScan AI, a Cyber Governance Layer inserted between every user, device, and upload request on one side and every protected medical asset (radiology databases, diagnostic AI models, cloud services, and patient records) on the other. Under NeuroScan AI, access and diagnostic inference requests are continuously evaluated and scored rather than passively logged. The operational architecture executes a continuous five-stage lifecycle—Observe, Govern, Preserve, Contain, and Recover—driven by a Governance Engine, a Dynamic Trust Engine that scores User-Device-Application-Asset relationships as living, mutable graph edges, an immutable Flight Recorder for forensic logging, an OpenCV-based Risk Intelligence Engine, a State Preservation Engine, a Cyber Circuit Breaker for fine-grained trust edge severance, a Confidence Reset Protocol, and a Visual Saliency Deception Engine. Where conventional incident response methods isolate entire servers or collapse medical network segments, NeuroScan AI severs only the specific compromised trust relationships implicated by an artifact or intrusion, preserving hospital workflow continuity while enforcing a strict serverless memory footprint (< 512 MB RAM). Experimental evaluations across 7,023 brain MRI slices demonstrate 96.2% diagnostic accuracy for Gliomas, 93.8% for Meningiomas, 94.5% for Pituitary tumors, and 98.9% specificity for healthy brain parenchyma, while achieving 100% universal format normalization across BMP, TIFF, WEBP, PNG, and JPEG files without local disk persistent storage.

**Index Terms**—*cyber governance, zero trust architecture, dynamic trust graph, out-of-distribution guardrails, clinical decision support systems, circuit breaker pattern, visual saliency, medical image classification, serverless security.*

---

## I. INTRODUCTION

Most modern enterprise medical IT stacks are built from domain-specific specialist tools rather than unified governance platforms. A Picture Archiving and Communication System (PACS) is designed to store, retrieve, and display DICOM images [1]; an Endpoint Detection and Response (EDR) agent monitors clinical workstations for unauthorized process executions [2]; a Data Loss Prevention (DLP) solution inspects outbound data transfers to prevent HIPAA privacy breaches [3]; and a Security Orchestration, Automation, and Response (SOAR) engine waits for external alerts to trigger automated playbooks [4]. While each individual tool performs its narrow task effectively, significant security and operational gaps emerge in the interactions between them. Because these tools are acquired from different vendors, deployed independently, and managed through disparate administrative consoles, an organization's true security and diagnostic posture during a live incident is pieced together reactively after the event. Consequently, no single system retains real-time visibility into the continuous trust relationships connecting medical users, clinical devices, diagnostic applications, and protected healthcare assets.

This architecture vulnerability becomes acute during the critical minutes following an initial perimeter breach, DICOM header spoofing, or corrupted image payload submission. Traditional alert-centric security tools notify system administrators that an anomalous event has taken place, but they fail to actively manage or restrict the live trust edges being exploited by an adversary or malfunctioning automated script. A clinical center may maintain comprehensive log repositories yet lose operational control during a high-stress emergency triage period simply because no control layer is empowered to continuously re-evaluate whether a specific user, endpoint, or API connection should retain access to a given diagnostic asset.

NeuroScan AI addresses this systemic flaw by introducing a Cyber Governance Layer that operates directly between requesting entities (users, devices, client applications) and protected clinical resources (radiology databases, deep learning inference models, electronic health records). Rather than treating access control as a static per-session decision made at login, NeuroScan AI continuously evaluates, updates, and—when threat indicators dictate—selectively severs trust edges in real time. The governing principle of NeuroScan AI is that even a successful system breach or corrupted payload submission must never automatically lead to lateral network control or diagnostic model corruption. While standard Zero Trust Architecture (ZTA) enforces 'never trust, always verify' principles at initial network perimeters [5], NeuroScan AI extends this philosophy into a continuous, graph-structured trust model that evolves dynamically throughout an incident's lifecycle. Furthermore, NeuroScan AI integrates forensic state preservation, surgical containment via a Cyber Circuit Breaker, contrast-enhanced image pre-processing (LAB CLAHE), Med-CoT LLM rules, and visual saliency deception into a unified running loop operating within a strict serverless RAM budget (< 512 MB RAM).

This paper makes the following key technical contributions:
1. Unified Governance Lifecycle Architecture: We introduce a five-stage Observe–Govern–Preserve–Contain–Recover operational cycle that unifies pre-filtering, contrast enhancement, diagnostic triage, containment, and recovery into a single continuous loop.
2. Dynamic Trust Graph Formulation: We present an explicit mathematical model for scoring User-Device-Application-Asset relationships as dynamic, mutable edges whose weights decay under threat indicators and recover during verified benign operations.
3. Surgical Cyber Circuit Breaker: We implement a resilience-engineering circuit breaker pattern that isolates specific compromised trust edges (e.g., cutting a corrupted API upload connection) without shutting down core clinical servers or hospital network subnets.
4. Dual-Layer OOD Guardrails: We combine OpenCV algorithmic pre-filtration (grayscale saturation, line density, corner intensity analysis) with Rule-0 agentic checks to reject non-brain, corrupted, or synthetic image artifacts before model inference.
5. Zero-Disk Memory Stream Pipeline: We engineer an in-memory image normalization and cryptographic FPDF PDF report generation workflow operating entirely within volatile BytesIO memory streams to guarantee HIPAA compliance and serverless compatibility.
6. Comprehensive Empirical Evaluation: We benchmark NeuroScan AI across 7,023 brain MRI slices, demonstrating 96.2% sensitivity for Gliomas, 93.8% for Meningiomas, 94.5% for Pituitary tumors, and 98.9% specificity for healthy brain tissue under < 512 MB RAM constraints.

The remainder of this paper is structured as follows: Section II reviews related literature across CAD systems, Zero Trust frameworks, knowledge graphs, OOD guardrails, and incident response standards. Section III details the system architecture and high-level request flow. Section IV formalizes the Governance Engine and Dynamic Trust Graph model. Section V describes observability and risk scoring engines. Section VI details preservation and circuit breaker mechanics. Section VII presents the Lockdown Protocol and Algorithm 1. Section VIII explains the Deception Engine. Section IX details incident reconstruction and the command dashboard. Section X provides comparative discussion, experimental results, and limitations. Section XI outlines future research directions, and Section XII concludes the paper.

---

## II. RELATED WORK

A. Point-Solution Security & Computer-Aided Diagnosis (CAD)
Enterprise healthcare security operations centers (SOCs) historically rely on Security Information and Event Management (SIEM) systems to aggregate and correlate event logs from disparate clinical network nodes [1]. Although modern SIEM platforms integrate machine learning anomaly detection, they function primarily as passive logging repositories rather than active decision-enforcement engines [1]. Endpoint Detection and Response (EDR) tools extend visibility to individual workstations [2], while Data Loss Prevention (DLP) frameworks inspect outbound network traffic to flag unauthorized data exfiltration [3]. Security Orchestration, Automation, and Response (SOAR) platforms attempt to close the response loop by executing automated scripts upon receiving external alerts [4]. In parallel, Computer-Aided Diagnosis (CAD) research has produced high-performing deep learning models (e.g., VGG-16, ResNet-50, DenseNet, MobileNet) for brain MRI classification [21]–[27]. However, standalone CAD models operate as isolated inference endpoints without built-in security guardrails or dynamic trust evaluation. NeuroScan AI does not replace existing CAD models or security tools; rather, it acts as an overarching governance layer that ingests telemetry from these sources and enforces real-time access and diagnostic containment decisions.

B. Zero Trust Architecture & Dynamic Trust Models
The NIST Special Publication 800-207 defines Zero Trust Architecture (ZTA) around three central components: a Policy Engine (PE), a Policy Administrator (PA), and a Policy Enforcement Point (PEP) [5]. Together, these components evaluate access requests without granting implicit trust based on network location [5]. However, empirical surveys reveal that most commercial ZTA implementations evaluate trust only once at session initiation, failing to monitor evolving behavior throughout an active connection [6]. Academic trust literature divides into credential-based models (which grant permissions based on static role definitions) and reputation-based models (which infer trust from historical interaction patterns) [7]. NeuroScan AI synthesizes both paradigms: its Governance Engine evaluates policy rules at request time, while its Dynamic Trust Engine maintains a continuously updated reputation score for every entity in the clinical network.

C. Attack Graphs, Knowledge Graphs, & Medical Decision Trees
Modeling security relationships as dynamic graphs rather than isolated event logs has a rich history in computer science. Attack graph frameworks map potential vulnerability chains that an adversary might exploit to reach sensitive target assets [8]. Cybersecurity knowledge graphs link network entities, software vulnerabilities, and observed indicators of compromise to support situational awareness [9]. In medical diagnostics, clinical decision trees and Medical Chain-of-Thought (Med-CoT) reasoning models structure complex diagnostic logic into verifiable rule sequences [30]. NeuroScan AI adapts graph modeling for real-time governance: its Dynamic Trust Graph represents users, devices, applications, and medical assets as living nodes connected by mutable trust edges that update on every transaction.

D. Deception-Based Defense & Out-of-Distribution (OOD) Guardrails
Cyber deception techniques—including honeyfiles, decoy user credentials, and synthetic service endpoints—mislead adversaries while capturing actionable threat intelligence [10]. Moving Target Defense (MTD) dynamically alters system parameters (such as IP addresses, memory layouts, or configuration settings) to increase adversarial effort [11], [12]. In machine learning, Out-of-Distribution (OOD) guardrails detect and filter out non-target inputs (such as corrupted images, noise arrays, or out-of-domain samples) before model processing [16]. NeuroScan AI integrates deception and OOD filtration directly into its governance cycle: non-brain or corrupted scan uploads trigger algorithmic OOD containment, while high-risk access attempts are diverted to a visual saliency deception engine that generates localized Grad-CAM heatmaps without exposing core diagnostic assets.

E. Forensic Preservation, Zero-Disk Memory Streams, & Compliance Standards
NIST SP 800-61 Rev. 2 structures computer security incident handling into four phases: Preparation, Detection & Analysis, Containment, Eradication & Recovery, and Post-Incident Activity [13]. Digital identity guidelines (NIST SP 800-63B) mandate strict authentication lifecycles and credential management [14], while tamper-evident audit trails ensure log integrity [15]. In healthcare computing, HIPAA mandates strict data privacy, prohibiting unencrypted persistent storage of Protected Health Information (PHI). NeuroScan AI adheres to these standards through its State Preservation Engine, zero-disk memory stream pipeline (`BytesIO`), automated FPDF cryptographic PDF report generation, and immutable Supabase telemetry audit logging.

---

## III. NEUROSCAN AI SYSTEM ARCHITECTURE

A. Design Philosophy
NeuroScan AI operates not as a static linear pipeline, but as an active, closed-loop state machine. The core system architecture executes a continuous five-stage operational cycle—Observe, Govern, Preserve, Contain, and Recover—that runs perpetually across the managed enterprise environment:
• Observe: Telemetry streams, DICOM upload payloads, network connection logs, and user interaction events are continuously ingested and parsed in memory.
• Govern: Every access and diagnostic inference request is evaluated against policy rules and current Dynamic Trust Graph edge scores before granting authorization.
• Preserve: When suspicious activity or payload corruption is detected, a zero-disk forensic memory snapshot is recorded prior to executing containment actions.
• Contain: The Cyber Circuit Breaker trips only the specific compromised trust edges (e.g., revoking a single upload session) while maintaining overall system operational continuity.
• Recover: Automated identity reset, contrast enhancement (LAB CLAHE), Med-CoT triage, and zero-disk FPDF audit report generation restore the system to a clean operating state.

B. High-Level Processing Pipeline & Component Flow
NeuroScan AI physically sits as a Cyber Governance Layer between client entities (radiologists, hospital workstations, automated upload API scripts) and protected diagnostic resources. The detailed request processing pipeline operates through six interconnected modules:

1. Universal Image Format Normalizer: Ingests raw binary file streams (.bmp, .tiff, .webp, .png, .jpg, .jpeg), decoding them via OpenCV (`cv2.imdecode`) with a PIL fallback engine into standardized 3-channel RGB array buffers without writing temporary files to disk.

2. Dual-Layer OOD Pre-Filter: Evaluates algorithmic image characteristics using grayscale saturation metrics, Sobel line edge density, and corner intensity variance. Non-brain images (such as landscape photos, text documents, or synthetic noise) are intercepted at Rule-0 and rejected with an explicit out-of-distribution error.

3. Contrast Enhancement Engine: Applies a (3 x 3) Gaussian anti-artifact filter followed by conversion to LAB color space. The lightness ($L$) channel undergoes Contrast Limited Adaptive Histogram Equalization (CLAHE) with a clip limit of 2.0 and tile grid size of (8 x 8) to amplify low-contrast brain lesion boundaries.

4. Multi-Class Lesion Classifier & Grad-CAM Saliency Engine: Passes the enhanced image array through deep convolutional feature extractors to classify slices into four mutually exclusive categories (Glioma, Meningioma, Pituitary, or Healthy No-Tumor). Concurrently, a Sobel-gradient visual saliency map generates localized heatmaps ($COLORMAP\_JET$) highlighting tumor ROI boundaries.

5. Med-CoT Reasoning Engine & Confidence Override: Evaluates classification probabilities using Medical Chain-of-Thought priority rules. The Null Hypothesis ($No\_Tumor$) is given priority under borderline features. If the top class confidence falls below 75%, the engine overrides the output to 'Inconclusive - Requires Radiologist Review' to prevent automated diagnostic errors.

6. Zero-Disk Report Generation & Telemetry Persistence: Generates a multi-page clinical PDF report using in-memory `fpdf2` `BytesIO` streams, embedding diagnostic findings, confidence scores, Grad-CAM heatmaps, and cryptographic SHA-256 hashes before logging telemetry asynchronously to a Supabase database.

---

## IV. GOVERNANCE ENGINE AND DYNAMIC TRUST GRAPH

A. Governance Engine & Policy Verdicts
The Governance Engine functions as the primary decision-making authority within NeuroScan AI. For every incoming request $r$, the engine inspects the requesting entity $i$, associated device $d$, target medical asset $a$, request context, and current trust state. The Governance Engine outputs one of four discrete verdicts:
• Allow: Request is fully authorized; normal processing and diagnostic inference proceed.
• Restrict: Request is granted with restricted permissions (e.g., read-only access without download capabilities).
• Warn: Request is permitted but generates an elevated audit log entry and prompts two-factor verification.
• Block: Request is denied; the associated trust edge is severed, and containment protocols are initiated.

B. Dynamic Trust Engine & Formal Update Model
Rather than relying on static role definitions, NeuroScan AI maintains a dynamic numerical trust score $T_i(t) \in [0, 100]$ for every entity $i$ at discrete time step $t$. The trust score updates according to the following mathematical formulation:

T_i(t+1) = clip( T_i(t) + η_r R_i(t) (1 - T_i(t)/100) - Σ_{k ∈ E_i(t)} η_p^{(k)} c_a(k) - λ (T_i(t) - T_0) I_idle, 0, 100 )    (1)

Where:
• $T_i(t)$ represents the current trust score of entity $i$.
• $R_i(t) \in \{0, 1\}$ is a binary indicator denoting whether interaction at step $t$ was verified as legitimate.
• $\eta_r = 2.5$ is the trust reward rate, subject to diminishing returns via factor $(1 - T_i(t)/100)$ as trust approaches 100.
• $E_i(t)$ represents the set of suspicious event categories observed for entity $i$ at step $t$ (e.g., OOD file submission, invalid header, access policy violation).
• $\eta_p^{(k)}$ denotes the base penalty weight assigned to suspicious event category $k$.
• $c_a(k) \in \{1.0, 1.5, 2.0, 3.0\}$ is the asset criticality multiplier corresponding to Public ($c_a=1.0$), Internal ($c_a=1.5$), Confidential ($c_a=2.0$), and Critical ($c_a=3.0$) assets.
• $\lambda = 0.05$ is the decay rate nudging inactive entities back toward baseline default trust $T_0 = 70$ when $I_idle = 1$.

C. Dynamic Trust Graph Model
The system models enterprise relationships as a directed graph $G = (V, E, W)$, where vertices $V$ represent Users, Devices, Client Applications, and Protected Medical Assets. Edges $E$ represent directional trust relationships, with weight matrix $W$ storing current trust scores $T_i(t)$, edge status (Active, Monitored, Compromised, Severed), and historical risk logs. When a user requests access to an MRI scan database via a specific workstation, the overall request authorization depends on the joint weight path across the User -> Device -> Application -> Asset subgraph.

D. Enterprise Access Manager (EAM)
The Enterprise Access Manager (EAM) enforces Role-Based Access Control (RBAC) policies across clinical roles (e.g., Senior Radiologist, Attending Physician, Research Intern). If an entity attempts an unauthorized operation (e.g., an intern requesting bulk raw DICOM exfiltration), the EAM generates a policy violation event $k \in E_i(t)$, which feeds directly into Equation (1) to reduce the entity's trust score.

E. Asset Classification Engine
Medical assets are automatically categorized into four risk tiers based on data sensitivity and clinical impact:
• Public Tier ($c_a = 1.0$): De-identified research metadata and public educational documentation.
• Internal Tier ($c_a = 1.5$): General hospital operational logs and non-sensitive administrative files.
• Confidential Tier ($c_a = 2.0$): Standard patient Electronic Health Records (EHR) and anonymized scan archives.
• Critical Tier ($c_a = 3.0$): Active diagnostic MRI scans, live AI inference endpoints, and master patient index databases.

---

## V. OBSERVABILITY AND RISK INTELLIGENCE

A. Flight Recorder Engine
The Flight Recorder Engine maintains a continuous, immutable telemetry log of all system activity across the enterprise. Captured events include user authentication attempts, image file uploads, parameter modifications, model inference calls, circuit breaker activations, and administrative privilege escalations. Every log entry is cryptographically hashed using SHA-256 and stored asynchronously in a Supabase cloud database to prevent retrospective log tampering.

B. Risk Intelligence Engine & Threat Formulations
The Risk Intelligence Engine aggregates system-wide security indicators to calculate a dynamic global threat score $S(t)$:

S(t) = γ S(t-1) + Σ_{k=1}^K w_k I_k(t) + β |A(t)| / 2    (2)

Where:
• $S(t-1)$ is the threat score from the preceding time step, attenuated by exponential decay factor $\gamma = 0.85$.
• $I_k(t) \in \{0, 1\}$ is a binary flag indicating whether risk rule $k$ fired at time $t$.
• $w_k$ represents the assigned weight of indicator $k$ (e.g., OOD image submission $w=15$, rapid repeated login failure $w=10$, low model confidence $w=8$).
• $\beta = 1.2$ is a co-occurrence multiplier scaling with the cardinality of concurrently active anomaly categories $|A(t)|$.

To evaluate localized risk for entity $i$, the engine computes an Effective Threat Score $S_eff,i(t)$, combining global threat context with entity-specific trust:

S_eff,i(t) = S(t) ( 1 + κ ( 1 - T_i(t)/100 ) )    (3)

Where $\kappa = 1.5$ is the trust sensitivity constant governing how low trust scores amplify effective threat scores. Entity access decisions and lockdown triggers are evaluated against $S_eff,i(t)$.

---

## VI. PRESERVATION AND CONTAINMENT

A. State Preservation Engine
When effective threat score $S_eff,i(t)$ crosses pre-set safety thresholds, the State Preservation Engine captures an immediate in-memory forensic snapshot before executing containment. The snapshot records running thread state, memory buffer metadata, active network socket details, recent telemetry entries, and the exact state of the Dynamic Trust Graph $G$. Because state preservation operates entirely within volatile RAM using Python `BytesIO` buffers, zero sensitive health data is written to persistent disk storage, satisfying HIPAA privacy requirements.

B. Cyber Circuit Breaker Architecture
Conventional containment techniques isolate entire servers or disconnect whole hospital subnets, causing severe operational disruption to clinical workflows. NeuroScan AI solves this by introducing a Cyber Circuit Breaker modeled after software resilience patterns [17]. When an anomaly or corrupted payload is detected, the Cyber Circuit Breaker trips only the specific compromised trust edge (e.g., severing the User -> Asset edge for session $s$) while leaving all other active user sessions and background database services unaffected.

---

## VII. NEUROSCAN AI LOCKDOWN PROTOCOL

When effective threat score $S_eff,i(t)$ exceeds critical threshold $\tau_r = 85$, NeuroScan AI automatically executes a five-phase Lockdown Protocol:
Phase 1: State Preservation (capture zero-disk forensic memory snapshot).
Phase 2: Trust Severance (trip Cyber Circuit Breaker on compromised graph edges).
Phase 3: Asset Protection (escalate target asset encryption and lock access points).
Phase 4: Identity Reset (revoke active tokens, force credential rotation).
Phase 5: Deception Deployment (divert suspicious connection to visual saliency honeyfile engine).

Algorithm 1 formalizes the continuous evaluation and lockdown logic:

Algorithm 1: Continuous Observe-Govern-Preserve-Contain-Recover Protocol
Require: Event e; entity i; Trust Graph G; threat score S; thresholds τ_y=35, τ_o=60, τ_r=85
Ensure: Governance decision d; lockdown flag ℓ
 1: S <- γS + Δ(e)  {Eq. (2): decay, add indicators + correlation bonus}
 2: Update T_i for every entity i touched by e {Eq. (1)}
 3: S_eff,i <- S(1 + κ(1 - T_i/100)) {Eq. (3)}
 4: if S_eff,i >= τ_r then
 5:     ℓ <- true; StatePreservation(); CircuitBreaker(G); IdentityReset(); DeceptionDeployment(); d <- Block
 6: else if S_eff,i >= τ_o then d <- Restrict
 7: else if S_eff,i >= τ_y then d <- Warn
 8: else d <- Allow
 9: end if
10: return (d, ℓ)

A. Identity Reset & Clinical Confidence Override Protocol
If an authenticated user identity is implicated in a security anomaly, the Identity Reset Protocol invalidates active JWT tokens, revokes active sessions, and demands multi-factor re-authentication [14]. In the diagnostic inference domain, if the deep learning model's top class confidence falls below 75% ($C_max < 0.75$), the protocol overrides the classification output to 'Inconclusive - Requires Radiologist Review', routing the scan to a senior radiologist for manual inspection.

---

## VIII. DECEPTION ENGINE

The Deception Engine acts as the fifth phase of the Lockdown Protocol. When a suspicious entity or corrupted upload script is blocked by the Governance Engine, the system does not simply drop the connection. Instead, it seamlessly reroutes the request to a controlled deception environment containing decoy medical records, synthetic DICOM files, and automated visual saliency generators [10]–[12]. The deception environment generates localized Grad-CAM heatmaps ($COLORMAP\_JET$) overlaid on synthetic background scans, keeping the adversary engaged while the Flight Recorder logs detailed forensic metrics regarding the adversary's techniques, tactics, and procedures (TTPs).

---

## IX. INCIDENT RECONSTRUCTION AND GOVERNANCE COMMAND CENTER

A. Incident Reconstruction Engine
Following an incident or diagnostic session, the Incident Reconstruction Engine correlates Flight Recorder logs with preserved memory snapshots to assemble a chronological audit report [13], [15]. The engine utilizes an in-memory `fpdf2` PDF generation script to render multi-page diagnostic and security summary documents. Each PDF includes patient metadata, input scan previews, contrast-enhanced images, Grad-CAM saliency heatmaps, Med-CoT diagnostic reasoning steps, confidence breakdown bar charts, and cryptographic SHA-256 verification hashes.

B. Governance Command Center SPA Interface
NeuroScan AI provides a Single Page Application (SPA) Governance Command Center built with high-contrast glassmorphic clinical styling. The interface features three toggleable views:
1. Diagnostic View: Provides real-time image upload, instant format normalization, CLAHE pre-processing toggle, Grad-CAM visualization, and live PDF report download.
2. View Analytics: Displays real-time system performance metrics, class distribution breakdown via Chart.js, average inference latency, and trust score distribution gauges.
3. View History: Renders an interactive historical audit table pulling directly from Supabase, allowing clinicians to review past patient scans, inspect confidence scores, and download past diagnostic reports.

---

## X. DISCUSSION

A. Comparative Positioning & TABLE I Matrix
Table I provides a detailed comparative analysis of NeuroScan AI against conventional CAD classifiers, standard cloud CDSS platforms, and traditional SIEM/SOAR security solutions.

TABLE I: Comprehensive Comparison of NeuroScan AI with Existing Architectural Paradigms
----------------------------------------------------------------------------------------------------------------------
Dimension           | Standalone CAD [21]    | Cloud CDSS [30]       | SIEM / SOAR [1], [4]  | NeuroScan AI (Proposed)
----------------------------------------------------------------------------------------------------------------------
Primary Scope       | Single-slice CNN      | Cloud REST API        | Log correlation       | Unified Clinical Governance
Trust Model         | Static softmax        | Fixed confidence      | Static rule engine    | Continuous Dynamic Trust Graph
Containment Unit    | None (passes raw output)| Error exception crash | Host / subnet isolation| Surgical Trust Edge Severance
OOD Guardrails      | Vulnerable to artifacts| Basic header check    | Not addressed         | Dual Algorithmic & Rule-0
Memory & Storage    | Requires disk cache   | High RAM cloud cluster| Disk-heavy logging    | Zero-Disk Memory Stream (<512MB)
Deception Capability| Absent                 | Absent                | Optional honeypot     | Native Saliency Deception
----------------------------------------------------------------------------------------------------------------------

B. Experimental Validation & Benchmarks
NeuroScan AI was benchmarked on a standardized dataset of 7,023 brain MRI slices categorized into four classes: Glioma (1,621 scans), Meningioma (1,645 scans), Pituitary Tumor (1,757 scans), and Healthy No-Tumor (2,000 scans). Preprocessing via LAB CLAHE improved lesion boundary contrast by 23.4% over raw grayscale images. The classification model achieved 96.2% sensitivity for Gliomas, 93.8% for Meningiomas, 94.5% for Pituitary tumors, and 98.9% specificity for healthy parenchyma. Universal format normalization demonstrated 100% success across BMP, TIFF, WEBP, PNG, and JPEG formats, maintaining an average end-to-end processing latency of 342 ms under serverless cloud constraints (< 512 MB RAM).

C. Limitations
Despite its strong performance, NeuroScan AI has specific limitations. First, rule-based scoring parameters ($\eta_r, \eta_p, \lambda, \gamma, \beta, \kappa$) require empirical tuning against large-scale clinical attack datasets. Second, micro-adenomas smaller than 3 mm may fall below Sobel Grad-CAM visual saliency detection thresholds, requiring high-resolution 3T MRI volumetric sequences. Third, serverless RAM constraints (< 512 MB) limit concurrent batch processing to 16 simultaneous scan streams.

---

## XI. FUTURE SCOPE

Future work on NeuroScan AI will expand across three key frontiers:
1. 3D DICOM Volumetric Segmentation: Extending 2D slice classification to 3D volumetric UNet and Transformer architectures for multi-planar tumor volume estimation.
2. Federated Cross-Hospital Privacy Training: Implementing privacy-preserving federated learning protocols across hospital networks to update model weights without centralized patient data aggregation.
3. Web-Based DICOM WADO-RS Integration: Native integration with DICOM Web standards (WADO-RS, STOW-RS) to allow direct browser streaming from enterprise hospital PACS servers.

---

## XII. CONCLUSION

This paper presented NeuroScan AI, a novel Cyber Governance Layer for brain tumor detection that replaces fragmented security point-solutions and static CAD models with a dynamic, graph-structured trust governance architecture. By executing a continuous Observe–Govern–Preserve–Contain–Recover operational cycle, NeuroScan AI achieves continuous trust management, dual-layer OOD payload filtration, surgical Cyber Circuit Breaker containment, zero-disk memory streaming (< 512 MB RAM), and automated cryptographic PDF report generation. Experimental validation across 7,023 MRI scans confirms high diagnostic precision (96.2% Glioma sensitivity, 98.9% No-Tumor specificity) while maintaining complete operational continuity and HIPAA-compliant data privacy.

---

## REFERENCES

[1] G. Gonzalez-Granadillo, S. Gonzalez-Zarzosa, and R. Diaz, 'Security information and event management (SIEM): Analysis, trends, and usage in critical infrastructures,' Sensors, vol. 21, no. 14, Art. no. 4759, 2021.
[2] H. Kaur et al., 'Evolution of endpoint detection and response (EDR) in cyber security: A comprehensive review,' E3S Web of Conferences, vol. 86, 2024.
[3] S. Alneyadi, E. Sithirasenan, and V. Muthukkumarasamy, 'A survey on data leakage prevention systems,' Journal of Network and Computer Applications, vol. 62, pp. 137–152, Feb. 2016.
[4] U. Bartwal, S. Mukhopadhyay, R. Negi, and S. Shukla, 'Security orchestration, automation, and response engine for deployment of behavioural honeypots,' in Proc. IEEE Conf. Dependable and Secure Computing (DSC), 2022.
[5] S. Rose, O. Borchert, S. Mitchell, and S. Connelly, 'Zero trust architecture,' NIST Special Publication 800-207, National Institute of Standards and Technology, Gaithersburg, MD, USA, Aug. 2020.
[6] N. F. Syed, S. W. Shah, A. Shaghaghi, A. Anwar, Z. Baig, and R. Doss, 'Zero trust architecture (ZTA): A comprehensive survey,' IEEE Access, vol. 10, pp. 57143–57179, 2022.
[7] D. Artz and Y. Gil, 'A survey of trust in computer science and the Semantic Web,' Web Semantics: Science, Services and Agents on the World Wide Web, vol. 5, no. 2, pp. 58–71, 2007.
[8] O. Sheyner, J. Haines, S. Jha, R. Lippmann, and J. M. Wing, 'Automated generation and analysis of attack graphs,' in Proc. IEEE Symp. Security and Privacy, 2002, pp. 273–284.
[9] Y. Han and A. Li, 'A survey on cybersecurity knowledge graph construction,' Computers & Security, vol. 125, Art. no. 103524, 2023.
[10] X. Han, N. Kheir, and D. Balzarotti, 'Deception techniques in computer security: A research perspective,' ACM Computing Surveys, vol. 51, no. 4, pp. 1–36, Jul. 2018.
[11] S. Jajodia, A. K. Ghosh, V. Swarup, C. Wang, and X. S. Wang, Eds., Moving Target Defense: Creating Asymmetric Uncertainty for Cyber Threats, Advances in Information Security, vol. 54. New York, NY, USA: Springer, 2011.
[12] J.-H. Cho et al., 'Toward proactive, adaptive defense: A survey on moving target defense,' IEEE Communications Surveys & Tutorials, vol. 22, no. 1, pp. 709–745, 2020.
[13] P. Cichonski, T. Millar, T. Grance, and K. Scarfone, 'Computer security incident handling guide,' NIST Special Publication 800-61 Revision 2, National Institute of Standards and Technology, Gaithersburg, MD, USA, Aug. 2012.
[14] P. A. Grassi et al., 'Digital identity guidelines: Authentication and lifecycle management,' NIST Special Publication 800-63B, National Institute of Standards and Technology, Gaithersburg, MD, USA, Jun. 2017.
[15] A. Ahmad, M. Saad, M. Al Ghamdi, D. Nyang, and D. Mohaisen, 'BlockTrail: A service for secure and transparent blockchain-driven audit trails,' IEEE Systems Journal, vol. 16, no. 1, pp. 1367–1378, Mar. 2022.
[16] S. Neupane et al., 'Explainable intrusion detection systems (X-IDS): A survey of current methods, challenges, and opportunities,' IEEE Access, vol. 10, pp. 112392–112415, 2022.
[17] M. T. Nygard, Release It!: Design and Deploy Production-Ready Software, 2nd ed. Raleigh, NC, USA: Pragmatic Bookshelf, 2018.
[18] M. Shamini, et al., 'A Multimodal Deep Learning Approach for Predicting Dementia's Disease Progression Using MRI Clinical Data,' 2025 International Conference on Data Science, Agents & Artificial Intelligence (ICDSAAI), IEEE, 2025.
[19] S. Murugavalli, L. Jabasheela, and V. Anitha, 'Ceaseless Steganographic Approaches in Machine Learning,' Measurement: Sensors, vol. 25, 2023, p. 100622.
[20] M. Therasa and G. Mathivanan, 'Survey of Machine Reading Comprehension Models and Its Evaluation Metrics,' 2022 6th International Conference on Computing Methodologies and Communication (ICCMC), IEEE, 2022.
[21] S. Deepak and P. M. Ameer, 'Brain tumor classification using deep CNN features via transfer learning,' Computers in Biology and Medicine, vol. 111, p. 103345, 2019.
[22] J. Amin et al., 'Brain tumor detection and classification using Gaussian filtering and deep features reduction,' Microprocessors and Microsystems, vol. 80, p. 103362, 2021.
[23] M. S. Majib et al., 'VGG-SCNet: A VGG-16 based deep learning framework for brain tumor detection,' IEEE Access, vol. 9, pp. 116934–116947, 2021.
[24] H. Mohsen et al., 'Classification using deep learning neural networks for brain tumors,' Future Computing and Informatics Journal, vol. 3, no. 1, pp. 68–71, 2018.
[25] A. Ismael and A. Abdel-Qader, 'Brain tumor classification using sparse coding and dictionary learning,' IEEE Access, vol. 6, pp. 77244–77254, 2018.
[26] Z. N. K. Swati et al., 'Brain tumor classification for MR images using transfer learning and fine-tuning,' Computerized Medical Imaging and Graphics, vol. 75, pp. 34–46, 2019.
[27] M. T. Reshi et al., 'An efficient deep learning approach for brain tumor detection and classification,' IEEE Access, vol. 10, pp. 83884–83896, 2022.
[28] R. R. Selvaraju et al., 'Grad-CAM: Visual explanations from deep networks via gradient-based localization,' IEEE Transactions on Pattern Analysis and Machine Intelligence, vol. 42, no. 2, pp. 336–349, 2020.
[29] K. Zuiderveld, 'Contrast limited adaptive histogram equalization,' Graphics Gems IV, Academic Press Professional, Inc., pp. 474–485, 1994.
[30] E. T. Yatsenko et al., 'Zero-shot clinical decision support with vision-language models,' IEEE Journal of Biomedical and Health Informatics, vol. 27, no. 8, pp. 3840–3851, 2023.
