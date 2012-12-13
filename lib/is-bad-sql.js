/*
 *  isBadSql
 *  
 *  "Bad" sql in our case is anything that dangerous or is not read only
 *  ideally this should be enforced by the DBMS
 *  but unfortunately, that can't be done "in the cloud" with Heroku (to my knowledge)
 *  
 *  For now this module is pretty simple, 
 *  but I figured it best to break it out just 
 *  in case it gets more complicated down the road.
 *
 */

var isBadSql = function (sql) {
	var pattern = /GRANT\s|DROP\s|CREATE\s|INSERT\s|ALTER\s|DECLARE\s|DELETE\s|DESTROY\s|EXEC\s|EXECUTE\s|SET\s|UPDATE\s/gi;
	return pattern.test(sql);
};


// commonJS module systems
if (typeof module !== 'undefined' && "exports" in module) {
	module.exports = isBadSql;
}
