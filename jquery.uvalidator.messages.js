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

/*jslint browser: true*/
(function ($) {
	"use strict";
	$.uvalidatorSkin.addMessages([
		['required', 'The field is required.'],
		['number', 'Type a number, please.'],
		['userpassword', 'Password must contain at least 7 characters including at' +
			' least 1 capitalized letter AND at least 1 number.'],
		['passwordverify', 'Password must be the same as above.'],
		['creditcard', 'Invalid credit card number.'],
		['url', 'Please type a valid url.'],
		['email', 'Please type a valid email address.'],
		['min', function (args) {
			var minVal = args.field.attr('data-validation-min') || args.field.attr('min');
			return 'The minimum value is ' + minVal + '.';
		}],
		['max', function (args) {
			var maxVal = args.field.attr('data-validation-max') || args.field.attr('max');
			return 'The maximum value is ' + maxVal + '.';
		}],
		['pattern', 'Invalid format.']
	]);
}(window.jQuery));
