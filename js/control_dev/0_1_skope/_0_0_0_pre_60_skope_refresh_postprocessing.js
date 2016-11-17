
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {

      //Fired on 'pre_refresh_done'
      //with param : { previewer : previewer, skopesServerData : skopesServerData || {} }
      reactWhenRefreshDone : function( params ) {
            if ( ! _.isObject( params ) || ! _.has( params, 'skopesServerData' ) || _.isEmpty( params.skopesServerData ) )
              return;
            if ( ! _.has( params.skopesServerData, 'czr_skopes' ) || _.isEmpty( params.skopesServerData.czr_skopes ) ) {
                  throw new Error( 'Missing skope data after refresh', params );
            }
            var _sentSkopeCollection = params.skopesServerData.czr_skopes;

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
      }
});//$.extend