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
                that.trigger(event.type, {originalEvent: event});
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
        hideAllError: function () {
            $(':input').each($.proxy(function (index, field) {
                this.setFieldValid(field);
                this.hideFieldError(field);
            }, this));
        },
        onFieldValid: function (fieldValidEvent, args) {
            this.setFieldValid(fieldValidEvent.target, args);
            this.hideFieldError(fieldValidEvent.target, args);
        },
        onFieldInvalid: function (fieldInvalidEvent, args) {
            this.setFieldInvalid(fieldInvalidEvent.target, args);
            this.showFieldError(fieldInvalidEvent.target, args);
        },
        showFieldError: function () {},
        setFieldInvalid: function () {},
        setFieldValid: function () {},
        hideFieldError: function () {},
        onFieldValidationStart: function () {},
        onFieldValidationFinish: function () {},
        onFormValidationStart: function () {},
        onFormValidationFinish: function () {},
        onFormValid: function () {},
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
