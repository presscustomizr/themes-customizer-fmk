
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {

    /*****************************************************************************
    * HELPERS
    *****************************************************************************/
    //DEPRECATED
    // getGlobalSettingVal : function() {
    //       var self = this, _vals = {};
    //       //parse the current eligible scope settings and write an setting val object
    //       api.each( function ( value, key ) {
    //           //only the current theme options are eligible
    //           if ( ! self.isSettingSkopeEligible(key) )
    //             return;
    //           _vals[key] = value();
    //       });
    //       return _vals;
    // },


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


    //@return the current active skope
    //If a skope different than global has saved db values, let's set it as active
    getActiveSkope : function( _current_skope_collection ) {
          var _active_candidates = {},
              _def = _.findWhere( _current_skope_collection, {is_default : true } ).id;
          _def = ! _.isUndefined(_def) ? _def : _.findWhere( _current_skope_collection, { skope : 'global' } ).id;

          _.each( _current_skope_collection, function( _skop ) {
                _active_candidates[_skop.skope] = _skop.id;
          });

          //Apply a basic skope priority. => @todo refine this treatment
          if ( _.has( _active_candidates, 'local' ) )
            return _active_candidates.local;
          if ( _.has( _active_candidates, 'group' ) )
            return _active_candidates.group;
          if ( _.has( _active_candidates, 'special_group' ) )
            return active_candidates.special_group;
          return _def;
    },

    //@return boolean
    //! important : the setId param must be the full name. For example : hu_theme_option[color-1]
    isSettingSkopeEligible : function( setId ) {
          var self = this,
              shortSetId = api.CZR_Helpers.getOptionName( setId );

          if( _.isUndefined( setId ) || ! api.has( setId ) ) {
            api.consoleLog( 'THE SETTING ' + setId + ' IS NOT ELIGIBLE TO SKOPE BECAUSE UNDEFINED OR NOT REGISTERED IN THE API.' );
            return;
          }
          //exclude widget controls and menu settings and sidebars
          if ( self.isExcludedWPBuiltinSetting( setId ) )
            return;
          if ( _.contains( serverControlParams.skopeExcludedSettings, shortSetId ) ) {
            //api.consoleLog( 'THE SETTING ' + setId + ' IS NOT ELIGIBLE TO SKOPE BECAUSE PART OF THE EXCLUDED LIST.' );
            return;
          } else if ( -1 != setId.indexOf( serverControlParams.themeOptions ) ) {
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
          if ( -1 == setId.indexOf( serverControlParams.themeOptions ) && ! _.contains( serverControlParams.wpBuiltinSettings, setId ) ) {
            api.consoleLog( 'THE SETTING ' + setId + ' IS NOT ELIGIBLE TO RESET BECAUSE NOT PART OF THE THEME OPTIONS AND NOT WP AUTHORIZED BUILT IN OPTIONS' );
          } else
           return true;
    },



    //@return boolean
    isExcludedWPBuiltinSetting : function( setId ) {
          if ( _.isUndefined(setId) )
            return true;
          if ( 'active_theme' == setId )
            return true;
          //allow the list of server defined settings
          if ( _.contains( serverControlParams.wpBuiltinSettings, setId ) )
            return false;
          //allow sidebars_widget* type
          if ( 'sidebars_' == setId.substring(0, 9) )
            return false;
          //allow widget_* type
          if ( 'widget_' == setId.substring(0, 7) )
            return false;
          //exclude widget_* and nav_menu*
          return 'nav_menu' == setId.substring(0, 8);
          //return 'widget_' == setId.substring(0, 7) || 'nav_menu' == setId.substring(0, 8);
          //return 'widget_' == setId.substring(0, 7) || 'nav_menu' == setId.substring(0, 8) || 'sidebars_' == setId.substring(0, 9);
    },


    //@return boolean
    //isAllowedWPBuiltinSetting :

    //performs a recursive inheritance to get a setId Val for a given skope
    //@return an api setting value
    getSkopeSettingVal : function( setId, skope_id ) {
          if ( ! api.has( api.CZR_Helpers.build_setId(setId) ) ) {
              throw new Error('getSkopeSettingVal : the requested setting id does not exist in the api : ' + api.CZR_Helpers.build_setId(setId) );
          }
          if ( ! api.czr_skope.has( skope_id ) ) {
              throw new Error('getSkopeSettingVal : the requested skope id is not registered : ' + skope_id );
          }
          console.log('WPSETID in getSkopeSettingVAL', api.CZR_Helpers.build_setId(setId));

          var self = this,
              wpSetId = api.CZR_Helpers.build_setId( setId ),
              val_candidate = '___',
              skope_model = api.czr_skope( skope_id )(),
              initial_val;
          //initial val
          //some settings like widgets may be dynamically added. Therefore their initial val won't be stored in the api.settings.settings
          if ( _.has( api.settings.settings, wpSetId ) )
            initial_val = api.settings.settings[wpSetId].value;
          else
            initial_val = null;

          //if the setting is dirty for this skope, don't go further
          if ( api.czr_skope( skope_id ).getSkopeSettingDirtyness( wpSetId ) )
            return api.czr_skope( skope_id ).dirtyValues()[ wpSetId ];

          //do we have a db val stored ?
          var _skope_db_val = self._getDBSettingVal( setId, skope_model );
          if ( _skope_db_val != '_no_db_val' )
            return _skope_db_val;
          //if we are already in the final 'global' skope, then let's return its value
          else if( 'global' == skope_model.skope ) {
            // if ( _.isNull(initial_val) ) {
            //   throw new Error('INITIAL VAL IS NULL FOR SETTING ' + setId + ' CHECK IF IT HAS BEEN DYNAMICALLY ADDED. IF SO, THERE SHOULD BE A DIRTY TO GRAB');
            // }
            return '___' == val_candidate ? initial_val : val_candidate;
          }
          else
            //if not dirty and no db val, then let's recursively apply the inheritance
            return '___' != val_candidate ? val_candidate : self.getSkopeSettingVal( setId, self._getParentSkopeId( skope_model ) );
    },


    //implement the skope inheritance to build the dirtyCustomized
    //@recursive
    applyDirtyCustomizedInheritance : function( dirtyCustomized, skope_id ) {
          skope_id = skope_id || api.czr_activeSkope() || api.czr_skopeBase.getGlobalSkopeId();
          dirtyCustomized = dirtyCustomized || {};

          var self = this,
              skope_model = api.czr_skope( skope_id )();

          if ( 'global' == skope_model.skope )
            return dirtyCustomized;

          var parent_skope_id = self._getParentSkopeId( skope_model ),
              parent_dirties = api.czr_skope( parent_skope_id ).dirtyValues();

          //use the parent dirty value if the current skope setId is not dirty and has no db val
          _.each( parent_dirties, function( _val, wpSetId ){
                var shortSetId = api.CZR_Helpers.getOptionName( wpSetId );
                if ( _.isUndefined( dirtyCustomized[wpSetId] ) && _.isUndefined( skope_model.db[shortSetId] ) )
                    dirtyCustomized[wpSetId] = _val;
          });
          return 'global' == api.czr_skope( parent_skope_id )().skope ? dirtyCustomized : self.applyDirtyCustomizedInheritance( dirtyCustomized, parent_skope_id );
    },



    //@return the parent skope id of a given skope within the collections of currentSkopes
    //recursive
    _getParentSkopeId : function( skope_model, _index ) {
          var self = this,
              hierark = ['local', 'group', 'special_group', 'global'],
              parent_skope_ind = _index || ( _.findIndex( hierark, function( _skp ) { return skope_model.skope == _skp; } ) + 1 ) * 1,
              parent_skope_skope = hierark[ parent_skope_ind ];

          if ( _.isUndefined( parent_skope_skope ) ) {
              return _.findWhere( api.czr_currentSkopesCollection(), { skope : 'global' } ).id;
          }

          //=> the inheritance is limited to current set of skopes
          if ( _.isUndefined( _.findWhere( api.czr_currentSkopesCollection(), { skope : parent_skope_skope } ) ) ) {
              return self._getParentSkopeId( skope_model, parent_skope_ind + 1 );
          }
          return _.findWhere( api.czr_currentSkopesCollection(), { skope : parent_skope_skope } ).id;
    },


    //return the current db value for a pair setId / skope
    _getDBSettingVal : function( setId, skope_model  ) {
          var shortSetId = api.CZR_Helpers.getOptionName(setId),
              wpSetId = api.CZR_Helpers.build_setId(setId);

          return _.has( skope_model.db, shortSetId ) ? skope_model.db[shortSetId] : '_no_db_val';
    },

    //@return the array of controls in a given section_id
    _getSectionControlIds : function( section_id ) {
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
    _getSectionSettingIds : function( section_id ) {
          section_id = section_id || api.czr_activeSectionId();
          if ( ! api.section.has( section_id) )
            return;
          var self = this,
              _sec_settings = [],
              _sec_controls = self._getSectionControlIds( section_id );

          _.each( _sec_controls, function( ctrlId ) {
              _.each( api.control(ctrlId).settings, function( _instance, _k ) {
                  _sec_settings.push( _instance.id );
              });
          });
          return _sec_settings;
    },


    //@return boolean
    //used after a skope reset or a control reset to update the api save state if needed
    isAPIDirty : function() {
          var isDirty = false;
          _.each( api.czr_currentSkopesCollection(), function( skp ){
                if ( ! isDirty && api.czr_skope( skp.id ).dirtyness() )
                  isDirty = true;
          });
          return isDirty;
    },


    //@return {} of dirties
    getSkopeDirties : function( skope_id ) {
          if ( ! api.czr_skope.has( skope_id) )
            return {};
          return api.czr_skope( skope_id ).dirtyValues();
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



    //@return the customized value of a setId in a given skop
    //implements the skope inheritance
    //@recursive
    //@used when generating the dirtyCustomized object in the preview query
    // getSkopeDirtyVal : function( setId, skope_id ) {
    //       skope_id = skope_id || api.czr_activeSkope() || 'global';

    //       if ( ! api.has( api.CZR_Helpers.build_setId(setId) ) ) {
    //           throw new Error('getSkopeSettingVal : the requested setting id does not exist in the api : ' + api.CZR_Helpers.build_setId(setId) );
    //       }
    //       if ( ! api.czr_skope.has( skope_id ) ) {
    //           throw new Error('getSkopeSettingVal : the requested skope id is not registered : ' + skope_id );
    //       }

    //       var self = this,
    //           wpSetId = api.CZR_Helpers.build_setId(setId),
    //           skope_model = api.czr_skope( skope_id )(),
    //           isDirty = skope_id != api.czr_activeSkope() ? api.czr_skope( skope_id ).getSkopeSettingDirtyness( wpSetId ) : api( wpSetId ).dirty,
    //           dirtyVal = skope_id != api.czr_activeSkope() ? api.czr_skope( skope_id ).dirtyValues()[ wpSetId ] : api( wpSetId )();

    //       api.consoleLog('in GET SKOPE DIRTY VAL', skope_id, wpSetId, isDirty, dirtyVal );
    //       //if we are already in the final 'global' skope
    //       if ( 'global' == skope_model.skope && ! isDirty )
    //         return '_no_dirty_val_';

    //       //let's check if the current api val is dirty
    //       return isDirty ? dirtyVal : self.getSkopeDirtyVal( setId, self._getParentSkopeId( skope_model ) );
    //
    // },



});//$.extend