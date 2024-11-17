
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL ,
    email VARCHAR(255) NOT NULL ,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

use patient;
INSERT INTO user (username,email,password) VALUES
('Sumit','sumit@gmail.com','Sumit@4563'),
('Rahul','rahul@gmail.com','Rahul@4563'),
('Chandan','chandan@gmail.com','Chandan@4563'),
('Dipti','dipti@gmail.com','Dipti@4563');
