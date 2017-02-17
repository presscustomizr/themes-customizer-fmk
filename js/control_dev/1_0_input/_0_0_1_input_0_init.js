var CZRInputMths = CZRInputMths || {};

//extends api.Value
//an input is instanciated with the typical set of options :
// container : $(this),
// id : _id,
// input_options : {} <= a set of options that are used when setting up the input type
// input_parent : {} can be an item instance or a modOpt instance (Value instance, has a parent module)
// input_value : $(this).find('[data-type]').val(),
// module : module,
// transport : inherit or specified in the template with data-transport="postMessage" or "refresh".
// type : $(this).attr('data-input-type'),
// is_mod_opt : bool,
// is_preItemInput : bool
$.extend( CZRInputMths , {
    initialize: function( name, options ) {
          if ( _.isUndefined( options.input_parent ) || _.isEmpty(options.input_parent) ) {
            throw new Error('No input_parent assigned to input ' + options.id + '. Aborting');
          }
          if ( _.isUndefined(options.module ) ) {
            throw new Error('No module assigned to input ' + options.id + '. Aborting');
          }

          api.Value.prototype.initialize.call( this, null, options );

          var input = this;
          //input.options = options;
          //write the options as properties, name is included
          $.extend( input, options || {} );

          //DEFERRED STATES
          //store the state of ready.
          input.isReady = $.Deferred();

          //initialize to the provided value if any
          if ( ! _.isUndefined(options.input_value) ) {
                input.set( options.input_value );
          }

          //Try to find a match with the provided constructor type
          //=> fire the relevant callback with the provided input_options
          //input.type_map is d
          if ( api.czrInputMap && _.has( api.czrInputMap, input.type ) ) {
                var _meth = api.czrInputMap[ input.type ];
                if ( _.isFunction( input[_meth]) ) {
                      input[_meth]( options.input_options || null );
                }
          } else {
                api.consoleLog('Warning an input : ' + input.id + ' has no corresponding method defined in api.czrInputMap.');
          }

          var trigger_map = {
                text : 'keyup',
                textarea : 'keyup',
                password : 'keyup',
                color : 'colorpickerchange',
                range : 'input propertychange'
          };

          //Input Event Map
          input.input_event_map = [
                  //set input value
                  {
                    trigger   : $.trim( ['change', trigger_map[input.type] || '' ].join(' ') ),//was 'propertychange change click keyup input',//colorpickerchange is a custom colorpicker event @see method setupColorPicker => otherwise we don't
                    selector  : 'input[data-type], select[data-type], textarea[data-type]',
                    name      : 'set_input_value',
                    actions   : function( obj ) {
                        if ( ! _.has( input.input_parent, 'syncElements') || ! _.has( input.input_parent.syncElements, input.id ) ) {
                            throw new Error('WARNING : THE INPUT ' + input.id + ' HAS NO SYNCED ELEMENT.');
                        }
                    }//was 'updateInput'
                  }
          ];

          //Visibility
          input.visible = new api.Value( true );
          input.isReady.done( function() {
                input.visible.bind( function( visible ) {
                      if ( visible )
                        input.container.stop( true, true ).slideDown( 200 );
                      else
                        input.container.stop( true, true ).slideUp( 200 );
                });
          });

    },


    //this method is not fired automatically
    //It has to be invoked once the input has been instanciated.
    ready : function() {
            var input = this;
            input.setupDOMListeners( input.input_event_map , { dom_el : input.container }, input );
            //Setup individual input listener
            input.callbacks.add( function() { return input.inputReact.apply( input, arguments ); } );
            //synchronizer setup
            //the input instance must be initialized. => initialize method has been done.
            $.when( input.setupSynchronizer() ).done( function() {
                  input.isReady.resolve( input );
            } );

    },


    //fired when input is intanciated and ready.
    //=> we must have an input instance to synchronize,
    //invoking this method in the initialize() method is too early, instance not ready
    setupSynchronizer: function() {
          var input       = this,
              input_parent        = input.input_parent,
              $_input_el  = input.container.find('[data-type]'),
              is_textarea = input.container.find('[data-type]').is('textarea');

          //@hack => todo
          //for text area inputs, the synchronizer is buggy
          if ( is_textarea ) {
            throw new Error('TO DO : THE TEXTAREA INPUT ARE NOT READY IN THE SYNCHRONIZER!');
          }

          var syncElement = new api.Element( $_input_el );
          input_parent.syncElements = input_parent.syncElements || {};
          input_parent.syncElements[input.id] = syncElement;//adds the input syncElement to the collection
          syncElement.sync( input );//sync with the input instance
          syncElement.set( input() );
    },



    //react to a single input change
    //update the collection of input
    //cb of input.callbacks.add
    inputReact : function( to, from, data ) {
            var input = this,
                _current_input_parent = input.input_parent(),
                _new_model        = _.clone( _current_input_parent ),//initialize it to the current value
                _isPreItemInput = input.is_preItemInput;

            //make sure the _new_model is an object and is not empty
            _new_model =  ( ! _.isObject(_new_model) || _.isEmpty(_new_model) ) ? {} : _new_model;
            //set the new val to the changed property
            _new_model[input.id] = to;

            //inform the input_parent : item or modOpt
            input.input_parent.set( _new_model, {
                  input_changed     : input.id,
                  input_transport   : input.transport,
                  not_preview_sent  : 'postMessage' === input.transport//<= this parameter set to true will prevent the setting to be sent to the preview ( @see api.Setting.prototype.preview override ). This is useful to decide if a specific input should refresh or not the preview.
            } );

            //Trigger and send specific events when changing a published input item
            if ( ! _isPreItemInput ) {
                  //inform the input_parent that an input has changed
                  //=> useful to handle dependant reactions between different inputs
                  input.input_parent.trigger( input.id + ':changed', to );

                  //Each input instantiated in an item or a modOpt can have a specific transport set.
                  //the input transport is hard coded in the module js template, with the attribute : data-transport="postMessage" or "refresh"
                  //=> this is optional, if not set, then the transport will be inherited from the one of the module, which is inherited from the control.
                  //send input to the preview. On update only, not on creation.
                  if ( ! _.isEmpty( from ) || ! _.isUndefined( from ) && 'postMessage' === input.transport ) {
                        input.module.sendInputToPreview( {
                              input_id        : input.id,
                              input_parent_id : input.input_parent.id,
                              to              : to,
                              from            : from
                        } );
                  }
            }
    },


    /*-----------------------------------------
    SOME DEFAULT CALLBACKS
    ------------------------------------------*/
    setupColorPicker : function() {
        var input  = this;

        input.container.find('input').iris( {
            palettes: true,
            hide:false,
            change : function( e, o ) {
                  //if the input val is not updated here, it's not detected right away.
                  //weird
                  //is there a "change complete" kind of event for iris ?
                  //$(this).val($(this).wpColorPicker('color'));
                  //input.container.find('[data-type]').trigger('colorpickerchange');

                  //synchronizes with the original input
                  //OLD => $(this).val( $(this).wpColorPicker('color') ).trigger('colorpickerchange').trigger('change');
                  $(this).val( o.color.toString() ).trigger('colorpickerchange').trigger('change');
            }
        });
    },

    setupSelect : function() {
        var input = this;
        $('select', input.container ).not('.no-selecter-js')
              .each( function() {
                    $(this).selecter({
                    //triggers a change event on the view, passing the newly selected value + index as parameters.
                    // callback : function(value, index) {
                    //   self.triggerSettingChange( window.event || {} , value, index); // first param is a null event.
                    // }
                    });
        });
    },

    setupIcheck : function( obj ) {
            var input      = this;

            $( 'input[type=checkbox]', input.container ).each( function(e) {
                  if ( 0 !== $(this).closest('div[class^="icheckbox"]').length )
                    return;

                  $(this).iCheck({
                        checkboxClass: 'icheckbox_flat-grey',
                        checkedClass: 'checked',
                        radioClass: 'iradio_flat-grey',
                  })
                  .on( 'ifChanged', function(e){
                        $(this).val( false === $(this).is(':checked') ? 0 : 1 );
                        $(e.currentTarget).trigger('change');
                  });
            });
    },

    setupStepper : function( obj ) {
          var input      = this;
          $('input[type="number"]',input.container ).each( function( e ) {
                $(this).stepper();
          });
    },

    //@use rangeslider https://github.com/andreruffert/rangeslider.js
    setupRangeSlider : function( options ) {
              var input = this,
                  $handle,
                  _updateHandle = function(el, val) {
                        el.textContent = val + "%";
                  };

              $( input.container ).find('input').rangeslider( {
                    // Feature detection the default is `true`.
                    // Set this to `false` if you want to use
                    // the polyfill also in Browsers which support
                    // the native <input type="range"> element.
                    polyfill: false,

                    // Default CSS classes
                    rangeClass: 'rangeslider',
                    disabledClass: 'rangeslider--disabled',
                    horizontalClass: 'rangeslider--horizontal',
                    verticalClass: 'rangeslider--vertical',
                    fillClass: 'rangeslider__fill',
                    handleClass: 'rangeslider__handle',

                    // Callback function
                    onInit: function() {
                          $handle = $('.rangeslider__handle', this.$range);
                          $('.rangeslider__handle', this.$range);
                          _updateHandle( $handle[0], this.value );
                    },
                    // Callback function
                    //onSlide: function(position, value) {},
                    // Callback function
                    //onSlideEnd: function(position, value) {}
              } ).on('input', function() {
                    _updateHandle( $handle[0], this.value );
              });
        }
});//$.extend