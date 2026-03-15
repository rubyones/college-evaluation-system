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
import { useFetch } from '@/hooks';
import { Alert } from '@/components/ui/Alert';
import CommentSection from '@/components/CommentSection';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  code: string;
  instructor_name: string;
  instructor_id: string;
  semester: string;
  section: string;
}

interface Criteria {
  id: string;
  name: string;
  description: string;
  weight: number;
}

interface Evaluation {
  id: string;
  course_id: string;
  status: 'draft' | 'submitted' | 'locked';
}

const steps = [
  { id: 1, title: 'Select Course', description: 'Choose instructor to evaluate' },
  { id: 2, title: 'Rate Criteria', description: 'Provide ratings and feedback' },
  { id: 3, title: 'Review', description: 'Review and submit evaluation' },
];

export default function StudentEvaluations() {
  const router = useRouter();
  const { data: coursesData, loading: coursesLoading } = useFetch<any>('/courses');
  const { data: criteriaData, loading: criteriaLoading } = useFetch<any>('/api/criteria');
  const { data: evalData, loading: evalLoading } = useFetch<any>('/evaluations?type=teacher');
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [pendingEvaluations, setPendingEvaluations] = useState<Course[]>([]);

  useEffect(() => {
    setIsLoading(coursesLoading || criteriaLoading || evalLoading);
  }, [coursesLoading, criteriaLoading, evalLoading]);

  // Identify courses that don't have submitted/locked evaluations
  useEffect(() => {
    if (!coursesData?.courses || !evalData?.evaluations) return;

    const courses = coursesData.courses as Course[];
    const evaluations = evalData.evaluations as Evaluation[];

    const pending = courses.filter((course) => {
      const hasCompletedEval = evaluations.some(
        (evaluation) =>
          evaluation.course_id === course.id &&
          (evaluation.status === 'submitted' || evaluation.status === 'locked')
      );
      return !hasCompletedEval;
    });

    setPendingEvaluations(pending);
  }, [coursesData, evalData]);

  const handleStepChange = (step: number) => {
    if (step < currentStep || currentStep === 0 || (currentStep === 1 && selectedCourse)) {
      setCurrentStep(step);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setRatings({}); // Reset ratings for new course
    setComment('');
    setCurrentStep(1);
  };

  const handleRatingChange = (criteriaId: string, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [criteriaId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedCourse) {
      setError('Please select a course');
      return;
    }

    if (Object.keys(ratings).length === 0) {
      setError('Please rate at least one criterion');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('auth_token') : null;

      // Submit evaluation with responses
      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'demo_token'}`,
        },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          evaluationType: 'teacher',
          responses: Object.entries(ratings).map(([criteriaId, rating]) => ({
            criteriaId,
            rating: rating,
            comment: comment || undefined,
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
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit evaluation');
      setIsSubmitting(false);
    }
  };

  const canGoToStep = (step: number) => {
    if (step < currentStep) return true;
    if (step === 1) return selectedCourse !== null;
    return false;
  };

  const criteria = (criteriaData?.criteria || []) as Criteria[];
  const allCriteriaRated = criteria.length > 0 && criteria.every((c) => ratings[c.id] !== undefined);

  if (isLoading) return <DashboardSkeleton />;

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
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

  const hasPendingEvaluations = pendingEvaluations.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teacher Evaluations</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Provide constructive feedback to help your instructors improve their teaching
        </p>
      </div>

      {!hasPendingEvaluations && (
        <Alert variant="info" title="No Pending Evaluations">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p>You have completed all your evaluations for this period.</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                New evaluation opportunities will appear here when they become available.
              </p>
            </div>
          </div>
        </Alert>
      )}

      {hasPendingEvaluations && (
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
                  {pendingEvaluations.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => handleCourseSelect(course)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        selectedCourse?.id === course.id
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{course.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {course.code} • {course.instructor_name}
                          </p>
                          {course.section && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Section: {course.section}</p>}
                        </div>
                        <Badge>{course.semester}</Badge>
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
                    Rating Instructor: <span className="font-semibold">{selectedCourse.instructor_name}</span>
                  </p>
                  <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">{selectedCourse.name} ({selectedCourse.code})</p>
                </div>

                {criteria.length === 0 ? (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                    No evaluation criteria available at the moment.
                  </p>
                ) : (
                  criteria.map((crit) => (
                    <div key={crit.id} className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{crit.name}</h4>
                        {crit.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{crit.description}</p>
                        )}
                        {crit.weight > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Weight: {crit.weight}%</p>
                        )}
                      </div>
                      <RatingScale
                        value={ratings[crit.id] || 0}
                        onChange={(value) => handleRatingChange(crit.id, value)}
                        maxScore={5}
                        size="md"
                      />
                    </div>
                  ))
                )}

                <div>
                  <Textarea
                    label="Overall Comments (Optional)"
                    placeholder="Provide constructive feedback..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="flex justify-between gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep(0)}>
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setCurrentStep(2)}
                    disabled={!allCriteriaRated}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 2 && selectedCourse && (
              <div className="space-y-6">
                <Alert variant="info" title="Anonymous Submission">
                  This evaluation will be submitted anonymously to protect student identity and encourage honest feedback.
                </Alert>

                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Instructor: <span className="text-blue-600 dark:text-blue-400">{selectedCourse.instructor_name}</span>
                    </h4>
                    <div className="space-y-2">
                      {criteria.map((crit) => (
                        <div key={crit.id} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{crit.name}:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {ratings[crit.id] || 0}/5
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {comment && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Comments:</p>
                      <p className="text-sm text-gray-900 dark:text-white italic">{comment}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <Checkbox
                    label="I confirm this evaluation is honest and constructive"
                    checked={true}
                    readOnly
                  />
                </div>

                <div className="flex justify-between gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} disabled={isSubmitting}>
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
      )}

      {selectedCourse && (
        <CommentSection entityType="course" entityId={selectedCourse.id} />
      )}
    </div>
  );
}
