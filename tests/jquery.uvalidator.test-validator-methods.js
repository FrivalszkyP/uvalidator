/*jslint browser: true*/
/*global YUI: true, sinon: true, $: true */
YUI().use('node', 'test', 'test-console', function (Y) {
	"use strict";
	var coreSuite,
        pass = $('#pass'),
        pass2 = $('#pass2'),
        url = $('#url'),
        email = $('#email'),
        creditcard = $('#creditcard');

	coreSuite = new Y.Test.Suite({
		name: 'validator tests',
		setUp: function () {
            var skin = $.uvalidatorApplySkin("ustream", $("form"));
		},
		tearDown: function () {
            $('.control-group').removeClass('success error');
		}
	});
	coreSuite.add(new Y.Test.Case({
		name: "Password format tests",
        setUp: function () {
            $('#Messages').hide();
            pass.val('');
            pass2.val('');
            $('form').submit();
        },
        tearDown: function () {
            $(':input').removeClass('valid invalid');
        },
        "lowercase letters only": function () {
            pass.val('foobarbaz').change();
            Y.Assert.isTrue(pass.hasClass('invalid'));
		},
        "uppercase letters only": function () {
            pass.val('FOOBARBAZ').change();
            Y.Assert.isTrue(pass.hasClass('invalid'));
		},
        "no number": function () {
            pass.val('Foobarbaz.').change();
            Y.Assert.isTrue(pass.hasClass('invalid'));
		},
        "no uppercase": function () {
            pass.val('foobarbaz7.').change();
            Y.Assert.isTrue(pass.hasClass('invalid'));
		},
        "no lowercase": function () {
            pass.val('FOOBARBAZ7.').change();
            Y.Assert.isTrue(pass.hasClass('invalid'));
		},
        "less than 7 chars": function () {
            pass.val('F1f.').change();
            Y.Assert.isTrue(pass.hasClass('invalid'));
		},
        "valid password format": function () {
            pass.val('F1fooabar').change();
            Y.Assert.isTrue(pass.hasClass('valid'));
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: "Password verify tests",
        setUp: function () {
            $('#Messages').hide();
            pass.val('');
            pass2.val('');
            $('form').submit();
        },
        tearDown: function () {
            pass.val('');
            pass2.val('');
            $(':input').removeClass('valid invalid');
        },
        "passwords does not match": function () {
            pass.val('F1fooabar').change();
            pass2.val('F1fooaba').change();
            Y.Assert.isTrue(pass.hasClass('valid'));
            Y.Assert.isFalse(pass2.hasClass('valid'));
		},
        "passwords does match": function () {
            pass.val('F1fooabar').change();
            pass2.val('F1fooabar').change();
            Y.Assert.isTrue(pass.hasClass('valid'));
            Y.Assert.isTrue(pass2.hasClass('valid'));
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: "Url format tests",
        setUp: function () {
            $('#Messages').hide();
            url.val('');
            $('form').submit();
        },
        tearDown: function () {
            url.val('');
            $(':input').removeClass('valid invalid');
        },
        "without http": function () {
            url.val('www.ustream.tv').change();
            Y.Assert.isFalse(url.hasClass('valid'));
		},
        "valid url": function () {
            url.val('http://www.ustream.tv').change();
            Y.Assert.isTrue(url.hasClass('valid'));
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: "Email format tests",
        setUp: function () {
            $('#Messages').hide();
            email.val('');
            $('form').submit();
        },
        tearDown: function () {
            email.val('');
            $(':input').removeClass('valid invalid');
        },
        "invalid email formats": function () {
            email.val('foo').change();
            Y.Assert.isFalse(email.hasClass('valid'));
            email.val('foo@').change();
            Y.Assert.isFalse(email.hasClass('valid'));
            email.val('foo@bar').change();
            Y.Assert.isFalse(email.hasClass('valid'));
		},
        "valid email format": function () {
            email.val('foo@bar.baz').change();
            Y.Assert.isTrue(email.hasClass('valid'));
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: "Credit card format tests",
        setUp: function () {
            $('#Messages').hide();
            creditcard.val('');
            $('form').submit();
        },
        tearDown: function () {
            creditcard.val('');
            $(':input').removeClass('valid invalid');
        },
        "invalid creditcard formats": function () {
            creditcard.val('5555#5555#5555#4444').change();
            Y.Assert.isFalse(creditcard.hasClass('valid'), 'Disallowed characters');
            creditcard.val('5555-5555-5555-4443').change();
            Y.Assert.isFalse(creditcard.hasClass('valid'), 'Invalid card number');
		},
        "valid creditcard format": function () {
            creditcard.val('5555-5555-5555-4444').change();
            Y.Assert.isTrue(creditcard.hasClass('valid'));
		}
	}));
	Y.Test.Runner.add(coreSuite);
	Y.Test.Runner.run();
});

