
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
            range_slider : 'setupRangeSlider',
            hidden : ''
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

})( wp.customize, jQuery, _ );