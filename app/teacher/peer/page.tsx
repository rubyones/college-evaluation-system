'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RatingScale } from '@/components/RatingScale';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { mockUsers } from '@/data/mock';
import { Download, CheckCircle, Clock, MessageSquare, BarChart3 } from 'lucide-react';

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

const peers: PeerEvaluation[] = [
  {
    id: 'user-teacher-2',
    peerName: 'Dr. Sarah Chen',
    peerDepartment: 'Information Technology',
    dueDate: '2024-12-15',
    status: 'pending',
  },
  {
    id: 'user-teacher-3',
    peerName: 'Prof. Michael Brown',
    peerDepartment: 'Computer Science',
    dueDate: '2024-12-20',
    status: 'completed',
    completedDate: '2024-12-10',
    ratings: {
      teaching: 5,
      collaboration: 4,
      development: 5,
      innovation: 4,
    },
    comment: 'Excellent instructor with strong collaboration skills.',
  },
  {
    id: 'user-teacher-4',
    peerName: 'Dr. Emily Wilson',
    peerDepartment: 'Information Technology',
    dueDate: '2024-12-18',
    status: 'pending',
  },
];

export default function PeerEvaluation() {
  const [selectedPeer, setSelectedPeer] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [evaluationList, setEvaluationList] = useState<PeerEvaluation[]>(peers);
  const [showHistory, setShowHistory] = useState(false);

  const selectedPeerData = evaluationList.find(p => p.id === selectedPeer);

  const handleSubmit = () => {
    if (!selectedPeer) return;

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

      const headers = Object.keys(history[0]);
      const csv = [
        headers.join(','),
        ...history.map(h => headers.map(col => `"${String((h as any)[col])}"` ).join(',')),
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `peer-evaluations-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('Evaluation history downloaded successfully!');
    } catch (e) {
      alert('Failed to download history');
    }
  };

  const pending = evaluationList.filter(p => p.status === 'pending').length;
  const completed = evaluationList.filter(p => p.status === 'completed').length;

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
              <p className="text-3xl font-bold text-gray-900 dark:text-white">4.5/5</p>
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
