define("org/forgerock/commons/ui/user/profile/UserProfileView",["org/forgerock/commons/ui/common/main/AbstractView","org/forgerock/commons/ui/common/main/ValidatorsManager","org/forgerock/commons/ui/common/util/UIUtils","UserDelegate","org/forgerock/commons/ui/common/main/Router","org/forgerock/commons/ui/common/components/Navigation","org/forgerock/commons/ui/common/main/EventManager","org/forgerock/commons/ui/common/util/Constants","org/forgerock/commons/ui/common/main/Configuration"],function(e,t,n,r,i,s,o,u,a){var f=e.extend({template:"templates/user/UserProfileTemplate.html",baseTemplate:"templates/common/DefaultBaseTemplate.html",delegate:r,events:{"click input[name=saveButton]":"formSubmit","click input[name=resetButton]":"reloadData",onValidate:"onValidate"},data:{},submit:function(){var e=this;this.delegate.updateUser(a.loggedUser,this.data,_.bind(function(t){_.has(t,"_rev")&&(e.data._rev=t._rev),$.extend(a.loggedUser,e.data),o.sendEvent(u.EVENT_DISPLAY_MESSAGE_REQUEST,"profileUpdateSuccessful")},this),function(t){console.log("errorCallback",t.responseText),o.sendEvent(u.EVENT_DISPLAY_MESSAGE_REQUEST,"profileUpdateFailed"),e.reloadData()})},formSubmit:function(e){e.preventDefault(),e.stopPropagation();var n=this,r=[];t.formValidated(this.$el)?(this.data=form2js(this.el,".",!1),_.each(this.data,function(e,t,n){this.$el.find("input[name="+t+"]").hasClass("button")&&delete this.data[t]},this),_.each(a.globalData.protectedUserAttributes,function(e){n.data[e]&&a.loggedUser[e]!==n.data[e]&&r.push(" "+n.$el.find("label[for="+e+"]").text())}),r.length===0?this.submit():location.hash=i.configuration.routes.confirmPassword.url):console.log("invalid form")},render:function(e,n){this.parentRender(function(){t.bindValidators(this.$el,this.delegate.getUserResourceName(a.loggedUser),_.bind(function(){this.reloadData(),n&&n()},this))})},reloadData:function(){js2form(this.$el.find("#userProfileForm")[0],a.loggedUser),this.$el.find("input[name=saveButton]").val($.t("common.form.update")),this.$el.find("input[name=resetButton]").val($.t("common.form.reset")),t.validateAllFields(this.$el)}});return new f})