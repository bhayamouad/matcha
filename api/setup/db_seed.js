
exports.DBSeeds = (connection) => {
    connection.connect(function(err) {
        if (err) throw err;
    
        connection.query(`INSERT INTO users (id_user, fname, lname, email, login, password, gender, birthdate, interest, biography, rating, status, token, expire_token)
                            VALUES
                                (10,'Emmie','Nicolas','emmie.nicolas@example.com','beautifulbird','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1990-11-09','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (11,'Karl','Johnson','karl.johnson@example.com','bigpeacock','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1985-11-30','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',40,3,NULL,NULL),
                                (12,'Finn','Morris','finn.morris@example.com','whitelion','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1997-12-02','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',20,3,NULL,NULL),
                                (13,'Romane','Perez','romane.perez@example.com','brownelephant','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1995-04-30','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',10,3,NULL,NULL),
                                (14,'Lucia','Hammeren','lucia.hammeren@example.com','tinykoala','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1974-06-18','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',60,3,NULL,NULL),
                                (15,'Romane','Renaud','romane.renaud@example.com','silvercat','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1960-11-09','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (16,'Melike','Arslanoğlu','melike.arslanoglu@example.com','tinymeercat','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1997-12-08','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (17,'Regina','Daniels','regina.daniels@example.com','redtiger','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1987-09-18','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (18,'Louis','Jones','louis.jones@example.com','ticklishbear','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1991-02-08','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (19,'Don','George','don.george@example.com','happyfish','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1971-10-13','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (20,'Frank Michael','Reiser','frank-michael.reiser@example.com','orangecat','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1994-01-09','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',30,3,NULL,NULL),
                                (21,'Gabriel','Molina','gabriel.molina@example.com','smallelephant','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1998-03-03','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (22,'علیرضا','احمدی','aalyrd.hmdy@example.com','blackelephant','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1984-09-18','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',0,3,NULL,NULL),
                                (23,'Cristobal','Santana','cristobal.santana@example.com','bluebear','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1978-03-31','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',70,3,NULL,NULL),
                                (24,'Alyssa','Elliott','alyssa.elliott@example.com','whiteladybug','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1991-07-18','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (25,'Nikolaj','Nielsen','nikolaj.nielsen@example.com','sadbird','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1979-10-19','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (26,'Kristina','Silva','kristina.silva@example.com','redbird','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1990-02-02','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (27,'Anas','Benani','abenani@example.com','abenani','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1997-08-27','B',"Hello I am Anas and I'm looking for both gender lets keep in touch",70,3,NULL,NULL),
                                (28,'Mouad','Elazami','moelaza@example.com','moelaza','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1997-11-30','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',0,3,NULL,NULL),
                                (29,'Sarah','Ellam','sarrahellam@example.com','kherboucha','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1999-11-02','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',20,3,NULL,NULL),
                                (30,'Samira','Ansari','Ansari@example.com','babylover','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1995-04-30','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',10,3,NULL,NULL),
                                (31,'Sanae','Said','ssanae@example.com','ssanae','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1974-06-18','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',60,3,NULL,NULL),
                                (32,'Hassan','Seffiani','hseffian@example.com','hseffian','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1998-11-09','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',60,3,NULL,NULL),
                                (33,'Soukaina','Safir','soukaina.safir@example.com','soukita','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1994-12-18','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (34,'Rachel','Armstrong','rachel.armstrong@example.com','cutelady','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1989-09-18','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (35,'Anastasia','Roux','anastasia.roux@example.com','lisboa','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1991-02-08','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (36,'Juliana','lucas','juliana.lucas@example.com','happygirl','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1981-10-13','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (37,'Maria','Weaver','maria.weaver@example.com','mariaclara','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1994-01-09','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',30,3,NULL,NULL),
                                (38,'Gabriel','Santana','gabriel.santana@example.com','masterclass','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1988-03-03','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (39,'احمد','سارا','sara.ahmed@example.com','pinkrose','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1999-09-18','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',0,3,NULL,NULL),
                                (40,'Sofia','Madani','sofia.madani@example.com','bluespher','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','2000-03-31','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',70,3,NULL,NULL),
                                (41,'آیلین','حسینی','alyn.hssini@example.com','whiterose','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1991-07-18','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (42,'Axelle','Mathieu','axelle.mathieu@example.com','axellemat','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1989-10-19','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL),
                                (43,'Kristina','Mathieu','kristina.mathieu@example.com','redwoman','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1990-02-02','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',50,3,NULL,NULL)
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
                                (17,'2616035293514762759255f93ea87517c2.jpeg',26,0),
                                (18,'279fa6e69f9d7dcd86989c8254f1483be8.jpg',27,0),
                                (19,'289fa6e69f9d7dcd86989c8254f1483be8.jpg',28,0),
                                (20,'29fa6e69f9d7dcd86989c8254f1483be8.jpg',29,0),
                                (21,'309fa6e69f9d7dcd86989c8254f1483be8.jpg',30,0),
                                (22,'319fa6e69f9d7dcd86989c8254f1483be8.jpg',31,0),
                                (23,'329fa6e69f9d7dcd86989c8254f1483be8.jpg',32,0),
                                (24,'339fa6e69f9d7dcd86989c8254f1483be8.jpg',33,0),
                                (25,'349fa6e69f9d7dcd86989c8254f1483be8.jpg',34,0),
                                (26,'359fa6e69f9d7dcd86989c8254f1483be8.jpg',35,0),
                                (27,'3619fa6e69f9d7dcd86989c8254f1483be8.jpeg',36,0),
                                (35,'3629fa6e69f9d7dcd86989c8254f1483be8.jpeg',36,1),
                                (36,'363fa6e69f9d7dcd86989c8254f1483be8.jpeg',36,2),
                                (37,'364fa6e69f9d7dcd86989c8254f1483be8.jpeg',36,3),
                                (28,'379fa6e69f9d7dcd86989c8254f1483be8.jpeg',37,0),
                                (29,'389fa6e69f9d7dcd86989c8254f1483be8.jpg',38,0),
                                (30,'39fa6e69f9d7dcd86989c8254f1483be8.jpg',39,0),
                                (31,'409fa6e69f9d7dcd86989c8254f1483be8.jpg',40,0),
                                (32,'419fa6e69f9d7dcd86989c8254f1483be8.jpg',41,0),
                                (33,'429fa6e69f9d7dcd86989c8254f1483be8.jpg',42,0),
                                (34,'439fa6e69f9d7dcd86989c8254f1483be8.jpg',43,0)
                        ;`);
        
        connection.query(`INSERT INTO positions (id_position, city, lat, lng, user_id)
                            VALUES
                            (2, 'Lower Hutt,New Zealand', -41.2575588, 174.897375, 10),
                            (3, 'Melilla,Spain', 35.286282, -2.9532813, 11),
                            (4, 'Tangier,Morocco', 35.3636925, -5.3913917, 12),
                            (5, 'Kenitra,Morocco', 34.2668966, -6.6178894, 13),
                            (6, 'Fes,Morocco', 34.0239579, -5.0367596, 14),
                            (7, 'Paris,France', 48.8588536, 2.3120407, 15),
                            (8, 'Lower Hutt,New Zealand', -41.253167,174.9271133, 16),
                            (9, 'Reims,France', 49.2535458, 4.0200694, 17),
                            (10, 'Casablanca,Morocco', 33.5722826, -7.6220117, 18),
                            (11, 'Khouribga,Morocco', 32.8808105, -6.934803, 19),
                            (12, 'Oued Zem,Morocco', 32.8604435, -6.5785944, 20),
                            (13, 'Khouribga,Morocco', 32.8829664, -6.9093198, 21),
                            (14, 'Khouribga,Morocco', 32.8829664, -6.9093198, 22),
                            (15, 'Khouribga,Morocco', 32.8895364, -6.9396421, 23),
                            (16, 'Khouribga,Morocco', 32.8543895, -6.8850804, 24),
                            (17, 'Khouribga,Morocco', 32.8751717, -6.9023538, 25),
                            (18, 'Casablanca,Morocco', 33.5700651, -7.6447744, 26),
                            (1, 'Khouribga,Morocco', 32.8781141, -6.8977887, 27),
                            (19, 'Khouribga,Morocco', 32.8845609, -6.9013861, 28),
                            (20, 'Khouribga,Morocco', 32.8845609, -6.9013861, 32),
                            (21, 'Boujniba,Morocco', 32.898073, -6.7844009, 29),
                            (22, 'Oued Zem,Morocco', 32.862048, -6.579897, 30),
                            (23, 'Bouskoura,Morocco', 33.472745, -7.603358, 31),
                            (24, 'Fquih Ben Salah,Morocco', 32.511807, -6.693090, 33),
                            (25, 'Beni-Mellal,Morocco', 32.340419, -6.355929, 34),
                            (26, 'Beni-Mellal,Morocco', 32.351312, -6.357955, 35),
                            (27, 'Khouribga,Morocco', 32.892075, -6.937886, 36),
                            (28, 'Rabat,Morocco', 33.996535, -6.848384, 37),
                            (29, 'Rabat,Morocco', 34.021193, -6.826903, 38),
                            (30, 'Loulad,Morocco', 32.991755, -7.128650, 39),
                            (31, 'Casablanca,Morocco', 33.554928, -7.637164, 40),
                            (32, 'Khouribga,Morocco', 32.895069, -6.906918, 41),
                            (33, 'Khouribga,Morocco', 32.896543, -6.929887, 42),
                            (34, 'Khouribga,Morocco', 32.874386, -6.933741, 43)
                        ;`);
        connection.query(`INSERT IGNORE INTO tags (id_tag, tag)
                            VALUES           
                                (1, 'shopping'),
                                (2,'travel'),
                                (3, 'dating'),
                                (4, 'network'),
                                (5, 'matcha'),
                                (6, 'surf'),
                                (7, 'open_mind'),
                                (8, 'programming'),
                                (9, 'sports'),
                                (10, 'hello_World'),
                                (11, 'geek'),
                                (12, 'high_tech'),
                                (13, 'fishing'),
                                (14, 'internet'),
                                (15, 'wedding'),
                                (16, 'serious_dating'),
                                (17, 'tiktok'),
                                (18, 'safari'),
                                (19, 'animals'),
                                (20, 'dogs'),
                                (21, 'cats'),
                                (22, 'funny'),
                                (23, 'sex'),
                                (24, 'yoga'),
                                (25, 'fitness'),
                                (26, 'football'),
                                (27, 'girls'),
                                (28, 'vegan'),
                                (29, 'cooking'),
                                (30, 'love')
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
                                (22,24),(30,24),(23,24),(2,24),(7,24),
                                (17,25),(5,25),(4,25),(7,25),(6,25),
                                (5,26),(7,26),(15,26),
                                (11,27),(12,27),(2,27),
                                (4,28),(3,28),(14,28),
                                (30,29),(28,29),(17,29),(2,29),
                                (23,30),(21,30),(6,30),
                                (7,31),(18,31),(23,31),(2,31),
                                (27,32),(7,32),(8,32),
                                (24,33),(25,33),(9,33),
                                (19,34),(20,34),(21,34),
                                (28,35),(29,35),(30,35),
                                (3,36),(4,36),(5,36),
                                (17,37),(22,37),
                                (30,38),(23,38),
                                (1,39),(2,39),(7,39),
                                (29,40),(28,40),(15,40),
                                (1,41),(7,41),(21,41),(30,41),(5,41),
                                (5,42),(7,42),(24,42),
                                (5,43),(7,43),(14,43),(24,43)
                                ;`)
        console.log("database seeding success");
        connection.end() ;
    })
}

