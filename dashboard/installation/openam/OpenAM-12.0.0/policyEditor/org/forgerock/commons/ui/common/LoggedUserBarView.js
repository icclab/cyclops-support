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
define("org/forgerock/commons/ui/common/LoggedUserBarView", [
    "backbone",
    "org/forgerock/commons/ui/common/main/EventManager",
    "org/forgerock/commons/ui/common/util/Constants",
    "org/forgerock/commons/ui/common/main/Configuration"
], function(Backbone, eventManager, constants, conf) {
    var LoggedUserBarView = Backbone.View.extend({
        element: "#loginContent",
        events : {
            "click #logout_link": "logout"
        },

        logout: function (e) {
            e.preventDefault();
            eventManager.sendEvent(constants.EVENT_LOGOUT);
        },
        
        render: function( args, callback ) {
            this.setElement(this.element);
            
            if(conf.loggedUser) {
                this.$el.find("#profile_link").show();
                if (conf.loggedUser.userName) {
                    this.$el.find("#user_name").text(conf.loggedUser.userName); //idm
                } else if (conf.loggedUser.cn) {
                    this.$el.find("#user_name").text(conf.loggedUser.cn); //am
                }
                
                this.$el.show();
            } else {
                this.$el.hide();
            }
            if(callback) {
                callback();
            }
        }
    }); 
    
    return new LoggedUserBarView();
});


