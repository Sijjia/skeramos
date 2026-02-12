'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label = 'Изображение', className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      // Проверяем размер на клиенте
      if (file.size > 4 * 1024 * 1024) {
        throw new Error(`Файл слишком большой (${(file.size / 1024 / 1024).toFixed(1)} МБ). Максимум: 4 МБ`);
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Ошибка загрузки (${response.status})`);
      }

      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    const url = urlInput.trim();
    if (url) {
      onChange(url);
      setUrlInput('');
      setShowUrlInput(false);
      setError(null);
    }
  };

  return (
    <div className={className}>
      <label className="block text-neutral-300 mb-2">{label}</label>

      {/* Preview */}
      {value && (
        <div className="relative mb-3 group">
          <div className="relative h-40 rounded-lg overflow-hidden bg-neutral-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                setError('Не удалось загрузить превью');
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
          <div className="absolute bottom-2 left-2 right-2 text-xs text-neutral-400 truncate bg-black/50 px-2 py-1 rounded">
            {value}
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${dragOver
            ? 'border-green-400 bg-green-500/10'
            : 'border-neutral-600 hover:border-neutral-500 bg-neutral-700/50 hover:bg-neutral-700'
          }
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-neutral-400 text-sm">Загрузка...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-neutral-400 text-sm">
              {value ? 'Заменить фото' : 'Нажмите или перетащите фото'}
            </span>
            <span className="text-neutral-500 text-xs">
              JPEG, PNG, WebP до 4 МБ
            </span>
          </div>
        )}
      </div>

      {/* URL input fallback */}
      <div className="mt-2">
        {showUrlInput ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => { setShowUrlInput(false); setUrlInput(''); }}
              className="px-3 py-2 bg-neutral-600 hover:bg-neutral-500 text-white rounded-lg text-sm"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="text-neutral-500 hover:text-neutral-400 text-xs transition-colors"
          >
            или вставить URL
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}
