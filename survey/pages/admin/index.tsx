import Head from 'next/head';
import AdminDashboard from '../../components/Admin/AdminDashboard';

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <Head>
                <title>Valicy Hub | Admin Analytics</title>
            </Head>

            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white font-rajdhani tracking-wide">
                            AI Sentiment <span className="text-blue-500">Analytics</span>
                        </h1>
                        <p className="text-slate-400 mt-2">Overview of employee feedback on AI integration.</p>
                    </div>
                    <div className="text-sm text-slate-500 font-mono">
                        Valicy Gaming Internal
                    </div>
                </header>

                <AdminDashboard />
            </div>
        </div>
    );
}
