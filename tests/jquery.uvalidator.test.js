/*jslint browser: true*/
/*global YUI: true, sinon: true, $: true */
YUI().use('node', 'test', 'test-console', function (Y) {
	"use strict";
	var coreSuite,
        radio1 = $('#radio-1'),
        radio2 = $('#radio-2'),
        radio3 = $('#radio-3'),
        radio4 = $('#radio-4'),
        field1 = $('#first'),
        field2 = $('#fooNotRequired'),
        field3 = $('#fooNumber'),
        dateYear = $('#startDateYear'),
        dateMonth = $('#startDateMonth'),
        dateYearNotRequired = $('#startDateYearNotRequired'),
        dateMonthNotRequired = $('#startDateMonthNotRequired'),
        submitButton = $('#SubmitButton');

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
		name: "Required tests",
        setUp: function () {
            $(':input').removeClass('valid invalid').val();
            $(':radio').prop('checked', false);
            $('#first,#fooNotRequired,#fooNumber').val('');
            $('#startDateYear,#startDateMonth').val('');
            $('#startDateYearNotRequired,#startDateMonthNotRequired').val('');
            $('#selectField').val('');
            $('form').submit();
        },
        tearDown: function () {
            $(':input').removeClass('valid invalid');
        },
		"check if simple input field has invalid class": function () {
            Y.Assert.isTrue(field1.hasClass('invalid'));
            Y.Assert.isFalse(field1.hasClass('valid'));
        },
		"check if simple, not required input field has valid class": function () {
            Y.Assert.isTrue(field2.hasClass('valid'));
            Y.Assert.isFalse(field2.hasClass('invalid'));
        },
		"check if radio fields has invalid class": function () {
            Y.Assert.isTrue(radio1.hasClass('invalid'));
            Y.Assert.isTrue(radio2.hasClass('invalid'));
            Y.Assert.isFalse(radio1.hasClass('valid'));
            Y.Assert.isFalse(radio2.hasClass('valid'));
        },
		"check if not required radio fields has valid class": function () {
            Y.Assert.isTrue(radio3.hasClass('valid'), 'radio-3 has no valid class');
            Y.Assert.isTrue(radio4.hasClass('valid'), 'radio-4 has no valid class');
            Y.Assert.isFalse(radio4.hasClass('invalid'));
            Y.Assert.isFalse(radio4.hasClass('invalid'));
        },
        "check if number field has no invalid class": function () {
            Y.Assert.isTrue(field3.hasClass('valid'));
            Y.Assert.isFalse(field3.hasClass('invalid'));
        },
		"check if date fields has invalid class": function () {
            Y.Assert.isTrue(dateYear.hasClass('invalid'));
            Y.Assert.isTrue(dateMonth.hasClass('invalid'));
            Y.Assert.isFalse(dateYear.hasClass('valid'));
            Y.Assert.isFalse(dateMonth.hasClass('valid'));
        },
		"check if not required date fields has invalid class": function () {
            Y.Assert.isTrue(dateYearNotRequired.hasClass('valid'));
            Y.Assert.isTrue(dateMonthNotRequired.hasClass('valid'));
            Y.Assert.isFalse(dateYearNotRequired.hasClass('invalid'));
            Y.Assert.isFalse(dateMonthNotRequired.hasClass('invalid'));
        },
		"check if select field has invalid class": function () {
            Y.Assert.isTrue($('#selectField').hasClass('invalid'));
            Y.Assert.isFalse($('#selectField').hasClass('valid'));
		},
		"check if button field has no invalid or valid class": function () {
            Y.Assert.isFalse(submitButton.hasClass('invalid'), 'button has invalid class');
            Y.Assert.isFalse(submitButton.hasClass('valid'), 'button has valid class');
		}
	}));
	coreSuite.add(new Y.Test.Case({
		name: "Date specific tests",
        setUp: function () {
            $(':input').removeClass('valid invalid');
            dateYear.val('2012-12-12');
            dateMonth.val('');
            dateYearNotRequired.val('2012-12-12');
            dateMonthNotRequired.val('');
            $('form').submit();
        },
        tearDown: function () {
            dateYear.val('');
            dateMonth.val('');
            $(':input').removeClass('valid invalid');
        },
		"check if date fields has invalid class": function () {
            Y.Assert.isTrue(dateYear.hasClass('invalid'));
            Y.Assert.isTrue(dateMonth.hasClass('invalid'));
            Y.Assert.isFalse(dateYear.hasClass('valid'));
            Y.Assert.isFalse(dateMonth.hasClass('valid'));
        },
		"check if not required date fields has invalid class": function () {
            Y.Assert.isTrue(dateYearNotRequired.hasClass('valid'));
            Y.Assert.isTrue(dateMonthNotRequired.hasClass('valid'));
            Y.Assert.isFalse(dateYearNotRequired.hasClass('invalid'));
            Y.Assert.isFalse(dateMonthNotRequired.hasClass('invalid'));
        }
	}));
	coreSuite.add(new Y.Test.Case({
		name: "Required tests if fields filled",
        setUp: function () {
            $(':input').removeClass('valid invalid');
            field1.val('foo bar baz');
            field2.val('foo bar baz');
            field3.val(123);
            $(':radio[required]:first').prop('checked', true);
            $(':radio:not([required]):first').prop('checked', true);
            dateYear.val('2012-12-12');
            dateMonth.val('2012-12-24');
            dateYearNotRequired.val('foo bar baz');
            dateMonthNotRequired.val('foo bar baz');
            $('#selectField').val('foo');
            $('form').submit();
        },
        tearDown: function () {
            field1.val('');
            field2.val('');
            field3.val('');
            $(':input').removeClass('valid invalid');
            $(':radio[required]:first').prop('checked', false);
            $(':radio:not([required]):first').prop('checked', false);
            dateYear.val('');
            dateMonth.val('');
            dateYearNotRequired.val('');
            dateMonthNotRequired.val('');
            $('#selectField').val('');
            $(':input').removeClass('valid invalid');
        },
		"check if simple input field has no invalid class": function () {
            Y.Assert.isTrue(field1.hasClass('valid'));
            Y.Assert.isFalse(field1.hasClass('invalid'));
        },
		"check if simple, not required input field has valid class": function () {
            Y.Assert.isTrue(field2.hasClass('valid'));
            Y.Assert.isFalse(field2.hasClass('invalid'));
        },
        "check if not required number field has invalid class": function () {
            Y.Assert.isTrue(field3.hasClass('valid'));
            Y.Assert.isFalse(field3.hasClass('invalid'));
        },
		"check if radio fields has no invalid class": function () {
            Y.Assert.isTrue(radio1.hasClass('valid'));
            Y.Assert.isTrue(radio2.hasClass('valid'));
            Y.Assert.isFalse(radio1.hasClass('invalid'));
            Y.Assert.isFalse(radio2.hasClass('invalid'));
        },
		"check if not required radio fields has valid class": function () {
            Y.Assert.isTrue(radio3.hasClass('valid'), 'radio-3 has no valid class');
            Y.Assert.isTrue(radio4.hasClass('valid'), 'radio-4 has no valid class');
            Y.Assert.isFalse(radio4.hasClass('invalid'));
            Y.Assert.isFalse(radio4.hasClass('invalid'));
        },
		"check if date fields has no invalid class": function () {
            Y.Assert.isTrue(dateYear.hasClass('valid'));
            Y.Assert.isTrue(dateMonth.hasClass('valid'));
            Y.Assert.isFalse(dateYear.hasClass('invalid'));
            Y.Assert.isFalse(dateMonth.hasClass('invalid'));
        },
		"check if not required date fields has invalid class": function () {
            Y.Assert.isTrue(dateYearNotRequired.hasClass('valid'));
            Y.Assert.isTrue(dateMonthNotRequired.hasClass('valid'));
            Y.Assert.isFalse(dateYearNotRequired.hasClass('invalid'));
            Y.Assert.isFalse(dateMonthNotRequired.hasClass('invalid'));
        },
		"check if select field has invalid class": function () {
            Y.Assert.isTrue($('#selectField').hasClass('valid'));
            Y.Assert.isFalse($('#selectField').hasClass('invalid'));
		},
		"check if button field has no invalid or valid class": function () {
            Y.Assert.isFalse(submitButton.hasClass('invalid'), 'button has invalid class');
            Y.Assert.isFalse(submitButton.hasClass('valid'), 'button has valid class');
		}
	}));
	Y.Test.Runner.add(coreSuite);
	Y.Test.Runner.run();
});

