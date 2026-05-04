window.React = React;
const { useState, useEffect, useMemo, useRef, useCallback } = React;
const { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } = window.Recharts || {};

const supabaseUrl = 'https://cksfwdhoxbrboxrefycz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrc2Z3ZGhveGJyYm94cmVmeWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODgyOTIsImV4cCI6MjA5MzQ2NDI5Mn0.tvIWdyz-Ngg3H0-3zGwffPbEKdWs2gp93V8SucY7Ons';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// === Data Dictionary ===
const DEFAULT_DICTIONARY = {
    'طلاب': {
        domains: [{ id: 'd1', name: 'البيئة المدرسية', color: '#10b981' }, { id: 'd2', name: 'الأداء التعليمي', color: '#3b82f6' }, { id: 'd3', name: 'الدعم والرضا', color: '#f59e0b' }],
        questions: [
            { id: 'S1', domainId: 'd1', displayId: 1, text: 'نظافة مرافق المدرسة وصيانتها.' }, { id: 'S2', domainId: 'd1', displayId: 2, text: 'مستوى الأمان والشعور بالطمأنينة.' }, { id: 'S3', domainId: 'd1', displayId: 3, text: 'جودة المعامل والمكتبة.' }, { id: 'S4', domainId: 'd1', displayId: 4, text: 'الاشتراطات الصحية في المقصف.' }, { id: 'S5', domainId: 'd1', displayId: 5, text: 'بيئة صفية مريحة وجاذبة.' },
            { id: 'S6', domainId: 'd2', displayId: 6, text: 'وضوح شرح المعلمين للدروس.' }, { id: 'S7', domainId: 'd2', displayId: 7, text: 'تنوع أساليب التدريس.' }, { id: 'S8', domainId: 'd2', displayId: 8, text: 'العدالة والمساواة.' }, { id: 'S9', domainId: 'd2', displayId: 9, text: 'التشجيع على المشاركة.' }, { id: 'S10', domainId: 'd2', displayId: 10, text: 'توفر الأنشطة اللاصفية.' },
            { id: 'S11', domainId: 'd3', displayId: 11, text: 'استجابة الإدارة لمقترحات الطلاب.' }, { id: 'S12', domainId: 'd3', displayId: 12, text: 'تحفيز وتكريم الطلاب.' }, { id: 'S13', domainId: 'd3', displayId: 13, text: 'تقديم الدعم الأكاديمي.' }, { id: 'S14', domainId: 'd3', displayId: 14, text: 'جودة التوجيه والإرشاد.' }, { id: 'S15', domainId: 'd3', displayId: 15, text: 'الرضا العام عن المدرسة.' }
        ]
    },
    'معلمين': {
        domains: [{ id: 'd1', name: 'التنمية المهنية', color: '#10b981' }, { id: 'd2', name: 'بيئة العمل', color: '#3b82f6' }, { id: 'd3', name: 'اللوائح والسياسات', color: '#f59e0b' }],
        questions: [
            { id: 'T1', domainId: 'd1', displayId: 1, text: 'دعم الإدارة للتنمية المهنية.' }, { id: 'T2', domainId: 'd1', displayId: 2, text: 'توفر الموارد والتقنيات.' }, { id: 'T3', domainId: 'd1', displayId: 3, text: 'جودة مرافق المعلمين.' }, { id: 'T4', domainId: 'd1', displayId: 4, text: 'العدالة في توزيع الجداول.' }, { id: 'T5', domainId: 'd1', displayId: 5, text: 'شفافية تقييم الأداء.' },
            { id: 'T6', domainId: 'd2', displayId: 6, text: 'مستوى التعاون وروح الفريق.' }, { id: 'T7', domainId: 'd2', displayId: 7, text: 'كفاءة قنوات التواصل.' }, { id: 'T8', domainId: 'd2', displayId: 8, text: 'التواصل مع أولياء الأمور.' }, { id: 'T9', domainId: 'd2', displayId: 9, text: 'إشراك المعلمين في القرارات.' }, { id: 'T10', domainId: 'd2', displayId: 10, text: 'تحفيز وتكريم المعلمين.' },
            { id: 'T11', domainId: 'd3', displayId: 11, text: 'وضوح المهام والتكليفات.' }, { id: 'T12', domainId: 'd3', displayId: 12, text: 'مرونة الإدارة وحكمتها.' }, { id: 'T13', domainId: 'd3', displayId: 13, text: 'وضوح السياسات واللوائح.' }, { id: 'T14', domainId: 'd3', displayId: 14, text: 'حفظ حقوق المعلم وهيبته.' }, { id: 'T15', domainId: 'd3', displayId: 15, text: 'الرضا العام عن بيئة العمل.' }
        ]
    },
    'أولياء أمور': {
        domains: [{ id: 'd1', name: 'التواصل والاستجابة', color: '#10b981' }, { id: 'd2', name: 'جودة التعليم', color: '#3b82f6' }, { id: 'd3', name: 'البيئة والدعم', color: '#f59e0b' }],
        questions: [
            { id: 'P1', domainId: 'd1', displayId: 1, text: 'مستوى التواصل المستمر.' }, { id: 'P2', domainId: 'd1', displayId: 2, text: 'استجابة الإدارة للشكاوى.' }, { id: 'P3', domainId: 'd1', displayId: 3, text: 'فعالية القنوات الإلكترونية.' }, { id: 'P4', domainId: 'd1', displayId: 4, text: 'الشفافية في عرض السياسات.' }, { id: 'P5', domainId: 'd1', displayId: 5, text: 'إشراك أولياء الأمور.' },
            { id: 'P6', domainId: 'd2', displayId: 6, text: 'جودة المخرجات التعليمية.' }, { id: 'P7', domainId: 'd2', displayId: 7, text: 'تعزيز القيم الإسلامية.' }, { id: 'P8', domainId: 'd2', displayId: 8, text: 'كفاءة المعلمين وتأهيلهم.' }, { id: 'P9', domainId: 'd2', displayId: 9, text: 'شفافية التقييم والنتائج.' }, { id: 'P10', domainId: 'd2', displayId: 10, text: 'انضباط المدرسة والمواعيد.' },
            { id: 'P11', domainId: 'd3', displayId: 11, text: 'مستوى الأمان والرعاية.' }, { id: 'P12', domainId: 'd3', displayId: 12, text: 'نظافة وسلامة المبنى.' }, { id: 'P13', domainId: 'd3', displayId: 13, text: 'تقديم فصول التقوية.' }, { id: 'P14', domainId: 'd3', displayId: 14, text: 'برامج توعوية للأسرة.' }, { id: 'P15', domainId: 'd3', displayId: 15, text: 'الرضا العام عن اختيار الفلاح.' }
        ]
    },
    'إداريين': {
        domains: [{ id: 'd1', name: 'التخطيط والجودة', color: '#10b981' }, { id: 'd2', name: 'العمليات والموارد', color: '#3b82f6' }, { id: 'd3', name: 'التحسين والامتثال', color: '#f59e0b' }],
        questions: [
            { id: 'A1', domainId: 'd1', displayId: 1, text: 'وضوح الرؤية والرسالة.' }, { id: 'A2', domainId: 'd1', displayId: 2, text: 'تطبيق معايير ISO 9001.' }, { id: 'A3', domainId: 'd1', displayId: 3, text: 'كفاءة الهيكل التنظيمي.' }, { id: 'A4', domainId: 'd1', displayId: 4, text: 'قياس مؤشرات الأداء KPIs.' }, { id: 'A5', domainId: 'd1', displayId: 5, text: 'تحليل المخاطر.' },
            { id: 'A6', domainId: 'd2', displayId: 6, text: 'نظام التوثيق والسجلات.' }, { id: 'A7', domainId: 'd2', displayId: 7, text: 'برامج تدريب الكوادر.' }, { id: 'A8', domainId: 'd2', displayId: 8, text: 'إدارة الموارد والاستدامة.' }, { id: 'A9', domainId: 'd2', displayId: 9, text: 'صيانة البنية التحتية.' }, { id: 'A10', domainId: 'd2', displayId: 10, text: 'التحول الرقمي.' },
            { id: 'A11', domainId: 'd3', displayId: 11, text: 'المراجعة والتدقيق.' }, { id: 'A12', domainId: 'd3', displayId: 12, text: 'الالتزام باللوائح.' }, { id: 'A13', domainId: 'd3', displayId: 13, text: 'خطط الطوارئ والسلامة.' }, { id: 'A14', domainId: 'd3', displayId: 14, text: 'رضا المستفيدين الداخليين.' }, { id: 'A15', domainId: 'd3', displayId: 15, text: 'التحسين المستمر.' }
        ]
    }
};

const INIT_SURVEYS = [
    { id: 'S1', title: 'استبانة رضا المستفيد (طلاب)', target: 'طلاب', status: 'نشط', location: 'مكة المكرمة', stage: 'ابتدائية', autoStart: '', autoClose: '', isAuto: false, icon: 'users' },
    { id: 'S2', title: 'استبانة رضا المعلمين', target: 'معلمين', status: 'نشط', location: 'مكة المكرمة', stage: 'ابتدائية', autoStart: '', autoClose: '', isAuto: false, icon: 'book-open' },
    { id: 'S3', title: 'استبانة رضا ولي الأمر', target: 'أولياء أمور', status: 'نشط', location: 'مكة المكرمة', stage: 'ابتدائية', autoStart: '', autoClose: '', isAuto: false, icon: 'home' },
    { id: 'S4', title: 'استبانة التميز المؤسسي (الجودة)', target: 'إداريين', status: 'نشط', location: 'مكة المكرمة', stage: 'ابتدائية', autoStart: '', autoClose: '', isAuto: false, icon: 'award' }
];

const DEFAULT_LOGOS = {
    ministry: 'https://upload.wikimedia.org/wikipedia/ar/thumb/9/90/Ministry_of_Education_Saudi_Arabia.svg/250px-Ministry_of_Education_Saudi_Arabia.svg.png',
    school: 'https://placehold.co/200x200/ffffff/eab308?text=شعار+الفلاح',
    iso: 'https://placehold.co/200x200/ffffff/10b981?text=ISO+9001'
};

// Custom label for bar charts to show percentage
const PercentageLabel = (props) => {
    const { x, y, width, value } = props;
    return (
        <text x={x + width / 2} y={y - 10} fill="#1e1b4b" textAnchor="middle" dominantBaseline="middle" className="font-bold text-xs">
            {value}%
        </text>
    );
};

const SurveyQuestion = React.memo(({ q, currentData, updateAssessment, isMissing, assessmentKey }) => {
    const currentScore = currentData.score;
    const [showNote, setShowNote] = useState(!!currentData.note);
    const [localNote, setLocalNote] = useState(currentData.note || '');
    const [hoverScore, setHoverScore] = useState(0);

    const handleNoteChange = (e) => {
        setLocalNote(e.target.value);
    };

    const handleNoteBlur = () => {
        if (localNote !== currentData.note) {
            updateAssessment(assessmentKey, q.id, 'note', localNote);
        }
    };

    return (
        <div id={`question-${q.id}`} className={`p-6 flex flex-col gap-4 survey-item transition-all duration-300 ${isMissing ? 'bg-rose-50 border border-rose-400' : 'hover:bg-gray-50/50 border border-transparent'}`}>
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 block">معيار {q.displayId} {q.required !== false && <span className="text-rose-500">*</span>}</span>
                    <p className="font-bold text-[#1e1b4b] text-base leading-relaxed">{q.text}</p>
                    {(!q.type || q.type === 'scale') && (
                        <button onClick={() => setShowNote(!showNote)} className="mt-4 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors no-print bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-1 w-fit">
                            📝 {showNote ? 'إخفاء الملاحظة' : 'إضافة ملاحظة'}
                        </button>
                    )}
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0">
                    {(!q.type || q.type === 'scale') ? (
                        <div className="flex gap-2 bg-gray-50 p-2 rounded-2xl no-print border border-gray-100" onMouseLeave={() => setHoverScore(0)}>
                            {[1, 2, 3, 4, 5].map(score => {
                                const isActive = hoverScore ? score <= hoverScore : score <= currentScore;
                                return (
                                    <button
                                        key={score}
                                        onClick={() => updateAssessment(assessmentKey, q.id, 'score', score)}
                                        onMouseEnter={() => setHoverScore(score)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${isActive ? 'text-[#eab308] scale-110 drop-shadow-md' : 'text-gray-300 hover:text-gray-400'}`}
                                        title={`${(score / 5) * 100}%`}
                                    >
                                        <Icon name="star" className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <textarea
                            value={currentData.textAnswer || ''}
                            onChange={(e) => updateAssessment(assessmentKey, q.id, 'textAnswer', e.target.value)}
                            placeholder="اكتب إجابتك هنا..."
                            className="w-full md:w-64 bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-[#eab308] outline-none min-h-[80px] resize-y custom-scrollbar text-gray-700 shadow-inner"
                        />
                    )}
                </div>
                {(!q.type || q.type === 'scale') && (
                    <div className="hidden print-area text-lg font-black text-[#1e1b4b] border-2 border-gray-300 px-4 py-1 rounded-lg text-center h-fit">
                        {currentScore !== undefined ? `${(currentScore / 5) * 100}%` : '___'}
                    </div>
                )}
            </div>
            {showNote && (
                <div className="animate-in slide-in-from-top-2 duration-300 w-full no-print">
                    <textarea
                        value={localNote}
                        onChange={handleNoteChange}
                        onBlur={handleNoteBlur}
                        placeholder="اكتب ملاحظاتك أو تعليقك هنا..."
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-[#eab308] outline-none min-h-[80px] resize-y custom-scrollbar shadow-inner text-gray-700"
                    />
                </div>
            )}
        </div>
    );
});


const Icon = React.memo(({ name, className }) => {
    const iconRef = React.useRef(null);

    React.useEffect(() => {
        if (iconRef.current && window.lucide) {
            const nameStr = typeof name === 'string' ? name : String(name);
            iconRef.current.innerHTML = `<i data-lucide="${nameStr}" class="${className || ''}"></i>`;
            window.lucide.createIcons({ root: iconRef.current });
        }
    }, [name, className]);

    return <span ref={iconRef} style={{ display: 'contents' }} />;
});

// ===========================
// Reusable 3D Push Button
// ===========================
const Button3D = ({ children, onClick, type = 'button', disabled = false, topColorClass, bottomColorClass, className = '' }) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = (e) => {
        if (disabled || isPressed) return;
        setIsPressed(true);
        setTimeout(() => {
            setIsPressed(false);
            if (onClick) onClick(e);
        }, 150);
    };

    const spanTransform = isPressed
        ? '-translate-y-0.5'
        : '-translate-y-1 [@media(hover:hover)]:hover:-translate-y-2';

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            className={`rounded-xl border-none p-0 cursor-pointer outline-none w-full sm:w-auto ${bottomColorClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            <span className={`block px-6 md:px-8 py-3 rounded-xl text-white font-black text-sm md:text-base flex items-center justify-center gap-2 transform transition-transform duration-150 ease-out ${topColorClass} ${spanTransform} ${disabled ? 'pointer-events-none' : ''}`}>
                {children}
            </span>
        </button>
    );
};

// ===========================
// Unified Export Buttons
// ===========================
const ExportBtn = ({ onClick, icon, label, colorClass = 'text-gray-500 hover:bg-gray-100 hover:text-gray-700' }) => (
    <div className="relative group">
        <button
            onClick={onClick}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors ${colorClass}`}
        >
            <Icon name={icon} className="w-3.5 h-3.5" />
        </button>
        <span className="pointer-events-none absolute z-[100] -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {label}
        </span>
    </div>
);

const ExportBtns = ({ onPNG, onPDF, onExcel }) => (
    <div className="flex gap-1.5 export-buttons">
        {onPNG   && <ExportBtn onClick={onPNG}   icon="image"            label="تحميل PNG" />}
        {onPDF   && <ExportBtn onClick={onPDF}   icon="file-text"        label="تحميل PDF"  colorClass="text-rose-400 hover:bg-rose-50 hover:text-rose-600 border-rose-100" />}
        {onExcel && <ExportBtn onClick={onExcel} icon="file-spreadsheet" label="تصدير إكسيل" colorClass="text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 border-emerald-100" />}
    </div>
);

// ===========================
// Preview / Confirm Modal (Advanced Live Version)
// ===========================
const PreviewModal = ({ config, onClose }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [previewUrl, setPreviewUrl] = React.useState(null);
    const [tableData, setTableData] = React.useState(null);

    React.useEffect(() => {
        if (!config?.isOpen) {
            if (previewUrl && config?.type === 'PDF') URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            setTableData(null);
            return;
        }

        const generatePreview = async () => {
            setIsLoading(true);
            try {
                if (config.type === 'PNG') {
                    const el = document.getElementById(config.elementId);
                    if (!el) throw new Error("Element not found");
                    const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: '#ffffff' });
                    setPreviewUrl(canvas.toDataURL('image/png'));
                } else if (config.type === 'PDF') {
                    const el = document.getElementById(config.elementId);
                    if (!el) throw new Error("Element not found");
                    const canvas = await html2canvas(el, { useCORS: true, scale: 2 });
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new window.jspdf.jsPDF('l', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
                    const blob = pdf.output('blob');
                    setPreviewUrl(URL.createObjectURL(blob));
                } else if (config.type === 'Excel') {
                    setTableData(config.data || []);
                }
            } catch (err) {
                console.error("Preview generation failed:", err);
            }
            setIsLoading(false);
        };

        generatePreview();
    }, [config]);

    if (!config?.isOpen) return null;

    const handleDownload = () => {
        if (config.type === 'Excel') {
            config.onConfirm();
        } else {
            const link = document.createElement('a');
            link.href = previewUrl;
            link.download = config.filename;
            link.click();
        }
        onClose();
    };

    const icons = { PNG: 'image', PDF: 'file-text', Excel: 'file-spreadsheet' };
    const colors = { PNG: 'bg-indigo-600', PDF: 'bg-rose-600', Excel: 'bg-emerald-600' };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center backdrop-blur-md bg-black/50 p-4" onClick={onClose}>
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm ${colors[config.type] || 'bg-gray-700'}`}>
                            <Icon name={icons[config.type] || 'download'} className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-[#1e1b4b] text-lg">استعراض ملف {config.type}</h3>
                            <p className="text-[11px] text-gray-400 font-bold">{config.filename}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
                        <Icon name="x" className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30 custom-scrollbar relative min-h-[400px]">
                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                            <Icon name="loader" className="w-12 h-12 text-indigo-600 animate-spin" />
                            <p className="text-sm font-black text-gray-500 animate-pulse">جاري تجهيز الاستعراض الحي...</p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-500">
                            {config.type === 'PNG' && previewUrl && (
                                <img src={previewUrl} className="w-full h-auto shadow-md rounded-2xl border border-gray-200" alt="Preview" />
                            )}
                            {config.type === 'PDF' && previewUrl && (
                                <iframe src={previewUrl} className="w-full h-[65vh] border border-gray-200 rounded-2xl shadow-md" title="PDF Preview" />
                            )}
                            {config.type === 'Excel' && tableData && (
                                <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
                                    <table className="w-full text-right text-xs border-collapse bg-white">
                                        <thead>
                                            <tr className="bg-[#1e1b4b] text-white">
                                                {tableData.length > 0 && Object.keys(tableData[0]).map(key => (
                                                    <th key={key} className="p-4 font-black whitespace-nowrap border-b border-indigo-900">{key}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.map((row, idx) => (
                                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    {Object.values(row).map((val, vIdx) => (
                                                        <td key={vIdx} className="p-4 font-bold text-gray-600 border-b border-gray-100">{val}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
                    <button onClick={onClose} className="px-8 py-3 rounded-2xl text-sm font-black text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all">إلغاء</button>
                    <button 
                        disabled={isLoading || (!previewUrl && config.type !== 'Excel')}
                        onClick={handleDownload} 
                        className={`px-10 py-3 rounded-2xl text-sm font-black text-white shadow-lg transition-all flex items-center gap-2 ${
                            isLoading ? 'bg-gray-400 cursor-not-allowed' : 
                            (colors[config.type] || 'bg-gray-700') + ' hover:opacity-90'
                        }`}
                    >
                        <Icon name="download" className="w-4 h-4" /> تأكيد وتحميل الملف
                    </button>
                </div>
            </div>
        </div>
    );
};

function App() {
    // === State ===
    const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('falah_auth') === 'true');
    const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState(false);
    const [previewConfig, setPreviewConfig] = useState(null); // { isOpen, type, filename, onConfirm }

    const [activeTab, setActiveTab] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSurveyForm, setActiveSurveyForm] = useState(null);
    const [adminSubTab, setAdminSubTab] = useState('timing'); // Default admin tab focused on control

    const [dict, setDict] = useState(DEFAULT_DICTIONARY);
    const [surveys, setSurveys] = useState(INIT_SURVEYS);
    const [assessments, setAssessments] = useState({});

    const [isGlobalLoading, setIsGlobalLoading] = useState(true);
    const isRemoteUpdate = useRef(false);

    useEffect(() => {
        // Supabase Auth Listener
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!sessionStorage.getItem('falah_auth')) setIsAuthenticated(!!session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!sessionStorage.getItem('falah_auth')) setIsAuthenticated(!!session);
        });

        // Fetch Survey Responses & Global App Config
        const fetchGlobalData = async () => {
            setIsGlobalLoading(true);
            const [configRes, responsesRes] = await Promise.all([
                supabase.from('app_config').select('*').eq('id', 'global').maybeSingle(),
                supabase.from('survey_responses').select('survey_key, answers, created_at').order('created_at', { ascending: true })
            ]);

            isRemoteUpdate.current = true;
            if (configRes.data) {
                if (configRes.data.dict_data) setDict(configRes.data.dict_data);
                if (configRes.data.surveys_data) setSurveys(configRes.data.surveys_data);
                if (configRes.data.layout_data) setLayoutPrefs(configRes.data.layout_data);
                if (configRes.data.logos_data) setLogos(configRes.data.logos_data);
            }

            if (responsesRes.data && responsesRes.data.length > 0) {
                const grouped = {};
                responsesRes.data.forEach(row => {
                    const k = row.survey_key;
                    if (!grouped[k]) grouped[k] = [];
                    // Each row.answers is already the full submission object {timestamp, answers}
                    grouped[k].push(row.answers);
                });
                setAssessments(grouped);
            }
            setIsGlobalLoading(false);
        };
        fetchGlobalData();

        // Real-time Subscriptions
        const configSub = supabase.channel('config-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'app_config', filter: "id=eq.global" }, (payload) => {
                if (payload.new) {
                    isRemoteUpdate.current = true;
                    if (payload.new.dict_data) setDict(payload.new.dict_data);
                    if (payload.new.surveys_data) setSurveys(payload.new.surveys_data);
                    if (payload.new.layout_data) setLayoutPrefs(payload.new.layout_data);
                    if (payload.new.logos_data) setLogos(payload.new.logos_data);
                }
            })
            .subscribe();

        const responsesSub = supabase.channel('responses-channel')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'survey_responses' }, (payload) => {
                const row = payload.new;
                if (!row || !row.survey_key || !row.answers) return;
                setAssessments(prev => {
                    const next = { ...prev };
                    next[row.survey_key] = [...(next[row.survey_key] || []), row.answers];
                    return next;
                });
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
            supabase.removeChannel(configSub);
            supabase.removeChannel(responsesSub);
        };
    }, []);
    const [currentSubmissions, setCurrentSubmissions] = useState({});
    const [logos, setLogos] = useState(DEFAULT_LOGOS);

    // Layout & Print Settings with Customization Fields
    const [layoutPrefs, setLayoutPrefs] = useState({
        showHeader: true, showCharts: true, showSWOT: true, showTables: true, showGlobal: true,
        reportTitle: "تقرير التميز المؤسسي الموحد (Global QMS)",
        preparedByText: "مُعد التقرير",
        directorTitle: "مشرف الجودة بمدارس الفلاح بجدة",
        directorName: "أ. ياسر محمد شعبان",
        approverTitle: "الاعتماد - الإدارة العليا",
        approverName: "أ. علي السليماني"
    });

    const [toast, setToast] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });

    const [selectedLocation, setSelectedLocation] = useState('مكة المكرمة');
    const [selectedStage, setSelectedStage] = useState('ابتدائية');
    const [dashboardTarget, setDashboardTarget] = useState('إداريين');
    const [swotThresholds, setSwotThresholds] = useState({ strength: 80, weakness: 60 });
    const [compareScope, setCompareScope] = useState('all');
    const [compareViewMode, setCompareViewMode] = useState('domains');

    const [archiveFilterLoc, setArchiveFilterLoc] = useState('');
    const [archiveFilterStg, setArchiveFilterStg] = useState('');
    const [archiveFilterTrg, setArchiveFilterTrg] = useState('');

    // Quick QR generation state
    const [selectedLinkTarget, setSelectedLinkTarget] = useState('طلاب');
    const [selectedSurveyId, setSelectedSurveyId] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [qrUrl, setQrUrl] = useState('');

    const [missingQuestions, setMissingQuestions] = useState([]);

    const [editingCategory, setEditingCategory] = useState(null);
    const [editingQuestions, setEditingQuestions] = useState([]);

    // Survey Builder States
    const [isSurveyEditMode, setIsSurveyEditMode] = useState(false);
    const [surveyBuilderData, setSurveyBuilderData] = useState(null);
    const [builderPreviewMode, setBuilderPreviewMode] = useState(false);

    const [publicViewState, setPublicViewState] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('publicSurvey') === 'true') {
            return {
                isActive: true,
                surveyId: urlParams.get('surveyId'),
                location: urlParams.get('loc') || 'مكة المكرمة',
                stage: urlParams.get('stg') || 'ابتدائية',
                submitted: false
            };
        }
        return { isActive: false };
    });

    const updateAssessment = (key, qId, field, value) => {
        setCurrentSubmissions(prev => ({
            ...prev, [key]: { ...(prev[key] || {}), [qId]: { ...(prev[key]?.[qId] || {}), [field]: value } }
        }));
    };

    if (publicViewState.isActive) {
        const s = surveys.find(x => x.id === publicViewState.surveyId);

        if (!s || s.status !== 'نشط') {
            return (
                <div className="flex h-screen w-full bg-white items-center justify-center p-6" dir="rtl">
                    <div className="text-center max-w-md animate-in zoom-in-95">
                        <img src="https://alfalah.edu.sa/assets/images/logo.png" alt="شعار المدارس" className="w-28 h-28 object-contain mx-auto mb-6 drop-shadow-sm" />
                        <Icon name="slash" className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-black text-[#1e1b4b] mb-2">عفواً، هذه الاستبانة غير متاحة حالياً.</h2>
                        <p className="text-gray-500 font-bold">يرجى مراجعة إدارة المدرسة لمزيد من التفاصيل.</p>
                    </div>
                </div>
            );
        }

        const cooldowns = JSON.parse(localStorage.getItem('falah_v10_cooldowns')) || {};
        const lastSubmit = cooldowns[s.id];
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        if (lastSubmit && (Date.now() - new Date(lastSubmit).getTime()) < sevenDays) {
            return (
                <div className="flex h-screen w-full bg-white items-center justify-center p-6" dir="rtl">
                    <div className="text-center max-w-md animate-in zoom-in-95">
                        <img src="https://alfalah.edu.sa/assets/images/logo.png" alt="شعار المدارس" className="w-28 h-28 object-contain mx-auto mb-6 drop-shadow-sm" />
                        <Icon name="check-circle" className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-black text-[#1e1b4b] mb-2">عفواً، لقد قمت بالمشاركة في هذه الاستبانة مؤخراً.</h2>
                        <p className="text-gray-500 font-bold">شكراً لتعاونكم ومساهمتكم في تحسين جودة التعليم.</p>
                    </div>
                </div>
            );
        }

        if (publicViewState.submitted) {
            return (
                <div className="flex h-screen w-full bg-white items-center justify-center p-6" dir="rtl">
                    <div className="text-center max-w-md animate-in zoom-in-95">
                        <img src="https://alfalah.edu.sa/assets/images/logo.png" alt="شعار المدارس" className="w-28 h-28 object-contain mx-auto mb-6 drop-shadow-sm" />
                        <Icon name="heart" className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-black text-[#1e1b4b] mb-2">تم استلام تقييمك بنجاح!</h2>
                        <p className="text-gray-500 font-bold">نشكرك على وقتك الثمين ومساهمتك الفعالة في الارتقاء بمدارس الفلاح.</p>
                    </div>
                </div>
            );
        }

        const surveyData = dict[s.target];
        // Use location & stage from URL params so submissions land in the correct bucket
        const effectiveLoc = publicViewState.location || s.location || 'مكة المكرمة';
        const effectiveStg = publicViewState.stage  || s.stage  || 'ابتدائية';
        const key = `${effectiveLoc}-${effectiveStg}-${s.target}`;

        const handlePublicSubmit = async () => {
            const currentAnswers = currentSubmissions[key] || {};
            const missing = surveyData.questions.filter(q => {
                if (q.required === false) return false;
                if (q.type === 'text') return !currentAnswers[q.id]?.textAnswer?.trim();
                return currentAnswers[q.id]?.score === undefined;
            });

            if (missing.length > 0) {
                setMissingQuestions(missing);
                return;
            }

            const submissionPayload = {
                timestamp: new Date().toISOString(),
                answers: currentAnswers
            };

            console.log('[QMS] Submitting to Supabase:', { survey_key: key, answers: submissionPayload });

            const { error: insertError } = await supabase
                .from('survey_responses')
                .insert({ survey_key: key, answers: submissionPayload });

            if (insertError) {
                console.error('[QMS] INSERT FAILED — code:', insertError.code, '| message:', insertError.message, '| details:', insertError.details, '| hint:', insertError.hint);
                alert(`تعذّر إرسال التقييم.\nالسبب: ${insertError.message}\n\nيرجى التواصل مع إدارة النظام.`);
                return; // MUST NOT proceed to success screen
            }

            console.log('[QMS] INSERT SUCCESS ✓');

            // Clear in-progress answers
            setCurrentSubmissions(prev => {
                const next = { ...prev }; delete next[key]; return next;
            });

            // Cooldown: browser-level spam prevention only
            const newCooldowns = { ...cooldowns, [s.id]: new Date().toISOString() };
            localStorage.setItem('falah_v10_cooldowns', JSON.stringify(newCooldowns));

            // Show success screen
            setPublicViewState(prev => ({ ...prev, submitted: true }));
            window.scrollTo(0, 0);
        };

        const scrollToQuestion = (id) => {
            setMissingQuestions([]);
            setTimeout(() => {
                const element = document.getElementById(`question-${id}`);
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        };

        return (
            <div className="h-screen overflow-y-auto custom-scrollbar w-full bg-gray-50 p-4 md:p-8" dir="rtl">
                <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
                    <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <img src="https://alfalah.edu.sa/assets/images/logo.png" alt="شعار المدارس" className="w-28 h-28 object-contain mx-auto mb-6 drop-shadow-sm" />
                        <h2 className="text-3xl font-black text-[#1e1b4b] mb-2">{s.title}</h2>
                        <p className="text-gray-500 font-bold text-sm">فرع: {publicViewState.location} | مرحلة: {publicViewState.stage}</p>
                    </div>

                    <div className="space-y-6">
                        {surveyData.domains.map(domain => {
                            const domainQuestions = surveyData.questions.filter(c => c.domainId === domain.id);
                            return (
                                <div key={domain.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                                    <div className="p-5 text-white font-black flex items-center gap-3 text-lg" style={{ backgroundColor: domain.color }}>
                                        <Icon name="layers" className="w-5 h-5" /> {domain.name}
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {domainQuestions.map(q => (
                                            <SurveyQuestion
                                                key={q.id} q={q} currentData={currentSubmissions[key]?.[q.id] || {}}
                                                updateAssessment={updateAssessment} isMissing={missingQuestions.some(m => m.id === q.id)}
                                                assessmentKey={key}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
                        <Button3D
                            onClick={handlePublicSubmit}
                            topColorClass="bg-[#10b981]"
                            bottomColorClass="bg-emerald-700"
                            className="mx-auto"
                        >
                            <Icon name="check-circle" className="w-5 h-5" /> اعتماد وإرسال التقييم
                        </Button3D>
                    </div>

                    {missingQuestions.length > 0 && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center backdrop-blur-md bg-black/40 p-4">
                            <div className="bg-white p-8 rounded-[2rem] shadow-md max-w-md w-full animate-in zoom-in">
                                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Icon name="alert-circle" className="w-8 h-8 text-rose-600" />
                                </div>
                                <h3 className="text-2xl font-black text-center text-[#1e1b4b] mb-2">تنبيه: تقييم غير مكتمل</h3>
                                <p className="text-center text-gray-500 font-bold mb-6">يرجى استكمال تقييم جميع المعايير قبل الاعتماد. المعايير المتبقية:</p>
                                <ul className="bg-gray-50 p-4 rounded-xl mb-6 max-h-32 overflow-y-auto custom-scrollbar space-y-2 border border-gray-200">
                                    {missingQuestions.map(mq => (
                                        <li key={mq.id} className="text-sm font-black text-rose-600 flex items-center gap-2">
                                            <Icon name="x-circle" className="w-4 h-4" /> معيار {mq.displayId}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex gap-4">
                                    <button onClick={() => setMissingQuestions([])} className="flex-1 py-3 bg-gray-100 text-gray-600 font-black rounded-xl hover:bg-gray-200 transition-colors">إغلاق</button>
                                    <button onClick={() => scrollToQuestion(missingQuestions[0].id)} className="flex-1 py-3 bg-rose-600 text-white font-black rounded-xl hover:bg-rose-700 flex items-center justify-center gap-2 transition-colors">
                                        اذهب للسؤال <Icon name="arrow-down" className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Sync Global Data to Supabase
    useEffect(() => {
        if (!isAuthenticated || isGlobalLoading) return;
        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
            return;
        }

        const timer = setTimeout(() => {
            supabase.from('app_config').upsert({
                id: 'global',
                dict_data: dict,
                surveys_data: surveys,
                layout_data: layoutPrefs,
                logos_data: logos
            }).then();
        }, 1500);

        return () => clearTimeout(timer);
    }, [isAuthenticated, isGlobalLoading, dict, surveys, layoutPrefs, logos]);

    // Live Countdown Timer & Auto-Close
    const [surveyTimers, setSurveyTimers] = useState({});

    useEffect(() => {
        const calcTimers = () => {
            const now = Date.now();
            const newTimers = {};
            let needsUpdate = false;

            surveys.forEach(s => {
                if (s.autoClose && s.status === 'نشط') {
                    const closeDateStr = s.autoClose.includes('T') ? s.autoClose : s.autoClose + 'T23:59:59';
                    const closeDate = new Date(closeDateStr).getTime();
                    const diff = closeDate - now;
                    if (diff <= 0) {
                        newTimers[s.id] = { text: 'انتهت المدة', expired: true };
                        needsUpdate = true;
                    } else {
                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        let text = 'ينتهي بعد: ';
                        if (days > 0) text += `${days} يوم${hours > 0 ? ` و ${hours} ساعة` : ''}`;
                        else if (hours > 0) text += `${hours} ساعة${minutes > 0 ? ` و ${minutes} دقيقة` : ''}`;
                        else if (minutes > 0) text += `${minutes} دقيقة`;
                        else text += 'أقل من دقيقة';
                        newTimers[s.id] = { text, expired: false, days };
                    }
                }
            });

            setSurveyTimers(newTimers);

            if (needsUpdate) {
                setSurveys(prev => prev.map(s => {
                    if (s.autoClose && s.status === 'نشط') {
                        const closeDateStr = s.autoClose.includes('T') ? s.autoClose : s.autoClose + 'T23:59:59';
                        const closeDate = new Date(closeDateStr).getTime();
                        if (closeDate <= now) return { ...s, status: 'مغلق' };
                    }
                    return s;
                }));
            }
        };

        calcTimers();
        const interval = setInterval(calcTimers, 60000);
        return () => clearInterval(interval);
    }, [surveys]);

    // --- Handlers ---
    const handleLogin = async (e) => {
        e.preventDefault();
        
        // حساب الإدارة الثابت
        if (loginCreds.username === 'host@alfalah.com' && loginCreds.password === '1234') {
            setIsAuthenticated(true);
            sessionStorage.setItem('falah_auth', 'true');
            setLoginError(false);
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: loginCreds.username,
            password: loginCreds.password
        });
        if (error) {
            setLoginError(true);
        } else {
            setLoginError(false);
        }
    };

    const handleLogout = async () => {
        sessionStorage.removeItem('falah_auth');
        setIsAuthenticated(false);
        await supabase.auth.signOut();
    };

    const startEditingCategory = (category) => {
        setEditingCategory(category);
        setEditingQuestions(JSON.parse(JSON.stringify(dict[category].questions)));
    };

    const saveEditedQuestions = () => {
        setDict(prev => ({
            ...prev,
            [editingCategory]: {
                ...prev[editingCategory],
                questions: editingQuestions
            }
        }));
        setEditingCategory(null);
        showToast('تم تحديث المعايير بنجاح', 'success');
    };

    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
    const showConfirm = (title, message, onConfirm) => { setModal({ isOpen: true, title, message, onConfirm, type: 'danger' }); };
    const handlePrint = () => { setTimeout(() => window.print(), 300); };

    // --- Survey Builder Handlers ---
    const openSurveyBuilder = (existingSurvey = null) => {
        if (existingSurvey) {
            setSurveyBuilderData({
                isNew: false, id: existingSurvey.id, title: existingSurvey.title,
                target: existingSurvey.target, originalTarget: existingSurvey.target,
                location: existingSurvey.location || 'مكة المكرمة', stage: existingSurvey.stage || 'ابتدائية',
                icon: existingSurvey.icon, status: existingSurvey.status,
                dict: JSON.parse(JSON.stringify(dict[existingSurvey.target] || { domains: [], questions: [] }))
            });
        } else {
            setSurveyBuilderData({
                isNew: true, id: `S${Date.now()}`, title: '', target: '', originalTarget: '',
                location: 'مكة المكرمة', stage: 'ابتدائية',
                icon: 'file-text', status: 'مسودة', dict: { domains: [], questions: [] }
            });
        }
        setBuilderPreviewMode(false);
    };

    const closeSurveyBuilder = () => { setSurveyBuilderData(null); setBuilderPreviewMode(false); };

    const saveSurveyBuilder = () => {
        if (!surveyBuilderData.title || !surveyBuilderData.target) {
            return showToast('الرجاء إدخال عنوان الاستبانة والفئة المستهدفة', 'error');
        }

        setSurveys(prev => {
            const next = [...prev];
            const idx = next.findIndex(s => s.id === surveyBuilderData.id);
            const existingSurvey = idx > -1 ? next[idx] : {};
            const newSurveyObj = {
                id: surveyBuilderData.id, title: surveyBuilderData.title, target: surveyBuilderData.target,
                location: surveyBuilderData.location, stage: surveyBuilderData.stage,
                status: surveyBuilderData.status, icon: surveyBuilderData.icon,
                autoStart: existingSurvey.autoStart || '', autoClose: existingSurvey.autoClose || '', isAuto: existingSurvey.isAuto || false
            };
            if (idx > -1) next[idx] = newSurveyObj;
            else next.push(newSurveyObj);
            return next;
        });

        setDict(prev => {
            const next = { ...prev };
            if (!surveyBuilderData.isNew && surveyBuilderData.target !== surveyBuilderData.originalTarget) {
                delete next[surveyBuilderData.originalTarget];
            }
            next[surveyBuilderData.target] = surveyBuilderData.dict;
            return next;
        });

        showToast('تم حفظ الاستبانة بنجاح', 'success');
        closeSurveyBuilder();
    };

    const clearSurveyData = (target) => {
        showConfirm('تفريغ البيانات', `هل أنت متأكد من مسح جميع الردود والتقييمات الخاصة باستبانة (${target})؟ لن يتم حذف أسئلة الاستبانة، بل مسح الردود فقط.`, () => {
            setAssessments(prev => {
                const next = { ...prev };
                Object.keys(next).forEach(key => {
                    if (key.endsWith(`-${target}`)) next[key] = [];
                });
                return next;
            });
            showToast('تم تفريغ البيانات بنجاح', 'success');
            setModal(prev => ({ ...prev, isOpen: false }));
        });
    };

    const deleteSurvey = (id, target) => {
        showConfirm('حذف الاستبانة', `تحذير: أنت على وشك حذف الاستبانة (${target}) نهائياً، سيتم مسح الاستبانة وجميع البيانات والمعايير المرتبطة بها! لا يمكن التراجع عن هذا الإجراء.`, () => {
            setSurveys(prev => prev.filter(s => s.id !== id));
            setDict(prev => { const next = { ...prev }; delete next[target]; return next; });
            setAssessments(prev => {
                const next = { ...prev };
                Object.keys(next).forEach(key => {
                    if (key.endsWith(`-${target}`)) delete next[key];
                });
                return next;
            });
            showToast('تم حذف الاستبانة بنجاح', 'success');
            setModal(prev => ({ ...prev, isOpen: false }));
        });
    };
    // --- End Builder Handlers ---

    const exportData = (format) => {
        let flatData = [];
        Object.keys(assessments).forEach(key => {
            const targetCategory = key.split('-')[2];
            const questionsList = dict[targetCategory]?.questions || [];
            const list = assessments[key] || [];
            list.forEach((sub, idx) => {
                questionsList.forEach(q => {
                    if (sub.answers && sub.answers[q.id]) {
                        const score = sub.answers[q.id].score;
                        const note = sub.answers[q.id].note || '';
                        flatData.push({
                            'م': idx + 1, 'الفرع': key.split('-')[0], 'المرحلة': key.split('-')[1], 'الفئة': targetCategory,
                            'رقم المعيار': q.displayId, 'نص المعيار': q.text, 'الدرجة (من 5)': score,
                            'النسبة المئوية': `${(score / 5) * 100}%`,
                            'الملاحظات': note, 'وقت المشاركة': new Date(sub.timestamp).toLocaleString('ar-SA')
                        });
                    }
                });
            });
        });
        if (flatData.length === 0) return showToast('لا توجد بيانات مصدرة حالياً!', 'error');
        if (format === 'excel') {
            const ws = XLSX.utils.json_to_sheet(flatData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "تقرير الفلاح الشامل");
            XLSX.writeFile(wb, "تقرير_نظام_الجودة_الفلاح.xlsx");
            showToast('تم تصدير ملف Excel بنجاح');
        }
    };

    // Quick QR Generation Function (Simplified)
    const handleGenerateQuickLink = () => {
        const baseUrl = window.location.origin + window.location.pathname;
        const filteredSurveys = surveys.filter(s => s.target === selectedLinkTarget);
        const currentSurveyId = selectedSurveyId || (filteredSurveys.length > 0 ? filteredSurveys[0].id : null);

        if (!currentSurveyId) {
            showToast('لا توجد استبانات لهذه الفئة', 'danger');
            return;
        }

        const dynamicUrl = `${baseUrl}?publicSurvey=true&surveyId=${currentSurveyId}&loc=${selectedLocation}&stg=${selectedStage}`;
        setGeneratedLink(dynamicUrl);
        setQrUrl(`https://quickchart.io/qr?text=${encodeURIComponent(dynamicUrl)}&dark=1e1b4b&size=300&centerImageUrl=https://alfalah.edu.sa/assets/images/logo.png&margin=2`);
        showToast('تم توليد الباركود والرابط بنجاح', 'success');
    };

    // Export Utilities for Charts
    const exportToPNG = async (elementId, filename) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        const buttons = element.querySelectorAll('.export-buttons');
        buttons.forEach(b => b.style.display = 'none');
        try {
            const canvas = await window.html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            const link = document.createElement('a');
            link.download = `${filename}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            showToast('تم حفظ الصورة بنجاح', 'success');
        } catch (error) {
            console.error(error);
            showToast('حدث خطأ أثناء حفظ الصورة', 'danger');
        } finally {
            buttons.forEach(b => b.style.display = 'flex');
        }
    };

    const exportToPDF = async (elementId, filename) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        const buttons = element.querySelectorAll('.export-buttons');
        buttons.forEach(b => b.style.display = 'none');
        try {
            const canvas = await window.html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new window.jspdf.jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
            pdf.save(`${filename}.pdf`);
            showToast('تم حفظ ملف PDF بنجاح', 'success');
        } catch (error) {
            console.error(error);
            showToast('حدث خطأ أثناء حفظ الـ PDF', 'danger');
        } finally {
            buttons.forEach(b => b.style.display = 'flex');
        }
    };

    const exportChartExcel = (data, filename) => {
        if (!data || data.length === 0) return showToast('لا توجد بيانات مصدرة', 'danger');
        const ws = window.XLSX.utils.json_to_sheet(data);
        const wb = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(wb, ws, "البيانات المجمعة");
        window.XLSX.writeFile(wb, `${filename}.xlsx`);
        showToast('تم تصدير ملف Excel بنجاح', 'success');
    };

    // --- Analytical Engine (Percentages) ---
    const dashboardStats = useMemo(() => {
        const key = `${selectedLocation}-${selectedStage}-${dashboardTarget}`;
        const list = assessments[key] || [];
        const currentDict = dict[dashboardTarget];
        if (!currentDict) return { avgScore: 0, avgPercent: 0, domainData: [], total: 0, swot: { strengths: [], opportunities: [], weaknesses: [] }, hasData: false };

        let allScores = [];
        let questionScores = {};
        currentDict.questions.forEach(q => questionScores[q.id] = { total: 0, count: 0 });

        list.forEach(sub => {
            Object.keys(sub.answers).forEach(qId => {
                const s = sub.answers[qId]?.score;
                if (s !== undefined && questionScores[qId]) {
                    questionScores[qId].total += s;
                    questionScores[qId].count += 1;
                    allScores.push(s);
                }
            });
        });

        const avgScore = allScores.length ? (allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
        const avgPercent = Math.round((avgScore / 5) * 100);

        const domainData = currentDict.domains.map((d) => {
            const dQuestions = currentDict.questions.filter(q => q.domainId === d.id);
            let dTotal = 0; let dCount = 0;
            dQuestions.forEach(q => { dTotal += questionScores[q.id].total; dCount += questionScores[q.id].count; });
            const dAvg = dCount ? (dTotal / dCount) : 0;
            return { name: d.name, percentage: Math.round((dAvg / 5) * 100) };
        });

        // Helper: auto recommendation per domain
        const getRecommendation = (domainId, type) => {
            const recs = {
                d1: type === 'opportunity'
                    ? 'يُنصح بمراجعة موارد هذا المجال وتطوير خطة تحسين مدروسة.'
                    : 'يتطلب تدخلاً عاجلاً وتخصيص ميزانية للمعالجة الفورية.',
                d2: type === 'opportunity'
                    ? 'ينصح بتفعيل برامج التدريب وتبني مبادرات لتحسين هذا المحور.'
                    : 'هذا المجال حرج ويستوجب تحليل الأسباب الجذرية وخطة إصلاح مدروسة.',
                d3: type === 'opportunity'
                    ? 'مراجعة السياسات واللوائح المتعلقة وتعزيز التواصل في هذا الجانب.'
                    : 'يتطلب مراجعة فورية للموارد المخصصة وتحليل الأسباب الجذرية لهذا المجال.',
            };
            return recs[domainId] || 'يتطلب مراجعة شاملة وخطة تحسين واضحة لهذا المعيار.';
        };

        // Build enriched question list
        const enriched = currentDict.questions
            .filter(q => questionScores[q.id]?.count > 0)
            .map(q => {
                const avgQ = questionScores[q.id].total / questionScores[q.id].count;
                const pct = Math.round((avgQ / 5) * 100);
                const domain = currentDict.domains.find(d => d.id === q.domainId);
                return {
                    ...q,
                    percentage: pct,
                    avgScore: avgQ.toFixed(2),
                    domainName: domain?.name || '',
                    domainColor: domain?.color || '#94a3b8',
                };
            });

        const swot = {
            strengths: enriched
                .filter(q => q.percentage >= swotThresholds.strength)
                .sort((a, b) => b.percentage - a.percentage),
            opportunities: enriched
                .filter(q => q.percentage >= swotThresholds.weakness && q.percentage < swotThresholds.strength)
                .sort((a, b) => a.percentage - b.percentage)
                .map(q => ({ ...q, recommendation: getRecommendation(q.domainId, 'opportunity') })),
            weaknesses: enriched
                .filter(q => q.percentage < swotThresholds.weakness)
                .sort((a, b) => a.percentage - b.percentage)
                .map(q => ({ ...q, recommendation: getRecommendation(q.domainId, 'weakness') })),
        };

        return { avgScore: avgScore.toFixed(2), avgPercent, domainData, total: list.length, swot, hasData: list.length > 0 };
    }, [assessments, selectedLocation, selectedStage, dashboardTarget, dict, swotThresholds]);

    const realCompareCities = useMemo(() => {
        const targetToUse = ['معلمين', 'إداريين'].includes(compareScope) ? compareScope : dashboardTarget;
        const currentDict = dict[targetToUse];
        if (!currentDict) return [];
        return currentDict.domains.map(d => {
            const getCityPercent = (city) => {
                let totalScore = 0, count = 0;
                const stagesToProcess = (compareScope === 'all' || ['معلمين', 'إداريين'].includes(compareScope)) ? ['ابتدائية', 'متوسطة', 'ثانوية'] : [compareScope];
                stagesToProcess.forEach(stg => {
                    const key = `${city}-${stg}-${targetToUse}`;
                    const list = assessments[key] || [];
                    list.forEach(sub => {
                        currentDict.questions.filter(q => q.domainId === d.id).forEach(q => {
                            if (sub.answers[q.id]?.score !== undefined) { totalScore += sub.answers[q.id].score; count++; }
                        });
                    });
                });
                return count ? Math.round((totalScore / count / 5) * 100) : 0;
            };
            return { name: d.name, 'مكة المكرمة': getCityPercent('مكة المكرمة'), 'جدة': getCityPercent('جدة') };
        });
    }, [assessments, dashboardTarget, dict, compareScope]);

    const overallCompareData = useMemo(() => {
        const targetToUse = ['معلمين', 'إداريين'].includes(compareScope) ? compareScope : dashboardTarget;
        const currentDict = dict[targetToUse];
        if (!currentDict) return [];
        const getCityPercent = (city) => {
            let totalScore = 0, count = 0;
            const stagesToProcess = (compareScope === 'all' || ['معلمين', 'إداريين'].includes(compareScope)) ? ['ابتدائية', 'متوسطة', 'ثانوية'] : [compareScope];
            stagesToProcess.forEach(stg => {
                const key = `${city}-${stg}-${targetToUse}`;
                const list = assessments[key] || [];
                list.forEach(sub => {
                    currentDict.questions.forEach(q => {
                        if (sub.answers[q.id]?.score !== undefined) { totalScore += sub.answers[q.id].score; count++; }
                    });
                });
            });
            return count ? Math.round((totalScore / count / 5) * 100) : 0;
        };
        return [{ name: 'المتوسط العام', 'مكة المكرمة': getCityPercent('مكة المكرمة'), 'جدة': getCityPercent('جدة') }];
    }, [assessments, dashboardTarget, dict, compareScope]);
    const archiveData = useMemo(() => {
        let records = [];
        ['مكة المكرمة', 'جدة'].forEach(loc => {
            ['ابتدائية', 'متوسطة', 'ثانوية'].forEach(stg => {
                ['طلاب', 'معلمين', 'إداريين'].forEach(trg => {
                    const key = `${loc}-${stg}-${trg}`;
                    const list = assessments[key] || [];
                    if (list.length > 0) {
                        let scores = [];
                        list.forEach(sub => Object.values(sub.answers).forEach(ans => { if (ans?.score !== undefined) scores.push(ans.score) }));
                        const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
                        const lastTs = list[list.length - 1].timestamp;
                        records.push({
                            id: key, location: loc, stage: stg, target: trg,
                            participants: list.length,
                            percentage: Math.round((avg / 5) * 100),
                            lastUpdate: lastTs ? new Date(lastTs).toLocaleDateString('ar-SA') : 'غير متوفر'
                        });
                    }
                });
            });
        });
        return records;
    }, [assessments, dict]);


    // --- Shared UI Components ---
    const OfficialPrintHeader = () => (
        <div className={`print-only-header flex justify-between items-center w-full bg-white ${!layoutPrefs.showHeader ? 'no-print' : ''}`}>
            <div className="w-32 flex justify-start"><img src={logos.ministry} className="max-h-20" onError={(e) => { e.target.style.display = 'none' }} /></div>
            <div className="text-center flex-1 px-4">
                <h1 className="text-xl font-black text-black">المملكة العربية السعودية</h1>
                <h2 className="text-lg font-bold text-black mt-1">وزارة التعليم - الإدارة العامة للتعليم</h2>
                <h3 className="text-md font-black mt-2 bg-gray-100 inline-block px-6 py-1.5 rounded-full border border-gray-300">{layoutPrefs.reportTitle}</h3>
            </div>
            <div className="w-40 flex justify-end gap-4"><img src={logos.iso} className="max-h-16" onError={(e) => { e.target.style.display = 'none' }} /><img src={logos.school} className="max-h-20" onError={(e) => { e.target.style.display = 'none' }} /></div>
        </div>
    );

    const OfficialPrintSignature = () => (
        <div className="print-signature-block mt-8 pt-6 border-t-2 border-gray-300">
            <div className="flex justify-between items-start text-center px-10">
                <div>
                    <p className="font-bold text-gray-600 mb-8 text-sm">{layoutPrefs.preparedByText}</p>
                    <p className="text-gray-400">................................</p>
                </div>
                <div>
                    <p className="font-bold text-gray-600 mb-8 text-sm">{layoutPrefs.directorTitle}</p>
                    <p className="font-black text-[#1e1b4b]">{layoutPrefs.directorName}</p>
                </div>
                <div>
                    <p className="font-bold text-gray-600 mb-8 text-sm">{layoutPrefs.approverTitle}</p>
                    <p className="font-black text-[#1e1b4b]">{layoutPrefs.approverName}</p>
                </div>
            </div>
        </div>
    );

    const Marquee = () => (
        <div className="marquee-container no-print">
            <div className="marquee-content font-bold tracking-wide">
                ⭐ بوابة الاستبانات الرقمية - مدارس الفلاح الأهلية • إشراف الأستاذ: علي السليماني (مدير عام الشؤون الإدارية والمالية ونظام إدارة الجودة) • 🌍 يتوافق النظام مع معايير الأيزو 9001 • 💎 منظومة القيم: الاعتزاز بالقرآن والسنة واللغة العربية - الوسطية والاعتدال - الانتماء للوطن - الريادة والامتياز - الإحسان - المسؤولية. ⭐
            </div>
        </div>
    );

    // --- Authentication View ---
    if (!isAuthenticated) {
        return (
            <div className="flex h-screen w-full login-bg items-center justify-center px-4" dir="rtl">
                <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-md max-w-sm w-full border border-white/20 animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-[#eab308] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg transform rotate-3">
                        <Icon name="shield-check" className="w-10 h-10 text-[#1e1b4b]" />
                    </div>
                    <h2 className="text-2xl font-black text-center text-[#1e1b4b] mb-2">منظومة الفلاح</h2>
                    <p className="text-center text-gray-500 font-bold text-xs mb-8">إدارة التميز المؤسسي والجودة الشاملة</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {loginError && (
                            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-black text-center border border-rose-100 flex items-center justify-center gap-2">
                                <Icon name="alert-circle" className="w-4 h-4" /> بيانات الدخول غير صحيحة
                            </div>
                        )}
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">اسم المستخدم</label>
                            <div className="relative">
                                <Icon name="user" className="absolute right-3 top-3 text-gray-400 w-4 h-4" />
                                <input type="text" value={loginCreds.username} onChange={e => setLoginCreds({ ...loginCreds, username: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold focus:ring-2 focus:ring-[#1e1b4b] outline-none transition-all" placeholder="أدخل اسم المستخدم" required />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">كلمة المرور</label>
                            <div className="relative">
                                <Icon name="lock" className="absolute right-3 top-3 text-gray-400 w-4 h-4" />
                                <input type="password" value={loginCreds.password} onChange={e => setLoginCreds({ ...loginCreds, password: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold focus:ring-2 focus:ring-[#1e1b4b] outline-none transition-all" placeholder="أدخل كلمة المرور" required />
                            </div>
                        </div>
                        <Button3D
                            type="submit"
                            topColorClass="bg-[#1e1b4b] text-[#eab308]"
                            bottomColorClass="bg-indigo-950"
                            className="mt-2"
                        >
                            تسجيل الدخول <Icon name="arrow-left" className="w-4 h-4" />
                        </Button3D>
                    </form>
                    <p className="text-center text-[10px] text-gray-400 font-bold mt-6">للدعم الفني: أ. ياسر محمد شعبان (0509677841)</p>
                </div>
            </div>
        );
    }

    // --- Views ---
    const renderHome = () => (
        <div className="space-y-8 animate-in fade-in duration-700 print-area">
            <div className="relative w-full h-auto rounded-[2rem] overflow-hidden shadow-md border border-gray-100 bg-white">
                {/* الشعار المائي خلف المحتوى */}
                <img
                    src="https://www.alfalah.edu.sa/assets/images/logo.png"
                    alt="Watermark Logo"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 md:w-1/2 max-w-[350px] object-contain opacity-[0.15] z-0 pointer-events-none"
                />

                {/* المحتوى الرئيسي */}
                <div className="relative p-8 py-16 md:py-20 flex flex-col items-center justify-center z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-[#1e1b4b] mb-4 leading-tight">نظام إدارة الجودة</h2>
                    <p className="text-base md:text-xl text-[#1e1b4b] font-semibold max-w-2xl leading-relaxed mx-auto">المنصة الرسمية لمدارس الفلاح لرصد وتحليل وتقويم استبانات رضا المستفيد ومواءمتها مع متطلبات الأيزو 9001-2015 بشكل رقمي ذكي.</p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4 no-print w-full">
                        <button onClick={() => setActiveTab('surveys')} className="px-6 md:px-8 py-3 bg-[#eab308] text-[#1e1b4b] font-black rounded-xl flex items-center gap-2 shadow-lg transition-transform w-full sm:w-auto justify-center"><Icon name="play" className="w-5 h-5" /> بدء التقييم</button>
                        <button onClick={() => setActiveTab('dashboard')} className="px-6 md:px-8 py-3 bg-white text-[#1e1b4b] border border-gray-200 font-black rounded-xl hover:bg-gray-50 hover:shadow-md flex items-center gap-2 transition-all shadow-sm w-full sm:w-auto justify-center"><Icon name="pie-chart" className="w-5 h-5" /> عرض النتائج</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
                <div className="modern-card p-8 flex flex-col items-center text-center border-t-4 border-[#1e1b4b]">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5"><Icon name="eye" className="w-7 h-7 text-[#1e1b4b]" /></div>
                    <h3 className="text-xl font-black text-[#1e1b4b] mb-3">رؤيتنا</h3>
                    <p className="text-gray-500 font-semibold text-sm">متعلمون متميزون بالقيم الإسلامية والوطنية ومعايير التفوق العالمية.</p>
                </div>
                <div className="modern-card p-8 flex flex-col items-center text-center border-t-4 border-[#eab308]">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-5"><Icon name="book-open" className="w-7 h-7 text-[#eab308]" /></div>
                    <h3 className="text-xl font-black text-[#1e1b4b] mb-3">الرسالة</h3>
                    <p className="text-gray-500 font-semibold text-sm">تهيئةُ طلابنا للفلاح في دينهم وخُلُقهم والتفوق في مستقبلهم العلمي والمهني.</p>
                </div>
                <div className="modern-card p-8 flex flex-col items-center text-center border-t-4 border-[#10b981]">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5"><Icon name="star" className="w-7 h-7 text-emerald-600" /></div>
                    <h3 className="text-xl font-black text-[#1e1b4b] mb-3">شعارنا</h3>
                    <p className="text-emerald-600 font-black text-lg mt-2">"نتعلم لنكون لرواد الغد"</p>
                </div>
            </div>
        </div>
    );

    const renderSurveysList = () => {
        if (activeSurveyForm) {
            const s = surveys.find(x => x.id === activeSurveyForm);
            const surveyData = dict[s.target];
            const key = `${s.location || 'مكة المكرمة'}-${s.stage || 'ابتدائية'}-${s.target}`;

            const handleValidateAndSubmit = () => {
                const currentAnswers = currentSubmissions[key] || {};
                const missing = surveyData.questions.filter(q => {
                    if (q.required === false) return false;
                    if (q.type === 'text') return !currentAnswers[q.id]?.textAnswer?.trim();
                    return currentAnswers[q.id]?.score === undefined;
                });
                if (missing.length > 0) {
                    setMissingQuestions(missing);
                } else {
                    setAssessments(prev => ({
                        ...prev, [key]: [...(prev[key] || []), { timestamp: new Date().toISOString(), answers: currentAnswers }]
                    }));
                    setCurrentSubmissions(prev => {
                        const newSubs = { ...prev }; delete newSubs[key]; return newSubs;
                    });
                    showToast('تم إرسال وحفظ التقييم بنجاح!', 'success');
                    setTimeout(() => setActiveSurveyForm(null), 1000);
                }
            };

            const scrollToQuestion = (id) => {
                setMissingQuestions([]);
                setTimeout(() => {
                    const element = document.getElementById(`question-${id}`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            };

            return (
                <div className="animate-in slide-in-from-bottom-8 duration-500 pb-20 print-area">
                    <div className="flex flex-col md:flex-row justify-between items-center modern-card p-6 mb-8 no-print gap-4">
                        <div className="flex-1">
                            <h3 className="text-2xl font-black text-[#1e1b4b] mb-1">{s.title}</h3>
                            <p className="text-gray-500 font-bold text-sm">فرع: {selectedLocation} | مرحلة: {selectedStage} | التقييم بالنسبة المئوية</p>
                        </div>
                        <button onClick={() => setActiveSurveyForm(null)} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-black rounded-xl hover:bg-gray-200 flex items-center gap-2 transition-colors"><Icon name="x" className="w-4 h-4" /> العودة</button>
                    </div>

                    <div className="space-y-6">
                        {surveyData.domains.map(domain => {
                            const domainQuestions = surveyData.questions.filter(c => c.domainId === domain.id);

                            return (
                                <div key={domain.id} className="modern-card overflow-hidden">
                                    <div className="p-5 text-white font-black flex justify-between items-center print-area" style={{ backgroundColor: domain.color }}>
                                        <div className="flex items-center gap-3 text-lg"><Icon name="layers" className="w-5 h-5 no-print" /> {domain.name}</div>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {domainQuestions.map(q => (
                                            <SurveyQuestion
                                                key={q.id}
                                                q={q}
                                                currentData={currentSubmissions[key]?.[q.id] || {}}
                                                updateAssessment={updateAssessment}
                                                isMissing={missingQuestions.some(m => m.id === q.id)}
                                                assessmentKey={key}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 modern-card p-8 text-center no-print bg-gradient-to-b from-white to-gray-50">
                        <h4 className="text-xl font-black text-[#1e1b4b] mb-2">هل انتهيت من التقييم؟</h4>
                        <p className="text-sm font-semibold text-gray-500 mb-6">سيتم حفظ الدرجات وتحويلها فوراً لنسب مئوية في لوحة النتائج.</p>
                        <button onClick={handleValidateAndSubmit} className="px-8 py-3.5 bg-[#10b981] text-white font-black text-base rounded-xl hover:bg-[#059669] transition-all shadow-lg flex items-center justify-center gap-2 mx-auto">
                            <Icon name="check-circle" className="w-5 h-5" /> اعتماد التقييم
                        </button>
                    </div>

                    {missingQuestions.length > 0 && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center backdrop-blur-md bg-black/40">
                            <div className="bg-white p-8 rounded-[2rem] shadow-md max-w-md w-full m-4 animate-in zoom-in">
                                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Icon name="alert-circle" className="w-8 h-8 text-rose-600" />
                                </div>
                                <h3 className="text-2xl font-black text-center text-[#1e1b4b] mb-2">تنبيه: تقييم غير مكتمل</h3>
                                <p className="text-center text-gray-500 font-bold mb-6">يرجى استكمال تقييم جميع المعايير قبل الاعتماد. المعايير المتبقية:</p>
                                <ul className="bg-gray-50 p-4 rounded-xl mb-6 max-h-32 overflow-y-auto custom-scrollbar space-y-2 border border-gray-200">
                                    {missingQuestions.map(mq => (
                                        <li key={mq.id} className="text-sm font-black text-rose-600 flex items-center gap-2">
                                            <Icon name="x-circle" className="w-4 h-4" /> معيار {mq.displayId}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex gap-4">
                                    <button onClick={() => setMissingQuestions([])} className="flex-1 py-3 bg-gray-100 text-gray-600 font-black rounded-xl hover:bg-gray-200 transition-colors">إغلاق</button>
                                    <button onClick={() => scrollToQuestion(missingQuestions[0].id)} className="flex-1 py-3 bg-rose-600 text-white font-black rounded-xl hover:bg-rose-700 flex items-center justify-center gap-2 transition-colors">
                                        اذهب للسؤال <Icon name="arrow-down" className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (surveyBuilderData) {
            const { title, target, location, stage, icon, status, dict: builderDict } = surveyBuilderData;
            const updateField = (field, value) => setSurveyBuilderData(prev => ({ ...prev, [field]: value }));

            const addDomain = () => {
                const newDomain = { id: `d${Date.now()}`, name: 'مجال جديد', color: '#3b82f6' };
                setSurveyBuilderData(prev => ({ ...prev, dict: { ...prev.dict, domains: [...prev.dict.domains, newDomain] } }));
            };
            const updateDomain = (dId, field, value) => {
                setSurveyBuilderData(prev => ({ ...prev, dict: { ...prev.dict, domains: prev.dict.domains.map(d => d.id === dId ? { ...d, [field]: value } : d) } }));
            };
            const deleteDomain = (dId) => {
                setSurveyBuilderData(prev => ({ ...prev, dict: { ...prev.dict, domains: prev.dict.domains.filter(d => d.id !== dId), questions: prev.dict.questions.filter(q => q.domainId !== dId) } }));
            };
            const addQuestion = (dId) => {
                const qId = `Q${Date.now()}`;
                const newQ = { id: qId, domainId: dId, displayId: builderDict.questions.length + 1, text: 'سؤال جديد', type: 'scale', required: true };
                setSurveyBuilderData(prev => ({ ...prev, dict: { ...prev.dict, questions: [...prev.dict.questions, newQ] } }));
            };
            const updateQuestion = (qId, field, value) => {
                setSurveyBuilderData(prev => ({ ...prev, dict: { ...prev.dict, questions: prev.dict.questions.map(q => q.id === qId ? { ...q, [field]: value } : q) } }));
            };
            const deleteQuestion = (qId) => {
                setSurveyBuilderData(prev => ({ ...prev, dict: { ...prev.dict, questions: prev.dict.questions.filter(q => q.id !== qId) } }));
            };
            const moveQuestion = (index, dir) => {
                setSurveyBuilderData(prev => {
                    const nextQs = [...prev.dict.questions];
                    if (dir === 'up' && index > 0) [nextQs[index - 1], nextQs[index]] = [nextQs[index], nextQs[index - 1]];
                    else if (dir === 'down' && index < nextQs.length - 1) [nextQs[index + 1], nextQs[index]] = [nextQs[index], nextQs[index + 1]];
                    nextQs.forEach((q, i) => q.displayId = i + 1);
                    return { ...prev, dict: { ...prev.dict, questions: nextQs } };
                });
            };

            if (builderPreviewMode) {
                return (
                    <div className="fixed inset-0 z-[100] bg-gray-50 overflow-y-auto w-full h-full p-6 animate-in slide-in-from-bottom-8" dir="rtl">
                        <div className="max-w-4xl mx-auto space-y-6 pb-20 pt-10">
                            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-8 sticky top-0 z-50 border border-gray-200">
                                <h2 className="text-xl font-black text-[#1e1b4b] flex items-center gap-2"><Icon name="eye" className="text-[#eab308]" /> وضع المعاينة: {title}</h2>
                                <button onClick={() => setBuilderPreviewMode(false)} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-bold flex items-center gap-2 hover:bg-rose-100 transition-colors"><Icon name="x" className="w-4 h-4" /> إنهاء المعاينة</button>
                            </div>
                            {builderDict.domains.map(domain => {
                                const dQs = builderDict.questions.filter(q => q.domainId === domain.id);
                                return (
                                    <div key={domain.id} className="modern-card overflow-hidden">
                                        <div className="p-5 text-white font-black flex justify-between items-center" style={{ backgroundColor: domain.color }}>
                                            <div className="flex items-center gap-3 text-lg"><Icon name="layers" className="w-5 h-5" /> {domain.name}</div>
                                        </div>
                                        <div className="divide-y divide-gray-50">
                                            {dQs.map(q => (
                                                <div key={q.id} className="p-6 flex flex-col gap-4">
                                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                                        <div className="flex-1">
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 block">معيار {q.displayId} {q.required !== false && <span className="text-rose-500">*</span>}</span>
                                                            <p className="font-bold text-[#1e1b4b] text-base leading-relaxed">{q.text}</p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-3 shrink-0">
                                                            {(!q.type || q.type === 'scale') ? (
                                                                <div className="flex gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                                                                    {[1, 2, 3, 4, 5].map(score => (
                                                                        <button key={score} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 text-gray-300 hover:text-[#eab308]">
                                                                            <Icon name="star" className="w-6 h-6" />
                                                                        </button>
                                                                    ))}
                                                                </div>) : (
                                                                <textarea placeholder="إجابة نصية..." className="w-full md:w-64 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold outline-none" disabled></textarea>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }

            return (
                <div className="fixed inset-0 z-[90] bg-gray-50 overflow-y-auto w-full h-full animate-in zoom-in-95 duration-300" dir="rtl">
                    <div className="sticky top-0 bg-[#11032b] text-white p-4 shadow-md z-10 flex justify-between items-center border-b border-indigo-900">
                        <div className="flex items-center gap-4">
                            <button onClick={closeSurveyBuilder} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"><Icon name="arrow-right" className="w-5 h-5" /></button>
                            <div>
                                <h2 className="text-xl font-black flex items-center gap-2">{surveyBuilderData.isNew ? 'إنشاء استبانة جديدة' : 'تعديل الاستبانة'} <Icon name="tool" className="w-4 h-4 text-[#eab308]" /></h2>
                                <p className="text-[10px] text-gray-400 font-bold tracking-widest mt-0.5">Advanced Survey Builder</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setBuilderPreviewMode(true)} className="px-5 py-2 bg-white/10 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-colors text-sm"><Icon name="eye" className="w-4 h-4" /> معاينة</button>
                            <button onClick={saveSurveyBuilder} className="px-6 py-2 bg-[#10b981] text-white rounded-xl font-black flex items-center gap-2 shadow-lg hover:bg-[#059669] transition-all text-sm"><Icon name="save" className="w-4 h-4" /> حفظ واعتماد</button>
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto p-6 space-y-8 pb-32 pt-8">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                            <h3 className="text-lg font-black text-[#1e1b4b] mb-5 flex items-center gap-2"><Icon name="info" className="w-5 h-5 text-indigo-500" /> المعلومات الأساسية</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                                <div className="lg:col-span-2">
                                    <label className="text-xs font-black text-gray-500 block mb-2">عنوان الاستبانة</label>
                                    <input type="text" value={title} onChange={e => updateField('title', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-[#1e1b4b] focus:ring-1 focus:ring-[#1e1b4b] transition-all" placeholder="مثال: استبانة رضا المعلمين" />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-500 block mb-2">الفرع (Location)</label>
                                    <select value={location} onChange={e => updateField('location', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-[#1e1b4b] focus:ring-1 focus:ring-[#1e1b4b] transition-all">
                                        <option value="مكة المكرمة">مكة المكرمة</option>
                                        <option value="جدة">جدة</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-500 block mb-2">المرحلة (Stage)</label>
                                    <select value={stage} onChange={e => updateField('stage', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-[#1e1b4b] focus:ring-1 focus:ring-[#1e1b4b] transition-all">
                                        <option value="ابتدائية">ابتدائية</option>
                                        <option value="متوسطة">متوسطة</option>
                                        <option value="ثانوية">ثانوية</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-500 block mb-2">الفئة المراد تقييمها (Key)</label>
                                    <select value={target} onChange={e => updateField('target', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-[#1e1b4b] focus:ring-1 focus:ring-[#1e1b4b] transition-all">
                                        <option value="" disabled>-- اختر الفئة --</option>
                                        <option value="إداريين">إداريين</option>
                                        <option value="معلمين">معلمين</option>
                                        <option value="طلاب">طلاب</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-500 block mb-2">الأيقونة (Lucide)</label>
                                    <div className="relative">
                                        <select value={icon} onChange={e => updateField('icon', e.target.value)} className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-[#1e1b4b] focus:ring-1 focus:ring-[#1e1b4b] transition-all cursor-pointer appearance-none">
                                            <option value="users">مستخدمين </option>
                                            <option value="book-open">كتاب </option>
                                            <option value="home">الرئيسية</option>
                                            <option value="award">جائزة</option>
                                            <option value="file-text">مستند </option>
                                            <option value="star">نجمة </option>
                                            <option value="shield">درع </option>
                                            <option value="briefcase">حقيبة </option>
                                            <option value="target">هدف </option>
                                            <option value="activity">نشاط </option>
                                            <option value="clipboard">حافظة </option>
                                            <option value="pie-chart">رسم بياني </option>
                                            <option value="check-circle">صح </option>
                                            <option value="smile">وجه مبتسم </option>
                                            <option value="monitor">شاشة </option>
                                            <option value="globe">شبكة </option>
                                            <option value="settings">إعدادات </option>
                                        </select>
                                        <Icon name={icon || 'help-circle'} className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <div className="lg:col-span-4 border-t border-gray-100 pt-4 mt-2">
                                    <label className="text-xs font-black text-gray-500 block mb-3">حالة الاستبانة</label>
                                    <div className="flex gap-4">
                                        {['مسودة', 'نشط', 'مغلق'].map(st => (
                                            <label key={st} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${status === st ? 'border-[#1e1b4b] bg-indigo-50/50 text-[#1e1b4b]' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}`}>
                                                <input type="radio" name="status" checked={status === st} onChange={() => updateField('status', st)} className="hidden" />
                                                <span className="font-black text-sm">{st}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                                <h3 className="text-lg font-black text-[#1e1b4b] flex items-center gap-2"><Icon name="layers" className="w-5 h-5 text-[#eab308]" /> إدارة المجالات والمعايير</h3>
                                <button onClick={addDomain} className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-indigo-100 transition-colors"><Icon name="plus" className="w-4 h-4" /> مجال جديد</button>
                            </div>

                            {builderDict.domains.length === 0 && <div className="text-center p-12 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-bold flex flex-col items-center gap-3"><Icon name="box" className="w-10 h-10 text-gray-300" /> لا توجد مجالات حتى الآن. أضف مجالاً جديداً للبدء بإنشاء المعايير.</div>}

                            {builderDict.domains.map((domain) => (
                                <div key={domain.id} className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:border-gray-300 transition-colors">
                                    <div className="bg-gray-50/80 p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 flex-1">
                                            <input type="color" value={domain.color} onChange={e => updateDomain(domain.id, 'color', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0" title="لون المجال" />
                                            <input type="text" value={domain.name} onChange={e => updateDomain(domain.id, 'name', e.target.value)} className="flex-1 p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-black outline-none focus:border-[#1e1b4b] transition-all" placeholder="اسم المجال..." />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => addQuestion(domain.id)} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-emerald-100 transition-colors"><Icon name="plus-circle" className="w-4 h-4" /> إضافة سؤال</button>
                                            <button onClick={() => deleteDomain(domain.id)} className="w-9 h-9 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-100 transition-colors" title="حذف المجال"><Icon name="trash-2" className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="p-5 space-y-3 bg-white">
                                        {builderDict.questions.filter(q => q.domainId === domain.id).map((q) => {
                                            const globalIndex = builderDict.questions.findIndex(bq => bq.id === q.id);
                                            return (
                                                <div key={q.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-gray-50 border border-gray-200 p-3.5 rounded-xl transition-all hover:border-[#1e1b4b] group">
                                                    <div className="flex flex-col gap-1 shrink-0">
                                                        <button onClick={() => moveQuestion(globalIndex, 'up')} disabled={globalIndex === 0} className="w-7 h-6 bg-white border border-gray-200 text-gray-500 rounded flex items-center justify-center hover:bg-[#1e1b4b] hover:text-white disabled:opacity-30 transition-colors"><Icon name="chevron-up" className="w-4 h-4" /></button>
                                                        <button onClick={() => moveQuestion(globalIndex, 'down')} disabled={globalIndex === builderDict.questions.length - 1} className="w-7 h-6 bg-white border border-gray-200 text-gray-500 rounded flex items-center justify-center hover:bg-[#1e1b4b] hover:text-white disabled:opacity-30 transition-colors"><Icon name="chevron-down" className="w-4 h-4" /></button>
                                                    </div>
                                                    <div className="w-8 h-8 bg-white border border-gray-200 text-[#1e1b4b] font-black rounded-lg flex items-center justify-center text-xs shrink-0 shadow-sm">{q.displayId}</div>
                                                    <input type="text" value={q.text} onChange={e => updateQuestion(q.id, 'text', e.target.value)} className="flex-1 w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-[#1e1b4b] transition-all" placeholder="نص السؤال..." />
                                                    <div className="flex items-center gap-3 shrink-0 bg-white p-1.5 rounded-lg border border-gray-200">
                                                        <select value={q.type || 'scale'} onChange={e => updateQuestion(q.id, 'type', e.target.value)} className="p-1.5 bg-transparent text-xs font-black outline-none text-gray-700 cursor-pointer">
                                                            <option value="scale">مقياس (1-5)</option>
                                                            <option value="text">نص حر</option>
                                                        </select>
                                                        <div className="w-px h-6 bg-gray-200"></div>
                                                        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-black text-gray-600 px-2">
                                                            <input type="checkbox" checked={q.required !== false} onChange={e => updateQuestion(q.id, 'required', e.target.checked)} className="w-3.5 h-3.5 text-[#1e1b4b] rounded cursor-pointer" />
                                                            إلزامي
                                                        </label>
                                                        <div className="w-px h-6 bg-gray-200"></div>
                                                        <button onClick={() => deleteQuestion(q.id)} className="w-7 h-7 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-md flex items-center justify-center transition-colors"><Icon name="x" className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {builderDict.questions.filter(q => q.domainId === domain.id).length === 0 && (
                                            <p className="text-center text-xs font-bold text-gray-400 py-6">لم تتم إضافة معايير لهذا المجال بعد.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        const copyPublicLink = (surveyId) => {
            const baseUrl = window.location.origin + window.location.pathname;
            const url = `${baseUrl}?publicSurvey=true&surveyId=${surveyId}&loc=${encodeURIComponent(selectedLocation)}&stg=${encodeURIComponent(selectedStage)}`;
            navigator.clipboard.writeText(url).then(() => {
                showToast('تم نسخ الرابط العام بنجاح!', 'success');
            });
        };

        return (
            <div className="space-y-6 animate-in fade-in duration-500 pb-20 print-area">
                <div className="modern-card bg-[#11032b] p-8 md:p-10 text-white border-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-2 flex items-center gap-3"><Icon name="edit-3" className="text-[#eab308]" /> الاستبانات المتاحة</h2>
                        <p className="text-gray-400 font-semibold">اختر الاستبانة للبدء في الرصد والتسجيل.</p>
                    </div>
                    <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
                        <button onClick={() => setIsSurveyEditMode(!isSurveyEditMode)} className={`flex-1 md:flex-none px-5 py-3 rounded-xl font-black text-sm flex justify-center items-center gap-2 transition-all shadow-md ${isSurveyEditMode ? 'bg-[#eab308] text-[#1e1b4b]' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'}`}>
                            <Icon name="settings" className="w-4 h-4" /> {isSurveyEditMode ? 'إنهاء التحرير' : 'وضع التحرير'}
                        </button>
                        {isSurveyEditMode && (
                            <button onClick={() => openSurveyBuilder(null)} className="flex-1 md:flex-none px-5 py-3 bg-[#10b981] text-white rounded-xl font-black text-sm hover:bg-[#059669] flex justify-center items-center gap-2 transition-all shadow-lg">
                                <Icon name="plus" className="w-4 h-4" /> استبانة جديدة
                            </button>
                        )}
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1e1b4b] to-indigo-900 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 z-0"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    {surveys.map(s => (
                        <div key={s.id} className={`modern-card transition-all duration-300 motion-safe:hover:shadow-md p-8 flex flex-col group transition-all duration-300 ${s.status === 'نشط' ? 'hover:shadow-md hover:border-gray-200' : 'opacity-75'} ${isSurveyEditMode ? 'border-2 border-indigo-100 shadow-md ring-4 ring-indigo-50/50' : ''}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-inner ${isSurveyEditMode ? 'bg-[#1e1b4b] text-white' : 'bg-indigo-50 group-hover:bg-[#eab308] text-[#1e1b4b]'}`}>
                                    <Icon name={s.icon} className="w-6 h-6" />
                                </div>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full border shadow-sm ${s.status === 'نشط' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>{s.status}</span>
                            </div>
                            <h3 className="text-xl font-black text-[#1e1b4b] mb-2">{s.title}</h3>
                            <p className="text-xs font-bold text-gray-400 mb-6">مستهدفة لـ: {s.target}</p>

                            {s.status === 'نشط' && !isSurveyEditMode && (
                                <button onClick={() => copyPublicLink(s.id)} className="mb-4 w-full py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors">
                                    <Icon name="link" className="w-4 h-4" /> نسخ الرابط العام (للمستفيدين)
                                </button>
                            )}

                            {!isSurveyEditMode ? (
                                s.status === 'نشط' ? (
                                    <Button3D
                                        onClick={() => setActiveSurveyForm(s.id)}
                                        topColorClass="bg-[#11032b]"
                                        bottomColorClass="bg-indigo-950"
                                        className="mt-auto"
                                    >
                                        التقييم الداخلي <Icon name="arrow-left" className="w-4 h-4" />
                                    </Button3D>
                                ) : (
                                    <button disabled className="mt-auto w-full py-3.5 rounded-xl font-black flex justify-center items-center gap-2 bg-gray-100 text-gray-400 cursor-not-allowed">
                                        الاستبانة مغلقة <Icon name="arrow-left" className="w-4 h-4" />
                                    </button>
                                )
                            ) : (
                                <div className="mt-auto grid grid-cols-3 gap-2 animate-in fade-in zoom-in-95 duration-300">
                                    <button onClick={() => openSurveyBuilder(s)} className="py-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl font-black text-xs flex flex-col items-center gap-1.5 transition-all shadow-sm">
                                        <Icon name="edit" className="w-4 h-4" /> تعديل
                                    </button>
                                    <button onClick={() => clearSurveyData(s.target)} className="py-3 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-xl font-black text-xs flex flex-col items-center gap-1.5 transition-all shadow-sm" title="مسح التقييمات المسجلة">
                                        <Icon name="rotate-ccw" className="w-4 h-4" /> تفريغ الردود
                                    </button>
                                    <button onClick={() => deleteSurvey(s.id, s.target)} className="py-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl font-black text-xs flex flex-col items-center gap-1.5 transition-all shadow-sm" title="حذف الاستبانة نهائياً">
                                        <Icon name="trash-2" className="w-4 h-4" /> حذف الاستبانة
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderDashboard = () => (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 pb-20 print-area">
            <div className="modern-card transition-all duration-300 motion-safe:hover:shadow-md p-5 flex flex-col md:flex-row gap-4 items-center no-print">
                <div className="flex items-center gap-2 text-gray-500 font-black text-sm whitespace-nowrap"><Icon name="filter" className="w-4 h-4" /> الفلترة:</div>
                <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="flex-1 p-2.5 bg-gray-50 border border-gray-200 text-[#1e1b4b] rounded-xl font-bold outline-none focus:border-[#eab308]">
                    <option value="مكة المكرمة">مكة المكرمة</option>
                    <option value="جدة">جدة</option>
                </select>
                <select value={selectedStage} onChange={e => setSelectedStage(e.target.value)} className="flex-1 p-2.5 bg-gray-50 border border-gray-200 text-[#1e1b4b] rounded-xl font-bold outline-none focus:border-[#eab308]">
                    <option value="ابتدائية">ابتدائية</option>
                    <option value="متوسطة">متوسطة</option>
                    <option value="ثانوية">ثانوية</option>
                </select>
                <select value={dashboardTarget} onChange={e => setDashboardTarget(e.target.value)} className="flex-1 p-2.5 bg-gray-50 border border-gray-200 text-[#1e1b4b] rounded-xl font-bold outline-none focus:border-[#eab308]">
                    <option value="إداريين">نتائج الإداريين</option><option value="طلاب">نتائج الطلاب</option>
                    <option value="معلمين">نتائج المعلمين</option>
                </select>
            </div>

            <div className="hidden print-block mb-6 text-center border-b-2 border-black pb-4">
                <h2 className="text-2xl font-black">تقرير تحليل الأداء - فئة ({dashboardTarget})</h2>
                <h3 className="text-lg font-bold mt-2">فرع {selectedLocation} - مرحلة {selectedStage}</h3>
            </div>

            {!dashboardStats.hasData ? (
                <div className="modern-card transition-all duration-300 motion-safe:hover:shadow-md p-16 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Icon name="bar-chart-2" className="w-8 h-8 text-gray-300" /></div>
                    <h3 className="text-xl font-black text-[#1e1b4b] mb-2">لا توجد بيانات مسجلة حالياً</h3>
                    <p className="text-sm text-gray-500 font-semibold">قم بإجراء تقييم لهذه الفئة لتظهر النتائج هنا.</p>
                </div>
            ) : (
                <>
                    <div id="overall-stats-container" className="relative mb-6">
                        <div className="flex justify-between items-center mb-4 export-buttons">
                            <h3 className="text-lg font-black text-[#1e1b4b]">النتائج والنسب</h3>
                            <ExportBtns
                                onPNG={() => setPreviewConfig({ isOpen: true, type: 'PNG', elementId: 'overall-stats-container', filename: 'النتائج_والنسب.png' })}
                                onPDF={() => setPreviewConfig({ isOpen: true, type: 'PDF', elementId: 'overall-stats-container', filename: 'النتائج_والنسب.pdf' })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="modern-card transition-all duration-300 motion-safe:hover:shadow-md p-6 border-b-4 border-[#1e1b4b]">
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">متوسط نسبة الإنجاز</p>
                                <div className="text-4xl font-black text-[#1e1b4b]">{dashboardStats.avgPercent}<span className="text-lg text-gray-400">%</span></div>
                            </div>
                            <div className="modern-card transition-all duration-300 motion-safe:hover:shadow-md p-6 border-b-4 border-[#eab308]">
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">إجمالي الاستبانات المرسلة</p>
                                <div className="text-4xl font-black text-[#eab308]">{dashboardStats.total}</div>
                            </div>
                            <div className="modern-card transition-all duration-300 motion-safe:hover:shadow-md p-6 border-b-4 border-emerald-500">
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">نقاط القوة المكتشفة</p>
                                <div className="text-4xl font-black text-emerald-600">{dashboardStats.swot.strengths.length}</div>
                            </div>
                        </div>
                    </div>

                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${!layoutPrefs.showCharts ? 'no-print' : ''}`}>
                        <div id="dashboard-chart-container" className="modern-card transition-all duration-300 motion-safe:hover:shadow-md p-8 h-[400px] relative">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-black text-[#1e1b4b] flex items-center gap-2"><Icon name="bar-chart-2" className="text-[#eab308] w-5 h-5" /> تحليل أداء المجالات (نسبة مئوية)</h3>
                                <div className="flex gap-2 export-buttons">
                                    <ExportBtns
                                        onPNG={() => setPreviewConfig({ isOpen: true, type: 'PNG', elementId: 'dashboard-chart-container', filename: 'تحليل_المجالات.png' })}
                                        onPDF={() => setPreviewConfig({ isOpen: true, type: 'PDF', elementId: 'dashboard-chart-container', filename: 'تحليل_المجالات.pdf' })}
                                        onExcel={() => setPreviewConfig({ 
                                            isOpen: true, 
                                            type: 'Excel', 
                                            filename: 'تحليل_المجالات.xlsx', 
                                            data: dashboardStats.domainData,
                                            onConfirm: () => exportChartExcel(dashboardStats.domainData, 'تحليل_المجالات') 
                                        })}
                                    />
                                </div>
                            </div>
                            {BarChart && (
                                <ResponsiveContainer width="100%" height="85%">
                                    <BarChart data={dashboardStats.domainData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                        <XAxis type="number" domain={[0, 100]} hide />
                                        <YAxis dataKey="name" type="category" width={window.innerWidth < 768 ? 120 : 160} tick={{ textAnchor: 'start', dx: -10, fontFamily: 'Almarai', fontSize: window.innerWidth < 768 ? 10 : 12, fontWeight: 'bold', fill: '#475569' }} axisLine={false} tickLine={false} />
                                        <Tooltip wrapperStyle={{ pointerEvents: 'none', zIndex: 1000 }} cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontFamily: 'Almarai', fontSize: '12px', fontWeight: 'bold' }} formatter={(value) => [`${value}%`, 'النسبة']} />
                                        <Bar dataKey="percentage" fill="#1e1b4b" radius={[0, 8, 8, 0]} barSize={24}>
                                            <LabelList dataKey="percentage" content={<PercentageLabel />} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        <div className={`modern-card p-6 ${!layoutPrefs.showSWOT ? 'no-print' : ''}`}>
                            <h3 className="text-lg font-black text-[#1e1b4b] mb-5 flex items-center gap-2"><Icon name="zap" className="text-rose-500 w-5 h-5" /> مصفوفة التحليل (SWOT)</h3>

                            {/* STRENGTHS */}
                            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 mb-3">
                                <h4 className="font-black text-emerald-800 text-sm mb-3 flex items-center gap-2">
                                    <Icon name="trending-up" className="w-4 h-4" />
                                    نقاط القوة <span className="mr-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{swotThresholds.strength}%+</span>
                                </h4>
                                {dashboardStats.swot.strengths.length > 0 ? (
                                    <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                                        {dashboardStats.swot.strengths.map(q => (
                                            <div key={q.id} className="bg-white p-3 rounded-xl border border-emerald-100">
                                                <div className="flex justify-between items-start gap-2 mb-1.5">
                                                    <p className="text-xs font-bold text-gray-700 flex-1">{q.text}</p>
                                                    <span className="shrink-0 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{q.domainName}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${q.percentage}%` }} />
                                                    </div>
                                                    <span className="text-[11px] font-black text-emerald-700 w-14 text-left">{q.percentage}% <span className="text-gray-400 font-semibold text-[10px]">({q.avgScore}/5)</span></span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-emerald-400 text-xs font-semibold p-1">لا توجد نقاط قوة مسجلة بعد.</p>}
                            </div>

                            {/* OPPORTUNITIES */}
                            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 mb-3">
                                <h4 className="font-black text-amber-800 text-sm mb-3 flex items-center gap-2">
                                    <Icon name="target" className="w-4 h-4" />
                                    فرص التحسين <span className="mr-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{swotThresholds.weakness}%–{swotThresholds.strength - 1}%</span>
                                </h4>
                                {dashboardStats.swot.opportunities.length > 0 ? (
                                    <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                                        {dashboardStats.swot.opportunities.map(q => (
                                            <div key={q.id} className="bg-white p-3 rounded-xl border border-amber-100">
                                                <div className="flex justify-between items-start gap-2 mb-1.5">
                                                    <p className="text-xs font-bold text-gray-700 flex-1">{q.text}</p>
                                                    <span className="shrink-0 text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">{q.domainName}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${q.percentage}%` }} />
                                                    </div>
                                                    <span className="text-[11px] font-black text-amber-700 w-14 text-left">{q.percentage}% <span className="text-gray-400 font-semibold text-[10px]">({q.avgScore}/5)</span></span>
                                                </div>
                                                <div className="mt-2 flex items-start gap-1.5 bg-amber-50 border border-amber-100 rounded-lg p-2">
                                                    <Icon name="lightbulb" className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                                                    <p className="text-[10px] font-semibold text-amber-800">{q.recommendation}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-amber-400 text-xs font-semibold p-1">النتائج ضمن النطاق المقبول.</p>}
                            </div>

                            {/* WEAKNESSES */}
                            <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100">
                                <h4 className="font-black text-rose-800 text-sm mb-3 flex items-center gap-2">
                                    <Icon name="trending-down" className="w-4 h-4" />
                                    نقاط الضعف <span className="mr-1 text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">أقل من {swotThresholds.weakness}%</span>
                                </h4>
                                {dashboardStats.swot.weaknesses.length > 0 ? (
                                    <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                                        {dashboardStats.swot.weaknesses.map(q => (
                                            <div key={q.id} className="bg-white p-3 rounded-xl border border-rose-100">
                                                <div className="flex justify-between items-start gap-2 mb-1.5">
                                                    <p className="text-xs font-bold text-gray-700 flex-1">{q.text}</p>
                                                    <span className="shrink-0 text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">{q.domainName}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-rose-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${q.percentage}%` }} />
                                                    </div>
                                                    <span className="text-[11px] font-black text-rose-700 w-14 text-left">{q.percentage}% <span className="text-gray-400 font-semibold text-[10px]">({q.avgScore}/5)</span></span>
                                                </div>
                                                <div className="mt-2 flex items-start gap-1.5 bg-rose-50 border border-rose-100 rounded-lg p-2">
                                                    <Icon name="lightbulb" className="w-3 h-3 text-rose-500 mt-0.5 shrink-0" />
                                                    <p className="text-[10px] font-semibold text-rose-800">{q.recommendation}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-rose-400 text-xs font-semibold p-1">النظام مستقر، لا توجد نقاط ضعف حرجة.</p>}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    const renderArchive = () => {
        const filteredArchiveData = archiveData.filter(row => {
            if (archiveFilterLoc && row.location !== archiveFilterLoc) return false;
            if (archiveFilterStg && row.stage !== archiveFilterStg) return false;
            if (archiveFilterTrg && row.target !== archiveFilterTrg) return false;
            return true;
        });

        return (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 pb-20 print-area">
                <div className="modern-card transition-all duration-300 motion-safe:hover:shadow-md bg-gradient-to-r from-blue-900 to-[#11032b] p-10 text-white border-0 no-print">
                    <h2 className="text-3xl font-black mb-2 flex items-center gap-3"><Icon name="archive" className="text-[#eab308]" /> أرشيف الإحصائيات الشامل</h2>
                    <p className="text-blue-200 font-semibold text-sm">عرض تفصيلي لجميع الاستبانات المرصودة في النظام.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 no-print">
                    <div className="modern-card p-4">
                        <p className="text-[10px] text-gray-400 font-black uppercase mb-3 flex items-center gap-1"><Icon name="folder" className="w-3 h-3" /> الفروع</p>
                        <div className="flex gap-2">
                            {['مكة المكرمة', 'جدة'].map(loc => (
                                <button key={loc} onClick={() => setArchiveFilterLoc(archiveFilterLoc === loc ? '' : loc)} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all border ${archiveFilterLoc === loc ? 'bg-[#1e1b4b] text-white border-[#1e1b4b] shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>{loc}</button>
                            ))}
                        </div>
                    </div>
                    <div className="modern-card p-4">
                        <p className="text-[10px] text-gray-400 font-black uppercase mb-3 flex items-center gap-1"><Icon name="folder" className="w-3 h-3" /> المراحل</p>
                        <div className="flex gap-2">
                            {['ابتدائية', 'متوسطة', 'ثانوية'].map(stg => (
                                <button key={stg} onClick={() => setArchiveFilterStg(archiveFilterStg === stg ? '' : stg)} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all border ${archiveFilterStg === stg ? 'bg-[#1e1b4b] text-white border-[#1e1b4b] shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>{stg}</button>
                            ))}
                        </div>
                    </div>
                    <div className="modern-card p-4">
                        <p className="text-[10px] text-gray-400 font-black uppercase mb-3 flex items-center gap-1"><Icon name="folder" className="w-3 h-3" /> الفئات المستهدفة</p>
                        <div className="flex gap-2">
                            {['إداريين', 'طلاب', 'معلمين'].map(trg => (
                                <button key={trg} onClick={() => setArchiveFilterTrg(archiveFilterTrg === trg ? '' : trg)} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all border ${archiveFilterTrg === trg ? 'bg-[#1e1b4b] text-white border-[#1e1b4b] shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>{trg}</button>
                            ))}
                        </div>
                    </div>
                </div>

                <div id="archive-table-container" className="modern-card motion-safe:hover:shadow-md">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center export-buttons">
                        <h3 className="font-black text-[#1e1b4b]">سجل الإحصائيات <span className="text-gray-400 text-xs mr-2">({filteredArchiveData.length} سجل)</span></h3>
                        <ExportBtns
                            onPNG={() => setPreviewConfig({ isOpen: true, type: 'PNG', elementId: 'archive-table-container', filename: 'الأرشيف_الشامل.png' })}
                            onPDF={() => setPreviewConfig({ isOpen: true, type: 'PDF', elementId: 'archive-table-container', filename: 'الأرشيف_الشامل.pdf' })}
                            onExcel={() => setPreviewConfig({ 
                                isOpen: true, 
                                type: 'Excel', 
                                filename: 'الأرشيف_الشامل.xlsx', 
                                data: filteredArchiveData.map(row => ({
                                    "المدينة": row.location,
                                    "المرحلة": row.stage,
                                    "الفئة": row.target,
                                    "المشاركين": row.participants,
                                    "النسبة": `${row.percentage}%`,
                                    "الدرجة": row.avgScore,
                                    "تاريخ التحديث": row.updatedAt
                                })),
                                onConfirm: () => exportData('excel') 
                            })}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right text-sm block md:table">
                            <thead className="hidden md:table-header-group">
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 font-black text-gray-600">المدينة</th>
                                    <th className="p-4 font-black text-gray-600">المرحلة</th>
                                    <th className="p-4 font-black text-gray-600">الفئة المستهدفة</th>
                                    <th className="p-4 font-black text-gray-600 text-center">عدد المشاركين</th>
                                    <th className="p-4 font-black text-gray-600 text-center">التقييم العام</th>
                                    <th className="p-4 font-black text-gray-600 text-center">تاريخ التحديث</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 block md:table-row-group">
                                {filteredArchiveData.length > 0 ? filteredArchiveData.map((row, idx) => (
                                    <tr key={idx} className="block md:table-row p-4 md:p-0 mb-4 md:mb-0 border border-gray-100 md:border-0 rounded-xl md:rounded-none hover:bg-gray-50/50 transition-colors">
                                        <td className="flex md:table-cell justify-between items-center p-2 md:p-4 font-bold text-[#1e1b4b] border-b md:border-0 border-gray-50"><span className="md:hidden text-xs text-gray-400">المدينة:</span>{row.location}</td>
                                        <td className="flex md:table-cell justify-between items-center p-2 md:p-4 font-semibold text-gray-600 border-b md:border-0 border-gray-50"><span className="md:hidden text-xs text-gray-400">المرحلة:</span><span className="bg-gray-100 px-2 py-1 rounded-md text-xs">{row.stage}</span></td>
                                        <td className="flex md:table-cell justify-between items-center p-2 md:p-4 font-bold text-gray-700 border-b md:border-0 border-gray-50"><span className="md:hidden text-xs text-gray-400">الفئة:</span>{row.target}</td>
                                        <td className="flex md:table-cell justify-between items-center p-2 md:p-4 text-center md:text-center border-b md:border-0 border-gray-50">
                                            <span className="md:hidden text-xs text-gray-400">المشاركين:</span>
                                            <span className="text-xs font-black px-2 py-1 rounded-md bg-emerald-50 text-emerald-600">
                                                {row.participants} مشارك
                                            </span>
                                        </td>
                                        <td className="flex md:table-cell justify-between items-center p-2 md:p-4 text-center md:text-center border-b md:border-0 border-gray-50">
                                            <span className="md:hidden text-xs text-gray-400">التقييم:</span>
                                            <div className="flex items-center md:justify-center gap-2">
                                                <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#1e1b4b]" style={{ width: `${row.percentage}%` }}></div></div>
                                                <span className="font-black text-[#1e1b4b] w-8 text-left">{row.percentage}%</span>
                                            </div>
                                        </td>
                                        <td className="flex md:table-cell justify-between items-center p-2 md:p-4 text-center md:text-center text-xs text-gray-500 font-bold"><span className="md:hidden text-xs text-gray-400">التاريخ:</span>{row.lastUpdate}</td>
                                    </tr>
                                )) : <tr className="block md:table-row"><td colSpan="6" className="p-8 text-center text-gray-400 font-bold block md:table-cell">لا توجد سجلات مطابقة للبحث</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    // --- الإدارة المدمجة ---
    const renderAdmin = () => (
        <div className="h-full flex flex-col animate-in slide-in-from-right-8 duration-500 pb-10 print-area">
            <div className="modern-card bg-[#11032b] p-8 text-white flex justify-between items-center mb-6 shrink-0 border-0">
                <div>
                    <h2 className="text-2xl font-black mb-1 flex items-center gap-3"><Icon name="settings" className="text-[#eab308] w-6 h-6" /> الإدارة والتحكم</h2>
                    <p className="text-gray-400 font-semibold text-sm">لوحة تحكم كاملة للنظام، الاستبانات، والمقارنات.</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6 p-2 shrink-0 no-print">
                {[
                    { id: 'timing', name: 'إدارة وحالة الاستبانات', icon: 'clock' },
                    { id: 'layout', name: 'تخصيص المطبوعات (الترويسات)', icon: 'layout' },
                    { id: 'surveys', name: 'تحرير المعايير', icon: 'edit' },
                    { id: 'compare', name: 'المقارنات الإحصائية', icon: 'bar-chart' },
                    { id: 'qr', name: 'الروابط والمشاركة', icon: 'qr-code' },
                    { id: 'security', name: 'الأمن والبيانات', icon: 'shield-alert' }
                ].map(tab => (
                    <button key={tab.id} onClick={() => setAdminSubTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-sm transition-all ${adminSubTab === tab.id ? 'bg-[#11032b] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                        <Icon name={tab.icon} className="w-4 h-4" /> {tab.name}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">

                {/* إدارة وحالة الاستبانات */}
                {adminSubTab === 'timing' && (
                    <div className="modern-card p-8 space-y-6">
                        <h3 className="text-xl font-black text-[#1e1b4b] border-b border-gray-100 pb-4 flex items-center gap-2"><Icon name="clock" className="w-5 h-5 text-blue-500" /> إدارة وحالة الاستبانات</h3>
                        <p className="text-sm font-semibold text-gray-500 mb-6">تحكم في إغلاق وفتح الاستبانات، أو حدد تواريخ ليتم التحكم بها آلياً.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {surveys.map(s => (
                                <div key={s.id} className={`p-5 border border-gray-200 rounded-2xl bg-gray-50/50 hover:border-[#eab308] transition-colors shadow-sm ${s.status !== 'نشط' ? 'opacity-80' : ''}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="font-black text-[#1e1b4b] text-lg">{s.title}</p>
                                            <p className="text-xs text-gray-400 font-bold mt-1">مستهدفة لـ: {s.target}</p>
                                        </div>
                                        <button onClick={() => {
                                            const up = surveys.map(x => x.id === s.id ? { ...x, status: x.status === 'نشط' ? 'مغلق' : 'نشط' } : x);
                                            setSurveys(up);
                                            showToast(s.status === 'نشط' ? 'تم إغلاق الاستبانة ولن تظهر للمستفيدين' : 'تم تفعيل وفتح الاستبانة بنجاح');
                                        }} className={`px-4 py-1.5 rounded-lg text-xs font-black text-white shadow-sm transition-colors ${s.status === 'نشط' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                                            {s.status === 'نشط' ? 'إغلاق الاستبانة' : 'مغلقة (انقر للفتح)'}
                                        </button>
                                    </div>
                                    {surveyTimers[s.id] && (
                                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold mb-4 ${surveyTimers[s.id].expired ? 'bg-rose-50 text-rose-600 border border-rose-100' : surveyTimers[s.id].days <= 3 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                                            <Icon name={surveyTimers[s.id].expired ? 'alert-circle' : 'timer'} className="w-3.5 h-3.5" />
                                            {surveyTimers[s.id].text}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-500 block mb-1">تاريخ ووقت الفتح (اختياري)</label>
                                            <input type="datetime-local" value={s.autoStart || ''} onChange={(e) => {
                                                const up = surveys.map(x => x.id === s.id ? { ...x, autoStart: e.target.value } : x);
                                                setSurveys(up);
                                            }} className="w-full p-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:border-[#1e1b4b]" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-500 block mb-1">تاريخ ووقت الإغلاق (اختياري)</label>
                                            <input type="datetime-local" value={s.autoClose || ''} onChange={(e) => {
                                                const up = surveys.map(x => x.id === s.id ? { ...x, autoClose: e.target.value } : x);
                                                setSurveys(up);
                                            }} className="w-full p-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:border-[#1e1b4b]" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* تخصيص المطبوعات والترويسات */}
                {adminSubTab === 'layout' && (
                    <div className="modern-card p-8 space-y-6">
                        <h3 className="text-xl font-black text-[#1e1b4b] border-b border-gray-100 pb-4 flex items-center gap-2"><Icon name="layout" className="w-5 h-5 text-blue-500" /> تخصيص التقرير المطبوع (الترويسات والاعتمادات)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-gray-500">عنوان التقرير الرئيسي (يظهر في أعلى الصفحة)</label>
                                <input type="text" value={layoutPrefs.reportTitle} onChange={e => setLayoutPrefs({ ...layoutPrefs, reportTitle: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-[#eab308]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500">مسمى المُعد (التوقيع الأول)</label>
                                <input type="text" value={layoutPrefs.preparedByText} onChange={e => setLayoutPrefs({ ...layoutPrefs, preparedByText: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-[#eab308]" />
                            </div>
                            <div className="space-y-2"></div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500">مسمى المشرف (الاعتماد الأوسط)</label>
                                <input type="text" value={layoutPrefs.directorTitle} onChange={e => setLayoutPrefs({ ...layoutPrefs, directorTitle: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-[#eab308]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500">اسم المشرف</label>
                                <input type="text" value={layoutPrefs.directorName} onChange={e => setLayoutPrefs({ ...layoutPrefs, directorName: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-[#eab308]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500">مسمى الإدارة (الاعتماد النهائي)</label>
                                <input type="text" value={layoutPrefs.approverTitle} onChange={e => setLayoutPrefs({ ...layoutPrefs, approverTitle: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-[#eab308]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500">اسم المدير</label>
                                <input type="text" value={layoutPrefs.approverName} onChange={e => setLayoutPrefs({ ...layoutPrefs, approverName: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-[#eab308]" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="font-bold text-sm text-[#1e1b4b]">إظهار الترويسة والشعارات الرسمية</span>
                                <input type="checkbox" checked={layoutPrefs.showHeader} onChange={() => setLayoutPrefs({ ...layoutPrefs, showHeader: !layoutPrefs.showHeader })} className="toggle-switch" />
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="font-bold text-sm text-[#1e1b4b]">إظهار الرسوم البيانية (Charts)</span>
                                <input type="checkbox" checked={layoutPrefs.showCharts} onChange={() => setLayoutPrefs({ ...layoutPrefs, showCharts: !layoutPrefs.showCharts })} className="toggle-switch" />
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="font-bold text-sm text-[#1e1b4b]">إظهار مصفوفة التحليل الرباعي (SWOT)</span>
                                <input type="checkbox" checked={layoutPrefs.showSWOT} onChange={() => setLayoutPrefs({ ...layoutPrefs, showSWOT: !layoutPrefs.showSWOT })} className="toggle-switch" />
                            </div>
                        </div>
                    </div>
                )}

                {/* محرر الأسئلة */}
                {adminSubTab === 'surveys' && (
                    <div className="modern-card p-8 space-y-6">
                        <h3 className="text-xl font-black text-[#1e1b4b] border-b border-gray-100 pb-4 flex items-center gap-2"><Icon name="edit" className="w-5 h-5 text-blue-500" /> المحرر الديناميكي للمعايير</h3>
                        <p className="text-sm font-bold text-gray-500 mb-4">قم بتعديل نصوص المعايير لأي فئة وسيتم تحديثها فوراً.</p>
                        {!editingCategory ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.keys(dict).map(cat => (
                                    <div key={cat} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border hover:border-[#1e1b4b] transition-colors">
                                        <div className="font-black text-[#1e1b4b] text-lg">معايير ({cat})</div>
                                        <button onClick={() => startEditingCategory(cat)} className="px-6 py-2 bg-indigo-100 text-indigo-700 font-black rounded-xl hover:bg-indigo-200">تعديل الأسئلة</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in">
                                <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                    <h4 className="font-black text-indigo-900">جاري تعديل معايير: {editingCategory}</h4>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingCategory(null)} className="px-4 py-2 bg-white text-gray-500 font-black rounded-lg border hover:bg-gray-100">إلغاء</button>
                                        <button onClick={saveEditedQuestions} className="px-6 py-2 bg-emerald-600 text-white font-black rounded-lg shadow hover:bg-emerald-700">حفظ التعديلات</button>
                                    </div>
                                </div>
                                {editingQuestions.map((q, idx) => (
                                    <div key={q.id} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl border">
                                        <span className="bg-[#1e1b4b] text-white w-8 h-8 flex items-center justify-center rounded-lg font-black shrink-0">{q.displayId}</span>
                                        <textarea value={q.text} onChange={(e) => { const newQs = [...editingQuestions]; newQs[idx].text = e.target.value; setEditingQuestions(newQs); }} className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-[#eab308] outline-none resize-y min-h-[60px]" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* محرك المقارنات */}
                {adminSubTab === 'compare' && (
                    <div className="space-y-6">
                        <div className="modern-card p-5 flex flex-col md:flex-row gap-6 items-center bg-gray-50/50 justify-between">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <span className="font-black text-[#1e1b4b] whitespace-nowrap text-sm"><Icon name="filter" className="inline w-4 h-4 ml-1" /> نطاق المقارنة:</span>
                                <select value={compareScope} onChange={(e) => setCompareScope(e.target.value)} className="flex-1 md:w-48 bg-white border border-gray-200 text-[#1e1b4b] rounded-xl px-4 py-2 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-[#1e1b4b] transition-all">
                                    <option value="all">مقارنة عامة (مكة ضد جدة)</option>
                                    <option value="ابتدائية">الابتدائية (مكة ضد جدة)</option>
                                    <option value="متوسطة">المتوسطة (مكة ضد جدة)</option>
                                    <option value="ثانوية">الثانوية (مكة ضد جدة)</option>
                                    <option value="معلمين">المعلمين (مكة ضد جدة)</option>
                                    <option value="إداريين">الإداريين (مكة ضد جدة)</option>
                                </select>
                            </div>

                            <div className="flex bg-gray-200/50 p-1 rounded-xl w-full md:w-auto">
                                <button onClick={() => setCompareViewMode('domains')} className={`flex-1 md:px-6 py-2 rounded-lg font-bold text-sm transition-all ${compareViewMode === 'domains' ? 'bg-white text-[#1e1b4b] shadow-sm' : 'text-gray-500 hover:text-[#1e1b4b]'}`}>تفصيلي للمجالات</button>
                                <button onClick={() => setCompareViewMode('overall')} className={`flex-1 md:px-6 py-2 rounded-lg font-bold text-sm transition-all ${compareViewMode === 'overall' ? 'bg-[#1e1b4b] text-white shadow-sm' : 'text-gray-500 hover:text-[#1e1b4b]'}`}>المتوسط العام</button>
                            </div>
                        </div>

                        <div id="compare-chart-container" className="modern-card p-8 h-[400px] relative">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                                <h3 className="text-lg font-black text-[#1e1b4b] text-center md:text-right">
                                    {(() => {
                                        const targetText = ['معلمين', 'إداريين'].includes(compareScope) ? compareScope : dashboardTarget;
                                        const stageText = ['معلمين', 'إداريين'].includes(compareScope) || compareScope === 'all' ? 'جميع المراحل' : compareScope;
                                        return compareViewMode === 'domains'
                                            ? `مقارنة تفصيلية لمجالات (${targetText}) - ${stageText}`
                                            : `المتوسط العام لأداء (${targetText}) - ${stageText}`;
                                    })()}
                                </h3>
                                <ExportBtns
                                    onPNG={() => setPreviewConfig({ isOpen: true, type: 'PNG', elementId: 'compare-chart-container', filename: 'المقارنات_الإحصائية.png' })}
                                    onPDF={() => setPreviewConfig({ isOpen: true, type: 'PDF', elementId: 'compare-chart-container', filename: 'المقارنات_الإحصائية.pdf' })}
                                    onExcel={() => {
                                        const data = compareViewMode === 'domains' ? realCompareCities : overallCompareData;
                                        setPreviewConfig({ 
                                            isOpen: true, 
                                            type: 'Excel', 
                                            filename: 'المقارنات_الإحصائية.xlsx', 
                                            data: data,
                                            onConfirm: () => exportChartExcel(data, 'المقارنات_الإحصائية') 
                                        });
                                    }}
                                />
                            </div>

                            {BarChart && (
                                <ResponsiveContainer width="100%" height="85%">
                                    <BarChart data={compareViewMode === 'domains' ? realCompareCities : overallCompareData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" tick={{ fontFamily: 'Almarai', fontSize: 12, fontWeight: 'bold', fill: '#475569' }} axisLine={false} tickLine={false} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', fontFamily: 'Almarai', fontWeight: 'bold' }} formatter={(val) => [`${val}%`]} />
                                        <Legend wrapperStyle={{ fontFamily: 'Almarai', fontWeight: 'bold', fontSize: '12px', paddingTop: '10px' }} />
                                        <Bar name="مكة المكرمة" dataKey="مكة المكرمة" fill="#1e1b4b" radius={[6, 6, 0, 0]} barSize={compareViewMode === 'overall' ? 80 : 40}>
                                            <LabelList dataKey="مكة المكرمة" content={<PercentageLabel />} />
                                        </Bar>
                                        <Bar name="جدة" dataKey="جدة" fill={compareViewMode === 'overall' ? "#10b981" : "#eab308"} radius={[6, 6, 0, 0]} barSize={compareViewMode === 'overall' ? 80 : 40}>
                                            <LabelList dataKey="جدة" content={<PercentageLabel />} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                )}

                {/* الروابط */}
                {adminSubTab === 'qr' && (
                    <div className="modern-card p-8 space-y-6">
                        <h3 className="text-xl font-black text-[#1e1b4b] border-b pb-4 flex items-center gap-2"><Icon name="qr-code" className="w-5 h-5 text-blue-500" /> الروابط المباشرة والمشاركة</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <p className="text-sm font-bold text-gray-500">أنشئ رابط مباشر وسريع لفرع معين.</p>
                                <select value={selectedLinkTarget} onChange={e => { setSelectedLinkTarget(e.target.value); setSelectedSurveyId(''); }} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none">
                                    <option value="" disabled>-- اختر الفئة المستهدفة --</option>
                                    {Object.keys(dict).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <select value={selectedSurveyId} onChange={e => setSelectedSurveyId(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none">
                                    <option value="" disabled>-- اختر الاستبانة --</option>
                                    {surveys.filter(s => s.target === selectedLinkTarget).map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                </select>
                                <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none"><option>مكة المكرمة</option><option>جدة</option></select>
                                <select value={selectedStage} onChange={e => setSelectedStage(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none"><option>ابتدائية</option><option>متوسطة</option><option>ثانوية</option></select>
                                <button onClick={handleGenerateQuickLink} className="w-full py-3 bg-[#1e1b4b] text-white font-black rounded-xl hover:bg-blue-900 transition-colors">توليد الرابط</button>
                            </div>
                            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-200 rounded-2xl">
                                {qrUrl ? (
                                    <div className="text-center w-full animate-in zoom-in">
                                        <img src={qrUrl} className="w-48 h-48 mx-auto mb-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100 object-contain" />
                                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2 mb-3">
                                            <input type="text" readOnly value={generatedLink} className="flex-1 bg-transparent outline-none text-[10px] text-left dir-ltr text-blue-600 font-bold" />
                                            <button onClick={() => { navigator.clipboard.writeText(generatedLink); showToast('تم نسخ الرابط بنجاح!', 'success'); }} className="text-gray-500 hover:text-[#1e1b4b] shrink-0 p-1"><Icon name="copy" className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-400 text-center"><Icon name="link" className="w-12 h-12 mx-auto mb-2 opacity-50" /><p className="text-xs font-bold">حدد الفرع واضغط توليد</p></div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* الأمن */}
                {adminSubTab === 'security' && (
                    <div className="modern-card bg-rose-50 p-8 border border-rose-100 flex flex-col justify-center text-center">
                        <Icon name="alert-triangle" className="w-12 h-12 text-rose-600 mx-auto mb-4" />
                        <h4 className="text-xl font-black text-rose-900 mb-2">التصفير الكلي للبيانات</h4>
                        <p className="text-sm font-bold text-rose-700 mb-6">سيتم مسح كافة التقييمات نهائياً. لا يمكن التراجع.</p>
                        <button onClick={() => showConfirm('تحذير نهائي', 'سيتم مسح كافة البيانات ولن تتمكن من التراجع. هل أنت متأكد؟', () => { setAssessments({}); showToast('تم تصفير قاعدة البيانات بنجاح', 'success'); })} className="w-full md:w-1/2 mx-auto py-3 bg-rose-600 text-white font-black rounded-xl hover:bg-rose-700">تصفير النظام بأكمله</button>
                    </div>
                )}

            </div>
        </div>
    );

    if (isGlobalLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]" dir="rtl">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#1e1b4b] border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-bold text-[#1e1b4b]">جاري مزامنة البيانات السحابية...</p>
                </div>
            </div>
        );
    }

    return (
        <React.Fragment>
        <div className="flex h-screen w-full relative bg-[#f8fafc]">

            {toast && (
                <div className={`fixed bottom-10 left-10 z-[100] px-6 py-4 rounded-2xl shadow-md text-white font-black flex items-center gap-3 toast-animate ${toast.type === 'error' ? 'bg-rose-600' : 'bg-[#11032b]'}`}>
                    <Icon name={toast.type === 'error' ? "alert-circle" : "check-circle"} className="w-5 h-5" />
                    {toast.msg}
                </div>
            )}

            {modal.isOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white p-8 rounded-[2rem] shadow-md max-w-md w-full m-4">
                        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4"><Icon name="alert-triangle" className="w-8 h-8 text-rose-600" /></div>
                        <h3 className="text-2xl font-black text-center text-[#1e1b4b] mb-2">{modal.title}</h3>
                        <p className="text-center text-gray-500 font-bold mb-8">{modal.message}</p>
                        <div className="flex gap-4 p-4">
                            <button onClick={() => setModal({ ...modal, isOpen: false })} className="flex-1 py-3 bg-gray-100 text-gray-600 font-black rounded-xl hover:bg-gray-200">إلغاء</button>
                            <button onClick={() => { modal.onConfirm(); setModal({ ...modal, isOpen: false }); }} className="flex-1 py-3 bg-rose-600 text-white font-black rounded-xl hover:bg-rose-700">نعم، متأكد</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] md:hidden animate-fade-in" />
            )}

            <div className={`sidebar w-[260px] h-full flex flex-col z-[60]  shrink-0 bg-[#ffffff] border-l border-gray-100 fixed md:relative right-0 top-0 bottom-0 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
                <div className="p-8 flex flex-col items-center border-b border-gray-50 mt-2 relative">
                    <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-rose-600 md:hidden bg-gray-50 hover:bg-rose-50 rounded-lg transition-colors">
                        <Icon name="x" className="w-5 h-5" />
                    </button>
                    <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mb-4 shadow-md overflow-hidden">
                        <img
                            src="https://www.alfalah.edu.sa/assets/images/logo.png"
                            alt="Logo"
                            className="object-contain p-2 w-full h-full"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextElementSibling) {
                                    e.target.nextElementSibling.style.display = 'flex';
                                }
                            }}
                        />
                        <div style={{ display: 'none' }} className="w-full h-full items-center justify-center">
                            <Icon name="school" className="text-[#eab308] w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-xl font-black text-[#1e1b4b] tracking-tight text-center">نظام إدارة الجودة</h1>
                    <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">بمدارس الفلاح الأهلية</p>
                </div>
                <nav className="flex-1 py-6 px-4 space-y-1.5">
                    <button onClick={() => { setActiveTab('home'); setActiveSurveyForm(null); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'home' ? 'bg-[#11032b] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1e1b4b]'}`}><Icon name="home" className="w-4 h-4" /> الرئيسية</button>
                    <button onClick={() => { setActiveTab('surveys'); setActiveSurveyForm(null); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'surveys' ? 'bg-[#11032b] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1e1b4b]'}`}><Icon name="edit-3" className="w-4 h-4" /> الاستبانات</button>
                    <button onClick={() => { setActiveTab('dashboard'); setActiveSurveyForm(null); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'dashboard' ? 'bg-[#11032b] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1e1b4b]'}`}><Icon name="pie-chart" className="w-4 h-4" /> النتائج (النسب)</button>
                    <button onClick={() => { setActiveTab('archive'); setActiveSurveyForm(null); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'archive' ? 'bg-[#11032b] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1e1b4b]'}`}><Icon name="archive" className="w-4 h-4" /> الأرشيف الشامل</button>
                    <div className="my-4 border-t border-gray-100"></div>
                    <button onClick={() => { setActiveTab('admin'); setActiveSurveyForm(null); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'admin' ? 'bg-[#10b981] text-white shadow-md' : 'text-emerald-600 hover:bg-emerald-50'}`}><Icon name="settings" className="w-4 h-4" /> لوحة الإدارة</button>
                    <div className="mt-6 pt-4 text-center border-t border-dashed border-gray-200 opacity-80">
                        <p className="text-[10px] font-black text-gray-400">مشرف الجودة بجدة</p>
                        <p className="text-xs font-black text-[#1e1b4b]">أ. ياسر محمد شعبان</p>
                    </div>
                </nav>
                <div className="p-4 mt-auto mb-2 mx-4">
                    <button onClick={handleLogout} className="w-full py-2.5 bg-gray-50 text-gray-500 font-bold text-xs rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors flex justify-center items-center gap-2">
                        <Icon name="log-out" className="w-3 h-3" /> تسجيل خروج
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col h-screen overflow-hidden main-content relative">
                <Marquee />
                <div className="p-8 w-full bg-white print-only-header absolute top-0 left-0 z-50"><OfficialPrintHeader /></div>

                <div className="relative flex-1 overflow-y-auto px-4 md:px-12 py-8 mt-print-adjust custom-scrollbar">
                    <header className="flex flex-col md:flex-row justify-center items-center mb-8 no-print modern-card p-4 gap-4">
                        <div className="flex items-center justify-between w-full md:justify-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-[#1e1b4b] border border-gray-200 transition-colors">
                                <Icon name="menu" className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="font-black text-[#1e1b4b] text-sm hidden sm:block">أ. علي بن عبدالعالي علي السلماني</p>
                                    <p className="text-[10px] font-bold text-gray-400">مدير عام الشؤون الإدارية والمالية ونظام إدارة الجودة</p>
                                </div>
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-[#1e1b4b] shrink-0"><Icon name="user" className="w-5 h-5" /></div>
                            </div>
                        </div>



                    </header>

                    <div className="print-adjust-content">
                        {activeTab === 'home' && renderHome()}
                        {activeTab === 'surveys' && renderSurveysList()}
                        {activeTab === 'dashboard' && renderDashboard()}
                        {activeTab === 'archive' && renderArchive()}
                        {activeTab === 'admin' && renderAdmin()}
                    </div>
                </div>
            </div>

        </div>

        <PreviewModal
            config={previewConfig}
            onClose={() => setPreviewConfig(null)}
        />
        </React.Fragment>
    );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
