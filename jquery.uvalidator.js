/*jslint browser: true, white: true*/
(function ($) {
	"use strict";
	var defaults,
		events,
		validatorManager;

	/**
	 * Default settings
	 * @property defaults
	 * @type Object
	 */
	defaults = {
		validationEvents: {
			/**
			 * Validate on focus out event
			 * @property {Boolean} validationEvents.focusout
			 * @default false
			 */
			focusout: false,
			/**
			 * Validate on focus in event
			 * @property {Boolean} validationEvents.focusin
			 * @default false
			 */
			focusin: false,
			/**
			 * Validate on change event
			 * @property {Boolean} validationEvents.change
			 * @default true
			 */
			change: true,
			/**
			 * Validate on keyup event
			 * @property {Boolean} validationEvents.keyup
			 * @default keyup
			 */
			keyup: true,
			/**
			 * Validate on click event
			 * @property {Boolean} validationEvents.click
			 * @default true
			 */
			click: false,
			/**
			 * Validate on form submit event
			 * @property {Boolean} validationEvents.submit
			 * @default true
			 */
			submit: true
		}

	};
	events = {
		FIELD_VALID: 'fieldValid',
		FIELD_INVALID: 'fieldInvalid',
		FORM_VALID: 'formValid',
		FORM_INVALID: 'formInvalid',
		FINISH_FORM_VALIDATION: 'finishFormValidation',
		START_FORM_VALIDATION: 'startFormValidation',
		FINISH_FIELD_VALIDATION: 'finishFieldValidation',
		START_FIELD_VALIDATION: 'startFieldValidation'
	};

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

	function getFieldValue(field) {
		return field.is(':checkbox,:radio') ? field.is(':checked') : field.val();
	}

	function getGroupItemsForField(field) {
		var group, form;
		group = field.attr('data-validator-group');
		form = field[0].form ? $(field[0].form) : field.closest('form');
		return form.find('[data-validator-group="' + group + '"]');
	}

	function validateWith(value, field, name, callback, isGroup, form) {
		var validator = validatorManager.getValidatorByName(name, isGroup);
		if (validator) {
			validator.fn.call(form, value, field, callback);
		} else {
			callback(true);
		}
	}

	function validateField(field, callback, isGroup, form) {
		var vl, value, isValid, index, validated, callbackCalled;

		field = $(field);
		index = 0;
		validated = 0;
		isValid = true;
		callbackCalled = false;
		vl = validatorManager.len(isGroup);
		if (!isGroup) {
			value = getFieldValue(field);
		}

		function finishValidation(validator) {
			var result = {
				isValid: isValid,
				isGroup: isGroup,
				validator: validator.name,
				field: field
			};
			callbackCalled = true;
			field.trigger(events.FINISH_FIELD_VALIDATION, field);

			// if not matched any validator then in the end the
			// index will be eq to vl, so we must call the
			// callback by hand
			callback(result, field);
		}

		function onValidate(valid, validator, next) {

			if (callbackCalled) {
				return;
			}
			index += 1;
			validated += 1;
			isValid = isValid && valid;
			if (validated < vl && isValid) {
				// call next validation
				next();
			} else {
				finishValidation(validator);
			}
		}

		function getOnValidate(validator, validate) {
			return function (valid) {
				onValidate(valid, validator, validate);
			};
		}

		function validate() {
			var validator;
			while (index < vl && isValid) {
				validator = validatorManager.getValidatorByIndex(index, isGroup);
				if (field.is(validator.selector)) {
					validator.fn(value, field, getOnValidate(validator, validate));
				} else {
					validated += 1;
					if (validated >= vl) {
						finishValidation(validator);
					}
				}
				index += 1;
			}
		}

		field.trigger(events.START_FIELD_VALIDATION, field);

		validate();
	}

	function triggerFieldEvents(result, field) {
		if (result.isValid) {
			field.trigger(events.FIELD_VALID, result);
		} else {
			field.trigger(events.FIELD_INVALID, result);
		}
	}

	/**
	 * Helper to decide if the validation should run a certain event. It's good
	 * to handle exceptions, like we don't want to validate on keyup if the
	 * user just pressed the TAB button.
	 * @method isAllowedEventValidation
	 * @private
	 * @param {Event} e
	 */
	function isAllowedEventValidation(e) {
		var output = true,
			which;
		if (e.type === 'keyup') {
			which = e.which;
			// on keyup event don't allow to validate if user presses these
			// buttons
			// I would use switch/case but jsperf says it's the slowest way to do the comparisons.
			// 9: tab, 16: shift, 17: ctrl, 18: alt
			if (which === 9 || which === 16 || which === 17 || which === 18) {
				output = false;
			}
		}
		return output;
	}

	function validateForm(form) {
		var validationResults, isFormValid, fields, groupFields, groups, groupsLen;

		fields = form.find(':input').not('.skip-validation');

		groupFields = fields.filter('[data-validator-group]');

		fields = fields.not('[data-validator-group],:button,:submit');

		groups = {};
		groupsLen = 0;
		groupFields.each(function () {
			var that = $(this), // caching
				group = that.attr('data-validator-group');

			if (!groups[group]) {
				groups[group] = getGroupItemsForField(that);
				groupsLen += 1;
			}
		});

		validationResults = [];
		isFormValid = true;

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
				form.trigger(events.FINISH_FORM_VALIDATION, form);

				if (isFormValid) {
					form.trigger(events.FORM_VALID, {results: validationResults});
				} else {
					/*jslint unparam: true*/
					form.trigger(events.FORM_INVALID, {
						results: validationResults,
						errors: $.makeArray($(validationResults).filter(function (index, item) {
							return !item.isValid;
						}))
					});
					/*jslint unparam: false*/
				}

			}
		}

		form.trigger(events.START_FORM_VALIDATION, form);
		fields.each(function () {
			validateField(this, onValidate, false, form);
		});
		$.each(groups, function (group, items) {
			validateField(items, onValidate, true, form);
		});
	}

	function bindDelegation(form, settings) {
		form = $(form);
		form.attr('novalidate', 'novalidate');

		$.each(settings.validationEvents, function (name, value) {
			if (value) {
				form.delegate(':input:not(:button,:submit,[data-validator-group],.skip-validation)',
					name, function (e) {
						// don't validate on tab keyup
						if (!isAllowedEventValidation(e)) {
							return;
						}
						validateField(e.target, triggerFieldEvents, false, form);
					});

				form.delegate(':input[data-validator-group]', name, function (e) {
					// don't validate on tab keyup
					if (!isAllowedEventValidation(e)) {
						return;
					}
					var target = $(e.target),
						elements;

					elements = getGroupItemsForField(target);

					validateField(elements, triggerFieldEvents, true, form);

				});
			}
		});

		form.submit(function (submitEvent) {
			submitEvent.preventDefault();
			validateForm(form);
		});
	}

	function UValidator(options) {
		var settings = $.extend({}, defaults, options);

		return this.each(function () {
			bindDelegation(this, settings);
		});
	}

	$.uvalidator = {
		addMethod: validatorManager.addValidatorMethod,
		addGroupMethod: validatorManager.addValidatorGroupMethod,
		events: events,
		fieldIsValid: function (field, callback, conf, form) {
			var isGroup;
			field = $(field);
			conf = $.extend({}, defaults, conf);
			isGroup = field.is('[data-validator-group]');

			if (isGroup) {
				field = getGroupItemsForField(field);
			}

			validateField(field, callback, isGroup, form);
		},
		validateField: function (field, callback, conf, form) {
			$.uvalidator.fieldIsValid(field, function (result, field) {
				triggerFieldEvents(result, field);
				callback && callback(result, field);
			}, conf);
		},
		validateWith: function (field, method, callback, form) {
			var isGroup = field.is('[data-validator-group]');
			validateWith(getFieldValue(field), field, method, callback, isGroup, form);
		},
		validate: function (form) {
			validateForm($(form));
		}
	};
	$.fn.uvalidator = UValidator;
}(window.jQuery));
