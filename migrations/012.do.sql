
CREATE TABLE data_source (
	content 		VARCHAR(30),
	source 			VARCHAR(100),
	date_accessed 	VARCHAR(20)
);

INSERT INTO data_source VALUES ('deathcounts', 'http://www.allouttabubblegum.com/main/?page_id=13572', 'Nov 2012');
INSERT INTO data_source VALUES ('ratings', 'http://en.wikipedia.org/wiki/James_Bond_in_film', 'Nov 2012');
INSERT INTO data_source VALUES ('general film info', 'http://en.wikipedia.org/wiki/James_Bond_in_film', 'Nov 2012');
INSERT INTO data_source VALUES ('release dates', 'Individual film Wikipedia pages', 'Nov 2012');
INSERT INTO data_source VALUES ('gadgets and weapons', 'http://www.twerponline.net/timewell/databases/bond.htm', 'Nov 2012');
INSERT INTO data_source VALUES ('cast', 'http://www.twerponline.net/timewell/databases/bond.htm', 'Nov 2012');
INSERT INTO data_source VALUES ('theme songs', 'http://www.twerponline.net/timewell/databases/bond.htm', 'Nov 2012');
INSERT INTO data_source VALUES ('vehicles', 'http://www.twerponline.net/timewell/databases/bond.htm', 'Nov 2012');
