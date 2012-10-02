/*jslint browser: true*/
(function ($) {
    "use strict";
    $.uvalidatorSkin('ustream', {
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
        showFieldError: function (field, args) {
            var msg = this.getMessage(args),
                container,
                errorElem;

            field = $(field);
            container = field.closest('.control-group');
            container.find('.uerror').remove();

            if (this.isErrorMessageShown()) {
                if (this.isFirstErrorMessageShown()) {
                    return;
                }
                this.form.find('.uerror').remove();
            }
            $('<label />')
                .attr('for', field.attr('id'))
                .addClass('uerror')
                .html(msg).appendTo(container);
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
        }
    });
    $.uvalidatorSkin.addMessages([
        ['required', 'The field is required'],
        ['number', 'Type a valid number, please'],
        ['userpassword', 'Password must contain at least 7 characters including at' +
            ' least 1 capitalized letter AND at least 1 number.'],
        ['passwordverify', 'Password must be the same as above.']
    ]);
}(window.jQuery));
