
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {

    /*****************************************************************************
    * HELPERS
    *****************************************************************************/
    getGlobalSettingVal : function() {
          var self = this, _vals = {};
          //parse the current eligible scope settings and write an setting val object
          api.each( function ( value, key ) {
              //only the current theme options are eligible
              if ( ! self.isSettingEligible(key) )
                return;
              _vals[key] = value();
          });
          return _vals;
    },


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
          return _.findWhere( api.czr_currentSkopesCollection(), { skope : 'global'} );
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
    isSettingEligible : function( setId ) {
          if( _.isUndefined( setId ) || ! api.has(setId) )
            return;
          return ( -1 != setId.indexOf(serverControlParams.themeOptions) ) || _.contains( serverControlParams.wpBuiltinSettings, setId );
    },


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
              wpSetId = api.CZR_Helpers.build_setId(setId),
              val_candidate = '___',
              skope_model = api.czr_skope( skope_id )(),
              initial_val = api.settings.settings[wpSetId].value;

          //if the setting is dirty for this skope, don't go further
          if ( api.czr_skope( skope_id ).getSkopeSettingDirtyness( wpSetId ) )
            return api.czr_skope( skope_id ).dirtyValues()[ wpSetId ];

          //do we have a db val stored ?
          var _skope_db_val = self._getDBSettingVal( setId, skope_model );
          if ( _skope_db_val != '_no_db_val' )
            return _skope_db_val;

          //if we are already in the final 'global' skope, then let's return its value
          if( 'global' == skope_model.skope )
            return '___' == val_candidate ? initial_val : val_candidate;

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

    //@return boolean
    //used after a skope reset or a control reset to update the api save state if needed
    isAPIDirty : function() {
          var isDirty = false;
          _.each( api.czr_currentSkopesCollection(), function( skp ){
                if ( ! isDirty && api.czr_skope( skp.id ).dirtyness() )
                  isDirty = true;
          });
          return isDirty;
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