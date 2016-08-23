var CZRInputMths = CZRInputMths || {};

//extends api.Value
//an input is instanciated with the typical set of options :
//id : _id,
// type : $(this).attr('data-input-type'),
// value : $(this).find('[data-type]').val(),
// container : $(this),
// item : item (Value instance, has a parent module)
// module : module,
// is_preItemInput : true
$.extend( CZRInputMths , {
    initialize: function( name, options ) {
            if ( _.isUndefined(options.item ) || _.isEmpty(options.item) ) {
              throw new Error('No item assigned to input ' + options.id + '. Aborting');
            }
            if ( _.isUndefined(options.module ) ) {
              throw new Error('No module assigned to input ' + options.id + '. Aborting');
            }

            api.Value.prototype.initialize.call( this, null, options );

            var input = this;
            //input.options = options;
            //write the options as properties, name is included
            $.extend( input, options || {} );

            //initialize to the provided value if any
            if ( ! _.isUndefined(options.input_value) )
              input.set(options.input_value);

            //setup the appropriate input based on the type
            input.type_map = {
                  text : '',
                  textarea : '',
                  check : 'setupIcheck',
                  select : 'setupSelect',
                  upload : 'setupImageUploader',
                  color : 'setupColorPicker',
                  content_picker : 'setupContentPicker',
                  text_editor    : 'setupTextEditor',
                  password : ''
            };

            if ( _.has( input.type_map, input.type ) ) {
                    var _meth = input.type_map[input.type];
                    if ( _.isFunction(input[_meth]) )
                      input[_meth]();
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
                          if ( ! _.has( input.item, 'syncElements') || ! _.has( input.item.syncElements, input.id ) ) {
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
            input.setupSynchronizer();
    },


    //fired when input is intanciated and ready.
    //=> we must have an input instance to synchronize,
    //invoking this method in the initialize() method is too early, instance not ready
    setupSynchronizer: function() {
          var input       = this,
              item        = input.item,
              $_input_el  = input.container.find('[data-type]'),
              is_textarea = input.container.find('[data-type]').is('textarea');

          //@hack => todo
          //for text area inputs, the synchronizer is buggy
          if ( is_textarea ) {
            throw new Error('TO DO : THE TEXTAREA INPUT ARE NOT READY IN THE SYNCHRONIZER!');
          }

          var syncElement = new api.Element( $_input_el );
          item.syncElements = item.syncElements || {};
          item.syncElements[input.id] = syncElement;//adds the input syncElement to the collection
          syncElement.sync( input );//sync with the input instance
          syncElement.set( input() );
    },



    //react to a single input change
    //update the collection of input
    //cb of input.callbacks.add
    inputReact : function( to, from) {
            var input = this,
                _current_item = input.item(),
                _new_model        = _.clone( _current_item );//initialize it to the current value
            //make sure the _new_model is an object and is not empty
            _new_model =  ( ! _.isObject(_new_model) || _.isEmpty(_new_model) ) ? {} : _new_model;
            //set the new val to the changed property
            _new_model[input.id] = to;

            //inform the parent item
            input.item.set(_new_model);

            if ( ! _.has( input, 'is_preItemInput' ) ) {
              //inform the parent item that an input has changed
              //=> useful to handle dependant reactions between different inputs
              input.item.trigger( input.id + ':changed', to );
            }
    }
});//$.extend
