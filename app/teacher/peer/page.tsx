'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RatingScale } from '@/components/RatingScale';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { useFetch } from '@/hooks';
import { downloadPdf } from '@/utils/helpers';
import { Download, CheckCircle, Clock, MessageSquare, BarChart3 } from 'lucide-react';
import { DashboardSkeleton } from '@/components/loading/Skeletons';

interface PeerEvaluation {
  id: string;
  peerName: string;
  peerDepartment: string;
  dueDate: string;
  status: 'pending' | 'completed';
  completedDate?: string;
  ratings?: Record<string, number>;
  comment?: string;
}


export default function PeerEvaluation() {
  const [selectedPeer, setSelectedPeer] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { data: evalData, loading: evalLoading } = useFetch<any>('/evaluations');
  const [evaluationList, setEvaluationList] = useState<PeerEvaluation[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const selectedPeerData = evaluationList.find(p => p.id === selectedPeer);

  useEffect(() => {
    if (evalData?.evaluations) {
      const peers = evalData.evaluations
        .filter((e:any) => e.evaluation_type === 'peer')
        .map((e:any) => ({
          id: e.id,
          peerName: e.evaluatee_name || 'Unknown',
          peerDepartment: e.evaluatee_department || '',
          dueDate: e.created_at,
          status: e.status,
          completedDate: e.submitted_at,
          ratings: e.responses ? {
            teaching: e.responses.find((r:any)=>r.criteria_id==='teaching')?.rating,
            collaboration: e.responses.find((r:any)=>r.criteria_id==='collaboration')?.rating,
            development: e.responses.find((r:any)=>r.criteria_id==='development')?.rating,
            innovation: e.responses.find((r:any)=>r.criteria_id==='innovation')?.rating,
          } : undefined,
          comment: e.overall_comment || '',
        } as PeerEvaluation));
      setEvaluationList(peers);
    }
  }, [evalData]);

  const handleSubmit = async () => {
    if (!selectedPeer) return;

    const token = typeof window !== 'undefined' ? sessionStorage.getItem('auth_token') : null;
    try {
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify({
          evaluationId: selectedPeer,
          responses: Object.entries(ratings).map(([criteriaId, rating]) => ({
            criteriaId,
            rating,
          })),
          // peer evaluation type is already set on the server record
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');

      // update local state to reflect submission
      const updatedList = evaluationList.map(p => {
        if (p.id === selectedPeer) {
          return {
            ...p,
            status: 'completed' as const,
            completedDate: new Date().toISOString().split('T')[0],
            ratings,
            comment,
          };
        }
        return p;
      });
      setEvaluationList(updatedList);
      setSubmitted(true);
      setTimeout(() => {
        setSelectedPeer(null);
        setRatings({});
        setComment('');
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      alert(`Error submitting evaluation: ${err}`);
    }
  };

  const downloadEvaluationHistory = () => {
    try {
      const history = evaluationList.map(p => ({
        'Peer Name': p.peerName,
        'Department': p.peerDepartment,
        'Due Date': p.dueDate,
        'Status': p.status,
        'Completed Date': p.completedDate || 'N/A',
        'Teaching Quality': p.ratings?.teaching || 'N/A',
        'Collaboration': p.ratings?.collaboration || 'N/A',
        'Innovation': p.ratings?.innovation || 'N/A',
      }));

      const headers = Object.keys(history[0] || {});
      const csv = [
        headers.join(','),
        ...history.map(h => headers.map(col => `"${String((h as any)[col])}"`).join(',')),
      ].join('\n');

      downloadPdf(csv, `peer-evaluations-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      alert('Failed to generate history report');
    }
  };

  if (evalLoading) return <DashboardSkeleton />;

  const pendingCount = evaluationList.filter(p => p.status === 'pending').length;
  const completed = evaluationList.filter(p => p.status === 'completed').length;
  const pending = pendingCount;

  // compute average score given in completed peer reviews
  const avgScoreGiven = (() => {
    const completedEvals = evaluationList.filter(p => p.status === 'completed' && p.ratings);
    if (!completedEvals.length) return 0;
    const totalAvg = completedEvals.reduce((acc, p) => {
      const vals = Object.values(p.ratings || {}).map(v => v || 0);
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      return acc + avg;
    }, 0);
    return Math.round((totalAvg / completedEvals.length) * 10) / 10;
  })();

  if (!showHistory && pendingCount === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No peer evaluations pending</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          You have completed all assigned peer reviews.
        </p>
      </div>
    );
  }

  if (showHistory) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📋 Peer Evaluation History</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Review your completed peer evaluations
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowHistory(false)}>
            Back to Evaluations
          </Button>
        </div>

        {evaluationList
          .filter(p => p.status === 'completed')
          .map((peer) => (
            <Card key={peer.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{peer.peerName}</CardTitle>
                    <CardDescription>{peer.peerDepartment} • Completed {peer.completedDate}</CardDescription>
                  </div>
                  <Badge variant="success">✓ Completed</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Teaching Quality</p>
                    <p className="text-2xl font-bold text-yellow-500">{peer.ratings?.teaching}/5</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Collaboration</p>
                    <p className="text-2xl font-bold text-blue-500">{peer.ratings?.collaboration}/5</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Professional Development</p>
                    <p className="text-2xl font-bold text-green-500">{peer.ratings?.development}/5</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Innovation</p>
                    <p className="text-2xl font-bold text-purple-500">{peer.ratings?.innovation}/5</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Comments</p>
                  <p className="text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    {peer.comment}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

        {evaluationList.filter(p => p.status === 'completed').length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">No completed evaluations yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">👥 Peer Evaluation</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Evaluate your colleagues' teaching effectiveness
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadEvaluationHistory} className="gap-2">
            <Download className="w-4 h-4" />
            Export History
          </Button>
          <Button variant="outline" onClick={() => setShowHistory(true)} className="gap-2">
            <MessageSquare className="w-4 h-4" />
            View History
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto text-orange-600 mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Avg Score Given</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgScoreGiven}/5</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {!selectedPeer ? (
        <>
          {/* Pending Evaluations */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">⏳ Pending Evaluations</h2>
            <div className="space-y-3">
              {evaluationList
                .filter(p => p.status === 'pending')
                .map((peer) => (
                  <Card key={peer.id} className="hover:shadow-lg transition">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{peer.peerName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{peer.peerDepartment}</p>
                          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Due: {peer.dueDate}</p>
                        </div>
                        <Button 
                          variant="primary"
                          onClick={() => setSelectedPeer(peer.id)}
                        >
                          Evaluate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Completed Evaluations */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">✓ Completed Evaluations</h2>
            <div className="space-y-3">
              {evaluationList
                .filter(p => p.status === 'completed')
                .map((peer) => (
                  <Card key={peer.id} className="opacity-75">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{peer.peerName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{peer.peerDepartment}</p>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">Completed: {peer.completedDate}</p>
                        </div>
                        <Badge variant="success">Submitted</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {submitted ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">✅ Evaluation Submitted</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your feedback for {selectedPeerData?.peerName} has been recorded successfully.
                </p>
                <Button variant="primary" onClick={() => setSelectedPeer(null)}>
                  Evaluate Another Colleague
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>
                      Evaluate {selectedPeerData?.peerName}
                    </CardTitle>
                    <CardDescription>
                      Department: {selectedPeerData?.peerDepartment} • Due: {selectedPeerData?.dueDate}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedPeer(null)}>
                    Cancel
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <RatingScale
                  label="Teaching Quality & Effectiveness"
                  value={ratings['teaching'] || 0}
                  onChange={(v) => setRatings({ ...ratings, teaching: v })}
                />

                <RatingScale
                  label="Collaboration & Teamwork"
                  value={ratings['collaboration'] || 0}
                  onChange={(v) => setRatings({ ...ratings, collaboration: v })}
                />

                <RatingScale
                  label="Professional Development & Growth"
                  value={ratings['development'] || 0}
                  onChange={(v) => setRatings({ ...ratings, development: v })}
                />

                <RatingScale
                  label="Innovation & Curriculum Improvement"
                  value={ratings['innovation'] || 0}
                  onChange={(v) => setRatings({ ...ratings, innovation: v })}
                />

                <div>
                  <Textarea
                    label="Detailed Comments"
                    placeholder="Provide specific, constructive feedback that highlights strengths and areas for improvement..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <Checkbox label="I confirm this evaluation is honest, fair, and confidential" required />

                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" onClick={() => setSelectedPeer(null)}>
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={Object.keys(ratings).length < 4 || !comment.trim()}
                  >
                    Submit Evaluation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
