
( function ( api, $, _ ) {
      /*****************************************************************************
      * ADD PRO BEFORE SPECIFIC SECTIONS AND PANELS
      *****************************************************************************/
      if ( serverControlParams.isPro ) {
            _.each( [
                  'tc_font_customizer_settings',//WFC

                  'header_image_sec',//hueman pro
                  'content_blog_sec',//hueman pro
                  'static_front_page',//hueman pro
                  'content_single_sec',//hueman pro

                  'tc_fpu',//customizr-pro
                  'nav',//customizr-pro
                  'post_lists_sec'//customizr-pro

            ], function( _secId ) {
                  _.delay( function() {
                      api.section.when( _secId, function( _sec_ ) {
                            if ( 1 >= _sec_.headContainer.length ) {
                                _sec_.headContainer.find('.accordion-section-title').prepend( '<span class="pro-title-block">Pro</span>' );
                            }
                      });
                  }, 1000 );
            });
            _.each( [
                  'hu-header-panel',//hueman pro
                  'hu-content-panel',//hueman pro

                  'tc-header-panel',//customizr-pro
                  'tc-content-panel',//customizr-pro
                  'tc-footer-panel'//customizr-pro
            ], function( _secId ) {
                  api.panel.when( _secId, function( _sec_ ) {
                        if ( 1 >= _sec_.headContainer.length ) {
                            _sec_.headContainer.find('.accordion-section-title').prepend( '<span class="pro-title-block">Pro</span>' );
                        }
                  });
            });
      }


      /*****************************************************************************
      * PRO SECTION CONSTRUCTOR
      *****************************************************************************/
      if ( ! serverControlParams.isPro && _.isFunction( api.Section ) ) {
            proSectionConstructor = api.Section.extend( {
                  active : true,
                  // No events for this type of section.
                  attachEvents: function () {},
                  // Always make the section active.
                  isContextuallyActive: function () {
                    return this.active();
                  },
                  _toggleActive: function(){ return true; },

            } );

            $.extend( api.sectionConstructor, {
                  'czr-customize-section-pro' : proSectionConstructor
            });
      }
})( wp.customize , jQuery, _);