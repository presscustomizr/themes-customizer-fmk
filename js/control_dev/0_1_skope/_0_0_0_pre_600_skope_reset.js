
var CZRSkopeResetMths = CZRSkopeResetMths || {};
$.extend( CZRSkopeResetMths, {
      initialize: function() {
            var self = this;
            self.previewer = api.previewer;
            api.state.create('czr-resetting')(false);
            api.state('czr-resetting').bind( function( state ) {
                  $( document.body ).toggleClass( 'czr-resetting', false !== state );
            });
      },

      //args : {
      //  is_setting : false,
      //  is_skope : false,
      //  skope_id : '',
      //  setId : ''
      //}
      resetChangeset : function( args ) {
            var dfd = $.Deferred(),
                self = this,
                processing = api.state( 'processing' ),
                submitWhenPossible,
                submit_reset,
                request,
                requestAjaxAction,
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

            // => will be set to false always after asynchronous request
            //skope dependant submit()
            submit_reset = function( skope_id, setId ) {
                  if ( _.isUndefined( skope_id ) ) {
                      throw new Error( 'RESET: MISSING skope_id');
                  }
                  api.state( 'czr-resetting' )( true );
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
                        requestAjaxAction = 'czr_changeset_setting_reset';
                  } else if ( args.is_skope ) {
                        requestAjaxAction = 'czr_changeset_skope_reset';
                  } else {
                        return dfd.reject( 'reset_ajax_action_not_specified' ).promise();
                  }

                  wp.ajax.post( requestAjaxAction , query )
                        .always( function () {
                              api.state( 'czr-resetting' )( false );
                        })
                        .fail( function ( response ) {
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
                                          self.resetChangeset( args );
                                          self.previewer.preview.iframe.show();
                                    } );
                              }
                              api.consoleLog( requestAjaxAction + ' failed ', query, response );
                              response = api.czr_skopeBase.buildServerResponse( response );
                              api.trigger( 'error', response );

                              api.czr_serverNotification( { message: response, status : 'error' } );
                              dfd.reject( response );
                        })
                        .done( function( response ) {
                              dfd.resolve( response );
                        });
            };//submit_reset()

            if ( 0 === processing() && false === api.state( 'czr-resetting' )() ) {
                  submit_reset( skope_id, setId );
            } else {
                  submitWhenPossible = function () {
                        if ( 0 === processing() && false === api.state( 'czr-resetting' )() ) {
                              api.state.unbind( 'change', submitWhenPossible );
                              submit_reset( skope_id, setId );
                        }
                  };
                  api.state.bind( 'change', submitWhenPossible );
            }

            return dfd.promise();
      },





















      //args : {
      //  is_setting : false,
      //  is_skope : false,
      //  skope_id : '',
      //  setId : ''
      //}
      resetPublished : function( args ) {
            var dfd = $.Deferred(),
                self = this,
                processing = api.state( 'processing' ),
                submitWhenPossible,
                submit_reset,
                request,
                requestAjaxAction,
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

            //skope dependant submit()
            submit_reset = function( skope_id, setId ) {
                  if ( _.isUndefined( skope_id ) ) {
                      throw new Error( 'RESET: MISSING skope_id');
                  }
                  api.state( 'czr-resetting' )( true );
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
                      requestAjaxAction = 'czr_published_setting_reset';
                  } else if ( args.is_skope ) {
                      requestAjaxAction = 'czr_published_skope_reset';
                  } else {
                      return dfd.reject( 'reset_ajax_action_not_specified' ).promise();
                  }

                  api.consoleLog('in czr_reset submit : ', skope_id, query );

                  wp.ajax.post( requestAjaxAction , query )
                        .always( function () {
                              api.state( 'czr-resetting' )( false );
                        })
                        .fail( function ( response ) {
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
                                          self.resetChangeset( args );
                                          self.previewer.preview.iframe.show();
                                    } );
                              }
                              api.consoleLog( requestAjaxAction + ' failed ', query, response );
                              response = api.czr_skopeBase.buildServerResponse( response );
                              api.trigger( 'error', response );

                              api.czr_serverNotification( { message: response, status : 'error' } );
                              dfd.reject( response );
                        })
                        .done( function( response ) {
                              dfd.resolve( response );
                        });

            };//submit_reset()

            if ( 0 === processing() && false === api.state( 'czr-resetting' )() ) {
                  submit_reset( skope_id, setId );
            } else {
                  submitWhenPossible = function () {
                        if ( 0 === processing() && false === api.state( 'czr-resetting' )() ) {
                              api.state.unbind( 'change', submitWhenPossible );
                              submit_reset( skope_id, setId );
                        }
                  };
                  api.state.bind( 'change', submitWhenPossible );
            }

            return dfd.promise();
      }
});//$.extend