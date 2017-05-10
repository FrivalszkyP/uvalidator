/*jslint browser: true*/
(function ($) {
	'use strict';
	function getCorrectField(field) {
		var nodeName = field.nodeName;
		field = $(field);
		if (nodeName === 'SELECT') {
			field = field.closest('.control-select');
		}
		return field;
	}
	$.uvalidatorSkin('ustream', {
		validatorEventMap: {
			START_REMOTE_VALIDATION: 'onRemoteValidationStart',
			FINISH_REMOTE_VALIDATION: 'onRemoteValidationFinish'
		},
		options: {
			focusOnFormInvalid: true,
			inputInvalidClassName: 'input-invalid',
			inputValidClassName: 'input-valid',
			errorMessageClassName: 'tooltip-error',
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

			//sorry for the exeption It was the worst solution ever to override the keyup event :(
			this.form.delegate(':input:not(".liveValidation")', 'keyup', $.proxy(function (event) {
				// 13 is enter
				// 9 is tab
				// 16 is shift
				if ($.inArray(event.keyCode, [9, 13, 16]) !== -1) {
					return;
				}
				$(event.target).removeClass(this.options.inputInvalidClassName);
			}, this));
			return this;
		},
		setFieldInvalid: function (field, args) {
			var options = this.options;
				field = getCorrectField(field);

			field.addClass(options.inputInvalidClassName).removeClass(options.inputValidClassName)
					.attr('aria-invalid', 'true');
		},
		setFieldValid: function (field, args) {
			var options = this.options;
			field = getCorrectField(field);
			field.addClass(options.inputValidClassName).removeClass(options.inputInvalidClassName)
					.attr('aria-invalid', 'false');
		},
		unsetValidatorState: function (field, args) {
			var options = this.options;
			field = getCorrectField(field);
			field.removeClass(options.inputValidClassName + ' ' + options.inputInvalidClassName);
			this.hideFieldError(field);
		},
		addFieldError: function (field, args) {
			var msg = this.getMessage(args),
				options = this.options,
				selectGroup,
				container,
				fieldOrGroup,
				errorElem,
				errorID;

			fieldOrGroup = args.field;
			container = fieldOrGroup.closest('.control-group');
			selectGroup = container.find('>.control-select');

			if (selectGroup.length > 0) {
				container = selectGroup;
			}

			errorElem = container.find('.' + options.errorMessageClassName);

			if (errorElem.length < 1) {
				errorID = options.errorIDprefix + fieldOrGroup.attr('id') + '-' + Math.ceil(Math.random() * 10000);
				errorElem = $('<span />')
						// .attr('for', fieldOrGroup.attr('id'))
						.addClass(options.errorMessageClassName)
						.attr('id', errorID);
				fieldOrGroup.attr('aria-describedBy', errorID);

				if (fieldOrGroup[0].nodeName === 'SELECT') {
					fieldOrGroup.next('span.select').after(errorElem);
				} else if (fieldOrGroup.hasClass('page-checkbox')) {
					fieldOrGroup.next('label').after(errorElem);
				} else if (fieldOrGroup.hasClass('page-radio')) {
					// show error message only after the last radio
					fieldOrGroup.last().next('label').after(errorElem);
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
			$(field).removeAttr('aria-describedBy').closest('.control-group').find('.' + this.options.errorMessageClassName).remove();
		},
		onFormInvalid: function () {
			if (this.options.focusOnFormInvalid) {
				var inputInvalidClassName = this.options.inputInvalidClassName;
				this.form
						.find(':input.' + inputInvalidClassName + ',.control-select.' + inputInvalidClassName + ' > select')
						.first().focus();
			}
		}
	});
}(window.jQuery));
