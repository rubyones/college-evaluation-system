import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Dropdown } from '@/components/ui/Dropdown';

export function RoleSwitcher() {
  const { role, setRole } = useAuth();

  const roles = [
    { label: 'Student', value: 'student' },
    { label: 'Teacher', value: 'teacher' },
    { label: 'Dean', value: 'dean' },
  ];

  return (
    <Dropdown
      triggerLabel={role.charAt(0).toUpperCase() + role.slice(1)}
      items={roles.map((r) => ({
        label: r.label,
        value: r.value,
        onClick: () => setRole(r.value as any),
      }))}
    />
  );
}
