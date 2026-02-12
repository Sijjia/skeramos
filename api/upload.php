<?php
require_once __DIR__ . '/config.php';

// Только POST запросы
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Метод не поддерживается'], 405);
}

// Проверка авторизации
if (!isAuthenticated()) {
    jsonResponse(['error' => 'Не авторизован'], 401);
}

// Проверка наличия файла
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE => 'Файл превышает максимальный размер',
        UPLOAD_ERR_FORM_SIZE => 'Файл превышает максимальный размер формы',
        UPLOAD_ERR_PARTIAL => 'Файл загружен частично',
        UPLOAD_ERR_NO_FILE => 'Файл не выбран',
        UPLOAD_ERR_NO_TMP_DIR => 'Отсутствует временная папка',
        UPLOAD_ERR_CANT_WRITE => 'Ошибка записи на диск',
    ];
    $errorCode = $_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE;
    $errorMsg = $errorMessages[$errorCode] ?? 'Ошибка загрузки';
    jsonResponse(['error' => $errorMsg], 400);
}

$file = $_FILES['file'];

// Проверка типа файла
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, ALLOWED_TYPES)) {
    jsonResponse(['error' => 'Допустимые форматы: JPEG, PNG, WebP, AVIF, GIF'], 400);
}

// Проверка размера
if ($file['size'] > MAX_UPLOAD_SIZE) {
    $sizeMB = round($file['size'] / 1024 / 1024, 1);
    jsonResponse(['error' => "Файл слишком большой ({$sizeMB} МБ). Максимум: 10 МБ"], 400);
}

// Генерация уникального имени файла
$ext = pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'jpg';
$ext = strtolower($ext);
$timestamp = time() * 1000;
$randomId = bin2hex(random_bytes(4));
$filename = "{$timestamp}-{$randomId}.{$ext}";

// Создание папки uploads если не существует
if (!is_dir(UPLOADS_DIR)) {
    mkdir(UPLOADS_DIR, 0755, true);
}

// Перемещение файла
$destination = UPLOADS_DIR . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    jsonResponse(['error' => 'Ошибка сохранения файла'], 500);
}

// Возвращаем URL
$publicUrl = '/uploads/' . $filename;

jsonResponse([
    'success' => true,
    'url' => $publicUrl
]);
