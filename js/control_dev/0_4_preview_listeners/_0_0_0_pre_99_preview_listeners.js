
(function (api, $, _) {
  /*****************************************************************************
  * CAPTURE PREVIEW INFORMATIONS ON REFRESH + REACT TO THEM
  *****************************************************************************/
  //Data are sent by the preview frame when the panel has sent the 'sync' or even better 'active' event
  api.bind('ready', function() {
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

              //stores and update the widget settings
              api.czr_widgetZoneSettings.set( {
                    actives :  data.renderedSidebars,
                    inactives :  _inactives,
                    registered :  _registered,
                    candidates :  _candidates,
                    available_locations :  data.availableWidgetLocations//built server side
              } );


        });

        api.previewer.bind( 'czr-wp-conditional-ready', function(data ) {
              api.czr_wp_conditionals.set( data );
        });

        api.previewer.bind( 'czr-partial-refresh', function(data) {
              api.czr_partials.set(data);
        });

        //the sent data look like :
        //{
        //  czr_skopes : _wpCustomizeSettings.czr_skopes || [],
        //  skopeGlobalDBOpt : _wpCustomizeSettings.skopeGlobalDBOpt || []
        // }
        //
        api.previewer.bind( 'czr-skopes-ready', function( data ) {
              if ( ! serverControlParams.isSkopOn )
                return;
              api.consoleLog('czr-skopes-ready DATA', data );
              var preview = this;
              //initialize skopes with the server sent data
              if ( _.has(data, 'czr_skopes') )
                  api.czr_skopeBase.updateSkopeCollection( data.czr_skopes , preview.channel() );
              //store the db options name saved for the global skope
              //for the 'global' skope, we only send the option name instead of sending the heavy and performance expensive entire set of option
              if ( _.has(data, 'skopeGlobalDBOpt') )
                  api.czr_globalDBoptions( data.skopeGlobalDBOpt );
        });
  });//api.bind('ready')
})( wp.customize , jQuery, _ );