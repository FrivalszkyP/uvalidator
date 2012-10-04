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
        submitButton = $('#SubmitButton'),
        spies;

    spies = {
        fieldInvalid: sinon.spy(),
        fieldValid: sinon.spy(),
        formInvalid: sinon.spy(),
        formValid: sinon.spy()
    };

	coreSuite = new Y.Test.Suite({
		name: 'validator tests',
		setUp: function () {
            $('form').uvalidator()
                .on('fieldInvalid', $.proxy(function () {
                    spies.fieldInvalid();
                }, this))
                .on('fieldValid', $.proxy(function () {
                    spies.fieldValid();
                }, this))
                .on('formInvalid', $.proxy(function () {
                    spies.formInvalid();
                }, this))
                .on('formValid', $.proxy(function () {
                    spies.formValid();
                }, this));
		},
		tearDown: function () {
		}
	});
	coreSuite.add(new Y.Test.Case({
		name: "Required tests",
        setUp: function () {
            spies.fieldInvalid.reset();
            spies.fieldValid.reset();
            spies.formInvalid.reset();
            spies.formValid.reset();
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
        "check if spies were called on an invalid form": function () {
            Y.Assert.isTrue(spies.fieldInvalid.called);
            Y.Assert.isTrue(spies.fieldValid.called);
            Y.Assert.isTrue(spies.formInvalid.called);
            Y.Assert.isFalse(spies.formValid.called);
        },
        "check if spies were called correctly on an invalid form": function () {
            Y.Assert.areSame(6, spies.fieldInvalid.callCount);
            Y.Assert.areSame(6, spies.fieldValid.callCount);
            Y.Assert.isTrue(spies.formInvalid.calledOnce);
            Y.Assert.isFalse(spies.formValid.called);
        }
	}));
	Y.Test.Runner.add(coreSuite);
	Y.Test.Runner.run();
});

