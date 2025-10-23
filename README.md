# NutritionEntity ADHD Backend

Затем:
```bash 
docker run -p 5432:5432 --env-file .env.dev postgres:latest
```

Для запуска бэка:

```bash 
docker compose -f docker/compose.yaml up --build
```

Для сборки образа на прод:

```bash 
docker compose -f docker/compose.yaml build --no-cache
```

Чтобы отправить все в DockerHub:

```bash 
docker push helloeverybody/nutrition-be
```