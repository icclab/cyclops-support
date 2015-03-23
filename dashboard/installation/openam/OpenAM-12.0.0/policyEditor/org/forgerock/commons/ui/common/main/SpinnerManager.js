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

/*global define, window */

/**
 * @author mbilski
 */
define("org/forgerock/commons/ui/common/main/SpinnerManager", [
    "jquery",
    "spin"
], function($, Spinner) {

    var obj = {};
    
    obj.showSpinner = function(priority) {
        if(obj.spinner) {
            obj.hideSpinner();
        }
        
        obj.spinner = new Spinner().spin(document.getElementById('wrapper'));
        $(".spinner").position({
                                of: $(window),
                                my: "center center",
                                at: "center center"
                            });

        if (priority && (!obj.priority || priority > obj.priority)) {
            obj.priority = priority;
        }
    };
    
    obj.hideSpinner = function(priority) {
        if(obj.spinner && (!obj.priority || (priority && priority >= obj.priority))) {
            obj.spinner.stop();
            delete obj.priority;
        }
    };

    return obj;
});