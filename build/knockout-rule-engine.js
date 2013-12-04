/*=============================================================================
 Author:        Christian Oestreich - @ctoestreich
 License:       MIT (http://opensource.org/licenses/mit-license.php)

 Title:         Knockout Validation Rule Engine
 Description:   This plugin will will take a model and closure map of rules and
 apply the rules recursively on the model using the name of rule map name to
 model property automatically.

 Requires:

 Knockout - http://knockoutjs.com/index.html
 Knockout.Validation - https://github.com/Knockout-Contrib/Knockout-Validation

 Example:

 define(['knockout', 'knockout-rule-engine'], function (ko, RuleEngine) {
 var ruleSet = {
 userEmail: { email: true }
 };

 var ruleEngine = new RuleEngine(ruleSet);

 var model = {
 userEmail: ko.observable('')
 };

 ruleEngine.apply(model);

 ko.applyBindings(model, $('html')[0]);
 });

 The above will apply the email rule to the model property userEmail.
 ===============================================================================
 */
/* globals require: false, exports: false, define: false, ko: false */

(function (factory) {
    // Module systems magic dance.

    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS or Node: hard-coded dependency on "knockout"
        factory(require("knockout"), require("knockout.validation"), exports);
    } else if (typeof define === "function" && define["amd"]) {
        // AMD anonymous module with hard-coded dependency on "knockout"
        define(["knockout", "knockout.validation", "exports"], factory);
    } else {
        // <script> tag: use the global `ko` object, attaching a `mapping` property
        factory(ko, ko.validation, ko.RuleEngine = {});
    }

}(function (ko, validation, exports) {

    if (typeof (ko) === undefined) {
        throw 'Knockout is required, please ensure it is loaded before loading this plug-in';
    }

    if (typeof (validation) === undefined) {
        throw 'Knockout.Validation is required, please ensure it is loaded before loading this plug-in';
    }

    exports = function (ruleSet, options) {
        var utils = ko.utils;
        options = options || {};
        ruleSet = ruleSet || {};

        options = utils.extend({insertMessages: true, messagesOnModified: true, deep: true}, options);

        function apply(model, rules) {
            if (rules) {
                utils.extend(ruleSet, rules);
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

        function addRuleSet(newRuleSet){
           utils.extend(ruleSet, newRuleSet || {});
        }

        function initialize(options) {
            ko.validation.init(options);
        }

        function traverseGraph(obj, options) {
            var objValues = [],
                val = utils.unwrapObservable(obj);

            // if object is observable then add it to the list
            if (ko.isObservable(obj) && !obj.isValid) {
                obj.extend({ validatable: true });
            }

            //get list of values either from array or object but ignore non-objects
            if (val && (isArray(val) || isObject(val))) {
                objValues = val;
            }

            utils.objectForEach(objValues, function (k, v) {
                var fieldRules = getFieldRuleSet(k);
                if (fieldRules && ko.isObservable(v)) {
                    v.extend(fieldRules);
                }
                if (options.deep && v !== undefined && !ko.isObservable(v)) {
                    traverseGraph(v, options);
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
            addRuleSet: addRuleSet,
            apply: apply,
            getFieldRuleSet: getFieldRuleSet,
            registerExtenders: ko.validation.registerExtenders,
            ruleSet: ruleSet,
            rules: ko.validation.rules
        };
    };

    ko.RuleEngine = exports;

    return ko.RuleEngine;
}));