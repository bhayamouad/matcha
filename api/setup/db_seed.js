
exports.DBSeeds = (connection) => {
    connection.connect(function(err) {
        if (err) throw err;
    
        connection.query(`INSERT INTO users (id_user, fname, lname, email, login, password, gender , birthdate, interest , biography , tags , rating , status, token, expire_token)
                            VALUES
                                (10,'Emmie','Nicolas','emmie.nicolas@example.com','beautifulbird','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1990-11-09','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#shopping,#travel,#dating,#love',50,2,NULL,NULL),
                                (11,'Karl','Johnson','karl.johnson@example.com','bigpeacock','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1985-11-30','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#cooking,#travel,#vegan',40,2,NULL,NULL),
                                (12,'Finn','Morris','finn.morris@example.com','whitelion','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1997-12-02','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#girls,#travel,#football,#fitness,#yoga',20,2,NULL,NULL),
                                (13,'Romane','Perez','romane.perez@example.com','brownelephant','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1995-04-30','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#girls,#cooking,#love',10,2,NULL,NULL),
                                (14,'Lucia','Hammeren','lucia.hammeren@example.com','tinykoala','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1974-06-18','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#travel,#relationship,#sex,#funny',60,2,NULL,NULL),
                                (15,'Romane','Renaud','romane.renaud@example.com','silvercat','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1960-11-09','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#cats,#dogs,#animals,#safari',50,2,NULL,NULL),
                                (16,'Melike','Arslanoğlu','melike.arslanoglu@example.com','tinymeercat','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1997-12-08','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#tiktok,#love,#serious_dating',50,2,NULL,NULL),
                                (17,'Regina','Daniels','regina.daniels@example.com','redtiger','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1987-09-18','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#animals,#safari,#travel,#cats_lover',50,2,NULL,NULL),
                                (18,'Louis','Jones','louis.jones@example.com','ticklishbear','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1991-02-08','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#test,#tiktok,#love,#serious_dating',50,2,NULL,NULL),
                                (19,'Don','George','don.george@example.com','happyfish','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1971-10-13','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#fishing,#cooking,#love,#serious_dating',50,2,NULL,NULL),
                                (20,'Frank Michael','Reiser','frank-michael.reiser@example.com','orangecat','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1994-01-09','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#high_tech,#geek,#sex,#hello_World',30,2,NULL,NULL),
                                (21,'Gabriel','Molina','gabriel.molina@example.com','smallelephant','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1998-03-03','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#test,#tiktok,#love,#serious_dating',50,2,NULL,NULL),
                                (22,'علیرضا','احمدی','aalyrd.hmdy@example.com','blackelephant','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1984-09-18','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#football,#sports,#love',0,2,NULL,NULL),
                                (23,'Cristobal','Santana','cristobal.santana@example.com','bluebear793','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1978-03-31','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#test,#programming,#hello_world',70,2,NULL,NULL),
                                (24,'Alyssa','Elliott','alyssa.elliott@example.com','whiteladybug240','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1991-07-18','B','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#funny,#love,#sex,#travel,#open_mind,#programming,#geek,#surf',50,2,NULL,NULL),
                                (25,'Nikolaj','Nielsen','nikolaj.nielsen@example.com','sadbird','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','M','1979-10-19','F','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#tiktok,#matcha,#date,#open_mind,#surf',50,2,NULL,NULL),
                                (26,'Kristina','Silva','kristina.silva@example.com','redbird','$2b$10$acTQ8iA5pt1WwsNN9KC4zOH8P6YlR982U56sMa2D2CpVVH.pVsT1S','F','1990-02-02','M','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.','#matcha',50,2,NULL,NULL)
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
        connection.query(`INSERT IGNORE INTO tags (tag)
                            VALUES           
                                ('#shopping'),
                                ('#travel'),
                                ('#dating'),
                                ('#date'),
                                ('#matcha'),
                                ('#surf'),
                                ('#open_mind'),
                                ('#programming'),
                                ('#sports'),
                                ('#hello_World'),
                                ('#geek'),
                                ('#high_tech'),
                                ('#fishing'),
                                ('#test'),
                                ('#cats_lover'),
                                ('#serious_dating'),
                                ('#tiktok'),
                                ('#safari'),
                                ('#animals'),
                                ('#dogs'),
                                ('#cats'),
                                ('#funny'),
                                ('#sex'),
                                ('#yoga'),
                                ('#fitness'),
                                ('#football'),
                                ('#girls'),
                                ('#vegan'),
                                ('#cooking'),
                                ('#love')
                        ;`);
            
        console.log("database seeding success");
        connection.end();
    })
}

