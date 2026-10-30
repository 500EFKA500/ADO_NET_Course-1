# CollegeApp

Единый проект по последнему уроку: студенты, группы, преподаватели, предметы и оценки. ASP.NET Core, EF Core, SQL Server, HTML/CSS/JavaScript.

Откройте ../ADO_NET_Course.sln в Visual Studio 2022 с ASP.NET и .NET 8. Выполните Database/CollegeDB.sql для новой базы, настройте ConnectionStrings:DefaultConnection в appsettings.json и нажмите F5.

wwwroot/css — стили, wwwroot/js — клиентская логика, wwwroot/lib — папка для дополнительных библиотек.

## SQL Server

По умолчанию подключение к `.\SQLEXPRESS` с проверкой подлинности Windows. Если экземпляр называется иначе, замените Server в appsettings.json на имя вашего сервера. SQL Server должен быть установлен и запущен.

В Visual Studio: Вид → Обозреватель серверов → Подключения данных → Добавить подключение → Microsoft SQL Server. Имя сервера: `.\SQLEXPRESS`, проверка подлинности Windows. Для создания базы выполните Database/CollegeDB.sql на этом сервере. При наличии SQL Server Data Tools также доступен Вид → Обозреватель объектов SQL Server → Добавить SQL Server.
