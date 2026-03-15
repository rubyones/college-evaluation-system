'use client';

import { useState, useEffect } from 'react';
import { useFetch } from '@/hooks';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { Alert } from '@/components/ui/Alert';
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle, Calendar, Target, Download, MessageSquare } from 'lucide-react';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: 'strength' | 'opportunity' | 'growth';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
}

const initialActions: ActionItem[] = [
  {
    id: 'action-1',
    title: 'Implement Peer Review Activities',
    description: 'Students benefit from learning from each other. Try structured peer review sessions twice per week.',
    category: 'opportunity',
    priority: 'high',
    dueDate: '2024-12-20',
    completed: false,
  },
  {
    id: 'action-2',
    title: 'Create Detailed Grading Rubrics',
    description: 'Develop comprehensive rubrics for assignments to provide clearer expectations and more consistent feedback.',
    category: 'growth',
    priority: 'high',
    dueDate: '2024-12-15',
    completed: false,
  },
  {
    id: 'action-3',
    title: 'Expand Office Hours',
    description: 'Increase availability for one-on-one discussions. Consider adding virtual office hours.',
    category: 'growth',
    priority: 'medium',
    dueDate: '2024-12-25',
    completed: false,
  },
  {
    id: 'action-4',
    title: 'Incorporate Real-World Case Studies',
    description: 'Add industry examples and case studies to make content more relevant and engaging.',
    category: 'opportunity',
    priority: 'medium',
    dueDate: '2024-01-10',
    completed: true,
  },
  {
    id: 'action-5',
    title: 'Use Interactive Polling Tools',
    description: 'Engage students during lectures with interactive polls to increase participation.',
    category: 'strength',
    priority: 'low',
    dueDate: '2024-12-30',
    completed: false,
  },
];

export default function AICoach() {
  const [actions, setActions] = useState<ActionItem[]>(initialActions);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { user } = useAuth();
  const { data: analyticsData, loading: analyticsLoading } = useFetch<any>('/analytics');
  const { data: evalData, loading: evalLoading } = useFetch<any>('/evaluations');
  const { data: coursesData, loading: coursesLoading } = useFetch<any>('/courses');
  const teacherEvals = evalData?.evaluations?.filter((e:any) => e.evaluatee_id === user?.id) || [];

  // If analytics provides recommended actions, prefer them over initialActions
  useEffect(() => {
    const items = analyticsData?.analytics?.actionItems;
    if (Array.isArray(items) && items.length > 0) {
      const mapped = items.map((it: any, idx: number) => ({
        id: it.id || `action-${idx}`,
        title: it.title || it.name || 'Suggested Action',
        description: it.description || it.detail || '',
        category: it.category || 'opportunity',
        priority: it.priority || 'medium',
        dueDate: it.dueDate || it.due || new Date().toISOString().split('T')[0],
        completed: Boolean(it.completed),
      } as ActionItem));
      setActions(mapped);
    }
  }, [analyticsData]);

  const toggleAction = (id: string) => {
    setActions(actions.map(a => 
      a.id === id ? { ...a, completed: !a.completed } : a
    ));
  };

  const downloadCoachingReport = () => {
    try {
      const report = {
        generatedAt: new Date().toISOString(),
        overallSentiment: 'Positive',
        positivePercentage: 65,
        strengths: [
          { title: 'Subject Mastery', score: 4.8, description: 'Deep knowledge and clear explanations' },
          { title: 'Course Organization', score: 4.6, description: 'Well-structured courses and materials' },
          { title: 'Availability', score: 4.5, description: 'Responsive to student inquiries' },
        ],
        opportunities: [
          { title: 'Interactive Activities', score: 3.5, description: 'Need more group discussions and hands-on exercises' },
          { title: 'Feedback Quality', score: 3.8, description: 'Provide more detailed personalized feedback' },
        ],
        actionItems: actions.map(a => ({
          title: a.title,
          priority: a.priority,
          dueDate: a.dueDate,
          completed: a.completed,
        })),
        completedActions: actions.filter(a => a.completed).length,
        pendingActions: actions.filter(a => !a.completed).length,
      };

      const json = JSON.stringify(report, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-coaching-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('Coaching report downloaded successfully!');
    } catch (e) {
      alert('Failed to download report');
    }
  };

  const completedCount = actions.filter(a => a.completed).length;
  const pendingCount = actions.filter(a => !a.completed).length;
  const categoryCounts = {
    strength: actions.filter(a => a.category === 'strength').length,
    opportunity: actions.filter(a => a.category === 'opportunity').length,
    growth: actions.filter(a => a.category === 'growth').length,
  };

  const insightsGenerated = analyticsData?.analytics?.insightsGenerated ?? (evalData?.evaluations?.length ?? 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🤖 AI Teaching Coach</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            AI-powered personalized insights and actionable recommendations to improve your teaching effectiveness
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat with AI
          </Button>
          <Button variant="primary" onClick={downloadCoachingReport} className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Lightbulb className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Insights Generated</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">8</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Completed Actions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Target className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Pending Actions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Progress</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round((completedCount / actions.length) * 100)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Overall Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="font-semibold text-green-900 dark:text-green-100 mb-2">✨ Teaching Overview</p>
            <p className="text-sm text-green-800 dark:text-green-200">
              {(() => {
                const total = teacherEvals.length;
                const positives = teacherEvals.filter((e:any) => Number(e.score ?? e.rating ?? 0) >= 4).length;
                const neutrals = teacherEvals.filter((e:any) => {
                  const s = Number(e.score ?? e.rating ?? 0);
                  return s >= 3 && s < 4;
                }).length;
                const negs = total - positives - neutrals;
                const pPct = total ? Math.round((positives/total)*100) : 0;
                const nPct = total ? Math.round((neutrals/total)*100) : 0;
                const negPct = total ? 100 - pPct - nPct : 0;
                const avg = total ? (teacherEvals.reduce((s:any,e:any)=>s+Number(e.score ?? e.rating ?? 0),0)/total) : (analyticsData?.analytics?.evaluationRate||0);
                return `${pPct}% of ratings are positive, ${nPct}% neutral, and ${negPct}% negative. Your overall rating is ${avg.toFixed(1)}/5.`;
              })()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Key Strengths ({categoryCounts.strength})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(() => {
            const criteria = analyticsData?.analytics?.criteriaBreakdown || [];
            if (!criteria.length) {
              return <p className="text-sm text-gray-600 dark:text-gray-400">No strength data available</p>;
            }
            const top3 = [...criteria].sort((a:any,b:any)=>b.score-a.score).slice(0,3);
            return top3.map((item:any, idx:number) => (
              <div key={idx} className="p-4 bg-greenalt-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">{item.criteriaName || item.name || 'Strength'}</h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  You scored {item.score.toFixed(1)}/5 in this area based on recent evaluations.
                </p>
                <Badge variant="success" className="mt-2">Rating: {item.score.toFixed(1)}/5</Badge>
              </div>
            ));
          })()}
        </CardContent>
      </Card>

      {/* Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Opportunities for Improvement ({categoryCounts.opportunity})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">🤝 Interactive Learning Activities</h4>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              Students would benefit from more group discussions, case studies, and collaborative exercises to boost engagement and peer learning.
            </p>
            <Badge variant="warning" className="mt-2">Rating: 3.5/5</Badge>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">✏️ Feedback Quality & Frequency</h4>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              Students request more detailed, personalized feedback on their work. Consider using detailed rubrics and written comments.
            </p>
            <Badge variant="warning" className="mt-2">Rating: 3.8/5</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Action Items & Goals
          </CardTitle>
          <CardDescription>Track your professional development goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <Button 
              variant={selectedCategory === null ? "primary" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All ({actions.length})
            </Button>
            <Button 
              variant={selectedCategory === 'growth' ? "primary" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory('growth')}
            >
              Growth ({categoryCounts.growth})
            </Button>
            <Button 
              variant={selectedCategory === 'opportunity' ? "primary" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory('opportunity')}
            >
              Opportunity ({categoryCounts.opportunity})
            </Button>
            <Button 
              variant={selectedCategory === 'strength' ? "primary" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory('strength')}
            >
              Strength ({categoryCounts.strength})
            </Button>
          </div>

          {/* Action Items List */}
          <div className="space-y-3">
            {actions
              .filter(a => selectedCategory === null || a.category === selectedCategory)
              .map((action) => (
                <div 
                  key={action.id} 
                  className={`p-4 border-l-4 rounded-lg transition ${
                    action.completed 
                      ? 'bg-gray-50 dark:bg-gray-800 border-l-green-500 opacity-60' 
                      : action.priority === 'high'
                      ? 'bg-red-50 dark:bg-red-900/20 border-l-red-500'
                      : action.priority === 'medium'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-yellow-500'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={action.completed}
                      onChange={() => toggleAction(action.id)}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-semibold ${action.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {action.title}
                        </h4>
                        <Badge 
                          variant={action.priority === 'high' ? 'destructive' : action.priority === 'medium' ? 'warning' : 'secondary'}
                        >
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {action.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {action.dueDate}</span>
                        {action.completed && (
                          <span className="ml-auto text-green-600 dark:text-green-400 font-semibold">✓ Completed</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert variant="info">
              Focus on completing the high-priority items: implement peer review activities and create detailed grading rubrics. These changes can significantly improve student satisfaction.
            </Alert>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Schedule Coaching Session</Button>
              <Button variant="outline">View Detailed Analytics</Button>
              <Button variant="outline" onClick={downloadCoachingReport} className="gap-2">
                <Download className="w-4 h-4" />
                Download Full Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
