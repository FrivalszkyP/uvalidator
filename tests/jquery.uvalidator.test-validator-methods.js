/*jslint browser: true*/
/*global YUI: true, sinon: true, $: true */
YUI().use('node', 'test', 'test-console', function (Y) {
	"use strict";
	var coreSuite,
        required = $('#required'),
        radio1 = $('#radio-1'),
        radio2 = $('#radio-2'),
        pass = $('#pass'),
        pass2 = $('#pass2'),
        url = $('#url'),
        email = $('#email'),
        creditcard = $('#creditcard'),
        min = $('#min'),
        max = $('#max'),
        minMax = $('#min-max'),
        pattern = $('#pattern'),
        invalidClass = 'input-invalid',
        validClass = 'input-valid';

    Y.Assert.uFieldIsInvallid = function uFieldIsVallid(field) {
        Y.Assert.isTrue(field.hasClass(invalidClass), 'uField is invalid');
        Y.Assert.isFalse(field.hasClass(validClass), 'uField is invalid');
    };
    Y.Assert.uFieldIsVallid = function uFieldIsVallid(field) {
        Y.Assert.isTrue(field.hasClass(validClass), 'uField is valid');
        Y.Assert.isFalse(field.hasClass(invalidClass), 'uField is valid');
    };
    function setUp() {
    }
    function tearDown() {
        // $(':input').removeClass('valid invalid');
        // $('.uerror').remove();
        required.val('');
        pass.val('');
        pass2.val('');
        url.val('');
        email.val('');
        creditcard.val('');
        min.val('');
        max.val('');
        minMax.val('');
        pattern.val('');
    }

	coreSuite = new Y.Test.Suite({
		name: 'validator tests',
		setUp: function () {
            var skin = $.uvalidatorApplySkin("ustream", $("form"));
		},
		tearDown: tearDown
	});
	coreSuite.add(new Y.Test.Case({
		name: "Required tests",
        setUp: function () {
            $('#Messages').hide();
            $('form').submit();
        },
        tearDown: tearDown,
        "required field invalid states": function () {
            required.val('').change();
            Y.Assert.uFieldIsInvallid(required);
        },
        "required field valid states": function () {
            required.val('a').change();
            Y.Assert.uFieldIsVallid(required);
        }
	}));

	coreSuite.add(new Y.Test.Case({
		name: "Required group tests",
        setUp: function () {
            $('#Messages').hide();
            $('form').submit();
        },
        tearDown: tearDown,
        "required group invalid states": function () {
            radio1.prop('checked', false);
            radio2.prop('checked', false).change();
            Y.Assert.uFieldIsInvallid(radio1);
            Y.Assert.uFieldIsInvallid(radio2);
        },
        "required field valid states": function () {
            radio2.prop('checked', true).change();
            Y.Assert.uFieldIsVallid(radio1);
            Y.Assert.uFieldIsVallid(radio2);
        }
	}));

	coreSuite.add(new Y.Test.Case({
		name: "Password format tests",
        setUp: function () {
            $('#Messages').hide();
            pass.val('');
            pass2.val('');
            $('form').submit();
        },
        tearDown: tearDown,
        "lowercase letters only": function () {
            pass.val('foobarbaz').change();
            Y.Assert.isTrue(pass.hasClass(invalidClass));
		},
        "uppercase letters only": function () {
            pass.val('FOOBARBAZ').change();
            Y.Assert.isTrue(pass.hasClass(invalidClass));
		},
        "no number": function () {
            pass.val('Foobarbaz.').change();
            Y.Assert.isTrue(pass.hasClass(invalidClass));
		},
        "no uppercase": function () {
            pass.val('foobarbaz7.').change();
            Y.Assert.isTrue(pass.hasClass(invalidClass));
		},
        "no lowercase": function () {
            pass.val('FOOBARBAZ7.').change();
            Y.Assert.isTrue(pass.hasClass(invalidClass));
		},
        "less than 7 chars": function () {
            pass.val('F1f.').change();
            Y.Assert.isTrue(pass.hasClass(invalidClass));
		},
        "valid password format": function () {
            pass.val('F1fooabar').change();
            Y.Assert.isTrue(pass.hasClass(validClass));
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
        tearDown: tearDown,
        "passwords does not match": function () {
            pass.val('F1fooabar').change();
            pass2.val('F1fooaba').change();
            Y.Assert.isTrue(pass.hasClass(validClass));
            Y.Assert.isFalse(pass2.hasClass(validClass));
		},
        "passwords does match": function () {
            pass.val('F1fooabar').change();
            pass2.val('F1fooabar').change();
            Y.Assert.isTrue(pass.hasClass(validClass));
            Y.Assert.isTrue(pass2.hasClass(validClass));
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: "Url format tests",
        setUp: function () {
            $('#Messages').hide();
            url.val('');
            $('form').submit();
        },
        tearDown: tearDown,
        "without http": function () {
            url.val('www.ustream.tv').change();
            Y.Assert.isFalse(url.hasClass(validClass));
		},
        "valid url": function () {
            url.val('http://www.ustream.tv').change();
            Y.Assert.isTrue(url.hasClass(validClass));
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: "Email format tests",
        setUp: function () {
            $('#Messages').hide();
            email.val('');
            $('form').submit();
        },
        tearDown: tearDown,
        "invalid email formats": function () {
            email.val('foo').change();
            Y.Assert.isFalse(email.hasClass(validClass));
            email.val('foo@').change();
            Y.Assert.isFalse(email.hasClass(validClass));
            email.val('foo@bar').change();
            Y.Assert.isFalse(email.hasClass(validClass));
		},
        "valid email format": function () {
            email.val('foo@bar.baz').change();
            Y.Assert.isTrue(email.hasClass(validClass));
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: "Credit card format tests",
        setUp: function () {
            $('#Messages').hide();
            creditcard.val('');
            $('form').submit();
        },
        tearDown: tearDown,
        "invalid creditcard formats": function () {
            creditcard.val('5555#5555#5555#4444').change();
            Y.Assert.isFalse(creditcard.hasClass(validClass), 'Disallowed characters');
            creditcard.val('5555-5555-5555-4443').change();
            Y.Assert.isFalse(creditcard.hasClass(validClass), 'Invalid card number');
		},
        "valid creditcard format": function () {
            creditcard.val('5555-5555-5555-4444').change();
            Y.Assert.isTrue(creditcard.hasClass(validClass));
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: "Min number test",
        setUp: function () {
            $('#Messages').hide();
            min.val('');
            $('form').submit();
        },
        tearDown: tearDown,
        "invalid format in min": function () {
            min.val('aaa').change();
            Y.Assert.isFalse(min.hasClass(validClass));
		},
        "minimum pass tests": function () {
            min.attr('data-validator-min', 5);
            min.val('4').change();
            Y.Assert.isFalse(min.hasClass(validClass), 'minimum is 5 value is 4');
            min.attr('data-validator-min', -5);
            min.val('-6').change();
            Y.Assert.isFalse(min.hasClass(validClass), 'minimum is -5 value is -6');
        },
        "valid minimum values": function () {
            min.attr('data-validator-min', -5);
            min.val('-4').change();
            Y.Assert.isTrue(min.hasClass(validClass), 'minimum is -5 value is -4');
            min.val('-5').change();
            Y.Assert.isTrue(min.hasClass(validClass), 'minimum is -5 value is -5');

            min.attr('data-validator-min', 0);
            min.val('0').change();
            Y.Assert.isTrue(min.hasClass(validClass), 'minimum is 0 value is 0');
            min.val('0.1').change();
            Y.Assert.isTrue(min.hasClass(validClass), 'minimum is 0 value is 0.1');
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: "Max number test",
        setUp: function () {
            $('#Messages').hide();
            max.val('');
            $('form').submit();
        },
        tearDown: tearDown,
        "invalid format in max": function () {
            max.val('aaa').change();
            Y.Assert.isFalse(max.hasClass(validClass));
		},
        "invalid maximum number tests": function () {
            max.attr('data-validator-max', 5);
            max.val('6').change();
            Y.Assert.isFalse(max.hasClass(validClass), 'maximum is 5 value is 6');
            max.attr('data-validator-max', -5);
            max.val('-4').change();
            Y.Assert.isFalse(max.hasClass(validClass), 'maximum is -5 value is -4');
        },
        "valid maximum values": function () {
            max.attr('data-validator-max', -5);
            max.val('-6').change();
            Y.Assert.isTrue(max.hasClass(validClass), 'maximum is -5 value is -6');
            max.val('-5').change();
            Y.Assert.isTrue(max.hasClass(validClass), 'maximum is -5 value is -5');

            max.attr('data-validator-max', 0);
            max.val('0').change();
            Y.Assert.isTrue(max.hasClass(validClass), 'maximum is 0 value is 0');

            max.attr('data-validator-max', 1);
            max.val('0.1').change();
            Y.Assert.isTrue(max.hasClass(validClass), 'maximum is 1 value is 0.1');
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: "Min/Max number test",
        setUp: function () {
            $('#Messages').hide();
            minMax.val('');
            $('form').submit();
        },
        tearDown: tearDown,
        "invalid number in min-max": function () {
            minMax.attr('data-validator-min', 1);
            minMax.attr('data-validator-max', 5);
            minMax.val(0).change();
            Y.Assert.isFalse(minMax.hasClass(validClass));
            minMax.val(6).change();
            Y.Assert.isFalse(minMax.hasClass(validClass));
        },
        "valid number in min-max": function () {
            minMax.val(3).change();
            Y.Assert.isTrue(minMax.hasClass(validClass));
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
        tearDown: tearDown,
        "invalid value test": function () {
            pattern.val('asdf9').change();
            Y.Assert.isFalse(minMax.hasClass(validClass));
        },
        "valid value test": function () {
            pattern.val('9').change();
            Y.Assert.isTrue(pattern.hasClass(validClass));
        }
	}));
	Y.Test.Runner.add(coreSuite);
	Y.Test.Runner.run();
});
