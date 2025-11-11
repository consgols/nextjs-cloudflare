DROP TABLE IF EXISTS Users;
CREATE TABLE IF NOT EXISTS Users (UserID INTEGER PRIMARY KEY AUTOINCREMENT, UserEmail TEXT,  UserPassword TEXT);
INSERT INTO Users (UserEmail, UserPassword) VALUES ('sample@sample.com', '123');
