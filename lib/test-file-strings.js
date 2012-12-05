
var FileStrings = require('./file-strings.js');

// Testing
var sqls = new FileStrings({directory: __dirname + '/test-sql/'});

console.log(sqls.get('food.getPepperoniPizza.sql'));
console.log(sqls.get('user-get-all.sql'));
console.log(sqls.getCache());

// this should cause an error
// var emptyfileString = new FileStrings();