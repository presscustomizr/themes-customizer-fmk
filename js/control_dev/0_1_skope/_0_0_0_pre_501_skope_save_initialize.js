
var CZRSkopeSaveMths = CZRSkopeSaveMths || {};
$.extend( CZRSkopeSaveMths, {
      initialize: function() {
            this.changesetStatus    = 'publish';
            this.saveBtn            = $( '#save' );
      },

      save: function( args ) {
            var self = this,
                processing = api.state( 'processing' ),
                submitWhenDoneProcessing;

            console.log( self.fireAllSubmission, self, typeof( self.fireAllSubmission ) );
            //reset some properties on each save call
            self.globalSaveDeferred = $.Deferred();
            self.previewer          = api.previewer;
            self.globalSkopeId      = api.czr_skopeBase.getGlobalSkopeId();
            self.saveArgs           = args;

            if ( args && args.status ) {
                  self.changesetStatus = args.status;
            }

            if ( api.state( 'saving' ).get() ) {
                  self.globalSaveDeferred.reject( 'already_saving' );
            }

            // set saving state.
            // => will be set to false when all saved promises resolved
            api.state( 'saving' ).set( true );

            if ( 0 === processing() ) {
                  self.fireAllSubmission();
            } else {
                  submitWhenDoneProcessing = function () {
                        if ( 0 === processing() ) {
                              api.state.unbind( 'change', submitWhenDoneProcessing );
                              self.fireAllSubmission();
                        }
                  };
                  api.state.bind( 'change', submitWhenDoneProcessing );
            }
            return self.globalSaveDeferred.promise();
      }
});//$.extend