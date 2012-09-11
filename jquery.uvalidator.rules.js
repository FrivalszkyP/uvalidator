/*jslint browser: true */
(function ($) {
    "use strict";

    var dbg;

    if (window.console) {
        dbg = window.console.log;
    } else {
        dbg = function () {};
    }

    $.uvalidator.addMethod('[required],.required', 'required', function (value, element, callback) {
        callback(!!value);
    });
    $.uvalidator.addGroupMethod(
        ':radio[required],:radio.required',
        'required',
        function (items, callback) {
            callback(items.filter(':checked').length > 0);
        }
    );
    $.uvalidator.addGroupMethod(
        'input[data-validator-type="date"][required],input[data-validator-type="date"].required',
        'required-date',
        function (items, callback) {
            var isValid = true;
            items.each(function () {
                isValid = isValid && $.trim($(this).val()) !== '';
            });
            callback(isValid);
        }
    );

}(window.jQuery));
