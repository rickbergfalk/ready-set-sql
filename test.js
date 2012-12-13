
// To clean a date?
var a = new Date('1962-10-05T00:00:00.000Z'.replace('T', ' ').replace('Z', ''))



var sqls = [
	'SELECT * FROM someTable', 
	'CREATE TABLE sometable (blah blah blah)', 
	'DROP TABLE blah'
];


for (var s = 0; s < sqls.length; s++) {
	var pattern = /GRANT\s|DROP\s|CREATE\s|INSERT\s|ALTER\s|DECLARE\s|DELETE\s|DESTROY\s|EXEC\s|EXECUTE\s|SET\s|UPDATE\s/gi;
	console.log(pattern.test(sqls[s]));
}
