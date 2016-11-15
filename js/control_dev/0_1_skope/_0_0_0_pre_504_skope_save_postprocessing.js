
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
                var _skope_model = $.extend( true, {}, api.czr_skope( _skp.id )() ),
                    _new_db_val = ! _.isObject( _skope_model.db ) ? {} : $.extend( true, {}, _skope_model.db );

                _new_db_val = $.extend( _new_db_val, _sent_skope.db || {} );
                api.czr_skope( _skp.id ).dbValues( _new_db_val );
          });

          //SET HAS DB VAL FOR THE CONTROLS IN THE ACTIVE SKOPE
          //=> make sure this is set for the active skopes only
          // _.each( saved_dirties, function( _skp_dirties, _skp_id ){
          //       if ( _skp_id != api.czr_activeSkope() )
          //         return;
          //       _.each( _skp_dirties, function( _v, setId ) {
          //             if ( _.has(api.control( setId ), 'czr_hasDBVal') ) {
          //                     api.control(setId).czr_hasDBVal(true);
          //             }
          //       });
          // });


          //SYNCHRONIZE THE API.SETTINGS.SETTINGS WITH THE SAVED VALUE FOR GLOBAL SKOPE
          //finally make sure the api.settings.settings values are always synchronized with the global skope instance
          api.czr_skopeBase.maybeSynchronizeGlobalSkope();
      }
});//$.extend