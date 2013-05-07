# Ustream jQuery form validator plugin (uvalidator)

Separate validation from displaying and handling errors.
Asynchronous validation support (ajax calls).
Pluggable validation methods.
Skin support.
Validating group of fields as one.

Basic usage after you included the following files:

jquery.uvalidator.js
jquery.uvalidator.messages.js 
jquery.uvalidator.rules.js
jquery.uvalidator.skin.js
jquery.uvalidator.skin.base.js

```html
<form action="" method="" id="Form">
    <div class="control-group">
        <label for="RequireField>A required field</label>
        <input type="text" name="" value="" id="RequireField" required />
    </div>
</form>
```

```javascript
var form, events, validator;
form = $("#Form");
events = $.uvalidator.events;
validator = $.uvalidatorApplySkin("base", form, {
    // validation events when should validate
    validationEvents: {
        change: true, // change event on fields
        submit: true // submit event of the form
    }
});
// catch the FORM_VALID event, which is fired after all validation ran on the
// form and all returned that the fields are valid.
validator.on(events.FORM_VALID, function () {
    form[0].submit();
});
```

Here you are applying the "base" skin on form which has the id 'Form'. When it comes out that the form is valid, the form is going to be submitted. If any field is invalid a a label will be appended after the input field with the error message.

If you don't want to use any skin, just call the `uvalidator` method on the form's jquery object.

```javascript
var form, events, validator;
form = $("#Form");
events = $.uvalidator.events;
form.uvalidator({
    validationEvents: {
        change: true,
        submit: true
    }
});
form.on(events.FORM_VALID, function () {
    form[0].submit();
});
```

It does the same like the one above, but it won't show any error message, because here we didn't use any skin.

## How it works

We can split the validator into 4 modules:
 * core
 * validator methods
 * skin
 * messages

The core module will listen to the events of the form and if the event is enabled for validation it will run the validation methods. The core also uses events to communicate with other code. All events are listed under the $.uvalidator.events namespace.

## Validator events

The events listed under the $.uvalidator.events namespace:

 * FIELD_VALID: "fieldValid"
 * FIELD_INVALID: "fieldInvalid"
 * FORM_VALID: "formValid"
 * FORM_INVALID: "formInvalid"
 * FINISH_FORM_VALIDATION: "finishFormValidation"
 * START_FORM_VALIDATION: "startFormValidation"
 * FINISH_FIELD_VALIDATION: "finishFieldValidation"
 * START_FIELD_VALIDATION: "startFieldValidation"


### START_FIELD_VALIDATION

args:
 * field `jQueryObject` Field which going to be validated

It runs right before the field validation starts. Useful for example when you use a AJAX validation to show a loading indicator on the field.

```
validator.on($.uvalidator.events.START_FIELD_VALIDATION, function () {
});
```

FINISH_FIELD_VALIDATION

args:

    field jQueryObject Mezo, ami validalva volt

Azután fut le, miután egy mezőhöz tartozó összes validátor metódus lefutott, így az ajax hivások is. Ha pl használtunk a START_FIELD_VALIDATION-nél leírt módszert, hogy jelezzük, meddig tart a validálás, akkor ennek az eventnek az elsülésekor kell levenni a "loading" class-t.
START_FORM_VALIDATION

args:

    form jQueryObject Form, ami validalva lesz

Pontosan azelőtt fut le, mielőtt egy teljes form validálás elindulna. Teljes form validáláskor a form összes mezőjét levalidáljuk.
FINISH_FORM_VALIDATION

args:

    form jQueryObject Form, ami validalva volt

Azután fut le, miután a form összes mezőjének, összes validátor metódusa lefutott, AJAX hívásokkal együtt.
FIELD_VALID

args:

    result Object
        isGroup Boolean True, ha a mező egy csoporthoz tartozik ezért groupValidatorok futottak rá
        isValid Boolean True, ha a mező valid
        validator String utolsó validátor method neve (hasznos, ha a mező invalid, mert innen lehet tudni, hogy melyik validátor method szerint invalid a mező)

Miután egy mező összes validátora lefutott és mind úgy találta, hogy a mező valid, ez az event fog lefutni. Az event használatával jelölhetjük pl. egy "valid" class ráadásával, hogy a mező valid.
FIELD_INVALID

    result Object
        field jQueryObject Validált mező jQuery objectként
        isGroup Boolean True, ha a mező egy csoporthoz tartozik ezért groupValidatorok futottak rá
        isValid Boolean True, ha a mező valid
        validator String utolsó validátor method neve (hasznos, ha a mező invalid, mert innen lehet tudni, hogy melyik validátor method szerint invalid a mező)

Miután egy mező egy validátora úgy találja, hogy valami nincs rendben az értékkel, ez az event fog elsülni.
FORM_VALID

args:

    validationResults Array** field jQueryObject Validált mező jQuery objectként
        isGroup Boolean True, ha a mező egy csoporthoz tartozik ezért groupValidatorok futottak rá
        isValid Boolean True, ha a mező valid
        validator String utolsó validátor method neve (hasznos, ha a mező invalid, mert innen lehet tudni, hogy melyik validátor method szerint invalid a mező)

Akkor sül el ez az event, miutan az osszes mezo validatora lefutott es minden mezo validnak bizonyult.
FORM_INVALID

args:

    validationResults Array** field jQueryObject Validált mező jQuery objectként
        isGroup Boolean True, ha a mező egy csoporthoz tartozik ezért groupValidatorok futottak rá
        isValid Boolean True, ha a mező valid
        validator String utolsó validátor method neve (hasznos, ha a mező invalid, mert innen lehet tudni, hogy melyik validátor method szerint invalid a mező)
    errors Array** field jQueryObject Validált mező jQuery objectként
        isGroup Boolean True, ha a mező egy csoporthoz tartozik ezért groupValidatorok futottak rá
        isValid Boolean True, ha a mező valid
        validator String utolsó validátor method neve (hasznos, ha a mező invalid, mert innen lehet tudni, hogy melyik validátor method szerint invalid a mező)

Akkor sül el ez az event, miutan az osszes mezo validatora lefutott es legalabb egy mezo invalidnak bizonyult.
