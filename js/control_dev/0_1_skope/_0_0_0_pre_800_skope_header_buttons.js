

var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {
      fireHeaderButtons : function() {
            var $home_button = $('<span/>', { class:'customize-controls-home fa fa-home', html:'<span class="screen-reader-text">Home</span>' } );
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
                              event.preventDefault();
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

      }
} );//$.extend(