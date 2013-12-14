/**
 * A module to add some additional validation rules and a pre-input filter.
 */
define(['knockout', 'knockout.validation'], function(ko){
    ko.validation.rules["validDigit"] = {
        validator: function (value) {
            return  (/^\d+$/).test(value);
        },
        message: "Please enter a valid number."
    };

    ko.validation.rules["validName"] = {
        validator: function (value) {
            var regExp = new RegExp("^[/a-z '\\-]*$", "i");
            return  regExp.test(value);
        },
        message: "Only the following characters are accepted: letters, space, apostrophe or hyphen(-)."
    };

    /**
     * Allow any valid alpha or numeric plus all of the following: ('.,#-)
     * for names, streets, etc.
     */
    ko.validation.rules["noSpecialChars"] = {
        validator: function (value) {
            var regExp = new RegExp("^[/a-z0-9 '\\.,#-]*$", "i");
            return  regExp.test(value);
        },
        message: "Only the following characters are accepted: letters, numbers, space, comma, dot, pound(#), hyphen(-) or forward slash(/)."
    };

    ko.validation.rules["validSelectValue"] = {
        validator: function (value) {
            value = (!value || (value === undefined)) ? '' : value;
            value += '';
            return value.replace(/^\s+|\s+$/g, '') !== '';
        },
        message: "Please select an item."
    };

    ko.validation.rules["validDigitLength"] = {
        validator: function (value, length) {
            return (value + '').match(new RegExp("^[0-9]{" + (length || 0) + "}$"));
        },
        message: "Please enter a number with length {0}."
    };

    ko.validation.registerExtenders();

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
});