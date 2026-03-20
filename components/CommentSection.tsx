"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

type Comment = {
  id: string;
  author_id: string | null;
  author_name: string | null;
  content: string;
  rating: number | null;
  created_at: string;
};

export default function CommentSection({ entityType, entityId }: { entityType: string; entityId: string | null }) {
  const { token, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    if (!entityId) return;
    setLoading(true);
    fetch(`/api/comments?entity_type=${encodeURIComponent(entityType)}&entity_id=${encodeURIComponent(entityId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) setComments(data.comments || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [entityType, entityId]);

  const refresh = async () => {
    if (!entityId) return;
    setLoading(true);
    const res = await fetch(`/api/comments?entity_type=${encodeURIComponent(entityType)}&entity_id=${encodeURIComponent(entityId)}`);
    const data = await res.json();
    if (data?.success) setComments(data.comments || []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!entityId || !content.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify({ entity_type: entityType, entity_id: entityId, content }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContent('');
        setComments((s) => [data.comment, ...s]);
      } else {
        console.error('Post comment failed', data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`/api/comments?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token || ''}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setComments((s) => s.filter((c) => c.id !== id));
      } else {
        console.error('Delete failed', data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (c: Comment) => {
    setEditingId(c.id);
    setEditingContent(c.content);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify({ id: editingId, content: editingContent }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setComments((s) => s.map((c) => (c.id === editingId ? data.comment : c)));
        setEditingId(null);
        setEditingContent('');
      } else {
        console.error('Edit failed', data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      <div>
        <Textarea label="Add a comment" value={content} onChange={(e: any) => setContent(e.target.value)} rows={3} />
        <div className="mt-2">
          <Button onClick={handleSubmit} disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {loading && <p className="text-sm text-gray-500">Loading comments...</p>}
        {!loading && comments.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}
        {comments.map((c) => (
          <div key={c.id} className="p-3 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">{c.author_name ?? 'Anonymous'}</p>
                <p className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                {(user && (user.id === c.author_id || user.role === 'dean')) && (
                  <>
                    <button className="text-xs text-blue-600" onClick={() => startEdit(c)}>Edit</button>
                    <button className="text-xs text-red-600" onClick={() => handleDelete(c.id)}>Delete</button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-2">
              {editingId === c.id ? (
                <>
                  <Textarea value={editingContent} onChange={(e: any) => setEditingContent(e.target.value)} rows={3} />
                  <div className="mt-2 flex gap-2">
                    <Button onClick={saveEdit}>Save</Button>
                    <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-800">{c.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
