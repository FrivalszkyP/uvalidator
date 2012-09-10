/*jslint browser:true*/
(function ($) {
    "use strict";
    var defaults,
        events,
        validatorManager,
        dbg;

    /**
     * Default settings
     * @property defaults
     * @type Object
     */
    defaults = {};
    events = {
        FIELD_VALID: 'fieldValid',
        FIELD_INVALID: 'fieldInvalid',
        FORM_VALID: 'formValid',
        FORM_INVALID: 'formInvalid'
    };
    if (window.console) {
        dbg = window.console.log;
    }

    validatorManager = (function () {
        var validators = [],
            validatorsByName = {};
        return {
            createValidator: function createValidator(selector, name, fn) {
                return {
                    fn: fn,
                    name: name,
                    selector: selector
                };
            },
            getValidatorByIndex: function getValidatorByIndex(index) {
                return validators[index];
            },

            /**
            * @method getValidatorIndexByName
            * @param {String} name The index of the validator
            * @private
            * @return {Integer} Returns the index of the validator with the name. If
            * the validator not found, returns -1
            */
            getValidatorIndexByName: function getValidatorIndexByName(name) {
                var index = -1;
                if (typeof validatorsByName[name] === 'nubmer') {
                    index = validatorsByName[name];
                }
                return index;
            },

            /**
            * @method getValidatorByName
            * @param {String} name Name of the validator
            * @private
            * @return {Validator,Null} Returns the validator object if it's found or
            * null if no such validator
            */
            getValidatorByName: function getValidatorByName(name) {
                var index = validatorManager.getValidatorIndexByName(name),
                    validator = null;

                if (index > -1) {
                    validator = validators[index];
                }
                return validator;
            },


            addValidatorMethod: function addValidatorMethod(selector, name, fn) {
                var currentIndex, index, validatorObject;

                currentIndex = validatorManager.getValidatorIndexByName(name);

                // overwrites the existing method
                index = currentIndex > -1 ? currentIndex : validators.length;
                validatorObject = validatorManager.createValidator(selector, name, fn);

                validatorsByName[name] = index;
                validators[index] = validatorObject;
            },
            len: function () {
                return validators.length;
            }
        };
    }());

    function validateWith(value, field, name, callback) {
        var validator = validatorManager.getValidatorByName(name);
        if (validator) {
            validator(value, field, callback);
        } else {
            callback(true);
        }
    }

    function validateField(field, callback) {
        var vl, validator, value, result;

        field = $(field);
        value = field.is(':checkbox,:radio') ? field.is(':checked') : field.val();
        vl = validatorManager.len();

        result = {
            isValid: true,
            index: 0,
            field: field
        };

        function onValidate(isValid) {
            result.isValid = isValid;
            result.index += 1;
            if (result.index < vl && result.isValid) {
                validate();
            } else {
                var output = {
                    isValid: result.isValid
                };
                if (!result.isValid) {
                    output.validator = validator.name;
                }
                callback(output, field);
            }
        }

        function validate() {
            while (result.index < vl && result.isValid) {
                validator = validatorManager.getValidatorByIndex(result.index);
                if (field.is(validator.selector)) {
                    validator.fn(value, field, onValidate);
                } else {
                    result.index += 1;
                    if (result.index >= vl) {
                        // if not matched any validator then in the end the
                        // result.index will be eq to vl, so we must call the
                        // callback by hand
                        callback({
                            validator: result.validator,
                            isValid: result.isValid
                        }, field);
                    }
                }
            }
        }
        validate();
    }

    function bindDelegation(form, settings) {
        var fields;
        form = $(form);
        form.attr('novalidate', 'novalidate');
        fields = form.find(':input');
        form.submit(function (submitEvent) {
            var validationResults, isFormValid;
            validationResults = [];
            isFormValid = true;
            submitEvent.preventDefault();

            function onValidate(result, field) {
                isFormValid = isFormValid && result.isValid;
                validationResults.push({
                    field: field,
                    isValid: result.isValid,
                    validator: result.validator
                });

                if (result.isValid) {
                    field.trigger(events.FIELD_VALID, result);
                } else {
                    field.trigger(events.FIELD_INVALID, result);
                }

                if (validationResults.length >= fields.length) {

                    if (isFormValid) {
                        form.trigger(events.FORM_VALID, {results: validationResults});
                    } else {
                        form.trigger(events.FORM_INVALID, {
                            results: validationResults,
                            errors: $.makeArray($(validationResults).filter(function (index, item) {
                                return !item.isValid;
                            }))
                        });
                    }

                }
            }

            fields.each(function () {
                validateField(this, onValidate);
            });
        });
    }
    function UValidator(options) {
        var settings = $.extend({}, defaults, options);
        return this.each(function (form) {
            bindDelegation(this, settings);
        });
    }
    $.uvalidator = {
        addMethod: validatorManager.addValidatorMethod
    };
    $.fn.uvalidator = UValidator;
}(window.jQuery));
