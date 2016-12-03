
var CZRSkopeResetMths = CZRSkopeResetMths || {};
$.extend( CZRSkopeResetMths, {
      initialize: function() {
            var self = this;
            self.previewer = api.previewer;
      },

      //args : {
      //  is_setting : false,
      //  is_skope : false,
      //  skope_id : '',
      //  setId : ''
      //}
      reset_changeset : function( args ) {
            var dfd = $.Deferred(),
                self = this,
                processing = api.state( 'processing' ),
                submitWhenDoneProcessing,
                submit_reset,
                request,
                query_params,
                query,
                defaults = {
                      is_setting  : false,
                      is_skope    : false,
                      skope_id    : api.czr_activeSkopeId() || '',
                      setId       : ''
                };

            args = _.extend( defaults, args );
            var skope_id = args.skope_id,
                setId = args.setId;

            $( document.body ).addClass( 'czr-resetting' );

            //skope dependant submit()
            submit_reset = function( skope_id, setId ) {
                  if ( _.isUndefined( skope_id ) ) {
                      throw new Error( 'RESET: MISSING skope_id');
                  }

                  //the skope reset query takes parameters
                  query_params = {
                        skope_id : skope_id,
                        action : 'reset'
                  };
                  query = $.extend(
                        self.previewer.query( query_params ),
                        { nonce:  self.previewer.nonce.save }
                  );

                  //Several cases here :
                  //1) single setting reset
                  //2) entire skope reset
                  if ( args.is_setting ) {
                      $.extend( query , { setting_id : setId } );
                      request = wp.ajax.post( 'czr_changeset_setting_reset', query );
                  } else {
                      request = wp.ajax.post( 'czr_changeset_skope_reset', query );
                  }

                  api.consoleLog('in czr_reset submit : ', skope_id, query );

                  request.fail( function ( response ) {
                        if ( '0' === response ) {
                            response = 'not_logged_in';
                        } else if ( '-1' === response ) {
                          // Back-compat in case any other check_ajax_referer() call is dying
                            response = 'invalid_nonce';
                        }

                        if ( 'invalid_nonce' === response ) {
                            self.previewer.cheatin();
                        } else if ( 'not_logged_in' === response ) {
                              self.previewer.preview.iframe.hide();
                              self.previewer.login().done( function() {
                                    self.reset_changeset( skope_id, setId );
                                    self.previewer.preview.iframe.show();
                              } );
                        }
                        response = api.czr_skopeBase.buildServerResponse( response );
                        api.trigger( 'error', response );
                        api.czr_serverNotification( { message: response, status : 'error' } );
                        dfd.reject( response );
                  } );

                  request.done( function( response ) {
                        dfd.resolve( response );
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

            return dfd.promise();
      },














      reset_published : function( skope_id, setId ) {
            var dfd = $.Deferred(),
                self = this,
                processing = api.state( 'processing' ),
                submitWhenDoneProcessing,
                submit_reset,
                request,
                query_params,
                query;

            $( document.body ).addClass( 'czr-resetting' );

            //skope dependant submit()
            submit_reset = function( skope_id, setId ) {
                  if ( _.isUndefined( skope_id ) ) {
                      throw new Error( 'RESET: MISSING skope_id');
                  }

                  //the skope reset query takes parameters
                  query_params = {
                        skope_id : skope_id,
                        action : 'reset'
                  };
                  query = $.extend( self.previewer.query( query_params ), {
                        nonce:  self.nonce.save
                  });

                  //Several cases here :
                  //1) single setting reset
                  //2) entire skope reset
                  if ( ! _.isUndefined( setId ) && api.has(setId) ) {
                      $.extend( query , { set_id : setId } );
                      request = wp.ajax.post( 'czr_published_setting_reset', query );
                  } else {
                      request = wp.ajax.post( 'czr_published_skope_reset', query );
                  }

                  api.consoleLog('in czr_reset submit : ', skope_id, query );

                  request.fail( function ( response ) {
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
                                    self.reset_published( skope_id, setId );
                                    self.preview.iframe.show();
                              } );
                        }
                        api.trigger( 'error', response );
                        api.czr_serverNotification( { message: response, status : 'error' } );
                        dfd.reject( response );
                  } );

                  request.done( function( response ) {
                        api.consoleLog('ALORS DONE ?', skope_id, response );
                        dfd.resolve( response );
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

            return dfd.promise();
      }
});//$.extend