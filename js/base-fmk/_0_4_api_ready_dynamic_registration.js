
( function ( api, $, _ ) {
      /*****************************************************************************
      *
      *****************************************************************************/
      api.bind('ready', function() {
          // do we have dynamic registration candidates
          var dynRegistrationCandidates = serverControlParams.paramsForDynamicRegistration || [];
          if ( ! _.isObject( serverControlParams.paramsForDynamicRegistration ) ) {
                api.errorLog( 'serverControlParams.paramsForDynamicRegistration should be an array');
          }

          _.each( serverControlParams.paramsForDynamicRegistration, function( dynParams, setId ) {
                // The dynamic registration should be explicitely set
                if ( dynParams.module_registration_params && true === dynParams.module_registration_params.dynamic_registration ) {
                      try { registerDynamicModuleSettingControl( dynParams ); } catch( er ) {
                            api.errorLog( er );
                      }
                }
          });

      });//api.bind('ready', function()


      // Register the relevant setting and control based on the current skope ids
      // @return the setting id
      var registerDynamicModuleSettingControl = function( args ) {
            args = _.extend( {
                  'setting_id' : '',
                  'module_type' : '',
                  'option_value'  : [],
                  // 'setting' => array(
                  //     'type' => 'option',
                  //     'default'  => array(),
                  //     'transport' => 'refresh',
                  //     'setting_class' => '',//array( 'path' => '', 'name' => '' )
                  //     'sanitize_callback' => '',
                  //     'validate_callback' => '',
                  // ),
                  'setting' : {},
                  'section' : { id : '', title : '' },
                  'control' : {},
                  //'setting_type' : 'option'

            }, args );

            // we must have not empty setting_id, module_type
            if ( _.isEmpty( args.setting_id ) || _.isEmpty( args.module_type ) ) {
                  api.errare( 'registerDynamicModuleSettingControl => args', args );
                  throw new Error( 'registerDynamicModuleSettingControl => missing params when registrating a setting');
            }

            // the option value must be an array
            if ( ! _.isArray( args.option_value ) && ! _.isObject( args.option_value ) ) {
                  throw new Error( 'registerDynamicModuleSettingControl => the module values must be an array or an object');
            }

            var settingId =  args.setting_id,
                settingArgs = args.setting;

            // MAYBE REGISTER THE SETTING
            // Register only if not registered already
            // For example, when saved as draft in a changeset, the setting is already dynamically registered server side
            // => in this case, we only need to register the associated control
            if ( ! api.has( settingId ) ) {
                  settingArgs = _.extend(
                        {
                              dirty : false,
                              value : [],
                              previewer: api.previewer,
                              transport : 'refresh',
                              type : 'option',
                        },
                        {
                              value : args.option_value,
                              transport : settingArgs.transport || 'refresh',
                              type : settingArgs.type || 'option'
                        }
                  );
                  // assign the value sent from the server
                  settingArgs.value = args.option_value;

                  var SettingConstructor = api.settingConstructor[ settingArgs.type ] || api.Setting;
                  api.add( new SettingConstructor( settingId, settingArgs.value, settingArgs ) );
            }

            // MAYBE REGISTER THE SECTION
            var sectionArgs = args.section;
            if ( ! _.isEmpty( sectionArgs ) ) {
                  // Check if we have a correct section
                  if ( ! _.has( sectionArgs, 'id' ) ){
                        throw new Error( 'registerDynamicModuleSettingControl => missing section id for the section of setting : ' + settingId );
                  }

                  if ( ! api.section.has( sectionArgs.id ) ) {
                        var _secData = _.extend(
                            {
                              active:true,
                              content:"",
                              customizeAction:"Customizing",
                              description:"",
                              description_hidden:false,
                              id: "",
                              instanceNumber: 99,
                              panel: "",
                              priority:0,
                              title: "",
                              type: "default",
                            }, {
                              id: sectionArgs.id,
                              title: sectionArgs.title || sectionArgs.id,
                              description: _.isEmpty( sectionArgs.description ) ? '' : sectionArgs.description,
                              panel: _.isEmpty( sectionArgs.panel ) ? '' : sectionArgs.panel,
                              priority: sectionArgs.priority || 10
                            }
                        );

                        var Constructor = api.sectionConstructor[ _secData.type ] || api.Section;
                        _secData = _.extend( { params: _secData }, _secData ); // Inclusion of params alias is for back-compat for custom sections that expect to augment this property.
                        api.section.add( new Constructor( _secData.id, _secData ) );
                  }
            }

            // REGISTER THE CONTROL
            var controlId = settingId;

            if ( ! api.control.has( controlId ) ) {


                  // start from a copy of a core control object
                  var controlArgs = args.control,
                      defaultControlArgs = $.extend( true, {} , api.settings.controls.blogdescription ),
                      ctrlSectionId;

                  // Do we have a section ?
                  if ( ! _.isEmpty( args.section ) ) {
                        ctrlSectionId = args.section.id;
                  } else {
                        ctrlSectionId = controlArgs.section;
                  }

                  if ( _.isEmpty( ctrlSectionId ) ) {
                        api.errare( 'registerDynamicModuleSettingControl => missing section id for the control', args );
                        throw new Error( 'registerDynamicModuleSettingControl => missing section id for the section of setting : ' + settingId );
                  }
                  // Then update it with our defaults set server side
                  // array(
                  //     'type'      => 'czr_module',
                  //     'module_type' => 'czr_flat_skope_module',
                  //     'section'   => 'flat_skope_sec'
                  // );
                  controlArgs = _.extend(
                        defaultControlArgs,
                        {
                              type : 'czr_module',
                              module_type : args.module_type,
                              section : ctrlSectionId,
                              content : '',
                              label : controlArgs.label,
                              priority : controlArgs.priority
                        }
                  );

                  // Then associates the settingId
                  controlArgs.settings.default = settingId;

                  var ControlConstructor = api.controlConstructor[ controlArgs.type ] || api.Control, options;
                  options = _.extend( { params: controlArgs }, controlArgs ); // Inclusion of params alias is for back-compat for custom controls that expect to augment this property.
                  var _ctrl_ = api.control.add( new ControlConstructor( controlId, options ) );

                  // if the currently expanded section is the one of the dynamic control
                  // Awake the module => fire ready
                  if ( api.section( ctrlSectionId ).expanded() ) {
                        api.control( controlId ).trigger( 'set-module-ready' );
                  }
            }//if ( ! api.control.has( controlId ) )

            return settingId;
      };//registerDynamicModuleSettingControl
})( wp.customize , jQuery, _);