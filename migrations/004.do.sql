
-- Create some of the James Bond tables.

CREATE TABLE movie (
	movie_id 		INT,
	seq 			INT,
	title 			VARCHAR(100),
	year			INT,
	bond_actor		VARCHAR(60),
	director  		VARCHAR(60),
	is_eon_film 	INT
);

INSERT INTO movie VALUES (1001, 1, 'Dr. No', 1962, 'Sean Connery', 'Terence Young', 1);
INSERT INTO movie VALUES (1002, 2, 'From Russia with Love', 1963, 'Sean Connery', 'Terence Young', 1);
INSERT INTO movie VALUES (1003, 3, 'Goldfinger', 1964, 'Sean Connery', 'Guy Hamilton', 1);
INSERT INTO movie VALUES (1004, 4, 'Thunderball', 1965, 'Sean Connery', 'Terence Young', 1);
INSERT INTO movie VALUES (1005, 5, 'You Only Live Twice', 1967, 'Sean Connery', 'Lewis Gilbert', 1);
INSERT INTO movie VALUES (1006, 6, 'On Her Majesty''s Secret Service', 1969, 'George Lazenby', 'Peter R. Hunt', 1);
INSERT INTO movie VALUES (1007, 7, 'Diamonds Are Forever', 1971, 'Sean Connery', 'Guy Hamilton', 1);
INSERT INTO movie VALUES (1008, 8, 'Live and Let Die', 1973, 'Roger Moore', 'Guy Hamilton', 1);
INSERT INTO movie VALUES (1009, 9, 'The Man with the Golden Gun', 1974, 'Roger Moore', 'Guy Hamilton', 1);
INSERT INTO movie VALUES (1010, 10, 'The Spy Who Loved Me', 1977, 'Roger Moore', 'Lewis Gilbert', 1);
INSERT INTO movie VALUES (1011, 11, 'Moonraker', 1979, 'Roger Moore', 'Lewis Gilbert', 1);
INSERT INTO movie VALUES (1012, 12, 'For Your Eyes Only', 1981, 'Roger Moore', 'John Glen', 1);
INSERT INTO movie VALUES (1013, 13, 'Octopussy', 1983, 'Roger Moore', 'John Glen', 1);
INSERT INTO movie VALUES (1014, 14, 'Never Say Never Again', 1983, 'Sean Connery', 'Irvin Kershner', 0);
INSERT INTO movie VALUES (1015, 15, 'A View to a Kill', 1985, 'Roger Moore', 'John Glen', 1);
INSERT INTO movie VALUES (1016, 16, 'The Living Daylights', 1987, 'Timothy Dalton', 'John Glen', 1);
INSERT INTO movie VALUES (1017, 17, 'License to Kill', 1989, 'Timothy Dalton', 'John Glen', 1);
INSERT INTO movie VALUES (1018, 18, 'GoldenEye', 1995, 'Pierce Brosnan', 'Martin Campbell', 1);
INSERT INTO movie VALUES (1019, 19, 'Tomorrow Never Dies', 1997, 'Pierce Brosnan', 'Roger Spottiswoode', 1);
INSERT INTO movie VALUES (1020, 20, 'The World Is Not Enough', 1999, 'Pierce Brosnan', 'Michael Apted', 1);
INSERT INTO movie VALUES (1021, 21, 'Die Another Day', 2002, 'Pierce Brosnan', 'Lee Tamahori', 1);
INSERT INTO movie VALUES (1022, 22, 'Casino Royale', 2006, 'Daniel Craig', 'Martin Campbell', 1);
INSERT INTO movie VALUES (1023, 23, 'Quantum of Solace', 2008, 'Daniel Craig', 'Marc Forster', 1);
INSERT INTO movie VALUES (1024, 24, 'Skyfall', 2012, 'Daniel Craig', 'Sam Mendes', 1);
