
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
    //If a skope different than global has saved db values, let's set it as active
    getActiveSkopeId : function( _current_skope_collection ) {
          _current_skope_collection = _current_skope_collection || api.czr_currentSkopesCollection();
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
          //exclude widget controls and menu settings and sidebars
          if ( self.isExcludedWPBuiltinSetting( setId ) )
            return false;
          if ( _.contains( serverControlParams.skopeExcludedSettings, shortSetId ) ) {
            //api.consoleLog( 'THE SETTING ' + setId + ' IS NOT ELIGIBLE TO SKOPE BECAUSE PART OF THE EXCLUDED LIST.' );
            return false;
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
          var self = this;
          if ( _.isUndefined(setId) )
            return true;
          if ( 'active_theme' == setId )
            return true;
          //allow the list of server defined settings
          if ( _.contains( serverControlParams.wpBuiltinSettings, setId ) )
            return false;

          //exclude the WP built-in settings like sidebars_widgets*, nav_menu_*, widget_*, custom_css
          var _patterns = [ 'widget_', 'nav_menu', 'sidebars_', 'custom_css' ],
              _isExcld = false;
          _.each( _patterns, function( _ptrn ) {
                switch( _ptrn ) {
                      case 'widget_' :
                      case 'sidebars_' :
                            if ( _ptrn == setId.substring( 0, _ptrn.length ) ) {
                                  _isExcld = self.isExcludedSidebarsWidgets();
                            }
                      break;
                      case 'nav_menu' :
                            if ( _ptrn == setId.substring( 0, _ptrn.length ) ) {
                                  _isExcld = self.isExcludedNavMenu();
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
    isExcludedNavMenu : function() {
          var _servParam = serverControlParams.isNavMenuSkoped;//can be a boolean or a string "" for false, "1" for true
          return ! ( ! _.isUndefined( _servParam ) && ! _.isEmpty( _servParam ) && false !== _servParam );
    },

    //@return bool
    isExcludedWPCustomCss : function() {
          var _servParam = serverControlParams.isWPCustomCssSkoped;//can be a boolean or a string "" for false, "1" for true
          return ! ( ! _.isUndefined( _servParam ) && ! _.isEmpty( _servParam ) && false !== _servParam );
    },


    getAppliedPrioritySkopeId : function( setId, skope_id ) {
          if ( ! api.has( api.CZR_Helpers.build_setId(setId) ) ) {
              throw new Error('getSkopeSettingVal : the requested setting id does not exist in the api : ' + api.CZR_Helpers.build_setId(setId) );
          }
          if ( ! api.czr_skope.has( skope_id ) ) {
              throw new Error('getSkopeSettingVal : the requested skope id is not registered : ' + skope_id );
          }

          //Are we already in the 'local' skope ?
          var self = this,
              _local_skope_id = _.findWhere( api.czr_currentSkopesCollection(), { skope : 'local' } ).id;

          if ( _.isUndefined( _local_skope_id ) || skope_id == _local_skope_id )
            return skope_id;

          //start from local and do the salmon until either :
          //1) a value is found
          //2) the requested skope id is reached in the hierarchy
          var _salmonToMatch = function( _skp_id ) {
                var wpSetId = api.CZR_Helpers.build_setId( setId ),
                    val_candidate = '___',
                    skope_model = api.czr_skope( _skp_id )(),
                    initial_val;

                if ( _skp_id == skope_id )
                  return skope_id;

                //is the setting API dirty ?
                if ( api.czr_skope( _skp_id ).getSkopeSettingAPIDirtyness( wpSetId ) )
                  return skope_model.id;

                //is the setting CHANGESET dirty ?
                if ( api.czr_isChangedSetOn() ) {
                      if ( api.czr_skope( _skp_id ).getSkopeSettingChangesetDirtyness( wpSetId ) )
                        return skope_model.id;
                }

                //do we have a db val stored ?
                var _skope_db_val = self._getDBSettingVal( setId, skope_model );
                if ( _skope_db_val != '_no_db_val' ) {
                  return skope_model.id;
                }
                //if we are already in the final 'local' skope, then let's return its value
                else if( 'global' == skope_model.skope ) {
                  // if ( _.isNull(initial_val) ) {
                  //   throw new Error('INITIAL VAL IS NULL FOR SETTING ' + setId + ' CHECK IF IT HAS BEEN DYNAMICALLY ADDED. IF SO, THERE SHOULD BE A DIRTY TO GRAB');
                  // }
                  return skope_model.id;
                }
                else {
                  //if not dirty and no db val, then let's recursively apply the inheritance
                  return '___' != val_candidate ? skope_model.title : _salmonToMatch( self._getParentSkopeId( skope_model ) );
                }
          };
          return _salmonToMatch( _local_skope_id );
    },


    //@return the skope title from which a setting id inherits its current value
    getInheritedSkopeId : function( setId, skope_id ) {
          if ( ! api.has( api.CZR_Helpers.build_setId(setId) ) ) {
              throw new Error('getSkopeSettingVal : the requested setting id does not exist in the api : ' + api.CZR_Helpers.build_setId(setId) );
          }
          if ( ! api.czr_skope.has( skope_id ) ) {
              throw new Error('getSkopeSettingVal : the requested skope id is not registered : ' + skope_id );
          }

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

          //is the setting API dirty ?
          if ( api.czr_skope( skope_id ).getSkopeSettingAPIDirtyness( wpSetId ) )
            return skope_model.id;

          //is the setting CHANGESET dirty ?
          if ( api.czr_isChangedSetOn() ) {
                if ( api.czr_skope( skope_id ).getSkopeSettingChangesetDirtyness( wpSetId ) )
                  return skope_model.id;
          }

          //do we have a db val stored ?
          var _skope_db_val = self._getDBSettingVal( setId, skope_model );
          if ( _skope_db_val != '_no_db_val' )
            return skope_model.id;
          //if we are already in the final 'global' skope, then let's return its value
          else if( 'global' == skope_model.skope ) {
            // if ( _.isNull(initial_val) ) {
            //   throw new Error('INITIAL VAL IS NULL FOR SETTING ' + setId + ' CHECK IF IT HAS BEEN DYNAMICALLY ADDED. IF SO, THERE SHOULD BE A DIRTY TO GRAB');
            // }
            return skope_model.id;
          }
          else
            //if not dirty and no db val, then let's recursively apply the inheritance
            return '___' != val_candidate ? skope_model.id : self.getInheritedSkopeId( setId, self._getParentSkopeId( skope_model ) );
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

          //is the setting API dirty ?
          if ( api.czr_skope( skope_id ).getSkopeSettingAPIDirtyness( wpSetId ) )
            return api.czr_skope( skope_id ).dirtyValues()[ wpSetId ];

          //is the setting CHANGESET dirty ?
          if ( api.czr_isChangedSetOn() ) {
                if ( api.czr_skope( skope_id ).getSkopeSettingChangesetDirtyness( wpSetId ) )
                  return api.czr_skope( skope_id ).changesetValues()[ wpSetId ];
          }

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
          skope_id = skope_id || api.czr_activeSkopeId() || api.czr_skopeBase.getGlobalSkopeId();
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
                if ( _.isUndefined( dirtyCustomized[wpSetId] ) && _.isUndefined( api.czr_skope( skope_model.id ).dbValues()[shortSetId] ) )
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


    //@return the parent skope id of a given skope within the collections of currentSkopes
    //recursive
    _getChildSkopeId : function( skope_model, _index ) {
          var self = this,
              hierark = ['local', 'group', 'special_group', 'global'],
              child_skope_ind = _index || ( _.findIndex( hierark, function( _skp ) { return skope_model.skope == _skp; } ) - 1 ) * 1,
              child_skope_skope = hierark[ child_skope_ind ];

          if ( _.isUndefined( child_skope_skope ) ) {
              return _.findWhere( api.czr_currentSkopesCollection(), { skope : 'local' } ).id;
          }

          //=> the inheritance is limited to current set of skopes
          if ( _.isUndefined( _.findWhere( api.czr_currentSkopesCollection(), { skope : child_skope_skope } ) ) ) {
              return self._getParentSkopeId( skope_model, child_skope_ind - 1 );
          }
          return _.findWhere( api.czr_currentSkopesCollection(), { skope : child_skope_skope } ).id;
    },


    //return the current db value for a pair setId / skope
    _getDBSettingVal : function( setId, skope_model  ) {
          var shortSetId = api.CZR_Helpers.getOptionName(setId),
              wpSetId = api.CZR_Helpers.build_setId(setId);
          if ( _.has( api.czr_skope( skope_model.id ).dbValues(), wpSetId ) ) {
                return api.czr_skope( skope_model.id ).dbValues()[wpSetId];
          } else if ( _.has( api.czr_skope( skope_model.id ).dbValues(), shortSetId ) ) {
                return api.czr_skope( skope_model.id ).dbValues()[shortSetId];
          } else {
                return '_no_db_val';
          }
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
                if ( api.czr_isChangedSetOn() ) {
                      settingRevision = api._latestSettingRevisions[ _setId ];
                      // Skip including settings that have already been included in the changeset, if only requesting unsaved.
                      if ( api.state( 'changesetStatus' ).get() && ( options && options.unsaved ) && ( _.isUndefined( settingRevision ) || settingRevision <= api._lastSavedRevision ) ) {
                            api.consoleLog( 'DIRTIES : ' + _setId + ' will be excluded from dirties because last revision was : ' + settingRevision + ' == to last saved revision : ' + api._lastSavedRevision );
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
    },




    /*****************************************************************************
    * GET SILENT UPDATE CANDIDATE FROM A SECTION. FALLS BACK ON THE CURRENT ONE
    *****************************************************************************/
    _getSilentUpdateCandidates : function( section_id ) {
          var self = this,
              SilentUpdateCands = [];
          section_id = ( _.isUndefined( section_id ) || _.isNull( section_id ) ) ? api.czr_activeSectionId() : section_id;

          if ( _.isUndefined( section_id ) ) {
            api.consoleLog( '_getSilentUpdateCandidates : No active section provided');
            return;
          }
          if ( ! api.section.has( section_id ) ) {
              throw new Error( '_getSilentUpdateCandidates : The section ' + section_id + ' is not registered in the API.');
          }

          //GET THE CURRENT EXPANDED SECTION SET IDS
          var section_settings = api.CZR_Helpers.getSectionSettingIds( section_id );

          //keep only the skope eligible setIds
          section_settings = _.filter( section_settings, function(setId) {
              return self.isSettingSkopeEligible( setId );
          });

          //Populates the silent update candidates array
          _.each( section_settings, function( setId ) {
                SilentUpdateCands.push( setId );
          });

          return SilentUpdateCands;
    }
    //@return the customized value of a setId in a given skop
    //implements the skope inheritance
    //@recursive
    //@used when generating the dirtyCustomized object in the preview query
    // getSkopeDirtyVal : function( setId, skope_id ) {
    //       skope_id = skope_id || api.czr_activeSkopeId() || 'global';

    //       if ( ! api.has( api.CZR_Helpers.build_setId(setId) ) ) {
    //           throw new Error('getSkopeSettingVal : the requested setting id does not exist in the api : ' + api.CZR_Helpers.build_setId(setId) );
    //       }
    //       if ( ! api.czr_skope.has( skope_id ) ) {
    //           throw new Error('getSkopeSettingVal : the requested skope id is not registered : ' + skope_id );
    //       }

    //       var self = this,
    //           wpSetId = api.CZR_Helpers.build_setId(setId),
    //           skope_model = api.czr_skope( skope_id )(),
    //           isDirty = skope_id != api.czr_activeSkopeId() ? api.czr_skope( skope_id ).getSkopeSettingDirtyness( wpSetId ) : api( wpSetId ).dirty,
    //           dirtyVal = skope_id != api.czr_activeSkopeId() ? api.czr_skope( skope_id ).dirtyValues()[ wpSetId ] : api( wpSetId )();

    //       api.consoleLog('in GET SKOPE DIRTY VAL', skope_id, wpSetId, isDirty, dirtyVal );
    //       //if we are already in the final 'global' skope
    //       if ( 'global' == skope_model.skope && ! isDirty )
    //         return '_no_dirty_val_';

    //       //let's check if the current api val is dirty
    //       return isDirty ? dirtyVal : self.getSkopeDirtyVal( setId, self._getParentSkopeId( skope_model ) );
    //
    // },



});//$.extend