DROP DATABASE IF EXISTS `chatroom`;
CREATE DATABASE `chatroom`;

USE `chatroom`;

CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL, -- hashed password
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) 
);

CREATE TABLE `chat_rooms` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`)
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
    ON UPDATE CASCADE,
  CONSTRAINT `fk_messages_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE `contacts` (
  `user_id` INT UNSIGNED NOT NULL,
  `contact_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`, `contact_id`),
  INDEX `fk_contacts_users_idx` (`contact_id` ASC),
  CONSTRAINT `fk_contacts_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_contacts_users1`
    FOREIGN KEY (`contact_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE `user_chats` (
  `user_id` INT UNSIGNED NOT NULL,
  `chat_room_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`, `chat_room_id`),
  INDEX `fk_user_chats_users_idx` (`user_id` ASC),
  INDEX `fk_user_chats_chat_rooms_idx` (`chat_room_id` ASC),
  CONSTRAINT `fk_user_chats_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_user_chats_chat_rooms`
    FOREIGN KEY (`chat_room_id`)
    REFERENCES `chat_rooms` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
