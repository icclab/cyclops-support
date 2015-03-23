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

define("org/forgerock/commons/ui/common/components/Dialog", [
    "jquery",
    "underscore",
    "org/forgerock/commons/ui/common/main/AbstractView",
    "org/forgerock/commons/ui/common/util/UIUtils",
    "org/forgerock/commons/ui/common/util/Constants", 
    "org/forgerock/commons/ui/common/main/EventManager",
    "org/forgerock/commons/ui/common/main/Configuration"
], function($, _, AbstractView, uiUtils, constants, eventManager, conf) {
    var Dialog = AbstractView.extend({
        template: "templates/common/DialogTemplate.html",
        element: "#dialogs",

        data: { },

        mode: "append",

        events: {
            "click .dialogCloseCross img": "close",
            "click input[name='close']": "close",
            "click .dialogContainer": "stop"
        },
        
        actions: [
            {
                "type": "button",
                "name": "close"
            }
        ],
        
        stop: function(event) {
            event.stopPropagation();
        },
        
        /**
         * Creates new dialog in #dialogs div. Fills it with dialog template.
         * Then creates actions buttons and bind events. If actions map is empty, default
         * close action is added.
         */
        show: function(callback) {
            
            this.setElement($("#dialogs"));
            this.parentRender(_.bind(function() {
                this.setElement(this.$el.find(".dialogContainer:last"));
                $("#dialogs").addClass('show');
                $("#dialog-background").addClass('show');
                $("#dialog-background").off('click').on('click', _.bind(this.close, this));
         
                _.each(this.actions, _.bind(function(a) {
                    this.$el.find(".dialogActions").append("<input type='"+ a.type +"' name='"+ a.name +"' value='"+ a.name +"' class='button float-right' />");                    
                }, this));
                
                this.loadContent(callback);
            }, this));
        },
        
 
        
        /**
         * Loads template from 'contentTemplate'
         */
        loadContent: function(callback) {
            if(callback) {
                uiUtils.renderTemplate(this.data.theme.path + this.contentTemplate, this.$el.find(".dialogContent"), _.extend({}, conf.globalData, this.data), _.bind(callback, this), "append");
            } else {
                uiUtils.renderTemplate(this.data.theme.path + this.contentTemplate, this.$el.find(".dialogContent"), _.extend({}, conf.globalData, this.data), null, "append");
            }
        },
        
        render: function() {
            this.show();
        },

        close: function(event) {
            if(event) {
                event.preventDefault();
            }
            
            if($(".dialogContainer").length < 2) {
                $("#dialog-background").removeClass('show');
                $("#dialogs").removeClass('show');
            }
            
            eventManager.sendEvent(constants.EVENT_DIALOG_CLOSE);
            
            this.$el.remove();
        },


        addAction: function(name, type) {
            if(!this.getAction(name)) {
                this.actions.push({
                    "name" : name,
                    "type" : type
                });
            }
        },

        getAction: function(name) {
            return _.find(this.actions, function(a) {
                return a.name === name;
            });
        }
    });

    return Dialog;
});