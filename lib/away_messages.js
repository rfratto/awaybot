function AwayMessages() {
	var kvp = {};

	AwayMessages.prototype.get = function(username) {
		return kvp[username];
	}

	AwayMessages.prototype.set = function(username, value) {
		kvp[username] = value;
	}

	AwayMessages.prototype.exists = function(username) {
		return kvp[username] != null;
	}

	AwayMessages.prototype.delete = function(username) {
		if (this.exists(username) == false)
			return false;
		delete kvp[username];
		return true;
	}
}

module.exports = AwayMessages;
