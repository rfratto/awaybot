var Botkit = require('botkit'),
    Rx = require('rx'),
	AwayMessages = require('../lib/away_messages.js'),
	messages = new AwayMessages();

var controller = Botkit.slackbot({
	debug: false
});

controller.spawn({
	token: process.env.token
}).startRTM();

var greet_text = function(message) {
	return "Hi, <@" + message.user + ">!";
}

var help_menu = function(bot, message) {
	bot.reply(message, greet_text(message) + " To type your away message, try: `set [my away message]`");
	bot.reply(message, "To clear your away message, try: `clear`");
	bot.reply(message, "To see your current away message, try: `get`");
	bot.reply(message, "To see this menu, try: `help`.");
};

var is_active_user = function(bot, username) {
	return Rx.Observable.create(function (observer) {
		bot.api.users.getPresence({ user: username }, function (err, results) {
			if (results.ok != true) return;
			observer.onNext(results.presence == 'active');
		});
	});
}

controller.hears('help', ['direct_message','direct_mention','mention'], help_menu);

controller.hears('get',['direct_message','direct_mention','mention'],function(bot,message) {
	var reply = greet_text(message) + " ";

	if (messages.exists(message.user)) {
		reply += "Your current message is: " + messages.get(message.user);
	} else {
		reply += "You do not currently have a message set.";
	}

	bot.reply(message, reply);
});

controller.hears('clear', ['direct_message','direct_mention','mention'], function(bot, message) {
	var reply = greet_text(message) + " ";

	if (messages.exists(message.user)) {
		messages.delete(message.user);
		reply += "Your away message has been cleared.";
	} else {
		reply += "You do not currently have a message set.";
	}

	bot.reply(message, reply);
});

controller.hears('set (.*)', ['direct_message'], function (bot, message) {
	messages.set(message.user, message.match[1]);
	bot.reply(message, "OK, I'll tell people that you're away.");
});

controller.hears('(.*)', ['direct_message','direct_mention','mention'], help_menu);

controller.hears('@([a-zA-Z0-9_]+)', ['ambient'], function (bot, message) {
	var username = message.match[1];

	is_active_user(bot, username)
	.subscribe(function(active) {
		if (active == true) return;
		if (messages.exists(username) == false) return;

		var away_message = messages.get(username);

		var resp = greet_text(message) +
			" <@" + username + "> is currently away right now: "
			+ away_message;

		bot.reply(message, resp);
	});
});
