/*jslint browser: true*/
/*global YUI: true, sinon: true, $: true */
YUI().use('node', 'test', 'test-console', function (Y) {
	"use strict";
	var coreSuite,
        pass = $('#pass'),
        pass2 = $('#pass2');

	coreSuite = new Y.Test.Suite({
		name: 'validator tests',
		setUp: function () {
            var skin = $.uvalidatorApplySkin("ustream", $("form"));
		},
		tearDown: function () {
            $('.control-group').removeClass('success error');
		}
	});
	coreSuite.add(new Y.Test.Case({
		name: "Password format tests",
        setUp: function () {
            $('#Messages').hide();
            pass.val('');
            pass2.val('');
            $('form').submit();
        },
        tearDown: function () {
            // $(':input').removeClass('valid invalid');
        },
        "lowercase letters only": function () {
            pass.val('foobarbaz').change();
            Y.Assert.isTrue(pass.hasClass('invalid'));
		},
        "uppercase letters only": function () {
            pass.val('FOOBARBAZ').change();
            Y.Assert.isTrue(pass.hasClass('invalid'));
		},
        "no number": function () {
            pass.val('Foobarbaz.').change();
            Y.Assert.isTrue(pass.hasClass('invalid'));
		},
        "no uppercase": function () {
            pass.val('foobarbaz7.').change();
            Y.Assert.isTrue(pass.hasClass('invalid'));
		},
        "no lowercase": function () {
            pass.val('FOOBARBAZ7.').change();
            Y.Assert.isTrue(pass.hasClass('invalid'));
		},
        "less than 7 chars": function () {
            pass.val('F1f.').change();
            Y.Assert.isTrue(pass.hasClass('invalid'));
		},
        "valid password format": function () {
            pass.val('F1fooabar').change();
            Y.Assert.isTrue(pass.hasClass('valid'));
		}
	}));
	Y.Test.Runner.add(coreSuite);
	Y.Test.Runner.run();
});

