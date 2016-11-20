
var CZRSkopeSaveMths = CZRSkopeSaveMths || {};
$.extend( CZRSkopeSaveMths, {
      //Fired when all submissions are done and the preview has been refreshed
      //@param {} skopesServerData looks like :
      //{
      //    czr_skopes : [
      //        0 : { ... skope_model_0 ... },
      //        1 : { ... skope_model_1 ... },
      //        2 : { ... skope_model_2 ... }
      //    ],
      //    skopeGlobalDBOpt : [
      //        0 : "use-header-image"
      //        1 : "footer-ads"
      //    ]
      //}
      reactWhenSaveDone : function( skopesServerData ) {
            var saved_dirties = {};
            skopesServerData = _.extend(
                {
                      czr_skopes : [],
                      isChangesetDirty : false,
                      skopeGlobalDBOpt : []
                },
                skopesServerData
            );

            //STORE THE SAVED DIRTIES AND RESET THEM FOR EACH SKOPE
            // store the saved dirties (will be used as param to update the db val property of each saved skope)
            // AND THEN reset them for each skope
            _.each( api.czr_skopeCollection(), function( _skp_ ) {
                  saved_dirties[ _skp_.id ] = api.czr_skopeBase.getSkopeDirties( _skp_.id );
                  api.czr_skope( _skp_.id ).dirtyValues( {} );
            });


            //ARE THE SAVED DIRTIES AND THE UPDATED DB VALUES SENT BY SERVER SYNCHRONIZED ?
            // => let's check if the server sends the same saved values
            // => reset the czr_saveDirties to default.
            var _notSyncedSettings = [],
                _sentSkopeCollection = skopesServerData.czr_skopes;

            _.each( saved_dirties, function( skp_data, skp_id ) {
                  _.each( skp_data, function( _val, _setId ) {
                        //first, let's check if the sent skopes have not changed ( typically, if a user has opened another page in the preview )
                        if ( _.isUndefined( _.findWhere( _sentSkopeCollection, { id : skp_id} ) ) )
                          return;

                        var sent_skope_db_values = _.findWhere( _sentSkopeCollection, { id : skp_id} ).db,
                            shortSetId = api.CZR_Helpers.build_setId( _setId ),
                            sent_set_val = sent_skope_db_values[shortSetId];

                        if ( _.isUndefined( sent_set_val ) || ! _.isEqual(sent_set_val, _val ) ) {
                              _notSyncedSettings.push( { skope_id : skp_id, setId : shortSetId, server_val : sent_set_val, api_val : _val } );
                        }
                  });
            });

            if ( ! _.isEmpty( _notSyncedSettings ) ) {
                  api.consoleLog('SOME SETTINGS HAVE NOT BEEN PROPERLY SAVED : ', _notSyncedSettings );
            }

            //SYNCHRONIZE THE API.SETTINGS.SETTINGS WITH THE SAVED VALUE FOR GLOBAL SKOPE
            //finally make sure the api.settings.settings values are always synchronized with the global skope instance
            api.czr_skopeBase.maybeSynchronizeGlobalSkope();
      }
});//$.extend