var AwayMessages = require('../lib/away_messages.js');

describe("Away Messages", function() {
	beforeEach(function() {
		this.messages = new AwayMessages();
	});

	describe("set", function() {
		it("should allow to set a key once", function() {
			this.messages.set("user", "status");
		});

		it("should allow to set a key twice", function() {
			this.messages.set("user", "status");
			this.messages.set("user", "another status");
		});
	});

	describe("get", function() {
		it("should not return a value for a non-existant key", function() {
			expect(this.messages.get("nobody")).toBeUndefined();
		});

		it("should not return a value for a deleted key", function() {
			expect(this.messages.get("user")).toBeUndefined();
			this.messages.set("user", "status");
			expect(this.messages.get("user")).toEqual("status");
			this.messages.delete("user");
			expect(this.messages.get("user")).toBeUndefined();
		});

		it("should return a value for a key that exists", function() {
			expect(this.messages.get("user")).toBeUndefined();
			this.messages.set("user", "status");
			expect(this.messages.get("user")).toEqual("status");
		});

		it("should return an updated value", function() {
			expect(this.messages.get("user")).toBeUndefined();
			this.messages.set("user", "status");
			expect(this.messages.get("user")).toEqual("status");
			this.messages.set("user", "another status");
			expect(this.messages.get("user")).toEqual("another status");
		});
	});

	describe("exists", function() {
		it("should not return true for a non-existant key", function() {
			expect(this.messages.exists("nobody")).toBe(false);
		});

		it("should return true for an existant key", function() {
			this.messages.set("user", "status");
			expect(this.messages.exists("user")).toBe(true);
		});

		it("should return false after a key is deleted", function() {
			expect(this.messages.exists("user")).toBe(false);
			this.messages.set("user", "status");
			expect(this.messages.exists("user")).toBe(true);
			this.messages.delete("user");
			expect(this.messages.exists("user")).toBe(false);
		});
	});

	describe("delete", function() {
		it("should process deleting non-existant key", function() {
			expect(this.messages.delete("nobody")).toBe(false);
		});

		it("should return true when a key is deleted", function() {
			expect(this.messages.exists("user")).toBe(false);
			this.messages.set("user", "status");
			expect(this.messages.delete("user")).toBe(true);
			expect(this.messages.exists("user")).toBe(false);
		})
	});
});
