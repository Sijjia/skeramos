<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Вход в систему
        $data = getJsonBody();
        $password = $data['password'] ?? '';

        if ($password === ADMIN_PASSWORD) {
            $token = createToken();

            setcookie('admin_session', $token, [
                'expires' => time() + 86400, // 24 часа
                'path' => '/',
                'httponly' => true,
                'secure' => isset($_SERVER['HTTPS']),
                'samesite' => 'Lax'
            ]);

            jsonResponse(['success' => true]);
        } else {
            jsonResponse(['success' => false, 'error' => 'Неверный пароль'], 401);
        }
        break;

    case 'GET':
        // Проверка авторизации
        jsonResponse(['authenticated' => isAuthenticated()]);
        break;

    case 'DELETE':
        // Выход из системы
        setcookie('admin_session', '', [
            'expires' => time() - 3600,
            'path' => '/'
        ]);
        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Метод не поддерживается'], 405);
}
