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
    defaults = {
        groupDataName: 'validator-group'
    };
    events = {
        FIELD_VALID: 'fieldValid',
        FIELD_INVALID: 'fieldInvalid',
        FORM_VALID: 'formValid',
        FORM_INVALID: 'formInvalid'
    };
    if (window.console) {
        dbg = window.console.log;
    } else {
        dbg = function () {};
    }

    validatorManager = (function () {
        var validators = [],
            validatorsByName = {},
            groupValidators = [],
            groupValidatorsByName = {};
        return {
            createValidator: function createValidator(selector, name, fn, isGroup) {
                return {
                    fn: fn,
                    name: name,
                    selector: selector,
                    isGroup: isGroup
                };
            },
            getValidatorByIndex: function getValidatorByIndex(index, isGroup) {
                return isGroup ? groupValidators[index] : validators[index];
            },

            /**
            * @method getValidatorIndexByName
            * @param {String} name The index of the validator
            * @private
            * @return {Integer} Returns the index of the validator with the name. If
            * the validator not found, returns -1
            */
            getValidatorIndexByName: function getValidatorIndexByName(name, isGroup) {
                var index = -1,
                    byName = isGroup ? groupValidatorsByName : validatorsByName;
                if (typeof byName[name] === 'number') {
                    index = byName[name];
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
            getValidatorByName: function getValidatorByName(name, isGroup) {
                var index = validatorManager.getValidatorIndexByName(name, isGroup),
                    validator = null;

                if (index > -1) {
                    validator = isGroup ? groupValidators[index] : validators[index];
                }
                return validator;
            },


            addValidatorMethod: function addValidatorMethod(selector, name, fn) {
                var currentIndex, index, validatorObject;

                currentIndex = validatorManager.getValidatorIndexByName(name, false);

                // overwrites the existing method
                index = currentIndex > -1 ? currentIndex : validators.length;
                validatorObject = validatorManager.createValidator(selector, name, fn, false);

                validatorsByName[name] = index;
                validators[index] = validatorObject;
            },
            addValidatorGroupMethod: function (selector, name, fn) {
                var currentIndex, index, validatorObject;

                currentIndex = validatorManager.getValidatorIndexByName(name, true);

                // overwrites the existing method
                index = currentIndex > -1 ? currentIndex : groupValidators.length;
                validatorObject = validatorManager.createValidator(selector, name, fn, true);

                groupValidatorsByName[name] = index;
                groupValidators[index] = validatorObject;
            },
            len: function (isGroup) {
                return isGroup ? groupValidators.length : validators.length;
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
        var vl, validator, value, isValid, index;

        field = $(field);
        value = field.is(':checkbox,:radio') ? field.is(':checked') : field.val();
        vl = validatorManager.len();

        isValid = true;
        index = 0;

        function onValidate(isValid) {
            index += 1;
            if (index < vl && isValid) {
                validate();
            } else {
                var output = {
                    isValid: isValid,
                    isGroup: false
                };
                if (!isValid) {
                    output.validator = validator.name;
                    output.field = field;
                }
                callback(output, field);
            }
        }

        function validate() {
            while (index < vl && isValid) {
                validator = validatorManager.getValidatorByIndex(index);
                if (field.is(validator.selector)) {
                    validator.fn(value, field, onValidate);
                } else {
                    index += 1;
                    if (index >= vl) {
                        // if not matched any validator then in the end the
                        // index will be eq to vl, so we must call the
                        // callback by hand
                        callback({
                            validator: validator,
                            isValid: isValid
                        }, field);
                    }
                }
            }
        }
        validate();
    }

    function validateGroup(items, callback) {
        var vl, index, isValid, validator;

        vl = validatorManager.len(true);
        index = 0;
        isValid = true;
        items = $(items);

        function onValidate(valid) {
            index += 1;
            isValid = valid;
            if (index < vl && isValid) {
                validate();
            } else {
                var output = {
                    isValid: isValid,
                    isGroup: true
                };
                if (!isValid) {
                    output.validator = validator.name;
                    output.fields = items;
                }
                callback(output, items);
            }
        }

        function validate() {
            while (index < vl && isValid) {
                validator = validatorManager.getValidatorByIndex(index, true);
                if (items.is(validator.selector)) {
                    validator.fn(items, onValidate);
                } else {
                    index += 1;
                    if (index >= vl) {
                        callback({
                            validator: validator,
                            isValid: isValid
                        }, items);
                    }
                }
            }
        }
        validate();
    }

    function bindDelegation(form, settings) {
        var fields, groupFields, groups, groupsLen;

        form = $(form);
        form.attr('novalidate', 'novalidate');

        fields = form.find(':input');

        groupFields = fields.filter('[data-' + settings.groupDataName + ']');
        fields = fields.not('[data-' + settings.groupDataName + '],button');

        groups = {};
        groupFields.each(function () {
            var that = $(this), // caching
                group = that.data('validator-group'),
                form;
            if (!groups[group]) {
                form = this.form || that.closest('form');
                groups[group] = $(form)
                    .find('[data-' + settings.groupDataName + '="' + group + '"]');
                groupsLen += 1;
            }
        });
        form
            .delegate(':input:not(button,[data-' + settings.groupDataName + '])',
                'change', function (e) {
                    validateField(e.target, function (result, field) {
                        if (result.isValid) {
                            field.trigger(events.FIELD_VALID, result);
                        } else {
                            field.trigger(events.FIELD_INVALID, result);
                        }
                    });
                });
        form.delegate(':input[data-' + settings.groupDataName + ']', 'change', function (e) {
            var target = $(e.target),
                group = target.data(settings.groupDataName),
                form = e.target.form || target.closest('form');

            validateGroup($(form).find('[data-' + settings.groupDataName + '="' + group + '"]'),
                function (result, items) {
                    if (result.isValid) {
                        items.trigger(events.FIELD_VALID, result, items);
                    } else {
                        items.trigger(events.FIELD_INVALID, result, items);
                    }
                });

        });

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
                    validator: result.validator,
                    isGroup: false
                });

                if (result.isValid) {
                    field.trigger(events.FIELD_VALID, result);
                } else {
                    field.trigger(events.FIELD_INVALID, result);
                }

                if (validationResults.length >= (fields.length + groupsLen)) {

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
            $.each(groups, function (group, items) {
                validateGroup(items, onValidate);
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
        addMethod: validatorManager.addValidatorMethod,
        addGroupMethod: validatorManager.addValidatorGroupMethod

    };
    $.fn.uvalidator = UValidator;
}(window.jQuery));
