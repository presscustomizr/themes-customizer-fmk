
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

    getAppliedPrioritySkopeId : function( setId, skope_id ) {
          if ( ! api.has( api.CZR_Helpers.build_setId(setId) ) ) {
                api.errorLog( 'getAppliedPrioritySkopeId : the requested setting id does not exist in the api : ' + api.CZR_Helpers.build_setId(setId) );
                return skope_id;
          }
          if ( ! api.czr_skope.has( skope_id ) ) {
                api.errorLog( 'getAppliedPrioritySkopeId : the requested skope id is not registered : ' + skope_id );
                return skope_id;
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
                if ( api.czr_isChangeSetOn() ) {
                      if ( api.czr_skope( _skp_id ).getSkopeSettingChangesetDirtyness( wpSetId ) )
                        return skope_model.id;
                }

                //do we have a db val stored ?
                var _skope_db_val = self._getDBSettingVal( setId, _skp_id);
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

    //@return string : the skope title from which a setting id inherits its current value
    getOverridenSkopeTitles : function() {
          var skope_id = skope_id || api.czr_activeSkopeId();
          if ( ! api.czr_skope.has( skope_id ) ) {
                api.errorLog( 'getInheritedSkopeTitles : the requested skope id is not registered : ' + skope_id );
                return '';
          }
           //Are we already in the 'local' skope ?
          var self = this,
              _local_skope_id = _.findWhere( api.czr_currentSkopesCollection(), { skope : 'local' } ).id;

          if ( _.isUndefined( _local_skope_id ) || skope_id == _local_skope_id )
            return '';

          //start from local and do the salmon
          var _salmonToMatch = function( _skp_id, _skp_ids ) {
                _skp_ids = _skp_ids || [];
                var skope_model = api.czr_skope( _skp_id )();

                if ( _skp_id == skope_id )
                  return _skp_ids;
                _skp_ids.unshift( _skp_id );
                return _salmonToMatch( self._getParentSkopeId( skope_model ), _skp_ids );
          };

          return _.map( _salmonToMatch( _local_skope_id ), function( id ) {
                return self.buildSkopeLink( id );
          }).join( ' ' + serverControlParams.i18n.skope['and'] + ' ' );
    },


    //@return the skope title from which a setting id inherits its current value
    getInheritedSkopeId : function( setId, skope_id ) {
          if ( ! api.has( api.CZR_Helpers.build_setId(setId) ) ) {
                api.errorLog( 'getInheritedSkopeId : the requested setting id does not exist in the api : ' + api.CZR_Helpers.build_setId(setId) );
                return skope_id;
          }
          if ( ! api.czr_skope.has( skope_id ) ) {
                api.errorLog( 'getInheritedSkopeId : the requested skope id is not registered : ' + skope_id );
                return skope_id;
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
            return skope_id;

          //is the setting CHANGESET dirty ?
          if ( api.czr_isChangeSetOn() ) {
                if ( api.czr_skope( skope_id ).getSkopeSettingChangesetDirtyness( wpSetId ) )
                  return skope_id;
          }

          //do we have a db val stored ?
          var _skope_db_val = self._getDBSettingVal( setId, skope_id );
          if ( _skope_db_val != '_no_db_val' )
            return skope_id;
          //if we are already in the final 'global' skope, then let's return its value
          else if( 'global' == skope_model.skope ) {
            // if ( _.isNull(initial_val) ) {
            //   throw new Error('INITIAL VAL IS NULL FOR SETTING ' + setId + ' CHECK IF IT HAS BEEN DYNAMICALLY ADDED. IF SO, THERE SHOULD BE A DIRTY TO GRAB');
            // }
            return skope_id;
          }
          else
            //if not dirty and no db val, then let's recursively apply the inheritance
            return '___' != val_candidate ?skope_id : self.getInheritedSkopeId( setId, self._getParentSkopeId( skope_model ) );
    },


    //@return the skope title from which a setting id inherits its current value
    //@return string
    getInheritedSkopeTitles : function( skope_id, skope_ids ) {
          skope_id = skope_id || api.czr_activeSkopeId();
          if ( ! api.czr_skope.has( skope_id ) ) {
                api.errorLog( 'getInheritedSkopeTitles : the requested skope id is not registered : ' + skope_id );
                return '';
          }
          skope_ids = skope_ids || [];
          var self = this,
              skope_model = api.czr_skope( skope_id )();

          if ( skope_id !== api.czr_activeSkopeId() )
              skope_ids.unshift( skope_id );

          if ( 'global' !== skope_model.skope )
              return self.getInheritedSkopeTitles( self._getParentSkopeId( skope_model ), skope_ids );

          return _.map( skope_ids, function( id ) {
                return self.buildSkopeLink( id );
          }).join(' ' + serverControlParams.i18n.skope['and'] + ' ');
    },

    //@return string
    buildSkopeLink : function( skope_id ) {
          if ( ! api.czr_skope.has( skope_id ) ) {
                api.errorLog( 'buildSkopeLink : the requested skope id is not registered : ' + skope_id );
                return '';
          }
          var _link_title = [ serverControlParams.i18n.skope['Switch to scope'], api.czr_skope( skope_id )().title ].join(' : ');
          return [
                '<span class="czr-skope-switch" title=" ' + _link_title + '" data-skope-id="' + skope_id + '">',
                api.czr_skope( skope_id )().title,
                '</span>'
          ].join( '' );
    },


    //@return boolean
    //isAllowedWPBuiltinSetting :

    //performs a recursive inheritance to get a setId Val for a given skope
    //@return an api setting value
    getSkopeSettingVal : function( setId, skope_id ) {
          if ( ! api.has( api.CZR_Helpers.build_setId(setId) ) ) {
                api.errorLog( 'getSkopeSettingVal : the requested setting id does not exist in the api : ' + api.CZR_Helpers.build_setId(setId) );
                return null;
          }
          if ( ! api.czr_skope.has( skope_id ) ) {
                api.errorLog( 'getSkopeSettingVal : the requested skope id is not registered : ' + skope_id );
                return null;
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
          if ( api.czr_isChangeSetOn() ) {
                if ( api.czr_skope( skope_id ).getSkopeSettingChangesetDirtyness( wpSetId ) )
                  return api.czr_skope( skope_id ).changesetValues()[ wpSetId ];
          }

          //do we have a db val stored ?
          var _skope_db_val = self._getDBSettingVal( setId, skope_id );
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
    }

});//$.extend
})( wp.customize , jQuery, _ );