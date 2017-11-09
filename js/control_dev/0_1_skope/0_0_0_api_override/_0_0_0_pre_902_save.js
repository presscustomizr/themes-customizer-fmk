
( function ( api, $, _ ) {
      api.bind( 'czr-skope-started', function() {
            //OVERRIDES WP
            api.previewer.save = function( args ) {
                  return api.czr_skopeSave.save( args );
            };
      });//api.bind('ready')
})( wp.customize , jQuery, _ );