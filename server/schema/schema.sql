DROP DATABASE IF EXISTS `chatroom`;
CREATE DATABASE `chatroom`;

USE `chatroom`;

CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `profile_picture` VARCHAR(255) DEFAULT 'https://i.sstatic.net/l60Hf.png',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) 
);

CREATE TABLE `contacts` (
  `userId` INT UNSIGNED NOT NULL,
  `contactId` INT UNSIGNED NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  INDEX `fk_contacts_users1_idx` (`userId` ASC),
  INDEX `fk_contacts_users2_idx` (`contactId` ASC),
  CONSTRAINT `fk_contacts_users1`
    FOREIGN KEY (`userId`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_contacts_users2`
    FOREIGN KEY (`contactId`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE,
  UNIQUE INDEX `contact_relation_UNIQUE` (`userId`, `contactId`)
);

CREATE TABLE `chat_rooms` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `userId` INT UNSIGNED NOT NULL,
  `contactId` INT UNSIGNED NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_chat_rooms_contacts1_idx` (`userId`, `contactId` ASC),
  CONSTRAINT `fk_chat_rooms_contacts1`
    FOREIGN KEY (`userId`, `contactId`)
    REFERENCES `contacts` (`userId`, `contactId`)
    ON DELETE CASCADE
);

CREATE TABLE `messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `chatRoomId` INT UNSIGNED NOT NULL,
  `userId` INT UNSIGNED NOT NULL,
  `message` TEXT NOT NULL,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_messages_chat_rooms1_idx` (`chatRoomId` ASC),
  INDEX `fk_messages_users1_idx` (`userId` ASC),
  CONSTRAINT `fk_messages_chat_rooms1`
    FOREIGN KEY (`chatRoomId`)
    REFERENCES `chat_rooms` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_messages_users1`
    FOREIGN KEY (`userId`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
);