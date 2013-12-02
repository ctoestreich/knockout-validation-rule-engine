/**
 * Filters to use for changing values on input.  Useful to limit user input.
 * You should set  valueUpdate: 'afterkeydown' on the data binding or globally set via something similar to:

 var getInjectValueUpdate = function (allBindings) {
        return {
            has: function(bindingKey) {
                return (bindingKey == 'valueUpdate') || allBindings.has(bindingKey);
            },
            get: function(bindingKey) {
                var binding = allBindings.get(bindingKey);
                if (bindingKey == 'valueUpdate') {
                    binding = binding ? [].concat(binding, 'afterkeydown') : 'afterkeydown';
                }
                return binding;
            }
        };
    };

 var valueInitHandler = ko.bindingHandlers.value.init;
 ko.bindingHandlers.value.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        return valueInitHandler(element, valueAccessor, getInjectValueUpdate(allBindings), viewModel, bindingContext);
 };

 */

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