/**
 * NeuroScan AI - Clinical Decision Support System (CDSS)
 * Frontend Interactivity & Chart.js Analytics Script
 * Med-CoT & Confidence Safeguard Sync
 */

document.addEventListener('DOMContentLoaded', () => {
    // Splash Screen Boot Sequence
    const splashScreen = document.getElementById('splash-screen');
    const splashStatus = document.getElementById('splash-status');
    const splashProgressFill = document.getElementById('splashProgressFill');

    if (splashScreen) {
        setTimeout(() => {
            if (splashStatus) splashStatus.textContent = "> Connecting to Supabase Database...";
            if (splashProgressFill) splashProgressFill.style.width = "60%";
        }, 400);

        setTimeout(() => {
            if (splashStatus) splashStatus.textContent = "> System Ready.";
            if (splashProgressFill) splashProgressFill.style.width = "100%";
        }, 900);

        setTimeout(() => {
            splashScreen.classList.add('splash-hidden');
        }, 1500);

        setTimeout(() => {
            if (splashScreen && splashScreen.parentNode) {
                splashScreen.parentNode.removeChild(splashScreen);
            }
        }, 2100);
    }

    // DOM Elements
    const scanForm = document.getElementById('scanForm');
    const fileInput = document.getElementById('fileInput');
    const dropzone = document.getElementById('dropzone');
    const dropzoneContent = document.getElementById('dropzoneContent');
    const filePreviewTag = document.getElementById('filePreviewTag');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const removeFileBtn = document.getElementById('removeFileBtn');
    
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    // Results Elements
    const resultsSection = document.getElementById('resultsSection');
    const resultReportId = document.getElementById('resultReportId');
    const guardrailBanner = document.getElementById('guardrailBanner');
    const bannerTitle = document.getElementById('bannerTitle');
    const bannerDesc = document.getElementById('bannerDesc');
    
    const claheImg = document.getElementById('claheImg');
    const gradcamImg = document.getElementById('gradcamImg');
    
    const resPatientName = document.getElementById('resPatientName');
    const resPatientId = document.getElementById('resPatientId');
    const resPatientAgeGender = document.getElementById('resPatientAgeGender');
    const resDoctor = document.getElementById('resDoctor');
    
    const classificationBadge = document.getElementById('classificationBadge');
    const confidenceText = document.getElementById('confidenceText');
    const confidenceBar = document.getElementById('confidenceBar');
    const clinicalRationaleText = document.getElementById('clinicalRationaleText');
    const symptomsList = document.getElementById('symptomsList');
    const treatmentPathwayText = document.getElementById('treatmentPathwayText');
    
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const printReportBtn = document.getElementById('printReportBtn');
    const refreshHistoryBtn = document.getElementById('refreshHistoryBtn');
    const historyTableBody = document.getElementById('historyTableBody');

    // View Navigation Elements
    const diagnosticView = document.getElementById('diagnosticView');
    const analyticsView = document.getElementById('analyticsView');
    const historySection = document.getElementById('historySection');

    const viewDiagnosticsBtn = document.getElementById('viewDiagnosticsBtn');
    const viewAnalyticsBtn = document.getElementById('viewAnalyticsBtn');
    const viewHistoryBtn = document.getElementById('viewHistoryBtn');
    const backToDiagBtns = document.querySelectorAll('.back-to-diag-btn');

    // Metric Counters
    const statTotal = document.getElementById('stat-total');
    const statValid = document.getElementById('stat-valid');
    const statRejected = document.getElementById('stat-rejected');
    const statTumors = document.getElementById('stat-tumors');

    let currentScanId = null;
    let triageChart = null;

    initChart();
    fetchHistory();

    // ==========================================
    // View Navigation Toggling (SPA View Controller)
    // ==========================================
    function switchView(target) {
        if (diagnosticView) diagnosticView.classList.add('hidden');
        if (analyticsView) analyticsView.classList.add('hidden');
        if (historySection) historySection.classList.add('hidden');

        if (viewDiagnosticsBtn) viewDiagnosticsBtn.classList.remove('active');
        if (viewAnalyticsBtn) viewAnalyticsBtn.classList.remove('active');
        if (viewHistoryBtn) viewHistoryBtn.classList.remove('active');

        if (target === 'analytics') {
            if (analyticsView) analyticsView.classList.remove('hidden');
            if (viewAnalyticsBtn) viewAnalyticsBtn.classList.add('active');
            fetchHistory();
            if (analyticsView) analyticsView.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (target === 'history') {
            if (historySection) historySection.classList.remove('hidden');
            if (viewHistoryBtn) viewHistoryBtn.classList.add('active');
            fetchHistory();
            if (historySection) historySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            if (diagnosticView) diagnosticView.classList.remove('hidden');
            if (viewDiagnosticsBtn) viewDiagnosticsBtn.classList.add('active');
            if (diagnosticView) diagnosticView.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    if (viewDiagnosticsBtn) viewDiagnosticsBtn.addEventListener('click', () => switchView('diagnostics'));
    if (viewAnalyticsBtn) viewAnalyticsBtn.addEventListener('click', () => switchView('analytics'));
    if (viewHistoryBtn) viewHistoryBtn.addEventListener('click', () => switchView('history'));
    backToDiagBtns.forEach(btn => btn.addEventListener('click', () => switchView('diagnostics')));

    // ==========================================
    // File Drag & Drop Handlers
    // ==========================================
    dropzone.addEventListener('click', (e) => {
        if (e.target !== removeFileBtn && !removeFileBtn.contains(e.target)) {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', handleFileSelect);

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('dragover');
        }, false);
    });

    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            fileInput.files = files;
            handleFileSelect();
        }
    });

    removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        filePreviewTag.classList.add('hidden');
        dropzoneContent.classList.remove('hidden');
    });

    function handleFileSelect() {
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            fileNameDisplay.textContent = file.name;
            dropzoneContent.classList.add('hidden');
            filePreviewTag.classList.remove('hidden');
        }
    }

    // ==========================================
    // Scan Form Submission (POST /api/analyze_scan)
    // ==========================================
    scanForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!fileInput.files || fileInput.files.length === 0) {
            alert('Please select an MRI scan image to analyze.');
            return;
        }

        setLoading(true);
        const formData = new FormData(scanForm);

        try {
            const response = await fetch('/api/analyze_scan', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Analysis request failed.');
            }

            const data = await response.json();
            currentScanId = data.scan_id;

            renderResults(data);
            fetchHistory();

            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            alert(`Diagnostic Pipeline Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnSpinner.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnSpinner.classList.add('hidden');
        }
    }

    // ==========================================
    // Render Results Card & UI Sync
    // ==========================================
    function renderResults(data) {
        const patient = data.patient;
        const analysis = data.analysis;
        const visualizations = data.visualizations;

        resultReportId.textContent = `Report ID: ${data.scan_id.substring(0, 8)}`;

        resPatientName.textContent = patient.name;
        resPatientId.textContent = patient.id;
        resPatientAgeGender.textContent = `${patient.age} Yrs / ${patient.gender}`;
        resDoctor.textContent = patient.doctor;

        claheImg.src = `data:image/jpeg;base64,${visualizations.clahe_b64}`;
        gradcamImg.src = `data:image/jpeg;base64,${visualizations.gradcam_b64}`;

        if (!analysis.is_valid_mri) {
            guardrailBanner.className = 'guardrail-banner rejected';
            bannerTitle.textContent = 'Scan Rejected: Invalid Input';
            bannerDesc.textContent = analysis.rejection_reason || 'Out-of-Distribution input detected: Non-MRI artifacts, screenshots, or non-cranial subjects.';

            classificationBadge.textContent = 'INVALID INPUT';
            classificationBadge.style.borderColor = 'var(--accent-red)';
            classificationBadge.style.color = 'var(--accent-red)';
            classificationBadge.style.background = 'rgba(239, 68, 68, 0.15)';

            confidenceText.textContent = '0.0%';
            confidenceBar.style.width = '0%';
            confidenceBar.style.background = 'var(--accent-red)';

            clinicalRationaleText.textContent = 'Diagnostic processing halted due to Out-of-Distribution (OOD) validation failure. ' + (analysis.rejection_reason || '');
            symptomsList.innerHTML = '<li class="symptom-pill" style="background:rgba(239, 68, 68, 0.2); color:#fca5a5; border-color:rgba(239, 68, 68, 0.4);"><i class="fa-solid fa-ban"></i> N/A - Non MRI Scan</li>';
            treatmentPathwayText.textContent = 'No medical protocol generated. Please upload an authentic monochrome brain MRI scan.';

            downloadPdfBtn.disabled = true;
            downloadPdfBtn.style.opacity = '0.4';
            downloadPdfBtn.style.cursor = 'not-allowed';

            printReportBtn.disabled = true;
            printReportBtn.style.opacity = '0.4';
            printReportBtn.style.cursor = 'not-allowed';

        } else {
            guardrailBanner.className = 'guardrail-banner valid';
            bannerTitle.textContent = 'MRI Scan Validation Passed';
            bannerDesc.textContent = 'Cranial MRI structure confirmed. Out-Of-Distribution guardrail passed.';

            const cls = analysis.classification || 'Unknown';
            classificationBadge.textContent = cls;
            
            if (cls.includes('Inconclusive')) {
                // CONFIDENCE SAFEGUARD TRIGGERED (< 0.75)
                classificationBadge.style.borderColor = 'var(--accent-amber)';
                classificationBadge.style.color = '#f59e0b';
                classificationBadge.style.background = 'rgba(245, 158, 11, 0.15)';
                confidenceBar.style.background = 'var(--accent-amber)';
            } else if (cls === 'No_Tumor') {
                classificationBadge.style.borderColor = 'var(--accent-green)';
                classificationBadge.style.color = '#34d399';
                classificationBadge.style.background = 'rgba(16, 185, 129, 0.15)';
                confidenceBar.style.background = 'linear-gradient(90deg, var(--primary), var(--accent-green))';
            } else {
                classificationBadge.style.borderColor = 'var(--primary)';
                classificationBadge.style.color = '#38bdf8';
                classificationBadge.style.background = 'rgba(14, 165, 233, 0.15)';
                confidenceBar.style.background = 'linear-gradient(90deg, var(--primary), var(--accent-purple))';
            }

            const confVal = (analysis.confidence_score || 0.0) * 100;
            confidenceText.textContent = `${confVal.toFixed(1)}%`;
            confidenceBar.style.width = `${confVal}%`;

            clinicalRationaleText.textContent = analysis.clinical_rationale || 'Rationale generated by Agentic AI engine.';
            
            symptomsList.innerHTML = '';
            const symptoms = analysis.associated_symptoms || [];
            if (symptoms.length > 0) {
                symptoms.forEach(sym => {
                    const li = document.createElement('li');
                    li.className = 'symptom-pill';
                    li.textContent = sym;
                    symptomsList.appendChild(li);
                });
            } else {
                symptomsList.innerHTML = '<li class="symptom-pill">None specified</li>';
            }

            treatmentPathwayText.textContent = analysis.recommended_treatment_pathway || 'Standard clinical protocols apply.';

            downloadPdfBtn.disabled = false;
            downloadPdfBtn.style.opacity = '1';
            downloadPdfBtn.style.cursor = 'pointer';

            printReportBtn.disabled = false;
            printReportBtn.style.opacity = '1';
            printReportBtn.style.cursor = 'pointer';
        }
    }

    // ==========================================
    // PDF & Print Actions
    // ==========================================
    downloadPdfBtn.addEventListener('click', () => {
        if (downloadPdfBtn.disabled) return;
        if (currentScanId) {
            window.open(`/api/generate_pdf/${currentScanId}`, '_blank');
        }
    });

    printReportBtn.addEventListener('click', () => {
        if (printReportBtn.disabled) return;
        window.print();
    });

    refreshHistoryBtn.addEventListener('click', fetchHistory);

    // ==========================================
    // History & Analytics (Chart.js)
    // ==========================================
    async function fetchHistory() {
        try {
            const response = await fetch('/api/history');
            if (!response.ok) return;

            const data = await response.json();
            
            statTotal.textContent = data.total_scans || 0;
            statValid.textContent = data.valid_scans || 0;
            statRejected.textContent = data.rejected_scans || 0;
            
            const breakdown = data.classification_breakdown || {};
            const totalTumors = (breakdown.Glioma || 0) + (breakdown.Meningioma || 0) + (breakdown.Pituitary || 0);
            statTumors.textContent = totalTumors;

            updateChart(breakdown);
            renderHistoryTable(data.history || []);

        } catch (err) {
            console.error('Failed to fetch history:', err);
        }
    }

    function initChart() {
        const ctx = document.getElementById('triageChart').getContext('2d');
        triageChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Glioma', 'Meningioma', 'Pituitary', 'No Tumor', 'Inconclusive', 'OOD Rejections'],
                datasets: [
                    {
                        label: 'Valid Scans',
                        data: [0, 0, 0, 0, 0, 0],
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: '#10b981',
                        borderWidth: 1,
                        borderRadius: 6
                    },
                    {
                        label: 'Rejected/Inconclusive Scans',
                        data: [0, 0, 0, 0, 0, 0],
                        backgroundColor: 'rgba(239, 68, 68, 0.7)',
                        borderColor: '#ef4444',
                        borderWidth: 1,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8', precision: 0 }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#f1f5f9', font: { family: 'Inter' } }
                    }
                }
            }
        });
    }

    function updateChart(breakdown) {
        if (!triageChart) return;
        
        const validData = [
            breakdown.Glioma || 0,
            breakdown.Meningioma || 0,
            breakdown.Pituitary || 0,
            breakdown.No_Tumor || 0,
            breakdown.Inconclusive || 0,
            0
        ];

        const rejectedData = [
            0, 0, 0, 0, 0,
            breakdown.Rejected || 0
        ];

        triageChart.data.datasets[0].data = validData;
        triageChart.data.datasets[1].data = rejectedData;
        triageChart.update();
    }

    function renderHistoryTable(records) {
        if (!records || records.length === 0) {
            historyTableBody.innerHTML = '<tr><td colspan="9" class="text-center">No patient scan records found. Run a diagnostic scan above.</td></tr>';
            return;
        }

        historyTableBody.innerHTML = '';
        records.forEach(r => {
            const tr = document.createElement('tr');
            
            const isValid = r.is_valid_mri;
            const statusBadge = isValid 
                ? '<span class="status-pill status-online" style="padding:2px 8px; font-size:0.75rem;">Valid</span>'
                : '<span class="status-pill status-memory" style="background:rgba(239, 68, 68, 0.15); color:#f87171; border-color:rgba(239, 68, 68, 0.3); padding:2px 8px; font-size:0.75rem;">OOD Rejected</span>';

            const conf = isValid ? `${((r.confidence_score || 0) * 100).toFixed(1)}%` : '0.0%';
            const cls = isValid ? (r.classification || 'Unknown') : 'INVALID INPUT';
            const dateStr = r.created_at ? new Date(r.created_at).toLocaleString() : 'Just now';

            const actionCell = isValid
                ? `<a href="/api/generate_pdf/${r.id}" target="_blank" class="btn btn-sm btn-outline" style="text-decoration:none;"><i class="fa-solid fa-file-pdf"></i> PDF</a>`
                : `<span class="btn btn-sm btn-outline disabled" style="opacity:0.4; cursor:not-allowed; text-decoration:none;"><i class="fa-solid fa-ban"></i> N/A</span>`;

            tr.innerHTML = `
                <td style="font-family:monospace; font-size:0.8rem; color:var(--primary);">${(r.id || '').substring(0, 8)}...</td>
                <td><strong>${escapeHtml(r.patient_name || 'N/A')}</strong></td>
                <td>${escapeHtml(r.patient_id || 'N/A')}</td>
                <td>${escapeHtml(r.referring_doctor || 'N/A')}</td>
                <td>${statusBadge}</td>
                <td><strong style="${!isValid ? 'color:var(--accent-red);' : (cls.includes('Inconclusive') ? 'color:var(--accent-amber);' : '')}">${escapeHtml(cls)}</strong></td>
                <td>${conf}</td>
                <td style="font-size:0.78rem; color:var(--text-muted);">${dateStr}</td>
                <td>${actionCell}</td>
            `;
            historyTableBody.appendChild(tr);
        });
    }

    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
