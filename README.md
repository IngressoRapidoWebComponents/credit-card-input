
<!---

This README is automatically generated from the comments in these files:
credit-card-input.html

Edit those files, and our readme bot will duplicate them over here!
Edit this file, and the bot will squash your changes :)

The bot does some handling of markdown. Please file a bug if it does the wrong
thing! https://github.com/PolymerLabs/tedium/issues

-->

_[Demo and API docs](https://www.webcomponents.org/element/IngressoRapidoWebComponents/credit-card-input)_


##&lt;credit-card-input&gt;

`credit-card-input` is a single-line text field with Material Design styling
for entering a credit card number. As the user types, the number will be
formatted by adding a space every 4 digits.

```html
<credit-card-input></credit-card-input>
```

It may include an optional label, which by default is "Card number".

```html
<credit-card-input label="CC"></credit-card-input>
```

### Validation

The input can detect whether a credit card number is valid, and the type
of credit card it is, using the Luhn checksum. See `http://jquerycreditcardvalidator.com/`
for more information.

The input can be automatically validated as the user is typing by using
the `auto-validate` and `required` attributes. For manual validation, the
element also has a `validate()` method, which returns the validity of the
input as well sets any appropriate error messages and styles.

A list of allowable credit card types can be provided via the `cardTypes`
property. Possible options, from `cc-validator.js`, are: `amex`, `diners_club`,
`discover`, `jcb`, `laser`, `maestro`, `mastercard`, `visa`, `visa_electron`.

See `Polymer.PaperInputBehavior` for more API docs.

### Styling

See `Polymer.PaperInputContainer` for a list of custom properties used to
style this element.

| Custom property | Description | Default  |
| --- | --- | --- |
| `----credit-card-input-icon-container` | Mixin applied to the icon container | `{}` |


