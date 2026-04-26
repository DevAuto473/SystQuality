window.React = React;
        const { useState, useEffect, useMemo, useRef, useCallback } = React;
        const { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } = window.Recharts || {};

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
            { id: 'S1', title: 'استبانة رضا المستفيد (طلاب)', target: 'طلاب', status: 'نشط', autoStart: '', autoClose: '', isAuto: false, icon: 'users' },
            { id: 'S2', title: 'استبانة رضا المعلمين', target: 'معلمين', status: 'نشط', autoStart: '', autoClose: '', isAuto: false, icon: 'book-open' },
            { id: 'S3', title: 'استبانة رضا ولي الأمر', target: 'أولياء أمور', status: 'نشط', autoStart: '', autoClose: '', isAuto: false, icon: 'home' },
            { id: 'S4', title: 'استبانة التميز المؤسسي (الجودة)', target: 'إداريين', status: 'نشط', autoStart: '', autoClose: '', isAuto: false, icon: 'award' }
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
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 block">معيار {q.displayId}</span>
                            <p className="font-bold text-[#1e1b4b] text-base leading-relaxed">{q.text}</p>
                            <button onClick={() => setShowNote(!showNote)} className="mt-4 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors no-print bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-1 w-fit">
                                📝 {showNote ? 'إخفاء الملاحظة' : 'إضافة ملاحظة'}
                            </button>
                        </div>
                        <div className="flex flex-col items-end gap-3 shrink-0">
                            <div className="flex gap-2 bg-gray-50 p-2 rounded-2xl no-print border border-gray-100">
                                {[1,2,3,4,5].map(score => (
                                    <button key={score} onClick={() => updateAssessment(assessmentKey, q.id, 'score', score)} 
                                        className={`w-10 h-10 rounded-xl font-black text-sm transition-all duration-200 ${currentScore === score ? 'bg-[#eab308] text-[#1e1b4b] shadow-md scale-105' : 'text-gray-400 hover:bg-white hover:text-gray-700'}`}
                                        title={`${(score/5)*100}%`}
                                    >
                                        {score}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="hidden print-area text-lg font-black text-[#1e1b4b] border-2 border-gray-300 px-4 py-1 rounded-lg text-center h-fit">
                            {currentScore !== undefined ? `${(currentScore/5)*100}%` : '___'}
                        </div>
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

        function App() {
            // === State ===
            const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('falah_auth') === 'true');
            const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });
            const [loginError, setLoginError] = useState(false);

            const [activeTab, setActiveTab] = useState('home');
            const [isSidebarOpen, setIsSidebarOpen] = useState(false);
            const [activeSurveyForm, setActiveSurveyForm] = useState(null);
            const [adminSubTab, setAdminSubTab] = useState('timing'); // Default admin tab focused on control
            
            const [dict, setDict] = useState(() => JSON.parse(localStorage.getItem('falah_v10_dict')) || DEFAULT_DICTIONARY);
            const [surveys, setSurveys] = useState(() => JSON.parse(localStorage.getItem('falah_v10_surveys')) || INIT_SURVEYS);
            const [assessments, setAssessments] = useState(() => JSON.parse(localStorage.getItem('falah_v10_data')) || {});
            const [logos, setLogos] = useState(() => JSON.parse(localStorage.getItem('falah_v10_logos')) || DEFAULT_LOGOS);
            
            // Layout & Print Settings with Customization Fields
            const [layoutPrefs, setLayoutPrefs] = useState(() => JSON.parse(localStorage.getItem('falah_v10_layout')) || { 
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
            const [compareType, setCompareType] = useState('cities');

            // Quick QR generation state
            const [generatedLink, setGeneratedLink] = useState('');
            const [qrUrl, setQrUrl] = useState('');

            const [missingQuestions, setMissingQuestions] = useState([]);
            
            const [editingCategory, setEditingCategory] = useState(null);
            const [editingQuestions, setEditingQuestions] = useState([]);

            // دالة قوية لتحديث الأيقونات

            // Sync to LocalStorage & Refresh Icons
            useEffect(() => {
                if (isAuthenticated) {
                    localStorage.setItem('falah_v10_dict', JSON.stringify(dict));
                    localStorage.setItem('falah_v10_surveys', JSON.stringify(surveys));
                    localStorage.setItem('falah_v10_data', JSON.stringify(assessments));
                    localStorage.setItem('falah_v10_logos', JSON.stringify(logos));
                    localStorage.setItem('falah_v10_layout', JSON.stringify(layoutPrefs));
                }
            }, [isAuthenticated, dict, surveys, assessments, logos, layoutPrefs, activeTab, adminSubTab, compareType, activeSurveyForm]);

            // --- Handlers ---
            const handleLogin = (e) => {
                e.preventDefault();
                if (loginCreds.username === 'admin' && loginCreds.password === '1234') {
                    setIsAuthenticated(true);
                    sessionStorage.setItem('falah_auth', 'true');
                    setLoginError(false);
                } else {
                    setLoginError(true);
                }
            };

            const handleLogout = () => {
                setIsAuthenticated(false);
                sessionStorage.removeItem('falah_auth');
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
            
            const exportData = (format) => {
                let flatData = [];
                Object.keys(assessments).forEach(key => {
                    const targetCategory = key.split('-')[2]; 
                    const questionsList = dict[targetCategory]?.questions || [];
                    questionsList.forEach(q => {
                        if (assessments[key] && assessments[key][q.id]) {
                            const score = assessments[key][q.id].score;
                            const note = assessments[key][q.id].note || '';
                            flatData.push({ 
                                'الفرع': key.split('-')[0], 'المرحلة': key.split('-')[1], 'الفئة': targetCategory, 
                                'رقم المعيار': q.displayId, 'نص المعيار': q.text, 'الدرجة (من 5)': score,
                                'النسبة المئوية': `${(score/5)*100}%`,
                                'الملاحظات': note
                            });
                        }
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

            const updateAssessment = (key, qId, field, value) => {
                setAssessments(prev => ({
                    ...prev, [key]: { ...(prev[key] || {}), [qId]: { ...(prev[key]?.[qId] || {}), [field]: value, timestamp: new Date().toISOString() } }
                }));
            };

            // Quick QR Generation Function (Simplified)
            const handleGenerateQuickLink = () => {
                const baseUrl = "https://alfalah-qms.edu/survey";
                const params = `?loc=${selectedLocation}&stg=${selectedStage}`;
                setGeneratedLink(baseUrl+params);
                setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(baseUrl+params)}&color=190538&bgcolor=ffffff`);
                showToast('تم توليد الباركود والرابط بنجاح');
            };

            // --- Analytical Engine (Percentages) ---
            const dashboardStats = useMemo(() => {
                const key = `${selectedLocation}-${selectedStage}-${dashboardTarget}`;
                const data = assessments[key] || {};
                const currentDict = dict[dashboardTarget];
                if(!currentDict) return { avgScore:0, avgPercent:0, domainData:[], total:0, swot:{strengths:[], weaknesses:[]}, hasData:false };

                const scores = Object.values(data).map(v => v.score).filter(s => s !== undefined);
                const avgScore = scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
                const avgPercent = Math.round((avgScore / 5) * 100);
                
                const domainData = currentDict.domains.map((d) => {
                    const dScores = currentDict.questions.filter(q => q.domainId === d.id).map(q => data[q.id]?.score).filter(s => s !== undefined);
                    const dAvg = dScores.length ? (dScores.reduce((a,b)=>a+b,0)/dScores.length) : 0;
                    return { name: d.name, percentage: Math.round((dAvg / 5) * 100) };
                });

                const swot = {
                    strengths: currentDict.questions.filter(q => data[q.id]?.score >= 4).map(q => ({...q, percentage: (data[q.id].score/5)*100})),
                    weaknesses: currentDict.questions.filter(q => data[q.id]?.score > 0 && data[q.id]?.score <= 2).map(q => ({...q, percentage: (data[q.id].score/5)*100}))
                };

                return { avgScore: avgScore.toFixed(2), avgPercent, domainData, total: scores.length, swot, hasData: scores.length > 0 };
            }, [assessments, selectedLocation, selectedStage, dashboardTarget, dict]);

            // Bar Chart Comparison Data (Percentages)
            const realCompareCities = useMemo(() => {
                const currentDict = dict[dashboardTarget];
                if (!currentDict) return [];
                return currentDict.domains.map(d => {
                    const getCityPercent = (city) => {
                        let totalScore = 0, count = 0;
                        ['ابتدائية', 'متوسطة', 'ثانوية'].forEach(stg => {
                            const key = `${city}-${stg}-${dashboardTarget}`;
                            const data = assessments[key] || {};
                            currentDict.questions.filter(q => q.domainId === d.id).forEach(q => {
                                if (data[q.id]?.score !== undefined) { totalScore += data[q.id].score; count++; }
                            });
                        });
                        return count ? Math.round((totalScore / count / 5) * 100) : 0;
                    };
                    return { name: d.name, 'مكة المكرمة': getCityPercent('مكة المكرمة'), 'جدة': getCityPercent('جدة') };
                });
            }, [assessments, dashboardTarget, dict]);

            const realCompareStages = useMemo(() => {
                return ['ابتدائية', 'متوسطة', 'ثانوية'].map(stage => {
                    const getStagePercent = (city) => {
                        const key = `${city}-${stage}-${dashboardTarget}`;
                        const data = assessments[key] || {};
                        const scores = Object.values(data).map(v => v.score).filter(s => s !== undefined);
                        return scores.length ? Math.round((scores.reduce((a,b)=>a+b,0)/scores.length/5)*100) : 0;
                    };
                    return { name: stage, 'مكة المكرمة': getStagePercent('مكة المكرمة'), 'جدة': getStagePercent('جدة') };
                });
            }, [assessments, dashboardTarget]);

            // Archive Data Generator
            const archiveData = useMemo(() => {
                let records = [];
                ['مكة المكرمة', 'جدة'].forEach(loc => {
                    ['ابتدائية', 'متوسطة', 'ثانوية'].forEach(stg => {
                        ['طلاب', 'معلمين', 'أولياء أمور', 'إداريين'].forEach(trg => {
                            const key = `${loc}-${stg}-${trg}`;
                            const data = assessments[key] || {};
                            const scores = Object.values(data).map(v => v.score).filter(s => s !== undefined);
                            if(scores.length > 0) {
                                const avg = scores.reduce((a,b)=>a+b,0)/scores.length;
                                records.push({
                                    id: key,
                                    location: loc,
                                    stage: stg,
                                    target: trg,
                                    completed: scores.length,
                                    totalQ: dict[trg]?.questions.length || 15,
                                    percentage: Math.round((avg/5)*100),
                                    lastUpdate: Object.values(data)[0]?.timestamp ? new Date(Object.values(data)[0].timestamp).toLocaleDateString('ar-SA') : 'غير متوفر'
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
                    <div className="w-32 flex justify-start"><img src={logos.ministry} className="max-h-20" onError={(e)=>{e.target.style.display='none'}} /></div>
                    <div className="text-center flex-1 px-4">
                        <h1 className="text-xl font-black text-black">المملكة العربية السعودية</h1>
                        <h2 className="text-lg font-bold text-black mt-1">وزارة التعليم - الإدارة العامة للتعليم</h2>
                        <h3 className="text-md font-black mt-2 bg-gray-100 inline-block px-6 py-1.5 rounded-full border border-gray-300">{layoutPrefs.reportTitle}</h3>
                    </div>
                    <div className="w-40 flex justify-end gap-4"><img src={logos.iso} className="max-h-16" onError={(e)=>{e.target.style.display='none'}} /><img src={logos.school} className="max-h-20" onError={(e)=>{e.target.style.display='none'}} /></div>
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
                        <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl max-w-sm w-full border border-white/20 animate-in zoom-in-95 duration-500">
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
                                        <input type="text" value={loginCreds.username} onChange={e=>setLoginCreds({...loginCreds, username: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold focus:ring-2 focus:ring-[#1e1b4b] outline-none transition-all" placeholder="أدخل اسم المستخدم" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">كلمة المرور</label>
                                    <div className="relative">
                                        <Icon name="lock" className="absolute right-3 top-3 text-gray-400 w-4 h-4" />
                                        <input type="password" value={loginCreds.password} onChange={e=>setLoginCreds({...loginCreds, password: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold focus:ring-2 focus:ring-[#1e1b4b] outline-none transition-all" placeholder="أدخل كلمة المرور" required />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-3 bg-[#1e1b4b] text-[#eab308] rounded-xl font-black text-sm hover:bg-blue-900 hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2">
                                    تسجيل الدخول <Icon name="arrow-left" className="w-4 h-4" />
                                </button>
                            </form>
                            <p className="text-center text-[10px] text-gray-400 font-bold mt-6">للدعم الفني: أ. ياسر محمد شعبان (0509677841)</p>
                        </div>
                    </div>
                );
            }

            // --- Views ---
            const renderHome = () => (
                <div className="space-y-8 animate-in fade-in duration-700 print-area">
                    <div className="relative w-full h-auto rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 bg-white">
                        {/* الشعار المائي خلف المحتوى */}
                        <img 
                            src="https://www.alfalah.edu.sa/assets/images/logo.png" 
                            alt="Watermark Logo" 
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 md:w-1/2 max-w-[350px] object-contain opacity-[0.15] z-0 pointer-events-none" 
                        />
                        
                        {/* المحتوى الرئيسي */}
                        <div className="relative p-8 py-16 md:py-20 flex flex-col items-center justify-center z-10 text-center">
                            <h2 className="text-3xl md:text-5xl font-black text-[#1e1b4b] mb-4 leading-tight">منظومة التميز والجودة</h2>
                            <p className="text-base md:text-xl text-[#1e1b4b] font-semibold max-w-2xl leading-relaxed mx-auto">المنصة الرسمية لمدارس الفلاح لرصد وتحليل معايير الجودة المؤسسية ومواءمتها مع متطلبات الأيزو 9001 بشكل رقمي ذكي.</p>
                            <div className="mt-8 flex flex-wrap justify-center gap-4 no-print w-full">
                                <button onClick={() => setActiveTab('surveys')} className="px-6 md:px-8 py-3 bg-[#eab308] text-[#1e1b4b] font-black rounded-xl hover:scale-105 flex items-center gap-2 shadow-lg transition-transform w-full sm:w-auto justify-center"><Icon name="play" className="w-5 h-5" /> بدء التقييم</button>
                                <button onClick={() => setActiveTab('dashboard')} className="px-6 md:px-8 py-3 bg-white text-[#1e1b4b] border border-gray-200 font-black rounded-xl hover:bg-gray-50 hover:shadow-md flex items-center gap-2 transition-all shadow-sm w-full sm:w-auto justify-center"><Icon name="pie-chart" className="w-5 h-5" /> عرض النتائج</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
                        <div className="modern-card p-8 flex flex-col items-center text-center border-t-4 border-[#1e1b4b] hover:-translate-y-1">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5"><Icon name="eye" className="w-7 h-7 text-[#1e1b4b]" /></div>
                            <h3 className="text-xl font-black text-[#1e1b4b] mb-3">رؤيتنا</h3>
                            <p className="text-gray-500 font-semibold text-sm">متعلمون متميزون بالقيم الإسلامية والوطنية ومعايير التفوق العالمية.</p>
                        </div>
                        <div className="modern-card p-8 flex flex-col items-center text-center border-t-4 border-[#eab308] hover:-translate-y-1">
                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-5"><Icon name="book-open" className="w-7 h-7 text-[#eab308]" /></div>
                            <h3 className="text-xl font-black text-[#1e1b4b] mb-3">الرسالة</h3>
                            <p className="text-gray-500 font-semibold text-sm">تهيئةُ طلابنا للفلاح في دينهم وخُلُقهم والتفوق في مستقبلهم العلمي والمهني.</p>
                        </div>
                        <div className="modern-card p-8 flex flex-col items-center text-center border-t-4 border-[#10b981] hover:-translate-y-1">
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
                    const key = `${selectedLocation}-${selectedStage}-${s.target}`;
                    
                    const handleValidateAndSubmit = () => {
                        const missing = surveyData.questions.filter(q => assessments[key]?.[q.id]?.score === undefined);
                        if (missing.length > 0) {
                            setMissingQuestions(missing);
                        } else {
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
                                            <div className="p-5 text-white font-black flex justify-between items-center print-area" style={{backgroundColor: domain.color}}>
                                                <div className="flex items-center gap-3 text-lg"><Icon name="layers" className="w-5 h-5 no-print" /> {domain.name}</div>
                                            </div>
                                            <div className="divide-y divide-gray-50">
                                                {domainQuestions.map(q => (
                                                    <SurveyQuestion 
                                                        key={q.id}
                                                        q={q} 
                                                        currentData={assessments[key]?.[q.id] || {}} 
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
                                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-md w-full m-4 animate-in zoom-in">
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

                return (
                    <div className="space-y-6 animate-in fade-in duration-500 pb-20 print-area">
                        <div className="modern-card bg-[#11032b] p-10 text-white border-0">
                            <h2 className="text-3xl font-black mb-2 flex items-center gap-3"><Icon name="edit-3" className="text-[#eab308]" /> الاستبانات المتاحة</h2>
                            <p className="text-gray-400 font-semibold">اختر الاستبانة للبدء في الرصد والتسجيل.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {surveys.map(s => (
                                <div key={s.id} className={`modern-card p-8 flex flex-col group ${s.status === 'نشط' ? 'hover:shadow-lg hover:border-gray-200' : 'opacity-70'}`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-[#eab308] transition-colors"><Icon name={s.icon} className="w-6 h-6 text-[#1e1b4b]" /></div>
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${s.status==='نشط' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>{s.status}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-[#1e1b4b] mb-2">{s.title}</h3>
                                    <button onClick={() => setActiveSurveyForm(s.id)} disabled={s.status !== 'نشط'} className={`mt-auto w-full py-3.5 rounded-xl font-black flex justify-center items-center gap-2 transition-colors ${s.status === 'نشط' ? 'bg-[#11032b] text-white hover:bg-[#eab308] hover:text-[#11032b]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                                        {s.status === 'نشط' ? 'ابدأ التقييم' : 'الاستبانة مغلقة'} <Icon name="arrow-left" className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            };

            const renderDashboard = () => (
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 pb-20 print-area">
                    <div className="modern-card p-5 flex flex-col md:flex-row gap-4 items-center no-print">
                        <div className="flex items-center gap-2 text-gray-500 font-black text-sm whitespace-nowrap"><Icon name="filter" className="w-4 h-4" /> الفلترة:</div>
                        <select value={dashboardTarget} onChange={e=>setDashboardTarget(e.target.value)} className="flex-1 p-2.5 bg-gray-50 border border-gray-200 text-[#1e1b4b] rounded-xl font-bold outline-none focus:border-[#eab308]">
                            <option value="إداريين">نتائج الإداريين</option><option value="طلاب">نتائج الطلاب</option>
                            <option value="معلمين">نتائج المعلمين</option><option value="أولياء أمور">نتائج أولياء الأمور</option>
                        </select>
                    </div>

                    <div className="hidden print-block mb-6 text-center border-b-2 border-black pb-4">
                        <h2 className="text-2xl font-black">تقرير تحليل الأداء - فئة ({dashboardTarget})</h2>
                        <h3 className="text-lg font-bold mt-2">فرع {selectedLocation} - مرحلة {selectedStage}</h3>
                    </div>

                    {!dashboardStats.hasData ? (
                        <div className="modern-card p-16 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Icon name="bar-chart-2" className="w-8 h-8 text-gray-300" /></div>
                            <h3 className="text-xl font-black text-[#1e1b4b] mb-2">لا توجد بيانات مسجلة حالياً</h3>
                            <p className="text-sm text-gray-500 font-semibold">قم بإجراء تقييم لهذه الفئة لتظهر النتائج هنا.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="modern-card p-6 border-b-4 border-[#1e1b4b]">
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">متوسط نسبة الإنجاز</p>
                                    <div className="text-4xl font-black text-[#1e1b4b]">{dashboardStats.avgPercent}<span className="text-lg text-gray-400">%</span></div>
                                </div>
                                <div className="modern-card p-6 border-b-4 border-[#eab308]">
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">المعايير المنجزة</p>
                                    <div className="text-4xl font-black text-[#eab308]">{dashboardStats.total}<span className="text-lg text-gray-400">/ 15</span></div>
                                </div>
                                <div className="modern-card p-6 border-b-4 border-emerald-500">
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">نقاط القوة المكتشفة</p>
                                    <div className="text-4xl font-black text-emerald-600">{dashboardStats.swot.strengths.length}</div>
                                </div>
                            </div>

                            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${!layoutPrefs.showCharts ? 'no-print' : ''}`}>
                                <div className="modern-card p-8 h-[400px]">
                                    <h3 className="text-lg font-black text-[#1e1b4b] mb-6 flex items-center gap-2"><Icon name="bar-chart-2" className="text-[#eab308] w-5 h-5" /> تحليل أداء المجالات (نسبة مئوية)</h3>
                                    {BarChart && (
                                        <ResponsiveContainer width="100%" height="85%">
                                            <BarChart data={dashboardStats.domainData} layout="vertical" margin={{top: 10, right: 30, left: 10, bottom: 10}}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9"/>
                                                <XAxis type="number" domain={[0, 100]} hide />
                                                <YAxis dataKey="name" type="category" width={window.innerWidth < 768 ? 120 : 160} tick={{textAnchor: 'start', dx: -10, fontFamily: 'Cairo', fontSize: window.innerWidth < 768 ? 10 : 12, fontWeight: 'bold', fill: '#475569'}} axisLine={false} tickLine={false} />
                                                <Tooltip wrapperStyle={{ pointerEvents: 'none', zIndex: 1000 }} cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontFamily: 'Cairo', fontSize: '12px', fontWeight: 'bold'}} formatter={(value) => [`${value}%`, 'النسبة']} />
                                                <Bar dataKey="percentage" fill="#1e1b4b" radius={[0, 8, 8, 0]} barSize={24}>
                                                    <LabelList dataKey="percentage" content={<PercentageLabel />} />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>

                                <div className={`modern-card p-8 ${!layoutPrefs.showSWOT ? 'no-print' : ''}`}>
                                    <h3 className="text-lg font-black text-[#1e1b4b] mb-6 flex items-center gap-2"><Icon name="zap" className="text-rose-500 w-5 h-5" /> مصفوفة التحليل (SWOT)</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                                            <h4 className="font-black text-emerald-800 text-sm mb-3 flex items-center gap-2"><Icon name="trending-up" className="w-4 h-4" /> نقاط القوة (80% فأكثر)</h4>
                                            <ul className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                                                {dashboardStats.swot.strengths.length > 0 ? dashboardStats.swot.strengths.map(c => <li key={c.id} className="text-xs font-semibold text-emerald-900 bg-white p-2.5 rounded-lg border border-emerald-50 flex justify-between"><span>{c.text}</span><span className="font-black">{c.percentage}%</span></li>) : <li className="text-emerald-400 text-xs font-semibold p-1">لا توجد نقاط قوة مسجلة.</li>}
                                            </ul>
                                        </div>
                                        <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100">
                                            <h4 className="font-black text-rose-800 text-sm mb-3 flex items-center gap-2"><Icon name="trending-down" className="w-4 h-4" /> فرص التحسين (أقل من 60%)</h4>
                                            <ul className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                                                {dashboardStats.swot.weaknesses.length > 0 ? dashboardStats.swot.weaknesses.map(c => <li key={c.id} className="text-xs font-semibold text-rose-900 bg-white p-2.5 rounded-lg border border-rose-50 flex justify-between"><span>{c.text}</span><span className="font-black">{c.percentage}%</span></li>) : <li className="text-rose-400 text-xs font-semibold p-1">النظام مستقر، لا توجد ملاحظات حرجة.</li>}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            );

            const renderArchive = () => (
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 pb-20 print-area">
                    <div className="modern-card bg-gradient-to-r from-blue-900 to-[#11032b] p-10 text-white border-0 no-print">
                        <h2 className="text-3xl font-black mb-2 flex items-center gap-3"><Icon name="archive" className="text-[#eab308]" /> أرشيف الإحصائيات الشامل</h2>
                        <p className="text-blue-200 font-semibold text-sm">عرض تفصيلي لجميع الاستبانات المرصودة في النظام.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 no-print">
                        <div className="modern-card p-4 text-center"><p className="text-[10px] text-gray-400 font-black uppercase">إجمالي السجلات</p><p className="text-2xl font-black text-[#1e1b4b] mt-1">{archiveData.length}</p></div>
                        <div className="modern-card p-4 text-center"><p className="text-[10px] text-gray-400 font-black uppercase">متوسط مكة</p><p className="text-2xl font-black text-emerald-600 mt-1">{Math.round(archiveData.filter(d=>d.location==='مكة المكرمة').reduce((a,b)=>a+b.percentage,0) / (archiveData.filter(d=>d.location==='مكة المكرمة').length || 1))}%</p></div>
                        <div className="modern-card p-4 text-center"><p className="text-[10px] text-gray-400 font-black uppercase">متوسط جدة</p><p className="text-2xl font-black text-blue-600 mt-1">{Math.round(archiveData.filter(d=>d.location==='جدة').reduce((a,b)=>a+b.percentage,0) / (archiveData.filter(d=>d.location==='جدة').length || 1))}%</p></div>
                        <button onClick={()=>exportData('excel')} className="modern-card p-4 flex flex-col items-center justify-center text-emerald-600 hover:bg-emerald-50 cursor-pointer border-emerald-100 transition-colors"><Icon name="download" className="w-6 h-6 mb-1" /><span className="text-xs font-black">تصدير السجل</span></button>
                    </div>

                    <div className="modern-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-right text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="p-4 font-black text-gray-600">المدينة</th>
                                        <th className="p-4 font-black text-gray-600">المرحلة</th>
                                        <th className="p-4 font-black text-gray-600">الفئة المستهدفة</th>
                                        <th className="p-4 font-black text-gray-600 text-center">نسبة الإنجاز</th>
                                        <th className="p-4 font-black text-gray-600 text-center">التقييم العام</th>
                                        <th className="p-4 font-black text-gray-600 text-center">تاريخ التحديث</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {archiveData.length > 0 ? archiveData.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 font-bold text-[#1e1b4b]">{row.location}</td>
                                            <td className="p-4 font-semibold text-gray-600"><span className="bg-gray-100 px-2 py-1 rounded-md text-xs">{row.stage}</span></td>
                                            <td className="p-4 font-bold text-gray-700">{row.target}</td>
                                            <td className="p-4 text-center">
                                                <span className={`text-xs font-black px-2 py-1 rounded-md ${row.completed === row.totalQ ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {row.completed}/{row.totalQ}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#1e1b4b]" style={{width: `${row.percentage}%`}}></div></div>
                                                    <span className="font-black text-[#1e1b4b] w-8 text-left">{row.percentage}%</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center text-xs text-gray-500 font-bold">{row.lastUpdate}</td>
                                        </tr>
                                    )) : <tr><td colSpan="6" className="p-8 text-center text-gray-400 font-bold">لا توجد سجلات مؤرشفة حالياً</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );

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
                            {id: 'timing', name: 'إدارة وحالة الاستبانات', icon: 'clock'},
                            {id: 'layout', name: 'تخصيص المطبوعات (الترويسات)', icon: 'layout'},
                            {id: 'surveys', name: 'تحرير المعايير', icon: 'edit'},
                            {id: 'compare', name: 'المقارنات الإحصائية', icon: 'bar-chart'},
                            {id: 'qr', name: 'الروابط والمشاركة', icon: 'qr-code'},
                            {id: 'security', name: 'الأمن والبيانات', icon: 'shield-alert'}
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
                                                    const up = surveys.map(x => x.id === s.id ? {...x, status: x.status === 'نشط' ? 'مغلق' : 'نشط'} : x);
                                                    setSurveys(up);
                                                    showToast(s.status === 'نشط' ? 'تم إغلاق الاستبانة ولن تظهر للمستفيدين' : 'تم تفعيل وفتح الاستبانة بنجاح');
                                                }} className={`px-4 py-1.5 rounded-lg text-xs font-black text-white shadow-sm transition-colors ${s.status === 'نشط' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                                                    {s.status === 'نشط' ? 'إغلاق الاستبانة' : 'مغلقة (انقر للفتح)'}
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-500 block mb-1">تاريخ الفتح (اختياري)</label>
                                                    <input type="date" value={s.autoStart || ''} onChange={(e) => {
                                                        const up = surveys.map(x => x.id === s.id ? {...x, autoStart: e.target.value} : x);
                                                        setSurveys(up);
                                                    }} className="w-full p-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:border-[#1e1b4b]" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-500 block mb-1">تاريخ الإغلاق (اختياري)</label>
                                                    <input type="date" value={s.autoClose || ''} onChange={(e) => {
                                                        const up = surveys.map(x => x.id === s.id ? {...x, autoClose: e.target.value} : x);
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
                                        <input type="text" value={layoutPrefs.reportTitle} onChange={e => setLayoutPrefs({...layoutPrefs, reportTitle: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-[#eab308]" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500">مسمى المُعد (التوقيع الأول)</label>
                                        <input type="text" value={layoutPrefs.preparedByText} onChange={e => setLayoutPrefs({...layoutPrefs, preparedByText: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-[#eab308]" />
                                    </div>
                                    <div className="space-y-2"></div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500">مسمى المشرف (الاعتماد الأوسط)</label>
                                        <input type="text" value={layoutPrefs.directorTitle} onChange={e => setLayoutPrefs({...layoutPrefs, directorTitle: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-[#eab308]" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500">اسم المشرف</label>
                                        <input type="text" value={layoutPrefs.directorName} onChange={e => setLayoutPrefs({...layoutPrefs, directorName: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-[#eab308]" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500">مسمى الإدارة (الاعتماد النهائي)</label>
                                        <input type="text" value={layoutPrefs.approverTitle} onChange={e => setLayoutPrefs({...layoutPrefs, approverTitle: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-[#eab308]" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500">اسم المدير</label>
                                        <input type="text" value={layoutPrefs.approverName} onChange={e => setLayoutPrefs({...layoutPrefs, approverName: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-[#eab308]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="font-bold text-sm text-[#1e1b4b]">إظهار الترويسة والشعارات الرسمية</span>
                                        <input type="checkbox" checked={layoutPrefs.showHeader} onChange={()=>setLayoutPrefs({...layoutPrefs, showHeader: !layoutPrefs.showHeader})} className="toggle-switch" />
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="font-bold text-sm text-[#1e1b4b]">إظهار الرسوم البيانية (Charts)</span>
                                        <input type="checkbox" checked={layoutPrefs.showCharts} onChange={()=>setLayoutPrefs({...layoutPrefs, showCharts: !layoutPrefs.showCharts})} className="toggle-switch" />
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="font-bold text-sm text-[#1e1b4b]">إظهار مصفوفة التحليل الرباعي (SWOT)</span>
                                        <input type="checkbox" checked={layoutPrefs.showSWOT} onChange={()=>setLayoutPrefs({...layoutPrefs, showSWOT: !layoutPrefs.showSWOT})} className="toggle-switch" />
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
                                <div className="modern-card p-5 flex flex-col md:flex-row gap-4 items-center bg-gray-50/50">
                                    <span className="font-black text-[#1e1b4b] whitespace-nowrap text-sm"><Icon name="sliders" className="inline w-4 h-4 ml-1" /> نوع المقارنة:</span>
                                    <button onClick={()=>setCompareType('cities')} className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${compareType==='cities' ? 'bg-[#1e1b4b] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500'}`}>المدن (مكة/جدة)</button>
                                    <button onClick={()=>setCompareType('stages')} className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${compareType==='stages' ? 'bg-[#1e1b4b] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500'}`}>المراحل التعليمية</button>
                                </div>
                                <div className="modern-card p-8 h-[400px]">
                                    <h3 className="text-lg font-black text-[#1e1b4b] mb-6 text-center">
                                        {compareType === 'cities' ? `مقارنة أداء مجالات التقييم لفئة (${dashboardTarget}) بين مكة وجدة بالنسب المئوية` : `متوسط الأداء العام لفئة (${dashboardTarget}) حسب المراحل الدراسية بالنسب المئوية`}
                                    </h3>
                                    
                                    {compareType === 'cities' && BarChart && (
                                        <ResponsiveContainer width="100%" height="85%">
                                            <BarChart data={realCompareCities} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                                <XAxis dataKey="name" tick={{fontFamily: 'Cairo', fontSize: 12, fontWeight: 'bold', fill: '#475569'}} axisLine={false} tickLine={false} />
                                                <YAxis domain={[0, 100]} tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={(val)=>`${val}%`} />
                                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', fontFamily: 'Cairo', fontWeight: 'bold'}} formatter={(val)=>[`${val}%`]}/>
                                                <Legend wrapperStyle={{fontFamily: 'Cairo', fontWeight: 'bold', fontSize: '12px', paddingTop: '10px'}}/>
                                                <Bar name="مكة المكرمة" dataKey="مكة المكرمة" fill="#1e1b4b" radius={[6,6,0,0]} barSize={40}>
                                                    <LabelList dataKey="مكة المكرمة" content={<PercentageLabel />} />
                                                </Bar>
                                                <Bar name="جدة" dataKey="جدة" fill="#eab308" radius={[6,6,0,0]} barSize={40}>
                                                    <LabelList dataKey="جدة" content={<PercentageLabel />} />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}

                                    {compareType === 'stages' && BarChart && (
                                        <ResponsiveContainer width="100%" height="85%">
                                            <BarChart data={realCompareStages} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                                <XAxis dataKey="name" tick={{fontFamily: 'Cairo', fontSize: 12, fontWeight: 'bold', fill: '#475569'}} axisLine={false} tickLine={false} />
                                                <YAxis domain={[0, 100]} tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={(val)=>`${val}%`} />
                                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', fontFamily: 'Cairo', fontWeight: 'bold'}} formatter={(val)=>[`${val}%`]}/>
                                                <Legend wrapperStyle={{fontFamily: 'Cairo', fontWeight: 'bold', fontSize: '12px', paddingTop: '10px'}}/>
                                                <Bar name="مكة المكرمة" dataKey="مكة المكرمة" fill="#1e1b4b" radius={[6,6,0,0]} barSize={40}>
                                                    <LabelList dataKey="مكة المكرمة" content={<PercentageLabel />} />
                                                </Bar>
                                                <Bar name="جدة" dataKey="جدة" fill="#10b981" radius={[6,6,0,0]} barSize={40}>
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
                                        <select value={selectedLocation} onChange={e=>setSelectedLocation(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none"><option>مكة المكرمة</option><option>جدة</option></select>
                                        <select value={selectedStage} onChange={e=>setSelectedStage(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none"><option>ابتدائية</option><option>متوسطة</option><option>ثانوية</option></select>
                                        <button onClick={handleGenerateQuickLink} className="w-full py-3 bg-[#1e1b4b] text-white font-black rounded-xl hover:bg-blue-900 transition-colors">توليد الرابط</button>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-200 rounded-2xl">
                                        {qrUrl ? (
                                            <div className="text-center w-full animate-in zoom-in">
                                                <img src={qrUrl} className="w-32 h-32 mx-auto mb-4 bg-white p-2 rounded-xl shadow-sm" />
                                                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2 mb-3">
                                                    <input type="text" readOnly value={generatedLink} className="flex-1 bg-transparent outline-none text-xs text-left dir-ltr text-blue-600 font-bold" />
                                                    <button onClick={() => { navigator.clipboard.writeText(generatedLink); showToast('تم نسخ الرابط!'); }} className="text-gray-500 hover:text-[#1e1b4b]"><Icon name="copy" className="w-4 h-4" /></button>
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

            return (
                <div className="flex h-screen w-full relative bg-[#f8fafc]">
                    
                    {toast && (
                        <div className={`fixed bottom-10 left-10 z-[100] px-6 py-4 rounded-2xl shadow-xl text-white font-black flex items-center gap-3 toast-animate ${toast.type === 'error' ? 'bg-rose-600' : 'bg-[#11032b]'}`}>
                            <Icon name={toast.type === 'error' ? "alert-circle" : "check-circle"} className="w-5 h-5" />
                            {toast.msg}
                        </div>
                    )}

                    {modal.isOpen && (
                        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-sm animate-in fade-in">
                            <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-md w-full m-4">
                                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4"><Icon name="alert-triangle" className="w-8 h-8 text-rose-600" /></div>
                                <h3 className="text-2xl font-black text-center text-[#1e1b4b] mb-2">{modal.title}</h3>
                                <p className="text-center text-gray-500 font-bold mb-8">{modal.message}</p>
                                <div className="flex gap-4">
                                    <button onClick={() => setModal({ ...modal, isOpen: false })} className="flex-1 py-3 bg-gray-100 text-gray-600 font-black rounded-xl hover:bg-gray-200">إلغاء</button>
                                    <button onClick={() => { modal.onConfirm(); setModal({ ...modal, isOpen: false }); }} className="flex-1 py-3 bg-rose-600 text-white font-black rounded-xl hover:bg-rose-700">نعم، متأكد</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile Overlay */}
                    {isSidebarOpen && (
                        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-[50] md:hidden animate-in fade-in" />
                    )}

                    <div className={`sidebar w-[260px] h-full flex flex-col z-[60] shadow-[4px_0_24px_rgba(0,0,0,0.05)] shrink-0 bg-[#ffffff] border-l border-gray-100 fixed md:relative right-0 top-0 bottom-0 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
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
                            <header className="flex flex-col md:flex-row justify-between items-center mb-8 no-print modern-card p-4 gap-4">
                                <div className="flex items-center justify-between w-full md:w-auto gap-4 md:pl-4">
                                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-[#1e1b4b] border border-gray-200 transition-colors">
                                        <Icon name="menu" className="w-6 h-6" />
                                    </button>
                                    <div className="flex items-center gap-4">
                                        <div className="text-left">
                                            <p className="font-black text-[#1e1b4b] text-sm hidden sm:block">أ. ياسر محمد شعبان</p>
                                            <p className="text-[10px] font-bold text-gray-400">مشرف الجودة بمدارس الفلاح</p>
                                        </div>
                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-[#1e1b4b] shrink-0"><Icon name="user" className="w-5 h-5" /></div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button onClick={()=>exportData('excel')} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-black hover:bg-emerald-100 transition-colors border border-emerald-100" title="تصدير إكسل">
                                        <Icon name="file-spreadsheet" className="w-4 h-4" /> تصدير إكسل
                                    </button>
                                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black hover:bg-indigo-100 transition-colors border border-indigo-100" title="طباعة التقرير">
                                        <Icon name="printer" className="w-4 h-4" /> طباعة A4
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                    <select value={selectedLocation} onChange={e=>setSelectedLocation(e.target.value)} className="bg-white border border-gray-200 text-xs font-bold rounded-lg px-3 py-1.5 outline-none text-[#1e1b4b] focus:border-[#eab308]"><option>مكة المكرمة</option><option>جدة</option></select>
                                    <select value={selectedStage} onChange={e=>setSelectedStage(e.target.value)} className="bg-white border border-gray-200 text-xs font-bold rounded-lg px-3 py-1.5 outline-none text-[#1e1b4b] focus:border-[#eab308]"><option>ابتدائية</option><option>متوسطة</option><option>ثانوية</option></select>
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
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
