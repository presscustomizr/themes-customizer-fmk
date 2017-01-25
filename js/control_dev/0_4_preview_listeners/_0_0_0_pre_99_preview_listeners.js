
(function (api, $, _) {
  //This promise will let us know when we have the first set of preview query ready to use
  //This is needed for modules contextually dependant
  //For example, the slider module will initialize the module model based on the contextual informations, if no items have been set yet.
  api.czr_wpQueryDataReady = $.Deferred();

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
              api.czr_wpQueryInfos = api.czr_wpQueryInfos || new api.Value();
              api.czr_wpQueryInfos( data );
              api.czr_wpQueryDataReady.resolve( data );
        });

        //PARTIAL REFRESHS => stores and observes the partials sent by the preview
        api.previewer.bind( 'czr-partial-refresh', function( data ) {
              api.czr_partials = api.czr_partials || new api.Value();
              api.czr_partials.set( data );
        });
  });//api.bind('ready')
})( wp.customize , jQuery, _ );