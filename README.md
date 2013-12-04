# knockout-valdiation-rule-engine

Knockout Validation Rule Engine

## Description

Provides an easy way to store and reuse rules and ensure that you can apply the same rules to the same model properties across your entire site.

## Getting Started

Download the latest [knockout-rule-engine](https://github.com/ctoestreich/knockout-validation-rule-engine/tree/master/build) file.

Define a rule set that uses the parent key as the name of the model property you want to map to.  If you wanted to set an email rule for a model with a property
of userEmail, you would provide the following rule set.

``` javascript
define(['knockout', 'knockout-rule-engine', 'validation-addons'], function (ko, RuleEngine) {
	var ruleSet = {
		userEmail: { email: true, required: true }
	};

    var ruleEngine = new RuleEngine(ruleSet);

    var model = {
        userEmail: ko.observable('')
    };

    ruleEngine.apply(model);

    ko.applyBindings(model, $('html')[0]);
});
```

This would be equivalent to the following code.

``` javascript
define(['knockout'], function (ko) {
    var model = {
        userEmail: ko.observable('').extend({email: true, required: true});
    };

    ko.applyBindings(model, $('html')[0]);
});
```

## Reusing rules

If you store your rules in a common directory and include them via require into your models you will ensure you have a common experience across your site.  See [main.js](https://github.com/ctoestreich/knockout-validation-rule-engine/blob/master/app/js/main.js) for more detailed examples.

``` javascript
define(['filters/filters'], function (filters) {
    return {
        address1: {
            required: true,
            noSpecialChars: true,
            filter: [filters.noSpecialChars, filters.ltrim]
        },
        address2: {
            noSpecialChars: true,
            filter: [filters.noSpecialChars, filters.ltrim]
        },
        city: {
            required: true,
            noSpecialChars: true,
            filter: [filters.noSpecialChars, filters.ltrim]
        },
        state: {
            validSelectValue: {
                message: 'Please select a state.'
            }
        },
        zipCode: {
            required: true,
            validDigitLength: {
                params: 5,
                message: 'Please enter a valid zip code (XXXXX).'
            },
            filter: filters.onlyDigits
        },
        phone: {
            required: true,
            pattern: {
                message: 'Invalid phone number. (XXX-XXX-XXXX)',
                params: /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/
            }
        }
    };
});
```

Then you can include this module named rules/address/rules.js into any model that has address or nested address properties that match the keys above (address1, address2, etc).

``` javascript
// to depend on a bower installed component:
// define(['component/componentName/file'])

define(["knockout", "knockout-rule-engine", "rules/address/rules"], function (ko, RuleEngine, personRules) {

    // set deep to false if you do not want to traverse child properties on the model
    // var ruleEngine = new RuleEngine(personRules, {deep: false});
    var ruleEngine = new RuleEngine(personRules);

    var PhoneModel = function () {
        return {
            phone: ko.observable('')
        };
    };

    var AddressModel = function () {
        return {
            address1: ko.observable(''),
            address2: ko.observable(''),
            city: ko.observable(''),
            state: ko.observable(''),
            zipCode: ko.observable(''),
            phone: new PhoneModel()
        };
    };

    var personModel = {
        firstName: ko.observable(''),
        lastName: ko.observable(''),
        middleName: ko.observable(''),
        address: new AddressModel()
    };

    // example of wiring a field at apply time
    ruleEngine.apply(personModel);

    ko.applyBindings(personModel, $('html')[0]);
});
```

## Adding Rules At Runtime

If you have already instantiated the RuleEngine and need to add a rule later at runtime you can do so via the addRule method.

``` javascript
ruleEngine.addRule('nameNotTom', {
    validator: function (val) {
        return val !== 'Tom';
    },
    message: 'Your name can not be Tom!'
});
```

You would then apply that rule to your model via the following code.

``` javascript
ruleEngine.addRuleSet('firstName', { nameNotTom: true });
```

## Using The Filter Extender

It is pretty common that you must also filter the input of data on the knockout model via a form.  This is an example filter extender that can be used in conjunction with the rules definitions as in the above example.

``` javascript
ko.extenders.filter = function (target, filter) {
    var writeFilter = function (newValue) {
        var newValueAdjusted = (typeof filter === 'function') ? filter(newValue) : newValue;
        if ($.isArray(filter)) {
            $.each(filter, function (o) {
                if (typeof o === 'function') {
                    newValueAdjusted = o(newValueAdjusted);
                }
            });
        }
        var currentValue = target();
        if (newValueAdjusted !== currentValue) {
            target(newValueAdjusted);
        } else {
            if (newValue !== currentValue) {
                target.notifySubscribers(newValueAdjusted);
            }
        }
    };

    var result = ko.computed({
        read: target,
        write: writeFilter
    }).extend({ notify: 'always', throttle: 1 });

    result(target());

    target.subscribe(writeFilter);

    return target;
};
```

Global filters can be setup to be reused via something similar to the following.  See [Filters](https://github.com/ctoestreich/knockout-validation-rule-engine/blob/master/app/js/filters/filters.js) for more information

``` javascript
define(function () {
    return {
        ltrim: function (value) {
            return (typeof value === 'string') ? value.replace(/^\s+/, "") : value;
        },

        onlyDigits: function (value) {
            return (typeof value === 'string') ? value.replace(/[^0-9]/g, '') : value;
        },

        onlyAlpha: function (value) {
            return (typeof value === 'string') ? value.replace(/[^A-Za-z _\-']/g, '') : value;
        },

        noSpecialChars: function (value) {
            return (typeof value === 'string') ? value.replace(/[^\/A-Za-z0-9 '\.,#\-]*$/g, '') : value;
        }
    };
});
```