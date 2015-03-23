/**
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2012 ForgeRock AS. All rights reserved.
 *
 * The contents of this file are subject to the terms
 * of the Common Development and Distribution License
 * (the License). You may not use this file except in
 * compliance with the License.
 *
 * You can obtain a copy of the License at
 * http://forgerock.org/license/CDDLv1.0.html
 * See the License for the specific language governing
 * permission and limitations under the License.
 *
 * When distributing Covered Code, include this CDDL
 * Header Notice in each file and include the License file
 * at http://forgerock.org/license/CDDLv1.0.html
 * If applicable, add the following below the CDDL Header,
 * with the fields enclosed by brackets [] replaced by
 * your own identifying information:
 * "Portions Copyrighted [year] [name of copyright owner]"
 */

/*global require, define, form2js */

/**
 * @author mbilski
 */
define("org/forgerock/commons/ui/common/main/ValidatorsManager", [
    "jquery",
    "underscore",
    "org/forgerock/commons/ui/common/main/AbstractConfigurationAware",
    "org/forgerock/commons/ui/common/util/ValidatorsUtils"
], function($, _, AbstractConfigurationAware, validatorUtils) {
    var obj = new AbstractConfigurationAware();
    
    obj.bindValidators = function(el, baseEntity, callback) {
        var event, input, policyDelegate,
            validateDependents = function (input) {
                // re-validate dependent form fields
                if (input.attr("data-validation-dependents")) {
                    input
                        .closest("form")
                        .find(':input')
                        .filter(function () { return $.inArray($(this).attr("name"), input.attr("data-validation-dependents").split(",")) !== -1; })
                        .trigger("change");
                }
            },
            postValidation = function  (policyFailures) {
                var simpleFailures = [], msg = [],
                    len = policyFailures.length,
                    policyFailure,
                    k;
                
                for (k = 0; k < len; k++) {
                    policyFailure = policyFailures[k];
                    if ($.inArray(policyFailure.policyRequirement, simpleFailures) === -1) {
                        simpleFailures.push(policyFailure.policyRequirement);
                        msg.push($.t("common.form.validation." + policyFailure.policyRequirement, policyFailure.params));
                    }
                }
                validatorUtils.setErrors(el.find(".validationRules[data-for-validator~='" + this.input.attr("name") + "']"), this.input.attr("name"), simpleFailures);

                if (policyFailures.length) {
                    this.input.attr("data-validation-status", "error");
                } else {
                    this.input.attr("data-validation-status", "ok");
                }
                
                el.trigger("onValidate", [this.input, msg.length ? msg.join("<br>") : false]);
                
                validateDependents(this.input);
            };

        
        _.each(el.find("[data-validator]"), function(input) {
            input = el.find(input);

            input.attr("data-validation-status", "error");
            
            if(input.attr('data-validator-event')) {
                event = input.attr('data-validator-event') + " change blur paste";
            } else {
                event = "change blur paste";
            }
  
            _.each(input.attr('data-validator').split(' '), function(type){
                input.on(event, function (e) {
                    obj.validate.call({input: input, el: el, validatorType: type}, e);
                    validateDependents(input);
                });
            });
            
        });
        
        if (baseEntity && obj.configuration.policyDelegate) {
            policyDelegate = require(obj.configuration.policyDelegate);
            policyDelegate.readEntity(baseEntity, _.bind(function (policy) {
                _.each(policy.properties, _.bind(function (property, i) {
                    var input,event,idx;
                    
                    if (property.name.match(/\[\*\]$/)) { // property is an array
                        // if the name is property[*], then this selector will match all inputs named beginning like "property[", including
                        // property[1],property[2], etc...
                        input = el.find("[name^='" + property.name.replace(/\*\]$/, '') + "']");
                    }
                    else {
                        input = el.find("[name='" + property.name + "']");
                    }
                    
                    input.attr("data-validation-status", "error");
                    
                    if (input.attr('data-validator-event')) {
                        event = input.attr('data-validator-event') + " keyup change blur paste";
                    } else {
                        event = "keyup change blur paste";
                    }
                    

                    _.each(property.policyRequirements, function (req) {

                        switch (req) {
                            case "REAUTH_REQUIRED":
                                el.trigger("check_reauth", property.name);
                            break;

                            case "REQUIRED":
                                input.prop('required', true);
                            break;
                        }
                    });
                    
                    // This adds requirement descriptions for DOM containers specifically designated to hold them
                    _.each(el.find(".validationRules[data-for-validator~='" + property.name + "']"), function (ruleContainer) {
                        ruleContainer = el.find(ruleContainer);

                        // we don't want to add the rules to this container more than once,
                        // so checking for this attribute prevents this from happening.
                        if (!ruleContainer.attr('validation-loaded')) {
                            
                            // allPolicyReqParams is used to compile a set of all parameters that get made 
                            // available for policies which produce a given requirement
                            var allPolicyReqParams = {};
                            _.each(property.policies, function (policy) {
    
                                if (policy.params) {
                                    _.each(policy.policyRequirements, function (policyReq) {
                                        if (!allPolicyReqParams[policyReq]) {
                                            allPolicyReqParams[policyReq] = policy.params;
                                        }
                                        else {
                                            $.extend(allPolicyReqParams[policyReq], policy.params);
                                        }
                                    });
                                }
                                
                            });
                            
                            _.each(property.policyRequirements, function (req) {
                                var reqDiv = $('<div class="field-rule"><span class="error">x</span><span/></div>');
                                
                                // if there is no text to show for this rule, then don't display it.
                                if ($.t("common.form.validation." + req, allPolicyReqParams[req]).length) {
                                    reqDiv.find("span:last")
                                        .attr("data-for-req", req)
                                        .attr("data-for-validator", input.attr("name"))
                                        .text($.t("common.form.validation." + req, allPolicyReqParams[req]));
                                    ruleContainer.append(reqDiv);
                                }
                            });
                            ruleContainer.attr('validation-loaded', "true");
                        }
                    });
                    
                    
                    // This binds the events to all of our fields which have validation policies defined by the server
                    _.each(input, function (item, idx) {
                        el.find(input[idx]).on(event, _.bind(function (e) {
                            var validationContext = (e.type === "change" || e.type === "blur") ? "server":"client";

                            $.doTimeout(this.input.attr('name')+'validation' + validationContext, 100, _.bind(function() {
        
                                var j,params,policyFailures = [],
                                    hasServerPolicies = false,
                                    EVAL_IS_EVIL = eval; // JSLint doesn't like eval usage; this is a bit of a hack around that, while acknowledging it.

                                if (!this.input.closest("form")[0]) {
                                    // possible if the form has been removed between the time the event is triggered and the 
                                    // doTimeout is executed (particularly in unit tests)
                                    return;
                                }

                                this.input.siblings(".validation-message").empty();
                                
                                _.each(this.property.policies, _.bind(function(policy,j) {
                                    // The policy may return the JavaScript validation function as a string property;
                                    // If so, we can use that validation function directly here
                                    if (policy.policyFunction) {
                                        
                                        if (!policy.params) {
                                            policy.params = {};
                                        }
                                        
                                        params = policy.params;
                                        // This instantiates the string representation of the function into an actual, executable local function
                                        // and then calls that function, appending the resulting array into our collection of policy failures.
                                        policyFailures = policyFailures.concat(EVAL_IS_EVIL("policyFunction = " + policy.policyFunction).call({failedPolicyRequirements: policyFailures}, form2js(this.input.closest('form')[0]), this.input.val(), params, this.property.name));
                                    }
                                    // we have a special case for reauth required, since that is kind of a strange case.
                                    else if (!($.inArray("REAUTH_REQUIRED", policy.policyRequirements) !== -1 && policy.policyRequirements.length === 1)) {
                                        hasServerPolicies = true;
                                    }
                                }, this));
                                
                                // For those validation policies which cannot be performed within the browser, 
                                // we call to the server to do the validation for us.
                                if (validationContext === "server" && (hasServerPolicies || this.input.attr("data-validation-force-server"))) {
                                    policyFailures = [];
                                    policyDelegate.validateProperty(
                                        baseEntity,
                                        {
                                            "fullObject": form2js(this.input.closest("form")[0], '.', false),
                                            "value": this.input.val(),
                                            "property": this.property.name
                                        }, 
                                        _.bind(function (result) {
                                            var l;
                                            if (!result.result) {
                                                for (l = 0; l < result.failedPolicyRequirements.length; l++) {
                                                    policyFailures = policyFailures.concat(result.failedPolicyRequirements[l].policyRequirements);
                                                }
                                            }
                                            postValidation.call(this, policyFailures);
                                        }, this)
                                    );
                                }
                                else {
                                    postValidation.call(this, policyFailures);
                                }
                                    
                            
                            }, this));
                            
                        }, {property : property, input: el.find(input[idx])}));
                    }, this);
                }, this));
                
                if (callback) {
                    callback();
                }
            }, this));
        
        }
        
    };
    
    obj.validateAllFields = function(el) {
        // we bind "blur" as a validation event to all input fields, to this is enough to trigger the event.
        // Also has the nice effect of not changing the state of the input, as was sometimes happening for different
        // input types (notably, checkboxes with change events).
        el.find(":input").trigger("blur");
    };
    
    obj.formValidated = function(el) {
        return el.find("[data-validation-status=error]").length === 0 && el.find("[data-validation-status=ok]").length !== 0;
    };
    
    obj.formNotInvalid = function(el) {
        return el.find("[data-validation-status=error]").length === 0;
    };

    obj.validate = function(event) {
        var parameters = [this.el, this.input, _.bind(obj.afterValidation, this)], validatorConfig, i;
        _.each(this.validatorType.split(' '), _.bind(function (vt) {

            validatorConfig = obj.configuration.validators[vt];
            
            if(validatorConfig) {
                this.el.trigger("onValidate", [this.input, "inProgress"]);
                
                for(i = 0; i < validatorConfig.dependencies.length; i++) {
                    parameters.push(require(validatorConfig.dependencies[i]));
                }
                
                validatorConfig.validator.apply(this, parameters);
            } else {
                console.error("Could not find such validator: " + validatorConfig);
            }

        }, this));
    };
    
    obj.afterValidation = function(msg) {
        if(msg === "inProgress") {
            this.input.attr("data-validation-status", "error");
        } else if(msg === "disabled") {
            this.input.attr("data-validation-status", "disabled");
        } else if(msg) {
            this.input.attr("data-validation-status", "error");
        } else {
            this.input.attr("data-validation-status", "ok");
        }
        
        this.el.trigger("onValidate", [this.input, msg, this.validatorType]);
    };

    return obj;

});    

