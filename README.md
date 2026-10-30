# CollegeApp

Единый проект ASP.NET Core + Entity Framework Core + SQL Server.
Модели: Student, Group, Teacher, Subject, Grade; CRUD доступен через API и интерфейс.

## Структура

```text
ADO_NET_Course.sln
CollegeApp/
  CollegeApp.csproj
  Program.cs
  appsettings.json
  Data/CollegeDBContext.cs
  Models/
  Database/CollegeDB.sql
  Properties/launchSettings.json
  wwwroot/
    index.html
    css/style.css
    js/routers.js
    lib/
```

## Запуск

1. Откройте ADO_NET_Course.sln в Visual Studio 2022 с компонентом «ASP.NET и веб-разработка» и .NET 8 SDK.
2. Подключитесь к SQL Server: «Вид → Обозреватель серверов → Подключения данных → Добавить подключение».
3. По умолчанию используется `.\SQLEXPRESS` с проверкой подлинности Windows. Если сервер называется иначе, измените Server в CollegeApp/appsettings.json.
4. На этом сервере выполните CollegeApp/Database/CollegeDB.sql один раз для новой базы CollegeDB.
5. Нажмите F5. Браузер откроется автоматически.

Код построен по структуре lesson_22 исходного курса; дополнительные модели соответствуют заданию последнего урока. Предыдущие версии и учебные папки доступны в истории Git.
