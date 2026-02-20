import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Dropdown } from '@/components/ui/Dropdown';
import { UserCog } from 'lucide-react';

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
      triggerIcon={<UserCog className="w-4 h-4" />}
      items={roles.map((r) => ({
        label: r.label,
        value: r.value,
        onClick: () => setRole(r.value as any),
      }))}
    />
  );
}
