/*
Copyright (C) 2013 Ustream Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*jslint browser: true */
(function ($) {
	"use strict";
	function zeroPad(n, count) {
		n = String(n);
		while (n.length < count) {
			n = "0" + n;
		}
		return n;
	}
	var patterns, dbg;

	patterns = {
		userpassword: /(?=.{7,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])/,

		// Shamelessly lifted from Scott Gonzalez via the Bassistance
		// Validation plugin
		// http://projects.scottsplayground.com/email_address_validation/
		email: /((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?/,

		// Shamelessly lifted from Scott Gonzalez via the Bassistance
		// Validation plugin http://projects.scottsplayground.com/iri/
		url: /(https?|ftp):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,

		// Number, including positive, negative, and floating decimal.
		// Credit: bassistance
		// number: /-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?/,

		alpha: /[a-zA-Z]+/,
		alphaNumeric: /\w+/
	};

	if (window.console) {
		dbg = window.console.log;
	} else {
		dbg = function () {};
	}

	$.uvalidator.addMethod('.required,[required]', 'required', function (value, element, callback) {
		callback(!!value);
	});
	$.uvalidator.addMethod('.ajax', 'ajax', function (value, element, callback) {
		setTimeout(function () {
			callback(+value % 2);
		}, 500);
	});


	function isOptional(element, value) {
		return !element.is('[required],.required') && value === '';
	}

	$.uvalidator.isOptional = isOptional;

	$.uvalidator.addGroupMethod(
		':radio[required],:radio.required',
		'required',
		function (value, items, callback) {
			callback(items.filter(':checked').length > 0);
		}
	);
	$.uvalidator.addGroupMethod(
		':input[data-validator-type="date"][required],:input[data-validator-type="date"].required',
		'required-date',
		function (value, items, callback) {
			var isValid = true;
			items.each(function () {
				isValid = isValid && $.trim($(this).val()) !== '';
			});
			callback(isValid);
		}
	);
	$.uvalidator.addGroupMethod(
		':input[data-validator-type="date"].cc-expiration',
		'expiration-date',
		function (value, items, callback) {
			var year = items.filter('[data-validator-ccexp="year"]'),
				month = items.filter('[data-validator-ccexp="month"]'),
				yearVal = year.val(),
				monthVal = zeroPad(month.val(), 2),
				now = new Date(),
				thisYear,
				thisMonth,
				isValid;

			thisYear = String(now.getFullYear());
			thisMonth = zeroPad(now.getMonth() + 1, 2);

			if (yearVal.length === 2) {
				thisYear = thisYear.slice(-2);
			}

			callback(+(thisYear + thisMonth) <= +(yearVal + monthVal));
		}
	);

	$.uvalidator.addMethod(
		'.number,[type="number"]',
		'number',
		function (value, element, callback) {
			var valid = isOptional(element, value) ||
					(!isNaN(+value) && !isNaN(parseInt(value, 10)));
			callback(valid);
		}
	);
	$.uvalidator.addMethod(
		'.input-url,.url,[type="url"]',
		'url',
		function (value, element, callback) {
			var valid = isOptional(element, value) || patterns.url.test(value);

			callback(valid);
		}
	);
	$.uvalidator.addMethod(
		'.input-email,[type="email"]',
		'email',
		function (value, element, callback) {
			var valid = isOptional(element, value) || patterns.email.test(value);

			callback(valid);
		}
	);
	$.uvalidator.addMethod(
		'.userpassword',
		'userpassword',
		function (value, element, callback) {
			callback(patterns.userpassword.test(value));
		}
	);
	$.uvalidator.addMethod(
		'.password-verify,.input-password-verify',
		'passwordverify',
		function (value, element, callback) {
			var refElement = element.data('validator-refelem'),
				valid;

			valid = isOptional(element, value) || $(refElement).val() === element.val();
			callback(valid);
		}
	);
	$.uvalidator.addMethod(
		'.input-min,[min]',
		'min',
		function (value, element, callback) {
			var min,
				valid;

			value = +value;
			min = element.attr('data-validator-min');

			if (!min) {
				min = element.attr('min');
			}
			min = +min;

			if (isNaN(min) || isNaN(value)) {
				callback(false);
				return;
			}
			valid = isOptional(element, value) || value >= min;
			callback(valid);
		}
	);
	$.uvalidator.addMethod(
		'.input-max,[max]',
		'max',
		function (value, element, callback) {
			var max,
				valid;

			value = +value;
			max = element.attr('data-validator-max');

			if (!max) {
				max = element.attr('max');
			}
			max = +max;

			if (isNaN(max) || isNaN(value)) {
				callback(false);
				return;
			}
			valid = isOptional(element, value) || value <= max;
			callback(valid);
		}
	);
	$.uvalidator.addMethod(
		'.creditcard,.input-creditcard',
		'creditcard',
		function (value, element, callback) {
			var valid, nCheck, nDigit, bEven, n, cDigit;

			if (!/^[0-9 \-]+$/.test(value)) {
				callback(false);
				return;
			}

			nCheck = 0;
			nDigit = 0;
			bEven = false;

			value = value.replace(/\D/g, "");

			for (n = value.length - 1; n >= 0; n -= 1) {
				cDigit = value.charAt(n);
				nDigit = parseInt(cDigit, 10);
				if (bEven) {
					if ((nDigit *= 2) > 9) {
						nDigit -= 9;
					}
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			valid = (nCheck % 10) === 0;
			callback(valid);
		}
	);

	$.uvalidator.addMethod(
		'.pattern,.input-pattern,[pattern]',
		'pattern',
		function (value, element, callback) {
			var valid, pattern, regex;

			pattern = element.attr('data-validator-pattern') || element.attr('pattern');

			if (!pattern) {
				callback(false);
			}

			regex = new RegExp(pattern);
			valid = regex.test(value);

			callback(valid);
		}
	);
}(window.jQuery));
