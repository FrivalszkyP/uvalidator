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
	$.uvalidatorSkin('base', {
		setFieldInvalid: function (field, args) {
			$(field).addClass('invalid').removeClass('valid').attr('aria-invalid', 'true')
				.closest('.control-group').addClass('error').removeClass('success');
		},
		setFieldValid: function (field, args) {
			$(field).addClass('valid').removeClass('invalid').attr('aria-invalid', 'false')
				.closest('.control-group').addClass('success').removeClass('error');
		},
		showFieldError: function (field, args) {
			var msg = this.getMessage(args),
				container,
				errorID = 'error-' + field.attr('id') + '-' + Math.ceil(Math.random() * 10000);

			field = $(field);
			container = field.closest('.control-group');
			container.find('.uerror').remove();

			$('<label />')
				.attr({
					'for': field.attr('id'),
					'id': errorID
				})
				.addClass('uerror')
				.html(msg).appendTo(container);

			field.attr('aria-describedBy', errorID);
		},
		hideFieldError: function (field, args) {
			$(field).removeAttr('aria-describedBy').closest('.control-group').find('.uerror').remove();
		}
	});
}(window.jQuery));
