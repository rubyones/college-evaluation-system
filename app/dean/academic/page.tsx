'use client';

// Interfaces
interface AcademicPeriod {
  id: string;
  name?: string;
  academicYear?: string;
  semester?: number;
  start_date?: string;
  end_date?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

interface EvalPeriod {
  id: string;
  name: string;
  start_date?: string;
  end_date?: string;
  startDate?: string;
  endDate?: string;
  status: 'upcoming' | 'active' | 'closed';
}

// Helper function to safely format an individual date string
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString();
};

// Single set of helper functions
const isPeriodActive = (period: AcademicPeriod): boolean => period.isActive;
const isPeriodClosed = (period: AcademicPeriod): boolean => !period.isActive;
const isPeriodUpcoming = (period: AcademicPeriod): boolean => {
  if (!period.startDate) return false;
  const start = new Date(period.startDate);
  const now = new Date();
  return now < start;
};
const isEvalPeriodActive = (evalPeriod: EvalPeriod): boolean => evalPeriod.status === 'active';
const isEvalPeriodClosed = (evalPeriod: EvalPeriod): boolean => evalPeriod.status === 'closed';
const isEvalPeriodUpcoming = (evalPeriod: EvalPeriod): boolean => {
  if (!evalPeriod.startDate) return false;
  const start = new Date(evalPeriod.startDate);
  const now = new Date();
  return now < start;
};

// Placeholder for page content
export default function AcademicPage() {
  return (
    <div>
      <h1>Academic Management Page Restored</h1>
      <p>This page has been restored with clean code and no duplicate helpers. Academic management UI is not included.</p>
    </div>
  );
}
