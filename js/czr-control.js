/*! addEventListener Polyfill ie9- http://stackoverflow.com/a/27790212*/
window.addEventListener=window.addEventListener||function(a,b){window.attachEvent("on"+a,b)},/*!  Datenow Polyfill ie9- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now */
Date.now||(Date.now=function(){return(new Date).getTime()}),/*! Object.create monkey patch ie8 http://stackoverflow.com/a/18020326 */
Object.create||(Object.create=function(a,b){function c(){}if("undefined"!=typeof b)throw"The multiple-argument version of Object.create is not provided by this browser and cannot be shimmed.";return c.prototype=a,new c}),/*! https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter */
Array.prototype.filter||(Array.prototype.filter=function(a){"use strict";if(void 0===this||null===this)throw new TypeError;var b=Object(this),c=b.length>>>0;if("function"!=typeof a)throw new TypeError;for(var d=[],e=arguments.length>=2?arguments[1]:void 0,f=0;c>f;f++)if(f in b){var g=b[f];a.call(e,g,f,b)&&d.push(g)}return d}),/*! map was added to the ECMA-262 standard in the 5th edition */
Array.prototype.map||(Array.prototype.map=function(a,b){var c,d,e;if(null===this)throw new TypeError(" this is null or not defined");var f=Object(this),g=f.length>>>0;if("function"!=typeof a)throw new TypeError(a+" is not a function");for(arguments.length>1&&(c=b),d=new Array(g),e=0;g>e;){var h,i;e in f&&(h=f[e],i=a.call(c,h,e,f),d[e]=i),e++}return d});/*! iCheck v1.0.1 by Damir Sultanov, http://git.io/arlzeA, MIT Licensed */
if ( 'function' != typeof(jQuery.fn.iCheck) ) {
  !function(a){function b(a,b,e){var f=a[0],g=/er/.test(e)?p:/bl/.test(e)?n:l,h=e==q?{checked:f[l],disabled:f[n],indeterminate:"true"==a.attr(p)||"false"==a.attr(o)}:f[g];if(/^(ch|di|in)/.test(e)&&!h)c(a,g);else if(/^(un|en|de)/.test(e)&&h)d(a,g);else if(e==q)for(g in h)h[g]?c(a,g,!0):d(a,g,!0);else b&&"toggle"!=e||(b||a[u]("ifClicked"),h?f[r]!==k&&d(a,g):c(a,g))}function c(b,c,e){var q=b[0],u=b.parent(),v=c==l,x=c==p,y=c==n,z=x?o:v?m:"enabled",A=f(b,z+g(q[r])),B=f(b,c+g(q[r]));if(!0!==q[c]){if(!e&&c==l&&q[r]==k&&q.name){var C=b.closest("form"),D='input[name="'+q.name+'"]',D=C.length?C.find(D):a(D);D.each(function(){this!==q&&a(this).data(i)&&d(a(this),c)})}x?(q[c]=!0,q[l]&&d(b,l,"force")):(e||(q[c]=!0),v&&q[p]&&d(b,p,!1)),h(b,v,c,e)}q[n]&&f(b,w,!0)&&u.find("."+j).css(w,"default"),u[s](B||f(b,c)||""),y?u.attr("aria-disabled","true"):u.attr("aria-checked",x?"mixed":"true"),u[t](A||f(b,z)||"")}function d(a,b,c){var d=a[0],e=a.parent(),i=b==l,k=b==p,q=b==n,u=k?o:i?m:"enabled",v=f(a,u+g(d[r])),x=f(a,b+g(d[r]));!1!==d[b]&&((k||!c||"force"==c)&&(d[b]=!1),h(a,i,u,c)),!d[n]&&f(a,w,!0)&&e.find("."+j).css(w,"pointer"),e[t](x||f(a,b)||""),q?e.attr("aria-disabled","false"):e.attr("aria-checked","false"),e[s](v||f(a,u)||"")}function e(b,c){b.data(i)&&(b.parent().html(b.attr("style",b.data(i).s||"")),c&&b[u](c),b.off(".i").unwrap(),a(v+'[for="'+b[0].id+'"]').add(b.closest(v)).off(".i"))}function f(a,b,c){return a.data(i)?a.data(i).o[b+(c?"":"Class")]:void 0}function g(a){return a.charAt(0).toUpperCase()+a.slice(1)}function h(a,b,c,d){d||(b&&a[u]("ifToggled"),a[u]("ifChanged")[u]("if"+g(c)))}var i="iCheck",j=i+"-helper",k="radio",l="checked",m="un"+l,n="disabled",o="determinate",p="in"+o,q="update",r="type",s="addClass",t="removeClass",u="trigger",v="label",w="cursor",x=/ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);a.fn[i]=function(f,g){var h='input[type="checkbox"], input[type="'+k+'"]',m=a(),o=function(b){b.each(function(){var b=a(this);m=b.is(h)?m.add(b):m.add(b.find(h))})};if(/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(f))return f=f.toLowerCase(),o(this),m.each(function(){var c=a(this);"destroy"==f?e(c,"ifDestroyed"):b(c,!0,f),a.isFunction(g)&&g()});if("object"!=typeof f&&f)return this;var w=a.extend({checkedClass:l,disabledClass:n,indeterminateClass:p,labelHover:!0,aria:!1},f),y=w.handle,z=w.hoverClass||"hover",A=w.focusClass||"focus",B=w.activeClass||"active",C=!!w.labelHover,D=w.labelHoverClass||"hover",E=0|(""+w.increaseArea).replace("%","");return("checkbox"==y||y==k)&&(h='input[type="'+y+'"]'),-50>E&&(E=-50),o(this),m.each(function(){var f=a(this);e(f);var g=this,h=g.id,m=-E+"%",o=100+2*E+"%",o={position:"absolute",top:m,left:m,display:"block",width:o,height:o,margin:0,padding:0,background:"#fff",border:0,opacity:0},m=x?{position:"absolute",visibility:"hidden"}:E?o:{position:"absolute",opacity:0},p="checkbox"==g[r]?w.checkboxClass||"icheckbox":w.radioClass||"i"+k,y=a(v+'[for="'+h+'"]').add(f.closest(v)),F=!!w.aria,G=i+"-"+Math.random().toString(36).substr(2,6),H='<div class="'+p+'" '+(F?'role="'+g[r]+'" ':"");F&&y.each(function(){H+='aria-labelledby="',this.id?H+=this.id:(this.id=G,H+=G),H+='"'}),H=f.wrap(H+"/>")[u]("ifCreated").parent().append(w.insert),o=a('<ins class="'+j+'"/>').css(o).appendTo(H),f.data(i,{o:w,s:f.attr("style")}).css(m),w.inheritClass&&H[s](g.className||""),w.inheritID&&h&&H.attr("id",i+"-"+h),"static"==H.css("position")&&H.css("position","relative"),b(f,!0,q),y.length&&y.on("click.i mouseover.i mouseout.i touchbegin.i touchend.i",function(c){var d=c[r],e=a(this);if(!g[n]){if("click"==d){if(a(c.target).is("a"))return;b(f,!1,!0)}else C&&(/ut|nd/.test(d)?(H[t](z),e[t](D)):(H[s](z),e[s](D)));if(!x)return!1;c.stopPropagation()}}),f.on("click.i focus.i blur.i keyup.i keydown.i keypress.i",function(a){var b=a[r];return a=a.keyCode,"click"==b?!1:"keydown"==b&&32==a?(g[r]==k&&g[l]||(g[l]?d(f,l):c(f,l)),!1):("keyup"==b&&g[r]==k?!g[l]&&c(f,l):/us|ur/.test(b)&&H["blur"==b?t:s](A),void 0)}),o.on("click mousedown mouseup mouseover mouseout touchbegin.i touchend.i",function(a){var c=a[r],d=/wn|up/.test(c)?B:z;if(!g[n]){if("click"==c?b(f,!1,!0):(/wn|er|in/.test(c)?H[s](d):H[t](d+" "+B),y.length&&C&&d==z&&y[/ut|nd/.test(c)?t:s](D)),!x)return!1;a.stopPropagation()}})})}}(window.jQuery||window.Zepto);
}
if ( 'function' != typeof(jQuery.fn.selecter) ) {
  !function(a,b){"use strict";function c(b){b=a.extend({},x,b||{}),null===w&&(w=a("body"));for(var c=a(this),e=0,f=c.length;f>e;e++)d(c.eq(e),b);return c}function d(b,c){if(!b.hasClass("selecter-element")){c=a.extend({},c,b.data("selecter-options")),c.external&&(c.links=!0);var d=b.find("option, optgroup"),g=d.filter("option"),h=g.filter(":selected"),n=""!==c.label?-1:g.index(h),p=c.links?"nav":"div";c.tabIndex=b[0].tabIndex,b[0].tabIndex=-1,c.multiple=b.prop("multiple"),c.disabled=b.is(":disabled");var q="<"+p+' class="selecter '+c.customClass;v?q+=" mobile":c.cover&&(q+=" cover"),q+=c.multiple?" multiple":" closed",c.disabled&&(q+=" disabled"),q+='" tabindex="'+c.tabIndex+'">',c.multiple||(q+='<span class="selecter-selected'+(""!==c.label?" placeholder":"")+'">',q+=a("<span></span").text(r(""!==c.label?c.label:h.text(),c.trim)).html(),q+="</span>"),q+='<div class="selecter-options">',q+="</div>",q+="</"+p+">",b.addClass("selecter-element").after(q);var s=b.next(".selecter"),u=a.extend({$select:b,$allOptions:d,$options:g,$selecter:s,$selected:s.find(".selecter-selected"),$itemsWrapper:s.find(".selecter-options"),index:-1,guid:t++},c);e(u),o(n,u),void 0!==a.fn.scroller&&u.$itemsWrapper.scroller(),u.$selecter.on("touchstart.selecter click.selecter",".selecter-selected",u,f).on("click.selecter",".selecter-item",u,j).on("close.selecter",u,i).data("selecter",u),u.$select.on("change.selecter",u,k),v||(u.$selecter.on("focus.selecter",u,l).on("blur.selecter",u,m),u.$select.on("focus.selecter",u,function(a){a.data.$selecter.trigger("focus")}))}}function e(b){for(var c="",d=b.links?"a":"span",e=0,f=0,g=b.$allOptions.length;g>f;f++){var h=b.$allOptions.eq(f);if("OPTGROUP"===h[0].tagName)c+='<span class="selecter-group',h.is(":disabled")&&(c+=" disabled"),c+='">'+h.attr("label")+"</span>";else{var i=h.val();h.attr("value")||h.attr("value",i),c+="<"+d+' class="selecter-item',h.is(":selected")&&""===b.label&&(c+=" selected"),h.is(":disabled")&&(c+=" disabled"),c+='" ',c+=b.links?'href="'+i+'"':'data-value="'+i+'"',c+=">"+a("<span></span>").text(r(h.text(),b.trim)).html()+"</"+d+">",e++}}b.$itemsWrapper.html(c),b.$items=b.$selecter.find(".selecter-item")}function f(c){c.preventDefault(),c.stopPropagation();var d=c.data;if(!d.$select.is(":disabled"))if(a(".selecter").not(d.$selecter).trigger("close.selecter",[d]),v){var e=d.$select[0];if(b.document.createEvent){var f=b.document.createEvent("MouseEvents");f.initMouseEvent("mousedown",!1,!0,b,0,0,0,0,0,!1,!1,!1,!1,0,null),e.dispatchEvent(f)}else e.fireEvent&&e.fireEvent("onmousedown")}else d.$selecter.hasClass("closed")?g(c):d.$selecter.hasClass("open")&&i(c)}function g(b){b.preventDefault(),b.stopPropagation();var c=b.data;if(!c.$selecter.hasClass("open")){var d=c.$selecter.offset(),e=w.outerHeight(),f=c.$itemsWrapper.outerHeight(!0),g=c.index>=0?c.$items.eq(c.index).position():{left:0,top:0};d.top+f>e&&c.$selecter.addClass("bottom"),c.$itemsWrapper.show(),c.$selecter.removeClass("closed").addClass("open"),w.on("click.selecter-"+c.guid,":not(.selecter-options)",c,h),void 0!==a.fn.scroller?c.$itemsWrapper.scroller("scroll",c.$itemsWrapper.find(".scroller-content").scrollTop()+g.top,0).scroller("reset"):c.$itemsWrapper.scrollTop(c.$itemsWrapper.scrollTop()+g.top)}}function h(b){b.preventDefault(),b.stopPropagation(),0===a(b.currentTarget).parents(".selecter").length&&i(b)}function i(a){a.preventDefault(),a.stopPropagation();var b=a.data;b.$selecter.hasClass("open")&&(b.$itemsWrapper.hide(),b.$selecter.removeClass("open bottom").addClass("closed"),w.off(".selecter-"+b.guid))}function j(b){b.preventDefault(),b.stopPropagation();var c=a(this),d=b.data;if(!d.$select.is(":disabled")){if(d.$itemsWrapper.is(":visible")){var e=d.$items.index(c);o(e,d),p(d)}d.multiple||i(b)}}function k(b,c){var d=a(this),e=b.data;if(!c&&!e.multiple){var f=e.$options.index(e.$options.filter("[value='"+s(d.val())+"']"));o(f,e),p(e)}}function l(b){b.preventDefault(),b.stopPropagation();var c=b.data;c.$select.is(":disabled")||c.multiple||(c.$selecter.addClass("focus").on("keydown.selecter"+c.guid,c,n),a(".selecter").not(c.$selecter).trigger("close.selecter",[c]))}function m(b){b.preventDefault(),b.stopPropagation();var c=b.data;c.$selecter.removeClass("focus").off("keydown.selecter"+c.guid+" keyup.selecter"+c.guid),a(".selecter").not(c.$selecter).trigger("close.selecter",[c])}function n(b){var c=b.data;if(13===b.keyCode)c.$selecter.hasClass("open")&&(i(b),o(c.index,c)),p(c);else if(!(9===b.keyCode||b.metaKey||b.altKey||b.ctrlKey||b.shiftKey)){b.preventDefault(),b.stopPropagation();var d=c.$items.length-1,e=c.index<0?0:c.index;if(a.inArray(b.keyCode,u?[38,40,37,39]:[38,40])>-1)e+=38===b.keyCode||u&&37===b.keyCode?-1:1,0>e&&(e=0),e>d&&(e=d);else{var f,g,h=String.fromCharCode(b.keyCode).toUpperCase();for(g=c.index+1;d>=g;g++)if(f=c.$options.eq(g).text().charAt(0).toUpperCase(),f===h){e=g;break}if(0>e)for(g=0;d>=g;g++)if(f=c.$options.eq(g).text().charAt(0).toUpperCase(),f===h){e=g;break}}e>=0&&o(e,c)}}function o(a,b){var c=b.$items.eq(a),d=c.hasClass("selected"),e=c.hasClass("disabled");if(!e){if(-1===a&&""!==b.label)b.$selected.html(b.label);else if(d)b.multiple&&(b.$options.eq(a).prop("selected",null),c.removeClass("selected"));else{{var f=c.html();c.data("value")}b.multiple?b.$options.eq(a).prop("selected",!0):(b.$selected.html(f).removeClass("placeholder"),b.$items.filter(".selected").removeClass("selected"),b.$select[0].selectedIndex=a),c.addClass("selected")}(!d||b.multiple)&&(b.index=a)}}function p(a){a.links?q(a):(a.callback.call(a.$selecter,a.$select.val(),a.index),a.$select.trigger("change",[!0]))}function q(a){var c=a.$select.val();a.external?b.open(c):b.location.href=c}function r(a,b){return 0===b?a:a.length>b?a.substring(0,b)+"...":a}function s(a){return a.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g,"\\$1")}var t=0,u=b.navigator.userAgent.toLowerCase().indexOf("firefox")>-1,v=/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(b.navigator.userAgent||b.navigator.vendor||b.opera),w=null,x={callback:a.noop,cover:!1,customClass:"",label:"",external:!1,links:!1,trim:0},y={defaults:function(b){return x=a.extend(x,b||{}),a(this)},disable:function(b){return a(this).each(function(c,d){var e=a(d).next(".selecter").data("selecter");if(e)if("undefined"!=typeof b){var f=e.$items.index(e.$items.filter("[data-value="+b+"]"));e.$items.eq(f).addClass("disabled"),e.$options.eq(f).prop("disabled",!0)}else e.$selecter.hasClass("open")&&e.$selecter.find(".selecter-selected").trigger("click.selecter"),e.$selecter.addClass("disabled"),e.$select.prop("disabled",!0)})},enable:function(b){return a(this).each(function(c,d){var e=a(d).next(".selecter").data("selecter");if(e)if("undefined"!=typeof b){var f=e.$items.index(e.$items.filter("[data-value="+b+"]"));e.$items.eq(f).removeClass("disabled"),e.$options.eq(f).prop("disabled",!1)}else e.$selecter.removeClass("disabled"),e.$select.prop("disabled",!1)})},destroy:function(){return a(this).each(function(b,c){var d=a(c).next(".selecter").data("selecter");d&&(d.$selecter.hasClass("open")&&d.$selecter.find(".selecter-selected").trigger("click.selecter"),void 0!==a.fn.scroller&&d.$selecter.find(".selecter-options").scroller("destroy"),d.$select[0].tabIndex=d.tabIndex,d.$select.off(".selecter").removeClass("selecter-element").show(),d.$selecter.off(".selecter").remove())})},refresh:function(){return a(this).each(function(b,c){var d=a(c).next(".selecter").data("selecter");if(d){var f=d.index;d.$allOptions=d.$select.find("option, optgroup"),d.$options=d.$allOptions.filter("option"),d.index=-1,f=d.$options.index(d.$options.filter(":selected")),e(d),o(f,d)}})}};a.fn.selecter=function(a){return y[a]?y[a].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof a&&a?this:c.apply(this,arguments)},a.selecter=function(a){"defaults"===a&&y.defaults.apply(this,Array.prototype.slice.call(arguments,1))}}(jQuery,window);
}
if ( 'function' != typeof(jQuery.fn.stepper) ) {
  !function(a){"use strict";function b(b){b=a.extend({},k,b||{});for(var d=a(this),e=0,f=d.length;f>e;e++)c(d.eq(e),b);return d}function c(b,c){if(!b.hasClass("stepper-input")){c=a.extend({},c,b.data("stepper-options"));var e=parseFloat(b.attr("min")),f=parseFloat(b.attr("max")),g=parseFloat(b.attr("step"))||1;b.addClass("stepper-input").wrap('<div class="stepper '+c.customClass+'" />').after('<span class="stepper-arrow up">'+c.labels.up+'</span><span class="stepper-arrow down">'+c.labels.down+"</span>");var h=b.parent(".stepper"),j=a.extend({$stepper:h,$input:b,$arrow:h.find(".stepper-arrow"),min:void 0===typeof e||isNaN(e)?!1:e,max:void 0===typeof f||isNaN(f)?!1:f,step:void 0===typeof g||isNaN(g)?1:g,timer:null},c);j.digits=i(j.step),b.is(":disabled")&&h.addClass("disabled"),h.on("touchstart.stepper mousedown.stepper",".stepper-arrow",j,d).data("stepper",j)}}function d(b){b.preventDefault(),b.stopPropagation(),e(b);var c=b.data;if(!c.$input.is(":disabled")&&!c.$stepper.hasClass("disabled")){var d=a(b.target).hasClass("up")?c.step:-c.step;c.timer=g(c.timer,125,function(){f(c,d,!1)}),f(c,d),a("body").on("touchend.stepper mouseup.stepper",c,e)}}function e(b){b.preventDefault(),b.stopPropagation();var c=b.data;h(c.timer),a("body").off(".stepper")}function f(a,b){var c=parseFloat(a.$input.val()),d=b;void 0===typeof c||isNaN(c)?d=a.min!==!1?a.min:0:a.min!==!1&&c<a.min?d=a.min:d+=c;var e=(d-a.min)%a.step;0!==e&&(d-=e),a.min!==!1&&d<a.min&&(d=a.min),a.max!==!1&&d>a.max&&(d-=a.step),d!==c&&(d=j(d,a.digits),a.$input.val(d).trigger("change"))}function g(a,b,c){return h(a),setInterval(c,b)}function h(a){a&&(clearInterval(a),a=null)}function i(a){var b=String(a);return b.indexOf(".")>-1?b.length-b.indexOf(".")-1:0}function j(a,b){var c=Math.pow(10,b);return Math.round(a*c)/c}var k={customClass:"",labels:{up:"Up",down:"Down"}},l={defaults:function(b){return k=a.extend(k,b||{}),a(this)},destroy:function(){return a(this).each(function(){var b=a(this).data("stepper");b&&(b.$stepper.off(".stepper").find(".stepper-arrow").remove(),b.$input.unwrap().removeClass("stepper-input"))})},disable:function(){return a(this).each(function(){var b=a(this).data("stepper");b&&(b.$input.attr("disabled","disabled"),b.$stepper.addClass("disabled"))})},enable:function(){return a(this).each(function(){var b=a(this).data("stepper");b&&(b.$input.attr("disabled",null),b.$stepper.removeClass("disabled"))})}};a.fn.stepper=function(a){return l[a]?l[a].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof a&&a?this:b.apply(this,arguments)},a.stepper=function(a){"defaults"===a&&l.defaults.apply(this,Array.prototype.slice.call(arguments,1))}}(jQuery,this);
}/*! Select2 4.0.1 | https://github.com/select2/select2/blob/master/LICENSE.md */!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){var b=function(){if(a&&a.fn&&a.fn.select2&&a.fn.select2.amd)var b=a.fn.select2.amd;var b;return function(){if(!b||!b.requirejs){b?c=b:b={};var a,c,d;!function(b){function e(a,b){return u.call(a,b)}function f(a,b){var c,d,e,f,g,h,i,j,k,l,m,n=b&&b.split("/"),o=s.map,p=o&&o["*"]||{};if(a&&"."===a.charAt(0))if(b){for(a=a.split("/"),g=a.length-1,s.nodeIdCompat&&w.test(a[g])&&(a[g]=a[g].replace(w,"")),a=n.slice(0,n.length-1).concat(a),k=0;k<a.length;k+=1)if(m=a[k],"."===m)a.splice(k,1),k-=1;else if(".."===m){if(1===k&&(".."===a[2]||".."===a[0]))break;k>0&&(a.splice(k-1,2),k-=2)}a=a.join("/")}else 0===a.indexOf("./")&&(a=a.substring(2));if((n||p)&&o){for(c=a.split("/"),k=c.length;k>0;k-=1){if(d=c.slice(0,k).join("/"),n)for(l=n.length;l>0;l-=1)if(e=o[n.slice(0,l).join("/")],e&&(e=e[d])){f=e,h=k;break}if(f)break;!i&&p&&p[d]&&(i=p[d],j=k)}!f&&i&&(f=i,h=j),f&&(c.splice(0,h,f),a=c.join("/"))}return a}function g(a,c){return function(){var d=v.call(arguments,0);return"string"!=typeof d[0]&&1===d.length&&d.push(null),n.apply(b,d.concat([a,c]))}}function h(a){return function(b){return f(b,a)}}function i(a){return function(b){q[a]=b}}function j(a){if(e(r,a)){var c=r[a];delete r[a],t[a]=!0,m.apply(b,c)}if(!e(q,a)&&!e(t,a))throw new Error("No "+a);return q[a]}function k(a){var b,c=a?a.indexOf("!"):-1;return c>-1&&(b=a.substring(0,c),a=a.substring(c+1,a.length)),[b,a]}function l(a){return function(){return s&&s.config&&s.config[a]||{}}}var m,n,o,p,q={},r={},s={},t={},u=Object.prototype.hasOwnProperty,v=[].slice,w=/\.js$/;o=function(a,b){var c,d=k(a),e=d[0];return a=d[1],e&&(e=f(e,b),c=j(e)),e?a=c&&c.normalize?c.normalize(a,h(b)):f(a,b):(a=f(a,b),d=k(a),e=d[0],a=d[1],e&&(c=j(e))),{f:e?e+"!"+a:a,n:a,pr:e,p:c}},p={require:function(a){return g(a)},exports:function(a){var b=q[a];return"undefined"!=typeof b?b:q[a]={}},module:function(a){return{id:a,uri:"",exports:q[a],config:l(a)}}},m=function(a,c,d,f){var h,k,l,m,n,s,u=[],v=typeof d;if(f=f||a,"undefined"===v||"function"===v){for(c=!c.length&&d.length?["require","exports","module"]:c,n=0;n<c.length;n+=1)if(m=o(c[n],f),k=m.f,"require"===k)u[n]=p.require(a);else if("exports"===k)u[n]=p.exports(a),s=!0;else if("module"===k)h=u[n]=p.module(a);else if(e(q,k)||e(r,k)||e(t,k))u[n]=j(k);else{if(!m.p)throw new Error(a+" missing "+k);m.p.load(m.n,g(f,!0),i(k),{}),u[n]=q[k]}l=d?d.apply(q[a],u):void 0,a&&(h&&h.exports!==b&&h.exports!==q[a]?q[a]=h.exports:l===b&&s||(q[a]=l))}else a&&(q[a]=d)},a=c=n=function(a,c,d,e,f){if("string"==typeof a)return p[a]?p[a](c):j(o(a,c).f);if(!a.splice){if(s=a,s.deps&&n(s.deps,s.callback),!c)return;c.splice?(a=c,c=d,d=null):a=b}return c=c||function(){},"function"==typeof d&&(d=e,e=f),e?m(b,a,c,d):setTimeout(function(){m(b,a,c,d)},4),n},n.config=function(a){return n(a)},a._defined=q,d=function(a,b,c){if("string"!=typeof a)throw new Error("See almond README: incorrect module build, no module name");b.splice||(c=b,b=[]),e(q,a)||e(r,a)||(r[a]=[a,b,c])},d.amd={jQuery:!0}}(),b.requirejs=a,b.require=c,b.define=d}}(),b.define("almond",function(){}),b.define("jquery",[],function(){var b=a||$;return null==b&&console&&console.error&&console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."),b}),b.define("select2/utils",["jquery"],function(a){function b(a){var b=a.prototype,c=[];for(var d in b){var e=b[d];"function"==typeof e&&"constructor"!==d&&c.push(d)}return c}var c={};c.Extend=function(a,b){function c(){this.constructor=a}var d={}.hasOwnProperty;for(var e in b)d.call(b,e)&&(a[e]=b[e]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},c.Decorate=function(a,c){function d(){var b=Array.prototype.unshift,d=c.prototype.constructor.length,e=a.prototype.constructor;d>0&&(b.call(arguments,a.prototype.constructor),e=c.prototype.constructor),e.apply(this,arguments)}function e(){this.constructor=d}var f=b(c),g=b(a);c.displayName=a.displayName,d.prototype=new e;for(var h=0;h<g.length;h++){var i=g[h];d.prototype[i]=a.prototype[i]}for(var j=(function(a){var b=function(){};a in d.prototype&&(b=d.prototype[a]);var e=c.prototype[a];return function(){var a=Array.prototype.unshift;return a.call(arguments,b),e.apply(this,arguments)}}),k=0;k<f.length;k++){var l=f[k];d.prototype[l]=j(l)}return d};var d=function(){this.listeners={}};return d.prototype.on=function(a,b){this.listeners=this.listeners||{},a in this.listeners?this.listeners[a].push(b):this.listeners[a]=[b]},d.prototype.trigger=function(a){var b=Array.prototype.slice;this.listeners=this.listeners||{},a in this.listeners&&this.invoke(this.listeners[a],b.call(arguments,1)),"*"in this.listeners&&this.invoke(this.listeners["*"],arguments)},d.prototype.invoke=function(a,b){for(var c=0,d=a.length;d>c;c++)a[c].apply(this,b)},c.Observable=d,c.generateChars=function(a){for(var b="",c=0;a>c;c++){var d=Math.floor(36*Math.random());b+=d.toString(36)}return b},c.bind=function(a,b){return function(){a.apply(b,arguments)}},c._convertData=function(a){for(var b in a){var c=b.split("-"),d=a;if(1!==c.length){for(var e=0;e<c.length;e++){var f=c[e];f=f.substring(0,1).toLowerCase()+f.substring(1),f in d||(d[f]={}),e==c.length-1&&(d[f]=a[b]),d=d[f]}delete a[b]}}return a},c.hasScroll=function(b,c){var d=a(c),e=c.style.overflowX,f=c.style.overflowY;return e!==f||"hidden"!==f&&"visible"!==f?"scroll"===e||"scroll"===f?!0:d.innerHeight()<c.scrollHeight||d.innerWidth()<c.scrollWidth:!1},c.escapeMarkup=function(a){var b={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return"string"!=typeof a?a:String(a).replace(/[&<>"'\/\\]/g,function(a){return b[a]})},c.appendMany=function(b,c){if("1.7"===a.fn.jquery.substr(0,3)){var d=a();a.map(c,function(a){d=d.add(a)}),c=d}b.append(c)},c}),b.define("select2/results",["jquery","./utils"],function(a,b){function c(a,b,d){this.$element=a,this.data=d,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<ul class="select2-results__options" role="tree"></ul>');return this.options.get("multiple")&&b.attr("aria-multiselectable","true"),this.$results=b,b},c.prototype.clear=function(){this.$results.empty()},c.prototype.displayMessage=function(b){var c=this.options.get("escapeMarkup");this.clear(),this.hideLoading();var d=a('<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'),e=this.options.get("translations").get(b.message);d.append(c(e(b.args))),d[0].className+=" select2-results__message",this.$results.append(d)},c.prototype.hideMessages=function(){this.$results.find(".select2-results__message").remove()},c.prototype.append=function(a){this.hideLoading();var b=[];if(null==a.results||0===a.results.length)return void(0===this.$results.children().length&&this.trigger("results:message",{message:"noResults"}));a.results=this.sort(a.results);for(var c=0;c<a.results.length;c++){var d=a.results[c],e=this.option(d);b.push(e)}this.$results.append(b)},c.prototype.position=function(a,b){var c=b.find(".select2-results");c.append(a)},c.prototype.sort=function(a){var b=this.options.get("sorter");return b(a)},c.prototype.setClasses=function(){var b=this;this.data.current(function(c){var d=a.map(c,function(a){return a.id.toString()}),e=b.$results.find(".select2-results__option[aria-selected]");e.each(function(){var b=a(this),c=a.data(this,"data"),e=""+c.id;null!=c.element&&c.element.selected||null==c.element&&a.inArray(e,d)>-1?b.attr("aria-selected","true"):b.attr("aria-selected","false")});var f=e.filter("[aria-selected=true]");f.length>0?f.first().trigger("mouseenter"):e.first().trigger("mouseenter")})},c.prototype.showLoading=function(a){this.hideLoading();var b=this.options.get("translations").get("searching"),c={disabled:!0,loading:!0,text:b(a)},d=this.option(c);d.className+=" loading-results",this.$results.prepend(d)},c.prototype.hideLoading=function(){this.$results.find(".loading-results").remove()},c.prototype.option=function(b){var c=document.createElement("li");c.className="select2-results__option";var d={role:"treeitem","aria-selected":"false"};b.disabled&&(delete d["aria-selected"],d["aria-disabled"]="true"),null==b.id&&delete d["aria-selected"],null!=b._resultId&&(c.id=b._resultId),b.title&&(c.title=b.title),b.children&&(d.role="group",d["aria-label"]=b.text,delete d["aria-selected"]);for(var e in d){var f=d[e];c.setAttribute(e,f)}if(b.children){var g=a(c),h=document.createElement("strong");h.className="select2-results__group";a(h);this.template(b,h);for(var i=[],j=0;j<b.children.length;j++){var k=b.children[j],l=this.option(k);i.push(l)}var m=a("<ul></ul>",{"class":"select2-results__options select2-results__options--nested"});m.append(i),g.append(h),g.append(m)}else this.template(b,c);return a.data(c,"data",b),c},c.prototype.bind=function(b,c){var d=this,e=b.id+"-results";this.$results.attr("id",e),b.on("results:all",function(a){d.clear(),d.append(a.data),b.isOpen()&&d.setClasses()}),b.on("results:append",function(a){d.append(a.data),b.isOpen()&&d.setClasses()}),b.on("query",function(a){d.hideMessages(),d.showLoading(a)}),b.on("select",function(){b.isOpen()&&d.setClasses()}),b.on("unselect",function(){b.isOpen()&&d.setClasses()}),b.on("open",function(){d.$results.attr("aria-expanded","true"),d.$results.attr("aria-hidden","false"),d.setClasses(),d.ensureHighlightVisible()}),b.on("close",function(){d.$results.attr("aria-expanded","false"),d.$results.attr("aria-hidden","true"),d.$results.removeAttr("aria-activedescendant")}),b.on("results:toggle",function(){var a=d.getHighlightedResults();0!==a.length&&a.trigger("mouseup")}),b.on("results:select",function(){var a=d.getHighlightedResults();if(0!==a.length){var b=a.data("data");"true"==a.attr("aria-selected")?d.trigger("close",{}):d.trigger("select",{data:b})}}),b.on("results:previous",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a);if(0!==c){var e=c-1;0===a.length&&(e=0);var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top,h=f.offset().top,i=d.$results.scrollTop()+(h-g);0===e?d.$results.scrollTop(0):0>h-g&&d.$results.scrollTop(i)}}),b.on("results:next",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a),e=c+1;if(!(e>=b.length)){var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top+d.$results.outerHeight(!1),h=f.offset().top+f.outerHeight(!1),i=d.$results.scrollTop()+h-g;0===e?d.$results.scrollTop(0):h>g&&d.$results.scrollTop(i)}}),b.on("results:focus",function(a){a.element.addClass("select2-results__option--highlighted")}),b.on("results:message",function(a){d.displayMessage(a)}),a.fn.mousewheel&&this.$results.on("mousewheel",function(a){var b=d.$results.scrollTop(),c=d.$results.get(0).scrollHeight-d.$results.scrollTop()+a.deltaY,e=a.deltaY>0&&b-a.deltaY<=0,f=a.deltaY<0&&c<=d.$results.height();e?(d.$results.scrollTop(0),a.preventDefault(),a.stopPropagation()):f&&(d.$results.scrollTop(d.$results.get(0).scrollHeight-d.$results.height()),a.preventDefault(),a.stopPropagation())}),this.$results.on("mouseup",".select2-results__option[aria-selected]",function(b){var c=a(this),e=c.data("data");return"true"===c.attr("aria-selected")?void(d.options.get("multiple")?d.trigger("unselect",{originalEvent:b,data:e}):d.trigger("close",{})):void d.trigger("select",{originalEvent:b,data:e})}),this.$results.on("mouseenter",".select2-results__option[aria-selected]",function(b){var c=a(this).data("data");d.getHighlightedResults().removeClass("select2-results__option--highlighted"),d.trigger("results:focus",{data:c,element:a(this)})})},c.prototype.getHighlightedResults=function(){var a=this.$results.find(".select2-results__option--highlighted");return a},c.prototype.destroy=function(){this.$results.remove()},c.prototype.ensureHighlightVisible=function(){var a=this.getHighlightedResults();if(0!==a.length){var b=this.$results.find("[aria-selected]"),c=b.index(a),d=this.$results.offset().top,e=a.offset().top,f=this.$results.scrollTop()+(e-d),g=e-d;f-=2*a.outerHeight(!1),2>=c?this.$results.scrollTop(0):(g>this.$results.outerHeight()||0>g)&&this.$results.scrollTop(f)}},c.prototype.template=function(b,c){var d=this.options.get("templateResult"),e=this.options.get("escapeMarkup"),f=d(b,c);null==f?c.style.display="none":"string"==typeof f?c.innerHTML=e(f):a(c).append(f)},c}),b.define("select2/keys",[],function(){var a={BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46};return a}),b.define("select2/selection/base",["jquery","../utils","../keys"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,b.Observable),d.prototype.render=function(){var b=a('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');return this._tabindex=0,null!=this.$element.data("old-tabindex")?this._tabindex=this.$element.data("old-tabindex"):null!=this.$element.attr("tabindex")&&(this._tabindex=this.$element.attr("tabindex")),b.attr("title",this.$element.attr("title")),b.attr("tabindex",this._tabindex),this.$selection=b,b},d.prototype.bind=function(a,b){var d=this,e=(a.id+"-container",a.id+"-results");this.container=a,this.$selection.on("focus",function(a){d.trigger("focus",a)}),this.$selection.on("blur",function(a){d._handleBlur(a)}),this.$selection.on("keydown",function(a){d.trigger("keypress",a),a.which===c.SPACE&&a.preventDefault()}),a.on("results:focus",function(a){d.$selection.attr("aria-activedescendant",a.data._resultId)}),a.on("selection:update",function(a){d.update(a.data)}),a.on("open",function(){d.$selection.attr("aria-expanded","true"),d.$selection.attr("aria-owns",e),d._attachCloseHandler(a)}),a.on("close",function(){d.$selection.attr("aria-expanded","false"),d.$selection.removeAttr("aria-activedescendant"),d.$selection.removeAttr("aria-owns"),d.$selection.focus(),d._detachCloseHandler(a)}),a.on("enable",function(){d.$selection.attr("tabindex",d._tabindex)}),a.on("disable",function(){d.$selection.attr("tabindex","-1")})},d.prototype._handleBlur=function(b){var c=this;window.setTimeout(function(){document.activeElement==c.$selection[0]||a.contains(c.$selection[0],document.activeElement)||c.trigger("blur",b)},1)},d.prototype._attachCloseHandler=function(b){a(document.body).on("mousedown.select2."+b.id,function(b){var c=a(b.target),d=c.closest(".select2"),e=a(".select2.select2-container--open");e.each(function(){var b=a(this);if(this!=d[0]){var c=b.data("element");c.select2("close")}})})},d.prototype._detachCloseHandler=function(b){a(document.body).off("mousedown.select2."+b.id)},d.prototype.position=function(a,b){var c=b.find(".selection");c.append(a)},d.prototype.destroy=function(){this._detachCloseHandler(this.container)},d.prototype.update=function(a){throw new Error("The `update` method must be defined in child classes.")},d}),b.define("select2/selection/single",["jquery","./base","../utils","../keys"],function(a,b,c,d){function e(){e.__super__.constructor.apply(this,arguments)}return c.Extend(e,b),e.prototype.render=function(){var a=e.__super__.render.call(this);return a.addClass("select2-selection--single"),a.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'),a},e.prototype.bind=function(a,b){var c=this;e.__super__.bind.apply(this,arguments);var d=a.id+"-container";this.$selection.find(".select2-selection__rendered").attr("id",d),this.$selection.attr("aria-labelledby",d),this.$selection.on("mousedown",function(a){1===a.which&&c.trigger("toggle",{originalEvent:a})}),this.$selection.on("focus",function(a){}),this.$selection.on("blur",function(a){}),a.on("selection:update",function(a){c.update(a.data)})},e.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},e.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},e.prototype.selectionContainer=function(){return a("<span></span>")},e.prototype.update=function(a){if(0===a.length)return void this.clear();var b=a[0],c=this.$selection.find(".select2-selection__rendered"),d=this.display(b,c);c.empty().append(d),c.prop("title",b.title||b.text)},e}),b.define("select2/selection/multiple",["jquery","./base","../utils"],function(a,b,c){function d(a,b){d.__super__.constructor.apply(this,arguments)}return c.Extend(d,b),d.prototype.render=function(){var a=d.__super__.render.call(this);return a.addClass("select2-selection--multiple"),a.html('<ul class="select2-selection__rendered"></ul>'),a},d.prototype.bind=function(b,c){var e=this;d.__super__.bind.apply(this,arguments),this.$selection.on("click",function(a){e.trigger("toggle",{originalEvent:a})}),this.$selection.on("click",".select2-selection__choice__remove",function(b){if(!e.options.get("disabled")){var c=a(this),d=c.parent(),f=d.data("data");e.trigger("unselect",{originalEvent:b,data:f})}})},d.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},d.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},d.prototype.selectionContainer=function(){var b=a('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>');return b},d.prototype.update=function(a){if(this.clear(),0!==a.length){for(var b=[],d=0;d<a.length;d++){var e=a[d],f=this.selectionContainer(),g=this.display(e,f);f.append(g),f.prop("title",e.title||e.text),f.data("data",e),b.push(f)}var h=this.$selection.find(".select2-selection__rendered");c.appendMany(h,b)}},d}),b.define("select2/selection/placeholder",["../utils"],function(a){function b(a,b,c){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c)}return b.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},b.prototype.createPlaceholder=function(a,b){var c=this.selectionContainer();return c.html(this.display(b)),c.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"),c},b.prototype.update=function(a,b){var c=1==b.length&&b[0].id!=this.placeholder.id,d=b.length>1;if(d||c)return a.call(this,b);this.clear();var e=this.createPlaceholder(this.placeholder);this.$selection.find(".select2-selection__rendered").append(e)},b}),b.define("select2/selection/allowClear",["jquery","../keys"],function(a,b){function c(){}return c.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),null==this.placeholder&&this.options.get("debug")&&window.console&&console.error&&console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."),this.$selection.on("mousedown",".select2-selection__clear",function(a){d._handleClear(a)}),b.on("keypress",function(a){d._handleKeyboardClear(a,b)})},c.prototype._handleClear=function(a,b){if(!this.options.get("disabled")){var c=this.$selection.find(".select2-selection__clear");if(0!==c.length){b.stopPropagation();for(var d=c.data("data"),e=0;e<d.length;e++){var f={data:d[e]};if(this.trigger("unselect",f),f.prevented)return}this.$element.val(this.placeholder.id).trigger("change"),this.trigger("toggle",{})}}},c.prototype._handleKeyboardClear=function(a,c,d){d.isOpen()||(c.which==b.DELETE||c.which==b.BACKSPACE)&&this._handleClear(c)},c.prototype.update=function(b,c){if(b.call(this,c),!(this.$selection.find(".select2-selection__placeholder").length>0||0===c.length)){var d=a('<span class="select2-selection__clear">&times;</span>');d.data("data",c),this.$selection.find(".select2-selection__rendered").prepend(d)}},c}),b.define("select2/selection/search",["jquery","../utils","../keys"],function(a,b,c){function d(a,b,c){a.call(this,b,c)}return d.prototype.render=function(b){var c=a('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>');this.$searchContainer=c,this.$search=c.find("input");var d=b.call(this);return this._transferTabIndex(),d},d.prototype.bind=function(a,b,d){var e=this;a.call(this,b,d),b.on("open",function(){e.$search.trigger("focus")}),b.on("close",function(){e.$search.val(""),e.$search.removeAttr("aria-activedescendant"),e.$search.trigger("focus")}),b.on("enable",function(){e.$search.prop("disabled",!1),e._transferTabIndex()}),b.on("disable",function(){e.$search.prop("disabled",!0)}),b.on("focus",function(a){e.$search.trigger("focus")}),b.on("results:focus",function(a){e.$search.attr("aria-activedescendant",a.id)}),this.$selection.on("focusin",".select2-search--inline",function(a){e.trigger("focus",a)}),this.$selection.on("focusout",".select2-search--inline",function(a){e._handleBlur(a)}),this.$selection.on("keydown",".select2-search--inline",function(a){a.stopPropagation(),e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented();var b=a.which;if(b===c.BACKSPACE&&""===e.$search.val()){var d=e.$searchContainer.prev(".select2-selection__choice");if(d.length>0){var f=d.data("data");e.searchRemoveChoice(f),a.preventDefault()}}});var f=document.documentMode,g=f&&11>=f;this.$selection.on("input.searchcheck",".select2-search--inline",function(a){return g?void e.$selection.off("input.search input.searchcheck"):void e.$selection.off("keyup.search")}),this.$selection.on("keyup.search input.search",".select2-search--inline",function(a){if(g&&"input"===a.type)return void e.$selection.off("input.search input.searchcheck");var b=a.which;b!=c.SHIFT&&b!=c.CTRL&&b!=c.ALT&&b!=c.TAB&&e.handleSearch(a)})},d.prototype._transferTabIndex=function(a){this.$search.attr("tabindex",this.$selection.attr("tabindex")),this.$selection.attr("tabindex","-1")},d.prototype.createPlaceholder=function(a,b){this.$search.attr("placeholder",b.text)},d.prototype.update=function(a,b){var c=this.$search[0]==document.activeElement;this.$search.attr("placeholder",""),a.call(this,b),this.$selection.find(".select2-selection__rendered").append(this.$searchContainer),this.resizeSearch(),c&&this.$search.focus()},d.prototype.handleSearch=function(){if(this.resizeSearch(),!this._keyUpPrevented){var a=this.$search.val();this.trigger("query",{term:a})}this._keyUpPrevented=!1},d.prototype.searchRemoveChoice=function(a,b){this.trigger("unselect",{data:b}),this.$search.val(b.text),this.handleSearch()},d.prototype.resizeSearch=function(){this.$search.css("width","25px");var a="";if(""!==this.$search.attr("placeholder"))a=this.$selection.find(".select2-selection__rendered").innerWidth();else{var b=this.$search.val().length+1;a=.75*b+"em"}this.$search.css("width",a)},d}),b.define("select2/selection/eventRelay",["jquery"],function(a){function b(){}return b.prototype.bind=function(b,c,d){var e=this,f=["open","opening","close","closing","select","selecting","unselect","unselecting"],g=["opening","closing","selecting","unselecting"];b.call(this,c,d),c.on("*",function(b,c){if(-1!==a.inArray(b,f)){c=c||{};var d=a.Event("select2:"+b,{params:c});e.$element.trigger(d),-1!==a.inArray(b,g)&&(c.prevented=d.isDefaultPrevented())}})},b}),b.define("select2/translation",["jquery","require"],function(a,b){function c(a){this.dict=a||{}}return c.prototype.all=function(){return this.dict},c.prototype.get=function(a){return this.dict[a]},c.prototype.extend=function(b){this.dict=a.extend({},b.all(),this.dict)},c._cache={},c.loadPath=function(a){if(!(a in c._cache)){var d=b(a);c._cache[a]=d}return new c(c._cache[a])},c}),b.define("select2/diacritics",[],function(){var a={"Ⓐ":"A","Ａ":"A","À":"A","Á":"A","Â":"A","Ầ":"A","Ấ":"A","Ẫ":"A","Ẩ":"A","Ã":"A","Ā":"A","Ă":"A","Ằ":"A","Ắ":"A","Ẵ":"A","Ẳ":"A","Ȧ":"A","Ǡ":"A","Ä":"A","Ǟ":"A","Ả":"A","Å":"A","Ǻ":"A","Ǎ":"A","Ȁ":"A","Ȃ":"A","Ạ":"A","Ậ":"A","Ặ":"A","Ḁ":"A","Ą":"A","Ⱥ":"A","Ɐ":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ⓑ":"B","Ｂ":"B","Ḃ":"B","Ḅ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ɓ":"B","Ⓒ":"C","Ｃ":"C","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","Ç":"C","Ḉ":"C","Ƈ":"C","Ȼ":"C","Ꜿ":"C","Ⓓ":"D","Ｄ":"D","Ḋ":"D","Ď":"D","Ḍ":"D","Ḑ":"D","Ḓ":"D","Ḏ":"D","Đ":"D","Ƌ":"D","Ɗ":"D","Ɖ":"D","Ꝺ":"D","Ǳ":"DZ","Ǆ":"DZ","ǲ":"Dz","ǅ":"Dz","Ⓔ":"E","Ｅ":"E","È":"E","É":"E","Ê":"E","Ề":"E","Ế":"E","Ễ":"E","Ể":"E","Ẽ":"E","Ē":"E","Ḕ":"E","Ḗ":"E","Ĕ":"E","Ė":"E","Ë":"E","Ẻ":"E","Ě":"E","Ȅ":"E","Ȇ":"E","Ẹ":"E","Ệ":"E","Ȩ":"E","Ḝ":"E","Ę":"E","Ḙ":"E","Ḛ":"E","Ɛ":"E","Ǝ":"E","Ⓕ":"F","Ｆ":"F","Ḟ":"F","Ƒ":"F","Ꝼ":"F","Ⓖ":"G","Ｇ":"G","Ǵ":"G","Ĝ":"G","Ḡ":"G","Ğ":"G","Ġ":"G","Ǧ":"G","Ģ":"G","Ǥ":"G","Ɠ":"G","Ꞡ":"G","Ᵹ":"G","Ꝿ":"G","Ⓗ":"H","Ｈ":"H","Ĥ":"H","Ḣ":"H","Ḧ":"H","Ȟ":"H","Ḥ":"H","Ḩ":"H","Ḫ":"H","Ħ":"H","Ⱨ":"H","Ⱶ":"H","Ɥ":"H","Ⓘ":"I","Ｉ":"I","Ì":"I","Í":"I","Î":"I","Ĩ":"I","Ī":"I","Ĭ":"I","İ":"I","Ï":"I","Ḯ":"I","Ỉ":"I","Ǐ":"I","Ȉ":"I","Ȋ":"I","Ị":"I","Į":"I","Ḭ":"I","Ɨ":"I","Ⓙ":"J","Ｊ":"J","Ĵ":"J","Ɉ":"J","Ⓚ":"K","Ｋ":"K","Ḱ":"K","Ǩ":"K","Ḳ":"K","Ķ":"K","Ḵ":"K","Ƙ":"K","Ⱪ":"K","Ꝁ":"K","Ꝃ":"K","Ꝅ":"K","Ꞣ":"K","Ⓛ":"L","Ｌ":"L","Ŀ":"L","Ĺ":"L","Ľ":"L","Ḷ":"L","Ḹ":"L","Ļ":"L","Ḽ":"L","Ḻ":"L","Ł":"L","Ƚ":"L","Ɫ":"L","Ⱡ":"L","Ꝉ":"L","Ꝇ":"L","Ꞁ":"L","Ǉ":"LJ","ǈ":"Lj","Ⓜ":"M","Ｍ":"M","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ɯ":"M","Ⓝ":"N","Ｎ":"N","Ǹ":"N","Ń":"N","Ñ":"N","Ṅ":"N","Ň":"N","Ṇ":"N","Ņ":"N","Ṋ":"N","Ṉ":"N","Ƞ":"N","Ɲ":"N","Ꞑ":"N","Ꞥ":"N","Ǌ":"NJ","ǋ":"Nj","Ⓞ":"O","Ｏ":"O","Ò":"O","Ó":"O","Ô":"O","Ồ":"O","Ố":"O","Ỗ":"O","Ổ":"O","Õ":"O","Ṍ":"O","Ȭ":"O","Ṏ":"O","Ō":"O","Ṑ":"O","Ṓ":"O","Ŏ":"O","Ȯ":"O","Ȱ":"O","Ö":"O","Ȫ":"O","Ỏ":"O","Ő":"O","Ǒ":"O","Ȍ":"O","Ȏ":"O","Ơ":"O","Ờ":"O","Ớ":"O","Ỡ":"O","Ở":"O","Ợ":"O","Ọ":"O","Ộ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Ɔ":"O","Ɵ":"O","Ꝋ":"O","Ꝍ":"O","Ƣ":"OI","Ꝏ":"OO","Ȣ":"OU","Ⓟ":"P","Ｐ":"P","Ṕ":"P","Ṗ":"P","Ƥ":"P","Ᵽ":"P","Ꝑ":"P","Ꝓ":"P","Ꝕ":"P","Ⓠ":"Q","Ｑ":"Q","Ꝗ":"Q","Ꝙ":"Q","Ɋ":"Q","Ⓡ":"R","Ｒ":"R","Ŕ":"R","Ṙ":"R","Ř":"R","Ȑ":"R","Ȓ":"R","Ṛ":"R","Ṝ":"R","Ŗ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꝛ":"R","Ꞧ":"R","Ꞃ":"R","Ⓢ":"S","Ｓ":"S","ẞ":"S","Ś":"S","Ṥ":"S","Ŝ":"S","Ṡ":"S","Š":"S","Ṧ":"S","Ṣ":"S","Ṩ":"S","Ș":"S","Ş":"S","Ȿ":"S","Ꞩ":"S","Ꞅ":"S","Ⓣ":"T","Ｔ":"T","Ṫ":"T","Ť":"T","Ṭ":"T","Ț":"T","Ţ":"T","Ṱ":"T","Ṯ":"T","Ŧ":"T","Ƭ":"T","Ʈ":"T","Ⱦ":"T","Ꞇ":"T","Ꜩ":"TZ","Ⓤ":"U","Ｕ":"U","Ù":"U","Ú":"U","Û":"U","Ũ":"U","Ṹ":"U","Ū":"U","Ṻ":"U","Ŭ":"U","Ü":"U","Ǜ":"U","Ǘ":"U","Ǖ":"U","Ǚ":"U","Ủ":"U","Ů":"U","Ű":"U","Ǔ":"U","Ȕ":"U","Ȗ":"U","Ư":"U","Ừ":"U","Ứ":"U","Ữ":"U","Ử":"U","Ự":"U","Ụ":"U","Ṳ":"U","Ų":"U","Ṷ":"U","Ṵ":"U","Ʉ":"U","Ⓥ":"V","Ｖ":"V","Ṽ":"V","Ṿ":"V","Ʋ":"V","Ꝟ":"V","Ʌ":"V","Ꝡ":"VY","Ⓦ":"W","Ｗ":"W","Ẁ":"W","Ẃ":"W","Ŵ":"W","Ẇ":"W","Ẅ":"W","Ẉ":"W","Ⱳ":"W","Ⓧ":"X","Ｘ":"X","Ẋ":"X","Ẍ":"X","Ⓨ":"Y","Ｙ":"Y","Ỳ":"Y","Ý":"Y","Ŷ":"Y","Ỹ":"Y","Ȳ":"Y","Ẏ":"Y","Ÿ":"Y","Ỷ":"Y","Ỵ":"Y","Ƴ":"Y","Ɏ":"Y","Ỿ":"Y","Ⓩ":"Z","Ｚ":"Z","Ź":"Z","Ẑ":"Z","Ż":"Z","Ž":"Z","Ẓ":"Z","Ẕ":"Z","Ƶ":"Z","Ȥ":"Z","Ɀ":"Z","Ⱬ":"Z","Ꝣ":"Z","ⓐ":"a","ａ":"a","ẚ":"a","à":"a","á":"a","â":"a","ầ":"a","ấ":"a","ẫ":"a","ẩ":"a","ã":"a","ā":"a","ă":"a","ằ":"a","ắ":"a","ẵ":"a","ẳ":"a","ȧ":"a","ǡ":"a","ä":"a","ǟ":"a","ả":"a","å":"a","ǻ":"a","ǎ":"a","ȁ":"a","ȃ":"a","ạ":"a","ậ":"a","ặ":"a","ḁ":"a","ą":"a","ⱥ":"a","ɐ":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ⓑ":"b","ｂ":"b","ḃ":"b","ḅ":"b","ḇ":"b","ƀ":"b","ƃ":"b","ɓ":"b","ⓒ":"c","ｃ":"c","ć":"c","ĉ":"c","ċ":"c","č":"c","ç":"c","ḉ":"c","ƈ":"c","ȼ":"c","ꜿ":"c","ↄ":"c","ⓓ":"d","ｄ":"d","ḋ":"d","ď":"d","ḍ":"d","ḑ":"d","ḓ":"d","ḏ":"d","đ":"d","ƌ":"d","ɖ":"d","ɗ":"d","ꝺ":"d","ǳ":"dz","ǆ":"dz","ⓔ":"e","ｅ":"e","è":"e","é":"e","ê":"e","ề":"e","ế":"e","ễ":"e","ể":"e","ẽ":"e","ē":"e","ḕ":"e","ḗ":"e","ĕ":"e","ė":"e","ë":"e","ẻ":"e","ě":"e","ȅ":"e","ȇ":"e","ẹ":"e","ệ":"e","ȩ":"e","ḝ":"e","ę":"e","ḙ":"e","ḛ":"e","ɇ":"e","ɛ":"e","ǝ":"e","ⓕ":"f","ｆ":"f","ḟ":"f","ƒ":"f","ꝼ":"f","ⓖ":"g","ｇ":"g","ǵ":"g","ĝ":"g","ḡ":"g","ğ":"g","ġ":"g","ǧ":"g","ģ":"g","ǥ":"g","ɠ":"g","ꞡ":"g","ᵹ":"g","ꝿ":"g","ⓗ":"h","ｈ":"h","ĥ":"h","ḣ":"h","ḧ":"h","ȟ":"h","ḥ":"h","ḩ":"h","ḫ":"h","ẖ":"h","ħ":"h","ⱨ":"h","ⱶ":"h","ɥ":"h","ƕ":"hv","ⓘ":"i","ｉ":"i","ì":"i","í":"i","î":"i","ĩ":"i","ī":"i","ĭ":"i","ï":"i","ḯ":"i","ỉ":"i","ǐ":"i","ȉ":"i","ȋ":"i","ị":"i","į":"i","ḭ":"i","ɨ":"i","ı":"i","ⓙ":"j","ｊ":"j","ĵ":"j","ǰ":"j","ɉ":"j","ⓚ":"k","ｋ":"k","ḱ":"k","ǩ":"k","ḳ":"k","ķ":"k","ḵ":"k","ƙ":"k","ⱪ":"k","ꝁ":"k","ꝃ":"k","ꝅ":"k","ꞣ":"k","ⓛ":"l","ｌ":"l","ŀ":"l","ĺ":"l","ľ":"l","ḷ":"l","ḹ":"l","ļ":"l","ḽ":"l","ḻ":"l","ſ":"l","ł":"l","ƚ":"l","ɫ":"l","ⱡ":"l","ꝉ":"l","ꞁ":"l","ꝇ":"l","ǉ":"lj","ⓜ":"m","ｍ":"m","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ɯ":"m","ⓝ":"n","ｎ":"n","ǹ":"n","ń":"n","ñ":"n","ṅ":"n","ň":"n","ṇ":"n","ņ":"n","ṋ":"n","ṉ":"n","ƞ":"n","ɲ":"n","ŉ":"n","ꞑ":"n","ꞥ":"n","ǌ":"nj","ⓞ":"o","ｏ":"o","ò":"o","ó":"o","ô":"o","ồ":"o","ố":"o","ỗ":"o","ổ":"o","õ":"o","ṍ":"o","ȭ":"o","ṏ":"o","ō":"o","ṑ":"o","ṓ":"o","ŏ":"o","ȯ":"o","ȱ":"o","ö":"o","ȫ":"o","ỏ":"o","ő":"o","ǒ":"o","ȍ":"o","ȏ":"o","ơ":"o","ờ":"o","ớ":"o","ỡ":"o","ở":"o","ợ":"o","ọ":"o","ộ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","ɔ":"o","ꝋ":"o","ꝍ":"o","ɵ":"o","ƣ":"oi","ȣ":"ou","ꝏ":"oo","ⓟ":"p","ｐ":"p","ṕ":"p","ṗ":"p","ƥ":"p","ᵽ":"p","ꝑ":"p","ꝓ":"p","ꝕ":"p","ⓠ":"q","ｑ":"q","ɋ":"q","ꝗ":"q","ꝙ":"q","ⓡ":"r","ｒ":"r","ŕ":"r","ṙ":"r","ř":"r","ȑ":"r","ȓ":"r","ṛ":"r","ṝ":"r","ŗ":"r","ṟ":"r","ɍ":"r","ɽ":"r","ꝛ":"r","ꞧ":"r","ꞃ":"r","ⓢ":"s","ｓ":"s","ß":"s","ś":"s","ṥ":"s","ŝ":"s","ṡ":"s","š":"s","ṧ":"s","ṣ":"s","ṩ":"s","ș":"s","ş":"s","ȿ":"s","ꞩ":"s","ꞅ":"s","ẛ":"s","ⓣ":"t","ｔ":"t","ṫ":"t","ẗ":"t","ť":"t","ṭ":"t","ț":"t","ţ":"t","ṱ":"t","ṯ":"t","ŧ":"t","ƭ":"t","ʈ":"t","ⱦ":"t","ꞇ":"t","ꜩ":"tz","ⓤ":"u","ｕ":"u","ù":"u","ú":"u","û":"u","ũ":"u","ṹ":"u","ū":"u","ṻ":"u","ŭ":"u","ü":"u","ǜ":"u","ǘ":"u","ǖ":"u","ǚ":"u","ủ":"u","ů":"u","ű":"u","ǔ":"u","ȕ":"u","ȗ":"u","ư":"u","ừ":"u","ứ":"u","ữ":"u","ử":"u","ự":"u","ụ":"u","ṳ":"u","ų":"u","ṷ":"u","ṵ":"u","ʉ":"u","ⓥ":"v","ｖ":"v","ṽ":"v","ṿ":"v","ʋ":"v","ꝟ":"v","ʌ":"v","ꝡ":"vy","ⓦ":"w","ｗ":"w","ẁ":"w","ẃ":"w","ŵ":"w","ẇ":"w","ẅ":"w","ẘ":"w","ẉ":"w","ⱳ":"w","ⓧ":"x","ｘ":"x","ẋ":"x","ẍ":"x","ⓨ":"y","ｙ":"y","ỳ":"y","ý":"y","ŷ":"y","ỹ":"y","ȳ":"y","ẏ":"y","ÿ":"y","ỷ":"y","ẙ":"y","ỵ":"y","ƴ":"y","ɏ":"y","ỿ":"y","ⓩ":"z","ｚ":"z","ź":"z","ẑ":"z","ż":"z","ž":"z","ẓ":"z","ẕ":"z","ƶ":"z","ȥ":"z","ɀ":"z","ⱬ":"z","ꝣ":"z","Ά":"Α","Έ":"Ε","Ή":"Η","Ί":"Ι","Ϊ":"Ι","Ό":"Ο","Ύ":"Υ","Ϋ":"Υ","Ώ":"Ω","ά":"α","έ":"ε","ή":"η","ί":"ι","ϊ":"ι","ΐ":"ι","ό":"ο","ύ":"υ","ϋ":"υ","ΰ":"υ","ω":"ω","ς":"σ"};return a}),b.define("select2/data/base",["../utils"],function(a){function b(a,c){b.__super__.constructor.call(this)}return a.Extend(b,a.Observable),b.prototype.current=function(a){throw new Error("The `current` method must be defined in child classes.")},b.prototype.query=function(a,b){throw new Error("The `query` method must be defined in child classes.")},b.prototype.bind=function(a,b){},b.prototype.destroy=function(){},b.prototype.generateResultId=function(b,c){var d=b.id+"-result-";return d+=a.generateChars(4),d+=null!=c.id?"-"+c.id.toString():"-"+a.generateChars(4)},b}),b.define("select2/data/select",["./base","../utils","jquery"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,a),d.prototype.current=function(a){var b=[],d=this;this.$element.find(":selected").each(function(){var a=c(this),e=d.item(a);b.push(e)}),a(b)},d.prototype.select=function(a){var b=this;if(a.selected=!0,c(a.element).is("option"))return a.element.selected=!0,void this.$element.trigger("change");if(this.$element.prop("multiple"))this.current(function(d){var e=[];a=[a],a.push.apply(a,d);for(var f=0;f<a.length;f++){var g=a[f].id;-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")});else{var d=a.id;this.$element.val(d),this.$element.trigger("change")}},d.prototype.unselect=function(a){
var b=this;if(this.$element.prop("multiple"))return a.selected=!1,c(a.element).is("option")?(a.element.selected=!1,void this.$element.trigger("change")):void this.current(function(d){for(var e=[],f=0;f<d.length;f++){var g=d[f].id;g!==a.id&&-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")})},d.prototype.bind=function(a,b){var c=this;this.container=a,a.on("select",function(a){c.select(a.data)}),a.on("unselect",function(a){c.unselect(a.data)})},d.prototype.destroy=function(){this.$element.find("*").each(function(){c.removeData(this,"data")})},d.prototype.query=function(a,b){var d=[],e=this,f=this.$element.children();f.each(function(){var b=c(this);if(b.is("option")||b.is("optgroup")){var f=e.item(b),g=e.matches(a,f);null!==g&&d.push(g)}}),b({results:d})},d.prototype.addOptions=function(a){b.appendMany(this.$element,a)},d.prototype.option=function(a){var b;a.children?(b=document.createElement("optgroup"),b.label=a.text):(b=document.createElement("option"),void 0!==b.textContent?b.textContent=a.text:b.innerText=a.text),a.id&&(b.value=a.id),a.disabled&&(b.disabled=!0),a.selected&&(b.selected=!0),a.title&&(b.title=a.title);var d=c(b),e=this._normalizeItem(a);return e.element=b,c.data(b,"data",e),d},d.prototype.item=function(a){var b={};if(b=c.data(a[0],"data"),null!=b)return b;if(a.is("option"))b={id:a.val(),text:a.text(),disabled:a.prop("disabled"),selected:a.prop("selected"),title:a.prop("title")};else if(a.is("optgroup")){b={text:a.prop("label"),children:[],title:a.prop("title")};for(var d=a.children("option"),e=[],f=0;f<d.length;f++){var g=c(d[f]),h=this.item(g);e.push(h)}b.children=e}return b=this._normalizeItem(b),b.element=a[0],c.data(a[0],"data",b),b},d.prototype._normalizeItem=function(a){c.isPlainObject(a)||(a={id:a,text:a}),a=c.extend({},{text:""},a);var b={selected:!1,disabled:!1};return null!=a.id&&(a.id=a.id.toString()),null!=a.text&&(a.text=a.text.toString()),null==a._resultId&&a.id&&null!=this.container&&(a._resultId=this.generateResultId(this.container,a)),c.extend({},b,a)},d.prototype.matches=function(a,b){var c=this.options.get("matcher");return c(a,b)},d}),b.define("select2/data/array",["./select","../utils","jquery"],function(a,b,c){function d(a,b){var c=b.get("data")||[];d.__super__.constructor.call(this,a,b),this.addOptions(this.convertToOptions(c))}return b.Extend(d,a),d.prototype.select=function(a){var b=this.$element.find("option").filter(function(b,c){return c.value==a.id.toString()});0===b.length&&(b=this.option(a),this.addOptions(b)),d.__super__.select.call(this,a)},d.prototype.convertToOptions=function(a){function d(a){return function(){return c(this).val()==a.id}}for(var e=this,f=this.$element.find("option"),g=f.map(function(){return e.item(c(this)).id}).get(),h=[],i=0;i<a.length;i++){var j=this._normalizeItem(a[i]);if(c.inArray(j.id,g)>=0){var k=f.filter(d(j)),l=this.item(k),m=c.extend(!0,{},l,j),n=this.option(m);k.replaceWith(n)}else{var o=this.option(j);if(j.children){var p=this.convertToOptions(j.children);b.appendMany(o,p)}h.push(o)}}return h},d}),b.define("select2/data/ajax",["./array","../utils","jquery"],function(a,b,c){function d(a,b){this.ajaxOptions=this._applyDefaults(b.get("ajax")),null!=this.ajaxOptions.processResults&&(this.processResults=this.ajaxOptions.processResults),d.__super__.constructor.call(this,a,b)}return b.Extend(d,a),d.prototype._applyDefaults=function(a){var b={data:function(a){return c.extend({},a,{q:a.term})},transport:function(a,b,d){var e=c.ajax(a);return e.then(b),e.fail(d),e}};return c.extend({},b,a,!0)},d.prototype.processResults=function(a){return a},d.prototype.query=function(a,b){function d(){var d=f.transport(f,function(d){var f=e.processResults(d,a);e.options.get("debug")&&window.console&&console.error&&(f&&f.results&&c.isArray(f.results)||console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")),b(f)},function(){});e._request=d}var e=this;null!=this._request&&(c.isFunction(this._request.abort)&&this._request.abort(),this._request=null);var f=c.extend({type:"GET"},this.ajaxOptions);"function"==typeof f.url&&(f.url=f.url.call(this.$element,a)),"function"==typeof f.data&&(f.data=f.data.call(this.$element,a)),this.ajaxOptions.delay&&""!==a.term?(this._queryTimeout&&window.clearTimeout(this._queryTimeout),this._queryTimeout=window.setTimeout(d,this.ajaxOptions.delay)):d()},d}),b.define("select2/data/tags",["jquery"],function(a){function b(b,c,d){var e=d.get("tags"),f=d.get("createTag");if(void 0!==f&&(this.createTag=f),b.call(this,c,d),a.isArray(e))for(var g=0;g<e.length;g++){var h=e[g],i=this._normalizeItem(h),j=this.option(i);this.$element.append(j)}}return b.prototype.query=function(a,b,c){function d(a,f){for(var g=a.results,h=0;h<g.length;h++){var i=g[h],j=null!=i.children&&!d({results:i.children},!0),k=i.text===b.term;if(k||j)return f?!1:(a.data=g,void c(a))}if(f)return!0;var l=e.createTag(b);if(null!=l){var m=e.option(l);m.attr("data-select2-tag",!0),e.addOptions([m]),e.insertTag(g,l)}a.results=g,c(a)}var e=this;return this._removeOldTags(),null==b.term||null!=b.page?void a.call(this,b,c):void a.call(this,b,d)},b.prototype.createTag=function(b,c){var d=a.trim(c.term);return""===d?null:{id:d,text:d}},b.prototype.insertTag=function(a,b,c){b.unshift(c)},b.prototype._removeOldTags=function(b){var c=(this._lastTag,this.$element.find("option[data-select2-tag]"));c.each(function(){this.selected||a(this).remove()})},b}),b.define("select2/data/tokenizer",["jquery"],function(a){function b(a,b,c){var d=c.get("tokenizer");void 0!==d&&(this.tokenizer=d),a.call(this,b,c)}return b.prototype.bind=function(a,b,c){a.call(this,b,c),this.$search=b.dropdown.$search||b.selection.$search||c.find(".select2-search__field")},b.prototype.query=function(a,b,c){function d(a){e.trigger("select",{data:a})}var e=this;b.term=b.term||"";var f=this.tokenizer(b,this.options,d);f.term!==b.term&&(this.$search.length&&(this.$search.val(f.term),this.$search.focus()),b.term=f.term),a.call(this,b,c)},b.prototype.tokenizer=function(b,c,d,e){for(var f=d.get("tokenSeparators")||[],g=c.term,h=0,i=this.createTag||function(a){return{id:a.term,text:a.term}};h<g.length;){var j=g[h];if(-1!==a.inArray(j,f)){var k=g.substr(0,h),l=a.extend({},c,{term:k}),m=i(l);null!=m?(e(m),g=g.substr(h+1)||"",h=0):h++}else h++}return{term:g}},b}),b.define("select2/data/minimumInputLength",[],function(){function a(a,b,c){this.minimumInputLength=c.get("minimumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",b.term.length<this.minimumInputLength?void this.trigger("results:message",{message:"inputTooShort",args:{minimum:this.minimumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumInputLength",[],function(){function a(a,b,c){this.maximumInputLength=c.get("maximumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",this.maximumInputLength>0&&b.term.length>this.maximumInputLength?void this.trigger("results:message",{message:"inputTooLong",args:{maximum:this.maximumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumSelectionLength",[],function(){function a(a,b,c){this.maximumSelectionLength=c.get("maximumSelectionLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){var d=this;this.current(function(e){var f=null!=e?e.length:0;return d.maximumSelectionLength>0&&f>=d.maximumSelectionLength?void d.trigger("results:message",{message:"maximumSelected",args:{maximum:d.maximumSelectionLength}}):void a.call(d,b,c)})},a}),b.define("select2/dropdown",["jquery","./utils"],function(a,b){function c(a,b){this.$element=a,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<span class="select2-dropdown"><span class="select2-results"></span></span>');return b.attr("dir",this.options.get("dir")),this.$dropdown=b,b},c.prototype.bind=function(){},c.prototype.position=function(a,b){},c.prototype.destroy=function(){this.$dropdown.remove()},c}),b.define("select2/dropdown/search",["jquery","../utils"],function(a,b){function c(){}return c.prototype.render=function(b){var c=b.call(this),d=a('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" /></span>');return this.$searchContainer=d,this.$search=d.find("input"),c.prepend(d),c},c.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),this.$search.on("keydown",function(a){e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented()}),this.$search.on("input",function(b){a(this).off("keyup")}),this.$search.on("keyup input",function(a){e.handleSearch(a)}),c.on("open",function(){e.$search.attr("tabindex",0),e.$search.focus(),window.setTimeout(function(){e.$search.focus()},0)}),c.on("close",function(){e.$search.attr("tabindex",-1),e.$search.val("")}),c.on("results:all",function(a){if(null==a.query.term||""===a.query.term){var b=e.showSearch(a);b?e.$searchContainer.removeClass("select2-search--hide"):e.$searchContainer.addClass("select2-search--hide")}})},c.prototype.handleSearch=function(a){if(!this._keyUpPrevented){var b=this.$search.val();this.trigger("query",{term:b})}this._keyUpPrevented=!1},c.prototype.showSearch=function(a,b){return!0},c}),b.define("select2/dropdown/hidePlaceholder",[],function(){function a(a,b,c,d){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c,d)}return a.prototype.append=function(a,b){b.results=this.removePlaceholder(b.results),a.call(this,b)},a.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},a.prototype.removePlaceholder=function(a,b){for(var c=b.slice(0),d=b.length-1;d>=0;d--){var e=b[d];this.placeholder.id===e.id&&c.splice(d,1)}return c},a}),b.define("select2/dropdown/infiniteScroll",["jquery"],function(a){function b(a,b,c,d){this.lastParams={},a.call(this,b,c,d),this.$loadingMore=this.createLoadingMore(),this.loading=!1}return b.prototype.append=function(a,b){this.$loadingMore.remove(),this.loading=!1,a.call(this,b),this.showLoadingMore(b)&&this.$results.append(this.$loadingMore)},b.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),c.on("query",function(a){e.lastParams=a,e.loading=!0}),c.on("query:append",function(a){e.lastParams=a,e.loading=!0}),this.$results.on("scroll",function(){var b=a.contains(document.documentElement,e.$loadingMore[0]);if(!e.loading&&b){var c=e.$results.offset().top+e.$results.outerHeight(!1),d=e.$loadingMore.offset().top+e.$loadingMore.outerHeight(!1);c+50>=d&&e.loadMore()}})},b.prototype.loadMore=function(){this.loading=!0;var b=a.extend({},{page:1},this.lastParams);b.page++,this.trigger("query:append",b)},b.prototype.showLoadingMore=function(a,b){return b.pagination&&b.pagination.more},b.prototype.createLoadingMore=function(){var b=a('<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'),c=this.options.get("translations").get("loadingMore");return b.html(c(this.lastParams)),b},b}),b.define("select2/dropdown/attachBody",["jquery","../utils"],function(a,b){function c(b,c,d){this.$dropdownParent=d.get("dropdownParent")||a(document.body),b.call(this,c,d)}return c.prototype.bind=function(a,b,c){var d=this,e=!1;a.call(this,b,c),b.on("open",function(){d._showDropdown(),d._attachPositioningHandler(b),e||(e=!0,b.on("results:all",function(){d._positionDropdown(),d._resizeDropdown()}),b.on("results:append",function(){d._positionDropdown(),d._resizeDropdown()}))}),b.on("close",function(){d._hideDropdown(),d._detachPositioningHandler(b)}),this.$dropdownContainer.on("mousedown",function(a){a.stopPropagation()})},c.prototype.destroy=function(a){a.call(this),this.$dropdownContainer.remove()},c.prototype.position=function(a,b,c){b.attr("class",c.attr("class")),b.removeClass("select2"),b.addClass("select2-container--open"),b.css({position:"absolute",top:-999999}),this.$container=c},c.prototype.render=function(b){var c=a("<span></span>"),d=b.call(this);return c.append(d),this.$dropdownContainer=c,c},c.prototype._hideDropdown=function(a){this.$dropdownContainer.detach()},c.prototype._attachPositioningHandler=function(c,d){var e=this,f="scroll.select2."+d.id,g="resize.select2."+d.id,h="orientationchange.select2."+d.id,i=this.$container.parents().filter(b.hasScroll);i.each(function(){a(this).data("select2-scroll-position",{x:a(this).scrollLeft(),y:a(this).scrollTop()})}),i.on(f,function(b){var c=a(this).data("select2-scroll-position");a(this).scrollTop(c.y)}),a(window).on(f+" "+g+" "+h,function(a){e._positionDropdown(),e._resizeDropdown()})},c.prototype._detachPositioningHandler=function(c,d){var e="scroll.select2."+d.id,f="resize.select2."+d.id,g="orientationchange.select2."+d.id,h=this.$container.parents().filter(b.hasScroll);h.off(e),a(window).off(e+" "+f+" "+g)},c.prototype._positionDropdown=function(){var b=a(window),c=this.$dropdown.hasClass("select2-dropdown--above"),d=this.$dropdown.hasClass("select2-dropdown--below"),e=null,f=(this.$container.position(),this.$container.offset());f.bottom=f.top+this.$container.outerHeight(!1);var g={height:this.$container.outerHeight(!1)};g.top=f.top,g.bottom=f.top+g.height;var h={height:this.$dropdown.outerHeight(!1)},i={top:b.scrollTop(),bottom:b.scrollTop()+b.height()},j=i.top<f.top-h.height,k=i.bottom>f.bottom+h.height,l={left:f.left,top:g.bottom};if("static"!==this.$dropdownParent[0].style.position){var m=this.$dropdownParent.offset();l.top-=m.top,l.left-=m.left}c||d||(e="below"),k||!j||c?!j&&k&&c&&(e="below"):e="above",("above"==e||c&&"below"!==e)&&(l.top=g.top-h.height),null!=e&&(this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--"+e),this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--"+e)),this.$dropdownContainer.css(l)},c.prototype._resizeDropdown=function(){var a={width:this.$container.outerWidth(!1)+"px"};this.options.get("dropdownAutoWidth")&&(a.minWidth=a.width,a.width="auto"),this.$dropdown.css(a)},c.prototype._showDropdown=function(a){this.$dropdownContainer.appendTo(this.$dropdownParent),this._positionDropdown(),this._resizeDropdown()},c}),b.define("select2/dropdown/minimumResultsForSearch",[],function(){function a(b){for(var c=0,d=0;d<b.length;d++){var e=b[d];e.children?c+=a(e.children):c++}return c}function b(a,b,c,d){this.minimumResultsForSearch=c.get("minimumResultsForSearch"),this.minimumResultsForSearch<0&&(this.minimumResultsForSearch=1/0),a.call(this,b,c,d)}return b.prototype.showSearch=function(b,c){return a(c.data.results)<this.minimumResultsForSearch?!1:b.call(this,c)},b}),b.define("select2/dropdown/selectOnClose",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("close",function(){d._handleSelectOnClose()})},a.prototype._handleSelectOnClose=function(){var a=this.getHighlightedResults();if(!(a.length<1)){var b=a.data("data");null!=b.element&&b.element.selected||null==b.element&&b.selected||this.trigger("select",{data:b})}},a}),b.define("select2/dropdown/closeOnSelect",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("select",function(a){d._selectTriggered(a)}),b.on("unselect",function(a){d._selectTriggered(a)})},a.prototype._selectTriggered=function(a,b){var c=b.originalEvent;c&&c.ctrlKey||this.trigger("close",{})},a}),b.define("select2/i18n/en",[],function(){return{errorLoading:function(){return"The results could not be loaded."},inputTooLong:function(a){var b=a.input.length-a.maximum,c="Please delete "+b+" character";return 1!=b&&(c+="s"),c},inputTooShort:function(a){var b=a.minimum-a.input.length,c="Please enter "+b+" or more characters";return c},loadingMore:function(){return"Loading more results…"},maximumSelected:function(a){var b="You can only select "+a.maximum+" item";return 1!=a.maximum&&(b+="s"),b},noResults:function(){return"No results found"},searching:function(){return"Searching…"}}}),b.define("select2/defaults",["jquery","require","./results","./selection/single","./selection/multiple","./selection/placeholder","./selection/allowClear","./selection/search","./selection/eventRelay","./utils","./translation","./diacritics","./data/select","./data/array","./data/ajax","./data/tags","./data/tokenizer","./data/minimumInputLength","./data/maximumInputLength","./data/maximumSelectionLength","./dropdown","./dropdown/search","./dropdown/hidePlaceholder","./dropdown/infiniteScroll","./dropdown/attachBody","./dropdown/minimumResultsForSearch","./dropdown/selectOnClose","./dropdown/closeOnSelect","./i18n/en"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C){function D(){this.reset()}D.prototype.apply=function(l){if(l=a.extend({},this.defaults,l),null==l.dataAdapter){if(null!=l.ajax?l.dataAdapter=o:null!=l.data?l.dataAdapter=n:l.dataAdapter=m,l.minimumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,r)),l.maximumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,s)),l.maximumSelectionLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,t)),l.tags&&(l.dataAdapter=j.Decorate(l.dataAdapter,p)),(null!=l.tokenSeparators||null!=l.tokenizer)&&(l.dataAdapter=j.Decorate(l.dataAdapter,q)),null!=l.query){var C=b(l.amdBase+"compat/query");l.dataAdapter=j.Decorate(l.dataAdapter,C)}if(null!=l.initSelection){var D=b(l.amdBase+"compat/initSelection");l.dataAdapter=j.Decorate(l.dataAdapter,D)}}if(null==l.resultsAdapter&&(l.resultsAdapter=c,null!=l.ajax&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,x)),null!=l.placeholder&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,w)),l.selectOnClose&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,A))),null==l.dropdownAdapter){if(l.multiple)l.dropdownAdapter=u;else{var E=j.Decorate(u,v);l.dropdownAdapter=E}if(0!==l.minimumResultsForSearch&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,z)),l.closeOnSelect&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,B)),null!=l.dropdownCssClass||null!=l.dropdownCss||null!=l.adaptDropdownCssClass){var F=b(l.amdBase+"compat/dropdownCss");l.dropdownAdapter=j.Decorate(l.dropdownAdapter,F)}l.dropdownAdapter=j.Decorate(l.dropdownAdapter,y)}if(null==l.selectionAdapter){if(l.multiple?l.selectionAdapter=e:l.selectionAdapter=d,null!=l.placeholder&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,f)),l.allowClear&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,g)),l.multiple&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,h)),null!=l.containerCssClass||null!=l.containerCss||null!=l.adaptContainerCssClass){var G=b(l.amdBase+"compat/containerCss");l.selectionAdapter=j.Decorate(l.selectionAdapter,G)}l.selectionAdapter=j.Decorate(l.selectionAdapter,i)}if("string"==typeof l.language)if(l.language.indexOf("-")>0){var H=l.language.split("-"),I=H[0];l.language=[l.language,I]}else l.language=[l.language];if(a.isArray(l.language)){var J=new k;l.language.push("en");for(var K=l.language,L=0;L<K.length;L++){var M=K[L],N={};try{N=k.loadPath(M)}catch(O){try{M=this.defaults.amdLanguageBase+M,N=k.loadPath(M)}catch(P){l.debug&&window.console&&console.warn&&console.warn('Select2: The language file for "'+M+'" could not be automatically loaded. A fallback will be used instead.');continue}}J.extend(N)}l.translations=J}else{var Q=k.loadPath(this.defaults.amdLanguageBase+"en"),R=new k(l.language);R.extend(Q),l.translations=R}return l},D.prototype.reset=function(){function b(a){function b(a){return l[a]||a}return a.replace(/[^\u0000-\u007E]/g,b)}function c(d,e){if(""===a.trim(d.term))return e;if(e.children&&e.children.length>0){for(var f=a.extend(!0,{},e),g=e.children.length-1;g>=0;g--){var h=e.children[g],i=c(d,h);null==i&&f.children.splice(g,1)}return f.children.length>0?f:c(d,f)}var j=b(e.text).toUpperCase(),k=b(d.term).toUpperCase();return j.indexOf(k)>-1?e:null}this.defaults={amdBase:"./",amdLanguageBase:"./i18n/",closeOnSelect:!0,debug:!1,dropdownAutoWidth:!1,escapeMarkup:j.escapeMarkup,language:C,matcher:c,minimumInputLength:0,maximumInputLength:0,maximumSelectionLength:0,minimumResultsForSearch:0,selectOnClose:!1,sorter:function(a){return a},templateResult:function(a){return a.text},templateSelection:function(a){return a.text},theme:"default",width:"resolve"}},D.prototype.set=function(b,c){var d=a.camelCase(b),e={};e[d]=c;var f=j._convertData(e);a.extend(this.defaults,f)};var E=new D;return E}),b.define("select2/options",["require","jquery","./defaults","./utils"],function(a,b,c,d){function e(b,e){if(this.options=b,null!=e&&this.fromElement(e),this.options=c.apply(this.options),e&&e.is("input")){var f=a(this.get("amdBase")+"compat/inputData");this.options.dataAdapter=d.Decorate(this.options.dataAdapter,f)}}return e.prototype.fromElement=function(a){var c=["select2"];null==this.options.multiple&&(this.options.multiple=a.prop("multiple")),null==this.options.disabled&&(this.options.disabled=a.prop("disabled")),null==this.options.language&&(a.prop("lang")?this.options.language=a.prop("lang").toLowerCase():a.closest("[lang]").prop("lang")&&(this.options.language=a.closest("[lang]").prop("lang"))),null==this.options.dir&&(a.prop("dir")?this.options.dir=a.prop("dir"):a.closest("[dir]").prop("dir")?this.options.dir=a.closest("[dir]").prop("dir"):this.options.dir="ltr"),a.prop("disabled",this.options.disabled),a.prop("multiple",this.options.multiple),a.data("select2Tags")&&(this.options.debug&&window.console&&console.warn&&console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'),a.data("data",a.data("select2Tags")),a.data("tags",!0)),a.data("ajaxUrl")&&(this.options.debug&&window.console&&console.warn&&console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."),a.attr("ajax--url",a.data("ajaxUrl")),a.data("ajax--url",a.data("ajaxUrl")));var e={};e=b.fn.jquery&&"1."==b.fn.jquery.substr(0,2)&&a[0].dataset?b.extend(!0,{},a[0].dataset,a.data()):a.data();var f=b.extend(!0,{},e);f=d._convertData(f);for(var g in f)b.inArray(g,c)>-1||(b.isPlainObject(this.options[g])?b.extend(this.options[g],f[g]):this.options[g]=f[g]);return this},e.prototype.get=function(a){return this.options[a]},e.prototype.set=function(a,b){this.options[a]=b},e}),b.define("select2/core",["jquery","./options","./utils","./keys"],function(a,b,c,d){var e=function(a,c){null!=a.data("select2")&&a.data("select2").destroy(),this.$element=a,this.id=this._generateId(a),c=c||{},this.options=new b(c,a),e.__super__.constructor.call(this);var d=a.attr("tabindex")||0;a.data("old-tabindex",d),a.attr("tabindex","-1");var f=this.options.get("dataAdapter");this.dataAdapter=new f(a,this.options);var g=this.render();this._placeContainer(g);var h=this.options.get("selectionAdapter");this.selection=new h(a,this.options),this.$selection=this.selection.render(),this.selection.position(this.$selection,g);var i=this.options.get("dropdownAdapter");this.dropdown=new i(a,this.options),this.$dropdown=this.dropdown.render(),this.dropdown.position(this.$dropdown,g);var j=this.options.get("resultsAdapter");this.results=new j(a,this.options,this.dataAdapter),this.$results=this.results.render(),this.results.position(this.$results,this.$dropdown);var k=this;this._bindAdapters(),this._registerDomEvents(),this._registerDataEvents(),this._registerSelectionEvents(),this._registerDropdownEvents(),this._registerResultsEvents(),this._registerEvents(),this.dataAdapter.current(function(a){k.trigger("selection:update",{data:a})}),a.addClass("select2-hidden-accessible"),a.attr("aria-hidden","true"),this._syncAttributes(),a.data("select2",this)};return c.Extend(e,c.Observable),e.prototype._generateId=function(a){var b="";return b=null!=a.attr("id")?a.attr("id"):null!=a.attr("name")?a.attr("name")+"-"+c.generateChars(2):c.generateChars(4),b="select2-"+b},e.prototype._placeContainer=function(a){a.insertAfter(this.$element);var b=this._resolveWidth(this.$element,this.options.get("width"));null!=b&&a.css("width",b)},e.prototype._resolveWidth=function(a,b){var c=/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;if("resolve"==b){var d=this._resolveWidth(a,"style");return null!=d?d:this._resolveWidth(a,"element")}if("element"==b){var e=a.outerWidth(!1);return 0>=e?"auto":e+"px"}if("style"==b){var f=a.attr("style");if("string"!=typeof f)return null;for(var g=f.split(";"),h=0,i=g.length;i>h;h+=1){var j=g[h].replace(/\s/g,""),k=j.match(c);if(null!==k&&k.length>=1)return k[1]}return null}return b},e.prototype._bindAdapters=function(){this.dataAdapter.bind(this,this.$container),this.selection.bind(this,this.$container),this.dropdown.bind(this,this.$container),this.results.bind(this,this.$container)},e.prototype._registerDomEvents=function(){var b=this;this.$element.on("change.select2",function(){b.dataAdapter.current(function(a){b.trigger("selection:update",{data:a})})}),this._sync=c.bind(this._syncAttributes,this),this.$element[0].attachEvent&&this.$element[0].attachEvent("onpropertychange",this._sync);var d=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;null!=d?(this._observer=new d(function(c){a.each(c,b._sync)}),this._observer.observe(this.$element[0],{attributes:!0,subtree:!1})):this.$element[0].addEventListener&&this.$element[0].addEventListener("DOMAttrModified",b._sync,!1)},e.prototype._registerDataEvents=function(){var a=this;this.dataAdapter.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerSelectionEvents=function(){var b=this,c=["toggle","focus"];this.selection.on("toggle",function(){b.toggleDropdown()}),this.selection.on("focus",function(a){b.focus(a)}),this.selection.on("*",function(d,e){-1===a.inArray(d,c)&&b.trigger(d,e)})},e.prototype._registerDropdownEvents=function(){var a=this;this.dropdown.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerResultsEvents=function(){var a=this;this.results.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerEvents=function(){var a=this;this.on("open",function(){a.$container.addClass("select2-container--open")}),this.on("close",function(){a.$container.removeClass("select2-container--open")}),this.on("enable",function(){a.$container.removeClass("select2-container--disabled")}),this.on("disable",function(){a.$container.addClass("select2-container--disabled")}),this.on("blur",function(){a.$container.removeClass("select2-container--focus")}),this.on("query",function(b){a.isOpen()||a.trigger("open",{}),this.dataAdapter.query(b,function(c){a.trigger("results:all",{data:c,query:b})})}),this.on("query:append",function(b){this.dataAdapter.query(b,function(c){a.trigger("results:append",{data:c,query:b})})}),this.on("keypress",function(b){var c=b.which;a.isOpen()?c===d.ESC||c===d.TAB||c===d.UP&&b.altKey?(a.close(),b.preventDefault()):c===d.ENTER?(a.trigger("results:select",{}),b.preventDefault()):c===d.SPACE&&b.ctrlKey?(a.trigger("results:toggle",{}),b.preventDefault()):c===d.UP?(a.trigger("results:previous",{}),b.preventDefault()):c===d.DOWN&&(a.trigger("results:next",{}),b.preventDefault()):(c===d.ENTER||c===d.SPACE||c===d.DOWN&&b.altKey)&&(a.open(),b.preventDefault())})},e.prototype._syncAttributes=function(){this.options.set("disabled",this.$element.prop("disabled")),this.options.get("disabled")?(this.isOpen()&&this.close(),this.trigger("disable",{})):this.trigger("enable",{})},e.prototype.trigger=function(a,b){var c=e.__super__.trigger,d={open:"opening",close:"closing",select:"selecting",unselect:"unselecting"};if(void 0===b&&(b={}),a in d){var f=d[a],g={prevented:!1,name:a,args:b};if(c.call(this,f,g),g.prevented)return void(b.prevented=!0)}c.call(this,a,b)},e.prototype.toggleDropdown=function(){this.options.get("disabled")||(this.isOpen()?this.close():this.open())},e.prototype.open=function(){this.isOpen()||this.trigger("query",{})},e.prototype.close=function(){this.isOpen()&&this.trigger("close",{})},e.prototype.isOpen=function(){return this.$container.hasClass("select2-container--open")},e.prototype.hasFocus=function(){return this.$container.hasClass("select2-container--focus")},e.prototype.focus=function(a){this.hasFocus()||(this.$container.addClass("select2-container--focus"),this.trigger("focus",{}))},e.prototype.enable=function(a){this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'),(null==a||0===a.length)&&(a=[!0]);var b=!a[0];this.$element.prop("disabled",b)},e.prototype.data=function(){this.options.get("debug")&&arguments.length>0&&window.console&&console.warn&&console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');var a=[];return this.dataAdapter.current(function(b){a=b}),a},e.prototype.val=function(b){if(this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'),null==b||0===b.length)return this.$element.val();var c=b[0];a.isArray(c)&&(c=a.map(c,function(a){return a.toString()})),this.$element.val(c).trigger("change")},e.prototype.destroy=function(){this.$container.remove(),this.$element[0].detachEvent&&this.$element[0].detachEvent("onpropertychange",this._sync),null!=this._observer?(this._observer.disconnect(),this._observer=null):this.$element[0].removeEventListener&&this.$element[0].removeEventListener("DOMAttrModified",this._sync,!1),this._sync=null,this.$element.off(".select2"),this.$element.attr("tabindex",this.$element.data("old-tabindex")),this.$element.removeClass("select2-hidden-accessible"),this.$element.attr("aria-hidden","false"),this.$element.removeData("select2"),this.dataAdapter.destroy(),this.selection.destroy(),this.dropdown.destroy(),this.results.destroy(),this.dataAdapter=null,this.selection=null,this.dropdown=null,this.results=null},e.prototype.render=function(){var b=a('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');return b.attr("dir",this.options.get("dir")),this.$container=b,this.$container.addClass("select2-container--"+this.options.get("theme")),b.data("element",this.$element),b},e}),b.define("jquery-mousewheel",["jquery"],function(a){return a}),b.define("jquery.select2",["jquery","jquery-mousewheel","./select2/core","./select2/defaults"],function(a,b,c,d){if(null==a.fn.select2){var e=["open","close","destroy"];a.fn.select2=function(b){if(b=b||{},"object"==typeof b)return this.each(function(){var d=a.extend(!0,{},b);new c(a(this),d)}),this;if("string"==typeof b){var d;return this.each(function(){var c=a(this).data("select2");null==c&&window.console&&console.error&&console.error("The select2('"+b+"') method was called on an element that is not using Select2.");var e=Array.prototype.slice.call(arguments,1);d=c[b].apply(c,e)}),a.inArray(b,e)>-1?this:d}throw new Error("Invalid arguments for Select2: "+b)}}return null==a.fn.select2.defaults&&(a.fn.select2.defaults=d),c}),{define:b.define,require:b.require}}(),c=b.require("jquery.select2");return a.fn.select2.amd=b,c});var api = api || wp.customize, $ = $ || jQuery;
(function (api, $, _) {
  api.czr_wp_conditionals = new api.Value();
  api.czr_scopeCollection = new api.Values();
  api.czr_scopeCollection.create('collection');//all available scope, including the current scope
  api.czr_scopeCollection.create('active');//the currently active scope
  api.czr_scope = new api.Values();
  api.sidebar_insights = new api.Values();
  api.sidebar_insights.create('candidates');//will store the sidebar candidates on preview refresh
  api.sidebar_insights.create('actives');//will record the refreshed active list of active sidebars sent from the preview
  api.sidebar_insights.create('inactives');
  api.sidebar_insights.create('registered');
  api.sidebar_insights.create('available_locations');
  api.czr_partials = new api.Value();

})( wp.customize , jQuery, _);(function (api, $, _) {
  api.bind( 'ready' , function() {
    if ( serverControlParams.isCtxEnabled ) {
      api.czr_scopeBase = new api.CZR_scopeBase();
    }
  } );

  api.CZR_scopeBase = api.Class.extend( {
    globalSettingVal : {},//will store the global setting val. Populated on init.

    initialize: function() {
          var self = this;
          if ( ! $('#customize-header-actions').find('.czr-scope-switcher').length ) {
            $('#customize-header-actions').append( $('<div/>', {class:'czr-scope-switcher'}) );
          }
          this.initialGlobalSettingVal = this.getGlobalSettingVal();
          api.czr_scopeCollection('collection').callbacks.add( function() { return self.initScopeModels.apply(self, arguments ); } );
          api.czr_scopeCollection('active').callbacks.add( function() { return self.setScopeStates.apply(self, arguments ); } );
    },
    initScopeModels : function(to, from) {
          console.log('SCOPES SENT BY THE PREVIEW, FROM AND TO : ', from, to);
          var self = this,
              _new_collection = _.clone(to) || {},
              _old_collection = _.clone(from) || {};
          _.map( _old_collection, function( data , name ) {
            api.czr_scope(name).view.container.remove();
            api.czr_scope.remove(name);
          });
          _.map( _new_collection, function( data , name ) {
            var params = _.clone(data);//IMPORTANT => otherwise the data object is actually a copy and share the same reference as the model and view params
            api.czr_scope.add( name, new api.CZR_scopeModel( name, $.extend( params, {name : name} ) ) );
            api.czr_scope(name).ready();
          });
          api.czr_scopeCollection('active').set( self.getActiveScopeOnInit(_new_collection) );
          this.addAPISettingsListener();
    },//listenToScopeCollection()
    setScopeStates : function(to, from) {
          var self = this;
          if ( ! _.isUndefined(from) && api.czr_scope.has(from) )
            api.czr_scope(from).active.set(false);
          else if ( ! _.isUndefined(from) )
            throw new Error('listenToActiveScope : previous scope does not exist in the collection');

          if ( ! _.isUndefined(to) && api.czr_scope.has(to) )
            api.czr_scope(to).active.set(true);
          else
            throw new Error('listenToActiveScope : requested scope ' + to + ' does not exist in the collection');
    },
    getGlobalSettingVal : function() {
          var self = this, _vals = {};
          api.each( function ( value, key ) {
            if ( ! self.isSettingEligible(key) )
              return;
            var _k = self._extractOptName(key);
            _vals[_k] = { value : value(), dirty : value._dirty };
          });
          return _vals;
    },


    addAPISettingsListener : function() {
          var self = this;
          console.log('BEFORE SETTING UP DIRTY VALUE LISTENER');
          api.each( function ( value, key ) {
                if ( ! self.isSettingEligible(key) )
                  return;

                api(key).callbacks.add( function(to, from) {
                      var current_scope = api.czr_scope( api.czr_scopeCollection('active').get() );//the active scope instance

                      if ( _.isUndefined(current_scope) ) {
                        throw new Error('Scope base class : the active scope is not defined.');
                      }

                      var current_dirties = _.clone( current_scope.dirtyValues.get() ),
                          _dirtyCustomized = {},
                          _k = self._extractOptName(key);

                      _dirtyCustomized[ _k ] = { value : to, dirty : true };
                      current_scope.dirtyValues.set( $.extend( current_dirties , _dirtyCustomized ) );
                });

          });
    },
    getActiveScopeOnInit : function(collection) {
          _def = _.findWhere(collection, {is_default : true }).name;
          return ! _.isUndefined(_def) ? _def : 'global';
    },

    isSettingEligible : function( setId ) {
      return -1 != setId.indexOf(serverControlParams.themeOptions) || _.contains( serverControlParams.wpBuiltinSettings, setId );
    },

    _extractOptName : function( setId ) {
      return setId.replace(serverControlParams.themeOptions, '').replace(/\[|\]/gi, '' );
    }

  });//api.Class.extend()


})( wp.customize , jQuery, _);(function (api, $, _) {
  api.CZR_scopeModel = api.Class.extend( {
    initialize: function( name, options ) {
          var scope = this;
          scope.options = options;
          $.extend( scope, options || {} );
          scope.winner      = new api.Value(); //is this scope the one that will be applied on front end in the current context?
          scope.priority    = new api.Value(); //shall this scope always win or respect the default scopes priority
          scope.active      = new api.Value(); //active, inactive. Are we currently customizing this scope ?
          scope.dirtyness   = new api.Value(); //true or false : has this scope been customized ?
          scope.dbValues    = new api.Value();
          scope.dirtyValues = new api.Value();//stores the current customized value.
    },
    ready : function() {
          var scope = this;
          scope.view = new api.CZR_scopeView( name, scope.options );
          scope.active.callbacks.add(function() { return scope.activeStateModelCallbacks.apply(scope, arguments ); } );
          scope.dirtyValues.callbacks.add( function(to){
            scope.dirtyness.set( ! _.isEmpty(to) );
          });
          scope.dirtyValues.set({});
          scope.dbValues.set( _.isEmpty(scope.db) ? {} : scope.db );
          scope.active.set( scope.is_default );
          scope.dirtyness.set( false );
          scope.winner.set( scope.is_winner );
    },
    activeStateModelCallbacks : function(to){
          var scope = this;


    },


    storeDirtyness : function() {
          var scope = this;
          scope.dirtyValues.set( scope.getDirties() );
    },


    getDirties : function() {
          var scope = this,
              _dirtyCustomized = {};
          api.each( function ( value, key ) {
            if ( value._dirty ) {
              var _k = key.replace(serverControlParams.themeOptions, '').replace(/[|]/gi, '' );
              _dirtyCustomized[ _k ] = { value : value(), dirty : value._dirty };
            }
          } );
          return _dirtyCustomized;
    },



    setSettingsValue : function() {
          if ( 'trans' == to.dyn_type ) {
            api('hu_theme_options[dynamic-styles]').set(true);
            $('input[type=checkbox]', api.control('hu_theme_options[dynamic-styles]').container ).iCheck('update');
          }
          if ( 'trans' == to.dyn_type ) {
            api('hu_theme_options[font]').set('raleway');
            $('select[data-customize-setting-link]', api.control('hu_theme_options[font]').container ).selecter('destroy').selecter();
          }

          var _img_id = 'trans' == to.dyn_type ? 23 : 25;
          api.control('hu_theme_options[custom-logo]').container.remove();

          api.control.remove('hu_theme_options[custom-logo]');

          var _constructor = api.controlConstructor['czr_cropped_image'];
          var _data = api.settings.controls['hu_theme_options[custom-logo]'];
          api('hu_theme_options[custom-logo]').set(_img_id);
          wp.media.attachment( _img_id ).fetch().done( function() {
            _data.attachment = this.attributes;
            api.control.add(
            'hu_theme_options[custom-logo]',
              new _constructor('hu_theme_options[custom-logo]', { params : _data, previewer :api.previewer })
            );
          } );

    },
    getDBOptions : function( opt_name, dyn_type ) {
          if ( serverControlParams.themeOptions == opt_name ) {
            return api.czr_scopeBase.getGlobalSettingVal();
          }
          var _options = '',
              _query = {
                data : {
                  action : serverControlParams.optionAjaxAction,//theme dependant
                  opt_name: opt_name,
                  dyn_type: dyn_type,
                  stylesheet : api.settings.theme.stylesheet
                }
              };

          wp.ajax.send( _query ).done( function( resp ){
            _options = resp;
          });
          return _options;
    },
  });//api.Class.extend()


})( wp.customize , jQuery, _);(function (api, $, _) {
  api.CZR_scopeView = api.Class.extend( {
    initialize: function( name, options ) {
          var view = this;
          $.extend( view, options || {} );
          view.params = options;

          view.el = 'czr-scope-' + view.name;//@todo replace with a css selector based on the scope name
          view.container = view.embedScopeDialogBox();
          view.listenToScopeSwitch();
          api.czr_scope(view.name).active.callbacks.add(function() { return view.activeStateViewCallbacks.apply(view, arguments ); } );
          api.czr_scope(view.name).dirtyness.callbacks.add(function() { return view.dirtynessViewCallbacks.apply(view, arguments ); } );
          api.czr_scope(view.name).dbValues.callbacks.add(function() { return view.dbValuesViewCallbacks.apply(view, arguments ); } );
          api.czr_scope(view.name).winner.callbacks.add(function() { return view.winnerViewCallbacks.apply(view, arguments ); } );
    },

    activeStateViewCallbacks : function(to, from){
      var view = this;
      view.container.toggleClass('active', to);
      $('.czr-scope-switch',view.container).toggleClass('fa-toggle-on', to).toggleClass('fa-toggle-off', !to);
    },

    dirtynessViewCallbacks : function(to, from) {
      var view = this;
      this.container.toggleClass('dirty', to);
    },

    dbValuesViewCallbacks : function(to, from) {
      this.container.toggleClass('has_db_val', ! _.isEmpty(to) );
    },

    winnerViewCallbacks : function(to, from) {
      this.container.toggleClass('is_winner', ! _.isEmpty(to) );
    },
    embedScopeDialogBox : function() {
          var view = this;
          if ( ! $('#customize-header-actions').find('.czr-scope-switcher').length ) {
            throw new Error('The scope switcher wrapper is not printed, the scope view can not be embedded.');
          }
          var $view = $( wp.template('customize-scope')( _.extend(view.params, {el : view.el}) ) );
          $('.czr-scope-switcher', '#customize-header-actions').append($view);
          return $view;
    },

    listenToScopeSwitch : function() {
          var view = this;
          $('.czr-scope-switch', view.container ).on('click keydown', function( e, event_params ) {
              if ( api.utils.isKeydownButNotEnterEvent( e ) ) {
                return;
              }
              e.preventDefault(); // Keep this AFTER the key filter above)

              var _new_scope = $(this).closest('.czr-scope').attr('data-scope-id');
              if ( api.czr_scope.has( _new_scope ) ) {
                api.czr_scopeCollection('active').set( _new_scope );
              }

          });//.on()
    },

    setScopeSwitcherButtonActive : function( dyn_type ) {
          $('.button', '.czr-scope-switcher').each( function( ind ) {
            $(this).toggleClass( 'active', dyn_type == $(this).attr('data-dyn-type') );
          });
    },
    getEl : function() {
          var view = this;
          return $( view.el, '#customize-header-actions');
    }
  });//api.Class.extend()


})( wp.customize , jQuery, _);(function (api, $, _) {
  var _old_initialize = api.PreviewFrame.prototype.initialize;
  api.PreviewFrame.prototype.initialize = function( params, options ) {
        _old_initialize.call( this, params, options );
        this.bind('houston-widget-settings', function(data) {
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

            api.sidebar_insights('actives').set( data.renderedSidebars );
            api.sidebar_insights('inactives').set( _inactives );
            api.sidebar_insights('registered').set( _registered );
            api.sidebar_insights('candidates').set( _candidates );
            api.sidebar_insights('available_locations').set( data.availableWidgetLocations );//built server side
        });


        this.bind( 'czr-wp-conditional-ready', function(data ) {
          api.czr_wp_conditionals.set( data );
        });

        this.bind( 'czr-partial-refresh', function(data) {
          api.czr_partials.set(data);
        });

        this.bind( 'czr-scopes-ready', function(data) {
          api.czr_scopeCollection('collection').set( data );
        });
  };//api.PreviewFrame.prototype.initialize
  api.Setting.prototype.silent_set =function( to ) {
        var from = this._value;

        to = this._setter.apply( this, arguments );
        to = this.validate( to );
        if ( null === to || _.isEqual( from, to ) ) {
          return this;
        }

        this._value = to;
        this._dirty = true;

        return this;
  };
  if ( serverControlParams.isCtxEnabled ) {
    api.czr_isPreviewerScopeAware = new api.Value();
    api.czr_isPreviewerScopeAware.set(false);
    var _old_preview = api.Setting.prototype.preview;
    api.Setting.prototype.preview = function() {
      if ( ! api.czr_isPreviewerScopeAware.get() )
        return this.previewer.refresh();
      _old_preview.call(this);
    };
  }


  api.bind('ready', function() {
        if ( ! serverControlParams.isCtxEnabled )
          return;
        api.previewer.query =  function() {
          var dirtyCustomized = {};
          api.each( function ( value, key ) {
            if ( value._dirty ) {
              dirtyCustomized[ key ] = value();
            }
          } );
          api.czr_isPreviewerScopeAware.set(true);

          return {
            wp_customize: 'on',
            dyn_type:     api.czr_scope( api.czr_scopeCollection('active').get() ).dyn_type,//post_meta, term_meta, user_meta, trans, option
            opt_name:     api.czr_scope( api.czr_scopeCollection('active').get() ).opt_name,
            obj_id:       api.czr_scope( api.czr_scopeCollection('active').get() ).obj_id,
            theme:        _wpCustomizeSettings.theme.stylesheet,
            customized:   JSON.stringify( dirtyCustomized ),
            nonce:        this.nonce.preview
          };
        };
        api.previewer.save = function() {
          var self = this,
            processing = api.state( 'processing' ),
            submitWhenDoneProcessing,
            submit;

          $( document.body ).addClass( 'saving' );

          submit = function () {
            var request, query;
            query = $.extend( self.query(), {
              nonce:  self.nonce.save
            } );

            console.log('in submit : ', query);
            request = wp.ajax.post( 'customize_save', query );
            api.trigger( 'save', request );

            request.always( function () {
              $( document.body ).removeClass( 'saving' );
            } );

            request.fail( function ( response ) {
              console.log('ALORS FAIL ?', response );
              if ( '0' === response ) {
                response = 'not_logged_in';
              } else if ( '-1' === response ) {
                response = 'invalid_nonce';
              }

              if ( 'invalid_nonce' === response ) {
                self.cheatin();
              } else if ( 'not_logged_in' === response ) {
                self.preview.iframe.hide();
                self.login().done( function() {
                  self.save();
                  self.preview.iframe.show();
                } );
              }
              api.trigger( 'error', response );
            } );

            request.done( function( response ) {
              console.log('ALORS DONE ?', response );
              api.each( function ( value ) {
                value._dirty = false;
              } );

              api.previewer.send( 'saved', response );

              api.trigger( 'saved', response );
            } );
          };

          if ( 0 === processing() ) {
            submit();
          } else {
            submitWhenDoneProcessing = function () {
              if ( 0 === processing() ) {
                api.state.unbind( 'change', submitWhenDoneProcessing );
                submit();
              }
            };
            api.state.bind( 'change', submitWhenDoneProcessing );
          }
        };
  });//api.bind('ready')
  api.Control.prototype.onChangeActive = function ( active, args ) {
        if ( args.unchanged )
          return;
        if ( this.container[0] && ! $.contains( document, this.container[0] ) ) {
          this.container.toggle( active );
          if ( args.completeCallback ) {
            args.completeCallback();
          }
        } else if ( active ) {
          this.container.slideDown( args.duration, args.completeCallback );
        } else {
          this.container.slideUp( args.duration, args.completeCallback );
        }
  };
  if ( 'function' == typeof api.Section ) {
    var _original_section_initialize = api.Section.prototype.initialize;
    api.Section.prototype.initialize = function( id, options ) {
          _original_section_initialize.apply( this, [id, options] );
          var section = this;

          this.expanded.callbacks.add( function( _expanded ) {
            if ( ! _expanded )
              return;

          var container = section.container.closest( '.wp-full-overlay-sidebar-content' ),
                content = section.container.find( '.accordion-section-content' );
            _resizeContentHeight = function() {
              content.css( 'height', container.innerHeight() );
          };
            _resizeContentHeight();
            $( window ).on( 'resize.customizer-section', _.debounce( _resizeContentHeight, 110 ) );
          });
        };
  }

})( wp.customize , jQuery, _);(function (api, $, _) {
  api.CZR_Helpers = api.CZR_Helpers || {};
  api.CZR_Helpers = $.extend( api.CZR_Helpers, {
        getDocSearchLink : function( text ) {
                text = ! _.isString(text) ? '' : text;
                var _searchtext = text.replace( / /g, '+'),
                    _url = [ serverControlParams.docURL, 'search?query=', _searchtext ].join('');
                return [
                  '<a href="' + _url + '" title="' + serverControlParams.translatedStrings.readDocumentation + '" target="_blank">',
                  ' ',
                  '<span class="fa fa-question-circle-o"></span>'
                ].join('');
        },
        build_setId : function ( name ) {
                if ( _.contains( serverControlParams.wpBuiltinSettings, name ) )
                  return name;
                return -1 == name.indexOf( serverControlParams.themeOptions ) ? [ serverControlParams.themeOptions +'[' , name  , ']' ].join('') : name;
        },
        has_part_refresh : function( setId ) {
                if ( ! _.has( api, 'czr_partials')  )
                  return;
                return  _.contains( _.map( api.czr_partials.get(), function( partial, key ) {
                  return _.contains( partial.settings, setId );
                }), true );
        },
        capitalize : function( string ) {
                if( ! _.isString(string) )
                  return string;
                return string.charAt(0).toUpperCase() + string.slice(1);
        },

        truncate : function( string, n, useWordBoundary ){
                if ( _.isUndefined(string) )
                  return '';
                var isTooLong = string.length > n,
                    s_ = isTooLong ? string.substr(0,n-1) : string;
                    s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
                return  isTooLong ? s_ + '...' : s_;
        }

  });//$.extend
})( wp.customize , jQuery, _);(function (api, $, _) {
  api.CZR_Helpers = api.CZR_Helpers || {};
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
        setupDOMListeners : function( event_map , obj, instance ) {
                var control = this;
                instance = instance || control;
                _.map( event_map , function( _event ) {
                  if ( ! _.isString( _event.selector ) || _.isEmpty( _event.selector ) ) {
                    throw new Error( 'setupDOMListeners : selector must be a string not empty. Aborting setup of action(s) : ' + _event.actions.join(',') );
                  }
                  obj.dom_el.on( _event.trigger , _event.selector, function( e, event_params ) {
                    if ( api.utils.isKeydownButNotEnterEvent( e ) ) {
                      return;
                    }
                    e.preventDefault(); // Keep this AFTER the key filter above
                    var _obj = _.clone(obj);
                    if ( _.has(_obj, 'model') && _.has( _obj.model, 'id') ) {
                      if ( _.has(instance, 'get') )
                        _obj.model = instance.get();
                      else
                        _obj.model = instance.getModel( _obj.model.id );
                    }
                    $.extend( _obj, { event : _event, dom_event : e } );
                    $.extend( _obj, event_params );
                    control.executeEventActionChain( _obj, instance );
                  });//.on()

                });//_.map()
        },
        executeEventActionChain : function( obj, instance ) {
                var control = this;
                if ( ! _.has( obj, 'event' ) || ! _.has( obj.event, 'actions' ) ) {
                  throw new Error('executeEventActionChain : No obj.event or no obj.event.actions properties found');
                }
                if ( 'function' === typeof(obj.event.actions) )
                  return obj.event.actions(obj);
                if ( ! _.isArray(obj.event.actions) )
                  obj.event.actions = [ obj.event.actions ];
                var _break = false;
                _.map( obj.event.actions, function( _cb ) {

                  if ( _break )
                    return;

                  if ( 'function' != typeof( instance[_cb] ) ) {
                    throw new Error( 'executeEventActionChain : the action : ' + _cb + ' has not been found when firing event : ' + obj.event.selector );
                  }
                  var $_dom_el = ( _.has(obj, 'dom_el') && -1 != obj.dom_el.length ) ? obj.dom_el : control.container;

                  $_dom_el.trigger('before_' + _cb, _.omit( obj, 'event') );
                    var _cb_return = instance[_cb](obj);
                    if ( false === _cb_return )
                      _break = true;
                  $_dom_el.trigger('after_' + _cb, _.omit( obj, 'event') );

                });//_.map
        }
  });//$.extend
})( wp.customize , jQuery, _);var CZRInputMths = CZRInputMths || {};
$.extend( CZRInputMths , {
    initialize: function( name, options ) {
            if ( _.isUndefined(options.item ) || _.isEmpty(options.item) ) {
              throw new Error('No item assigned to input ' + options.id + '. Aborting');
            }
            if ( _.isUndefined(options.module ) ) {
              throw new Error('No module assigned to input ' + options.id + '. Aborting');
            }

            api.Value.prototype.initialize.call( this, null, options );
            var input = this;
            $.extend( input, options || {} );
            if ( ! _.isUndefined(options.input_value) )
              input.set(options.input_value);
            input.type_map = {
                  text : '',
                  textarea : '',
                  check : 'setupIcheck',
                  select : 'setupSelect',
                  upload : 'setupImageUploader',
                  color : 'setupColorPicker',
                  content_picker : 'setupContentPicker',
                  password : ''
            };

            if ( _.has( input.type_map, input.type ) ) {
                    var _meth = input.type_map[input.type];
                    if ( _.isFunction(input[_meth]) )
                      input[_meth]();
            }

            var trigger_map = {
                  text : 'keyup',
                  textarea : 'keyup',
                  password : 'keyup',
                  color : 'colorpickerchange',
                  range : 'input propertychange'
            };
            input.input_event_map = [
                    {
                      trigger   : $.trim( ['change', trigger_map[input.type] || '' ].join(' ') ),//was 'propertychange change click keyup input',//colorpickerchange is a custom colorpicker event @see method setupColorPicker => otherwise we don't
                      selector  : 'input[data-type], select[data-type]',
                      name      : 'set_input_value',
                      actions   : 'updateInput'
                    }
            ];
            input.setupSynchronizer();

            input.ready();
    },


    setupSynchronizer: function() {
            var input       = this,
                $_input_el  = input.container.find('[data-type]'),
                is_input    = input.container.find('[data-type]').is('input'),
                input_type  = is_input ? input.container.find('[data-type]').attr('type') : false,
                is_select   = input.container.find('[data-type]').is('select'),
                is_textarea = input.container.find('[data-type]').is('textarea');


            input.syncElement = new api.Element( input.container.find('[data-type]') );
            input.syncElement.set( input() );
            input.syncElement.sync( input );
            input.callbacks.add( function(to) {
                  input.syncElement.set( to );
                  if ( is_input && 'checkbox' == input_type ) {
                    $_input_el.iCheck('update');
                  }

                  if ( is_input && 'color' == input.type ) {
                    $_input_el.wpColorPicker('color', to );
                  }
                  if ( is_select ) {
                    $_input_el.trigger('change');
                  }
            });

    },


    ready : function() {
            var input = this;
            input.setupDOMListeners( input.input_event_map , { dom_el : input.container }, input );
            input.callbacks.add( function() { return input.inputReact.apply(input, arguments ); } );
    },
    inputReact : function( to, from) {
            var input = this,
                _current_item = input.item.get(),
                _new_model        = _.clone( _current_item );//initialize it to the current value
            _new_model =  ( ! _.isObject(_new_model) || _.isEmpty(_new_model) ) ? {} : _new_model;
            _new_model[input.id] = to;
            input.item.set(_new_model);
            input.trigger( input.id + ':changed', to );
    },


    updateInput : function( obj ) {
            var input             = this,
                $_changed_input   = $(obj.dom_event.currentTarget, obj.dom_el ),
                _new_val          = $( $_changed_input, obj.dom_el ).val();
            if ( _new_val == input.get() )
              return;

            input.set(_new_val);
    }
});//$.extend
var CZRInputMths = CZRInputMths || {};
$.extend( CZRInputMths , {
    setupImageUploader : function() {
          var input        = this,
              _model       = input.get();
          input.attachment   = {};
          if ( ! input.container )
            return this;

          this.contentRendered = $.Deferred();
          this.setupContentRendering( _model, {} );
          this.contentRendered.done( function(){
            input.czrImgUploaderBinding();
          });
  },

  setupContentRendering : function( to, from) {
        var input = this;
        if ( ( input.attachment.id != to ) && from !== to ) {
              if ( ! to ) {
                input.attachment = {};
                input.renderImageUploaderTemplate();
              }
              wp.media.attachment( to ).fetch().done( function() {
                input.attachment       = this.attributes;
                input.renderImageUploaderTemplate();
              });
        }//Standard reaction, the image has been updated by the user or init
        else if (  ! input.attachment.id || input.attachment.id === to ) {
              input.renderImageUploaderTemplate();
        }
  },

  czrImgUploaderBinding : function() {
        var input = this;
        _.bindAll( input, 'czrImgUploadRemoveFile', 'czrImgUploadOpenFrame', 'czrImgUploadSelect');
        input.container.on( 'click keydown', '.upload-button', input.czrImgUploadOpenFrame );
        input.container.on( 'click keydown', '.thumbnail-image img', input.czrImgUploadOpenFrame );
        input.container.on( 'click keydown', '.remove-button', input.czrImgUploadRemoveFile );

        input.bind( input.id + ':changed', function( to, from ){
              input.contentRendered = $.Deferred();
              input.setupContentRendering(to,from);
        });
  },
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
  czrImgUploadInitFrame: function() {
        var input = this;

        var button_labels = this.getUploaderLabels();

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
         input.frame.on( 'select', input.czrImgUploadSelect );
  },
  czrImgUploadRemoveFile: function( event ) {
        var input = this;

        if ( api.utils.isKeydownButNotEnterEvent( event ) ) {
          return;
        }
        event.preventDefault();
        input.attachment = {};
        input.set('');
  },
  czrImgUploadSelect: function() {
        var node,
            input = this,
            attachment   = input.frame.state().get( 'selection' ).first().toJSON(),  // Get the attachment from the modal frame.
            mejsSettings = window._wpmejsSettings || {};
        input.attachment = attachment;
        input.set(attachment.id);
  },
  renderImageUploaderTemplate: function() {
        var input  = this;
        if ( 0 === $( '#tmpl-czr-input-img-uploader-view-content' ).length )
          return;

        var view_template = wp.template('czr-input-img-uploader-view-content');
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

        input.contentRendered.resolve();
        input.trigger( input.id + ':content_rendered' );

        return true;
  },

  getUploaderLabels : function() {
        var _ts = serverControlParams.translatedStrings;

        return {
            'select'      : _ts.select_image,
            'change'      : _ts.change_image,
            'remove'      : _ts.remove_image,
            'default'     : _ts.default_image,
            'placeholder' : _ts.placeholder_image,
            'frame_title' : _ts.frame_title_image,
            'frame_button': _ts.frame_button_image
        };
  }
});//$.extendvar CZRInputMths = CZRInputMths || {};
$.extend( CZRInputMths , {
    setupColorPicker : function() {
        var input  = this;

        input.container.find('input').wpColorPicker( {
          change : function( e, o ) {
            $(this).val($(this).wpColorPicker('color'));
            $(this).trigger('colorpickerchange');
          }
        });
    }
});//$.extendvar CZRInputMths = CZRInputMths || {};
$.extend( CZRInputMths , {
    setupSelect : function() {
        var input = this;
        $('select', input.container ).not('.no-selecter-js')
          .each( function() {
            $(this).selecter({
            });
        });
    }
});//$.extend/* Fix caching, select2 default one seems to not correctly work, or it doesn't what I think it should */
var CZRInputMths = CZRInputMths || {};
$.extend( CZRInputMths , {
  setupContentPicker: function() {
          var input  = this,
          _event_map = [];
          input.object = ['post']; //this.control.params.object_types  - array('page', 'post')
          input.type   = 'post_type'; //this.control.params.type  - post_type
          input.container.find('.czr-input').append('<select data-select-type="content-picker-select" class="js-example-basic-simple"></select>');
          _event_map = [
              {
                trigger   : 'change',
                selector  : 'select[data-select-type]',
                name      : 'set_input_value',
                actions   : 'updateContentPickerModel'
              }
          ];

          input.setupDOMListeners( _event_map , { dom_el : input.container }, input );
          input.setupContentSelecter();
  },

  setupContentSelecter : function() {
          var input = this;

          input.container.find('select').select2({
            placeholder: {
              id: '-1', // the value of the option
              title: 'Select'
            },
            data : input.setupSelectedContents(),
            ajax: {
                  url: serverControlParams.AjaxUrl,
                  type: 'POST',
                  dataType: 'json',
                  delay: 250,
                  debug: true,
                  data: function ( params ) {
                        var page = params.page ? params.page - 1 : 0;
                        page = params.term ? params.page : page;
                        return {
                              action: params.term ? "search-available-content-items-customizer" : "load-available-content-items-customizer",
                              search: params.term,
                              wp_customize: 'on',
                              page: page,
                              type: input.type,
                              object: input.object,
                              CZRCpNonce: serverControlParams.CZRCpNonce
                        };
              },
              processResults: function (data, params) {
                    if ( ! data.success )
                      return { results: [] };

                    var items   = data.data.items,
                        _results = [];

                    _.each( items, function( item ) {
                      _results.push({
                        id          : item.id,
                        title       : item.title,
                        type_label  : item.type_label,
                        object_type : item.object
                      });
                    });
                    return {
                      results: _results,
                      pagination: { more: data.data.items.length == 10 }
                    };
              },
            },
            templateSelection: input.czrFormatContentSelected,
            templateResult: input.czrFormatContentSelected,
            escapeMarkup: function (markup) { return markup; },
         });
  },


  czrFormatContentSelected: function (item) {
          if ( item.loading ) return item.text;
          var markup = "<div class='content-picker-item clearfix'>" +
            "<div class='content-item-bar'>" +
              "<span class='item-title'>" + item.title + "</span>";

          if ( item.type_label ) {
            markup += "<span class='item-type'>" + item.type_label + "</span>";
          }

          markup += "</div></div>";

          return markup;
  },

  setupSelectedContents : function() {
        var input = this,
           _model = input.get();

        return _model;
  },

  updateContentPickerModel: function( obj ){
        var input = this,
            $_changed_input   = $(obj.dom_event.currentTarget, obj.dom_el ),
            _new_val          = $( $_changed_input, obj.dom_el ).select2('data');
        if ( _new_val.length ) {
          _new_val = _.map( _new_val, function( _item ){
            return {
              'id'          :  _item.id,
              'type_label'  :  _item.type_label,
              'title'       :  _item.title,
              'object_type' :  _item.object_type
            };
          });
        }

        input.set(_new_val);
        return;
  }
});//$.extend
var CZRItemMths = CZRItemMths || {};
$.extend( CZRItemMths , {
  initialize: function( id, options ) {
        if ( _.isUndefined(options.item_module) || _.isEmpty(options.item_module) ) {
          throw new Error('No module assigned to item ' + id + '. Aborting');
        }

        var item = this;
        api.Value.prototype.initialize.call( item, null, options );
        item.embedded = $.Deferred();
        item.contentRendered = $.Deferred();
        $.extend( item, options || {} );
        item.defaultItemModel = _.clone( options.defaultItemModel ) || { id : '', title : '' };
        var _initial_model = $.extend( item.defaultItemModel, options.initial_item_model );
        item.set( _initial_model );
        item.czr_View = new api.Value();

        item.setupView( _initial_model );
        item.bind('input_collection_populated', function( input_collection ) {
            item.callbacks.add( function() { return item.itemInternalReact.apply(item, arguments ); } );
        });

  },//initialize


  setupView : function( item_model ) {
          var item = this,
              module = this.item_module;

          item.view_event_map = [
                  {
                    trigger   : 'click keydown',
                    selector  : [ '.' + module.control.css_attr.display_alert_btn, '.' + module.control.css_attr.cancel_alert_btn ].join(','),
                    name      : 'toggle_remove_alert',
                    actions   : ['toggleRemoveAlertVisibility']
                  },
                  {
                    trigger   : 'click keydown',
                    selector  : '.' + module.control.css_attr.remove_view_btn,
                    name      : 'remove_item',
                    actions   : ['removeItem']
                  },
                  {
                    trigger   : 'click keydown',
                    selector  : [ '.' + module.control.css_attr.edit_view_btn, '.' + module.control.css_attr.view_title ].join(','),
                    name      : 'edit_view',
                    actions   : ['setViewVisibility']
                  }
          ];
          item.czr_View.set('closed');

          item.container = item.renderView( item_model );
          if ( _.isUndefined(item.container) || ! item.container.length ) {
              throw new Error( 'In setupView the Item view has not been rendered : ' + item.id );
          } else {
              item.embedded.resolve();
          }
          item.embedded.done( function() {
            console.log('JOIE ?');
                item.writeItemViewTitle();
                item.czr_View.callbacks.add( function() { return item.setupViewStateListeners.apply(item, arguments ); } );

                api.CZR_Helpers.setupDOMListeners(
                      item.view_event_map,//actions to execute
                      { model:item_model, dom_el:item.container },//model + dom scope
                      item //instance where to look for the cb methods
                );//listeners for the view wrapper
                module.trigger('view_setup', { model : item_model , dom_el: item.container} );
          });
  },
  setupViewStateListeners : function( to, from ) {
          var item = this,
              item_model = item.get() || item.initial_item_model,//could not be set yet
              module = this.item_module;

          console.log('item.contentRendered.state()', item.contentRendered.state());
          if ( 'pending' == item.contentRendered.state() ) {
              var $item_content = item.renderViewContent( item_model );
              if ( ! _.isUndefined($item_content) && false !== $item_content ) {
                item.contentRendered.resolve();
              }
          }
          if ( ! _.has(item, 'czr_Input') ) {
            item.setupInputCollection();
          }
          item._toggleViewExpansion( to );
  },
  itemInternalReact : function( to, from ) {
          var item = this;
          item.writeItemViewTitle(to);
          if ( ! _.isEmpty(from) || ! _.isUndefined(from) ) {
            item._sendItem(to, from);
          }
  }

});//$.extend//extends api.Value
var CZRItemMths = CZRItemMths || {};
$.extend( CZRItemMths , {
  setupInputCollection : function() {
        var item = this,
            module = item.item_module;
        item.czr_Input = new api.Values();
        item.inputConstructor = module.inputConstructor;

        if ( _.isEmpty(item.defaultItemModel) || _.isUndefined(item.defaultItemModel) ) {
          throw new Error('No default model found in item ' + item.id + '. Aborting');
        }
        var initial_item_model = item.initial_item_model;

        if ( ! _.isObject(initial_item_model) )
          initial_item_model = item.defaultItemModel;
        else
          initial_item_model = $.extend( item.defaultItemModel, initial_item_model );

        var input_collection = {};
        $( '.'+module.control.css_attr.sub_set_wrapper, item.container).each( function(_index) {
              if ( ! $(this).find('[data-type]').length ) {
                  console.log('No data-type found in the input wrapper index : ' + _index + ' in item : '+ item.id );
                  return;
              }
              var _id = $(this).find('[data-type]').attr('data-type') || 'sub_set_' + _index,
                  _value = _.has( initial_item_model, _id) ? initial_item_model[_id] : '';

              item.czr_Input.add( _id, new item.inputConstructor( _id, {
                    id : _id,
                    type : $(this).attr('data-input-type'),
                    input_value : _value,
                    container : $(this),
                    item : item,
                    module : module
              } ) );
              input_collection[_id] = _value;
        });//each
        item.trigger('input_collection_populated', $.extend( initial_item_model, input_collection ));
  }


});//$.extend//extends api.CZRBaseControl
var CZRItemMths = CZRItemMths || {};

  $.extend( CZRItemMths , {
    _sendItem : function( to, from ) {
          var item = this,
              module = item.item_module,
              _changed_props = [];
          _.each( from, function( _val, _key ) {
                if ( _val != to[_key] )
                  _changed_props.push(_key);
          });

          _.each( _changed_props, function( _prop ) {
                module.control.previewer.send( 'sub_setting', {
                      set_id : module.control.id,
                      id : to.id,
                      changed_prop : _prop,
                      value : to[_prop]
                });
                module.trigger('item_sent', { item : to , dom_el: item.container, changed_prop : _prop } );
          });
    },
    removeItem : function() {
            var item = this,
                module = this.item_module,
                _new_collection = _.clone( module.get() );
            item._destroyView();
            _new_collection = _.without( _new_collection, _.findWhere( _new_collection, {id: item.id }) );
            module.set( _new_collection );
            module.trigger('item_removed', item.get() );
            module.czr_Item.remove(item.id);
    },
    getModel : function(id) {
            return this.get();
    }

  });//$.extend
var CZRItemMths = CZRItemMths || {};

$.extend( CZRItemMths , {
  renderView : function( item_model ) {
        var item = this,
            module = item.item_module;
            item_model = item_model || item.get();
        if ( 0 === $( '#tmpl-' + module.getTemplateEl( 'view', item_model ) ).length ) {
          throw new Error('No template for item ' + item.id + '. The template script id should be : #tmpl-' + module.getTemplateEl( 'view', item_model ) );
        }

        var view_template = wp.template( module.getTemplateEl( 'view', item_model ) );
        if ( ! view_template  || ! module.container )
          return;
        if ( 'resolved' == item.embedded.state() )
          return item.container;

        $_view_el = $('<li>', { class : module.control.css_attr.inner_view, 'data-id' : item_model.id,  id : item_model.id } );
        $( '.' + module.control.css_attr.views_wrapper , module.container).append( $_view_el );
        $( view_template( item_model ) ).appendTo( $_view_el );

        return $_view_el;
  },
  renderViewContent : function( item_model ) {
          var item = this,
              module = this.item_module;
          if ( 0 === $( '#tmpl-' + module.getTemplateEl( 'view-content', item_model ) ).length )
            return this;

          var  view_content_template = wp.template( module.getTemplateEl( 'view-content', item_model ) );
          if ( ! view_content_template )
            return this;
          $( view_content_template( item_model )).appendTo( $('.' + module.control.css_attr.view_content, item.container ) );

          return this;
  },
  writeItemViewTitle : function( item_model ) {
        var item = this,
            module = item.item_module,
            _model = item_model || item.get(),
            _title = _.has( _model, 'title')? api.CZR_Helpers.capitalize( _model.title ) : _model.id;

        _title = api.CZR_Helpers.truncate(_title, 20);
        $( '.' + module.control.css_attr.view_title , item.container ).text(_title );
        api.CZR_Helpers.doActions('after_writeViewTitle', item.container , _model, item );
  },
  setViewVisibility : function( obj, is_added_by_user ) {
          var item = this,
              module = this.item_module;
          if ( is_added_by_user ) {
            item.czr_View.set( 'expanded_noscroll' );
          } else {
            module.closeAllViews( item.id );
            if ( _.has(module, 'czr_preItem') ) {
              module.czr_preItem('view_status').set( 'closed');
            }
            item.czr_View.set( 'expanded' == item._getViewState() ? 'closed' : 'expanded' );
          }
  },


  _getViewState : function() {
          return -1 == this.czr_View.get().indexOf('expanded') ? 'closed' : 'expanded';
  },
  _toggleViewExpansion : function( status, duration ) {
          var item = this,
              module = this.item_module;
          $( '.' + module.control.css_attr.view_content , item.container ).first().slideToggle( {
              duration : duration || 200,
              done : function() {
                var _is_expanded = 'closed' != status;

                item.container.toggleClass('open' , _is_expanded );
                module.closeAllAlerts();
                var $_edit_icon = $(this).siblings().find('.' + module.control.css_attr.edit_view_btn );

                $_edit_icon.toggleClass('active' , _is_expanded );
                if ( _is_expanded )
                  $_edit_icon.removeClass('fa-pencil').addClass('fa-minus-square').attr('title', serverControlParams.translatedStrings.close );
                else
                  $_edit_icon.removeClass('fa-minus-square').addClass('fa-pencil').attr('title', serverControlParams.translatedStrings.edit );
                if ( 'expanded' == status )
                  module._adjustScrollExpandedBlock( item.container );
              }//done callback
            } );
  },
  toggleRemoveAlertVisibility : function(obj) {
          var item = this,
              module = this.item_module,
              $_alert_el = $( '.' + module.control.css_attr.remove_alert_wrapper, item.container ),
              $_clicked = obj.dom_event;
          module.closeAllViews();
          if ( _.has(module, 'czr_preItem') ) {
            module.czr_preItem('view_status').set( 'closed');
          }
          $('.' + module.control.css_attr.remove_alert_wrapper, item.container ).not($_alert_el).each( function() {
            if ( $(this).hasClass('open') ) {
              $(this).slideToggle( {
                duration : 200,
                done : function() {
                  $(this).toggleClass('open' , false );
                  $(this).siblings().find('.' + module.control.css_attr.display_alert_btn).toggleClass('active' , false );
                }
              } );
            }
          });
          var alert_template = wp.template( module.viewAlertEl );
          if ( ! alert_template  || ! item.container )
            return this;

          $_alert_el.html( alert_template( item.get() ) );
          $_alert_el.slideToggle( {
            duration : 200,
            done : function() {
              var _is_open = ! $(this).hasClass('open') && $(this).is(':visible');
              $(this).toggleClass('open' , _is_open );
              $( obj.dom_el ).find('.' + module.control.css_attr.display_alert_btn).toggleClass( 'active', _is_open );
              if ( _is_open )
                module._adjustScrollExpandedBlock( item.container );
            }
          } );
  },
  _destroyView : function () {
          this.container.fadeOut( {
            duration : 400,
            done : function() {
              $(this).remove();
            }
          });
  },
});//$.extend
var CZRModuleMths = CZRModuleMths || {};

$.extend( CZRModuleMths, {

  initialize: function( id, options ) {
          if ( _.isUndefined(options.control) || _.isEmpty(options.control) ) {
            throw new Error('No control assigned to module ' + id + '. Aborting');
          }
          api.Value.prototype.initialize.call( this, null, options );

          var module = this;
          $.extend( module, options || {} );
          $.extend( module, {
              viewPreAddEl : '',
              viewTemplateEl : '',
              viewContentTemplateEl : '',
          } );
          module.set([]);//the module is a collection items => this is the collection
          if ( ! _.has( module.control.params, 'in_sektion' ) || ! module.control.params.in_sektion )
            module.container = $( module.control.selector );
          module.savedItems = options.items;
          module.defaultModuleModel = { id : '', title : '' };
          module.itemConstructor = api.CZRItem;
          module.inputConstructor = api.CZRInput;
          module.czr_Item = new api.Values();
  },
  ready : function() {
          var module = this;
          module.populateItemCollection()._makeItemsSortable();
          module.callbacks.add( function() { return module.moduleReact.apply(module, arguments ); } );
  },
  moduleReact : function( to, from ) {
          var module = this,
              control = module.control,
              _to_render = ( _.size(from) < _.size(to) ) ? _.difference(to,from)[0] : {},
              _to_remove = ( _.size(from) > _.size(to) ) ? _.difference(from, to)[0] : {},
              _item_updated = ( ( _.size(from) == _.size(to) ) && !_.isEmpty( _.difference(from, to) ) ) ? _.difference(from, to)[0] : {},
              _collection_sorted = _.isEmpty(_to_render) && _.isEmpty(_to_remove)  && _.isEmpty(_item_updated);
          if ( _collection_sorted ) {
                if ( _.has(module, 'czr_preItem') ) {
                  module.czr_preItem('view_status').set('closed');
                }
                module.closeAllViews();
                module.closeAllAlerts();
          }
          var _current_collection = control.czr_moduleCollection.get(),
              _current_module = _.findWhere( _current_collection, { id : module.id } ),
              _new_module = _.clone( _current_module );

          _new_module = $.extend( _new_module, { items : to } );

          console.log('IN MODULE REACT', _new_module );

          control.updateModulesCollection( {module : _new_module });
  },
  getModuleSection : function() {
          return this.section;
  }

});//$.extend//CZRBaseControlMths//MULTI CONTROL CLASS

var CZRModuleMths = CZRModuleMths || {};

$.extend( CZRModuleMths, {
  populateItemCollection : function() {
          var module = this;
          _.each( module.savedItems, function( item, key ) {
                item = module._normalizeItem(item, _.has( item, 'id' ) ? item.id : key );
                if ( false === item ) {
                  throw new Error('populateItemCollection : an item could not be added in : ' + module.id );
                }
                module.instantiateItem(item);
          });

          return this;
  },


  instantiateItem : function( item, is_added_by_user ) {
          if ( ! _.has( item,'id') ) {
            throw new Error('CZRModule::instantiateItem() : an item has no id and could not be added in the collection of : ' + this.id +'. Aborted.' );
          }
          var module = this;
          item =  ( _.has( item, 'id') && module._isItemIdPossible( item.id) ) ? item : module._initNewItem( item || {} );
          module.czr_Item.add( item.id, new module.itemConstructor( item.id, {
                id : item.id,
                initial_item_model : module.getInitialItemModel( item ),
                defaultItemModel : _.clone( module.defaultItemModel ),
                item_control : module.control,
                item_module : module,
                is_added_by_user : is_added_by_user || false
          } ) );
          module.updateItemsCollection( { item : module.getInitialItemModel( item ) } );
          module.czr_Item(item.id).callbacks.add( function() { return module.itemReact.apply(module, arguments ); } );

          module.trigger('item_instanciated', { item: item, is_added_by_user : is_added_by_user || false } );
  },
  getInitialItemModel : function( item ) {
          return item;
  },
  itemReact : function( to, from ) {
        var module = this;
        module.updateItemsCollection( {item : to });
  },
  updateItemsCollection : function( obj ) {
          var module = this,
              _current_collection = module.get();
              _new_collection = _.clone(_current_collection);
          if ( _.has( obj, 'collection' ) ) {
                module.set(obj.collection);
                return;
          }

          if ( ! _.has(obj, 'item') ) {
              throw new Error('updateItemsCollection, no item provided ' + module.control.id + '. Aborting');
          }
          var item = _.clone(obj.item);
          if ( _.findWhere( _new_collection, { id : item.id } ) ) {
                _.each( _current_collection , function( _item, _ind ) {
                      if ( _item.id != item.id )
                        return;
                      _new_collection[_ind] = item;
                });
          }
          else {
              _new_collection.push(item);
          }
          module.set(_new_collection);
  },
  _getSortedDOMCollection : function( ) {
          var module = this,
              _old_collection = _.clone( module.get() ),
              _new_collection = [],
              _index = 0;
          $( '.' + module.control.css_attr.inner_view, module.container ).each( function() {
              var _item = _.findWhere( _old_collection, {id: $(this).attr('data-id') });
              if ( ! _item )
                return;

              _new_collection[_index] = _item;

              _index ++;
          });
          if ( 0 === _new_collection.length )
              return _old_collection;
          if ( ! _.isEmpty( _.difference( _old_collection, _new_collection ) ) )
              return _old_collection;

          return _new_collection;
  }
});//$.extend//CZRBaseControlMths//MULTI CONTROL CLASS

var CZRModuleMths = CZRModuleMths || {};

$.extend( CZRModuleMths, {
  getDefaultModel : function( id ) {
          var module = this;
          return $.extend( _.clone( module.defaultItemModel ), { id : id || '' } );
  },
  _normalizeItem : function( item, key ) {
          if ( ! _.isObject(item) )
            return;
          item = this._initNewItem(item, key);
          return item;
  },
  _isItemIdPossible : function( _id ) {
          var module = this,
              _collection = _.clone( module.get() );
          return ! _.isEmpty(_id) && ! _.findWhere( _collection, { id : _id });
  },
  _initNewItem : function( _item , _next_key ) {
          var module = this,
              _new_item = { id : '' },
              _id;
          _next_key = 'undefined' != typeof(_next_key) ? _next_key : _.size( module.get() );

          if ( _.isNumber(_next_key) ) {
            _id = module.module_type + '_' + _next_key;
          }
          else {
            _id = _next_key;
            _next_key = 0;
          }

          if ( _item && ! _.isEmpty( _item) )
            _new_item = $.extend( _item, { id : _id } );
          else
            _new_item = this.getDefaultModel( _id );
          if ( _.has(_new_item, 'id') && module._isItemIdPossible(_id) ) {
            _.map( module.getDefaultModel() , function( value, property ){
              if ( ! _.has(_new_item, property) )
                _new_item[property] = value;
            });

            return _new_item;
          }
          return module._initNewItem( _new_item, _next_key + 1);
  }

});//$.extend//MULTI CONTROL CLASS
var CZRModuleMths = CZRModuleMths || {};
$.extend( CZRModuleMths, {
  getTemplateEl : function( type, model ) {
          var module = this, _el;
          switch(type) {
                case 'view' :
                  _el = module.viewTemplateEl;
                  break;
                case 'view-content' :
                  _el = module.viewContentTemplateEl;
                  break;
          }
          if ( _.isEmpty(_el) ) {
               throw new Error('No valid template has been found in getTemplateEl() ' + module.id + '. Aborting');
          } else {
              return _el;
          }
  },
  getViewEl : function( id ) {
          var module = this;
          return $( '[data-id = "' + id + '"]', module.container );
  },
  closeAllViews : function(id) {
          var module = this,
              _current_collection = _.clone( module.get() ),
              _filtered_collection = _.filter( _current_collection , function( mod) { return mod.id != id; } );

          _.each( _filtered_collection, function(_item) {
                if ( module.czr_Item.has(_item.id) && 'expanded' == module.czr_Item(_item.id)._getViewState(_item.id) )
                  module.czr_Item(_item.id).czr_View.set( 'closed' ); // => will fire the cb _toggleViewExpansion
           } );
  },
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
  closeAllAlerts : function() {
          var module = this;
          $('.' + module.control.css_attr.remove_alert_wrapper, module.container ).each( function() {
                if ( $(this).hasClass('open') ) {
                      $(this).slideToggle( {
                            duration : 100,
                            done : function() {
                              $(this).toggleClass('open' , false );
                              $(this).siblings().find('.' + module.control.css_attr.display_alert_btn).toggleClass('active' , false );
                            }
                      } );
                }
          });
  },
  _makeItemsSortable : function(obj) {
          if ( wp.media.isTouchDevice || ! $.fn.sortable )
            return;
          var module = this;
          $( '.' + module.control.css_attr.views_wrapper, module.container ).sortable( {
                handle: '.' + module.control.css_attr.sortable_handle,
                update: function( event, ui ) {
                    module.set( module._getSortedDOMCollection() );
                }
              }
          );
  }
});//$.extend//MULTI CONTROL CLASS

var CZRDynModuleMths = CZRDynModuleMths || {};

$.extend( CZRDynModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          api.CZRModule.prototype.initialize.call( module, id, options );
          $.extend( module, {
              viewAlertEl : 'czr-module-item-alert',
              viewPreAddEl : '',
          } );
          module.czr_preItem = new api.Values();
          module.czr_preItem.create('item');
          module.czr_preItem.create('view_content');
          module.czr_preItem.create('view_status');
          module.czr_preItem('view_status').set('closed');
          module.czr_preItemInput = new api.Values();
          module.itemAddedMessage = serverControlParams.translatedStrings.successMessage;
          module.module_event_map = [
                {
                  trigger   : 'click keydown',
                  selector  : [ '.' + module.control.css_attr.open_pre_add_btn, '.' + module.control.css_attr.cancel_pre_add_btn ].join(','),
                  name      : 'pre_add_item',
                  actions   : ['renderPreItemView','setPreItemViewVisibility'],
                },
                {
                  trigger   : 'click keydown',
                  selector  : '.' + module.control.css_attr.add_new_btn, //'.czr-add-new',
                  name      : 'add_item',
                  actions   : ['closeAllViews', 'addItem'],
                }
          ];//module.module_event_map
  },


  ready : function() {
          var module = this;
          module.setupDOMListeners( module.module_event_map , { dom_el : module.container } );
          module.czr_preItem('item').set( module.getDefaultModel() );
          module.czr_preItem('item').set( module.getDefaultModel() );
          module.czr_preItem('view_content').callbacks.add(function( to, from ) {
                if ( _.isUndefined(from) || _.isEmpty(from) ) {
                    module.preItemInputConstructor = module.inputConstructor;//api.CZRInput;
                    module.setupPreItemInputCollection();
                }
          });
          module.czr_preItem('view_status').callbacks.add( function( to, from ) {
                module._togglePreItemViewExpansion( to );
          });

          api.CZRModule.prototype.ready.call( module );
  },//ready()


  setupPreItemInputCollection : function() {
          var module = this;
          $('.' + module.control.css_attr.pre_add_wrapper, module.container).find( '.' + module.control.css_attr.sub_set_wrapper)
          .each( function(_index) {
                var _id = $(this).find('[data-type]').attr('data-type') || 'sub_set_' + _index;
                module.czr_preItemInput.add( _id, new module.preItemInputConstructor( _id, {
                    id : _id,
                    type : $(this).attr('data-input-type'),
                    container : $(this),
                    item : module.czr_preItem('item'),
                    module : module,
                    is_preItemInput : true
                } ) );
          });//each
  },
  addItem : function(obj) {
          var module = this,
              item = module.czr_preItem('item').get();

          console.log('in add item', module.czr_preItem('item').get() );

          if ( _.isEmpty(item) || ! _.isObject(item) ) {
            throw new Error('addItem : an item should be an object and not empty. In : ' + module.id +'. Aborted.' );
          }

          module.instantiateItem(item, true); //true == Added by user

          module.toggleSuccessMessage('on');
          setTimeout( function() {
                module.czr_preItem('view_status').set( 'closed');
                module.czr_preItem('item').set( module.getDefaultModel() );
                module.toggleSuccessMessage('off').destroyPreItemView();
          } , 2500 );

          module.trigger('item_added', item );
          if ( 'postMessage' == api(module.control.id).transport && _.has( obj, 'dom_event') && ! _.has( obj.dom_event, 'isTrigger' ) && ! api.CZR_Helpers.has_part_refresh( module.control.id ) ) {
            module.control.previewer.refresh();
          }
  }

});//$.extend//MULTI CONTROL CLASS

var CZRDynModuleMths = CZRDynModuleMths || {};

$.extend( CZRDynModuleMths, {

});//$.extend//CZRBaseControlMths//MULTI CONTROL CLASS

var CZRDynModuleMths = CZRDynModuleMths || {};

$.extend( CZRDynModuleMths, {
  renderPreItemView : function( obj ) {
          var module = this;
          if ( ! _.isEmpty( module.czr_preItem('view_content').get() ) )
            return;
          if ( ! _.has(module, 'viewPreAddEl') ||  0 === $( '#tmpl-' + module.viewPreAddEl ).length )
            return this;
          var pre_add_template = wp.template( module.viewPreAddEl );
          if ( ! pre_add_template  || ! module.container )
            return this;

          var $_pre_add_el = $('.' + module.control.css_attr.pre_add_view_content, module.container );
          $_pre_add_el.prepend( pre_add_template() );
          module.czr_preItem('view_content').set( pre_add_template() );
          module.trigger( 'pre_add_view_rendered' , {item : {}, dom_el : $_pre_add_el});
  },
  _getPreItemView : function() {
          var module = this;
          return $('.' +  module.control.css_attr.pre_add_view_content, module.container );
  },
  destroyPreItemView : function() {
          var module = this;
          $('.' +  module.control.css_attr.pre_add_view_content, module.container ).find('.' +  module.control.css_attr.sub_set_wrapper).remove();
          module.czr_preItem('view_content').set('');
  },
  setPreItemViewVisibility : function(obj) {
          var module = this;

          module.closeAllViews();
          module.czr_preItem('view_status').set( 'expanded' == module.czr_preItem('view_status').get() ? 'closed' : 'expanded' );
  },
  _togglePreItemViewExpansion : function( status) {
          var module = this,
            $_pre_add_el = $( '.' +  module.control.css_attr.pre_add_view_content, module.container );
          $_pre_add_el.slideToggle( {
            duration : 200,
            done : function() {
                  var _is_expanded = 'closed' != status,
                      $_btn = $( '.' +  module.control.css_attr.open_pre_add_btn, module.container );

                  $(this).toggleClass('open' , _is_expanded );
                  if ( _is_expanded )
                    $_btn.find('.fa').removeClass('fa-plus-square').addClass('fa-minus-square');
                  else
                    $_btn.find('.fa').removeClass('fa-minus-square').addClass('fa-plus-square');
                  $_btn.toggleClass( 'active', _is_expanded );
                  $( module.container ).toggleClass(  module.control.css_attr.adding_new, _is_expanded );
                  module._adjustScrollExpandedBlock( $(this), 120 );
            }//done
          } );
  },


  toggleSuccessMessage : function(status) {
          var module = this,
              _message = module.itemAddedMessage,
              $_pre_add_wrapper = $('.' + module.control.css_attr.pre_add_wrapper, module.container );
              $_success_wrapper = $('.' + module.control.css_attr.pre_add_success, module.container );

          if ( 'on' == status ) {
              $_success_wrapper.find('p').text(_message);
              $_success_wrapper.css('z-index', 1000001 )
                .css('height', $_pre_add_wrapper.height() + 'px' )
                .css('line-height', $_pre_add_wrapper.height() + 'px');
          } else {
              $_success_wrapper.attr('style','');
          }
          module.container.toggleClass('czr-model-added', 'on' == status );
          return this;
  }

});//$.extend//CZRBaseControlMths//extends api.CZRDynModule

var CZRSektionMths = CZRSektionMths || {};

$.extend( CZRSektionMths, {
  initialize: function( id, options ) {
          var module = this;
          api.CZRDynModule.prototype.initialize.call( module, id, options );
          $.extend( module, {
                viewPreAddEl : 'czr-module-sektion-pre-add-view-content',
                viewTemplateEl : 'czr-module-sektion-item-view',
                viewContentTemplateEl : 'czr-module-sektion-view-content',
          } );
          module.defaultItemModel = {
              id : '',
              'sektion-layout' : 1,
              columns : []
          };

          module.defaultColumnModel = {
            id : '',
            sektion : '',
            modules : [],
          };

          console.log('SEKTION MODULE ID', id );
          console.log('SAVED SEKTION ITEMS', module.savedItems );
          module.itemConstructor = api.CZRItem.extend( module.CZRSektionItem || {} );

          api.section( module.control.section() ).expanded.bind(function(to) {
                if ( ! to || ! _.isEmpty( module.get() ) )
                  return;
                module.ready();
          });

          if ( ! _.has( module ,'dragInstance' ) )
            module.initDragula();

  },//initialize
  getInitialItemModel : function( _sek ) {
          var module = this,
              _new_sektions = _.clone( module.savedItems ),
              _default_sektion = _.clone( module.defaultItemModel ),
              _def = _.clone( _default_sektion ),
              _new_sek = $.extend( _def, _sek ),
              _columns = [];

              if( _.isEmpty( _new_sek.columns ) ) {
                      console.log('IS EMPTY COLUMNS');
                      var _col_nb = parseInt(_new_sek['sektion-layout'] || 1, 10 );
                      for( i = 1; i < _col_nb + 1 ; i++ ) {
                            var _default_column = _.clone( module.defaultColumnModel ),
                                _new_col_model = {
                                      id : module.generateColId( _new_sek.id, i ),
                                      sektion : _new_sek.id
                                };
                                _col_model = $.extend( _default_column, _new_col_model );

                            _columns.push( _col_model);
                      }//for

                      _new_sek.columns = _columns;
              }//if

              return _new_sek;

  },
  itemReact : function( to, from ) {
        console.log('in sektion react', to, from );
        var module = this;
        module.updateItemsCollection( {item : to });
  },


  generateColId : function( sekId, index ) {
          return 'col_' + index + '_' + sekId;
  },


  initDragula : function() {
          var module = this;
          module.dragInstance = dragula({
              moves: function (el, source, handle, sibling) {
                  console.log("handle.className === 'czr-column'", handle.className === 'czr-column');
                   console.log('in moves cb', el, source, handle, sibling );
                  return handle.className === 'czr-column';
              },
              isContainer : function( el ) {
                return false;
              }
            }
          );
          module.dragInstance.on('over', function( el, container, source ) {
                if ( $(container).hasClass('czr-dragula-fake-container') ) {
                    _target_sekId = $(container).closest('[data-id]').attr('data-id');
                    console.log( 'taget sek', _target_sekId );
                    module.czr_Item(_target_sekId).czr_View.set('expanded');
                }
          });
          module.dragInstance.on('drag', function( el, source ){
                module.czr_Item.each( function( _sektion ){
                    _sektion.container.toggleClass('czr-show-fake-container', 'closed' == _sektion.czr_View.get() );
                });
          }).on('dragend', function( el, source ){
                module.czr_Item.each( function( _sektion ){
                    _sektion.container.removeClass('czr-show-fake-container');
                });
          }).on('drop', function(el, target, source, sibling ) {
                console.log('element ' + el + ' has been droped in :', target );
          });

          var scroll = autoScroller([
                     module.control.container.closest('.accordion-section-content')[0]
                  ],
                  {
                    direction: "vertical",
                    margin: 20,
                    pixels: 10,
                    scrollWhenOutside: true,
                    autoScroll: function(){
                        return this.down && module.dragInstance.dragging;
                    }
                  }
        );
  },//initDragula

});//extends api.CZRDynModule

var CZRSektionMths = CZRSektionMths || {};

$.extend( CZRSektionMths, {
  CZRSektionItem : {
          initialize: function(id, options ) {
                  var sekItem = this;

                  api.CZRItem.prototype.initialize.call( sekItem, null, options );
                  sekItem.czr_Column = new api.Values();

                  var _sektion_model = sekItem.get();
                  sekItem.czr_columnCollection = new api.Value();
                  sekItem.czr_columnCollection.set([]);

                  if ( ! _.has(_sektion_model, 'sektion-layout') ) {
                    throw new Error('In Sektion Item initialize, no layout provided for ' + sekItem.id + '. Aborting');
                  }

                  console.log('in sektion initial', options );
                  sekItem.embedded.done(function() {
                        console.log('sektion is embedded');
                        sekItem.czr_columnCollection.callbacks.add( function() { return sekItem.collectionReact.apply(sekItem, arguments ); } );

                        _.each( options.initial_item_model.columns , function( _column ) {
                              sekItem.instanciateColumn( _column );
                        });
                        sekItem.dragulizeSektion();
                  });
                  sekItem.contentRendered.done(function() {
                          console.log('sektion content is rendered');
                          sekItem.item_module.dragInstance.containers.push( $( '.czr-column-wrapper', sekItem.container )[0] );
                          sekItem.czr_View.callbacks.add( function(to) {
                                if ( 'closed' == to )
                                  return;
                                sekItem.container.removeClass('czr-show-fake-container');
                          });
                  });//embedded.done

          },

          dragulizeSektion : function() {
                  var sekItem = this,
                      module = this.item_module;
                      _drag_container = $( '.czr-dragula-fake-container', sekItem.container )[0];

                   module.dragInstance.containers.push( _drag_container );
          },


          instanciateColumn : function( column, is_added_by_user  ) {
                  var sekItem = this,
                      column_model = _.clone( column );
                  var _all_modules = api.control( api.CZR_Helpers.build_setId( 'module-collection') ).czr_moduleCollection.get(),
                      _column_modules = _.findWhere( _all_modules, { column_id : column.id });

                  if ( ! _.isEmpty( _column_modules) ) {
                    console.log('HAS COLUMN MODULES?', column.id, _column_modules );
                    console.log('column_model', column_model );
                  }
                  sekItem.czr_Column.add( column.id , new api.CZRColumn( column.id, {
                        id : column.id,
                        initial_column_model : column_model,
                        sektion : sekItem,
                        module : sekItem.item_module.id,
                        control : sekItem.item_module.control.id,
                        is_added_by_user : is_added_by_user || false
                  } ) );
                  sekItem.updateColumnCollection( {column : column_model });
          },
          updateColumnCollection : function( obj ) {
                  var sekItem = this,
                      _current_collection = sekItem.czr_columnCollection.get();
                      _new_collection = _.clone(_current_collection);
                  if ( _.has( obj, 'collection' ) ) {
                        sekItem.czr_columnCollection.set(obj.collection);
                        return;
                  }

                  if ( ! _.has(obj, 'column') ) {
                    throw new Error('updateColumnCollection, no column provided in sektion ' + sekItem.id + '. Aborting');
                  }
                  var column = _.clone(obj.column);

                  if ( ! _.has(column, 'id') ) {
                    throw new Error('updateColumnCollection, no id provided for a column in sektion' + sekItem.id + '. Aborting');
                  }
                  if ( _.findWhere( _new_collection, { id : column.id } ) ) {
                        _.each( _current_collection , function( _elt, _ind ) {
                              if ( _elt.id != column.id )
                                return;
                              _new_collection[_ind] = column;
                        });
                  }
                  else {
                        _new_collection.push(column);
                  }
                  sekItem.czr_columnCollection.set(_new_collection);
          },
          collectionReact : function( to, from ) {
                console.log('in sektion collection react', to, from );
                var sekItem = this,
                    _to_render = ( _.size(from) < _.size(to) ) ? _.difference(to,from)[0] : {},
                    _to_remove = ( _.size(from) > _.size(to) ) ? _.difference(from, to)[0] : {},
                    _module_updated = ( ( _.size(from) == _.size(to) ) && !_.isEmpty( _.difference(from, to) ) ) ? _.difference(from, to)[0] : {},
                    is_module_update = _.isEmpty( _module_updated ),
                    is_collection_sorted = _.isEmpty(_to_render) && _.isEmpty(_to_remove)  && ! is_module_update;
                var _current_sek_model = sekItem.get(),
                    _new_sek_model = _.clone( _current_sek_model );

                _new_sek_model.columns = to;
                console.log('_new_sek_model', _new_sek_model );
                sekItem.set( _new_sek_model );
          },
  }//Sektion

});
var CZRColumnMths = CZRColumnMths || {};
$.extend( CZRColumnMths , {
    initialize: function( name, options ) {
          var column = this;
          api.Value.prototype.initialize.call( column, null, options );
          $.extend( column, options || {} );

          column.embedded = $.Deferred();
          column.czr_columnModuleCollection = new api.Value();
          column.czr_columnModuleCollection.set([]);
          column.set( column.initial_column_model );

          console.log( 'column.initial_column_model', column.initial_column_model);
          console.log( 'column options', options );
          column.sektion.contentRendered.done(function() {
                column.container = column.render();
                column.embedded.resolve();

          });
          column.column_event_map = [
                {
                  trigger   : 'click keydown',
                  selector  : '.add-new-module',
                  name      : 'add_new_module',
                  actions   : ['userAddedModule'],
                },
          ];//module.module_event_map
          column.embedded.done(function() {
                console.log('in column embedded', column.get() );
                _.each( column.get().modules, function( _mod ) {
                          api.control( api.CZR_Helpers.build_setId( 'module-collection') ).trigger(
                                  'db-module-candidate',
                                  {
                                      id : _mod.id,
                                      sektion : column.sektion
                                  }
                          );
                } );
                column.callbacks.add( function() { return column.columnReact.apply(column, arguments ); } );
                column.czr_columnModuleCollection.callbacks.add( function() { return column.columnModuleCollectionReact.apply(column, arguments ); } );
                api.CZR_Helpers.setupDOMListeners(
                    column.column_event_map,//actions to execute
                    { dom_el : column.container },//dom scope
                    column//instance where to look for the cb methods
                );
          });
    },

    populatesModulesCollection : function() {

    },
    render : function() {
          var column   = this;
          $view     = $( wp.template('czr-sektion-column')( {id: column.id}) );
          $view.appendTo( $('.czr-column-wrapper', column.sektion.container ) );
          return $view;
    },
    columnReact : function( to ,from ) {
          this.sektion.updateColumnCollection( {column : to });
    },
    userAddedModule : function( obj, module_id   ) {
          var column = this;
          api.control( api.CZR_Helpers.build_setId( 'module-collection') ).trigger(
              'user-module-candidate',
              {
                  id : '',//will be populated by the module collection class
                  module_type : 'czr_text_module',
                  column_id : column.id,
                  sektion : column.sektion,
                  items : [],
                  is_added_by_user : true
              }
          );

    },


    updateColumnModuleCollection : function( obj ) {
            var column = this,
                _current_collection = column.czr_columnModuleCollection.get();
                _new_collection = _.clone( _current_collection );
            if ( _.has( obj, 'collection' ) ) {
                  column.czr_columnModuleCollection.set(obj.collection);
                  return;
            }

            if ( ! _.has(obj, 'module') ) {
              throw new Error('updateColumnModuleCollection, no module provided in column ' + column.id + '. Aborting');
            }

            var module = _.clone(obj.module);

            if ( ! _.has(column, 'id') ) {
              throw new Error('updateColumnModuleCollection, no id provided for a module in column' + column.id + '. Aborting');
            }
            if ( _.findWhere( _new_collection, { id : module.id } ) ) {
                  _.each( _current_collection , function( _elt, _ind ) {
                        if ( _elt.id != module.id )
                          return;
                        _new_collection[_ind] = module;
                  });
            }
            else {
                  _new_collection.push(module);
            }
            column.czr_columnModuleCollection.set(_new_collection);
    },

    columnModuleCollectionReact : function( to, from ) {
            var column = this,
                _current_column_model = column.get(),
                _new_column_model = _.clone( _current_column_model ),
                _new_module_collection = [];

            _.each( to , function( _mod, _key ) {
                _new_module_collection[_key] = { id : _mod.id };
            });
            _new_column_model.modules = _new_module_collection;
            column.set( _new_column_model );
    },


});//$.extend//extends api.CZRDynModule

var CZRSocialModuleMths = CZRSocialModuleMths || {};

$.extend( CZRSocialModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          api.CZRDynModule.prototype.initialize.call( module, id, options );
          $.extend( module, {
                viewPreAddEl : 'czr-module-social-pre-add-view-content',
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-social-view-content',
          } );


          this.social_icons = [
            '500px','adn','amazon','android','angellist','apple','behance','behance-square','bitbucket','bitbucket-square','black-tie','btc','buysellads','chrome','codepen','codiepie','connectdevelop','contao','dashcube','delicious','delicious','deviantart','digg','dribbble','dropbox','drupal','edge','empire','expeditedssl','facebook','facebook','facebook-f (alias)','facebook-official','facebook-square','firefox','flickr','fonticons','fort-awesome','forumbee','foursquare','get-pocket','gg','gg-circle','git','github','github','github-alt','github-square','git-square','google','google','google-plus','google-plus-square','google-wallet','gratipay','hacker-news','houzz','instagram','internet-explorer','ioxhost','joomla','jsfiddle','lastfm','lastfm-square','leanpub','linkedin','linkedin','linkedin-square','linux','maxcdn','meanpath','medium','mixcloud','modx','odnoklassniki','odnoklassniki-square','opencart','openid','opera','optin-monster','pagelines','paypal','pied-piper','pied-piper-alt','pinterest','pinterest-p','pinterest-square','product-hunt','qq','rebel','reddit','reddit-alien','reddit-square','renren','rss','rss-square','safari','scribd','sellsy','share-alt','share-alt-square','shirtsinbulk','simplybuilt','skyatlas','skype','slack','slideshare','soundcloud','spotify','stack-exchange','stack-overflow','steam','steam-square','stumbleupon','stumbleupon','stumbleupon-circle','tencent-weibo','trello','tripadvisor','tumblr','tumblr-square','twitch','twitter','twitter','twitter-square','usb','viacoin','vimeo','vimeo-square','vine','vk','weibo','weixin','whatsapp','wikipedia-w','windows','wordpress','xing','xing-square','yahoo','yahoo','y-combinator','yelp','youtube','youtube-play','youtube-square'
          ];
          module.inputConstructor = api.CZRInput.extend( module.CZRSocialsInputMths || {} );
          module.itemConstructor = api.CZRItem.extend( module.CZRSocialsItem || {} );
          this.defaultItemModel = {
                id : '',
                title : '' ,
                'social-icon' : '',
                'social-link' : '',
                'social-color' : serverControlParams.social_el_params.defaultSocialColor,
                'social-target' : 1
          };
          this.itemAddedMessage = serverControlParams.translatedStrings.socialLinkAdded;
          api.section( module.control.section() ).expanded.bind(function(to) {
                if ( ! to || ! _.isEmpty( module.get() ) )
                  return;
                module.ready();
          });
  },//initialize



  CZRSocialsInputMths : {
          ready : function() {
                  var input = this;
                  input.bind('social-icon:changed', function(){
                      input.updateItemModel();
                  });
                  api.CZRInput.prototype.ready.call( input);
          },


          setupSelect : function() {
                var input      = this,
                    item = input.item,
                    module     = input.module,
                    socialList = module.social_icons,
                    _model = item.get();
                if ( _.isEmpty(_model.id) ) {
                  socialList = _.union( [serverControlParams.translatedStrings.selectSocialIcon], socialList );
                }
                _.each( socialList , function( icon_name, k ) {
                      var _value = ( 0 === k ) ? '' : 'fa-' + icon_name.toLowerCase(),
                          _attributes = {
                            value : _value,
                            html: api.CZR_Helpers.capitalize(icon_name)
                          };
                      if ( _value == _model['social-icon'] )
                        $.extend( _attributes, { selected : "selected" } );

                      $( 'select[data-type="social-icon"]', input.container ).append( $('<option>', _attributes) );
                });

                function addIcon( state ) {
                      if (! state.id) { return state.text; }
                      var $state = $(
                        '<span class="fa ' + state.element.value.toLowerCase() + '">&nbsp;&nbsp;' + state.text + '</span>'
                      );
                      return $state;
                }
                $( 'select[data-type="social-icon"]', input.container ).select2( {
                        templateResult: addIcon,
                        templateSelection: addIcon
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

        setupColorPicker : function( obj ) {
                var input      = this,
                    item = input.item,
                    module     = input.module;

                $( 'input[data-type="social-color"]', input.container ).wpColorPicker( {
                          defaultColor : 'rgba(255,255,255,0.7)',
                          change : function( e, o ) {
                                if ( _.has(o, 'color') && 16777215 == o.color._color )
                                  $(this).val( 'rgba(255,255,255,0.7)' );
                                else
                                  $(this).val( o.color.toString() );

                                $(this).trigger('colorpickerchange');
                          }
                });
                $( 'input[data-type="social-color"]', input.container ).closest('div').on('click keydown', function() {
                      module._adjustScrollExpandedBlock( input.container );
                });
        },
        updateItemModel : function( _new_val ) {
                var input = this,
                    item = this.item,
                    is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput;
                if ( ! _.has( item.get(), 'social-icon') || _.isEmpty( item.get()['social-icon'] ) )
                  return;

                var _new_model  = _.clone( item.get() ),
                    _new_title  = api.CZR_Helpers.capitalize( _new_model['social-icon'].replace('fa-', '') ),
                    _new_color  = serverControlParams.social_el_params.defaultSocialColor,
                    inputCollection = is_preItemInput ? input.module.czr_preItemInput : item.czr_Input;
                _new_title = [ serverControlParams.translatedStrings.followUs, _new_title].join(' ');

                if ( is_preItemInput ) {
                  _new_model = $.extend( _new_model, { title : _new_title, 'social-color' : _new_color } );
                  item.set( _new_model );
                } else {
                  item.czr_Input('title').set( _new_title );
                  item.czr_Input('social-link').set( '' );
                  item.czr_Input('social-color').set( _new_color );
                }

        },

  },//CZRSocialsInputMths




  CZRSocialsItem : {
          _buildTitle : function( title, icon, color ) {
                  var item = this,
                      module     = item.item_module;

                  title = title || ( 'string' === typeof(icon) ? api.CZR_Helpers.capitalize( icon.replace( 'fa-', '') ) : '' );
                  title = api.CZR_Helpers.truncate(title, 20);
                  icon = icon || 'fa-' + module.social_icons[0];
                  color = color || serverControlParams.social_el_params.defaultSocialColor;

                  return '<div><span class="fa ' + icon + '" style="color:' + color + '"></span> ' + title + '</div>';
          },
          writeItemViewTitle : function( model ) {
                  var item = this,
                      module     = item.item_module,
                      _model = model || item.get(),
                      _title = api.CZR_Helpers.capitalize( _model['social-icon'].replace('fa-', '') );

                  $( '.' + module.control.css_attr.view_title , item.container ).html(
                    item._buildTitle( _title, _model['social-icon'], _model['social-color'] )
                  );
          }

  },//CZRSocialsItem

});

var CZRWidgetAreaModuleMths = CZRWidgetAreaModuleMths || {};

$.extend( CZRWidgetAreaModuleMths, {
  initialize: function( id, options ) {
          var module = this;

          api.CZRDynModule.prototype.initialize.call( this, id, options );
          $.extend( module, {
                viewPreAddEl : 'czr-module-widgets-pre-add-view-content',
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-widgets-view-content',
          } );
          module.inputConstructor = api.CZRInput.extend( module.CZRWZonesInputMths || {} );
          module.itemConstructor = api.CZRItem.extend( module.CZRWZonesItem || {} );

          module.serverParams = serverControlParams.widget_area_el_params || {};
          module.contexts = _.has( module.serverParams , 'sidebar_contexts') ? module.serverParams.sidebar_contexts : {};
          module.context_match_map = {
                  is_404 : '404',
                  is_category : 'archive-category',
                  is_home : 'home',
                  is_page : 'page',
                  is_search : 'search',
                  is_single : 'single'
          };
          module.savedItems = _.union(
                  _.has(module.serverParams, 'default_zones') ? module.serverParams.default_zones : [],
                  module.savedItems
          );

          module.locations = _.has( module.serverParams , 'sidebar_locations') ? module.serverParams.sidebar_locations : {};
          module.defaultItemModel = {
                  id : '',
                  title : serverControlParams.translatedStrings.widgetZone,
                  contexts : _.without( _.keys(module.contexts), '_all_' ),//the server list of contexts is an object, we only need the keys, whitout _all_
                  locations : [ module.serverParams.defaultWidgetLocation ],
                  description : ''
          };
          this.itemAddedMessage = serverControlParams.translatedStrings.widgetZoneAdded;
          this.listenToSidebarInsights();
          module.czr_preItem.create('location_alert_view_state');
          module.czr_preItem('location_alert_view_state').set('closed');
          module.czr_preItem('location_alert_view_state').callbacks.add( function( to, from ) {
                    module._toggleLocationAlertExpansion( module.container, to );
          });
          module.bind( 'item_added', function( model ) {
                  module.addWidgetSidebar( model );
          });

          module.bind( 'item_removed' , function(model) {
                  module.removeWidgetSidebar( model );
          });
          var fixTopMargin = new api.Values();
          fixTopMargin.create('fixed_for_current_session');
          fixTopMargin.create('value');

          api.section(module.serverParams.dynWidgetSection).fixTopMargin = fixTopMargin;
          api.section(module.serverParams.dynWidgetSection).fixTopMargin('fixed_for_current_session').set(false);
          api.section(module.serverParams.dynWidgetSection).expanded.callbacks.add( function() { return module.widgetSectionReact.apply(module, arguments ); } );
          api.panel('widgets').expanded.callbacks.add( function(to, from) {
                module.widgetPanelReact();//setup some visual adjustments, must be ran each time panel is closed or expanded
                if ( ! to || ! _.isEmpty( module.get() ) )
                    return;
                module.ready();
          });
  },//initialize
  ready : function() {
          var module = this;
          api.CZRDynModule.prototype.ready.call( module );
          module.czr_preItem('view_status').callbacks.add( function( to, from ) {
                if ( 'expanded' != to )
                  return;
                module.czr_preItemInput('locations')._setupLocationSelect( true );//true for refresh
                module.czr_preItemInput('locations').mayBeDisplayModelAlert();
          });
  },












  CZRWZonesInputMths : {
          ready : function() {
                  var input = this;

                  input.bind('locations:changed', function(){
                      input.mayBeDisplayModelAlert();
                  });

                  api.CZRInput.prototype.ready.call( input);
          },
          setupSelect : function() {
                  var input      = this;
                  if ( 'locations' == this.id )
                    this._setupLocationSelect();
                  if ( 'contexts' == this.id )
                    this._setupContextSelect();

          },
          _setupContextSelect : function() {
                  var input      = this,
                      input_contexts = input.get(),
                      item = input.item,
                      module     = input.module;
                  _.each( module.contexts, function( title, key ) {
                        var _attributes = {
                              value : key,
                              html: title
                            };
                        if ( key == input_contexts || _.contains( input_contexts, key ) )
                          $.extend( _attributes, { selected : "selected" } );

                        $( 'select[data-type="contexts"]', input.container ).append( $('<option>', _attributes) );
                  });
                  $( 'select[data-type="contexts"]', input.container ).select2();
          },
          _setupLocationSelect : function(refresh ) {
                  var input      = this,
                      input_locations = input.get(),
                      item = input.item,
                      module     = input.module,
                      available_locs = api.sidebar_insights('available_locations').get();
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
                          '<span class="czr-unavailable-location fa fa-ban" title="' + serverControlParams.translatedStrings.unavailableLocation + '">&nbsp;&nbsp;' + state.text + '</span>'
                        );
                        return $state;
                  }

                  if ( refresh ) {
                        $( 'select[data-type="locations"]', input.container ).select2( 'destroy' );
                  }
                  $( 'select[data-type="locations"]', input.container ).select2( {
                    templateResult: setAvailability,
                    templateSelection: setAvailability
                  });
          },
          mayBeDisplayModelAlert : function() {
                  var input      = this,
                      item = input.item,
                      module     = input.module;
                  if ( ! _.has( item.get(), 'locations') || _.isEmpty( item.get()['locations'] ) )
                    return;

                  var _selected_locations = $('select[data-type="locations"]', input.container ).val(),
                      available_locs = api.sidebar_insights('available_locations').get(),
                      _unavailable = _.filter( _selected_locations, function( loc ) {
                        return ! _.contains(available_locs, loc);
                      });
                  if ( ! _.has( item.get(), 'id' ) || _.isEmpty( item.get().id ) ) {
                        module.czr_preItem('location_alert_view_state').set( ! _.isEmpty( _unavailable ) ? 'expanded' : 'closed' );
                  } else {
                        item.czr_itemLocationAlert.set( ! _.isEmpty( _unavailable ) ? 'expanded' : 'closed' );
                  }
          }
  },//CZRWZonesInputMths















  CZRWZonesItem : {
          initialize : function( id, options ) {
                  var item = this,
                      module = item.item_module;
                  item.czr_itemLocationAlert = new api.Value();

                  api.CZRItem.prototype.initialize.call( item, null, options );
          },
          setupView : function() {
                  var item = this,
                      module = item.item_module;
                  api.CZRItem.prototype.setupView.call(item);
                  item.czr_itemLocationAlert.set('closed');
                  item.czr_itemLocationAlert.callbacks.add( function( to, from ) {
                        module._toggleLocationAlertExpansion( item.container , to );
                  });
                  item.writeSubtitleInfos(item.get());
                  item.czr_View.callbacks.add( function( to, from ) {
                        if ( -1 == to.indexOf('expanded') )//can take the expanded_noscroll value !
                          return;
                        item.czr_Input('locations')._setupLocationSelect( true );//true for refresh
                        item.czr_Input('locations').mayBeDisplayModelAlert();
                  });
          },
          itemInternalReact : function(to, from) {
                  var item = this;
                  api.CZRItem.prototype.itemInternalReact.call(item, to, from);

                  item.writeSubtitleInfos(to);
                  item.updateSectionTitle(to).setModelUpdateTimer();
          },
          writeSubtitleInfos : function(model) {
                  var item = this,
                      module = item.item_module,
                      _model = _.clone( model || item.get() ),
                      _locations = [],
                      _contexts = [],
                      _html = '';

                  if ( ! item.container.length )
                    return this;
                  _model.locations =_.isString(_model.locations) ? [_model.locations] : _model.locations;
                  _.each( _model.locations, function( loc ) {
                        if ( _.has( module.locations , loc ) )
                          _locations.push(module.locations[loc]);
                        else
                          _locations.push(loc);
                    }
                  );
                  _model.contexts =_.isString(_model.contexts) ? [_model.contexts] : _model.contexts;
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
                  var _locationText = serverControlParams.translatedStrings.locations,
                      _contextText = serverControlParams.translatedStrings.contexts,
                      _notsetText = serverControlParams.translatedStrings.notset;

                  _locations = _.isEmpty( _locations ) ? '<span style="font-weight: bold;">' + _notsetText + '</span>' : _locations.join(', ');
                  _contexts = _.isEmpty( _contexts ) ? '<span style="font-weight: bold;">' + _notsetText + '</span>' : _contexts.join(', ');

                  _html = '<u>' + _locationText + '</u> : ' + _locations + ' <strong>|</strong> <u>' + _contextText + '</u> : ' + _contexts;

                  if ( ! $('.czr-zone-infos', item.container ).length ) {
                        var $_zone_infos = $('<div/>', {
                          class : [ 'czr-zone-infos' , module.control.css_attr.sortable_handle ].join(' '),
                          html : _html
                        });
                        $( '.' + module.control.css_attr.view_buttons, item.container ).after($_zone_infos);
                  } else {
                        $('.czr-zone-infos', item.container ).html(_html);
                  }

                  return this;
          },//writeSubtitleInfos
          updateSectionTitle : function(model) {
                  var _sidebar_id = 'sidebar-widgets-' + model.id,
                      _new_title  = model.title;
                  if ( ! api.section.has(_sidebar_id) )
                    return this;
                  $('.accordion-section-title', api.section(_sidebar_id).container ).text(_new_title);
                  $('.customize-section-title h3', api.section(_sidebar_id).container ).html(
                    '<span class="customize-action">' + api.section(_sidebar_id).params.customizeAction + '</span>' + _new_title
                  );
                  return this;
          },
          setModelUpdateTimer : function() {
                  var item = this,
                      module = item.item_module;

                  clearTimeout( $.data(this, 'modelUpdateTimer') );
                  $.data(
                      this,
                      'modelUpdateTimer',
                      setTimeout( function() {
                          module.control.refreshPreview();
                      } , 1000)
                  );//$.data
          },
          _hasModelAllContexts : function( model ) {
                  var item = this,
                      module = item.item_module,
                      moduleContexts = _.keys(module.contexts);

                  model = model || this.get();

                  if ( ! _.has(model, 'contexts') )
                    return;

                  if ( _.contains( model.contexts, '_all_') )
                    return true;
                  return _.isEmpty( _.difference( _.without(moduleContexts, '_all_') , model.contexts ) );
          },
          _getMatchingContexts : function( defaults ) {
                  var module = this,
                      _current = api.czr_wp_conditionals.get() || {},
                      _matched = _.filter(module.context_match_map, function( hu, wp ) { return true === _current[wp]; });

                  return _.isEmpty( _matched ) ? defaults : _matched;

          }
  },//CZRWZonesItem
  addWidgetSidebar : function( model, sidebar_data ) {
          if ( ! _.isObject(model) && _.isEmpty(sidebar_data) ) {
            throw new Error('No valid input were provided to add a new Widget Zone.');
          }
          var module = this,
              _model        = ! _.isEmpty(model) ? _.clone(model) : sidebar_data,
              _new_sidebar  = _.isEmpty(model) ? sidebar_data : $.extend(
                _.clone( _.findWhere( api.Widgets.data.registeredSidebars, { id: module.serverParams.defaultWidgetSidebar } ) ),
                {
                  name : _model.title,
                  id : _model.id
                }
              );
          api.Widgets.registeredSidebars.add( _new_sidebar );
          var _params = $.extend(
                  _.clone( api.section( "sidebar-widgets-" + module.serverParams.defaultWidgetSidebar ).params ),
                  {
                    id : "sidebar-widgets-" + _model.id,
                    instanceNumber: _.max(api.settings.sections, function(sec){ return sec.instanceNumber; }).instanceNumber + 1,
                    sidebarId: _new_sidebar.id,
                    title: _new_sidebar.name,
                    description : 'undefined' != typeof(sidebar_data) ? sidebar_data.description : api.section( "sidebar-widgets-" + module.serverParams.defaultWidgetSidebar ).params.description,
                    priority: _.max( _.omit( api.settings.sections, module.serverParams.dynWidgetSection), function(sec){ return sec.instanceNumber; }).priority + 1,
                  }
          );

          api.section.add( _params.id, new api.sectionConstructor[ _params.type ]( _params.id ,{ params : _params } ) );
          api.settings.sections[ _params.id ] = _params.id;
          var _new_set_id = 'sidebars_widgets['+_model.id+']',
              _new_set    = $.extend(
                _.clone( api.settings.settings['sidebars_widgets[' + module.serverParams.defaultWidgetSidebar + ']'] ),
                {
                  value:[]
                }
              );
          api.settings.settings[ _new_set_id ] = _new_set;
          api.create( _new_set_id, _new_set_id, _new_set.value, {
                  transport: _new_set.transport,
                  previewer: api.previewer,
                  dirty: false
          } );
          var _cloned_control = $.extend(
                    _.clone( api.settings.controls['sidebars_widgets[' + module.serverParams.defaultWidgetSidebar + ']'] ),
                    {
                      settings : { default : _new_set_id }
                }),
              _new_control = {};
          _.each( _cloned_control, function( param, key ) {
                  if ( 'string' == typeof(param) ) {
                    param = param.replace( module.serverParams.defaultWidgetSidebar , _model.id );
                  }
                  _new_control[key] = param;
          });
          _new_control.instanceNumber = _.max(api.settings.controls, function(con){ return con.instanceNumber; }).instanceNumber + 1;
          api.settings.controls[_new_set_id] = _new_control;
          api.control.add( _new_set_id, new api.controlConstructor[ _new_control.type ]( _new_set_id, {
                  params: _new_control,
                  previewer: api.previewer
          } ) );
          if ( _.has(this, 'container') )
            this.container.trigger( 'widget_zone_created', { model : _model, section_id : "sidebar-widgets-" + _model.id , setting_id : _new_set_id });

  },//addWidgetSidebar
  removeWidgetSidebar : function( model ) {
          if ( ! _.isObject(model) || _.isEmpty(model) ) {
            throw new Error('No valid data were provided to remove a Widget Zone.');
          }
          api.Widgets.registeredSidebars.remove( model.id );
          if ( api.section.has("sidebar-widgets-" + model.id) ) {
                  api.section("sidebar-widgets-" + model.id).container.remove();
                  api.section.remove( "sidebar-widgets-" + model.id );
                  delete api.settings.sections[ "sidebar-widgets-" + model.id ];
          }
          if ( api.has('sidebars_widgets['+model.id+']') ) {
                  api.remove( 'sidebars_widgets['+model.id+']' );
                  delete api.settings.settings['sidebars_widgets['+model.id+']'];
          }
          if ( api.control.has('sidebars_widgets['+model.id+']') ) {
                  api.control( 'sidebars_widgets['+model.id+']' ).container.remove();
                  api.control.remove( 'sidebars_widgets['+model.id+']' );
                  delete api.settings.controls['sidebars_widgets['+model.id+']'];
          }
          this.module.trigger('widget_zone_removed', { model : model, section_id : "sidebar-widgets-" + model.id , setting_id : 'sidebars_widgets['+model.id+']' });
  },
  widgetPanelReact : function() {
          var module = this;
          var _top_margin = api.panel('widgets').container.find( '.control-panel-content' ).css('margin-top');
          api.section(module.serverParams.dynWidgetSection).fixTopMargin('value').set( _top_margin );

          var _section_content = api.section(module.serverParams.dynWidgetSection).container.find( '.accordion-section-content' ),
            _panel_content = api.panel('widgets').container.find( '.control-panel-content' ),
            _set_margins = function() {
                  _section_content.css( 'margin-top', '' );
                  _panel_content.css('margin-top', api.section(module.serverParams.dynWidgetSection).fixTopMargin('value').get() );
            };
          api.bind( 'pane-contents-reflowed', _.debounce( function() {
                  _set_margins();
          }, 150 ) );
          module.closeAllViews();
          module.czr_preItem('view_status').set('closed');
  },//widgetPanelReact()
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
            sectionTitle.attr( 'tabindex', '0' );
            content.css( 'margin-top', '' );
            container.scrollTop( 0 );
          }

          module.closeAllViews();

          content.slideToggle();
  },
  listenToSidebarInsights : function() {
          var module = this;
          api.sidebar_insights('registered').callbacks.add( function( _registered_zones ) {
                  var _current_collection = _.clone( module.get() );
                  _.map(_current_collection, function( _model ) {
                    if ( ! module.getViewEl(_model.id).length )
                      return;

                    module.getViewEl(_model.id).css('display' , _.contains( _registered_zones, _model.id ) ? 'block' : 'none' );
                  });
          });
          api.sidebar_insights('inactives').callbacks.add( function( _inactives_zones ) {
                  var _current_collection = _.clone( module.get() );
                  _.map(_current_collection, function( _model ) {
                    if ( ! module.getViewEl(_model.id).length )
                      return;

                    if ( _.contains( _inactives_zones, _model.id ) ) {
                      module.getViewEl( _model.id ).addClass('inactive');
                      if ( ! module.getViewEl( _model.id ).find('.czr-inactive-alert').length )
                        module.getViewEl( _model.id ).find('.czr-view-title').append(
                          $('<span/>', {class : "czr-inactive-alert", html : " [ " + serverControlParams.translatedStrings.inactiveWidgetZone + " ]" })
                        );
                    }
                    else {
                      module.getViewEl( _model.id ).removeClass('inactive');
                      if ( module.getViewEl( _model.id ).find('.czr-inactive-alert').length )
                        module.getViewEl( _model.id ).find('.czr-inactive-alert').remove();
                    }
                  });
          });
          api.sidebar_insights('candidates').callbacks.add( function(_candidates) {
                  if ( ! _.isArray(_candidates) )
                    return;
                  _.map( _candidates, function( _sidebar ) {
                    if ( ! _.isObject(_sidebar) )
                      return;
                    if ( api.section.has("sidebar-widgets-" +_sidebar.id ) )
                      return;
                    api.CZRWidgetAreasControl.prototype.addWidgetSidebar( {}, _sidebar );
                    if ( _.has( api.sidebar_insights('actives').get(), _sidebar.id ) && api.section.has("sidebar-widgets-" +_sidebar.id ) )
                      api.section( "sidebar-widgets-" +_sidebar.id ).activate();
                  });
          });
  },//listenToSidebarInsights()
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
  getDefaultModel : function(id) {
          var module = this,
              _current_collection = module.get(),
              _default = _.clone( module.defaultItemModel ),
              _default_contexts = _default.contexts;
          return $.extend( _default, {
              title : 'Widget Zone ' +  ( _.size(_current_collection)*1 + 1 )
            });
  },
  getTemplateEl : function( type, model ) {
          var module = this, _el;
          if ( 'view' == type ) {
            type = ( _.has(model, 'is_builtin') && model.is_builtin ) ? 'view-reduced' : type;
          } else if ( 'view-content' == type ) {
            type = ( _.has(model, 'is_builtin') && model.is_builtin ) ? 'view-content-reduced' : type;
          }

          switch(type) {
                case 'view' :
                  _el = module.viewTemplateEl;
                  break;
                case 'view-content' :
                  _el = module.viewContentTemplateEl;
                  break;
                case 'view-reduced' :
                  _el = 'czr-module-widgets-view-reduced';
                  break;
                case 'view-content-reduced' :
                  _el = 'czr-module-widgets-view-content-reduced';
                  break;
          }

          if ( _.isEmpty(_el) ) {
            throw new Error( 'No valid template has been found in getTemplateEl()' );
          } else {
            return _el;
          }
  },






  _toggleLocationAlertExpansion : function($view, to) {
          var $_alert_el = $view.find('.czr-location-alert');

          if ( ! $_alert_el.length ) {
                var _html = [
                  '<span>' + serverControlParams.translatedStrings.locationWarning + '</span>',
                  api.CZR_Helpers.getDocSearchLink( serverControlParams.translatedStrings.locationWarning ),
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


});//$.extend()//extends api.CZRDynModule

var CZRFeaturedPageModuleMths = CZRFeaturedPageModuleMths || {};

$.extend( CZRFeaturedPageModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          api.CZRDynModule.prototype.initialize.call( module, id, options );
          $.extend( module, {
                viewPreAddEl : 'czr-module-fp-pre-add-view-content',
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-fp-view-content',
          } );
          module.inputConstructor = api.CZRInput.extend( module.CZRFeaturedPagesInputMths || {} );
          module.itemConstructor = api.CZRItem.extend( module.CZRFeaturedPagesItem || {} );
          this.defaultItemModel = {
              id : '',
              title : '' ,
              'fp-post'  : '',
              'fp-title' : '',
              'fp-text'  : '',
              'fp-image' : '',
          };
          this.itemAddedMessage = serverControlParams.translatedStrings.featuredPageAdded;
          api.section( module.control.section() ).expanded.bind(function(to) {
            if ( ! to || ! _.isEmpty( module.get() ) )
              return;
            module.ready();
          });

  },//initialize
  addItem : function(obj) {

          var module     = this,
              item       = module.czr_preItem('item'),
              item_model = item.get();

          if ( _.isEmpty(item_model) || ! _.isObject(item_model) ) {
              throw new Error('addItem : an item should be an object and not empty. In : ' + module.id +'. Aborted.' );
          }

          var _fp_post        = item_model['fp-post'];
          if ( typeof _fp_post  == "undefined" )
            return;

          _fp_post = _fp_post[0];
          var done_callback =  function( _to_update ) {
                item.set( $.extend( item_model, _to_update) );
                api.CZRDynModule.prototype.addItem.call( module, obj );
          };

          var request = module.CZRFeaturedPagesItem.setContentAjaxInfo( _fp_post.id, {}, done_callback );

  },







  CZRFeaturedPagesInputMths : {
          ready : function() {
                  var input = this;
                  input.bind( 'fp-post:changed', function(){
                    input.updateItemModel();
                  });
                  input.bind( 'fp-title:changed', function(){
                    input.updateItemTitle();
                  });

                  api.CZRInput.prototype.ready.call( input );
          },
          setupImageUploader:  function(){
                  var input = this;
                  input.bind( 'fp-image:content_rendered', function(){
                    input.addResetDefaultButton();
                  });
                  input.container.on('click keydown', '.default-fpimage-button', function(){
                    input.setThumbnailAjax();
                  });

                  api.CZRInput.prototype.setupImageUploader.call( input );
          },
          updateItemModel : function( _new_val ) {

                  var input = this,
                      item = this.item,
                      is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput;
                  if ( ! _.has( item.get(), 'fp-post') || _.isEmpty( item.get()['fp-post'] ) )
                    return;

                  var _new_model      = _.clone( item.get() ),
                      _fp_post        = _new_model['fp-post'][0],
                      _new_title      = _fp_post.title,
                      inputCollection = is_preItemInput ? input.module.czr_preItemInput : item.czr_Input;

                  if ( is_preItemInput ) {
                        $.extend( _new_model, { title : _new_title, 'fp-title' : _new_title } );
                        item.set( _new_model );
                  } else {

                        var done_callback =  function( _to_update ) {
                          _.each( _to_update, function( value, id ){
                              item.czr_Input( id ).set( value );
                          });
                        };
                        var request = item.setContentAjaxInfo( _fp_post.id, {'fp-title' : _new_title}, done_callback );
                  }
          },


          updateItemTitle : function( _new_val ) {
                  var input = this,
                      item = this.item,
                      is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput;

                  if ( is_preItemInput )
                    return;
                  var _new_model  = _.clone( item.get() ),
                      _new_title  = "undefined" !== typeof _new_model['fp-title'] ? _new_model['fp-title'] : '';

                  $.extend( _new_model, { title : _new_title} );
                  item.set( _new_model );
          },


          setThumbnailAjax : function() {
                  var item     = this.item,
                      _fp_post = item.czr_Input('fp-post').get(),
                      _post_id;

                  if ( typeof _fp_post  == "undefined" )
                    return;

                  _fp_post = _fp_post[0];
                  _post_id = _fp_post.id;

                  $('.fpimage-reset-messages p').hide();
                  request = wp.ajax.post( 'get-fp-post-tb', {
                          'wp_customize': 'on',
                          'id'          : _post_id,
                          'CZRFPNonce'  : serverControlParams.CZRFPNonce
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
                      item         = input.item,
                      buttonLabel  = serverControlParams.translatedStrings.featuredPageImgReset,
                      successMess  = serverControlParams.translatedStrings.featuredPageResetSucc,
                      errMess      = serverControlParams.translatedStrings.featuredPageResetErr,
                      messages     = '<div class="fpimage-reset-messages" style="clear:both"><p class="success" style="display:none">'+successMess+'</p><p class="warning" style="display:none">'+errMess+'</p></div>';

                  $('.actions', input.container)
                    .append('<button type="button" class="button default-fpimage-button">'+ buttonLabel +'</button>');
                  $('.fpimage-reset-messages', input.container ).detach();
                  $(input.container).append( messages );
          }
  },//CZRFeaturedPagesInputMths








  CZRFeaturedPagesItem : {
          setContentAjaxInfo : function( _post_id, _additional_inputs, done_callback ) {
                  var _to_update         = _additional_inputs || {};
                  request = wp.ajax.post( 'get-fp-post', {
                        'wp_customize': 'on',
                        'id'          : _post_id,
                        'CZRFPNonce'  : serverControlParams.CZRFPNonce
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
          writeItemViewTitle : function( model ) {
                  var item = this,
                            module  = item.item_module,
                            _model = model || item.get(),
                            _title = _model.title ? _model.title : serverControlParams.translatedStrings.featuredPageTitle;

                  _title = api.CZR_Helpers.truncate(_title, 25);
                  $( '.' + module.control.css_attr.view_title , item.container ).html( _title );
                }
        }
});
var CZRTextModuleMths = CZRTextModuleMths || {};

$.extend( CZRTextModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          api.CZRModule.prototype.initialize.call( module, id, options );
          $.extend( module, {
                singleModuleWrapper : 'czr-single-module-wrapper',
                viewTemplateEl : 'czr-module-text-item-view',
                viewContentTemplateEl : 'czr-module-text-view-content',
          } );
          module.itemConstructor = api.CZRItem.extend( module.CZRTextItem || {} );
          module.defaultItemModel = {
                id : '',
                text : ''
          };
          module.savedItems = _.isEmpty( options.items ) ? [ module._initNewItem( module.defaultItemModel ) ] : options.items;
          module.embedded = $.Deferred();
          module.container = module.renderModuleWrapper();
          if ( false !== module.container.length ) {
              module.embedded.resolve();
          }

          console.log('text module.savedItems', module.savedItems );
          module.ready();
  },//initialize


  renderModuleWrapper : function() {
        var module = this;
        if ( 'resolved' == module.embedded.state() )
          return module.container;
        if ( 0 === $( '#tmpl-' + module.singleModuleWrapper ).length ) {
          throw new Error('No template for item ' + item.id + '. The template script id should be : #tmpl-' + module.singleModuleWrapper );
        }

        var module_wrapper_tmpl = wp.template( module.singleModuleWrapper ),
            tmpl_data = {
                id : module.id,
                type : module.module_type
            };

        var $_module_el = $(  module_wrapper_tmpl( tmpl_data ) );
        $( '.czr-static-module-wrapper' , module._getColumn().container).append( $_module_el );

        return $_module_el;
  },


  ready : function() {
          var module = this;

          module.populateItemCollection();
          module.callbacks.add( function() { return module.moduleReact.apply(module, arguments ); } );
  },


  _getColumn : function() {
          var module = this;
          return module.sektion.czr_Column( module.column_id );
  },

  _getSektion : function() {

  },
  CZRTextItem : {
          setupView : function( item_model ) {
                var item = this,
                    module = this.item_module;

                item.container = item.renderView( item_model );
                if ( _.isUndefined(item.container) || ! item.container.length ) {
                    throw new Error( 'In setupView the Item view has not been rendered : ' + item.id );
                } else {
                    item.embedded.resolve();
                }
                item.embedded.done( function() {
                        var item_model = item.get() || item.initial_item_model;//could not be set yet
                        if ( 'pending' == item.contentRendered.state() ) {
                            var $item_content = item.renderViewContent( item_model );
                            if ( ! _.isUndefined($item_content) && false !== $item_content ) {
                              item.contentRendered.resolve();
                            }
                        }
                        if ( ! _.has(item, 'czr_Input') ) {
                          item.setupInputCollection();
                        }
                });
          },
  }

});

var CZRSlideModuleMths = CZRSlideModuleMths || {};

$.extend( CZRSlideModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          api.CZRDynModule.prototype.initialize.call( module, id, options );
          $.extend( module, {
                viewPreAddEl : 'czr-module-slide-pre-add-view-content',
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-slide-view-content',
          } );
          module.inputConstructor = api.CZRInput.extend( module.CZRSliderInputMths || {} );
          module.itemConstructor = api.CZRItem.extend( module.CZRSliderItem || {} );
          this.defaultItemModel = {
              id : '',
              title : '',
              'slide-background' : '',
              'slide-title'      : '',
              'slide-subtitle'   : '',
          };
          this.itemAddedMessage = serverControlParams.translatedStrings.slideAdded;
          api.section( module.control.section() ).expanded.bind(function(to) {
            if ( ! to || ! _.isEmpty( module.get() ) )
              return;
            module.ready();
          });
  },//initialize


  CZRSliderInputMths : {
          ready : function() {
                var input = this;
                input.bind('slide-title:changed', function(){
                  input.updateItemTitle();
                });
                api.CZRInput.prototype.ready.call( input);
          },
          updateItemTitle : function( _new_val ) {
                var input = this,
                    item = this.item,
                    is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput;

                var _new_model  = _.clone( item.get() ),
                    _new_title  = _new_model['slide-title'];

                $.extend( _new_model, { title : _new_title} );
                item.set( _new_model );
          },
  },//CZRSlidersInputMths
  CZRSliderItem : {
          writeItemViewTitle : function( model ) {
                var item = this,
                          module  = item.item_module,
                          _model = model || item.get(),
                          _title = _model.title ? _model.title : serverControlParams.translatedStrings.slideTitle;
                
                _title = api.CZR_Helpers.truncate(_title, 25);                
                $( '.' + module.control.css_attr.view_title , item.container ).html( _title );
          }  
  }
});//extends api.CZRDynModule

var CZRWidgetModuleMths = CZRWidgetModuleMths || {};

$.extend( CZRWidgetModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          api.CZRModule.prototype.initialize.call( module, id, options );
          $.extend( module, this.getItemTemplates() );
          module.inputConstructor = api.CZRInput.extend( module.CZRWidgetInputMths || {} );
          module.itemConstructor  = api.CZRItem.extend( module.CZRWidgetItem || {} );
          this.defaultItemModel   = this.getItemDefaultModel();
          module.savedItems = _.isEmpty( options.items ) ? [ module._initNewItem( module.defaultItemModel ) ] : options.items;

          api.section( module.control.section() ).expanded.bind(function(to) {
            if ( ! to || ! _.isEmpty( module.get() ) )
              return;
            module.ready();
          });
  },//initialize
  getItemTemplates : function() {
          return {
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-widget-search-view-content',
          };
  },
  getItemDefaultModel : function() {
          return {
              id             : '',
              title          : '',
              'widget-title' : '',
              type           : ''
          };
  },
  CZRWidgetInputMths : {
          ready : function() {
                var input = this;
                input.bind('widget-title:changed', function(){
                  input.updateItemTitle();
                });
                api.CZRInput.prototype.ready.call( input);
          },
          updateItemTitle : function( _new_val ) {
                var input = this,
                    item = this.item;
                console.log('sono qui');
                var _new_model  = _.clone( item.get() ),
                    _new_title  = _new_model.title.substr(0, _new_model.title.indexOf(':') + 1) + _new_model['widget-title'];

                $.extend( _new_model, { title : _new_title} );
                item.set( _new_model );
          },
  },//CZRwidgetssInputMths
  CZRWidgetItem : {
  }
});//extends api.CZRDynModule

var CZRWidgetSearchModuleMths = CZRWidgetSearchModuleMths || {};

$.extend( CZRWidgetSearchModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          api.CZRWidgetModule.prototype.initialize.call( module, id, options );
          module.inputConstructor = module.inputConstructor.extend( module.CZRWidgetSearchInputMths || {} );
          module.itemConstructor  = module.itemConstructor.extend( module.CZRWidgetSearchItem || {} );
  },//initialize
  getItemDefaultModel : function() {
          return {
              id             : '',
              title          : 'Search:',
              'widget-title' : '',
              type           : 'WP_Widget_Search'
          };
  },
  CZRWidgetSearchInputMths : {
  },//CZRwidgetssInputMths
  CZRWidgetSearchItem : {
  }
});//extends api.CZRDynModule

var CZRWidgetCalendarModuleMths = CZRWidgetCalendarModuleMths || {};

$.extend( CZRWidgetCalendarModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          api.CZRWidgetModule.prototype.initialize.call( module, id, options );
          module.inputConstructor = module.inputConstructor.extend( module.CZRWidgetCalendarInputMths || {} );
          module.itemConstructor  = module.itemConstructor.extend( module.CZRWidgetCalendarItem || {} );
  },//initialize
  getItemDefaultModel : function() {
          return {
              id             : '',
              title          : 'Calendar:',
              'widget-title' : '',
              type           : 'WP_Widget_Calendar'
          };
  },
  CZRWidgetCalendarInputMths : {
  },//CZRwidgetssInputMths
  CZRWidgetCalendarItem : {
  }
});//BASE CONTROL CLASS

var CZRBaseControlMths = CZRBaseControlMths || {};

$.extend( CZRBaseControlMths, {

  initialize: function( id, options ) {
          var control = this;
          api.Control.prototype.initialize.call( control, id, options );
          control.css_attr = _.has( serverControlParams , 'css_attr') ? serverControlParams.css_attr : {};
  },
  refreshPreview : function( obj ) {
          this.previewer.refresh();
  }

});//$.extend//CZRBaseControlMths//BASE CONTROL CLASS

var CZRBaseModuleControlMths = CZRBaseModuleControlMths || {};

$.extend( CZRBaseModuleControlMths, {

  initialize: function( id, options ) {
          var control = this;
          api.CZRBaseControl.prototype.initialize.call( control, id, options );
          control.savedModules = [
                {
                  id : options.params.section + '_' + options.params.type,
                  section : options.params.section,
                  block   : '',
                  module_type : options.params.module_type,
                  items   : api(control.id).get()
                }
          ];
          control.moduleConstructors = {
                czr_widget_areas_module   : api.CZRWidgetAreaModule,
                czr_social_module    : api.CZRSocialModule,
                czr_sektion_module    : api.CZRSektionModule,
                czr_fp_module    : api.CZRFeaturedPageModule,
                czr_slide_module    : api.CZRSlideModule,
                czr_widget_search_module : api.CZRWidgetSearchModule,
                czr_widget_calendar_module : api.CZRWidgetCalendarModule,
          };

          control.czr_Module = new api.Values();
          control.czr_moduleCollection = new api.Value();
          control.czr_moduleCollection.set([]);


  },
  ready : function() {
          var control = this;
          api.bind( 'ready', function() {
                if ( ! _.isEmpty( control.czr_moduleCollection.get() ) )
                  return;

                control.populateModuleCollection();
                control.czr_moduleCollection.callbacks.add( function() { return control.collectionReact.apply( control, arguments ); } );
          });
  },
  populateModuleCollection : function() {
          var control = this;
          _.each( control.savedModules, function( module, key ) {
                module = control._normalizeModule( module );
                if ( ! _.isObject(module) || _.isEmpty(module) ) {
                  throw new Error('Populate Module Collection : a module could not be added in : ' + control.id );
                }
                if ( _.isUndefined( control.moduleConstructors[ module.module_type] ) ) {
                  throw new Error('Populate Module Collection : no constructor found for type : ' +  module.module_type );
                }
                control.instantiateModule( module, control.moduleConstructors[ module.module_type] );
          });

          return this;
  },


  instantiateModule : function( module, constructor, is_added_by_user ) {
          if ( ! _.has( module,'id') ) {
            throw new Error('CZRModule::instantiateModule() : an module has no id and could not be added in the collection of : ' + this.id +'. Aborted.' );
          }

          var control = this;
          if ( _.isUndefined(constructor) ) {
              if ( _.has( module, 'module_type' ) ) {
                constructor = control.moduleConstructors[ module.module_type];
              }
          }

          if ( _.isUndefined(constructor) ) {
            throw new Error('CZRModule::instantiateModule() : no constructor found for module type : ' + module.module_type +'. Aborted.' );
          }
          control.czr_Module.add( module.id, new constructor( module.id, {
                id : module.id,
                section : module.section,
                block   : '',
                module_type    : module.module_type,
                items   : _.clone( module.items ),
                control : control,
                is_added_by_user : is_added_by_user || false
          } ) );
          control.updateModulesCollection( {module : module });
  },
  _normalizeModule : function( module ) {
        return module;
  },
  updateModulesCollection : function( obj ) {
          var control = this,
              _current_collection = control.czr_moduleCollection.get();
              _new_collection = _.clone(_current_collection);
          if ( _.has( obj, 'collection' ) ) {
                control.czr_moduleCollection.set(obj.collection);
                return;
          }

          if ( ! _.has(obj, 'module') ) {
            throw new Error('updateModulesCollection, no module provided ' + control.id + '. Aborting');
          }
          var module = _.clone(obj.module);
          if ( _.findWhere( _new_collection, { id : module.id } ) ) {
                _.each( _current_collection , function( _elt, _ind ) {
                      if ( _elt.id != module.id )
                        return;
                      _new_collection[_ind] = module;
                });
          }
          else {
                _new_collection.push(module);
          }
          control.czr_moduleCollection.set(_new_collection);
  },
  collectionReact : function( to, from ) {
        var control = this,
            _to_render = ( _.size(from) < _.size(to) ) ? _.difference(to,from)[0] : {},
            _to_remove = ( _.size(from) > _.size(to) ) ? _.difference(from, to)[0] : {},
            _module_updated = ( ( _.size(from) == _.size(to) ) && !_.isEmpty( _.difference(from, to) ) ) ? _.difference(from, to)[0] : {},
            is_module_update = _.isEmpty( _module_updated ),
            is_collection_sorted = _.isEmpty(_to_render) && _.isEmpty(_to_remove)  && ! is_module_update;
        api(this.id).set( control.filterModuleCollectionBeforeAjax(to) );
        if ( 'postMessage' == api(control.id).transport && ! api.CZR_Helpers.has_part_refresh( control.id ) ) {
            if ( is_collection_sorted )
                control.previewer.refresh();
        }
  },
  filterModuleCollectionBeforeAjax : function(modules) {
          var control = this;
          if ( _.has( control.params, 'in_sektion' ) && control.params.in_sektion )
            return modules;
          if ( _.size(modules) > 1 ) {
            throw new Error('There should not be several modules in the collection of control : ' + control.id );
          }
          if ( ! _.isArray(modules) || _.isEmpty(modules) || ! _.has( modules[0], 'items' ) ) {
            throw new Error('The setting value could not be populated in control : ' + control.id );
          }
          return modules[0].items;

  }
});//$.extend//CZRBaseControlMths


var CZRMultiModuleControlMths = CZRMultiModuleControlMths || {};

$.extend( CZRMultiModuleControlMths, {

  initialize: function( id, options ) {
          var control = this;
          api.CZRBaseModuleControl.prototype.initialize.call( control, id, options );
          control.savedModules = api(id).get();
          control.defautModuleModel = {
                id : '',
                module_type : '',
                column_id : '',
                items : []
          };

          console.log('MODULE COLLECTION, SAVED MODULES', control.savedModules);
          $.extend( control.moduleConstructors , {
                  czr_text_module          : api.CZRTextModule,
          });

          control.czr_Module = new api.Values();
          control.czr_moduleCollection = new api.Value();
          control.czr_moduleCollection.set( api(id).get() || []);
  },
  ready : function() {
          var control = this;
          api.bind( 'ready', function() {
                control.czr_moduleCollection.callbacks.add( function() { return control.collectionReact.apply( control, arguments ); } );
                control.bind( 'user-module-candidate', function( _module ) {
                      control.instantiateModule( _module, {} ); //module, constructor
                });
                control.bind( 'db-module-candidate', function( _mod ) {
                      var _module = _.findWhere( api(control.id).get() , { id : _mod.id } );
                      console.log('in db-module-candidate', _mod, _module  );
                      if ( _.isUndefined( _module ) )
                        return;
                      _module.sektion = _mod.sektion;
                      control.instantiateModule( _module, {} ); //module, constructor
                });
          });
  },


  generateModuleId : function( module_type ) {
          return module_type + '_' + ( this.czr_moduleCollection.get().length + 1 );
  },


  instantiateModule : function( module, constructor ) {
          if ( ! _.has( module,'id') ) {
            throw new Error('CZRModule::instantiateModule() : a module has no id and could not be added in the collection of : ' + this.id +'. Aborted.' );
          }

          var control = this,
              current_mod_collection = control.czr_moduleCollection.get();
          if ( _.isUndefined(constructor) || _.isEmpty(constructor) ) {
              if ( _.has( module, 'module_type' ) ) {
                constructor = control.moduleConstructors[ module.module_type];
              }
          }

          if ( _.isUndefined(constructor) || _.isEmpty(constructor) ) {
            throw new Error('CZRModule::instantiateModule() : no constructor found for module type : ' + module.module_type +'. Aborted.' );
          }
          console.log('module before instantiation : ', module );

          if ( ! _.isEmpty( module.id ) && control.czr_Module.has( module.id ) ) {
                throw new Error('The module id already exists in the collection in control : ' + control.id );
          } else {
                module.id = control.generateModuleId( 'czr_text_module' );
          }

          var _module_candidate_model = $.extend( module, { control : control }),
              _default_module_model = _.clone( control.defautModuleModel ),
              _module_model = $.extend( _default_module_model, _module_candidate_model );
          control.czr_Module.add( module.id, new constructor( module.id, _module_model ) );

          console.log('in instanciate module', _module_model );
          control.updateModulesCollection( {module : module } );

          console.log( '_module_model.sektion.czr_Column( _module_model.column_id ).get()' , _module_model.sektion.czr_Column( _module_model.column_id ).get() );
          _module_model.sektion.czr_Column( _module_model.column_id ).updateColumnModuleCollection(
            {
              module : _module_model
            }
          );
  },
  _normalizeModule : function( module ) {
        return module;
  },
  updateModulesCollection : function( obj ) {
    console.log('update Module Collection', obj );
          var control = this,
              _current_collection = control.czr_moduleCollection.get();
              _new_collection = _.clone(_current_collection);
          if ( _.has( obj, 'collection' ) ) {
                control.czr_moduleCollection.set(obj.collection);
                return;
          }

          if ( ! _.has(obj, 'module') ) {
            throw new Error('updateModulesCollection, no module provided ' + control.id + '. Aborting');
          }
          var module = _.clone(obj.module);
          if ( _.findWhere( _new_collection, { id : module.id } ) ) {
                _.each( _current_collection , function( _elt, _ind ) {
                      if ( _elt.id != module.id )
                        return;
                      _new_collection[_ind] = module;
                });
          }
          else {
                _new_collection.push(module);
          }
          control.czr_moduleCollection.set( control.filterModuleCollectionBeforeAjax( _new_collection ) );
  },
  collectionReact : function( to, from ) {
        console.log('MODULE COLLECTION REACT', to, from );
        var control = this,
            _to_render = ( _.size(from) < _.size(to) ) ? _.difference(to,from)[0] : {},
            _to_remove = ( _.size(from) > _.size(to) ) ? _.difference(from, to)[0] : {},
            _module_updated = ( ( _.size(from) == _.size(to) ) && !_.isEmpty( _.difference(from, to) ) ) ? _.difference(from, to)[0] : {},
            is_module_update = _.isEmpty( _module_updated ),
            is_collection_sorted = _.isEmpty(_to_render) && _.isEmpty(_to_remove)  && ! is_module_update;
        api(this.id).set( control.filterModuleCollectionBeforeAjax(to) );
        if ( 'postMessage' == api(control.id).transport && ! api.CZR_Helpers.has_part_refresh( control.id ) ) {
            if ( is_collection_sorted )
                control.previewer.refresh();
        }
  },
  filterModuleCollectionBeforeAjax : function( collection ) {
          var control = this,
              _filtered_collection = _.clone( collection );

          _.each( collection , function( _mod, _key ) {
                var _reduced_module = {};
                _.each( control.defautModuleModel, function( value, key ) {
                    _reduced_module[key] = _mod[key];
                });
                _filtered_collection[_key] = _reduced_module;
          });

          return _filtered_collection;
  }
});//$.extend//CZRBaseControlMths
var CZRMultiplePickerMths = CZRMultiplePickerMths || {};
$.extend( CZRMultiplePickerMths , {
  ready: function() {
    var control  = this,
        _select  = this.container.find('select');
    _select.on('change', function(e){
      if ( 0 === $(this).find("option:selected").length )
        control.setting.set([]);
    });
  }
});//$.extend
var CZRCroppedImageMths = CZRCroppedImageMths || {};

(function (api, $, _) {
  if ( 'function' != typeof wp.media.controller.Cropper  || 'function' != typeof api.CroppedImageControl  )
    return;
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
    $.extend( CZRCroppedImageMths , {
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
      onSelect: function() {
        var attachment = this.frame.state().get( 'selection' ).first().toJSON();
        if ( ! ( attachment.mime && attachment.mime.indexOf("image") > -1 ) ){
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
    });//Method definition

})( wp.customize, jQuery, _);
var CZRUploadMths = CZRUploadMths || {};
$.extend( CZRUploadMths, {
  ready: function() {
    var control = this;

    this.params.removed = this.params.removed || '';

    this.success = $.proxy( this.success, this );

    this.uploader = $.extend({
      container: this.container,
      browser:   this.container.find('.czr-upload'),
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
    this.removerVisibility( this.setting.get() );
  },
  success: function( attachment ) {
    this.setting.set( attachment.get('id') );
  },
  removerVisibility: function( to ) {
    this.remover.toggle( to != this.params.removed );
  }
});//method definition
var CZRLayoutSelectMths = CZRLayoutSelectMths || {};

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
    $_select.select2( {
        templateResult: addImg,
        templateSelection: addImg,
        minimumResultsForSearch: Infinity
    });
  },
});//$.extend//wp.customize, jQuery, _
var CZRBackgroundMths = CZRBackgroundMths || {};
$.extend( CZRBackgroundMths , {
  initialize: function( id, options ) {
          var control = this;
          api.CZRItemControl.prototype.initialize.call( control, id, options );

          control.defaultModel = control.params.default_model;
          control.inputConstructor = api.CZRInput.extend( control.CZRBackgroundInputMths || {} );
          control.itemConstructor = api.CZRItem.extend( control.CZRBackgroundItemMths || {} );
          control.select_map = {
              'background-repeat'     : $.extend( {'': serverControlParams.translatedStrings.selectBgRepeat}, control.params.bg_repeat_options ),
              'background-attachment' : $.extend( {'': serverControlParams.translatedStrings.selectBgAttachment}, control.params.bg_attachment_options ),
              'background-position'   : $.extend( {'': serverControlParams.translatedStrings.selectBgPosition}, control.params.bg_position_options ),
          };
  },//initialize
  ready : function() {
          var control = this;
          api.CZRItemControl.prototype.ready.call( control );

          api.bind('ready', function() {
                var _img_on_init = control.czr_Item('background-image').get();

                control.setBgDependantsVisibilities( ! _.isUndefined(_img_on_init) && ! _.isEmpty(_img_on_init) );

                control.czr_Item('background-image').bind(function(to, from) {
                  control.setBgDependantsVisibilities( ! _.isUndefined(to) && ! _.isEmpty(to) );
                });

              });

  },
  setBgDependantsVisibilities : function( has_img ) {
          var control = this;
          _.each( ['background-repeat', 'background-attachment', 'background-position', 'background-size'], function( dep ) {
            control.czr_Item(dep).container.toggle( has_img );
          });
  },
  CZRBackgroundInputMths : {

          ready : function() {
            var input = this;

            input.addActions(
              'input_event_map',
              {
                  trigger   : 'background-image:changed',
                  actions   : [ 'setBgDependantsVisibilities' ]
              },
              input
            );

            api.CZRInput.prototype.ready.call( input);
          },

          setupSelect : function( obj ) {
            var input      = this,
                control     = input.control;
            if ( _.has(control.select_map, input.id ) )
              input._buildSelect( control.select_map[input.id] );

            $('select', input.container ).not('.no-selecter-js')
              .each( function() {
                $(this).selecter({
                });
            });
          },

          _buildSelect: function ( select_options ) {
            var input       = this,
                control     = input.control;

            _.each( select_options, function( _label, _value ) {
                var _attributes = {
                    value : _value,
                    html  : _label
                  };
                if ( _value == input.get() )
                  $.extend( _attributes, { selected : "selected" } );

                $( 'select[data-type="'+ input.id +'"]', input.container ).append( $('<option>', _attributes) );
            });
          }
  },


  CZRBackgroundItemMths : {
          renderViewContent : function() {
                  var item = this,
                      control = this.item_control,
                      model = _.clone( item.get() );
                  if ( 0 === $( '#tmpl-' + control.getTemplateEl( 'view-content', model ) ).length )
                    return this;

                  var  view_content_template = wp.template( control.getTemplateEl( 'view-content', model ) );
                  if ( ! view_content_template || ! control.container )
                    return this;
                  var extended_model = $.extend(
                      model,
                      { defaultBgColor : control.defaultModel['background-color'] || '#eaeaea' }
                    );

                  $( view_content_template( extended_model )).appendTo( $('.' + control.css_attr.view_content, obj.dom_el ) );

                  return this;
          }
  }

});//$.extend
(function (api, $, _) {
  $.extend( CZRBaseControlMths, api.Events || {} );
  $.extend( CZRModuleMths, api.Events || {} );
  $.extend( CZRItemMths, api.Events || {} );
  $.extend( CZRInputMths, api.Events || {} );
  $.extend( CZRBaseControlMths, api.CZR_Helpers || {} );
  $.extend( CZRInputMths, api.CZR_Helpers || {} );
  $.extend( CZRModuleMths, api.CZR_Helpers || {} );
  api.CZRInput                 = api.Value.extend( CZRInputMths || {} );
  api.CZRItem                  = api.Value.extend( CZRItemMths || {} );
  api.CZRModule               = api.Value.extend( CZRModuleMths || {} );
  api.CZRDynModule            = api.CZRModule.extend( CZRDynModuleMths || {} );
  api.CZRColumn                = api.Value.extend( CZRColumnMths || {} );
  api.CZRSocialModule         = api.CZRDynModule.extend( CZRSocialModuleMths || {} );
  api.CZRWidgetAreaModule     = api.CZRDynModule.extend( CZRWidgetAreaModuleMths || {} );
  api.CZRSektionModule        = api.CZRDynModule.extend( CZRSektionMths || {} );
  api.CZRFeaturedPageModule   = api.CZRDynModule.extend( CZRFeaturedPageModuleMths || {} );
  api.CZRTextModule           = api.CZRModule.extend( CZRTextModuleMths || {} );
  api.CZRWidgetModule         = api.CZRModule.extend( CZRWidgetModuleMths || {} );
  api.CZRWidgetSearchModule   = api.CZRWidgetModule.extend( CZRWidgetSearchModuleMths || {} );
  api.CZRWidgetCalendarModule = api.CZRWidgetModule.extend( CZRWidgetCalendarModuleMths || {} );

  api.CZRSlideModule          = api.CZRDynModule.extend( CZRSlideModuleMths || {} );
  api.CZRBaseControl           = api.Control.extend( CZRBaseControlMths || {} );
  api.CZRBaseModuleControl    = api.CZRBaseControl.extend( CZRBaseModuleControlMths || {} );
  api.CZRMultiModulesControl        = api.CZRBaseModuleControl.extend( CZRMultiModuleControlMths || {} );


  api.CZRUploadControl         = api.Control.extend( CZRUploadMths || {} );
  api.CZRLayoutControl         = api.Control.extend( CZRLayoutSelectMths || {} );
  api.CZRMultiplePickerControl = api.Control.extend( CZRMultiplePickerMths || {} );



  $.extend( api.controlConstructor, {
        czr_upload     : api.CZRUploadControl,

        czr_modules : api.CZRBaseModuleControl,
        czr_multi_modules : api.CZRMultiModulesControl,
        czr_single_module : api.CZRBaseModuleControl,

        czr_multiple_picker : api.CZRMultiplePickerControl,
        czr_layouts    : api.CZRLayoutControl
  });





  if ( 'function' == typeof api.CroppedImageControl ) {
    api.CZRCroppedImageControl   = api.CroppedImageControl.extend( CZRCroppedImageMths || {} );

    $.extend( api.controlConstructor, {
      czr_cropped_image : api.CZRCroppedImageControl
    });
  }

})( wp.customize, jQuery, _);

(function (api, $, _) {
  var $_nav_section_container,
      translatedStrings = serverControlParams.translatedStrings || {};

  api.bind( 'ready' , function() {
    api.czr_visibilities = new api.CZR_visibilities();
  } );

  api.CZR_visibilities = api.Class.extend( {
          controlDeps : {},
          initialize: function() {
                var self = this;
                this.controlDeps = _.extend( this.controlDeps, this._getControlDeps() );
                this._setControlVisibilities();
                this._handleFaviconNote();

          },
          _setControlVisibilities : function() {
                var self = this;
                _.map( self.controlDeps , function( opts , setId ) {
                  self._prepare_visibilities( setId, opts );
                });
          },
          _getControlDeps : function() {
            return {};
          },
          _get_dependants : function( setId ) {
                if ( ! this.controlDeps[setId] )
                  return [];
                var _dependants = this.controlDeps[setId];

                if ( _dependants.show && _dependants.hide )
                  return _.union(_dependants.show.controls , _dependants.hide.controls);
                if ( _dependants.show && ! _dependants.hide )
                  return _dependants.show.controls;
                if ( ! _dependants.show && _dependants.hide )
                  return _dependants.hide.controls;

                return _dependants.controls;
          },
          _get_visibility_action : function ( setId , depSetId ) {
                if ( ! this.controlDeps[setId] )
                  return 'both';
                var _dependants = this.controlDeps[setId];
                if ( _dependants.show && -1 != _.indexOf( _dependants.show.controls, depSetId ) )
                  return 'show';
                if ( _dependants.hide && -1 != _.indexOf( _dependants.hide.controls, depSetId ) )
                  return 'hide';
                return 'both';
          },


          _get_visibility_cb : function( setId , _action ) {
                if ( ! this.controlDeps[setId] )
                  return;
                var _dependants = this.controlDeps[setId];
                if ( ! _dependants[_action] )
                  return _dependants.callback;
                return (_dependants[_action]).callback;
          },


          _check_cross_dependant : function( setId, depSetId ) {
                if ( ! this.controlDeps[setId] )
                  return true;
                var _dependants = this.controlDeps[setId];
                if ( ! _dependants.cross || ! _dependants.cross[depSetId] )
                  return true;
                var _cross  = _dependants.cross[depSetId],
                    _id     = _cross.master,
                    _cb     = _cross.callback;

                _id = api.CZR_Helpers.build_setId(_id);
                return _cb( api.instance(_id).get() );
              },
          _prepare_visibilities : function( setId, o ) {
                var self = this;
                api( api.CZR_Helpers.build_setId(setId) , function (setting) {
                  var _params = {
                    setting   : setting,
                    setId : setId,
                    controls  : self._get_dependants(setId),
                  };
                  _.map( _params.controls , function( depSetId ) {
                    self._set_single_dependant_control_visibility( depSetId , _params);
                  } );
                });
          },



          _set_single_dependant_control_visibility : function( depSetId , _params ) {
                var self = this;
                api.control( api.CZR_Helpers.build_setId(depSetId) , function (control) {
                  var _visibility = function (to) {
                    var _action   = self._get_visibility_action( _params.setId , depSetId ),
                        _callback = self._get_visibility_cb( _params.setId , _action ),
                        _bool     = false;

                    if ( 'show' == _action && _callback(to, depSetId, _params.setId ) )
                      _bool = true;
                    if ( 'hide' == _action && _callback(to, depSetId, _params.setId ) )
                      _bool = false;
                    if ( 'both' == _action )
                      _bool = _callback(to, depSetId, _params.setId );
                    _bool = self._check_cross_dependant( _params.setId, depSetId ) && _bool;
                    control.container.toggle( _bool );
                  };//_visibility()



                  _visibility( _params.setting.get() );
                  _params.setting.bind( _visibility );
                });
          },
          _handleFaviconNote : function() {
                var self = this;
                if ( ! api.has('site_icon') || ! api.control('site_icon') || ( api.has(api.CZR_Helpers.build_setId(serverControlParams.faviconOptionName)) && 0 === + api( api.CZR_Helpers.build_setId(serverControlParams.faviconOptionName) ).get() ) || + api('site_icon').get() > 0 )
                  return;

                var _oldDes     = api.control('site_icon').params.description;
                    _newDes     = ['<strong>' , translatedStrings.faviconNote || '' , '</strong><br/><br/>' ].join('') + _oldDes;
                self._printFaviconNote(_newDes );
                api('site_icon').callbacks.add( function(to) {
                  if ( +to > 0 ) {
                    api.control('site_icon').container.find('.description').text(_oldDes);
                    if ( api.has( api.CZR_Helpers.build_setId(serverControlParams.faviconOptionName) ) )
                      api( api.CZR_Helpers.build_setId(serverControlParams.faviconOptionName) ).set("");
                  }
                  else {
                    self._printFaviconNote(_newDes );
                  }
                });
          },
          _printFaviconNote : function( _newDes ) {
                api.control('site_icon').container.find('.description').html(_newDes);
          }
    }
  );//api.Class.extend() //api.CZR_visibilities

})( wp.customize, jQuery, _);//DOM READY :
(function (wp, $) {
  $( function($) {
    var api = wp.customize || api;
    $('.accordion-section').not('.control-panel').click( function () {
      _recenter_current_section($(this));
    });

    function _recenter_current_section( section ) {
      var $siblings               = section.siblings( '.open' );
      if ( 0 !== $siblings.length &&  $siblings.offset().top < 0 ) {
        $('.wp-full-overlay-sidebar-content').animate({
              scrollTop:  - $('#customize-theme-controls').offset().top - $siblings.height() + section.offset().top + $('.wp-full-overlay-sidebar-content').offset().top
        }, 700);
      }
    }//end of fn
    api.czrSetupCheckbox = function( controlId, refresh ) {
      $('input[type=checkbox]', api.control(controlId).container ).each( function() {
        if ( 0 === $(this).val() || '0' == $(this).val() || 'off' == $(this).val() || _.isEmpty($(this).val() ) ) {
          $(this).prop('checked', false);
        } else {
          $(this).prop('checked', true);
        }
        if ( 0 !== $(this).closest('div[class^="icheckbox"]').length )
          return;

        $(this).iCheck({
          checkboxClass: 'icheckbox_flat-grey',
          radioClass: 'iradio_flat-grey',
        })
        .on( 'ifChanged', function(e){
          $(this).val( false === $(this).is(':checked') ? 0 : 1 );
          $(e.currentTarget).trigger('change');
        });
      });
    };//api.czrSetupCheckbox()
    api.czrSetupSelect = function(controlId, refresh) {
      $('select[data-customize-setting-link]', api.control(controlId).container ).not('.no-selecter-js')
        .each( function() {
          $(this).selecter({
          });
      });
    };//api.czrSetupSelect()
    api.czrSetupStepper = function(controlId, refresh) {
      $('input[type="number"]', api.control(controlId).container ).each( function() {
          $(this).stepper();
      });
    };//api.czrSetupStepper()

    api.control.each(function(control){
      if ( ! _.has(control,'id') )
        return;
      if ('widget' != control.id.substring(0, 6) ) {
        api.czrSetupCheckbox(control.id);
      }
      api.czrSetupSelect(control.id);
      api.czrSetupStepper(control.id);
    });
    if ( $('.control-panel-widgets').find('.accordion-section-title').first().length ) {
      $('.control-panel-widgets').find('.accordion-section-title').first().prepend(
        $('<span/>', {class:'fa fa-magic'} )
      );
    }
  });//end of $( function($) ) dom ready

})( wp, jQuery);