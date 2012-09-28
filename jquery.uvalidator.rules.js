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
    $.uvalidator.addMethod('.ajax', 'ajax', function (value, element, callback) {
        setTimeout(function () {
            callback(+value % 2);
        }, 500);
    });
    $.uvalidator.addMethod('[type="number"],.number', 'number',
        function (value, element, callback) {
            callback(!isNaN(+value));
        });
    $.uvalidator.addGroupMethod(
        ':radio[required],:radio.required',
        'required',
        function (value, items, callback) {
            callback(items.filter(':checked').length > 0);
        }
    );
    $.uvalidator.addGroupMethod(
        'input[data-validator-type="date"][required],input[data-validator-type="date"].required',
        'required-date',
        function (value, items, callback) {
            var isValid = true;
            items.each(function () {
                isValid = isValid && $.trim($(this).val()) !== '';
            });
            callback(isValid);
        }
    );

}(window.jQuery));
