# Ustream jQuery form validator plugin (uvalidator)

Separate validation from displaying and handling errors.
Asynchronous validation support (ajax calls).
Pluggable validation methods.
Skin support.
Validating group of fields as one.

Basic usage after you included the following files:

1. jquery.uvalidator.js
2. jquery.uvalidator.messages.js 
3. jquery.uvalidator.rules.js
4. jquery.uvalidator.skin.js
5. jquery.uvalidator.skin.base.js

```html
<form action="" method="" id="Form">
    <div class="control-group">
        <label for="RequireField">A required field</label>
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
+ core
+ validator methods
+ skin
+ messages

The core module will listen to the events of the form and if the event is enabled for validation it will run the validation methods. The core also uses events to communicate with other code. All events are listed under the $.uvalidator.events namespace.

## Validator events

The events listed under the $.uvalidator.events namespace:

+ START_FIELD_VALIDATION: "startFieldValidation"
+ FINISH_FIELD_VALIDATION: "finishFieldValidation"
+ START_FORM_VALIDATION: "startFormValidation"
+ FINISH_FORM_VALIDATION: "finishFormValidation"
+ FIELD_VALID: "fieldValid"
+ FIELD_INVALID: "fieldInvalid"
+ FORM_VALID: "formValid"
+ FORM_INVALID: "formInvalid"


### START_FIELD_VALIDATION

callback arguments:

+ field `jQueryObject` Field which going to be validated

It runs right before the field validation starts. Useful for example when you use a AJAX validation to show a loading indicator on the field.

```javascript
validator.on($.uvalidator.events.START_FIELD_VALIDATION, function (event, field) {
    $(field).addClass('loading');
});
```

### FINISH_FIELD_VALIDATION

callback arguments:
 = field `jQueryObject` Field which has been validated

It runs right after all of the validation methods ran on the field (ajax validations too). For example you can remove the loading indicator from the field

```javascript
validator.on($.uvalidator.events.FINISH_FIELD_VALIDATION, function (event, field) {
    $(field).removeClass('loading');
});
```

### START_FORM_VALIDATION

callback arguments:

+ event 'jQueryEventObject` Standard jquery event object
+ form `HTMLFormElement` The form, which going to be validated

Runs right before a full form validation starts.

```javascript
validator.on($.uvalidator.events.START_FORM_VALIDATION, function (event, form) {
    $(form).addClass('loading');
});
```

### FINISH_FORM_VALIDATION

callback arguments:

+ event 'jQueryEventObject` Standard jquery event object
+ form `HTMLFormElement` The form, which has been validated

Called right after all field has been validated in the form (including ajax calls).

```javascript
validator.on($.uvalidator.events.FINISH_FORM_VALIDATION, function (event, form) {
    $(form).removeClass('loading');
});
```

### FIELD_VALID

callback arguments:

+ event 'jQueryEventObject` Standard jquery event object
+ result Object
    - field `jQueryObject` The field, which has been validated
    - isGroup `Boolean` True, if the field belongs to a group, so only groupValidation methods were running
    - isValid `Boolean` True, if the field is valid
    - validator `String` Name of the validator which has been called last time. (Mostly useful in invalid callback, but for the consistency it passed here too).

Called when all validation ran for a field and all validation passed. For example using that event you can mark that the field is valid.

```javascript
validator.on($.uvalidator.events.FINISH_FORM_VALIDATION, function (event, result) {
    $(form).removeClass('loading');
});
```
When all validation ran for the field and all found out that the field is valid, the FIELD_VALID event will be triggered. You can use this event for example to mark if a field is valid adding a class to it.

```javascript
validator.on($.uvalidator.events.FIELD_VALID, function (event, result) {
    result.field.addClass('valid');
});
```

### FIELD_INVALID

callback arguments:

+ event 'jQueryEventObject` Standard jquery event object
+ result Object
    - field `jQueryObject` The field, which has been validated
    - isGroup `Boolean` True, if the field belongs to a group, so only groupValidation methods were running
    - isValid `Boolean` True, if the field is valid
    - validator `String` Name of the validator which has been called last time. Pretty useful if field is invalid, because you use this name to display a proper error message.

When one of the validators of the field founds that something is wrong with the value of the field, the FIELD_INVALID event will be triggered.
```javascript
validator.on($.uvalidator.events.FIELD_INVALID, function (event, result) {
    result.field.addClass('invalid');
});
```
### FORM_VALID

callback arguments:

+ event 'jQueryEventObject` Standard jquery event object
+ validationResults 
    - results `Array` Result object array, see FIELD_VALID event for result object structure.

The event triggered when all validator of all fields ran and all field is valid.

### FORM_INVALID

callback arguments:

+ event 'jQueryEventObject` Standard jquery event object
+ result Object
    - field `jQueryObject` The field, which has been validated
    - isGroup `Boolean` True, if the field belongs to a group, so only groupValidation methods were running
    - isValid `Boolean` True, if the field is valid
    - validator `String` Name of the validator which has been called last time. Pretty useful if field is invalid, because you use this name to display a proper error message.

The event triggered when all validator of all fields ran and at lease one field was invalid.
