<?php
require_once __DIR__ . '/config.php';

// Получаем коллекцию из URL параметра
$collection = $_GET['collection'] ?? '';

// Проверка коллекции
if (!in_array($collection, COLLECTIONS)) {
    jsonResponse(['error' => 'Коллекция не найдена'], 404);
}

// Путь к файлу данных
$filePath = DATA_DIR . '/' . $collection . '.json';

// Функция чтения данных
function readData(string $filePath, string $collection): mixed {
    if (!file_exists($filePath)) {
        return $collection === 'settings' ? new stdClass() : [];
    }
    $content = file_get_contents($filePath);
    return json_decode($content, true) ?? ($collection === 'settings' ? [] : []);
}

// Функция записи данных
function writeData(string $filePath, mixed $data): void {
    $dir = dirname($filePath);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents($filePath, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Получить все данные коллекции (публичный доступ)
        $data = readData($filePath, $collection);
        jsonResponse($data);
        break;

    case 'POST':
        // Добавить новый элемент
        if (!isAuthenticated()) {
            jsonResponse(['error' => 'Не авторизован'], 401);
        }

        $newItem = getJsonBody();
        $data = readData($filePath, $collection);

        if ($collection === 'settings') {
            // Settings - это объект, не массив
            $data = array_merge($data, $newItem);
            writeData($filePath, $data);
            jsonResponse(['success' => true]);
        } else {
            // Генерируем ID для нового элемента
            $maxId = 0;
            foreach ($data as $item) {
                $id = (int)($item['id'] ?? 0);
                if ($id > $maxId) $maxId = $id;
            }

            $newItem['id'] = (string)($maxId + 1);
            $data[] = $newItem;
            writeData($filePath, $data);

            jsonResponse(['success' => true, 'item' => $newItem]);
        }
        break;

    case 'PUT':
        // Обновить элемент
        if (!isAuthenticated()) {
            jsonResponse(['error' => 'Не авторизован'], 401);
        }

        $updatedItem = getJsonBody();

        if ($collection === 'settings') {
            $data = readData($filePath, $collection);
            $data = array_merge($data, $updatedItem);
            writeData($filePath, $data);
            jsonResponse(['success' => true]);
        } else {
            $data = readData($filePath, $collection);
            $found = false;

            foreach ($data as $index => $item) {
                if ($item['id'] === $updatedItem['id']) {
                    $data[$index] = array_merge($item, $updatedItem);
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                jsonResponse(['error' => 'Элемент не найден'], 404);
            }

            writeData($filePath, $data);
            jsonResponse(['success' => true, 'item' => $data[$index]]);
        }
        break;

    case 'DELETE':
        // Удалить элемент
        if (!isAuthenticated()) {
            jsonResponse(['error' => 'Не авторизован'], 401);
        }

        $id = $_GET['id'] ?? '';

        if (empty($id)) {
            jsonResponse(['error' => 'ID не указан'], 400);
        }

        $data = readData($filePath, $collection);
        $originalCount = count($data);

        $data = array_values(array_filter($data, function($item) use ($id) {
            return $item['id'] !== $id;
        }));

        if (count($data) === $originalCount) {
            jsonResponse(['error' => 'Элемент не найден'], 404);
        }

        writeData($filePath, $data);
        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Метод не поддерживается'], 405);
}
