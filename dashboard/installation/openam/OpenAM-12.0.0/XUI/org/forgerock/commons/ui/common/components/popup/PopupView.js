define("org/forgerock/commons/ui/common/components/popup/PopupView",["jquery"],function(e){var t={};return t.init=function(){e("#popup").on("mouseleave",function(e){t.hide()})},t.setContent=function(t){e("#popup-content").html(t)},t.setPositionBy=function(t){var n,r=e(t).position().left,i=e(t).position().top,s=e(t).width(),o=e(t).height();e("#popup").css("left",r),e("#popup").css("top",i),e("#popup").css("height",o),e("#popup-content").css("margin-left",20),n=e("#popup-content").height(),e("#popup-content").css("margin-top",-n*1.2)},t.show=function(){e("#popup").show()},t.hide=function(){e("#popup").hide()},t})