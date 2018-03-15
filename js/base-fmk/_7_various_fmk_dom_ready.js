
//DOM READY :
//1) FIRE SPECIFIC INPUT PLUGINS
//2) ADD SOME COOL STUFFS
//3) SPECIFIC CONTROLS ACTIONS
( function ( wp, $ ) {
      $( function($) {
            var api = wp.customize || api;

            //WHAT IS HAPPENING IN THE MESSENGER
            // $(window.parent).on( 'message', function(e, o) {
            //   api.consoleLog('SENT STUFFS', JSON.parse( e.originalEvent.data), e );
            // });
            // $( window ).on( 'message', function(e, o) {
            //   api.consoleLog('INCOMING MESSAGE', JSON.parse( e.originalEvent.data), e );
            // });
            // $(window.document).bind("ajaxSend", function(e, o){
            //    api.consoleLog('AJAX SEND', e, arguments );
            // }).bind("ajaxComplete", function(e, o){
            //    api.consoleLog('AJAX COMPLETE', e, o);
            // });

            var fireHeaderButtons = function() {
                  var $home_button = $('<span/>', { class:'customize-controls-home fas fa-home', html:'<span class="screen-reader-text">Home</span>' } );
                  $.when( $('#customize-header-actions').append( $home_button ) )
                        .done( function() {
                              $home_button
                                    .keydown( function( event ) {
                                          if ( 9 === event.which ) // tab
                                            return;
                                          if ( 13 === event.which ) // enter
                                            this.click();
                                          event.preventDefault();
                                    })
                                    .on( 'click.customize-controls-home', function() {
                                          //event.preventDefault();
                                          //close everything
                                          if ( api.section.has( api.czr_activeSectionId() ) ) {
                                                api.section( api.czr_activeSectionId() ).expanded( false );
                                          } else {
                                                api.section.each( function( _s ) {
                                                    _s.expanded( false );
                                                });
                                          }
                                          api.panel.each( function( _p ) {
                                                _p.expanded( false );
                                          });
                                    });
                        });
            };

            fireHeaderButtons();

      });//end of $( function($) ) dom ready
})( wp, jQuery );