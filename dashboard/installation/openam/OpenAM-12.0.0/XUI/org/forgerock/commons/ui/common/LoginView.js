define("org/forgerock/commons/ui/common/LoginView",["org/forgerock/commons/ui/common/main/AbstractView","org/forgerock/commons/ui/common/main/ValidatorsManager","org/forgerock/commons/ui/common/main/EventManager","org/forgerock/commons/ui/common/util/Constants","org/forgerock/commons/ui/common/util/CookieHelper","org/forgerock/commons/ui/common/main/Configuration"],function(e,t,n,r,i,s){var o=e.extend({template:"templates/common/LoginTemplate.html",baseTemplate:"templates/common/LoginBaseTemplate.html",events:{"click input[type=submit]":"formSubmit",onValidate:"onValidate"},formSubmit:function(e){e.preventDefault();if(this.$el.find("[name=loginRemember]:checked").length!==0){var t=new Date;t.setDate(t.getDate()+7300),i.setCookie("login",this.$el.find("input[name=login]").val(),t)}else i.deleteCookie("login");n.sendEvent(r.EVENT_LOGIN_REQUEST,{userName:this.$el.find("input[name=login]").val(),password:this.$el.find("input[name=password]").val()})},render:function(e,n){this.data.hasOptionalUIFeatures=!!s.globalData.selfRegistration||!!s.globalData.securityQuestions||!!s.globalData.siteIdentification||!!s.globalData.passwordResetLink,this.parentRender(function(){t.bindValidators(this.$el);var e=i.getCookie("login");e?(this.$el.find("input[name=login]").val(e).prop("autofocus",!1),this.$el.find("[name=loginRemember]").prop("checked",!0),t.validateAllFields(this.$el),this.$el.find("[name=password]").focus()):this.$el.find("input[name=login]").focus(),n&&n()})}});return new o})