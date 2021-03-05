require('dotenv').config()
const seed = require('./db_seed')
const mysql = require('mysql2')
let connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
});

connection.connect(function(err) {
      if (err) throw err;
      connection.query(`CREATE DATABASE ${process.env.DB}`, (err) => {
            if (err) console.log("Database already exist.");
            else{
                  connection.query(`USE ${process.env.DB}`);
                  connection.query(`CREATE TABLE users (
                        id_user int(11) NOT NULL,
                        fname varchar(25) NOT NULL,
                        lname varchar(25) NOT NULL,
                        email varchar(40) NOT NULL UNIQUE,
                        login varchar(25) DEFAULT NULL UNIQUE,
                        password varchar(255) DEFAULT NULL,
                        oauth_id varchar(255) DEFAULT NULL,
                        gender ENUM('M', 'F', 'O', '0') DEFAULT '0',
                        birthdate date DEFAULT NULL,
                        interest ENUM('M', 'F', 'B') DEFAULT 'B',
                        biography varchar(200),
                        rating int(3) DEFAULT 0,
                        status int(1) NOT NULL DEFAULT 0,
                        token varchar(255),
                        expire_token TIMESTAMP DEFAULT NOW(),
                        last_connection TIMESTAMP DEFAULT NOW(),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
                  );`);
                  connection.query(`ALTER TABLE users ADD PRIMARY KEY (id_user);`);
                  connection.query(`ALTER TABLE users MODIFY id_user int(11) NOT NULL AUTO_INCREMENT;`);

                  connection.query(`CREATE TABLE images(
                                    id_image int(11) NOT NULL,
                                    path varchar(255) NOT NULL UNIQUE,
                                    user_id int(11) NOT NULL,
                                    is_profile int(1) DEFAULT 0,
                                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                                    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
                              );`);
                  connection.query(`ALTER TABLE images ADD PRIMARY KEY (id_image);`);
                  connection.query(`ALTER TABLE images MODIFY id_image int(11) NOT NULL AUTO_INCREMENT;`);
                  connection.query(`ALTER TABLE images ADD FOREIGN KEY (user_id) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);

                  connection.query(`CREATE TABLE tags(
                                          id_tag int(11) NOT NULL,
                                          tag varchar(25) NOT NULL UNIQUE,
                                          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                                          updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
                        );`);

                  connection.query(`ALTER TABLE tags ADD PRIMARY KEY (id_tag);`);
                  connection.query(`ALTER TABLE tags MODIFY id_tag int(11) NOT NULL AUTO_INCREMENT;`);

                  connection.query(`CREATE TABLE users_tags(
                                    tag_id int(11) NOT NULL,
                                    user_id int(11) NOT NULL,
                                    created_at TIMESTAMP NOT NULL DEFAULT NOW()
                                    );`)
                  connection.query(`ALTER TABLE users_tags ADD PRIMARY KEY (tag_id, user_id);`);
                  connection.query(`ALTER TABLE users_tags ADD FOREIGN KEY (user_id) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);
                  connection.query(`ALTER TABLE users_tags ADD FOREIGN KEY (tag_id) REFERENCES tags (id_tag) ON DELETE CASCADE ON UPDATE CASCADE;`);
                  
                  connection.query(`CREATE TABLE positions(
                                    id_position int(11) NOT NULL,
                                    city varchar(25),
                                    lat FLOAT( 10, 6 ),
                                    lng FLOAT( 10, 6 ),
                                    user_id int(11) NOT NULL UNIQUE,
                                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                                    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
                                    );`);
                  connection.query(`ALTER TABLE positions ADD PRIMARY KEY (id_position);`);
                  connection.query(`ALTER TABLE positions MODIFY id_position int(11) NOT NULL AUTO_INCREMENT;`);
                  connection.query(`ALTER TABLE positions ADD FOREIGN KEY (user_id) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);

                  connection.query(`CREATE TABLE matches(
                                    first_profile int(11) NOT NULL,
                                    second_profile int(11) NOT NULL,
                                    status int(1) NOT NULL DEFAULT 0,
                                    created_at TIMESTAMP NOT NULL DEFAULT NOW()
                              );`);

                  connection.query(`ALTER TABLE matches ADD PRIMARY KEY (first_profile, second_profile);`)
                  connection.query(`ALTER TABLE matches ADD FOREIGN KEY (first_profile) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);
                  connection.query(`ALTER TABLE matches ADD FOREIGN KEY (second_profile) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);

                  connection.query(`CREATE TABLE likes(
                                    liker_id int(11) NOT NULL,
                                    liked_id int(11) NOT NULL,
                                    created_at TIMESTAMP NOT NULL DEFAULT NOW()
                              );`);

                  connection.query(`ALTER TABLE likes ADD PRIMARY KEY (liker_id, liked_id);`)
                  connection.query(`ALTER TABLE likes ADD FOREIGN KEY (liker_id) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);
                  connection.query(`ALTER TABLE likes ADD FOREIGN KEY (liked_id) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);

                  connection.query(`CREATE TABLE dislikes(
                                    disliker_id int(11) NOT NULL,
                                    disliked_id int(11) NOT NULL,
                                    created_at TIMESTAMP NOT NULL DEFAULT NOW()
                              );`);

                  connection.query(`ALTER TABLE dislikes ADD PRIMARY KEY (disliker_id, disliked_id);`)
                  connection.query(`ALTER TABLE dislikes ADD FOREIGN KEY (disliker_id) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);
                  connection.query(`ALTER TABLE dislikes ADD FOREIGN KEY (disliked_id) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);
                  
                  connection.query(`CREATE TABLE histories(
                        id_history int(11) NOT NULL,
                        visitor_id int(11) NOT NULL,
                        visited_id int(11) NOT NULL,
                        created_at TIMESTAMP NOT NULL DEFAULT NOW()
                  );`);
                  
                  connection.query(`ALTER TABLE histories ADD PRIMARY KEY (id_history);`)
                  connection.query(`ALTER TABLE histories MODIFY id_history int(11) NOT NULL AUTO_INCREMENT;`);
                  connection.query(`ALTER TABLE histories ADD FOREIGN KEY (visitor_id) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);
                  connection.query(`ALTER TABLE histories ADD FOREIGN KEY (visited_id) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);

                  connection.query(`CREATE TABLE notifications(
                        id_notification int(11) NOT NULL,
                        type ENUM('like', 'dislike', 'visit', 'match1', 'match2', 'message') NOT NULL,
                        \`from\` int(11) NOT NULL,
                        \`to\` int (11) NOT NULL,
                        status int(1) NOT NULL DEFAULT 0,
                        created_at TIMESTAMP NOT NULL DEFAULT NOW()
                  );`);

                  connection.query(`ALTER TABLE notifications ADD PRIMARY KEY (id_notification);`)
                  connection.query(`ALTER TABLE notifications MODIFY id_notification int(11) NOT NULL AUTO_INCREMENT;`);
                  connection.query(`ALTER TABLE notifications ADD FOREIGN KEY (\`from\`) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);
                  connection.query(`ALTER TABLE notifications ADD FOREIGN KEY (\`to\`) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);

                  connection.query(`CREATE TABLE messages (
                                    id_message int(11) NOT NULL,
                                    message varchar(255) NOT NULL,
                                    sender_id int(11),
                                    receiver_id int(11),
                                    created_at TIMESTAMP NOT NULL DEFAULT NOW()
                                    );`);

                  connection.query(`ALTER TABLE messages ADD PRIMARY KEY (id_message);`);
                  connection.query(`ALTER TABLE messages MODIFY id_message int(11) NOT NULL AUTO_INCREMENT;`);
                  connection.query(`ALTER TABLE messages ADD FOREIGN KEY (sender_id) REFERENCES users (id_user) ON DELETE SET NULL;`);
                  connection.query(`ALTER TABLE messages ADD FOREIGN KEY (receiver_id) REFERENCES users (id_user) ON DELETE SET NULL;`);

                  connection.query(`CREATE TABLE reports (
                                    reporter_id int(11) NOT NULL,
                                    reported_id int(11) NOT NULL,
                                    created_at TIMESTAMP NOT NULL DEFAULT NOW()
                                    );`);
                  connection.query(`ALTER TABLE reports ADD PRIMARY KEY (reporter_id, reported_id);`);
                  connection.query(`ALTER TABLE reports ADD FOREIGN KEY (reporter_id) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);
                  connection.query(`ALTER TABLE reports ADD FOREIGN KEY (reported_id) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);

                  connection.query(`CREATE TABLE blocks (
                                    blocker_id int(11) NOT NULL,
                                    blocked_id int(11) NOT NULL,
                                    created_at TIMESTAMP NOT NULL DEFAULT NOW()
                                    );`);
                  connection.query(`ALTER TABLE blocks ADD PRIMARY KEY (blocker_id, blocked_id);`);
                  connection.query(`ALTER TABLE blocks ADD FOREIGN KEY (blocker_id) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);
                  connection.query(`ALTER TABLE blocks ADD FOREIGN KEY (blocked_id) REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE;`);
                  console.log("Database created.");
                  seed.DBSeeds(connection);
            }
            connection.end();
      });
});