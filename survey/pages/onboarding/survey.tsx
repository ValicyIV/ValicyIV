import Head from 'next/head';
import SurveyFlow from '../../components/Survey/SurveyFlow';

export default function SurveyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <Head>
                <title>Valicy Hub | AI Sentiment Survey</title>
            </Head>

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-4xl">
                <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg"></div>
                        <span className="font-bold text-xl tracking-tight">Valicy Hub</span>
                    </div>
                </header>

                <main className="mt-16">
                    <SurveyFlow />
                </main>
            </div>
        </div>
    );
}
