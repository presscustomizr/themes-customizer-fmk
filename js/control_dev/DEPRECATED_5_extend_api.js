
( function ( api, $, _ ) {
      //BASE
      //BASE : Extends some constructors with the events manager
      $.extend( CZRBaseControlMths, api.Events );
      $.extend( api.Control.prototype, api.Events );//ensures that the default WP control constructor is extended as well
      $.extend( CZRModuleMths, api.Events );
      $.extend( CZRItemMths, api.Events );
      $.extend( CZRModOptMths, api.Events );

      //BASE : Add the DOM helpers (addAction, ...) to the Control Base Class + Input Base Class
      $.extend( CZRBaseControlMths, api.CZR_Helpers );
      $.extend( CZRInputMths, api.CZR_Helpers );
      $.extend( CZRModuleMths, api.CZR_Helpers );

      //BASE INPUTS => used as constructor when creating the collection of inputs
      api.CZRInput                  = api.Value.extend( CZRInputMths );
      //Declare all available input type as a map
      api.czrInputMap = api.czrInputMap || {};
      //input_type => callback fn to fire in the Input constructor on initialize
      //the callback can receive specific params define in each module constructor
      //For example, a content picker can be given params to display only taxonomies
      $.extend( api.czrInputMap, {
            text      : '',
            textarea  : '',
            check     : 'setupIcheck',
            select    : 'setupSelect',
            number    : 'setupStepper',
            upload    : 'setupImageUploader',
            color     : 'setupColorPicker',
            content_picker : 'setupContentPicker',
            text_editor    : 'setupTextEditor',
            password : '',
            range_slider : 'setupRangeSlider'
      });

      //BASE ITEMS => used as constructor when creating the collection of models
      api.CZRItem                   = api.Value.extend( CZRItemMths );

      //BASE MODULE OPTIONS => used as constructor when creating module options
      api.CZRModOpt                 = api.Value.extend( CZRModOptMths );

      //BASE MODULES => used as constructor when creating the collection of modules
      api.CZRModule                 = api.Value.extend( CZRModuleMths );
      api.CZRDynModule              = api.CZRModule.extend( CZRDynModuleMths );

      //BASE COLUMNS => used as constructor
      //Columns are a pro feature, only part of the full build.
      if ( ! _.isUndefined( window.CZRColumnMths ) ) {
            api.CZRColumn           = api.Value.extend( CZRColumnMths );
      }

      //BASE CONTROLS
      api.CZRBaseControl            = api.Control.extend( CZRBaseControlMths );
      api.CZRBaseModuleControl      = api.CZRBaseControl.extend( CZRBaseModuleControlMths );
      api.CZRMultiModuleControl     = api.CZRBaseModuleControl.extend( CZRMultiModuleControlMths );

      $.extend( api.controlConstructor, {
            czr_module : api.CZRBaseModuleControl,
            czr_multi_module : api.CZRMultiModuleControl,
            //czr_sektions   : api.CZRSektionsControl
      });





      //SKOPE
      $.extend( CZRSkopeBaseMths, api.Events );
      $.extend( CZRSkopeMths, api.Events );
      $.extend( CZRSkopeMths, api.CZR_Helpers );
      api.CZR_skopeBase             = api.Class.extend( CZRSkopeBaseMths );
      api.CZR_skopeSave             = api.Class.extend( CZRSkopeSaveMths );
      api.CZR_skopeReset            = api.Class.extend( CZRSkopeResetMths );
      api.CZR_skope                 = api.Value.extend( CZRSkopeMths ); //=> used as constructor when creating the collection of skopes

      //Skope related :
      //=> Special case for the header image
      //Capture objects before they are overridden by WP.
      //=> needed when regenerating the header_image control.
      if ( _.has(api, 'HeaderTool') ) {
            api.czr_HeaderTool = $.extend(  true, {}, api.HeaderTool );
      }






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