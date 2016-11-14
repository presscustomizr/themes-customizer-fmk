
var CZRSkopeSaveMths = CZRSkopeSaveMths || {};
$.extend( CZRSkopeSaveMths, {
      //defer some actions (included WP core ones ) when all submit promises are done
      reactWhenSubmissionsDone : function( response ) {
            var self = this,
                dfd = $.Deferred(),
                parent = new api.Messenger({
                      url: api.settings.url.parent,
                      channel: 'loader',
                }),//this has to be reinstantiated because not accessible from core
                _saved_dirties = {};// will be used as param to update the skope model db val after all ajx requests are done

            //response can be undefined, always set them as an object with 'publish' changet_setstatus by default
            //because this will be used in various api events ( 'saved', ... ) that does not accept an undefined val.
            response = _.extend( { changeset_status : 'publish' },  response || {} );

            //since 4.7 : if changeset is on, let's add stuff to the query object
            if ( api.czr_isChangedSetOn() ) {
                  var latestRevision = api._latestRevision;
                  api.state( 'changesetStatus' ).set( response.changeset_status );
                  if ( 'publish' === response.changeset_status ) {
                        // Mark all published as clean if they haven't been modified during the request.
                        api.each( function( setting ) {
                              /*
                               * Note that the setting revision will be undefined in the case of setting
                               * values that are marked as dirty when the customizer is loaded, such as
                               * when applying starter content. All other dirty settings will have an
                               * associated revision due to their modification triggering a change event.
                               */
                              if ( setting._dirty && ( _.isUndefined( api._latestSettingRevisions[ setting.id ] ) || api._latestSettingRevisions[ setting.id ] <= latestRevision ) ) {
                                    setting._dirty = false;
                              }
                        } );

                        api.state( 'changesetStatus' ).set( '' );
                        api.settings.changeset.uuid = response.next_changeset_uuid;
                        parent.send( 'changeset-uuid', api.settings.changeset.uuid );
                  }
            } else {
                  // Clear api setting dirty states
                  api.each( function ( value ) {
                        value._dirty = false;
                  } );
            }

            //api.unbind( 'change', captureSettingModifiedDuringSave );
            // Clear setting dirty states, if setting wasn't modified while saving.
            // api.each( function( setting ) {
            //   if ( ! modifiedWhileSaving[ setting.id ] ) {
            //     setting._dirty = false;
            //   }
            // } );

            api.previewer.send( 'saved', response );

            if ( response.setting_validities ) {
                  api._handleSettingValidities( {
                        settingValidities: response.setting_validities,
                        focusInvalidControl: true
                  } );
            }

            var _applyWPDefaultReaction = function( response ) {
                  /////////////////WP default treatments
                  api.state( 'saving' ).set( false );
                  api.trigger( 'saved', response || {} );
                  self.saveBtn.prop( 'disabled', false );
                  console.log('WP DEFAULT REACTION' );
            };

            _applyWPDefaultReaction( response );


            //store the saved dirties (will be used as param to update the db val property of each saved skope)
            // reset them
            _.each( api.czr_skopeCollection(), function( _skp_ ) {
                  _saved_dirties[ _skp_.id ] = api.czr_skopeBase.getSkopeDirties( _skp_.id );
                  api.czr_skope( _skp_.id ).dirtyValues({});
            });

            console.log('WHAT ARE THE SAVED DIRTIES', _saved_dirties );

            if ( _.isEmpty( _saved_dirties ) ) {
                  console.log( 'NO SAVED DIRTIES, NO NEED TO REFRESH AFTER SAVE.');
                  dfd.resolve( { previewer : api.previewer } );
            }

            //The refresh_data look like this ( because we wait for skope to be synced ) :
            //{
            //    previewer : previewer,
            //    skopesServerData : {
            //        czr_skopes : _wpCustomizeSettings.czr_skopes || [],
            //        skopeGlobalDBOpt : _wpCustomizeSettings.skopeGlobalDBOpt || [],
            //    }
            // }
            api.previewer.refresh( { waitSkopeSynced : true } ).done( function( refresh_data ) {
                  refresh_data = _.extend(
                        {
                              previewer :  refresh_data.previewer || api.previewer,
                              skopesServerData : refresh_data.skopesServerData || {}
                        },
                        refresh_data
                  );
                  console.log('REFRESH IS DONE ?');
                  dfd.resolve(
                        {
                              previewer : refresh_data.previewer,
                              skopesServerData : refresh_data.skopesServerData,
                              saved_dirties : _saved_dirties
                        }
                  );
            } );

            // Restore the global dirty state if any settings were modified during save.
            // if ( ! _.isEmpty( modifiedWhileSaving ) ) {
            //   api.state( 'saved' ).set( false );
            // }

            return dfd.promise();
      },//reactWhenSubmissionsDone


      //Fired when all submissions are done and the preview has been refreshed
      //@param {} saved_dirties looks like :
      //{
      //    global__all_: {}
      //    group_all_page: {}
      //    local_post_page_2: { hu_theme_options[copyright] : "copyright SAMPLE PAGE" }
      //}
      //
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
      reactWhenSaveDone : function( saved_dirties, skopesServerData ) {
            saved_dirties = saved_dirties || {};
            skopesServerData = _.extend( {
                czr_skopes : [],
                skopeGlobalDBOpt : []
            } );

            //clean dirtyness and set the db state of each control
            //=> make sure this is set for the active skopes only
            _.each( saved_dirties, function( _skp_dirties, _skp_id ){
                  if ( _skp_id != api.czr_activeSkope() )
                    return;
                  _.each( _skp_dirties, function( _v, setId ) {
                        if ( _.has(api.control( setId ), 'czr_isDirty') ) {
                              api.control(setId).czr_isDirty(false);
                        }
                        if ( _.has(api.control( setId ), 'czr_hasDBVal') ) {
                              api.control(setId).czr_hasDBVal(true);
                        }
                  });
            });


          //Shall we update the db values of the skopes ?
          //1) ON A SAVE ACTION, the czr_saveDirties has been populated,
          // => let's check if the server sends the same saved values
          // => update the skope db properties with the latests saved ones
          // => reset the czr_saveDirties to default.
          var not_synced_settings = [],
              sent_skope_collection = skopesServerData.czr_skopes;

          //lets check that we are synchronized
          console.log('AFTER SAVED : BEFORE SYNC CHECK SAVED DIRTIES : ', saved_dirties, skopesServerData );
          _.each( saved_dirties, function( skp_data, skp_id ) {
                _.each( skp_data, function( _val, _setId ) {
                      //first, let's check if the sent skopes have not changed ( typically, if a user has opened another page in the preview )
                      if ( _.isUndefined( _.findWhere( sent_skope_collection, { id : skp_id} ) ) )
                        return;

                      var sent_skope_db_values = _.findWhere( sent_skope_collection, { id : skp_id} ).db,
                          shortSetId = api.CZR_Helpers.build_setId( _setId ),
                          sent_set_val = sent_skope_db_values[shortSetId];

                      if ( _.isUndefined( sent_set_val ) || ! _.isEqual(sent_set_val, _val ) ) {
                            not_synced_settings.push( { skope_id : skp_id, setId : shortSetId, server_val : sent_set_val, api_val : _val } );
                      }
                });
          });

          if ( ! _.isEmpty( not_synced_settings ) ) {
                api.consoleLog('SOME SETTINGS HAVE NOT BEEN PROPERLY SAVED : ', not_synced_settings );
          }

          //then update the skope db values, including the global skope
          _.each( saved_dirties, function( _dirties, _skope_id ) {
                var _current_model = $.extend( true, {}, api.czr_skope( _skope_id )() ),
                    _new_db_val = ! _.isObject( _current_model.db ) ? {} : $.extend( true, {}, _current_model.db ),
                    _api_ready_dirties = {};

                //build the api ready db value for the skope.
                //=> it the full name, ex : 'hu_theme_options[background_color]'
                _.each( _dirties, function( _val, _wp_opt_name ) {
                      //var _k = api.CZR_Helpers.getOptionName( _wp_opt_name );
                      _api_ready_dirties[_wp_opt_name] = _val;
                });

                api.consoleLog('IN UPDATE SAVED SKOPES DB VALUES', _skope_id, saved_dirties, _new_db_val, _api_ready_dirties);

                //merge current and new
                $.extend( _new_db_val, _api_ready_dirties );
                $.extend( _current_model, { db : _new_db_val, has_db_val : ! _.isEmpty(_api_ready_dirties) } );
                api.czr_skope( _skope_id )( _current_model );
          });

          //finally make sure the api.settings.settings values are always synchronized with the global skope instance
          api.czr_skopeBase.maybeSynchronizeGlobalSkope();
      }
});//$.extend