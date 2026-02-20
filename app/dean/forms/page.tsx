'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { mockEvaluationForm } from '@/data/mock';
import { Plus, Trash2, Edit2, Copy, Archive, Eye, Download, Settings } from 'lucide-react';

interface Criteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
}

interface FormData {
  id: string;
  name: string;
  description: string;
  type: 'student-to-teacher' | 'peer-review' | 'self-evaluation' | 'admin-evaluation';
  criteria: Criteria[];
  createdAt: Date;
  publishedAt?: Date;
  isPublished: boolean;
  chedCompliant: boolean;
  responses?: number;
}

// Form Templates
const FORM_TEMPLATES = {
  'student-to-teacher': {
    name: 'Student Evaluation of Teaching',
    description: 'Comprehensive form for students to evaluate instructor performance',
    criteria: [
      { id: 'c1', name: 'Course Organization', description: 'How well is the course organized?', weight: 20, maxScore: 5 },
      { id: 'c2', name: 'Teaching Effectiveness', description: 'How effectively does the instructor teach?', weight: 25, maxScore: 5 },
      { id: 'c3', name: 'Communication Skills', description: 'How clear is the instructor\'s communication?', weight: 20, maxScore: 5 },
      { id: 'c4', name: 'Student Engagement', description: 'How well does the instructor engage students?', weight: 20, maxScore: 5 },
      { id: 'c5', name: 'Assessment Methods', description: 'How fair and clear are the assessment methods?', weight: 15, maxScore: 5 },
    ],
  },
  'peer-review': {
    name: 'Peer Review Evaluation',
    description: 'Form for colleagues to review instructor performance',
    criteria: [
      { id: 'c1', name: 'Subject Matter Expertise', description: 'Depth of knowledge in subject area', weight: 25, maxScore: 5 },
      { id: 'c2', name: 'Curriculum Development', description: 'Quality of curriculum and course materials', weight: 20, maxScore: 5 },
      { id: 'c3', name: 'Scholarly Contribution', description: 'Research and scholarly activities', weight: 25, maxScore: 5 },
      { id: 'c4', name: 'Collaboration', description: 'Teamwork and departmental contribution', weight: 30, maxScore: 5 },
    ],
  },
  'self-evaluation': {
    name: 'Instructor Self-Evaluation',
    description: 'Form for teachers to evaluate their own performance',
    criteria: [
      { id: 'c1', name: 'Professional Development', description: 'Personal growth and learning', weight: 20, maxScore: 5 },
      { id: 'c2', name: 'Achievement of Goals', description: 'Accomplishment of set objectives', weight: 30, maxScore: 5 },
      { id: 'c3', name: 'Teaching Innovation', description: 'Implementation of new strategies', weight: 25, maxScore: 5 },
      { id: 'c4', name: 'Work-Life Balance', description: 'Maintaining professional standards', weight: 25, maxScore: 5 },
    ],
  },
};

export default function EvaluationForms() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTemplateModal, setIsTemplateModal] = useState(false);
  const [isPreviewModal, setIsPreviewModal] = useState(false);
  const [isEditingForm, setIsEditingForm] = useState(false);
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  const [previewForm, setPreviewForm] = useState<FormData | null>(null);
  const [formData, setFormData] = useState<Partial<FormData>>({ type: 'student-to-teacher', criteria: [] });
  const [newCriteria, setNewCriteria] = useState('');
  const [forms, setForms] = useState<FormData[]>([
    {
      ...mockEvaluationForm,
      responses: 128,
    } as FormData,
  ]);

  const handleCreateNewForm = () => {
    setIsEditingForm(false);
    setFormData({ name: '', description: '', type: 'student-to-teacher', criteria: [], isPublished: false, chedCompliant: true });
    setNewCriteria('');
    setCurrentFormId(null);
    setIsModalOpen(true);
  };

  const handleUseTemplate = (templateKey: keyof typeof FORM_TEMPLATES) => {
    const template = FORM_TEMPLATES[templateKey];
    setFormData({
      name: template.name,
      description: template.description,
      type: templateKey,
      criteria: template.criteria.map(c => ({ ...c, id: `criteria-${Date.now()}-${Math.random()}` })),
      isPublished: false,
      chedCompliant: true,
    });
    setIsTemplateModal(false);
    setIsEditingForm(false);
    setCurrentFormId(null);
    setIsModalOpen(true);
  };

  const handleAddCriteria = () => {
    if (!newCriteria.trim()) return;
    const criteria: Criteria = {
      id: `criteria-${Date.now()}`,
      name: newCriteria,
      description: `Evaluates ${newCriteria.toLowerCase()}`,
      weight: Math.round(100 / ((formData.criteria?.length || 0) + 1)),
      maxScore: 5,
    };
    setFormData(prev => ({
      ...prev,
      criteria: [...(prev.criteria || []), criteria],
    }));
    setNewCriteria('');
  };

  const handleRemoveCriteria = (id: string) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria?.filter(c => c.id !== id),
    }));
  };

  const handleUpdateCriteria = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria?.map(c => c.id === id ? { ...c, [field]: value } : c),
    }));
  };

  const handleSaveForm = () => {
    if (!formData.name?.trim() || !formData.criteria?.length) {
      alert('Please fill in form name and add at least one criteria');
      return;
    }

    const totalWeight = formData.criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
    if (totalWeight !== 100) {
      alert(`Criteria weights must total 100% (currently ${totalWeight}%)`);
      return;
    }

    if (isEditingForm && currentFormId) {
      setForms(forms.map(f => f.id === currentFormId ? {
        ...f,
        ...formData,
        updatedAt: new Date(),
      } : f));
      alert('Form updated successfully!');
    } else {
      const newForm: FormData = {
        ...formData as FormData,
        id: `form-${Date.now()}`,
        createdAt: new Date(),
        responses: 0,
      };
      setForms([newForm, ...forms]);
      alert('Form created successfully!');
    }
    setIsModalOpen(false);
  };

  const handleEdit = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    if (form) {
      setFormData(form);
      setCurrentFormId(formId);
      setIsEditingForm(true);
      setIsModalOpen(true);
    }
  };

  const handlePreview = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    if (form) {
      setPreviewForm(form);
      setIsPreviewModal(true);
    }
  };

  const handleDuplicate = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    if (form) {
      const duplicated: FormData = {
        ...form,
        id: `form-${Date.now()}`,
        name: `${form.name} (Copy)`,
        createdAt: new Date(),
        publishedAt: undefined,
        isPublished: false,
        responses: 0,
      };
      setForms([duplicated, ...forms]);
      alert('Form duplicated successfully!');
    }
  };

  const handleArchive = (formId: string) => {
    setForms(forms.filter(f => f.id !== formId));
    alert('Form archived successfully');
  };

  const handlePublish = (formId: string) => {
    setForms(forms.map(f => f.id === formId ? { ...f, isPublished: true, publishedAt: new Date() } : f));
    alert('Form published successfully!');
  };

  const handleExportForm = (form: FormData) => {
    const data = {
      name: form.name,
      description: form.description,
      type: form.type,
      criteria: form.criteria.map(c => ({
        name: c.name,
        description: c.description,
        weight: c.weight,
        maxScore: c.maxScore,
      })),
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.name.replace(/\s/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Evaluation Forms</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create and manage evaluation forms with CHED compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsTemplateModal(true)} className="gap-2">
            <Settings className="w-4 h-4" />
            Use Template
          </Button>
          <Button variant="primary" onClick={handleCreateNewForm} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Form
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Forms</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{forms.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Published</p>
              <p className="text-3xl font-bold text-green-600">{forms.filter(f => f.isPublished).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Responses</p>
              <p className="text-3xl font-bold text-blue-600">{forms.reduce((sum, f) => sum + (f.responses || 0), 0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Forms</h2>

        {forms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">No forms available. Create one to get started.</p>
            </CardContent>
          </Card>
        ) : (
          forms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <CardTitle>{form.name}</CardTitle>
                      {form.isPublished && <Badge variant="success">Published</Badge>}
                      {form.chedCompliant && <Badge variant="outline">CHED Compliant</Badge>}
                    </div>
                    <CardDescription>{form.description}</CardDescription>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    <p>{form.createdAt.toLocaleDateString()}</p>
                    <p className="text-blue-600 font-semibold mt-1">{form.responses || 0} responses</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Form Meta */}
                <div className="grid grid-cols-3 gap-3 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{form.type.replace('-', ' ').toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Criteria:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{form.criteria.length}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Weight Check:</span>
                    <p className={`font-medium ${form.criteria.reduce((sum, c) => sum + (c.weight || 0), 0) === 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {form.criteria.reduce((sum, c) => sum + (c.weight || 0), 0)}%
                    </p>
                  </div>
                </div>

                {/* Criteria */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Criteria Breakdown:</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {form.criteria.map((criteria) => (
                      <div key={criteria.id} className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{criteria.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{criteria.description}</p>
                        </div>
                        <div className="text-right text-xs whitespace-nowrap ml-2">
                          <p className="font-semibold text-gray-900 dark:text-white">{criteria.weight}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handlePreview(form.id)}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleEdit(form.id)}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleDuplicate(form.id)}
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleExportForm(form)}
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                  {!form.isPublished && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handlePublish(form.id)}
                    >
                      Publish
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleArchive(form.id)}
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Template Selection Modal */}
      <Modal isOpen={isTemplateModal} onClose={() => setIsTemplateModal(false)} title="Choose a Form Template">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Select a template to get started quickly</p>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(FORM_TEMPLATES).map(([key, template]) => (
              <button
                key={key}
                onClick={() => handleUseTemplate(key as keyof typeof FORM_TEMPLATES)}
                className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500 dark:hover:border-blue-500 transition text-left"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{template.criteria.length} criteria</p>
              </button>
            ))}
          </div>
          <Button variant="secondary" onClick={() => setIsTemplateModal(false)} className="w-full">
            Cancel
          </Button>
        </div>
      </Modal>

      {/* Form Builder Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditingForm ? 'Edit Form' : 'Create New Form'}>
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {/* Form Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Form Details</h3>
            <Input
              label="Form Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Student Evaluation of Teaching"
            />
            <Textarea
              label="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the purpose of this evaluation form"
              rows={2}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Evaluation Type
              </label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.type || 'student-to-teacher'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="student-to-teacher">Student to Teacher</option>
                <option value="peer-review">Peer Review</option>
                <option value="self-evaluation">Self Evaluation</option>
                <option value="admin-evaluation">Admin Evaluation</option>
              </select>
            </div>
          </div>

          {/* Criteria Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Evaluation Criteria</h3>

            {/* Add New Criteria */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter criteria name"
                value={newCriteria}
                onChange={(e) => setNewCriteria(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCriteria()}
              />
              <Button variant="secondary" onClick={handleAddCriteria} className="min-w-fit">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Criteria List */}
            {formData.criteria && formData.criteria.length > 0 && (
              <div className="space-y-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg max-h-48 overflow-y-auto">
                {formData.criteria.map((criteria) => (
                  <div key={criteria.id} className="p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <Input
                        value={criteria.name}
                        onChange={(e) => handleUpdateCriteria(criteria.id, 'name', e.target.value)}
                        className="text-sm font-medium"
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveCriteria(criteria.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400">Weight %</label>
                        <Input
                          type="number"
                          value={criteria.weight}
                          onChange={(e) => handleUpdateCriteria(criteria.id, 'weight', parseInt(e.target.value) || 0)}
                          min="1"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400">Max Score</label>
                        <Input
                          type="number"
                          value={criteria.maxScore}
                          onChange={(e) => handleUpdateCriteria(criteria.id, 'maxScore', parseInt(e.target.value) || 5)}
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.criteria && formData.criteria.length > 0 && (
              <div className="text-sm font-semibold p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 dark:text-white">Total Weight:</span>
                  <span className={formData.criteria.reduce((sum, c) => sum + (c.weight || 0), 0) !== 100 ? 'text-red-600' : 'text-green-600'}>
                    {formData.criteria.reduce((sum, c) => sum + (c.weight || 0), 0)}%
                  </span>
                </div>
                {formData.criteria.reduce((sum, c) => sum + (c.weight || 0), 0) !== 100 && (
                  <p className="text-xs text-red-600 mt-1">⚠ Weights must total exactly 100%</p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t border-gray-200 dark:border-gray-700 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveForm}>
              {isEditingForm ? 'Update Form' : 'Create Form'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      {isPreviewModal && previewForm && (
        <Modal isOpen={isPreviewModal} onClose={() => setIsPreviewModal(false)} title={`Preview: ${previewForm.name}`}>
          <div className="space-y-6 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Form Type</p>
                <p className="font-semibold text-gray-900 dark:text-white">{previewForm.type.replace('-', ' ').toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Description</p>
                <p className="font-semibold text-gray-900 dark:text-white">{previewForm.description}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Status</p>
                <div className="flex gap-2">
                  {previewForm.isPublished && <Badge variant="success">Published</Badge>}
                  {previewForm.chedCompliant && <Badge variant="outline">CHED Compliant</Badge>}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Criteria</h4>
              {previewForm.criteria.map((criterion, idx) => (
                <div key={criterion.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-medium text-gray-900 dark:text-white">{idx + 1}. {criterion.name}</h5>
                    <span className="text-xs font-semibold text-blue-600">{criterion.weight}%</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{criterion.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Max Score: {criterion.maxScore}</p>
                </div>
              ))}
            </div>

            <Button variant="secondary" onClick={() => setIsPreviewModal(false)} className="w-full">
              Close Preview
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
