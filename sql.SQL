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
ALTER TABLE meminform
ADD COLUMN sodonhang INT DEFAULT 0;
            -- $getdata['status'] = $_POST['status'];
            -- $getdata['message'] = $_POST['message'];
            -- $getdata['request_id'] = $_POST['request_id'];   /// Mã giao dịch của bạn
            -- $getdata['trans_id'] = $_POST['trans_id'];   /// Mã giao dịch của website ppay.vn
            -- $getdata['declared_value'] = $_POST['declared_value'];  /// Mệnh giá mà bạn khai báo lên
            -- $getdata['value'] = $_POST['value'];  /// Mệnh giá thực tế của thẻ
            -- $getdata['amount'] = $_POST['amount'];   /// Số tiền bạn nhận về (VND)
            -- $getdata['code'] = $_POST['code'];   /// Mã nạp
            -- $getdata['serial'] = $_POST['serial'];  /// Serial thẻ
            -- $getdata['telco'] = $_POST['telco'];   /// Nhà mạng
CREATE TABLE callback(
    ID int NOT NULL AUTO_INCREMENT,
    statusCard int,
    messageCard varchar(255),
    requestId varchar(255),
    transId VARCHAR(255),
    declaredValue INT,
    realValue INT,
    amount INT,
    codeCard VARCHAR(255),
    serialCard VARCHAR(255),
    telco VARCHAR(255),
    createdDay DATE DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (ID)
)

CREATE TABLE history(
    ID int NOT NULL AUTO_INCREMENT,
    idUser INT,
    statusCard int,
    messageCard varchar(255) DEFAULT "Đang Xử Lý",
    requestId varchar(255),
    realValue INT,
    amount INT,
    codeCard VARCHAR(255),
    serialCard VARCHAR(255),
    telco VARCHAR(255),
    createdDay DATE DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (ID)
)



-- CURRENT_TIMESTAMP()	
CREATE TABLE codePixelArt(
    ID int NOT NULL AUTO_INCREMENT,
    noType INT,
    code varchar(255),
    price INT,
    office VARCHAR(255),
    PRIMARY KEY (ID)
)

CREATE TABLE thongbao(
    ID int NOT NULL AUTO_INCREMENT,
    class varchar(255),
    content VARCHAR(255),
    PRIMARY KEY (ID)
)

INSERT INTO memInform(username,pass) VALUES ("caoky9x","80705e387c6c187d9788857e0931fb8d")
INSERT INTO codePixelArt(noType, code, price) VALUE (64,"64px",5000)
INSERT INTO codePixelArt(noType, code, price) VALUE (128,"128px",15000)
INSERT INTO codePixelArt(noType, code, price) VALUE (192,"192px",45000)
INSERT INTO codePixelArt(noType, code, price) VALUE (256,"256px",100000)



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
    createdDay DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ID)
)
