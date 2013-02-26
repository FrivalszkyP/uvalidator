/*jslint browser: true*/
/*global YUI: true, sinon: true, $: true */
YUI().use('node', 'test', 'test-console', function (Y) {
	"use strict";
    var suite,
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
        validClass = 'input-valid',
        spies = {},
        form = $('#TestForm'),
        validator;

    suite = new Y.Test.Suite({
        setUp: function () {
            spies.startFormValidation = sinon.stub();
            spies.finishFormValidation = sinon.stub();
            spies.fieldValid = sinon.stub();
            spies.fieldInvalid = sinon.stub();
            spies.formValid = sinon.stub();
            spies.formInvalid = sinon.stub();
            spies.startFieldValidation = sinon.stub();
            spies.finishFieldValidation = sinon.stub();
            validator = $.uvalidatorApplySkin("ustream", form);
            validator.on($.uvalidator.events.START_FORM_VALIDATION, spies.startFormValidation);
            validator.on($.uvalidator.events.FINISH_FORM_VALIDATION, spies.finishFormValidation);
            validator.on($.uvalidator.events.FIELD_VALID, spies.fieldValid);
            validator.on($.uvalidator.events.FIELD_INVALID, spies.fieldInvalid);
            validator.on($.uvalidator.events.FORM_VALID, spies.formValid);
            validator.on($.uvalidator.events.FORM_INVALID, spies.formInvalid);
            validator.on($.uvalidator.events.START_FIELD_VALIDATION, spies.startFieldValidation);
            validator.on($.uvalidator.events.FINISH_FIELD_VALIDATION, spies.finishFieldValidation);
        },
        tearDown: function () {
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
    });

    function tearDown() {
        spies.startFormValidation.reset();
        spies.finishFormValidation.reset();
        spies.fieldValid.reset();
        spies.fieldInvalid.reset();
        spies.formValid.reset();
        spies.formInvalid.reset();
        spies.startFieldValidation.reset();
        spies.finishFieldValidation.reset();
    }

    suite.add(new Y.Test.Case({
        name: "Test field is valid",
        setUp: function () {
            this.callback = sinon.spy();
            var field = form.find('input:first');
            field.val('');
            $.uvalidator.fieldIsValid(field, this.callback);
        },
        tearDown: tearDown,
        "startFieldValidation should be called ": function () {
            Y.Assert.isTrue(spies.startFieldValidation.called, "start field validation");
            Y.Assert.isTrue(spies.startFieldValidation.calledOnce,
                            "start field validation called once");
        },
        "finishFieldValidation should be called": function () {
            Y.Assert.isTrue(spies.finishFieldValidation.called, "finish field validation");
            Y.Assert.isTrue(spies.finishFieldValidation.calledOnce,
                            "finish field validation called once");
        },
        "fieldInvalid should not be called": function () {
            Y.Assert.isFalse(spies.fieldInvalid.called, "field invalid");
        },
        "fieldValid should not be called": function () {
            Y.Assert.isFalse(spies.fieldValid.called, "field valid");
        },
        "this.callback should be called": function () {
            Y.Assert.isTrue(this.callback.called, "this.callback call");
            Y.Assert.isTrue(this.callback.calledOnce,
                            "this.callback call called once");
        },
        "finishFormValidation should not be called": function () {
            Y.Assert.isFalse(spies.finishFormValidation.called, "finish form validation");
        },
        "startFormValidation should not be called": function () {
            Y.Assert.isFalse(spies.startFormValidation.called, "start form validation");
        },
        "form valid should not be called": function () {
            Y.Assert.isFalse(spies.formValid.called, "start form validation");
        }
    }));

    suite.add(new Y.Test.Case({
        name: "Test validateField",
        setUp: function () {
            this.callback = sinon.spy();
            var field = form.find('input:first');
            field.val('');
            $.uvalidator.validateField(field, this.callback);
        },
        tearDown: tearDown,
        "startFieldValidation should be called ": function () {
            Y.Assert.isTrue(spies.startFieldValidation.called, "start field validation");
            Y.Assert.isTrue(spies.startFieldValidation.calledOnce,
                            "start field validation called once");
        },
        "finishFieldValidation should be called": function () {
            Y.Assert.isTrue(spies.finishFieldValidation.called, "finish field validation");
            Y.Assert.isTrue(spies.finishFieldValidation.calledOnce,
                            "finish field validation called once");
        },
        "fieldInvalid should not be called": function () {
            Y.Assert.isTrue(spies.fieldInvalid.called, "field invalid");
        },
        "fieldValid should not be called": function () {
            Y.Assert.isFalse(spies.fieldValid.called, "field invalid");
        },
        "this.callback should be called": function () {
            Y.Assert.isTrue(this.callback.called, "this.callback call");
            Y.Assert.isTrue(this.callback.calledOnce,
                            "this.callback call called once");
        },
        "finishFormValidation should not be called": function () {
            Y.Assert.isFalse(spies.finishFormValidation.called, "finish form validation");
        },
        "startFormValidation should not be called": function () {
            Y.Assert.isFalse(spies.startFormValidation.called, "start form validation");
        },
        "form valid should not be called": function () {
            Y.Assert.isFalse(spies.formValid.called, "start form validation");
        }
    }));

    suite.add(new Y.Test.Case({
        name: "Test calling $.uvalidator.validate validates the form",
        setUp: function () {
            $.uvalidator.validate(form[0]);
        },
        tearDown: tearDown,
        "startFormValidation should be called ": function () {
            Y.Assert.isTrue(spies.startFormValidation.called, "start form validation");
            Y.Assert.isTrue(spies.startFormValidation.calledOnce,
                            "start form validation called once");
        },
        "finishFormValidation should be called": function () {
            Y.Assert.isTrue(spies.finishFormValidation.called, "finish form validation");
            Y.Assert.isTrue(spies.finishFormValidation.calledOnce,
                            "finish form validation called once");
        },
        "formInvalid should be called": function () {
            Y.Assert.isTrue(spies.formInvalid.called, "form invalid called");
            Y.Assert.isTrue(spies.formInvalid.calledOnce,
                            "form invalid called once");
        },
        "formValid should not be called": function () {
            Y.Assert.isFalse(spies.formValid.called, "form valid called");
        }
    }));
	Y.Test.Runner.add(suite);
	Y.Test.Runner.run();
});
