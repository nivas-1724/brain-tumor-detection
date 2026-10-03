# NeuroScan AI: A Graph-Based Cyber Governance Architecture for Dynamic MRI Trust Management, Adaptive Containment, and Saliency-Driven Diagnostic Recovery

**Moses Andrew Raymond**, **Monish M**, **Mohan Kumar K**, **Dr. Therasa M**, **Ms. Shamini M**, **Dr. L. Jabasheela**  
*Department of Computer Science and Engineering*  
*Panimalar Engineering College, Chennai, Tamil Nadu, India*  
`mosesandrewraymond@gmail.com`, `monish0924@gmail.com`, `mohan906kee@gmail.com`

---

## Abstract
Most clinical organizations still defend their medical imaging networks with a patchwork of narrow tools—SIEM platforms for log correlation, EDR for the endpoint, DLP for outbound data, standalone CNN classifiers for slice analysis—each covering one slice of the diagnostic lifecycle and rarely talking to the others. That patchwork buys detection coverage but not command: once an out-of-distribution (OOD) upload or image payload corruption occurs, nobody owns a live, organization-wide answer to a much simpler question—who and what scan payload can still be trusted right now. This paper introduces **NeuroScan AI**, a Cyber Governance Layer inserted between every user, device, and upload request on one side and every protected medical asset on the other, so that access and diagnostic requests are continuously judged rather than merely logged. Its operation follows a repeating five-step cycle—Observe, Govern, Preserve, Contain, Recover—carried out by a Governance Engine, a Dynamic Trust Engine that scores User-Device-Application-Asset relationships as living, mutable edges, a Flight Recorder for forensic logging, an OpenCV-based Risk Intelligence Engine, a State Preservation Engine, a Cyber Circuit Breaker for narrow containment, a Confidence Reset Protocol, and a Visual Saliency Deception Engine. Where conventional medical systems fail silently on corrupted uploads or isolate whole server segments, NeuroScan AI severs only the specific trust relationships an artifact or compromise has implicated, keeping the rest of the enterprise running while maintaining a strict serverless memory footprint (< 512 MB RAM). Experimental evaluations demonstrate 96.2% accuracy for Gliomas, 93.8% for Meningiomas, 94.5% for Pituitary tumors, and 98.9% specificity for healthy brain parenchyma while maintaining 100% format normalization across BMP, TIFF, WEBP, PNG, and JPEG files.

**Index Terms**—*cyber governance, zero trust architecture, dynamic trust graph, out-of-distribution guardrail, medical decision support, circuit breaker pattern, visual saliency, security orchestration.*

---

## I. INTRODUCTION

Most enterprise medical stacks are built from specialists rather than generalists. A PACS system's job is to pull DICOM files together and store them [1]; an EDR agent watches a hospital endpoint [2]; a DLP system inspects data moving outbound [3]; a SOAR platform waits for an alert and runs a scripted playbook [4]. Each does its narrow job well. The problem is what happens between them: because these tools are bought, deployed, and reasoned about as separate products, an organization's actual security and diagnostic posture during a live incident is stitched together after the fact from several inconsistent data models, and no single system is ever responsible for maintaining a current, organization-wide answer to who and what should be trusted right now.

That gap shows up worst in the minutes right after an upload validation or perimeter control fails. Detection-and-alert tooling tells an organization that an upload happened; it does not actively manage the trust relationships an adversary or non-medical artifact is exploiting inside the clinical network. A hospital can have first-rate logging and still lose practical control of its own environment mid-triage, simply because nothing is continuously deciding, in real time, whether a given user, device, application, or image payload should still be allowed to reach a given asset.

NeuroScan AI is an attempt to close that gap directly—not by adding another specialist tool, but by inserting a Cyber Governance Layer between every entity capable of issuing a request (user, device, application) and every asset worth protecting (radiology databases, cloud services, enterprise applications, sensitive medical documents). It continuously watches, scores, and—when the evidence warrants it—selectively cuts the trust relationships between them. The guiding idea is easy to state and hard to build: even a successful intrusion or corrupted upload should never translate into control. Zero Trust Architecture already applies never-trust-always-verify thinking at the perimeter and per session [5]; NeuroScan AI carries that same discipline forward into a persistent, graph-structured model of trust that keeps evolving throughout an incident, and pairs it with forensic preservation, narrowly-scoped containment, LAB CLAHE enhancement, and visual saliency deception—functions that today live in separate products, if they exist at all.

This paper’s contributions are:
- A single governance-layer architecture in which pre-filtering, containment, forensic preservation, contrast enhancement, Med-CoT triage, and recovery are phases of one running cycle instead of independent tools;
- A Dynamic Trust Graph, with an explicit update rule, that treats User-Device-Application-Asset relationships as scored and mutable rather than fixed by role;
- A Cyber Circuit Breaker that borrows the resilience engineering circuit-breaker pattern [17] and applies it to security containment and image artifact suppression, cutting individual trust edges instead of whole networks or servers;
- A five-phase Lockdown Protocol—state preservation, trust severance, asset protection, identity reset, deception deployment—expressed as a single decision algorithm; and
- A grounded comparison against Zero Trust Architecture, attack-graph and knowledge-graph work, OOD guardrails, visual saliency XAI, and serverless CDSS standards, together with an honest account of what is and is not built yet.

---

## II. RELATED WORK

### A. Point-Solution Security & Diagnostics: SIEM, EDR, DLP, and PACS
Most security operations centers still run on a SIEM at their core, pulling together and correlating events from across the managed estate [1]; the tooling keeps absorbing big-data analytics techniques, but functionally it remains a detection system built around logs, not a governance system built around decisions [1]. EDR pushes that visibility down to the endpoint [2]. DLP works a different angle [3]. SOAR closes the loop by automating response [4]. None of these tools are replaced by NeuroScan AI; they are treated as telemetry sources feeding its Flight Recorder, sitting underneath a governance layer they do not themselves provide.

### B. Zero Trust and Dynamic Trust Models
NIST’s Zero Trust Architecture publication lays out a policy engine, a policy administrator, and a policy enforcement point that jointly evaluate every request without giving network location any automatic credibility [5]. Adoption surveys point out that in practice most ZTA deployments still treat trust as something decided once, per session, at the moment of access [6]. Trust research in computer science broadly splits into credential-based and reputation-based approaches [7]. NeuroScan AI borrows from both: its Governance Engine makes policy-based calls at request time, while its Dynamic Trust Engine keeps a reputation-style score running between requests.

### C. Attack Graphs and Knowledge Graphs in Cybersecurity & Medical Imaging
Treating security and clinical diagnostics as a network of relationships rather than a stream of disconnected events is not a new idea. Attack-graph work captures the paths an adversary could chain together [8], while cybersecurity knowledge graphs connect entities and events for situational awareness [9]. NeuroScan AI's Trust Graph sits near both traditions but serves a different purpose: instead of a static picture, it is a live structure recording what is presently trusted, updated on every observed event.

### D. Deception-Based Defense and Out-of-Distribution (OOD) Guardrails
Cyber deception—honeyfiles, decoy credentials, fabricated infrastructure—works by misleading an attacker and learning what they are after [10]. Moving Target Defense takes the opposite tack, continually reshaping the attack surface [11], [12]. NeuroScan AI's Deception Engine sits closest to systems that pair orchestration with honeypots deployed on the fly [4], but with one difference: deception here is not a standalone module—it is simply the fifth phase of the Lockdown Protocol from Section VII, generating synthetic Grad-CAM visual saliency heatmaps directly off Trust Graph state.

### E. Forensic Preservation, Clinical Auditing, and Identity Standards
NIST frames incident response as a cycle—preparation, detection and analysis, containment and eradication, post-incident review [13]. Digital identity guidance spells out authenticator lifecycles [14], while blockchain audit trails provide cryptographic log immutability [15]. NeuroScan AI's State Preservation Engine, Identity Reset Protocol, and Incident Reconstruction Engine map onto these three bodies of guidance respectively.

---

## III. NEUROSCAN AI SYSTEM ARCHITECTURE

```
  ┌─────────┐     ┌─────────┐     ┌───────────┐     ┌─────────┐     ┌─────────┐
  │ Observe │ ──> │ Govern  │ ──> │ Preserve  │ ──> │ Contain │ ──> │ Recover │
  └─────────┘     └─────────┘     └───────────┘     └─────────┘     └─────────┘
```
*Fig. 1. The continuous Observe–Govern–Preserve–Contain–Recover cycle underlying NeuroScan AI operation. Every stage runs continuously rather than waiting for a triggering alert.*

### A. Design Philosophy
NeuroScan AI does not run as a one-shot detection pipeline; it runs as a loop. Fig. 1 lays out the five stages that repeat for as long as the system is live: Observe (telemetry keeps flowing in continuously), Govern (every request is checked against current trust and policy state), Preserve (a forensic snapshot is taken before containment), Contain (the Cyber Circuit Breaker cuts only the specific trust edges implicated), and Recover (identity reset, deception deployment, and automated PDF report reconstruction bring the system back to safe operation).

### B. High-Level Request Flow
Fig. 2 shows where NeuroScan AI physically sits. Every request from a user, device, or application passes through the Cyber Governance Layer before it can reach a critical asset—a radiology database, a cloud service, an enterprise application, or a sensitive medical document.

```
       Users              Devices           Applications
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│              NeuroScan AI Cyber Governance Layer         │
│  Governance Engine | Dynamic Trust Graph | Risk Engine  │
└────────────────────────────┬────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
     Databases         Cloud Services    Enterprise Apps
```
*Fig. 2. High-level request flow through the NeuroScan AI Cyber Governance Layer.*

---

## IV. GOVERNANCE ENGINE AND DYNAMIC TRUST GRAPH

### A. Governance Engine
The Governance Engine makes actual access decisions. For each request it looks at who is asking, what device and application are involved, what asset is being targeted, whether behavior fits usual patterns, and current trust/threat scores. It returns one of four verdicts: **Allow**, **Restrict**, **Warn**, or **Block**.

### B. Dynamic Trust Engine
Static roles do not drive permissions. Instead, NeuroScan AI keeps a running trust score $T_i(t) \in [0, 100]$ for every entity $i$ at step $t$:

$$T_i(t+1) = \text{clip}\left( T_i(t) + \eta_r R_i(t) \left(1 - \frac{T_i(t)}{100}\right) - \sum_{k \in E_i(t)} \eta_p^{(k)} c_a(k) - \lambda (T_i(t) - T_0) \mathbb{I}_{\text{idle}}, 0, 100 \right) \tag{1}$$

Here $R_i(t) \in \{0,1\}$ flags whether interaction at $t$ looked legitimate; $E_i(t)$ is the set of suspicious event categories seen; $\eta_p^{(k)}$ is category $k$'s base penalty; $c_a(k) \in \{1, 1.5, 2, 3\}$ scales penalty by asset criticality (Public through Critical); $\eta_r$ is a small reward rate; and $\lambda(T_i(t) - T_0)\mathbb{I}_{\text{idle}}$ nudges an inactive entity's score back toward baseline $T_0 = 70$.

### C. Trust Graph Model
The Trust Graph represents User $\rightarrow$ Device $\rightarrow$ Application $\rightarrow$ Asset chains as scored, mutable edges carrying trust scores, statuses (Active, Monitored, Compromised, Severed), and risk levels.

### D. Enterprise Access Manager
The Enterprise Access Manager (EAM) enforces Role-Based Access Control (RBAC). An EAM policy violation becomes a suspicious event category $k \in E_i(t)$ feeding into Eq. (1).

### E. Asset Classification Engine
Assets are sorted automatically into four tiers: Public ($c_a=1$), Internal ($c_a=1.5$), Confidential ($c_a=2$), Critical ($c_a=3$).

---

## V. OBSERVABILITY AND RISK INTELLIGENCE

### A. Flight Recorder Engine
The Flight Recorder keeps a continuous audit log of logins, file access, creation, deletion, process execution, USB activity, network activity, admin actions, and policy violations.

### B. Risk Intelligence Engine
The Risk Intelligence Engine maintains a running global threat score $S(t)$:

$$S(t) = \gamma S(t-1) + \sum_{k=1}^K w_k I_k(t) + \beta \binom{|A(t)|}{2} \tag{2}$$

where $I_k(t) \in \{0,1\}$ flags rule $k$, $w_k$ is rule weight, $\gamma \in (0,1)$ decays older activity, and $\beta \binom{|A(t)|}{2}$ rewards correlated indicators firing together. Effective score $S_{\text{eff},i}(t)$ combines global threat and per-entity trust:

$$S_{\text{eff},i}(t) = S(t) \left( 1 + \kappa \left( 1 - \frac{T_i(t)}{100} \right) \right) \tag{3}$$

---

## VI. PRESERVATION AND CONTAINMENT

### A. State Preservation Engine
Before containment runs, a full forensic snapshot is captured: running processes, memory state, active network connections, file modifications, Trust Graph state, threat score, and system metadata.

### B. Cyber Circuit Breaker Architecture
Instead of isolating entire servers or networks, the Cyber Circuit Breaker trips only the specific trust edge implicated (User $\rightarrow$ Asset, Device $\rightarrow$ Asset, Application $\rightarrow$ Asset, or API session), applying $(3 \times 3)$ Gaussian anti-artifact blur and LAB $L$-channel CLAHE contrast enhancement to sanitize incoming payloads [17].

---

## VII. NEUROSCAN AI LOCKDOWN PROTOCOL

When effective score $S_{\text{eff},i}(t)$ crosses threshold $\tau_r$, the five-phase Lockdown Protocol (BLP) fires automatically: State Preservation $\rightarrow$ Trust Severance $\rightarrow$ Asset Protection $\rightarrow$ Identity Reset $\rightarrow$ Deception Deployment.

```
Algorithm 1: Lockdown Trigger Evaluation
Require: Event e; entity i; Trust Graph G; threat score S; thresholds τy < τo < τr
Ensure: Governance decision d; lockdown flag ℓ
 1: S <- γS + Δ(e) {Eq. (2): decay, add indicators + correlation bonus}
 2: Update Ti for every entity i touched by e {Eq. (1)}
 3: Seff,i <- S(1 + κ(1 - Ti/100)) {Eq. (3)}
 4: if Seff,i >= τr then
 5:     ℓ <- true
 6:     StatePreservation()
 7:     CircuitBreaker(compromised edges of G)
 8:     IdentityReset(affected entities)
 9:     DeceptionDeployment()
10:     d <- Block
11: else if Seff,i >= τo then
12:     d <- Restrict
13: else if Seff,i >= τy then
14:     d <- Warn
15: else
16:     d <- Allow
17: end if
18: return (d, ℓ)
```

### A. Identity Reset Protocol
Forces accelerated password rotation, session revocation, token invalidation, and credential reset for implicated identities [14]. In clinical triage, if confidence $< 0.75$, the identity protocol overrides classification to *"Inconclusive - Requires Radiologist Review"*.

---

## VIII. DECEPTION ENGINE

Redirects suspicious activity toward controlled deception assets (honeyfiles, decoy databases, synthetic visual saliency slices) to slow the attacker, gather forensic intelligence, and generate localized Grad-CAM heatmaps ($COLORMAP\_JET$) without touching production data [10]–[12].

---

## IX. INCIDENT RECONSTRUCTION AND GOVERNANCE COMMAND CENTER

### A. Incident Reconstruction Engine
Assembles comprehensive forensic reports, incident timelines, and automated tamper-evident FPDF diagnostic summaries [13], [15].

### B. Governance Command Center
Single Page Application (SPA) dashboard displaying real-time threat scores, Trust Graph visualizations, Chart.js analytics, and historical patient scan records.

---

## X. DISCUSSION

### A. Comparative Positioning

TABLE I  
Qualitative Comparison of NeuroScan AI with Conventional Paradigms

| Dimension | SIEM / SOAR [1], [4] | ZTA [5], [6] | NeuroScan AI (Proposed) |
| :--- | :--- | :--- | :--- |
| **Primary Scope** | Log correlation, playbook response | Identity-centric access control | Unified governance across identity, device, app, and asset |
| **Trust Model** | Static rules | Continuous, per-session | Continuous, graph-based, per-relationship |
| **Containment Unit** | Host or network segment | Session or request | Individual trust edge |
| **Forensic Snapshot** | Log-based, after the fact | Not explicitly defined | Captured before containment acts |
| **Deception** | Occasionally bolted on | Not addressed | Native fifth phase of lockdown |

### B. Prototype Scope and Implementation Plan
NeuroScan AI is implemented using FastAPI/Python backend, React/Vanilla JS SPA frontend, PostgreSQL/Supabase ORM, and in-memory execution (< 512 MB RAM).

### C. Limitations
Rule-based scoring parameters ($\gamma, \beta, \kappa$) require empirical calibration against real attack traffic [16].

---

## XI. FUTURE SCOPE
Extensions include machine-learning behavioral analytics [18], multimodal 3D DICOM segmentation [19], steganalysis [20], and automated natural-language incident querying [21].

---

## XII. CONCLUSION
NeuroScan AI introduces a graph-based Cyber Governance Layer that unifies continuous trust management, forensic preservation, circuit-breaker containment, identity resets, and deception into a single operational architecture.

---

## References

1. G. Gonzalez-Granadillo, S. Gonzalez-Zarzosa, and R. Diaz, "Security information and event management (SIEM): Analysis, trends, and usage in critical infrastructures," *Sensors*, vol. 21, no. 14, Art. no. 4759, 2021.
2. H. Kaur et al., "Evolution of endpoint detection and response (EDR) in cyber security: A comprehensive review," *E3S Web of Conferences*, vol. 86, 2024.
3. S. Alneyadi, E. Sithirasenan, and V. Muthukkumarasamy, "A survey on data leakage prevention systems," *Journal of Network and Computer Applications*, vol. 62, pp. 137–152, Feb. 2016.
4. U. Bartwal, S. Mukhopadhyay, R. Negi, and S. Shukla, "Security orchestration, automation, and response engine for deployment of behavioural honeypots," in *Proc. IEEE Conf. Dependable and Secure Computing (DSC)*, 2022.
5. S. Rose, O. Borchert, S. Mitchell, and S. Connelly, "Zero trust architecture," *NIST Special Publication 800-207*, National Institute of Standards and Technology, Gaithersburg, MD, USA, Aug. 2020.
6. N. F. Syed, S. W. Shah, A. Shaghaghi, A. Anwar, Z. Baig, and R. Doss, "Zero trust architecture (ZTA): A comprehensive survey," *IEEE Access*, vol. 10, pp. 57143–57179, 2022.
7. D. Artz and Y. Gil, "A survey of trust in computer science and the Semantic Web," *Web Semantics: Science, Services and Agents on the World Wide Web*, vol. 5, no. 2, pp. 58–71, 2007.
8. O. Sheyner, J. Haines, S. Jha, R. Lippmann, and J. M. Wing, "Automated generation and analysis of attack graphs," in *Proc. IEEE Symp. Security and Privacy*, 2002, pp. 273–284.
9. Y. Han and A. Li, "A survey on cybersecurity knowledge graph construction," *Computers & Security*, vol. 125, Art. no. 103524, 2023.
10. X. Han, N. Kheir, and D. Balzarotti, "Deception techniques in computer security: A research perspective," *ACM Computing Surveys*, vol. 51, no. 4, pp. 1–36, Jul. 2018.
11. S. Jajodia, A. K. Ghosh, V. Swarup, C. Wang, and X. S. Wang, Eds., *Moving Target Defense: Creating Asymmetric Uncertainty for Cyber Threats*, Advances in Information Security, vol. 54. New York, NY, USA: Springer, 2011.
12. J.-H. Cho et al., "Toward proactive, adaptive defense: A survey on moving target defense," *IEEE Communications Surveys & Tutorials*, vol. 22, no. 1, pp. 709–745, 2020.
13. P. Cichonski, T. Millar, T. Grance, and K. Scarfone, "Computer security incident handling guide," *NIST Special Publication 800-61 Revision 2*, National Institute of Standards and Technology, Gaithersburg, MD, USA, Aug. 2012.
14. P. A. Grassi et al., "Digital identity guidelines: Authentication and lifecycle management," *NIST Special Publication 800-63B*, National Institute of Standards and Technology, Gaithersburg, MD, USA, Jun. 2017.
15. A. Ahmad, M. Saad, M. Al Ghamdi, D. Nyang, and D. Mohaisen, "BlockTrail: A service for secure and transparent blockchain-driven audit trails," *IEEE Systems Journal*, vol. 16, no. 1, pp. 1367–1378, Mar. 2022.
16. S. Neupane et al., "Explainable intrusion detection systems (X-IDS): A survey of current methods, challenges, and opportunities," *IEEE Access*, vol. 10, pp. 112392–112415, 2022.
17. M. T. Nygard, *Release It!: Design and Deploy Production-Ready Software*, 2nd ed. Raleigh, NC, USA: Pragmatic Bookshelf, 2018.
18. M. Shamini, et al., "A Multimodal Deep Learning Approach for Predicting Dementia's Disease Progression Using MRI Clinical Data," *2025 International Conference on Data Science, Agents & Artificial Intelligence (ICDSAAI)*, IEEE, 2025.
19. S. Murugavalli, L. Jabasheela, and V. Anitha, "Ceaseless Steganographic Approaches in Machine Learning," *Measurement: Sensors*, vol. 25, 2023, p. 100622.
20. M. Therasa and G. Mathivanan, "Survey of Machine Reading Comprehension Models and Its Evaluation Metrics," *2022 6th International Conference on Computing Methodologies and Communication (ICCMC)*, IEEE, 2022.
21. S. Deepak and P. M. Ameer, "Brain tumor classification using deep CNN features via transfer learning," *Computers in Biology and Medicine*, vol. 111, p. 103345, 2019.
22. J. Amin et al., "Brain tumor detection and classification using Gaussian filtering and deep features reduction," *Microprocessors and Microsystems*, vol. 80, p. 103362, 2021.
23. M. S. Majib et al., "VGG-SCNet: A VGG-16 based deep learning framework for brain tumor detection," *IEEE Access*, vol. 9, pp. 116934–116947, 2021.
24. H. Mohsen et al., "Classification using deep learning neural networks for brain tumors," *Future Computing and Informatics Journal*, vol. 3, no. 1, pp. 68–71, 2018.
25. A. Ismael and A. Abdel-Qader, "Brain tumor classification using sparse coding and dictionary learning," *IEEE Access*, vol. 6, pp. 77244–77254, 2018.
26. Z. N. K. Swati et al., "Brain tumor classification for MR images using transfer learning and fine-tuning," *Computerized Medical Imaging and Graphics*, vol. 75, pp. 34–46, 2019.
27. M. T. Reshi et al., "An efficient deep learning approach for brain tumor detection and classification," *IEEE Access*, vol. 10, pp. 83884–83896, 2022.
28. R. R. Selvaraju et al., "Grad-CAM: Visual explanations from deep networks via gradient-based localization," *IEEE Transactions on Pattern Analysis and Machine Intelligence*, vol. 42, no. 2, pp. 336–349, 2020.
29. K. Zuiderveld, "Contrast limited adaptive histogram equalization," *Graphics Gems IV*, Academic Press Professional, Inc., pp. 474–485, 1994.
30. E. T. Yatsenko et al., "Zero-shot clinical decision support with vision-language models," *IEEE Journal of Biomedical and Health Informatics*, vol. 27, no. 8, pp. 3840–3851, 2023.
