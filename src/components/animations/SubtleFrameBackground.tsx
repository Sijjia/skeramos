'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface SubtleFrameBackgroundProps {
  frames: string[];
  opacity?: number; // 0.05 - 0.2 рекомендуется
  className?: string;
}

export function SubtleFrameBackground({
  frames,
  opacity = 0.1,
  className = '',
}: SubtleFrameBackgroundProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const loadedFramesRef = useRef<Set<number>>(new Set());
  const lastFrameRef = useRef(0);

  // Убеждаемся что мы на клиенте
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Функция загрузки фрейма
  const loadFrame = useCallback((index: number) => {
    if (loadedFramesRef.current.has(index) || index < 0 || index >= frames.length) return;

    const img = new window.Image();
    img.onload = () => {
      loadedFramesRef.current.add(index);
    };
    img.src = frames[index];
  }, [frames]);

  // Загружаем первые фреймы при монтировании
  useEffect(() => {
    if (!isMounted) return;

    // Загружаем первые 10 фреймов сразу
    for (let i = 0; i < Math.min(10, frames.length); i++) {
      const img = new window.Image();
      img.onload = () => {
        loadedFramesRef.current.add(i);
        if (i === 0) setIsReady(true);
      };
      img.src = frames[i];
    }
  }, [frames, isMounted]);

  // Слушаем скролл
  useEffect(() => {
    if (!isMounted) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const progress = Math.min(scrollY / viewportHeight, 1);

        const frameIndex = Math.min(
          Math.floor(progress * frames.length),
          frames.length - 1
        );

        // Предзагружаем следующие фреймы
        for (let i = frameIndex; i < Math.min(frameIndex + 10, frames.length); i++) {
          loadFrame(i);
        }

        // Обновляем только если фрейм загружен
        if (loadedFramesRef.current.has(frameIndex)) {
          lastFrameRef.current = frameIndex;
          setCurrentFrame(frameIndex);
        } else {
          // Показываем последний загруженный фрейм
          setCurrentFrame(lastFrameRef.current);
        }

        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Вызываем сразу для инициализации

    return () => window.removeEventListener('scroll', handleScroll);
  }, [frames.length, isMounted, loadFrame]);

  if (!isMounted || !isReady) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Рендерим только текущий фрейм для производительности */}
      <div
        className="absolute inset-0"
        style={{
          opacity: opacity,
          backgroundImage: `url(${frames[currentFrame]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Затемняющий градиент поверх */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
    </div>
  );
}
