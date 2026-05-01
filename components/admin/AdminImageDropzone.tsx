'use client';

/* eslint-disable @next/next/no-img-element */

import * as React from 'react';
import { Image as ImageIcon, Upload, Video } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

type PreviewType = 'auto' | 'image' | 'video';

type AdminImageDropzoneProps = {
  accept?: string;
  aspectClassName?: string;
  buttonLabel?: string;
  className?: string;
  description?: string;
  disabled?: boolean;
  emptySubtitle?: string;
  emptyTitle?: string;
  onFileSelect: (file: File) => void | Promise<void>;
  previewAlt?: string;
  previewClassName?: string;
  previewType?: PreviewType;
  previewUrl?: string;
  title?: string;
};

const isVideoPreview = (previewType: PreviewType | undefined, previewUrl?: string) => {
  if (previewType === 'video') return true;
  if (previewType === 'image') return false;

  return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(previewUrl || '');
};

export function AdminImageDropzone({
  accept = 'image/*',
  aspectClassName = 'aspect-[4/3]',
  buttonLabel = 'Dosya seç',
  className,
  description,
  disabled,
  emptySubtitle = 'Sürükle-bırak yapın ya da tıklayıp dosya seçin.',
  emptyTitle = 'Görsel ekleyin',
  onFileSelect,
  previewAlt = 'Görsel',
  previewClassName,
  previewType = 'auto',
  previewUrl,
  title,
}: AdminImageDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dragDepth = React.useRef(0);
  const [isDragging, setIsDragging] = React.useState(false);

  const resetInput = React.useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const submitFiles = React.useCallback(
    async (files: FileList | null) => {
      const file = files?.[0];
      if (!file || disabled) return;

      await onFileSelect(file);
      resetInput();
    },
    [disabled, onFileSelect, resetInput],
  );

  const openPicker = React.useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPicker();
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;

    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;

    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;

    dragDepth.current = 0;
    setIsDragging(false);
    await submitFiles(event.dataTransfer.files);
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await submitFiles(event.target.files);
    } finally {
      resetInput();
    }
  };

  const isVideo = isVideoPreview(previewType, previewUrl);

  return (
    <button
      type="button"
      className={cn(
        'group relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border-2 border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] text-left transition-all duration-200',
        'hover:border-[color:var(--accent)] hover:bg-[color:var(--surface)]',
        isDragging && 'border-[color:var(--accent)] bg-[color:var(--surface)] shadow-[0_0_0_6px_rgba(166,137,102,0.12)]',
        disabled && 'pointer-events-none opacity-60',
        className,
      )}
      onClick={openPicker}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />

      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--line)] px-4 py-3">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-[color:var(--text)]">{title || emptyTitle}</p>
          <p className="text-xs leading-5 text-[color:var(--text-muted)]">{description || emptySubtitle}</p>
        </div>
        <span className="shrink-0 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
          {isDragging ? 'Bırak' : previewUrl ? 'Değiştir' : buttonLabel}
        </span>
      </div>

      <div className={cn('relative overflow-hidden bg-[color:var(--surface)]', aspectClassName)}>
        {previewUrl ? (
          isVideo ? (
            <video
              key={previewUrl}
              className={cn('h-full w-full object-cover', previewClassName)}
              controls={false}
              autoPlay
              loop
              muted
              playsInline
              poster={previewUrl}
            >
              <source src={previewUrl} />
            </video>
          ) : (
            <Image src={previewUrl} alt={previewAlt} fill className={cn('h-full w-full object-cover', previewClassName)} sizes="100vw" />
          )
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-[color:var(--text-muted)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--accent)]">
              <Upload className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-[color:var(--text)]">{emptyTitle}</p>
              <p className="text-xs leading-5 text-[color:var(--text-muted)]">{emptySubtitle}</p>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        {isDragging && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[color:var(--accent)]/10 text-[color:var(--text)] backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2 rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--surface)]/90 px-4 py-3 shadow-[0_15px_45px_rgba(0,0,0,0.18)]">
              <Upload className="h-5 w-5 text-[color:var(--accent)]" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em]">Dosyayı bırakın</span>
            </div>
          </div>
        )}

        {previewUrl && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-4 py-3 text-white">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold uppercase tracking-[0.22em]">Mevcut görsel</p>
              <p className="truncate text-[11px] text-white/70">Sürükleyip bırakarak veya tıklayarak değiştirin.</p>
            </div>
            {isVideo ? <Video className="h-4 w-4 text-white/85" /> : <ImageIcon className="h-4 w-4 text-white/85" />}
          </div>
        )}
      </div>
    </button>
  );
}
