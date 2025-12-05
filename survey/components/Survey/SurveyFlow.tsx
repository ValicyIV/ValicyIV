import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QuestionCard from './QuestionCard';
import { useRouter } from 'next/router';

const QUESTIONS = [
    {
        id: 'intro',
        question: "Welcome to the Hub AI Survey",
        type: 'info',
    },
    {
        id: 'sentimentScore',
        question: "How comfortable are you with using AI tools in your daily workflow?",
        type: 'rating',
    },
    {
        id: 'implementationAreas',
        question: "Where do you think AI could be most effectively implemented?",
        type: 'checkbox',
        options: [
            'Content Generation',
            'Data Analysis',
            'Coding / Development',
            'Customer Support',
            'Project Management',
            'Creative Design',
        ],
    },
    {
        id: 'concerns',
        question: "Do you have any specific concerns about AI adoption?",
        type: 'text',
    },
    {
        id: 'comments',
        question: "Any other thoughts or ideas you'd like to share?",
        type: 'text',
    },
];

export default function SurveyFlow() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const router = useRouter();

    const handleNext = async () => {
        // Basic validation
        // const currentQ = QUESTIONS[currentIndex];
        // if (currentQ.id !== 'intro' && !answers[currentQ.id] && currentQ.type !== 'text') return; // Enforce required if needed. Text can be optional.

        if (currentIndex < QUESTIONS.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            await submitSurvey();
        }
    };

    const submitSurvey = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/survey/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(answers),
            });

            if (response.ok) {
                setIsComplete(true);
            } else {
                console.error('Failed to submit survey');
                // Handle error (show toast/alert)
            }
        } catch (error) {
            console.error('Error submitting:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAnswerChange = (val: any) => {
        const qId = QUESTIONS[currentIndex].id;
        setAnswers((prev: any) => ({ ...prev, [qId]: val }));
    };

    if (isComplete) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-12 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700"
            >
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-4">
                    Thank You!
                </h1>
                <p className="text-slate-300 text-lg">Your feedback helps shape the future of Valicy Gaming.</p>
                <button
                    onClick={() => router.push('/')}
                    className="mt-8 text-slate-500 hover:text-white transition-colors"
                >
                    Return Home
                </button>
            </motion.div>
        );
    }

    const currentQ = QUESTIONS[currentIndex];

    return (
        <div className="w-full flex justify-center items-center min-h-[60vh]">
            <AnimatePresence mode="wait">
                <QuestionCard
                    key={currentIndex}
                    question={currentQ.question}
                    type={currentQ.type as any}
                    options={currentQ.options}
                    value={answers[currentQ.id]}
                    onChange={handleAnswerChange}
                    onNext={handleNext}
                />
            </AnimatePresence>
        </div>
    );
}
