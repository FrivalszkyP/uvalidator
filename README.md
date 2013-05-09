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

## Validator methods


### Group validator methods

Group validator methods are special methods. You need group validator when you need to validate two more field together, having only _one_ FIELD_VALID or FIELD_INVALID event for all elements.
An example could be a credit card expiration date field, where you have a month and a year field. A month field alone can not be valid, without the year you don't know if the credit card is expired.

To define a validator group you must use the `data-validator-group` attribute. All field, which belongs to one group must have the same value in that attribute

```html
<input type="text" name="groupItem1" value="" data-validator-group="group1" />
<input type="text" name="groupItem2" value="" data-validator-group="group1" />

<input type="text" name="groupItem3" value="" data-validator-group="group2" />
<input type="text" name="groupItem4" value="" data-validator-group="group2" />
```

Here we defined two groups (group1 and group2). groupItem1 and groupItem2 belongs to group1, groupItem3 and groupItem4 belongs to group2.

### Applying validator methods on a field

A validator method will run on a field if the jQuerySelector, which defined in the validatator method matches with the input. The plugin will search for the fields under the form's children.
For example, if you want to make sure that the field will be filled, you must use the required validator. The required validator is checking with the following selector: `[required],.required`. It means that either the field must have a require attribute or a required class name.

Example using a class:

```html
<input type="text" name="aName" value="" class="required" />
```

Example using attribute:
```html
<input type="text" name="aName" value="" required />
```

### Predefined validator methods

#### required

Checks if a field's value isn't empty. If the field is a checkbox, it will check if it's checked or not.
For radio fields see required group method

##### selector

`[required],.required`

##### examples

```html
<input type="text" name="aName" value="" required />
<input type="checkbox" name="aName" value="" required />
```

```html
<input type="text" name="aName" value="" class="required" />
<input type="checkbox" name="aName" value="" class="required" />
```

#### number

Checks if a field's value is a number or not. If the required validator rule not set, it can be empty.

##### selector

`.number,[type="number"]`

##### examples

```html
<input type="number" name="aName" value="" />
```

```html
<input type="text" name="aName" value="" class="number"/>
```

#### url

Checks if a field's value's format is a valid url. It uses regular expression to check the format. If the required validator rule not set, it can be empty.

##### selector

`.input-url,[type="url"]`

##### examples

```html
<input type="url" name="aName" value="" />
```

```html
<input type="text" name="aName" value="" class="url"/>
```

#### email

Checks if a field's value's format is a valid email. It uses regular expression to check the format. If the required validator rule not set, it can be empty.

##### selector

`.input-email,[type="email"]`

##### examples

```html
<input type="email" name="aName" value="" />
```

```html
<input type="text" name="aName" value="" class="email"/>
```

#### userpassword

Tests if the field's value is matching with a predefined pattern. The predefined pattern requires that the password must be at least 7 characters length, must contain at leaset a lowercase alpha, a uppercase alpha and a numeric character.

##### selector

`.userpassword`

##### example

```html
<input type="password" name="aName" value="" class="userpassword" />
```

#### passwordverify

You can use this on registration forms for example, where the user needs to type his password twice to verify that he didn't mistyped something in it.
Using this validator you need to set a data-refelem attribute to the element, which must be jQuerySelector what can identify the other element, which value must be the same with this element's value.

##### data attributes

* data-refelem `jQuerySelector` Selector to the other element, which value must be compared to this element's value.

##### selector

`.password-verify,.input-password-verify`

##### example

```html
<input type="password" name="userpassword" value="" id="UserPassword" class="userpassword"/>
<input type="password" name="userpasswordverify" value="" data-refelem="#UserPassword" />
```

#### min

_not compatible with the HTML5 specification, needs some work, recommended to use with the class selector to not brake the HTML validator_

Checks if the value of the input is a number and the number is greater or equals to the defined minimum value.
If the required validator rule not set, it can be empty.

To define a minimum value there are two ways:

* If you use the class selector (`input-min`), then you must use a data attribute: `data-validator-min="5"`
* If you use the min attribute, then it's value must be the minimum number: `min="5"`

##### data attributes

* data-validator-min `Number` Minimum value must be in the input.

##### selector

`.input-min,[min]`

##### examples

```html
<input type="text" name="aName" value="" class="input-min" data-validator-min="5" />
```

```html
<input type="text" name="aName" value="" min="5" />
```

#### max

_not compatible with the HTML5 specification, needs some work, recommended to use with the class selector to not brake the HTML validator_

Checks if the value of the input is a number and the number is less or equals to the defined maximum value.
If the required validator rule not set, it can be empty.

To define a maximum value there are two ways:

* If you use the class selector (`input-max`), then you must use a data attribute: `data-validator-max="5"`
* If you use the max attribute, then it's value must be the maximum number: `max="5"`

##### data attributes

* data-validator-max `Number` Maximum value must be in the input.

##### selector

`.input-max,[max]`

##### examples

```html
<input type="text" name="aName" value="" class="input-max" data-validator-max="5" />
```

```html
<input type="text" name="aName" value="" max="5" />
```

#### creditcard

Validates using the Luhn algorithm (http://en.wikipedia.org/wiki/Luhn_algorithm) if the value is a valid credit card.

##### selector

`.creditcard,.input-creditcard`

##### examples

```html
<input type="text" name="aName" value="" class="creditcard" />
```

```html
<input type="text" name="aName" value="" class="input-creditcard" />
```

#### pattern

Checks if the value is matching with the regular expression pattern which is defined in a input's attribute.

The attribute name must be a `data-validator-pattern` attribute if you use the class name selector. If you use the pattern attribute, it's value must be the pattern.

##### selector

`.pattern,.input-pattern,[pattern]`

##### examples

```html
<input type="text" name="aName" value="" class="pattern" data-validator-pattern="^[a-z]+$" />
```

```html
<input type="text" name="aName" value="" class="input-pattern" data-validator-pattern="^[a-z]+$" />
```

```html
<input type="text" name="aName" value="" pattern="^[a-z]+$" />
```

### Predefined group validators

#### required

That validator is pretty similar to the one above, but we use it when we in a radio group at least on of the radios must be selected.

##### selector

`:radio[required],:radio.required`

##### examples

```html
<input type="radio" name="bar" value="1" data-validator-group="group1" id="radio-1" required />
<input type="radio" name="bar" value="2" data-validator-group="group1" id="radio-2" required />
```

```html
<input type="radio" name="bar" value="1" data-validator-group="group1" id="radio-1" class="required" />
<input type="radio" name="bar" value="2" data-validator-group="group1" id="radio-2" class="required" />
```

#### required-date

_Needs clarification, a more general name_

Checks if every field has value of the group. The group must have the `data-validator-type="date"` attribute.

##### data-attributes

* data-validator-type `"date"`

##### selector

`:input[data-validator-type="date"][required],:input[data-validator-type="date"].required`

##### examples

```html
<input type="text" name="bar" value="1" data-validator-group="group1" data-validator-type="date" id="radio-1" class="required" />
<input type="text" name="bar" value="2" data-validator-group="group1" data-validator-type="date" id="radio-2" class="required" />
```

```html
<input type="text" name="bar" value="1" data-validator-group="group1" data-validator-type="date" id="radio-1" required />
<input type="text" name="bar" value="2" data-validator-group="group1" data-validator-type="date" id="radio-2" required />
```

#### expiration-date

Useful for credit card expiration date validation. The date must be greater or equals to the current date (year and month).
Not more and not less than two inputs must belong to a group. Each input must have a `data-validator-ccexp` attribute. For the year field the value must be `year`, for month field the value must be `month`.

##### data attributes

* data-validator-ccexp `"year"|"month"`

##### selector

`:input[data-validator-type="date"].cc-expiration`

##### examples

```html
<input type="text" name="month" value="" class="cc-expiration" data-validator-ccexp="month" data-validator-group="cc-expiration-date" />
<input type="text" name="year" value="" class="cc-expiration" "data-validator-ccexp="year" data-validator-group="cc-expiration-date" />
```

## TODO

These inconsitencies or strange behaviours found:

* Fix min and max validators
* General required group validator
