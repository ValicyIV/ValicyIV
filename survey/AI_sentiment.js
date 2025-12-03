import React, { useState } from 'react';
import { Terminal, Cpu, Shield, Send, Activity, ChevronRight, User, GitBranch, Layers, Download, CheckCircle, RefreshCw } from 'lucide-react';

// --- Utility Components ---

/**
 * Renders the simulated 3D background grid and glow.
 * Replace the contents of this component with the actual Spline embed component 
 * once you have your Spline scene URL.
 */
const SplineBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {/* Simulated Cyberpunk Grid and Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(70deg)_translateY(-150px)_scale(2)] opacity-30"/>
        
        {/* Central 3D Object Simulation */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-green-500 rounded-full opacity-10 animate-spin [animation-duration:15s]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-green-400 rotate-45 opacity-20"></div>
        
        {/* Vertical Scanlines/CRT Effect */}
        <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.8)_1px,transparent_1px)] bg-[size:2px_100%] opacity-10"/>

        {/* Footer Gradient to fade out the effect */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
);

/**
 * Standard button component with the neon gaming aesthetic.
 */
const NeonButton = ({ children, onClick, disabled = false, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full bg-green-600 text-black font-orbitron font-bold py-4 px-6 uppercase tracking-widest text-lg 
            hover:bg-green-400 transition-all duration-200 
            shadow-[0_0_10px_rgba(0,255,65,0.4)] hover:shadow-[0_0_25px_rgba(0,255,65,0.6)] 
            disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
);

const StepIndicator = ({ currentStep, totalSteps }) => (
    <div className="flex space-x-2 mb-8 items-center justify-center">
        {[...Array(totalSteps)].map((_, i) => (
            <div 
                key={i}
                className={`h-2 transition-all duration-300 ${
                    i + 1 === currentStep 
                        ? 'w-16 bg-green-500 shadow-[0_0_15px_#00ff41]' 
                        : i + 1 < currentStep 
                            ? 'w-12 bg-green-900' 
                            : 'w-4 bg-gray-800'
                }`}
            />
        ))}
    </div>
);

// --- Utility Functions ---

/**
 * Creates a JSON file, names it, and triggers a browser download.
 * @param {object} data - The survey result object.
 */
const downloadJson = (data) => {
    let url;

    try {
        const result = {
            metadata: {
                timestamp: new Date().toISOString(),
            },
            responses: data,
        };

        const json = JSON.stringify(result, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `valicy_ai_sentiment_report_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error('Failed to download JSON', error);
        alert('Something went wrong while preparing your download. Please try again.');
    } finally {
        if (url) {
            URL.revokeObjectURL(url);
        }
    }
};

// --- Survey Question Mapping ---

const LIKERT_QUESTIONS = [
    { id: 'optimism', question: 'Level of optimism on AI pipeline integration (1=Low, 5=High)' },
    { id: 'efficiency', question: 'Expected speedup of specific daily tasks (1=None, 5=Significant)' },
    { id: 'security', question: 'Concern level: AI replacing creative aspects (1=Low, 5=High)' },
    { id: 'quality', question: 'Confidence level: AI-generated quality standards (1=Low, 5=High)' },
    { id: 'ethics', question: 'Concern level: Copyright and ethical implications (1=Low, 5=High)' },
];

const TEXT_QUESTIONS = [
    { id: 'useCases', label: 'TARGETED ASSISTANCE (TASK)', placeholder: 'Describe one specific task where you would welcome AI assistance...' },
    { id: 'roadblocks', label: 'HESITATION/ROADBLOCKS', placeholder: 'What is your biggest fear regarding the AI initiative? (No limit)...' },
    { id: 'blueSky', label: '#1 HYPOTHETICAL ASK', placeholder: 'If you had a perfect AI assistant, what is the #1 thing you would ask it to do today?...' },
];

// --- Main App Component ---

export default function App() {
    // Step 0: Landing, 1: Identity, 2: Likert, 3: Text, 4: Submit, 5: Success
    const [step, setStep] = useState(0); 
    const [loading, setLoading] = useState(false);
    const totalSurveySteps = 4; // Steps 1, 2, 3, 4

    // Form State, initialized to match all survey questions
    const [formData, setFormData] = useState({
        department: '',
        role: '',
        optimism: 0,
        efficiency: 0,
        security: 0,
        quality: 0,
        ethics: 0,
        useCases: '',
        roadblocks: '',
        blueSky: '',
    });

    const handleNext = () => setStep(prev => Math.min(prev + 1, 5));

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleReset = () => {
        setStep(0);
        setFormData({
            department: '', role: '', optimism: 0, efficiency: 0, security: 0, quality: 0, ethics: 0, useCases: '', roadblocks: '', blueSky: '',
        });
    };

    const handleFinalSubmission = () => {
        setLoading(true);
        // Simulate processing delay before showing the download screen
        setTimeout(() => {
            setLoading(false);
            setStep(5); // Move to the success/download screen
        }, 1500);
    };

    // Validation functions
    const trimmedDepartment = formData.department.trim();
    const trimmedRole = formData.role.trim();
    const trimmedUseCases = formData.useCases.trim();
    const trimmedRoadblocks = formData.roadblocks.trim();

    const isStep1Complete = trimmedDepartment && trimmedRole;
    const isStep2Complete = LIKERT_QUESTIONS.every(q => formData[q.id] > 0);
    const isStep3Complete = trimmedUseCases && trimmedRoadblocks; // Making two of the three text fields mandatory for structured analysis

    // Render the Likert selector grid
    const renderLikertGrid = () => (
        <div className="grid grid-cols-1 gap-6">
            {LIKERT_QUESTIONS.map(({ id, question }) => (
                <div key={id} className="border border-green-900/50 p-3">
                    <p className="font-rajdhani text-green-400 mb-3 text-sm">{question}</p>
                    <div className="flex justify-between items-center space-x-2">
                        {[1, 2, 3, 4, 5].map(score => (
                            <button
                                key={score}
                                onClick={() => handleChange(id, score)}
                                className={`w-1/5 py-2 font-orbitron text-lg border border-green-800 transition-all duration-150 
                                    ${formData[id] === score 
                                        ? 'bg-green-500 text-black shadow-[0_0_10px_#00ff41]' 
                                        : 'bg-black/50 text-green-700 hover:bg-green-900/50'
                                    }`}
                            >
                                {score}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    // Get a simple summary text for the final screen
    const getSummary = () => {
        const avgSentiment = (formData.optimism + formData.efficiency + formData.security + formData.quality + formData.ethics) / 5;
        const sentimentText = avgSentiment >= 4 ? 'HIGH ALIGNMENT' : avgSentiment >= 2.5 ? 'MODERATE ALIGNMENT' : 'CRITICAL WARNING';
        return { avg: avgSentiment.toFixed(1), text: sentimentText };
    };


    return (
        <div className="relative min-h-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center selection:bg-green-500 selection:text-black">
            
            {/* Font & Custom Styles Injection */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Rajdhani:wght@400;600&display=swap');
                .font-orbitron { font-family: 'Orbitron', sans-serif; }
                .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
                
                /* Custom styling for the scrollbar to match the aesthetic */
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #000000; }
                ::-webkit-scrollbar-thumb { background-color: #00ff41; border-radius: 4px; border: 1px solid #000; }

                /* Custom styling for the input focus glow */
                input[type=text], textarea { transition: box-shadow 0.3s ease; }

            `}</style>

            <SplineBackground />

            {/* Main HUD Container (Z-10 ensures it's above the background) */}
            <div className="relative z-10 w-full max-w-lg md:max-w-xl p-4">
                
                {/* The Glass/Terminal Panel */}
                <div className="bg-black/90 backdrop-blur-sm border border-green-500/50 p-6 md:p-10 shadow-[0_0_80px_rgba(0,255,65,0.1)] relative overflow-hidden transition-all duration-500">
                    
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-500"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-500"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-500"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-500"></div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-wider mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                            VALICY.AI <span className="text-green-500">INITIATIVE</span>
                        </h1>
                        <p className="font-rajdhani text-green-400/60 uppercase tracking-widest text-sm">
                            Sentiment Calibration Protocol
                        </p>
                    </div>

                    {/* --- LANDING PAGE (STEP 0) --- */}
                    {step === 0 && (
                        <div className="text-center py-10 animate-in fade-in duration-700">
                            <Layers size={60} className="text-green-500 mx-auto mb-6 drop-shadow-[0_0_20px_#00ff41] animate-pulse"/>
                            <h2 className="text-xl font-rajdhani text-white mb-6">
                                ACCESS REQUIRED: ASSESS EMPLOYEE ALIGNMENT WITH NEW AI STRATEGY.
                            </h2>
                            <NeonButton onClick={handleNext}>
                                <div className="flex items-center justify-center space-x-3">
                                    <ChevronRight size={20} />
                                    <span>START DATA UPLOAD</span>
                                </div>
                            </NeonButton>
                        </div>
                    )}


                    {/* --- SURVEY STEPS (1, 2, 3, 4) --- */}
                    {step > 0 && step < 5 && (
                        <>
                            <StepIndicator currentStep={step} totalSteps={totalSurveySteps} />

                            {/* Step 1: Identity/Department */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2 font-orbitron text-sm text-green-400 uppercase">
                                            <Shield size={16} />
                                            <span>ACCESS LEVEL (DEPARTMENT)</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['Engineering', 'Design', 'Marketing', 'Operations'].map((dept) => (
                                                <button
                                                    key={dept}
                                                    onClick={() => handleChange('department', dept)}
                                                    className={`p-3 border font-rajdhani text-lg uppercase tracking-wide transition-all duration-300 hover:shadow-[0_0_10px_rgba(0,255,65,0.3)] ${
                                                        formData.department === dept 
                                                            ? 'bg-green-500/30 border-green-500 text-white shadow-[0_0_5px_rgba(0,255,65,0.3)]' 
                                                            : 'bg-black/40 border-green-900 text-green-700 hover:border-green-500 hover:text-green-400'
                                                    }`}
                                                >
                                                    {dept}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2 font-orbitron text-sm text-green-400 uppercase">
                                            <User size={16} />
                                            <span>DESIGNATION (ROLE)</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ENTER ROLE TITLE..."
                                            value={formData.role}
                                            onChange={(e) => handleChange('role', e.target.value)}
                                            className="w-full bg-black/50 border border-green-900 p-3 font-rajdhani text-xl text-white focus:border-green-500 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] placeholder-green-800"
                                        />
                                    </div>

                                    <NeonButton onClick={handleNext} disabled={!isStep1Complete}>
                                        <div className="flex items-center justify-center space-x-3">
                                            <span>NEXT: CALIBRATE LIKERT SCORES</span>
                                            <ChevronRight />
                                        </div>
                                    </NeonButton>
                                </div>
                            )}

                            {/* Step 2: Likert Scores (5 Questions) */}
                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                    <h2 className="text-xl font-orbitron text-white uppercase text-center mb-6">
                                        RATING MATRIX: Core Sentiment Vectors
                                    </h2>
                                    {renderLikertGrid()}
                                    <p className="text-center text-xs text-green-700 font-rajdhani">
                                        SELECT A SCORE (1-5) FOR ALL 5 PARAMETERS. 
                                    </p>
                                    <NeonButton onClick={handleNext} disabled={!isStep2Complete}>
                                        <div className="flex items-center justify-center space-x-3">
                                            <span>NEXT: QUALITATIVE FEEDBACK</span>
                                            <ChevronRight />
                                        </div>
                                    </NeonButton>
                                </div>
                            )}

                            {/* Step 3: Open Feedback (3 Questions) */}
                            {step === 3 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                    <h2 className="text-xl font-orbitron text-white uppercase text-center mb-6">
                                        OPEN CHANNEL: Detail Report
                                    </h2>

                                    {TEXT_QUESTIONS.map(({ id, label, placeholder }) => (
                                        <div key={id} className="space-y-2">
                                            <label className="flex items-center space-x-2 font-orbitron text-sm text-green-400 uppercase">
                                                <Terminal size={16} />
                                                <span>{label}</span>
                                            </label>
                                            <textarea
                                                rows={id === 'roadblocks' ? 4 : 3}
                                                placeholder={placeholder}
                                                value={formData[id]}
                                                onChange={(e) => handleChange(id, e.target.value)}
                                                className="w-full bg-black/50 border border-green-900 p-4 font-rajdhani text-lg text-white focus:border-green-500 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] placeholder-green-800 resize-none"
                                            />
                                        </div>
                                    ))}
                                    
                                    <NeonButton onClick={handleNext} disabled={!isStep3Complete}>
                                        <div className="flex items-center justify-center space-x-3">
                                            <span>NEXT: TRANSMIT DATA</span>
                                            <ChevronRight />
                                        </div>
                                    </NeonButton>
                                </div>
                            )}
                            
                            {/* Step 4: Submission / Loading */}
                            {step === 4 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                    <div className="bg-green-900/20 border border-green-500/30 p-6 text-center space-y-4 shadow-[0_0_10px_rgba(0,255,65,0.3)]">
                                        <h3 className="font-orbitron text-white text-lg">FINAL DATA REVIEW</h3>
                                        <p className="font-rajdhani text-sm text-green-400/80">
                                            Confirm integrity before transmission. All 10 data points captured.
                                        </p>
                                        <div className="flex justify-between font-mono text-sm text-green-500 pt-2 border-t border-green-800">
                                            <span>LIKERT FIELDS (5):</span>
                                            <span className="text-white">{LIKERT_QUESTIONS.filter(q => formData[q.id] > 0).length} / 5</span>
                                        </div>
                                        <div className="flex justify-between font-mono text-sm text-green-500">
                                            <span>TEXT FIELDS (3):</span>
                                            <span className="text-white">{TEXT_QUESTIONS.filter(q => formData[q.id].length > 0).length} / 3</span>
                                        </div>
                                    </div>
                                    
                                    {loading ? (
                                        <div className="w-full py-4 border border-green-500 text-green-500 font-orbitron text-center animate-pulse shadow-[0_0_10px_#00ff41] flex items-center justify-center space-x-3">
                                            <RefreshCw size={20} className="animate-spin" />
                                            <span>UPLOADING TO MAINFRAME...</span>
                                        </div>
                                    ) : (
                                        <NeonButton onClick={handleFinalSubmission}>
                                            <div className="flex items-center justify-center space-x-3">
                                                <Send size={18} />
                                                <span>TRANSMIT FINAL DATA</span>
                                            </div>
                                        </NeonButton>
                                    )}
                                </div>
                            )}

                        </>
                    )}

                    {/* --- SUCCESS/DOWNLOAD SCREEN (STEP 5) --- */}
                    {step === 5 && (
                        <div className="text-center py-8 animate-in zoom-in duration-500">
                            <div className="inline-block p-4 border-2 border-green-500 rounded-full mb-6 shadow-[0_0_40px_rgba(0,255,65,0.5)]">
                                <Cpu size={56} className="text-green-400 animate-pulse" />
                            </div>
                            <h2 className="text-3xl font-orbitron text-white mb-2 uppercase">TRANSMISSION RECEIVED</h2>
                            <p className="font-rajdhani text-green-400 mb-8 tracking-wider">
                                INPUT INTEGRATED. SYSTEM HEALTH: NOMINAL.
                            </p>
                            
                            <div className="bg-green-900/20 border border-green-500/30 p-6 max-w-sm mx-auto mb-10 text-left space-y-3 font-mono text-sm shadow-[0_0_10px_rgba(0,255,65,0.3)]">
                                <p className="font-orbitron text-white border-b border-green-800 pb-2 mb-2">UPLINK REPORT</p>
                                
                                <div className="flex justify-between">
                                    <span className="text-green-600 flex items-center space-x-2"><GitBranch size={16}/><span>DEPT:</span></span>
                                    <span className="text-green-300">{formData.department.toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-600 flex items-center space-x-2"><Activity size={16}/><span>AVG SENTIMENT:</span></span>
                                    <span className={`font-bold ${getSummary().avg >= 4 ? 'text-green-400' : getSummary().avg < 2.5 ? 'text-red-400' : 'text-yellow-400'}`}>
                                        {getSummary().avg} / 5.0
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs pt-2 border-t border-green-800">
                                    <span className="text-green-700">STATUS:</span>
                                    <span className="text-green-700">{getSummary().text}</span>
                                </div>
                            </div>

                            <NeonButton onClick={() => downloadJson(formData)} className="w-full mb-4 bg-green-500 hover:bg-green-300">
                                <div className="flex items-center justify-center space-x-3 text-black">
                                    <Download size={18} />
                                    <span className="text-sm">DOWNLOAD RAW DATA (.JSON)</span>
                                </div>
                            </NeonButton>
                            
                            <button onClick={handleReset} className="w-1/2 py-2 text-green-700 hover:text-green-500 transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto">
                                <CheckCircle size={16} />
                                <span className="text-sm">END SESSION</span>
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}