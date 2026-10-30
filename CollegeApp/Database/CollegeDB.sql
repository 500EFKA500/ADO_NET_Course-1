IF DB_ID(N'CollegeDB') IS NULL CREATE DATABASE CollegeDB;
GO
USE CollegeDB;
GO
CREATE TABLE Groups(GroupId int IDENTITY PRIMARY KEY, GroupName nvarchar(20) NOT NULL);
CREATE TABLE Students(StudentId int IDENTITY PRIMARY KEY, FirstName nvarchar(50) NOT NULL, LastName nvarchar(50) NOT NULL, Age int NOT NULL CHECK(Age BETWEEN 1 AND 120), GroupId int NOT NULL REFERENCES Groups(GroupId));
CREATE TABLE Teachers(TeacherId int IDENTITY PRIMARY KEY, FirstName nvarchar(max) NOT NULL, LastName nvarchar(max) NOT NULL);
CREATE TABLE Subjects(SubjectId int IDENTITY PRIMARY KEY, SubjectName nvarchar(max) NOT NULL, TeacherId int NOT NULL REFERENCES Teachers(TeacherId));
CREATE TABLE Grades(GradeId int IDENTITY PRIMARY KEY, StudentId int NOT NULL REFERENCES Students(StudentId), SubjectId int NOT NULL REFERENCES Subjects(SubjectId), Value int NOT NULL CHECK(Value BETWEEN 1 AND 5));
INSERT INTO Groups(GroupName) VALUES(N'ADO-1');
