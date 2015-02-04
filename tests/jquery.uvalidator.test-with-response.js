/*jslint browser: true*/
/*global YUI: true, sinon: true, $: true */
var yui = new YUI();
yui.use('node', 'test', 'test-console', function (Y) {
	'use strict';
	var form = $('form'),
		messages = $('#Messages'),
		coreSuite,
        radio1 = $('#radio-1'),
        radio2 = $('#radio-2'),
        field1 = $('#first'),
		validClass = 'input-valid',
		invalidClass = 'input-invalid',
		errorLabelClass = 'tooltip-error',
		server;

	function createServer() {
		server = sinon.fakeServer.create();
		server.respondWith('POST', '/submit/form', function (xhr) {
			var errors = [],
				response = {};
			if (form.find('[name="foo"]').val() % 2) {
				errors.push(['foo', 'Look! This field is invalid']);
			}
			if (form.find('[name="bar"]:checked').val() === '2') {
				errors.push(['bar', 'Grrr, it\'s wrong...']);
			}
			response.success = errors.length < 1;
			if (!response.success) {
				response.formFields = {};
				errors.forEach(function (error) {
					response.formFields[error[0]] = {
						text: error[1]
					};
				});
			}
			xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify(response));
		});
	}

	function destroyServer() {
		server.restore();
	}

	coreSuite = new Y.Test.Suite({
		name: 'validator with response tests',
		setUp: function () {
			var skin;

            messages.hide();
            skin = $.uvalidatorApplySkin('ustream', form);
			$('#HideAllErrors').click(function () {
				skin.hideAllError();
			});
            skin.on('formValid', function () {
                $.ajax({
                    type: 'post',
                    url: '/submit/form',
                    success: function (response) {
                        if (response.success) {
                            messages
                                .show()
                                .text('Form submitted')
                                .addClass('alert-success')
                                .removeClass('alert-error');
                        } else {
                            skin.applyErrors(response.formFields);
                        }
                    },
                    error: function (arg) {
                        // console.log('error', arguments);
                    }
                });
                server.respond();
                /*
                setTimeout(function () {
                    if (results.foo || results.bar) {
                    } else {
                    }
                }, 5000);
                */
            }).on('formInvalid', function () {
                messages
                    .show()
                    .text('Form is invalid :(')
                    .removeClass('alert-success')
                    .addClass('alert-error');

            }).on('formValid', function () {
                messages
                    .show()
                    .text('Form submitted')
                    .addClass('alert-success')
                    .removeClass('alert-error');
            });
		},
		tearDown: function () {
            // $('.control-group').removeClass('success error');
		}
	});

	coreSuite.add(new Y.Test.Case({
		name: 'Test ajax form submission',
		setUp: function () {
			createServer();
			$(':input').removeClass([validClass, invalidClass].join(' ')).val();
			$(':radio').prop('checked', false);
			$('#first,#fooNotRequired,#fooNumber').val('');
			$('#startDateYear,#startDateMonth').val('');
			field1.val('123');
			radio2.prop('checked', true);
		},
		tearDown: function () {
			destroyServer();
			$(':input').removeClass([validClass, invalidClass].join(' '));
			$('#.control-group').removeClass('error success');
		},
		'Test invalid fields': function () {
			$('form').submit();

			this.wait(function () {

				var controlGroups = $('.' + invalidClass).closest('.control-group'),
					field1Error,
					radioError;

				Y.Assert.areSame(2, controlGroups.length, 'control group number not 2');

				field1Error = field1.closest('.control-group').find('.' + errorLabelClass);

				Y.Assert.areSame(1, field1Error.length, 'Error label not found');
				Y.Assert.areSame('Look! This field is invalid', field1Error.text());
				radioError = $(controlGroups[1]).find('.' + errorLabelClass);
				Y.Assert.areSame(2, radioError.length, 'Error label not found');
			}, 100);
		},
		'Test if field1 valid on server too': function () {
			var controlGroups;

			field1.val(12).change();
			controlGroups = $('.' + invalidClass).closest('.control-group');
			Y.Assert.areSame(0, controlGroups.length, 'Found invalid field');
		},
		'Test if radio is valid on server too': function () {
			var controlGroups;

			radio1.prop('checked', true).change();
			controlGroups = $('.control-group.error');
			Y.Assert.isTrue(controlGroups.length === 0, 'control group number not 0');
			this.wait(function () {
				Y.Assert.isTrue($('.alert').hasClass('alert-success'),
								'alert div has no success class');
			}, 100);
		}

    }));
	Y.Test.Runner.add(coreSuite);
	Y.Test.Runner.run();
});
