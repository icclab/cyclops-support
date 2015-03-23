/**
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2011-2014 ForgeRock AS. All rights reserved.
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
 * @author jkigwana
 */

define("org/forgerock/commons/ui/common/components/Messages", [
    "jquery",
    "underscore",
    "backbone",
    "org/forgerock/commons/ui/common/main/AbstractConfigurationAware"
], function($, _, Backbone, AbstractConfigurationAware) {
    var obj = new AbstractConfigurationAware(), Messages;

    Messages = Backbone.View.extend({

        list: [],
        el: "#messages",
        events: {
            "click div": "removeAndNext"
        },
        delay:2500,
        timer:null,
        
        displayMessageFromConfig: function(event) {
            var _this = obj.messages;
            if (typeof event === "object") {
                if (typeof event.key === "string") {
                    _this.addMessage({
                        message: $.t(obj.configuration.messages[event.key].msg, event), 
                        type: obj.configuration.messages[event.key].type
                    });
                }
            } else if (typeof event === "string") {
                _this.addMessage({
                    message: $.t(obj.configuration.messages[event].msg), 
                    type: obj.configuration.messages[event].type
                });
            }

        },

        addMessage: function(msg) {
            var i, _this = obj.messages;
            for(i = 0; i < _this.list.length; i++) {
                if(_this.list[i].message === msg.message) {
                    console.log("duplicated message");
                    return;
                }
            }
            console.info(msg.type + ":", msg.message, msg);
            _this.list.push(msg); 
            if (_this.list.length <= 1) {
                _this.showMessage(msg);
            }
        },
    
        nextMessage: function() {   
            var _this = obj.messages;
            _this.list.shift();
            if (_this.list.length > 0) {
                _this.showMessage();
            }
        },

        removeAndNext: function() {
            var _this = obj.messages;
            window.clearTimeout(obj.messages.timer);
            _this.$el.find("div").fadeOut(300, function(){
                $(this).remove();
                _this.nextMessage();
            }); 
        },

        showMessage: function() {
            var _this = this, 
                errorType = this.list[0].type === "error" ? "errorMessage" : "confirmMessage",
                delay = _this.delay + (this.list[0].message.length * 20);
            this.$el.append("<div class='"+errorType+"'><span class='error-outter'><span class='error-inner'><span>" + this.list[0].message + "</span></span></span></div>");
            this.$el.find("div:last").fadeIn(300, function () {
                _this.timer = window.setTimeout(_this.removeAndNext, delay);
            });
        },

        hideMessages: function() {
            var _this = obj.messages;
            if (_this.list.length > 1) {
                _this.list = [_this.list[1]];
            }
        }

    });
    
    obj.messages = new Messages();

    return obj;
});