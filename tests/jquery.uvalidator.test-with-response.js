/*jslint browser: true*/
/*global YUI: true, sinon: true, $: true */
YUI().use('node', 'test', 'test-console', function (Y) {
	"use strict";
	var form = $('form'),
		messages = $('#Messages'),
		coreSuite,
        radio1 = $('#radio-1'),
        radio2 = $('#radio-2'),
        radio3 = '#radio-3',
        radio4 = '#radio-4',
        field1 = $('#first'),
        field2 = '#fooNotRequired',
        field3 = '#fooNumber',
        submitButton = '#SubmitButton';

	coreSuite = new Y.Test.Suite({
		name: 'validator tests',
		setUp: function () {
            var server = sinon.fakeServer.create(),
                skin;

            this.server = server;

            server.respondWith('POST', '/submit/form', function (xhr) {
                var errors = [],
                    response = {};
                if (form.find('[name="foo"]').val() % 2) {
                    errors.push(['foo', "Look! This field is invalid"]);
                }
                if (form.find('[name="bar"]:checked').val() === "2") {
                    errors.push(['bar', "Grrr, it's wrong..."]);
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


            messages.hide();
            skin = $.uvalidatorApplySkin("ustream", form);
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
            this.server.restore();
		}
	});

	coreSuite.add(new Y.Test.Case({
		name: "Test ajax form submission",
		setUp: function () {
			$(':input').removeClass('valid invalid').val();
			$(':radio').prop('checked', false);
			$('#first,#fooNotRequired,#fooNumber').val('');
			$('#startDateYear,#startDateMonth').val('');
			field1.val('123');
			radio2.prop('checked', true);
		},
		tearDown: function () {
			$(':input').removeClass('valid invalid');
			$('#.control-group').removeClass('error success');
		},
		"Test invalid fields": function () {
			$('form').submit();
			this.wait(function () {

				var controlGroups = $('.control-group.error'),
					field1Error,
					radioError;

				Y.Assert.isTrue(controlGroups.length === 2, 'control group number not 2');
				field1Error = field1.closest('.control-group').find('.uerror');
				Y.Assert.isTrue(field1Error.length === 1, 'Uerror not found');
				Y.Assert.areSame('Look! This field is invalid', field1Error.text());
				radioError = $(controlGroups[1]).find('.uerror');
				Y.Assert.isTrue(radioError.length === 1, 'Uerror not found');
			}, 100);
		},
		"Test if field1 valid on server too": function () {
			var controlGroups,
				radioError;

			field1.val(12).change();
			controlGroups = $('.control-group.error');
			Y.Assert.isTrue(controlGroups.length === 1, 'control group number not 1');
			radioError = controlGroups.find('.uerror');
			Y.Assert.isTrue(radioError.length === 1, 'Uerror not found');
		},
		"Test if radio is valid on server too": function () {
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

