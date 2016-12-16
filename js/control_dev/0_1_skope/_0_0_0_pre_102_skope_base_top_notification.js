

var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {

      //callback of api.czr_topNoteVisible
      toggleTopNote : function( visible, noteParams ) {
            noteParams = _.isObject( noteParams ) ? noteParams : {};
            var self = this,
                _defaultParams = {
                      title : '',
                      message : ''
                };

            noteParams = $.extend( _defaultParams , noteParams);

            if ( visible ) {
                  $.when( self.renderTopNoteTmpl( noteParams ) ).done( function( $_el ) {
                        self.welcomeNote = $_el;
                        //display
                        _.delay( function() {
                            $('body').addClass('czr-top-note-open');
                        }, 200 );
                        api.CZR_Helpers.setupDOMListeners(
                              [ {
                                    trigger   : 'click keydown',
                                    selector  : '.czr-top-note-close',
                                    name      : 'close-top-note',
                                    actions   : function() {
                                          api.czr_topNoteVisible( false );
                                    }
                              } ] ,
                              { dom_el : self.welcomeNote },
                              self
                        );
                  });
            } else {
                  $('body').removeClass('czr-top-note-open');
                  if ( self.welcomeNote.length ) {
                        //display
                        _.delay( function() {
                              self.welcomeNote.remove();
                        }, 300 );
                  }
            }

            //Always auto-collapse the notification
            _.delay( function() {
                        api.czr_topNoteVisible( false );
                  },
                  20000
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
            }
            catch(e) {
                  throw new Error('Error when parsing the the top note template : ' + e );//@to_translate
            }
            $('#customize-preview').after( $( _tmpl ) );
            $('.czr-note-message', '#czr-top-note').html( _message );
            return $( '#czr-top-note' );
      }
});//$.extend()