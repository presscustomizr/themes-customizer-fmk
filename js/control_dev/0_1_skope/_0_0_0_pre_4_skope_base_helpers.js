
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
    isSkopeRegisteredInCollection : function( skope, collection ) {
          var self = this;
          collection = collection || api.czr_skopeCollection();
          return ! _.isUndefined( _.findWhere( collection, { id : skope.id } ) );
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
          console.log('CHANGED DB VAL', _changedDbVal );
          return _changedDbVal;
    },


    //@return the current active skope
    //If a skope different than global has saved db values, let's set it as active
    getActiveSkope : function( _current_skope_collection ) {
          var _active_candidates = {},
              _def = _.findWhere( _current_skope_collection, {is_default : true } ).id;
          _def = ! _.isUndefined(_def) ? _def : _.findWhere( _current_skope_collection, { skope : 'global' } ).id;

          _.each( _current_skope_collection, function( _skop ) {
              //if ( ! _.isEmpty( _skop.db ) )
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


    isSettingEligible : function( setId ) {
          return ( -1 != setId.indexOf(serverControlParams.themeOptions) ) || _.contains( serverControlParams.wpBuiltinSettings, setId );
    }

});//$.extend