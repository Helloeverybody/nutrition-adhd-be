# NutritionEntity ADHD Backend

### Локально

- Запуск базы данных (всегда контейнером):

  ```bash 
  docker run -p 5432:5432 --env-file docker/.env.local postgres:latest
  ```

- Запуск бэка локально

  ```bash 
  npm run start:dev
  ```

- Развернуть бд с бэком в контейнерах:

  ```bash 
  docker compose -f docker/compose.dev.yaml up --build
  ```

### Деплой
- Для сборки образа на прод:

  ```bash 
  docker compose -f docker/compose.prod.yaml build --no-cache
  ```

- Для сборки образа на стейдж:

  ```bash 
  docker compose -f docker/compose.stage.yaml build --no-cache
  ```

- Отправить образ в DockerHub:

  ```bash 
  docker push helloeverybody/nutrition-be
  ```