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
    function getCorrectField(field) {
        var nodeName = field.nodeName;
        field = $(field);
        if (nodeName === 'SELECT') {
            field = field.closest('.control-select');
        }
        return field;
    }
    $.uvalidatorSkin('ustream', {
        setForm: function (form, settings) {
            this.superclass.setForm(form, settings);
            this.form.delegate(':input', 'focus', $.proxy(function (focusEvent) {
                $(focusEvent.target).closest('.control-group').addClass('focused');
            }, this));
            this.form.delegate(':input', 'blur', $.proxy(function (focusEvent) {
                $(focusEvent.target).closest('.control-group').removeClass('focused');
            }, this));
            return this;
        },
        setFieldInvalid: function (field, args) {
            field = getCorrectField(field);
            field.addClass('input-invalid').removeClass('input-valid');
        },
        setFieldValid: function (field, args) {
            field = getCorrectField(field);
            field.addClass('input-valid').removeClass('input-invalid');
        },
        addFieldError: function (field, args) {
            var msg = this.getMessage(args),
                selectGroup,
                container,
                fieldOrGroup,
                errorElem;

            fieldOrGroup = args.field;
            container = fieldOrGroup.closest('.control-group');
            selectGroup = container.find('>.control-select');

            if (selectGroup.length > 0) {
                container = selectGroup;
            }

            errorElem = container.find('.tooltip-error');

            if (errorElem.length < 1) {
                errorElem = $('<span />')
                        // .attr('for', fieldOrGroup.attr('id'))
                        .addClass('tooltip-error');

                if (fieldOrGroup[0].nodeName === 'SELECT') {
                    fieldOrGroup.next('span.select').after(errorElem);
                } else {
                    fieldOrGroup.after(errorElem);
                }
            }
            errorElem.html(msg);
        },
        showFieldError: function (field, args) {
            this.addFieldError(field, args);
        },
        hideFieldError: function (field, args) {
            $(field).closest('.control-group').find('.tooltip-error').remove();
        },
        onFormInvalid: function () {
            this.form
                    .find(':input.input-invalid,.control-select.input-invalid > select')
                    .first().focus();
        }
    });
}(window.jQuery));
