CREATE DATABASE devmini;

CREATE TABLE memInform(
    ID int NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    pass varchar(255) NOT NULL,
    office varchar(255),
    uidMW int,
    nameMW varchar(255),
    avatarMW varchar(255),
    lastLogin DATE,
    coinVIP int DEFAULT 0,
    coin int DEFAULT 0,
    totalCoinVIP int DEFAULT 0,
    report int DEFAULT 0,
    createdDay DATE DEFAULT CURRENT_DATE(),
    PRIMARY KEY (ID)
)

INSERT INTO memInform(username,pass) VALUES ("caoky9x","80705e387c6c187d9788857e0931fb8d")