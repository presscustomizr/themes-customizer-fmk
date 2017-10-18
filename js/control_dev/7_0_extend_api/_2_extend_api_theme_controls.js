
( function ( api, $, _ ) {
      //THEME CONTROLS
      //api.CZRBackgroundControl     = api.CZRItemControl.extend( CZRBackgroundMths );

      //api.CZRWidgetAreasControl    = api.CZRDynModule.extend( CZRWidgetAreasMths );

      api.CZRUploadControl          = api.Control.extend( CZRUploadMths );
      api.CZRLayoutControl          = api.Control.extend( CZRLayoutSelectMths );
      api.CZRMultiplePickerControl  = api.Control.extend( CZRMultiplePickerMths );


      $.extend( api.controlConstructor, {
            czr_upload     : api.CZRUploadControl,
            //czr_sidebars   : api.CZRWidgetAreasControl,
            //czr_socials    : api.CZRSocialControl,
            czr_multiple_picker : api.CZRMultiplePickerControl,
            czr_layouts    : api.CZRLayoutControl
            //czr_background : api.CZRBackgroundControl
      });

      if ( 'function' == typeof api.CroppedImageControl ) {
            api.CZRCroppedImageControl   = api.CroppedImageControl.extend( CZRCroppedImageMths );

            $.extend( api.controlConstructor, {
                  czr_cropped_image : api.CZRCroppedImageControl
            });
      }

})( wp.customize, jQuery, _ );