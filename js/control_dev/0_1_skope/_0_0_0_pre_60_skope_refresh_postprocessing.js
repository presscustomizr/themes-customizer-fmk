
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {

      //Fired on 'czr-skopes-synced'
      //with param :
      //{
      //  czr_skopes : _wpCustomizeSettings.czr_skopes || [],
      //  isChangesetDirty : boolean,
      //  skopeGlobalDBOpt : _wpCustomizeSettings.skopeGlobalDBOpt || []
      // }
      reactWhenSkopeSyncedDone : function( server_params ) {
            var self = this, dfd = $.Deferred();
            if ( ! _.has( server_params, 'czr_skopes' ) || _.isEmpty( server_params.czr_skopes ) ) {
                  throw new Error( 'Missing skope data after refresh', server_params );
            }
            //API DIRTYNESS UPDATE
            if ( ! api.czr_dirtyness() )
              api.czr_dirtyness( _.isBoolean( server_params.isChangesetDirty ) ? server_params.isChangesetDirty : false );

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
                  var _new_changeset = _.isEmpty( _sent_skope.changeset || {} ) ? {} : _sent_skope.changeset;
                  //_new_changeset = $.extend( api.czr_skope( _skp.id ).changesetValues(), _sent_changeset );
                  api.czr_skope( _skp.id ).changesetValues( _new_changeset );
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
                  var _new_db_val = $.extend( api.czr_skope( _skp.id ).dbValues(), _sent_skope.db || {} );

                  api.czr_skope( _skp.id ).dbValues( _new_db_val );
            });
            //introduce a small delay to let the api values be fully updated
            //useful when attempting to refresh the control notices after a save action
            _.delay( function() {
                dfd.resolve();
            }, 500 );
            return dfd.promise();
      }
});//$.extend