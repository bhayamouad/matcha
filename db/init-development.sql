CREATE USER 'tirach'@'%' IDENTIFIED BY 'rach';

grant ALL PRIVILEGES ON *.* TO 'tirach'@'%';

CREATE DATABASE IF NOT EXISTS `matcha_db`;

USE `matcha_db`;

CREATE TABLE `users` (
                        `id_user` int(11) NOT NULL,
                        `f_name` varchar(40) NOT NULL,
                        `l_name` varchar(40) NOT NULL,
                        `email` varchar(255) NOT NULL UNIQUE,
                        `login` varchar(25) NOT NULL,
                        `password` varchar(255) NOT NULL,
                        `gender` ENUM('M', 'F', '0') DEFAULT '0',
                        `interest` ENUM('M', 'F', 'B', '0') DEFAULT '0',
                        `biography` varchar(512),
                        `rating` int(3) DEFAULT 0,
                        `status` int(1) NOT NULL DEFAULT 0,
                        `token` varchar(255) NOT NULL,
                        `profile` varchar(255),
                        `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
                        `updated_at` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
                    );
ALTER TABLE `users` ADD PRIMARY KEY (`id_user`);
ALTER TABLE `users` MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT;

CREATE TABLE `images`(
                        `id_image` int(11) NOT NULL,
                        `path` varchar(255) NOT NULL UNIQUE,
                        `user_id` int(11) NOT NULL,
                        `is_profile` int(1) DEFAULT 0,
                        `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
                        `updated_at` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
                    );
ALTER TABLE `images` ADD PRIMARY KEY (`id_image`);
ALTER TABLE `images` MODIFY `id_image` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `images` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE `tags`(
                        `id_tag` int(11) NOT NULL,
                        `tag` varchar(20) NOT NULL,
                        `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
                        `updated_at` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
                );

ALTER TABLE `tags` ADD PRIMARY KEY (`id_tag`);
ALTER TABLE `tags` MODIFY `id_tag` int(11) NOT NULL AUTO_INCREMENT;

CREATE TABLE `users_tags`(
                            `user_id` int(11) NOT NULL,
                            `tag_id` int(11) NOT NULL,
                            `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
                            `updated_at` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
                        );
ALTER TABLE `users_tags` ADD PRIMARY KEY (`user_id`,`tag_id`);
ALTER TABLE `users_tags` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `users_tags` ADD FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id_tag`) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE `positions` (
                            `id_position` int(11) NOT NULL,
                            `city` varchar(20),
                            `lat` FLOAT( 10, 6 ),
                            `lng` FLOAT( 10, 6 ),
                            `user_id` int(11) NOT NULL,
                            `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
                            `updated_at` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
                        );
ALTER TABLE `positions` ADD PRIMARY KEY (`id_position`);
ALTER TABLE `positions` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE `matchs` (
                        `id_match` int(11) NOT NULL,
                        `first_profile` int(11) NOT NULL,
                        `second_profile` int(11) NOT NULL,
                        `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
                        `updated_at` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
                    );

ALTER TABLE `matchs` ADD PRIMARY KEY (`id_match`);
ALTER TABLE `matchs` ADD FOREIGN KEY (`first_profile`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `matchs` ADD FOREIGN KEY (`second_profile`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE `messages` (
                            `id_message` int(11) NOT NULL,
                            `message` varchar(255) NOT NULL,
                            `sender_id` int(11),
                            `receiver_id` int(11),
                            `created_at` TIMESTAMP NOT NULL DEFAULT NOW()
                    );

ALTER TABLE `messages` ADD PRIMARY KEY (`id_message`);
ALTER TABLE `messages` ADD FOREIGN KEY (`sender_id`) REFERENCES `users` (`id_user`) ON DELETE SET NULL;
ALTER TABLE `messages` ADD FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id_user`) ON DELETE SET NULL;

CREATE TABLE `reports` (
                            `id_report` int(11) NOT NULL,
                            `reason` varchar(50) NOT NULL,
                            `reporter_id` int(11) NOT NULL,
                            `reported_id` int(11) NOT NULL,
                            `created_at` TIMESTAMP NOT NULL DEFAULT NOW()
                    );
ALTER TABLE `reports` ADD PRIMARY KEY (`id_report`);
ALTER TABLE `reports` ADD FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `reports` ADD FOREIGN KEY (`reported_id`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE `blocks` (
                            `id_block` int(11) NOT NULL,
                            `blocker_id` int(11) NOT NULL,
                            `blocked_id` int(11) NOT NULL,
                            `created_at` TIMESTAMP NOT NULL DEFAULT NOW()
                    );
ALTER TABLE `blocks` ADD PRIMARY KEY (`id_block`);
ALTER TABLE `blocks` ADD FOREIGN KEY (`blocker_id`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `blocks` ADD FOREIGN KEY (`blocked_id`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;