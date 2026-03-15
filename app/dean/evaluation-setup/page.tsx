'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { DashboardSkeleton } from '@/components/loading/Skeletons';
import { useFetch } from '@/hooks';
import {
  Edit,
  Plus,
  Save,
  Play,
  Trash2,
} from 'lucide-react';

type AcademicPeriodInput = {
  academicYear: string;
  semester: string;
  startDate: string;
  endDate: string;
};

type EvaluationScheduleInput = {
  name: string;
  startDate: string;
  endDate: string;
  academicPeriodId: string;
};

type AssignmentRow = {
  courseId: string;
  instructorId: string;
  section: string;
  semester: string;
};

type Question = {
  id: string;
  text: string;
  type: 'rating' | 'yesno' | 'comment';
};

type CriteriaRow = {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
  questions: Question[];
};

const safeDate = (value: string) => {
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

const formatAcademicPeriodLabel = (period: any) => {
  if (!period) return '';
  return period.name || `${period.academic_year} Sem ${period.semester}`;
};

// Rating Scale UI (displayed once at the top of questions section)
<div className="mb-6 mt-4">
  <h2 className="text-xl font-bold mb-2">Rating Scale</h2>
  <table className="w-full text-lg border rounded">
    <thead>
      <tr className="bg-gray-100">
        <th className="px-4 py-2">Score</th>
        <th className="px-4 py-2">Meaning</th>
      </tr>
    </thead>
    <tbody>
      <tr><td className="px-4 py-2">1</td><td className="px-4 py-2">Poor</td></tr>
      <tr><td className="px-4 py-2">2</td><td className="px-4 py-2">Fair</td></tr>
      <tr><td className="px-4 py-2">3</td><td className="px-4 py-2">Good</td></tr>
      <tr><td className="px-4 py-2">4</td><td className="px-4 py-2">Very Good</td></tr>
      <tr><td className="px-4 py-2">5</td><td className="px-4 py-2">Excellent</td></tr>
    </tbody>
  </table>
</div>

const fixedCriteria = [
  {
    id: '1',
    name: 'Course Organization',
    weight: 20,
    maxScore: 5,
    questions: [
      { id: '1-1', text: 'The instructor clearly explains the course objectives at the beginning of the class.', type: 'rating', maxScore: 5 },
      { id: '1-2', text: 'The lessons are well organized and easy to understand.', type: 'rating', maxScore: 5 },
      { id: '1-3', text: 'The instructor provides clear instructions for activities and assignments.', type: 'rating', maxScore: 5 },
      { id: '1-4', text: 'The course topics follow a logical and structured sequence.', type: 'rating', maxScore: 5 },
    ],
  },
  {
    id: '2',
    name: 'Teaching Effectiveness',
    weight: 25,
    maxScore: 5,
    questions: [
      { id: '2-1', text: 'The instructor explains concepts clearly and effectively.', type: 'rating', maxScore: 5 },
      { id: '2-2', text: 'The instructor demonstrates strong knowledge of the subject matter.', type: 'rating', maxScore: 5 },
      { id: '2-3', text: 'The instructor uses appropriate teaching methods to help students understand the lesson.', type: 'rating', maxScore: 5 },
      { id: '2-4', text: 'The instructor encourages students to ask questions during class.', type: 'rating', maxScore: 5 },
    ],
  },
  {
    id: '3',
    name: 'Communication Skills',
    weight: 20,
    maxScore: 5,
    questions: [
      { id: '3-1', text: 'The instructor communicates ideas clearly during discussions.', type: 'rating', maxScore: 5 },
      { id: '3-2', text: 'The instructor responds to student questions effectively.', type: 'rating', maxScore: 5 },
      { id: '3-3', text: 'The instructor uses language that is easy to understand.', type: 'rating', maxScore: 5 },
      { id: '3-4', text: 'The instructor listens and responds respectfully to students.', type: 'rating', maxScore: 5 },
    ],
  },
  {
    id: '4',
    name: 'Student Engagement',
    weight: 20,
    maxScore: 5,
    questions: [
      { id: '4-1', text: 'The instructor encourages active participation in class activities.', type: 'rating', maxScore: 5 },
      { id: '4-2', text: 'The instructor motivates students to participate in discussions.', type: 'rating', maxScore: 5 },
      { id: '4-3', text: 'The instructor creates an interactive learning environment.', type: 'rating', maxScore: 5 },
      { id: '4-4', text: 'The instructor makes the class interesting and engaging.', type: 'rating', maxScore: 5 },
    ],
  },
  {
    id: '5',
    name: 'Assessment Methods',
    weight: 15,
    maxScore: 5,
    questions: [
      { id: '5-1', text: 'The instructor provides fair and clear evaluation of student performance.', type: 'rating', maxScore: 5 },
      { id: '5-2', text: 'The instructor gives helpful feedback on assignments and activities.', type: 'rating', maxScore: 5 },
      { id: '5-3', text: 'The grading criteria are clearly explained.', type: 'rating', maxScore: 5 },
      { id: '5-4', text: 'The assessments reflect the lessons taught in class.', type: 'rating', maxScore: 5 },
    ],
  },
];

const criteria = fixedCriteria;
const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

export default function EvaluationSetupPage() {
  // SECTION 1: Academic Period & Evaluation Schedule
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');
  const [evaluationName, setEvaluationName] = useState('');
  const [evalStartDate, setEvalStartDate] = useState('');
  const [evalEndDate, setEvalEndDate] = useState('');
  const [dateWarning, setDateWarning] = useState('');

  // SECTION 2: Assign Instructor and Subjects
  const [courseProgram, setCourseProgram] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [assignSemester, setAssignSemester] = useState('');
  const [instructor, setInstructor] = useState('');
  const [section, setSection] = useState('A');
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignError, setAssignError] = useState('');

  // SECTION 3: Create Evaluation Form
  const [criteria, setCriteria] = useState([...fixedCriteria]);
  const [criteriaError, setCriteriaError] = useState('');

  // SECTION 4: Start Evaluation
  const [status, setStatus] = useState('draft');
  const [saving, setSaving] = useState(false);
  const [starting, setStarting] = useState(false);

  // Helper: Instructors
  const instructorOptions = [
    { value: 't1', label: 'Prof. Juan Dela Cruz' },
    { value: 't2', label: 'Prof. Maria Santos' },
    { value: 't3', label: 'Prof. Jose Reyes' },
  ];

  // Helper: Subjects (from user prompt)
  const allSubjects = [
    { code: "IT101", name: "Introduction to Computing", course: "BSIT", year: "1st Year", semester: "1st Semester" },
    { code: "IT102", name: "Computer Programming 1", course: "BSIT", year: "1st Year", semester: "1st Semester" },
    { code: "IT103", name: "Discrete Mathematics", course: "BSIT", year: "1st Year", semester: "1st Semester" },
    { code: "IT104", name: "Computer Programming 2", course: "BSIT", year: "1st Year", semester: "2nd Semester" },
    { code: "IT105", name: "Human Computer Interaction", course: "BSIT", year: "1st Year", semester: "2nd Semester" },
    { code: "IT106", name: "Data Structures and Algorithms", course: "BSIT", year: "1st Year", semester: "2nd Semester" },
    { code: "IT201", name: "Object-Oriented Programming", course: "BSIT", year: "2nd Year", semester: "1st Semester" },
    { code: "IT202", name: "Web Systems and Technologies 1", course: "BSIT", year: "2nd Year", semester: "1st Semester" },
    { code: "IT203", name: "Database Management Systems", course: "BSIT", year: "2nd Year", semester: "1st Semester" },
    { code: "IT204", name: "Networking 1", course: "BSIT", year: "2nd Year", semester: "2nd Semester" },
    { code: "IT205", name: "Applications Development", course: "BSIT", year: "2nd Year", semester: "2nd Semester" },
    { code: "IT206", name: "Information Assurance and Security", course: "BSIT", year: "2nd Year", semester: "2nd Semester" },
    { code: "IT301", name: "Advance Database Systems", course: "BSIT", year: "3rd Year", semester: "1st Semester" },
    { code: "IT302", name: "System Integration and Architecture", course: "BSIT", year: "3rd Year", semester: "1st Semester" },
    { code: "IT303", name: "Event-Driven Programming", course: "BSIT", year: "3rd Year", semester: "1st Semester" },
    { code: "IT304", name: "Information Assurance and Security 1", course: "BSIT", year: "3rd Year", semester: "1st Semester" },
    { code: "IT305", name: "Mobile Application Development", course: "BSIT", year: "3rd Year", semester: "1st Semester" },
    { code: "IT306", name: "Game Development", course: "BSIT", year: "3rd Year", semester: "1st Semester" },
    { code: "IT307", name: "Web Systems and Technologies 2", course: "BSIT", year: "3rd Year", semester: "1st Semester" },
    { code: "IT308", name: "Information Assurance and Security 2", course: "BSIT", year: "3rd Year", semester: "2nd Semester" },
    { code: "IT309", name: "Application Development and Emerging Technologies", course: "BSIT", year: "3rd Year", semester: "2nd Semester" },
    { code: "IT310", name: "Data Science and Analytics", course: "BSIT", year: "3rd Year", semester: "2nd Semester" },
    { code: "IT311", name: "Technopreneurship", course: "BSIT", year: "3rd Year", semester: "2nd Semester" },
    { code: "IT312", name: "Embedded Systems", course: "BSIT", year: "3rd Year", semester: "2nd Semester" },
    { code: "ITELECT4", name: "System Integration and Architecture 2", course: "BSIT", year: "3rd Year", semester: "2nd Semester" },
    { code: "CAP101", name: "Capstone Project and Research 1", course: "BSIT", year: "3rd Year", semester: "Summer" },
    { code: "SP101", name: "Social and Professional Issues", course: "BSIT", year: "3rd Year", semester: "Summer" },
    { code: "CAP102", name: "Capstone Project and Research 2", course: "BSIT", year: "4th Year", semester: "1st Semester" },
    { code: "IT401", name: "Systems Administration and Maintenance", course: "BSIT", year: "4th Year", semester: "1st Semester" },
    { code: "SWT101", name: "ICT Seminar & Workshop", course: "BSIT", year: "4th Year", semester: "1st Semester" },
    { code: "PRAC101", name: "Practicum (486 Hours)", course: "BSIT", year: "4th Year", semester: "2nd Semester" },
    { code: "EMC101", name: "Introduction to Game Development", course: "BSEMC", year: "1st Year", semester: "1st Semester" },
    { code: "EMC102", name: "Fundamentals of Multimedia", course: "BSEMC", year: "1st Year", semester: "1st Semester" },
    { code: "EMC103", name: "Drawing for Animation", course: "BSEMC", year: "1st Year", semester: "1st Semester" },
    { code: "EMC104", name: "2D Animation", course: "BSEMC", year: "1st Year", semester: "2nd Semester" },
    { code: "EMC105", name: "Digital Imaging", course: "BSEMC", year: "1st Year", semester: "2nd Semester" },
    { code: "EMC106", name: "Multimedia Programming", course: "BSEMC", year: "1st Year", semester: "2nd Semester" },
    { code: "EMC201", name: "Game Design", course: "BSEMC", year: "2nd Year", semester: "1st Semester" },
    { code: "EMC202", name: "3D Modeling", course: "BSEMC", year: "2nd Year", semester: "1st Semester" },
    { code: "EMC203", name: "Audio and Video Production", course: "BSEMC", year: "2nd Year", semester: "1st Semester" },
    { code: "EMC204", name: "Game Programming", course: "BSEMC", year: "2nd Year", semester: "2nd Semester" },
    { code: "EMC205", name: "Character Design", course: "BSEMC", year: "2nd Year", semester: "2nd Semester" },
    { code: "EMC206", name: "3D Animation", course: "BSEMC", year: "2nd Year", semester: "2nd Semester" },
    { code: "EMC301", name: "Advanced Game Development", course: "BSEMC", year: "3rd Year", semester: "1st Semester" },
    { code: "EMC302", name: "Game Physics", course: "BSEMC", year: "3rd Year", semester: "1st Semester" },
    { code: "EMC303", name: "Interactive Multimedia", course: "BSEMC", year: "3rd Year", semester: "1st Semester" },
    { code: "EMC304", name: "Mobile Game Development", course: "BSEMC", year: "3rd Year", semester: "2nd Semester" },
    { code: "EMC305", name: "Game Production", course: "BSEMC", year: "3rd Year", semester: "2nd Semester" },
    { code: "EMC306", name: "Virtual Reality Development", course: "BSEMC", year: "3rd Year", semester: "2nd Semester" },
    { code: "CAP101", name: "Capstone Project 1", course: "BSEMC", year: "3rd Year", semester: "Summer" },
    { code: "CAP102", name: "Capstone Project 2", course: "BSEMC", year: "4th Year", semester: "1st Semester" },
    { code: "EMC401", name: "Advanced Multimedia Systems", course: "BSEMC", year: "4th Year", semester: "1st Semester" },
    { code: "PRAC101", name: "Practicum / Internship", course: "BSEMC", year: "4th Year", semester: "2nd Semester" }
  ];

  // Auto-load subjects
  useEffect(() => {
    if (courseProgram && yearLevel && assignSemester) {
      const filtered = allSubjects.filter(
        (s) => s.course === courseProgram && s.year === yearLevel && s.semester === assignSemester
      );
      setSubjects(filtered);
    } else {
      setSubjects([]);
    }
  }, [courseProgram, yearLevel, assignSemester]);

  // Assign All Subjects
  const handleAssignAll = () => {
    if (!instructor) {
      setAssignError('Select an instructor.');
      return;
    }
    if (!subjects.length) {
      setAssignError('No subjects to assign.');
      return;
    }
    const newAssignments = subjects.map((s) => ({
      ...s,
      instructor,
      section,
      semester: assignSemester,
    }));
    setAssignedSubjects(newAssignments);
    setAssignError('');
  };

  // Criteria Weight Validation
  useEffect(() => {
    const weight = criteria.reduce((sum, c) => sum + c.weight, 0);
    setCriteriaError(weight !== 100 ? 'Total weight must equal 100%' : '');
  }, [criteria]);

  // Date Validation
  useEffect(() => {
    if (evalStartDate && evalEndDate) {
      if (new Date(evalEndDate) < new Date(evalStartDate)) {
        setDateWarning('End date cannot be earlier than start date.');
      } else {
        setDateWarning('');
      }
    }
  }, [evalStartDate, evalEndDate]);

  // Save & Start
  const saveSetup = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };
  const startEvaluation = () => {
    setStarting(true);
    setTimeout(() => setStarting(false), 1000);
  };

  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [activeCriteriaIdx, setActiveCriteriaIdx] = useState<number | null>(null);
  const [tempQuestions, setTempQuestions] = useState<string[]>([]);
  const [questionInput, setQuestionInput] = useState('');

  // Open modal for criteria
  const openQuestionModal = (idx: number) => {
    setActiveCriteriaIdx(idx);
    setTempQuestions(criteria[idx]?.questions.map(q => q.text) || []);
    setQuestionInput('');
    setQuestionModalOpen(true);
  };

  // Save questions to criteria
  const saveQuestions = () => {
    if (activeCriteriaIdx !== null) {
      setCriteria(criteria.map((row, i) =>
        i === activeCriteriaIdx
          ? { ...row, questions: tempQuestions.map((text, idx) => ({ id: `${row.id}-q${idx+1}`, text, type: 'rating', maxScore: 5 })) }
          : row
      ));
    }
    setQuestionModalOpen(false);
    setTempQuestions([]);
    setActiveCriteriaIdx(null);
    setQuestionInput('');
  };

  // Modal UI
  const renderQuestionModal = () => (
    <Modal isOpen={questionModalOpen} onClose={() => setQuestionModalOpen(false)} title="Add Evaluation Questions" size="lg">
      <div className="space-y-4">
        <label className="block text-lg font-semibold mb-1">Question Text</label>
        <input
          type="text"
          className="w-full p-3 text-lg border rounded focus:outline-blue-500"
          placeholder="e.g. The instructor explains the lesson clearly."
          value={questionInput}
          onChange={e => setQuestionInput(e.target.value)}
        />
        <div className="flex gap-2 mt-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded text-lg"
            onClick={() => {
              if (questionInput.trim()) {
                setTempQuestions([...tempQuestions, questionInput.trim()]);
                setQuestionInput('');
              }
            }}
          >Add Question</button>
        </div>
        <ul className="mt-4">
          {tempQuestions.map((q, idx) => (
            <li key={idx} className="flex items-center justify-between mb-2 text-lg">
              <span>{idx+1}. {q}</span>
              <button className="text-red-600 ml-4" onClick={() => setTempQuestions(tempQuestions.filter((_, i) => i !== idx))}>Delete</button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 mt-6 justify-end">
          <button className="bg-gray-400 text-white px-4 py-2 rounded text-lg" onClick={() => setQuestionModalOpen(false)}>Cancel</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded text-lg" onClick={saveQuestions}>Save Questions</button>
        </div>
      </div>
    </Modal>
  );

  // Student Evaluation Form - Anonymous Comment Section
  const [anonymousComment, setAnonymousComment] = useState('');
  const [commentError, setCommentError] = useState('');

  const handleCommentChange = (e) => {
    setAnonymousComment(e.target.value);
    setCommentError('');
  };

  const handleCommentSubmit = () => {
    if (!anonymousComment.trim()) {
      setCommentError('Comment is required.');
      return;
    }
    setCommentError('');
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Evaluation Setup</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">Configure the entire evaluation process in one page. Designed for easy use by administrators.</p>

      {/* SECTION 1: Academic Period & Evaluation Schedule */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl">Academic Period & Evaluation Schedule</CardTitle>
          <CardDescription className="text-base">Set the academic year, semester, evaluation name, and schedule.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold mb-1">Academic Year</label>
            <Input value={academicYear} onChange={e => setAcademicYear(e.target.value)} placeholder="2025–2026" className="text-lg" />
            <p className="text-gray-600 text-sm mt-1">Example: 2025–2026</p>
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">Semester</label>
            <Select value={semester} onChange={e => setSemester(e.target.value)} options={[{ value: '1st Semester', label: '1st Semester' }, { value: '2nd Semester', label: '2nd Semester' }, { value: 'Summer', label: 'Summer' }]} placeholder="Select Semester" className="text-lg" />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">Evaluation Name</label>
            <Input value={evaluationName} onChange={e => setEvaluationName(e.target.value)} placeholder="Midterm Evaluation" className="text-lg" />
            <p className="text-gray-600 text-sm mt-1">Example: Midterm Evaluation</p>
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">Evaluation Start Date</label>
            <Input type="date" value={evalStartDate} onChange={e => setEvalStartDate(e.target.value)} className="text-lg" />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">Evaluation End Date</label>
            <Input type="date" value={evalEndDate} onChange={e => setEvalEndDate(e.target.value)} className="text-lg" />
            {dateWarning && <Alert variant="error" title="Date Warning">{dateWarning}</Alert>}
            <p className="text-gray-600 text-sm mt-1">Students will only be able to answer the evaluation during this period.</p>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: Assign Instructor and Subjects */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl">Assign Instructor and Subjects</CardTitle>
          <CardDescription className="text-base">Select course, year level, and semester to automatically load subjects. Assign subjects to an instructor and section. Tick a subject to assign.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold mb-1">Course Program</label>
            <Select value={courseProgram} onChange={e => setCourseProgram(e.target.value)} options={[{ value: 'BSIT', label: 'BSIT' }, { value: 'BSEMC', label: 'BSEMC' }]} placeholder="Select Program" className="text-lg" />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">Year Level</label>
            <Select value={yearLevel} onChange={e => setYearLevel(e.target.value)} options={[{ value: '1st Year', label: '1st Year' }, { value: '2nd Year', label: '2nd Year' }, { value: '3rd Year', label: '3rd Year' }, { value: '4th Year', label: '4th Year' }]} placeholder="Select Year" className="text-lg" />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">Semester</label>
            <Select value={assignSemester} onChange={e => setAssignSemester(e.target.value)} options={[{ value: '1st Semester', label: '1st Semester' }, { value: '2nd Semester', label: '2nd Semester' }, { value: 'Summer', label: 'Summer' }]} placeholder="Select Semester" className="text-lg" />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">Instructor</label>
            <Select value={instructor} onChange={e => setInstructor(e.target.value)} options={instructorOptions} placeholder="Select Instructor" className="text-lg" />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">Section</label>
            <Select value={section} onChange={e => setSection(e.target.value)} options={[{ value: 'A', label: 'A' }, { value: 'B', label: 'B' }, { value: 'C', label: 'C' }, { value: 'D', label: 'D' }]} placeholder="Select Section" className="text-lg" />
          </div>
        </CardContent>
        <CardContent>
          <p className="text-gray-600 text-sm mb-2">Tick a subject below to assign. Only one subject can be selected at a time.</p>
          {assignError && <Alert variant="error" title="Assignment Error">{assignError}</Alert>}
          <div className="overflow-x-auto">
            <table className="w-full text-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th></th>
                  <th className="px-4 py-3">Subject Code</th>
                  <th className="px-4 py-3">Subject Name</th>
                  <th className="px-4 py-3">Instructor</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Semester</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length > 0 ? subjects.map((s, idx) => (
                  <tr key={s.code + '-' + idx}>
                    <td className="px-2 py-3">
                      <input
                        type="checkbox"
                        checked={assignedSubjects.some(a => a.code === s.code)}
                        onChange={e => {
                          if (e.target.checked) {
                            setAssignedSubjects([{ ...s, instructor, section, semester: assignSemester }]);
                          } else {
                            setAssignedSubjects([]);
                          }
                        }}
                        disabled={assignedSubjects.length > 0 && !assignedSubjects.some(a => a.code === s.code)}
                      />
                    </td>
                    <td className="px-4 py-3">{s.code}</td>
                    <td className="px-4 py-3">{s.name}</td>
                    <td className="px-4 py-3">{instructorOptions.find(i => i.value === instructor)?.label || '—'}</td>
                    <td className="px-4 py-3">{section}</td>
                    <td className="px-4 py-3">{assignSemester}</td>
                    <td className="px-4 py-3">
                      {assignedSubjects.some(a => a.code === s.code) && (
                        <Button variant="danger" size="sm" onClick={() => setAssignedSubjects([])}>Remove</Button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="text-center text-gray-500 py-6">No subjects found for selection.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: Create Evaluation Form */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl">Create Evaluation Form</CardTitle>
          <CardDescription className="text-base">Configure criteria and questions. Total weight must equal 100%.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button variant="outline" onClick={() => setCriteria([...criteria, { id: crypto.randomUUID(), name: '', weight: 0, maxScore: 5, questions: [] }])}>Add Criteria</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Criteria</th>
                  <th className="px-4 py-3">Weight</th>
                  <th className="px-4 py-3">Max Score</th>
                  <th className="px-4 py-3">Questions</th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 font-semibold">{c.name}</td>
                    <td className="px-4 py-3">{c.weight}</td>
                    <td className="px-4 py-3">{c.maxScore}</td>
                    <td className="px-4 py-3">
                      <ol className="list-decimal list-inside">
                        {c.questions.map((q, qidx) => (
                          <li key={q.id} className="mb-1 text-lg">{q.text}</li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                ))}
                {!criteria.length && (
                  <tr><td colSpan={5} className="text-center text-gray-500 py-6">No criteria added yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="font-semibold text-lg">Total Weight:</div>
            <div className={`px-3 py-1 rounded-full text-lg font-semibold ${totalWeight === 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{totalWeight}% {totalWeight === 100 ? '✓' : '— Must equal 100%'}</div>
            {criteriaError && <Alert variant="error" title="Criteria Error">{criteriaError}</Alert>}
          </div>
          {renderQuestionModal()}
        </CardContent>
      </Card>

      {/* SECTION 4: Start Evaluation */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl">Start Evaluation</CardTitle>
          <CardDescription className="text-base">Set evaluation status and launch the evaluation.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold mb-1">Evaluation Status</label>
            <div className="flex gap-6 mb-2">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="status" value="draft" checked={status === 'draft'} onChange={() => setStatus('draft')} />
                <span className="text-lg">Draft</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="status" value="active" checked={status === 'active'} onChange={() => setStatus('active')} />
                <span className="text-lg">Active</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="status" value="closed" checked={status === 'closed'} onChange={() => setStatus('closed')} />
                <span className="text-lg">Closed</span>
              </label>
            </div>
            <div className="text-gray-600 text-sm">
              <p><strong>Draft</strong> = evaluation not available yet</p>
              <p><strong>Active</strong> = students can immediately start evaluation</p>
              <p><strong>Closed</strong> = evaluation completed</p>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-3">
            <Button variant="primary" className="gap-2" onClick={saveSetup} disabled={saving}>Save Setup</Button>
            <Button variant="outline" className="gap-2" onClick={startEvaluation} disabled={starting}>Start Evaluation</Button>
          </div>
        </CardContent>
      </Card>
      {/* Student Evaluation Form - Anonymous Comment Section */}
      <Card className="hover:shadow-lg transition-shadow mt-10">
        <CardHeader>
          <CardTitle className="text-2xl">Anonymous Student Feedback</CardTitle>
          <CardDescription className="text-base">Your comment will remain anonymous and will only be used to improve teaching quality.</CardDescription>
        </CardHeader>
        <CardContent>
          <label className="block text-lg font-semibold mb-2">Student Feedback (Optional)</label>
          <textarea
            className="w-full p-4 text-lg border rounded focus:outline-blue-500"
            placeholder="Write your comments, suggestions, or feedback about the instructor. Your response will remain anonymous."
            maxLength={1000}
            rows={6}
            style={{ resize: 'vertical' }}
          />
          <div className="text-sm text-gray-500 mt-2">Maximum 1000 characters.</div>
        </CardContent>
      </Card>
    </div>
  );
}
