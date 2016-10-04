
(function (api, $, _) {

  api.bind('ready', function() {
        if ( ! serverControlParams.isSkopOn )
          return;

        /*****************************************************************************
        * RESET
        *****************************************************************************/
        api.previewer.czr_reset = function( skope_id, setId ) {
              var self = this,
                  processing = api.state( 'processing' ),
                  submitWhenDoneProcessing,
                  submit_reset,
                  request,
                  query;

              $( document.body ).addClass( 'czr-resetting' );

               //skope dependant submit()
              submit_reset = function( skope_id, setId ) {
                    if ( _.isUndefined( skope_id ) )
                      return;

                    //the query takes the skope_id has parameter
                    query = $.extend( self.query( skope_id, 'reset' ), {
                        nonce:  self.nonce.save
                    } );

                    if ( ! _.isUndefined( setId ) && api.has(setId) ) {
                        $.extend( query , { set_id : setId } );
                        request = wp.ajax.post( 'czr_setting_reset', query );
                    } else {
                        request = wp.ajax.post( 'czr_skope_reset', query );
                    }

                    api.consoleLog('in czr_reset submit : ', skope_id, query );



                    request.fail( function ( response ) {
                          api.consoleLog('ALORS FAIL ?', skope_id, response );
                          if ( '0' === response ) {
                              response = 'not_logged_in';
                          } else if ( '-1' === response ) {
                            // Back-compat in case any other check_ajax_referer() call is dying
                              response = 'invalid_nonce';
                          }

                          if ( 'invalid_nonce' === response ) {
                              self.cheatin();
                          } else if ( 'not_logged_in' === response ) {
                              self.preview.iframe.hide();
                              self.login().done( function() {
                                self.save();
                                self.preview.iframe.show();
                            } );
                          }
                          api.trigger( 'error', response );
                    } );

                    request.done( function( response ) {
                          api.consoleLog('ALORS DONE ?', skope_id, response );
                          // // Clear setting dirty states
                          // api.each( function ( value ) {
                          //   value._dirty = false;
                          // } );
                          // api.previewer.send( 'saved', response );
                          // api.trigger( 'saved', response );

                    } );

                    request.always( function () {
                        $( document.body ).removeClass( 'czr-resetting' );
                    } );

              };//submit_reset()

              if ( 0 === processing() ) {
                    submit_reset( skope_id, setId );
              } else {
                    submitWhenDoneProcessing = function () {
                      if ( 0 === processing() ) {
                        api.state.unbind( 'change', submitWhenDoneProcessing );
                        submit_reset( skope_id, setId );
                      }
                    };
                    api.state.bind( 'change', submitWhenDoneProcessing );
              }

              return request;
        };//.czr_reset

  });//api.bind('ready')

})( wp.customize , jQuery, _ );