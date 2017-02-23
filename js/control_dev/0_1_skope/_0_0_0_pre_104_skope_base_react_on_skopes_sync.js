
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

    /*****************************************************************************
    * REACT ON SKOPE SYNCED
    *****************************************************************************/
    //Fired on 'czr-skopes-synced'
    //with param :
    //{
    //  czr_skopes : _wpCustomizeSettings.czr_skopes || [],
    //  isChangesetDirty : boolean,
    // }
    reactWhenSkopeSyncedDone : function( server_params ) {
          var self = this, dfd = $.Deferred();
          if ( ! _.has( server_params, 'czr_skopes' ) || _.isEmpty( server_params.czr_skopes ) ) {
                api.errorLog( 'Missing skope data after refresh', server_params );
                return dfd.resolve().promise();
          }
          //API DIRTYNESS UPDATE
          if ( ! api.czr_dirtyness() ) {
                api.czr_dirtyness( _.isBoolean( server_params.isChangesetDirty ) ? server_params.isChangesetDirty : false );
          }

          var _sentSkopeCollection = server_params.czr_skopes;
          //CHANGESET UPDATE
          //always update the changesets of the sent skope collection after a refresh
          //match them with the opt_name, because they don't have an id when emitted from server
          _.each( api.czr_skopeCollection(), function( _skp ) {
                var _sent_skope = _.findWhere( _sentSkopeCollection, { opt_name : _skp.opt_name } );
                //do we have a match based on opt_name with the _sentSkopeCollection ?
                if ( _.isUndefined( _sent_skope ) )
                  return;
                //if so then let's update the skope model with the new db values
                var _changeset_candidate = _.isEmpty( _sent_skope.changeset || {} ) ? {} : _sent_skope.changeset,
                    _api_ready_chgset = {};

                //We only update the changeset with registered setting id
                _.each( _changeset_candidate, function( _val, _setId ) {
                      if ( ! api.has( _setId ) ) {
                            api.consoleLog( 'In reactWhenSkopeSyncedDone : attempting to update the changeset with a non registered setting : ' + _setId );
                      }
                      _api_ready_chgset[_setId] = _val;
                });

                //_new_changeset = $.extend( api.czr_skope( _skp.id ).changesetValues(), _sent_changeset );
                //=> updating the changeset will also trigger a skope dirtyValues() update
                api.czr_skope( _skp.id ).changesetValues( _api_ready_chgset );
          });

          //DB VALUES UPDATE
          //UPDATE EACH SKOPE MODEL WITH THE NEW DB VAL SENT BY THE SERVER
          //The sent skope have no id (because assigned in the api)
          //=> however we can match them with their unique opt_name property
          //then update the skope db values, including the global skope
          _.each( api.czr_skopeCollection(), function( _skp ) {
                var _sent_skope = _.findWhere( _sentSkopeCollection, { opt_name : _skp.opt_name } );
                //do we have a match based on opt_name with the _sentSkopeCollection ?
                if ( _.isUndefined( _sent_skope ) )
                  return;

                //if so then let's update the skope model with the new db values
                var _current_db_vals  = $.extend( true, {}, api.czr_skope( _skp.id ).dbValues() ),
                    _dbVals_candidate = $.extend( _current_db_vals , _sent_skope.db || {} ),
                    _api_ready_dbvals = {};

                //We only update the dbValues with registered setting id
                _.each( _dbVals_candidate, function( _val, _setId ) {
                      if ( ! api.has( _setId ) ) {
                            api.consoleLog( 'In reactWhenSkopeSyncedDone : attempting to update the db values with a non registered setting : ' + _setId );
                      }
                      _api_ready_dbvals[_setId] = _val;
                });


                api.czr_skope( _skp.id ).dbValues( _api_ready_dbvals );
          });
          //introduce a small delay to let the api values be fully updated
          //useful when attempting to refresh the control notices after a save action
          _.delay( function() {
              dfd.resolve();
          }, 500 );
          return dfd.promise();
    }
});//$.extend()
})( wp.customize , jQuery, _ );