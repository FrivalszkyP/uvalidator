/*jslint browser: true*/
(function ($) {
    "use strict";
    $.uvalidatorSkin('base', {
        setFieldInvalid: function (field, args) {
            $(field).addClass('invalid').removeClass('valid')
                .closest('.control-group').addClass('error').removeClass('success');
        },
        setFieldValid: function (field, args) {
            $(field).addClass('valid').removeClass('invalid')
                .closest('.control-group').addClass('success').removeClass('error');
        },
        showFieldError: function (field, args) {
            var msg = this.getMessage(args),
                container,
                errorElem;

            field = $(field);
            container = field.closest('.control-group');
            container.find('.uerror').remove();
            $('<label />')
                .attr('for', field.attr('id'))
                .addClass('uerror')
                .html(msg).appendTo(container);
        },
        hideFieldError: function (field, args) {
            $(field).closest('.control-group').find('.uerror').remove();
        }
    });
}(window.jQuery));
