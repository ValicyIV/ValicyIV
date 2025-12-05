import { motion } from 'framer-motion';

type QuestionType = 'rating' | 'text' | 'checkbox' | 'info';

interface QuestionCardProps {
    question: string;
    type: QuestionType;
    value?: any;
    onChange?: (value: any) => void;
    options?: string[]; // For checkbox
    onNext: () => void;
}

const cardVariants: any = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -50, scale: 0.9, transition: { duration: 0.3 } },
};

export default function QuestionCard({ question, type, value, onChange, options, onNext }: QuestionCardProps) {
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-2xl"
        >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {question}
            </h2>

            <div className="mb-8">
                {type === 'rating' && (
                    <div className="flex justify-between items-center gap-2">
                        {[1, 2, 3, 4, 5].map((score) => (
                            <button
                                key={score}
                                onClick={() => onChange && onChange(score)}
                                className={`w-12 h-12 rounded-full font-bold transition-all text-lg
                  ${value === score
                                        ? 'bg-blue-600 text-white shadow-lg scale-110'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}
                `}
                            >
                                {score}
                            </button>
                        ))}
                        <div className="flex justify-between w-full text-xs text-slate-500 mt-2 absolute bottom-0 translate-y-6 left-0 px-1">
                            <span>Not at all</span>
                            <span>Extremely</span>
                        </div>
                    </div>
                )}

                {type === 'text' && (
                    <textarea
                        value={value || ''}
                        onChange={(e) => onChange && onChange(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all min-h-[120px]"
                        placeholder="Type your answer here..."
                    />
                )}

                {type === 'checkbox' && options && (
                    <div className="grid grid-cols-1 gap-3">
                        {options.map((opt) => (
                            <label
                                key={opt}
                                className={`flex items-center p-4 rounded-xl cursor-pointer border transition-all
                  ${(value || []).includes(opt)
                                        ? 'bg-blue-900/30 border-blue-500/50'
                                        : 'bg-slate-800 border-slate-700 hover:bg-slate-750'}
                `}
                            >
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 accent-blue-500 mr-4"
                                    checked={(value || []).includes(opt)}
                                    onChange={(e) => {
                                        const current = value || [];
                                        if (e.target.checked) {
                                            onChange && onChange([...current, opt]);
                                        } else {
                                            onChange && onChange(current.filter((v: string) => v !== opt));
                                        }
                                    }}
                                />
                                <span className="text-slate-200">{opt}</span>
                            </label>
                        ))}
                    </div>
                )}

                {type === 'info' && (
                    <p className="text-slate-400">Click Continue when you are ready.</p>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={onNext}
                    className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                    {type === 'info' ? 'Start Survey' : 'Continue'}
                </button>
            </div>
        </motion.div>
    );
}
