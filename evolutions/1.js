var mysql = require('mysql');
var dbconfig = require('../config/config');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);
connection.query('USE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.user_table + '` ( \
    `id` bigint(20) NOT NULL AUTO_INCREMENT, \
    `name` VARCHAR(100) NOT NULL, \
    `email` VARCHAR(100) NOT NULL, \
    `username` VARCHAR(30) NOT NULL, \
    `password` VARCHAR(60) NOT NULL, \
    `auth_token` varchar(127), \
    `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \
    `modified_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \
    PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `email_UNIQUE` (`email` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8');

connection.query('\
CREATE TABLE `' + dbconfig.data_table + '` ( \
    `id` bigint(20) NOT NULL AUTO_INCREMENT, \
    `name` VARCHAR(100) NOT NULL, \
    `email` VARCHAR(100) NOT NULL, \
    `mobile` VARCHAR(13) NOT NULL, \
    `registration_type` enum ("SELF","CORPORATE","GROUP", "OTHERS") DEFAULT "SELF", \
    `tickets_count` VARCHAR(60) NOT NULL, \
    `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \
    `modified_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \
    PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) \
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8');

connection.query('\
INSERT into `' + dbconfig.user_table + '` (name, email, username, password) VALUES ( \
  "Sachin Sharma", "sachin@sharma.in", "@sachin", "$2a$08$92Sb3y4Vkm4.MLHEvMqIG.6mZZx.tKKHJa1u9MQFqCac.xoirfOfa")');

connection.end();
