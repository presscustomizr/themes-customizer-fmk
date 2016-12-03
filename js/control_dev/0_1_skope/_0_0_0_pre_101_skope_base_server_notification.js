

var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {

    //callback of api.czr_serverNotification
      //notice is an object :
      //  {
      //    status : 'success',
      //    expanded : true,
      //    message : ''
      //  }
      toggleServerNotice : function( notice ) {
            notice = _.isObject( notice ) ? notice : {};
            notice = _.extend( {
                  status : 'success',
                  expanded : true,
                  message : ''
            }, notice );

            this.serverNoticeEmbedded = this.serverNoticeEmbedded || $.Deferred();

            var self = this,
                _embed = function() {
                      $('.czr-scope-switcher').prepend(
                            $( '<div/>', {
                                  class:'czr-server-notice',
                                  html:'<span class="czr-server-message"></span><span class="fa fa-times-circle czr-dismiss-notification"></span>'
                            } )
                      );
                },
                _toggleNotice = function() {
                      var $notif_wrap         = $( '.czr-server-notice', '.czr-scope-switcher' ),
                          $header             = $('.wp-full-overlay-header'),
                          $sidebar            = $('.wp-full-overlay-sidebar .wp-full-overlay-sidebar-content'),
                          _header_height,
                          _notif_wrap_height,
                          _set_height = function( _h ) {
                                $header.css( 'height', '');
                                $sidebar.css( 'top', '' );
                                if ( _.isUndefined( _h ) )
                                  return;
                                $header.css( 'height', _h + 'px' );
                                $sidebar.css( 'top', _h + 'px' );
                          };

                      if ( ! notice.expanded ) {
                            $notif_wrap
                                  .fadeOut( {
                                        duration : 200,
                                        complete : function() {
                                              $( this ).css( 'height', 'auto' );
                                  } } );
                            setTimeout( function() {
                                  _set_height();
                            } , 200 );

                      } else {
                            $notif_wrap.toggleClass( 'czr-server-error', 'error' == notice.status );
                            if ( 'error' == notice.status ) {
                                  $('.czr-server-message', $notif_wrap )
                                        .html( _.isEmpty( notice.message ) ? 'Server Problem.' : [ 'Error :' , notice.message ].join(' ') );
                            } else {
                                  $('.czr-server-message', $notif_wrap )
                                        .html( _.isEmpty( notice.message ) ? 'Success.' : [ 'Success :' , notice.message ].join(' ') );
                            }
                            _notif_wrap_height  = $( '.czr-server-notice', '.czr-scope-switcher' ).outerHeight();
                            _header_height  = $header.outerHeight() + _notif_wrap_height;

                            setTimeout( function() {
                                  $.when( _set_height( _header_height ) ).done( function() {
                                        $notif_wrap
                                        .fadeIn( {
                                              duration : 200,
                                              complete : function() {
                                                    $( this ).css( 'height', 'auto' );
                                        } } );
                                  } );
                            }, 400 );
                      }
                };

            //prepend the wrapper if needed
            if ( 'pending' == self.serverNoticeEmbedded.state() ) {
                  $.when( _embed() ).done( function() {
                        setTimeout( function() {
                              self.serverNoticeEmbedded.resolve();
                              _toggleNotice();
                        }, 200 );
                  });
            } else {
                  _toggleNotice();
            }
            if ( 'success' == notice.status ) {
                  setTimeout( function() {
                              api.czr_serverNotification( { expanded : false } );
                        },
                        3000
                  );
            }
      },

      //utility : build a server response as a string
      //ready to be displayed in the notifications
      buildServerResponse : function( _r ) {
            var resp = false;
            //server error
            if ( _.isObject( _r ) ) {
                  if ( _.has( _r, 'responseJSON') && ! _.isUndefined( _r.responseJSON.data ) && ! _.isEmpty( _r.responseJSON.data ) ) {
                        resp = _r.responseJSON.data;
                  }
                  // else if ( _.has( _r, 'responseText') && ! _.isEmpty( _r.responseText ) ) {
                  //       try {
                  //             resp = JSON.parse( _r.responseText );
                  //       } catch( e ) {
                  //             resp = 'Server Error';
                  //       }
                  // }
                  else if ( _.has( _r , 'statusText' ) && ! _.isEmpty( _r.statusText ) ) {
                        resp = _r.statusText;
                  }
            }
            if ( _.isObject( _r ) && ! resp ) {
                  try {
                        JSON.stringify( _r );
                  } catch( e ) {
                        resp = 'Server Error';
                  }
            } else if ( ! resp ) {
                  resp = _r;
            }
            return resp;
      }
});//$.extend()