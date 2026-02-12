<?php
require_once __DIR__ . '/config.php';

// Проверка авторизации для всех методов
if (!isAuthenticated()) {
    jsonResponse(['error' => 'Не авторизован'], 401);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Получить все переводы
        $translations = [];

        foreach (LANGUAGES as $lang) {
            $filePath = MESSAGES_DIR . '/' . $lang . '.json';
            if (file_exists($filePath)) {
                $content = file_get_contents($filePath);
                $translations[$lang] = json_decode($content, true) ?? [];
            } else {
                $translations[$lang] = [];
            }
        }

        jsonResponse($translations);
        break;

    case 'PUT':
        // Обновить переводы
        $data = getJsonBody();

        foreach (LANGUAGES as $lang) {
            if (isset($data[$lang])) {
                $filePath = MESSAGES_DIR . '/' . $lang . '.json';
                $dir = dirname($filePath);

                if (!is_dir($dir)) {
                    mkdir($dir, 0755, true);
                }

                $json = json_encode($data[$lang], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
                file_put_contents($filePath, $json . "\n");
            }
        }

        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Метод не поддерживается'], 405);
}
