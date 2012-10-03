/*jslint browser: true*/
(function ($) {
    "use strict";
    $.uvalidatorSkin('ustream', {
        setForm: function (form) {
            this.superclass.setForm(form);
            this.form.delegate(':input', 'focus', $.proxy(function (focusEvent) {
                $(focusEvent.target).closest('.control-group').addClass('focused');
            }, this));
            this.form.delegate(':input', 'blur', $.proxy(function (focusEvent) {
                $(focusEvent.target).closest('.control-group').removeClass('focused');
            }, this));
            return this;
        },
        findNextInvalid: function () {
            return this.form.find('.control-group.error :input:first');
        },
        isErrorMessageShown: function () {
            return this.form.find('.uerror').length > 0;
        },
        isFirstErrorMessageShown: function () {
            var controlGroups = this.form.find('.control-group.error'),
                message = this.form.find('.uerror').closest('.control-group');

            return controlGroups.length > 0 && controlGroups[0] === message[0];
        },
        setFieldInvalid: function (field, args) {
            $(field).addClass('invalid').removeClass('valid info')
                .closest('.control-group').addClass('error').removeClass('success info');
        },
        setFieldValid: function (field, args) {
            $(field).addClass('valid').removeClass('invalid info')
                .closest('.control-group').addClass('success').removeClass('error info');
        },
        addFieldError: function (field, args) {
            var msg = this.getMessage(args),
                container,
                errorElem;

            field = $(field);
            container = field.closest('.control-group');
            errorElem = container.find('.uerror');

            if (errorElem.length < 1) {
                errorElem = $('<label />')
                    .attr('for', field.attr('id'))
                    .addClass('uerror')
                    .appendTo(container);
            }
            /*
            if (this.isErrorMessageShown()) {
                if (this.isFirstErrorMessageShown()) {
                    return;
                }
                //this.form.find('.uerror').remove();
            }
            */
            errorElem.html(msg);
        },
        showFieldError: function (field, args) {
            this.addFieldError(field, args);
        },
        showNextError: function (fieldValidEvent, args) {
            var nextInvalid = this.findNextInvalid(),
                nextName;

            if (nextInvalid.length > 0 && !this.isErrorMessageShown()) {
                if (this.results) {
                    nextName = nextInvalid.attr('name');
                }
                if (nextName) {
                    this.showFieldError(nextInvalid, this.results[nextName]);
                } else {
                    $.uvalidator.validateField(nextInvalid, function () {});
                }
            }
        },
        hideFieldError: function (field, args) {
            $(field).closest('.control-group').find('.uerror').remove();
        },
        onFieldValid: function (fieldValidEvent, args) {
            this.superclass.onFieldValid(fieldValidEvent, args);
            this.showNextError(fieldValidEvent, args);
        },
        onFieldValidationStart: function (event, field) {
            $(field).removeClass('valid invalid')
                .closest('.control-group').addClass('info')
                .removeClass('error valid success ');
        },
        onFieldValidationFinish: function (field) {
            $(field).closest('.control-group').removeClass('info');
        },
        onFormInvalid: function () {
            this.form.find(':input.invalid:first').focus();
        }
    });
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
