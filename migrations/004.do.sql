
-- Create some of the James Bond tables.

CREATE TABLE movie (
	movie_id 		INT,
	seq 			INT,
	title 			VARCHAR(100),
	release_date 	DATE,
	bond_actor		VARCHAR(60),
	director  		VARCHAR(60),
	is_eon_film 	INT
);

INSERT INTO MOVIE VALUES (1001, 1, 'Dr. No', '10/5/1962', 'Sean Connery', 'Terence Young', 1);
INSERT INTO MOVIE VALUES (1002, 2, 'From Russia with Love', '10/10/1963', 'Sean Connery', 'Terence Young', 1);
INSERT INTO MOVIE VALUES (1003, 3, 'Goldfinger', '9/17/1964', 'Sean Connery', 'Guy Hamilton', 1);
INSERT INTO MOVIE VALUES (1004, 4, 'Thunderball', '12/29/1965', 'Sean Connery', 'Terence Young', 1);
INSERT INTO MOVIE VALUES (1005, 5, 'You Only Live Twice', '6/12/1967', 'Sean Connery', 'Lewis Gilbert', 1);
INSERT INTO MOVIE VALUES (1006, 6, 'On Her Majesty''s Secret Service', '12/18/1969', 'George Lazenby', 'Peter R. Hunt', 1);
INSERT INTO MOVIE VALUES (1007, 7, 'Diamonds Are Forever', '12/30/1971', 'Sean Connery', 'Guy Hamilton', 1);
INSERT INTO MOVIE VALUES (1008, 8, 'Live and Let Die', '6/27/1973', 'Roger Moore', 'Guy Hamilton', 1);
INSERT INTO MOVIE VALUES (1009, 9, 'The Man with the Golden Gun', '12/19/1974', 'Roger Moore', 'Guy Hamilton', 1);
INSERT INTO MOVIE VALUES (1010, 10, 'The Spy Who Loved Me', '7/7/1977', 'Roger Moore', 'Lewis Gilbert', 1);
INSERT INTO MOVIE VALUES (1011, 11, 'Moonraker', '6/26/1979', 'Roger Moore', 'Lewis Gilbert', 1);
INSERT INTO MOVIE VALUES (1012, 12, 'For Your Eyes Only', '6/24/1981', 'Roger Moore', 'John Glen', 1);
INSERT INTO MOVIE VALUES (1013, 13, 'Octopussy', '6/6/1983', 'Roger Moore', 'John Glen', 1);
INSERT INTO MOVIE VALUES (1014, 14, 'Never Say Never Again', '10/7/1983', 'Sean Connery', 'Irvin Kershner', 0);
INSERT INTO MOVIE VALUES (1015, 15, 'A View to a Kill', '5/22/1985', 'Roger Moore', 'John Glen', 1);
INSERT INTO MOVIE VALUES (1016, 16, 'The Living Daylights', '6/29/1987', 'Timothy Dalton', 'John Glen', 1);
INSERT INTO MOVIE VALUES (1017, 17, 'Licence to Kill', '6/13/1989', 'Timothy Dalton', 'John Glen', 1);
INSERT INTO MOVIE VALUES (1018, 18, 'GoldenEye', '11/13/1995', 'Pierce Brosnan', 'Martin Campbell', 1);
INSERT INTO MOVIE VALUES (1019, 19, 'Tomorrow Never Dies', '12/12/1997', 'Pierce Brosnan', 'Roger Spottiswoode', 1);
INSERT INTO MOVIE VALUES (1020, 20, 'The World Is Not Enough', '11/8/1999', 'Pierce Brosnan', 'Michael Apted', 1);
INSERT INTO MOVIE VALUES (1021, 21, 'Die Another Day', '11/20/2002', 'Pierce Brosnan', 'Lee Tamahori', 1);
INSERT INTO MOVIE VALUES (1022, 22, 'Casino Royale', '11/14/2006', 'Daniel Craig', 'Martin Campbell', 1);
INSERT INTO MOVIE VALUES (1023, 23, 'Quantum of Solace', '10/29/2008', 'Daniel Craig', 'Marc Forster', 1);
INSERT INTO MOVIE VALUES (1024, 24, 'Skyfall', '10/23/2012', 'Daniel Craig', 'Sam Mendes', 1);


