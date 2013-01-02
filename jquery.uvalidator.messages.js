(function () {
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
});
