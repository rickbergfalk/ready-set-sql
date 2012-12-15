
/* 
	Date parsing/cleaning
============================================================================ */
console.log('\n\nDate Cleaning \n=============================\n');

var a = new Date('1962-10-05T00:00:00.000Z'.replace('T', ' ').replace('Z', ''))

console.log(a);



/* 
	Detecting bad SQL
============================================================================ */
console.log('\n\nMalicious SQL Detection \n=============================\n');

var sqls = [
	'SELECT * FROM someTable', 
	'CREATE TABLE sometable (blah blah blah)', 
	'DROP TABLE blah'
];


for (var s = 0; s < sqls.length; s++) {
	var pattern = /GRANT\s|DROP\s|CREATE\s|INSERT\s|ALTER\s|DECLARE\s|DELETE\s|DESTROY\s|EXEC\s|EXECUTE\s|SET\s|UPDATE\s/gi;
	console.log(pattern.test(sqls[s]));
}



/* 
	Date fun (for that banning logic)
============================================================================ */
console.log('\n\nDate Banning Logic \n=============================\n');


var minutesBetweenDates = function (a, b) {
	console.log(a);
	console.log(b);
	return (Math.abs(a - b)) / 1000 / 60;
};

var b = new Date();

setTimeout(function() {
	var c = new Date();
	
	var minutes = minutesBetweenDates(b, c);
	console.log(minutes + ' minutes have passed\n');
	
}, 30000);


setTimeout(function() {
	var c = new Date();
	
	var minutes = minutesBetweenDates(b, c);
	console.log(minutes + ' minutes have passed');
	
}, 61000);