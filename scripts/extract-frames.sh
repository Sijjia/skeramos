#!/bin/bash

# Скрипт для извлечения фреймов из видео
# Использование: ./extract-frames.sh video.mp4 series1

VIDEO=$1
SERIES=$2

if [ -z "$VIDEO" ] || [ -z "$SERIES" ]; then
    echo "Использование: ./extract-frames.sh <video.mp4> <series_name>"
    echo "Пример: ./extract-frames.sh videos/pottery.mp4 series1"
    exit 1
fi

OUTPUT_DIR="public/frames/$SERIES"
mkdir -p "$OUTPUT_DIR"

echo "Извлекаю фреймы из $VIDEO в $OUTPUT_DIR..."

# Извлекаем 12 фреймов (для плавной анимации при скролле)
ffmpeg -i "$VIDEO" -vf "fps=3,scale=800:-1" "$OUTPUT_DIR/frame_%02d.png" -y

echo "Готово! Фреймы сохранены в $OUTPUT_DIR"
echo "Всего фреймов: $(ls -1 $OUTPUT_DIR/*.png 2>/dev/null | wc -l)"
