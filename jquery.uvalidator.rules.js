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
/* eslint-disable */
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
		userpassword: /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.{7,})/,

		// https://html.spec.whatwg.org/multipage/forms.html#e-mail-state-(type=email)
		email: /^(?!\.)(?!.*\.{2})[a-z0-9á-ÿ\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF.!#$%&'*+\/=?^_`{|}~-]+@(?!\.)(?:[a-z0-9á-ÿ\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF-]{1,63})(?:\.(?:[a-z0-9á-ÿ\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF-]{1,63}))*\.[a-z0-9á-ÿ\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,63}$/i,

		// Shamelessly lifted from Scott Gonzalez via the Bassistance
		// Validation plugin http://projects.scottsplayground.com/iri/
		url: /(https?|ftp):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,

		/**
		 * Any type of URL like chrome://bookmarks or content://com.example.project:200/folder/subfolder/etc
		 */
		anyurl: /^[a-z][^:/?#]*:\/\/[^?#]*(\?[^#]*)?(#(.*))?$/,

		// Number, including positive, negative, and floating decimal.
		// Credit: bassistance
		// number: /-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?/,

		alpha: /[a-zA-Z]+/,
		alphaNumeric: /\w+/,
		color: /#[\da-fA-F]{6}/,
		tel: /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i
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
		':input[data-validator-type="pattern"]',
		'pattern',
		function (value, items, callback) {
			var isValid = true;
			items.each(function (index, element) {
				var $el = $(element);
				var value = $el.val();
				var pattern = $el.attr('data-validator-pattern') || $el.attr('pattern');
				var subtype = $el.attr('data-validator-subtype');
				var regex = pattern ? new RegExp(pattern) : patterns[subtype];
				isValid = isValid && (isOptional($el, value) || regex.test(value));
			});
			callback(isValid);
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
				thisMonth;

			thisYear = String(now.getFullYear());
			thisMonth = zeroPad(now.getMonth() + 1, 2);

			if (yearVal.length === 2) {
				thisYear = thisYear.slice(-2);
			}

			callback(+(thisYear + thisMonth) <= +(yearVal + monthVal));
		}
	);

	$.uvalidator.addGroupMethod(
		':input.required:not(:radio,:checkbox)',
		'input-group-required',
		function (value, items, callback) {
			var isValid = true;
			items.each(function () {
				isValid = isValid && $.trim($(this).val()) !== '';
			});
			callback(isValid);
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
	/**
	 * Validates URLs not limited to http/https/ftp scheme
	 */
	$.uvalidator.addMethod(
		'.input-any-url,.any-url',
		'any-url',
		function (value, element, callback) {
			var valid = isOptional(element, value) || patterns.anyurl.test(value);

			callback(valid);
		}
	);
	/**
	 * Validates URLS with http/https/ftp scheme
	 */
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
		'.cvv',
		'cvv',
		function (value, element, callback) {
			var cardNumber, isAmex, valid, ccField;

			ccField = element.attr('data-validator-ccfield');

			cardNumber = $(ccField).val();

			if (cardNumber) {
				isAmex = cardNumber.match(/^3[47]\d{13}$/);

				if (isAmex) {
					valid = value.match(/^\d{4}$/);
				} else {
					valid = value.match(/^\d{3}$/);
				}
			} else {
				valid = value.match(/^\d{3}$/);
			}

			callback(valid);
		}
	);
	$.uvalidator.addMethod(
		'input[type=color], .input-color',
		'iscolor',
		function (value, element, callback) {
			callback(patterns.color.test(value) || value === '');
		}
	);

	$.uvalidator.addMethod(
		'input[type=tel], .input-tel',
		'tel',
		function (value, element, callback) {
			callback(patterns.tel.test(value));
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
			} else {
				regex = new RegExp(pattern);
				valid = regex.test(value);

				callback(valid);
			}
		}
	);

	$.uvalidator.addMethod(
		'.start-with-letter',
		'startwithletter',
		function (value, element, callback) {
			var valid = true;

			if (!/^[a-z]/i.test(value)) {
				valid = false;
			}
			callback(valid);
		}
	);

	$.uvalidator.addMethod('[minlength]', 'minlength', function(value, element, callback) {
		callback(value.length >= element.attr('minlength'));
	});

	$.uvalidator.addMethod('[maxlength]', 'maxlength', function(value, element, callback) {
		callback(value.length <= element.attr('maxlength'));
	});

	$.uvalidator.addMethod('[maxfilesize]', 'maxfilesize', function(value, element, callback) {
		if (!element[0].files) return;

		var fileLength = element[0].files.length;
		var i = 0;
		var valid = true;

		for (; i < fileLength ; i++) {
			if (valid) {
				valid = element[0].files[i].size < parseInt(element.attr('maxfilesize'), 10);
			}
		}

		callback(valid);
	});

	$.uvalidator.addMethod('[accept]', 'acceptfiles', function(value, element, callback) {
		if (!element[0].files) return;

		var fileLength = element[0].files.length;
		var i = 0;
		var valid = true;
		var acceptList = element.attr('accept') || [];

		for (; i < fileLength ; i++) {
			if (valid) {
				valid = acceptList.indexOf(element[0].files[i].type) > -1;
			}
		}

		callback(valid);
	});

}(window.jQuery));
