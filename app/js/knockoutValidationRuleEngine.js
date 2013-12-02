/**
 * See https://github.com/Knockout-Contrib/Knockout-Validation/wiki for more details on creating rules
 *
 * Uses lodash, could be changed to underscore or jquery.
 */
define(["knockout", "knockout.validation", "_"], function (ko, validation, _) {

    return function (ruleSet, options) {

        ko.ruleEngine = ko.ruleEngine || this;

        options = options || {};
        ruleSet = ruleSet || {};

        options = ko.utils.extend({insertMessages: true, messagesOnModified: true, deep: true}, options);

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

        function apply(model, rules) {
            if (rules) {
                $.extend(ruleSet, rules);
            }

            traverseGraph(model, options);
        }

        function getFieldRuleSet(field) {
            return ruleSet[field] || {};
        }

        function addRule(name, closure) {
            ko.validation.rules[name] = closure;
            ko.validation.registerExtenders();
        }

        function initialize(options) {
            ko.validation.init(options);
        }

        function traverseGraph(obj, options, level) {
            var objValues = [],
                val = ko.utils.unwrapObservable(obj);

            //default level value depends on deep option.
            level = (level !== undefined ? level : options.deep ? 1 : -1);

            // if object is observable then add it to the list
            if (ko.isObservable(obj) && !obj.isValid) {
                obj.extend({ validatable: true });
            }

            //get list of values either from array or object but ignore non-objects
            if (val && (isArray(val) || isObject(val))) {
                objValues = val;
            }

            _.each(objValues, function (o, i) {
                var fieldRules = getFieldRuleSet(i);
                if (fieldRules && ko.isObservable(obj[i])) {
                    obj[i].extend(fieldRules);
                }
                if (options.deep && level !== 0 && obj[i] !== undefined && !ko.isObservable(obj[i])) {
                    traverseGraph(obj[i], options, level + 1);
                }
            });
        }

        function isArray(o) {
            return o.isArray || Object.prototype.toString.call(o) === '[object Array]';
        }

        function isObject(o) {
            return o !== null && typeof o === 'object';
        }

        //initialize the rule engine with init options and any additional rules you want to apply.
        initialize(options);

        return {
            addRule: addRule,
            apply: apply,
            getFieldRuleSet: getFieldRuleSet,
            registerExtenders: ko.validation.registerExtenders,
            ruleSet: ruleSet,
            rules: ko.validation.rules
        };
    };
});