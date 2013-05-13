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
    var skins = {},
        messages = {},
        defaultProto;

    function isFunction(func) {
        return typeof func === 'function';
    }

    function toArray(thing) {
        return Array.prototype.slice.call(thing);
    }

    defaultProto = {
        /**
         * @method setForm
         * @property {jQueryObject} form
         * @protected
         * @chainable
         */
        setForm: function (form, settings) {
            var that = $(this);
            this.form = form;
            settings = settings || {};

            function proxyTrigger(event) {
                var args = $.makeArray(arguments).slice(1);
                that.trigger(event, args);
            }

            form.uvalidator(settings)
                .on('formInvalid', $.proxy(this.onFormInvalid, this))
                .on('formValid', $.proxy(this.onFormValid, this))
                .on('fieldInvalid', $.proxy(this.onFieldInvalid, this))
                .on('fieldValid', $.proxy(this.onFieldValid, this))
                .on('startFieldValidation', $.proxy(this.onFieldValidationStart, this))
                .on('finishFieldValidation', $.proxy(this.onFieldValidationFinish, this))
                .on('startFormValidation', $.proxy(this.onFormValidationStart, this))
                .on('finishFormValidation', $.proxy(this.onFormValidationFinish, this))

                .on('formValid', $.proxy(this.resetResults, this))

                .on('formValid', proxyTrigger)
                .on('formInvalid', proxyTrigger)
                .on('fieldInvalid', proxyTrigger)
                .on('fieldValid', proxyTrigger)
                .on('startFieldValidation', proxyTrigger)
                .on('finishFieldValidation', proxyTrigger)
                .on('startFormValidation', proxyTrigger)
                .on('finishFormValidation', proxyTrigger);

            return this;
        },
        /**
         * @method on
         * @protected
         * @chainable
         */
        on: function () {
            var that = $(this);
            that.on.apply(that, toArray(arguments));
            return this;
        },
        /**
         * @method resetResults
         * @protected
         * @chainable
         */
        resetResults: function () {
            this.results = {};
            return this;
        },
        /**
         * Applies a custom error set on the form fields.
         * @method applyErrors
         * @param {Object} results The result set which contains the field
         * names and the error message
         * {
         *  fieldName1: {
         *      text: "Error message"
         *  },
         *  fieldName2: {
         *      text: "Error message2"
         *  }
         * }
         * @protected
         * @chainable
         */
        applyErrors: function (results) {
            var form = this.form,
                resultsStorage = {};

            $.each(results, function (key, result) {
                var field = form.find('[name="' + key + '"]'),
                    res;

                res = {
                    field: field,
                    message: result.text,
                    isValid: false
                };

                field.trigger('fieldInvalid', res);
                resultsStorage[key] = res;
            });
            this.form.trigger('formInvalid');

            this.results = resultsStorage;
            return this;
        },
        /**
         * @method getMessage
         * @return {String|Null} Message for the error
         */
        getMessage: function (args) {
            var msg = null;
            if (args.message) {
                msg = args.message;
            } else {
                msg = messages[args.validator];
                if (isFunction(msg)) {
                    msg = msg(args);
                }
            }
            return msg;
        },
        /**
         * Hides all error messages on the form
         * @method hideAllError
         */
        hideAllError: function () {
            this.form.find(':input').each($.proxy(function (index, field) {
                this.setFieldValid(field);
                this.hideFieldError(field);
            }, this));
        },
        /**
         * Callback of the FIELD_VALID event, hides the errors and sets field
         * valid.
         * @method onFieldValid
         * @param {jQueryEvent} fieldValidEvent
         * @param {Object} args Result object
         */
        onFieldValid: function (fieldValidEvent, args) {
            this.setFieldValid(fieldValidEvent.target, args);
            this.hideFieldError(fieldValidEvent.target, args);
        },
        /**
         * Callback of the FIELD_INVALID event, sets field invalid and shows
         * error message.
         * @method onFieldValid
         * @param {jQueryEvent} fieldValidEvent
         * @param {Object} args Result object
         */
        onFieldInvalid: function (fieldInvalidEvent, args) {
            this.setFieldInvalid(fieldInvalidEvent.target, args);
            this.showFieldError(fieldInvalidEvent.target, args);
        },
        /**
         * Must append and display the error message for a field
         * @method showFieldError
         */
        showFieldError: function () {},
        /**
         * Must add styles to show marker that the field is invalid
         * @method setFieldInvalid
         */
        setFieldInvalid: function () {},
        /**
         * Must add styles to show marker that the field is valid
         * @method setFieldValid
         */
        setFieldValid: function () {},
        /**
         * Removes/hides error message of a field
         * @method onFieldValidationStart
         * @method hideFieldError
         */
        hideFieldError: function () {},
        /**
         * Marks a field that validation is in progress on it
         * @method onFieldValidationStart
         */
        onFieldValidationStart: function () {},
        /**
         * Removes the mark of the field which shows that validation is in progress.
         * @method onFieldValidationFinish
         */
        onFieldValidationFinish: function () {},
        /**
         * Marks that the form validation is in progress
         * @method onFormValidationStart
         */
        onFormValidationStart: function () {},
        /**
         * Removes the mark of form which shows that the form validation is in progress.
         * @method onFormValidationFinish
         */
        onFormValidationFinish: function () {},
        /**
         * Callback, which called when form valid event triggereed.
         * @method onFormValid
         */
        onFormValid: function () {},
        /**
         * Callback, which called when form invalid event triggereed.
         * @method onFormInvalid
         */
        onFormInvalid: function () {}
    };
    function createSkin(name, proto) {
        proto = $.extend({}, defaultProto, proto);

        var Skin = function UvalidatorSkin() {};
        Skin.prototype = proto;

        skins[name] = function () {
            var skin = new Skin();
            skin.superclass = {};
            $.each(defaultProto, function (key, val) {
                skin.superclass[key] = function () {
                    return val.apply(skin, toArray(arguments));
                };
            });
            return skin;
        };
    }
    function applySkin(skin, form, settings) {
        var skinInstance = new skins[skin]();
        return skinInstance.setForm(form, settings);
    }
    $.uvalidatorSkin = createSkin;
    $.uvalidatorApplySkin = applySkin;
    /**
     * @method addMessage
     * @param {String} validator The name of the validator.
     * @param {String,Function} message The error message or a function which
     * should return the error message
     */
    $.uvalidatorSkin.addMessage = function (validator, message) {
        messages[validator] = message;
    };
    /**
     * @method addMessages
     * @param {Array} customMessages Array of custom messages. Every item in
     * the array should be an array, where the first element is the name of the
     * validator, the second element must be the error message or a function
     * which will return the error message. If it's a function a validation
     * result object will be passed to it
     */
    $.uvalidatorSkin.addMessages = function (customMessages) {
        var ml, i, msg;
        for (i = 0, ml = customMessages.length; i < ml; i += 1) {
            msg = customMessages[i];
            messages[msg[0]] = msg[1];
        }
    };
}(window.jQuery));
