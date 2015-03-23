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

/*global define, require */

/**
* @author mbilski
*/
define("org/forgerock/commons/ui/common/SiteConfigurator", [
    "jquery",
    "underscore",
    "org/forgerock/commons/ui/common/main/AbstractConfigurationAware",
    "org/forgerock/commons/ui/common/util/Constants", 
    "org/forgerock/commons/ui/common/main/EventManager",
    "org/forgerock/commons/ui/common/main/Configuration",
    "org/forgerock/commons/ui/common/main/i18nManager"
], function($, _, AbstractConfigurationAware, constants, eventManager, conf, i18nManager) {
    var obj = new AbstractConfigurationAware();
    
    obj.initialized = false;
    
    $(document).on(constants.EVENT_READ_CONFIGURATION_REQUEST, function() {
        var configurationDelegate;

        if (!conf.globalData) {
            conf.setProperty('globalData', {});
            conf.globalData.auth = {};
        }

        if (!conf.delegateCache) {
            conf.setProperty('delegateCache', {});
        }

        console.info("READING CONFIGURATION");

        if (obj.configuration && obj.initialized === false) {
            obj.initialized = true;
            
            if (obj.configuration.remoteConfig === true) {
                configurationDelegate = require(obj.configuration.delegate);
                configurationDelegate.getConfiguration(function(config) {
                    obj.processConfiguration(config); 
                    eventManager.sendEvent(constants.EVENT_APP_INTIALIZED);
                }, function() {
                    obj.processConfiguration({}); 
                    eventManager.sendEvent(constants.EVENT_APP_INTIALIZED);
                });
            } else {
                obj.processConfiguration(obj.configuration); 
                eventManager.sendEvent(constants.EVENT_APP_INTIALIZED);
            }
        }
    });

    obj.processConfiguration = function(config) {
        // whatever settings were found will be saved in globalData
        _.extend(conf.globalData, config);

        if (config.defaultNotificationType) {
            conf.defaultType = config.defaultNotificationType;
        }

        if (config.notificationTypes) {
            conf.notificationTypes = config.notificationTypes;
        }

        if (config.roles) {
            conf.globalData.userRoles = config.roles;
        }

        conf.globalData.auth.cookieName = config.cookieName;
        conf.globalData.auth.cookieDomains = config.domains;

        i18nManager.init(config.lang);

    };

    obj.configurePage = function (route, params) {
       var promise = $.Deferred(),
           configurationDelegate;

           if (obj.configuration.remoteConfig === true) {
                 configurationDelegate = require(obj.configuration.delegate);
                 if (typeof configurationDelegate.checkForDifferences === "function") {
                     configurationDelegate.checkForDifferences(route, params).then(function (config) {
                         if (config) {
                             obj.processConfiguration(config);
                         }
                         promise.resolve();
                     });
           } else {
               promise.resolve();
           }
       } else {
             promise.resolve();
       }

       return promise;
   };
    
    return obj;
});