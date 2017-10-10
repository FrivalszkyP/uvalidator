/*jslint browser: true*/
/*global YUI: true, $: true */
var yui = new YUI();
yui.use('node', 'test', 'test-console', function (Y) {
	'use strict';
	var coreSuite,
		required = $('#required'),
		radio1 = $('#radio-1'),
		radio2 = $('#radio-2'),
		pass = $('#pass'),
		pass2 = $('#pass2'),
		url = $('#url'),
		uri = $('#uri'),
		email = $('#email'),
		creditcard = $('#creditcard'),
		min = $('#min'),
		minTextarea = $('#min-textarea'),
		max = $('#max'),
		maxTextarea = $('#max-textarea'),
		minMax = $('#min-max'),
		minMaxTextarea = $('#min-max-textarea'),
		pattern = $('#pattern'),
		minLength = $('#minLength'),
		maxLength = $('#maxLength'),
		invalidClass = 'input-invalid',
		validClass = 'input-valid';

	Y.Assert.uFieldIsInvallid = function uFieldIsVallid(field) {
		Y.Assert.isTrue(field.hasClass(invalidClass), 'uField is invalid');
		Y.Assert.isFalse(field.hasClass(validClass), 'uField is invalid');
		Y.Assert.areSame('true', field.attr('aria-invalid'), 'uField is invalid');
	};
	Y.Assert.uFieldIsVallid = function uFieldIsVallid(field) {
		Y.Assert.isTrue(field.hasClass(validClass), 'uField is valid');
		Y.Assert.isFalse(field.hasClass(invalidClass), 'uField is valid');
		Y.Assert.areSame('false', field.attr('aria-invalid'), 'uField is valid');
	};
	function tearDown() {
		// $(':input').removeClass('valid invalid');
		// $('.uerror').remove();
		required.val('');
		pass.val('');
		pass2.val('');
		url.val('');
		uri.val('');
		email.val('');
		creditcard.val('');
		min.val('');
		minTextarea.val('');
		max.val('');
		maxTextarea.val('');
		minMax.val('');
		minMaxTextarea.val('');
		pattern.val('');
		minLength.val('');
		maxLength.val('');
	}

	coreSuite = new Y.Test.Suite({
		name: 'validator method tests',
		setUp: function () {
			$.uvalidatorApplySkin('ustream', $('form'));
		},
		tearDown: tearDown
	});
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
		'required field invalid states': function () {
			required.val('').change();
			Y.Assert.uFieldIsInvallid(required);
		},
		'required field valid states': function () {
			required.val('a').change();
			Y.Assert.uFieldIsVallid(required);
		}
	}));

	coreSuite.add(new Y.Test.Case({
		name: 'Required group tests',
		setUp: function () {
			$('#Messages').hide();
			$('form').submit();
		},
		tearDown: tearDown,
		'required group invalid states': function () {
			radio1.prop('checked', false);
			radio2.prop('checked', false).change();
			Y.Assert.uFieldIsInvallid(radio1);
			Y.Assert.uFieldIsInvallid(radio2);
		},
		'required field valid states': function () {
			radio2.prop('checked', true).change();
			Y.Assert.uFieldIsVallid(radio1);
			Y.Assert.uFieldIsVallid(radio2);
		}
	}));

	coreSuite.add(new Y.Test.Case({
		name: 'Password format tests',
		setUp: function () {
			$('#Messages').hide();
			pass.val('');
			pass2.val('');
			$('form').submit();
		},
		tearDown: tearDown,
		'minimum 5 chars length': function () {
			pass.val('Asd1').change();
			Y.Assert.isTrue(pass.hasClass(invalidClass));
			pass.val('Asdf1Asdf1').change();
			Y.Assert.isTrue(pass.hasClass(validClass));
		},
		'require uppercase letter': function () {
			pass.val('asdf1').change();
			Y.Assert.isTrue(pass.hasClass(invalidClass));
			pass.val('Asdf1asdf1').change();
			Y.Assert.isTrue(pass.hasClass(validClass));
		},
		'require lowercase letter': function () {
			pass.val('ASDF1').change();
			Y.Assert.isTrue(pass.hasClass(invalidClass));
			pass.val('aSDF1ASDF1').change();
			Y.Assert.isTrue(pass.hasClass(validClass));
		},
		'require number': function () {
			pass.val('Asdaf').change();
			Y.Assert.isTrue(pass.hasClass(invalidClass));
			pass.val('AsdfAsdf1').change();
			Y.Assert.isTrue(pass.hasClass(validClass));
		}
	}));

	coreSuite.add(new Y.Test.Case({
		name: 'Password verify tests',
		setUp: function () {
			$('#Messages').hide();
			pass.val('');
			pass2.val('');
			$('form').submit();
		},
		tearDown: tearDown,
		'passwords does not match': function () {
			pass.val('F1fooabar').change();
			pass2.val('F1fooaba').change();
			Y.Assert.isTrue(pass.hasClass(validClass));
			Y.Assert.isFalse(pass2.hasClass(validClass));
		},
		'passwords does match': function () {
			pass.val('F1fooabar').change();
			pass2.val('F1fooabar').change();
			Y.Assert.isTrue(pass.hasClass(validClass));
			Y.Assert.isTrue(pass2.hasClass(validClass));
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: 'Url format tests',
		setUp: function () {
			$('#Messages').hide();
			url.val('');
			$('form').submit();
		},
		tearDown: tearDown,
		'without http': function () {
			url.val('www.ustream.tv').change();
			Y.Assert.isFalse(url.hasClass(validClass));
		},
		'valid url': function () {
			url.val('http://www.ustream.tv').change();
			Y.Assert.isTrue(url.hasClass(validClass));
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: 'URI format tests with different schemes',
		setUp: function () {
			$('#Messages').hide();
			uri.val('');
			$('form').submit();
		},
		tearDown: tearDown,
		'without scheme': function () {
			uri.val('www.ustream.tv').change();
			Y.Assert.isFalse(uri.hasClass(validClass));
		},
		'valid scheme': function () {
			uri.val('chrome://bookmarks').change();
			Y.Assert.isTrue(uri.hasClass(validClass));
		},
		'valid android intent': function () {
			uri.val('content://com.example.project:200/folder/subfolder/etc').change();
			Y.Assert.isTrue(uri.hasClass(validClass));
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: 'Email format tests',
		setUp: function () {
			$('#Messages').hide();
			email.val('');
			$('form').submit();
		},
		tearDown: tearDown,
		'invalid email formats': function () {
			[
				'foo',
				'foo@',
				'foo@bar',
				'.foo@bar.com',
				'foo@.bar.com',
				'foo..foo@bar.com',
				'Ffff foo@bar.com',
				// tld > 63
				'foo@bar.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				// label after @ <= 63
				'foo.oo@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.laat',
				// label after another <= 63
				'foo.oo@aa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.lala'
			].forEach(function (addr) {
				email.val(addr).change();
				Y.Assert.isFalse(email.hasClass(validClass), addr);
			})
		},
		'valid email format': function () {
			[
				'foo@bar.baz',
				'foo@bar.baz.qux.asd',
				'foo+qux@bar.baz',
				'asdf@مثال.إختبار',
				'asdf@例子.测试',
				'asdf@例子.測試',
				'asdf@παράδειγμα.δοκιμή',
				'asdf@उदाहरण.परीक्षा',
				'asdf@실례.테스트',
				'foo@bar.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				'foo@bar.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aa',
				'foo@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aa'
			].forEach(function (addr) {
				email.removeClass([validClass, invalidClass].join(' ')).val(addr).change();
				Y.Assert.isTrue(email.hasClass(validClass), addr);
			});
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: 'Credit card format tests',
		setUp: function () {
			$('#Messages').hide();
			creditcard.val('');
			$('form').submit();
		},
		tearDown: tearDown,
		'invalid creditcard formats': function () {
			creditcard.val('5555#5555#5555#4444').change();
			Y.Assert.isFalse(creditcard.hasClass(validClass), 'Disallowed characters');
			creditcard.val('5555-5555-5555-4443').change();
			Y.Assert.isFalse(creditcard.hasClass(validClass), 'Invalid card number');
		},
		'valid creditcard format': function () {
			creditcard.val('5555-5555-5555-4444').change();
			Y.Assert.isTrue(creditcard.hasClass(validClass));
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: 'Min number test',
		setUp: function () {
			$('#Messages').hide();
			min.val('');
			$('form').submit();
		},
		tearDown: tearDown,
		'invalid format in min': function () {
			min.val('aaa').change();
			Y.Assert.isFalse(min.hasClass(validClass));
		},
		'minimum pass tests': function () {
			min.attr('data-validator-min', 5);
			min.val('4').change();
			Y.Assert.isFalse(min.hasClass(validClass), 'minimum is 5 value is 4');
			min.attr('data-validator-min', -5);
			min.val('-6').change();
			Y.Assert.isFalse(min.hasClass(validClass), 'minimum is -5 value is -6');
		},
		'valid minimum values': function () {
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
		},
		"invalid format in min-textarea": function () {
			minTextarea.val('aaa').change();
			Y.Assert.isFalse(minTextarea.hasClass(validClass));
		},
		"minimum-textarea pass tests": function () {
			minTextarea.attr('data-validator-min', 5);
			minTextarea.val('4').change();
			Y.Assert.isFalse(minTextarea.hasClass(validClass), 'minimum is 5 value is 4');
			minTextarea.attr('data-validator-min', -5);
			minTextarea.val('-6').change();
			Y.Assert.isFalse(minTextarea.hasClass(validClass), 'minimum is -5 value is -6');
		},
		"valid minimum values textarea": function () {
			minTextarea.attr('data-validator-min', -5);
			minTextarea.val('-4').change();
			Y.Assert.isTrue(minTextarea.hasClass(validClass), 'minimum is -5 value is -4');
			minTextarea.val('-5').change();
			Y.Assert.isTrue(minTextarea.hasClass(validClass), 'minimum is -5 value is -5');

			minTextarea.attr('data-validator-min', 0);
			minTextarea.val('0').change();
			Y.Assert.isTrue(minTextarea.hasClass(validClass), 'minimum is 0 value is 0');
			minTextarea.val('0.1').change();
			Y.Assert.isTrue(minTextarea.hasClass(validClass), 'minimum is 0 value is 0.1');
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: 'Max number test',
		setUp: function () {
			$('#Messages').hide();
			max.val('');
			$('form').submit();
		},
		tearDown: tearDown,
		'invalid format in max': function () {
			max.val('aaa').change();
			Y.Assert.isFalse(max.hasClass(validClass));
		},
		'invalid maximum number tests': function () {
			max.attr('data-validator-max', 5);
			max.val('6').change();
			Y.Assert.isFalse(max.hasClass(validClass), 'maximum is 5 value is 6');
			max.attr('data-validator-max', -5);
			max.val('-4').change();
			Y.Assert.isFalse(max.hasClass(validClass), 'maximum is -5 value is -4');
		},
		'valid maximum values': function () {
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
		name: 'Min/Max number test',
		setUp: function () {
			$('#Messages').hide();
			minMax.val('');
			$('form').submit();
		},
		tearDown: tearDown,
		'invalid number in min-max': function () {
			minMax.attr('data-validator-min', 1);
			minMax.attr('data-validator-max', 5);
			minMax.val(0).change();
			Y.Assert.isFalse(minMax.hasClass(validClass));
			minMax.val(6).change();
			Y.Assert.isFalse(minMax.hasClass(validClass));
		},
		'valid number in min-max': function () {
			minMax.val(3).change();
			Y.Assert.isTrue(minMax.hasClass(validClass));
		},
		"invalid number in min-max-textrea": function () {
			minMaxTextarea.attr('data-validator-min', 1);
			minMaxTextarea.attr('data-validator-max', 5);
			minMaxTextarea.val(0).change();
			Y.Assert.isFalse(minMaxTextarea.hasClass(validClass));
			minMaxTextarea.val(6).change();
			Y.Assert.isFalse(minMaxTextarea.hasClass(validClass));
		},
		"valid number in min-max-textrea": function () {
			minMaxTextarea.val(3).change();
			Y.Assert.isTrue(minMaxTextarea.hasClass(validClass));
		},
		"valid number in minLength-input": function () {
			minLength.val(1234).change();
			Y.Assert.isTrue(minLength.hasClass(validClass));
		},
		"valid number in maxLength-input": function () {
			maxLength.val(12).change();
			Y.Assert.isTrue(maxLength.hasClass(validClass));
		},
		"invalid number in minLength-input": function () {
			minLength.val(12).change();
			Y.Assert.isTrue(minLength.hasClass(invalidClass));
		},
		"invalid number in maxLength-input": function () {
			maxLength.val(1234).change();
			Y.Assert.isTrue(maxLength.hasClass(invalidClass));

		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: 'Pattern tests',
		setUp: function () {
			$('#Messages').hide();
			minMax.val('');
			pattern.attr('data-validator-pattern', '^[0-9]+$');
			$('form').submit();
		},
		tearDown: tearDown,
		'invalid value test': function () {
			pattern.val('asdf9').change();
			Y.Assert.isFalse(minMax.hasClass(validClass));
		},
		'valid value test': function () {
			pattern.val('9').change();
			Y.Assert.isTrue(pattern.hasClass(validClass));
		}
	}));
	Y.Test.Runner.add(coreSuite);
	Y.Test.Runner.run();
});
