<?php
// Конфигурация API
define('ADMIN_PASSWORD', 'admin'); // Измените на свой пароль!
define('SESSION_SECRET', 'your-secret-key-change-me'); // Измените!
define('DATA_DIR', __DIR__ . '/../data');
define('UPLOADS_DIR', __DIR__ . '/../uploads');
define('MESSAGES_DIR', __DIR__ . '/../src/messages');
define('MAX_UPLOAD_SIZE', 10 * 1024 * 1024); // 10MB

// Разрешённые типы файлов
define('ALLOWED_TYPES', ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']);

// Доступные коллекции данных
define('COLLECTIONS', [
    'masterclasses',
    'rooms',
    'reviews',
    'gallery',
    'packages',
    'masters',
    'services',
    'afisha',
    'history',
    'settings'
]);

// Языки
define('LANGUAGES', ['ru', 'kg', 'en']);

// CORS заголовки
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Запуск сессии
session_start();

// Функция для создания токена
function createToken(): string {
    $timestamp = time() * 1000; // миллисекунды как в JS
    $hash = hash_hmac('sha256', (string)$timestamp, SESSION_SECRET);
    return $timestamp . '.' . $hash;
}

// Функция для проверки токена
function verifyToken(string $token): bool {
    $parts = explode('.', $token);
    if (count($parts) !== 2) return false;

    [$timestamp, $hash] = $parts;
    $expectedHash = hash_hmac('sha256', $timestamp, SESSION_SECRET);

    if ($hash !== $expectedHash) return false;

    $tokenTime = (int)$timestamp;
    $now = time() * 1000;
    $maxAge = 24 * 60 * 60 * 1000; // 24 часа

    return ($now - $tokenTime) < $maxAge;
}

// Проверка авторизации
function isAuthenticated(): bool {
    $token = $_COOKIE['admin_session'] ?? null;
    return $token ? verifyToken($token) : false;
}

// JSON ответ
function jsonResponse($data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

// Получение JSON из тела запроса
function getJsonBody(): array {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}
