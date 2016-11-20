
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
                if ( ! _.has( api.control( control_id ), 'settings' ) || ! _.has( api.control( control_id ).settings, setting_type ) ) {
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
                //exclude the WP built-in settings like sidebars_widgets*, nav_menu_*, widget_*, custom_css
                var _patterns = [ 'widget_', 'nav_menu', 'sidebars_', 'custom_css' ],
                    _isExcld = false;
                _.each( _patterns, function( _ptrn ) {
                      if ( _isExcld )
                        return;
                      _isExcld = _ptrn == setId.substring( 0, _ptrn.length );
                });
                if ( _isExcld )
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
        has_part_refresh : function( setId ) {
                if ( ! _.has( api, 'czr_partials')  )
                  return;
                return  _.contains( _.map( api.czr_partials(), function( partial, key ) {
                  return _.contains( partial.settings, setId );
                }), true );
        },

        //@return the array of controls in a given section_id
        getSectionControlIds : function( section_id ) {
                section_id = section_id || api.czr_activeSectionId();
                if ( ! api.section.has( section_id) )
                  return;
                var sec_ctrl = [];
                api.control.each( function( _ctrl ) {
                    if ( section_id == _ctrl.section() )
                      sec_ctrl.push( _ctrl.id );
                });
                return sec_ctrl;
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
        }

  });//$.extend

  //react to a ctx change
  //api.czr_wp_conditionals.callbacks.add( function( e, o) {
    //api.consoleLog('the wp conditionals have been updated', e, o );
  //});

  // $( window ).on( 'message', function( e, o) {
  //   api.consoleLog('WHAT ARE WE LISTENING TO?', e, o );
  // });
})( wp.customize , jQuery, _);