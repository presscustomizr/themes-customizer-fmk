
( function ( api, $, _ ) {
      // BASE
      // BASE : Extends some constructors with the events manager
      $.extend( CZRBaseControlMths, api.Events );
      $.extend( api.Control.prototype, api.Events );//ensures that the default WP control constructor is extended as well
      $.extend( CZRModuleMths, api.Events );
      $.extend( CZRItemMths, api.Events );
      $.extend( CZRModOptMths, api.Events );

      // BASE : Add the DOM helpers (addAction, ...) to the Control Base Class + Input Base Class
      $.extend( CZRBaseControlMths, api.CZR_Helpers );
      $.extend( CZRInputMths, api.CZR_Helpers );
      $.extend( CZRModuleMths, api.CZR_Helpers );

      // BASE INPUTS => used as constructor when creating the collection of inputs
      api.CZRInput                  = api.Value.extend( CZRInputMths );
      // Declare all available input type as a map
      api.czrInputMap = api.czrInputMap || {};

      // input_type => callback fn to fire in the Input constructor on initialize
      // the callback can receive specific params define in each module constructor
      // For example, a content picker can be given params to display only taxonomies
      // the default input_event_map can also be overriden in this callback
      $.extend( api.czrInputMap, {
            text      : '',
            textarea  : '',
            check     : 'setupIcheck',
            gutencheck : 'setupGutenCheck',
            select    : 'setupSelect',
            radio     : 'setupRadio',
            number    : 'setupStepper',
            upload    : 'setupImageUploaderSaveAsId',
            upload_url : 'setupImageUploaderSaveAsUrl',
            color     : 'setupColorPicker',
            wp_color_apha : 'setupColorPickerAlpha',
            wp_color  : 'setupWPColorPicker',//not used for the moment
            content_picker : 'setupContentPicker',
            tiny_mce_editor : 'setupTinyMceEditor',
            password : '',
            range : 'setupSimpleRange',
            range_slider : 'setupRangeSlider',
            hidden : '',
            spacing : function( input_options ) {
                  var input = this,
                      $wrapper = $('.sek-spacing-wrapper', input.container );

                  // Listen to user actions on the inputs and set the input value
                  $wrapper.on( 'change', 'input[type="number"]', function(evt) {
                        var _type_ = $(this).closest('[data-sek-spacing]').data('sek-spacing'),
                            _newInputVal = $.extend( true, {}, _.isObject( input() ) ? input() : {} );
                        _newInputVal[ _type_ ] = $(this).val();
                        input( _newInputVal );
                  });
                  $wrapper.on( 'click', '.reset-spacing-wrap', function(evt) {
                        evt.preventDefault();
                        $wrapper.find('input[type="number"]').each( function() {
                              $(this).val(0);
                        });
                  });

                  // Synchronize on init
                  if ( _.isObject( input() ) ) {
                        _.each( input(), function( _val_, _key_ ) {
                              $( '[data-sek-spacing="' + _key_ +'"]', $wrapper ).find( 'input[type="number"]' ).val( _val_ );
                        });
                  }
            },
            bg_position : function( input_options ) {
                var input = this;
                // Listen to user actions on the inputs and set the input value
                $('.sek-bg-pos-wrapper', input.container ).on( 'change', 'input[type="radio"]', function(evt) {
                      input( $(this).val() );
                });

                // Synchronize on init
                if ( ! _.isEmpty( input() ) ) {
                      input.container.find('input[value="'+ input() +'"]').attr('checked', true).trigger('click');
                }
            },
            h_alignment : function( input_options ) {
                var input = this,
                    $wrapper = $('.sek-h-align-wrapper', input.container );
                // on init
                $wrapper.find( 'div[data-sek-align="' + input() +'"]' ).addClass('selected');

                // on click
                $wrapper.on( 'click', '[data-sek-align]', function(evt) {
                      evt.preventDefault();
                      $wrapper.find('.selected').removeClass('selected');
                      $.when( $(this).addClass('selected') ).done( function() {
                            input( $(this).data('sek-align') );
                      });
                });
            },
            v_alignment : function( input_options ) {
                var input = this,
                    $wrapper = $('.sek-v-align-wrapper', input.container );
                // on init
                $wrapper.find( 'div[data-sek-align="' + input() +'"]' ).addClass('selected');

                // on click
                $wrapper.on( 'click', '[data-sek-align]', function(evt) {
                      evt.preventDefault();
                      $wrapper.find('.selected').removeClass('selected');
                      $.when( $(this).addClass('selected') ).done( function() {
                            input( $(this).data('sek-align') );
                      });
                });
            }
      });



      // BASE ITEMS => used as constructor when creating the collection of models
      api.CZRItem                   = api.Value.extend( CZRItemMths );

      // BASE MODULE OPTIONS => used as constructor when creating module options
      api.CZRModOpt                 = api.Value.extend( CZRModOptMths );

      // BASE MODULES => used as constructor when creating the collection of modules
      api.CZRModule                 = api.Value.extend( CZRModuleMths );
      api.CZRDynModule              = api.CZRModule.extend( CZRDynModuleMths );

      // BASE CONTROLS
      api.CZRBaseControl            = api.Control.extend( CZRBaseControlMths );
      api.CZRBaseModuleControl      = api.CZRBaseControl.extend( CZRBaseModuleControlMths );

      $.extend( api.controlConstructor, { czr_module : api.CZRBaseModuleControl });

})( wp.customize, jQuery, _ );