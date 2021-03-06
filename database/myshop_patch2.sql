﻿USE myshop;
ALTER TABLE customer ADD COLUMN status TINYINT NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS cust_type
(
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  created DATETIME NOT NULL,
  modified DATETIME NOT NULL,
  user_id INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(user_id) REFERENCES user(id)
) ENGINE=INNODB DEFAULT CHARSET=UTF8 AUTO_INCREMENT=1;
INSERT INTO cust_type(name,created,modified,user_id) VALUES('其他',now(),now(),100000);
ALTER TABLE customer change type type_id INT UNSIGNED NOT NULL DEFAULT 0;
ALTER TABLE customer ADD CONSTRAINT fk_type_id FOREIGN KEY (type_id) REFERENCES cust_type(id);