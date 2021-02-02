
exports.DBSeeds = (connection) => {
    connection.connect(function(err) {
        if (err) throw err;
    
        connection.query(`INSERT INTO users (id_user, fname, lname, email, login, password, gender, birthdate, interest, biography, rating, status, token, expire_token)
                            VALUES
                                (10,'Emmie','Nicolas','emmie.nicolas@example.com','beautifulbird','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1990-11-09','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,2,NULL,NULL),
                                (11,'Karl','Johnson','karl.johnson@example.com','bigpeacock','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1985-11-30','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',40,2,NULL,NULL),
                                (12,'Finn','Morris','finn.morris@example.com','whitelion','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1997-12-02','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',20,2,NULL,NULL),
                                (13,'Romane','Perez','romane.perez@example.com','brownelephant','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1995-04-30','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',10,2,NULL,NULL),
                                (14,'Lucia','Hammeren','lucia.hammeren@example.com','tinykoala','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1974-06-18','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',60,2,NULL,NULL),
                                (15,'Romane','Renaud','romane.renaud@example.com','silvercat','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1960-11-09','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,2,NULL,NULL),
                                (16,'Melike','Arslanoğlu','melike.arslanoglu@example.com','tinymeercat','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1997-12-08','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,2,NULL,NULL),
                                (17,'Regina','Daniels','regina.daniels@example.com','redtiger','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1987-09-18','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,2,NULL,NULL),
                                (18,'Louis','Jones','louis.jones@example.com','ticklishbear','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1991-02-08','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,2,NULL,NULL),
                                (19,'Don','George','don.george@example.com','happyfish','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1971-10-13','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,2,NULL,NULL),
                                (20,'Frank Michael','Reiser','frank-michael.reiser@example.com','orangecat','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1994-01-09','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',30,2,NULL,NULL),
                                (21,'Gabriel','Molina','gabriel.molina@example.com','smallelephant','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1998-03-03','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,2,NULL,NULL),
                                (22,'علیرضا','احمدی','aalyrd.hmdy@example.com','blackelephant','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1984-09-18','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',0,2,NULL,NULL),
                                (23,'Cristobal','Santana','cristobal.santana@example.com','bluebear793','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1978-03-31','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',70,2,NULL,NULL),
                                (24,'Alyssa','Elliott','alyssa.elliott@example.com','whiteladybug240','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1991-07-18','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,2,NULL,NULL),
                                (25,'Nikolaj','Nielsen','nikolaj.nielsen@example.com','sadbird','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1979-10-19','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,2,NULL,NULL),
                                (26,'Kristina','Silva','kristina.silva@example.com','redbird','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1990-02-02','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,2,NULL,NULL)
                        ;`);
        connection.query(`INSERT INTO images (id_image, path, user_id, is_profile)
                            VALUES
                                (1,'10160353784420246654605f940bb4142d3.jpeg',10,0),
                                (2,'11160319980611542850525f8ee33ea3314.jpg',11,0),
                                (3,'12160353249516390834335f93f6cf30fdc.jpeg',12,0),
                                (4,'13160302372715245450545f8c336f1d83c.jpeg',13,0),
                                (5,'14160310521217140433995f8d71bce32a5.jpg',14,0),
                                (6,'15160416703419341585235f9da57a5f3e5.jpeg',15,0),
                                (7,'16160421620718909475755f9e658fe754f.jpeg',16,0),
                                (8,'1716035334557054355655f93fa8f6ee91.jpg',17,0),
                                (9,'18160439132116376366345fa111994d698.jpeg',18,0),
                                (10,'19160482369118991522695fa7aa8b34a67.jpeg',19,0),
                                (11,'2016031871212582340355f8eb1b19d420.jpeg',20,0),
                                (12,'2116031981683365735855f8edcd859432.jpeg',21,0),
                                (13,'2216035334557054355655f93fa8f6ee91.jpeg',22,0),
                                (14,'2316038920828908163635f9973728cad3.png',23,0),
                                (15,'2416032001661453715235f8ee4a6907f1.jpg',24,0),
                                (16,'2516041694073089546105f9daebf4dad5.jpg',25,0),
                                (17,'2616035293514762759255f93ea87517c2.jpeg',26,0)
                        ;`);
        
        connection.query(`INSERT INTO positions (id_position, city, lat, lng, user_id)
                            VALUES
                                (2, 'Lower Hutt,New Zealand', -41.2575588,174.897375, 10),
                                (3, 'Melilla,Spain', 35.286282, -2.9532813, 11),
                                (4, 'Tangier,Morocco', 35.3636925,-5.3913917, 12),
                                (5, 'Kenitra,Morocco', 34.2668966,-6.6178894, 13),
                                (6, 'Fes,Morocco', 34.0239579,-5.0367596, 14),
                                (7, 'Paris,France', 48.8588536,2.3120407, 15),
                                (8, 'Lower Hutt,New Zealand',-41.253167,174.9271133, 16),
                                (9, 'Reims,France', 49.2535458,4.0200694, 17),
                                (10, 'Casablanca,Morocco', 33.5722826,-7.6220117, 18),
                                (11, 'Khouribga,Morocco', 32.8808105,-6.934803, 19),
                                (12, 'Oued Zem,Morocco', 32.8604435,-6.5785944, 20),
                                (13, 'Khouribga,Morocco', 32.8829664,-6.9093198, 21),
                                (14, 'Khouribga,Morocco', 32.8829664,-6.9093198, 22),
                                (15, 'Khouribga,Morocco', 32.8895364,-6.9396421, 23),
                                (16, 'Khouribga,Morocco', 32.8543895,-6.8850804, 24),
                                (17, 'Khouribga,Morocco', 32.8751717,-6.9023538, 25),
                                (18, 'Casablanca,Morocco', 33.5700651,-7.6447744, 26)
                        ;`);
        connection.query(`INSERT IGNORE INTO tags (id_tag, tag)
                            VALUES           
                                (1, '#shopping'),
                                (2,'#travel'),
                                (3, '#dating'),
                                (4, '#date'),
                                (5, '#matcha'),
                                (6, '#surf'),
                                (7, '#open_mind'),
                                (8, '#programming'),
                                (9, '#sports'),
                                (10, '#hello_World'),
                                (11, '#geek'),
                                (12, '#high_tech'),
                                (13, '#fishing'),
                                (14, '#test'),
                                (15, '#cats_lover'),
                                (16, '#serious_dating'),
                                (17, '#tiktok'),
                                (18, '#safari'),
                                (19, '#animals'),
                                (20, '#dogs'),
                                (21, '#cats'),
                                (22, '#funny'),
                                (23, '#sex'),
                                (24, '#yoga'),
                                (25, '#fitness'),
                                (26, '#football'),
                                (27, '#girls'),
                                (28, '#vegan'),
                                (29, '#cooking'),
                                (30, '#love')
                        ;`); 
        connection.query(`INSERT INTO users_tags (tag_id, user_id) 
                            VALUES
                                (1,10),(2,10),(3,10),(30,10),
                                (29,11),(2,11),(28,11),
                                (27,12),(2,12),(26,12),(25,12),(24,12),
                                (27,13),(29,13),(30,13),
                                (2,14),(23,14),(22,14),
                                (21,15),(20,15),(19,15),(18,15),
                                (17,16),(30,16),(16,16),
                                (19,17),(18,17),(2,17),(15,17),
                                (14,18),(17,18),(30,18),(16,18),
                                (13,19),(29,19),(30,19),(16,19),
                                (12,20),(11,20),(23,20),(10,20),
                                (14,21),(17,21),(30,21),(16,21),
                                (26,22),(9,22),(30,22),
                                (14,23),(8,23),(10,23),
                                (22,24),(30,24),(23,24),(2,24),(7,24),(8,24),(11,24),(6,24),
                                (17,25),(5,25),(4,25),(7,25),(6,25),
                                (5,26) ;`)
        console.log("database seeding success");
        connection.end();
    })
}

