import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

interface SurveyResponse {
    id: number;
    createdAt: string;
    sentimentScore: number;
    implementationAreas: string[];
    concerns: string;
    comments: string | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminDashboard() {
    const [data, setData] = useState<SurveyResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/survey/results')
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch data', err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-white">Loading data...</div>;

    // Process data for charts
    const sentimentCounts = [1, 2, 3, 4, 5].map((score) => ({
        name: `Rating ${score}`,
        count: data.filter((d) => d.sentimentScore === score).length,
    }));

    const areaCounts: Record<string, number> = {};
    data.forEach((d) => {
        d.implementationAreas.forEach((area) => {
            areaCounts[area] = (areaCounts[area] || 0) + 1;
        });
    });
    const areaData = Object.entries(areaCounts).map(([name, value]) => ({ name, value }));

    return (
        <div className="text-white space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Sentiment Chart */}
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Sentiment Distribution</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sentimentCounts}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Areas Chart */}
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-purple-400">Implementation Areas</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={areaData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }: { name?: string | number; percent?: number }) => `${name ?? ''} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                >
                                    {areaData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Responses Table */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-emerald-400">Recent Responses</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-800 text-slate-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Score</th>
                                <th className="px-6 py-4">Concerns</th>
                                <th className="px-6 py-4">Comments</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold
                      ${item.sentimentScore >= 4 ? 'bg-green-900 text-green-300' :
                                                item.sentimentScore <= 2 ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}
                    `}>
                                            {item.sentimentScore}/5
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={item.concerns}>
                                        {item.concerns}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={item.comments || ''}>
                                        {item.comments || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
