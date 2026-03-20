import React, { useState, useRef } from 'react';
import { useClickOutside } from '@/hooks';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
  label: string;
  value: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  isDanger?: boolean;
}

interface DropdownProps {
  triggerLabel: string;
  items: DropdownItem[];
  triggerIcon?: React.ReactNode;
  className?: string;
}

export function Dropdown({
  triggerLabel,
  items,
  triggerIcon,
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false));

  const handleItemClick = (item: DropdownItem) => {
    item.onClick?.();
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        {triggerIcon}
        {triggerLabel}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          {items.map((item, index) => (
            <button
              key={item.value}
              onClick={() => handleItemClick(item)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors ${
                item.isDanger ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
