
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
(function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

      //can be call directly, but is also a callback of api.czr_topNoteVisible, fired on skope base initialize
      //noteParams is an object :
      //{
      // title : '',
      // message : '',
      // actions : fn()
      //}
      toggleTopNote : function( visible, noteParams ) {
            noteParams = _.isObject( noteParams ) ? noteParams : {};
            var self = this,
                _defaultParams = {
                      title : '',
                      message : '',
                      actions : '',
                      selfCloseAfter : 20000
                },
                _renderAndSetup = function() {
                      $.when( self.renderTopNoteTmpl( noteParams ) ).done( function( $_el ) {
                            self.welcomeNote = $_el;
                            //display
                            _.delay( function() {
                                $('body').addClass('czr-top-note-open');
                            }, 200 );
                            api.CZR_Helpers.setupDOMListeners(
                                  [ {
                                        trigger   : 'click keydown',
                                        selector  : '.czr-preview-note-close',
                                        actions   : function() {
                                              _hideAndDestroy().done( function() {
                                                    api.czr_topNoteVisible( false );
                                                    if ( _.isFunction( noteParams.actions ) ) {
                                                          noteParams.actions();
                                                    }
                                              });
                                        }
                                  } ] ,
                                  { dom_el : self.welcomeNote },
                                  self
                            );
                      });
                },
                _hideAndDestroy = function() {
                      var dfd = $.Deferred();
                      $('body').removeClass('czr-top-note-open');
                      if ( self.welcomeNote.length ) {
                            //remove Dom element after slide up
                            _.delay( function() {
                                  self.welcomeNote.remove();
                                  dfd.resolve();
                            }, 300 );
                      } else {
                          dfd.resolve();
                      }
                      return dfd.promise();
                };

            noteParams = $.extend( _defaultParams , noteParams);

            if ( visible ) {
                  _renderAndSetup();
            } else {
                  _hideAndDestroy().done( function() {
                        api.czr_topNoteVisible( false );//should be already false
                  });
            }

            //Always auto-collapse the notification
            _.delay( function() {
                        api.czr_topNoteVisible( false );
                  },
                  noteParams.selfCloseAfter || 20000
            );
      },


      //@param = { note_title  : '', note_message : '' }
      renderTopNoteTmpl : function( params ) {
            if ( $( '#czr-top-note' ).length )
              return $( '#czr-top-note' );

            var self = this,
                _tmpl = '',
                _title = params.title || '',
                _message = params.message || '';

            try {
                  _tmpl =  wp.template( 'czr-top-note' )( { title : _title } );
            } catch( er ) {
                  api.errorLog( 'Error when parsing the the top note template : ' + er );
                  return false;
            }
            $('#customize-preview').after( $( _tmpl ) );
            $('.czr-note-message', '#czr-top-note').html( _message );
            return $( '#czr-top-note' );
      }
});//$.extend()
})( wp.customize , jQuery, _);