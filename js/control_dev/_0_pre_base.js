var czr_debug = {
  log: function(o) {debug.queue.push(['log', arguments, debug.stack.slice(0)]); if (window.console && typeof window.console.log == 'function') {window.console.log(o);}},
  error: function(o) {debug.queue.push(['error', arguments, debug.stack.slice(0)]); if (window.console && typeof window.console.error == 'function') {window.console.error(o);}},
  queue: [],
  stack: []
};

var api = api || wp.customize, $ = $ || jQuery;
(function (api, $, _) {
      //Dev mode aware and IE compatible api.consoleLog()
      api.consoleLog = function() {
            //fix for IE, because console is only defined when in F12 debugging mode in IE
            if ( ( _.isUndefined( console ) && typeof window.console.log != 'function' ) || ! serverControlParams.isDevMode )
              return;
            console.log.apply( console, arguments );
      };


      /*****************************************************************************
      * CAPTURE PREVIEW INFORMATIONS ON REFRESH + REACT TO THEM
      *****************************************************************************/
      /* WP CONDITIONAL TAGS => stores and observes the WP conditional tags sent by the preview */
      api.czr_wp_conditionals = new api.Value();

      /* SIDEBAR INSIGHTS => stores and observes the sidebars and widgets settings sent by the preview */
      api.czr_widgetZoneSettings = new api.Value();//will store all widget zones data sent by preview as an observable object
      api.sidebar_insights = new api.Values();
      api.sidebar_insights.create('candidates');//will store the sidebar candidates on preview refresh
      api.sidebar_insights.create('actives');//will record the refreshed active list of active sidebars sent from the preview
      api.sidebar_insights.create('inactives');
      api.sidebar_insights.create('registered');
      api.sidebar_insights.create('available_locations');

      //PARTIAL REFRESHS => stores and observes the partials sent by the preview
      api.czr_partials = new api.Value();

})( wp.customize , jQuery, _);