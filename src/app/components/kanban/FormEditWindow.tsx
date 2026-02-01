'use client';

import React, { useState } from 'react';
import {
  X,
  Trash2,
  Calendar,
  Link as LinkIcon,
  MapPin,
  Tag,
  MessageSquare,
  User,
  Info,
  Check,
} from 'lucide-react';
import { JobCard } from '../../services/types/frontendtypes/frontend';
import { Column } from '../../services/types/frontendtypes/frontend';
import { useTheme } from '../theme/ThemeContext';
import { useBoardContext } from './context/BoardContext';
import { useSourcePlatform } from './hooks/useSourcePlatform';

const formatDateForInput = (d?: Date | null): string => {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toISOString().split('T')[0];
};

function buildInitialFormData(
  card: JobCard | null | undefined,
  columns: Column[]
): Partial<JobCard> {
  const defaultStatusId = columns[0]?.id ?? '';
  if (card) {
    return { ...card, appliedTime: card.appliedTime };
  }
  return {
    jobTitle: '',
    companyName: '',
    statusId: defaultStatusId,
    jobLink: '',
    jobLocation: '',
    sourcePlatform: '',
    description: '',
    comments: '',
    tags: [],
    appliedTime: undefined,
    expired: false,
    extra: { contactInfo: '' },
  };
}

export function FormEditWindow() {
  const {
    isCardOpen: isOpen,
    closeCard: onClose,
    selectedCard: card,
    board,
    handleSave: onSave,
    handleDelete: onDelete,
  } = useBoardContext();
  const columns = board.columns;

  const { text, font, themeClass } = useTheme();
  const initForm = buildInitialFormData(card, columns);
  const [formData, setFormData] = useState<Partial<JobCard>>(() => initForm);
  const [tagInput, setTagInput] = useState('');

  // Position link source platform selection
  const {
    platformOption,
    customSourceInput,
    handlePlatformOptionChange,
    handleCustomSourceChange,
    options: linkSourceOptions,
  } = useSourcePlatform(initForm.sourcePlatform, (source) =>
    setFormData((prev) => ({ ...prev, sourcePlatform: source }))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<JobCard> = {
      ...formData,
      appliedTime: formData.appliedTime
        ? (typeof formData.appliedTime === 'string'
            ? new Date(formData.appliedTime)
            : formData.appliedTime)
        : undefined,
    };
    onSave(payload);
  };

  const handleAddTag = () => {
    if (tagInput && !formData.tags?.includes(tagInput)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tag),
    }));
  };

  if (!isOpen) return null;

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 ${themeClass.overlayBackdrop}`}
    >
      <div
        className={`w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 ${themeClass.cardBg} border ${themeClass.cardBorder}`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b ${themeClass.divider} flex items-center justify-between ${themeClass.tagBg}`}
        >
          <h2
            className={`text-xl ${font.heading} font-bold ${text.primary}`}
          >
            {card ? 'Edit job details' : 'New application'}
          </h2>
          <div className="flex items-center gap-2">
            {card && (
              <button
                type="button"
                onClick={() => onDelete(card.id)}
                className={`p-1 ${text.muted} hover:opacity-80 rounded-full transition-all`}
                title="Delete"
                aria-label="Delete"
              >
                <Trash2 size={24} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className={`p-1 ${text.muted} hover:opacity-80 rounded-full transition-all`}
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form
          id="job-edit-form"
          onSubmit={handleSubmit}
          className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin-y"
        >
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label
                className={`block text-xs font-bold uppercase tracking-widest ${text.muted} mb-1.5`}
              >
                Position *
              </label>
              <input
                required
                type="text"
                className={`w-full px-4 py-2.5 rounded-xl border ${themeClass.border} ${themeClass.tagBg} ${text.primary} ${themeClass.inputPlaceholder} ${themeClass.accentFocusRing} transition-all scrollbar-thin-y`}
                placeholder="e.g. Frontend Engineer"
                value={formData.jobTitle ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
                }
              />
            </div>
            <div className="col-span-1">
              <label
                className={`block text-xs font-bold uppercase tracking-widest ${text.muted} mb-1.5`}
              >
                Company name *
              </label>
              <input
                required
                type="text"
                className={`w-full px-4 py-2.5 rounded-xl border ${themeClass.border} ${themeClass.tagBg} ${text.primary} ${themeClass.inputPlaceholder} ${themeClass.accentFocusRing} transition-all scrollbar-thin-y`}
                placeholder="e.g. XXX Technology"
                value={formData.companyName ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-widest ${text.muted} mb-2.5`}
            >
              Current status
            </label>
            <div className="flex flex-wrap gap-2">
              {sortedColumns.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, statusId: col.id }))
                  }
                  className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all flex items-center gap-1.5 ${
                    formData.statusId === col.id
                      ? `${themeClass.accentBg} ${themeClass.accentBorder} ${text.button} shadow-md`
                      : `${themeClass.cardBg} border ${themeClass.border} ${text.secondary} hover:opacity-90`
                  }`}
                >
                  {formData.statusId === col.id && <Check size={12} />}
                  {col.name}
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-widest ${text.muted} mb-1.5 flex items-center gap-2`}
              >
                <MapPin size={12} /> Job location
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 rounded-xl border ${themeClass.border} ${themeClass.tagBg} ${text.primary} text-sm ${themeClass.inputPlaceholder} ${themeClass.accentFocusRing} scrollbar-thin-y`}
                placeholder="e.g. Auckland / Remote"
                value={formData.jobLocation ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, jobLocation: e.target.value }))
                }
              />
            </div>
            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-widest ${text.muted} mb-1.5 flex items-center gap-2`}
              >
                <LinkIcon size={12} /> Position link
              </label>
              {/* Position link source platform selection */}
              <div className="flex gap-2 items-stretch">
                <select
                  className={`w-1/5 min-w-[5rem] px-3 py-2 rounded-xl border ${themeClass.border} ${themeClass.tagBg} ${text.primary} text-sm ${themeClass.accentFocusRing} cursor-pointer`}
                  value={platformOption}
                  onChange={(e) =>
                    handlePlatformOptionChange(e.target.value)
                  }
                  aria-label="Link source platform"
                >
                  {linkSourceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {platformOption === 'custom' && (
                  <input
                    type="text"
                    className={`w-1/5 min-w-[5rem] px-3 py-2 rounded-xl border ${themeClass.border} ${themeClass.tagBg} ${text.primary} text-sm ${themeClass.inputPlaceholder} ${themeClass.accentFocusRing} scrollbar-thin-y`}
                    placeholder="Enter source"
                    value={customSourceInput}
                    onChange={(e) =>
                      handleCustomSourceChange(e.target.value)
                    }
                  />
                )}
                <input
                  type="url"
                  className={`flex-1 min-w-0 px-4 py-2 rounded-xl border ${themeClass.border} ${themeClass.tagBg} ${text.primary} text-sm ${themeClass.inputPlaceholder} ${themeClass.accentFocusRing} scrollbar-thin-y`}
                  placeholder="https://..."
                  value={formData.jobLink ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, jobLink: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="appliedTime"
                className={`block text-xs font-bold uppercase tracking-widest ${text.muted} mb-1.5 flex items-center gap-2`}
              >
                <Calendar size={12} /> Application date
              </label>
              <input
                id="appliedTime"
                type="date"
                aria-label="Application date"
                title="Application date"
                className={`w-full px-4 py-2 rounded-xl border ${themeClass.border} ${themeClass.tagBg} ${text.primary} text-sm ${themeClass.accentFocusRing} scrollbar-thin-y`}
                value={formatDateForInput(
                  typeof formData.appliedTime === 'string'
                    ? new Date(formData.appliedTime)
                    : formData.appliedTime
                )}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    appliedTime: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  }))
                }
              />
            </div>
            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-widest ${text.muted} mb-1.5 flex items-center gap-2`}
              >
                <User size={12} /> Contact information
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 rounded-xl border ${themeClass.border} ${themeClass.tagBg} ${text.primary} text-sm ${themeClass.inputPlaceholder} ${themeClass.accentFocusRing} scrollbar-thin-y`}
                placeholder="e.g. HR name, email, etc."
                value={formData.extra?.contactInfo ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    extra: { ...prev.extra, contactInfo: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-widest ${text.muted} mb-1.5 flex items-center gap-2`}
            >
              <Tag size={12} /> Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags?.map((tag) => (
                <span
                  key={tag}
                  className={`flex items-center gap-1 ${themeClass.tagBg} ${text.primary} text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider border ${themeClass.cardBorder}`}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className={`hover:opacity-70 ${text.muted}`}
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className={`flex-grow px-4 py-2 rounded-xl border ${themeClass.border} ${themeClass.tagBg} ${text.primary} text-sm ${themeClass.inputPlaceholder} ${themeClass.accentFocusRing} scrollbar-thin-y`}
                placeholder="Enter and press Enter to add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), handleAddTag())
                }
              />
              <button
                type="button"
                onClick={handleAddTag}
                className={`px-4 py-2 rounded-xl text-sm font-bold border ${themeClass.border} ${themeClass.buttonBg} ${text.button} hover:opacity-90 transition-colors`}
              >
                Add
              </button>
            </div>
          </div>

          {/* Large Fields */}
          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-widest ${text.muted} mb-1.5 flex items-center gap-2`}
            >
              <Info size={12} /> Job description
            </label>
            <textarea
              className={`w-full px-4 py-2 rounded-xl border ${themeClass.border} ${themeClass.tagBg} ${text.primary} text-sm min-h-[100px] ${themeClass.inputPlaceholder} ${themeClass.accentFocusRing} scrollbar-thin-y`}
              placeholder="Paste job description or key requirements..."
              value={formData.description ?? ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>

          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-widest ${text.muted} mb-1.5 flex items-center gap-2`}
            >
              <MessageSquare size={12} /> Personal notes
            </label>
            <textarea
              className={`w-full px-4 py-2 rounded-xl border ${themeClass.border} ${themeClass.tagBg} ${text.primary} text-sm min-h-[100px] ${themeClass.inputPlaceholder} ${themeClass.accentFocusRing} scrollbar-thin-y`}
              placeholder="Your preparation, interview notes, etc..."
              value={formData.comments ?? ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comments: e.target.value }))
              }
            />
          </div>

          {/* Expired toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="expired"
              className={`w-4 h-4 rounded border-2 ${themeClass.accentBorder} ${themeClass.accentText} ${themeClass.accentFocusRing}`}
              checked={formData.expired ?? false}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, expired: e.target.checked }))
              }
            />
            <label
              htmlFor="expired"
              className={`text-sm font-semibold ${text.secondary}`}
            >
              Mark as expired / closed
            </label>
          </div>
        </form>

        {/* Footer */}
        <div
          className={`px-6 py-4 border-t ${themeClass.divider} flex justify-end gap-3 sticky bottom-0 ${themeClass.tagBg}`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`px-6 py-2.5 ${text.secondary} font-semibold hover:opacity-80 transition-colors`}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="job-edit-form"
            className={`px-8 py-2.5 ${themeClass.buttonBg} ${text.button} font-bold rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-95`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
