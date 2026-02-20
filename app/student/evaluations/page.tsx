'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RatingScale } from '@/components/RatingScale';
import { Textarea } from '@/components/ui/Textarea';
import { FormStepper } from '@/components/FormStepper';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { DashboardSkeleton } from '@/components/loading/Skeletons';
import { mockEvaluationForm, mockCourses } from '@/data/mock';
import { Alert } from '@/components/ui/Alert';

const steps = [
  { id: 1, title: 'Select Course', description: 'Choose instructor to evaluate' },
  { id: 2, title: 'Rate Criteria', description: 'Provide ratings and feedback' },
  { id: 3, title: 'Review', description: 'Review and submit evaluation' },
];

export default function StudentEvaluations() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleStepChange = (step: number) => {
    if (step < currentStep || currentStep === 0 || (currentStep === 1 && selectedCourse)) {
      setCurrentStep(step);
    }
  };

  const handleRatingChange = (criteriaId: string, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [criteriaId]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Get auth token
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('auth_token') : null;
      
      // Call the API to submit evaluation
      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'demo_token'}`,
        },
        body: JSON.stringify({
          evaluationId: selectedCourse,
          responses: Object.entries(ratings).map(([criterionId, score]) => ({
            criterionId,
            score,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit evaluation');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        router.push('/student/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit evaluation');
      setIsSubmitting(false);
    }
  };

  const canGoToStep = (step: number) => {
    if (step < currentStep) return true;
    if (step === 1) return selectedCourse !== '';
    return false;
  };

  if (isLoading) return <DashboardSkeleton />;

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Evaluation Submitted!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for completing this evaluation. Your response has been recorded securely.
          </p>
          <Button variant="primary" onClick={() => router.push('/student/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teacher Evaluations</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Provide constructive feedback to help your instructors improve their teaching
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evaluation Form</CardTitle>
          <CardDescription>Step by step evaluation process</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="error" title="Error">
              {error}
            </Alert>
          )}
          
          <FormStepper
            steps={steps}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            canChangeStep={canGoToStep}
          />

          {/* Step 1: Select Course */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Select Course & Instructor</h3>
              <div className="grid grid-cols-1 gap-3">
                {mockCourses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      setSelectedCourse(course.id);
                      setCurrentStep(1);
                    }}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedCourse === course.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{course.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {course.code} • {course.instructor?.name}
                        </p>
                      </div>
                      <Badge>{course.section}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Rate Criteria */}
          {currentStep === 1 && selectedCourse && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Rating Instructor: {mockCourses.find((c) => c.id === selectedCourse)?.instructor?.name}
                </p>
              </div>

              {mockEvaluationForm.criteria.map((criteria) => (
                <div key={criteria.id} className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{criteria.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{criteria.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Weight: {criteria.weight}%</p>
                  </div>
                  <RatingScale
                    value={ratings[criteria.id] || 0}
                    onChange={(value) => handleRatingChange(criteria.id, value)}
                    maxScore={criteria.maxScore}
                    size="md"
                  />
                </div>
              ))}

              <div>
                <Textarea
                  label="Overall Comments"
                  placeholder="Provide constructive feedback..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="flex justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(0)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep(2)}
                  disabled={Object.keys(ratings).length < mockEvaluationForm.criteria.length}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 2 && selectedCourse && (
            <div className="space-y-6">
              <Alert
                variant="info"
                title="Anonymous Submission"
              >
                This evaluation will be submitted anonymously to protect your identity.
              </Alert>

              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Instructor: {mockCourses.find((c) => c.id === selectedCourse)?.instructor?.name}
                  </h4>
                  <div className="space-y-2">
                    {mockEvaluationForm.criteria.map((criteria) => (
                      <div key={criteria.id} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{criteria.name}:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {ratings[criteria.id] || 0}/{criteria.maxScore}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {comment && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Comments:</p>
                    <p className="text-sm text-gray-900 dark:text-white">{comment}</p>
                  </div>
                )}
              </div>

              <Checkbox
                label="I confirm this evaluation is honest and constructive"
                checked={true}
                readOnly
              />

              <div className="flex justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
