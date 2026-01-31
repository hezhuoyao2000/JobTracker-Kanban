'use client';

import React, { useMemo, useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
  Link as LinkIcon,
  MapPin,
  MessageSquare,
  Tag,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { useBoardContext } from './context/BoardContext';

export function PreviewWindow() {
  const { text, font, themeClass } = useTheme();
  const {
    isPreviewOpen,
    previewCard,
    board,
    closePreview,
    openCard,
    handleDelete,
  } = useBoardContext();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const currentStatusName = useMemo(() => {
    if (!previewCard) return '';
    const column = board.columns.find((col) => col.id === previewCard.statusId);
    return column?.name ?? 'Unknown';
  }, [board.columns, previewCard]);

  if (!isPreviewOpen || !previewCard) return null;

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
          <h2 className={`text-2xl ${font.heading} font-bold ${text.primary}`}>
            Job details
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                handleDelete(previewCard.id);
                closePreview();
              }}
              className={`p-1 ${text.muted} hover:opacity-80 rounded-full transition-all`}
              title="Delete"
              aria-label="Delete"
            >
              <Trash2 size={24} />
            </button>
            <button
              type="button"
              onClick={closePreview}
              className={`p-1 ${text.muted} hover:opacity-80 rounded-full transition-all`}
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin-y">
          {/* Main Info */}
          <div className="flex flex-col gap-4">
            <div>
              <div
                className={`block text-sm font-bold uppercase tracking-widest ${text.muted} mb-1.5`}
              >
                Position
              </div>
              <div className={`w-full ${text.primary} text-base`}>
                {previewCard.jobTitle || '—'}
              </div>
            </div>
            <div>
              <div
                className={`block text-sm font-bold uppercase tracking-widest ${text.muted} mb-1.5`}
              >
                Company name
              </div>
              <div className={`w-full ${text.primary} text-base`}>
                {previewCard.companyName || '—'}
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <div
              className={`block text-sm font-bold uppercase tracking-widest ${text.muted} mb-2.5`}
            >
              Current status
            </div>
            <div className="flex flex-wrap gap-2">
              <div
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all flex items-center gap-1.5 ${themeClass.accentBg} ${themeClass.accentBorder} ${text.button} shadow-md`}
              >
                {currentStatusName || 'Unknown'}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-4">
            <div>
              <div
                className={`block text-sm font-bold uppercase tracking-widest ${text.muted} mb-1.5 flex items-center gap-2`}
              >
                <MapPin size={12} /> Job location
              </div>
              <div className={`w-full ${text.primary} text-base`}>
                {previewCard.jobLocation || '—'}
              </div>
            </div>
            <div>
              <div
                className={`block text-sm font-bold uppercase tracking-widest ${text.muted} mb-1.5 flex items-center gap-2`}
              >
                <LinkIcon size={12} /> Position link
              </div>
              <div className={`w-full ${text.primary} text-base`}>
                {previewCard.jobLink ? (
                  <a
                    href={previewCard.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${text.link} hover:underline`}
                  >
                    {previewCard.jobLink}
                  </a>
                ) : (
                  '—'
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <div
                className={`block text-sm font-bold uppercase tracking-widest ${text.muted} mb-1.5 flex items-center gap-2`}
              >
                <Calendar size={12} /> Application date
              </div>
              <div className={`w-full ${text.primary} text-base`}>
                {previewCard.appliedTime
                  ? new Date(previewCard.appliedTime).toISOString().split('T')[0]
                  : '—'}
              </div>
            </div>
            <div>
              <div
                className={`block text-sm font-bold uppercase tracking-widest ${text.muted} mb-1.5 flex items-center gap-2`}
              >
                <User size={12} /> Contact information
              </div>
              <div className={`w-full ${text.primary} text-base`}>
                {previewCard.extra?.contactInfo || '—'}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div
              className={`block text-sm font-bold uppercase tracking-widest ${text.muted} mb-1.5 flex items-center gap-2`}
            >
              <Tag size={12} /> Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {previewCard.tags?.length ? (
                previewCard.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`flex items-center gap-1 ${themeClass.tagBg} ${text.primary} text-sm font-bold px-2 py-1 rounded-lg uppercase tracking-wider border ${themeClass.cardBorder}`}
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className={`${text.muted} text-base`}>—</span>
              )}
            </div>
          </div>

          {/* Large Fields */}
          <div>
            <div
              className={`block text-sm font-bold uppercase tracking-widest ${text.muted} mb-1.5 flex items-center gap-2`}
            >
              <Info size={12} /> Job description
            </div>
            <div className={`w-full ${text.primary} text-base`}>
              <div
                className={
                  isDescriptionExpanded ? 'whitespace-pre-wrap' : 'line-clamp-4'
                }
              >
                {previewCard.description || '—'}
              </div>
              {previewCard.description && (
                <div className="mt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setIsDescriptionExpanded((prev) => !prev)
                    }
                    className={`flex items-center gap-1.5 text-sm font-semibold ${text.muted} hover:opacity-90`}
                  >
                    {isDescriptionExpanded ? (
                      <>
                        <ChevronUp size={16} />
                        Collapse
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        Expand
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div
              className={`block text-sm font-bold uppercase tracking-widest ${text.muted} mb-1.5 flex items-center gap-2`}
            >
              <MessageSquare size={12} /> Personal notes
            </div>
            <div className={`w-full ${text.primary} text-base`}>
              <div
                className={
                  isNotesExpanded ? 'whitespace-pre-wrap' : 'line-clamp-4'
                }
              >
                {previewCard.comments || '—'}
              </div>
              {previewCard.comments && (
                <div className="mt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setIsNotesExpanded((prev) => !prev)}
                    className={`flex items-center gap-1.5 text-sm font-semibold ${text.muted} hover:opacity-90`}
                  >
                    {isNotesExpanded ? (
                      <>
                        <ChevronUp size={16} />
                        Collapse
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        Expand
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 border-t ${themeClass.divider} flex justify-end gap-3 sticky bottom-0 ${themeClass.tagBg}`}
        >
          <button
            type="button"
            onClick={closePreview}
            className={`px-6 py-2.5 ${text.secondary} font-semibold hover:opacity-80 transition-colors`}
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              closePreview();
              openCard(previewCard.id);
            }}
            className={`px-8 py-2.5 ${themeClass.buttonBg} ${text.button} font-bold rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-95`}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
