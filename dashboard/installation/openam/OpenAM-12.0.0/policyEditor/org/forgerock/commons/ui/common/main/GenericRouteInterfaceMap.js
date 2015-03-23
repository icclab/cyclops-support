/**
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2011-2013 ForgeRock AS. All rights reserved.
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

/*global define, require */

/**
 * @author huck.elliott
 */
define("org/forgerock/commons/ui/common/main/GenericRouteInterfaceMap", [
    "underscore",
    "org/forgerock/commons/ui/common/main/AbstractConfigurationAware"
], function(_, AbstractConfigurationAware) {
    var obj = new AbstractConfigurationAware();
    //this module is a generic way of defining require js routes
    //another way of doing this same thing would be to add a route to app_root/main.js
    /*
      require.config({
        paths: {
            LoginView: "org/forgerock/openam/ui/user/login/RESTLoginView"
        });
      require(["LoginView"]);
    */
    //but this would be quite messy for a large number of routes
    obj.updateConfigurationCallback = function (conf) {
        //loop over each configuration key/value pair
        _.each(conf,function(val,key){
            //define the module by keyname
            //and call the require function using the filepath
            define(key, require(val));
            //once defined we need to load the module so that 
            //it is available to routes.js
            require([key]);
        });
    };
    
    return obj;
});


