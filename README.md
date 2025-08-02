# NutritionEntity ADHD Backend

## Деплой
Для генерации контейнера с базой данных запустить:

```bash 
docker build -t database:latest -f db/Dockerfile . --no-cache
```

Затем:

```bash 
docker run -P --env-file .env database:latest
```