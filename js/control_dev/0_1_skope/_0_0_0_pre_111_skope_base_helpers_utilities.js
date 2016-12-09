
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {

    /*****************************************************************************
    * HELPERS
    *****************************************************************************/
    //@return bool
    isSkopeRegisteredInCollection : function( skope_id, collection ) {
          var self = this;
          collection = collection || api.czr_skopeCollection();
          return ! _.isUndefined( _.findWhere( collection, { id : skope_id } ) );
    },

    //@return bool
    isSkopeRegisteredInCurrentCollection : function( skope_id, collection ) {
          var self = this;
          collection = collection || api.czr_currentSkopesCollection();
          return ! _.isUndefined( _.findWhere( collection, { id : skope_id } ) );
    },

    //@return bool
    isGlobalSkopeRegistered : function() {
          var _model = _.findWhere( api.czr_currentSkopesCollection(), { skope : 'global'} );
          return _.isObject( _model ) && _.has( _model, 'id' );
    },

    //@return string
    getGlobalSkopeId : function() {
          if ( ! _.has(api, 'czr_skope') )
            return '';
          var id = '';
          api.czr_skope.each( function(skp){
              if ( 'global' == skp().skope )
                id = skp().id;
          });
          return id;
    },

    //after a saved action, the 'global' option might have changed
    //=> this method, return only the changed db values
    getChangedGlobalDBSettingValues : function( serverGlobalDBValues ) {
          var _changedDbVal = {};

          _.each( serverGlobalDBValues, function( _val, _setId ){
              _wpSetId = api.CZR_Helpers.build_setId( _setId);

              if ( ! _.has( api.settings.settings, _wpSetId ) )
                return;
              if ( _.isEqual( _val , api.settings.settings[ _wpSetId ].value ) )
                return;
              _changedDbVal[_setId] = _val;
          });
          return _changedDbVal;
    },


    //@return the current active skope id
    //If server send isLocalSkope = true, then try to activate the local skope
    //Fallbacks on global
    getActiveSkopeId : function( _current_skope_collection ) {
          _current_skope_collection = _current_skope_collection || api.czr_currentSkopesCollection();

          var _currentSkopeLevel = ( ! _.isEmpty( api.czr_activeSkopeId() ) && api.czr_skope.has( api.czr_activeSkopeId() ) ) ? api.czr_skope( api.czr_activeSkopeId() )().skope : serverControlParams.isLocalSkope ? 'local' : 'global',
              _newSkopeCandidate = _.findWhere( _current_skope_collection, { skope : _currentSkopeLevel } );

          _skpId = ! _.isUndefined( _newSkopeCandidate ) ? _newSkopeCandidate.id : _.findWhere( _current_skope_collection, { skope : 'global' } ).id;

          if ( _.isUndefined( _skpId ) ) {
            throw new Error( 'No default skope was found in getActiveSkopeId ', _current_skope_collection );
          }

          // _.each( _current_skope_collection, function( _skop ) {
          //       _active_candidates[ _skop.skope ] = _skop.id;
          // });

          // //Apply a basic skope priority. => @todo refine this treatment
          // if ( _.has( _active_candidates, 'local' ) )
          //   return _active_candidates.local;
          // if ( _.has( _active_candidates, 'group' ) )
          //   return _active_candidates.group;
          // if ( _.has( _active_candidates, 'special_group' ) )
          //   return active_candidates.special_group;
          return _skpId;
          //return _.findWhere( _current_skope_collection, { skope : 'global' } ).id;
    },

    //@return a skope name string : local, group, special_group, global
    getActiveSkopeName : function() {
          if ( ! api.czr_skope.has( api.czr_activeSkopeId() ) )
            return 'global';
          return api.czr_skope( api.czr_activeSkopeId() )().skope;
    },


    //@return boolean
    //! important : the setId param must be the full name. For example : hu_theme_option[color-1]
    isSettingSkopeEligible : function( setId ) {
          var self = this,
              shortSetId = api.CZR_Helpers.getOptionName( setId );

          if( _.isUndefined( setId ) || ! api.has( setId ) ) {
            api.consoleLog( 'THE SETTING ' + setId + ' IS NOT ELIGIBLE TO SKOPE BECAUSE UNDEFINED OR NOT REGISTERED IN THE API.' );
            return false;
          }
          //exclude :
          //widget controls
          //sidebars
          //menu settings
          //active_theme
          if ( self.isExcludedWPBuiltinSetting( setId ) )
            return false;
          //skopeExcludedSettings look like ( short IDs ) :
          //{
          //   //short ids of theme settings
          //   'post-comments',
          //   'page-comments',
          //   'layout-home',
          //
          //   //protected theme settings
          //   'ver'
          //
          //   //wp builtins
          //   'show_on_front',
          //   'page_on_front',
          // }
          if ( _.contains( serverControlParams.skopeExcludedSettings, shortSetId ) ) {
            //api.consoleLog( 'THE SETTING ' + setId + ' IS NOT ELIGIBLE TO SKOPE BECAUSE PART OF THE EXCLUDED LIST.' );
            return false;
          } else if ( self.isThemeSetting( setId ) ) {
            return true;
            //api.consoleLog( 'THE SETTING ' + setId + ' IS NOT ELIGIBLE TO SKOPE BECAUSE NOT PART OF THE THEME OPTIONS AND NOT WP AUTHORIZED BUILT IN OPTIONS' );
          } else
           return true;
    },


    //@return boolean
    //! important : the setId param must be the full name. For example : hu_theme_option[color-1]
    isSettingResetEligible : function( setId ) {
          var self = this,
              shortSetId = api.CZR_Helpers.getOptionName( setId );

          if( _.isUndefined( setId ) || ! api.has( setId ) ) {
            api.consoleLog( 'THE SETTING ' + setId + ' IS NOT ELIGIBLE TO RESET BECAUSE UNDEFINED OR NOT REGISTERED IN THE API.' );
            return;
          }
          //exclude widget controls and menu settings and sidebars
          if ( self.isExcludedWPBuiltinSetting( setId ) )
            return;
          if ( ! self.isThemeSetting( setId ) && ! _.contains( serverControlParams.wpBuiltinSettings, setId ) ) {
            api.consoleLog( 'THE SETTING ' + setId + ' IS NOT ELIGIBLE TO RESET BECAUSE NOT PART OF THE THEME OPTIONS AND NOT WP AUTHORIZED BUILT IN OPTIONS' );
          } else
           return true;
    },

    //@return bool
    isThemeSetting : function( setId ) {
          return -1 !== setId.indexOf( serverControlParams.themeOptions );
    },

    //@return boolean
    isExcludedWPBuiltinSetting : function( setId ) {
          var self = this;
          if ( _.isUndefined(setId) )
            return true;
          if ( 'active_theme' == setId )
            return true;
          //allow the list of server defined settings
          if ( _.contains( serverControlParams.wpBuiltinSettings, setId ) )
            return false;

          //exclude the WP built-in settings like sidebars_widgets*, widget_*, custom_css
          //specifics for nav_menus:
          //1) exclude always :
          //nav_menu[* => each menu created
          //nav_menu_item => the items of the menus
          //nav_menus_created_posts
          //2) exclude maybe :
          //nav_menu_locations
          var _patterns = [ 'widget_', 'nav_menu', 'sidebars_', 'custom_css', 'nav_menu[', 'nav_menu_item', 'nav_menus_created_posts' ],
              _isExcld = false;
          _.each( _patterns, function( _ptrn ) {
                switch( _ptrn ) {
                      case 'widget_' :
                      case 'sidebars_' :
                            if ( _ptrn == setId.substring( 0, _ptrn.length ) ) {
                                  _isExcld = self.isExcludedSidebarsWidgets();
                            }
                      break;

                      case 'nav_menu[' :
                      case 'nav_menu_item' :
                      case 'nav_menus_created_posts' :
                            if ( _ptrn == setId.substring( 0, _ptrn.length ) ) {
                                  _isExcld = true;
                            }
                      break;

                      case 'nav_menu_locations' :
                            if ( _ptrn == setId.substring( 0, _ptrn.length ) ) {
                                  _isExcld = self.isExcludedNavMenuLocations();
                            }
                      break;

                      case 'custom_css' :
                            if ( _ptrn == setId.substring( 0, _ptrn.length ) ) {
                                  _isExcld = self.isExcludedWPCustomCss();
                            }
                      break;


                }
          });
          return _isExcld;
    },

    //@return bool
    isExcludedSidebarsWidgets : function() {
          var _servParam = serverControlParams.isSidebarsWigetsSkoped;//can be a boolean or a string "" for false, "1" for true
          return ! ( ! _.isUndefined( _servParam ) && ! _.isEmpty( _servParam ) && false !== _servParam );
    },

    //@return bool
    isExcludedNavMenuLocations : function() {
          var _servParam = serverControlParams.isNavMenuLocationsSkoped;//can be a boolean or a string "" for false, "1" for true
          return ! ( ! _.isUndefined( _servParam ) && ! _.isEmpty( _servParam ) && false !== _servParam );
    },

    //@return bool
    isExcludedWPCustomCss : function() {
          var _servParam = serverControlParams.isWPCustomCssSkoped;//can be a boolean or a string "" for false, "1" for true
          return ! ( ! _.isUndefined( _servParam ) && ! _.isEmpty( _servParam ) && false !== _servParam );
    },


    //return the current db value for a pair setId / skope_id
    _getDBSettingVal : function( setId, skope_id  ) {
          var shortSetId = api.CZR_Helpers.getOptionName(setId),
              wpSetId = api.CZR_Helpers.build_setId(setId);
          if ( ! api.czr_skope.has( skope_id ) ) {
                api.consoleLog( '_getDBSettingVal : the requested skope id is not registered : ' + skope_id );
                return '_no_db_val';
          }
          if ( _.has( api.czr_skope( skope_id ).dbValues(), wpSetId ) ) {
                return api.czr_skope( skope_id ).dbValues()[wpSetId];
          } else if ( _.has( api.czr_skope( skope_id ).dbValues(), shortSetId ) ) {
                return api.czr_skope( skope_id ).dbValues()[shortSetId];
          } else {
                return '_no_db_val';
          }
    },


    //@return {} of dirties
    //@options object { unsaved: boolean } was introduced with the changeset in WP 4.7.
    //=> the goal is to only get the api dirties that have not yet been saved in the changeset.
    getSkopeDirties : function( skope_id, options ) {
          if ( ! api.czr_skope.has( skope_id ) )
            return {};

          //the already saved settings are excluded from the skope dirties by default
          //=> the "real" customized values will be re-built server side anyway, by merging $_POST and changeset data, either on refresh or save.
          options = options || {};
          options = _.extend( { unsaved : true }, options );

          var values = {};
          //each skope stores its API dirties in an observable value : dirtyValues()
          _.each( api.czr_skope( skope_id ).dirtyValues(), function( _val, _setId ) {
                var settingRevision;
                //since 4.7 and the changeset, only the settings not yet saved in the db changeset are returned
                if ( api.czr_isChangeSetOn() ) {
                      settingRevision = api._latestSettingRevisions[ _setId ];
                      // Skip including settings that have already been included in the changeset, if only requesting unsaved.
                      if ( api.state( 'changesetStatus' ).get() && ( options && options.unsaved ) && ( _.isUndefined( settingRevision ) || settingRevision <= api._lastSavedRevision ) ) {
                            //api.consoleLog( 'DIRTIES : ' + _setId + ' will be excluded from dirties because last revision was : ' + settingRevision + ' == to last saved revision : ' + api._lastSavedRevision );
                            return;
                      }
                }
                values[ _setId ] = _val;
          } );
          return values;
    },

    getSkopeExcludedDirties : function() {
          //ARE THERE DIRTIES IN THE WP API ?
          var self = this,
              _wpDirties = {};
          api.each( function ( value, setId ) {
                if ( value._dirty ) {
                  _wpDirties[ setId ] = value();
                }
          } );

          //ARE THERE DIRTIES IN THE GLOBAL SKOPE
          var _globalSkopeId = self.getGlobalSkopeId(),
              _globalSkpDirties = self.getSkopeDirties( _globalSkopeId );

          //RETURN THE _wpDirties not present in the global skope dirties
          return _.omit( _wpDirties, function( _value, setId ) {
              //var shortOptName = api.CZR_Helpers.getOptionName( setId );
              return self.isSettingSkopeEligible( setId );
          } );
    },

    /**
   * @param {String} widgetId
   * @returns {Object}
   */
    parseWidgetId : function( widgetId, prefixToRemove ) {
        var matches, parsed = {
          number: null,
          id_base: null
        };

        matches = widgetId.match( /^(.+)-(\d+)$/ );
        if ( matches ) {
          parsed.id_base = matches[1];
          parsed.number = parseInt( matches[2], 10 );
        } else {
          // likely an old single widget
          parsed.id_base = widgetId;
        }

        if ( ! _.isUndefined( prefixToRemove ) )
          parsed.id_base = parsed.id_base.replace( prefixToRemove , '');
        return parsed;
    },

    /**
     * @param {String} widgetId
     * @returns {String} settingId
     */
    widgetIdToSettingId: function( widgetId , prefixToRemove ) {
        var parsed = this.parseWidgetId( widgetId, prefixToRemove ), settingId;

        settingId = parsed.id_base;
        if ( parsed.number ) {
          settingId += '[' + parsed.number + ']';
        }
        return settingId;
    },




    isWidgetRegisteredGlobally : function( widgetId ) {
        var self = this;
            registered = false;
        _.each( _wpCustomizeWidgetsSettings.registeredWidgets, function( _val, _short_id ) {
            if ( ! registered && 'widget_' + self.widgetIdToSettingId(_short_id) == widgetId )
              registered = true;
        } );
        return registered;
    }
});//$.extend