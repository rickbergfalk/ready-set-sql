

var getClientIp = require('./get-client-ip.js');

/*
	naughtyIPs = {
		"ipaddress": {
			violations: n,
			lastOffenseDate: Date()
		}
	}
*/
var naughtyIPs = {};

var beenLongEnough = function (violationDate) {
	var now = new Date();
	var minutes = (Math.abs(violationDate - now)) / 1000 / 60;
	console.log(minutes + ' minutes so far');
	if (minutes > 1) {
		return true;
	} else {
		return false;
	}
};

var handleBannedPeople = function (req, res, next) {
	
	
	// If the IP has more than 6 violations, 
	// and the request is for the /query url
	// Send a 403 telling the user they are banned.
	// Otherwise redirect them somewhere. Either to a "You are banned" page, or somewhere annoying on the internet.
	// Of course if they have no violations or less than 6, process the request as usual.
	var ip = getClientIp(req);
	var offender = naughtyIPs[ip];
	
	
	
	// if there is no offense, advance to the next step ASAP
	if (!offender) {
		next()
	} else {
		// there is an offender
		console.log('offender:');
		console.log(offender);
		
		// if the offender has only made a few violations, let them continue
		if (offender.violations <= 5) {
			next();
		
		// if this offender is banned and its been long enough
		// unban them
		} else if (offender.violations > 5 && beenLongEnough(offender.lastOffenseDate)) {
			delete naughtyIPs[ip];
			next();
		
		// if person is banned and they are sending an AJAX query
		// send them a message saying they are banned
		// (a redirect won't work here)
		} else if (offender.violations > 5 && req.url === '/query') {
			res.send(403, "Crap. Something is broken.");
		
		// if we reach this, 
		// the person is banned, hasn't been unsuspended, and isnt running an AJAX query
		} else {
			res.redirect(302, 'http://www.youtube.com/watch?v=oHg5SJYRHA0');
		} 
	
	}
	
};
exports.handleBannedPeople = handleBannedPeople;



var recordOffense = function (req) {
	var ip = getClientIp(req);
	
	if (naughtyIPs[ip]) {
		naughtyIPs[ip].violations = naughtyIPs[ip].violations + 1;
		naughtyIPs[ip].lastOffenseDate = new Date();
	} else {
		naughtyIPs[ip] = {ip: ip, violations: 1, lastOffenseDate: new Date()};
	}
	
	var message = "I'm pretty sure we haven't gone over that kind of stuff yet.";
	if (naughtyIPs[ip].violations == 2) message = "Nor have we covered that stuff either.";
	if (naughtyIPs[ip].violations == 3) message = "Better check yourself before you wreck yourself.";
	if (naughtyIPs[ip].violations == 4) message = "Seriously? Still at this?";
	if (naughtyIPs[ip].violations == 5) message = "We're probably enjoying this more than you are.";
	if (naughtyIPs[ip].violations > 5) message = "Crap. Something is broken.";
	
	naughtyIPs[ip].message = message;
	
	return naughtyIPs[ip];
};
exports.recordOffense = recordOffense;

