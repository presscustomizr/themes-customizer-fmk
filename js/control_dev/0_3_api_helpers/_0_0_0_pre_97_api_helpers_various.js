
(function (api, $, _) {
  api.CZR_Helpers = api.CZR_Helpers || {};
  //////////////////////////////////////////////////
  /// ACTIONS AND DOM LISTENERS
  //////////////////////////////////////////////////
  //adds action to an existing event map
  //@event map = [ {event1}, {event2}, ... ]
  //@new_event = {  trigger   : event name , actions   : [ 'cb1', 'cb2', ... ] }
  api.CZR_Helpers = $.extend( api.CZR_Helpers, {
        //While a control should always have a default setting,
        //It can have additional setting assigned
        //This method returns the default setting or the specified type if requested
        //Example : header_image has default and data
        getControlSettingId : function( control_id, setting_type ) {
              setting_type = 'default' || setting_type;
              if ( ! api.control.has( control_id ) ) {
                    throw new Error( 'The requested control_id is not registered in the api yet : ' + control_id );
              }
              if ( ! _.has( api.control( control_id ), 'settings' ) || _.isEmpty( api.control( control_id ).settings ) )
                return;

              if ( ! _.has( api.control( control_id ).settings, setting_type ) ) {
                    throw new Error( 'The requested control_id does not have the requested setting type : ' + control_id + ' , ' + setting_type );
              }
              if ( _.isUndefined( api.control( control_id ).settings[setting_type].id ) ) {
                    throw new Error( 'The requested control_id has no setting id assigned : ' + control_id );
              }
              return api.control( control_id ).settings[setting_type].id;
        },



        getDocSearchLink : function( text ) {
              text = ! _.isString(text) ? '' : text;
              var _searchtext = text.replace( / /g, '+'),
                  _url = [ serverControlParams.docURL, 'search?query=', _searchtext ].join('');
              return [
                '<a href="' + _url + '" title="' + serverControlParams.translatedStrings.readDocumentation + '" target="_blank">',
                ' ',
                '<span class="fa fa-question-circle-o"></span>'
              ].join('');
        },


        /*
        * @return string
        * simple helper to build the setting wp api ready id
        */
        build_setId : function ( setId ) {
              //exclude the WP built-in settings like blogdescription, show_on_front, etc
              if ( _.contains( serverControlParams.wpBuiltinSettings, setId ) )
                return setId;

              // //extract the setting id for theme mods
              // var _pattern;

              //exclude the WP built-in settings like sidebars_widgets*, nav_menu_*, widget_*, custom_css
              // var _patterns = [ 'widget_', 'nav_menu', 'sidebars_', 'custom_css' ],
              //     _isExcld = false;
              // _.each( _patterns, function( _ptrn ) {
              //       if ( _isExcld )
              //         return;
              //       _isExcld = _ptrn == setId.substring( 0, _ptrn.length );
              // });
              // if ( _isExcld )
              // return setId;
              if ( ! _.contains( serverControlParams.themeSettingList, setId ) )
                return setId;

              return -1 == setId.indexOf( serverControlParams.themeOptions ) ? [ serverControlParams.themeOptions +'[' , setId  , ']' ].join('') : setId;
      },

        /*
        * @return string
        * simple helper to extract the option name from a setting id
        */
        getOptionName : function(name) {
              var self = this;
              //targets only the options of the theme
              if ( -1 == name.indexOf(serverControlParams.themeOptions) )
                return name;
              return name.replace(/\[|\]/g, '').replace(serverControlParams.themeOptions, '');
        },



        //@return bool
        //@uses api.czr_partials
        hasPartRefresh : function( setId ) {
              if ( ! _.has( api, 'czr_partials')  )
                return;
              return  _.contains( _.map( api.czr_partials(), function( partial, key ) {
                    return _.contains( partial.settings, setId );
              }), true );
        },

        //@return the array of controls in a given section_id
        getSectionControlIds : function( section_id ) {
              section_id = section_id || api.czr_activeSectionId();
              return ! api.section.has( section_id ) ?
              [] :
              _.map( api.section( section_id ).controls(), function( _ctrl ) {
                    return _ctrl.id;
              });
        },


        //1) get the control of a given section
        //2) for each control get the associated setting(s)
        //=> important, a control might have several associated settings. Typical example : header_image.
        //@return [] of setting ids for a given czr section
        getSectionSettingIds : function( section_id ) {
              section_id = section_id || api.czr_activeSectionId();
              if ( ! api.section.has( section_id) )
                return;
              var self = this,
                  _sec_settings = [],
                  _sec_controls = self.getSectionControlIds( section_id );

              _.each( _sec_controls, function( ctrlId ) {
                    _.each( api.control(ctrlId).settings, function( _instance, _k ) {
                          _sec_settings.push( _instance.id );
                    });
              });
              return _sec_settings;
        },


        //////////////////////////////////////////////////
        /// STRINGS HELPERS
        //////////////////////////////////////////////////
        capitalize : function( string ) {
              if( ! _.isString(string) )
                return string;
              return string.charAt(0).toUpperCase() + string.slice(1);
        },

        truncate : function( string, n, useWordBoundary ){
              if ( _.isUndefined(string) )
                return '';
              var isTooLong = string.length > n,
                  s_ = isTooLong ? string.substr(0,n-1) : string;
                  s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
              return  isTooLong ? s_ + '...' : s_;
        },


        //////////////////////////////////////////////////
        /// STRINGS HELPERS
        //////////////////////////////////////////////////
        //is a module multi item ?
        //@return bool
        isMultiItemModule : function( module_type, moduleInst ) {
              if ( _.isUndefined( module_type ) && ! _.isObject( moduleInst ) )
                return;
              if ( _.isObject( moduleInst ) && _.has( moduleInst, 'module_type' ) )
                module_type = moduleInst.module_type;
              else if ( _.isUndefined( module_type ) || _.isNull( module_type ) )
                return;
              if ( ! _.has( api.czrModuleMap, module_type ) )
                return;

              return api.czrModuleMap[module_type].crud || api.czrModuleMap[module_type].multi_item || false;
        },

        //is a module crud ?
        //@return bool
        isCrudModule : function( module_type, moduleInst ) {
              if ( _.isUndefined( module_type ) && ! _.isObject( moduleInst ) )
                return;
              if ( _.isObject( moduleInst ) && _.has( moduleInst, 'module_type' ) )
                module_type = moduleInst.module_type;
              else if ( _.isUndefined( module_type ) || _.isNull( module_type ) )
                return;
              if ( ! _.has( api.czrModuleMap, module_type ) )
                return;

              return api.czrModuleMap[module_type].crud || false;
        },

        //is a module crud ?
        //@return bool
        hasModuleModOpt : function( module_type, moduleInst ) {
              if ( _.isUndefined( module_type ) && ! _.isObject( moduleInst ) )
                return;
              if ( _.isObject( moduleInst ) && _.has( moduleInst, 'module_type' ) )
                module_type = moduleInst.module_type;
              else if ( _.isUndefined( module_type ) || _.isNull( module_type ) )
                return;
              if ( ! _.has( api.czrModuleMap, module_type ) )
                return;

              return api.czrModuleMap[module_type].has_mod_opt || false;
        },



        //This method is now statically accessed by item and modopt instances because it does the same job for both.
        //=> It instantiates the inputs based on what it finds in the DOM ( item or mod opt js templates )
        //
        //Fired on 'contentRendered' for items and on user click for module options (mod opt)
        //creates the inputs based on the rendered parent item or mod option
        //inputParentInst can be an item instance or a module option instance
        setupInputCollectionFromDOM : function() {
              var inputParentInst = this;//<= because fired with .call( inputParentInst )
              if ( ! _.isFunction( inputParentInst ) ) {
                    throw new Error( 'setupInputCollectionFromDOM : inputParentInst is not valid.' );
              }
              var module = inputParentInst.module,
                  is_mod_opt = _.has( inputParentInst() , 'is_mod_opt' );

              //bail if already done
              if ( _.has( inputParentInst, 'czr_Input') && ! _.isEmpty( inputParentInst.inputCollection() ) )
                return;

              //INPUTS => Setup as soon as the view content is rendered
              //the inputParentInst is a collection of inputs, each one has its own view module.
              inputParentInst.czr_Input = new api.Values();

              //IS THE PARENT AN ITEM OR A MODULE OPTION ?
              //those default constructors (declared in the module init ) can be overridden by extended item or mod opt constructors inside the modules
              inputParentInst.inputConstructor = is_mod_opt ? module.inputModOptConstructor : module.inputConstructor;

              var _defaultInputParentModel = is_mod_opt ? inputParentInst.defaultModOptModel : inputParentInst.defaultItemModel;

              if ( _.isEmpty( _defaultInputParentModel ) || _.isUndefined( _defaultInputParentModel ) ) {
                throw new Error( 'No default model found in item or mod opt ' + inputParentInst.id + '.' );
              }

              //prepare and sets the inputParentInst value on api ready
              //=> triggers the module rendering + DOM LISTENERS
              var inputParentInst_model = $.extend( true, {}, inputParentInst() );

              if ( ! _.isObject( inputParentInst_model ) )
                inputParentInst_model = _defaultInputParentModel;
              else
                inputParentInst_model = $.extend( _defaultInputParentModel, inputParentInst_model );

              var dom_inputParentInst_model = {};

              //creates the inputs based on the rendered item or mod opt
              $( '.' + module.control.css_attr.sub_set_wrapper, inputParentInst.container).each( function( _index ) {
                    var _id = $(this).find('[data-type]').attr( 'data-type' ),
                        _value = _.has( inputParentInst_model, _id) ? inputParentInst_model[ _id ] : '';
                    //skip if no valid input data-type is found in this node
                    if ( _.isUndefined( _id ) || _.isEmpty( _id ) ) {
                          api.consoleLog( 'setupInputCollectionFromDOM : missing data-type for ' + module.id );
                          return;
                    }
                    //check if this property exists in the current inputParentInst model
                    if ( ! _.has( inputParentInst_model, _id ) ) {
                          throw new Error('The item or mod opt property : ' + _id + ' has been found in the DOM but not in the item or mod opt model : '+ inputParentInst.id + '. The input can not be instantiated.');
                    }

                    //Do we have a specific set of options defined in the parent module for this inputConstructor ?
                    var _inputType      = $(this).attr( 'data-input-type' ),
                        _inputTransport = $(this).attr( 'data-transport' ) || 'inherit',//<= if no specific transport ( refresh or postMessage ) has been defined in the template, inherits the control transport
                        _inputOptions   = _.has( module.inputOptions, _inputType ) ? module.inputOptions[ _inputType ] : {};

                    //INSTANTIATE THE INPUT
                    inputParentInst.czr_Input.add( _id, new inputParentInst.inputConstructor( _id, {
                          id            : _id,
                          type          : _inputType,
                          transport     : _inputTransport,
                          input_value   : _value,
                          input_options : _inputOptions,//<= a module can define a specific set of option
                          container     : $(this),
                          input_parent  : inputParentInst,
                          is_mod_opt    : is_mod_opt,
                          module        : module
                    } ) );

                    //FIRE THE INPUT
                    //fires ready once the input Value() instance is initialized
                    inputParentInst.czr_Input( _id ).ready();

                    //POPULATES THE PARENT INPUT COLLECTION
                    dom_inputParentInst_model[ _id ] = _value;
                    //shall we trigger a specific event when the input collection from DOM has been populated ?
              });//each

              //stores the collection
              inputParentInst.inputCollection( dom_inputParentInst_model );
              //chain
              return inputParentInst;
        },

        //@self explanatory: removes a collection of input from a parent item or modOpt instance
        //Triggered by : user actions usually when an item is collapsed or when the modOpt panel is closed
        removeInputCollection : function() {
              var inputParentInst = this;//<= because fired with .call( inputParentInst )
              if ( ! _.isFunction( inputParentInst ) ) {
                    throw new Error( 'removeInputCollection : inputParentInst is not valid.' );
              }
              if ( ! _.has( inputParentInst, 'czr_Input') )
                return;
              //remove each input api.Value() instance
              inputParentInst.czr_Input.each( function( _input ) {
                    inputParentInst.czr_Input.remove( _input.id );
              });
              //reset the input collection property
              inputParentInst.inputCollection({});
        },

        //Re-instantiate a module control based on its id
        //@param wpSetId : the api id of the control to refresh
        refreshModuleControl : function( wpSetId ) {
              var _constructor = api.controlConstructor.czr_module,
                  _control_type = api.control( wpSetId ).params.type,
                  _control_data = api.settings.controls[wpSetId];

              //remove the container and its control
              $.when( api.control( wpSetId ).container.remove() ).done( function() {
                    //remove the control from the api control collection
                    api.control.remove( wpSetId );

                    //re-instantiate the control with the updated _control_data
                    api.control.add( wpSetId,  new _constructor( wpSetId, { params : _control_data, previewer : api.previewer }) );
              });

        }
  });//$.extend


  // $( window ).on( 'message', function( e, o) {
  //   api.consoleLog('WHAT ARE WE LISTENING TO?', e, o );
  // });
})( wp.customize , jQuery, _);