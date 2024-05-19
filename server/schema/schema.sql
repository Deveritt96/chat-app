DROP DATABASE IF EXISTS `chatroom`;
CREATE DATABASE `chatroom`;

USE `chatroom`;

CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL, -- hashed password
  `profile_picture` VARCHAR(255) DEFAULT 'https://i.sstatic.net/l60Hf.png',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) 
);

CREATE TABLE `contacts` (
  `userId` INT UNSIGNED NOT NULL,
  `contactId` INT UNSIGNED NOT NULL,
  `user1Id` INT UNSIGNED NOT NULL,
  `user2Id` INT UNSIGNED NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`user1Id`, `user2Id`),
  INDEX `fk_contacts_users1_idx` (`user1Id` ASC),
  INDEX `fk_contacts_users2_idx` (`user2Id` ASC),
  CONSTRAINT `fk_contacts_users1`
    FOREIGN KEY (`user1Id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_contacts_users2`
    FOREIGN KEY (`user2Id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
);

CREATE TABLE `chat_rooms` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `user1Id` INT UNSIGNED NOT NULL,
  `user2Id` INT UNSIGNED NOT NULL,
   `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_chat_rooms_contacts_idx` (`user1Id` ASC, `user2Id` ASC),
  CONSTRAINT `fk_chat_rooms_contacts`
    FOREIGN KEY (`user1Id`, `user2Id`)
    REFERENCES `contacts` (`user1Id`, `user2Id`)
);

CREATE TABLE `messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `chat_room_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `message` TEXT NOT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_messages_chat_rooms_idx` (`chat_room_id` ASC),
  INDEX `fk_messages_users_idx` (`user_id` ASC),
  CONSTRAINT `fk_messages_chat_rooms`
    FOREIGN KEY (`chat_room_id`)
    REFERENCES `chat_rooms` (`id`)
    ON DELETE CASCADE
);