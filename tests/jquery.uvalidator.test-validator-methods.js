/*jslint browser: true*/
/*global YUI: true, sinon: true, $: true */
YUI().use('node', 'test', 'test-console', function (Y) {
	"use strict";
	var coreSuite,
        pass = $('#pass'),
        pass2 = $('#pass2'),
        url = $('#url'),
        email = $('#email'),
        creditcard = $('#creditcard'),
        min = $('#min'),
        max = $('#max'),
        minMax = $('#min-max'),
        pattern = $('#pattern');

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
	coreSuite.add(new Y.Test.Case({
		name: "Min number test",
        setUp: function () {
            $('#Messages').hide();
            min.val('');
            $('form').submit();
        },
        tearDown: function () {
            min.val('');
            $(':input').removeClass('valid invalid');
        },
        "invalid format in min": function () {
            min.val('aaa').change();
            Y.Assert.isFalse(min.hasClass('valid'));
		},
        "minimum pass tests": function () {
            min.attr('data-validator-min', 5);
            min.val('4').change();
            Y.Assert.isFalse(min.hasClass('valid'), 'minimum is 5 value is 4');
            min.attr('data-validator-min', -5);
            min.val('-6').change();
            Y.Assert.isFalse(min.hasClass('valid'), 'minimum is -5 value is -6');
        },
        "valid minimum values": function () {
            min.attr('data-validator-min', -5);
            min.val('-4').change();
            Y.Assert.isTrue(min.hasClass('valid'), 'minimum is -5 value is -4');
            min.val('-5').change();
            Y.Assert.isTrue(min.hasClass('valid'), 'minimum is -5 value is -5');

            min.attr('data-validator-min', 0);
            min.val('0').change();
            Y.Assert.isTrue(min.hasClass('valid'), 'minimum is 0 value is 0');
            min.val('0.1').change();
            Y.Assert.isTrue(min.hasClass('valid'), 'minimum is 0 value is 0.1');
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: "Max number test",
        setUp: function () {
            $('#Messages').hide();
            max.val('');
            $('form').submit();
        },
        tearDown: function () {
            max.val('');
            $(':input').removeClass('valid invalid');
        },
        "invalid format in max": function () {
            max.val('aaa').change();
            Y.Assert.isFalse(max.hasClass('valid'));
		},
        "invalid maximum number tests": function () {
            max.attr('data-validator-max', 5);
            max.val('6').change();
            Y.Assert.isFalse(max.hasClass('valid'), 'maximum is 5 value is 6');
            max.attr('data-validator-max', -5);
            max.val('-4').change();
            Y.Assert.isFalse(max.hasClass('valid'), 'maximum is -5 value is -4');
        },
        "valid maximum values": function () {
            max.attr('data-validator-max', -5);
            max.val('-6').change();
            Y.Assert.isTrue(max.hasClass('valid'), 'maximum is -5 value is -6');
            max.val('-5').change();
            Y.Assert.isTrue(max.hasClass('valid'), 'maximum is -5 value is -5');

            max.attr('data-validator-max', 0);
            max.val('0').change();
            Y.Assert.isTrue(max.hasClass('valid'), 'maximum is 0 value is 0');

            max.attr('data-validator-max', 1);
            max.val('0.1').change();
            Y.Assert.isTrue(max.hasClass('valid'), 'maximum is 1 value is 0.1');
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: "Min/Max number test",
        setUp: function () {
            $('#Messages').hide();
            minMax.val('');
            $('form').submit();
        },
        tearDown: function () {
            minMax.val('');
            $(':input').removeClass('valid invalid');
        },
        "invalid number in min-max": function () {
            minMax.attr('data-validator-min', 1);
            minMax.attr('data-validator-max', 5);
            minMax.val(0).change();
            Y.Assert.isFalse(minMax.hasClass('valid'));
            minMax.val(6).change();
            Y.Assert.isFalse(minMax.hasClass('valid'));
        },
        "valid number in min-max": function () {
            minMax.val(3).change();
            Y.Assert.isTrue(minMax.hasClass('valid'));
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: "Pattern tests",
        setUp: function () {
            $('#Messages').hide();
            minMax.val('');
            pattern.attr('data-validator-pattern', '^[0-9]+$');
            $('form').submit();
        },
        tearDown: function () {
            minMax.val('');
            $(':input').removeClass('valid invalid');
        },
        "invalid value test": function () {
            pattern.val('asdf9').change();
            Y.Assert.isFalse(minMax.hasClass('valid'));
        },
        "valid value test": function () {
            pattern.val('9').change();
            Y.Assert.isTrue(pattern.hasClass('valid'));
        }
	}));
	Y.Test.Runner.add(coreSuite);
	Y.Test.Runner.run();
});
