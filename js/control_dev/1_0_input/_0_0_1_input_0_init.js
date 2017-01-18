var CZRInputMths = CZRInputMths || {};

//extends api.Value
//an input is instanciated with the typical set of options :
// container : $(this),
// id : _id,
// input_options : {} <= a set of options that are used when setting up the input type
// input_parent : {} can be an item instance or a modOpt instance (Value instance, has a parent module)
// input_value : $(this).find('[data-type]').val(),
// module : module,
// type : $(this).attr('data-input-type'),
// is_mod_opt : bool,
// is_preItemInput : bool
$.extend( CZRInputMths , {
    initialize: function( name, options ) {
          console.log('INPUT CTOR OPTIONS', options );
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
                  var _meth = api.czrInputMap[input.type];
                  if ( _.isFunction( input[_meth]) ) {
                        input[_meth]( options.input_options || null );
                  }
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
    },


    //this method is not fired automatically
    //It has to be invoked once the input has been instanciated.
    ready : function() {
            var input = this;
            input.setupDOMListeners( input.input_event_map , { dom_el : input.container }, input );
            //Setup individual input listener
            input.callbacks.add( function() { return input.inputReact.apply(input, arguments ); } );
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
    inputReact : function( to, from) {
            var input = this,
                _current_input_parent = input.input_parent(),
                _new_model        = _.clone( _current_input_parent );//initialize it to the current value
            //make sure the _new_model is an object and is not empty
            _new_model =  ( ! _.isObject(_new_model) || _.isEmpty(_new_model) ) ? {} : _new_model;
            //set the new val to the changed property
            _new_model[input.id] = to;

            //inform the input_parent
            input.input_parent.set( _new_model );

            if ( ! _.has( input, 'is_preItemInput' ) ) {
              //inform the input_parent that an input has changed
              //=> useful to handle dependant reactions between different inputs
              input.input_parent.trigger( input.id + ':changed', to );
            }
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
    }
});//$.extend
