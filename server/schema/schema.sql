DROP DATABASE IF EXISTS `chatroom`;
CREATE DATABASE `chatroom`;

CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL, -- hashed password
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) 
);

CREATE TABLE `messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `message` TEXT NOT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_messages_users_idx` (`user_id` ASC),
  CONSTRAINT `fk_messages_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE `contacts` (
  `user_id` INT UNSIGNED NOT NULL,
  `contact_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`, `contact_id`),
  INDEX `fk_contacts_users1_idx` (`contact_id` ASC),
  CONSTRAINT `fk_contacts_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_contacts_users1`
    FOREIGN KEY (`contact_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);