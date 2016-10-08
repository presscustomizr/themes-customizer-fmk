
(function (api, $, _) {
  api.CZR_Helpers = api.CZR_Helpers || {};
  //////////////////////////////////////////////////
  /// ACTIONS AND DOM LISTENERS
  //////////////////////////////////////////////////
  //adds action to an existing event map
  //@event map = [ {event1}, {event2}, ... ]
  //@new_event = {  trigger   : event name , actions   : [ 'cb1', 'cb2', ... ] }
  api.CZR_Helpers = $.extend( api.CZR_Helpers, {
        /*****************************************************************************
        * ADD SOME HELPERS AND PROPERTIES TO THE ALWAYS ACCESSIBLE API OBJECT.
        *****************************************************************************/
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
                //exclude the WP built-in settings like sidebars_widgets*, nav_menu_*, widget_*
                if ( 'widget_' == setId.substring(0, 7) || 'nav_menu' == setId.substring(0, 8) || 'sidebars_' == setId.substring(0, 9) )
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