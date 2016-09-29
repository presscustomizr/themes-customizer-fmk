
(function (api, $, _) {

  //FIX FOR CONTROL VISIBILITY LOST ON PREVIEW REFRESH #1
  //This solves the problem of control visiblity settings being lost on preview refresh since WP 4.3
  //this overrides the wp method only for the control instances
  //it check if there's been a customizations
  //=> args.unchanged is true for all cases, for example when api.previewer.loading and the preview send 'ready'created during the frame synchronisation
  api.Control.prototype.onChangeActive = function ( active, args ) {
        if ( args.unchanged )
          return;
        if ( this.container[0] && ! $.contains( document, this.container[0] ) ) {
          // jQuery.fn.slideUp is not hiding an element if it is not in the DOM
          this.container.toggle( active );
          if ( args.completeCallback ) {
            args.completeCallback();
          }
        } else if ( active ) {
          this.container.slideDown( args.duration, args.completeCallback );
        } else {
          this.container.slideUp( args.duration, args.completeCallback );
        }
  };


   /* monkey patch for the content height set */
  //wp.customize.Section is not available before wp 4.1
  if ( 'function' == typeof api.Section ) {
    // backup the original function
    var _original_section_initialize = api.Section.prototype.initialize;
    api.Section.prototype.initialize = function( id, options ) {
          //call the original constructor
          _original_section_initialize.apply( this, [id, options] );
          var section = this;

          this.expanded.callbacks.add( function( _expanded ) {
            if ( ! _expanded )
              return;

          var container = section.container.closest( '.wp-full-overlay-sidebar-content' ),
                content = section.container.find( '.accordion-section-content' );
            //content resizing to the container height
            _resizeContentHeight = function() {
              content.css( 'height', container.innerHeight() );
          };
            _resizeContentHeight();
            //this is set to off in the original expand callback if 'expanded' is false
            $( window ).on( 'resize.customizer-section', _.debounce( _resizeContentHeight, 110 ) );
          });
        };
  }
})( wp.customize , jQuery, _ );