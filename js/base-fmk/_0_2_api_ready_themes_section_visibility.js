
( function ( api, $, _ ) {
      //SET THE ACTIVE STATE OF THE THEMES SECTION BASED ON WHAT THE SERVER SENT
      api.bind('ready', function() {
            api.errorLog( 'THEME SECTION => WE NEED A GLOBAL VAR TO BE SET FROM THE PRO THEMES. LIKE isThemeSectionOn');
            var _do = function() {
                  api.section('themes').active.bind( function( active ) {
                        if ( _.isEmpty( themeServerControlParams.isThemeSwitchOn ) )
                          return;
                        api.section('themes').active( themeServerControlParams.isThemeSwitchOn );
                        //reset the callbacks
                        api.section('themes').active.callbacks = $.Callbacks();
                  });
            };
            if ( api.section.has( 'themes') ) {
                  _do();
            } else {
                  api.section.when( 'themes', function( _s ) {
                        _do();
                  });
            }
      });
})( wp.customize , jQuery, _);