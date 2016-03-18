create database if not exists myshop;
use myshop;
create table if not exists user
(
  id int(10) unsigned not null auto_increment,
  name varchar(39) not null unique,
  nickname varchar(50),
  company varchar(60),
  email varchar(100) not null unique,
  premail varchar(100),
  password varchar(128) not null,
  verified int unsigned not null default 0,
  privilege int unsigned not null default 0,
  level int not null default 0,
  signup datetime not null,
  signin datetime not null,
  last_signin datetime,
  ipaddr bigint not null,
  last_ipaddr bigint unsigned,
  lang varchar(8) not null default 'en-us',
  verify_uuid varchar(40) not null unique,
  verify_expire datetime not null,
  recommander int(10) unsigned,
  primary key(id)
) engine=innodb default charset=utf8 auto_increment=100000;
create table if not exists prod_type
(
  id int unsigned not null auto_increment,
  name character varying(50) not null,
  created datetime not null,
  modified datetime not null,
  user_id int(10) unsigned not null,
  primary key(id),
  foreign key(user_id) references user(id)
) engine=innodb default charset=utf8 auto_increment=1;
create table if not exists prod_unit
(
  id int unsigned not null auto_increment,
  name character varying(50) not null,
  created datetime not null,
  modified datetime not null,
  user_id int(10) unsigned not null,
  primary key(id),
  foreign key(user_id) references user(id)
) engine=innodb default charset=utf8 auto_increment=1;
create table if not exists product
(
  id int(10) unsigned not null auto_increment,
  code varchar(13),
  name character varying(50) not null,
  sname varchar(15),
  type_id int unsigned,
  unit_id int unsigned,
  price float not null,
  def_quantity int unsigned,
  txn_quantity bigint not null default 0,
  status int not null default 0,
  created datetime not null,
  modified datetime not null,
  user_id int(10) unsigned not null,
  primary key(id),
  foreign key(user_id) references user(id),
  foreign key(type_id) references prod_type(id),
  foreign key(unit_id) references prod_unit(id)
) engine=innodb default charset=utf8 auto_increment=100000;
create table if not exists customer
(
  id int(10) unsigned not null auto_increment,
  type tinyint not null default 1,
  name character varying(50) not null,
  mobile varchar(11),
  id_num varchar(18),
  email varchar(100),
  addr varchar(200),
  txn_count int not null default 0,
  created datetime not null,
  modified datetime not null,
  user_id int(10) unsigned not null,
  primary key(id), 
  foreign key(user_id) references user(id)
) engine=innodb default charset=utf8 auto_increment=100000;
create table if not exists txn_journal
(
  id int(10) unsigned not null auto_increment,
  sum_amt float not null,
  cust_id int(10) unsigned null,
  remark varchar(140) not null,
  created datetime not null,
  user_id int(10) unsigned not null,
  txn_detail text not null,
  primary key(id), 
  foreign key(user_id) references user(id),
  foreign key(cust_id) references customer(id)
) engine=innodb default charset=utf8 auto_increment=1000;
create table if not exists txn_detail
(
  id int(10) unsigned not null auto_increment,
  txn_id int(10) unsigned not null,
  prod_id int(10) unsigned not null,
  price float not null,
  quantity bigint unsigned not null,
  primary key(id), 
  foreign key(txn_id) references txn_journal(id),
  foreign key(prod_id) references product(id)
) engine=innodb default charset=utf8 auto_increment=1000;