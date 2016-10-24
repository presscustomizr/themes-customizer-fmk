
(function (api, $, _) {

  api.bind('ready', function() {
        if ( ! serverControlParams.isSkopOn )
          return;

        /**
        * Refresh the preview.
        */
        //The purpose of this refresh method is to pass params to the query()
        //=> we want to know the skope, and the action
        //=> here the action is always refresh.
        //=> this way we are able to better identify what to do in the api.previewer.query method
        api.previewer._new_refresh = function( the_dirties ) {
          if ( ! _.has( api, 'czr_activeSkope') || _.isUndefined( api.czr_activeSkope() ) ) {
            console.log( 'The api.czr_activeSkope() is undefined in the api.previewer._new_refresh() method.');
          }
          var previewer = this;

          // Display loading indicator
          previewer.send( 'loading-initiated' );

          previewer.abort();

          var query_params = {
              skope_id : api.czr_activeSkope(),
              action : 'refresh',
              the_dirties : the_dirties
          };

          previewer.loading = new api.PreviewFrame({
              url:        previewer.url(),
              previewUrl: previewer.previewUrl(),
              query:      previewer.query( query_params ) || {},
              container:  previewer.container,
              signature:  previewer.signature
          });

          previewer.loading.done( function() {
            // 'this' is the loading frame
            previewer.bind( 'synced', function() {
              if ( previewer.preview )
                previewer.preview.destroy();
              previewer.preview = this;
              delete previewer.loading;

              previewer.targetWindow( previewer.targetWindow() );
              previewer.channel( previewer.channel() );

              previewer.deferred.active.resolve();
              previewer.send( 'active' );
            });

            previewer.send( 'sync', {
              scroll:   previewer.scroll,
              settings: api.get()
            });
          });

          previewer.loading.fail( function( reason, location ) {
            previewer.send( 'loading-failed' );
            if ( 'redirect' === reason && location ) {
              previewer.previewUrl( location );
            }

            if ( 'logged out' === reason ) {
              if ( previewer.preview ) {
                previewer.preview.destroy();
                delete previewer.preview;
              }

              previewer.login().done( previewer.refresh );
            }

            if ( 'cheatin' === reason ) {
              previewer.cheatin();
            }
          });
        };


        //Overrides the WP api.previewer.refresh method
        //We may need to pass force dirties here
        api.previewer.refresh = (function( self ) {
          var refresh  = self._new_refresh,
            callback = function() {
              timeout = null;
              refresh.call( self );
            },
            timeout;

          return function() {
            if ( typeof timeout !== 'number' ) {
              if ( self.loading ) {
                self.abort();
              } else {
                return callback();
              }
            }

            clearTimeout( timeout );
            timeout = setTimeout( callback, self.refreshBuffer );
          };
        })( api.previewer );

  });//api.bind('ready')

})( wp.customize , jQuery, _ );