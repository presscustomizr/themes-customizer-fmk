
( function ( api, $, _ ) {
      //SET THE ACTIVE STATE OF THE THEMES SECTION BASED ON WHAT THE SERVER SENT
      api.bind('ready', function() {
            var _do = function() {

                  if ( _.isEmpty( themeServerControlParams ) || _.isUndefined( themeServerControlParams.isThemeSwitchOn ) )
                    return;
                  //reset the callbacks
                  api.panel('themes').active.callbacks = $.Callbacks();
                  api.panel('themes').active( themeServerControlParams.isThemeSwitchOn );
            };
            if ( api.panel.has( 'themes') ) {
                  _do();
            } else {
                  api.panel.when( 'themes', function( _s ) {
                        _do();
                  });
            }
      });
})( wp.customize , jQuery, _);