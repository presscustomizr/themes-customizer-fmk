
(function (api, $, _) {
      api.bind( 'czr-skope-ready', function() {
            if ( ! serverControlParams.isSkopOn )
              return;

            //the 'saving' state was introduced in 4.7
            //For prior versions, let's declare it and add its callback that we need in the api.previewer.save() method
            if ( ! api.state.has('saving') ) {
                  api.state.create('saving');
                  api.state('saving').bind( function( isSaving ) {
                        $( document.body ).toggleClass( 'saving', isSaving );
                  } );
            }

            //OVERRIDES WP
            api.previewer.save = function( args ) {
                  return api.czr_skopeSave.save();
            };

      });//api.bind('ready')
})( wp.customize , jQuery, _ );