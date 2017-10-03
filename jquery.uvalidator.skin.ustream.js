/*jslint browser: true*/
(function ($) {
	'use strict';
	$.uvalidatorSkin('ustream', {
		validatorEventMap: {
			START_REMOTE_VALIDATION: 'onRemoteValidationStart',
			FINISH_REMOTE_VALIDATION: 'onRemoteValidationFinish'
		},
		options: {
			focusOnFormInvalid: true,
			inputInvalidClassName: 'input-invalid',
			inputContainerSelector: '.control-group',
			dropdownContainerSelector: '.control-select',
			checkboxContainerSelector: '.page-checkbox, .page-radio',
			inputValidClassName: 'input-valid',
			errorMessageClassName: 'tooltip-error',
			errorMessagePlaceholderClassName: 'error-placeholder',
			checkboxFocusedClassName: 'focused',
			checkboxSelector: '.control-radio, .control-checkbox',
			errorIDprefix: 'error-'
		},
		setForm: function (form, settings) {
			this.superclass.setForm(form, settings);

			/* Removed due to a Firefox (23.0.1) bug within SITEA-9681
			 * Seems like parallel DOM manipulation stops native select dropdown to open
			 * We don't need this class anyways - or at least I didn't find any relevance
			 *
			 this.form.delegate(':input', 'focus', $.proxy(function (focusEvent) {
			 $(focusEvent.target).closest('.control-group').addClass('focused');
			 }, this));
			 this.form.delegate(':input', 'blur', $.proxy(function (focusEvent) {
			 $(focusEvent.target).closest('.control-group').removeClass('focused');
			 }, this));
			 */

			this.form.delegate(':input[type="radio"], :input[type="checkbox"]', 'focus', $.proxy(function (focusEvent) {
				$(focusEvent.target).closest(this.options.inputContainerSelector).addClass(this.options.checkboxFocusedClassName);
			}, this));
			this.form.delegate(':input[type="radio"], :input[type="checkbox"]', 'blur', $.proxy(function (focusEvent) {
				$(focusEvent.target).closest(this.options.inputContainerSelector).removeClass(this.options.checkboxFocusedClassName);
			}, this));

			//sorry for the exeption It was the worst solution ever to override the keyup event :(
			this.form.delegate(':input:not(".liveValidation")', 'keyup', $.proxy(function (event) {
				// 13 is enter
				// 9 is tab
				// 16 is shift
				if ($.inArray(event.keyCode, [9, 13, 16]) !== -1) {
					return;
				}
				this.onFieldValid(event) //$(event.target).removeClass(this.options.inputInvalidClassName);
			}, this));

			return this;
		},
		setFieldInvalid: function (field, args) {
			var options = this.options;
			field = this.getCorrectField(field);

			field.addClass(options.inputInvalidClassName).removeClass(options.inputValidClassName)
				.attr('aria-invalid', 'true');
		},
		setFieldValid: function (field, args) {
			var options = this.options;
			field = this.getCorrectField(field);
			field.addClass(options.inputValidClassName).removeClass(options.inputInvalidClassName)
				.attr('aria-invalid', 'false');
		},
		unsetValidatorState: function (field, args) {
			var options = this.options;
			field = this.getCorrectField(field);
			field.removeClass(options.inputValidClassName + ' ' + options.inputInvalidClassName);
			this.hideFieldError(field);
		},
		getCorrectField: function (field) {
			var nodeName = field.nodeName;
			field = $(field);
			if (nodeName === 'SELECT') {
				field = field.closest(this.options.dropdownContainerSelector);
			}
			return field;
		},
		addFieldError: function (field, args) {
			var msg = this.getMessage(args),
				options = this.options,
				selectGroup,
				container,
				fieldOrGroup,
				errorElem,
				errorPlaceholder,
				errorSibling,
				errorID;

			fieldOrGroup = args.field;
			container = fieldOrGroup.closest(this.options.inputContainerSelector);
			selectGroup = container.find('>' + this.options.dropdownContainerSelector);

			if (selectGroup.length > 0) {
				container = selectGroup;
			}

			errorElem = container.find('.' + options.errorMessageClassName);
			errorPlaceholder = container.find('.' + options.errorMessagePlaceholderClassName);

			if (errorElem.length < 1) {
				errorID = options.errorIDprefix + fieldOrGroup.attr('id') + '-' + Math.ceil(Math.random() * 10000);
				errorElem = $('<span />')
				// .attr('for', fieldOrGroup.attr('id'))
					.addClass(options.errorMessageClassName)
					.attr('id', errorID);
				fieldOrGroup.attr('aria-describedBy', errorID);

				if (fieldOrGroup[0].nodeName === 'SELECT') {
					errorSibling = fieldOrGroup.next('span.select');
				} else if (fieldOrGroup.is(this.options.checkboxContainerSelector) ||
					container.find(this.options.checkboxSelector).length) {
					// show error message only after the last radio
					errorSibling = fieldOrGroup.last().next('label');
				} else {
					errorSibling = fieldOrGroup;
				}

				if (errorPlaceholder.length) {
					errorPlaceholder.append(errorElem);
				} else {
					errorSibling.after(errorElem);
				}
			}
			errorElem.html(msg);
		},
		showFieldError: function (field, args) {
			this.addFieldError(field, args);
		},
		hideFieldError: function (field, args) {
			$(field).removeAttr('aria-describedBy').closest(this.options.inputContainerSelector).find('.' + this.options.errorMessageClassName).remove();
		},
		/**
		 * Focuses on the first input / select element that is invalid
		 */
		onFormInvalid: function () {
			if (this.options.focusOnFormInvalid) {
				var inputInvalidClassName = this.options.inputInvalidClassName;
				this.form
					.find(':input.' + inputInvalidClassName + ',' + this.options.dropdownContainerSelector + '.' + inputInvalidClassName + ' > select')
					.first().focus();
			}
		}
	});
}(window.jQuery));
