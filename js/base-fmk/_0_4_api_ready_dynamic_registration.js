
( function ( api, $, _ ) {
      /*****************************************************************************
      *
      *****************************************************************************/
      api.bind('ready', function() {
          // do we have dynamic registration candidates
          var dynRegistrationCandidates = serverControlParams.dynamicSettingParams || [];
          if ( ! _.isObject( serverControlParams.dynamicSettingParams ) ) {
                api.errorLog( 'serverControlParams.dynamicSettingParams should be an array');
          }

          //console.log( 'serverControlParams.dynamicSettingParams', serverControlParams.dynamicSettingParams );

          _.each( serverControlParams.dynamicSettingParams, function( dynParams, setId ) {
                try { registerDynamicModuleSettingControl( dynParams ); } catch( er ) {
                      api.errorLog( er );
                }
          });

      });//api.bind('ready', function()


      // Register the relevant setting and control based on the current skope ids
      // @return the setting id
      var registerDynamicModuleSettingControl = function( args ) {
            args = _.extend( {
                  'setting_id' : '',
                  'option_value'  : [],
                  'section' : { id : '', label : '' },
                  'module_type' : '',
                  'setting_type' : 'option'
            }, args );

            // we must have not empty setting_id, section and module_type
            if ( _.isEmpty( args[ 'setting_id'] ) || _.isEmpty( args[ 'section'] ) || _.isEmpty( args[ 'module_type'] ) ) {
                  throw new Error( 'registerDynamicModuleSettingControl => missing params when registrating a setting');
            }

            // the option value must be an array
            if ( ! _.isArray( args[ 'option_value']) ) {
                  throw new Error( 'registerDynamicModuleSettingControl => the module values must be an array');
            }

            // console.log( "args?", args );
            var settingId =  args[ 'setting_id' ],
                sectionData = args[ 'section' ];

            // Check if we have a correct section
            if ( ! _.has( sectionData, 'id' ) || ! _.has( sectionData, 'title' ) ) {
                  throw new Error( 'registerDynamicModuleSettingControl => wrong params for the setting section');
            }

            // MAYBE REGISTER THE SECTION
            if ( ! api.section.has( sectionData.id ) ) {
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
                        id: sectionData.id,
                        title: sectionData.title,
                        panel: _.isEmpty( sectionData.title ) ? '' : sectionData.panel
                      }
                  );

                  var Constructor = api.sectionConstructor[ _secData.type ] || api.Section;
                  _secData = _.extend( { params: _secData }, _secData ); // Inclusion of params alias is for back-compat for custom sections that expect to augment this property.
                  api.section.add( new Constructor( _secData.id, _secData ) );
            }

            // MAYBE REGISTER THE SETTING
            // Register only if not registered already
            // For example, when saved as draft in a changeset, the setting is already dynamically registered server side
            // => in this case, we only need to register the associated control
            if ( ! api.has( settingId ) ) {
                  var settingData = _.extend(
                        {
                              transport : 'refresh',
                              type : 'option',
                        }, {
                              dirty : false,
                              value : args[ 'option_value' ],
                              previewer: api.previewer
                        }
                  );

                  // console.log('registerDynamicModuleSettingControl => SETTING DATA ?', settingId, settingData);
                  var SettingConstructor = api.settingConstructor[ settingData.type ] || api.Setting;
                  api.add( new SettingConstructor( settingId, settingData.value, settingData ) );
            }

            // REGISTER THE CONTROL
            var controlId = settingId;
            // start from a copy of a core control object
            var controlData = $.extend( true, {} , api.settings.controls.blogdescription );
            // Then update it with our defaults set server side
            // array(
            //     'type'      => 'czr_module',
            //     'module_type' => 'czr_flat_skope_module',
            //     'section'   => 'flat_skope_sec'
            // );
            controlData = _.extend(
                  controlData,
                  {
                        type : 'czr_module',
                        module_type : args[ 'module_type'],
                        section : sectionData.id,
                        content : '',
                        label : args[ 'control_label']
                  }
            );

            // Then associates the settingId
            controlData.settings.default = settingId;

            var ControlConstructor = api.controlConstructor[ controlData.type ] || api.Control, options;
            options = _.extend( { params: controlData }, controlData ); // Inclusion of params alias is for back-compat for custom controls that expect to augment this property.
            var _ctrl_ = api.control.add( new ControlConstructor( controlId, options ) );

            // if the currently expanded section is the one of the dynamic control
            // Awake the module => fire ready
            if ( api.section( sectionData.id ).expanded() ) {
                  api.control( controlId ).trigger( 'set-module-ready' );
            }
            // console.log('registerDynamicModuleSettingControl => CONTROL DATA ?', settingId, options);
            // console.log('ALORS IN DYNAMIC REGISTRATION ? ', dataForSkopeToRegister, settingId );

            return settingId;
      };//registerDynamicModuleSettingControl
})( wp.customize , jQuery, _);