/**
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2011-2012 ForgeRock AS. All rights reserved.
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

/*global define */

/**
 * @author mbilski
 */
define("config/validators/CommonValidators", [
    "jquery"
], function($) {
    var obj = {
        "required": {
            "name": "Required field",
            "dependencies": [
            ],
            "validator": function(el, input, callback) {
                var v = input.val();
                if (!v || v === "") {
                    callback([$.t("common.form.validation.required")]);
                    return;
                }

                callback();
            }
        },
        "passwordConfirm": {
            "name": "Password confirmation",
            "dependencies": [
                "org/forgerock/commons/ui/common/util/ValidatorsUtils"
            ],
            "validator": function(el, input, callback, utils) {
                var v = input.val();

                if (v === "" || el.find("input[name=password]").val() !== el.find("input[name=passwordConfirm]").val()) {
                    callback([$.t("common.form.validation.confirmationMatchesPassword")]);
                    return;
                }

                callback();
            }
        },
        "minLength": {
            "name": "Password validator",
            "dependencies": [
                "org/forgerock/commons/ui/common/util/ValidatorsUtils"
            ],
            "validator": function(el, input, callback, utils) {
                var v = input.val(),
                    errors = [],
                    len = input.attr('minLength');
                
                if (v.length < len) {
                    errors.push($.t("common.form.validation.MIN_LENGTH", {minLength: len}));
                }

                if (errors.length === 0) {
                    callback();
                } else {
                    callback(errors);
                }
            }
        }
    };
    return obj;
});
