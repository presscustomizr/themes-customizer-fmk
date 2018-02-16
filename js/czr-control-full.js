window.addEventListener=window.addEventListener||function(r,t){window.attachEvent("on"+r,t)},Date.now||(Date.now=function(){return(new Date).getTime()}),Object.create||(Object.create=function(r,t){if(void 0!==t)throw"The multiple-argument version of Object.create is not provided by this browser and cannot be shimmed.";function e(){}return e.prototype=r,new e}),Array.prototype.filter||(Array.prototype.filter=function(r){"use strict";if(void 0===this||null===this)throw new TypeError;var t=Object(this),e=t.length>>>0;if("function"!=typeof r)throw new TypeError;for(var n=[],o=arguments.length>=2?arguments[1]:void 0,i=0;i<e;i++)if(i in t){var a=t[i];r.call(o,a,i,t)&&n.push(a)}return n}),Array.prototype.map||(Array.prototype.map=function(r,t){var e,n,o;if(null===this)throw new TypeError(" this is null or not defined");var i=Object(this),a=i.length>>>0;if("function"!=typeof r)throw new TypeError(r+" is not a function");for(arguments.length>1&&(e=t),n=new Array(a),o=0;o<a;){var f,u;o in i&&(f=i[o],u=r.call(e,f,o,i),n[o]=u),o++}return n}),Array.from||(Array.from=function(){var r=Object.prototype.toString,t=function(t){return"function"==typeof t||"[object Function]"===r.call(t)},e=Math.pow(2,53)-1,n=function(r){var t,n=(t=Number(r),isNaN(t)?0:0!==t&&isFinite(t)?(t>0?1:-1)*Math.floor(Math.abs(t)):t);return Math.min(Math.max(n,0),e)};return function(r){var e=Object(r);if(null==r)throw new TypeError("Array.from requires an array-like object - not null or undefined");var o,i=arguments.length>1?arguments[1]:void 0;if(void 0!==i){if(!t(i))throw new TypeError("Array.from: when provided, the second argument must be a function");arguments.length>2&&(o=arguments[2])}for(var a,f=n(e.length),u=t(this)?Object(new this(f)):new Array(f),c=0;c<f;)a=e[c],u[c]=i?void 0===o?i(a,c):i.call(o,a,c):a,c+=1;return u.length=f,u}}());/*! iCheck v1.0.1 by Damir Sultanov, http://git.io/arlzeA, MIT Licensed */
if ( 'function' != typeof(jQuery.fn.iCheck) ) {
  !function(a){function b(a,b,e){var f=a[0],g=/er/.test(e)?p:/bl/.test(e)?n:l,h=e==q?{checked:f[l],disabled:f[n],indeterminate:"true"==a.attr(p)||"false"==a.attr(o)}:f[g];if(/^(ch|di|in)/.test(e)&&!h)c(a,g);else if(/^(un|en|de)/.test(e)&&h)d(a,g);else if(e==q)for(g in h)h[g]?c(a,g,!0):d(a,g,!0);else b&&"toggle"!=e||(b||a[u]("ifClicked"),h?f[r]!==k&&d(a,g):c(a,g))}function c(b,c,e){var q=b[0],u=b.parent(),v=c==l,x=c==p,y=c==n,z=x?o:v?m:"enabled",A=f(b,z+g(q[r])),B=f(b,c+g(q[r]));if(!0!==q[c]){if(!e&&c==l&&q[r]==k&&q.name){var C=b.closest("form"),D='input[name="'+q.name+'"]',D=C.length?C.find(D):a(D);D.each(function(){this!==q&&a(this).data(i)&&d(a(this),c)})}x?(q[c]=!0,q[l]&&d(b,l,"force")):(e||(q[c]=!0),v&&q[p]&&d(b,p,!1)),h(b,v,c,e)}q[n]&&f(b,w,!0)&&u.find("."+j).css(w,"default"),u[s](B||f(b,c)||""),y?u.attr("aria-disabled","true"):u.attr("aria-checked",x?"mixed":"true"),u[t](A||f(b,z)||"")}function d(a,b,c){var d=a[0],e=a.parent(),i=b==l,k=b==p,q=b==n,u=k?o:i?m:"enabled",v=f(a,u+g(d[r])),x=f(a,b+g(d[r]));!1!==d[b]&&((k||!c||"force"==c)&&(d[b]=!1),h(a,i,u,c)),!d[n]&&f(a,w,!0)&&e.find("."+j).css(w,"pointer"),e[t](x||f(a,b)||""),q?e.attr("aria-disabled","false"):e.attr("aria-checked","false"),e[s](v||f(a,u)||"")}function e(b,c){b.data(i)&&(b.parent().html(b.attr("style",b.data(i).s||"")),c&&b[u](c),b.off(".i").unwrap(),a(v+'[for="'+b[0].id+'"]').add(b.closest(v)).off(".i"))}function f(a,b,c){return a.data(i)?a.data(i).o[b+(c?"":"Class")]:void 0}function g(a){return a.charAt(0).toUpperCase()+a.slice(1)}function h(a,b,c,d){d||(b&&a[u]("ifToggled"),a[u]("ifChanged")[u]("if"+g(c)))}var i="iCheck",j=i+"-helper",k="radio",l="checked",m="un"+l,n="disabled",o="determinate",p="in"+o,q="update",r="type",s="addClass",t="removeClass",u="trigger",v="label",w="cursor",x=/ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);a.fn[i]=function(f,g){var h='input[type="checkbox"], input[type="'+k+'"]',m=a(),o=function(b){b.each(function(){var b=a(this);m=b.is(h)?m.add(b):m.add(b.find(h))})};if(/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(f))return f=f.toLowerCase(),o(this),m.each(function(){var c=a(this);"destroy"==f?e(c,"ifDestroyed"):b(c,!0,f),a.isFunction(g)&&g()});if("object"!=typeof f&&f)return this;var w=a.extend({checkedClass:l,disabledClass:n,indeterminateClass:p,labelHover:!0,aria:!1},f),y=w.handle,z=w.hoverClass||"hover",A=w.focusClass||"focus",B=w.activeClass||"active",C=!!w.labelHover,D=w.labelHoverClass||"hover",E=0|(""+w.increaseArea).replace("%","");return("checkbox"==y||y==k)&&(h='input[type="'+y+'"]'),-50>E&&(E=-50),o(this),m.each(function(){var f=a(this);e(f);var g=this,h=g.id,m=-E+"%",o=100+2*E+"%",o={position:"absolute",top:m,left:m,display:"block",width:o,height:o,margin:0,padding:0,background:"#fff",border:0,opacity:0},m=x?{position:"absolute",visibility:"hidden"}:E?o:{position:"absolute",opacity:0},p="checkbox"==g[r]?w.checkboxClass||"icheckbox":w.radioClass||"i"+k,y=a(v+'[for="'+h+'"]').add(f.closest(v)),F=!!w.aria,G=i+"-"+Math.random().toString(36).substr(2,6),H='<div class="'+p+'" '+(F?'role="'+g[r]+'" ':"");F&&y.each(function(){H+='aria-labelledby="',this.id?H+=this.id:(this.id=G,H+=G),H+='"'}),H=f.wrap(H+"/>")[u]("ifCreated").parent().append(w.insert),o=a('<ins class="'+j+'"/>').css(o).appendTo(H),f.data(i,{o:w,s:f.attr("style")}).css(m),w.inheritClass&&H[s](g.className||""),w.inheritID&&h&&H.attr("id",i+"-"+h),"static"==H.css("position")&&H.css("position","relative"),b(f,!0,q),y.length&&y.on("click.i mouseover.i mouseout.i touchbegin.i touchend.i",function(c){var d=c[r],e=a(this);if(!g[n]){if("click"==d){if(a(c.target).is("a"))return;b(f,!1,!0)}else C&&(/ut|nd/.test(d)?(H[t](z),e[t](D)):(H[s](z),e[s](D)));if(!x)return!1;c.stopPropagation()}}),f.on("click.i focus.i blur.i keyup.i keydown.i keypress.i",function(a){var b=a[r];return a=a.keyCode,"click"==b?!1:"keydown"==b&&32==a?(g[r]==k&&g[l]||(g[l]?d(f,l):c(f,l)),!1):("keyup"==b&&g[r]==k?!g[l]&&c(f,l):/us|ur/.test(b)&&H["blur"==b?t:s](A),void 0)}),o.on("click mousedown mouseup mouseover mouseout touchbegin.i touchend.i",function(a){var c=a[r],d=/wn|up/.test(c)?B:z;if(!g[n]){if("click"==c?b(f,!1,!0):(/wn|er|in/.test(c)?H[s](d):H[t](d+" "+B),y.length&&C&&d==z&&y[/ut|nd/.test(c)?t:s](D)),!x)return!1;a.stopPropagation()}})})}}(window.jQuery||window.Zepto);
}
/* 
 * Selecter v3.0.9 - 2014-02-10 
 * A jQuery plugin for replacing default select elements. Part of the Formstone Library. 
 * http://formstone.it/selecter/ 
 * 
 * Copyright 2014 Ben Plum; MIT Licensed 
 */
if ( 'function' != typeof(jQuery.fn.selecter) ) {
  !function(a,b){"use strict";function c(b){b=a.extend({},x,b||{}),null===w&&(w=a("body"));for(var c=a(this),e=0,f=c.length;f>e;e++)d(c.eq(e),b);return c}function d(b,c){if(!b.hasClass("selecter-element")){c=a.extend({},c,b.data("selecter-options")),c.external&&(c.links=!0);var d=b.find("option, optgroup"),g=d.filter("option"),h=g.filter(":selected"),n=""!==c.label?-1:g.index(h),p=c.links?"nav":"div";c.tabIndex=b[0].tabIndex,b[0].tabIndex=-1,c.multiple=b.prop("multiple"),c.disabled=b.is(":disabled");var q="<"+p+' class="selecter '+c.customClass;v?q+=" mobile":c.cover&&(q+=" cover"),q+=c.multiple?" multiple":" closed",c.disabled&&(q+=" disabled"),q+='" tabindex="'+c.tabIndex+'">',c.multiple||(q+='<span class="selecter-selected'+(""!==c.label?" placeholder":"")+'">',q+=a("<span></span").text(r(""!==c.label?c.label:h.text(),c.trim)).html(),q+="</span>"),q+='<div class="selecter-options">',q+="</div>",q+="</"+p+">",b.addClass("selecter-element").after(q);var s=b.next(".selecter"),u=a.extend({$select:b,$allOptions:d,$options:g,$selecter:s,$selected:s.find(".selecter-selected"),$itemsWrapper:s.find(".selecter-options"),index:-1,guid:t++},c);e(u),o(n,u),void 0!==a.fn.scroller&&u.$itemsWrapper.scroller(),u.$selecter.on("touchstart.selecter click.selecter",".selecter-selected",u,f).on("click.selecter",".selecter-item",u,j).on("close.selecter",u,i).data("selecter",u),u.$select.on("change.selecter",u,k),v||(u.$selecter.on("focus.selecter",u,l).on("blur.selecter",u,m),u.$select.on("focus.selecter",u,function(a){a.data.$selecter.trigger("focus")}))}}function e(b){for(var c="",d=b.links?"a":"span",e=0,f=0,g=b.$allOptions.length;g>f;f++){var h=b.$allOptions.eq(f);if("OPTGROUP"===h[0].tagName)c+='<span class="selecter-group',h.is(":disabled")&&(c+=" disabled"),c+='">'+h.attr("label")+"</span>";else{var i=h.val();h.attr("value")||h.attr("value",i),c+="<"+d+' class="selecter-item',h.is(":selected")&&""===b.label&&(c+=" selected"),h.is(":disabled")&&(c+=" disabled"),c+='" ',c+=b.links?'href="'+i+'"':'data-value="'+i+'"',c+=">"+a("<span></span>").text(r(h.text(),b.trim)).html()+"</"+d+">",e++}}b.$itemsWrapper.html(c),b.$items=b.$selecter.find(".selecter-item")}function f(c){c.preventDefault(),c.stopPropagation();var d=c.data;if(!d.$select.is(":disabled"))if(a(".selecter").not(d.$selecter).trigger("close.selecter",[d]),v){var e=d.$select[0];if(b.document.createEvent){var f=b.document.createEvent("MouseEvents");f.initMouseEvent("mousedown",!1,!0,b,0,0,0,0,0,!1,!1,!1,!1,0,null),e.dispatchEvent(f)}else e.fireEvent&&e.fireEvent("onmousedown")}else d.$selecter.hasClass("closed")?g(c):d.$selecter.hasClass("open")&&i(c)}function g(b){b.preventDefault(),b.stopPropagation();var c=b.data;if(!c.$selecter.hasClass("open")){var d=c.$selecter.offset(),e=w.outerHeight(),f=c.$itemsWrapper.outerHeight(!0),g=c.index>=0?c.$items.eq(c.index).position():{left:0,top:0};d.top+f>e&&c.$selecter.addClass("bottom"),c.$itemsWrapper.show(),c.$selecter.removeClass("closed").addClass("open"),w.on("click.selecter-"+c.guid,":not(.selecter-options)",c,h),void 0!==a.fn.scroller?c.$itemsWrapper.scroller("scroll",c.$itemsWrapper.find(".scroller-content").scrollTop()+g.top,0).scroller("reset"):c.$itemsWrapper.scrollTop(c.$itemsWrapper.scrollTop()+g.top)}}function h(b){b.preventDefault(),b.stopPropagation(),0===a(b.currentTarget).parents(".selecter").length&&i(b)}function i(a){a.preventDefault(),a.stopPropagation();var b=a.data;b.$selecter.hasClass("open")&&(b.$itemsWrapper.hide(),b.$selecter.removeClass("open bottom").addClass("closed"),w.off(".selecter-"+b.guid))}function j(b){b.preventDefault(),b.stopPropagation();var c=a(this),d=b.data;if(!d.$select.is(":disabled")){if(d.$itemsWrapper.is(":visible")){var e=d.$items.index(c);o(e,d),p(d)}d.multiple||i(b)}}function k(b,c){var d=a(this),e=b.data;if(!c&&!e.multiple){var f=e.$options.index(e.$options.filter("[value='"+s(d.val())+"']"));o(f,e),p(e)}}function l(b){b.preventDefault(),b.stopPropagation();var c=b.data;c.$select.is(":disabled")||c.multiple||(c.$selecter.addClass("focus").on("keydown.selecter"+c.guid,c,n),a(".selecter").not(c.$selecter).trigger("close.selecter",[c]))}function m(b){b.preventDefault(),b.stopPropagation();var c=b.data;c.$selecter.removeClass("focus").off("keydown.selecter"+c.guid+" keyup.selecter"+c.guid),a(".selecter").not(c.$selecter).trigger("close.selecter",[c])}function n(b){var c=b.data;if(13===b.keyCode)c.$selecter.hasClass("open")&&(i(b),o(c.index,c)),p(c);else if(!(9===b.keyCode||b.metaKey||b.altKey||b.ctrlKey||b.shiftKey)){b.preventDefault(),b.stopPropagation();var d=c.$items.length-1,e=c.index<0?0:c.index;if(a.inArray(b.keyCode,u?[38,40,37,39]:[38,40])>-1)e+=38===b.keyCode||u&&37===b.keyCode?-1:1,0>e&&(e=0),e>d&&(e=d);else{var f,g,h=String.fromCharCode(b.keyCode).toUpperCase();for(g=c.index+1;d>=g;g++)if(f=c.$options.eq(g).text().charAt(0).toUpperCase(),f===h){e=g;break}if(0>e)for(g=0;d>=g;g++)if(f=c.$options.eq(g).text().charAt(0).toUpperCase(),f===h){e=g;break}}e>=0&&o(e,c)}}function o(a,b){var c=b.$items.eq(a),d=c.hasClass("selected"),e=c.hasClass("disabled");if(!e){if(-1===a&&""!==b.label)b.$selected.html(b.label);else if(d)b.multiple&&(b.$options.eq(a).prop("selected",null),c.removeClass("selected"));else{{var f=c.html();c.data("value")}b.multiple?b.$options.eq(a).prop("selected",!0):(b.$selected.html(f).removeClass("placeholder"),b.$items.filter(".selected").removeClass("selected"),b.$select[0].selectedIndex=a),c.addClass("selected")}(!d||b.multiple)&&(b.index=a)}}function p(a){a.links?q(a):(a.callback.call(a.$selecter,a.$select.val(),a.index),a.$select.trigger("change",[!0]))}function q(a){var c=a.$select.val();a.external?b.open(c):b.location.href=c}function r(a,b){return 0===b?a:a.length>b?a.substring(0,b)+"...":a}function s(a){return a.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g,"\\$1")}var t=0,u=b.navigator.userAgent.toLowerCase().indexOf("firefox")>-1,v=/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(b.navigator.userAgent||b.navigator.vendor||b.opera),w=null,x={callback:a.noop,cover:!1,customClass:"",label:"",external:!1,links:!1,trim:0},y={defaults:function(b){return x=a.extend(x,b||{}),a(this)},disable:function(b){return a(this).each(function(c,d){var e=a(d).next(".selecter").data("selecter");if(e)if("undefined"!=typeof b){var f=e.$items.index(e.$items.filter("[data-value="+b+"]"));e.$items.eq(f).addClass("disabled"),e.$options.eq(f).prop("disabled",!0)}else e.$selecter.hasClass("open")&&e.$selecter.find(".selecter-selected").trigger("click.selecter"),e.$selecter.addClass("disabled"),e.$select.prop("disabled",!0)})},enable:function(b){return a(this).each(function(c,d){var e=a(d).next(".selecter").data("selecter");if(e)if("undefined"!=typeof b){var f=e.$items.index(e.$items.filter("[data-value="+b+"]"));e.$items.eq(f).removeClass("disabled"),e.$options.eq(f).prop("disabled",!1)}else e.$selecter.removeClass("disabled"),e.$select.prop("disabled",!1)})},destroy:function(){return a(this).each(function(b,c){var d=a(c).next(".selecter").data("selecter");d&&(d.$selecter.hasClass("open")&&d.$selecter.find(".selecter-selected").trigger("click.selecter"),void 0!==a.fn.scroller&&d.$selecter.find(".selecter-options").scroller("destroy"),d.$select[0].tabIndex=d.tabIndex,d.$select.off(".selecter").removeClass("selecter-element").show(),d.$selecter.off(".selecter").remove())})},refresh:function(){return a(this).each(function(b,c){var d=a(c).next(".selecter").data("selecter");if(d){var f=d.index;d.$allOptions=d.$select.find("option, optgroup"),d.$options=d.$allOptions.filter("option"),d.index=-1,f=d.$options.index(d.$options.filter(":selected")),e(d),o(f,d)}})}};a.fn.selecter=function(a){return y[a]?y[a].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof a&&a?this:c.apply(this,arguments)},a.selecter=function(a){"defaults"===a&&y.defaults.apply(this,Array.prototype.slice.call(arguments,1))}}(jQuery,window);
}
/* 
 * Stepper v3.0.5 - 2014-02-06 
 * A jQuery plugin for cross browser number inputs. Part of the Formstone Library. 
 * http://formstone.it/stepper/ 
 * 
 * Copyright 2014 Ben Plum; MIT Licensed 
 */
if ( 'function' != typeof(jQuery.fn.stepper) ) {
  !function(a){"use strict";function b(b){b=a.extend({},k,b||{});for(var d=a(this),e=0,f=d.length;f>e;e++)c(d.eq(e),b);return d}function c(b,c){if(!b.hasClass("stepper-input")){c=a.extend({},c,b.data("stepper-options"));var e=parseFloat(b.attr("min")),f=parseFloat(b.attr("max")),g=parseFloat(b.attr("step"))||1;b.addClass("stepper-input").wrap('<div class="stepper '+c.customClass+'" />').after('<span class="stepper-arrow up">'+c.labels.up+'</span><span class="stepper-arrow down">'+c.labels.down+"</span>");var h=b.parent(".stepper"),j=a.extend({$stepper:h,$input:b,$arrow:h.find(".stepper-arrow"),min:void 0===typeof e||isNaN(e)?!1:e,max:void 0===typeof f||isNaN(f)?!1:f,step:void 0===typeof g||isNaN(g)?1:g,timer:null},c);j.digits=i(j.step),b.is(":disabled")&&h.addClass("disabled"),h.on("touchstart.stepper mousedown.stepper",".stepper-arrow",j,d).data("stepper",j)}}function d(b){b.preventDefault(),b.stopPropagation(),e(b);var c=b.data;if(!c.$input.is(":disabled")&&!c.$stepper.hasClass("disabled")){var d=a(b.target).hasClass("up")?c.step:-c.step;c.timer=g(c.timer,125,function(){f(c,d,!1)}),f(c,d),a("body").on("touchend.stepper mouseup.stepper",c,e)}}function e(b){b.preventDefault(),b.stopPropagation();var c=b.data;h(c.timer),a("body").off(".stepper")}function f(a,b){var c=parseFloat(a.$input.val()),d=b;void 0===typeof c||isNaN(c)?d=a.min!==!1?a.min:0:a.min!==!1&&c<a.min?d=a.min:d+=c;var e=(d-a.min)%a.step;0!==e&&(d-=e),a.min!==!1&&d<a.min&&(d=a.min),a.max!==!1&&d>a.max&&(d-=a.step),d!==c&&(d=j(d,a.digits),a.$input.val(d).trigger("change"))}function g(a,b,c){return h(a),setInterval(c,b)}function h(a){a&&(clearInterval(a),a=null)}function i(a){var b=String(a);return b.indexOf(".")>-1?b.length-b.indexOf(".")-1:0}function j(a,b){var c=Math.pow(10,b);return Math.round(a*c)/c}var k={customClass:"",labels:{up:"Up",down:"Down"}},l={defaults:function(b){return k=a.extend(k,b||{}),a(this)},destroy:function(){return a(this).each(function(){var b=a(this).data("stepper");b&&(b.$stepper.off(".stepper").find(".stepper-arrow").remove(),b.$input.unwrap().removeClass("stepper-input"))})},disable:function(){return a(this).each(function(){var b=a(this).data("stepper");b&&(b.$input.attr("disabled","disabled"),b.$stepper.addClass("disabled"))})},enable:function(){return a(this).each(function(){var b=a(this).data("stepper");b&&(b.$input.attr("disabled",null),b.$stepper.removeClass("disabled"))})}};a.fn.stepper=function(a){return l[a]?l[a].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof a&&a?this:b.apply(this,arguments)},a.stepper=function(a){"defaults"===a&&l.defaults.apply(this,Array.prototype.slice.call(arguments,1))}}(jQuery,this);
}/*! Select2 4.0.3 | https://github.com/select2/select2/blob/master/LICENSE.md */!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){var b=function(){if(a&&a.fn&&a.fn.select2&&a.fn.select2.amd)var b=a.fn.select2.amd;var b;return function(){if(!b||!b.requirejs){b?c=b:b={};var a,c,d;!function(b){function e(a,b){return u.call(a,b)}function f(a,b){var c,d,e,f,g,h,i,j,k,l,m,n=b&&b.split("/"),o=s.map,p=o&&o["*"]||{};if(a&&"."===a.charAt(0))if(b){for(a=a.split("/"),g=a.length-1,s.nodeIdCompat&&w.test(a[g])&&(a[g]=a[g].replace(w,"")),a=n.slice(0,n.length-1).concat(a),k=0;k<a.length;k+=1)if(m=a[k],"."===m)a.splice(k,1),k-=1;else if(".."===m){if(1===k&&(".."===a[2]||".."===a[0]))break;k>0&&(a.splice(k-1,2),k-=2)}a=a.join("/")}else 0===a.indexOf("./")&&(a=a.substring(2));if((n||p)&&o){for(c=a.split("/"),k=c.length;k>0;k-=1){if(d=c.slice(0,k).join("/"),n)for(l=n.length;l>0;l-=1)if(e=o[n.slice(0,l).join("/")],e&&(e=e[d])){f=e,h=k;break}if(f)break;!i&&p&&p[d]&&(i=p[d],j=k)}!f&&i&&(f=i,h=j),f&&(c.splice(0,h,f),a=c.join("/"))}return a}function g(a,c){return function(){var d=v.call(arguments,0);return"string"!=typeof d[0]&&1===d.length&&d.push(null),n.apply(b,d.concat([a,c]))}}function h(a){return function(b){return f(b,a)}}function i(a){return function(b){q[a]=b}}function j(a){if(e(r,a)){var c=r[a];delete r[a],t[a]=!0,m.apply(b,c)}if(!e(q,a)&&!e(t,a))throw new Error("No "+a);return q[a]}function k(a){var b,c=a?a.indexOf("!"):-1;return c>-1&&(b=a.substring(0,c),a=a.substring(c+1,a.length)),[b,a]}function l(a){return function(){return s&&s.config&&s.config[a]||{}}}var m,n,o,p,q={},r={},s={},t={},u=Object.prototype.hasOwnProperty,v=[].slice,w=/\.js$/;o=function(a,b){var c,d=k(a),e=d[0];return a=d[1],e&&(e=f(e,b),c=j(e)),e?a=c&&c.normalize?c.normalize(a,h(b)):f(a,b):(a=f(a,b),d=k(a),e=d[0],a=d[1],e&&(c=j(e))),{f:e?e+"!"+a:a,n:a,pr:e,p:c}},p={require:function(a){return g(a)},exports:function(a){var b=q[a];return"undefined"!=typeof b?b:q[a]={}},module:function(a){return{id:a,uri:"",exports:q[a],config:l(a)}}},m=function(a,c,d,f){var h,k,l,m,n,s,u=[],v=typeof d;if(f=f||a,"undefined"===v||"function"===v){for(c=!c.length&&d.length?["require","exports","module"]:c,n=0;n<c.length;n+=1)if(m=o(c[n],f),k=m.f,"require"===k)u[n]=p.require(a);else if("exports"===k)u[n]=p.exports(a),s=!0;else if("module"===k)h=u[n]=p.module(a);else if(e(q,k)||e(r,k)||e(t,k))u[n]=j(k);else{if(!m.p)throw new Error(a+" missing "+k);m.p.load(m.n,g(f,!0),i(k),{}),u[n]=q[k]}l=d?d.apply(q[a],u):void 0,a&&(h&&h.exports!==b&&h.exports!==q[a]?q[a]=h.exports:l===b&&s||(q[a]=l))}else a&&(q[a]=d)},a=c=n=function(a,c,d,e,f){if("string"==typeof a)return p[a]?p[a](c):j(o(a,c).f);if(!a.splice){if(s=a,s.deps&&n(s.deps,s.callback),!c)return;c.splice?(a=c,c=d,d=null):a=b}return c=c||function(){},"function"==typeof d&&(d=e,e=f),e?m(b,a,c,d):setTimeout(function(){m(b,a,c,d)},4),n},n.config=function(a){return n(a)},a._defined=q,d=function(a,b,c){if("string"!=typeof a)throw new Error("See almond README: incorrect module build, no module name");b.splice||(c=b,b=[]),e(q,a)||e(r,a)||(r[a]=[a,b,c])},d.amd={jQuery:!0}}(),b.requirejs=a,b.require=c,b.define=d}}(),b.define("almond",function(){}),b.define("jquery",[],function(){var b=a||$;return null==b&&console&&console.error&&console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."),b}),b.define("select2/utils",["jquery"],function(a){function b(a){var b=a.prototype,c=[];for(var d in b){var e=b[d];"function"==typeof e&&"constructor"!==d&&c.push(d)}return c}var c={};c.Extend=function(a,b){function c(){this.constructor=a}var d={}.hasOwnProperty;for(var e in b)d.call(b,e)&&(a[e]=b[e]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},c.Decorate=function(a,c){function d(){var b=Array.prototype.unshift,d=c.prototype.constructor.length,e=a.prototype.constructor;d>0&&(b.call(arguments,a.prototype.constructor),e=c.prototype.constructor),e.apply(this,arguments)}function e(){this.constructor=d}var f=b(c),g=b(a);c.displayName=a.displayName,d.prototype=new e;for(var h=0;h<g.length;h++){var i=g[h];d.prototype[i]=a.prototype[i]}for(var j=(function(a){var b=function(){};a in d.prototype&&(b=d.prototype[a]);var e=c.prototype[a];return function(){var a=Array.prototype.unshift;return a.call(arguments,b),e.apply(this,arguments)}}),k=0;k<f.length;k++){var l=f[k];d.prototype[l]=j(l)}return d};var d=function(){this.listeners={}};return d.prototype.on=function(a,b){this.listeners=this.listeners||{},a in this.listeners?this.listeners[a].push(b):this.listeners[a]=[b]},d.prototype.trigger=function(a){var b=Array.prototype.slice,c=b.call(arguments,1);this.listeners=this.listeners||{},null==c&&(c=[]),0===c.length&&c.push({}),c[0]._type=a,a in this.listeners&&this.invoke(this.listeners[a],b.call(arguments,1)),"*"in this.listeners&&this.invoke(this.listeners["*"],arguments)},d.prototype.invoke=function(a,b){for(var c=0,d=a.length;d>c;c++)a[c].apply(this,b)},c.Observable=d,c.generateChars=function(a){for(var b="",c=0;a>c;c++){var d=Math.floor(36*Math.random());b+=d.toString(36)}return b},c.bind=function(a,b){return function(){a.apply(b,arguments)}},c._convertData=function(a){for(var b in a){var c=b.split("-"),d=a;if(1!==c.length){for(var e=0;e<c.length;e++){var f=c[e];f=f.substring(0,1).toLowerCase()+f.substring(1),f in d||(d[f]={}),e==c.length-1&&(d[f]=a[b]),d=d[f]}delete a[b]}}return a},c.hasScroll=function(b,c){var d=a(c),e=c.style.overflowX,f=c.style.overflowY;return e!==f||"hidden"!==f&&"visible"!==f?"scroll"===e||"scroll"===f?!0:d.innerHeight()<c.scrollHeight||d.innerWidth()<c.scrollWidth:!1},c.escapeMarkup=function(a){var b={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return"string"!=typeof a?a:String(a).replace(/[&<>"'\/\\]/g,function(a){return b[a]})},c.appendMany=function(b,c){if("1.7"===a.fn.jquery.substr(0,3)){var d=a();a.map(c,function(a){d=d.add(a)}),c=d}b.append(c)},c}),b.define("select2/results",["jquery","./utils"],function(a,b){function c(a,b,d){this.$element=a,this.data=d,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<ul class="select2-results__options" role="tree"></ul>');return this.options.get("multiple")&&b.attr("aria-multiselectable","true"),this.$results=b,b},c.prototype.clear=function(){this.$results.empty()},c.prototype.displayMessage=function(b){var c=this.options.get("escapeMarkup");this.clear(),this.hideLoading();var d=a('<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'),e=this.options.get("translations").get(b.message);d.append(c(e(b.args))),d[0].className+=" select2-results__message",this.$results.append(d)},c.prototype.hideMessages=function(){this.$results.find(".select2-results__message").remove()},c.prototype.append=function(a){this.hideLoading();var b=[];if(null==a.results||0===a.results.length)return void(0===this.$results.children().length&&this.trigger("results:message",{message:"noResults"}));a.results=this.sort(a.results);for(var c=0;c<a.results.length;c++){var d=a.results[c],e=this.option(d);b.push(e)}this.$results.append(b)},c.prototype.position=function(a,b){var c=b.find(".select2-results");c.append(a)},c.prototype.sort=function(a){var b=this.options.get("sorter");return b(a)},c.prototype.highlightFirstItem=function(){var a=this.$results.find(".select2-results__option[aria-selected]"),b=a.filter("[aria-selected=true]");b.length>0?b.first().trigger("mouseenter"):a.first().trigger("mouseenter"),this.ensureHighlightVisible()},c.prototype.setClasses=function(){var b=this;this.data.current(function(c){var d=a.map(c,function(a){return a.id.toString()}),e=b.$results.find(".select2-results__option[aria-selected]");e.each(function(){var b=a(this),c=a.data(this,"data"),e=""+c.id;null!=c.element&&c.element.selected||null==c.element&&a.inArray(e,d)>-1?b.attr("aria-selected","true"):b.attr("aria-selected","false")})})},c.prototype.showLoading=function(a){this.hideLoading();var b=this.options.get("translations").get("searching"),c={disabled:!0,loading:!0,text:b(a)},d=this.option(c);d.className+=" loading-results",this.$results.prepend(d)},c.prototype.hideLoading=function(){this.$results.find(".loading-results").remove()},c.prototype.option=function(b){var c=document.createElement("li");c.className="select2-results__option";var d={role:"treeitem","aria-selected":"false"};b.disabled&&(delete d["aria-selected"],d["aria-disabled"]="true"),null==b.id&&delete d["aria-selected"],null!=b._resultId&&(c.id=b._resultId),b.title&&(c.title=b.title),b.children&&(d.role="group",d["aria-label"]=b.text,delete d["aria-selected"]);for(var e in d){var f=d[e];c.setAttribute(e,f)}if(b.children){var g=a(c),h=document.createElement("strong");h.className="select2-results__group";a(h);this.template(b,h);for(var i=[],j=0;j<b.children.length;j++){var k=b.children[j],l=this.option(k);i.push(l)}var m=a("<ul></ul>",{"class":"select2-results__options select2-results__options--nested"});m.append(i),g.append(h),g.append(m)}else this.template(b,c);return a.data(c,"data",b),c},c.prototype.bind=function(b,c){var d=this,e=b.id+"-results";this.$results.attr("id",e),b.on("results:all",function(a){d.clear(),d.append(a.data),b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("results:append",function(a){d.append(a.data),b.isOpen()&&d.setClasses()}),b.on("query",function(a){d.hideMessages(),d.showLoading(a)}),b.on("select",function(){b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("unselect",function(){b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("open",function(){d.$results.attr("aria-expanded","true"),d.$results.attr("aria-hidden","false"),d.setClasses(),d.ensureHighlightVisible()}),b.on("close",function(){d.$results.attr("aria-expanded","false"),d.$results.attr("aria-hidden","true"),d.$results.removeAttr("aria-activedescendant")}),b.on("results:toggle",function(){var a=d.getHighlightedResults();0!==a.length&&a.trigger("mouseup")}),b.on("results:select",function(){var a=d.getHighlightedResults();if(0!==a.length){var b=a.data("data");"true"==a.attr("aria-selected")?d.trigger("close",{}):d.trigger("select",{data:b})}}),b.on("results:previous",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a);if(0!==c){var e=c-1;0===a.length&&(e=0);var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top,h=f.offset().top,i=d.$results.scrollTop()+(h-g);0===e?d.$results.scrollTop(0):0>h-g&&d.$results.scrollTop(i)}}),b.on("results:next",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a),e=c+1;if(!(e>=b.length)){var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top+d.$results.outerHeight(!1),h=f.offset().top+f.outerHeight(!1),i=d.$results.scrollTop()+h-g;0===e?d.$results.scrollTop(0):h>g&&d.$results.scrollTop(i)}}),b.on("results:focus",function(a){a.element.addClass("select2-results__option--highlighted")}),b.on("results:message",function(a){d.displayMessage(a)}),a.fn.mousewheel&&this.$results.on("mousewheel",function(a){var b=d.$results.scrollTop(),c=d.$results.get(0).scrollHeight-b+a.deltaY,e=a.deltaY>0&&b-a.deltaY<=0,f=a.deltaY<0&&c<=d.$results.height();e?(d.$results.scrollTop(0),a.preventDefault(),a.stopPropagation()):f&&(d.$results.scrollTop(d.$results.get(0).scrollHeight-d.$results.height()),a.preventDefault(),a.stopPropagation())}),this.$results.on("mouseup",".select2-results__option[aria-selected]",function(b){var c=a(this),e=c.data("data");return"true"===c.attr("aria-selected")?void(d.options.get("multiple")?d.trigger("unselect",{originalEvent:b,data:e}):d.trigger("close",{})):void d.trigger("select",{originalEvent:b,data:e})}),this.$results.on("mouseenter",".select2-results__option[aria-selected]",function(b){var c=a(this).data("data");d.getHighlightedResults().removeClass("select2-results__option--highlighted"),d.trigger("results:focus",{data:c,element:a(this)})})},c.prototype.getHighlightedResults=function(){var a=this.$results.find(".select2-results__option--highlighted");return a},c.prototype.destroy=function(){this.$results.remove()},c.prototype.ensureHighlightVisible=function(){var a=this.getHighlightedResults();if(0!==a.length){var b=this.$results.find("[aria-selected]"),c=b.index(a),d=this.$results.offset().top,e=a.offset().top,f=this.$results.scrollTop()+(e-d),g=e-d;f-=2*a.outerHeight(!1),2>=c?this.$results.scrollTop(0):(g>this.$results.outerHeight()||0>g)&&this.$results.scrollTop(f)}},c.prototype.template=function(b,c){var d=this.options.get("templateResult"),e=this.options.get("escapeMarkup"),f=d(b,c);null==f?c.style.display="none":"string"==typeof f?c.innerHTML=e(f):a(c).append(f)},c}),b.define("select2/keys",[],function(){var a={BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46};return a}),b.define("select2/selection/base",["jquery","../utils","../keys"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,b.Observable),d.prototype.render=function(){var b=a('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');return this._tabindex=0,null!=this.$element.data("old-tabindex")?this._tabindex=this.$element.data("old-tabindex"):null!=this.$element.attr("tabindex")&&(this._tabindex=this.$element.attr("tabindex")),b.attr("title",this.$element.attr("title")),b.attr("tabindex",this._tabindex),this.$selection=b,b},d.prototype.bind=function(a,b){var d=this,e=(a.id+"-container",a.id+"-results");this.container=a,this.$selection.on("focus",function(a){d.trigger("focus",a)}),this.$selection.on("blur",function(a){d._handleBlur(a)}),this.$selection.on("keydown",function(a){d.trigger("keypress",a),a.which===c.SPACE&&a.preventDefault()}),a.on("results:focus",function(a){d.$selection.attr("aria-activedescendant",a.data._resultId)}),a.on("selection:update",function(a){d.update(a.data)}),a.on("open",function(){d.$selection.attr("aria-expanded","true"),d.$selection.attr("aria-owns",e),d._attachCloseHandler(a)}),a.on("close",function(){d.$selection.attr("aria-expanded","false"),d.$selection.removeAttr("aria-activedescendant"),d.$selection.removeAttr("aria-owns"),d.$selection.focus(),d._detachCloseHandler(a)}),a.on("enable",function(){d.$selection.attr("tabindex",d._tabindex)}),a.on("disable",function(){d.$selection.attr("tabindex","-1")})},d.prototype._handleBlur=function(b){var c=this;window.setTimeout(function(){document.activeElement==c.$selection[0]||a.contains(c.$selection[0],document.activeElement)||c.trigger("blur",b)},1)},d.prototype._attachCloseHandler=function(b){a(document.body).on("mousedown.select2."+b.id,function(b){var c=a(b.target),d=c.closest(".select2"),e=a(".select2.select2-container--open");e.each(function(){var b=a(this);if(this!=d[0]){var c=b.data("element");c.select2("close")}})})},d.prototype._detachCloseHandler=function(b){a(document.body).off("mousedown.select2."+b.id)},d.prototype.position=function(a,b){var c=b.find(".selection");c.append(a)},d.prototype.destroy=function(){this._detachCloseHandler(this.container)},d.prototype.update=function(a){throw new Error("The `update` method must be defined in child classes.")},d}),b.define("select2/selection/single",["jquery","./base","../utils","../keys"],function(a,b,c,d){function e(){e.__super__.constructor.apply(this,arguments)}return c.Extend(e,b),e.prototype.render=function(){var a=e.__super__.render.call(this);return a.addClass("select2-selection--single"),a.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'),a},e.prototype.bind=function(a,b){var c=this;e.__super__.bind.apply(this,arguments);var d=a.id+"-container";this.$selection.find(".select2-selection__rendered").attr("id",d),this.$selection.attr("aria-labelledby",d),this.$selection.on("mousedown",function(a){1===a.which&&c.trigger("toggle",{originalEvent:a})}),this.$selection.on("focus",function(a){}),this.$selection.on("blur",function(a){}),a.on("focus",function(b){a.isOpen()||c.$selection.focus()}),a.on("selection:update",function(a){c.update(a.data)})},e.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},e.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},e.prototype.selectionContainer=function(){return a("<span></span>")},e.prototype.update=function(a){if(0===a.length)return void this.clear();var b=a[0],c=this.$selection.find(".select2-selection__rendered"),d=this.display(b,c);c.empty().append(d),c.prop("title",b.title||b.text)},e}),b.define("select2/selection/multiple",["jquery","./base","../utils"],function(a,b,c){function d(a,b){d.__super__.constructor.apply(this,arguments)}return c.Extend(d,b),d.prototype.render=function(){var a=d.__super__.render.call(this);return a.addClass("select2-selection--multiple"),a.html('<ul class="select2-selection__rendered"></ul>'),a},d.prototype.bind=function(b,c){var e=this;d.__super__.bind.apply(this,arguments),this.$selection.on("click",function(a){e.trigger("toggle",{originalEvent:a})}),this.$selection.on("click",".select2-selection__choice__remove",function(b){if(!e.options.get("disabled")){var c=a(this),d=c.parent(),f=d.data("data");e.trigger("unselect",{originalEvent:b,data:f})}})},d.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},d.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},d.prototype.selectionContainer=function(){var b=a('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>');return b},d.prototype.update=function(a){if(this.clear(),0!==a.length){for(var b=[],d=0;d<a.length;d++){var e=a[d],f=this.selectionContainer(),g=this.display(e,f);f.append(g),f.prop("title",e.title||e.text),f.data("data",e),b.push(f)}var h=this.$selection.find(".select2-selection__rendered");c.appendMany(h,b)}},d}),b.define("select2/selection/placeholder",["../utils"],function(a){function b(a,b,c){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c)}return b.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},b.prototype.createPlaceholder=function(a,b){var c=this.selectionContainer();return c.html(this.display(b)),c.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"),c},b.prototype.update=function(a,b){var c=1==b.length&&b[0].id!=this.placeholder.id,d=b.length>1;if(d||c)return a.call(this,b);this.clear();var e=this.createPlaceholder(this.placeholder);this.$selection.find(".select2-selection__rendered").append(e)},b}),b.define("select2/selection/allowClear",["jquery","../keys"],function(a,b){function c(){}return c.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),null==this.placeholder&&this.options.get("debug")&&window.console&&console.error&&console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."),this.$selection.on("mousedown",".select2-selection__clear",function(a){d._handleClear(a)}),b.on("keypress",function(a){d._handleKeyboardClear(a,b)})},c.prototype._handleClear=function(a,b){if(!this.options.get("disabled")){var c=this.$selection.find(".select2-selection__clear");if(0!==c.length){b.stopPropagation();for(var d=c.data("data"),e=0;e<d.length;e++){var f={data:d[e]};if(this.trigger("unselect",f),f.prevented)return}this.$element.val(this.placeholder.id).trigger("change"),this.trigger("toggle",{})}}},c.prototype._handleKeyboardClear=function(a,c,d){d.isOpen()||(c.which==b.DELETE||c.which==b.BACKSPACE)&&this._handleClear(c)},c.prototype.update=function(b,c){if(b.call(this,c),!(this.$selection.find(".select2-selection__placeholder").length>0||0===c.length)){var d=a('<span class="select2-selection__clear">&times;</span>');d.data("data",c),this.$selection.find(".select2-selection__rendered").prepend(d)}},c}),b.define("select2/selection/search",["jquery","../utils","../keys"],function(a,b,c){function d(a,b,c){a.call(this,b,c)}return d.prototype.render=function(b){var c=a('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>');this.$searchContainer=c,this.$search=c.find("input");var d=b.call(this);return this._transferTabIndex(),d},d.prototype.bind=function(a,b,d){var e=this;a.call(this,b,d),b.on("open",function(){e.$search.trigger("focus")}),b.on("close",function(){e.$search.val(""),e.$search.removeAttr("aria-activedescendant"),e.$search.trigger("focus")}),b.on("enable",function(){e.$search.prop("disabled",!1),e._transferTabIndex()}),b.on("disable",function(){e.$search.prop("disabled",!0)}),b.on("focus",function(a){e.$search.trigger("focus")}),b.on("results:focus",function(a){e.$search.attr("aria-activedescendant",a.id)}),this.$selection.on("focusin",".select2-search--inline",function(a){e.trigger("focus",a)}),this.$selection.on("focusout",".select2-search--inline",function(a){e._handleBlur(a)}),this.$selection.on("keydown",".select2-search--inline",function(a){a.stopPropagation(),e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented();var b=a.which;if(b===c.BACKSPACE&&""===e.$search.val()){var d=e.$searchContainer.prev(".select2-selection__choice");if(d.length>0){var f=d.data("data");e.searchRemoveChoice(f),a.preventDefault()}}});var f=document.documentMode,g=f&&11>=f;this.$selection.on("input.searchcheck",".select2-search--inline",function(a){return g?void e.$selection.off("input.search input.searchcheck"):void e.$selection.off("keyup.search")}),this.$selection.on("keyup.search input.search",".select2-search--inline",function(a){if(g&&"input"===a.type)return void e.$selection.off("input.search input.searchcheck");var b=a.which;b!=c.SHIFT&&b!=c.CTRL&&b!=c.ALT&&b!=c.TAB&&e.handleSearch(a)})},d.prototype._transferTabIndex=function(a){this.$search.attr("tabindex",this.$selection.attr("tabindex")),this.$selection.attr("tabindex","-1")},d.prototype.createPlaceholder=function(a,b){this.$search.attr("placeholder",b.text)},d.prototype.update=function(a,b){var c=this.$search[0]==document.activeElement;this.$search.attr("placeholder",""),a.call(this,b),this.$selection.find(".select2-selection__rendered").append(this.$searchContainer),this.resizeSearch(),c&&this.$search.focus()},d.prototype.handleSearch=function(){if(this.resizeSearch(),!this._keyUpPrevented){var a=this.$search.val();this.trigger("query",{term:a})}this._keyUpPrevented=!1},d.prototype.searchRemoveChoice=function(a,b){this.trigger("unselect",{data:b}),this.$search.val(b.text),this.handleSearch()},d.prototype.resizeSearch=function(){this.$search.css("width","25px");var a="";if(""!==this.$search.attr("placeholder"))a=this.$selection.find(".select2-selection__rendered").innerWidth();else{var b=this.$search.val().length+1;a=.75*b+"em"}this.$search.css("width",a)},d}),b.define("select2/selection/eventRelay",["jquery"],function(a){function b(){}return b.prototype.bind=function(b,c,d){var e=this,f=["open","opening","close","closing","select","selecting","unselect","unselecting"],g=["opening","closing","selecting","unselecting"];b.call(this,c,d),c.on("*",function(b,c){if(-1!==a.inArray(b,f)){c=c||{};var d=a.Event("select2:"+b,{params:c});e.$element.trigger(d),-1!==a.inArray(b,g)&&(c.prevented=d.isDefaultPrevented())}})},b}),b.define("select2/translation",["jquery","require"],function(a,b){function c(a){this.dict=a||{}}return c.prototype.all=function(){return this.dict},c.prototype.get=function(a){return this.dict[a]},c.prototype.extend=function(b){this.dict=a.extend({},b.all(),this.dict)},c._cache={},c.loadPath=function(a){if(!(a in c._cache)){var d=b(a);c._cache[a]=d}return new c(c._cache[a])},c}),b.define("select2/diacritics",[],function(){var a={"Ⓐ":"A","Ａ":"A","À":"A","Á":"A","Â":"A","Ầ":"A","Ấ":"A","Ẫ":"A","Ẩ":"A","Ã":"A","Ā":"A","Ă":"A","Ằ":"A","Ắ":"A","Ẵ":"A","Ẳ":"A","Ȧ":"A","Ǡ":"A","Ä":"A","Ǟ":"A","Ả":"A","Å":"A","Ǻ":"A","Ǎ":"A","Ȁ":"A","Ȃ":"A","Ạ":"A","Ậ":"A","Ặ":"A","Ḁ":"A","Ą":"A","Ⱥ":"A","Ɐ":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ⓑ":"B","Ｂ":"B","Ḃ":"B","Ḅ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ɓ":"B","Ⓒ":"C","Ｃ":"C","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","Ç":"C","Ḉ":"C","Ƈ":"C","Ȼ":"C","Ꜿ":"C","Ⓓ":"D","Ｄ":"D","Ḋ":"D","Ď":"D","Ḍ":"D","Ḑ":"D","Ḓ":"D","Ḏ":"D","Đ":"D","Ƌ":"D","Ɗ":"D","Ɖ":"D","Ꝺ":"D","Ǳ":"DZ","Ǆ":"DZ","ǲ":"Dz","ǅ":"Dz","Ⓔ":"E","Ｅ":"E","È":"E","É":"E","Ê":"E","Ề":"E","Ế":"E","Ễ":"E","Ể":"E","Ẽ":"E","Ē":"E","Ḕ":"E","Ḗ":"E","Ĕ":"E","Ė":"E","Ë":"E","Ẻ":"E","Ě":"E","Ȅ":"E","Ȇ":"E","Ẹ":"E","Ệ":"E","Ȩ":"E","Ḝ":"E","Ę":"E","Ḙ":"E","Ḛ":"E","Ɛ":"E","Ǝ":"E","Ⓕ":"F","Ｆ":"F","Ḟ":"F","Ƒ":"F","Ꝼ":"F","Ⓖ":"G","Ｇ":"G","Ǵ":"G","Ĝ":"G","Ḡ":"G","Ğ":"G","Ġ":"G","Ǧ":"G","Ģ":"G","Ǥ":"G","Ɠ":"G","Ꞡ":"G","Ᵹ":"G","Ꝿ":"G","Ⓗ":"H","Ｈ":"H","Ĥ":"H","Ḣ":"H","Ḧ":"H","Ȟ":"H","Ḥ":"H","Ḩ":"H","Ḫ":"H","Ħ":"H","Ⱨ":"H","Ⱶ":"H","Ɥ":"H","Ⓘ":"I","Ｉ":"I","Ì":"I","Í":"I","Î":"I","Ĩ":"I","Ī":"I","Ĭ":"I","İ":"I","Ï":"I","Ḯ":"I","Ỉ":"I","Ǐ":"I","Ȉ":"I","Ȋ":"I","Ị":"I","Į":"I","Ḭ":"I","Ɨ":"I","Ⓙ":"J","Ｊ":"J","Ĵ":"J","Ɉ":"J","Ⓚ":"K","Ｋ":"K","Ḱ":"K","Ǩ":"K","Ḳ":"K","Ķ":"K","Ḵ":"K","Ƙ":"K","Ⱪ":"K","Ꝁ":"K","Ꝃ":"K","Ꝅ":"K","Ꞣ":"K","Ⓛ":"L","Ｌ":"L","Ŀ":"L","Ĺ":"L","Ľ":"L","Ḷ":"L","Ḹ":"L","Ļ":"L","Ḽ":"L","Ḻ":"L","Ł":"L","Ƚ":"L","Ɫ":"L","Ⱡ":"L","Ꝉ":"L","Ꝇ":"L","Ꞁ":"L","Ǉ":"LJ","ǈ":"Lj","Ⓜ":"M","Ｍ":"M","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ɯ":"M","Ⓝ":"N","Ｎ":"N","Ǹ":"N","Ń":"N","Ñ":"N","Ṅ":"N","Ň":"N","Ṇ":"N","Ņ":"N","Ṋ":"N","Ṉ":"N","Ƞ":"N","Ɲ":"N","Ꞑ":"N","Ꞥ":"N","Ǌ":"NJ","ǋ":"Nj","Ⓞ":"O","Ｏ":"O","Ò":"O","Ó":"O","Ô":"O","Ồ":"O","Ố":"O","Ỗ":"O","Ổ":"O","Õ":"O","Ṍ":"O","Ȭ":"O","Ṏ":"O","Ō":"O","Ṑ":"O","Ṓ":"O","Ŏ":"O","Ȯ":"O","Ȱ":"O","Ö":"O","Ȫ":"O","Ỏ":"O","Ő":"O","Ǒ":"O","Ȍ":"O","Ȏ":"O","Ơ":"O","Ờ":"O","Ớ":"O","Ỡ":"O","Ở":"O","Ợ":"O","Ọ":"O","Ộ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Ɔ":"O","Ɵ":"O","Ꝋ":"O","Ꝍ":"O","Ƣ":"OI","Ꝏ":"OO","Ȣ":"OU","Ⓟ":"P","Ｐ":"P","Ṕ":"P","Ṗ":"P","Ƥ":"P","Ᵽ":"P","Ꝑ":"P","Ꝓ":"P","Ꝕ":"P","Ⓠ":"Q","Ｑ":"Q","Ꝗ":"Q","Ꝙ":"Q","Ɋ":"Q","Ⓡ":"R","Ｒ":"R","Ŕ":"R","Ṙ":"R","Ř":"R","Ȑ":"R","Ȓ":"R","Ṛ":"R","Ṝ":"R","Ŗ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꝛ":"R","Ꞧ":"R","Ꞃ":"R","Ⓢ":"S","Ｓ":"S","ẞ":"S","Ś":"S","Ṥ":"S","Ŝ":"S","Ṡ":"S","Š":"S","Ṧ":"S","Ṣ":"S","Ṩ":"S","Ș":"S","Ş":"S","Ȿ":"S","Ꞩ":"S","Ꞅ":"S","Ⓣ":"T","Ｔ":"T","Ṫ":"T","Ť":"T","Ṭ":"T","Ț":"T","Ţ":"T","Ṱ":"T","Ṯ":"T","Ŧ":"T","Ƭ":"T","Ʈ":"T","Ⱦ":"T","Ꞇ":"T","Ꜩ":"TZ","Ⓤ":"U","Ｕ":"U","Ù":"U","Ú":"U","Û":"U","Ũ":"U","Ṹ":"U","Ū":"U","Ṻ":"U","Ŭ":"U","Ü":"U","Ǜ":"U","Ǘ":"U","Ǖ":"U","Ǚ":"U","Ủ":"U","Ů":"U","Ű":"U","Ǔ":"U","Ȕ":"U","Ȗ":"U","Ư":"U","Ừ":"U","Ứ":"U","Ữ":"U","Ử":"U","Ự":"U","Ụ":"U","Ṳ":"U","Ų":"U","Ṷ":"U","Ṵ":"U","Ʉ":"U","Ⓥ":"V","Ｖ":"V","Ṽ":"V","Ṿ":"V","Ʋ":"V","Ꝟ":"V","Ʌ":"V","Ꝡ":"VY","Ⓦ":"W","Ｗ":"W","Ẁ":"W","Ẃ":"W","Ŵ":"W","Ẇ":"W","Ẅ":"W","Ẉ":"W","Ⱳ":"W","Ⓧ":"X","Ｘ":"X","Ẋ":"X","Ẍ":"X","Ⓨ":"Y","Ｙ":"Y","Ỳ":"Y","Ý":"Y","Ŷ":"Y","Ỹ":"Y","Ȳ":"Y","Ẏ":"Y","Ÿ":"Y","Ỷ":"Y","Ỵ":"Y","Ƴ":"Y","Ɏ":"Y","Ỿ":"Y","Ⓩ":"Z","Ｚ":"Z","Ź":"Z","Ẑ":"Z","Ż":"Z","Ž":"Z","Ẓ":"Z","Ẕ":"Z","Ƶ":"Z","Ȥ":"Z","Ɀ":"Z","Ⱬ":"Z","Ꝣ":"Z","ⓐ":"a","ａ":"a","ẚ":"a","à":"a","á":"a","â":"a","ầ":"a","ấ":"a","ẫ":"a","ẩ":"a","ã":"a","ā":"a","ă":"a","ằ":"a","ắ":"a","ẵ":"a","ẳ":"a","ȧ":"a","ǡ":"a","ä":"a","ǟ":"a","ả":"a","å":"a","ǻ":"a","ǎ":"a","ȁ":"a","ȃ":"a","ạ":"a","ậ":"a","ặ":"a","ḁ":"a","ą":"a","ⱥ":"a","ɐ":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ⓑ":"b","ｂ":"b","ḃ":"b","ḅ":"b","ḇ":"b","ƀ":"b","ƃ":"b","ɓ":"b","ⓒ":"c","ｃ":"c","ć":"c","ĉ":"c","ċ":"c","č":"c","ç":"c","ḉ":"c","ƈ":"c","ȼ":"c","ꜿ":"c","ↄ":"c","ⓓ":"d","ｄ":"d","ḋ":"d","ď":"d","ḍ":"d","ḑ":"d","ḓ":"d","ḏ":"d","đ":"d","ƌ":"d","ɖ":"d","ɗ":"d","ꝺ":"d","ǳ":"dz","ǆ":"dz","ⓔ":"e","ｅ":"e","è":"e","é":"e","ê":"e","ề":"e","ế":"e","ễ":"e","ể":"e","ẽ":"e","ē":"e","ḕ":"e","ḗ":"e","ĕ":"e","ė":"e","ë":"e","ẻ":"e","ě":"e","ȅ":"e","ȇ":"e","ẹ":"e","ệ":"e","ȩ":"e","ḝ":"e","ę":"e","ḙ":"e","ḛ":"e","ɇ":"e","ɛ":"e","ǝ":"e","ⓕ":"f","ｆ":"f","ḟ":"f","ƒ":"f","ꝼ":"f","ⓖ":"g","ｇ":"g","ǵ":"g","ĝ":"g","ḡ":"g","ğ":"g","ġ":"g","ǧ":"g","ģ":"g","ǥ":"g","ɠ":"g","ꞡ":"g","ᵹ":"g","ꝿ":"g","ⓗ":"h","ｈ":"h","ĥ":"h","ḣ":"h","ḧ":"h","ȟ":"h","ḥ":"h","ḩ":"h","ḫ":"h","ẖ":"h","ħ":"h","ⱨ":"h","ⱶ":"h","ɥ":"h","ƕ":"hv","ⓘ":"i","ｉ":"i","ì":"i","í":"i","î":"i","ĩ":"i","ī":"i","ĭ":"i","ï":"i","ḯ":"i","ỉ":"i","ǐ":"i","ȉ":"i","ȋ":"i","ị":"i","į":"i","ḭ":"i","ɨ":"i","ı":"i","ⓙ":"j","ｊ":"j","ĵ":"j","ǰ":"j","ɉ":"j","ⓚ":"k","ｋ":"k","ḱ":"k","ǩ":"k","ḳ":"k","ķ":"k","ḵ":"k","ƙ":"k","ⱪ":"k","ꝁ":"k","ꝃ":"k","ꝅ":"k","ꞣ":"k","ⓛ":"l","ｌ":"l","ŀ":"l","ĺ":"l","ľ":"l","ḷ":"l","ḹ":"l","ļ":"l","ḽ":"l","ḻ":"l","ſ":"l","ł":"l","ƚ":"l","ɫ":"l","ⱡ":"l","ꝉ":"l","ꞁ":"l","ꝇ":"l","ǉ":"lj","ⓜ":"m","ｍ":"m","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ɯ":"m","ⓝ":"n","ｎ":"n","ǹ":"n","ń":"n","ñ":"n","ṅ":"n","ň":"n","ṇ":"n","ņ":"n","ṋ":"n","ṉ":"n","ƞ":"n","ɲ":"n","ŉ":"n","ꞑ":"n","ꞥ":"n","ǌ":"nj","ⓞ":"o","ｏ":"o","ò":"o","ó":"o","ô":"o","ồ":"o","ố":"o","ỗ":"o","ổ":"o","õ":"o","ṍ":"o","ȭ":"o","ṏ":"o","ō":"o","ṑ":"o","ṓ":"o","ŏ":"o","ȯ":"o","ȱ":"o","ö":"o","ȫ":"o","ỏ":"o","ő":"o","ǒ":"o","ȍ":"o","ȏ":"o","ơ":"o","ờ":"o","ớ":"o","ỡ":"o","ở":"o","ợ":"o","ọ":"o","ộ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","ɔ":"o","ꝋ":"o","ꝍ":"o","ɵ":"o","ƣ":"oi","ȣ":"ou","ꝏ":"oo","ⓟ":"p","ｐ":"p","ṕ":"p","ṗ":"p","ƥ":"p","ᵽ":"p","ꝑ":"p","ꝓ":"p","ꝕ":"p","ⓠ":"q","ｑ":"q","ɋ":"q","ꝗ":"q","ꝙ":"q","ⓡ":"r","ｒ":"r","ŕ":"r","ṙ":"r","ř":"r","ȑ":"r","ȓ":"r","ṛ":"r","ṝ":"r","ŗ":"r","ṟ":"r","ɍ":"r","ɽ":"r","ꝛ":"r","ꞧ":"r","ꞃ":"r","ⓢ":"s","ｓ":"s","ß":"s","ś":"s","ṥ":"s","ŝ":"s","ṡ":"s","š":"s","ṧ":"s","ṣ":"s","ṩ":"s","ș":"s","ş":"s","ȿ":"s","ꞩ":"s","ꞅ":"s","ẛ":"s","ⓣ":"t","ｔ":"t","ṫ":"t","ẗ":"t","ť":"t","ṭ":"t","ț":"t","ţ":"t","ṱ":"t","ṯ":"t","ŧ":"t","ƭ":"t","ʈ":"t","ⱦ":"t","ꞇ":"t","ꜩ":"tz","ⓤ":"u","ｕ":"u","ù":"u","ú":"u","û":"u","ũ":"u","ṹ":"u","ū":"u","ṻ":"u","ŭ":"u","ü":"u","ǜ":"u","ǘ":"u","ǖ":"u","ǚ":"u","ủ":"u","ů":"u","ű":"u","ǔ":"u","ȕ":"u","ȗ":"u","ư":"u","ừ":"u","ứ":"u","ữ":"u","ử":"u","ự":"u","ụ":"u","ṳ":"u","ų":"u","ṷ":"u","ṵ":"u","ʉ":"u","ⓥ":"v","ｖ":"v","ṽ":"v","ṿ":"v","ʋ":"v","ꝟ":"v","ʌ":"v","ꝡ":"vy","ⓦ":"w","ｗ":"w","ẁ":"w","ẃ":"w","ŵ":"w","ẇ":"w","ẅ":"w","ẘ":"w","ẉ":"w","ⱳ":"w","ⓧ":"x","ｘ":"x","ẋ":"x","ẍ":"x","ⓨ":"y","ｙ":"y","ỳ":"y","ý":"y","ŷ":"y","ỹ":"y","ȳ":"y","ẏ":"y","ÿ":"y","ỷ":"y","ẙ":"y","ỵ":"y","ƴ":"y","ɏ":"y","ỿ":"y","ⓩ":"z","ｚ":"z","ź":"z","ẑ":"z","ż":"z","ž":"z","ẓ":"z","ẕ":"z","ƶ":"z","ȥ":"z","ɀ":"z","ⱬ":"z","ꝣ":"z","Ά":"Α","Έ":"Ε","Ή":"Η","Ί":"Ι","Ϊ":"Ι","Ό":"Ο","Ύ":"Υ","Ϋ":"Υ","Ώ":"Ω","ά":"α","έ":"ε","ή":"η","ί":"ι","ϊ":"ι","ΐ":"ι","ό":"ο","ύ":"υ","ϋ":"υ","ΰ":"υ","ω":"ω","ς":"σ"};return a}),b.define("select2/data/base",["../utils"],function(a){function b(a,c){b.__super__.constructor.call(this)}return a.Extend(b,a.Observable),b.prototype.current=function(a){throw new Error("The `current` method must be defined in child classes.")},b.prototype.query=function(a,b){throw new Error("The `query` method must be defined in child classes.")},b.prototype.bind=function(a,b){},b.prototype.destroy=function(){},b.prototype.generateResultId=function(b,c){var d=b.id+"-result-";return d+=a.generateChars(4),d+=null!=c.id?"-"+c.id.toString():"-"+a.generateChars(4)},b}),b.define("select2/data/select",["./base","../utils","jquery"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,a),d.prototype.current=function(a){var b=[],d=this;this.$element.find(":selected").each(function(){var a=c(this),e=d.item(a);b.push(e)}),a(b)},d.prototype.select=function(a){var b=this;if(a.selected=!0,c(a.element).is("option"))return a.element.selected=!0,void this.$element.trigger("change");
if(this.$element.prop("multiple"))this.current(function(d){var e=[];a=[a],a.push.apply(a,d);for(var f=0;f<a.length;f++){var g=a[f].id;-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")});else{var d=a.id;this.$element.val(d),this.$element.trigger("change")}},d.prototype.unselect=function(a){var b=this;if(this.$element.prop("multiple"))return a.selected=!1,c(a.element).is("option")?(a.element.selected=!1,void this.$element.trigger("change")):void this.current(function(d){for(var e=[],f=0;f<d.length;f++){var g=d[f].id;g!==a.id&&-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")})},d.prototype.bind=function(a,b){var c=this;this.container=a,a.on("select",function(a){c.select(a.data)}),a.on("unselect",function(a){c.unselect(a.data)})},d.prototype.destroy=function(){this.$element.find("*").each(function(){c.removeData(this,"data")})},d.prototype.query=function(a,b){var d=[],e=this,f=this.$element.children();f.each(function(){var b=c(this);if(b.is("option")||b.is("optgroup")){var f=e.item(b),g=e.matches(a,f);null!==g&&d.push(g)}}),b({results:d})},d.prototype.addOptions=function(a){b.appendMany(this.$element,a)},d.prototype.option=function(a){var b;a.children?(b=document.createElement("optgroup"),b.label=a.text):(b=document.createElement("option"),void 0!==b.textContent?b.textContent=a.text:b.innerText=a.text),a.id&&(b.value=a.id),a.disabled&&(b.disabled=!0),a.selected&&(b.selected=!0),a.title&&(b.title=a.title);var d=c(b),e=this._normalizeItem(a);return e.element=b,c.data(b,"data",e),d},d.prototype.item=function(a){var b={};if(b=c.data(a[0],"data"),null!=b)return b;if(a.is("option"))b={id:a.val(),text:a.text(),disabled:a.prop("disabled"),selected:a.prop("selected"),title:a.prop("title")};else if(a.is("optgroup")){b={text:a.prop("label"),children:[],title:a.prop("title")};for(var d=a.children("option"),e=[],f=0;f<d.length;f++){var g=c(d[f]),h=this.item(g);e.push(h)}b.children=e}return b=this._normalizeItem(b),b.element=a[0],c.data(a[0],"data",b),b},d.prototype._normalizeItem=function(a){c.isPlainObject(a)||(a={id:a,text:a}),a=c.extend({},{text:""},a);var b={selected:!1,disabled:!1};return null!=a.id&&(a.id=a.id.toString()),null!=a.text&&(a.text=a.text.toString()),null==a._resultId&&a.id&&null!=this.container&&(a._resultId=this.generateResultId(this.container,a)),c.extend({},b,a)},d.prototype.matches=function(a,b){var c=this.options.get("matcher");return c(a,b)},d}),b.define("select2/data/array",["./select","../utils","jquery"],function(a,b,c){function d(a,b){var c=b.get("data")||[];d.__super__.constructor.call(this,a,b),this.addOptions(this.convertToOptions(c))}return b.Extend(d,a),d.prototype.select=function(a){var b=this.$element.find("option").filter(function(b,c){return c.value==a.id.toString()});0===b.length&&(b=this.option(a),this.addOptions(b)),d.__super__.select.call(this,a)},d.prototype.convertToOptions=function(a){function d(a){return function(){return c(this).val()==a.id}}for(var e=this,f=this.$element.find("option"),g=f.map(function(){return e.item(c(this)).id}).get(),h=[],i=0;i<a.length;i++){var j=this._normalizeItem(a[i]);if(c.inArray(j.id,g)>=0){var k=f.filter(d(j)),l=this.item(k),m=c.extend(!0,{},j,l),n=this.option(m);k.replaceWith(n)}else{var o=this.option(j);if(j.children){var p=this.convertToOptions(j.children);b.appendMany(o,p)}h.push(o)}}return h},d}),b.define("select2/data/ajax",["./array","../utils","jquery"],function(a,b,c){function d(a,b){this.ajaxOptions=this._applyDefaults(b.get("ajax")),null!=this.ajaxOptions.processResults&&(this.processResults=this.ajaxOptions.processResults),d.__super__.constructor.call(this,a,b)}return b.Extend(d,a),d.prototype._applyDefaults=function(a){var b={data:function(a){return c.extend({},a,{q:a.term})},transport:function(a,b,d){var e=c.ajax(a);return e.then(b),e.fail(d),e}};return c.extend({},b,a,!0)},d.prototype.processResults=function(a){return a},d.prototype.query=function(a,b){function d(){var d=f.transport(f,function(d){var f=e.processResults(d,a);e.options.get("debug")&&window.console&&console.error&&(f&&f.results&&c.isArray(f.results)||console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")),b(f)},function(){d.status&&"0"===d.status||e.trigger("results:message",{message:"errorLoading"})});e._request=d}var e=this;null!=this._request&&(c.isFunction(this._request.abort)&&this._request.abort(),this._request=null);var f=c.extend({type:"GET"},this.ajaxOptions);"function"==typeof f.url&&(f.url=f.url.call(this.$element,a)),"function"==typeof f.data&&(f.data=f.data.call(this.$element,a)),this.ajaxOptions.delay&&null!=a.term?(this._queryTimeout&&window.clearTimeout(this._queryTimeout),this._queryTimeout=window.setTimeout(d,this.ajaxOptions.delay)):d()},d}),b.define("select2/data/tags",["jquery"],function(a){function b(b,c,d){var e=d.get("tags"),f=d.get("createTag");void 0!==f&&(this.createTag=f);var g=d.get("insertTag");if(void 0!==g&&(this.insertTag=g),b.call(this,c,d),a.isArray(e))for(var h=0;h<e.length;h++){var i=e[h],j=this._normalizeItem(i),k=this.option(j);this.$element.append(k)}}return b.prototype.query=function(a,b,c){function d(a,f){for(var g=a.results,h=0;h<g.length;h++){var i=g[h],j=null!=i.children&&!d({results:i.children},!0),k=i.text===b.term;if(k||j)return f?!1:(a.data=g,void c(a))}if(f)return!0;var l=e.createTag(b);if(null!=l){var m=e.option(l);m.attr("data-select2-tag",!0),e.addOptions([m]),e.insertTag(g,l)}a.results=g,c(a)}var e=this;return this._removeOldTags(),null==b.term||null!=b.page?void a.call(this,b,c):void a.call(this,b,d)},b.prototype.createTag=function(b,c){var d=a.trim(c.term);return""===d?null:{id:d,text:d}},b.prototype.insertTag=function(a,b,c){b.unshift(c)},b.prototype._removeOldTags=function(b){var c=(this._lastTag,this.$element.find("option[data-select2-tag]"));c.each(function(){this.selected||a(this).remove()})},b}),b.define("select2/data/tokenizer",["jquery"],function(a){function b(a,b,c){var d=c.get("tokenizer");void 0!==d&&(this.tokenizer=d),a.call(this,b,c)}return b.prototype.bind=function(a,b,c){a.call(this,b,c),this.$search=b.dropdown.$search||b.selection.$search||c.find(".select2-search__field")},b.prototype.query=function(b,c,d){function e(b){var c=g._normalizeItem(b),d=g.$element.find("option").filter(function(){return a(this).val()===c.id});if(!d.length){var e=g.option(c);e.attr("data-select2-tag",!0),g._removeOldTags(),g.addOptions([e])}f(c)}function f(a){g.trigger("select",{data:a})}var g=this;c.term=c.term||"";var h=this.tokenizer(c,this.options,e);h.term!==c.term&&(this.$search.length&&(this.$search.val(h.term),this.$search.focus()),c.term=h.term),b.call(this,c,d)},b.prototype.tokenizer=function(b,c,d,e){for(var f=d.get("tokenSeparators")||[],g=c.term,h=0,i=this.createTag||function(a){return{id:a.term,text:a.term}};h<g.length;){var j=g[h];if(-1!==a.inArray(j,f)){var k=g.substr(0,h),l=a.extend({},c,{term:k}),m=i(l);null!=m?(e(m),g=g.substr(h+1)||"",h=0):h++}else h++}return{term:g}},b}),b.define("select2/data/minimumInputLength",[],function(){function a(a,b,c){this.minimumInputLength=c.get("minimumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",b.term.length<this.minimumInputLength?void this.trigger("results:message",{message:"inputTooShort",args:{minimum:this.minimumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumInputLength",[],function(){function a(a,b,c){this.maximumInputLength=c.get("maximumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",this.maximumInputLength>0&&b.term.length>this.maximumInputLength?void this.trigger("results:message",{message:"inputTooLong",args:{maximum:this.maximumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumSelectionLength",[],function(){function a(a,b,c){this.maximumSelectionLength=c.get("maximumSelectionLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){var d=this;this.current(function(e){var f=null!=e?e.length:0;return d.maximumSelectionLength>0&&f>=d.maximumSelectionLength?void d.trigger("results:message",{message:"maximumSelected",args:{maximum:d.maximumSelectionLength}}):void a.call(d,b,c)})},a}),b.define("select2/dropdown",["jquery","./utils"],function(a,b){function c(a,b){this.$element=a,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<span class="select2-dropdown"><span class="select2-results"></span></span>');return b.attr("dir",this.options.get("dir")),this.$dropdown=b,b},c.prototype.bind=function(){},c.prototype.position=function(a,b){},c.prototype.destroy=function(){this.$dropdown.remove()},c}),b.define("select2/dropdown/search",["jquery","../utils"],function(a,b){function c(){}return c.prototype.render=function(b){var c=b.call(this),d=a('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" /></span>');return this.$searchContainer=d,this.$search=d.find("input"),c.prepend(d),c},c.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),this.$search.on("keydown",function(a){e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented()}),this.$search.on("input",function(b){a(this).off("keyup")}),this.$search.on("keyup input",function(a){e.handleSearch(a)}),c.on("open",function(){e.$search.attr("tabindex",0),e.$search.focus(),window.setTimeout(function(){e.$search.focus()},0)}),c.on("close",function(){e.$search.attr("tabindex",-1),e.$search.val("")}),c.on("focus",function(){c.isOpen()&&e.$search.focus()}),c.on("results:all",function(a){if(null==a.query.term||""===a.query.term){var b=e.showSearch(a);b?e.$searchContainer.removeClass("select2-search--hide"):e.$searchContainer.addClass("select2-search--hide")}})},c.prototype.handleSearch=function(a){if(!this._keyUpPrevented){var b=this.$search.val();this.trigger("query",{term:b})}this._keyUpPrevented=!1},c.prototype.showSearch=function(a,b){return!0},c}),b.define("select2/dropdown/hidePlaceholder",[],function(){function a(a,b,c,d){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c,d)}return a.prototype.append=function(a,b){b.results=this.removePlaceholder(b.results),a.call(this,b)},a.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},a.prototype.removePlaceholder=function(a,b){for(var c=b.slice(0),d=b.length-1;d>=0;d--){var e=b[d];this.placeholder.id===e.id&&c.splice(d,1)}return c},a}),b.define("select2/dropdown/infiniteScroll",["jquery"],function(a){function b(a,b,c,d){this.lastParams={},a.call(this,b,c,d),this.$loadingMore=this.createLoadingMore(),this.loading=!1}return b.prototype.append=function(a,b){this.$loadingMore.remove(),this.loading=!1,a.call(this,b),this.showLoadingMore(b)&&this.$results.append(this.$loadingMore)},b.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),c.on("query",function(a){e.lastParams=a,e.loading=!0}),c.on("query:append",function(a){e.lastParams=a,e.loading=!0}),this.$results.on("scroll",function(){var b=a.contains(document.documentElement,e.$loadingMore[0]);if(!e.loading&&b){var c=e.$results.offset().top+e.$results.outerHeight(!1),d=e.$loadingMore.offset().top+e.$loadingMore.outerHeight(!1);c+50>=d&&e.loadMore()}})},b.prototype.loadMore=function(){this.loading=!0;var b=a.extend({},{page:1},this.lastParams);b.page++,this.trigger("query:append",b)},b.prototype.showLoadingMore=function(a,b){return b.pagination&&b.pagination.more},b.prototype.createLoadingMore=function(){var b=a('<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'),c=this.options.get("translations").get("loadingMore");return b.html(c(this.lastParams)),b},b}),b.define("select2/dropdown/attachBody",["jquery","../utils"],function(a,b){function c(b,c,d){this.$dropdownParent=d.get("dropdownParent")||a(document.body),b.call(this,c,d)}return c.prototype.bind=function(a,b,c){var d=this,e=!1;a.call(this,b,c),b.on("open",function(){d._showDropdown(),d._attachPositioningHandler(b),e||(e=!0,b.on("results:all",function(){d._positionDropdown(),d._resizeDropdown()}),b.on("results:append",function(){d._positionDropdown(),d._resizeDropdown()}))}),b.on("close",function(){d._hideDropdown(),d._detachPositioningHandler(b)}),this.$dropdownContainer.on("mousedown",function(a){a.stopPropagation()})},c.prototype.destroy=function(a){a.call(this),this.$dropdownContainer.remove()},c.prototype.position=function(a,b,c){b.attr("class",c.attr("class")),b.removeClass("select2"),b.addClass("select2-container--open"),b.css({position:"absolute",top:-999999}),this.$container=c},c.prototype.render=function(b){var c=a("<span></span>"),d=b.call(this);return c.append(d),this.$dropdownContainer=c,c},c.prototype._hideDropdown=function(a){this.$dropdownContainer.detach()},c.prototype._attachPositioningHandler=function(c,d){var e=this,f="scroll.select2."+d.id,g="resize.select2."+d.id,h="orientationchange.select2."+d.id,i=this.$container.parents().filter(b.hasScroll);i.each(function(){a(this).data("select2-scroll-position",{x:a(this).scrollLeft(),y:a(this).scrollTop()})}),i.on(f,function(b){var c=a(this).data("select2-scroll-position");a(this).scrollTop(c.y)}),a(window).on(f+" "+g+" "+h,function(a){e._positionDropdown(),e._resizeDropdown()})},c.prototype._detachPositioningHandler=function(c,d){var e="scroll.select2."+d.id,f="resize.select2."+d.id,g="orientationchange.select2."+d.id,h=this.$container.parents().filter(b.hasScroll);h.off(e),a(window).off(e+" "+f+" "+g)},c.prototype._positionDropdown=function(){var b=a(window),c=this.$dropdown.hasClass("select2-dropdown--above"),d=this.$dropdown.hasClass("select2-dropdown--below"),e=null,f=this.$container.offset();f.bottom=f.top+this.$container.outerHeight(!1);var g={height:this.$container.outerHeight(!1)};g.top=f.top,g.bottom=f.top+g.height;var h={height:this.$dropdown.outerHeight(!1)},i={top:b.scrollTop(),bottom:b.scrollTop()+b.height()},j=i.top<f.top-h.height,k=i.bottom>f.bottom+h.height,l={left:f.left,top:g.bottom},m=this.$dropdownParent;"static"===m.css("position")&&(m=m.offsetParent());var n=m.offset();l.top-=n.top,l.left-=n.left,c||d||(e="below"),k||!j||c?!j&&k&&c&&(e="below"):e="above",("above"==e||c&&"below"!==e)&&(l.top=g.top-n.top-h.height),null!=e&&(this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--"+e),this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--"+e)),this.$dropdownContainer.css(l)},c.prototype._resizeDropdown=function(){var a={width:this.$container.outerWidth(!1)+"px"};this.options.get("dropdownAutoWidth")&&(a.minWidth=a.width,a.position="relative",a.width="auto"),this.$dropdown.css(a)},c.prototype._showDropdown=function(a){this.$dropdownContainer.appendTo(this.$dropdownParent),this._positionDropdown(),this._resizeDropdown()},c}),b.define("select2/dropdown/minimumResultsForSearch",[],function(){function a(b){for(var c=0,d=0;d<b.length;d++){var e=b[d];e.children?c+=a(e.children):c++}return c}function b(a,b,c,d){this.minimumResultsForSearch=c.get("minimumResultsForSearch"),this.minimumResultsForSearch<0&&(this.minimumResultsForSearch=1/0),a.call(this,b,c,d)}return b.prototype.showSearch=function(b,c){return a(c.data.results)<this.minimumResultsForSearch?!1:b.call(this,c)},b}),b.define("select2/dropdown/selectOnClose",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("close",function(a){d._handleSelectOnClose(a)})},a.prototype._handleSelectOnClose=function(a,b){if(b&&null!=b.originalSelect2Event){var c=b.originalSelect2Event;if("select"===c._type||"unselect"===c._type)return}var d=this.getHighlightedResults();if(!(d.length<1)){var e=d.data("data");null!=e.element&&e.element.selected||null==e.element&&e.selected||this.trigger("select",{data:e})}},a}),b.define("select2/dropdown/closeOnSelect",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("select",function(a){d._selectTriggered(a)}),b.on("unselect",function(a){d._selectTriggered(a)})},a.prototype._selectTriggered=function(a,b){var c=b.originalEvent;c&&c.ctrlKey||this.trigger("close",{originalEvent:c,originalSelect2Event:b})},a}),b.define("select2/i18n/en",[],function(){return{errorLoading:function(){return"The results could not be loaded."},inputTooLong:function(a){var b=a.input.length-a.maximum,c="Please delete "+b+" character";return 1!=b&&(c+="s"),c},inputTooShort:function(a){var b=a.minimum-a.input.length,c="Please enter "+b+" or more characters";return c},loadingMore:function(){return"Loading more results…"},maximumSelected:function(a){var b="You can only select "+a.maximum+" item";return 1!=a.maximum&&(b+="s"),b},noResults:function(){return"No results found"},searching:function(){return"Searching…"}}}),b.define("select2/defaults",["jquery","require","./results","./selection/single","./selection/multiple","./selection/placeholder","./selection/allowClear","./selection/search","./selection/eventRelay","./utils","./translation","./diacritics","./data/select","./data/array","./data/ajax","./data/tags","./data/tokenizer","./data/minimumInputLength","./data/maximumInputLength","./data/maximumSelectionLength","./dropdown","./dropdown/search","./dropdown/hidePlaceholder","./dropdown/infiniteScroll","./dropdown/attachBody","./dropdown/minimumResultsForSearch","./dropdown/selectOnClose","./dropdown/closeOnSelect","./i18n/en"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C){function D(){this.reset()}D.prototype.apply=function(l){if(l=a.extend(!0,{},this.defaults,l),null==l.dataAdapter){if(null!=l.ajax?l.dataAdapter=o:null!=l.data?l.dataAdapter=n:l.dataAdapter=m,l.minimumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,r)),l.maximumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,s)),l.maximumSelectionLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,t)),l.tags&&(l.dataAdapter=j.Decorate(l.dataAdapter,p)),(null!=l.tokenSeparators||null!=l.tokenizer)&&(l.dataAdapter=j.Decorate(l.dataAdapter,q)),null!=l.query){var C=b(l.amdBase+"compat/query");l.dataAdapter=j.Decorate(l.dataAdapter,C)}if(null!=l.initSelection){var D=b(l.amdBase+"compat/initSelection");l.dataAdapter=j.Decorate(l.dataAdapter,D)}}if(null==l.resultsAdapter&&(l.resultsAdapter=c,null!=l.ajax&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,x)),null!=l.placeholder&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,w)),l.selectOnClose&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,A))),null==l.dropdownAdapter){if(l.multiple)l.dropdownAdapter=u;else{var E=j.Decorate(u,v);l.dropdownAdapter=E}if(0!==l.minimumResultsForSearch&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,z)),l.closeOnSelect&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,B)),null!=l.dropdownCssClass||null!=l.dropdownCss||null!=l.adaptDropdownCssClass){var F=b(l.amdBase+"compat/dropdownCss");l.dropdownAdapter=j.Decorate(l.dropdownAdapter,F)}l.dropdownAdapter=j.Decorate(l.dropdownAdapter,y)}if(null==l.selectionAdapter){if(l.multiple?l.selectionAdapter=e:l.selectionAdapter=d,null!=l.placeholder&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,f)),l.allowClear&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,g)),l.multiple&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,h)),null!=l.containerCssClass||null!=l.containerCss||null!=l.adaptContainerCssClass){var G=b(l.amdBase+"compat/containerCss");l.selectionAdapter=j.Decorate(l.selectionAdapter,G)}l.selectionAdapter=j.Decorate(l.selectionAdapter,i)}if("string"==typeof l.language)if(l.language.indexOf("-")>0){var H=l.language.split("-"),I=H[0];l.language=[l.language,I]}else l.language=[l.language];if(a.isArray(l.language)){var J=new k;l.language.push("en");for(var K=l.language,L=0;L<K.length;L++){var M=K[L],N={};try{N=k.loadPath(M)}catch(O){try{M=this.defaults.amdLanguageBase+M,N=k.loadPath(M)}catch(P){l.debug&&window.console&&console.warn&&console.warn('Select2: The language file for "'+M+'" could not be automatically loaded. A fallback will be used instead.');continue}}J.extend(N)}l.translations=J}else{var Q=k.loadPath(this.defaults.amdLanguageBase+"en"),R=new k(l.language);R.extend(Q),l.translations=R}return l},D.prototype.reset=function(){function b(a){function b(a){return l[a]||a}return a.replace(/[^\u0000-\u007E]/g,b)}function c(d,e){if(""===a.trim(d.term))return e;if(e.children&&e.children.length>0){for(var f=a.extend(!0,{},e),g=e.children.length-1;g>=0;g--){var h=e.children[g],i=c(d,h);null==i&&f.children.splice(g,1)}return f.children.length>0?f:c(d,f)}var j=b(e.text).toUpperCase(),k=b(d.term).toUpperCase();return j.indexOf(k)>-1?e:null}this.defaults={amdBase:"./",amdLanguageBase:"./i18n/",closeOnSelect:!0,debug:!1,dropdownAutoWidth:!1,escapeMarkup:j.escapeMarkup,language:C,matcher:c,minimumInputLength:0,maximumInputLength:0,maximumSelectionLength:0,minimumResultsForSearch:0,selectOnClose:!1,sorter:function(a){return a},templateResult:function(a){return a.text},templateSelection:function(a){return a.text},theme:"default",width:"resolve"}},D.prototype.set=function(b,c){var d=a.camelCase(b),e={};e[d]=c;var f=j._convertData(e);a.extend(this.defaults,f)};var E=new D;return E}),b.define("select2/options",["require","jquery","./defaults","./utils"],function(a,b,c,d){function e(b,e){if(this.options=b,null!=e&&this.fromElement(e),this.options=c.apply(this.options),e&&e.is("input")){var f=a(this.get("amdBase")+"compat/inputData");this.options.dataAdapter=d.Decorate(this.options.dataAdapter,f)}}return e.prototype.fromElement=function(a){var c=["select2"];null==this.options.multiple&&(this.options.multiple=a.prop("multiple")),null==this.options.disabled&&(this.options.disabled=a.prop("disabled")),null==this.options.language&&(a.prop("lang")?this.options.language=a.prop("lang").toLowerCase():a.closest("[lang]").prop("lang")&&(this.options.language=a.closest("[lang]").prop("lang"))),null==this.options.dir&&(a.prop("dir")?this.options.dir=a.prop("dir"):a.closest("[dir]").prop("dir")?this.options.dir=a.closest("[dir]").prop("dir"):this.options.dir="ltr"),a.prop("disabled",this.options.disabled),a.prop("multiple",this.options.multiple),a.data("select2Tags")&&(this.options.debug&&window.console&&console.warn&&console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'),a.data("data",a.data("select2Tags")),a.data("tags",!0)),a.data("ajaxUrl")&&(this.options.debug&&window.console&&console.warn&&console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."),a.attr("ajax--url",a.data("ajaxUrl")),a.data("ajax--url",a.data("ajaxUrl")));var e={};e=b.fn.jquery&&"1."==b.fn.jquery.substr(0,2)&&a[0].dataset?b.extend(!0,{},a[0].dataset,a.data()):a.data();var f=b.extend(!0,{},e);f=d._convertData(f);for(var g in f)b.inArray(g,c)>-1||(b.isPlainObject(this.options[g])?b.extend(this.options[g],f[g]):this.options[g]=f[g]);return this},e.prototype.get=function(a){return this.options[a]},e.prototype.set=function(a,b){this.options[a]=b},e}),b.define("select2/core",["jquery","./options","./utils","./keys"],function(a,b,c,d){var e=function(a,c){null!=a.data("select2")&&a.data("select2").destroy(),this.$element=a,this.id=this._generateId(a),c=c||{},this.options=new b(c,a),e.__super__.constructor.call(this);var d=a.attr("tabindex")||0;a.data("old-tabindex",d),a.attr("tabindex","-1");var f=this.options.get("dataAdapter");this.dataAdapter=new f(a,this.options);var g=this.render();this._placeContainer(g);var h=this.options.get("selectionAdapter");this.selection=new h(a,this.options),this.$selection=this.selection.render(),this.selection.position(this.$selection,g);var i=this.options.get("dropdownAdapter");this.dropdown=new i(a,this.options),this.$dropdown=this.dropdown.render(),this.dropdown.position(this.$dropdown,g);var j=this.options.get("resultsAdapter");this.results=new j(a,this.options,this.dataAdapter),this.$results=this.results.render(),this.results.position(this.$results,this.$dropdown);var k=this;this._bindAdapters(),this._registerDomEvents(),this._registerDataEvents(),this._registerSelectionEvents(),this._registerDropdownEvents(),this._registerResultsEvents(),this._registerEvents(),this.dataAdapter.current(function(a){k.trigger("selection:update",{data:a})}),a.addClass("select2-hidden-accessible"),a.attr("aria-hidden","true"),this._syncAttributes(),a.data("select2",this)};return c.Extend(e,c.Observable),e.prototype._generateId=function(a){var b="";return b=null!=a.attr("id")?a.attr("id"):null!=a.attr("name")?a.attr("name")+"-"+c.generateChars(2):c.generateChars(4),b=b.replace(/(:|\.|\[|\]|,)/g,""),b="select2-"+b},e.prototype._placeContainer=function(a){a.insertAfter(this.$element);var b=this._resolveWidth(this.$element,this.options.get("width"));null!=b&&a.css("width",b)},e.prototype._resolveWidth=function(a,b){var c=/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;if("resolve"==b){var d=this._resolveWidth(a,"style");return null!=d?d:this._resolveWidth(a,"element")}if("element"==b){var e=a.outerWidth(!1);return 0>=e?"auto":e+"px"}if("style"==b){var f=a.attr("style");if("string"!=typeof f)return null;for(var g=f.split(";"),h=0,i=g.length;i>h;h+=1){var j=g[h].replace(/\s/g,""),k=j.match(c);if(null!==k&&k.length>=1)return k[1]}return null}return b},e.prototype._bindAdapters=function(){this.dataAdapter.bind(this,this.$container),this.selection.bind(this,this.$container),this.dropdown.bind(this,this.$container),this.results.bind(this,this.$container)},e.prototype._registerDomEvents=function(){var b=this;this.$element.on("change.select2",function(){b.dataAdapter.current(function(a){b.trigger("selection:update",{data:a})})}),this.$element.on("focus.select2",function(a){b.trigger("focus",a)}),this._syncA=c.bind(this._syncAttributes,this),this._syncS=c.bind(this._syncSubtree,this),this.$element[0].attachEvent&&this.$element[0].attachEvent("onpropertychange",this._syncA);var d=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;null!=d?(this._observer=new d(function(c){a.each(c,b._syncA),a.each(c,b._syncS)}),this._observer.observe(this.$element[0],{attributes:!0,childList:!0,subtree:!1})):this.$element[0].addEventListener&&(this.$element[0].addEventListener("DOMAttrModified",b._syncA,!1),this.$element[0].addEventListener("DOMNodeInserted",b._syncS,!1),this.$element[0].addEventListener("DOMNodeRemoved",b._syncS,!1))},e.prototype._registerDataEvents=function(){var a=this;this.dataAdapter.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerSelectionEvents=function(){var b=this,c=["toggle","focus"];this.selection.on("toggle",function(){b.toggleDropdown()}),this.selection.on("focus",function(a){b.focus(a)}),this.selection.on("*",function(d,e){-1===a.inArray(d,c)&&b.trigger(d,e)})},e.prototype._registerDropdownEvents=function(){var a=this;this.dropdown.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerResultsEvents=function(){var a=this;this.results.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerEvents=function(){var a=this;this.on("open",function(){a.$container.addClass("select2-container--open")}),this.on("close",function(){a.$container.removeClass("select2-container--open")}),this.on("enable",function(){a.$container.removeClass("select2-container--disabled")}),this.on("disable",function(){a.$container.addClass("select2-container--disabled")}),this.on("blur",function(){a.$container.removeClass("select2-container--focus")}),this.on("query",function(b){a.isOpen()||a.trigger("open",{}),this.dataAdapter.query(b,function(c){a.trigger("results:all",{data:c,query:b})})}),this.on("query:append",function(b){this.dataAdapter.query(b,function(c){a.trigger("results:append",{data:c,query:b})})}),this.on("keypress",function(b){var c=b.which;a.isOpen()?c===d.ESC||c===d.TAB||c===d.UP&&b.altKey?(a.close(),b.preventDefault()):c===d.ENTER?(a.trigger("results:select",{}),b.preventDefault()):c===d.SPACE&&b.ctrlKey?(a.trigger("results:toggle",{}),b.preventDefault()):c===d.UP?(a.trigger("results:previous",{}),b.preventDefault()):c===d.DOWN&&(a.trigger("results:next",{}),b.preventDefault()):(c===d.ENTER||c===d.SPACE||c===d.DOWN&&b.altKey)&&(a.open(),b.preventDefault())})},e.prototype._syncAttributes=function(){this.options.set("disabled",this.$element.prop("disabled")),this.options.get("disabled")?(this.isOpen()&&this.close(),this.trigger("disable",{})):this.trigger("enable",{})},e.prototype._syncSubtree=function(a,b){var c=!1,d=this;if(!a||!a.target||"OPTION"===a.target.nodeName||"OPTGROUP"===a.target.nodeName){if(b)if(b.addedNodes&&b.addedNodes.length>0)for(var e=0;e<b.addedNodes.length;e++){var f=b.addedNodes[e];f.selected&&(c=!0)}else b.removedNodes&&b.removedNodes.length>0&&(c=!0);else c=!0;c&&this.dataAdapter.current(function(a){d.trigger("selection:update",{data:a})})}},e.prototype.trigger=function(a,b){var c=e.__super__.trigger,d={open:"opening",close:"closing",select:"selecting",unselect:"unselecting"};if(void 0===b&&(b={}),a in d){var f=d[a],g={prevented:!1,name:a,args:b};if(c.call(this,f,g),g.prevented)return void(b.prevented=!0)}c.call(this,a,b)},e.prototype.toggleDropdown=function(){this.options.get("disabled")||(this.isOpen()?this.close():this.open())},e.prototype.open=function(){this.isOpen()||this.trigger("query",{})},e.prototype.close=function(){this.isOpen()&&this.trigger("close",{})},e.prototype.isOpen=function(){return this.$container.hasClass("select2-container--open")},e.prototype.hasFocus=function(){return this.$container.hasClass("select2-container--focus")},e.prototype.focus=function(a){this.hasFocus()||(this.$container.addClass("select2-container--focus"),this.trigger("focus",{}))},e.prototype.enable=function(a){this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'),(null==a||0===a.length)&&(a=[!0]);var b=!a[0];this.$element.prop("disabled",b)},e.prototype.data=function(){this.options.get("debug")&&arguments.length>0&&window.console&&console.warn&&console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');var a=[];return this.dataAdapter.current(function(b){a=b}),a},e.prototype.val=function(b){if(this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'),null==b||0===b.length)return this.$element.val();var c=b[0];a.isArray(c)&&(c=a.map(c,function(a){return a.toString()})),this.$element.val(c).trigger("change")},e.prototype.destroy=function(){this.$container.remove(),this.$element[0].detachEvent&&this.$element[0].detachEvent("onpropertychange",this._syncA),null!=this._observer?(this._observer.disconnect(),this._observer=null):this.$element[0].removeEventListener&&(this.$element[0].removeEventListener("DOMAttrModified",this._syncA,!1),this.$element[0].removeEventListener("DOMNodeInserted",this._syncS,!1),this.$element[0].removeEventListener("DOMNodeRemoved",this._syncS,!1)),this._syncA=null,this._syncS=null,this.$element.off(".select2"),this.$element.attr("tabindex",this.$element.data("old-tabindex")),this.$element.removeClass("select2-hidden-accessible"),this.$element.attr("aria-hidden","false"),this.$element.removeData("select2"),this.dataAdapter.destroy(),this.selection.destroy(),this.dropdown.destroy(),this.results.destroy(),this.dataAdapter=null,this.selection=null,this.dropdown=null,this.results=null;
},e.prototype.render=function(){var b=a('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');return b.attr("dir",this.options.get("dir")),this.$container=b,this.$container.addClass("select2-container--"+this.options.get("theme")),b.data("element",this.$element),b},e}),b.define("jquery-mousewheel",["jquery"],function(a){return a}),b.define("jquery.select2",["jquery","jquery-mousewheel","./select2/core","./select2/defaults"],function(a,b,c,d){if(null==a.fn.select2){var e=["open","close","destroy"];a.fn.select2=function(b){if(b=b||{},"object"==typeof b)return this.each(function(){var d=a.extend(!0,{},b);new c(a(this),d)}),this;if("string"==typeof b){var d,f=Array.prototype.slice.call(arguments,1);return this.each(function(){var c=a(this).data("select2");null==c&&window.console&&console.error&&console.error("The select2('"+b+"') method was called on an element that is not using Select2."),d=c[b].apply(c,f)}),a.inArray(b,e)>-1?this:d}throw new Error("Invalid arguments for Select2: "+b)}}return null==a.fn.select2.defaults&&(a.fn.select2.defaults=d),c}),{define:b.define,require:b.require}}(),c=b.require("jquery.select2");return a.fn.select2.amd=b,c});/*! rangeslider.js - v2.3.0 | (c) 2016 @andreruffert | MIT license | https://github.com/andreruffert/rangeslider.js */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){"use strict";function b(){var a=document.createElement("input");return a.setAttribute("type","range"),"text"!==a.type}function c(a,b){var c=Array.prototype.slice.call(arguments,2);return setTimeout(function(){return a.apply(null,c)},b)}function d(a,b){return b=b||100,function(){if(!a.debouncing){var c=Array.prototype.slice.apply(arguments);a.lastReturnVal=a.apply(window,c),a.debouncing=!0}return clearTimeout(a.debounceTimeout),a.debounceTimeout=setTimeout(function(){a.debouncing=!1},b),a.lastReturnVal}}function e(a){return a&&(0===a.offsetWidth||0===a.offsetHeight||a.open===!1)}function f(a){for(var b=[],c=a.parentNode;e(c);)b.push(c),c=c.parentNode;return b}function g(a,b){function c(a){"undefined"!=typeof a.open&&(a.open=!a.open)}var d=f(a),e=d.length,g=[],h=a[b];if(e){for(var i=0;i<e;i++)g[i]=d[i].style.cssText,d[i].style.setProperty?d[i].style.setProperty("display","block","important"):d[i].style.cssText+=";display: block !important",d[i].style.height="0",d[i].style.overflow="hidden",d[i].style.visibility="hidden",c(d[i]);h=a[b];for(var j=0;j<e;j++)d[j].style.cssText=g[j],c(d[j])}return h}function h(a,b){var c=parseFloat(a);return Number.isNaN(c)?b:c}function i(a){return a.charAt(0).toUpperCase()+a.substr(1)}function j(b,e){if(this.$window=a(window),this.$document=a(document),this.$element=a(b),this.options=a.extend({},n,e),this.polyfill=this.options.polyfill,this.orientation=this.$element[0].getAttribute("data-orientation")||this.options.orientation,this.onInit=this.options.onInit,this.onSlide=this.options.onSlide,this.onSlideEnd=this.options.onSlideEnd,this.DIMENSION=o.orientation[this.orientation].dimension,this.DIRECTION=o.orientation[this.orientation].direction,this.DIRECTION_STYLE=o.orientation[this.orientation].directionStyle,this.COORDINATE=o.orientation[this.orientation].coordinate,this.polyfill&&m)return!1;this.identifier="js-"+k+"-"+l++,this.startEvent=this.options.startEvent.join("."+this.identifier+" ")+"."+this.identifier,this.moveEvent=this.options.moveEvent.join("."+this.identifier+" ")+"."+this.identifier,this.endEvent=this.options.endEvent.join("."+this.identifier+" ")+"."+this.identifier,this.toFixed=(this.step+"").replace(".","").length-1,this.$fill=a('<div class="'+this.options.fillClass+'" />'),this.$handle=a('<div class="'+this.options.handleClass+'" />'),this.$range=a('<div class="'+this.options.rangeClass+" "+this.options[this.orientation+"Class"]+'" id="'+this.identifier+'" />').insertAfter(this.$element).prepend(this.$fill,this.$handle),this.$element.css({position:"absolute",width:"1px",height:"1px",overflow:"hidden",opacity:"0"}),this.handleDown=a.proxy(this.handleDown,this),this.handleMove=a.proxy(this.handleMove,this),this.handleEnd=a.proxy(this.handleEnd,this),this.init();var f=this;this.$window.on("resize."+this.identifier,d(function(){c(function(){f.update(!1,!1)},300)},20)),this.$document.on(this.startEvent,"#"+this.identifier+":not(."+this.options.disabledClass+")",this.handleDown),this.$element.on("change."+this.identifier,function(a,b){if(!b||b.origin!==f.identifier){var c=a.target.value,d=f.getPositionFromValue(c);f.setPosition(d)}})}Number.isNaN=Number.isNaN||function(a){return"number"==typeof a&&a!==a};var k="rangeslider",l=0,m=b(),n={polyfill:!0,orientation:"horizontal",rangeClass:"rangeslider",disabledClass:"rangeslider--disabled",activeClass:"rangeslider--active",horizontalClass:"rangeslider--horizontal",verticalClass:"rangeslider--vertical",fillClass:"rangeslider__fill",handleClass:"rangeslider__handle",startEvent:["mousedown","touchstart","pointerdown"],moveEvent:["mousemove","touchmove","pointermove"],endEvent:["mouseup","touchend","pointerup"]},o={orientation:{horizontal:{dimension:"width",direction:"left",directionStyle:"left",coordinate:"x"},vertical:{dimension:"height",direction:"top",directionStyle:"bottom",coordinate:"y"}}};return j.prototype.init=function(){this.update(!0,!1),this.onInit&&"function"==typeof this.onInit&&this.onInit()},j.prototype.update=function(a,b){a=a||!1,a&&(this.min=h(this.$element[0].getAttribute("min"),0),this.max=h(this.$element[0].getAttribute("max"),100),this.value=h(this.$element[0].value,Math.round(this.min+(this.max-this.min)/2)),this.step=h(this.$element[0].getAttribute("step"),1)),this.handleDimension=g(this.$handle[0],"offset"+i(this.DIMENSION)),this.rangeDimension=g(this.$range[0],"offset"+i(this.DIMENSION)),this.maxHandlePos=this.rangeDimension-this.handleDimension,this.grabPos=this.handleDimension/2,this.position=this.getPositionFromValue(this.value),this.$element[0].disabled?this.$range.addClass(this.options.disabledClass):this.$range.removeClass(this.options.disabledClass),this.setPosition(this.position,b)},j.prototype.handleDown=function(a){if(a.preventDefault(),this.$document.on(this.moveEvent,this.handleMove),this.$document.on(this.endEvent,this.handleEnd),this.$range.addClass(this.options.activeClass),!((" "+a.target.className+" ").replace(/[\n\t]/g," ").indexOf(this.options.handleClass)>-1)){var b=this.getRelativePosition(a),c=this.$range[0].getBoundingClientRect()[this.DIRECTION],d=this.getPositionFromNode(this.$handle[0])-c,e="vertical"===this.orientation?this.maxHandlePos-(b-this.grabPos):b-this.grabPos;this.setPosition(e),b>=d&&b<d+this.handleDimension&&(this.grabPos=b-d)}},j.prototype.handleMove=function(a){a.preventDefault();var b=this.getRelativePosition(a),c="vertical"===this.orientation?this.maxHandlePos-(b-this.grabPos):b-this.grabPos;this.setPosition(c)},j.prototype.handleEnd=function(a){a.preventDefault(),this.$document.off(this.moveEvent,this.handleMove),this.$document.off(this.endEvent,this.handleEnd),this.$range.removeClass(this.options.activeClass),this.$element.trigger("change",{origin:this.identifier}),this.onSlideEnd&&"function"==typeof this.onSlideEnd&&this.onSlideEnd(this.position,this.value)},j.prototype.cap=function(a,b,c){return a<b?b:a>c?c:a},j.prototype.setPosition=function(a,b){var c,d;void 0===b&&(b=!0),c=this.getValueFromPosition(this.cap(a,0,this.maxHandlePos)),d=this.getPositionFromValue(c),this.$fill[0].style[this.DIMENSION]=d+this.grabPos+"px",this.$handle[0].style[this.DIRECTION_STYLE]=d+"px",this.setValue(c),this.position=d,this.value=c,b&&this.onSlide&&"function"==typeof this.onSlide&&this.onSlide(d,c)},j.prototype.getPositionFromNode=function(a){for(var b=0;null!==a;)b+=a.offsetLeft,a=a.offsetParent;return b},j.prototype.getRelativePosition=function(a){var b=i(this.COORDINATE),c=this.$range[0].getBoundingClientRect()[this.DIRECTION],d=0;return"undefined"!=typeof a.originalEvent["client"+b]?d=a.originalEvent["client"+b]:a.originalEvent.touches&&a.originalEvent.touches[0]&&"undefined"!=typeof a.originalEvent.touches[0]["client"+b]?d=a.originalEvent.touches[0]["client"+b]:a.currentPoint&&"undefined"!=typeof a.currentPoint[this.COORDINATE]&&(d=a.currentPoint[this.COORDINATE]),d-c},j.prototype.getPositionFromValue=function(a){var b,c;return b=(a-this.min)/(this.max-this.min),c=Number.isNaN(b)?0:b*this.maxHandlePos},j.prototype.getValueFromPosition=function(a){var b,c;return b=a/(this.maxHandlePos||1),c=this.step*Math.round(b*(this.max-this.min)/this.step)+this.min,Number(c.toFixed(this.toFixed))},j.prototype.setValue=function(a){a===this.value&&""!==this.$element[0].value||this.$element.val(a).trigger("input",{origin:this.identifier})},j.prototype.destroy=function(){this.$document.off("."+this.identifier),this.$window.off("."+this.identifier),this.$element.off("."+this.identifier).removeAttr("style").removeData("plugin_"+k),this.$range&&this.$range.length&&this.$range[0].parentNode.removeChild(this.$range[0])},a.fn[k]=function(b){var c=Array.prototype.slice.call(arguments,1);return this.each(function(){var d=a(this),e=d.data("plugin_"+k);e||d.data("plugin_"+k,e=new j(this,b)),"string"==typeof b&&e[b].apply(e,c)})},"rangeslider.js is available in jQuery context e.g $(selector).rangeslider(options);"});
( function ( api, $, _ ) {
      /*****************************************************************************
      * REACT TO PREVIEW DEVICE SWITCH => send device to preview
      *****************************************************************************/
      api.bind( 'ready' , function() {
          if ( api.previewedDevice ) {
                api.previewedDevice.bind( function( device ) {
                      api.previewer.send( 'previewed-device', device );
                });
          }
      });
})( wp.customize , jQuery, _);//NOT USED YET
// var czr_debug = {
//       log: function(o) {debug.queue.push(['log', arguments, debug.stack.slice(0)]); if (window.console && typeof window.console.log == 'function') {window.console.log(o);}},
//       error: function(o) {debug.queue.push(['error', arguments, debug.stack.slice(0)]); if (window.console && typeof window.console.error == 'function') {window.console.error(o);}},
//       queue: [],
//       stack: []
// };
//var api = api || wp.customize, $ = $ || jQuery;
( function ( api, $, _ ) {
      //The api.czr_skopeReady is used by some modules like the slider to fire actions
      //if skope is disabled, we need to resolve it now.
      api.czr_skopeReady = $.Deferred();
      if ( _.isUndefined( serverControlParams.isSkopOn ) || ! serverControlParams.isSkopOn ) {
            api.czr_skopeReady.resolve();
      }

      //@return [] for console method
      //@bgCol @textCol are hex colors
      //@arguments : the original console arguments
      var _prettyPrintLog = function( args ) {
            var _defaults = {
                  bgCol : '#5ed1f5',
                  textCol : '#000',
                  consoleArguments : []
            };
            args = _.extend( _defaults, args );

            var _toArr = Array.from( args.consoleArguments ),
                _truncate = function( string ){
                      if ( ! _.isString( string ) )
                        return '';
                      return string.length > 150 ? string.substr( 0, 149 ) : string;
                };

            //if the array to print is not composed exclusively of strings, then let's stringify it
            //else join(' ')
            if ( ! _.isEmpty( _.filter( _toArr, function( it ) { return ! _.isString( it ); } ) ) ) {
                  _toArr =  JSON.stringify( _toArr.join(' ') );
            } else {
                  _toArr = _toArr.join(' ');
            }
            return [
                  '%c ' + _truncate( _toArr ),
                  [ 'background:' + args.bgCol, 'color:' + args.textCol, 'display: block;' ].join(';')
            ];
      };
      //Dev mode aware and IE compatible api.consoleLog()
      api.consoleLog = function() {
            if ( ! serverControlParams.isDevMode )
              return;
            //fix for IE, because console is only defined when in F12 debugging mode in IE
            if ( ( _.isUndefined( console ) && typeof window.console.log != 'function' ) )
              return;
            console.log.apply( console, _prettyPrintLog( { consoleArguments : arguments } ) );
            console.log( 'Unstyled console message : ', arguments );
      };

      api.errorLog = function() {
            //fix for IE, because console is only defined when in F12 debugging mode in IE
            if ( ( _.isUndefined( console ) && typeof window.console.log != 'function' ) )
              return;

            console.log.apply( console, _prettyPrintLog( { bgCol : '#ffd5a0', textCol : '#000', consoleArguments : arguments } ) );
            if ( serverControlParams.isDevMode ) {
                  console.log( 'Unstyled error message : ', arguments );
            }
      };

      api.czr_isSkopOn = function() {
            return ! _.isUndefined ( serverControlParams.isSkopOn ) && serverControlParams.isSkopOn && _.has( api, 'czr_skopeBase' );
      };

      api.czr_isChangeSetOn = function() {
            return serverControlParams.isChangeSetOn && true === true;//&& true === true is just there to hackily cast the returned value as boolean.
      };

})( wp.customize , jQuery, _);
( function ( api, $, _ ) {
      // if ( ! serverControlParams.isSkopOn )
      //   return;
      /*****************************************************************************
      * A "CONTEXT AWARE" SET METHD
      *****************************************************************************/
      /**
      * OVERRIDES BASE api.Value set method
      * => adds the o {} param, allowing to pass additional contextual informations.
      *
      * Set the value and trigger all bound callbacks.
      *
      * @param {object} to New value.
      */

      // set: function( to ) {
      //   var from = this._value;

      //   to = this._setter.apply( this, arguments );
      //   to = this.validate( to );

      //   // Bail if the sanitized value is null or unchanged.
      //   if ( null === to || _.isEqual( from, to ) ) {
      //     return this;
      //   }

      //   this._value = to;
      //   this._dirty = true;

      //   this.callbacks.fireWith( this, [ to, from ] );

      //   return this;
      // },
      api.Value.prototype.set = function( to, o ) {
            var from = this._value, dfd = $.Deferred(), self = this, _promises = [];

            to = this._setter.apply( this, arguments );
            to = this.validate( to );
            args = _.extend( { silent : false }, _.isObject( o ) ? o : {} );

            // Bail if the sanitized value is null or unchanged.
            if ( null === to || _.isEqual( from, to ) ) {
                  return dfd.resolveWith( self, [ to, from, o ] ).promise();
            }

            this._value = to;
            this._dirty = true;
            if ( true === args.silent ) {
                  return dfd.resolveWith( self, [ to, from, o ] ).promise();
            }

            if ( this._deferreds ) {
                  _.each( self._deferreds, function( _prom ) {
                        _promises.push( _prom.apply( null, [ to, from, o ] ) );
                  });

                  $.when.apply( null, _promises )
                        .fail( function() { api.errorLog( 'A deferred callback failed in api.Value::set()'); })
                        .then( function() {
                              self.callbacks.fireWith( self, [ to, from, o ] );
                              dfd.resolveWith( self, [ to, from, o ] );
                        });
            } else {
                  this.callbacks.fireWith( this, [ to, from, o ] );
                  return dfd.resolveWith( self, [ to, from, o ] ).promise( self );
            }
            return dfd.promise( self );
      };

      //allows us to specify a list of callbacks + a { deferred : true } param
      //if deferred is found and true, then the callback(s) are added in a list of deferred
      //@see how this deferred list is used in api.Value.prototype.set()
      api.Value.prototype.bind = function() {
          //find an object in the argument
          var self = this,
              _isDeferred = false,
              _cbs = [];

          $.each( arguments, function( _key, _arg ) {
                if ( ! _isDeferred )
                  _isDeferred = _.isObject( _arg  ) && _arg.deferred;
                if ( _.isFunction( _arg ) )
                  _cbs.push( _arg );
          });

          if ( _isDeferred ) {
                self._deferreds = self._deferreds || [];
                _.each( _cbs, function( _cb ) {
                      if ( ! _.contains( _cb, self._deferreds ) )
                        self._deferreds.push( _cb );
                });
          } else {
                //original method
                self.callbacks.add.apply( self.callbacks, arguments );
          }
          return this;
      };

      /*****************************************************************************
      * A SILENT SET METHOD :
      * => keep the dirtyness param unchanged
      * => stores the api state before callback calls, and reset it after
      * => add an object param to the callback to inform that this is a silent process
      * , this is typically used in the overridden api.Setting.preview method
      *****************************************************************************/
      //@param to : the new value to set
      //@param dirtyness : the current dirtyness status of this setting in the skope
      //
      api.Setting.prototype.silent_set =function( to, dirtyness ) {
            var from = this._value,
                _save_state = api.state('saved')();

            to = this._setter.apply( this, arguments );
            to = this.validate( to );

            // Bail if the sanitized value is null or unchanged.
            if ( null === to || _.isEqual( from, to ) ) {
              return this;
            }

            this._value = to;
            this._dirty = ( _.isUndefined( dirtyness ) || ! _.isBoolean( dirtyness ) ) ? this._dirty : dirtyness;

            this.callbacks.fireWith( this, [ to, from, { silent : true } ] );
            //reset the api state to its value before the callback call
            api.state('saved')( _save_state );
            return this;
      };
})( wp.customize , jQuery, _ );
( function ( api, $, _ ) {
      //PREPARE THE SKOPE AWARE PREVIEWER

      //@return void()
      //Changed the core to specify that the setting preview is actually a deferred callback
      //=> allows us to use syntax like :
      //api( setId ).set( new_value ).done( function() { execute actions when all the setting callbacks have been done })
      // api.Setting.prototype.initialize = function( id, value, options ) {
      //       var setting = this;
      //       api.Value.prototype.initialize.call( setting, value, options );

      //       setting.id = id;
      //       setting.transport = setting.transport || 'refresh';
      //       setting._dirty = options.dirty || false;
      //       setting.notifications = new api.Values({ defaultConstructor: api.Notification });

      //       // Whenever the setting's value changes, refresh the preview.
      //       setting.bind( setting.preview );

      //       // the deferred can be used in moduleCollectionReact to execute actions after the module has been set.
      //       // setting.bind( function( to, from , data ) {
      //       //       return setting.preview( to, from , data );
      //       // }, { deferred : true } );
      // };


      //var _old_preview = api.Setting.prototype.preview;
      //@return a deferred promise
      api.Setting.prototype.preview = function( to, from , data ) {
            var setting = this, transport, dfd = $.Deferred();

            transport = setting.transport;

            if ( serverControlParams.isSkopOn && api.czr_isPreviewerSkopeAware && 'pending' == api.czr_isPreviewerSkopeAware.state() ) {
                  this.previewer.refresh();
                  return dfd.resolve( arguments ).promise();
            }
            //as soon as the previewer is setup, let's behave as usual
            //=> but don't refresh when silently updating

            //Each input instantiated in an item or a modOpt can have a specific transport set.
            //the input transport is hard coded in the module js template, with the attribute : data-transport="postMessage" or "refresh"
            //=> this is optional, if not set, then the transport will be inherited from the the module, which inherits from the control.
            //
            //If the input transport is specifically set to postMessage, then we don't want to send the 'setting' event to the preview
            //=> this will prevent any partial refresh to be triggered if the input control parent is defined has a partial refresh one.
            //=> the input will be sent to preview with api.previewer.send( 'czr_input', {...} )
            //
            //One exception : if the input transport is set to postMessage but the setting has not been set yet in the api (from is undefined, null, or empty) , we usually need to make an initial refresh
            //=> typically, the initial refresh can be needed to set the relevant module css id selector that will be used afterwards for the postMessage input preview

            //If we are in an input postMessage situation, the not_preview_sent param has been set in the czr_Input.inputReact method
            //=> 1) We bail here
            //=> 2) and we will send a custom event to the preview looking like :
            //api.previewer.send( 'czr_input', {
            //       set_id        : module.control.id,
            //       module        : { items : $.extend( true, {}, module().items) , modOpt : module.hasModOpt() ?  $.extend( true, {}, module().modOpt ): {} },
            //       module_id     : module.id,//<= will allow us to target the right dom element on front end
            //       input_id      : input.id,
            //       input_parent_id : input.input_parent.id,//<= can be the mod opt or the item
            //       value         : to
            // });

            //=> if no from (setting not set yet => fall back on defaut transport)
            if ( ! _.isUndefined( from ) && ! _.isEmpty( from ) && ! _.isNull( from ) ) {
                  if ( _.isObject( data ) && true === data.not_preview_sent ) {
                        return dfd.resolve( arguments ).promise();
                  }
            }

            //Don't do anything id we are silent
            if ( _.has( data, 'silent' ) && false !== data.silent )
              return dfd.resolve( arguments ).promise();


            //CORE PREVIEW AS OF WP 4.7+
            if ( 'postMessage' === transport && ! api.state( 'previewerAlive' ).get() ) {
                  transport = 'refresh';
            }

            if ( 'postMessage' === transport ) {
                  //Pre setting event with a richer object passed
                  //=> can be used in a partial refresh scenario to execute actions prior to the actual selective refresh which is triggered on 'setting', just after
                  setting.previewer.send( 'pre_setting', {
                        set_id : setting.id,
                        data   : data,//<= { module_id : 'string', module : {} } which typically includes the module_id and the module model ( items, mod options )
                        value  : to
                  });

                  //WP Default
                  //=> the 'setting' event is used for normal and partial refresh post message actions
                  //=> the partial refresh is fired on the preview if a partial has been registered for this setting in the php customize API
                  //=> When a partial has been registered, the "normal" ( => the not partial refresh ones ) postMessage callbacks will be fired before the ajax ones
                  setting.previewer.send( 'setting', [ setting.id, setting() ] );

                  dfd.resolve( arguments );

            } else if ( 'refresh' === transport ) {
                  //the refresh() method only returns a promise when skope is on
                  if ( serverControlParams.isSkopOn ) {
                        setting.previewer.refresh().always( function() {
                              dfd.resolve( arguments );
                        });
                  } else {
                        setting.previewer.refresh();
                        dfd.resolve( arguments );
                  }
            }

            return dfd.promise();
      };//api.Setting.prototype.preview
})( wp.customize , jQuery, _ );
( function ( api, $, _ ) {
      /* monkey patch for the content height set */
      //wp.customize.Section is not available before wp 4.1
      if ( 'function' == typeof api.Section ) {
            // backup the original function
            var _original_section_initialize = api.Section.prototype.initialize;
            api.Section.prototype.initialize = function( id, options ) {
                  //call the original constructor
                  _original_section_initialize.apply( this, [id, options] );
                  var section = this;

                  this.expanded.callbacks.add( function( _expanded ) {
                    if ( ! _expanded )
                      return;

                  var container = section.container.closest( '.wp-full-overlay-sidebar-content' ),
                        content = section.container.find( '.accordion-section-content' );
                    //content resizing to the container height
                    _resizeContentHeight = function() {
                      content.css( 'height', container.innerHeight() );
                  };
                    _resizeContentHeight();
                    //this is set to off in the original expand callback if 'expanded' is false
                    $( window ).on( 'resize.customizer-section', _.debounce( _resizeContentHeight, 110 ) );
                  });
            };
      }
})( wp.customize , jQuery, _ );
(function (api, $, _) {
api.CZR_Helpers = api.CZR_Helpers || {};
//////////////////////////////////////////////////
/// ACTIONS AND DOM LISTENERS
//////////////////////////////////////////////////
//adds action to an existing event map
//@event map = [ {event1}, {event2}, ... ]
//@new_event = {  trigger   : event name , actions   : [ 'cb1', 'cb2', ... ] }
api.CZR_Helpers = $.extend( api.CZR_Helpers, {
      //While a control should always have a default setting,
      //It can have additional setting assigned
      //This method returns the default setting or the specified type if requested
      //Example : header_image has default and data
      getControlSettingId : function( control_id, setting_type ) {
            setting_type = 'default' || setting_type;
            if ( ! api.control.has( control_id ) ) {
                 // api.consoleLog( 'getControlSettingId : The requested control_id is not registered in the api yet : ' + control_id );
                  return control_id;
            }
            if ( ! _.has( api.control( control_id ), 'settings' ) || _.isEmpty( api.control( control_id ).settings ) )
              return control_id;

            if ( ! _.has( api.control( control_id ).settings, setting_type ) ) {
                  api.consoleLog( 'getControlSettingId : The requested control_id does not have the requested setting type : ' + control_id + ' , ' + setting_type );
                  return control_id;
            }
            if ( _.isUndefined( api.control( control_id ).settings[setting_type].id ) ) {
                  api.consoleLog( 'getControlSettingId : The requested control_id has no setting id assigned : ' + control_id );
                  return control_id;
            }
            return api.control( control_id ).settings[setting_type].id;
      },



      getDocSearchLink : function( text ) {
            text = ! _.isString(text) ? '' : text;
            var _searchtext = text.replace( / /g, '+'),
                _url = [ serverControlParams.docURL, 'search?query=', _searchtext ].join('');
            return [
              '<a href="' + _url + '" title="' + serverControlParams.i18n.readDocumentation + '" target="_blank">',
              ' ',
              '<span class="far fa-question-circle-o"></span>'
            ].join('');
      },


      /*
      * @return string
      * simple helper to build the setting wp api ready id
      */
      build_setId : function ( setId ) {
            //exclude the WP built-in settings like blogdescription, show_on_front, etc
            if ( _.contains( serverControlParams.wpBuiltinSettings, setId ) )
              return setId;

            // //extract the setting id for theme mods
            // var _pattern;

            //exclude the WP built-in settings like sidebars_widgets*, nav_menu_*, widget_*, custom_css
            // var _patterns = [ 'widget_', 'nav_menu', 'sidebars_', 'custom_css' ],
            //     _isExcld = false;
            // _.each( _patterns, function( _ptrn ) {
            //       if ( _isExcld )
            //         return;
            //       _isExcld = _ptrn == setId.substring( 0, _ptrn.length );
            // });
            // if ( _isExcld )
            // return setId;
            if ( ! _.contains( serverControlParams.themeSettingList, setId ) )
              return setId;

            return -1 == setId.indexOf( serverControlParams.themeOptions ) ? [ serverControlParams.themeOptions +'[' , setId  , ']' ].join('') : setId;
    },

      /*
      * @return string
      * simple helper to extract the option name from a setting id
      */
      getOptionName : function(name) {
            var self = this;
            //targets only the options of the theme
            if ( -1 == name.indexOf(serverControlParams.themeOptions) )
              return name;
            return name.replace(/\[|\]/g, '').replace(serverControlParams.themeOptions, '');
      },



      //@return bool
      //@uses api.czr_partials
      hasPartRefresh : function( setId ) {
            if ( ! _.has( api, 'czr_partials')  )
              return;
            return  _.contains( _.map( api.czr_partials(), function( partial, key ) {
                  return _.contains( partial.settings, setId );
            }), true );
      },

      //@return the array of controls in a given section_id
      getSectionControlIds : function( section_id ) {
            section_id = section_id || api.czr_activeSectionId();
            return ! api.section.has( section_id ) ?
                  [] :
                  _.map( api.section( section_id ).controls(), function( _ctrl ) {
                        return _ctrl.id;
                  });
      },


      //1) get the control of a given section
      //2) for each control get the associated setting(s)
      //=> important, a control might have several associated settings. Typical example : header_image.
      //@return [] of setting ids for a given czr section
      getSectionSettingIds : function( section_id ) {
            section_id = section_id || api.czr_activeSectionId();
            if ( ! api.section.has( section_id) )
              return;
            var self = this,
                _sec_settings = [],
                _sec_controls = self.getSectionControlIds( section_id );

            _.each( _sec_controls, function( ctrlId ) {
                  _.each( api.control(ctrlId).settings, function( _instance, _k ) {
                        _sec_settings.push( _instance.id );
                  });
            });
            return _sec_settings;
      },


      //////////////////////////////////////////////////
      /// STRINGS HELPERS
      //////////////////////////////////////////////////
      capitalize : function( string ) {
            if( ! _.isString(string) )
              return string;
            return string.charAt(0).toUpperCase() + string.slice(1);
      },

      truncate : function( string, n, useWordBoundary ){
            if ( ! _.isString( string ) )
              return '';
            n = n || 20;
            var isTooLong = string.length > n,
                s_ = isTooLong ? string.substr(0,n-1) : string;
                s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
            return  isTooLong ? s_ + '...' : s_;
      },


      //////////////////////////////////////////////////
      /// STRINGS HELPERS
      //////////////////////////////////////////////////
      //is a module multi item ?
      //@return bool
      isMultiItemModule : function( module_type, moduleInst ) {
            if ( _.isUndefined( module_type ) && ! _.isObject( moduleInst ) )
              return;
            if ( _.isObject( moduleInst ) && _.has( moduleInst, 'module_type' ) )
              module_type = moduleInst.module_type;
            else if ( _.isUndefined( module_type ) || _.isNull( module_type ) )
              return;
            if ( ! _.has( api.czrModuleMap, module_type ) )
              return;

            return api.czrModuleMap[module_type].crud || api.czrModuleMap[module_type].multi_item || false;
      },

      //is a module crud ?
      //@return bool
      isCrudModule : function( module_type, moduleInst ) {
            if ( _.isUndefined( module_type ) && ! _.isObject( moduleInst ) )
              return;
            if ( _.isObject( moduleInst ) && _.has( moduleInst, 'module_type' ) )
              module_type = moduleInst.module_type;
            else if ( _.isUndefined( module_type ) || _.isNull( module_type ) )
              return;
            if ( ! _.has( api.czrModuleMap, module_type ) )
              return;

            return api.czrModuleMap[module_type].crud || false;
      },

      //is a module crud ?
      //@return bool
      hasModuleModOpt : function( module_type, moduleInst ) {
            if ( _.isUndefined( module_type ) && ! _.isObject( moduleInst ) )
              return;
            if ( _.isObject( moduleInst ) && _.has( moduleInst, 'module_type' ) )
              module_type = moduleInst.module_type;
            else if ( _.isUndefined( module_type ) || _.isNull( module_type ) )
              return;
            if ( ! _.has( api.czrModuleMap, module_type ) )
              return;

            return api.czrModuleMap[module_type].has_mod_opt || false;
      },



      //This method is now statically accessed by item and modopt instances because it does the same job for both.
      //=> It instantiates the inputs based on what it finds in the DOM ( item or mod opt js templates )
      //
      //Fired on 'contentRendered' for items and on user click for module options (mod opt)
      //creates the inputs based on the rendered parent item or mod option
      //inputParentInst can be an item instance or a module option instance
      setupInputCollectionFromDOM : function() {
            var inputParentInst = this;//<= because fired with .call( inputParentInst )
            if ( ! _.isFunction( inputParentInst ) ) {
                  throw new Error( 'setupInputCollectionFromDOM : inputParentInst is not valid.' );
            }
            var module = inputParentInst.module,
                is_mod_opt = _.has( inputParentInst() , 'is_mod_opt' );

            //bail if already done
            //_.has( inputParentInst, 'czr_Input')
            if ( ! _.isEmpty( inputParentInst.inputCollection() ) )
              return;

            //INPUTS => Setup as soon as the view content is rendered
            //the inputParentInst is a collection of inputs, each one has its own view module.
            inputParentInst.czr_Input = inputParentInst.czr_Input || new api.Values();

            //IS THE PARENT AN ITEM OR A MODULE OPTION ?
            //those default constructors (declared in the module init ) can be overridden by extended item or mod opt constructors inside the modules
            inputParentInst.inputConstructor = is_mod_opt ? module.inputModOptConstructor : module.inputConstructor;

            var _defaultInputParentModel = is_mod_opt ? inputParentInst.defaultModOptModel : inputParentInst.defaultItemModel;

            if ( _.isEmpty( _defaultInputParentModel ) || _.isUndefined( _defaultInputParentModel ) ) {
              throw new Error( 'No default model found in item or mod opt ' + inputParentInst.id + '.' );
            }

            //prepare and sets the inputParentInst value on api ready
            //=> triggers the module rendering + DOM LISTENERS
            var inputParentInst_model = $.extend( true, {}, inputParentInst() );

            if ( ! _.isObject( inputParentInst_model ) )
              inputParentInst_model = _defaultInputParentModel;
            else
              inputParentInst_model = $.extend( _defaultInputParentModel, inputParentInst_model );

            var dom_inputParentInst_model = {};

            //creates the inputs based on the rendered item or mod opt
            $( '.' + module.control.css_attr.sub_set_wrapper, inputParentInst.container).each( function( _index ) {
                  var _id = $(this).find('[data-type]').attr( 'data-type' ),
                      _value = _.has( inputParentInst_model, _id ) ? inputParentInst_model[ _id ] : '';

                  //skip if no valid input data-type is found in this node
                  if ( _.isUndefined( _id ) || _.isEmpty( _id ) ) {
                        api.consoleLog( 'setupInputCollectionFromDOM : missing data-type for ' + module.id );
                        return;
                  }
                  //check if this property exists in the current inputParentInst model
                  if ( ! _.has( inputParentInst_model, _id ) ) {
                        throw new Error('The item or mod opt property : ' + _id + ' has been found in the DOM but not in the item or mod opt model : '+ inputParentInst.id + '. The input can not be instantiated.');
                  }

                  //Do we have a specific set of options defined in the parent module for this inputConstructor ?
                  var _inputType      = $(this).attr( 'data-input-type' ),
                      _inputTransport = $(this).attr( 'data-transport' ) || 'inherit',//<= if no specific transport ( refresh or postMessage ) has been defined in the template, inherits the control transport
                      _inputOptions   = _.has( module.inputOptions, _inputType ) ? module.inputOptions[ _inputType ] : {};

                  //INSTANTIATE THE INPUT
                  inputParentInst.czr_Input.add( _id, new inputParentInst.inputConstructor( _id, {
                        id            : _id,
                        type          : _inputType,
                        transport     : _inputTransport,
                        input_value   : _value,
                        input_options : _inputOptions,//<= a module can define a specific set of option
                        container     : $(this),
                        input_parent  : inputParentInst,
                        is_mod_opt    : is_mod_opt,
                        module        : module
                  } ) );

                  //FIRE THE INPUT
                  //fires ready once the input Value() instance is initialized
                  inputParentInst.czr_Input( _id ).ready();

                  //POPULATES THE PARENT INPUT COLLECTION
                  dom_inputParentInst_model[ _id ] = _value;
                  //shall we trigger a specific event when the input collection from DOM has been populated ?
            });//each

            //stores the collection
            inputParentInst.inputCollection( dom_inputParentInst_model );

            //chain
            return inputParentInst;
      },

      //@self explanatory: removes a collection of input from a parent item or modOpt instance
      //Triggered by : user actions usually when an item is collapsed or when the modOpt panel is closed
      removeInputCollection : function() {
            var inputParentInst = this;//<= because fired with .call( inputParentInst )
            if ( ! _.isFunction( inputParentInst ) ) {
                  throw new Error( 'removeInputCollection : inputParentInst is not valid.' );
            }
            if ( ! _.has( inputParentInst, 'czr_Input') )
              return;
            //remove each input api.Value() instance
            inputParentInst.czr_Input.each( function( _input ) {
                  inputParentInst.czr_Input.remove( _input.id );
            });
            //reset the input collection property
            inputParentInst.inputCollection({});
      },

      //Re-instantiate a module control based on its id
      //@param wpSetId : the api id of the control to refresh
      refreshModuleControl : function( wpSetId ) {
            var _constructor = api.controlConstructor.czr_module,
                _control_type = api.control( wpSetId ).params.type,
                _control_data = api.settings.controls[wpSetId];

            //remove the container and its control
            $.when( api.control( wpSetId ).container.remove() ).done( function() {
                  //remove the control from the api control collection
                  api.control.remove( wpSetId );

                  //re-instantiate the control with the updated _control_data
                  api.control.add( wpSetId,  new _constructor( wpSetId, { params : _control_data, previewer : api.previewer }) );
            });

      },


      //COLORS
      hexToRgb : function( hex ) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            try {
                  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                      return r + r + g + g + b + b;
                  });
            } catch( er ) {
                  api.errorLog( 'Error in Helpers::hexToRgb : ' + er );
                  return hex;
            }

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
            result = result ? [
                  parseInt(result[1], 16),//r
                  parseInt(result[2], 16),//g
                  parseInt(result[3], 16)//b
            ] : [];
            return 'rgb(' + result.join(',') + ')';
      },

      rgbToHex : function ( r, g, b ) {
            var componentToHex = function(c) {
                  var hex = c.toString(16);
                  return hex.length == 1 ? "0" + hex : hex;
            };
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
      }

});//$.extend
  // $( window ).on( 'message', function( e, o) {
  //   api.consoleLog('WHAT ARE WE LISTENING TO?', e, o );
  // });
})( wp.customize , jQuery, _);
(function (api, $, _) {
api.CZR_Helpers = api.CZR_Helpers || {};
//////////////////////////////////////////////////
/// ACTIONS AND DOM LISTENERS
//////////////////////////////////////////////////
//adds action to an existing event map
//@event map = [ {event1}, {event2}, ... ]
//@new_event = {  trigger   : event name , actions   : [ 'cb1', 'cb2', ... ] }
api.CZR_Helpers = $.extend( api.CZR_Helpers, {
      addActions : function( event_map, new_events, instance ) {
              var control = this;
              instance = instance || control;
              instance[event_map] = instance[event_map] || [];
              new_event_map = _.clone( instance[event_map] );
              instance[event_map] = _.union( new_event_map, ! _.isArray(new_events) ? [new_events] : new_events );
      },

      doActions : function( action, $dom_el, obj ) {
              $dom_el.trigger( action, obj );
      },


      //@args = {model : model, dom_el : $_view_el, refreshed : _refreshed }
      setupDOMListeners : function( event_map , args, instance ) {
              var control = this,
                  _defaultArgs = {
                        model : {},
                        dom_el : {}
                  };

              instance = instance || control;
              //event_map : are we good ?
              if ( ! _.isArray( event_map ) ) {
                    api.errorLog( 'setupDomListeners : event_map should be an array', args );
                    return;
              }

              //args : are we good ?
              if ( ! _.isObject( args ) ) {
                    api.errorLog( 'setupDomListeners : args should be an object', event_map );
                    return;
              }

              args = _.extend( _defaultArgs, args );
              // => we need an existing dom element
              if ( ! args.dom_el instanceof jQuery || 1 > args.dom_el.length ) {
                    api.errorLog( 'setupDomListeners : dom element should be an existing dom element', args );
                    return;
              }

              //loop on the event map and map the relevant callbacks by event name
              // @param _event :
              //{
              //       trigger : '',
              //       selector : '',
              //       name : '',
              //       actions : ''
              // },
              _.map( event_map , function( _event ) {
                    if ( ! _.isString( _event.selector ) || _.isEmpty( _event.selector ) ) {
                          api.errorLog( 'setupDOMListeners : selector must be a string not empty. Aborting setup of action(s) : ' + _event.actions.join(',') );
                          return;
                    }

                    //Are we good ?
                    if ( ! _.isString( _event.selector ) || _.isEmpty( _event.selector ) ) {
                          api.errorLog( 'setupDOMListeners : selector must be a string not empty. Aborting setup of action(s) : ' + _event.actions.join(',') );
                          return;
                    }

                    // if ( ! _event.name && ! _.isEmpty( _event.name ) ) {
                    //     api.errorLog('in setupDOMListeners : missing name', _event );
                    // }

                    // DON'T CREATE THE SAME LISTENERS MULTIPLE TIMES
                    //Make sure that we add this listener only once to a particular dom element
                    //A listener id is a combination of event name + selector
                    //if not set, the name is a concatenation of trigger + selector
                    var _name = ( _event.name && ! _.isEmpty( _event.name ) ) ? _event.name : [ _event.trigger, _event.selector ].join('');

                    var _currentListenerCollection = args.dom_el.data( 'czr-listener-collection' );
                    if ( ! _currentListenerCollection || ! _.isArray( _currentListenerCollection ) ) {
                          _currentListenerCollection = [ _name ];
                    } else {
                          _currentListenerCollection = _.isArray( _currentListenerCollection ) ? _currentListenerCollection : [];
                          if ( ! _.contains( _currentListenerCollection, _name ) ) {
                                _currentListenerCollection.push( _name );
                          } else {
                                // api.errorLog('Dom listener already created for event : ', _name );
                                return;
                          }

                    }
                    // add this listener to the collection
                    args.dom_el.data( 'czr-listener-collection' , _currentListenerCollection );

                    //LISTEN TO THE DOM => USES EVENT DELEGATION
                    args.dom_el.on( _event.trigger , _event.selector, function( e, event_params ) {
                          //stop propagation to ancestors modules, typically a sektion
                          e.stopPropagation();
                          //particular treatment
                          if ( api.utils.isKeydownButNotEnterEvent( e ) ) {
                            return;
                          }
                          e.preventDefault(); // Keep this AFTER the key filter above

                          //It is important to deconnect the original object from its source
                          //=> because we will extend it when used as params for the action chain execution
                          var actionsParams = $.extend( true, {}, args );

                          //always get the latest model from the collection
                          if ( _.has( actionsParams, 'model') && _.has( actionsParams.model, 'id') ) {
                                if ( _.has( instance, 'get' ) )
                                  actionsParams.model = instance();
                                else
                                  actionsParams.model = instance.getModel( actionsParams.model.id );
                          }

                          //always add the event obj to the passed args
                          //+ the dom event
                          $.extend( actionsParams, { event : _event, dom_event : e } );

                          //add the event param => useful for triggered event
                          $.extend( actionsParams, event_params );

                          //SETUP THE EMITTERS
                          //inform the container that something has happened
                          //pass the model and the current dom_el
                          //the model is always passed as parameter
                          if ( ! _.has( actionsParams, 'event' ) || ! _.has( actionsParams.event, 'actions' ) ) {
                                api.errorLog( 'executeEventActionChain : missing obj.event or obj.event.actions' );
                                return;
                          }
                          if ( serverControlParams.isDevMode ) {
                              control.executeEventActionChain( actionsParams, instance )
                          } else {
                              try { control.executeEventActionChain( actionsParams, instance ); } catch( er ) {
                                    api.errorLog( 'In setupDOMListeners : problem when trying to fire actions : ' + actionsParams.event.actions );
                                    api.errorLog( 'Error : ' + er );
                              }
                        }
                    });//.on()
              });//_.map()
      },//setupDomListeners



      //GENERIC METHOD TO SETUP EVENT LISTENER
      //NOTE : the args.event must alway be defined
      //Example of args :
      //  {
      //       trigger   : 'click keydown',
      //       selector  : [ '.' + module.control.css_attr.open_pre_add_btn, '.' + module.control.css_attr.cancel_pre_add_btn ].join(','),
      //       name      : 'pre_add_item',
      //       actions   : [
      //             'closeAllItems',
      //             'closeRemoveDialogs',
      //             function(obj) {
      //                   var module = this;
      //                   module.preItemExpanded.set( ! module.preItemExpanded() );
      //             },
      //       ],
      // },
      executeEventActionChain : function( args, instance ) {
              var control = this;

              //if the actions param is not an array but is an anonymous function, fire it and stop there
              if ( 'function' === typeof( args.event.actions ) )
                return args.event.actions.call( instance, args );

              //execute the various actions required
              //first normalizes the provided actions into an array of callback methods
              //then loop on the array and fire each cb if exists
              if ( ! _.isArray( args.event.actions ) )
                args.event.actions = [ args.event.actions ];

              //if one of the callbacks returns false, then we break the loop
              //=> allows us to stop a chain of callbacks if a condition is not met
              var _break = false;
              _.map( args.event.actions, function( _cb ) {
                    if ( _break )
                      return;

                    var _cbCandidate = function() {};

                    // is the _cb an anonymous function ?
                    // if not, we expect the method to exist in the provided object instance
                    if ( 'function' === typeof( _cb ) ) {
                          _cbCandidate = _cb;
                    } else {
                          if ( 'function' != typeof( instance[ _cb ] ) ) {
                                throw new Error( 'executeEventActionChain : the action : ' + _cb + ' has not been found when firing event : ' + args.event.selector );
                          } else {
                                _cbCandidate = instance[ _cb ];
                          }
                    }

                    // Allow other actions to be bound before action and after
                    //
                    // => we don't want the event in the object here => we use the one in the event map if set
                    // => otherwise will loop infinitely because triggering always the same cb from args.event.actions[_cb]
                    // => the dom element shall be get from the passed args and fall back to the controler container.
                    var $_dom_el = ( _.has(args, 'dom_el') && -1 != args.dom_el.length ) ? args.dom_el : control.container;

                    if ( 'string' === typeof( _cb ) ) {
                          $_dom_el.trigger( 'before_' + _cb, _.omit( args, 'event' ) );
                    }

                    //executes the _cb and stores the result in a local var
                    var _cb_return = _cbCandidate.call( instance, args );
                    //shall we stop the action chain here ?
                    if ( false === _cb_return )
                      _break = true;

                    if ( 'string' === typeof( _cb ) ) {
                          //allow other actions to be bound after
                          $_dom_el.trigger( 'after_' + _cb, _.omit( args, 'event' ) );
                    }
              });//_.map
      }
});//$.extend
})( wp.customize , jQuery, _);
(function (api, $, _) {
  //This promise will let us know when we have the first set of preview query ready to use
  //This is needed for modules contextually dependant
  //For example, the slider module will initialize the module model based on the contextual informations, if no items have been set yet.

  api.czr_wpQueryDataReady = $.Deferred();
  api.czr_wpQueryInfos = api.czr_wpQueryInfos || new api.Value();
  api.czr_partials = api.czr_partials || new api.Value();
  /*****************************************************************************
  * CAPTURE PREVIEW INFORMATIONS ON REFRESH + REACT TO THEM
  *****************************************************************************/
  //Data are sent by the preview frame when the panel has sent the 'sync' or even better 'active' event
  api.bind( 'ready', function() {
        //observe widget settings changes
        api.previewer.bind('houston-widget-settings', function(data) {
              //get the difference
              var _candidates = _.filter( data.registeredSidebars, function( sb ) {
                return ! _.findWhere( _wpCustomizeWidgetsSettings.registeredSidebars, { id: sb.id } );
              });

              var _inactives = _.filter( data.registeredSidebars, function( sb ) {
                return ! _.has( data.renderedSidebars, sb.id );
              });

              _inactives = _.map( _inactives, function(obj) {
                return obj.id;
              });

              var _registered = _.map( data.registeredSidebars, function(obj) {
                return obj.id;
              });

              //stores and update the widget zone settings
              api.czr_widgetZoneSettings = api.czr_widgetZoneSettings || new api.Value();//will store all widget zones data sent by preview as an observable object
              api.czr_widgetZoneSettings.set( {
                    actives :  data.renderedSidebars,
                    inactives :  _inactives,
                    registered :  _registered,
                    candidates :  _candidates,
                    available_locations :  data.availableWidgetLocations//built server side
              } );

        });

        /* WP CONDITIONAL TAGS => stores and observes the WP conditional tags sent by the preview */
        api.previewer.bind( 'czr-query-data-ready', function( data ) {
              api.czr_wpQueryInfos( data );
              if ( 'pending' == api.czr_wpQueryDataReady.state() ) {
                    api.czr_wpQueryDataReady.resolve( data );
              }
        });

        //PARTIAL REFRESHS => stores and observes the partials data sent by the preview
        api.previewer.bind( 'czr-partial-refresh-data', function( data ) {
              api.czr_partials.set( data );
        });

        //PARTIAL REFRESHS : React on partial refresh done
        // @data : { set_id : api setting id }
        api.previewer.bind( 'czr-partial-refresh-done', function( data ) {
              if ( ! _.has( data, 'set_id' ) )
                return;
              var setId = api.CZR_Helpers.build_setId( data.set_id );
              if ( ! api.has( setId ) )
                return;
              //inform the control
              var ctrlId = api.CZR_Helpers.getControlSettingId( setId );
              if ( ! api.control.has( ctrlId ) )
                return;
              api.control( ctrlId ).trigger( 'czr-partial-refresh-done' );
        });
  });//api.bind('ready')
})( wp.customize , jQuery, _ );var CZRInputMths = CZRInputMths || {};

//extends api.Value
//an input is instanciated with the typical set of options :
// container : $(this),
// id : _id,
// input_options : {} <= a set of options that are used when setting up the input type
// input_parent : {} can be an item instance or a modOpt instance (Value instance, has a parent module)
// input_value : $(this).find('[data-type]').val(),
// module : module,
// transport : inherit or specified in the template with data-transport="postMessage" or "refresh".
// type : $(this).attr('data-input-type'),
// is_mod_opt : bool,
// is_preItemInput : bool
( function ( api, $, _ ) {
$.extend( CZRInputMths , {
    initialize: function( name, options ) {
          if ( _.isUndefined( options.input_parent ) || _.isEmpty(options.input_parent) ) {
            throw new Error('No input_parent assigned to input ' + options.id + '. Aborting');
          }
          if ( _.isUndefined(options.module ) ) {
            throw new Error('No module assigned to input ' + options.id + '. Aborting');
          }

          api.Value.prototype.initialize.call( this, null, options );

          var input = this;
          //input.options = options;
          //write the options as properties, name is included
          $.extend( input, options || {} );

          //DEFERRED STATES
          //store the state of ready.
          input.isReady = $.Deferred();

          //initialize to the provided value if any
          if ( ! _.isUndefined(options.input_value) ) {
                input.set( options.input_value );
          }

          //Try to find a match with the provided constructor type
          //=> fire the relevant callback with the provided input_options
          //input.type_map is declared in extend_api_base
          if ( api.czrInputMap && _.has( api.czrInputMap, input.type ) ) {
                var _meth = api.czrInputMap[ input.type ];
                if ( _.isFunction( input[_meth]) ) {
                      input[_meth]( options.input_options || null );
                }
          } else {
                api.consoleLog('Warning an input : ' + input.id + ' has no corresponding method defined in api.czrInputMap.');
          }

          var trigger_map = {
                text : 'keyup',
                textarea : 'keyup',
                password : 'keyup',
                color : 'colorpickerchange',
                range : 'input propertychange'
          };

          //Input Event Map
          input.input_event_map = [
                  //set input value
                  {
                    trigger   : $.trim( ['change', trigger_map[input.type] || '' ].join(' ') ),//was 'propertychange change click keyup input',//colorpickerchange is a custom colorpicker event @see method setupColorPicker => otherwise we don't
                    selector  : 'input[data-type], select[data-type], textarea[data-type]',
                    name      : 'set_input_value',
                    actions   : function( obj ) {
                        if ( ! _.has( input.input_parent, 'syncElements') || ! _.has( input.input_parent.syncElements, input.id ) ) {
                            throw new Error('WARNING : THE INPUT ' + input.id + ' HAS NO SYNCED ELEMENT.');
                        }
                    }//was 'updateInput'
                  }
          ];

          //Visibility
          input.visible = new api.Value( true );
          input.isReady.done( function() {
                input.visible.bind( function( visible ) {
                      if ( visible )
                        input.container.stop( true, true ).slideDown( 200 );
                      else
                        input.container.stop( true, true ).slideUp( 200 );
                });
          });

          //Visibility
          input.enabled = new api.Value( true );
          input.isReady.done( function() {
                input.enabled.bind( function( enabled ) {
                      input.container.toggleClass( 'disabled', ! enabled );
                });
          });

    },


    //this method is not fired automatically
    //It has to be invoked once the input has been instanciated.
    ready : function() {
            var input = this;
            input.setupDOMListeners( input.input_event_map , { dom_el : input.container }, input );
            //Setup individual input listener
            input.callbacks.add( function() { return input.inputReact.apply( input, arguments ); } );
            //synchronizer setup
            //the input instance must be initialized. => initialize method has been done.
            $.when( input.setupSynchronizer() ).done( function() {
                  input.isReady.resolve( input );
            } );

    },


    //fired when input is intanciated and ready.
    //=> we must have an input instance to synchronize,
    //invoking this method in the initialize() method is too early, instance not ready
    setupSynchronizer: function() {
          var input       = this,
              input_parent        = input.input_parent,
              $_input_el  = input.container.find('[data-type]'),
              is_textarea = input.container.find('[data-type]').is('textarea');

          //@hack => todo
          //for text area inputs, the synchronizer is buggy
          if ( is_textarea ) {
            throw new Error('TO DO : THE TEXTAREA INPUT ARE NOT READY IN THE SYNCHRONIZER!');
          }

          var syncElement = new api.Element( $_input_el );
          input_parent.syncElements = input_parent.syncElements || {};
          input_parent.syncElements[input.id] = syncElement;//adds the input syncElement to the collection
          syncElement.sync( input );//sync with the input instance
          syncElement.set( input() );
    },



    //@return void()
    //react to a single input change
    //update the collection of input
    //cb of input.callbacks.add
    inputReact : function( to, from, data ) {
          var input = this,
              _current_input_parent = input.input_parent(),
              _new_model        = _.clone( _current_input_parent ),//initialize it to the current value
              _isPreItemInput = input.is_preItemInput;

          //is this input currently enabled ?
          if ( ! input.enabled() )
            return;

          //make sure the _new_model is an object and is not empty
          _new_model =  ( ! _.isObject(_new_model) || _.isEmpty(_new_model) ) ? {} : _new_model;
          //set the new val to the changed property
          _new_model[ input.id ] = to;

          //inform the input_parent : item or modOpt
          input.input_parent.set( _new_model, {
                input_changed     : input.id,
                input_transport   : input.transport,
                not_preview_sent  : 'postMessage' === input.transport//<= this parameter set to true will prevent the setting to be sent to the preview ( @see api.Setting.prototype.preview override ). This is useful to decide if a specific input should refresh or not the preview.
          } );

          //Trigger and send specific events when changing a published input item
          if ( ! _isPreItemInput ) {
                //inform the input_parent that an input has changed
                //=> useful to handle dependant reactions between different inputs
                input.input_parent.trigger( input.id + ':changed', to );

                //Each input instantiated in an item or a modOpt can have a specific transport set.
                //the input transport is hard coded in the module js template, with the attribute : data-transport="postMessage" or "refresh"
                //=> this is optional, if not set, then the transport will be inherited from the one of the module, which is inherited from the control.
                //send input to the preview. On update only, not on creation.
                if ( ! _.isEmpty( from ) || ! _.isUndefined( from ) && 'postMessage' === input.transport ) {
                      input.module.sendInputToPreview( {
                            input_id        : input.id,
                            input_parent_id : input.input_parent.id,
                            to              : to,
                            from            : from
                      } );
                }
          }
    },


    /*-----------------------------------------
    SOME DEFAULT CALLBACKS
    ------------------------------------------*/
    setupColorPicker : function() {
        var input  = this;

        input.container.find('input').iris( {
            palettes: true,
            hide:false,
            change : function( e, o ) {
                  //if the input val is not updated here, it's not detected right away.
                  //weird
                  //is there a "change complete" kind of event for iris ?
                  //$(this).val($(this).wpColorPicker('color'));
                  //input.container.find('[data-type]').trigger('colorpickerchange');

                  //synchronizes with the original input
                  //OLD => $(this).val( $(this).wpColorPicker('color') ).trigger('colorpickerchange').trigger('change');
                  $(this).val( o.color.toString() ).trigger('colorpickerchange').trigger('change');
            }
        });
    },

    setupSelect : function() {
        var input = this;
        $('select', input.container ).not('.no-selecter-js')
              .each( function() {
                    $(this).selecter({
                    //triggers a change event on the view, passing the newly selected value + index as parameters.
                    // callback : function(value, index) {
                    //   self.triggerSettingChange( window.event || {} , value, index); // first param is a null event.
                    // }
                    });
        });
    },

    setupIcheck : function( obj ) {
            var input      = this;

            $( 'input[type=checkbox]', input.container ).each( function(e) {
                  if ( 0 !== $(this).closest('div[class^="icheckbox"]').length )
                    return;

                  $(this).iCheck({
                        checkboxClass: 'icheckbox_flat-grey',
                        checkedClass: 'checked',
                        radioClass: 'iradio_flat-grey',
                  })
                  .on( 'ifChanged', function(e){
                        $(this).val( false === $(this).is(':checked') ? 0 : 1 );
                        $(e.currentTarget).trigger('change');
                  });
            });
    },

    setupStepper : function( obj ) {
          var input      = this;
          $('input[type="number"]',input.container ).each( function( e ) {
                $(this).stepper();
          });
    },

    //@use rangeslider https://github.com/andreruffert/rangeslider.js
    setupRangeSlider : function( options ) {
              var input = this,
                  $handle,
                  _updateHandle = function(el, val) {
                        el.textContent = val + "%";
                  };

              $( input.container ).find('input').rangeslider( {
                    // Feature detection the default is `true`.
                    // Set this to `false` if you want to use
                    // the polyfill also in Browsers which support
                    // the native <input type="range"> element.
                    polyfill: false,

                    // Default CSS classes
                    rangeClass: 'rangeslider',
                    disabledClass: 'rangeslider--disabled',
                    horizontalClass: 'rangeslider--horizontal',
                    verticalClass: 'rangeslider--vertical',
                    fillClass: 'rangeslider__fill',
                    handleClass: 'rangeslider__handle',

                    // Callback function
                    onInit: function() {
                          $handle = $('.rangeslider__handle', this.$range);
                          $('.rangeslider__handle', this.$range);
                          _updateHandle( $handle[0], this.value );
                    },
                    // Callback function
                    //onSlide: function(position, value) {},
                    // Callback function
                    //onSlideEnd: function(position, value) {}
              } ).on('input', function() {
                    _updateHandle( $handle[0], this.value );
              });
        }
});//$.extend
})( wp.customize , jQuery, _ );var CZRInputMths = CZRInputMths || {};
( function ( api, $, _ ) {
$.extend( CZRInputMths , {
    setupImageUploader : function() {
          var input        = this,
              _model       = input();

          //an instance field where we'll store the current attachment
          input.attachment   = {};

          //do we have an html template and a input container?
          if ( ! input.container )
            return this;

          this.tmplRendered = $.Deferred();
          this.setupContentRendering( _model, {} );

          //valid just in the init
          this.tmplRendered.done( function(){
            input.czrImgUploaderBinding();
          });
  },

  setupContentRendering : function( to, from) {
        var input = this, _attachment;
        //retrieve new image if 'to' is different from the saved one
        //NEED A BETTER WAY?
        if ( ( input.attachment.id != to ) && from !== to ) {
              if ( ! to ) {
                    input.attachment = {};
                    input.renderImageUploaderTemplate();
              }
              //Has this image already been fetched ?
              _attachment = wp.media.attachment( to );
              if ( _.isObject( _attachment ) && _.has( _attachment, 'attributes' ) && _.has( _attachment.attributes, 'sizes' ) ) {
                    input.attachment       = _attachment.attributes;
                    input.renderImageUploaderTemplate();
              } else {
                    wp.media.attachment( to ).fetch().done( function() {
                          input.attachment       = this.attributes;
                          input.renderImageUploaderTemplate();
                    });
              }
        }//Standard reaction, the image has been updated by the user or init
        else if (  ! input.attachment.id || input.attachment.id === to ) {
              input.renderImageUploaderTemplate();
        }
  },

  czrImgUploaderBinding : function() {
        var input = this;
        //Bind events
        // Shortcut so that we don't have to use _.bind every time we add a callback.
        _.bindAll( input, 'czrImgUploadRemoveFile', 'czrImgUploadOpenFrame', 'czrImgUploadSelect');

        // Bind events, with delegation to facilitate re-rendering.
        input.container.on( 'click keydown', '.upload-button', input.czrImgUploadOpenFrame );
        input.container.on( 'click keydown', '.thumbnail-image img', input.czrImgUploadOpenFrame );
        input.container.on( 'click keydown', '.remove-button', input.czrImgUploadRemoveFile );

        input.bind( input.id + ':changed', function( to, from ){
              input.tmplRendered = $.Deferred();
              input.setupContentRendering(to,from);
        });
  },
  /**
  * Open the media modal.
  */
  czrImgUploadOpenFrame: function( event ) {
        if ( api.utils.isKeydownButNotEnterEvent( event ) ) {
          return;
        }

        event.preventDefault();

        if ( ! this.frame ) {
          this.czrImgUploadInitFrame();
        }

        this.frame.open();
  },

  /**
  * Create a media modal select frame, and store it so the instance can be reused when needed.
  */
  czrImgUploadInitFrame: function() {
        var input = this,
            button_labels = this.getUploaderLabels();

        input.frame = wp.media({
                button: {
                      text: button_labels.frame_button
                },
                states: [
                       new wp.media.controller.Library({
                              title:     button_labels.frame_title,
                              library:   wp.media.query({ type: 'image' }),
                              multiple:  false,
                              date:      false
                       })
                ]
        });
        // When a file is selected, run a callback.
        input.frame.on( 'select', input.czrImgUploadSelect );
  },

  /**
  * Called when the "Remove" link is clicked. Empties the setting.
  *
  * @param {object} event jQuery Event object
  */
  czrImgUploadRemoveFile: function( event ) {
        var input = this;

        if ( api.utils.isKeydownButNotEnterEvent( event ) ) {
          return;
        }
        event.preventDefault();
        //reset the attachment class field
        input.attachment = {};
        //set the model
        input.set('');
  },


  /**
  * Callback handler for when an attachment is selected in the media modal.
  * Gets the selected image information, and sets it within the input.
  */
  czrImgUploadSelect: function() {
        var node,
            input = this,
            attachment   = input.frame.state().get( 'selection' ).first().toJSON(),  // Get the attachment from the modal frame.
            mejsSettings = window._wpmejsSettings || {};
        //save the attachment in a class field
        input.attachment = attachment;
        //set the model
        input.set(attachment.id);
  },




  //////////////////////////////////////////////////
  /// HELPERS
  //////////////////////////////////////////////////
  renderImageUploaderTemplate: function() {
        var input  = this;

        //do we have view template script?
        if ( 0 === $( '#tmpl-czr-input-img-uploader-view-content' ).length )
          return;

        var view_template = wp.template('czr-input-img-uploader-view-content');

        //  //do we have an html template and a module container?
        if ( ! view_template  || ! input.container )
         return;

        var $_view_el    = input.container.find('.' + input.module.control.css_attr.img_upload_container );

        if ( ! $_view_el.length )
          return;

        var _template_params = {
          button_labels : input.getUploaderLabels(),
          settings      : input.id,
          attachment    : input.attachment,
          canUpload     : true
        };

        $_view_el.html( view_template( _template_params) );

        input.tmplRendered.resolve();
        input.container.trigger( input.id + ':content_rendered' );

        return true;
  },

  getUploaderLabels : function() {
        var _ts = serverControlParams.i18n,
            _map = {
            'select'      : _ts.select_image,
            'change'      : _ts.change_image,
            'remove'      : _ts.remove_image,
            'default'     : _ts.default_image,
            'placeholder' : _ts.placeholder_image,
            'frame_title' : _ts.frame_title_image,
            'frame_button': _ts.frame_button_image
        };

        //are we fine ?
        _.each( _map, function( ts_string, key ) {
              if ( _.isUndefined( ts_string ) ) {
                    var input = this;
                    api.errorLog( 'A translated string is missing ( ' + key + ' ) for the image uploader input in module : ' + input.module.id );
                    return '';
              }
        });

        return _map;
  }
});//$.extend
})( wp.customize , jQuery, _ );/* Fix caching, select2 default one seems to not correctly work, or it doesn't what I think it should */
// the content_picker options are set in the module with :
// $.extend( module.inputOptions, {
//       'content_picker' : {
//             post : '',//<= all post types
//             taxonomy : ''//<= all taxonomy types
//       }
// });
// To narrow down the post or taxonomy types, the option can be set this way :
// $.extend( module.inputOptions, {
//       'content_picker' : {
//             post : [ 'page', 'cpt1', ...]
//             taxonomy : [ 'category', 'tag', 'Custom_Tax_1', ... ]
//       }
// });
// To disable all posts or taxonomy, use '_none_'
// $.extend( module.inputOptions, {
//       'content_picker' : {
//             post : [ 'page', 'cpt1', ...]
//             taxonomy : '_none_' //<= won't load or search in taxonomies when requesting wp in ajax
//       }
// });
//
// input is an object structured this way
// {
//  id:"2838"
//  object_type:"post"
//  title:"The Importance of Water and Drinking Lots Of It"
//  type_label:"Post"
//  url:"http://customizr-dev.dev/?p=2838"
// }
var CZRInputMths = CZRInputMths || {};
( function ( api, $, _ ) {
$.extend( CZRInputMths , {
      setupContentPicker: function( wpObjectTypes ) {
              var input  = this,
              _event_map = [];

              /* Dummy for the prototype purpose */
              //input.object = ['post']; //this.control.params.object_types  - array('page', 'post')
              $.extend( {
                    post : '',
                    taxonomy : ''
              }, _.isObject( wpObjectTypes ) ? wpObjectTypes : {} );

              input.wpObjectTypes = wpObjectTypes;

              /* Methodize this or use a template */
              input.container.find('.czr-input').append('<select data-select-type="content-picker-select" class="js-example-basic-simple"></select>');

              //binding
              _event_map = [
                    //set input value
                    {
                          trigger   : 'change',
                          selector  : 'select[data-select-type]',
                          name      : 'set_input_value',
                          actions   : function( obj ){
                                var $_changed_input   = $( obj.dom_event.currentTarget, obj.dom_el ),
                                    _raw_val          = $( $_changed_input, obj.dom_el ).select2( 'data' ),
                                    _val_candidate    = {},
                                    _default          = {
                                          id          : '',
                                          type_label  : '',
                                          title       : '',
                                          object_type : '',
                                          url         : ''
                                    };

                                _raw_val = _.isArray( _raw_val ) ? _raw_val[0] : _raw_val;
                                if ( ! _.isObject( _raw_val ) || _.isEmpty( _raw_val ) ) {
                                    api.errorLog( 'Content Picker Input : the picked value should be an object not empty.');
                                    return;
                                }

                                //normalize and purge useless select2 fields
                                //=> skip a possible _custom_ id, used for example in the slider module to set a custom url
                                _.each( _default, function( val, k ){
                                      if ( '_custom_' !== _raw_val.id ) {
                                            if ( ! _.has( _raw_val, k ) || _.isEmpty( _raw_val[ k ] ) ) {
                                                  api.errorLog( 'content_picker : missing input param : ' + k );
                                                  return;
                                            }
                                      }
                                      _val_candidate[ k ] = _raw_val[ k ];
                                } );
                                //set the value now
                                input.set( _val_candidate );
                          }
                    }
              ];

              input.setupDOMListeners( _event_map , { dom_el : input.container }, input );
              //setup when ready.
              input.isReady.done( function() {
                    input.setupContentSelecter();
              });

      },


      // input is an object structured this way
      // {
      //  id:"2838"
      //  object_type:"post"
      //  title:"The Importance of Water and Drinking Lots Of It"
      //  type_label:"Post"
      //  url:"http://customizr-dev.dev/?p=2838"
      // }
      setupContentSelecter : function() {
              var input = this;
              //set the previously selected value
              if ( ! _.isEmpty( input() ) ) {
                    var _attributes = {
                          value : input().id || '',
                          title : input().title || '',
                          selected : "selected"
                    };
                    //input.container.find('select')
                    input.container.find('select').append( $( '<option>', _attributes ) );
              }

              input.container.find( 'select' ).select2( {
                    placeholder: {
                          id: '-1', // the value of the option
                          title: 'Select'
                    },
                    data : input.setupSelectedContents(),
                    //  allowClear: true,
                    ajax: {
                          url: serverControlParams.AjaxUrl,
                          type: 'POST',
                          dataType: 'json',
                          delay: 250,
                          debug: true,
                          data: function ( params ) {
                                //for some reason I'm not getting at the moment the params.page returned when searching is different
                                var page = params.page ? params.page : 0;
                                page = params.term ? params.page : page;
                                return {
                                      action          : params.term ? "search-available-content-items-customizer" : "load-available-content-items-customizer",
                                      search          : params.term,
                                      wp_customize    : 'on',
                                      page            : page,
                                      wp_object_types : JSON.stringify( input.wpObjectTypes ),
                                      CZRCpNonce      : serverControlParams.CZRCpNonce
                                };
                          },
                          /* transport: function (params, success, failure) {
                            var $request = $.ajax(params);

                            $request.then(success);
                            $request.fail(failure);

                            return $request;
                          },*/
                          processResults: function ( data, params ) {
                                //let us remotely set a default option like custom link when initializing the content picker input.
                                input.defaultContentPickerOption = input.defaultContentPickerOption || [];

                                if ( ! data.success )
                                  return { results: input.defaultContentPickerOption };


                                var items   = data.data.items,
                                    _results = [];

                                _.each( items, function( item ) {
                                      _results.push({
                                            id          : item.id,
                                            title       : item.title,
                                            type_label  : item.type_label,
                                            object_type : item.object,
                                            url         : item.url
                                      });
                                });
                                return {
                                      results: _results,
                                      //The pagination param will trigger the infinite load
                                      pagination: { more: data.data.items.length >= 10 }//<= the pagination boolean param can be tricky => here set to >= 10 because we query 10 + add a custom link item on the first query
                                };
                          },
                    },//ajax
                    templateSelection: input.czrFormatContentSelected,
                    templateResult: input.czrFormatContentSelected,
                    escapeMarkup: function ( markup ) { return markup; },
             });//select2 setup
      },

      // item is structured this way :
      // {
      // id          : item.id,
      // title       : item.title,
      // type_label  : item.type_label,
      // object_type : item.object,
      // url         : item.url
      // }
      czrFormatContentSelected: function ( item ) {
              if ( item.loading ) return item.text;
              var markup = "<div class='content-picker-item clearfix'>" +
                "<div class='content-item-bar'>" +
                  "<span class='czr-picker-item-title'>" + item.title + "</span>";

              if ( item.type_label ) {
                markup += "<span class='czr-picker-item-type'>" + item.type_label + "</span>";
              }

              markup += "</div></div>";

              return markup;
      },

      setupSelectedContents : function() {
            var input = this,
               _model = input();

            return _model;
      }
});//$.extend
})( wp.customize , jQuery, _ );var CZRInputMths = CZRInputMths || {};
( function ( api, $, _ ) {
$.extend( CZRInputMths , {
      setupTextEditor : function() {
            var input        = this,
                _model       = input();

            //do we have an html template and a input container?
            if ( ! input.container ) {
                throw new Error( 'The input container is not set for WP text editor in module.' + input.module.id );
            }

            if ( ! input.czrRenderInputTextEditorTemplate() )
              return;

            input.editor       = tinyMCE( 'czr-customize-content_editor' );
            input.textarea     = $( '#czr-customize-content_editor' );
            input.editorPane   = $( '#czr-customize-content_editor-pane' );
            input.dragbar      = $( '#czr-customize-content_editor-dragbar' );
            input.editorFrame  = $( '#czr-customize-content_editor_ifr' );
            input.mceTools     = $( '#wp-czr-customize-content_editor-tools' );
            input.mceToolbar   = input.editorPane.find( '.mce-toolbar-grp' );
            input.mceStatusbar = input.editorPane.find( '.mce-statusbar' );

            input.preview      = $( '#customize-preview' );
            input.collapse     = $( '.collapse-sidebar' );

            input.textpreview  = input.container.find('textarea');
            input.toggleButton = input.container.find('button.text_editor-button');

            //status
            input.editorExpanded   = new api.Value( false );


            //initial filling of the textpreview and button text
            input.czrUpdateTextPreview();
            input.czrSetToggleButtonText( input.editorExpanded() );

            input.czrTextEditorBinding();

            input.czrResizeEditorOnUserRequest();
      },

      czrTextEditorBinding : function() {
              var input = this,
                  editor = input.editor,
                  textarea = input.textarea,
                  toggleButton = input.toggleButton,
                  editorExpanded = input.editorExpanded,
                  editorPane   = input.editorPane;


              input.bind( input.id + ':changed', input.czrUpdateTextPreview );

              _.bindAll( input, 'czrOnVisualEditorChange', 'czrOnTextEditorChange', 'czrResizeEditorOnWindowResize' );

              toggleButton.on( 'click', function() {
                    input.editorExpanded.set( ! input.editorExpanded() );
                    if ( input.editorExpanded() ) {
                      editor.focus();
                    }
              });

              //on this module section close close the editor and unbind this input
              input.module.czr_ModuleState.bind(
                function( state ) {
                  if ( 'expanded' != state )
                    input.editorExpanded.set( false );
              });

              input.editorExpanded.bind( function (expanded) {

                    api.consoleLog('in input.editorExpanded', expanded, input() );
                    /*
                    * Ensure only the latest input is bound
                    */
                    if ( editor.locker && editor.locker !== input ) {
                        editor.locker.editorExpanded.set(false);
                        editor.locker = null;
                    }if ( ! editor.locker || editor.locker === input ) {
                        $(document.body).toggleClass('czr-customize-content_editor-pane-open', expanded);
                        editor.locker = input;
                    }

                    //set toggle button text
                    input.czrSetToggleButtonText( expanded );

                    if ( expanded ) {
                        editor.setContent( wp.editor.autop( input() ) );
                        editor.on( 'input change keyup', input.czrOnVisualEditorChange );
                        textarea.on( 'input', input.czrOnTextEditorChange );
                        input.czrResizeEditor( window.innerHeight - editorPane.height() );
                        $( window ).on('resize', input.czrResizeEditorOnWindowResize );

                    } else {
                        editor.off( 'input change keyup', input.czrOnVisualEditorChange );
                        textarea.off( 'input', input.czrOnTextEditorChange );
                        $( window ).off('resize', input.czrResizeEditorOnWindowResize );

                        //resize reset
                        input.czrResizeReset();
                    }
              } );
      },

      czrOnVisualEditorChange : function() {
              var input = this,
                  editor = input.editor,
                  value;

              value = wp.editor.removep( editor.getContent() );
              input.set(value);
      },

      czrOnTextEditorChange : function() {
              var input = this,
                  textarea = input.textarea,
                  value;

              value = textarea.val();
              input.set(value);
      },
      czrUpdateTextPreview: function() {
              var input   = this,
                  input_model = input(),
                  value;

              //TODO: better stripping
              value = input_model.replace(/(<([^>]+)>)/ig,"");
              //max 30 chars
              if ( value.length > 30 )
                value = value.substring(0, 34) + '...';

              input.textpreview.val( value );
      },
      //////////////////////////////////////////////////
      /// HELPERS
      //////////////////////////////////////////////////
      czrRenderInputTextEditorTemplate: function() {
              var input  = this;

              //do we have view template script?
              if ( 0 === $( '#tmpl-czr-input-text_editor-view-content' ).length ) {
                  throw new Error('Missing js template for text editor input in module : ' + input.module.id );
              }

              var view_template = wp.template('czr-input-text_editor-view-content'),
                      $_view_el = input.container.find('input');

              //  //do we have an html template and a module container?
              if ( ! view_template  || ! input.container )
                return;

              api.consoleLog('Model injected in text editor tmpl : ', input() );

              $_view_el.after( view_template( input() ) );

              return true;
      },
      czrIsEditorExpanded : function() {
              return $( document.body ).hasClass('czr-customize-content_editor-pane-open');
      },
      czrResizeReset  : function() {
              var input = this,
                  preview = input.preview,
                  collapse = input.collapse,
                  sectionContent = input.container.closest('ul.accordion-section-content');

              sectionContent.css( 'padding-bottom', '' );
              preview.css( 'bottom', '' );
              collapse.css( 'bottom', '' );
      },
      czrResizeEditor : function( position ) {
              var windowHeight = window.innerHeight,
                  windowWidth = window.innerWidth,
                  minScroll = 40,
                  maxScroll = 1,
                  mobileWidth = 782,
                  collapseMinSpacing = 56,
                  collapseBottomOutsideEditor = 8,
                  collapseBottomInsideEditor = 4,
                  args = {},
                  input = this,
                  sectionContent = input.container.closest('ul.accordion-section-content'),
                  mceTools = input.mceTools,
                  mceToolbar = input.mceToolbar,
                  mceStatusbar = input.mceStatusbar,
                  preview      = input.preview,
                  collapse     = input.collapse,
                  editorPane   = input.editorPane,
                  editorFrame  = input.editorFrame;

              if ( ! input.editorExpanded() ) {
                return;
              }

              if ( ! _.isNaN( position ) ) {
                resizeHeight = windowHeight - position;
              }

              args.height = resizeHeight;
              args.components = mceTools.outerHeight() + mceToolbar.outerHeight() + mceStatusbar.outerHeight();

              if ( resizeHeight < minScroll ) {
                args.height = minScroll;
              }

              if ( resizeHeight > windowHeight - maxScroll ) {
                args.height = windowHeight - maxScroll;
              }

              if ( windowHeight < editorPane.outerHeight() ) {
                args.height = windowHeight;
              }

              preview.css( 'bottom', args.height );
              editorPane.css( 'height', args.height );
              editorFrame.css( 'height', args.height - args.components );
              collapse.css( 'bottom', args.height + collapseBottomOutsideEditor );

              if ( collapseMinSpacing > windowHeight - args.height ) {
                collapse.css( 'bottom', mceStatusbar.outerHeight() + collapseBottomInsideEditor );
              }

              if ( windowWidth <= mobileWidth ) {
                sectionContent.css( 'padding-bottom', args.height );
              } else {
                sectionContent.css( 'padding-bottom', '' );
              }
      },
      czrResizeEditorOnWindowResize : function() {
              var input = this,
                  resizeDelay = 50,
                  editorPane   = input.editorPane;

              if ( ! input.editorExpanded() ) {
                return;
              }

              _.delay( function() {
                input.czrResizeEditor( window.innerHeight - editorPane.height() );
              }, resizeDelay );

      },
      czrResizeEditorOnUserRequest : function() {
              var input = this,
                  dragbar = input.dragbar,
                  editorFrame = input.editorFrame;

              dragbar.on( 'mousedown', function() {
                if ( ! input.editorExpanded() )
                  return;

                $( document ).on( 'mousemove.czr-customize-content_editor', function( event ) {
                    event.preventDefault();
                    $( document.body ).addClass( 'czr-customize-content_editor-pane-resize' );
                    editorFrame.css( 'pointer-events', 'none' );
                    input.czrResizeEditor( event.pageY );
                  } );
                } );

              dragbar.on( 'mouseup', function() {
                if ( ! input.editorExpanded() )
                  return;

                $( document ).off( 'mousemove.czr-customize-content_editor' );
                $( document.body ).removeClass( 'czr-customize-content_editor-pane-resize' );
                editorFrame.css( 'pointer-events', '' );
              } );

      },
      czrSetToggleButtonText : function( $_expanded ) {
              var input = this;

              input.toggleButton.text( serverControlParams.i18n.mods.textEditor[ ! $_expanded ? 'Edit' : 'Close Editor' ] );
      }
});//$.extend
})( wp.customize , jQuery, _ );//extends api.Value
//options:
  // id : item.id,
  // initial_item_model : item,
  // defaultItemModel : module.defaultItemModel,
  // module : module,
  // is_added_by_user : is_added_by_user || false

var CZRItemMths = CZRItemMths || {};
( function ( api, $, _ ) {
$.extend( CZRItemMths , {
      initialize: function( id, options ) {
            if ( _.isUndefined(options.module) || _.isEmpty(options.module) ) {
              throw new Error('No module assigned to item ' + id + '. Aborting');
            }

            var item = this;
            api.Value.prototype.initialize.call( item, null, options );

            //DEFERRED STATES
            //store the state of ready.
            //=> we don't want the ready method to be fired several times
            item.isReady = $.Deferred();
            //will store the embedded and content rendered state
            item.embedded = $.Deferred();
            item.container = null;//will store the item $ dom element
            item.contentContainer = null;//will store the item content $ dom element

            // this collection will be populated based on the DOM rendered input candidates
            // will allows us to set and get any individual input : item.czr_Input('font-family')()
            // declaring the collection Values here allows us to schedule actions for not yet registered inputs
            // like for example :
            // => when the font-family input is registered, then listen to it
            // item.czr_Input.when( 'font-family', function( _input_ ) {
            //       _input_.bind( function( to, from ) {
            //             console.log('font-family input changed ', to ,from );
            //       });
            // });
            item.czr_Input = new api.Values();

            // the item.inputCollection stores all instantiated input from DOM at the end of api.CZR_Helpers.setupInputCollectionFromDOM.call( item );
            // the collection of each individual input object is stored in item.czr_Input()
            // this inputCollection is designed to be listened to, in order to fire action when the collection has been populated.
            item.inputCollection = new api.Value({});

            //VIEW STATES FOR ITEM AND REMOVE DIALOG
            //viewState stores the current expansion status of a given view => one value by created by item.id
            //viewState can take 3 values : expanded, expanded_noscroll (=> used on view creation), closed
            item.viewState = new api.Value( 'closed' );
            item.removeDialogVisible = new api.Value( false );

            //input.options = options;
            //write the options as properties, name is included
            $.extend( item, options || {} );

            //declares a default model
            item.defaultItemModel = _.clone( options.defaultItemModel ) || { id : '', title : '' };

            //set initial values
            var _initial_model = $.extend( item.defaultItemModel, options.initial_item_model );

            // Check initial model here : to be overriden in each module
            _initial_model = item.validateItemModelOnInitialize( _initial_model );

            //this won't be listened to at this stage
            item.set( _initial_model );

            //USER EVENT MAP
            item.userEventMap = new api.Value( [
                  //toggles remove view alert
                  {
                        trigger   : 'click keydown',
                        selector  : [ '.' + item.module.control.css_attr.display_alert_btn, '.' + item.module.control.css_attr.cancel_alert_btn ].join(','),
                        name      : 'toggle_remove_alert',
                        actions   : function() {
                              var _isVisible = this.removeDialogVisible();
                              this.module.closeRemoveDialogs();
                              this.removeDialogVisible( ! _isVisible );
                        }
                  },
                  //removes item and destroys its view
                  {
                        trigger   : 'click keydown',
                        selector  : '.' + item.module.control.css_attr.remove_view_btn,
                        name      : 'remove_item',
                        actions   : ['removeItem']
                  },
                  //edit view
                  {
                        trigger   : 'click keydown',
                        selector  : [ '.' + item.module.control.css_attr.edit_view_btn, '.' + item.module.control.css_attr.item_title ].join(','),
                        name      : 'edit_view',
                        actions   : [ 'setViewVisibility' ]
                  },
                  //tabs navigation
                  {
                        trigger   : 'click keydown',
                        selector  : '.tabs nav li',
                        name      : 'tab_nav',
                        actions   : function( args ) {
                              //toggleTabVisibility is defined in the module ctor and its this is the item or the modOpt
                              this.module.toggleTabVisibility.call( this, args );
                        }
                  }
            ]);




            //ITEM IS READY
            //1) push it to the module item collection
            //2) observe its changes
            item.isReady.done( function() {
                  //push it to the collection
                  item.module.updateItemsCollection( { item : item() } );
                  //listen to each single item change
                  item.callbacks.add( function() { return item.itemReact.apply(item, arguments ); } );

                  //SCHEDULE INPUTS SETUP
                  //=> when the item content has been rendered. Typically on item expansion for a multi-items module.
                  // => or for mono item, right on item.renderItemWrapper()
                  item.bind( 'contentRendered', function() {
                        //create the collection of inputs if needed
                        //first time or after a removal
                        // previous condition included :  ! _.has( item, 'czr_Input' )
                        if ( _.isEmpty( item.inputCollection() ) ) {
                              if ( serverControlParams.isDevMode ) {
                                    api.CZR_Helpers.setupInputCollectionFromDOM.call( item );
                                    //the item.container is now available
                                    //Setup the tabs navigation
                                    //setupTabNav is defined in the module ctor and its this is the item or the modOpt
                                    item.module.setupTabNav.call( item );
                              } else {
                                    try {
                                          api.CZR_Helpers.setupInputCollectionFromDOM.call( item );
                                          //the item.container is now available
                                          //Setup the tabs navigation
                                          //setupTabNav is defined in the module ctor and its this is the item or the modOpt
                                          item.module.setupTabNav.call( item );
                                    } catch( er ) {
                                          api.errorLog( 'In item.isReady.done : ' + er );
                                    }
                              }
                        }
                  });

                  //SCHEDULE INPUTS DESTROY
                  item.bind( 'contentRemoved', function() {
                        if ( _.has( item, 'czr_Input' ) )
                          api.CZR_Helpers.removeInputCollection.call( item );
                  });

                  //When shall we render the item ?
                  //If the module is part of a simple control, the item can be render now,
                  //If the module is part of a sektion, then the item will be rendered on module edit.
                  // if ( ! item.module.isInSektion() ) {
                  //       item.mayBeRenderItemWrapper();
                  // }
                  if ( item.canBeRenderedInContext() ) {
                        item.mayBeRenderItemWrapper();
                  }

                  //ITEM WRAPPER VIEW SETUP
                  //defer actions on item view embedded
                  item.embedded.done( function() {
                        //define the item view DOM event map
                        //bind actions when the item is embedded : item title, etc.
                        item.itemWrapperViewSetup( _initial_model );
                  });
            });//item.isReady.done()

            //if an item is manually added : open it
            // if ( item.is_added_by_user ) {
            //   item.setViewVisibility( {}, true );//empty obj because this method can be fired by the dom chain actions, always passing an object. true for added_by_user
            // }
            //item.setViewVisibility( {}, item.is_added_by_user );

      },//initialize

      //overridable method
      //Fired if the item has been instantiated
      //The item.callbacks are declared.
      ready : function() {
            this.isReady.resolve();
      },

      // overridable method introduced with the flat skope
      // problem to solve => an instantiated item, doesn't necessary have to be rendered in a given context.
      canBeRenderedInContext : function() {
            return true;
      },

      // @return validated model object
      // To be overriden in each module
      validateItemModelOnInitialize : function( item_model_candidate ) {
            return item_model_candidate;
      },

      //React to a single item change
      //cb of module.czr_Item( item.id ).callbacks
      //the data can typically hold informations passed by the input that has been changed and its specific preview transport (can be PostMessage )
      //data looks like :
      //{
      //  module : {}
      //  input_changed     : string input.id
      //  input_transport   : 'postMessage' or '',
      //  not_preview_sent  : bool
      //}
      itemReact : function( to, from, data ) {
            var item = this,
                module = item.module;

            data = data || {};

            //update the collection
            module.updateItemsCollection( { item : to, data : data } ).done( function() {
                  //Always update the view title when the item collection has been updated
                  item.writeItemViewTitle( to, data );
            });

            //send item to the preview. On update only, not on creation.
            // if ( ! _.isEmpty(from) || ! _.isUndefined(from) ) {
            //       api.consoleLog('DO WE REALLY NEED TO SEND THIS TO THE PREVIEW WITH _sendItem(to, from) ?');
            //       item._sendItem(to, from);
            // }
      }
});//$.extend
})( wp.customize , jQuery, _ );//extends api.CZRBaseControl

var CZRItemMths = CZRItemMths || {};
( function ( api, $, _ ) {
$.extend( CZRItemMths , {
      //The idea is to send only the currently modified item instead of the entire collection
      //the entire collection is sent anyway on api(setId).set( value ), and accessible in the preview via api(setId).bind( fn( to) )
      _sendItem : function( to, from ) {
            var item = this,
                module = item.module,
                _changed_props = [];

            //which property(ies) has(ve) changed ?
            _.each( from, function( _val, _key ) {
                  if ( _val != to[_key] )
                    _changed_props.push(_key);
            });

            _.each( _changed_props, function( _prop ) {
                  api.previewer.send( 'sub_setting', {
                        set_id : module.control.id,
                        id : to.id,
                        changed_prop : _prop,
                        value : to[_prop]
                  });

                  //add a hook here
                  module.trigger('item_sent', { item : to , dom_el: item.container, changed_prop : _prop } );
            });
      },

      //fired on click dom event
      //for dynamic multi input modules
      removeItem : function() {
            var item = this,
                module = this.module,
                _new_collection = _.clone( module.itemCollection() );

            //hook here
            module.trigger('pre_item_dom_remove', item() );

            //destroy the Item DOM el
            item._destroyView();

            //new collection
            //say it
            _new_collection = _.without( _new_collection, _.findWhere( _new_collection, {id: item.id }) );
            module.itemCollection.set( _new_collection );
            //hook here
            module.trigger('pre_item_api_remove', item() );

            var _item_ = $.extend( true, {}, item() );
            //remove the item from the collection
            module.czr_Item.remove( item.id );
            module.trigger( 'item-removed', _item_ );
      },

      //@return the item {...} from the collection
      //takes a item unique id as param
      getModel : function(id) {
            return this();
      }

});//$.extend
})( wp.customize , jQuery, _ );
//extends api.CZRBaseControl
var CZRItemMths = CZRItemMths || {};
( function ( api, $, _ ) {
$.extend( CZRItemMths , {
      //fired on initialize for items in module embedded in a regular control
      //fired when user edit module for items in modules embedded in a sektion
      mayBeRenderItemWrapper : function() {
            var item = this;

            if ( 'pending' != item.embedded.state() )
              return;
            // Make sure we don't print twice
            if ( ! _.isEmpty( item.container ) && item.container.length > 0 )
              return;

            $.when( item.renderItemWrapper() ).done( function( $_container ) {
                  item.container = $_container;
                  if ( _.isUndefined(item.container) || ! item.container.length ) {
                      throw new Error( 'In mayBeRenderItemWrapper the Item view has not been rendered : ' + item.id );
                  } else {
                      //say it
                      item.embedded.resolve();
                  }
            });
      },

      //the view wrapper has been rendered by WP
      //the content ( the various inputs ) is rendered by the following methods
      //an event is triggered on the control.container when content is rendered
      renderItemWrapper : function( item_model ) {
            //=> an array of objects
            var item = this,
                module = item.module;

            item_model = item_model || item();

            //render the item wrapper
            $_view_el = $('<li>', { class : module.control.css_attr.single_item, 'data-id' : item_model.id,  id : item_model.id } );

            //append the item view to the first module view wrapper
            //!!note : => there could be additional sub view wrapper inside !!
            //$( '.' + module.control.css_attr.items_wrapper , module.container).first().append( $_view_el );
            // module.itemsWrapper has been stored as a $ var in module initialize() when the tmpl has been embedded
            module.itemsWrapper.append( $_view_el );

            //if module is multi item, then render the item crud header part
            //Note : for the widget module, the getTemplateEl method is overridden
            if ( module.isMultiItem() ) {
                  var _template_selector = module.getTemplateEl( 'rudItemPart', item_model );
                  //do we have view template script?
                  if ( 0 === $( '#tmpl-' + _template_selector ).length ) {
                      throw new Error('Missing template for item ' + item.id + '. The provided template script has no been found : #tmpl-' + module.getTemplateEl( 'rudItemPart', item_model ) );
                  }
                  $_view_el.append( $( wp.template( _template_selector )( item_model ) ) );
            }


            //then, append the item content wrapper
            $_view_el.append( $( '<div/>', { class: module.control.css_attr.item_content } ) );

            return $_view_el;
      },

      // fired when item is ready and embedded
      // define the item view DOM event map
      // bind actions when the item is embedded
      itemWrapperViewSetup : function( item_model ) {
            var item = this,
                module = this.module;

            item_model = item() || item.initial_item_model;//could not be set yet

            //always write the title
            item.writeItemViewTitle();


            //When do we render the item content ?
            //If this is a multi-item module, let's render each item content when they are expanded.
            //In the case of a single item module, we can render the item content now.
            var _updateItemContentDeferred = function( $_item_content, to, from ) {
                  //update the $.Deferred state
                  if ( ! _.isUndefined( $_item_content ) && false !== $_item_content.length ) {
                        item.contentContainer = $_item_content;
                        item.trigger( 'contentRendered', { item_content : $_item_content } );
                        item.toggleItemExpansion( to, from );
                  }
                  else {
                        throw new Error( 'Module : ' + item.module.id + ', the item content has not been rendered for ' + item.id );
                  }
            };

            if ( item.module.isMultiItem() ) {
                  item.viewState.callbacks.add( function( to, from ) {
                        //viewState can take 3 states : expanded, expanded_noscroll, closed
                        var _isExpanded = -1 !== to.indexOf( 'expanded' );

                        //If this module has mod Opt, always close the opt pane on view state change
                        if ( module.hasModOpt() && _isExpanded ) {
                              api.czr_ModOptVisible( false );
                        }

                        if ( _isExpanded ) {
                              //item already rendered ?
                              if ( _.isObject( item.contentContainer ) && false !== item.contentContainer.length ) {
                                    //toggle on view state change
                                    item.toggleItemExpansion(to, from );
                              } else {
                                    $.when( item.renderItemContent( item() || item.initial_item_model ) ).done( function( $_item_content ) {
                                          //introduce a small delay to give some times to the modules to be printed.
                                          //@todo : needed ?
                                          _updateItemContentDeferred = _.debounce(_updateItemContentDeferred, 50 );
                                          _updateItemContentDeferred( $_item_content, to, from );
                                    });
                              }
                        } else {
                              //toggle on view state change
                              item.toggleItemExpansion( to, from ).done( function() {
                                    if ( _.isObject( item.contentContainer ) && false !== item.contentContainer.length ) {
                                          item.trigger( 'beforeContenRemoved' );
                                          //Removes DOM input nodes
                                          $( '.' + module.control.css_attr.item_content, item.container ).children().each( function() {
                                                $(this).remove();
                                          });
                                          //clean any other content like a commented html markup
                                          $( '.' + module.control.css_attr.item_content, item.container ).html('');
                                          //reset the contentContainer property
                                          item.contentContainer = null;
                                          //will remove the input collection values
                                          item.trigger( 'contentRemoved' );
                                    }
                              });
                        }
                  });
            } else {
                  //react to the item state changes
                  item.viewState.callbacks.add( function( to, from ) {
                        //toggle on view state change
                        item.toggleItemExpansion.apply(item, arguments );
                  });

                  //renderview content now for a single item module
                  $.when( item.renderItemContent( item_model ) ).done( function( $_item_content ) {
                        _updateItemContentDeferred( $_item_content, true );
                        //item.viewState.set('expanded');
                  });
            }

            //DOM listeners for the user action in item view wrapper
            api.CZR_Helpers.setupDOMListeners(
                  item.userEventMap(),//actions to execute
                  { model:item_model, dom_el:item.container },//model + dom scope
                  item //instance where to look for the cb methods
            );

            //Listen to the remove dialog state
            item.removeDialogVisible.bind( function( visible ) {
                  var module = item.module,
                      $_alert_el = $( '.' + module.control.css_attr.remove_alert_wrapper, item.container ).first();

                  //first close all open items views and dialogs
                  if ( visible )
                    module.closeAllItems();

                  //Close Mod opts if any
                  if ( visible && module.hasModOpt() ) {
                        api.czr_ModOptVisible( false );
                  }

                  //Close Pre item dialog
                  if ( visible && _.has( module, 'preItem' ) ) {
                        module.preItemExpanded(false);
                  }

                  //then close any other open remove dialog in the item container
                  $('.' + module.control.css_attr.remove_alert_wrapper, item.container ).not( $_alert_el ).each( function() {
                        if ( $(this).hasClass( 'open' ) ) {
                              $(this).slideToggle( {
                                    duration : 200,
                                    done : function() {
                                          $(this).toggleClass('open' , false );
                                          //deactivate the icons
                                          $(this).siblings().find('.' + module.control.css_attr.display_alert_btn).toggleClass( 'active' , false );
                                    }
                              } );
                        }
                  });

                  //print the html if dialod is expanded
                  if ( visible ) {
                        //do we have an html template and a control container?
                        if ( ! wp.template( module.AlertPart )  || ! item.container ) {
                              api.consoleLog( 'No removal alert template available for items in module :' + module.id );
                              return;
                        }

                        $_alert_el.html( wp.template( module.AlertPart )( { title : ( item().title || item.id ) } ) );
                        item.trigger( 'remove-dialog-rendered');
                  }

                  //Slide it
                  var _slideComplete = function( visible ) {
                        $_alert_el.toggleClass( 'open' , visible );
                        //set the active class of the clicked icon
                        item.container.find('.' + module.control.css_attr.display_alert_btn ).toggleClass( 'active', visible );
                        //adjust scrolling to display the entire dialog block
                        if ( visible )
                          module._adjustScrollExpandedBlock( item.container );
                  };
                  if ( visible )
                    $_alert_el.stop( true, true ).slideDown( 200, function() { _slideComplete( visible ); } );
                  else
                    $_alert_el.stop( true, true ).slideUp( 200, function() { _slideComplete( visible ); } );
            });//item.removeDialogVisible.bind()
      },//itemWrapperViewSetup



      //renders saved items views and attach event handlers
      //the saved item look like :
      //array[ { id : 'sidebar-one', title : 'A Title One' }, {id : 'sidebar-two', title : 'A Title Two' }]
      renderItemContent : function( item_model ) {
            //=> an array of objects
            var item = this,
                module = this.module;

            item_model = item_model || item();

            //do we have view content template script?
            if ( 0 === $( '#tmpl-' + module.getTemplateEl( 'itemInputList', item_model ) ).length ) {
                throw new Error('No item content template defined for module ' + module.id + '. The template script id should be : #tmpl-' + module.getTemplateEl( 'itemInputList', item_model ) );
            }

            var  item_content_template = wp.template( module.getTemplateEl( 'itemInputList', item_model ) );

            //do we have an html template ?
            if ( ! item_content_template )
              return this;

            //the view content
            $( item_content_template( item_model )).appendTo( $('.' + module.control.css_attr.item_content, item.container ) );

            return $( '.' + module.control.css_attr.item_content, item.container );
      },





      //fired in setupItemListeners
      writeItemViewTitle : function( item_model ) {
            var item = this,
                module = item.module,
                _model = item_model || item(),
                //Let's fall back on the id if the title is not set or empty
                _title = ( _.has( _model, 'title') && ! _.isEmpty( _model.title ) ) ? api.CZR_Helpers.capitalize( _model.title ) : _model.id,

            _title = api.CZR_Helpers.truncate( _title, 20 );
            $( '.' + module.control.css_attr.item_title , item.container ).text( _title );
            //add a hook here
            api.CZR_Helpers.doActions('after_writeViewTitle', item.container , _model, item );
      },



      //@param : obj = { event : {}, model : {}, view : ${} }
      //Fired on view_rendered:new when a new model has been added
      //Fired on click on edit_view_btn
      setViewVisibility : function( obj, is_added_by_user ) {
            var item = this,
                module = this.module;
            if ( is_added_by_user ) {
                  item.viewState.set( 'expanded_noscroll' );
            } else {
                  module.closeAllItems( item.id );
                  if ( _.has(module, 'preItem') ) {
                    module.preItemExpanded.set(false);
                  }
                  item.viewState.set( 'expanded' == item._getViewState() ? 'closed' : 'expanded' );
            }
      },


      _getViewState : function() {
            return -1 == this.viewState().indexOf('expanded') ? 'closed' : 'expanded';
      },


      //callback of item.viewState.callbacks
      //viewState can take 3 states : expanded, expanded_noscroll, closed
      toggleItemExpansion : function( status, from, duration ) {
            var visible = 'closed' != status,
                item = this,
                module = this.module,
                $el = $( '.' + module.control.css_attr.item_content , item.container ).first(),
                dfd = $.Deferred(),
                _slideComplete = function( visible ) {
                      item.container.toggleClass( 'open' , visible );
                      //close all remove dialogs
                      if ( visible )
                        module.closeRemoveDialogs();

                      //toggle the icon activate class depending on the status
                      //switch icon
                      var $_edit_icon = $el.siblings().find('.' + module.control.css_attr.edit_view_btn );

                      $_edit_icon.toggleClass('active' , visible );
                      if ( visible )
                        $_edit_icon.removeClass('fa-pencil-alt').addClass('fa-minus-square').attr('title', serverControlParams.i18n.close );
                      else
                        $_edit_icon.removeClass('fa-minus-square').addClass('fa-pencil-alt').attr('title', serverControlParams.i18n.edit );

                      //scroll to the currently expanded view
                      if ( 'expanded' == status ) {
                            module._adjustScrollExpandedBlock( item.container );
                      }

                      dfd.resolve();
                };

            if ( visible )
              $el.stop( true, true ).slideDown( duration || 200, function() { _slideComplete( visible ); } );
            else
              $el.stop( true, true ).slideUp( 200, function() { _slideComplete( visible ); } );

            return dfd.promise();
      },


      //removes the view dom module
      _destroyView : function ( duration ) {
            this.container.fadeOut( {
                duration : duration ||400,
                done : function() {
                  $(this).remove();
                }
            });
      }
});//$.extend
})( wp.customize , jQuery, _ );//extends api.Value
//options:
// module : module,
// initial_modOpt_model : modOpt, can contains the already db saved values
// defaultModOptModel : module.defaultModOptModel
// control : control instance

var CZRModOptMths = CZRModOptMths || {};
( function ( api, $, _ ) {
$.extend( CZRModOptMths , {
      initialize: function( options ) {
            if ( _.isUndefined(options.module) || _.isEmpty(options.module) ) {
              throw new Error('No module assigned to modOpt.');
            }

            var modOpt = this;
            api.Value.prototype.initialize.call( modOpt, null, options );

            //DEFERRED STATES
            //store the state of ready.
            //=> we don't want the ready method to be fired several times
            modOpt.isReady = $.Deferred();

            //VARIOUS DEFINITIONS
            modOpt.container = null;//will store the modOpt $ dom element
            modOpt.inputCollection = new api.Value({});

            //input.options = options;
            //write the options as properties, name is included
            $.extend( modOpt, options || {} );

            //declares a default modOpt model
            modOpt.defaultModOptModel = _.clone( options.defaultModOptModel ) || { is_mod_opt : true };

            //set initial values
            var _initial_model = $.extend( modOpt.defaultModOptModel, options.initial_modOpt_model );
            var ctrl = modOpt.module.control;
            //this won't be listened to at this stage
            modOpt.set( _initial_model );

            //MOD OPT PANEL SETTINGS
            api.czr_ModOptVisible = new api.Value( false );

            //MOD OPT VISIBLE REACT
            // passing an optional args object allows us to expand the modopt panel and focus on a specific tab right after
            //@args : {
            //  module : module,//the current module for which the modOpt is being expanded
            //  focus : 'section-topline-2'//the id of the tab we want to focus on
            //}
            api.czr_ModOptVisible.bind( function( visible, from, args ) {
                  args = args || {};
                  if ( visible ) {
                        //first close all opened remove dialogs and opened items
                        modOpt.module.closeRemoveDialogs().closeAllItems();

                        modOpt.modOptWrapperViewSetup( _initial_model ).done( function( $_container ) {
                              modOpt.container = $_container;
                              try {
                                    api.CZR_Helpers.setupInputCollectionFromDOM.call( modOpt ).toggleModPanelView( visible );
                              } catch(e) {
                                    api.consoleLog(e);
                              }
                              if ( args.module && args.focus ) {
                                    _.delay( function() {
                                          if ( _.isNull(  args.module.czr_ModOpt.container ) || ! args.module.czr_ModOpt.container.find('[data-tab-id="' + args.focus + '"] a').length )
                                            return;
                                          args.module.czr_ModOpt.container.find('[data-tab-id="' + args.focus + '"] a').trigger('click');
                                    }, 200 );
                              }
                        });

                  } else {
                        modOpt.toggleModPanelView( visible ).done( function() {
                              if ( false !== modOpt.container.length ) {
                                    $.when( modOpt.container.remove() ).done( function() {
                                          api.CZR_Helpers.removeInputCollection.call( modOpt );
                                    });
                              } else {
                                    api.CZR_Helpers.removeInputCollection.call( modOpt );
                              }
                              modOpt.container = null;
                        });
                  }
            } );

            //OPTIONS IS READY
            //observe its changes when ready
            modOpt.isReady.done( function() {
                  //listen to any modOpt change
                  //=> done in the module
                  //modOpt.callbacks.add( function() { return modOpt.modOptReact.apply(modOpt, arguments ); } );

                  //When shall we render the modOpt ?
                  //If the module is part of a simple control, the modOpt can be render now,
                  //modOpt.mayBeRenderModOptWrapper();

                  //RENDER THE CONTROL TITLE GEAR ICON
                  if( ! $( '.' + ctrl.css_attr.edit_modopt_icon, ctrl.container ).length ) {
                        $.when( ctrl.container
                              .find('.customize-control-title').first()//was.find('.customize-control-title')
                              .append( $( '<span/>', {
                                    class : [ ctrl.css_attr.edit_modopt_icon, 'fas fa-cog' ].join(' '),
                                    title : serverControlParams.i18n['Settings']
                              } ) ) )
                        .done( function(){
                              $( '.' + ctrl.css_attr.edit_modopt_icon, ctrl.container ).fadeIn( 400 );
                        });
                  }

                  //LISTEN TO USER ACTIONS ON CONTROL EL
                  api.CZR_Helpers.setupDOMListeners(
                        [
                              //toggle mod options
                              {
                                    trigger   : 'click keydown',
                                    selector  : '.' + ctrl.css_attr.edit_modopt_icon,
                                    name      : 'toggle_mod_option',
                                    actions   : function() {
                                          api.czr_ModOptVisible( ! api.czr_ModOptVisible() );
                                    }
                              }
                        ],//actions to execute
                        { dom_el: ctrl.container },//dom scope
                        modOpt //instance where to look for the cb methods
                  );
                  //modOpt.userEventMap = new api.Value( [] );
            });//modOpt.isReady.done()

      },//initialize

      //overridable method
      //Fired if the modOpt has been instantiated
      //The modOpt.callbacks are declared.
      ready : function() {
            this.isReady.resolve();
      }
});//$.extend
})( wp.customize , jQuery, _ );//extends api.CZRBaseControl

var CZRModOptMths = CZRModOptMths || {};
( function ( api, $, _ ) {
$.extend( CZRModOptMths , {
      //fired when modOpt is ready and embedded
      //define the modOpt view DOM event map
      //bind actions when the modOpt is embedded
      modOptWrapperViewSetup : function( modOpt_model ) {
              var modOpt = this,
                  module = this.module,
                  dfd = $.Deferred(),
                  _setupDOMListeners = function( $_container ) {
                        //DOM listeners for the user action in modOpt view wrapper
                        api.CZR_Helpers.setupDOMListeners(
                             [
                                    //toggle mod options
                                    {
                                          trigger   : 'click keydown',
                                          selector  : '.' + module.control.css_attr.close_modopt_icon,
                                          name      : 'close_mod_option',
                                          actions   : function() {
                                                api.czr_ModOptVisible( false );
                                          }
                                    },
                                    //tabs navigation
                                    {
                                          trigger   : 'click keydown',
                                          selector  : '.tabs nav li',
                                          name      : 'tab_nav',
                                          actions   : function( args ) {
                                                //toggleTabVisibility is defined in the module ctor and its this is the item or the modOpt
                                                this.module.toggleTabVisibility.call( this, args );
                                          }
                                    }
                              ],//actions to execute
                              { dom_el: $_container },//model + dom scope
                              modOpt //instance where to look for the cb methods
                        );
                  };

              modOpt_model = modOpt() || modOpt.initial_modOpt_model;//could not be set yet

              //renderview content now
              $.when( modOpt.renderModOptContent( modOpt_model ) )
                    .done( function( $_container ) {
                          //update the $.Deferred state
                          if ( ! _.isUndefined( $_container ) && false !== $_container.length ) {
                                _setupDOMListeners( $_container );
                                dfd.resolve( $_container );
                          }
                          else {
                                throw new Error( 'Module : ' + modOpt.module.id + ', the modOpt content has not been rendered' );
                          }
                    })
                    .then( function() {
                          //the modOpt.container is now available
                          //Setup the tabs navigation
                          //setupTabNav is defined in the module ctor and its this is the item or the modOpt
                          modOpt.module.setupTabNav.call( modOpt );
                    });

              return dfd.promise();
      },


      //renders saved modOpt views and attach event handlers
      //the saved modOpt look like :
      //array[ { id : 'sidebar-one', title : 'A Title One' }, {id : 'sidebar-two', title : 'A Title Two' }]
      renderModOptContent : function( modOpt_model ) {
              //=> an array of objects
              var modOpt = this,
                  module = this.module;

              modOpt_model = modOpt_model || modOpt();

              //do we have view content template script?
              if ( 0 === $( '#tmpl-' + module.getTemplateEl( 'modOptInputList', modOpt_model ) ).length ) {
                    api.errorLog('renderModOptContent : No modOpt content template defined for module ' + module.id + '. The template script id should be : #tmpl-' + module.getTemplateEl( 'modOptInputList', modOpt_model ) );
                    return;
              }
              var  modOpt_content_template = wp.template( module.getTemplateEl( 'modOptInputList', modOpt_model ) );

              //do we have an html template ?
              if ( ! modOpt_content_template )
                return this;

              var _ctrlLabel = '';
              try {
                    _ctrlLabel = [ serverControlParams.i18n['Options for'], module.control.params.label ].join(' ');
              } catch( er ) {
                    api.errorLog( 'In renderModOptContent : ' + er );
                    _ctrlLabel = serverControlParams.i18n['Settings'];
              }

              $('#widgets-left').after( $( '<div/>', {
                    class : module.control.css_attr.mod_opt_wrapper,
                    html : [
                          [ '<h2 class="mod-opt-title">', _ctrlLabel , '</h2>' ].join(''),
                          '<span class="fa fa-times ' + module.control.css_attr.close_modopt_icon + '" title="close"></span>'
                    ].join('')
              } ) );

              //render the mod opt content for this module
              $( '.' + module.control.css_attr.mod_opt_wrapper ).append( $( modOpt_content_template( modOpt_model ) ) );

              return $( '.' + module.control.css_attr.mod_opt_wrapper );
      },



      toggleModPanelView : function( visible ) {
            var modOpt = this,
                module = this.module,
                ctrl = module.control,
                dfd = $.Deferred();

            module.control.container.toggleClass( 'czr-modopt-visible', visible );
            $('body').toggleClass('czr-editing-modopt', visible );
            //Let the panel slide (  -webkit-transition: left .18s ease-in-out )
            _.delay( function() {
                  dfd.resolve();
            }, 200 );
            return dfd.promise();
      }
});//$.extend
})( wp.customize , jQuery, _ );//MULTI CONTROL CLASS
//extends api.Value
//
//Setup the collection of items
//renders the control view
//Listen to items collection changes and update the control setting
//MODULE OPTIONS :
  // control     : control,
  // crud        : bool
  // id          : '',
  // items       : [], module.items,
  // modOpt       : {}
  // module_type : module.module_type,
  // multi_item  : bool
  // section     : module.section,
  // is_added_by_user : is_added_by_user || false
var CZRModuleMths = CZRModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRModuleMths, {
      initialize: function( id, constructorOptions ) {
            if ( _.isUndefined(constructorOptions.control) || _.isEmpty(constructorOptions.control) ) {
                throw new Error('No control assigned to module ' + id );
            }
            var module = this;
            api.Value.prototype.initialize.call( this, null, constructorOptions );

            //store the state of ready.
            //=> we don't want the ready method to be fired several times
            module.isReady = $.Deferred();

            //write the module constructor options as properties
            // The default module model can be get with
            // and is formed this way :
            // {
            // control:{}
            // crud:false
            // id:""
            // items:[]
            // modOpt:{}
            // module_type:""
            // multi_item:false
            // section:""
            // sortable:false
            //}

            $.extend( module, constructorOptions || {} );

            //extend the module with new template Selectors
            $.extend( module, {
                  crudModulePart : 'czr-crud-module-part',//create, read, update, delete
                  rudItemPart : 'czr-rud-item-part',//read, update, delete
                  ruItemPart : 'czr-ru-item-part',//read, update
                  itemInputList : '',//is specific for each crud module
                  modOptInputList : '',//is specific for each module
                  AlertPart : 'czr-rud-item-alert-part',//used both for items and modules removal
            } );

            //embed : define a container, store the embed state, fire the render method
            module.embedded = $.Deferred();
            module.itemsWrapper = '';//will store the $ item container

            //if a module is embedded in a control, its container == the control container.
            //if the module is part of a sektion, its container will be set and resolve() later ( @see multi_module part )
            if ( ! module.isInSektion() ) {
                  module.container = $( module.control.selector );
                  module.embedded.resolve();
            }

            //render the item(s) wrapper
            module.embedded.done( function() {
                  $.when( module.renderModuleParts() ).done(function( $_module_items_wrapper ){
                        if ( false === $_module_items_wrapper.length ) {
                            throw new Error( 'The items wrapper has not been rendered for module : ' + module.id );
                        }
                        //stores the items wrapper ( </ul> el ) as a jQuery var
                        module.itemsWrapper = $_module_items_wrapper;
                  });
            });

            /*-----------------------------------------------
            * MODULE OPTIONS
            ------------------------------------------------*/
            //declares a default Mod options API model
            module.defaultAPImodOptModel = {
                  initial_modOpt_model : {},
                  defaultModOptModel : {},
                  control : {},//control instance
                  module : {}//module instance
            };

            //declares a default modOpt model
            module.defaultModOptModel = {};

            //define a default Constructors
            module.modOptConstructor = api.CZRModOpt;

            /*-----------------------------------------------
            * ITEMS
            ------------------------------------------------*/
            module.itemCollection = new api.Value( [] );

            //declares a default Item API model
            module.defaultAPIitemModel = {
                  id : '',
                  initial_item_model : {},
                  defaultItemModel : {},
                  control : {},//control instance
                  module : {},//module instance
                  is_added_by_user : false
            };

            //declares a default item model
            module.defaultItemModel = { id : '', title : '' };

            //define a default Constructors
            module.itemConstructor = api.CZRItem;
            //czr_model stores the each model value => one value by created by model.id
            module.czr_Item = new api.Values();


            /*-----------------------------------------------
            * SET THE DEFAULT INPUT CONSTRUCTOR AND INPUT OPTIONS
            ------------------------------------------------*/
            module.inputConstructor = api.CZRInput;//constructor for the items input
            if ( module.hasModOpt() ) {
                  module.inputModOptConstructor = api.CZRInput;//constructor for the modOpt input
            }
            module.inputOptions = {};//<= can be set by each module specifically
            //For example, if I need specific options for the content_picker, this is where I will set them in the module extended object


            /*-----------------------------------------------
            * FIRE ON isReady
            ------------------------------------------------*/
            //module.ready(); => fired by children
            module.isReady.done( function() {
                  //store the module dirtyness, => no items set
                  module.isDirty = new api.Value( constructorOptions.dirty || false );

                  //initialize the module api.Value()
                  //constructorOptions has the same structure as the one described in prepareModuleforAPI
                  //setting the module Value won't be listen to at this stage
                  module.initializeModuleModel( constructorOptions )
                        .done( function( initialModuleValue ) {
                              module.set( initialModuleValue );
                        })
                        .fail( function( response ){ api.consoleLog( 'Module : ' + module.id + ' initialize module model failed : ', response ); })
                        .always( function( initialModuleValue ) {
                              //listen to each single module change
                              module.callbacks.add( function() { return module.moduleReact.apply( module, arguments ); } );

                              //if the module is not registered yet (for example when the module is added by user),
                              //=> push it to the collection of the module-collection control
                              //=> updates the wp api setting
                              if (  ! module.control.isModuleRegistered( module.id ) ) {
                                  module.control.updateModulesCollection( { module : constructorOptions, is_registered : false } );
                              }

                              module.bind('items-collection-populated', function( collection ) {
                                    //listen to item Collection changes
                                    module.itemCollection.callbacks.add( function() { return module.itemCollectionReact.apply( module, arguments ); } );

                                    //it can be overridden by a module in its initialize method
                                    if ( module.isMultiItem() ) {
                                          module._makeItemsSortable();
                                    }
                              });

                              //populate and instantiate the items now when a module is embedded in a regular control
                              //if in a sektion, the populateSavedItemCollection() will be fired on module edit
                              if ( ! module.isInSektion() )
                                module.populateSavedItemCollection();

                              //When the module has modOpt :
                              //=> Instantiate the modOpt and setup listener
                              if ( module.hasModOpt() ) {
                                  module.instantiateModOpt();
                              }
                        });
            });//module.isReady.done()
      },




      //////////////////////////////////
      ///READY
      //////////////////////////////////
      //When the control is embedded on the page, this method is fired in api.CZRBaseModuleControl:ready()
      //=> right after the module is instantiated.
      //If the module is a dynamic one (CRUD like), then this method is invoked by the child class
      ready : function() {
            var module = this;
            module.isReady.resolve();
      },



      //fired when module is initialized, on module.isReady.done()
      //designed to be extended or overridden to add specific items or properties
      initializeModuleModel : function( constructorOptions ) {
            var module = this, dfd = $.Deferred();
            if ( ! module.isMultiItem() && ! module.isCrud() ) {
                  //this is a static module. We only have one item
                  //init module item if needed.
                  if ( _.isEmpty( constructorOptions.items ) ) {
                        var def = _.clone( module.defaultItemModel );
                        constructorOptions.items = [ $.extend( def, { id : module.id } ) ];
                  }
            }
            return dfd.resolve( constructorOptions ).promise();
      },


      //cb of : module.itemCollection.callbacks
      //the data can typically hold informations passed by the input that has been changed and its specific preview transport (can be PostMessage )
      //data looks like :
      //{
      //  module : {}
      //  input_changed     : string input.id
      //  input_transport   : 'postMessage' or '',
      //  not_preview_sent  : bool
      //}
      itemCollectionReact : function( to, from, data ) {
            var module = this,
                _current_model = module(),
                _new_model = $.extend( true, {}, _current_model );
            _new_model.items = to;
            //update the dirtyness state
            module.isDirty.set(true);
            //set the the new items model
            module.set( _new_model, data || {} );
      },

      //This method is fired from the control
      filterItemsBeforeCoreApiSettingValue : function( itemsToReturn ) {
            return itemsToReturn;
      },

      //cb of module.callbacks
      //=> sets the setting value via the module collection !
      moduleReact : function( to, from, data ) {
            //cb of : module.callbacks
            var module            = this,
                control           = module.control,
                isItemUpdate    = ( _.size( from.items ) == _.size( to.items ) ) && ! _.isEmpty( _.difference( to.items, from.items ) ),
                isColumnUpdate  = to.column_id != from.column_id,
                refreshPreview    = function() {
                      api.previewer.refresh();
                };

            //update the collection + pass data
            control.updateModulesCollection( {
                  module : $.extend( true, {}, to ),
                  data : data//useful to pass contextual info when a change happens
            } );

            // //Always update the view title
            // module.writeViewTitle(to);

            // //@todo : do we need that ?
            // //send module to the preview. On update only, not on creation.
            // if ( ! _.isEmpty(from) || ! _.isUndefined(from) ) {
            //   module._sendModule(to, from);
            // }
      },

      //@todo : create a smart helper to get either the wp api section or the czr api sektion, depending on the module context
      getModuleSection : function() {
            return this.section;
      },

      //@return bool
      isInSektion : function() {
            var module = this;
            return _.has( module, 'sektion_id' );
      },

      //is this module multi item ?
      //@return bool
      isMultiItem : function() {
            return api.CZR_Helpers.isMultiItemModule( null, this );
      },

      //is this module crud ?
      //@return bool
      isCrud : function() {
            return api.CZR_Helpers.isCrudModule( null, this );
      },

      hasModOpt : function() {
            return api.CZR_Helpers.hasModuleModOpt( null, this );
      },


      //////////////////////////////////
      ///MODULE OPTION :
      ///1) PREPARE
      ///2) INSTANTIATE
      ///3) LISTEN TO AND SET PARENT MODULE ON CHANGE
      //////////////////////////////////
      //fired when module isReady
      instantiateModOpt : function() {
            var module = this;
            //Prepare the modOpt and instantiate it
            var modOpt_candidate = module.prepareModOptForAPI( module().modOpt || {} );
            module.czr_ModOpt = new module.modOptConstructor( modOpt_candidate );
            module.czr_ModOpt.ready();
            //update the module model on modOpt change
            module.czr_ModOpt.callbacks.add( function( to, from, data ) {
                  var _current_model = module(),
                      _new_model = $.extend( true, {}, _current_model );
                  _new_model.modOpt = to;
                  //update the dirtyness state
                  module.isDirty(true);
                  //set the the new items model
                  //the data can typically hold informations passed by the input that has been changed and its specific preview transport (can be PostMessage )
                  //data looks like :
                  //{
                  //  module : {}
                  //  input_changed     : string input.id
                  //  input_transport   : 'postMessage' or '',
                  //  not_preview_sent  : bool
                  //}
                  module( _new_model, data );
            });
      },

      //@return an API ready modOpt object with the following properties
      // initial_modOpt_model : {},
      // defaultModOptModel : {},
      // control : {},//control instance
      // module : {},//module instance
      //@param modOpt_candidate is an object. Can contain the saved modOpt properties on init.
      prepareModOptForAPI : function( modOpt_candidate ) {
            var module = this,
                api_ready_modOpt = {};
            // if ( ! _.isObject( modOpt_candidate ) ) {
            //       throw new Error('preparemodOptForAPI : a modOpt must be an object to be instantiated.');
            // }
            modOpt_candidate = _.isObject( modOpt_candidate ) ? modOpt_candidate : {};

            _.each( module.defaultAPImodOptModel, function( _value, _key ) {
                  var _candidate_val = modOpt_candidate[_key];
                  switch( _key ) {
                        case 'initial_modOpt_model' :
                            //make sure that the provided modOpt has all the default properties set
                            _.each( module.getDefaultModOptModel() , function( _value, _property ) {
                                  if ( ! _.has( modOpt_candidate, _property) )
                                     modOpt_candidate[_property] = _value;
                            });
                            api_ready_modOpt[_key] = modOpt_candidate;

                        break;
                        case  'defaultModOptModel' :
                            api_ready_modOpt[_key] = _.clone( module.defaultModOptModel );
                        break;
                        case  'control' :
                            api_ready_modOpt[_key] = module.control;
                        break;
                        case  'module' :
                            api_ready_modOpt[_key] = module;
                        break;
                  }//switch
            });
            return api_ready_modOpt;
      },

      //Returns the default modOpt defined in initialize
      //Each chid class can override the default item and the following method
      getDefaultModOptModel : function( id ) {
            var module = this;
            return $.extend( _.clone( module.defaultModOptModel ), { is_mod_opt : true } );
      },


      //The idea is to send only the currently modified item instead of the entire collection
      //the entire collection is sent anyway on api(setId).set( value ), and accessible in the preview via api(setId).bind( fn( to) )
      //This method can be called on input change and on czr-partial-refresh-done
      //{
      //  input_id :
      //  input_parent_id :
      //  is_mod_opt :
      //  to :
      //  from :
      //  isPartialRefresh : bool//<= let us know if it is a full wrapper refresh or a single input update ( true when fired from sendModuleInputsToPreview )
      //}
      sendInputToPreview : function( args ) {
            var module = this;
            //normalizes the args
            args = _.extend(
              {
                    input_id        : '',
                    input_parent_id : '',//<= can be the mod opt or an item
                    to              : null,
                    from            : null
              } , args );

            if ( _.isEqual( args.to, args.from ) )
              return;

            //This is listened to by the preview frame
            api.previewer.send( 'czr_input', {
                  set_id        : api.CZR_Helpers.getControlSettingId( module.control.id ),
                  module_id     : module.id,//<= will allow us to target the right dom element on front end
                  module        : { items : $.extend( true, {}, module().items ) , modOpt : module.hasModOpt() ?  $.extend( true, {}, module().modOpt ): {} },
                  input_parent_id : args.input_parent_id,//<= can be the mod opt or the item
                  input_id      : args.input_id,
                  value         : args.to,
                  isPartialRefresh : args.isPartialRefresh//<= let us know if it is a full wrapper refresh or a single input update ( true when fired from sendModuleInputsToPreview )
            });

            //add a hook here
            module.trigger( 'input_sent', { input : args.to , dom_el: module.container } );
      },


      //@return void()
      //Fired on partial refresh in base control initialize, only for module type controls
      //This method can be called when don't have input instances available
      //=> typically when reordering items, mod options and items are closed, therefore there's no input instances.
      //=> the input id are being retrieved from the input parent models : items and mod options.
      //@param args = { isPartialRefresh : bool }
      sendModuleInputsToPreview : function( args ) {
            var module = this,
                _sendInputData = function() {
                      var inputParent = this,//this is the input parent : item or modOpt
                          inputParentModel = $.extend( true, {}, inputParent() );
                      //we don't need to send the id, which is never an input, but generated by the api.
                      inputParentModel = _.omit( inputParentModel, 'id' );

                      _.each( inputParentModel, function( inputVal, inputId ) {
                            module.sendInputToPreview( {
                                  input_id : inputId,
                                  input_parent_id : inputParent.id,
                                  to : inputVal,
                                  from : null,
                                  isPartialRefresh : args.isPartialRefresh
                            });
                      });
                };

            module.czr_Item.each( function( _itm_ ) {
                  _sendInputData.call( _itm_ );
            });

            if ( module.hasModOpt() ) {
                  _sendInputData.call( module.czr_ModOpt );
            }
      }
});//$.extend//CZRBaseControlMths
})( wp.customize , jQuery, _ );//MULTI CONTROL CLASS
//extends api.CZRBaseControl
//
//Setup the collection of items
//renders the module view
//Listen to items collection changes and update the control setting

var CZRModuleMths = CZRModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRModuleMths, {
      //@fired in module ready on api('ready')
      //the module().items has been set in initialize
      //A collection of items can be supplied.
      populateSavedItemCollection : function( _itemCollection_ ) {
              var module = this, _saved_items = [];
              _itemCollection_ = _itemCollection_ || module().items;
              if ( ! _.isArray( _itemCollection_ ) ) {
                    api.errorLog( 'populateSavedItemCollection : The saved items collection must be an array in module :' + module.id );
                    return;
              }

              //populates the collection with the saved items
              //the modOpt must be skipped
              //the saved items + modOpt is an array looking like :
              ////MODOPT IS THE FIRST ARRAY ELEMENT: A modOpt has no unique id and has the property is_mod_opt set to true
              //[
              //  is_mod_opt : true //<= inform us that this is not an item but a modOpt
              //],
              ////THEN COME THE ITEMS
              //[
              //  id : "czr_slide_module_0"
              //     slide-background : 21,
              //     ....
              //   ],
              //   [
              // id : "czr_slide_module_1"
              //     slide-background : 21,
              //     ....
              //   ]

              //FILTER THE ACTUAL ITEMS ( REMOVE THE MODOPTS ELEMENT IF ANY )
              //=> the items and the modOpt should already be split at this stage, because it's done before module instantiation... this check is totally paranoid.
              _.each( _itemCollection_, function( item_candidate , key ) {
                    if ( _.has( item_candidate, 'id') && ! _.has( item_candidate, 'is_mod_opt' ) ) {
                          _saved_items.push( item_candidate );
                    }
              });

              _saved_items = module.filterItemCandidatesBeforeInstantiation( _saved_items );

              //INSTANTIATE THE ITEMS
              _.each( _saved_items, function( item_candidate , key ) {
                    //adds it to the collection and fire item.ready()
                    if ( serverControlParams.isDevMode ) {
                        module.instantiateItem( item_candidate ).ready();
                    } else {
                        try { module.instantiateItem( item_candidate ).ready(); } catch( er ) {
                              api.errorLog( 'populateSavedItemCollection : ' + er );
                        }
                    }
              });

              //check if everything went well
              _.each( _saved_items, function( _item ) {
                    if ( _.isUndefined( _.findWhere( module.itemCollection(), _item.id ) ) ) {
                          throw new Error( 'populateSavedItemCollection : The saved items have not been properly populated in module : ' + module.id );
                    }
              });

              module.trigger( 'items-collection-populated' );
              //do we need to chain this method ?
              //return this;
      },

      // To be overriden
      filterItemCandidatesBeforeInstantiation : function( items ) {
            return items;
      },

      instantiateItem : function( item, is_added_by_user ) {
              var module = this;
              //Prepare the item, make sure its id is set and unique
              item_candidate = module.prepareItemForAPI( item );

              // Display a simple console message if item is null or false, for example if validateItemBeforeInstantiation returned null or false
              if ( ! item_candidate || _.isNull( item_candidate ) ) {
                    api.consoleLog( 'item_candidate invalid. InstantiateItem aborted in module ' + module.id );
                    return;
              }

              //Item id checks !
              if ( ! _.has( item_candidate, 'id' ) ) {
                throw new Error('CZRModule::instantiateItem() : an item has no id and could not be added in the collection of : ' + this.id );
              }
              if ( module.czr_Item.has( item_candidate.id ) ) {
                  throw new Error('CZRModule::instantiateItem() : the following item id ' + item_candidate.id + ' already exists in module.czr_Item() for module ' + this.id  );
              }
              //instanciate the item with the default constructor
              module.czr_Item.add( item_candidate.id, new module.itemConstructor( item_candidate.id, item_candidate ) );

              if ( ! module.czr_Item.has( item_candidate.id ) ) {
                  throw new Error('CZRModule::instantiateItem() : instantiation failed for item id ' + item_candidate.id + ' for module ' + this.id  );
              }
              //the item is now ready and will listen to changes
              //return the instance
              return module.czr_Item( item_candidate.id );
      },



      //@return an API ready item object with the following properties
      // id : '',
      // initial_item_model : {},
      // defaultItemModel : {},
      // control : {},//control instance
      // module : {},//module instance
      // is_added_by_user : false
      prepareItemForAPI : function( item_candidate ) {
              var module = this,
                  api_ready_item = {};
              // if ( ! _.isObject( item_candidate ) ) {
              //       throw new Error('prepareitemForAPI : a item must be an object to be instantiated.');
              // }
              item_candidate = _.isObject( item_candidate ) ? item_candidate : {};

              _.each( module.defaultAPIitemModel, function( _value, _key ) {
                    var _candidate_val = item_candidate[_key];
                    switch( _key ) {
                          case 'id' :
                              // The id can be specified in a module ( ex: the pre defined item ids of the Font Customizer module )
                              // => that's why we need to check here if the item id is not already registered here
                              if ( _.isEmpty( _candidate_val ) ) {
                                    api_ready_item[_key] = module.generateItemId( module.module_type );
                              } else {
                                    if ( module.isItemRegistered( _candidate_val ) ) {
                                          module.generateItemId( _candidate_val );
                                    } else {
                                          api_ready_item[_key] = _candidate_val;
                                    }
                              }
                          break;
                          case 'initial_item_model' :
                              //make sure that the provided item has all the default properties set
                              _.each( module.getDefaultItemModel() , function( _value, _property ) {
                                    if ( ! _.has( item_candidate, _property) )
                                       item_candidate[_property] = _value;
                              });
                              api_ready_item[_key] = item_candidate;

                          break;
                          case  'defaultItemModel' :
                              api_ready_item[_key] = _.clone( module.defaultItemModel );
                          break;
                          case  'control' :
                              api_ready_item[_key] = module.control;
                          break;
                          case  'module' :
                              api_ready_item[_key] = module;
                          break;
                          case 'is_added_by_user' :
                              api_ready_item[_key] =  _.isBoolean( _candidate_val ) ? _candidate_val : false;
                          break;
                    }//switch
              });

              //if we don't have an id at this stage, let's generate it.
              if ( ! _.has( api_ready_item, 'id' ) ) {
                    api_ready_item.id = module.generateItemId( module.module_type );
              }

              //Now amend the initial_item_model with the generated id
              api_ready_item.initial_item_model.id = api_ready_item.id;

              return module.validateItemBeforeInstantiation( api_ready_item );
      },


      // Designed to be overriden in modules
      validateItemBeforeInstantiation : function( api_ready_item ) {
            return api_ready_item;
      },


      // recursive
      // will generate a unique id with the provided prefix
      generateItemId : function( prefix, key, i ) {
              //prevent a potential infinite loop
              i = i || 1;
              if ( i > 100 ) {
                    throw new Error( 'Infinite loop when generating of a module id.' );
              }
              var module = this;
              key = key || module._getNextItemKeyInCollection();
              var id_candidate = prefix + '_' + key;

              //do we have a module collection value ?
              if ( ! _.has( module, 'itemCollection' ) || ! _.isArray( module.itemCollection() ) ) {
                    throw new Error('The item collection does not exist or is not properly set in module : ' + module.id );
              }

              //make sure the module is not already instantiated
              if ( module.isItemRegistered( id_candidate ) ) {
                key++; i++;
                return module.generateItemId( prefix, key, i );
              }
              return id_candidate;
      },


      //helper : return an int
      //=> the next available id of the item collection
      _getNextItemKeyInCollection : function() {
              var module = this,
                _maxItem = {},
                _next_key = 0;

              //get the initial key
              //=> if we already have a collection, extract all keys, select the max and increment it.
              //else, key is 0
              if ( _.isEmpty( module.itemCollection() ) )
                return _next_key;
              if ( _.isArray( module.itemCollection() ) && 1 === _.size( module.itemCollection() ) ) {
                    _maxItem = module.itemCollection()[0];
              } else {
                    _maxItem = _.max( module.itemCollection(), function( _item ) {
                          if ( ! _.isNumber( _item.id.replace(/[^\/\d]/g,'') ) )
                            return 0;
                          return parseInt( _item.id.replace( /[^\/\d]/g, '' ), 10 );
                    });
              }

              //For a single item collection, with an index free id, it might happen that the item is not parsable. Make sure it is. Otherwise, use the default key 0
              if ( ! _.isUndefined( _maxItem ) && _.isNumber( _maxItem.id.replace(/[^\/\d]/g,'') ) ) {
                    _next_key = parseInt( _maxItem.id.replace(/[^\/\d]/g,''), 10 ) + 1;
              }
              return _next_key;
      },



      //this helper allows to check if an item has been registered in the collection
      //no matter if it's not instantiated yet
      isItemRegistered : function( id_candidate ) {
            var module = this;
            return ! _.isUndefined( _.findWhere( module.itemCollection(), { id : id_candidate}) );
      },


      //Fired in module.czr_Item.itemReact
      //@param args can be
      //{
      //  collection : [],
      //  data : data {}
      //},
      //
      //or {
      //  item : {}
      //  data : data {}
      //}
      //if a collection is provided in the passed args then simply refresh the collection
      //=> typically used when reordering the collection item with sortable or when a item is removed
      //
      //the args.data can typically hold informations passed by the input that has been changed and its specific preview transport (can be PostMessage )
      //data looks like :
      //{
      //  module : {}
      //  input_changed     : string input.id
      //  input_transport   : 'postMessage' or '',
      //  not_preview_sent  : bool
      //}
      //@return a deferred promise
      updateItemsCollection : function( args ) {
              var module = this,
                  _current_collection = module.itemCollection(),
                  _new_collection = _.clone(_current_collection),
                  dfd = $.Deferred();

              //if a collection is provided in the passed args then simply refresh the collection
              //=> typically used when reordering the collection item with sortable or when a item is removed
              if ( _.has( args, 'collection' ) ) {
                    //reset the collection
                    module.itemCollection.set( args.collection );
                    return;
              }

              if ( ! _.has( args, 'item' ) ) {
                  throw new Error('updateItemsCollection, no item provided ' + module.control.id + '. Aborting');
              }
              //normalizes with data
              args = _.extend( { data : {} }, args );

              var item_candidate = _.clone( args.item ),
                  hasMissingProperty = false;

              // Is the item well formed ? Does it have all the properties of the default model ?
              // Each module has to declare a defaultItemModel which augments the default one : { id : '', title : '' };
              // Let's loop on the defaultItemModel property and check that none is missing in the candidate
              _.each( module.defaultItemModel, function( itemData, key ) {
                    if ( ! _.has( item_candidate, key ) ) {
                          throw new Error( 'CZRModuleMths => updateItemsCollection : Missing property "' + key + '" for item candidate' );
                    }
              });

              if ( hasMissingProperty )
                return;

              //the item already exist in the collection
              if ( _.findWhere( _new_collection, { id : item_candidate.id } ) ) {
                    _.each( _current_collection , function( _item, _ind ) {
                          if ( _item.id != item_candidate.id )
                            return;

                          //set the new val to the changed property
                          _new_collection[_ind] = item_candidate;
                    });
              }
              //the item has to be added
              else {
                  _new_collection.push( item_candidate );
              }

              //updates the collection value
              //=> is listened to by module.itemCollectionReact
              module.itemCollection.set( _new_collection, args.data );
              return dfd.resolve( { collection : _new_collection, data : args.data } ).promise();
      },



      //fire on sortable() update callback
      //@returns a sorted collection as an array of item objects
      _getSortedDOMItemCollection : function( ) {
              var module = this,
                  _old_collection = _.clone( module.itemCollection() ),
                  _new_collection = [],
                  dfd = $.Deferred();

              //re-build the collection from the DOM
              $( '.' + module.control.css_attr.single_item, module.container ).each( function( _index ) {
                    var _item = _.findWhere( _old_collection, {id: $(this).attr('data-id') });
                    //do we have a match in the existing collection ?
                    if ( ! _item )
                      return;

                    _new_collection[_index] = _item;
              });

              if ( _old_collection.length != _new_collection.length ) {
                  throw new Error('There was a problem when re-building the item collection from the DOM in module : ' + module.id );
              }
              return dfd.resolve( _new_collection ).promise();
      },


      //This method should
      //1) remove the item views
      //2) remove the czr_items instances
      //3) remove the item collection
      //4) re-initialize items
      //5) re-setup the item collection
      //6) re-instantiate the items
      //7) re-render their views
      refreshItemCollection : function() {
            var module = this;
            //Remove item views and instances
            module.czr_Item.each( function( _itm ) {
                  if ( module.czr_Item( _itm.id ).container && 0 < module.czr_Item( _itm.id ).container.length ) {
                        $.when( module.czr_Item( _itm.id ).container.remove() ).done( function() {
                              //Remove item instances
                              module.czr_Item.remove( _itm.id );
                        });
                  }
            });

            // Reset the item collection
            // => the collection listeners will be setup after populate, on 'items-collection-populated'
            module.itemCollection = new api.Value( [] );
            module.populateSavedItemCollection();
      }
});//$.extend//CZRBaseControlMths
})( wp.customize , jQuery, _ );//MULTI CONTROL CLASS
//extends api.CZRBaseControl
//
//Setup the collection of items
//renders the module view
//Listen to items collection changes and update the control setting

var CZRModuleMths = CZRModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRModuleMths, {
      //Returns the default item defined in initialize
      //Each chid class can override the default item and the following method
      getDefaultItemModel : function( id ) {
              var module = this;
              return $.extend( _.clone( module.defaultItemModel ), { id : id || '' } );
      },

      //////////////////////////////////
      ///MODEL HELPERS
      //////////////////////////////////
      //the job of this function is to return a new item ready to be added to the collection
      //the new item shall have a unique id
      //!!recursive
      _initNewItem : function( _item , _next_key ) {
              var module = this,
                  _new_item = { id : '' },
                  _id;

              //get the next available key of the collection
              _next_key = 'undefined' != typeof(_next_key) ? _next_key : _.size( module.itemCollection() );

              if ( _.isNumber(_next_key) ) {
                _id = module.module_type + '_' + _next_key;
              }
              else {
                _id = _next_key;
                //reset next key to 0 in case a recursive loop is needed later
                _next_key = 0;
              }

              if ( _item && ! _.isEmpty( _item) )
                _new_item = $.extend( _item, { id : _id } );
              else
                _new_item = this.getDefaultItemModel( _id );

              //check the id existence, and its unicity
              if ( _.has(_new_item, 'id') && module._isItemIdPossible(_id) ) {
                    //make sure that the provided item has all the default properties set
                    _.map( module.getDefaultItemModel() , function( value, property ){
                          if ( ! _.has(_new_item, property) )
                            _new_item[property] = value;
                    });

                return _new_item;
              }

              //if id already exists, then test a new one
              return module._initNewItem( _new_item, _next_key + 1);
      }
});//$.extend
})( wp.customize , jQuery, _ );//MULTI CONTROL CLASS
//extends api.CZRBaseControl
//
//Setup the collection of items
//renders the module view
//Listen to items collection changes and update the control setting

var CZRModuleMths = CZRModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRModuleMths, {
      //fired on module.isReady.done()
      //the module.container is set. Either as the control.container or the single module wrapper in a sektion
      renderModuleParts : function() {
              var module = this,
                  $_moduleContentEl = module.isInSektion() ? $( module.container ).find('.czr-mod-content') : $( module.container );

              //Crud modules => then let's add the crud module part tmpl
              if ( module.isCrud() ) {
                    //do we have view template script?
                    if ( 0 === $( '#tmpl-' + module.crudModulePart ).length ) {
                      throw new Error('No crud Module Part template for module ' + module.id + '. The template script id should be : #tmpl-' + module.crudModulePart );
                    }

                    //append the module wrapper to the column
                    $_moduleContentEl.append( $( wp.template( module.crudModulePart )( {} ) ) );
              }
              var $_module_items_wrapper = $(
                '<ul/>',
                {
                  class : [
                    module.control.css_attr.items_wrapper,
                    module.module_type,
                    module.isMultiItem() ? 'multi-item-mod' : 'mono-item-mod',
                    module.isCrud() ? 'crud-mod' : 'not-crud-mod'
                  ].join(' ')
                }
              );

              $_moduleContentEl.append($_module_items_wrapper);

              return $( $_module_items_wrapper, $_moduleContentEl );
      },

      //called before rendering a view. Fired in module::renderItemWrapper()
      //can be overridden to set a specific view template depending on the model properties
      //@return string
      //@type can be
      //Read Update Delete (rud...)
      //Read Update (ru)
      //...
      //@item_model is an object describing the current item model
      getTemplateEl : function( type, item_model ) {
              var module = this, _el;
              switch(type) {
                    case 'rudItemPart' :
                      _el = module.rudItemPart;
                      break;
                    case 'ruItemPart' :
                      _el = module.ruItemPart;
                      break;
                    case 'modOptInputList' :
                      _el = module.modOptInputList;
                      break;
                    case 'itemInputList' :
                      _el = _.isFunction( module.itemInputList ) ? module.itemInputList( item_model ) : module.itemInputList;
                      break;
              }
              if ( _.isEmpty(_el) ) {
                   throw new Error('No valid template has been found in getTemplateEl() ' + module.id + '. Aborting');
              } else {
                  return _el;
              }
      },

      //helper
      //get the $ view DOM el from the item id
      getViewEl : function( id ) {
              var module = this;
              return $( '[data-id = "' + id + '"]', module.container );
      },


      //fired on add_item
      //fired on views_sorted
      closeAllItems : function( id ) {
              var module = this,
                  _current_collection = _.clone( module.itemCollection() ),
                  _filtered_collection = _.filter( _current_collection , function( mod) { return mod.id != id; } );

              _.each( _filtered_collection, function( _item ) {
                    if ( module.czr_Item.has(_item.id) && 'expanded' == module.czr_Item(_item.id)._getViewState(_item.id) )
                      module.czr_Item( _item.id ).viewState.set( 'closed' ); // => will fire the cb toggleItemExpansion
              } );
              return this;
      },


      //make sure a given jQuery block is fully visible
      //@param $(el)
      _adjustScrollExpandedBlock : function( $_block_el, adjust ) {
              if ( ! $_block_el.length || _.isUndefined( this.getModuleSection() ) )
                return;
              var module = this,
                   $_moduleSection = $( '.accordion-section-content', module.section.container ),//was api.section( control.section() )
                  _currentScrollTopVal = $_moduleSection.scrollTop(),
                  _scrollDownVal,
                  _adjust = adjust || 90;

              setTimeout( function() {
                    if ( ( $_block_el.offset().top + $_block_el.height() + _adjust ) > $(window.top).height() ) {
                        _scrollDownVal = $_block_el.offset().top + $_block_el.height() + _adjust - $(window.top).height();
                        if ( _scrollDownVal > 0 ) {
                            $_moduleSection.animate({
                                scrollTop:  _currentScrollTopVal + _scrollDownVal
                            }, 500);
                        }
                    }
              }, 50);
      },



      //close alert wrapper
      //+ deactivate the icon
      closeRemoveDialogs : function() {
              var module = this;
              if ( ! _.isArray( module.itemCollection() ) )
                return;

              module.czr_Item.each( function( _item_ ) {
                    _item_.removeDialogVisible( false );
              });

              // $('.' + module.control.css_attr.remove_alert_wrapper, module.container ).each( function() {
              //       if ( $(this).hasClass('open') ) {
              //             $(this).slideToggle( {
              //                   duration : 100,
              //                   done : function() {
              //                     $(this).toggleClass('open' , false );
              //                     //deactivate the icons
              //                     $(this).siblings().find('.' + module.control.css_attr.display_alert_btn).toggleClass('active' , false );
              //                   }
              //             } );
              //       }
              // });
              return this;
      },


      //fired when module.isReady.done
      _makeItemsSortable : function(obj) {
              if ( wp.media.isTouchDevice || ! $.fn.sortable )
                return;
              var module = this;
              $( '.' + module.control.css_attr.items_wrapper, module.container ).sortable( {
                    handle: '.' + module.control.css_attr.item_sort_handle,
                    start: function() {
                          //close the module panel if needed
                          if ( _.has(api, 'czrModulePanelState' ) )
                            api.czrModulePanelState.set(false);
                          //close the sektion settings panel if needed
                          if ( _.has(api, 'czrSekSettingsPanelState' ) )
                            api.czrSekSettingsPanelState.set(false);
                    },
                    update: function( event, ui ) {
                          var _sortedCollectionReact = function() {
                                if ( _.has(module, 'preItem') ) {
                                      module.preItemExpanded.set(false);
                                }

                                module.closeAllItems().closeRemoveDialogs();
                                var refreshPreview = function() {
                                      api.previewer.refresh();
                                };
                                //refreshes the preview frame  :
                                //1) only needed if transport is postMessage, because is triggered by wp otherwise
                                //2) only needed when : add, remove, sort item(s).
                                //var isItemUpdate = ( _.size(from) == _.size(to) ) && ! _.isEmpty( _.difference(from, to) );
                                if ( 'postMessage' == api(module.control.id).transport  && ! api.CZR_Helpers.hasPartRefresh( module.control.id ) ) {
                                      refreshPreview = _.debounce( refreshPreview, 500 );//500ms are enough
                                      refreshPreview();
                                }

                                module.trigger( 'item-collection-sorted' );
                          };
                          module._getSortedDOMItemCollection()
                                .done( function( _collection_ ) {
                                      module.itemCollection.set( _collection_ );
                                })
                                .then( function() {
                                      _sortedCollectionReact();
                                });
                          //refreshes the preview frame, only if the associated setting is a postMessage transport one, with no partial refresh
                          // if ( 'postMessage' == api( module.control.id ).transport && ! api.CZR_Helpers.hasPartRefresh( module.control.id ) ) {
                          //         _.delay( function() { api.previewer.refresh(); }, 100 );
                          // }
                    }//update
                  }
              );
        },



      /*-----------------------------------------------
      * TABS NAVIGATION IN ITEMS AND MODOPT
      ------------------------------------------------*/
      //This method is fired on tab click
      //the @args is the classical DOM listener obj {model : model, dom_el : $_view_el, event : _event, dom_event : e ,refreshed : _refreshed }
      // IMPORTANT : the this is the item or the modopt instance. NOT the module.
      // =>This method has been added to the module constructor to avoid repeating the code in two places because it is used both in items and modOpts
      // @return void()
      toggleTabVisibility : function( args ) {
            var inputParent = this,
                tabs = $( inputParent.container ).find('li'),
                content_items = $( inputParent.container ).find('section'),
                tabIdSwitchedTo = $( args.dom_event.currentTarget, args.dom_el ).attr('data-tab-id');

            $( '.tabs nav li', inputParent.container ).each( function() {
                  $(this).removeClass('tab-current').addClass('tab-inactive');
            });
            $( inputParent.container ).find('li[data-tab-id="' + tabIdSwitchedTo + '"]').addClass('tab-current').removeClass('tab-inactive');

            $( 'section', inputParent.container ).each( function() {
                    $(this).removeClass('content-current');
            });
            $( inputParent.container ).find('section[id="' + tabIdSwitchedTo + '"]').addClass('content-current');
      },

      // @return void()
      // the inputParent.container (item or modOpt) is now available ar this stage
      //  Setup the tabs navigation
      //=> Make sure the first tab is the current visible one
      setupTabNav : function() {
            var inputParent = this,
                preProcessTabs = function() {
                      var dfd = $.Deferred(),
                          $tabs = $( '.tabs nav li', inputParent.container );

                      $tabs.each( function() {
                            $(this).removeClass('tab-current').addClass('tab-inactive');
                      });
                      $tabs.first().addClass( 'tab-current' ).removeClass('tab-inactive');
                      $( 'section', inputParent.container ).first().addClass( 'content-current' );
                      //set the layout class based on the number of tabs
                      var _nb = $tabs.length;
                      $tabs.each( function() {
                            $(this).addClass( _nb > 0 ? 'cols-' + _nb : '' );
                      });
                      return dfd.resolve().promise();
                };
            setTimeout(
                  function() {
                        preProcessTabs().done( function() {
                              $('.tabs', inputParent.container ).fadeIn( 450 );
                        });
                  },
                  20//<= introducing a small delay to let jQuery do its preprocessing job
            );
      }
});//$.extend
})( wp.customize , jQuery, _ );//MULTI CONTROL CLASS
//extends api.CZRModule
//
//Setup the collection of items
//renders the module view
//Listen to items collection changes and update the control setting

var CZRDynModuleMths = CZRDynModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRDynModuleMths, {
      initialize: function( id, options ) {
            var module = this;
            api.CZRModule.prototype.initialize.call( module, id, options );

            //extend the module with new template Selectors
            $.extend( module, {
                itemPreAddEl : ''//is specific for each crud module
            } );

            module.preItemsWrapper = '';//will store the pre items wrapper

            //PRE MODEL VIEW STATE
            // => will control the rendering / destruction of the DOM view
            // => the instantiation / destruction of the input Value collection
            module.preItemExpanded = new api.Value( false );

            //EXTENDS THE DEFAULT MONO MODEL CONSTRUCTOR WITH NEW METHODS
            //=> like remove item
            //module.itemConstructor = api.CZRItem.extend( module.CZRItemDynamicMths || {} );

            //default success message when item added
            module.itemAddedMessage = serverControlParams.i18n.successMessage;

            ////////////////////////////////////////////////////
            /// MODULE DOM EVENT MAP
            ////////////////////////////////////////////////////
            module.userEventMap = new api.Value( [
                  //pre add new item : open the dialog box
                  {
                        trigger   : 'click keydown',
                        selector  : [ '.' + module.control.css_attr.open_pre_add_btn, '.' + module.control.css_attr.cancel_pre_add_btn ].join(','),
                        name      : 'pre_add_item',
                        actions   : [
                              'closeAllItems',
                              'closeRemoveDialogs',
                              // toggles the visibility of the Remove View Block
                              // => will render or destroy the pre item view
                              // @param : obj = { event : {}, item : {}, view : ${} }
                              function(obj) {
                                    var module = this;
                                    module.preItemExpanded.set( ! module.preItemExpanded() );
                              },
                        ],
                  },
                  //add new item
                  {
                        trigger   : 'click keydown',
                        selector  : '.' + module.control.css_attr.add_new_btn, //'.czr-add-new',
                        name      : 'add_item',
                        actions   : [ 'closeRemoveDialogs', 'closeAllItems', 'addItem' ],
                  }
            ]);//module.userEventMap
      },



      //When the control is embedded on the page, this method is fired in api.CZRBaseModuleControl:ready()
      //=> right after the module is instantiated.
      ready : function() {
            var module = this;
            //Setup the module event listeners
            module.setupDOMListeners( module.userEventMap() , { dom_el : module.container } );

            // Pre Item Value => used to store the preItem model
            module.preItem = new api.Value( module.getDefaultItemModel() );

            // Action on pre Item expansion / collapsing
            module.preItemExpanded.callbacks.add( function( isExpanded ) {
                  if ( isExpanded ) {
                        module.renderPreItemView()
                              .done( function( $preWrapper ) {
                                    module.preItemsWrapper = $preWrapper;
                                    //Re-initialize the pre item model
                                    module.preItem( module.getDefaultItemModel() );

                                    module.trigger( 'before-pre-item-input-collection-setup' );
                                    // Setup the pre item input collection from dom
                                    module.setupPreItemInputCollection();

                              })
                              .fail( function( message ) {
                                    api.errorLog( 'Pre-Item : ' + message );
                              });
                  } else {
                        $.when( module.preItemsWrapper.remove() ).done( function() {
                              module.preItem.czr_Input = {};
                              module.preItemsWrapper = null;
                              module.trigger( 'pre-item-input-collection-destroyed' );
                        });
                  }

                  // Expand / Collapse
                  module._togglePreItemViewExpansion( isExpanded );
            });

            api.CZRModule.prototype.ready.call( module );//fires the parent
      },//ready()



      //PRE MODEL INPUTS
      //fired when preItem is embedded.done()
      setupPreItemInputCollection : function() {
            var module = this;

            //Pre item input collection
            module.preItem.czr_Input = new api.Values();

            //creates the inputs based on the rendered items
            $('.' + module.control.css_attr.pre_add_wrapper, module.container)
                  .find( '.' + module.control.css_attr.sub_set_wrapper)
                  .each( function( _index ) {
                        var _id = $(this).find('[data-type]').attr('data-type') || 'sub_set_' + _index;
                        //instantiate the input
                        module.preItem.czr_Input.add( _id, new module.inputConstructor( _id, {//api.CZRInput;
                              id : _id,
                              type : $(this).attr('data-input-type'),
                              container : $(this),
                              input_parent : module.preItem,
                              module : module,
                              is_preItemInput : true
                        } ) );

                        //fire ready once the input Value() instance is initialized
                        module.preItem.czr_Input( _id ).ready();
                  });//each

            module.trigger( 'pre-item-input-collection-ready' );
      },


      // Designed to be overriden in modules
      validateItemBeforeAddition : function( item_candidate ) {
            return item_candidate;
      },


      //Fired on user Dom action.
      //the item is manually added.
      //@return a promise() for future sequential actions
      addItem : function(obj) {
            var module = this,
                item_candidate = module.preItem(),
                collapsePreItem = function() {
                      module.preItemExpanded.set( false );
                      //module.toggleSuccessMessage('off');
                },
                dfd = $.Deferred();

            if ( _.isEmpty(item_candidate) || ! _.isObject(item_candidate) ) {
                  api.errorLog( 'addItem : an item_candidate should be an object and not empty. In : ' + module.id +'. Aborted.' );
                  return dfd.resolve().promise();
            }
            //display a sucess message if item_candidate is successfully instantiated
            collapsePreItem = _.debounce( collapsePreItem, 200 );

            //allow modules to validate the item_candidate before addition
            item_candidate = module.validateItemBeforeAddition( item_candidate );

            // Abort here and display a simple console message if item is null or false, for example if validateItemBeforeAddition returned null or false
            if ( ! item_candidate || _.isNull( item_candidate ) ) {
                  api.consoleLog( 'item_candidate invalid. InstantiateItem aborted in module ' + module.id );
                  return;
            }


            //instantiates and fires ready
            module.instantiateItem( item_candidate, true ).ready(); //true == Added by user

            //this iife job is to close the pre item and to maybe refresh the preview
            //@return a promise(), then once done the item view is expanded to start editing it
            $.Deferred( function() {
                  var _dfd_ = this;
                  module.czr_Item( item_candidate.id ).isReady.then( function() {
                        //module.toggleSuccessMessage('on');
                        collapsePreItem();

                        module.trigger('item-added', item_candidate );

                        var resolveWhenPreviewerReady = function() {
                              api.previewer.unbind( 'ready', resolveWhenPreviewerReady );
                              _dfd_.resolve();
                        };
                        //module.doActions( 'item_added_by_user' , module.container, { item : item_candidate , dom_event : obj.dom_event } );

                        //refresh the preview frame (only needed if transport is postMessage && has no partial refresh set )
                        //must be a dom event not triggered
                        //otherwise we are in the init collection case where the items are fetched and added from the setting in initialize
                        if ( 'postMessage' == api(module.control.id).transport && _.has( obj, 'dom_event') && ! _.has( obj.dom_event, 'isTrigger' ) && ! api.CZR_Helpers.hasPartRefresh( module.control.id ) ) {
                              // api.previewer.refresh().done( function() {
                              //       _dfd_.resolve();
                              // });
                              // It would be better to wait for the refresh promise
                              api.previewer.bind( 'ready', resolveWhenPreviewerReady );
                              api.previewer.refresh();
                        } else {
                              _dfd_.resolve();
                        }
                  });
            }).done( function() {
                    module.czr_Item( item_candidate.id ).viewState( 'expanded' );
            }).always( function() {
                    dfd.resolve();
            });
            return dfd.promise();
      }
});//$.extend
})( wp.customize , jQuery, _ );//MULTI CONTROL CLASS
//extends api.CZRBaseControl
//
//Setup the collection of items
//renders the module view
//Listen to items collection changes and update the module setting

var CZRDynModuleMths = CZRDynModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRDynModuleMths, {
      //////////////////////////////////////////////////
      /// PRE ADD MODEL DIALOG AND VIEW
      //////////////////////////////////////////////////
      renderPreItemView : function( obj ) {
              var module = this, dfd = $.Deferred();
              //is this view already rendered ?
              if ( _.isObject( module.preItemsWrapper ) && 0 < module.preItemsWrapper.length ) //was ! _.isEmpty( module.czr_preItem('item_content')() ) )
                return dfd.resolve( module.preItemsWrapper ).promise();

              //do we have view template script?
              if ( ! _.has(module, 'itemPreAddEl') ||  0 === $( '#tmpl-' + module.itemPreAddEl ).length )
                return dfd.reject( 'Missing itemPreAddEl or template ').promise();

              //print the html
              var pre_add_template = wp.template( module.itemPreAddEl );

              //do we have an html template and a module container?
              if ( ! pre_add_template  || ! module.container )
                return dfd.reject( 'Missing html template ').promise();

              var $_pre_add_el = $('.' + module.control.css_attr.pre_add_item_content, module.container );

              $_pre_add_el.prepend( $('<div>', { class : 'pre-item-wrapper'} ) );
              $_pre_add_el.find('.pre-item-wrapper').append( pre_add_template() );

              //say it
              return dfd.resolve( $_pre_add_el.find('.pre-item-wrapper') ).promise();
      },

      //@return $ el of the pre Item view
      _getPreItemView : function() {
              var module = this;
              return $('.' +  module.control.css_attr.pre_add_item_content, module.container );
      },


      //callback of module.preItemExpanded
      //@_is_expanded = boolean.
      _togglePreItemViewExpansion : function( _is_expanded ) {
              var module = this,
                $_pre_add_el = $( '.' +  module.control.css_attr.pre_add_item_content, module.container );

              //toggle it
              $_pre_add_el.slideToggle( {
                    duration : 200,
                    done : function() {
                          var $_btn = $( '.' +  module.control.css_attr.open_pre_add_btn, module.container );

                          $(this).toggleClass('open' , _is_expanded );
                          //switch icons
                          if ( _is_expanded )
                            $_btn.find('.fas').removeClass('fa-plus-square').addClass('fa-minus-square');
                          else
                            $_btn.find('.fas').removeClass('fa-minus-square').addClass('fa-plus-square');

                          //set the active class to the btn
                          $_btn.toggleClass( 'active', _is_expanded );

                          //set the adding_new class to the module container wrapper
                          $( module.container ).toggleClass(  module.control.css_attr.adding_new, _is_expanded );
                          //make sure it's fully visible
                          module._adjustScrollExpandedBlock( $(this), 120 );
                  }//done
              } );
      },


      toggleSuccessMessage : function( status ) {
              var module = this,
                  _message = module.itemAddedMessage,
                  $_pre_add_wrapper = $('.' + module.control.css_attr.pre_add_wrapper, module.container );
                  $_success_wrapper = $('.' + module.control.css_attr.pre_add_success, module.container );

              if ( 'on' == status ) {
                  //write message
                  $_success_wrapper.find('p').text(_message);

                  //set various properties
                  $_success_wrapper.css('z-index', 1000001 )
                    .css('height', $_pre_add_wrapper.height() + 'px' )
                    .css('line-height', $_pre_add_wrapper.height() + 'px');
              } else {
                  $_success_wrapper.attr('style','');
              }
              module.container.toggleClass('czr-model-added', 'on' == status );
              return this;
      }
});//$.extend//CZRBaseControlMths
})( wp.customize , jQuery, _ );//BASE CONTROL CLASS
//extends api.Control
//define a set of methods, mostly helpers, to extend the base WP control class
//this will become our base constructor for main complex controls
//EARLY SETUP

var CZRBaseControlMths = CZRBaseControlMths || {};
( function ( api, $, _ ) {
$.extend( CZRBaseControlMths, {
      initialize: function( id, options ) {
            var control = this;
            //add a shortcut to the css properties declared in the php controls
            control.css_attr = _.has( serverControlParams , 'css_attr') ? serverControlParams.css_attr : {};
            api.Control.prototype.initialize.call( control, id, options );

            //When a partial refresh is done we need to send back all postMessage input to the preview
            //=> makes sure that all post message inputs not yet saved in db are properly applied
            control.bind( 'czr-partial-refresh-done', function() {
                  if ( _.has( control, 'czr_moduleCollection' ) ) {
                        _.each( control.czr_moduleCollection(), function( _mod_ ) {
                              if ( ! control.czr_Module( _mod_.id ) )
                                return;

                              control.czr_Module( _mod_.id ).sendModuleInputsToPreview( { isPartialRefresh : true } );
                        });
                  }
            });
      },

      //@return void()
      refreshPreview : function( obj ) {
            this.previewer.refresh();
      }
});//$.extend//CZRBaseControlMths
})( wp.customize , jQuery, _ );
//BASE CONTROL CLASS
//extends api.CZRBaseControl
//define a set of methods, mostly helpers, to extend the base WP control class
//this will become our base constructor for main complex controls
//EARLY SETUP
var CZRBaseModuleControlMths = CZRBaseModuleControlMths || {};
( function ( api, $, _ ) {
$.extend( CZRBaseModuleControlMths, {
      initialize: function( id, options ) {
              var control = this;

              control.czr_Module = new api.Values();

              //czr_collection stores the module collection
              control.czr_moduleCollection = new api.Value();
              control.czr_moduleCollection.set([]);

              //let's store the state of the initial module collection
              control.moduleCollectionReady = $.Deferred();
              //and listen to changes when it's ready
              control.moduleCollectionReady.done( function( obj ) {
                    if ( ! control.isMultiModuleControl( options ) ) {
                      //api.consoleLog('MODULE COLLECTION READY IN CONTROL : ', control.id , obj.id, control.isModuleRegistered( obj.id ) );
                    }
                    //if the module is not registered yet for a single module control
                    //=> push it to the collection now, before listening to the module collection changes
                    // if (  ! control.isModuleRegistered( module.id ) ) {
                    //     control.updateModulesCollection( { module : constructorOptions } );
                    // }

                    //LISTEN TO MODULE COLLECTION
                    control.czr_moduleCollection.callbacks.add( function() { return control.moduleCollectionReact.apply( control, arguments ); } );

                    //control.removeModule( _mod );
              } );

              //FOR MULTI MODULE CONTROL : Stores the module instance of the synchronized sektion
              if ( control.isMultiModuleControl( options ) ) {
                    control.syncSektionModule = new api.Value();
              }

              api.CZRBaseControl.prototype.initialize.call( control, id, options );

              //FOR TEST PURPOSES
              // api(this.id).bind( function( to, from) {
              //     api.consoleLog( 'SETTING ', control.id, ' HAS CHANGED : ', to, from );
              // });

              //close any open item and dialog boxes on section expansion
              api.section( control.section() ).expanded.bind(function(to) {
                    control.czr_Module.each( function( _mod ){
                          _mod.closeAllItems().closeRemoveDialogs();
                          if ( _.has( _mod, 'preItem' ) ) {
                                _mod.preItemExpanded(false);
                          }
                    });
              });

      },




      //////////////////////////////////
      ///READY = CONTROL INSTANTIATED AND DOM ELEMENT EMBEDDED ON THE PAGE
      ///FIRED BEFORE API READY
      //////////////////////////////////
      ready : function() {
              var control = this;
              if ( control.isMultiModuleControl() ) {
                    //POPULATE THE SAVED MODULE COLLECTION WHEN THE SYNCHRONIZED SEKTIONS SETTING HAS PROVIDED ITS INSTANCE
                    control.syncSektionModule.bind( function( sektion_module_instance, from) {
                          if ( 'resolved' == control.moduleCollectionReady.state() )
                            return;
                          control.registerModulesOnInit( sektion_module_instance );
                          //the module collection is ready
                          control.moduleCollectionReady.resolve();
                    });
              } else {
                    var single_module = {};
                    //inits the collection with the saved module => there's only one module to instantiate in this case.
                    //populates the collection with the saved module
                    _.each( control.getSavedModules() , function( _mod, _key ) {
                        //stores it
                        single_module = _mod;

                        //adds it to the collection
                        //=> it will be fired ready usually when the control section is expanded
                        if ( serverControlParams.isDevMode ) {
                              control.instantiateModule( _mod, {} );
                        } else {
                              try { control.instantiateModule( _mod, {} ); } catch( er ) {
                                    api.errorLog( 'Failed to instantiate module ' + _mod.id + ' ' + er );
                                    return;
                              }
                        }

                        //adds the module name to the control container element
                        control.container.attr('data-module', _mod.id );
                    });
                    //the module collection is ready
                    control.moduleCollectionReady.resolve( single_module );
              }


              //LISTEN TO MODULE CANDIDATES ADDED BY USERS
              control.bind( 'user-module-candidate', function( _module ) {
                    var module;
                    //instanciate + fire ready()
                    //=> the module will be added in the collection on isReady.done()
                    try {
                          module = control.instantiateModule( _module, {} ); //module, constructor
                    } catch( er ) {
                          api.errorLog( 'Failed to instantiate module ' + _module.id + ' ' + er );
                          return;
                    }
                    //If everything went fine, fires ready
                    module.ready( _module.is_added_by_user );
              });
      },









      //////////////////////////////////
      /// VARIOUS HELPERS
      //////////////////////////////////
      ///
      //@return the default API model {} needed to instantiate a module
      //Depending on the module context, control or sektion, the default model has to hold different properties
      getDefaultModuleApiModel : function() {
              //Modules share the common model either they are in a sektion or in a control
              var commonAPIModel = {
                    id : '',//module.id,
                    module_type : '',//module.module_type,
                    modOpt : {},//the module modOpt property, typically high level properties that area applied to all items of the module
                    items   : [],//$.extend( true, {}, module.items ),
                    crud : false,
                    multi_item : false,
                    sortable : false,//<= a module can be multi-item but not necessarily sortable
                    control : {},//control,
              };

              //if embedded in a control, amend the common model with the section id
              if ( ! this.isMultiModuleControl() ) {
                  return $.extend( commonAPIModel, {
                      section : ''//id of the control section
                  } );
              } else {
                  return $.extend( commonAPIModel, {
                      column_id : '',//a string like col_7
                      sektion : {},// => the sektion instance
                      sektion_id : '',
                      is_added_by_user : false,
                      dirty : false
                  } );
              }
      },

      //@return the default DB model {} that will be used when the setting will send the ajax save request
      //Depending on the module context, control or sektion, the default DB model has to hold different properties
      getDefaultModuleDBModel : function() {
              var commonDBModel = {
                    items   : [],//$.extend( true, {}, module.items ),
              };

              //if embedded in a sektion, we need more the item(s) collection
              if ( this.isMultiModuleControl() ) {
                  return $.extend( commonDBModel, {
                      id : '',
                      module_type : '',
                      column_id : '',
                      sektion_id : '',
                      dirty : false
                  } );
              } else {
                  return commonDBModel;
              }
      },


      //@return bool
      //@param options is optional.
      //Passed when first invoked in the constructor.
      //Once the control is instantiated, we can access the options from the instance
      isMultiModuleControl : function( options ) {
              var _type, control = this;
              //since WP v4.9, the control options are not wrapper in the params property but passed directly instead.
              if ( _.isUndefined( options ) ){
                  _type = _.has( control, 'params') ? control.params.type : control.type;
              } else {
                  _type = _.has( options, 'params') ? options.params.type : options.type;
              }
              return 'czr_multi_module' == _type;
      },


      //@return the control instance of the synchronized collection of modules
      getSyncCollectionControl : function() {
            var control = this;
            if ( _.isUndefined( control.params.syncCollection ) ) {
                throw new Error( 'Control ' + control.id + ' has no synchronized sektion control defined.');
            }
            return api.control( api.CZR_Helpers.build_setId( control.params.syncCollection ) );
      },


      //@return the collection [] of saved module(s) to instantiate
      //This method does not make sure that the module model is ready for API.
      //=> it just returns an array of saved module candidates to instantiate.
      //
      //Before instantiation, we will make sure that all required property are defined for the modules with the method control.prepareModuleForAPI()
      // control     : control,
      // crud        : bool
      // id          : '',
      // items       : [], module.items,
      // modOpt       : {}
      // module_type : module.module_type,
      // multi_item  : bool
      // section     : module.section,
      // is_added_by_user : is_added_by_user || false
      getSavedModules : function() {
              var control = this,
                  _savedModulesCandidates = [],
                  _module_type = control.params.module_type,
                  _raw_saved_module_val = [],
                  _saved_items = [],
                  _saved_modOpt = {};

              //In the case of multi module control synchronized with a sektion
              // => the saved modules is a collection saved in the setting
              //For a module embedded in a regular control, we need to hard code the single module collection
              // => in this case, the corresponding setting will store the collection of item(s)
              if ( control.isMultiModuleControl() ) {
                  _savedModulesCandidates = $.extend( true, [], api( control.id )() );//deep clone
              } else {
                  //What is the current server saved value for this setting?
                  //in a normal case, it should be an array of saved properties
                  //But it might not be if coming from a previous option system.
                  //=> let's normalize it.
                  //First let's perform a quick check on the current saved db val.
                  //If the module is not multi-item, the saved value should be an object or empty if not set yet
                  if ( api.CZR_Helpers.isMultiItemModule( _module_type ) && ! _.isEmpty( api( control.id )() ) && ! _.isObject( api( control.id )() ) ) {
                      api.consoleLog('Module Control Init for ' + control.id + '  : a mono item module control value should be an object if not empty.');
                  }

                  //SPLIT ITEMS [] and MODOPT {}
                  //In database, items and modOpt are saved in the same option array.
                  //If the module has modOpt ( the slider module for example ), the modOpt are described by an object which is always unshifted at the beginning of the setting value.

                  //the raw DB setting value is an array :  modOpt {} + the saved items :
                  ////META IS THE FIRST ARRAY ELEMENT: A modOpt has no unique id and has the property is_modOpt set to true
                  //[
                  //  is_mod_opt : true //<= inform us that this is not an item but a modOpt
                  //],
                  ////THEN COME THE ITEMS
                  //[
                  //  id : "czr_slide_module_0"
                  //     slide-background : 21,
                  //     ....
                  //   ],
                  //   [
                  // id : "czr_slide_module_1"
                  //     slide-background : 21,
                  //     ....
                  //   ]
                  //  [...]

                  //POPULATE THE ITEMS [] and the MODOPT {} FROM THE RAW DB SAVED SETTING VAL
                  var settingId = api.CZR_Helpers.getControlSettingId( control.id );
                  _raw_saved_module_val = _.isArray( api( settingId )() ) ? api( settingId )() : [ api( settingId )() ];

                  _.each( _raw_saved_module_val, function( item_or_mod_opt_candidate , key ) {
                        if ( api.CZR_Helpers.hasModuleModOpt( _module_type ) && 0*0 === key ) {
                              // a saved module mod_opt object should not have an id
                              if ( _.has( item_or_mod_opt_candidate, 'id') ) {
                                    api.consoleLog( 'getSavedModules : the module ' + _module_type + ' in control ' + control.id + ' has no mod_opt defined while it should.' );
                              } else {
                                    _saved_modOpt = item_or_mod_opt_candidate;
                              }
                        }
                        if ( _.has( item_or_mod_opt_candidate, 'id') && ! _.has( item_or_mod_opt_candidate, 'is_mod_opt' ) ) {
                              _saved_items.push( item_or_mod_opt_candidate );
                        }
                  });


                  //for now this is a collection with one module
                  _savedModulesCandidates.push(
                        {
                              id : api.CZR_Helpers.getOptionName( control.id ) + '_' + control.params.type,
                              module_type : control.params.module_type,
                              section : control.section(),
                              modOpt : $.extend( true, {} , _saved_modOpt ),//disconnect with a deep cloning
                              items : $.extend( true, [] , _saved_items )//disconnect with a deep cloning
                        }
                  );
              }
              return _savedModulesCandidates;
      },


      //this helper allows to check if a module has been registered in the collection
      //no matter if it's not instantiated yet
      isModuleRegistered : function( id_candidate ) {
            var control = this;
            return ! _.isUndefined( _.findWhere( control.czr_moduleCollection(), { id : id_candidate}) );
      }
});//$.extend//CZRBaseControlMths
})( wp.customize , jQuery, _ );
//BASE CONTROL CLASS
//extends api.CZRBaseControl
//define a set of methods, mostly helpers, to extend the base WP control class
//this will become our base constructor for main complex controls
//EARLY SETUP
var CZRBaseModuleControlMths = CZRBaseModuleControlMths || {};
( function ( api, $, _ ) {
$.extend( CZRBaseModuleControlMths, {
      //@param : module {}
      //@param : constructor string
      instantiateModule : function( module, constructor ) {
              if ( ! _.has( module,'id') ) {
                throw new Error('CZRModule::instantiateModule() : a module has no id and could not be added in the collection of : ' + this.id +'. Aborted.' );
              }
              var control = this;
              //is a constructor provided ?
              //if not try to look in the module object if we an find one
              if ( _.isUndefined(constructor) || _.isEmpty(constructor) ) {
                  constructor = control.getModuleConstructor( module );
              }
              //on init, the module collection is populated with module already having an id
              //For now, let's check if the id is empty and is not already part of the collection.
              //@todo : improve this.
              if ( ! _.isEmpty( module.id ) && control.czr_Module.has( module.id ) ) {
                    throw new Error('The module id already exists in the collection in control : ' + control.id );
              }

              var module_api_ready = control.prepareModuleForAPI( module );

              //instanciate the module with the default constructor
              control.czr_Module.add( module_api_ready.id, new constructor( module_api_ready.id, module_api_ready ) );

              if ( ! control.czr_Module.has( module_api_ready.id ) ) {
                  throw new Error('instantiateModule() : instantiation failed for module id ' + module_api_ready.id + ' in control ' + control.id  );
              }
              //return the module instance for chaining
              return control.czr_Module(module_api_ready.id);
      },



      //@return a module constructor object
      getModuleConstructor : function( module ) {
              var control = this,
                  parentConstructor = {},
                  constructor = {};

              if ( ! _.has( module, 'module_type' ) ) {
                  throw new Error('CZRModule::getModuleConstructor : no module type found for module ' + module.id );
              }
              if ( ! _.has( api.czrModuleMap, module.module_type ) ) {
                  throw new Error('Module type ' + module.module_type + ' is not listed in the module map api.czrModuleMap.' );
              }

              var _mthds = api.czrModuleMap[ module.module_type ].mthds,
                  _is_crud = api.czrModuleMap[ module.module_type ].crud,
                  _base_constructor = _is_crud ? api.CZRDynModule : api.CZRModule;

              //in the general case of multi_module / sektion control, we need to extend the module constructors
              if ( ! _.isEmpty( module.sektion_id ) ) {
                  parentConstructor = _base_constructor.extend( _mthds );
                  constructor = parentConstructor.extend( control.getMultiModuleExtender( parentConstructor ) );
              } else {
                //in the particular case of a module embedded in a control, the constructor is ready to be fired.
                  constructor = _base_constructor.extend( _mthds );
              }

              if ( _.isUndefined(constructor) || _.isEmpty(constructor) || ! constructor ) {
                  throw new Error('CZRModule::getModuleConstructor : no constructor found for module type : ' + module.module_type +'.' );
              }
              return constructor;
      },





      //@return an API ready module object
      //To be instantiated in the API, the module model must have all the required properties defined in the defaultAPIModel properly set
      prepareModuleForAPI : function( module_candidate ) {
            if ( ! _.isObject( module_candidate ) ) {
                throw new Error('prepareModuleForAPI : a module must be an object to be instantiated.');
            }

            var control = this,
                api_ready_module = {};

            _.each( control.getDefaultModuleApiModel() , function( _value, _key ) {
                  var _candidate_val = module_candidate[_key];
                  switch( _key ) {
                        //PROPERTIES COMMON TO ALL MODULES IN ALL CONTEXTS
                        case 'id' :
                              if ( _.isEmpty( _candidate_val ) ) {
                                    api_ready_module[_key] = control.generateModuleId( module_candidate.module_type );
                              } else {
                                    api_ready_module[_key] = _candidate_val;
                              }
                        break;
                        case 'module_type' :
                              if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                    throw new Error('prepareModuleForAPI : a module type must a string not empty');
                              }
                              api_ready_module[_key] = _candidate_val;
                        break;
                        case 'items' :
                              if ( ! _.isArray( _candidate_val )  ) {
                                    throw new Error('prepareModuleForAPI : a module item list must be an array');
                              }
                              api_ready_module[_key] = _candidate_val;
                        break;
                        case 'modOpt' :
                              if ( ! _.isObject( _candidate_val )  ) {
                                    throw new Error('prepareModuleForAPI : a module modOpt property must be an object');
                              }
                              api_ready_module[_key] = _candidate_val;
                        break;
                        case 'crud' :
                              //get the value from the czrModuleMap
                              if ( _.has( api.czrModuleMap, module_candidate.module_type ) ) {
                                    _candidate_val = api.czrModuleMap[ module_candidate.module_type ].crud;
                              } else if ( ! _.isUndefined( _candidate_val) && ! _.isBoolean( _candidate_val )  ) {
                                    throw new Error('prepareModuleForAPI : the module param "crud" must be a boolean');
                              }
                              api_ready_module[_key] = _candidate_val || false;
                        break;
                        case 'multi_item' :
                              //get the value from the czrModuleMap
                              if ( _.has( api.czrModuleMap, module_candidate.module_type ) ) {
                                    _candidate_val = api.czrModuleMap[ module_candidate.module_type ].crud || api.czrModuleMap[ module_candidate.module_type ].multi_item;
                              } else if ( ! _.isUndefined( _candidate_val) && ! _.isBoolean( _candidate_val )  ) {
                                    throw new Error('prepareModuleForAPI : the module param "multi_item" must be a boolean');
                              }
                              api_ready_module[_key] = _candidate_val || false;
                        break;
                        //if the sortable property is not set, then check if crud or multi-item
                        case 'sortable' :
                              //get the value from the czrModuleMap
                              if ( _.has( api.czrModuleMap, module_candidate.module_type ) ) {
                                    _candidate_val = api.czrModuleMap[ module_candidate.module_type ].sortable || api.czrModuleMap[ module_candidate.module_type ].crud || api.czrModuleMap[ module_candidate.module_type ].multi_item;
                              } else if ( ! _.isUndefined( _candidate_val) && ! _.isBoolean( _candidate_val )  ) {
                                    throw new Error('prepareModuleForAPI : the module param "sortable" must be a boolean');
                              }
                              api_ready_module[_key] = _candidate_val || false;
                        break;
                        case  'control' :
                              api_ready_module[_key] = control;//this
                        break;



                        //PROPERTIES FOR MODULE EMBEDDED IN A CONTROL
                        case  'section' :
                              if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                    throw new Error('prepareModuleForAPI : a module section must be a string not empty');
                              }
                              api_ready_module[_key] = _candidate_val;
                        break;



                        //PROPERTIES FOR MODULE EMBEDDED IN A SEKTION
                        case  'column_id' :
                              if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                    throw new Error('prepareModuleForAPI : a module column id must a string not empty');
                              }
                              api_ready_module[_key] = _candidate_val;
                        break;
                        case  'sektion' :
                              if ( ! _.isObject( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                    throw new Error('prepareModuleForAPI : a module sektion must be an object not empty');
                              }
                              api_ready_module[_key] = _candidate_val;
                        break;
                        case  'sektion_id' :
                              if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                    throw new Error('prepareModuleForAPI : a module sektion id must be a string not empty');
                              }
                              api_ready_module[_key] = _candidate_val;
                        break;
                        case 'is_added_by_user' :
                              if ( ! _.isUndefined( _candidate_val) && ! _.isBoolean( _candidate_val )  ) {
                                    throw new Error('prepareModuleForAPI : the module param "is_added_by_user" must be a boolean');
                              }
                            api_ready_module[_key] = _candidate_val || false;
                        break;
                        case 'dirty' :
                              api_ready_module[_key] = _candidate_val || false;
                        break;
                  }//switch
            });
            return api_ready_module;
      },


      //recursive
      generateModuleId : function( module_type, key, i ) {
              //prevent a potential infinite loop
              i = i || 1;
              if ( i > 100 ) {
                    throw new Error('Infinite loop when generating of a module id.');
              }
              var control = this;
              key = key || control._getNextModuleKeyInCollection();
              var id_candidate = module_type + '_' + key;

              //do we have a module collection value ?
              if ( ! _.has(control, 'czr_moduleCollection') || ! _.isArray( control.czr_moduleCollection() ) ) {
                    throw new Error('The module collection does not exist or is not properly set in control : ' + control.id );
              }

              //make sure the module is not already instantiated
              if ( control.isModuleRegistered( id_candidate ) ) {
                key++; i++;
                return control.generateModuleId( module_type, key, i );
              }

              return id_candidate;
      },


      //helper : return an int
      //=> the next available id of the module collection
      _getNextModuleKeyInCollection : function() {
              var control = this,
                _max_mod_key = {},
                _next_key = 0;

              //get the initial key
              //=> if we already have a collection, extract all keys, select the max and increment it.
              //else, key is 0
              if ( ! _.isEmpty( control.czr_moduleCollection() ) ) {
                  _max_mod_key = _.max( control.czr_moduleCollection(), function( _mod ) {
                      return parseInt( _mod.id.replace(/[^\/\d]/g,''), 10 );
                  });
                  _next_key = parseInt( _max_mod_key.id.replace(/[^\/\d]/g,''), 10 ) + 1;
              }
              return _next_key;
      }
});//$.extend//CZRBaseControlMths
})( wp.customize , jQuery, _ );
//BASE CONTROL CLASS
//extends api.CZRBaseControl
//define a set of methods, mostly helpers, to extend the base WP control class
//this will become our base constructor for main complex controls
//EARLY SETUP
var CZRBaseModuleControlMths = CZRBaseModuleControlMths || {};
( function ( api, $, _ ) {
$.extend( CZRBaseModuleControlMths, {
      //Multi Module method
      //fired when the main sektion module has synchronised its if with the module-collection control
      registerModulesOnInit : function( sektion_module_instance ) {
              var control = this,
                  _orphan_mods = [];

              _.each( control.getSavedModules() , function( _mod, _key ) {
                      //a module previously embedded in a deleted sektion must not be registered
                      if ( ! sektion_module_instance.czr_Item.has( _mod.sektion_id ) ) {
                            api.errorLog( 'Warning Module ' + _mod.id + ' is orphan : it has no sektion to be embedded to. It Must be removed.');
                            _orphan_mods.push(_mod);
                            return;
                      }
                      //@todo handle the case of a module embedded in a previously deleted column
                      //=> register it in the first column of the sektion ?

                      var _sektion = sektion_module_instance.czr_Item( _mod.sektion_id );

                      if ( _.isUndefined( _sektion ) ) {
                            throw new Error( 'sektion instance missing. Impossible to instantiate module : ' + _mod.id );
                      }

                      //add the sektion instance before update the api collection
                      $.extend( _mod, {sektion : _sektion} );

                      //push it to the collection of the module-collection control
                      //=> the instantiation will take place later, on column instantiation
                      control.updateModulesCollection( {module : _mod } );
              });

              //REMOVE ORPHAN MODULES ON INIT
              //But only when the module collectionn has been resolved
              control.moduleCollectionReady.then( function() {
                    //if there are some orphans mods, the module-collection setting must be updated now.
                    if ( ! _.isEmpty( _orphan_mods ) ) {
                        control.moduleCollectionReact( control.czr_moduleCollection(), [], { orphans_module_removal : _orphan_mods } );
                    }
              });
      },



      //@return void()
      //@param obj can be { collection : []}, or { module : {} }
      //Can be called :
      //1) for multimodule control, in register modules on init, when the main sektion module has synchronised with the module-collection control
      //2) for all modules, in module.isReady.done() if the module is not registered in the collection yet.
      //3) for all modules on moduleReact ( module.callbacks )
      //
      //=> sets the setting value via the module collection !
      updateModulesCollection : function( obj ) {
              var control = this,
                  _current_collection = control.czr_moduleCollection(),
                  _new_collection = $.extend( true, [], _current_collection);

              //if a collection is provided in the passed obj then simply refresh the collection
              //=> typically used when reordering the collection module with sortable or when a module is removed
              if ( _.has( obj, 'collection' ) ) {
                    //reset the collection
                    control.czr_moduleCollection.set( obj.collection, obj.data || {} );
                    return;
              }

              if ( ! _.has(obj, 'module') ) {
                throw new Error('updateModulesCollection, no module provided ' + control.id + '. Aborting');
              }

              //normalizes the module for the API
              var module_api_ready = control.prepareModuleForAPI( _.clone( obj.module ) );

              //the module already exist in the collection
              if ( _.findWhere( _new_collection, { id : module_api_ready.id } ) ) {
                    _.each( _current_collection , function( _elt, _ind ) {
                          if ( _elt.id != module_api_ready.id )
                            return;

                          //set the new val to the changed property
                          _new_collection[_ind] = module_api_ready;
                    });
              }
              //the module has to be added
              else {
                    _new_collection.push( module_api_ready );
              }

              //WHAT ARE THE PARAMS WE WANT TO PASS TO THE NEXT ACTIONS
              var _params = {};
              //if a data property has been passed,
              //amend the data property with the changed module
              if ( _.has( obj, 'data') ) {
                  _params = $.extend( true, {}, obj.data );
                  $.extend( _params, { module : module_api_ready } );
              }
              //Inform the collection
              control.czr_moduleCollection.set( _new_collection, _params );
      },






      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////// WHERE THE STREETS HAVE NO NAMES //////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //cb of control.czr_moduleCollection.callbacks
      //@data is an optional object. { silent : true }
      moduleCollectionReact : function( to, from, data ) {
            var control = this,
                is_module_added = _.size(to) > _.size(from),
                is_module_removed = _.size(from) > _.size(to),
                is_module_update = _.size(from) == _.size(to);
                is_collection_sorted = false;

            //MODULE REMOVED
            //Remove the module instance if needed
            if ( is_module_removed ) {
                  //find the module to remove
                  var _to_remove = _.filter( from, function( _mod ){
                      return _.isUndefined( _.findWhere( to, { id : _mod.id } ) );
                  });
                  _to_remove = _to_remove[0];
                  control.czr_Module.remove( _to_remove.id );
            }

            //is there a passed module param ?
            //if so prepare it for DB
            //if a module is provided, we also want to pass its id to the preview => can be used to target specific selectors in a partial refresh scenario
            if ( _.isObject( data  ) && _.has( data, 'module' ) ) {
                  data.module_id = data.module.id;
                  data.module = control.prepareModuleForDB( $.extend( true, {}, data.module  ) );
            }

            //Inform the the setting
            //If we are in a single module control (not a sektion, multimodule)
            //AND that the module is being added to the collection for the first time,
            //We don't want to say it to the setting, because it might alter the setting dirtyness for nothing on init.
            if ( ! control.isMultiModuleControl() && is_module_added ) {
                  return;
            }
            else {
                  //control.filterModuleCollectionBeforeAjax( to ) returns an array of items
                  //if the module has modOpt, the modOpt object is always added as the first element of the items array (unshifted)
                  api( this.id )
                        .set( control.filterModuleCollectionBeforeAjax( to ), data );
                        //.done( function( to, from, o ) {});
            }
      },
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////// WHERE THE STREETS HAVE NO NAMES //////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









      //an overridable method to act on the collection just before it is ajaxed
      //@return the collection array
      filterModuleCollectionBeforeAjax : function( collection ) {
              var control = this,
                  _filtered_collection = $.extend( true, [], collection ),
                  itemsToReturn;

              _.each( collection , function( _mod, _key ) {
                    var db_ready_mod = $.extend( true, {}, _mod );
                    _filtered_collection[_key] = control.prepareModuleForDB( db_ready_mod );
              });

              //we don't want to save the same things if we the modules are embedded in a control or in a sektion
              //=> in a sektion : we save the collection of modules
              //=> in a control : we save
              //1) the collection of item(s)
              //2) the modOpt
              if ( control.isMultiModuleControl() ) {
                    return _filtered_collection;
              } else {
                    //at this point we should be in the case of a single module collection, typically use to populate a regular setting
                    if ( _.size( collection ) > 1 ) {
                      throw new Error('There should not be several modules in the collection of control : ' + control.id );
                    }
                    if ( ! _.isArray( collection ) || _.isEmpty( collection ) || ! _.has( collection[0], 'items' ) ) {
                      throw new Error('The setting value could not be populated in control : ' + control.id );
                    }
                    var module_id = collection[0].id;

                    if ( ! control.czr_Module.has( module_id ) ) {
                       throw new Error('The single module control (' + control.id + ') has no module registered with the id ' + module_id  );
                    }
                    var module_instance = control.czr_Module( module_id );
                    if ( ! _.isArray( module_instance().items ) ) {
                      throw new Error('The module ' + module_id + ' should be an array in control : ' + control.id );
                    }

                    //items
                    itemsToReturn = module_instance.isMultiItem() ? module_instance().items : ( module_instance().items[0] || [] );
                    itemsToReturn = module_instance.filterItemsBeforeCoreApiSettingValue( itemsToReturn );

                    //Add the modOpt if any
                    return module_instance.hasModOpt() ? _.union( [ module_instance().modOpt ] , itemsToReturn ) : itemsToReturn;
              }
      },


      //fired before adding a module to the collection of DB candidates
      //the module must have the control.getDefaultModuleDBModel structure :
      prepareModuleForDB : function ( module_db_candidate ) {
            if ( ! _.isObject( module_db_candidate ) ) {
                throw new Error('MultiModule Control::prepareModuleForDB : a module must be an object. Aborting.');
            }
            var control = this,
                db_ready_module = {};

            _.each( control.getDefaultModuleDBModel() , function( _value, _key ) {
                  if ( ! _.has( module_db_candidate, _key ) ) {
                      throw new Error('MultiModule Control::prepareModuleForDB : a module is missing the property : ' + _key + ' . Aborting.');
                  }

                  var _candidate_val = module_db_candidate[ _key ];
                  switch( _key ) {
                        //PROPERTIES COMMON TO ALL MODULES IN ALL CONTEXTS
                        case 'items' :
                          if ( ! _.isArray( _candidate_val )  ) {
                              throw new Error('prepareModuleForDB : a module item list must be an array');
                          }
                          db_ready_module[ _key ] = _candidate_val;
                        break;



                        //PROPERTIES FOR MODULE EMBEDDED IN A SEKTION
                        case 'id' :
                          if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                              throw new Error('prepareModuleForDB : a module id must a string not empty');
                          }
                          db_ready_module[ _key ] = _candidate_val;
                        break;
                        case 'module_type' :
                          if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                              throw new Error('prepareModuleForDB : a module type must a string not empty');
                          }
                          db_ready_module[ _key ] = _candidate_val;
                        break;
                        case  'column_id' :
                          if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                              throw new Error('prepareModuleForDB : a module column id must a string not empty');
                          }
                          db_ready_module[ _key ] = _candidate_val;
                        break;
                        case  'sektion_id' :
                          if ( ! _.isObject( module_db_candidate.sektion ) || ! _.has( module_db_candidate.sektion, 'id' ) ) {
                              throw new Error('prepareModuleForDB : a module sektion must be an object with an id.');
                          }
                          //in the API, the sektion property hold by the module is an instance
                          //let's use only the id for the DB
                          db_ready_module[ _key ] = module_db_candidate.sektion.id;
                        break;
                        case 'dirty' :
                          if ( control.czr_Module.has( module_db_candidate.id ) )
                              db_ready_module[ _key ] = control.czr_Module( module_db_candidate.id ).isDirty();
                          else
                              db_ready_module[ _key ] = _candidate_val;
                          if ( ! _.isBoolean( db_ready_module[ _key ] ) ) {
                              throw new Error('prepareModuleForDB : a module dirty state must be a boolean.');
                          }
                        break;
                  }//switch
            });
            return db_ready_module;
      }
});//$.extend//CZRBaseControlMths
})( wp.customize , jQuery, _ );
//extends api.CZRBaseModuleControl
var CZRMultiModuleControlMths = CZRMultiModuleControlMths || {};
( function ( api, $, _ ) {
$.extend( CZRMultiModuleControlMths, {
      initialize: function( id, options ) {
              var control = this;

              //listen to the module-collection setting changes
              //=> synchronize the columns in the sektion setting
              api.consoleLog('IN MULTI MODULE INITIALIZE ? ', options );
              api(id).callbacks.add( function() { return control.syncColumn.apply( control, arguments ); } );

              //when the synchronized sektion module sends its instance, check the consistency with the module-collection setting
              //=> each modules of the module-collection setting should be present in a column of the synchronized sektion
              // control.syncSektionModule().bind( function( sektion_module_instance ) {
              //     sektion_module_instance.czr_columnCollection.each( function( _col ) {
              //           api.consoleLog('_col.modules', _col.modules);
              //     });
              // });

              api.CZRBaseModuleControl.prototype.initialize.call( control, id, options );
      },


      ready : function() {
            var control = this;
            api.consoleLog('MODULE-COLLECTION CONTROL READY', this.id );
            api.CZRBaseModuleControl.prototype.ready.apply( control, arguments);
      },

      //cb of : api(control.id).callbacks.
      syncColumn : function( to, from, data ) {
            api.consoleLog('IN SYNC COLUMN', to, from, data );
            if ( ! _.isUndefined(data) && data.silent )
              return;
            api.consoleLog('IN SYNXXX', api.control('hu_theme_options[module-collection]').syncSektionModule()(), this.syncSektionModule()(), this.id );

            //ORPHANS MODULE REMOVED ON INIT, VOID()
            //=> there's no column to synchronize
            if ( _.has( data, 'orphans_module_removal' ) )
              return;

            //always get the control instance from the api
            //=> because the control on which this callback is binded can be re instantiated, typically on skope switch
            var control = api.control( this.id );
            //MODULE ADDED
            //determine if a module has been added
            var added_mod = _.filter( to, function( _mod, _key ){
                return ! _.findWhere( from, { id : _mod.id } );
            } );
            if ( ! _.isEmpty( added_mod ) ) {
                  api.consoleLog('ADDED MODULE?', added_mod );
                  _.each( added_mod, function( _mod ) {
                          control.syncSektionModule().czr_Column( _mod.column_id ).updateColumnModuleCollection( { module : _mod } );
                  });
            }

            //MODULE REMOVED
            var removed_mod = _.filter( from, function( _mod, _key ){
                return ! _.findWhere( to, { id : _mod.id } );
            } );
            if ( ! _.isEmpty( removed_mod ) ) {
                  _.each( removed_mod, function( _mod ) {
                          control.syncSektionModule().czr_Column( _mod.column_id ).removeModuleFromColumnCollection( _mod );
                  });
            }

            //MODULE HAS BEEN MOVED TO ANOTHER COLUMN
            if ( _.size(from) == _.size(to) && _.has( data, 'module') && _.has( data, 'source_column') && _.has( data, 'target_column') ) {
                    $.when( control.syncSektionModule().moveModuleFromTo( data.module, data.source_column, data.target_column ) ).done( function() {
                          control.syncSektionModule().control.trigger('module-moved', { module : data.module, source_column: data.source_column, target_column :data.target_column });
                    } );
            }
            control.trigger( 'columns-synchronized', to );
      },


      ////////////////////////////////////////////
      /// REMOVE MODULE
      ///////////////////////////////////////////
      //@param module = obj => the module model
      removeModule : function( module ) {
            var control = this;
            //remove module from DOM if it's been embedded
            if ( control.czr_Module.has( module.id ) && 'resolved' == control.czr_Module( module.id ).embedded.state() )
                control.czr_Module( module.id ).container.remove();

            //remove module from API
            control.removeModuleFromCollection( module );
      },


      removeModuleFromCollection : function( module ) {
            var control = this,
                _current_collection = control.czr_moduleCollection(),
                _new_collection = $.extend( true, [], _current_collection);

            _new_collection = _.filter( _new_collection, function( _mod ) {
                  return _mod.id != module.id;
            } );
            control.czr_moduleCollection.set( _new_collection );
      }
});//$.extend//CZRBaseControlMths
})( wp.customize , jQuery, _ );
//extends api.CZRBaseModuleControl
var CZRMultiModuleControlMths = CZRMultiModuleControlMths || {};
( function ( api, $, _ ) {
$.extend( CZRMultiModuleControlMths, {
      //adapt modules for them to be used in a multimodule control, synchronized with a sektions control.
      //@todo. => create equivalent extender when they are used in controls.
      getMultiModuleExtender : function( parentConstructor ) {
            var control = this;
            $.extend( control.CZRModuleExtended, {
                  initialize: function( id, constructorOptions ) {
                        var module = this;
                        //run the parent initialize
                        parentConstructor.prototype.initialize.call( module, id, constructorOptions );

                        api.consoleLog('MODULE INSTANTIATED : ', module.id );

                        //extend the module with new template Selectors
                        $.extend( module, {
                              singleModuleWrapper : 'czr-single-module-wrapper',
                              sektionModuleTitle : 'czr-module-sektion-title-part',
                              ruModuleEl : 'czr-ru-module-sektion-content'
                        } );

                        //ADD A MODULE STATE OBSERVER
                        //czr_ModuleState stores the current expansion status of a given module
                        //can take 2 values : expanded, closed
                        module.czr_ModuleState = new api.Value( false );

                        //SETUP MODULE VIEW WHEN MODULE READY
                        module.isReady.done( function() {
                              module.setupModuleView();
                        });

                        //ADD A MODULE TITLE ELEMENT EMBEDDED STATE
                        module.moduleTitleEmbedded = $.Deferred();

                        //ADD A MODULE COLUMN STATE OBSERVER
                        module.modColumn = new api.Value();
                        module.modColumn.set( constructorOptions.column_id );

                        //React to a module column change. Typically fired when moving a module from one column to another.
                        module.modColumn.bind( function( to, from ) {
                              api.consoleLog('MODULE ' + module.id + ' HAS BEEN MOVED TO COLUMN', to, module() );
                              var _current_model = module(),
                                  _new_model = $.extend( true, {}, _current_model );

                              _new_model.column_id = to;

                              //When the module value changes, here's what happens :
                              //IN THE MODULE COLLECTION CONTROL / SETTING
                              //1) the module reacts and inform the control.czr_moduleCollection()
                              //2) the control.czr_moduleCollection() reacts and inform the 'module-collection' setting
                              //3) the module-collection setting react and inform the relevant column.columnModuleCollection() instance with the syncColumn() method
                              //
                              //IN THE SEKTIONS CONTROL / SETTING
                              //4) the column.columnModuleCollection() instance reacts and inform the column() instance
                              //5) the column() instance reacts and inform the sektion module.czr_columnCollection() instance
                              //6) the module.czr_columnCollection() instance reacts and inform the relevant sektion() instance
                              //7) the sektion() instance reacts and inform the itemCollection() (=> a sektion() is actually an item )
                              //8) the itemCollection() reacts and inform its module() instance
                              //9) the module() instance reacts and inform the moduleCollection() instance
                              //10) the control.czr_moduleCollection() instance reacts and inform the 'sektions' setting
                              module.set( _new_model, { target_column : to, source_column : from } );
                              //var updatedModuleCollection = $.extend( true, [], module.control.czr_moduleCollection() );
                              //api(module.control.id).set( module.control.filterModuleCollectionBeforeAjax( updatedModuleCollection ) );
                        } );
                  },

                  //////////////////////////////////
                  ///READY
                  //////////////////////////////////
                  //when a module is embedded in a sektion, we need to render it before ready is done
                  //=> this allows us to override the container element declared in the parent initialize
                  //when ready done => the module items are embedded (without their content)
                  ready : function( is_added_by_user ) {
                          var module = this;
                           api.consoleLog('MODULE READY IN EXTENDED MODULE CLASS : ', module.id );
                          $.when( module.renderModuleWrapper( is_added_by_user ) ).done( function( $_module_container ) {
                                if ( _.isUndefined($_module_container) || false === $_module_container.length ) {
                                    throw new Error( 'Module container has not been embedded for module :' + module.id );
                                }
                                module.container = $_module_container;
                                module.embedded.resolve();
                          } );
                          //run the parent initialize
                          parentConstructor.prototype.ready.call( module );
                          //module.isReady.resolve();
                  }

            });
            return control.CZRModuleExtended;
      },


      //this object holds the various methods allowing a module to be rendered in a multimodule control
      CZRModuleExtended  : {
            //fired in ready.
            //=> before isReady.done().
            renderModuleWrapper : function( is_added_by_user ) {
                    //=> an array of objects
                    var module = this;

                    //has this module view already been rendered?
                    if ( 'resolved' == module.embedded.state() )
                      return module.container;

                    //do we have view template script?
                    if ( 0 === $( '#tmpl-' + module.singleModuleWrapper ).length ) {
                      throw new Error('No template for module ' + module.id + '. The template script id should be : #tmpl-' + module.singleModuleWrapper );
                    }

                    var module_wrapper_tmpl = wp.template( module.singleModuleWrapper ),
                        tmpl_data = {
                            id : module.id,
                            type : module.module_type
                        },
                        $_module_el = $(  module_wrapper_tmpl( tmpl_data ) );

                    //append the module wrapper to the column
                    //if added by user, search for the module candidate element, render after and delete the element
                    if ( is_added_by_user ) {
                        $.when( $( '.czr-module-collection-wrapper' , module._getColumn().container ).find( '.czr-module-candidate').after( $_module_el ) ).
                          done( function() {
                            $( '.czr-module-collection-wrapper' , module._getColumn().container ).find( '.czr-module-candidate').remove();
                          });
                    } else {
                        $( '.czr-module-collection-wrapper' , module._getColumn().container).append( $_module_el );
                    }


                    // //then append the ru module template
                    // var mod_content_wrapper_tmpl = wp.template( module.ruModuleEl ),
                    //     $_mod_content_wrapper = $(  mod_content_wrapper_tmpl( tmpl_data ) );

                    // $( '.czr-mod-content', $_module_el).append( $_mod_content_wrapper );

                    return $_module_el;
            },





            setupModuleView : function() {
                    var module = this;

                    module.view_event_map = [
                            //toggles remove view alert
                            {
                              trigger   : 'click keydown',
                              selector  : [ '.czr-remove-mod', '.' + module.control.css_attr.cancel_alert_btn ].join(','),
                              name      : 'toggle_remove_alert',
                              actions   : ['toggleModuleRemoveAlert']
                            },
                            //removes module and destroys its view
                            {
                              trigger   : 'click keydown',
                              selector  : '.' + module.control.css_attr.remove_view_btn,
                              name      : 'remove_module',
                              actions   : ['removeModule']
                            },
                            //edit view
                            {
                              trigger   : 'click keydown',
                              selector  : '.czr-edit-mod',
                              name      : 'edit_module',
                              actions   : ['setModuleViewVisibility', 'sendEditModule']
                            },
                            {
                              trigger   : 'click keydown',
                              selector  : '.czr-module-back',
                              name      : 'back_to_column',
                              actions   : ['setModuleViewVisibility']
                            },
                            {
                              trigger   : 'mouseenter',
                              selector  : '.czr-mod-header',
                              name      : 'hovering_module',
                              actions   : function( obj ) {
                                    api.previewer.send( 'start_hovering_module', {
                                          id : module.id
                                    });
                              }
                            },
                            {
                              trigger   : 'mouseleave',
                              selector  : '.czr-mod-header',
                              name      : 'hovering_module',
                              actions   : function( obj ) {
                                  api.previewer.send( 'stop_hovering_module', {
                                        id : module.id
                                  });
                              }
                            }
                    ];

                    //defer actions on module view embedded
                    module.embedded.done( function() {
                          //add a listener on view state change
                          module.czr_ModuleState.callbacks.add( function() { return module.setupModuleViewStateListeners.apply(module, arguments ); } );

                          //setup DOM listener
                          api.CZR_Helpers.setupDOMListeners(
                                module.view_event_map,//actions to execute
                                { module : { id : module.id } , dom_el:module.container },//model + dom scope
                                module //instance where to look for the cb methods
                          );//listeners for the view wrapper
                    });
            },

            //fired on click
            setModuleViewVisibility : function( obj, is_added_by_user ) {
                  var module = this;

                  module.czr_ModuleState( ! module.czr_ModuleState() );

                  //always close the module panel
                  api.czrModulePanelState.set(false);
                  //always close the sektion settings panel
                  api.czrSekSettingsPanelState.set(false);

                  //close all sektions but the one from which the button has been clicked
                  module.control.syncSektionModule().closeAllOtherSektions( $(obj.dom_event.currentTarget, obj.dom_el ) );

                  // if ( is_added_by_user ) {
                  //   item.viewState.set( 'expanded_noscroll' );
                  // } else {
                  //   module.closeAllItems( item.id );
                  //   if ( _.has(module, 'preItem') ) {
                  //     module.preItemExpanded.set( false );
                  //   }
                  //   }
                  //   item.viewState.set( 'expanded' == item._getViewState() ? 'closed' : 'expanded' );
                  // }
            },

            //fired on click
            sendEditModule : function( obj ) {
                  var module = this;
                  api.previewer.send( 'edit_module', {
                        id : module.id
                  });
            },

            //cb of module.czr_ModuleState.callbacks
            //On first module expansion, render the module item(s) content
            setupModuleViewStateListeners : function( expanded ) {
                  var module = this;
                  //setup an api value for the current opened module.
                  api.czr_isModuleExpanded = api.czr_isModuleExpanded || new api.Value();

                  if ( expanded )
                    api.czr_isModuleExpanded( module );
                  else
                    api.czr_isModuleExpanded( false );

                  //expand / collapse
                  $.when( module.toggleModuleViewExpansion( expanded ) ).done( function() {
                        if ( expanded ) {
                              //render the module title
                              module.renderModuleTitle();

                              //populates the saved items collection
                              module.populateSavedItemCollection();

                              //render the item(s)
                              //on first rendering, use the regular method.
                              //for further re-rendering, when the embedded state is resolved()
                              // => 1) re-render each item
                              // => 2) re-instantiate each input
                              // module.czr_Item.each ( function( item ) {
                              //       if ( ! item.module.isMultiItem() )
                              //           item.viewState.set('expanded');
                              //       if ( 'resolved' == item.embedded.state() ) {
                              //           $.when( item.renderItemWrapper() ).done( function( $_item_container ) {
                              //               item.container = $_item_container;

                              //               $.when( item.renderItemContent() ).done( function() {
                              //                   api.CZR_Helpers.setupInputCollectionFromDOM.call( item );
                              //               });

                              //               if ( ! item.module.isMultiItem() )
                              //                   item.viewState.set('expanded');
                              //           });

                              //       }
                              //       else {
                              //           item.mayBeRenderItemWrapper();
                              //       }
                              // } );
                        }
                        else {
                              module.czr_Item.each ( function( item ) {
                                    item.viewState.set('closed');
                                    item._destroyView( 0 );
                                    //api.CZR_Helpers.removeInputCollection.call( item );
                                    module.czr_Item.remove( item.id );
                              } );
                        }
                  });
            },


            renderModuleTitle : function() {
                  var module = this;
                  if( 'resolved' == module.moduleTitleEmbedded.state() )
                    return;

                  //render the module title
                  //do we have view template script?
                  if ( 0 === $( '#tmpl-' + module.sektionModuleTitle ).length ) {
                    throw new Error('No sektion title Module Part template for module ' + module.id + '. The template script id should be : #tmpl-' + module.sektionModuleTitle );
                  }
                  //append the title when in a sektion and resolve the embedded state
                  $.when( $( module.container ).find('.czr-mod-content').prepend(
                        $( wp.template( module.sektionModuleTitle )( { id : module.id } ) )
                  ) ).done( function() {
                        module.moduleTitleEmbedded.resolve();
                  });
            },


            //fired in setupModuleViewStateListeners()
            toggleModuleViewExpansion : function( expanded, duration ) {
                  var module = this;

                  //slide Toggle and toggle the 'open' class
                  $( '.czr-mod-content' , module.container ).slideToggle( {
                      duration : duration || 200,
                      done : function() {
                            var $_overlay = module.container.closest( '.wp-full-overlay' ),
                                $_backBtn = module.container.find( '.czr-module-back' ),
                                $_modTitle = module.container.find('.czr-module-title');

                            module.container.toggleClass('open' , expanded );
                            $_overlay.toggleClass('czr-module-open', expanded );
                            $_modTitle.attr( 'tabindex', expanded ? '-1' : '0' );
                            $_backBtn.attr( 'tabindex', expanded ? '0' : '-1' );

                            if( expanded ) {
                                $_backBtn.focus();
                            } else {
                                $_modTitle.focus();
                            }

                            //close all alerts
                            //module.closeRemoveDialogs();

                            //toggle the icon activate class depending on the status
                            //switch icon
                            //var $_edit_icon = $(this).siblings().find('.' + module.control.css_attr.edit_view_btn );

                            // $_edit_icon.toggleClass('active' , expanded );
                            // if ( expanded )
                            //   $_edit_icon.removeClass('fa-pencil').addClass('fa-minus-square').attr('title', serverControlParams.i18n.close );
                            // else
                            //   $_edit_icon.removeClass('fa-minus-square').addClass('fa-pencil').attr('title', serverControlParams.i18n.edit );

                            //scroll to the currently expanded view
                            if ( expanded )
                              module._adjustScrollExpandedBlock( module.container );
                      }//done callback
                    } );
            },









            toggleModuleRemoveAlert : function( obj ) {
                    var module = this,
                        control = this.control,
                        $_alert_el = $( '.' + module.control.css_attr.remove_alert_wrapper, module.container ).first(),
                        $_clicked = obj.dom_event,
                        $_column_container = control.syncSektionModule().czr_Column( module.column_id ).container;

                    //first close all open  views
                    //module.closeAllItems();

                    //close the main sektion pre_item view
                    if ( _.has(module, 'preItem') ) {
                        control.syncSektionModule().preItemExpanded.set( false );
                    }

                    //then close any other open remove alert in the column containuer
                    $('.' + module.control.css_attr.remove_alert_wrapper, $_column_container ).not($_alert_el).each( function() {
                          if ( $(this).hasClass('open') ) {
                                $(this).slideToggle( {
                                      duration : 200,
                                      done : function() {
                                            $(this).toggleClass('open' , false );
                                            //deactivate the icons
                                            $(this).siblings().find('.' + module.control.css_attr.display_alert_btn).toggleClass('active' , false );
                                      }
                                } );
                          }
                    });

                    //print the html
                    //do we have an html template and a control container?
                    if ( ! wp.template( module.AlertPart )  || ! module.container ) {
                        throw new Error( 'No removal alert template available for module :' + module.id );
                    }

                    $_alert_el.html( wp.template( module.AlertPart )( { title : ( module().title || module.id ) } ) );

                    //toggle it
                    $_alert_el.slideToggle( {
                          duration : 200,
                          done : function() {
                                var _is_open = ! $(this).hasClass('open') && $(this).is(':visible');
                                $(this).toggleClass('open' , _is_open );
                                //set the active class of the clicked icon
                                $( obj.dom_el ).find('.' + module.control.css_attr.display_alert_btn).toggleClass( 'active', _is_open );
                                //adjust scrolling to display the entire dialog block
                                if ( _is_open )
                                  module._adjustScrollExpandedBlock( module.container );
                          }
                    } );
            },




            //@param module = obj => the module model
            //Fired on click
            removeModule : function( obj ) {
                  this.control.removeModule( obj.module );
            },














            _getColumn : function() {
                    var module = this;
                    return module.control.syncSektionModule().czr_Column( module.modColumn() );
            },

            _getSektion : function() {

            }
      }
});//$.extend//CZRBaseControlMths
})( wp.customize , jQuery, _ );
( function ( api, $, _ ) {
      //BASE
      //BASE : Extends some constructors with the events manager
      $.extend( CZRBaseControlMths, api.Events );
      $.extend( api.Control.prototype, api.Events );//ensures that the default WP control constructor is extended as well
      $.extend( CZRModuleMths, api.Events );
      $.extend( CZRItemMths, api.Events );
      $.extend( CZRModOptMths, api.Events );

      //BASE : Add the DOM helpers (addAction, ...) to the Control Base Class + Input Base Class
      $.extend( CZRBaseControlMths, api.CZR_Helpers );
      $.extend( CZRInputMths, api.CZR_Helpers );
      $.extend( CZRModuleMths, api.CZR_Helpers );

      //BASE INPUTS => used as constructor when creating the collection of inputs
      api.CZRInput                  = api.Value.extend( CZRInputMths );
      //Declare all available input type as a map
      api.czrInputMap = api.czrInputMap || {};
      //input_type => callback fn to fire in the Input constructor on initialize
      //the callback can receive specific params define in each module constructor
      //For example, a content picker can be given params to display only taxonomies
      $.extend( api.czrInputMap, {
            text      : '',
            textarea  : '',
            check     : 'setupIcheck',
            select    : 'setupSelect',
            number    : 'setupStepper',
            upload    : 'setupImageUploader',
            color     : 'setupColorPicker',
            content_picker : 'setupContentPicker',
            text_editor    : 'setupTextEditor',
            password : '',
            range_slider : 'setupRangeSlider',
            hidden : ''
      });

      //BASE ITEMS => used as constructor when creating the collection of models
      api.CZRItem                   = api.Value.extend( CZRItemMths );

      //BASE MODULE OPTIONS => used as constructor when creating module options
      api.CZRModOpt                 = api.Value.extend( CZRModOptMths );

      //BASE MODULES => used as constructor when creating the collection of modules
      api.CZRModule                 = api.Value.extend( CZRModuleMths );
      api.CZRDynModule              = api.CZRModule.extend( CZRDynModuleMths );

      //BASE COLUMNS => used as constructor
      //Columns are a pro feature, only part of the full build.
      if ( ! _.isUndefined( window.CZRColumnMths ) ) {
            api.CZRColumn           = api.Value.extend( CZRColumnMths );
      }

      //BASE CONTROLS
      api.CZRBaseControl            = api.Control.extend( CZRBaseControlMths );
      api.CZRBaseModuleControl      = api.CZRBaseControl.extend( CZRBaseModuleControlMths );
      api.CZRMultiModuleControl     = api.CZRBaseModuleControl.extend( CZRMultiModuleControlMths );

      $.extend( api.controlConstructor, {
            czr_module : api.CZRBaseModuleControl,
            czr_multi_module : api.CZRMultiModuleControl,
            //czr_sektions   : api.CZRSektionsControl
      });

})( wp.customize, jQuery, _ );
( function ( api, $, _ ) {
      //SET THE ACTIVE STATE OF THE THEMES SECTION BASED ON WHAT THE SERVER SENT
      api.bind('ready', function() {
            var _do = function() {
                  api.section('themes').active.bind( function( active ) {
                        if ( ! _.has( serverControlParams, 'isThemeSwitchOn' ) || ! _.isEmpty( serverControlParams.isThemeSwitchOn ) )
                          return;
                        api.section('themes').active( serverControlParams.isThemeSwitchOn );
                        //reset the callbacks
                        api.section('themes').active.callbacks = $.Callbacks();
                  });
            };
            if ( api.section.has( 'themes') )
                _do();
            else
                api.section.when( 'themes', function( _s ) {
                      _do();
                });
      });



})( wp.customize , jQuery, _);
( function ( api, $, _ ) {
      /*****************************************************************************
      * DEFINE SOME USEFUL OBSERVABLE VALUES
      *****************************************************************************/
      //STORE THE CURRENTLY ACTIVE SECTION AND PANELS IN AN OBSERVABLE VALUE
      //BIND EXISTING AND FUTURE SECTIONS AND PANELS
      api.czr_activeSectionId = new api.Value('');
      api.czr_activePanelId = new api.Value('');

      /*****************************************************************************
      * OBSERVE UBIQUE CONTROL'S SECTIONS EXPANSION
      *****************************************************************************/
      if ( 'function' === typeof api.Section ) {
            //move controls back and forth in declared ubique sections
            //=> implemented in the customizr theme for the social links boolean visibility controls ( socials in header, sidebar, footer )
            api.control.bind( 'add', function( _ctrl ) {
                  if ( _ctrl.params.ubq_section && _ctrl.params.ubq_section.section ) {
                        //save original state
                        _ctrl.params.original_priority = _ctrl.params.priority;
                        _ctrl.params.original_section  = _ctrl.params.section;

                        api.section.when( _ctrl.params.ubq_section.section, function( _section_instance ) {
                                _section_instance.expanded.bind( function( expanded ) {
                                      if ( expanded ) {
                                            if ( _ctrl.params.ubq_section.priority ) {
                                                  _ctrl.priority( _ctrl.params.ubq_section.priority );
                                            }
                                            _ctrl.section( _ctrl.params.ubq_section.section );
                                      }
                                      else {
                                            _ctrl.priority( _ctrl.params.original_priority );
                                            _ctrl.section( _ctrl.params.original_section );
                                      }
                                });

                        } );
                  }
            });
      }


      /*****************************************************************************
      * OBSERVE UBIQUE CONTROL'S PANELS EXPANSION
      *****************************************************************************/
      if ( 'function' === typeof api.Panel ) {
            //move section back and forth in declared ubique panels
            api.section.bind( 'add', function( _sec ) {
                  if ( _sec.params.ubq_panel && _sec.params.ubq_panel.panel ) {
                        //save original state
                        _sec.params.original_priority = _sec.params.priority;
                        _sec.params.original_panel  = _sec.params.panel;

                        api.panel.when( _sec.params.ubq_panel.panel, function( _panel_instance ) {
                                _panel_instance.expanded.bind( function( expanded ) {
                                      if ( expanded ) {
                                            if ( _sec.params.ubq_panel.priority ) {
                                                  _sec.priority( _sec.params.ubq_panel.priority );
                                            }
                                            _sec.panel( _sec.params.ubq_panel.panel );
                                      }
                                      else {
                                            _sec.priority( _sec.params.original_priority );
                                            _sec.panel( _sec.params.original_panel );
                                      }
                                });

                        } );
                  }
            });
      }


      /*****************************************************************************
      * CLOSE THE MOD OPTION PANEL ( if exists ) ON : section change, panel change, skope switch
      *****************************************************************************/
      //@return void()
      var _closeModOpt = function() {
            if ( ! _.has( api, 'czr_ModOptVisible') )
              return;
            api.czr_ModOptVisible(false);
      };
      api.czr_activeSectionId.bind( _closeModOpt );
      api.czr_activePanelId.bind( _closeModOpt );

      /*****************************************************************************
      * OBSERVE SECTIONS AND PANEL EXPANSION
      * /store the current expanded section and panel
      *****************************************************************************/
      api.bind('ready', function() {
            if ( 'function' != typeof api.Section ) {
              throw new Error( 'Your current version of WordPress does not support the customizer sections needed for this theme. Please upgrade WordPress to the latest version.' );
            }
            var _storeCurrentSection = function( expanded, section_id ) {
                  api.czr_activeSectionId( expanded ? section_id : '' );
            };
            api.section.each( function( _sec ) {
                  //<@4.9compat>
                  // Bail if is 'publish_setting' section
                  if ( 'publish_settings' == _sec.id )
                    return;
                  //</@4.9compat>
                  _sec.expanded.bind( function( expanded ) { _storeCurrentSection( expanded, _sec.id ); } );
            });
            api.section.bind( 'add', function( section_instance ) {
                  //<@4.9compat>
                  // Bail if is 'publish_setting' section
                  if ( 'publish_settings' == section_instance.id )
                    return;
                  //</@4.9compat>
                  api.trigger('czr-paint', { active_panel_id : section_instance.panel() } );
                  section_instance.expanded.bind( function( expanded ) { _storeCurrentSection( expanded, section_instance.id ); } );
            });

            var _storeCurrentPanel = function( expanded, panel_id ) {
                  api.czr_activePanelId( expanded ? panel_id : '' );
                  //if the expanded panel id becomes empty (typically when switching back to the root panel), make sure that no section is set as currently active
                  //=> fixes the problem of add_menu section staying expanded when switching back to another panel
                  if ( _.isEmpty( api.czr_activePanelId() ) ) {
                        api.czr_activeSectionId( '' );
                  }
            };
            api.panel.each( function( _panel ) {
                  _panel.expanded.bind( function( expanded ) { _storeCurrentPanel( expanded, _panel.id ); } );
            });
            api.panel.bind( 'add', function( panel_instance ) {
                  panel_instance.expanded.bind( function( expanded ) { _storeCurrentPanel( expanded, panel_instance.id ); } );
            });
      });


})( wp.customize , jQuery, _);
( function ( api, $, _ ) {
      /*****************************************************************************
      * ADD PRO BEFORE SPECIFIC SECTIONS AND PANELS
      *****************************************************************************/
      if ( serverControlParams.isPro ) {
            _.each( [
                  //WFC
                  'tc_font_customizer_settings',

                  //hueman pro
                  'header_image_sec',
                  'content_blog_sec',
                  'static_front_page',
                  'content_single_sec',

                  //customizr-pro
                  'tc_fpu',
                  'nav',
                  'post_lists_sec',
                  'galleries_sec',
                  'footer_customizer_sec',
                  'custom_scripts_sec',
                  'contact_info_sec'

            ], function( _secId ) {
                  _.delay( function() {
                      api.section.when( _secId, function( _sec_ ) {
                            if ( 1 >= _sec_.headContainer.length ) {
                                _sec_.headContainer.find('.accordion-section-title').prepend( '<span class="pro-title-block">Pro</span>' );
                            }
                      });
                  }, 1000 );
            });
            _.each( [
                  //hueman pro
                  //'hu-header-panel',
                  //'hu-content-panel',

                  //customizr-pro
                  //'tc-header-panel',
                  //'tc-content-panel',
                  //'tc-footer-panel',
                  //'tc-advanced-panel'
            ], function( _secId ) {
                  api.panel.when( _secId, function( _sec_ ) {
                        if ( 1 >= _sec_.headContainer.length ) {
                            _sec_.headContainer.find('.accordion-section-title').prepend( '<span class="pro-title-block">Pro</span>' );
                        }
                  });
            });
      }


      /*****************************************************************************
      * PRO SECTION CONSTRUCTOR
      *****************************************************************************/
      if ( ! serverControlParams.isPro && _.isFunction( api.Section ) ) {
            proSectionConstructor = api.Section.extend( {
                  active : true,
                  // No events for this type of section.
                  attachEvents: function () {},
                  // Always make the section active.
                  isContextuallyActive: function () {
                    return this.active();
                  },
                  _toggleActive: function(){ return true; },

            } );

            $.extend( api.sectionConstructor, {
                  'czr-customize-section-pro' : proSectionConstructor
            });
      }
})( wp.customize , jQuery, _);
//extends api.CZRDynModule
var CZRSocialModuleMths = CZRSocialModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRSocialModuleMths, {
      initialize: function( id, options ) {
              var module = this;
              //run the parent initialize
              api.CZRDynModule.prototype.initialize.call( module, id, options );

              //extend the module with new template Selectors
              $.extend( module, {
                    itemPreAddEl : 'czr-module-social-pre-add-view-content',
                    itemInputList : 'czr-module-social-item-content',
                    modOptInputList : 'czr-module-social-mod-opt'
              } );


              this.social_icons = [
                '500px',
                'adn',
                'amazon',
                'android',
                'angellist',
                'apple',
                'behance',
                'behance-square',
                'bitbucket',
                //'bitbucket-square', //<-  removed in fa5
                'black-tie',
                'btc',
                'buysellads',
                'chrome',
                'codepen',
                'codiepie',
                'connectdevelop',
                'contao',
                'dashcube',
                'delicious',
                'deviantart',
                'digg',
                'dribbble',
                'dropbox',
                'drupal',
                'edge',
                'empire',
                'envelope',
                'envelope-o', //<- go with far envelope
                'envelope-square',
                'expeditedssl',
                'facebook',
                'facebook-f (alias)',
                //'facebook-official', //<-  removed in fa5
                'facebook-square',
                'firefox',
                'flickr',
                'fonticons',
                'fort-awesome',
                'forumbee',
                'foursquare',
                'get-pocket',
                'gg',
                'gg-circle',
                'git',
                'github',
                'github-alt',
                'github-square',
                'gitlab',
                'git-square',
                'google',
                'google-plus',
                //'google-plus-circle', //<- removed in fa5
                //'google-plus-official', //<- removed in fa5
                'google-plus-g', //<- added in fa5
                'google-plus-square',
                'google-wallet',
                'gratipay',
                'hacker-news',
                'houzz',
                'imdb',
                'instagram',
                'internet-explorer',
                'ioxhost',
                'joomla',
                'jsfiddle',
                'lastfm',
                'lastfm-square',
                'leanpub',
                'linkedin',
                //'linkedin-square', //<-  removed in fa5
                'linkedin-in', //<- added in fa5
                'linux',
                'maxcdn',
                //'meanpath', <- removed in fa5
                'meetup',
                'medium',
                'mixcloud',
                'mobile',
                'mobile-alt',//<- added in fa5
                'modx',
                'odnoklassniki',
                'odnoklassniki-square',
                'opencart',
                'openid',
                'opera',
                'optin-monster',
                'pagelines',
                'paypal',
                'phone',
                'phone-square',
                'pied-piper',
                'pied-piper-alt',
                'pinterest',
                'pinterest-p',
                'pinterest-square',
                'product-hunt',
                'qq',
                'rebel',
                'reddit',
                'reddit-alien',
                'reddit-square',
                'renren',
                'rss',
                'rss-square',
                'safari',
                'scribd',
                'sellsy',
                'share-alt',
                'share-alt-square',
                'shirtsinbulk',
                'simplybuilt',
                'skyatlas',
                'skype',
                'slack',
                'slideshare',
                'snapchat',
                'soundcloud',
                'spotify',
                'stack-exchange',
                'stack-overflow',
                'steam',
                'steam-square',
                'stumbleupon',
                'stumbleupon-circle',
                'telegram',
                'tencent-weibo',
                'trello',
                'tripadvisor',
                'tumblr',
                'tumblr-square',
                'twitch',
                'twitter',
                'twitter-square',
                'usb',
                'viacoin',
                'vimeo',
                'vimeo-square',
                'vine',
                'vk',
                'weibo',
                'weixin',
                'whatsapp',
                'wikipedia-w',
                'windows',
                'wordpress',
                'xing',
                'xing-square',
                'yahoo',
                'y-combinator',
                'yelp',
                'youtube',
                //'youtube-play', //<- removed in fa5
                'youtube-square'
              ];

              //FA5 backward compatibility with FA4
              //see https://github.com/presscustomizr/customizr/issues/1364
              this.fa_solid_icons = [
                'fa-envelope',
                'fa-envelope-square',
                'fa-mobile',
                'fa-mobile-alt',
                'fa-phone',
                'fa-phone-square',
                'fa-rss',
                'fa-rss-square',
                'fa-share-alt',
                'fa-share-alt-square'
              ];

              this.fa_icons_replacement = {
                'fa-bitbucket-square'     : 'fa-bitbucket',
                'fa-facebook-official'    : 'fa-facebook-f',
                'fa-google-plus-circle'   : 'fa-google-plus',
                'fa-google-plus-official' : 'fa-google-plus',
                'fa-linkedin-square'      : 'fa-linkedin',
                'fa-youtube-play'         : 'fa-youtube'
              }

              //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
              module.inputConstructor = api.CZRInput.extend( module.CZRSocialsInputMths || {} );
              //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
              module.itemConstructor = api.CZRItem.extend( module.CZRSocialsItem || {} );

              //declares a default ModOpt model
              this.defaultModOptModel = {
                  is_mod_opt : true,
                  module_id : module.id,
                  'social-size' : serverControlParams.social_el_params.defaultSocialSize || 14
              };

              //declares a default model
              this.defaultItemModel = {
                    id : '',
                    title : '' ,
                    'social-icon' : '',
                    'social-link' : '',
                    'social-color' : serverControlParams.social_el_params.defaultSocialColor,
                    'social-target' : 1
              };

              //overrides the default success message
              this.itemAddedMessage = serverControlParams.i18n.socialLinkAdded;

              //fired ready :
              //1) on section expansion
              //2) or in the case of a module embedded in a regular control, if the module section is already opened => typically when skope is enabled
              if ( _.has( api, 'czr_activeSectionId' ) && module.control.section() == api.czr_activeSectionId() && 'resolved' != module.isReady.state() ) {
                    module.ready();
              }

              api.section( module.control.section() ).expanded.bind(function(to) {
                    //set module ready on section expansion
                    if ( 'resolved' != module.isReady.state() ) {
                          module.ready();
                    }
              });

              module.isReady.then( function() {
                    //specific update for the item preModel on social-icon change
                    module.preItem.bind( function( to, from ) {
                          if ( ! _.has(to, 'social-icon') )
                            return;
                          if ( _.isEqual( to['social-icon'], from['social-icon'] ) )
                            return;
                          module.updateItemModel( module.preItem, true );
                    });
              });
      },//initialize


      //ACTIONS ON ICON CHANGE
      //Fired on 'social-icon:changed'
      //Don't fire in pre item case
      //@item_instance an be the preItem or an already created item
      updateItemModel : function( item_instance, is_preItem ) {
              var item = item_instance;
              is_preItem = is_preItem || false;

              //check if we are in the pre Item case => if so, the social-icon might be empty
              if ( ! _.has( item(), 'social-icon') || _.isEmpty( item()['social-icon'] ) )
                return;

              var _new_model, _new_title, _new_color;

              _new_model  = $.extend( true, {}, item() );//always safer to deep clone ( alternative to _.clone() ) => we don't know how nested this object might be in the future
              _new_title  = this.getTitleFromIcon( _new_model['social-icon'] );
              _new_color  = serverControlParams.social_el_params.defaultSocialColor;
              if ( ! is_preItem && item.czr_Input.has( 'social-color' ) )
                _new_color = item.czr_Input('social-color')();

              //add text follow us... to the title
              _new_title = [ serverControlParams.i18n.followUs, _new_title].join(' ');

              if ( is_preItem ) {
                    _new_model = $.extend( _new_model, { title : _new_title, 'social-color' : _new_color } );
                    item.set( _new_model );
              } else {
                    item.czr_Input('title').set( _new_title );
                    //item.czr_Input('social-link').set( '' );
                    if ( item.czr_Input('social-color') ) { //optional
                      item.czr_Input('social-color').set( _new_color );
                    }
              }
      },

      /* Helpers */
      getTitleFromIcon : function( icon ) {
              return api.CZR_Helpers.capitalize( icon.replace('fa-', '').replace('envelope', 'email') );
      },

      getIconFromTitle : function( title ) {
              return  'fa-' . title.toLowerCase().replace('envelope', 'email');
      },

      //from : https://stackoverflow.com/a/34560648
      _strReplace : function( $f, $r, $s ) {
              return $s.replace(new RegExp("(" + (typeof($f) == "string" ? $f.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&") : $f.map(function(i){return i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")}).join("|")) + ")", "g"), typeof($r) == "string" ? $r : typeof($f) == "string" ? $r[0] : function(i){ return $r[$f.indexOf(i)]});
      },

      buildFaIcon : function( value ) {
              //FA5 backward compatibility with FA4
              //see https://github.com/presscustomizr/customizr/issues/1364
              //by default they're brands
              var _fa_group       = 'fab', //<- brand group by default
                  _icon_class     = value.toLowerCase(),
                solidIcons        = this.fa_solid_icons,
                iconsReplacement  = this.fa_icons_replacement;

              _icon_class = this._strReplace( _.keys( iconsReplacement ),  _.values( iconsReplacement ),_icon_class);

              //former -o icons => now part of the far (Regular) group
              if ( _icon_class.match(/-o$/) ) {
                    _fa_group  = 'far';
                    _icon_class = _icon_class.replace(/-o$/,'');
              }
              //solid icons
              else if ( _.contains( solidIcons, _icon_class ) ) {
                    _fa_group = 'fas';
              }

              return _fa_group + ' ' +_icon_class;

      },



      CZRSocialsInputMths : {
              setupSelect : function() {
                    var input              = this,
                        item               = input.input_parent,
                        module             = input.module,
                        socialList         = module.social_icons,
                        solidIcons         = module.fa_solid_icons,
                        iconsReplacement   = module.fa_icons_eplacement,
                        _model             = item(),
                        //check if we are in the pre Item case => if so, the id is empty
                        is_preItem         = _.isEmpty( _model.id );

                    //=> add the select text in the pre Item case
                    if ( is_preItem ) {
                          socialList = _.union( [ serverControlParams.i18n.selectSocialIcon ], socialList );
                    }

                    //generates the options
                    _.each( socialList , function( icon_name, k ) {
                          // in the pre Item case the first select element is the notice "Select a social icon"
                          // doesn't need the fa-* class
                          var _value    = ( is_preItem && 0 === k ) ? '' : 'fa-' + icon_name.toLowerCase(),
                              _attributes = {
                                    value : _value,
                                    html: module.getTitleFromIcon( icon_name )
                              };
                          if ( _value == _model['social-icon'] )
                            $.extend( _attributes, { selected : "selected" } );

                          $( 'select[data-type="social-icon"]', input.container ).append( $('<option>', _attributes) );
                    });

                    function addIcon( state ) {
                          if (! state.id) { return state.text; }

                          //two spans here because we cannot wrap the social text into the social icon span as the solid FA5 font-weight is bold
                          var  $state = $(
                            '<span class="' + module.buildFaIcon( state.element.value.toLowerCase() ) + '"></span><span class="social-name">&nbsp;&nbsp;' + state.text + '</span>'
                          );
                          return $state;
                    }

                    //fire select2
                    $( 'select[data-type="social-icon"]', input.container ).select2( {
                            templateResult: addIcon,
                            templateSelection: addIcon
                    });
            },

            setupColorPicker : function( obj ) {
                    var input      = this,
                        item       = input.input_parent,
                        module     = input.module,
                        $el        = $( 'input[data-type="social-color"]', input.container );

                    $el.iris( {
                              palettes: true,
                              hide:false,
                              defaultColor : serverControlParams.social_el_params.defaultSocialColor || 'rgba(255,255,255,0.7)',
                              change : function( e, o ) {
                                    //if the input val is not updated here, it's not detected right away.
                                    //weird
                                    //is there a "change complete" kind of event for iris ?
                                    //hack to reset the color to default...@todo => use another color picker.
                                    if ( _.has( o, 'color') && 16777215 == o.color._color )
                                      $(this).val( serverControlParams.social_el_params.defaultSocialColor || 'rgba(255,255,255,0.7)' );
                                    else
                                      $(this).val( o.color.toString() );

                                    $(this).trigger('colorpickerchange').trigger('change');
                              }
                    });

                    //when the picker opens, it might be below the visible viewport.
                    //No built-in event available to react on this in the wpColorPicker unfortunately
                    $el.closest('div').on('click keydown', function() {
                          module._adjustScrollExpandedBlock( input.container );
                    });
            }

      },//CZRSocialsInputMths









      CZRSocialsItem : {
              //Fired if the item has been instantiated
              //The item.callbacks are declared.
              ready : function() {
                    var item = this;
                    api.CZRItem.prototype.ready.call( item );

                    //update the item model on social-icon change
                    item.bind('social-icon:changed', function(){
                          item.module.updateItemModel( item );
                    });
              },


              _buildTitle : function( title, icon, color ) {
                      var item = this,
                          module     = item.module;

                      title = title || ( 'string' === typeof(icon) ? api.CZR_Helpers.capitalize( icon.replace( 'fa-', '') ) : '' );
                      title = api.CZR_Helpers.truncate(title, 20);
                      icon = icon || 'fa-' + module.social_icons[0];
                      color = color || serverControlParams.social_el_params.defaultSocialColor;

                      return '<div><span class="' + module.buildFaIcon( icon ) + '" style="color:' + color + '"></span> ' + title + '</div>';
              },

              //overrides the default parent method by a custom one
              //at this stage, the model passed in the obj is up to date
              writeItemViewTitle : function( model ) {
                      var item = this,
                          module     = item.module,
                          _model = model || item(),
                          _title = module.getTitleFromIcon( _model['social-icon'] );

                      $( '.' + module.control.css_attr.item_title , item.container ).html(
                        item._buildTitle( _title, _model['social-icon'], _model['social-color'] )
                      );
              }
      },//CZRSocialsItem
});//$.extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule

var CZRWidgetAreaModuleMths = CZRWidgetAreaModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRWidgetAreaModuleMths, {
      initialize: function( id, constructorOptions ) {
              var module = this;

              api.CZRDynModule.prototype.initialize.call( this, id, constructorOptions );

              //extend the module with new template Selectors
              $.extend( module, {
                    itemPreAddEl : 'czr-module-widgets-pre-add-view-content',
                    itemInputList : 'czr-module-widgets-item-input-list',
                    itemInputListReduced : 'czr-module-widgets-item-input-list-reduced',
                    ruItemPart : 'czr-module-widgets-ru-item-part'
              } );

              //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
              module.inputConstructor = api.CZRInput.extend( module.CZRWZonesInputMths || {} );
              //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
              module.itemConstructor = api.CZRItem.extend( module.CZRWZonesItem || {} );

              module.serverParams = serverControlParams.widget_area_el_params || {};

              //add a shortcut to the server side json properties
              module.contexts = _.has( module.serverParams , 'sidebar_contexts') ? module.serverParams.sidebar_contexts : {};

              //context match map
              module.context_match_map = {
                      is_404 : '404',
                      is_category : 'archive-category',
                      is_home : 'home',
                      is_page : 'page',
                      is_search : 'search',
                      is_single : 'single'
              };


              module.locations = _.has( module.serverParams , 'sidebar_locations') ? module.serverParams.sidebar_locations : {};

              //declares a default model
              module.defaultItemModel = {
                      id : '',
                      title : serverControlParams.i18n.widgetZone,
                      contexts : _.without( _.keys(module.contexts), '_all_' ),//the server list of contexts is an object, we only need the keys, whitout _all_
                      locations : [ module.serverParams.defaultWidgetLocation ],
                      description : ''
              };

              //overrides the default success message
              this.itemAddedMessage = serverControlParams.i18n.widgetZoneAdded;

              //Observe and react to sidebar insights from the preview frame
              // SIDEBAR INSIGHTS => stores and observes the sidebars and widgets settings sent by the preview */
              if ( ! _.has( api, 'sidebar_insights' ) ) {
                    api.sidebar_insights = new api.Values();
                    api.sidebar_insights.create('candidates');//will store the sidebar candidates on preview refresh
                    api.sidebar_insights.create('actives');//will record the refreshed active list of active sidebars sent from the preview
                    api.sidebar_insights.create('inactives');
                    api.sidebar_insights.create('registered');
                    api.sidebar_insights.create('available_locations');
              }


              this.listenToSidebarInsights();

              //React on 'houston-widget-settings'
              //actives :  data.renderedSidebars,
              // inactives :  _inactives,
              // registered :  _registered,
              // candidates :  _candidates,
              // available_locations :  data.availableWidgetLocations//built server side
              api.czr_widgetZoneSettings = api.czr_widgetZoneSettings || new api.Value();
              api.czr_widgetZoneSettings.bind( function( updated_data_sent_from_preview , from ) {
                      module.isReady.then( function() {
                            _.each( updated_data_sent_from_preview, function( _data, _key ) {
                                  api.sidebar_insights( _key ).set( _data );
                            });
                      });
              });




              //AVAILABLE LOCATIONS FOR THE PRE MODEL
              //1) add an observable value to module.preItem to handle the alert visibility
              module.preItem_location_alert_view_state = new api.Value( 'closed');
              //2) add state listeners
              module.preItem_location_alert_view_state.callbacks.add( function( to, from ) {
                        module._toggleLocationAlertExpansion( module.container, to );
              });


              //REACT ON ADD / REMOVE ITEMS
              module.bind( 'item-added', function( model ) {
                      module.addWidgetSidebar( model );
              });

              module.bind( 'pre_item_api_remove' , function(model) {
                      module.removeWidgetSidebar( model );
              });


              //records the top margin value of the widgets panel on each expansion
              var fixTopMargin = new api.Values();
              fixTopMargin.create('fixed_for_current_session');
              fixTopMargin.create('value');

              api.section(module.serverParams.dynWidgetSection).fixTopMargin = fixTopMargin;
              api.section(module.serverParams.dynWidgetSection).fixTopMargin('fixed_for_current_session').set(false);


              //setup reactions on widget section expansion
              //change the expanded behaviour for the widget zone section
              //api.section(module.serverParams.dynWidgetSection).expanded.callbacks.add( function() { return module.widgetSectionReact.apply(module, arguments ); } );

              //bind actions on widget panel expansion and widget zone section expansion
              //Fire the module
              api.panel('widgets').expanded.callbacks.add( function(to, from) {
                    module.widgetPanelReact();//setup some visual adjustments, must be ran each time panel is closed or expanded

                    //Fire the module if not done already
                    if ( 'resolved' == module.isReady.state() )
                      return;
                    module.ready();
              });
      },//initialize




      //When the control is embedded on the page, this method is fired in api.CZRBaseModuleControl:ready()
      //=> right after the module is instantiated.
      ready : function() {
              var module = this;
              api.CZRDynModule.prototype.ready.call( module );

              //add state listener on pre Item view
              module.preItemExpanded.callbacks.add( function( to, from ) {
                    if ( ! to )
                      return;
                    //refresh the location list
                    module.preItem.czr_Input('locations')._setupLocationSelect( true );//true for refresh
                    //refresh the location alert message
                    module.preItem.czr_Input('locations').mayBeDisplayModelAlert();
              });
      },



      //overrides parent method
      //adds the default widget zones in the items
      initializeModuleModel : function( constructorOptions ) {
                  var module = this, dfd = $.Deferred();
                  constructorOptions.items = _.union( _.has( module.serverParams, 'default_zones' ) ? module.serverParams.default_zones : [], constructorOptions.items );
                  return dfd.resolve( constructorOptions ).promise();
      },
















      CZRWZonesInputMths : {
            ready : function() {
                    var input = this;

                    input.bind('locations:changed', function(){
                        input.mayBeDisplayModelAlert();
                    });

                    api.CZRInput.prototype.ready.call( input);
            },



            //////////////////////////////////////////////////
            ///SETUP SELECTS
            //////////////////////////////////////////////////
            //setup select on view_rendered|item_content_event_map
            setupSelect : function() {
                    var input      = this;
                    if ( 'locations' == this.id )
                      this._setupLocationSelect();
                    if ( 'contexts' == this.id )
                      this._setupContextSelect();

            },

            //helper
            _setupContextSelect : function() {
                    var input      = this,
                        input_contexts = input(),
                        item = input.input_parent,
                        module     = input.module;

                    //generates the contexts options
                    _.each( module.contexts, function( title, key ) {
                          var _attributes = {
                                value : key,
                                html: title
                              };
                          if ( key == input_contexts || _.contains( input_contexts, key ) )
                            $.extend( _attributes, { selected : "selected" } );

                          $( 'select[data-type="contexts"]', input.container ).append( $('<option>', _attributes) );
                    });
                    //fire select2
                    $( 'select[data-type="contexts"]', input.container ).select2();
            },


            //helper
            //the refresh param is a bool
            _setupLocationSelect : function(refresh ) {
                    var input      = this,
                        input_locations = input(),
                        item = input.input_parent,
                        module     = input.module,
                        available_locs = api.sidebar_insights('available_locations')();

                    //generates the locations options
                    //append them if not set yet
                    if ( ! $( 'select[data-type="locations"]', input.container ).children().length ) {
                          _.each( module.locations, function( title, key ) {
                                var _attributes = {
                                      value : key,
                                      html: title
                                    };

                                if ( key == input_locations || _.contains( input_locations, key ) )
                                  $.extend( _attributes, { selected : "selected" } );

                                $( 'select[data-type="locations"]', input.container ).append( $('<option>', _attributes) );
                          });
                    }//if

                    function setAvailability( state ) {
                          if (! state.id) { return state.text; }
                          if (  _.contains(available_locs, state.element.value) ) { return state.text; }
                          var $state = $(
                            '<span class="czr-unavailable-location fas fa-ban" title="' + serverControlParams.i18n.unavailableLocation + '">&nbsp;&nbsp;' + state.text + '</span>'
                          );
                          return $state;
                    }

                    if ( refresh ) {
                          $( 'select[data-type="locations"]', input.container ).select2( 'destroy' );
                    }

                    //fire select2
                    $( 'select[data-type="locations"]', input.container ).select2( {
                      templateResult: setAvailability,
                      templateSelection: setAvailability
                    });
            },

            //fired on view event map : 'locations:changed'
            //@param obj { dom_el: $() , model : {} )
            mayBeDisplayModelAlert : function() {
                    var input      = this,
                        item = input.input_parent,
                        module     = input.module;

                    //check if we are in the pre Item case => if so, the locations might be empty
                    if ( ! _.has( item(), 'locations') || _.isEmpty( item().locations ) )
                      return;

                    var _selected_locations = $('select[data-type="locations"]', input.container ).val(),
                        available_locs = api.sidebar_insights('available_locations')(),
                        _unavailable = _.filter( _selected_locations, function( loc ) {
                          return ! _.contains(available_locs, loc);
                        });

                    //check if we are in the pre Item case => if so, the id is empty
                    if ( ! _.has( item(), 'id' ) || _.isEmpty( item().id ) ) {
                          module.preItem_location_alert_view_state.set( ! _.isEmpty( _unavailable ) ? 'expanded' : 'closed' );
                    } else {
                          item.czr_itemLocationAlert.set( ! _.isEmpty( _unavailable ) ? 'expanded' : 'closed' );
                    }
            }
      },//CZRWZonesInputMths















      CZRWZonesItem : {
            initialize : function( id, options ) {
                    var item = this,
                        module = item.module;

                    //Add some observable values for this item
                    item.czr_itemLocationAlert = new api.Value();

                    api.CZRItem.prototype.initialize.call( item, null, options );
            },



            //extend parent setupview
            itemWrapperViewSetup : function() {
                    var item = this,
                        module = item.module;

                    api.CZRItem.prototype.itemWrapperViewSetup.call(item);

                    /// ALERT FOR NOT AVAILABLE LOCATION
                    item.czr_itemLocationAlert.set('closed');

                    //add a state listener on expansion change
                    item.czr_itemLocationAlert.callbacks.add( function( to, from ) {
                          module._toggleLocationAlertExpansion( item.container , to );
                    });

                    //update item title
                    item.writeSubtitleInfos(item());

                    //this is fired just after the itemWrapperViewSetupApiListeners
                    //=> add a callback to refresh the availability status of the locations in the select location picker
                    //add a state listener on expansion change
                    item.viewState.callbacks.add( function( to, from ) {
                          if ( -1 == to.indexOf('expanded') )//can take the expanded_noscroll value !
                            return;
                          //don't try to invoke the input instances before the content is actually rendered
                          //=> there might be cases when the content rendering is debounced...
                          item.bind('contentRendered', function() {
                                //refresh the location list
                                item.czr_Input('locations')._setupLocationSelect( true );//true for refresh
                                //refresh the location alert message
                                item.czr_Input('locations').mayBeDisplayModelAlert();
                          });

                    });
            },


            //extend parent listener
            itemReact : function(to, from) {
                    var item = this;
                    api.CZRItem.prototype.itemReact.call(item, to, from);

                    item.writeSubtitleInfos(to);
                    item.updateSectionTitle(to).setModelUpdateTimer();
            },



            //Fired in setupItemListeners. Reacts to model change.
            //Write html informations under the title : location(s) and context(s)
            writeSubtitleInfos : function(model) {
                    var item = this,
                        module = item.module,
                        _model = _.clone( model || item() ),
                        _locations = [],
                        _contexts = [],
                        _html = '';

                    if ( ! item.container.length )
                      return this;

                    //generate the locations and the contexts text from the json data if exists
                    _model.locations =_.isString(_model.locations) ? [_model.locations] : _model.locations;
                    _.each( _model.locations, function( loc ) {
                          if ( _.has( module.locations , loc ) )
                            _locations.push(module.locations[loc]);
                          else
                            _locations.push(loc);
                      }
                    );

                    //build the context list
                    _model.contexts =_.isString(_model.contexts) ? [_model.contexts] : _model.contexts;

                    //all contexts cases ?
                    if ( item._hasModelAllContexts( model ) ) {
                      _contexts.push(module.contexts._all_);
                    } else {
                      _.each( _model.contexts, function( con ) {
                              if ( _.has( module.contexts , con ) )
                                _contexts.push(module.contexts[con]);
                              else
                                _contexts.push(con);
                            }
                      );
                    }

                    //Translated strings
                    var _locationText = serverControlParams.i18n.locations,
                        _contextText = serverControlParams.i18n.contexts,
                        _notsetText = serverControlParams.i18n.notset;

                    _locations = _.isEmpty( _locations ) ? '<span style="font-weight: bold;">' + _notsetText + '</span>' : _locations.join(', ');
                    _contexts = _.isEmpty( _contexts ) ? '<span style="font-weight: bold;">' + _notsetText + '</span>' : _contexts.join(', ');

                    //write the description if builtin
                    //else, write the dynamic location
                    // if ( _.has(_model, 'description') && _.has(_model, 'is_builtin') )
                    //   _html =  _model.description + ' <strong>|</strong> <u>Contexts</u> : ' + _contexts;
                    // else

                    _html = '<u>' + _locationText + '</u> : ' + _locations + ' <strong>|</strong> <u>' + _contextText + '</u> : ' + _contexts;

                    if ( ! $('.czr-zone-infos', item.container ).length ) {
                          var $_zone_infos = $('<div/>', {
                            class : [ 'czr-zone-infos' , module.control.css_attr.item_sort_handle ].join(' '),
                            html : _html
                          });
                          $( '.' + module.control.css_attr.item_btns, item.container ).after($_zone_infos);
                    } else {
                          $('.czr-zone-infos', item.container ).html(_html);
                    }

                    return this;
            },//writeSubtitleInfos



            ////Fired in setupItemListeners
            updateSectionTitle : function(model) {
                    var _sidebar_id = 'sidebar-widgets-' + model.id,
                        _new_title  = model.title;
                    //does this section exists ?
                    if ( ! api.section.has(_sidebar_id) )
                      return this;

                    //update the section title
                    $('.accordion-section-title', api.section(_sidebar_id).container ).text(_new_title);

                    //update the top title ( visible when inside the expanded section )
                    $('.customize-section-title h3', api.section(_sidebar_id).container ).html(
                      '<span class="customize-action">' + api.section(_sidebar_id).params.customizeAction + '</span>' + _new_title
                    );
                    // $('.customize-section-title h3', api.section(_sidebar_id).container )
                    //   .append('<span>', {
                    //       class: 'customize-section-back',
                    //       html: api.section(_sidebar_id).params.customizeAction
                    //     } )
                    //   .append(_new_title);

                    //remove and re-instanciate
                    //=> works for the section but the controls are not activated anymore.
                    //Should be easy to fix but useless to go further here. Jquery does the job.
                    // var _params = _.clone( api.section(_sidebar_id).params );
                    // _params.title = _new_title;
                    // api.section(_sidebar_id).container.remove();
                    // api.section.remove(_sidebar_id);
                    // api.section.add( _sidebar_id, new api.sectionConstructor[_params.type]( _params.id ,{ params : _params } ) );
                    return this;
            },


            //fired on model_update
            //Don't hammer the preview with too many refreshs
            //2 seconds delay
            setModelUpdateTimer : function() {
                    var item = this,
                        module = item.module;

                    clearTimeout( $.data(this, 'modelUpdateTimer') );
                    $.data(
                        this,
                        'modelUpdateTimer',
                        setTimeout( function() {
                            //refresh preview
                            module.control.refreshPreview();
                        } , 1000)
                    );//$.data
            },


            //@return bool
            //takes the model unique id
            _hasModelAllContexts : function( model ) {
                    var item = this,
                        module = item.module,
                        moduleContexts = _.keys(module.contexts);

                    model = model || this();

                    if ( ! _.has(model, 'contexts') )
                      return;

                    if ( _.contains( model.contexts, '_all_') )
                      return true;

                    //case when model does not have _all_ but all the others
                    return _.isEmpty( _.difference( _.without(moduleContexts, '_all_') , model.contexts ) );
            },

            //@param contexts = array of contexts
            //api.czr_wpQueryInfos is refreshed on each preview refresh
            _getMatchingContexts : function( defaults ) {
                    var module = this,
                        _current = api.czr_wpQueryInfos().conditional_tags || {},
                        _matched = _.filter( module.context_match_map, function( hu, wp ) { return true === _current[wp]; } );

                    return _.isEmpty( _matched ) ? defaults : _matched;
            }
      },//CZRWZonesItem














      //DEPRECATED : THE CONTROLS TO SYNCHRONIZE HAVE BEEN REMOVED

      //fired on model_added_by_user and from the timer method
      //1) model_added, before renderItemWrapper action
      //    when a new model is manually added ( isTrigger is undefined )
      //    => refresh the select options of the other controls using this collection
      //2) model_updated, before updateCollection
      // addControlOptions : function(obj) {
      //   var _controls = _.where( api.settings.controls, {section:"sidebars_select_sec"});
      //   _.map( _controls, function( _control ) {
      //       var $_select = api.control( _control.settings.default ).container.find('select');

      //       //if this option has already been added, simply updates its attributes
      //       if ( 1 === $_select.find('option[value="' + obj.model.id + '"]').length ) {
      //         $_select.find('option[value="' + obj.model.id + '"]').html(obj.model.title);
      //         $_select.selecter("destroy").selecter();
      //       } else {
      //         $_select.append( $('<option>', {value: obj.model.id, html:obj.model.title } ) ).selecter("destroy").selecter();
      //       }
      //   });//map
      // },

      //fired on model_removed
      // removeControlOptions : function(obj) {
      //   var _controls = _.where( api.settings.controls, {section:"sidebars_select_sec"});

      //   _.map( _controls, function( _control ) {
      //       var $_select = api.control( _control.settings.default ).container.find('select');

      //       if ( ! $_select.find('option[value="' + obj.model.id + '"]').length )
      //         return;

      //       $( 'option[value="' + obj.model.id +'"]', $_select).remove();
      //       $_select.selecter("destroy").selecter();
      //   });//map
      // },












      /////////////////////////////////////////
      /// ADD / REMOVE WIDGET ZONES
      ////////////////////////////////////////
      //fired on model_added_by_user
      //
      //can also be called statically when a dynamic sidebar is added in the preview
      //in this case the parameter are the sidebar data with id and name
      addWidgetSidebar : function( model, sidebar_data ) {
            if ( ! _.isObject(model) && _.isEmpty(sidebar_data) ) {
                  throw new Error('No valid input were provided to add a new Widget Zone.');
            }


            //ADD the new sidebar to the existing collection
            //Clone the serverControlParams.defaultWidgetSidebar sidebar
            var module = this,
                _model        = ! _.isEmpty(model) ? _.clone(model) : sidebar_data,
                _new_sidebar  = _.isEmpty(model) ? sidebar_data : $.extend(
                      _.clone( _.findWhere( api.Widgets.data.registeredSidebars, { id: module.serverParams.defaultWidgetSidebar } ) ),
                      {
                            name : _model.title,
                            id : _model.id
                      }
                );

            //Add it to the backbone collection
            api.Widgets.registeredSidebars.add( _new_sidebar );

            //test if added:
            //api.Widgets.registeredSidebars('czr_sidebars_8');


            //ADD the sidebar section
            var _params = $.extend(
                    _.clone( api.section( "sidebar-widgets-" + module.serverParams.defaultWidgetSidebar ).params ),
                    {
                          id : "sidebar-widgets-" + _model.id,
                          instanceNumber: _.max(api.settings.sections, function(sec){ return sec.instanceNumber; }).instanceNumber + 1,
                          sidebarId: _new_sidebar.id,
                          title: _new_sidebar.name,
                          description : 'undefined' != typeof(sidebar_data) ? sidebar_data.description : api.section( "sidebar-widgets-" + module.serverParams.defaultWidgetSidebar ).params.description,
                          //always set the new priority to the maximum + 1 ( module.serverParams.dynWidgetSection is excluded from this calculation because it must always be at the bottom )
                          priority: _.max( _.omit( api.settings.sections, module.serverParams.dynWidgetSection), function(sec){ return sec.instanceNumber; }).priority + 1,
                    }
            );

            api.section.add( _params.id, new api.sectionConstructor[ _params.type ]( _params.id ,{ params : _params } ) );

            //add it to the static collection of settings
            api.settings.sections[ _params.id ] = _params.id;

            //ADD A SETTING
            //Clone the module.serverParams.defaultWidgetSidebar sidebar widget area setting
            var _new_set_id = 'sidebars_widgets['+_model.id+']',
                _new_set    = $.extend(
                      _.clone( api.settings.settings['sidebars_widgets[' + module.serverParams.defaultWidgetSidebar + ']'] ),
                      {
                            value:[]
                      }
                );

            //add it to the static collection of settings
            api.settings.settings[ _new_set_id ] = _new_set;

            //instanciate it
            api.create( _new_set_id, _new_set_id, _new_set.value, {
                    transport: _new_set.transport,
                    previewer: api.previewer,
                    dirty: false
            } );



            //ADD A CONTROL
            var _cloned_control = $.extend(
                      _.clone( api.settings.controls['sidebars_widgets[' + module.serverParams.defaultWidgetSidebar + ']'] ),
                      {
                        settings : { default : _new_set_id }
                  }),
                _new_control = {};


            //replace  serverControlParams.defaultWidgetSidebar  by the new sidebar id
            _.each( _cloned_control, function( param, key ) {
                    if ( 'string' == typeof(param) ) {
                      param = param.replace( module.serverParams.defaultWidgetSidebar , _model.id );
                    }
                    _new_control[key] = param;
            });

            //set the instance number (no sure if needed)
            _new_control.instanceNumber = _.max(api.settings.controls, function(con){ return con.instanceNumber; }).instanceNumber + 1;

            //add it to the static collection of controls
            api.settings.controls[_new_set_id] = _new_control;

            //instanciate it
            api.control.add( _new_set_id, new api.controlConstructor[ _new_control.type ]( _new_set_id, {
                    params: _new_control,
                    previewer: api.previewer
            } ) );


            //say it to the control container
            //only if we are in an instanciated object => because this method can be accessed statically
            if ( _.has(this, 'container') )
              this.container.trigger( 'widget_zone_created', { model : _model, section_id : "sidebar-widgets-" + _model.id , setting_id : _new_set_id });
      },//addWidgetSidebar


      //fired on "after_modelRemoved"
      removeWidgetSidebar : function( model ) {
            var module = this;
            if ( ! _.isObject(model) || _.isEmpty(model) ) {
                  throw new Error('No valid data were provided to remove a Widget Zone.');
            }

            //Remove this sidebar from the backbone collection
            api.Widgets.registeredSidebars.remove( model.id );

            //remove the section from the api values and the DOM if exists
            if ( api.section.has("sidebar-widgets-" + model.id) ) {
                    //Remove the section container from the DOM
                    api.section("sidebar-widgets-" + model.id).container.remove();
                    //Remove the sidebar section from the api
                    api.section.remove( "sidebar-widgets-" + model.id );
                    //Remove this section from the static collection
                    delete api.settings.sections[ "sidebar-widgets-" + model.id ];
            }

            //remove the setting from the api if exists
            if ( api.has('sidebars_widgets['+model.id+']') ) {
                    //Remove this setting from the api
                    api.remove( 'sidebars_widgets['+model.id+']' );
                    //Remove this setting from the static collection
                    delete api.settings.settings['sidebars_widgets['+model.id+']'];
            }

            //remove the widget control of this sidebar from the api and the DOM if exists
            if ( api.control.has('sidebars_widgets['+model.id+']') ) {
                    //Remove the control container from the DOM
                    api.control( 'sidebars_widgets['+model.id+']' ).container.remove();
                    //Remove this control from the api
                    api.control.remove( 'sidebars_widgets['+model.id+']' );
                    //Remove it to the static collection of controls
                    delete api.settings.controls['sidebars_widgets['+model.id+']'];
            }

            //refresh
            var _refresh = function() {
              api.previewer.refresh();
            };
            _refresh = _.debounce( _refresh, 500 );
            $.when( _refresh() ).done( function() {
                  //say it
                  module.trigger( 'widget_zone_removed',
                        {
                              model : model,
                              section_id : "sidebar-widgets-" + model.id ,
                              setting_id : 'sidebars_widgets['+model.id+']'
                        }
                  );
            });
      },











      /////////////////////////////////////////
      /// SET EXPANSION CALLBACKS FOR WIDGET PANEL AND WIDGET ZONE CREATION SECTION
      ////////////////////////////////////////
      //cb of : api.panel('widgets').expanded.callbacks.add
      widgetPanelReact : function() {
            var module = this;
            //will be used for adjustments
            var _top_margin = api.panel('widgets').container.find( '.control-panel-content' ).css('margin-top');

            api.section(module.serverParams.dynWidgetSection).fixTopMargin('value').set( _top_margin );

            var _section_content = api.section(module.serverParams.dynWidgetSection).container.find( '.accordion-section-content' ),
              _panel_content = api.panel('widgets').container.find( '.control-panel-content' ),
              _set_margins = function() {
                    _section_content.css( 'margin-top', '' );
                    _panel_content.css('margin-top', api.section(module.serverParams.dynWidgetSection).fixTopMargin('value')() );
              };

            // Fix the top margin after reflow.
            api.bind( 'pane-contents-reflowed', _.debounce( function() {
                  _set_margins();
            }, 150 ) );

            //Close all views on widget panel expansion/clos
            module.closeAllItems().closeRemoveDialogs();
            //Close preItem dialog box if exists
            if ( _.has( module, 'preItemExpanded' ) )
              module.preItemExpanded.set(false);
      },//widgetPanelReact()


      //cb of api.section(module.serverParams.dynWidgetSection).expanded.callbacks
      widgetSectionReact : function( to, from ) {
            var module = this,
                section =  api.section(module.serverParams.dynWidgetSection),
                container = section.container.closest( '.wp-full-overlay-sidebar-content' ),
                content = section.container.find( '.accordion-section-content' ),
                overlay = section.container.closest( '.wp-full-overlay' ),
                backBtn = section.container.find( '.customize-section-back' ),
                sectionTitle = section.container.find( '.accordion-section-title' ).first(),
                headerActionsHeight = $( '#customize-header-actions' ).height(),
                resizeContentHeight, expand, position, scroll;

            if ( to ) {
                  overlay.removeClass( 'section-open' );
                  content.css( 'height', 'auto' );
                  //section.container.removeClass( 'open' );
                  sectionTitle.attr( 'tabindex', '0' );
                  content.css( 'margin-top', '' );
                  container.scrollTop( 0 );
            }

            module.closeAllItems().closeRemoveDialogs();

            content.slideToggle();
      },







      /////////////////////////////////////////
      /// LISTEN TO SIDEBAR INSIGHTS FROM THE PREVIEW FRAME
      /// REACT TO THEM
      ////////////////////////////////////////
      listenToSidebarInsights : function() {
            var module = this;

            //VISIBILITY BASED ON THE SIDEBAR INSIGHTS
            api.sidebar_insights('registered').callbacks.add( function( _registered_zones ) {
                    var _current_collection = _.clone( module.itemCollection() );
                    _.each( _current_collection, function( _model ) {
                          if ( ! module.getViewEl(_model.id).length )
                            return;

                          module.getViewEl(_model.id).css('display' , _.contains( _registered_zones, _model.id ) ? 'block' : 'none' );
                    });
            });

            //OPACITY SIDEBAR INSIGHTS BASED
            api.sidebar_insights('inactives').callbacks.add( function( _inactives_zones ) {
                    var _current_collection = _.clone( module.itemCollection() );
                    _.each( _current_collection, function( _model ) {
                          if ( ! module.getViewEl(_model.id).length )
                            return;

                          if ( _.contains( _inactives_zones, _model.id ) ) {
                                module.getViewEl( _model.id ).addClass('inactive');
                                if ( ! module.getViewEl( _model.id ).find('.czr-inactive-alert').length ) {
                                      module.getViewEl( _model.id ).find('.czr-item-title').append(
                                        $('<span/>', {class : "czr-inactive-alert", html : " [ " + serverControlParams.i18n.inactiveWidgetZone + " ]" })
                                      );
                                }
                          }
                          else {
                                module.getViewEl( _model.id ).removeClass('inactive');
                                if ( module.getViewEl( _model.id ).find('.czr-inactive-alert').length )
                                  module.getViewEl( _model.id ).find('.czr-inactive-alert').remove();
                          }
                    });
            });

            //WIDGET SIDEBAR CREATION BASED ON SIDEBAR INSIGHTS
            //react to a new register candidate(s) on preview refresh
            api.sidebar_insights('candidates').callbacks.add( function(_candidates) {
                  if ( ! _.isArray(_candidates) )
                    return;
                  _.each( _candidates, function( _sidebar ) {
                        if ( ! _.isObject(_sidebar) )
                          return;
                        //add this widget sidebar and the related setting and control.
                        //Only if not added already
                        if ( api.section.has("sidebar-widgets-" +_sidebar.id ) )
                          return;

                        //access the registration method statically
                        module.addWidgetSidebar( {}, _sidebar );
                        //activate it if so
                        if ( _.has( api.sidebar_insights('actives')(), _sidebar.id ) && api.section.has("sidebar-widgets-" +_sidebar.id ) )
                          api.section( "sidebar-widgets-" +_sidebar.id ).activate();
                  });
            });
      },//listenToSidebarInsights()







      /////////////////////////////////////////
      /// OVERRIDEN METHODS
      ////////////////////////////////////////
      //fired in toggleItemExpansion()
      //has to be overridden for the widget zones control because this control is embedded directly in a panel and not in a section
      //therefore the module to animate the scrollTop is not the section container but $('.wp-full-overlay-sidebar-content')
      _adjustScrollExpandedBlock : function( $_block_el, adjust ) {
            if ( ! $_block_el.length )
              return;
            var module = this,
                _currentScrollTopVal = $('.wp-full-overlay-sidebar-content').scrollTop(),
                _scrollDownVal,
                _adjust = adjust || 90;
            setTimeout( function() {
                  if ( ( $_block_el.offset().top + $_block_el.height() + _adjust ) > $(window.top).height() ) {
                    _scrollDownVal = $_block_el.offset().top + $_block_el.height() + _adjust - $(window.top).height();
                    $('.wp-full-overlay-sidebar-content').animate({
                        scrollTop:  _currentScrollTopVal + _scrollDownVal
                    }, 600);
                  }
            }, 50);
      },



      //overrides the parent class default model getter
      //=> add a dynamic title
      getDefaultItemModel : function( id ) {
              var module = this,
                  _current_collection = module.itemCollection(),
                  _default = _.clone( module.defaultItemModel ),
                  _default_contexts = _default.contexts;
              return $.extend( _default, {
                  title : 'Widget Zone ' +  ( _.size(_current_collection)*1 + 1 )
                  //contexts : module._getMatchingContexts( _default_contexts )
                });
      },



      //overrides parent
      //called before rendering a view. Fired in module::renderItemWrapper()
      //can be overridden to set a specific view template depending on the model properties
      //@return string
      //@type can be
      //Read Update Delete (rud...)
      //Read Update (ru)
      //...
      //@item_model is an object describing the current item model
      getTemplateEl : function( type, item_model ) {
              var module = this, _el;
              //force view-content type to ru-item-part if the model is a built-in (primary, secondary, footer-1, ...)
              //=> user can't delete a built-in model.
              if ( 'rudItemPart' == type ) {
                  type = ( _.has(item_model, 'is_builtin') && item_model.is_builtin ) ? 'ruItemPart' : type;
              } else if ( 'itemInputList' == type ) {
                  type = ( _.has(item_model, 'is_builtin') && item_model.is_builtin ) ? 'itemInputListReduced' : type;
              }

              switch(type) {
                    case 'rudItemPart' :
                      _el = module.rudItemPart;
                        break;
                    case 'ruItemPart' :
                      _el = module.ruItemPart;
                      break;
                    case 'itemInputList' :
                      _el = module.itemInputList;
                      break;
                    case 'itemInputListReduced' :
                      _el = module.itemInputListReduced;
                      break;
              }

              if ( _.isEmpty(_el) ) {
                throw new Error( 'No valid template has been found in getTemplateEl()' );
              } else {
                return _el;
              }
      },


      _toggleLocationAlertExpansion : function( $view, to ) {
              var $_alert_el = $view.find('.czr-location-alert');
              if ( ! $_alert_el.length ) {
                    var _html = [
                      '<span>' + serverControlParams.i18n.locationWarning + '</span>',
                      api.CZR_Helpers.getDocSearchLink( serverControlParams.i18n.locationWarning ),
                    ].join('');

                    $_alert_el = $('<div/>', {
                          class:'czr-location-alert',
                          html:_html,
                          style:"display:none"
                    });

                    $('select[data-type="locations"]', $view ).closest('div').after($_alert_el);
              }
              $_alert_el.toggle( 'expanded' == to);
      }
});//$.extend()
})( wp.customize , jQuery, _ );
//extends api.CZRModule
var CZRBodyBgModuleMths = CZRBodyBgModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRBodyBgModuleMths, {
      initialize: function( id, options ) {
            var module = this;
            //run the parent initialize
            api.CZRModule.prototype.initialize.call( module, id, options );

            //extend the module with new template Selectors
            $.extend( module, {
                  itemInputList : 'czr-module-bodybg-item-content'
            } );

            //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
            module.inputConstructor = api.CZRInput.extend( module.CZRBodyBgInputMths || {} );
            //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
            module.itemConstructor = api.CZRItem.extend( module.CZBodyBgItemMths || {} );

            //declares a default model
            module.defaultItemModel = {
                  'background-color' : '#eaeaea',
                  'background-image' : '',
                  'background-repeat' : 'no-repeat',
                  'background-attachment' : 'fixed',
                  'background-position' : 'center center',
                  'background-size' : 'cover'
            };

            //fired ready :
            //1) on section expansion
            //2) or in the case of a module embedded in a regular control, if the module section is alreay opened => typically when skope is enabled
            if ( _.has( api, 'czr_activeSectionId' ) && module.control.section() == api.czr_activeSectionId() && 'resolved' != module.isReady.state() ) {
                  module.ready();
            }
            api.section( module.control.section() ).expanded.bind(function(to) {
                  if ( 'resolved' == module.isReady.state() )
                    return;
                  module.ready();
            });
      },//initialize



      CZRBodyBgInputMths : {
            //////////////////////////////////////////////////
            ///SETUP SELECTS
            //////////////////////////////////////////////////
            //setup select on view_rendered|item_content_event_map
            setupSelect : function() {
                  var input         = this,
                      _id_param_map = {
                        'background-repeat' : 'bg_repeat_options',
                        'background-attachment' : 'bg_attachment_options',
                        'background-position' : 'bg_position_options'
                      },
                      item          = input.input_parent,
                      serverParams  = serverControlParams.body_bg_module_params,
                      options       = {},
                      module        = input.module;

                  if ( ! _.has( _id_param_map, input.id ) )
                    return;

                  if ( _.isUndefined( serverParams ) || _.isUndefined( serverParams[ _id_param_map[input.id] ] ) )
                    return;
                  options = serverParams[ _id_param_map[input.id] ];
                  if ( _.isEmpty(options) )
                    return;
                  //generates the options
                  _.each( options, function( title, key ) {
                        var _attributes = {
                              value : key,
                              html: title
                            };
                        if ( key == input() || _.contains( input(), key ) )
                          $.extend( _attributes, { selected : "selected" } );

                        $( 'select[data-type]', input.container ).append( $('<option>', _attributes) );
                  });
                  //fire select2
                  $( 'select[data-type]', input.container ).select2();
            }
      },


      CZBodyBgItemMths : {
            //Fired if the item has been instantiated
            //The item.callbacks are declared.
            ready : function() {
                  var item = this;
                  api.CZRItem.prototype.ready.call( item );

                  item.inputCollection.bind( function( _col_ ) {
                        if ( ! _.isEmpty( _col ) && item.czr_Input && item.czr_Input.has( 'background-image' ) ) {
                              item.czr_Input('background-image').isReady.done( function( input_instance ) {
                                    var set_visibilities = function( bg_val  ) {
                                          var is_bg_img_set = ! _.isEmpty( bg_val ) ||_.isNumber( bg_val);
                                          _.each( ['background-repeat', 'background-attachment', 'background-position', 'background-size'], function( dep ) {
                                                item.czr_Input(dep).container.toggle( is_bg_img_set || false );
                                          });
                                    };
                                    set_visibilities( input_instance() );
                                    //update the item model on 'background-image' change
                                    item.bind('background-image:changed', function(){
                                          set_visibilities( item.czr_Input('background-image')() );
                                    });
                              });
                        }
                  });

            },

      }
});//$.extend
})( wp.customize , jQuery, _ );
(function ( api, $, _ ) {
//provides a description of each module
      //=> will determine :
      //1) how to initialize the module model. If not crud, then the initial item(s) model shall be provided
      //2) which js template(s) to use : if crud, the module template shall include the add new and pre-item elements.
      //   , if crud, the item shall be removable
      //3) how to render : if multi item, the item content is rendered when user click on edit button.
      //    If not multi item, the single item content is rendered as soon as the item wrapper is rendered.
      //4) some DOM behaviour. For example, a multi item shall be sortable.
      api.czrModuleMap = api.czrModuleMap || {};
      $.extend( api.czrModuleMap, {
            czr_widget_areas_module : {
                  mthds : CZRWidgetAreaModuleMths,
                  crud : true,
                  sektion_allowed : false,
                  name : 'Widget Areas'
            },
            czr_social_module : {
                  mthds : CZRSocialModuleMths,
                  crud : true,
                  name : 'Social Icons',
                  has_mod_opt : true
            },
            czr_background : {
                  mthds : CZRBodyBgModuleMths,
                  crud : false,
                  multi_item : false,
                  name : 'Slider'
            }
      });
})( wp.customize, jQuery, _ );
//named czr_multiple_picker in the php setting map
var CZRMultiplePickerMths = CZRMultiplePickerMths || {};
/* Multiple Picker */
/**
 * @constructor
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
( function ( api, $, _ ) {
$.extend( CZRMultiplePickerMths , {
      ready: function() {
            var control  = this,
                _select  = this.container.find('select');


            _select.select2({
                  closeOnSelect: false,
                  templateSelection: czrEscapeMarkup
            });

            function czrEscapeMarkup(obj) {
                  //trim dashes
                  return obj.text.replace(/\u2013|\u2014/g, "");
            }

            //handle case when all choices become unselected
            _select.on('change', function(e){
                  if ( 0 === $(this).find("option:selected").length )
                    control.setting.set([]);
            });
      }
});//$.extend
})( wp.customize , jQuery, _ );
//named czr_cropped_image in the php setting map
var CZRCroppedImageMths = CZRCroppedImageMths || {};

(function (api, $, _) {
      /* IMAGE UPLOADER CONTROL IN THE CUSTOMIZER */
      //CroppedImageControl is not available before wp 4.3
      if ( 'function' != typeof wp.media.controller.Cropper  || 'function' != typeof api.CroppedImageControl  )
        return;


      /* CZRCustomizeImage Cropper */
      /**
      * Custom version of:
      * wp.media.controller.CustomizeImageCropper (wp-includes/js/media-views.js)
      *
      * In order to use image destination sizes different than the suggested ones
      *
      * A state for cropping an image.
      *
      * @class
      * @augments wp.media.controller.Cropper
      * @augments wp.media.controller.State
      * @augments Backbone.Model
      */
      wp.media.controller.CZRCustomizeImageCropper = wp.media.controller.Cropper.extend({
            doCrop: function( attachment ) {
                  var cropDetails = attachment.get( 'cropDetails' ),
                      control = this.get( 'control' );

                  cropDetails.dst_width  = control.params.dst_width;
                  cropDetails.dst_height = control.params.dst_height;

                  return wp.ajax.post( 'crop-image', {
                        wp_customize: 'on',
                        nonce: attachment.get( 'nonces' ).edit,
                        id: attachment.get( 'id' ),
                        context: control.id,
                        cropDetails: cropDetails
                  } );
            }
      });



      /* CZRCroppedImageControl */
      $.extend( CZRCroppedImageMths , {
            /**
            * Create a media modal select frame, and store it so the instance can be reused when needed.
            * CZR: We don't want to crop svg (cropping fails), gif (animated gifs become static )
            * @Override
            * We need to override this in order to use our ImageCropper custom extension of wp.media.controller.Cropper
            *
            * See api.CroppedImageControl:initFrame() ( wp-admin/js/customize-controls.js )
            */
            initFrame: function() {

                  var l10n = _wpMediaViewsL10n;

                  this.frame = wp.media({
                        button: {
                            text: l10n.select,
                            close: false
                        },
                        states: [
                            new wp.media.controller.Library({
                                title: this.params.button_labels.frame_title,
                                library: wp.media.query({ type: 'image' }),
                                multiple: false,
                                date: false,
                                priority: 20,
                                suggestedWidth: this.params.width,
                                suggestedHeight: this.params.height
                            }),
                            new wp.media.controller.CZRCustomizeImageCropper({
                                imgSelectOptions: this.calculateImageSelectOptions,
                                control: this
                            })
                        ]
                  });

                  this.frame.on( 'select', this.onSelect, this );
                  this.frame.on( 'cropped', this.onCropped, this );
                  this.frame.on( 'skippedcrop', this.onSkippedCrop, this );
            },

            /**
            * After an image is selected in the media modal, switch to the cropper
            * state if the image isn't the right size.
            *
            * CZR: We don't want to crop svg (cropping fails), gif (animated gifs become static )
            * @Override
            * See api.CroppedImageControl:onSelect() ( wp-admin/js/customize-controls.js )
            */
            onSelect: function() {
                  var attachment = this.frame.state().get( 'selection' ).first().toJSON();
                  if ( ! ( attachment.mime && attachment.mime.indexOf("image") > -1 ) ){
                        //Todo: better error handling, show some message?
                        this.frame.trigger( 'content:error' );
                        return;
                  }
                  if ( ( _.contains( ['image/svg+xml', 'image/gif'], attachment.mime ) ) || //do not crop gifs or svgs
                          this.params.width === attachment.width && this.params.height === attachment.height && ! this.params.flex_width && ! this.params.flex_height ) {
                        this.setImageFromAttachment( attachment );
                        this.frame.close();
                  } else {
                        this.frame.setState( 'cropper' );
                  }
            },
      });//extend
})( wp.customize, jQuery, _);

//named czr_upload in the php setting map
var CZRUploadMths = CZRUploadMths || {};
( function ( api, $, _ ) {
/**
 * @constructor
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
$.extend( CZRUploadMths, {
      ready: function() {
            var control = this;

            this.params.removed = this.params.removed || '';

            this.success = $.proxy( this.success, this );

            this.uploader = $.extend({
                  container: this.container,
                  browser:   this.container.find('.czr-upload'),
                  //dropzone:  this.container.find('.upload-dropzone'),
                  success:   this.success,
                  plupload:  {},
                  params:    {}
            }, this.uploader || {} );

            if ( control.params.extensions ) {
                  control.uploader.plupload.filters = [{
                    title:      api.l10n.allowedFiles,
                    extensions: control.params.extensions
                  }];
            }

            if ( control.params.context )
              control.uploader.params['post_data[context]'] = this.params.context;

            if ( api.settings.theme.stylesheet )
              control.uploader.params['post_data[theme]'] = api.settings.theme.stylesheet;

            this.uploader = new wp.Uploader( this.uploader );

            this.remover = this.container.find('.remove');
            this.remover.on( 'click keydown', function( event ) {
                  if ( event.type === 'keydown' &&  13 !== event.which ) // enter
                    return;
                  control.setting.set( control.params.removed );
                  event.preventDefault();
            });

            this.removerVisibility = $.proxy( this.removerVisibility, this );
            this.setting.bind( this.removerVisibility );
            this.removerVisibility( this.setting() );
      },


      success: function( attachment ) {
            this.setting.set( attachment.get('id') );
      },
      removerVisibility: function( to ) {
            this.remover.toggle( to != this.params.removed );
      }
});//extend
})( wp.customize , jQuery, _ );
//named czr_layouts in the php setting map
var CZRLayoutSelectMths = CZRLayoutSelectMths || {};
( function ( api, $, _ ) {
$.extend( CZRLayoutSelectMths , {
      ready: function() {
            this.setupSelect();
      },

      setupSelect : function( obj ) {
            var control = this;
                $_select  = this.container.find('select');

            function addImg( state ) {
                  if (! state.id) { return state.text; }
                  if ( ! _.has( control.params.layouts, state.element.value ) )
                    return;

                  var _layout_data = control.params.layouts[state.element.value],
                      _src = _layout_data.src,
                      _title = _layout_data.label,
                      $state = $(
                    '<img src="' + _src +'" class="czr-layout-img" title="' + _title + '" /><span class="czr-layout-title">' + _title + '</span>'
                  );
                  return $state;
            }

            //destroy selected if set
            //$_select.selecter("destroy");

            //fire select2
            $_select.select2( {
                  templateResult: addImg,
                  templateSelection: addImg,
                  minimumResultsForSearch: Infinity
            });
      },
});//$.extend
})( wp.customize , jQuery, _ );
( function ( api, $, _ ) {
      //THEME CONTROLS
      //api.CZRBackgroundControl     = api.CZRItemControl.extend( CZRBackgroundMths );

      //api.CZRWidgetAreasControl    = api.CZRDynModule.extend( CZRWidgetAreasMths );

      api.CZRUploadControl          = api.Control.extend( CZRUploadMths );
      api.CZRLayoutControl          = api.Control.extend( CZRLayoutSelectMths );
      api.CZRMultiplePickerControl  = api.Control.extend( CZRMultiplePickerMths );


      $.extend( api.controlConstructor, {
            czr_upload     : api.CZRUploadControl,
            //czr_sidebars   : api.CZRWidgetAreasControl,
            //czr_socials    : api.CZRSocialControl,
            czr_multiple_picker : api.CZRMultiplePickerControl,
            czr_layouts    : api.CZRLayoutControl
            //czr_background : api.CZRBackgroundControl
      });

      if ( 'function' == typeof api.CroppedImageControl ) {
            api.CZRCroppedImageControl   = api.CroppedImageControl.extend( CZRCroppedImageMths );

            $.extend( api.controlConstructor, {
                  czr_cropped_image : api.CZRCroppedImageControl
            });
      }

      if ( 'function' == typeof api.CodeEditorControl ) {
            $.extend( api.controlConstructor, {
                  czr_code_editor : api.CodeEditorControl
            });
      }

})( wp.customize, jQuery, _ );
( function (api, $, _) {
      var $_nav_section_container,
          i18n = serverControlParams.i18n || {};

      api.czr_CrtlDependenciesReady = $.Deferred();

      api.bind( 'ready' , function() {
            if ( _.has( api, 'czr_ctrlDependencies') )
              return;
            if ( serverControlParams.isSkopOn ) {
                  // If skope is on, we need to wait for the initial setup to be finished
                  // otherwise, we might refer to not instantiated skopes when processing silent updates further in the code
                  //Skope is ready when :
                  //1) the initial skopes collection has been populated
                  //2) the initial skope has been switched to
                  if ( 'resolved' != api.czr_skopeReady.state() ) {
                        api.czr_skopeReady.done( function() {
                              api.czr_ctrlDependencies = new api.CZR_ctrlDependencies();
                              api.czr_CrtlDependenciesReady.resolve();
                        });
                  }
            } else {
                  api.czr_ctrlDependencies = new api.CZR_ctrlDependencies();
                  api.czr_CrtlDependenciesReady.resolve();
            }

      } );


      api.CZR_ctrlDependencies = api.Class.extend( {
              dominiDeps : [],
              initialize: function() {
                    var self = this;

                    this.defaultDominusParams = {
                          dominus : '',
                          servi : [],
                          visibility : null,
                          actions : null,
                          onSectionExpand : true
                    };

                    //store the default control dependencies
                    this.dominiDeps = _.extend( this.dominiDeps, this._getControlDeps() );
                    if ( ! _.isArray( self.dominiDeps ) ) {
                        throw new Error('Visibilities : the dominos dependency array is not an array.');
                    }
                    api.czr_activeSectionId.bind( function( section_id ) {
                          if ( ! _.isEmpty( section_id ) && api.section.has( section_id ) ) {
                                try {
                                      self.setServiDependencies( section_id );
                                } catch( er ) {
                                      api.errorLog( 'In api.CZR_ctrlDependencies : ' + er );
                                }
                          }
                    });


                    //@param target_source is an object :
                    // {
                    //    target : section_id to awake
                    //    source : section_id from which the request for awaking has been done
                    // }
                    api.bind( 'awaken-section', function( target_source ) {
                          //if skope on ( serverControlParams.isSkopOn ), then defer the visibility awakening after the silent updates
                          if ( serverControlParams.isSkopOn && _.has( api ,'czr_skopeBase' ) ) {
                                api.czr_skopeBase.processSilentUpdates( {
                                      candidates : {},
                                      section_id : target_source.target,
                                      refresh : false
                                } ).then( function() {
                                      try {
                                            self.setServiDependencies( target_source.target, target_source.source );
                                      } catch( er ) {
                                            api.errorLog( 'On awaken-section, ctrl deps : ' + er );
                                      }
                                });
                          } else {
                                try {
                                      self.setServiDependencies( target_source.target, target_source.source );
                                } catch( er ) {
                                      api.errorLog( 'On awaken-section, ctrl deps : ' + er );
                                }
                          }
                    });

                    //FAVICON SPECIFICS
                    //@todo => move to the theme ?
                    //favicon note on load and on change(since wp 4.3)
                    this._handleFaviconNote();
              },


              //Process the visibility callbacks for the controls of a target targetSectionId
              //@param targetSectionId : string
              //@param sourceSectionId : string, the section from which the request has been done
              setServiDependencies : function( targetSectionId, sourceSectionId, refresh ) {
                    var self = this, params, dfd = $.Deferred();

                    refresh = refresh || false;

                    if ( _.isUndefined( targetSectionId ) || ! api.section.has( targetSectionId ) ) {
                          throw new Error( 'Control Dependencies : the targetSectionId is missing or not registered : ' + targetSectionId );
                    }

                    //Assign a visibility state deferred to the target section
                    api.section( targetSectionId ).czr_ctrlDependenciesReady = api.section( targetSectionId ).czr_ctrlDependenciesReady || $.Deferred();

                    //Bail here if this section has already been setup for ctrl dependencies
                    if ( ! refresh && 'resolved' == api.section( targetSectionId ).czr_ctrlDependenciesReady.state() )
                      return dfd.resolve().promise();

                    //FIND DOMINI IN THE TARGET SECTION
                    //=> setup their callbacks
                    _.each( self.dominiDeps , function( params ) {
                          if ( ! _.has( params, 'dominus' ) || ! _.isString( params.dominus ) || _.isEmpty( params.dominus ) ) {
                                throw new Error( 'Control Dependencies : a dominus control id must be a not empty string.');
                          }

                          var wpDominusId = api.CZR_Helpers.build_setId( params.dominus );
                          if ( ! api.control.has( wpDominusId ) )
                            return;

                          if ( api.control( wpDominusId ).section() != targetSectionId )
                            return;

                          //Attempt to normalize the params
                          params = self._prepareDominusParams( params );
                          if ( _.isEmpty(params) )
                            return;

                          self._processDominusCallbacks( params.dominus, params, refresh )
                                .fail( function() {
                                      api.consoleLog( 'self._processDominusCallbacks fail for section ' + targetSectionId );
                                      dfd.reject();
                                })
                                .done( function() {
                                      dfd.resolve();
                                });
                    });


                    //EXTERNAL DOMINI : AWAKE THE SECTIONS
                    //check if any control of the current section is the servus of a dominus located in another section
                    var _secCtrls = api.CZR_Helpers.getSectionControlIds( targetSectionId ),
                        _getServusDomini = function( shortServudId ) {
                              var _dominiIds = [];
                              _.each( self.dominiDeps , function( params ) {
                                    if ( ! _.has( params, 'servi' ) || ! _.isArray( params.servi ) || ! _.has( params, 'dominus' ) || _.isEmpty( params.dominus ) ) {
                                          api.errorLog( 'Control Dependencies : wrong params in _getServusDomini.');
                                          return;
                                    }

                                    if ( _.contains( params.servi , shortServudId ) && ! _.contains( _dominiIds , params.dominus ) ) {
                                          //Attempt to normalize the params
                                          params = self._prepareDominusParams( params );
                                          if ( _.isEmpty(params) )
                                            return;
                                          else
                                            _dominiIds.push( params.dominus );
                                    }
                              });
                              return ! _.isArray( _dominiIds ) ? [] : _dominiIds;
                        },
                        _servusDominiIds = [];

                    //Build the domini array
                    _.each( _secCtrls, function( servusCandidateId ) {
                          if ( _.isEmpty( _getServusDomini( servusCandidateId ) ) )
                            return;

                          _servusDominiIds = _.union( _servusDominiIds, _getServusDomini( servusCandidateId ) );
                    });

                    //let's loop on the domini ids and check if we need to "awake" an external section
                    _.each( _servusDominiIds, function( shortDominusId ){

                          var wpDominusId = api.CZR_Helpers.build_setId( shortDominusId );
                          //This dominus must be located in another section
                          if ( api.control( wpDominusId ).section() == targetSectionId )
                              return;
                          //The dominus section can't be the current source if set. => otherwise potential infinite loop scenario.
                          if ( sourceSectionId == api.control( wpDominusId ).section() )
                              return;
                          //inform the api that a section has to be awaken
                          //=> first silently update the section controls if skope on
                          //=> then fire the visibilities
                          api.trigger( 'awaken-section', {
                                target : api.control( wpDominusId ).section(),
                                source : targetSectionId
                          } );
                    } );

                    //This section has been setup for ctrl dependencies
                    dfd.always( function() {
                          api.section( targetSectionId ).czr_ctrlDependenciesReady.resolve();
                    });
                    return dfd.promise();
              },


              //This method fires a callback when a control is registered in the api.
              //If the control is registered, then it fires the callback when it is embedded
              //If the control is embedeed, it fires the callback
              //=> typical use case : a control can be both removed from the API and the DOM, and then added back on skope switch
              //
              //@param wpCtrlId : string name of the control as registered in the WP API
              //@param callback : fn callback to fire
              //@param args : [] or callback arguments
              _deferCallbackForControl : function( wpCrtlId, callback, args ) {
                    var dfd = $.Deferred();
                    if ( _.isEmpty(wpCrtlId) || ! _.isString(wpCrtlId) ) {
                        throw new Error( '_deferCallbackForControl : the control id is missing.' );
                    }
                    if ( ! _.isFunction( callback ) ) {
                        throw new Error( '_deferCallbackForControl : callback must be a funtion.' );
                    }
                    args = ( _.isUndefined(args) || ! _.isArray( args ) ) ? [] : args;

                    if ( api.control.has( wpCrtlId ) ) {
                          if ( 'resolved' == api.control(wpCrtlId ).deferred.embedded.state() ) {
                                $.when( callback.apply( null, args ) )
                                      .fail( function() { dfd.reject(); })
                                      .done( function() { dfd.resolve(); });
                          } else {
                                api.control( wpCrtlId ).deferred.embedded.then( function() {
                                      $.when( callback.apply( null, args ) )
                                            .fail( function() { dfd.reject(); })
                                            .done( function() { dfd.resolve(); });
                                });
                          }
                    } else {
                          api.control.when( wpCrtlId, function() {
                                api.control( wpCrtlId ).deferred.embedded.then( function() {
                                      $.when( callback.apply( null, args ) )
                                            .fail( function() { dfd.reject(); })
                                            .done( function() { dfd.resolve(); });
                                });
                          });
                    }
                    return dfd.promise();
              },


              /*
              * @return void
              * show or hide setting according to the dependency + callback pair
              * @params setId = the short setting id, whitout the theme option prefix OR the WP built-in setting
              * @params o = { controls [], callback fn, onSectionExpand bool }
              */
              _processDominusCallbacks : function( shortDominusId, dominusParams, refresh ) {
                    var self = this,
                        wpDominusId = api.CZR_Helpers.build_setId( shortDominusId ),
                        dominusSetInst = api( wpDominusId ),
                        dfd = $.Deferred(),
                        hasProcessed = false;

                    //loop on the dominus servi and apply + bind the visibility cb
                    _.each( dominusParams.servi , function( servusShortSetId ) {
                            if ( ! api.control.has( api.CZR_Helpers.build_setId( servusShortSetId ) ) ) {
                                return;
                            }
                            //set visibility when control is embedded
                            //or when control is added to the api
                            //=> solves the problem of visibility callbacks lost when control are re-rendered
                            var _fireDominusCallbacks = function( dominusSetVal, servusShortSetId, dominusParams, refresh ) {
                                      var _toFire = [],
                                          _args = arguments;
                                      _.each( dominusParams, function( _item, _key ) {
                                            switch( _key ) {
                                                case 'visibility' :
                                                    self._setVisibility.apply( null, _args );
                                                break;
                                                case 'actions' :
                                                    if ( _.isFunction( _item ) )
                                                        _item.apply( null, _args );
                                                break;
                                            }
                                      });
                                },
                                _deferCallbacks = function( dominusSetVal ) {
                                      dominusSetVal = dominusSetVal  || dominusSetInst();
                                      var wpServusSetId = api.CZR_Helpers.build_setId( servusShortSetId );
                                      self._deferCallbackForControl(
                                                  wpServusSetId,
                                                  _fireDominusCallbacks,
                                                  [ dominusSetVal, servusShortSetId, dominusParams ]
                                            )
                                            .always( function() { hasProcessed = true; })
                                            .fail( function() { dfd.reject(); })
                                            .done( function() { dfd.resolve(); });
                                };


                            //APPLY THE DEPENDENCIES
                            _deferCallbacks();

                            //BIND THE DOMINUS SETTING INSTANCE
                            //store the visibility bound state
                            if ( ! _.has( dominusSetInst, 'czr_visibilityServi' ) )
                                dominusSetInst.czr_visibilityServi = new api.Value( [] );

                            //Maybe bind to react on setting _dirty change
                            var _currentDependantBound = dominusSetInst.czr_visibilityServi();
                            //Make sure a dependant visibility action is bound only once for a setting id to another setting control id
                            if ( ! _.contains( _currentDependantBound, servusShortSetId ) ) {
                                  dominusSetInst.bind( function( dominusSetVal ) {
                                      _deferCallbacks( dominusSetVal );
                                  });
                                  dominusSetInst.czr_visibilityServi( _.union( _currentDependantBound, [ servusShortSetId ] ) );
                            }
                    } );//_.each
                    if ( ! hasProcessed )
                      return dfd.resolve().promise();
                    return dfd.promise();
              },



              //@return void()
              _setVisibility : function ( dominusSetVal, servusShortSetId, dominusParams, refresh ) {
                    var wpServusSetId = api.CZR_Helpers.build_setId( servusShortSetId ),
                        visibility = dominusParams.visibility( dominusSetVal, servusShortSetId, dominusParams.dominus );

                    refresh = refresh || false;
                    //Allows us to filter between visibility callbacks and other actions
                    //a non visibility callback shall return null
                    if ( ! _.isBoolean( visibility ) || ( 'unchanged' == visibility && ! refresh ) )
                      return;

                    //when skope is enabled, we might be doing a silent update
                    //=> this method should be bailed if so
                    var _doVisibilitiesWhenPossible = function() {
                            if ( api.state.has( 'silent-update-processing' ) && api.state( 'silent-update-processing' )() )
                              return;
                            api.control( wpServusSetId, function( _controlInst ) {
                                  var _args = {
                                        duration : 'fast',
                                        completeCallback : function() {},
                                        unchanged : false
                                  };

                                  if ( _.has( _controlInst, 'active' ) )
                                    visibility = visibility && _controlInst.active();

                                  if ( _.has( _controlInst, 'defaultActiveArguments' ) )
                                    _args = control.defaultActiveArguments;

                                  _controlInst.onChangeActive( visibility , _controlInst.defaultActiveArguments );
                            });
                            if ( api.state.has( 'silent-update-processing' ) ) {
                                  api.state( 'silent-update-processing' ).unbind( _doVisibilitiesWhenPossible );
                            }
                    };

                    if ( api.state.has( 'silent-update-processing' ) && api.state( 'silent-update-processing' )() ) {
                          api.state( 'silent-update-processing' ).bind( _doVisibilitiesWhenPossible );
                    } else {
                          _doVisibilitiesWhenPossible();
                    }

              },










              /*****************************************************************************
              * HELPERS
              *****************************************************************************/
              /*
              * Abstract
              * Will be provided by the theme
              * @return main control dependencies object
              */
              _getControlDeps : function() {
                return {};
              },


              //@return a visibility ready object of param describing the dependencies between a dominus and its servi.
              //this.defaultDominusParams = {
              //       dominus : '',
              //       servi : [],
              //       visibility : fn() {},
              //       actions : fn() {},
              //       onSectionExpand : true
              // };
              _prepareDominusParams : function( params_candidate ) {
                    var self = this,
                        _ready_params = {};

                    //Check mandatory conditions
                    if ( ! _.isObject( params_candidate ) ) {
                          api.errorLog( 'Visibilities : a dominus param definition must be an object.');
                          return _ready_params;
                    }
                    if ( ! _.has( params_candidate, 'visibility' ) && ! _.has( params_candidate, 'actions' ) ) {
                          api.errorLog( 'Visibilities : a dominus definition must include a visibility or an actions callback.');
                          return _ready_params;
                    }
                    if ( ! _.has( params_candidate, 'dominus' ) || ! _.isString( params_candidate.dominus ) || _.isEmpty( params_candidate.dominus ) ) {
                          api.errorLog( 'Visibilities : a dominus control id must be a not empty string.');
                          return _ready_params;
                    }
                    var wpDominusId = api.CZR_Helpers.build_setId( params_candidate.dominus );
                    if ( ! api.control.has( wpDominusId ) ) {
                          api.errorLog( 'Visibilities : a dominus control id is not registered : ' + wpDominusId );
                          return _ready_params;
                    }
                    if ( ! _.has( params_candidate, 'servi' ) || _.isUndefined( params_candidate.servi ) || ! _.isArray( params_candidate.servi ) || _.isEmpty( params_candidate.servi ) ) {
                          api.errorLog( 'Visibilities : servi must be set as an array not empty.');
                          return _ready_params;
                    }

                    _.each( self.defaultDominusParams , function( _value, _key ) {
                        var _candidate_val = params_candidate[ _key ];

                        switch( _key ) {
                              case 'visibility' :
                                  if ( ! _.isUndefined( _candidate_val ) && ! _.isEmpty( _candidate_val ) && ! _.isFunction( _candidate_val ) ) {
                                        throw new Error( 'Visibilities : a dominus visibility callback must be a function : ' + params_candidate.dominus );
                                  }
                              break;
                              case 'actions' :
                                  if ( ! _.isUndefined( _candidate_val ) && ! _.isEmpty( _candidate_val ) && ! _.isFunction( _candidate_val ) ) {
                                        throw new Error( 'Visibilities : a dominus actions callback must be a function : ' + params_candidate.dominus );
                                  }
                              break;
                              case 'onSectionExpand' :
                                  if ( ! _.isUndefined( _candidate_val ) && ! _.isEmpty( _candidate_val ) && ! _.isBoolean( _candidate_val ) ) {
                                        throw new Error( 'Visibilities : a dominus onSectionExpand param must be a boolean : ' + params_candidate.dominus );
                                  }
                              break;
                        }
                        _ready_params[_key] = _candidate_val;
                    });

                    return _ready_params;
              },



              /*****************************************************************************
              * FAVICON SPECIFICS
              *****************************************************************************/
              /**
              * Fired on api ready
              * May change the site_icon description on load
              * May add a callback to site_icon
              * @return void()
              */
              _handleFaviconNote : function() {
                    var self = this,
                        _fav_setId = api.CZR_Helpers.build_setId( serverControlParams.faviconOptionName );
                    //do nothing if (||)
                    //1) WP version < 4.3 where site icon has been introduced
                    //2) User had not defined a favicon
                    //3) User has already set WP site icon
                    if ( ! api.has('site_icon') || ! api.control('site_icon') || ( api.has( _fav_setId ) && 0 === + api( _fav_setId )() ) || + api('site_icon')() > 0 )
                      return;

                    var _oldDes     = api.control('site_icon').params.description;
                        _newDes     = ['<strong>' , i18n.faviconNote || '' , '</strong><br/><br/>' ].join('') + _oldDes;

                    //on api ready
                    self._printFaviconNote(_newDes );

                    //on site icon change
                    api('site_icon').callbacks.add( function(to) {
                      if ( +to > 0 ) {
                        //reset the description to default
                        api.control('site_icon').container.find('.description').text(_oldDes);
                        //reset the previous favicon setting
                        if ( api.has( _fav_setId ) )
                          api( _fav_setId ).set("");
                      }
                      else {
                        self._printFaviconNote(_newDes );
                      }
                    });
              },

              //Add a note to the WP control description if user has already defined a favicon
              _printFaviconNote : function( _newDes ) {
                    api.control('site_icon').container.find('.description').html(_newDes);
              }
        }
      );//api.Class.extend() //api.CZR_ctrlDependencies
})( wp.customize, jQuery, _);
//DOM READY :
//1) FIRE SPECIFIC INPUT PLUGINS
//2) ADD SOME COOL STUFFS
//3) SPECIFIC CONTROLS ACTIONS
( function ( wp, $ ) {
      $( function($) {
            var api = wp.customize || api;

            //WHAT IS HAPPENING IN THE MESSENGER
            // $(window.parent).on( 'message', function(e, o) {
            //   api.consoleLog('SENT STUFFS', JSON.parse( e.originalEvent.data), e );
            // });
            // $( window ).on( 'message', function(e, o) {
            //   api.consoleLog('INCOMING MESSAGE', JSON.parse( e.originalEvent.data), e );
            // });
            // $(window.document).bind("ajaxSend", function(e, o){
            //    api.consoleLog('AJAX SEND', e, arguments );
            // }).bind("ajaxComplete", function(e, o){
            //    api.consoleLog('AJAX COMPLETE', e, o);
            // });

            /* RECENTER CURRENT SECTIONS */
            $('.accordion-section').not('.control-panel').click( function () {
                  _recenter_current_section($(this));
            });

            function _recenter_current_section( section ) {
                  var $siblings               = section.siblings( '.open' );
                  //check if clicked element is above or below sibling with offset.top
                  if ( 0 !== $siblings.length &&  $siblings.offset().top < 0 ) {
                        $('.wp-full-overlay-sidebar-content').animate({
                              scrollTop:  - $('#customize-theme-controls').offset().top - $siblings.height() + section.offset().top + $('.wp-full-overlay-sidebar-content').offset().top
                        }, 700);
                  }
            }//end of fn


            /* CHECKBOXES */
            api.czrSetupCheckbox = function( controlId, refresh ) {
                  var _ctrl = api.control( controlId );
                  $('input[type=checkbox]', _ctrl.container ).each( function() {
                        //Exclude font customizer
                        if ( 'tc_font_customizer_settings' == _ctrl.params.section )
                          return;
                        //first fix the checked / unchecked status
                        if ( 0 === $(this).val() || '0' == $(this).val() || 'off' == $(this).val() || _.isEmpty($(this).val() ) ) {
                              $(this).prop('checked', false);
                        } else {
                              $(this).prop('checked', true);
                        }

                        //then render icheck if not done already
                        if ( 0 !== $(this).closest('div[class^="icheckbox"]').length )
                          return;

                        $(this).iCheck({
                              checkboxClass: 'icheckbox_flat-grey',
                              //checkedClass: 'checked',
                              radioClass: 'iradio_flat-grey',
                        })
                        .on( 'ifChanged', function(e){
                              $(this).val( false === $(this).is(':checked') ? 0 : 1 );
                              $(e.currentTarget).trigger('change');
                        });
                  });
            };//api.czrSetupCheckbox()

            /* SELECT INPUT */
            api.czrSetupSelect = function(controlId, refresh) {
                  //Exclude no-selecter-js
                  $('select[data-customize-setting-link]', api.control(controlId).container )
                        .not('.no-selecter-js')
                        .each( function() {
                              $(this).selecter({
                              //triggers a change event on the view, passing the newly selected value + index as parameters.
                              // callback : function(value, index) {
                              //   self.triggerSettingChange( window.event || {} , value, index); // first param is a null event.
                              // }
                              });
                        });
            };//api.czrSetupSelect()


            /* NUMBER INPUT */
            api.czrSetupStepper = function( controlId, refresh ) {
                  //Exclude no-selecter-js
                  var _ctrl = api.control( controlId );
                  $('input[type="number"]', _ctrl.container ).each( function() { $(this).stepper(); });
            };//api.czrSetupStepper()

            // LOOP ON EACH CONTROL REGISTERED AND INSTANTIATE THE PLUGINS
            // @todo => react on control added
            api.control.each( function( control ){
                  if ( ! _.has( control, 'id' ) )
                    return;
                  //exclude widget controls and menu controls for checkboxes
                  if ( 'widget_' != control.id.substring(0, 'widget_'.length ) && 'nav_menu' != control.id.substring( 0, 'nav_menu'.length ) ) {
                        api.czrSetupCheckbox(control.id);
                  }
                  if ( 'nav_menu_locations' != control.id.substring( 0, 'nav_menu_locations'.length ) ) {
                        api.czrSetupSelect(control.id);
                  }

                  // Stepper : exclude controls from specific sections
                  var _exclude = [
                       'publish_settings', //<= the outer section introduced in v4.9 to publish / saved draft / schedule
                       'tc_font_customizer_settings' //the font customizer plugin has its own way to instantiate the stepper, with custom attributes previously set to the input like step, min, etc...
                  ];

                  if ( 0 < control.container.find( 'input[type="number"]' ).length && control.params && control.params.section && ! _.contains( _exclude,  control.params.section ) ) {
                        api.czrSetupStepper(control.id);
                  }
            });


            var fireHeaderButtons = function() {
                  var $home_button = $('<span/>', { class:'customize-controls-home fas fa-home', html:'<span class="screen-reader-text">Home</span>' } );
                  $.when( $('#customize-header-actions').append( $home_button ) )
                        .done( function() {
                              $home_button
                                    .keydown( function( event ) {
                                          if ( 9 === event.which ) // tab
                                            return;
                                          if ( 13 === event.which ) // enter
                                            this.click();
                                          event.preventDefault();
                                    })
                                    .on( 'click.customize-controls-home', function() {
                                          //event.preventDefault();
                                          //close everything
                                          if ( api.section.has( api.czr_activeSectionId() ) ) {
                                                api.section( api.czr_activeSectionId() ).expanded( false );
                                          } else {
                                                api.section.each( function( _s ) {
                                                    _s.expanded( false );
                                                });
                                          }
                                          api.panel.each( function( _p ) {
                                                _p.expanded( false );
                                          });
                                    });
                        });
            };

            fireHeaderButtons();

      });//end of $( function($) ) dom ready
})( wp, jQuery );//extends api.CZRDynModule

var CZRFeaturedPageModuleMths = CZRFeaturedPageModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRFeaturedPageModuleMths, {
      initialize: function( id, options ) {
            var module = this;
            //run the parent initialize
            api.CZRDynModule.prototype.initialize.call( module, id, options );

            //extend the module with new template Selectors
            $.extend( module, {
                  itemPreAddEl : 'czr-module-fp-pre-add-view-content',
                  itemInputList : 'czr-module-fp-view-content'
            } );

            //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
            module.inputConstructor = api.CZRInput.extend( module.CZRFeaturedPagesInputMths || {} );
            //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
            module.itemConstructor = api.CZRItem.extend( module.CZRFeaturedPagesItem || {} );

            //declares a default model
            this.defaultItemModel = {
                  id : '',
                  title : '' ,
                  'fp-post'  : '',
                  'fp-title' : '',
                  'fp-text'  : '',
                  'fp-image' : '',
            };

            //overrides the default success message
            this.itemAddedMessage = serverControlParams.i18n.featuredPageAdded;
            api.section( module.control.section() ).expanded.bind(function(to) {
                  if ( 'resolved' == module.isReady.state() )
                        return;
                  module.ready();
            });
      },//initialize





      //@override
      // wait for the ajax result!
      //the item is manually added.
      //We should have a pre Item
      addItem : function(obj) {
            var module     = this,
                item       = module.preItem,
                item_model = item();

            if ( _.isEmpty(item_model) || ! _.isObject(item_model) ) {
                throw new Error('addItem : an item should be an object and not empty. In : ' + module.id +'. Aborted.' );
            }

            var _fp_post        = item_model['fp-post'];
            if ( typeof _fp_post  == "undefined" )
              return;

            _fp_post = _fp_post[0];

            //AJAX ACTIONS ON ADD ITEM
            //when a new featured page is added, update the model (text, featured image ) base on the selected post
            //The parent method is called on ajaxrequest.done()
            var done_callback =  function( _to_update ) {
                  item.set( $.extend( item_model, _to_update) );
                  api.CZRDynModule.prototype.addItem.call( module, obj );
            };

            var request = module.CZRFeaturedPagesItem.setContentAjaxInfo( _fp_post.id, {}, done_callback );
      },







      CZRFeaturedPagesInputMths : {
            ready : function() {
                    var input = this;
                    //update the item model on fp-post change
                    input.bind( 'fp-post:changed', function(){
                      input.updateItemModel();
                    });
                    //update the item title on fp-title change
                    input.bind( 'fp-title:changed', function(){
                      input.updateItemTitle();
                    });

                    api.CZRInput.prototype.ready.call( input );
            },
            //override czr img uploader input constructor
            //we need this otherwise we cannot add the buttons to the input container
            //when the input model is not, as the template will be rendered before the ready
            //method is called
            setupImageUploader:  function(){
                    var input = this;
                    //temporary
                    input.container.bind( 'fp-image:content_rendered', function(){
                      input.addResetDefaultButton();
                    });

                    //see add a reset to default image button
                    input.container.on('click keydown', '.default-fpimage-button', function(){
                      input.setThumbnailAjax();
                    });

                    api.CZRInput.prototype.setupImageUploader.call( input );
            },
            //ACTIONS ON fp-title change
            //Fired on 'fp-title:changed'
            //Don't fire in pre item case
            updateItemModel : function( _new_val ) {

                    var input = this,
                        item = this.input_parent,
                        is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput;

                    //check if we are in the pre Item case => if so, the fp-post might be empty
                    if ( ! _.has( item(), 'fp-post') || _.isEmpty( item()['fp-post'] ) )
                      return;

                    var _new_model      = _.clone( item() ),
                        _fp_post        = _new_model['fp-post'][0],
                        _new_title      = _fp_post.title,
                        inputCollection = is_preItemInput ? input.module.preItemInput : item.czr_Input;

                    if ( is_preItemInput ) {
                          $.extend( _new_model, { title : _new_title, 'fp-title' : _new_title } );
                          item.set( _new_model );
                    } else {

                          var done_callback =  function( _to_update ) {
                            _.each( _to_update, function( value, id ){
                                item.czr_Input( id ).set( value );
                            });
                          };
                          //pass the fp-title so it gets updated after the ajax callback
                          var request = item.setContentAjaxInfo( _fp_post.id, {'fp-title' : _new_title}, done_callback );
                    }
            },


            updateItemTitle : function( _new_val ) {
                    var input = this,
                        item = this.input_parent,
                        is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput;

                    if ( is_preItemInput )
                      return;
                    var _new_model  = _.clone( item() ),
                        _new_title  = "undefined" !== typeof _new_model['fp-title'] ? _new_model['fp-title'] : '';

                    $.extend( _new_model, { title : _new_title} );
                    item.set( _new_model );
            },


            setThumbnailAjax : function() {
                    var item     = this.input_parent,
                        _fp_post = item.czr_Input('fp-post')(),
                        _post_id;

                    if ( typeof _fp_post  == "undefined" )
                      return;

                    _fp_post = _fp_post[0];
                    _post_id = _fp_post.id;

                    $('.fpimage-reset-messages p').hide();

                    //AJAX STUFF
                    //retrieve some ajax info
                    request = wp.ajax.post( 'get-fp-post-tb', {
                            'wp_customize': 'on',
                            'id'          : _post_id,
                            'CZRFPNonce'  : serverControlParams.CZRFPNonce
                            //nonce needed USE 1 for everything?
                    });


                    request.done( function( data ){
                            var thumbnail = data,
                                input = item.czr_Input('fp-image');

                            if ( 0 !== thumbnail.length ) {
                              $('.fpimage-reset-messages .success', input.container ).show('fast').fadeOut();
                              input.set( thumbnail );
                            }else {
                              $('.fpimage-reset-messages .warning', input.container ).show('fast').delay(2000).fadeOut();
                            }
                    });

                    request.fail(function( data ) {
                            if ( typeof console !== 'undefined' && console.error ) {
                              console.error( data );
                            }
                    });
            },

            addResetDefaultButton : function( $_template_params ) {
                    var input        = this,
                        item         = input.input_parent,
                        buttonLabel  = serverControlParams.i18n.featuredPageImgReset,
                        successMess  = serverControlParams.i18n.featuredPageResetSucc,
                        errMess      = serverControlParams.i18n.featuredPageResetErr,
                        messages     = '<div class="fpimage-reset-messages" style="clear:both"><p class="success" style="display:none">'+successMess+'</p><p class="warning" style="display:none">'+errMess+'</p></div>';

                    $('.actions', input.container)
                      .append('<button type="button" class="button default-fpimage-button">'+ buttonLabel +'</button>');
                    $('.fpimage-reset-messages', input.container ).detach();
                    $(input.container).append( messages );
            }
      },//CZRFeaturedPagesInputMths








      CZRFeaturedPagesItem : {
            setContentAjaxInfo : function( _post_id, _additional_inputs, done_callback ) {
                    //called be called from the input and from the item
                    var _to_update         = _additional_inputs || {};

                    //AJAX STUFF
                    //retrieve some ajax info
                    request = wp.ajax.post( 'get-fp-post', {
                          'wp_customize': 'on',
                          'id'          : _post_id,
                          'CZRFPNonce'  : serverControlParams.CZRFPNonce
                          //nonce needed USE 1 for everything?
                    });

                    request.done( function( data ){
                          var _post_info = data.post_info;

                          if ( 0 !== _post_info.length ) {
                            $.extend( _to_update, { 'fp-image' : _post_info.thumbnail, 'fp-text' : _post_info.excerpt } );
                            if ( "function" === typeof done_callback )
                              done_callback( _to_update );
                          }
                    });

                    request.fail(function( data ) {
                          if ( typeof console !== 'undefined' && console.error ) {
                            console.error( data );
                          }
                    });

                    return request;
            },

            //overrides the default parent method by a custom one
            //at this stage, the model passed in the obj is up to date
            writeItemViewTitle : function( model ) {
                  var item = this,
                            module  = item.module,
                            _model = model || item(),
                            _title = _model.title ? _model.title : serverControlParams.i18n.featuredPageTitle;

                  _title = api.CZR_Helpers.truncate(_title, 25);
                  $( '.' + module.control.css_attr.item_title , item.container ).html( _title );
            }
      }
});//extend
})( wp.customize , jQuery, _ );
//extends api.CZRModule
var CZRTextModuleMths = CZRTextModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRTextModuleMths, {
  initialize: function( id, options ) {
        var module = this;
        //run the parent initialize
        api.CZRModule.prototype.initialize.call( module, id, options );

        //extend the module with new template Selectors
        $.extend( module, {
              itemInputList : 'czr-module-text-view-content',
        } );

        //declares a default model
        module.defaultItemModel = {
              id : '',
              text : ''
        };
  }//initialize
});
})( wp.customize , jQuery, _ );//extends api.CZRDynModule

var CZRSlideModuleMths = CZRSlideModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRSlideModuleMths, {
      initialize: function( id, constructorOptions ) {
            var module = this;

            module.initialConstrucOptions = $.extend( true, {}, constructorOptions );//detach from the original obj

            //run the parent initialize
            api.CZRDynModule.prototype.initialize.call( module, id, constructorOptions );

            //extend the module with new template Selectors
            $.extend( module, {
                  itemPreAddEl : 'czr-module-slide-pre-item-input-list',
                  itemInputList : 'czr-module-slide-item-input-list',
                  modOptInputList : 'czr-module-slide-mod-opt-input-list'
            } );

            this.sliderSkins = serverControlParams.slideModuleParams.sliderSkins;//light, dark

            //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUTS
            module.inputConstructor = api.CZRInput.extend( module.CZRSliderItemInputCtor || {} );
            module.inputModOptConstructor = api.CZRInput.extend( module.CZRSliderModOptInputCtor || {} );

            //SET THE CONTENT PICKER OPTIONS
            $.extend( module.inputOptions, {
                  'content_picker' : {
                        post : '',//['page'],<= all post types
                        taxonomy : ''//'_none_'//<= all taxonomy types
                  }
            });

            //EXTEND THE DEFAULT CONSTRUCTORS FOR ITEMS AND MODOPTS
            module.itemConstructor = api.CZRItem.extend( module.CZRSliderItemCtor || {} );
            module.modOptConstructor = api.CZRModOpt.extend( module.CZRSliderModOptCtor || {} );

            //declares a default ModOpt model
            //this.defaultModOptModel = {
            //     is_mod_opt : true,
            //     module_id : module.id,
            //     'slider-speed' : 6,
            //     'lazyload' : 1,
            //     'slider-height' : 100
            // };
            this.defaultModOptModel = _.extend(
                  serverControlParams.slideModuleParams.defaultModOpt,
                  {
                        module_id : module.id
                  }
            );


            //declares a default Item model
            // this.defaultItemModel = {
            //     id : '',
            //     title : '',
            //     'slide-background' : '',
            //     'slide-title'      : '',
            //     'slide-subtitle'   : '',
            //     'slide-cta'         : '',
            //     'slide-link'       : '',
            //     'slide-custom-link'  : ''
            // };
            //The server model includes the slide-src property that is created when rendering the slide in the front tmpl
            this.defaultItemModel = _.omit( serverControlParams.slideModuleParams.defaultSlideMod, 'slide-src');

            //overrides the default success message
            this.itemAddedMessage = serverControlParams.i18n.mods.slider['New Slide created ! Scroll down to edit it.'];
            //fired ready :
            //1) on section expansion
            //2) or in the case of a module embedded in a regular control, if the module section is alreay opened => typically when skope is enabled
            if ( _.has( api, 'czr_activeSectionId' ) && module.control.section() == api.czr_activeSectionId() && 'resolved' != module.isReady.state() ) {
               module.ready();
            }
            api.section( module.control.section() ).expanded.bind(function(to) {
                  if ( 'resolved' == module.isReady.state() )
                    return;
                  module.ready();
            });

            // module.czr_wpQueryInfos = api.czr_wpQueryInfos();
            // if ( 'resolved' == api.czr_wpQueryDataReady.state() ) {
            //     module.czr_wpQueryInfos( api.czr_wpQueryInfos() );
            // } else {
            //     api.czr_wpQueryDataReady.done( function() {
            //           module.czr_wpQueryInfos( api.czr_wpQueryInfos() );
            //     });
            // }
            module.isReady.then( function() {
                  var _refreshModuleModel = function( query_data ) {
                        var _setId = api.CZR_Helpers.getControlSettingId( module.control.id );
                        //module.refreshItemCollection();

                        //initialize
                        module.initializeModuleModel( module.initialConstrucOptions, query_data )
                              .done( function( newModuleValue ) {
                                    module.set( newModuleValue, { silent : true } );
                                    module.refreshItemCollection();
                              })
                              .always( function( newModuleValue ) {

                              });
                  };

                  //Fired on module ready and skope ready ( even when skope is deactivated )
                  //Fired on skope switch
                  var _toggleModuleItemVisibility = function() {
                        var $preItemBtn = $('.' + module.control.css_attr.open_pre_add_btn, module.container ),
                            $preItemWrapper = $('.' + module.control.css_attr.pre_add_wrapper, module.container),
                            _isLocal = true;

                        //skope might be deactivated by the user
                        if ( api.czr_isSkopOn() ) {
                            _isLocal = 'local' == api.czr_skope( api.czr_activeSkopeId() )().skope;
                        }

                        //HIDE THE ITEM CREATION WHEN NOT LOCAL
                        $preItemBtn.toggle( _isLocal );
                        $preItemWrapper.toggle( _isLocal );
                        module.itemsWrapper.toggle( _isLocal );

                        //DISPLAY A NOTICE WHEN NOT LOCAL
                        if ( ! _isLocal && api.czr_isSkopOn() ) {
                              var _localSkopeId = _.findWhere( api.czr_currentSkopesCollection(), { skope : 'local' } ).id;
                              if ( ! module.control.container.find( '.slide-mod-skope-notice').length ) {
                                    module.control.container.append( $( '<div/>', {
                                              class: 'slide-mod-skope-notice',
                                              html : [
                                                    serverControlParams.i18n.mods.slider['You can set the global options of the slider here by clicking on the gear icon : height, font size, effects...'],
                                                    serverControlParams.i18n.mods.slider['Those settings will be inherited by the more specific options levels.'],
                                                    '<br/><br/>',
                                                    serverControlParams.i18n.mods.slider['Switch to the most specific level of options to start building a slider'],
                                                    ':',
                                                    api.czr_skopeBase.buildSkopeLink( _localSkopeId )
                                              ].join( ' ' )
                                        })
                                    );
                              } else {
                                  module.control.container.find( '.slide-mod-skope-notice').show();
                              }
                        } else {
                              if ( 1 == module.control.container.find( '.slide-mod-skope-notice').length )
                                module.control.container.find( '.slide-mod-skope-notice').remove();
                        }

                  };

                  //Refresh the module default item based on the query infos if the associated setting has no value yet
                  api.czr_wpQueryInfos.bind( function( query_data ) {
                        _refreshModuleModel( query_data );
                  } );

                  //On skope switch
                  //1) refresh module model, set items to empty if not local
                  //2) hide the item and pre-item container if not local
                  // {
                  //       current_skope_id    : to,
                  //       previous_skope_id   : from,
                  //       updated_setting_ids : _updatedSetIds || []
                  // }
                  api.bind( 'skope-switched-done', function( params ) {
                        _refreshModuleModel( api.czr_wpQueryInfos() );
                        _.delay( function() {
                              _toggleModuleItemVisibility();
                        }, 200 );

                  });

                  //ACTIONS ON SKOPE READY
                  //1) Hide items and pre-items if skope is not local
                  //2) set the item and modopt refresh button state, and set their state according to the module changes
                  api.czr_skopeReady.then( function() {
                        //ITEMS AND PRE ITEMS
                        _.delay( function() {
                              _toggleModuleItemVisibility();
                        }, 200 );

                        //UPDATE REFRESH BUTTONS STATE ON MODULE CHANGES
                        module.callbacks.add( function( to, from ) {
                              module.czr_Item.each( function( _itm_ ){
                                    if ( 'expanded' != _itm_.viewState() )
                                      return;
                                    if ( 1 == _itm_.container.find('.refresh-button').length ) {
                                          _itm_.container.find('.refresh-button').prop( 'disabled', false );
                                    }
                              });
                              if ( module.czr_ModOpt && module.czr_ModOpt.isReady ) {
                                    module.czr_ModOpt.isReady.then( function() {
                                          if ( api.czr_ModOptVisible() ) {
                                                if ( 1 == module.czr_ModOpt.container.find('.refresh-button').length ) {
                                                      module.czr_ModOpt.container.find('.refresh-button').prop( 'disabled', false );
                                                }
                                          }
                                    });
                              }
                        });
                  });
            });//module.isReady

            //REFRESH ITEM TITLES
            var _refreshItemsTitles = function() {
                  module.czr_Item.each( function( _itm_ ){
                        _itm_.writeItemViewTitle();
                  });
            };
            //Always write the title on :
            //- module model initialized => typically when the query data has been set and is used to set a default item
            //- item collection sorted
            //- on item removed
            //module.bind( 'module-model-initialized', _refreshItemsTitles );
            module.bind( 'item-collection-sorted', _refreshItemsTitles );
            module.bind( 'item-removed', _refreshItemsTitles );
      },//initialize


      //Overrides the default method.
      // Fired on module.isReady.done()
      // Fired on api.czr_wpQueryInfos changes
      // => this method is always fired by the parent constructor

      //The job of this pre-processing method is to create a contextual item based on what the server send with 'czr-query-data-ready'
      //This method is fired in the initialize module method
      //and then on each query_data update, if the associated setting has not been set yet, it is fired to get the default contextual item
      //1) image : if post / page, the featured image
      //2) title : several cases @see : hu_set_hph_title()
      //3) subtitle : no subtitle except for home page : the site tagline
      initializeModuleModel : function( constructorOptions, new_data ) {
            var module = this,
                dfd = $.Deferred();

            //Wait for the control to be registered when switching skope
            api.control.when( module.control.id, function() {
                  var _setId = api.CZR_Helpers.getControlSettingId( module.control.id );

                  //bail if the setting id is not registered
                  if ( ! api.has( _setId ) )
                    return dfd.resolve( constructorOptions ).promise();

                  // console.log('api.control.has( module.control.id ); ', api.control.has( module.control.id ) );
                  // console.log('module.initialConstrucOptions', module.initialConstrucOptions );
                  // console.log('api( _setId )()', _setId, api( _setId )());
                  //Bail if the skope is not local
                  //Make sure to reset the items to [] if the current item is_default
                  // if ( api.czr_skope.has( api.czr_activeSkopeId() ) ) {
                  //     console.log( 'SKOPE ?', api.czr_activeSkopeId(), api.czr_skope( api.czr_activeSkopeId() )().skope );
                  //     console.log( api.czr_isSkopOn() );
                  // }

                  //WHEN SKOPE IS READY
                  //=> If skope is disabled, this promise will be resolved anyway
                  // => that's why we need to re-check that skope is on below
                  api.czr_skopeReady.then( function() {
                        //IF NOT LOCAL SKOPE
                            //Empties the items
                            //+ return the current option

                            if ( api.czr_isSkopOn() ) {
                                  //IF LOCAL
                                  //If inheriting from a parent, then let's set the default item
                                  //if setting is dirty in local skope, let's return the ctor options.
                                  var _isLocal = api.czr_skope.has( api.czr_activeSkopeId() ) && 'local' ==  api.czr_skope( api.czr_activeSkopeId() )().skope;
                                      _isLocalAndDirty = _isLocal && module._isSettingDirty();

                                  if ( _isLocalAndDirty ) {
                                        return dfd.resolve( constructorOptions ).promise();
                                  } else if ( ! _isLocal ) {
                                        var _newCtorOptions = $.extend( true, {}, constructorOptions );
                                        _newCtorOptions.items = [];
                                        return dfd.resolve( _newCtorOptions ).promise();
                                  }
                            }


                            //If the setting is not set, then we can set the default item based on the query data
                            // if ( ! _.isEmpty( constructorOptions.items ) )
                            //   return dfd.resolve( constructorOptions ).promise();
                            //Always get the query data from the freshest source
                            api.czr_wpQueryDataReady.then( function( data ) {
                                  data = api.czr_wpQueryInfos() || data;//always get the latest query infos
                                  var _query_data, _default;
                                  if ( _.isUndefined( new_data ) ) {
                                        _query_data = _.isObject( data ) ? data.query_data : {};
                                  } else {
                                        _query_data = _.isObject( new_data ) ? new_data.query_data : {};
                                  }

                                  _default = $.extend( true, {}, module.defaultItemModel );
                                  constructorOptions.items = [
                                        $.extend( _default, {
                                              'id' : 'default_item_' + module.id,
                                              'is_default' : true,
                                              'slide-background' : ( ! _.isEmpty( _query_data.post_thumbnail_id ) ) ? _query_data.post_thumbnail_id : '',
                                              'slide-title' : ! _.isEmpty( _query_data.post_title )? _query_data.post_title : '',
                                              'slide-subtitle' : ! _.isEmpty( _query_data.subtitle ) ? _query_data.subtitle : ''
                                        })
                                  ];
                                  dfd.resolve( constructorOptions );
                            });
                        });//api.control.when()
                  });//api.czr_skopeReady()

            //Make sure this is resolved, even when the control is not registered back for some reasons
            _.delay( function() {
                  if ( ! api.control.has( module.control.id ) ) {
                        api.errorLog( 'Slide Module : initializeModuleModel, the control has not been registered after too long.');
                        dfd.resolve( constructorOptions );
                  }
            }, 5000 );
            return dfd.promise();
      },

      _getServerDefaultSlideItem : function() {

      },


      ///////////////////////////////////////////////////////////////////
      /// MODULE SPECIFIC INPUTS METHOD USED FOR BOTH ITEMS AND MOD OPTS
      //////////////////////////////////////////
      //this is an item or a modOpt
      slideModSetupSelect : function() {
            if ( 'skin' != this.id && 'slide-skin' != this.id )
              return;

            var input      = this,
                input_parent  = input.input_parent,
                module     = input.module,
                _sliderSkins  = module.sliderSkins,//{}
                _model = input_parent();

            //generates the options
            _.each( _sliderSkins , function( _layout_name , _k ) {
                  var _attributes = {
                            value : _k,
                            html: _layout_name
                      };
                  if ( _k == _model[ input.id ] ) {
                        $.extend( _attributes, { selected : "selected" } );
                  }
                  $( 'select[data-type="' + input.id + '"]', input.container ).append( $('<option>', _attributes) );
            });
            $( 'select[data-type="' + input.id + '"]', input.container ).selecter();
      },


      //Save color as rgb
      //this can be an item or a mod opt
      slideModSetupColorPicker : function() {
          var input  = this,
              input_parent = input.input_parent,
              _model = input_parent();

          input.container.find('input').iris( {
                palettes: true,
                hide:false,
                change : function( e, o ) {
                      //if the input val is not updated here, it's not detected right away.
                      //weird
                      //is there a "change complete" kind of event for iris ?
                      //$(this).val($(this).wpColorPicker('color'));
                      //input.container.find('[data-type]').trigger('colorpickerchange');

                      var _rgb = api.CZR_Helpers.hexToRgb( o.color.toString() ),
                          _isCorrectRgb = _.isString( _rgb ) && -1 !== _rgb.indexOf('rgb(');

                      if ( ! _isCorrectRgb )
                        _rgb = "rgb(34,34,34)";//force to dark skin if incorrect

                      //synchronizes with the original input
                      $(this).val( _rgb ).trigger('colorpickerchange').trigger('change');
                }
          });
      },


      //////////////////////////////////////////
      /// MODULE HELPERS
      //the slide-link value is an object which has always an id (post id) + other properties like title
      _isCustomLink : function( input_val ) {
            return _.isObject( input_val ) && '_custom_' === input_val.id;
      },

      _isChecked : function( v ) {
            return 0 !== v && '0' !== v && false !== v && 'off' !== v;
      },

      _isSettingDirty : function() {
            if (  ! api.czr_isSkopOn() )
              return true;
            if ('pending' == api.czr_skopeReady.state() )
              return false;
            var module = this,
                _setId = api.CZR_Helpers.getControlSettingId( module.control.id );
            return ( api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( _setId ) || api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( _setId ) );
      },
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule

var CZRSlideModuleMths = CZRSlideModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRSlideModuleMths, {

      ///////////////////////////////////////////////////////////
      /// INPUT CONSTRUCTORS
      //////////////////////////////////////////
      CZRSliderItemInputCtor : {
            ready : function() {
                  var input = this;
                  //update the item title on slide-title change
                  if ( 'slide-title' === input.id ) {
                        input.bind( function( to ) {
                              input.updateItemTitle( to );
                        });
                  }

                  //add the custom link option to the content picker
                  if ( 'slide-link' == input.id ) {
                        input.defaultContentPickerOption = [{
                              id          : '_custom_',
                              title       : [ '<span style="font-weight:bold">' , serverControlParams.i18n.mods.slider['Set a custom url'], '</span>' ].join(''),
                              type_label  : '',
                              object_type : '',
                              url         : ''
                        }];
                  }

                  api.CZRInput.prototype.ready.call( input);
            },

            //overrides the default method
            setupSelect : function() {
                  return this.module.slideModSetupSelect.call( this );
            },

            //Save color as rgb
            setupColorPicker : function() {
                  return this.module.slideModSetupColorPicker.call( this );
            },

            //ACTIONS ON czr_input('slide-title') change
            //Don't fire in pre item case
            //@return void
            updateItemTitle : function( _new_title ) {
                  var input = this,
                      item = input.input_parent,
                      is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput,
                      _new_model  = $.extend( true, {}, item() );
                  // if ( is_preItemInput )
                  //   return;
                  $.extend( _new_model, { title : _new_title } );

                  //This is listened to by module.czr_Item( item.id ).itemReact
                  //the object passed is needed to avoid a refresh
                  item.set(
                        _new_model,
                        {
                              input_changed     : 'title',
                              input_transport   : 'postMessage',
                              not_preview_sent  : true//<= this parameter set to true will prevent the setting to be sent to the preview ( @see api.Setting.prototype.preview override ). This is useful to decide if a specific input should refresh or not the preview.} );
                        }
                  );
            }
      },//CZRSlidersInputMths



      CZRSliderModOptInputCtor : {
            ready : function() {
                  var input = this;
                  //add the custom link option to the content picker
                  if ( 'fixed-link' == input.id ) {
                        input.defaultContentPickerOption = [{
                              id          : '_custom_',
                              title       : [ '<span style="font-weight:bold">' , serverControlParams.i18n.mods.slider['Set a custom url'], '</span>' ].join(''),
                              type_label  : '',
                              object_type : '',
                              url         : ''
                        }];
                  }

                  api.CZRInput.prototype.ready.call( input);
            },

            //overrides the default method
            setupSelect : function() {
                  return this.module.slideModSetupSelect.call( this );
            },

            //Save color as rgb
            setupColorPicker : function() {
                  return this.module.slideModSetupColorPicker.call( this );
            },
      }//CZRSliderItemInputCtor
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule

var CZRSlideModuleMths = CZRSlideModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRSlideModuleMths, {
      CZRSliderItemCtor : {
              //overrides the parent ready
              ready : function() {
                    var item = this,
                        module = item.module;
                    //wait for the input collection to be populated,
                    //and then set the input visibility dependencies
                    item.inputCollection.bind( function( col ) {
                          if( _.isEmpty( col ) )
                            return;
                          try { item.setInputVisibilityDeps(); } catch( er ) {
                                api.errorLog( 'item.setInputVisibilityDeps() : ' + er );
                          }

                          //typically, hides the caption content input if user has selected a fixed content in the mod opts
                          item.setModOptDependantsVisibilities();

                          //append a notice to the default slide about how to disable the metas in single post
                          if ( item().is_default && item._isSinglePost() ) {
                              item._printPostMetasNotice();
                          }

                          //ITEM REFRESH AND FOCUS BTN
                          //1) Set initial state
                          item.container.find('.refresh-button').prop( 'disabled', true );

                          //2) listen to user actions
                          //add DOM listeners
                          api.CZR_Helpers.setupDOMListeners(
                                [     //toggle mod options
                                      {
                                            trigger   : 'click keydown',
                                            selector  : '.refresh-button',
                                            name :      'slide-refresh-preview',
                                            actions   : function( ev ) {
                                                  //var _setId = api.CZR_Helpers.getControlSettingId( module.control.id );
                                                  // if ( api.has( _setId ) ) {
                                                  //       api( _setId ).previewer.send( 'setting', [ _setId, api( _setId )() ] );
                                                  //       _.delay( function() {
                                                  //             item.container.find('.refresh-button').prop( 'disabled', true );
                                                  //       }, 250 );
                                                  // }
                                                  api.previewer.refresh().done( function() {
                                                        _.delay( function() {
                                                              item.container.find('.refresh-button').prop( 'disabled', true );
                                                        }, 250 );
                                                  });
                                            }
                                      },
                                      {
                                            trigger   : 'click keydown',
                                            selector  : '.focus-button',
                                            name : 'slide-focus-action',
                                            actions   : function( ev ) {
                                                  api.previewer.send( 'slide_focus', {
                                                        module_id : item.module.id,
                                                        module : { items : $.extend( true, {}, module().items ) , modOpt : module.hasModOpt() ?  $.extend( true, {}, module().modOpt ): {} },
                                                        item_id : item.id
                                                  });
                                            }
                                      }
                                ],//actions to execute
                                { model : item(), dom_el : item.container },//model + dom scope
                                item //instance where to look for the cb methods
                          );//api.CZR_Helpers.setupDOMListeners()
                    });//item.inputCollection.bind()

                    item.viewState.bind( function( state ) {
                          if ( 'expanded' == state ) {
                                api.previewer.send( 'item_expanded', {
                                      module_id : item.module.id,
                                      module : { items : $.extend( true, {}, module().items ) , modOpt : module.hasModOpt() ?  $.extend( true, {}, module().modOpt ): {} },
                                      item_id : item.id
                                });
                          }
                    });

                    //fire the parent
                    api.CZRItem.prototype.ready.call( item );
              },


              ////////////////////////////// SMALL HELPERS //////////////////
              ///////////////////////////////////////////////////////////////////////////
              //HELPER
              //@return bool
              _isSinglePost : function() {
                    return api.czr_wpQueryInfos && api.czr_wpQueryInfos().conditional_tags && api.czr_wpQueryInfos().conditional_tags.is_single;
              },

              //@return void()
              _printPostMetasNotice : function() {
                    var item = this;
                    //add a DOM listeners
                    api.CZR_Helpers.setupDOMListeners(
                          [     //toggle mod options
                                {
                                      trigger   : 'click keydown',
                                      selector  : '.open-post-metas-option',
                                      name      : 'toggle_mod_option',
                                      //=> open the module option and focus on the caption content tab
                                      actions   : function() {
                                            //expand the modopt panel and focus on a specific tab right after
                                            api.czr_ModOptVisible( true, { module : item.module, focus : 'section-topline-2' } );
                                      }
                                }
                          ],//actions to execute
                          { model : item(), dom_el : item.container },//model + dom scope
                          item //instance where to look for the cb methods
                    );

                    var _html_ = [
                        '<strong>',
                        serverControlParams.i18n.mods.slider['You can display or hide the post metas ( categories, author, date ) in'],
                        '<a href="javascript:void(0)" class="open-post-metas-option">' + serverControlParams.i18n.mods.slider['the general options'] + '</a>',
                        '</strong>'
                    ].join(' ') + '.';

                    item.czr_Input('slide-title').container.prepend( $('<p/>', { html : _html_, class : 'czr-notice' } ) );
              },


              //////////////////////////////FIXED CONTENT DEPENDENCIES //////////////////
              ///////////////////////////////////////////////////////////////////////////
              //@return void()
              //Fired when module is ready
              setModOptDependantsVisibilities : function() {
                    var item = this,
                        module = item.module,
                        _dependants = [ 'slide-title', 'slide-subtitle', 'slide-cta', 'slide-link', 'slide-custom-link', 'slide-link-target' ],
                        modOptModel = module.czr_ModOpt();

                    _.each( _dependants, function( _inpt_id ) {
                          if ( ! item.czr_Input.has( _inpt_id ) )
                            return;
                          var _input_ = item.czr_Input( _inpt_id );

                          //Fire on init
                          _input_.enabled( ! module._isChecked( modOptModel['fixed-content'] ) );
                    });

                    if ( module._isChecked( modOptModel['fixed-content'] ) ) {
                          //add a DOM listeners
                          api.CZR_Helpers.setupDOMListeners(
                                [     //toggle mod options
                                      {
                                            trigger   : 'click keydown',
                                            selector  : '.open-mod-option',
                                            name      : 'toggle_mod_option',
                                            //=> open the module option and focus on the caption content tab
                                            actions   : function() {
                                                  //expand the modopt panel and focus on a specific tab right after
                                                  api.czr_ModOptVisible( true, { module : module, focus : 'section-topline-2' } );
                                            }
                                      }
                                ],//actions to execute
                                { model : item(), dom_el : item.container },//model + dom scope
                                item //instance where to look for the cb methods
                          );

                          var _html_ = [
                              '<strong>',
                              serverControlParams.i18n.mods.slider['The caption content is currently fixed and set in'],
                              '<a href="javascript:void(0)" class="open-mod-option">' + serverControlParams.i18n.mods.slider['the general options'] + '</a>',
                              '</strong>'
                          ].join(' ') + '.';

                          item.czr_Input('slide-title').container.prepend( $('<p/>', { html : _html_, class : 'czr-fixed-content-notice' } ) );
                    } else {
                          var $_notice = item.container.find('.czr-fixed-content-notice');
                          if ( false !== $_notice.length ) {
                                $_notice.remove();
                          }
                    }

              },

              //@params : { before : 'slide-title' }
              toggleDisabledNotice : function( params ) {
                    var item = this;
                    params = _.extend( { before : 'slide-title' }, params );

              },
              ////////////////////////////// END OF FIXED CONTENT DEPENDENCIES //////////////////
              ///////////////////////////////////////////////////////////////////////////



              //Fired when the input collection is populated
              //At this point, the inputs are all ready (input.isReady.state() === 'resolved') and we can use their visible Value ( set to true by default )
              setInputVisibilityDeps : function() {
                    var item = this,
                        module = item.module,
                        _isCustom = function( val ) {
                              return 'custom' == val;
                        };

                    //Internal item dependencies
                    item.czr_Input.each( function( input ) {
                          switch( input.id ) {
                                // case 'slide-title' :
                                //       //Fire on init
                                //       item.czr_Input('slide-subtitle').visible( ! _.isEmpty( input() ) );

                                //       //React on change
                                //       input.bind( function( to ) {
                                //             item.czr_Input('slide-subtitle').visible( ! _.isEmpty( to ) );
                                //       });
                                // break;

                                case 'slide-link-title' :
                                      //Fire on init
                                      item.czr_Input('slide-link').visible( module._isChecked( input() ) || ! _.isEmpty( item.czr_Input('slide-cta')() ) );
                                      item.czr_Input('slide-link-target').visible( module._isChecked( input() ) || ! _.isEmpty( item.czr_Input('slide-cta')() ) );

                                      //React on change
                                      input.bind( function( to ) {
                                            item.czr_Input('slide-link').visible( module._isChecked( to ) || ! _.isEmpty( item.czr_Input('slide-cta')() ) );
                                            item.czr_Input('slide-link-target').visible( module._isChecked( to ) || ! _.isEmpty( item.czr_Input('slide-cta')() ) );
                                      });
                                break;

                                case 'slide-cta' :
                                      //Fire on init
                                      item.czr_Input('slide-link').visible( ! _.isEmpty( input() ) || module._isChecked( item.czr_Input('slide-link-title')() ) );
                                      item.czr_Input('slide-custom-link').visible( ! _.isEmpty( input() ) && module._isCustomLink( item.czr_Input('slide-link')() ) );
                                      item.czr_Input('slide-link-target').visible( ! _.isEmpty( input() ) || module._isChecked( item.czr_Input('slide-link-title')() ) );

                                      //React on change
                                      input.bind( function( to ) {
                                            item.czr_Input('slide-link').visible( ! _.isEmpty( to ) || module._isChecked( item.czr_Input('slide-link-title')() ) );
                                            item.czr_Input('slide-custom-link').visible( ! _.isEmpty( to ) && module._isCustomLink( item.czr_Input('slide-link')() ) );
                                            item.czr_Input('slide-link-target').visible( ! _.isEmpty( to ) || module._isChecked( item.czr_Input('slide-link-title')() ) );
                                      });
                                break;

                                //the slide-link value is an object which has always an id (post id) + other properties like title
                                case 'slide-link' :
                                      //Fire on init
                                      item.czr_Input('slide-custom-link').visible( module._isCustomLink( input() ) );
                                      //React on change
                                      input.bind( function( to ) {
                                            item.czr_Input('slide-custom-link').visible( module._isCustomLink( to ) );
                                      });
                                break;

                                // case 'slide-use-custom-skin' :
                                //       //Fire on init
                                //       item.czr_Input('slide-skin').visible( module._isChecked( input() ) );
                                //       item.czr_Input('slide-skin-color').visible( module._isChecked( input() ) && _isCustom( item.czr_Input('slide-skin')() ) );
                                //       item.czr_Input('slide-opacity').visible( module._isChecked( input() ) );
                                //       item.czr_Input('slide-text-color').visible( module._isChecked( input() ) && _isCustom( item.czr_Input('slide-skin')() ) );

                                //       //React on change
                                //       input.bind( function( to ) {
                                //             item.czr_Input('slide-skin').visible( module._isChecked( to ) );
                                //             item.czr_Input('slide-skin-color').visible( module._isChecked( to ) && _isCustom( item.czr_Input('slide-skin')() ) );
                                //             item.czr_Input('slide-opacity').visible( module._isChecked( to ) );
                                //             item.czr_Input('slide-text-color').visible( module._isChecked( to ) && _isCustom( item.czr_Input('slide-skin')() ) );
                                //       });
                                // break;

                                // case 'slide-skin' :
                                //       //Fire on init
                                //       item.czr_Input('slide-skin-color').visible( module._isChecked( 'slide-use-custom-skin' ) && _isCustom( input() ) );
                                //       item.czr_Input('slide-text-color').visible( module._isChecked( 'slide-use-custom-skin' ) && _isCustom( input() ) );

                                //       //React on change
                                //       input.bind( function( to ) {
                                //             item.czr_Input('slide-skin-color').visible( module._isChecked( 'slide-use-custom-skin' ) && _isCustom( to ) );
                                //             item.czr_Input('slide-text-color').visible( module._isChecked( 'slide-use-custom-skin' ) && _isCustom( to ) );
                                //       });
                                // break;
                          }
                    });
              },

              //overrides the default parent method by a custom one
              //at this stage, the model passed in the obj is up to date
              writeItemViewTitle : function( model, data ) {

                    var item = this,
                        index = 1,
                        module  = item.module,
                        _model = model || item(),
                        _title,
                        _slideBg,
                        _src = 'not_set',
                        _areDataSet = ! _.isUndefined( data ) && _.isObject( data );

                    //When shall we update the item title ?
                    //=> when the slide title or the thumbnail have been updated
                    //=> on module model initialized
                    if ( _areDataSet && data.input_changed && ! _.contains( ['slide-title', 'slide-background' ], data.input_changed ) )
                      return;

                    //set title with index
                    if ( ! _.isEmpty( _model.title ) ) {
                          _title = _model.title;
                    } else {
                          //find the current item index in the collection
                          var _index = _.findIndex( module.itemCollection(), function( _itm ) {
                                return _itm.id === item.id;
                          });
                          _index = _.isUndefined( _index ) ? index : _index + 1;
                          _title = [ serverControlParams.i18n.mods.slider['Slide'], _index ].join( ' ' );
                    }

                    //if the slide title is set, use it
                    _title = _.isEmpty( _model['slide-title'] ) ? _title : _model['slide-title'];
                    _title = api.CZR_Helpers.truncate( _title, 15 );

                    //make sure the slide bg id is a number
                    _slideBg = ( _model['slide-background'] && _.isString( _model['slide-background'] ) ) ? parseInt( _model['slide-background'], 10 ) : _model['slide-background'];

                    // _title = [
                    //       '<div class="slide-thumb"></div>',
                    //       '<div class="slide-title">' + _title + '</div>',,
                    // ].join('');

                    var _getThumbSrc = function() {
                          return $.Deferred( function() {
                                var dfd = this;
                                //try to set the default src
                                if ( serverControlParams.slideModuleParams && serverControlParams.slideModuleParams.defaultThumb ) {
                                      _src = serverControlParams.slideModuleParams.defaultThumb;
                                }
                                if ( ! _.isNumber( _slideBg ) ) {
                                      dfd.resolve( _src );
                                } else {
                                      wp.media.attachment( _slideBg ).fetch()
                                            .always( function() {
                                                  var attachment = this;
                                                  if ( _.isObject( attachment ) && _.has( attachment, 'attributes' ) && _.has( attachment.attributes, 'sizes' ) ) {
                                                        _src = this.get('sizes').thumbnail.url;
                                                        dfd.resolve( _src );
                                                  }
                                            });
                                }
                          }).promise();
                    };


                    var $slideTitleEl = $( '.' + module.control.css_attr.item_title , item.container ).find('.slide-title'),
                        $slideThumbEl = $( '.' + module.control.css_attr.item_title , item.container ).find( '.slide-thumb');

                    //TITLE
                    //always write the title
                    if ( ! $slideTitleEl.length ) {
                          //remove the default item title
                          $( '.' + module.control.css_attr.item_title , item.container ).html( '' );
                          //write the new one
                          $( '.' + module.control.css_attr.item_title , item.container ).append( $( '<div/>',
                                {
                                    class : 'slide-title',
                                    html : _title
                                }
                          ) );
                    } else {
                          $slideTitleEl.html( _title );
                    }

                    //THUMB
                    //When shall we append the item thumb ?
                    //=>IF the slide-thumb element is not set
                    //=>OR in the case where data have been provided and the input_changed is 'slide-background'
                    //=>OR if no data is provided ( we are in the initialize phase )
                    var _isBgChange = _areDataSet && data.input_changed && 'slide-background' === data.input_changed;

                    if ( 0 === $slideThumbEl.length ) {
                          _getThumbSrc().done( function( src ) {
                                if ( 'not_set' != src ) {
                                      $( '.' + module.control.css_attr.item_title, item.container ).prepend( $('<div/>',
                                            {
                                                  class : 'slide-thumb',
                                                  html : '<img src="' + src + '" width="32" height="32" alt="' + _title + '" />'
                                            }
                                      ));
                                }
                          });
                    } else if ( _isBgChange || ! _areDataSet ) {
                          _getThumbSrc().done( function( src ) {
                                if ( 'not_set' != src ) {
                                      $slideThumbEl.html( '<img src="' + src + '" width="32" height="32" alt="' + _title + '" />' );
                                }
                          });
                    }
              }
      }//CZRSliderItemCtor
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule

var CZRSlideModuleMths = CZRSlideModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRSlideModuleMths, {
      CZRSliderModOptCtor : {
            ready: function() {
                  var modOpt = this,
                      module = modOpt.module;

                  //wait for the input collection to be populated, and then set the input visibility dependencies
                  modOpt.inputCollection.bind( function( col ) {
                        if( _.isEmpty( col ) )
                          return;
                        try { modOpt.setModOptInputVisibilityDeps(); } catch( er ) {
                              api.errorLog( 'setModOptInputVisibilityDeps : ' + er );
                        }

                        //MOD OPT REFRESH BTN
                        //1) Set initial state
                        modOpt.container.find('.refresh-button').prop( 'disabled', true );
                        //2) listen to user actions
                        //add DOM listeners
                        api.CZR_Helpers.setupDOMListeners(
                              [     //toggle mod options
                                    {
                                          trigger   : 'click keydown',
                                          selector  : '.refresh-button',
                                          actions   : function( ev ) {
                                                // var _setId = api.CZR_Helpers.getControlSettingId( module.control.id );
                                                // if ( api.has( _setId ) ) {
                                                //       api( _setId ).previewer.send( 'setting', [ _setId, api( _setId )() ] );
                                                //       _.delay( function() {
                                                //             modOpt.container.find('.refresh-button').prop( 'disabled', true );
                                                //       }, 250 );
                                                // }
                                                api.previewer.refresh().done( function() {
                                                      _.delay( function() {
                                                            modOpt.container.find('.refresh-button').prop( 'disabled', true );
                                                      }, 250 );
                                                });
                                          }
                                    }
                              ],//actions to execute
                              { model : modOpt(), dom_el : modOpt.container },//model + dom scope
                              modOpt //instance where to look for the cb methods
                        );//api.CZR_Helpers.setupDOMListeners()
                  });//modOpt.inputCollection()

                  //fire the parent
                  api.CZRModOpt.prototype.ready.call( modOpt );
            },


            //Fired when the input collection is populated
            //At this point, the inputs are all ready (input.isReady.state() === 'resolved') and we can use their visible Value ( set to true by default )
            setModOptInputVisibilityDeps : function() {
                  var modOpt = this,
                      module = modOpt.module,
                      _isFixedContentOn = function() {
                            return module._isChecked( modOpt.czr_Input('fixed-content')() );
                      };

                  modOpt.czr_Input.each( function( input ) {
                        switch( input.id ) {
                              //DESIGN
                              // case 'skin' :
                              //       var _isCustom = function( val ) {
                              //             return 'custom' == val;
                              //       };

                              //       //Fire on init
                              //       modOpt.czr_Input('skin-custom-color').visible( _isCustom( input() ) );
                              //       modOpt.czr_Input('text-custom-color').visible( _isCustom( input() ) );

                              //       //React on change
                              //       input.bind( function( to ) {
                              //             modOpt.czr_Input('skin-custom-color').visible( _isCustom( to ) );
                              //             modOpt.czr_Input('text-custom-color').visible( _isCustom( to ) );
                              //       });
                              // break;

                              //CONTENT
                              case 'fixed-content' :
                                    var _modOptsDependants = [ 'fixed-title', 'fixed-subtitle', 'fixed-cta', 'fixed-link', 'fixed-link-target', 'fixed-custom-link' ],
                                        _setVisibility = function( _depId, _inputVal ) {
                                              var _bool_;
                                              switch( _depId ) {
                                                    case 'fixed-title' :
                                                    case 'fixed-subtitle' :
                                                    case 'fixed-cta' :
                                                          _bool_ = module._isChecked( _inputVal );
                                                    break;

                                                    case 'fixed-link' :
                                                    case 'fixed-link-target' :
                                                          _bool_ = module._isChecked( _inputVal ) && ! _.isEmpty( modOpt.czr_Input('fixed-cta')() );
                                                    break;

                                                    case 'fixed-custom-link' :
                                                          _bool_ = module._isChecked( _inputVal ) && ! _.isEmpty( modOpt.czr_Input('fixed-cta')() ) && module._isCustomLink( modOpt.czr_Input('fixed-link')() );
                                                    break;
                                              }

                                              modOpt.czr_Input( _depId ).visible( _bool_ );
                                        };

                                    //MOD OPTS
                                    _.each( _modOptsDependants, function( _inpt_id ) {
                                          //Fire on init
                                          _setVisibility( _inpt_id, input() );
                                    });

                                    //React on change
                                    input.bind( function( to ) {
                                          _.each( _modOptsDependants, function( _inpt_id ) {
                                               _setVisibility( _inpt_id, to );
                                          });
                                    });
                              break;
                              case 'fixed-cta' :
                                      //Fire on init
                                      modOpt.czr_Input('fixed-link').visible(
                                            ! _.isEmpty( input() ) &&
                                            _isFixedContentOn()
                                      );
                                      modOpt.czr_Input('fixed-custom-link').visible(
                                            ! _.isEmpty( input() ) &&
                                            module._isCustomLink( modOpt.czr_Input('fixed-link')() ) &&
                                            _isFixedContentOn()
                                      );
                                      modOpt.czr_Input('fixed-link-target').visible(
                                            ! _.isEmpty( input() ) &&
                                            _isFixedContentOn()
                                      );

                                      //React on change
                                      input.bind( function( to ) {
                                            modOpt.czr_Input('fixed-link').visible(
                                                  ! _.isEmpty( to ) &&
                                                  _isFixedContentOn()
                                            );
                                            modOpt.czr_Input('fixed-custom-link').visible(
                                                  ! _.isEmpty( to ) &&
                                                  module._isCustomLink( modOpt.czr_Input('fixed-link')() ) &&
                                                  _isFixedContentOn()
                                            );
                                            modOpt.czr_Input('fixed-link-target').visible(
                                                  ! _.isEmpty( to ) &&
                                                  _isFixedContentOn()
                                            );
                                      });
                                break;

                                //the slide-link value is an object which has always an id (post id) + other properties like title
                                case 'fixed-link' :
                                      //Fire on init
                                      modOpt.czr_Input('fixed-custom-link').visible( module._isCustomLink( input() ) && _isFixedContentOn() );
                                      //React on change
                                      input.bind( function( to ) {
                                            modOpt.czr_Input('fixed-custom-link').visible( module._isCustomLink( to ) && _isFixedContentOn() );
                                      });
                                break;

                              //EFFECTS AND PERFORMANCES
                              case 'autoplay' :
                                    //Fire on init
                                    modOpt.czr_Input('slider-speed').visible( module._isChecked( input() ) );
                                    modOpt.czr_Input('pause-on-hover').visible( module._isChecked( input() ) );

                                    //React on change
                                    input.bind( function( to ) {
                                          modOpt.czr_Input('slider-speed').visible( module._isChecked( to ) );
                                          modOpt.czr_Input('pause-on-hover').visible( module._isChecked( to ) );
                                    });
                              break;
                              case 'parallax' :
                                    //Fire on init
                                    modOpt.czr_Input('parallax-speed').visible( module._isChecked( input() ) );

                                    //React on change
                                    input.bind( function( to ) {
                                          modOpt.czr_Input('parallax-speed').visible( module._isChecked( to ) );
                                    });
                              break;
                              case 'post-metas' :
                                    var _dts = [ 'display-cats', 'display-comments', 'display-auth-date' ],
                                        _setVis = function( _depId, _inputVal ) {
                                              modOpt.czr_Input( _depId ).visible( module._isChecked( _inputVal ) );
                                        };

                                    //MOD OPTS
                                    _.each( _dts, function( _inpt_id ) {
                                          //Fire on init
                                          _setVis( _inpt_id, input() );
                                    });

                                    //React on change
                                    input.bind( function( to ) {
                                          _.each( _dts, function( _inpt_id ) {
                                                _setVis( _inpt_id, to );
                                          });
                                    });
                              break;

                        }
                  });
            },
      }//CZRSliderModOptCtor
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule

var CZRRelatedPostsModMths = CZRRelatedPostsModMths || {};
( function ( api, $, _ ) {
$.extend( CZRRelatedPostsModMths, {
      initialize: function( id, constructorOptions ) {
            var module = this;

            module.initialConstrucOptions = $.extend( true, {}, constructorOptions );//detach from the original obj

            //run the parent initialize
            api.CZRDynModule.prototype.initialize.call( module, id, constructorOptions );

            //extend the module with new template Selectors
            $.extend( module, {
                  itemInputList : 'czr-module-related-posts-item-input-list',
            } );

            // //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUTS
            module.inputConstructor = api.CZRInput.extend( module.CZRRelPostsItemInputCtor || {} );

            // //EXTEND THE DEFAULT CONSTRUCTORS FOR ITEMS AND MODOPTS
            module.itemConstructor = api.CZRItem.extend( module.CZRRelPostsItemCtor || {} );

            //declares a default Item model
            // this.defaultItemModel = {
            //hidden properties
                // 'id'            => '',
                // 'title'         => '',

                // //design
                // 'enable'        => true,
                // 'col_number'    => 3,
                // 'cell_height'   => 'thin',
                // 'display_heading' => true,
                // 'heading_text'   => __('You may also like...', 'hueman'),
                // 'freescroll'    => true,

                // //post filters
                // 'post_number'   => 10,
                // 'order_by'      => 'rand',//can take rand, comment_count, date
                // 'related_by'    => 'categories'//can take : categories, tags, post_formats, all
            // };

            this.defaultItemModel = serverControlParams.relatedPostsModuleParams.defaultModel;

            //fired ready :
            //1) on section expansion
            //2) or in the case of a module embedded in a regular control, if the module section is alreay opened => typically when skope is enabled
            if ( _.has( api, 'czr_activeSectionId' ) && module.control.section() == api.czr_activeSectionId() && 'resolved' != module.isReady.state() ) {
               module.ready();
            }
            api.section( module.control.section() ).expanded.bind(function(to) {
                  if ( 'resolved' == module.isReady.state() )
                    return;
                  module.ready();
            });

            module.isReady.then( function() {

            });//module.isReady
      },//initialize





      //////////////////////////////////////////////////////////
      /// INPUT CONSTRUCTORS
      //////////////////////////////////////////
      CZRRelPostsItemInputCtor : {
            // ready : function() {
            //       api.CZRInput.prototype.ready.call( input);
            // },
            //overrides the default method
            setupSelect : function() {
                  if ( 'order_by' != this.id && 'related_by' != this.id )
                    return;

                  var input      = this,
                      input_parent  = input.input_parent,
                      module     = input.module,
                      _selectOptions  = {},
                      _model = input_parent();

                  switch( input.id ) {
                        // case 'cell_height' :
                        //       _selectOptions = serverControlParams.relatedPostsModuleParams.relPostsCellHeight;
                        // break;
                        case 'order_by' :
                              _selectOptions = serverControlParams.relatedPostsModuleParams.relPostsOrderBy;
                        break;
                        case 'related_by' :
                              _selectOptions = serverControlParams.relatedPostsModuleParams.relPostsRelatedBy;
                        break;
                  }
                  //generates the options
                  _.each( _selectOptions , function( _optName , _k ) {
                        var _attributes = {
                                  value : _k,
                                  html: _optName
                            };
                        if ( _k == _model[ input.id ] ) {
                              $.extend( _attributes, { selected : "selected" } );
                        }
                        $( 'select[data-type="' + input.id + '"]', input.container ).append( $('<option>', _attributes) );
                  });
                  $( 'select[data-type="' + input.id + '"]', input.container ).selecter();
            },
      },//CZRRelPostsItemInputCtor



      //////////////////////////////////////////////////////////
      /// ITEM CONSTRUCTOR
      //////////////////////////////////////////
      CZRRelPostsItemCtor : {
            //overrides the parent ready
            ready : function() {
                  var item = this,
                      module = item.module;
                  //wait for the input collection to be populated,
                  //and then set the input visibility dependencies
                  item.inputCollection.bind( function( col ) {
                        if( _.isEmpty( col ) )
                          return;
                        try { item.setInputVisibilityDeps(); } catch( er ) {
                              api.errorLog( 'item.setInputVisibilityDeps() : ' + er );
                        }
                  });//item.inputCollection.bind()

                  //fire the parent
                  api.CZRItem.prototype.ready.call( item );
            },


            //Fired when the input collection is populated
            //At this point, the inputs are all ready (input.isReady.state() === 'resolved') and we can use their visible Value ( set to true by default )
            setInputVisibilityDeps : function() {
                  var item = this,
                      module = item.module;

                  //Internal item dependencies
                  item.czr_Input.each( function( input ) {
                        switch( input.id ) {
                              case 'enable' :
                                    //Fire on init
                                    item.czr_Input.each( function( _inpt_ ) {
                                          if ( _inpt_.id == input.id )
                                            return;
                                          _inpt_.visible( module._isChecked( input() ) );
                                    });
                                    //React on change
                                    input.bind( function( to ) {
                                          item.czr_Input.each( function( _inpt_ ) {
                                              if ( _inpt_.id == input.id )
                                                return;
                                              _inpt_.visible( module._isChecked( to ) );
                                          });
                                    });
                              break;

                              case 'display_heading' :
                                    //Fire on init
                                    item.czr_Input('heading_text').visible( module._isChecked( input() ) && module._isChecked( item.czr_Input('enable')() ) );

                                    //React on change
                                    input.bind( function( to ) {
                                          item.czr_Input('heading_text').visible( module._isChecked( to ) && module._isChecked( item.czr_Input('enable')() ) );
                                    });
                              break;
                        }
                  });
            },
      },//CZRRelPostsItemCtor



      //////////////////////////////////////////
      /// MODULE HELPERS

      _isChecked : function( v ) {
            return 0 !== v && '0' !== v && false !== v && 'off' !== v;
      },

      _isSettingDirty : function() {
            if ( 'pending' == api.czr_skopeReady.state() )
              return false;
            var module = this,
                _setId = api.CZR_Helpers.getControlSettingId( module.control.id );
            return ( api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( _setId ) || api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( _setId ) );
      }
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule

var CZRTextEditorModuleMths = CZRTextEditorModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRTextEditorModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          //run the parent initialize
          api.CZRModule.prototype.initialize.call( module, id, options );

          //extend the module with new template Selectors
          $.extend( module, {
                itemInputList : 'czr-module-text_editor-item-content'
          } );

          //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
          module.inputConstructor = api.CZRInput.extend( module.CZRTextEditorInputMths || {} );
          //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor = api.CZRItem.extend( module.CZRTextEditorItem || {} );

          //declares a default model
          this.defaultItemModel   = {
            id : '',
            text: ''
          };

          // api.section( module.control.section() ).expanded.bind(function(to) {

          //   // if ( false !== module.container.length ) {
          //   //   //say it*/
          //   //   module.container.append( $_module_el );
          //   //   module.embedded.resolve();
          //   // }

          //   if ( 'resolved' == module.isReady.state() )
          //     return;

          //   module.ready();
          // });
  },//initialize




  CZRTextEditorInputMths : {
  },//CZRTextEditorsInputMths



  CZRTextEditorItem : {

  },
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule
//This module populates the sektions setting.
//The each sektion is composed of columns (=> columns on front end)
//Each columns of modules ( => content module on front end like slider, text block, etc)

var CZRSektionMths = CZRSektionMths || {};
( function ( api, $, _ ) {
$.extend( CZRSektionMths, {
      initialize: function( id, options ) {
            var module = this;
            //run the parent initialize
            api.CZRDynModule.prototype.initialize.call( module, id, options );

            //extend the module with new template Selectors
            $.extend( module, {
                  itemPreAddEl : 'czr-module-sektion-pre-add-view-content',
                  rudItemPart : 'czr-module-sektion-rud-item-part',
                  itemInputList : 'czr-module-sektion-view-content',
            } );

            //SEKTIONS
            //declares a default model (overrides parent module)
            module.defaultItemModel = {
                  id : '',
                  'sektion-layout' : 1,
                  columns : []
            };

            //hook before a sektion is being remove from dom and api.
            //=> remove modules and columns from DOM
            //=> removes moduea and columns instances from API
            module.bind( 'pre_item_dom_remove', function( item ) {
                  module.removeSektion( item );
            });


            //COLUMNS
            module.defaultDBColumnModel = {
                  id : '',
                  sektion_id : '',
                  modules : [],
            };

            module.defaultAPIcolumnModel = {
                  id : '',
                  modules : [],
                  sektion : {},//sektion instance
                  module_id : '',
                  control_id : '',
                  is_added_by_user : false
            };

            //the column values
            module.czr_Column = new api.Values();
            //stores the column collection
            //set the initial value
            module.czr_columnCollection = new api.Value();
            module.czr_columnCollection.set([]);

            //react to column collection changes
            module.czr_columnCollection.callbacks.add( function() { return module.columnCollectionReact.apply(module, arguments ); } );

            //EXTEND THE DEFAULT CONSTRUCTORS FOR SEKTION ITEMS
            module.itemConstructor = api.CZRItem.extend( module.CZRSektionItem || {} );


            //DRAGULA
            // if ( ! _.has( module ,'dragInstance' ) )
            //   module.initDragula();
            if ( ! _.has( module ,'modsDragInstance' ) )
              module.initModulesDragula();


            //MODULE PANEL
            api.czrModulePanelState = api.czrModulePanelState || new api.Value( false );
            api.czrModulePanelEmbedded = api.czrModulePanelEmbedded || $.Deferred();

            //EXTEND THE USER EVENT MAP
            //=> adds the module list panel events
            //=> adds the sektion setting panel events
            module.userEventMap.set( _.union(
                  module.userEventMap(),
                  [
                        //module panel
                        {
                              trigger   : 'click keydown',
                              selector  : '.add-new-module',
                              name      : 'add_new_module',
                              actions   : 'toggleModuleListPanel'
                        },
                        {
                              trigger   : 'click keydown',
                              selector  : '.' + module.control.css_attr.open_pre_add_btn,
                              name      : 'close_module_panel',
                              actions   : function() {
                                    //close the module panel id needed
                                    api.czrModulePanelState(false);
                              },
                        }
                  ]
            ));



            api.consoleLog('SEKTION MODULE INIT', module.control.params.czr_skope );
            if ( _.has( api, 'czr_activeSkopeId' ) )
              api.consoleLog('SEKTION MODULE INIT', api.czr_activeSkopeId() );

            //api.czrModulePanelEmbedded.done( function() {

            api.czrModulePanelBinded = api.czrModulePanelBinded || $.Deferred();
            if ( 'pending' == api.czrModulePanelBinded.state() ) {

                  api.czrModulePanelState.bind( function( expanded ) {
                        var synced_control_id = api.CZR_Helpers.build_setId(  module.control.params.syncCollection ),
                                sek_module = api.control( synced_control_id ).syncSektionModule();

                        $('body').toggleClass('czr-adding-module', expanded );

                        if ( expanded ) {
                              sek_module.renderModulePanel();

                              api.consoleLog('REACT TO MODULE PANEL STATE', expanded,  module.control.params.syncCollection, sek_module() );
                              api.consoleLog('WHEN DOES THIS ACTION OCCUR?', api.czrModulePanelBinded.state() );

                              //api.consoleLog('IS EQUAL?', _.isEqual( module, api.control( synced_control_id ).syncSektionModule() ) );


                              // if ( _.isEqual( module, api.control( synced_control_id ).syncSektionModule() ) )
                              //   return;

                              //DRAGULIZE
                              sek_module.modsDragInstance.containers.push( $('#czr-available-modules-list')[0]);

                              // sek_module.modulePanelDragulized = sek_module.modulePanelDragulized || $.Deferred();
                              // if ( expanded && 'pending' == sek_module.modulePanelDragulized.state() ) {
                              //       sek_module.modsDragInstance.containers.push( $('#czr-available-modules-list')[0]);
                              //       sek_module.modulePanelDragulized.resolve();
                              // }
                        } else {
                              //remove from draginstance
                              var _containers = $.extend( true, [], sek_module.modsDragInstance.containers );
                                  _containers =  _.filter( _containers, function( con) {
                                        return 'czr-available-modules-list' != $(con).attr('id');
                                  });
                              sek_module.modsDragInstance.containers = _containers;
                              $('#czr-module-list-panel').remove();
                        }

                  });
                  api.czrModulePanelBinded.resolve();
            //});
            }//if pending





            //SEKTION SETTING PANEL
            api.czrSekSettingsPanelState = api.SekSettingsPanelState || new api.Value( false );
            api.czrSekSettingsPanelEmbedded = api.SekSettingsPanelEmbedded || $.Deferred();

            //EXTEND THE USER EVENT MAP
            //=> adds the module list panel events
            //=> adds the sektion setting panel events
            module.userEventMap.set( _.union(
                  module.userEventMap(),
                  [
                        //Sektion Settings
                        {
                              trigger   : 'click keydown',
                              selector  : '.czr-edit-sek-settings',
                              name      : 'edit_sek_settings',
                              actions   : 'toggleSekSettingsPanel'
                        },
                        {
                              trigger   : 'click keydown',
                              selector  : '.' + module.control.css_attr.open_pre_add_btn,
                              name      : 'close_sektion_panel',
                              actions   : function() {
                                  //close the sektion settings panel if needed
                                  api.czrSekSettingsPanelState.set(false);
                              },
                        }
                  ]
            ));
            api.czrSekSettingsPanelEmbedded.done( function() {
                  api.czrSekSettingsPanelState.callbacks.add( function() { return module.reactToSekSettingPanelState.apply(module, arguments ); } );
            });


            // if ( _.has( api, 'czr_activeSectionId' ) && module.control.section() == api.czr_activeSectionId()  ) {
            //     api.consoleLog('SECTION EXPANDED CASE. WHAT IS THE CURRENT MODULE-COLLECTION?', api('hu_theme_options[module-collection]')(), module.isReady.state() );
            //     _fire();
            // }
            api.section( module.control.section() ).expanded.bind(function(to) {
                  api.consoleLog('FIRE SEKTION MODULE!', module.id );
                  module.fireSektionModule();
            });
      },//initialize




      fireSektionModule : function() {
            var module = this;
            if ( 'resolved' == module.isReady.state() )
              return;
            //unleash hell
            module.ready();
            //provide the synchronized module-collection control with its synchronized sektions module instance
            module.control.getSyncCollectionControl().syncSektionModule.set( module );
      },



      /////////////////////////////////////////////////////////////////////////
      /// SEKTION
      ////////////////////////////////////////////////////////////////////////
      //the sekItem object looks like :
      //id : ''
      //columns : []
      //sektion-layout : int
      removeSektion : function( sekItem ) {
            var module = this;

            _.each( sekItem.columns, function( _col ) {
                  _.each( _col.modules, function( _mod ){
                        module.control.getSyncCollectionControl().removeModule( _mod );
                  });//_.each

                  //remove column from DOM if it's been embedded
                  if ( module.czr_Column.has(_col.id) && 'resolved' == module.czr_Column( _col.id ).embedded.state() )
                      module.czr_Column( _col.id ).container.remove();

                  //remove column from API
                  module.removeColumnFromCollection( _col );
            });//_.each
      },

      closeAllOtherSektions : function( $_clicked_el ) {
              var module = this;
                  _clicked_sektion_id = $_clicked_el.closest('.czr-single-item').attr('data-id');

              module.czr_Item.each( function( _sektion ){
                    if ( _clicked_sektion_id != _sektion.id ) {
                        _sektion.viewState.set( 'closed');
                    } else {
                        _sektion.viewState.set( 'expanded' != _sektion.viewState() ? 'expanded_noscroll' : 'expanded' );
                    }
              });
      }
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule
//This module populates the sektions setting.
//The each sektion is composed of columns (=> columns on front end)
//Each columns of modules ( => content module on front end like slider, text block, etc)

var CZRSektionMths = CZRSektionMths || {};
( function ( api, $, _ ) {
$.extend( CZRSektionMths, {
      //extends api.CZRItem
      CZRSektionItem : {
              initialize: function(id, options ) {
                    var sekItem = this;
                    api.CZRItem.prototype.initialize.call( sekItem, null, options );

                    //EXTEND THE USER EVENT MAP
                    //=> adds the module list panel events
                    sekItem.userEventMap.set( _.union(
                          sekItem.userEventMap(),
                          [
                                {
                                      trigger   : 'click keydown',
                                      selector  : [ '.' + sekItem.module.control.css_attr.edit_view_btn, '.' + sekItem.module.control.css_attr.display_alert_btn,'.' + sekItem.module.control.css_attr.item_title ].join(','),
                                      name      : 'close_module_panel',
                                      actions   : function() {
                                            api.czrModulePanelState.set(false);
                                      },
                                },
                                {
                                      trigger   : 'mouseenter',
                                      selector  : '.czr-item-header',
                                      name      : 'hovering_sek',
                                      actions   : function( obj ) {
                                            api.previewer.send( 'start_hovering_sek', {
                                                  id : sekItem.id
                                            });
                                      }
                                },
                                {
                                      trigger   : 'mouseleave',
                                      selector  : '.czr-item-header',
                                      name      : 'hovering_sek',
                                      actions   : function( obj ) {
                                            api.previewer.send( 'stop_hovering_sek', {
                                                  id : sekItem.id
                                            });
                                      }
                                },
                                {
                                      trigger   : 'click keydown',
                                      selector  : [ '.' + sekItem.module.control.css_attr.edit_view_btn, '.' + sekItem.module.control.css_attr.item_title ].join(','),
                                      name      : 'send_edit_view',
                                      actions   : function( obj ) {
                                            api.previewer.send( 'edit_sek', {
                                                  id : sekItem.id
                                            });
                                      },
                                }
                          ]
                    ));

                    var _sektion_model = sekItem(),
                        module = options.module;

                    if ( ! _.has(_sektion_model, 'sektion-layout') ) {
                          throw new Error('In Sektion Item initialize, no layout provided for ' + sekItem.id + '.');
                    }

                    sekItem.isReady.done( function() {

                          //When fetched from DB, the column model looks like :
                          //{
                          //  id : '',//string
                          //  sektion_id : '',//string
                          //  modules : [],//collection of module id strings
                          //}
                          //=> we need to extend it with the sektion instance
                          //=> make sure the columns are instantiated as well
                          if ( ! _.isEmpty( sekItem().columns ) ) {
                                _.each( sekItem().columns , function( _column ) {
                                      //instantiate the column and push it to the global column collection
                                      var column_candidate = $.extend( true, {}, _column );//create a deep clone
                                      module.instantiateColumn( $.extend( column_candidate, { sektion : sekItem } ) );
                                });
                          } else {
                                //the sektion has no columns yet. This is the case typically when a sektion has just been created
                                // => instantiate new columns based on the sektion layout property.
                                var _col_nb = parseInt( _sektion_model['sektion-layout'] || 1, 10 );
                                for( i = 1; i < _col_nb + 1 ; i++ ) {
                                      var _default_column = $.extend( true, {}, module.defaultDBColumnModel ),
                                          column_candidate = {
                                                id : '',//a unique id will be generated when preparing the column for API.
                                                sektion_id : sekItem.id
                                          };
                                          column_candidate = $.extend( _default_column, column_candidate );

                                      module.instantiateColumn( $.extend( column_candidate, { sektion : sekItem } ) );
                                }//for
                          }
                    });//sekItem.isReady

              },


              //OVERRIDES PARENT MODULE METHOD
              //React to a single item change
              //cb of module.czr_Item(item.id).callbacks
              // itemInternalReact : function( to, from ) {
              //   api.consoleLog('in item internal React overridden', to, from );
              //       var sekItem = this,
              //           sektion_candidate = $.extend(true, {}, to);
              //       //we want to make sure that the item model is compliant with default model
              //       sektion_candidate = sekItem.prepareSekItemForDB( sektion_candidate );
              //       //Call the parent method => updates the collection
              //       api.CZRItem.prototype.itemInternalReact.call( sekItem, sektion_candidate, from );
              // },

              //OVERRIDES PARENT MODULE METHOD
              //React to a single item change
              //cb of module.czr_Item(item.id).callbacks
              itemReact : function( to, from ) {
                    var sekItem = this,
                        sektion_candidate = $.extend(true, {}, to);
                    //we want to make sure that the item model is compliant with default model
                    sektion_candidate = sekItem.prepareSekItemForDB( sektion_candidate );
                    //Call the parent method => updates the collection
                    api.CZRItem.prototype.itemReact.call( sekItem, sektion_candidate );
              },


              //the sektion item model must have only the property set in
              //module.defaultItemModel = {
              //       id : '',
              //       'sektion-layout' : 1,
              //       columns : []
              // };
              prepareSekItemForDB : function( sektion_candidate ) {
                    var sekItem = this,
                        db_ready_sektItem = {};

                    _.each( sekItem.module.defaultItemModel, function( _value, _key ) {
                            var _candidate_val = sektion_candidate[_key];
                            switch( _key ) {
                                  case 'id' :
                                        if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                            throw new Error('The sekItem id property must be a not empty string');
                                        }
                                        db_ready_sektItem[_key] = _candidate_val;
                                  break;
                                  case 'sektion-layout' :
                                        if ( ! _.isNumber( parseInt( _candidate_val, 10 ) ) || ( parseInt( _candidate_val, 10 ) < 1 ) ) {
                                            throw new Error('The sekItem layout property must be an int number > 0');
                                        }
                                        db_ready_sektItem[_key] = _candidate_val;
                                  break;
                                  case 'columns' :
                                        if ( ! _.isArray( _candidate_val ) ) {
                                            throw new Error('The sekItem columns property must be an array');
                                        }
                                        var _db_ready_columns = [];
                                        _.each( _candidate_val, function( _col ) {
                                              var _db_ready_col = sekItem.module.prepareColumnForDB(_col);
                                              _db_ready_columns.push( _db_ready_col );
                                        });

                                        db_ready_sektItem[_key] = _db_ready_columns;
                                  break;
                            }
                    });//each
                    return db_ready_sektItem;
              }

      }//Sektion
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule
//This module populates the sektions setting.
//The each sektion is composed of columns (=> columns on front end)
//Each columns of modules ( => content module on front end like slider, text block, etc)

var CZRSektionMths = CZRSektionMths || {};
( function ( api, $, _ ) {
$.extend( CZRSektionMths, {
      //Each column shall be described by an object like the following one :
      //module.defaultDBColumnModel = {
      //       id : '',
      //       sektion_id : '',
      //       modules : [],
      // };
      // Fired in prepareSekItemForDB
      prepareColumnForDB : function( column_candidate ) {
            var module = this,
                _db_ready_col = {};

            _.each( module.defaultDBColumnModel, function( _value, _key ){
                  var _candidate_val = column_candidate[_key];
                  switch( _key ) {
                        case 'id' :
                              if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                  throw new Error('The column id property must be a not empty string');
                              }
                              _db_ready_col[_key] = _candidate_val;
                        break;
                        case 'sektion_id' :
                              if ( _.isString( _candidate_val ) && ! _.isEmpty( _candidate_val ) ) {
                                  _db_ready_col[_key] = _candidate_val;
                              } else if ( _.has(column_candidate, 'sektion') ) {
                                  _db_ready_col[_key] = column_candidate.sektion.id;
                              } else {
                                  throw new Error('The column sektion-id property must be a not empty string');
                              }
                        break;
                        case 'modules' :
                              if ( ! _.isArray( _candidate_val ) ) {
                                  throw new Error('The column modules property must be an array');
                              }
                              _db_ready_col[_key] = _candidate_val;
                        break;
                    }

            } );
            return _db_ready_col;
      },











      /////////////////////////////////////////////////////////////////////////
      /// COLUMN
      ////////////////////////////////////////////////////////////////////////
      //At this point, the column model has been fetched from DB, or manually added.
      //It must look like
      //{
      //  id : '',//string
      //  sektion : {},//sektion instance
      //  sektion_id : '',//string
      //  modules : [],//collection of module id strings
      //}
      //Fired in CZRSektionItem::initialize
      instantiateColumn : function( _column, is_added_by_user  ) {
            var module = this,
                column_model = _.clone( _column );

            if ( ! _.isEmpty( column_model.id ) && module.czr_Column.has( column_model.id ) ) {
                  throw new Error('The column id already exists in the collection in module : ' + module.id );
            }

            column_model = module.prepareColumnForAPI( column_model );

            //instanciate the column with the default constructor
            //=> makes sure that the column is ready for instanciation
            module.czr_Column.add( column_model.id , new api.CZRColumn( column_model.id, column_model ) );

            //the column is now ready and will listen to changes
            module.czr_Column(column_model.id).ready();
      },


      //Let's make sure the column holds all the necessary properties before API instanciation.
      // module.defaultAPIcolumnModel = {
      //       id : '',
      //       modules : [],
      //       sektion : {}, //sektion instance
      //       module_id : '',
      //       control_id : '',
      //       is_added_by_user : false
      // };
      prepareColumnForAPI : function( column_candidate ) {
          var module = this,
              api_ready_column = {};

          if ( ! _.isObject( column_candidate ) ) {
                throw new Error('Sektion Module::prepareColumnForAPI : a column must be an object to be instantiated.');
          }

          _.each( module.defaultAPIcolumnModel, function( _value, _key ) {
                var _candidate_val = column_candidate[_key];
                switch( _key ) {
                      case 'id' :
                            if ( _.isEmpty( _candidate_val ) ) {
                                api_ready_column[_key] = module.generateColId();
                            } else {
                                api_ready_column[_key] = _candidate_val;
                            }
                      break;
                      case 'modules' :
                            if ( ! _.isArray( _candidate_val )  ) {
                                throw new Error('Sektion Module::prepareColumnForAPI : a collection of modules must be an array. Error in column ' + column_candidate.id );
                            }
                            api_ready_column[_key] = _candidate_val;
                      break;
                      case  'sektion' :
                            if ( ! _.isObject( _candidate_val ) || _.isEmpty( _candidate_val )  ) {
                                throw new Error('Sektion Module::prepareColumnForAPI : a sektion instance is missing for column ' + column_candidate.id );
                            }
                            api_ready_column[_key] = _candidate_val;
                      break;
                      case  'module_id' :
                            api_ready_column[_key] = module.id;
                      break;
                      case  'control_id' :
                            api_ready_column[_key] = module.control.id;
                      break;
                      case 'is_added_by_user' :
                            api_ready_column[_key] =  _.isBoolean( _candidate_val ) ? _candidate_val : false;
                      break;
                }//switch
          });
          return api_ready_column;
      },




      //@param obj can be { collection : []}, or { module : {} }
      updateColumnCollection : function( obj ) {
            var module = this,
                _current_collection = module.czr_columnCollection();
                _new_collection = $.extend( true, [] , _current_collection );
            api.consoleLog('in update column collection', module.id, module.czr_columnCollection() );
            //if a collection is provided in the passed obj then simply refresh the collection
            //=> typically used when reordering the collection module with sortable or when a column is removed
            if ( _.has( obj, 'collection' ) ) {
                  //reset the collection
                  module.czr_columnCollection.set(obj.collection);
                  return;
            }

            if ( ! _.has(obj, 'column') ) {
                  throw new Error('updateColumnCollection, no column provided in module ' + module.id + '. Aborting');
            }
            var column = _.clone(obj.column);

            if ( ! _.has(column, 'id') ) {
                  throw new Error('updateColumnCollection, no id provided for a column in module' + module.id + '. Aborting');
            }
            //the module already exist in the collection
            if ( _.findWhere( _new_collection, { id : column.id } ) ) {
                  _.each( _current_collection , function( _elt, _ind ) {
                        if ( _elt.id != column.id )
                          return;

                        //set the new val to the changed property
                        _new_collection[_ind] = column;
                  });
            }
            //the module has to be added
            else {
                  _new_collection.push(column);
            }

            //Inform the global column collection
            module.czr_columnCollection.set(_new_collection);
      },


      removeColumnFromCollection : function( column ) {
            var module = this,
                _current_collection = module.czr_columnCollection(),
                _new_collection = $.extend( true, [], _current_collection);

            _new_collection = _.filter( _new_collection, function( _col ) {
                  return _col.id != column.id;
            } );

            module.czr_columnCollection.set(_new_collection);
      },




      //cb of control.czr_columnCollection.callbacks
      //The job of this function is to set the column collection in their respective sektItems
      columnCollectionReact : function( to, from ) {
            var module = this,
                is_column_added   = _.size(from) < _.size(to),
                is_column_removed = _.size(from) > _.size(to),
                isColumnUpdate  = _.size(from) == _.size(to),
                //is_column_collection_sorted = _.isEmpty(_to_add) && _.isEmpty(_to_remove)  && ! isColumnUpdate,
                _current_sek_model = {},
                _new_sek_model = {};

            //COLUMN UPDATE CASE
            //parse the columns and find the one that has changed.
            if ( isColumnUpdate ) {
                  _.each( to, function( _col, _key ) {
                        if ( _.isEqual( _col, from[_key] ) )
                          return;
                        _current_sek_model = _col.sektion();
                        _new_sek_model = $.extend(true, {}, _current_sek_model);

                        //find the column and update it
                        _.each( _current_sek_model.columns, function( _c, _k ){
                              if ( _c.id != _col.id )
                                return;
                              _new_sek_model.columns[_k] = _col;
                        } );

                        _col.sektion.set( _new_sek_model );

                  } );//_.each
            }//end if column update


            //NEW COLUMN CASE
            if ( is_column_added ) {
                  //find the new column
                  var _new_column = _.filter( to, function( _col ){
                      return _.isUndefined( _.findWhere( from, { id : _col.id } ) );
                  });

                  _new_column = _new_column[0];
                  _current_sek_model = _new_column.sektion();
                  //only add the column if the column does not exist in the sektion columns.
                  if ( _.isUndefined( _.findWhere( _current_sek_model.columns, {id : _new_column.id } ) ) ) {
                        _new_sek_model = $.extend(true, {}, _current_sek_model);
                        _new_sek_model.columns.push( _new_column );
                        _new_column.sektion.set( _new_sek_model );
                  }

            }//end if new column case

            //COLUMN REMOVED
            if ( is_column_removed ) {
                  //find the column to remove
                  var _to_remove = _.filter( from, function( _col ){
                      return _.isUndefined( _.findWhere( to, { id : _col.id } ) );
                  });
                  _to_remove = _to_remove[0];

                  _current_sek_model = _to_remove.sektion();
                  _new_sek_model = $.extend(true, {}, _current_sek_model);//_.clone() is not enough there, we need a deep cloning.

                  //remove the column from the sekItem model
                  _new_sek_model.columns = _.filter( _new_sek_model.columns, function( _col ) {
                        return _col.id != _to_remove.id;
                  } );

                  _to_remove.sektion.set( _new_sek_model );

                  //remove the column instance from module
                  module.czr_Column.remove( _to_remove.id );
            }


            //refreshes the preview frame  :
            //1) only needed if transport is postMessage, because is triggered by wp otherwise
            //2) only needed when : add, remove, sort item(s)
            //module update case
            // if ( 'postMessage' == api(control.id).transport && ! api.CZR_Helpers.hasPartRefresh( control.id ) ) {
            //     if ( is_collection_sorted )
            //         api.previewer.refresh();
            // }
      },



      //recursive
      generateColId : function( key, i ) {
            //prevent a potential infinite loop
            i = i || 1;
            if ( i > 100 ) {
                  throw new Error('Infinite loop when generating of a column id.');
            }

            var module = this;
            key = key || module._getNextColKeyInCollection();

            var id_candidate = 'col_' + key;

            //do we have a column collection value ?
            if ( ! _.has(module, 'czr_columnCollection') || ! _.isArray( module.czr_columnCollection() ) ) {
                  throw new Error('The column collection does not exist or is not properly set in module : ' + module.id );
            }
            //make sure the column is not already instantiated
            if ( module.czr_Column.has( id_candidate ) ) {
              return module.generateColId( key++, i++ );
            }

            return id_candidate;
      },


      //helper : return an int
      //=> the next available id of the column collection
      _getNextColKeyInCollection : function() {
            var module = this,
                _max_col_key = {},
                _next_key = 0;

            //get the initial key
            //=> if we already have a collection, extract all keys, select the max and increment it.
            //else, key is 0
            if ( ! _.isEmpty( module.czr_columnCollection() ) ) {
                _max_col_key = _.max( module.czr_columnCollection(), function( _col ) {
                    return parseInt( _col.id.replace(/[^\/\d]/g,''), 10 );
                });
                _next_key = parseInt( _max_col_key.id.replace(/[^\/\d]/g,''), 10 ) + 1;
            }
            return _next_key;
      },


      //@return bool
      moduleExistsInOneColumnMax : function( module_id ) {
            return 2 > this.getModuleColumn( module_id ).length;
      },


      //@return an array of columns
      //=> a module can't be embedded in several columns at a time
      //if the returned array has more than one item, it should trigger an Error.
      getModuleColumn : function( module_id ) {
            var module = this,
                _mod_columns = [];
            _.each( module.czr_columnCollection(), function( _col, _key ) {
                  if ( _.findWhere( _col.modules, { id : module_id } ) )
                    _mod_columns.push( _col.id );
            });
            return _mod_columns;
      }
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule
//This module populates the sektions setting.
//The each sektion is composed of columns (=> columns on front end)
//Each columns of modules ( => content module on front end like slider, text block, etc)

var CZRSektionMths = CZRSektionMths || {};
( function ( api, $, _ ) {
$.extend( CZRSektionMths, {
      /////////////////////////////////////////////////////////////////////////
      /// DRAGULA
      ////////////////////////////////////////////////////////////////////////
     initModulesDragula : function() {
            var module = this;

            //instantiate dragula without container => they will be pushed on module instantiation
            module.modsDragInstance = dragula({
                  // copySortSource : function() {
                  //   api.consoleLog('copy sort source', arguments);
                  // },
                  copy: function (el, source) {
                    return $(el).hasClass( 'czr-module-candidate' );
                  },
                  moves: function (el, source, handle, sibling) {
                      return _.contains( handle.className.split(' '), 'czr-mod-drag-handler' );
                  },
                  // invalidTarget : function(el, handle) {
                  //     api.consoleLog('invalidTarget', el, handle );
                  //     return false;
                  // },
                  accepts: function ( el, target, source, sibling ) {
                      //disable drop in module panel
                      // if ( $(target).hasClass('czr-available-modules-list') )
                      //   return false;
                      // if ( $(target).closest('.czr-single-item').hasClass('open') )
                      //   return ! _.contains( target.className.split(' '), 'czr-dragula-fake-container' );
                      //api.consoleLog('in accepts', target, $(target).attr('id') );
                      return ! _.isUndefined(target) && 'czr-available-modules-list' != $(target).attr('id') ;
                  },
                  isContainer : function( el ) {
                    //api.consoleLog('isContainer?', el);
                    return false;
                  }
            });//dragula


            //react to drag events
            module.modsDragInstance.on('drag', function( el, source ){
                    module.czr_Item.each( function( _sektion ){
                          _sektion.viewState.set( 'expanded' != _sektion.viewState() ? 'expanded_noscroll' : 'expanded' );
                    });
            }).on('dragend', function( el, source ){
                    // module.czr_Item.each( function( _sektion ){
                    //       _sektion.container.removeClass('czr-show-fake-container');
                    // });
            }).on('drop', function(el, target, source, sibling ) {
                  var _dropped_module_id = $(el).attr('data-module-id'),
                      _dropped_module_type = $(el).attr('data-module-type'),
                      _target_col = $(target).closest('.czr-column').attr('data-id'),
                      _source_col = $(source).closest('.czr-column').attr('data-id'),
                      is_reorder = _target_col == _source_col,
                      is_module_candidate = $(el).hasClass('czr-module-candidate');

                  if ( is_module_candidate ) {
                      if ( _.isUndefined(_target_col) || _.isUndefined(_dropped_module_type ) )
                        return;

                      module.userAddedModule( _target_col, _dropped_module_type );
                      module.reorderModulesInColumn( _target_col );
                  }
                  else if ( is_reorder ) {
                      module.reorderModulesInColumn( _target_col );
                  } else {
                      module.control.getSyncCollectionControl().czr_Module( _dropped_module_id ).modColumn.set( _target_col );
                  }
            });

            //expand a closed sektion on over
            // module.modsDragInstance.on('over', function( el, container, source ) {
            //   api.consoleLog('OVERING', container );
            //       if ( $(container).hasClass('czr-dragula-fake-container') ) {
            //           //get the sekItem id
            //           _target_sekId = $(container).closest('[data-id]').attr('data-id');
            //           module.czr_Item(_target_sekId).viewState.set('expanded_noscroll');
            //       }
            // });

            //make sure the scroll down is working
            var scroll = autoScroller([
                         module.control.container.closest('.accordion-section-content')[0]
                      ],
                      {
                        direction: "vertical",
                        margin: 20,
                        pixels: 100,
                        scrollWhenOutside: true,
                        autoScroll: function(){
                            //Only scroll when the pointer is down, and there is a child being dragged.
                            return module.modsDragInstance.dragging;
                        }
                      }
            );
      },


     //fired on DOM user action
      //=> in the future, the module to instantiate will be stored in a pre module Value(), just like the pre Item idea
      //
      //Fired on column instanciation => to populate the saved module collection of this column
      //the defautAPIModuleModel looks like :
      //id : '',//module.id,
      // module_type : '',//module.module_type,
      // items   : [],//$.extend( true, {}, module.items ),
      // crud : false,
      // multi_item : false,
      // control : {},//control,
      // column_id : '',
      // sektion : {},// => the sektion instance
      // sektion_id : '',
      // is_added_by_user : false,
      userAddedModule : function( column_id, module_type  ) {
            var module = this,
                syncedCollectionControl = module.control.getSyncCollectionControl(),
                defautAPIModuleModel = _.clone( syncedCollectionControl.getDefaultModuleApiModel() );

            syncedCollectionControl.trigger(
                  'user-module-candidate',
                  $.extend( defautAPIModuleModel, {
                        module_type : module_type, //'czr_text_editor_module', //'czr_text_module',
                        column_id : column_id,//a string
                        sektion : module.czr_Column(column_id).sektion,//instance
                        sektion_id : module.czr_Column(column_id).sektion.id,
                        is_added_by_user : true
                  } )
            );

      },



      reorderModulesInColumn : function( col_id ) {
            var module = this,
            //get the updated collection from the DOM and update the column module collection
                _new_dom_module_collection = module.czr_Column( col_id  ).getColumnModuleCollectionFromDom( col_id  );

            //close the module panel id needed
            // if ( _.has( api, 'czrModulePanelState') )
            //   api.czrModulePanelState(false);

            module.czr_Column( col_id ).updateColumnModuleCollection( { collection : _new_dom_module_collection } );
      },

      //@param module obj
      //@param source col string
      //@param target column string
      moveModuleFromTo : function( moved_module, source_column, target_column ) {
            api.consoleLog( 'ALORS CE BUG?', this(), this.czr_columnCollection() );
            var module = this,
                _new_dom_module_collection = module.czr_Column( target_column ).getColumnModuleCollectionFromDom( source_column );

            //close the module panel id needed
            if ( _.has( api, 'czrModulePanelState') )
              api.czrModulePanelState(false);

            //update the target column collection with the new collection read from the DOM
            module.czr_Column( target_column ).updateColumnModuleCollection( { collection : _new_dom_module_collection } );
            //remove module from old column module collection
            module.czr_Column( source_column ).removeModuleFromColumnCollection( moved_module );
      }
});//extend
})( wp.customize , jQuery, _ );//extends api.Value

var CZRSektionMths = CZRSektionMths || {};
( function ( api, $, _ ) {
$.extend( CZRSektionMths, {
      toggleModuleListPanel : function( obj ) {
            var module = this;
            // if ( 'pending' == api.czrModulePanelEmbedded.state() ) {
            //     $.when( module.renderModulePanel() ).done( function(){
            //         api.consoleLog('MODULE PANEL EMBEDDED!');
            //         api.czrModulePanelEmbedded.resolve();
            //     });
            // }

            //close the sek setting panel if needed
            api.czrSekSettingsPanelState.set(false);

            api.czrModulePanelState.set( ! api.czrModulePanelState() );


            //close all sektions but the one from which the button has been clicked
            if ( ! api.czrModulePanelState() ) {
                module.closeAllOtherSektions( $(obj.dom_event.currentTarget, obj.dom_el ) );
            } else {
                module.czr_Item.each( function( _sektion ){
                    _sektion.viewState.set( 'expanded' != _sektion.viewState() ? 'expanded_noscroll' : 'expanded' );
                });
            }
      },

      //fired once, on first expansion
      renderModulePanel : function() {
            var module = this;
            //do we have template script?
            if ( 0 === $( '#tmpl-czr-available-modules' ).length ) {
              throw new Error('No template found to render the module panel list' );
            }

            $('#widgets-left').after( $( wp.template( 'czr-available-modules' )() ) );

            _.each( api.czrModuleMap, function( _data, _mod_type ) {
                    var $_mod_candidate = $('<li/>', {
                          class : 'czr-module-candidate',
                          'data-module-type' : _mod_type,
                          html : '<h3><span class="czr-mod-drag-handler fas fa-expand-arrows-alt"></span>' + _data.name + '</h3>'
                    });
                    $('#czr-available-modules-list').append(  $_mod_candidate );
            });
      }
});//$.extend
})( wp.customize , jQuery, _ );
//extends api.Value
var CZRColumnMths = CZRColumnMths || {};
( function ( api, $, _ ) {
//extends api.Value
//a column is instanciated with the typical set of options :
// id : '',
// modules : [],
// sektion : {},//sektion instance
// module_id : '',
// control_id : '',
// is_added_by_user : false
$.extend( CZRColumnMths , {
      initialize: function( name, options ) {
            var column = this;
            api.Value.prototype.initialize.call( column, null, options );

            //write the options as properties, name is included
            $.extend( column, options || {} );

            column.isReady = $.Deferred();
            column.embedded = $.Deferred();

            //stores the column collection
            //set the initial value
            column.czr_columnModuleCollection = new api.Value();
            column.czr_columnModuleCollection.set( column.modules );

            //set the column instance value
            column.set( options );

            //the modules are stored only with their id in a column
            column.defautModuleModelInColumn = { id : '' };

            //api.consoleLog('column.sektion.contentRendered.state()', column.sektion.contentRendered.state() );

            //defer the column rendering when the parent sektion content is rendered
            column.sektion.bind( 'contentRendered', function() {
                  //render the column
                  column.container = column.render();
                  api.consoleLog('COLUMN CONTAINER?', column.container );
                  //say it
                  column.embedded.resolve();
            });







            //when column is embedded :
            //=> setup the DOM event handler
            column.embedded.done(function() {
                  //at this point, the question is : are the modules assigned to this column instantiated ?
                  //if not => let's instantiate them. => this should not change the module collection czr_moduleCollection of the module-collection control
                  //=> because they should already be registered in it
                  column.mayBeInstantiateColumnModules();

                  //react to column value changes
                  column.callbacks.add( function() { return column.columnReact.apply(column, arguments ); } );

                  //react to the column module collection changes
                  column.czr_columnModuleCollection.callbacks.add( function() { return column.columnModuleCollectionReact.apply( column, arguments ); } );

                  //Setup the column event listeners
                  api.CZR_Helpers.setupDOMListeners(
                          column.column_event_map,//actions to execute
                          { dom_el : column.container },//dom scope
                          column//instance where to look for the cb methods
                  );

                  //dragulize
                  var syncCollectionControl = api.control(column.control_id).getSyncCollectionControl();
                  api.consoleLog('////////////////////////////////////////////////////');
                  api.consoleLog('column.container?', column.container);
                  api.consoleLog('syncCollectionControl.syncSektionModule()', syncCollectionControl.syncSektionModule()() );
                  api.consoleLog('////////////////////////////////////////////////////');
                  syncCollectionControl.syncSektionModule().modsDragInstance.containers.push( $('.czr-module-collection-wrapper', column.container )[0] );

            });
      },



      //overridable method
      //Fired if column is instantiated.
      ready : function() {
            var column = this;
            //=>allows us to use the following event base method : column.isReady.done( function() {} ):
            column.isReady.resolve();

            //push it to the module collection
            column.sektion.module.updateColumnCollection( {column : column() });
      },

      //fired on column embedded
      mayBeInstantiateColumnModules : function() {
            var column = this,
                syncedCollectionControl = column.sektion.control.getSyncCollectionControl();

            //when the module collection is synchronized, instantiate the module of this column
            //=>fire ready when the module column is embedded
            $.when( syncedCollectionControl.moduleCollectionReady.promise() ).then(
                  function() {
                        _.each( column.czr_columnModuleCollection() , function( _mod ) {
                                  //is this module already instantiated ?
                                  if ( syncedCollectionControl.czr_Module.has(_mod.id) )
                                    return;

                                  //first let's try to get it from the collection
                                  //var _module_candidate = _.findWhere( syncedCollectionControl.czr_moduleCollection() , { id : _mod.id } );
                                  $.when( _.findWhere( syncedCollectionControl.czr_moduleCollection() , { id : _mod.id } ) ).done( function( module_candidate ) {
                                        if ( _.isUndefined( module_candidate) ||_.isEmpty( module_candidate ) ) {
                                          throw new Error( 'Module ' + _mod.id + ' was not found in the module collection.');
                                        }
                                        //we have a candidate. Let's instantiate it + fire ready()
                                        syncedCollectionControl.instantiateModule( module_candidate, {} ).ready();
                                  });


                                  //push it to the collection of the sektions control
                                  //@todo => shall we make sure that the module has actually been instatiated by the module-collection control?
                                  // if ( ! syncedCollectionControl.czr_Module.has( _module_candidate.id ) )
                                  //   return;

                                  //column.updateColumnModuleCollection( { module : _module_candidate });
                        } );
                  },//done callback
                  function() {},//fail callback
                  function() {
                        api.consoleLog( 'NOT SYNCHRONIZED YET');
                  }
            );//.then()
      },




      //fired on parent section 'contentRendered'
      render : function() {
            var column   = this;
            $view     = $( wp.template('czr-sektion-column')( {id: column.id}) );
            $view.appendTo( $('.czr-column-wrapper', column.sektion.container ) );
            return $view;
      },


      //cb of column.callbacks.add()
      //the job is this callback is to inform the parent sektion collection that something happened
      //typically, a module has been added
      columnReact : function( to ,from ) {
            var column = this;
            this.sektion.module.updateColumnCollection( {column : to });
      }
});//$.extend
})( wp.customize , jQuery, _ );
//extends api.Value
var CZRColumnMths = CZRColumnMths || {};
( function ( api, $, _ ) {
//extends api.Value
//a column is instanciated with the typical set of options :
// id : '',
// modules : [],
// sektion : {},//sektion instance
// module_id : '',
// control_id : '',
// is_added_by_user : false
$.extend( CZRColumnMths , {
      updateColumnModuleCollection : function( obj ) {
              var column = this,
                  _current_collection = column.czr_columnModuleCollection();
                  _new_collection = $.extend( true, [], _current_collection );

              api.consoleLog('column.czr_columnModuleCollection()', column.czr_columnModuleCollection() );

              //if a collection is provided in the passed obj then simply refresh the collection
              //=> typically used when reordering the collection module with sortable or when a column is removed
              if ( _.has( obj, 'collection' ) ) {
                    //reset the collection
                    column.czr_columnModuleCollection.set(obj.collection);
                    return;
              }

              if ( ! _.has(obj, 'module') ) {
                throw new Error('updateColumnModuleCollection, no module provided in column ' + column.id + '. Aborting');
              }

              //1) The module id must be a not empty string
              //2) The module shall not exist in another column
              var module_ready_for_column_api = column.prepareModuleForColumnAPI( _.clone(obj.module) );


              //the module already exist in the collection
              if ( _.findWhere( _new_collection, { id : module_ready_for_column_api.id } ) ) {
                    _.each( _current_collection , function( _elt, _ind ) {
                            if ( _elt.id != module_ready_for_column_api.id )
                              return;

                            //set the new val to the changed property
                            _new_collection[_ind] = module_ready_for_column_api;
                    });
              }
              //otherwise,the module has to be added
              else {
                    _new_collection.push(module_ready_for_column_api);
              }

              //set the collection
              column.czr_columnModuleCollection.set( _new_collection );
      },


      //cb of : column.czr_columnModuleCollection.callbacks.add()
      //the job of this method is to update the column instance value with a new collection of modules
      columnModuleCollectionReact : function( to, from ) {
              var column = this,
                  _current_column_model = column(),
                  _new_column_model = _.clone( _current_column_model ),
                  _new_module_collection = [];

              _.each( to , function( _mod, _key ) {
                  _new_module_collection[_key] = { id : _mod.id };
              });

              //say it to the column instance
              _new_column_model.modules = _new_module_collection;
              column.set( _new_column_model );
      },

      //remove a module base on the id
      //Note that the module param can include various properties (depending on where this method is called from) that won't be used in this function
      removeModuleFromColumnCollection : function( module ) {
              var column = this,
                  _current_collection = column.czr_columnModuleCollection();
                  _new_collection = $.extend( true, [], _current_collection );

              _new_collection = _.filter( _new_collection, function( _mod ){
                  return _mod.id != module.id;
              } );
              //set the collection
              column.czr_columnModuleCollection.set( _new_collection );
      },


      //column.defautModuleModelInColumn = { id : '' };
      prepareModuleForColumnAPI : function( module_candidate ) {
              if ( ! _.isObject( module_candidate ) ) {
                  throw new Error('prepareModuleForColumnAPI : a module must be an object.');
              }
              var column = this,
                  api_ready_module = {};

              _.each( column.defautModuleModelInColumn, function( _value, _key ) {
                      var _candidate_val = module_candidate[ _key ];
                      switch( _key ) {
                            case 'id' :
                              if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                  throw new Error('prepareModuleForColumnAPI : a module id must a string not empty');
                              }
                              if ( ! column.sektion.module.moduleExistsInOneColumnMax( module_candidate.id ) ) {
                                  throw new Error('A module can not be embedded in more than one column at a time. Module ' + module_candidate.id + ' exists in several columns : ' +  column.sektion.module.getModuleColumn( module_candidate.id ).join(',') );
                              }
                              api_ready_module[ _key ] = _candidate_val;
                            break;
                      }//switch
              });//each
              return api_ready_module;
      },


      //@param old_col_id is the column in which the module was embedded before being move to the current one
      getColumnModuleCollectionFromDom : function( old_col_id ) {
              var column = this,
                  $_moduleWrapper = $('.czr-module-collection-wrapper', column.container ),
                  _previous_column_collection = column.sektion.module.czr_Column( old_col_id ).czr_columnModuleCollection(),
                  _new_collection = [];

              api.consoleLog('in GET COLUMN MODULE COLLECTION FROM DOM', old_col_id, $_moduleWrapper, column.container );

              $('.czr-single-module', $_moduleWrapper).each( function( _index ) {
                    //If the current module el was already there
                    //=> push it in the new collection and loop next
                    if ( ! _.isUndefined( _.findWhere( column.czr_columnModuleCollection(), { id: $(this).attr('data-module-id') } ) ) ) {
                          _new_collection[_index] = _.findWhere( column.czr_columnModuleCollection(), { id: $(this).attr('data-module-id') } );
                          return;
                    }

                    var _module_obj = _.findWhere( _previous_column_collection, { id: $(this).attr('data-module-id') } );

                    //do we have a match in the existing collection ?
                    if ( ! _module_obj ) {
                        throw new Error('The module  : ' + $(this).attr('data-module-id') + ' was not found in the collection of its previous column ' + old_col_id );
                    }
                    _new_collection[_index] = column.prepareModuleForColumnAPI( _module_obj );
              });

              if ( _.isEmpty( _new_collection ) ) {
                  throw new Error('There was a problem when re-building the column module collection from the DOM in column : ' + column.id );
              }
              return _new_collection;
      }
});//$.extend
})( wp.customize , jQuery, _ );//extends api.Value
var CZRSektionMths = CZRSektionMths || {};
( function ( api, $, _ ) {
$.extend( CZRSektionMths, {
      toggleSekSettingsPanel : function( obj ) {
            var module = this;
            if ( 'pending' == api.czrSekSettingsPanelEmbedded.state() ) {
                  try {
                        $.when( module.renderSekSettingsPanel() ).done( function() {
                              api.czrSekSettingsPanelEmbedded.resolve();
                        });
                  } catch( er ) {
                        api.errorLog( 'In toggleSekSettingsPanel : ' + er );
                  }
            }
            //close the module panel if needed
            api.czrModulePanelState.set( false );

            api.czrSekSettingsPanelState.set( ! api.czrSekSettingsPanelState() );

            //close all sektions but the one from which the button has been clicked
            module.closeAllOtherSektions( $(obj.dom_event.currentTarget, obj.dom_el ) );
      },

      //cb of api.czrSekSettingsPanelState.callbacks
      reactToSekSettingPanelState : function( expanded ) {
           $('body').toggleClass('czr-editing-sektion', expanded );
      },

      //fired once, on first expansion
      renderSekSettingsPanel : function() {
            var module = this,
                _tmpl = '';
            //do we have template script?
            if ( 0 === $( '#tmpl-czr-sektion-settings-panel' ).length ) {
                  throw new Error('No template found to render the sektion setting panel' );
            }
            try {
                  _tmpl = wp.template( 'czr-sektion-settings-panel' )();
            } catch( er ) {
                  api.errorLog( 'Error when parsing the template of the sektion setting panel' + er );
                  return;
            }
            $('#widgets-left').after( $( _tmpl ) );

            // _.each( api.czrModuleMap, function( _data, _mod_type ) {
            //         var $_mod_candidate = $('<li/>', {
            //               class : 'czr-module-candidate',
            //               'data-module-type' : _mod_type,
            //               html : '<h3><span class="czr-mod-drag-handler fa fa-arrows-alt"></span>' + _data.name + '</h3>'
            //         });
            //         $('#czr-available-modules-list').append(  $_mod_candidate );
            // });
      }
});//$.extend
})( wp.customize , jQuery, _ );
(function ( api, $, _ ) {
//provides a description of each module
      //=> will determine :
      //1) how to initialize the module model. If not crud, then the initial item(s) model shall be provided
      //2) which js template(s) to use : if crud, the module template shall include the add new and pre-item elements.
      //   , if crud, the item shall be removable
      //3) how to render : if multi item, the item content is rendered when user click on edit button.
      //    If not multi item, the single item content is rendered as soon as the item wrapper is rendered.
      //4) some DOM behaviour. For example, a multi item shall be sortable.
      api.czrModuleMap = api.czrModuleMap || {};
      $.extend( api.czrModuleMap, {
            czr_sektion_module : {
                  mthds : CZRSektionMths,
                  crud : true,
                  name : 'Sektions'
            },
            czr_fp_module : {
                  mthds : CZRFeaturedPageModuleMths,
                  crud : true,
                  name : 'Featured Pages'
            },
            czr_slide_module : {
                  mthds : CZRSlideModuleMths,
                  crud : true,
                  name : 'Slider',
                  has_mod_opt : true
            },
            czr_related_posts_module : {
                  mthds : CZRRelatedPostsModMths,
                  crud : false,
                  multi_item : false,
                  name : 'Related Posts',
                  has_mod_opt : false
            },
            czr_text_module : {
                  mthds : CZRTextModuleMths,
                  crud : false,
                  multi_item : false,
                  name : 'Simple Text'
            },
            czr_text_editor_module : {
                  mthds : CZRTextEditorModuleMths,
                  crud : false,
                  multi_item : false,
                  name : 'WP Text Editor'
            }
      });
})( wp.customize, jQuery, _ );