
( function ( api, $, _ ) {
      api.bind( 'czr-skope-started', function() {
            var _original_save = api.previewer.save, response;

            // OVERRIDES WP
            // Save the changesets for all skopes as post metas of the customize_changeset post
            // Then fire the original save method
            // => server side, if the changeset post status transitions to "publish", the skope metas attached to the customize_changeset post will be merged with the post metas of the skope post.
            // This "publish" case is handled by add_action( 'transition_post_status', 'ha_publish_skope_changeset_metas', 0, 3 );
            api.previewer.save = function( args ) {
                  //return api.czr_skopeSave.save( args );
                  return api.requestChangesetUpdate( {}, { autosave: true } )
                              .always( function( _response_ ) {
                                    response = _response_.response;
                                    _original_save.apply( api.previewer,  args ).done( function() {
                                          //<@4.9compat>
                                          //api.state( 'selectedChangesetStatus' ) was introduced in 4.9
                                          if ( api.state.has( 'selectedChangesetStatus' ) && 'publish' != api.state( 'selectedChangesetStatus' )() )
                                            return;
                                          //</@4.9compat>
                                          api.previewer.refresh( { waitSkopeSynced : true } )
                                                .fail( function( refresh_data ) {
                                                      api.consoleLog('Refresh failed after a save action', refresh_data );
                                                })
                                                .done( function( refresh_data ) {
                                                      //response can be undefined, always set them as an object with 'publish' changet_setstatus by default
                                                      //because this will be used in various api events ( 'saved', ... ) that does not accept an undefined val.
                                                      response = _.extend( { changeset_status : 'publish' },  response || {} );
                                                      //POST PROCESS AFTER SAVE
                                                      //Reset dirtyness
                                                      //check if synchronized with server
                                                      reactWhenSaveDone( refresh_data.skopesServerData );
                                                });
                                    });
                              })
                              .fail( function( _response_ ) {
                                  response = _response_.response;
                                  api.consoleLog( 'apiRequestChangesetUpdate failed => ', response );
                              })
                              .done( function( _response_ ) {
                                  var _dirtyness_ = {};

                                  _.each( api.czr_currentSkopesCollection(), function( _skp ) {
                                        _.each( api.czr_skope( _skp.id ).dirtyValues(), function( _val, _setId ) {
                                            _dirtyness_[_setId] = _val;
                                        });
                                  } );

                                  if ( _.isEmpty( _dirtyness_ ) ) {
                                        api.state( 'changesetStatus' ).set( 'auto-draft' == api.state( 'changesetStatus' )() ? '' : api.state( 'changesetStatus' )() );
                                        api.state( 'saved' )(true);
                                  }
                              });
            };

            //Fired when all submissions are done and the preview has been refreshed
            //@param {} skopesServerData looks like :
            //{
            //    czr_skopes : [
            //        0 : { ... skope_model_0 ... },
            //        1 : { ... skope_model_1 ... },
            //        2 : { ... skope_model_2 ... }
            //    ],
            //    isChangesetDirty : boolean
            //}
            var reactWhenSaveDone = function( skopesServerData ) {
                  var saved_dirties = {};
                  skopesServerData = _.extend(
                      {
                            czr_skopes : [],
                            isChangesetDirty : false
                      },
                      skopesServerData
                  );

                  //STORE THE SAVED DIRTIES AND RESET THEM FOR EACH SKOPE
                  // store the saved dirties with their opt name ! important because we will need to match the data sent by the server, before the skope id is generated
                  // (will be used as param to update the db val property of each saved skope)
                  // AND THEN reset them for each skope
                  _.each( api.czr_skopeCollection(), function( _skp_ ) {
                        saved_dirties[ _skp_.opt_name ] = api.czr_skopeBase.getSkopeDirties( _skp_.id );
                        api.czr_skope( _skp_.id ).dirtyValues( {} );
                        api.czr_skope( _skp_.id ).changesetValues( {} );
                  });


                  //ARE THE SAVED DIRTIES AND THE UPDATED DB VALUES SENT BY SERVER SYNCHRONIZED ?
                  // => let's check if the server sends the same saved values
                  // => reset the czr_saveDirties to default.
                  var _notSyncedSettings    = [],
                      _sentSkopeCollection  = skopesServerData.czr_skopes;

                  //api.consoleLog('REACT WHEN SAVE DONE', skopesServerData, saved_dirties, _sentSkopeCollection );;

                  _.each( saved_dirties, function( skp_data, _saved_opt_name ) {
                        _.each( skp_data, function( _val, _setId ) {
                              //first, let's check if the sent skopes have not changed ( typically, if a user has opened another page in the preview )
                              if ( _.isUndefined( _.findWhere( _sentSkopeCollection, { opt_name : _saved_opt_name } ) ) )
                                return;
                              //exclude ExcludedWPBuiltinSetting and not eligible theme settings from this check
                              if ( ! api.czr_skopeBase.isSettingSkopeEligible( _setId ) )
                                return;

                              var sent_skope_db_values  = _.findWhere( _sentSkopeCollection, { opt_name : _saved_opt_name } ).db,
                                  sent_skope_level      = _.findWhere( _sentSkopeCollection, { opt_name : _saved_opt_name } ).skope,
                                  wpSetId               = api.CZR_Helpers.build_setId( _setId ),
                                  shortSetId            = api.CZR_Helpers.getOptionName( _setId ),
                                  sent_set_val          = sent_skope_db_values[wpSetId];

                              //for the global skope, the server won't send the settings for which the value has been reset to default
                              //skip this case too
                              if ( _.isUndefined( sent_set_val ) && 'global' == sent_skope_level && _val === serverControlParams.defaultOptionsValues[shortSetId] )
                                return;

                              if ( _.isUndefined( sent_set_val ) || ! _.isEqual( sent_set_val, _val ) ) {
                                    _notSyncedSettings.push( { opt_name : _saved_opt_name, setId : wpSetId, server_val : sent_set_val, api_val : _val } );
                              }
                        });
                  });

                  if ( ! _.isEmpty( _notSyncedSettings ) ) {
                        api.consoleLog('SOME SETTINGS HAVE NOT BEEN PROPERLY SAVED : ', _notSyncedSettings );
                  } else {
                        api.consoleLog('ALL RIGHT, SERVER AND API ARE SYNCHRONIZED AFTER SAVE' );
                  }

                  //SYNCHRONIZE THE API.SETTINGS.SETTINGS WITH THE SAVED VALUE FOR GLOBAL SKOPE
                  //finally make sure the api.settings.settings values are always synchronized with the global skope instance
                  api.czr_skopeBase.maybeSynchronizeGlobalSkope();

                  //UPDATE CURRENT SKOPE CONTROL NOTICES IN THE CURRENTLY EXPANDED SECTION
                  api.czr_skopeBase.updateCtrlSkpNot( api.CZR_Helpers.getSectionControlIds() );

                  //MAKE SURE TO COLLAPSE THE CONTROL NOTICES AFTER SAVED IF CURRENT SKOPE IS GLOBAL
                  var _setupSectionCtrlNotices = function() {
                        var sectionCtrls = api.CZR_Helpers.getSectionControlIds( api.czr_activeSectionId() );
                        _.each( sectionCtrls, function( ctrlId ) {
                              if ( ! api.has( ctrlId ) || _.isUndefined( api.control( ctrlId ) ) )
                                return;
                              var ctrl = api.control( ctrlId );
                              if ( ! _.has( ctrl, 'czr_states' ) )
                                return;
                              ctrl.czr_states( 'noticeVisible' )( api.czr_skopeBase.isCtrlNoticeVisible( ctrlId ) );
                        });
                  };
                  //_.delay( _setupSectionCtrlNotices, 500 );
            };//reactWhenSaveDone()
      });//api.bind('ready')
})( wp.customize , jQuery, _ );