/*jslint browser: true */
(function ($) {
    "use strict";
    var patterns, dbg;

    patterns = {
        userpassword: /(?=.{7,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])/,

        // Shamelessly lifted from Scott Gonzalez via the Bassistance
        // Validation plugin
        // http://projects.scottsplayground.com/email_address_validation/
        email: /((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?/,

        // Shamelessly lifted from Scott Gonzalez via the Bassistance
        // Validation plugin http://projects.scottsplayground.com/iri/
        url: /(https?|ftp):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,

        // Number, including positive, negative, and floating decimal.
        // Credit: bassistance
        // number: /-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?/,

        alpha: /[a-zA-Z]+/,
        alphaNumeric: /\w+/
    };

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


    function isOptional(element, value) {
        return !element.is('[required],.required') && value === '';
    }

    $.uvalidator.isOptional = isOptional;

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

    $.uvalidator.addMethod(
        '.number,[type="number"]',
        'number',
        function (value, element, callback) {
            var valid = isOptional(element, value) || !isNaN(+value);
            callback(valid);
        }
    );
    $.uvalidator.addMethod(
        '.input-url,.url,[type="url"]',
        'url',
        function (value, element, callback) {
            var valid = isOptional(element, value) || patterns.url.test(value);

            callback(valid);
        }
    );
    $.uvalidator.addMethod(
        '.input-email,[type="email"]',
        'email',
        function (value, element, callback) {
            var valid = isOptional(element, value) || patterns.email.test(value);

            callback(valid);
        }
    );
    $.uvalidator.addMethod(
        '.userpassword',
        'userpassword',
        function (value, element, callback) {
            callback(patterns.userpassword.test(value));
        }
    );
    $.uvalidator.addMethod(
        '.passwordVerify',
        'passwordverify',
        function (value, element, callback) {
            var refElement = element.data('validator-refelem'),
                valid;

            valid = isOptional(element, value) || $(refElement).val() === element.val();
            callback(valid);
        }
    );

}(window.jQuery));
