
( function ( api, $, _ ) {
      /*****************************************************************************
      * ADD PRO BEFORE SPECIFIC SECTIONS AND PANELS
      *****************************************************************************/
      if ( serverControlParams.isPro ) {
            _.each( [
                  //WFC
                  'tc_font_customizer_settings',

                  //hueman pro
                  'header_image_sec',
                  'content_blog_sec',
                  'static_front_page',
                  'content_single_sec',

                  //customizr-pro
                  'tc_fpu',
                  'nav',
                  'post_lists_sec',
                  'galleries_sec',
                  'footer_customizer_sec',
                  'custom_scripts_sec'

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
                  //hueman pro
                  //'hu-header-panel',
                  //'hu-content-panel',

                  //customizr-pro
                  //'tc-header-panel',
                  //'tc-content-panel',
                  //'tc-footer-panel',
                  //'tc-advanced-panel'
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