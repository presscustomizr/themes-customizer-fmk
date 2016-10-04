
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
            throw new Error( 'The api.czr_activeSkope() is undefined in the api.previewer._new_refresh() method.');
          }
          console.log('IN NEW REFRESH', api.czr_activeSkope(), the_dirties  );
          var self = this;

          // Display loading indicator
          this.send( 'loading-initiated' );

          this.abort();

          this.loading = new api.PreviewFrame({
            url:        this.url(),
            previewUrl: this.previewUrl(),
            query:      this.query( api.czr_activeSkope(), 'refresh', the_dirties ) || {},
            container:  this.container,
            signature:  this.signature
          });

          this.loading.done( function() {
            // 'this' is the loading frame
            this.bind( 'synced', function() {
              if ( self.preview )
                self.preview.destroy();
              self.preview = this;
              delete self.loading;

              self.targetWindow( this.targetWindow() );
              self.channel( this.channel() );

              self.deferred.active.resolve();
              self.send( 'active' );
            });

            this.send( 'sync', {
              scroll:   self.scroll,
              settings: api.get()
            });
          });

          this.loading.fail( function( reason, location ) {
            self.send( 'loading-failed' );
            if ( 'redirect' === reason && location ) {
              self.previewUrl( location );
            }

            if ( 'logged out' === reason ) {
              if ( self.preview ) {
                self.preview.destroy();
                delete self.preview;
              }

              self.login().done( self.refresh );
            }

            if ( 'cheatin' === reason ) {
              self.cheatin();
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