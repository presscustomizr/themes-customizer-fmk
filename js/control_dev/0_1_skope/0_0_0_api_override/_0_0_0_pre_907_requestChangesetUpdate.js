
( function ( api, $, _ ) {
      if ( ! serverControlParams.isSkopOn || ! api.czr_isChangeSetOn() )
        return;

      //WP Changeset is requested for an update with an ajax query in the following situation :
      //1) before unloading the window
      //2) when focus removed from window.
      //3) on schedule : every 60 000 ms. ( api.settings.timeouts.changesetAutoSave ) <= set to 10 000 ms on api 'ready' for skope
      //
      //
      //But the update will only takes place if the current api.dirtyValues() are not empty. That's the problem we address with this override.
      //The function api.dirtyValues() only returns :
      //1) the dirty settings of the global skope
      //2) AND that have not been saved during the latest saved revision ( api._lastSavedRevision )
      //
      //
      //So we need to find a way to fire a changeset update for all the other skopes
      //The proposed solution here is to base the changeset update decision not on the emptyness of the dirtyValues but on the api._latestRevision index.
      //
      //
      //How does the saved and revision index works.
      //api._lastSavedRevision is set when the changeset update request is done() with the following code :
      //api._lastSavedRevision = Math.max( api._latestRevision, api._lastSavedRevision );
      //
      //api._latestRevision is incremented +1 each time a setting change occurs in the api. Not matter in which skope this change has been done.
      //
      //Therefore, as soon as we detect that api._latestRevision > api._lastSavedRevision, then we can authorize a changeset update.
      //The changeset update request will pass the usual skope query parameters, including the current skope dirtyness.
      //=> this will allow an ajax update of the changeset post metas for the modified skopes.
      //
      //
      //IMPORTANT :
      //If the 0 === api._lastSavedRevision is empty and that we are not customizing the global skope,
      //it means that the changeset post ID will not be set yet
      //=> But the skope meta changeset need a post ID ! when doing the ajax request server side
      //so the original method has to be fired with a dummy change,
      //this will pass the write the _.isEmpty( submittedChanges ) test in api.requestChangesetUpdate() and create a post ID


      //Backup the original method
      var _original_requestChangesetUpdate = api.requestChangesetUpdate;

      /**
       * Request updates to the changeset.
       * @since 4.7.0
       * @access public
       *
       * @param {object}  [changes] - Mapping of setting IDs to setting params each normally including a value property, or mapping to null.
       *                             If not provided, then the changes will still be obtained from unsaved dirty settings.
       * @param {object}  [_args_] - Additional options for the save request.
       * @param {boolean} [_args_.autosave=false] - Whether changes will be stored in autosave revision if the changeset has been promoted from an auto-draft.
       * @param {boolean} [_args_.force=false] - Send request to update even when there are no changes to submit. This can be used to request the latest status of the changeset on the server.
       * @param {string}  [_args_.title] - Title to update in the changeset. Optional.
       * @param {string}  [_args_.date] - Date to update in the changeset. Optional.
       * @returns {jQuery.Promise} Promise resolving with the response data.
       */
      //@4.9compat : added _args_
      api.requestChangesetUpdate = function( changes, _args_ ) {
            var self = this,
                dfd = $.Deferred(),
                data,
                _skopesToUpdate = [],
                _promises = [],
                _global_skope_changes = changes || {},
                failedPromises = [],
                _all_skopes_data_ = [],
                _recursiveCallDeferred = $.Deferred();
                // _original = function( changes ) {
                //     _original_requestChangesetUpdate(changes).then( function( data ) {
                //         dfd.resolve( data );
                //     });
                // };
            //<@4.9compat>
            _args_ = _args_ || {};
            //</@4.9compat>
            //if skope instantiation went wrong, serverControlParams.isSkopOn has been reset to false
            //=> that's why we check it here again before doing anything else
            if ( ! serverControlParams.isSkopOn ) {
                  return _original_requestChangesetUpdate();
            }


            //MAKES SURE THAT A CHANGESET POST ID EXISTS
            //=> add a dummy_change to global if if ( 0 === api._lastSavedRevision || _.isEmpty( api.state( 'changesetStatus' )() ) )
            //
            //and that we are not customizing the global skope,
            //it means that the changeset post ID will not be set yet, so let's fire the original
            //The core WP method will only create a new changeset post if there is something to save
            //=> that's the purpose of this dummy_change
            if ( 0 === api._lastSavedRevision || _.isEmpty( api.state( 'changesetStatus' )() ) ) {
                  _global_skope_changes = _.extend( _global_skope_changes, {
                        blogname : { dummy_change : 'dummy_change' }
                  } );
            }

            //POPULATE THE SKOPE CHANGESET UPDATES PROMISES
            //Loop current skopes collection
            //Exclude the global skope
            _.each( api.czr_currentSkopesCollection(), function( _skp ) {
                  if ( 'global' == _skp.skope )
                    return;
                  _skopesToUpdate.push( _skp.id );
            } );

            var _mayBeresolve = function( _index ) {
                  if ( ! _.isUndefined( _skopesToUpdate[ _index + 1 ] ) || _promises.length != _skopesToUpdate.length )
                    return;

                  if ( _.isEmpty( failedPromises ) ) {
                        _recursiveCallDeferred.resolve( _all_skopes_data_ );
                  } else {
                        var _buildResponse = function() {
                                  var _failedResponse = [];
                                  _.each( failedPromises, function( _r ) {
                                        _failedResponse.push( api.czr_skopeBase.buildServerResponse( _r ) );
                                  } );
                                  return $.trim( _failedResponse.join( ' | ') );
                        };
                        _recursiveCallDeferred.reject( _buildResponse() );
                  }
                  return true;
            };


            // recursive pushes for not global skopes
            var recursiveCall = function( _index ) {
                  //on first push run, set the api state to processing.
                  // Make sure that publishing a changeset waits for all changeset update requests to complete.
                  if ( _.isUndefined( _index ) || ( ( 0 * 0 ) == _index ) ) {
                      api.state( 'processing' ).set( 1 );
                  }

                  _index = _index || 0;
                  if ( _.isUndefined( _skopesToUpdate[_index] ) ) {
                        api.consoleLog( 'Undefined Skope in changeset recursive call ', _index, _skopesToUpdate, _skopesToUpdate[_index] );
                        return _recursiveCallDeferred.resolve( _all_skopes_data_ ).promise();
                  }

                  //_promises.push( self.getSubmitPromise( _skopesToUpdate[ _index ] ) );
                  ////@4.9compat : added _args_ param
                  api._requestSkopeChangetsetUpdate( changes, _skopesToUpdate[_index], _args_ )
                        .always( function() { _promises.push( _index ); } )
                        .fail( function( response ) {
                              failedPromises.push( response );
                              api.consoleLog('CHANGESET UPDATE RECURSIVE FAIL FOR SKOPE : ', _skopesToUpdate[_index] );
                              if (  ! _mayBeresolve( _index ) )
                                recursiveCall( _index + 1 );
                        } )
                        .done( function( _skope_data_ ) {
                              _all_skopes_data_.push( _skope_data_ );
                              if (  ! _mayBeresolve( _index ) )
                                recursiveCall( _index + 1 );
                        } );

                  return _recursiveCallDeferred.promise();
            };




            //RESOLVE WITH THE WP GLOBAL CHANGESET PROMISE WHEN ALL SKOPE PROMISES ARE DONE
            //PROBLEM TO SOLVE : in the core original changeset method, the api._lastSavedRevision property is incremented when global dirties are saved
            //=> between the core changeset update and before the skope changeset update, we need to reset the api._lastSavedRevision to its previous value
            //=> otherwise some dirties might not be taken into account in the skope.
            //=> This can happen typically for a setting dirty both in global and other skope(s)
            var _lastSavedRevisionBefore = api._lastSavedRevision;
            //@4.9 compat : added _args_ param
            _original_requestChangesetUpdate( _global_skope_changes, _args_ )
                  .fail( function( r ) {
                        api.consoleLog( 'WP requestChangesetUpdateFail', r, api.czr_skopeBase.buildServerResponse(r) );

                        // Ensure that all settings updated subsequently will be included in the next changeset update request.
                        api._lastSavedRevision = Math.max( api._latestRevision, api._lastSavedRevision );
                        //api.state( 'changesetStatus' ).set( _data_.changeset_status );
                        // Make sure that publishing a changeset waits for all changeset update requests to complete.
                        api.state( 'processing' ).set( 0 );

                        dfd.reject( r );
                        r = api.czr_skopeBase.buildServerResponse(r);

                        //<@4.9compat>
                        if ( ! _.isUndefined( api.notifications ) ) {
                              api.notifications.add( new wp.customize.Notification( 'changeset_update_failed', {
                                    type: 'error',
                                    message: r,
                                    dismissible: true
                              } ) );

                              // Removed if not dismissed after 5 seconds
                              _.delay( function() {
                                    if ( api.notifications.has( 'changeset_update_failed' ) ) {
                                          var _notif_ = api.notifications( 'changeset_update_failed' );
                                          if ( _notif_.parent ) {
                                                _notif_.parent.remove( _notif_.code );
                                          } else {
                                                _notif_.container.remove();
                                          }
                                    }
                              }, 5000 );
                        }
                        //</@4.9compat>
                        else {
                              api.czr_serverNotification({
                                    status:'error',
                                    message : r
                              });
                      }
                  })
                  .done( function( wp_original_response ) {
                        // $.when.apply( null, _promises ).then( function() {
                        //       dfd.resolve( wp_original_response );
                        // });
                        //Restore the _lastSavedRevision index to its previous state to not miss any setting that could have been updated by WP for global.

                        //Bail if attempting to update the skope changesets before the initial collection has been populated
                        if ( 'pending' == api.czr_initialSkopeCollectionPopulated.state() )
                          dfd.resolve( wp_original_response );

                        api._lastSavedRevision = _lastSavedRevisionBefore;
                        recursiveCall()
                              .always( function() {
                                    // Ensure that all settings updated subsequently will be included in the next changeset update request.
                                    api._lastSavedRevision = Math.max( api._latestRevision, api._lastSavedRevision );

                                    //api.state( 'changesetStatus' ).set( _data_.changeset_status );
                                    // Make sure that publishing a changeset waits for all changeset update requests to complete.
                                    api.state( 'processing' ).set( 0 );
                              })
                              .fail( function( r ) {
                                    dfd.reject( r );
                                    api.consoleLog( 'CHANGESET UPDATE RECURSIVE PUSH FAIL', r , _all_skopes_data_ );
                                    api.trigger( 'changeset-error', r );
                                    api.czr_serverNotification( { message: r, status : 'error' } );
                              } )
                              .done( function() {
                                    dfd.resolve( wp_original_response );
                              });
                  });

            return dfd.promise();
      };



      //@update the changeset meta for a given skope
      //Adapted copy from the original api.requestChangesetUpdate()
      //@4.9compat : added _args_ param
      api._requestSkopeChangetsetUpdate = function( changes, skope_id, _args_ ) {
            if ( _.isUndefined( skope_id ) || ! api.czr_skope.has( skope_id ) ) {
                  throw new Error( 'In api._requestSkopeChangetsetUpdate() : a valid and registered skope_id must be provided' );
            }

            var deferred = new $.Deferred(),
                request,
                submittedChanges = {},
                data,
                submittedArgs;

            //if no skope has been provided, then let's use the active one
            skope_id = skope_id || api.czr_activeSkopeId();

            //<@4.9compat>
            // Prevent attempting changeset update while request is being made.
            // Disabled
            // if ( 0 !== api.state( 'processing' ).get() ) {
            //   deferred.reject( 'already_processing' );
            //   return deferred.promise();
            // }

            //<@4.9compat>
            submittedArgs = _.extend( {
              title: null,
              date: null,
              autosave: false,
              force: false
            }, _args_ );
            //</@4.9compat>

            if ( changes ) {
                  _.extend( submittedChanges, changes );
            }


            //Ensure all revised settings (changes pending save) are also included, but not if marked for deletion in changes.
            _.each( api.czr_skopeBase.getSkopeDirties( skope_id ) , function( dirtyValue, settingId ) {
                  if ( ! changes || null !== changes[ settingId ] ) {
                        submittedChanges[ settingId ] = _.extend(
                              {},
                              submittedChanges[ settingId ] || {},
                              { value: dirtyValue }
                        );
                  }
            } );

            //  _.each( api.czr_skope( skope_id ).dirtyValues(), function( dirtyValue, settingId ) {
            //       submittedChanges[ settingId ] = _.extend(
            //             { value: dirtyValue }
            //       );
            // } );

            //<@4.9compat>
            // Short-circuit when there are no pending changes.
            if ( ! submittedArgs.force && _.isEmpty( submittedChanges ) && null === submittedArgs.title && null === submittedArgs.date ) {
                  deferred.resolve( {} );
                  return deferred.promise();
            }

            // A status would cause a revision to be made, and for this wp.customize.previewer.save() should be used. Status is also disallowed for revisions regardless.
            if ( submittedArgs.status ) {
              return deferred.reject( { code: 'illegal_status_in_changeset_update' } ).promise();
            }

            // Dates not being allowed for revisions are is a technical limitation of post revisions.
            if ( submittedArgs.date && submittedArgs.autosave ) {
              return deferred.reject( { code: 'illegal_autosave_with_date_gmt' } ).promise();
            }
            //</@4.9compat>

            if ( api._latestRevision <= api._lastSavedRevision ) {
                  deferred.resolve( {} );
                  return deferred.promise();
            }

            // Allow plugins to attach additional params to the settings.
            api.trigger( 'skope-changeset-save', submittedChanges );

            var queryVars = {
                  skope_id : skope_id,
                  action : 'changeset_update',
                  opt_name : api.czr_skope( skope_id ).opt_name
            };

            //BUILD THE QUERY
            data = api.previewer.query( _.extend( queryVars, { excludeCustomizedSaved: true } ) );
            delete data.customized; // Being sent in customize_changeset_data instead.
            _.extend( data, {
                  nonce: api.settings.nonce.save,
                  customize_changeset_data: JSON.stringify( submittedChanges )
            } );

            // var _dumby_request = function( _data ) {
            //     var dfd = $.Deferred();
            //     setTimeout( function() {
            //         dfd.resolve( _data );
            //     }, 5000 );
            //     return dfd.promise();
            // };

            ////////////////////// FIRE THE REQUEST //////////////////////
            //request = _dumby_request( data );
            wp.ajax.post( 'customize_skope_changeset_save', data )
                  .done( function requestChangesetUpdateDone( _data_ ) {
                        //api.consoleLog('SKOPE CHANGETSET DONE FOR SKOPE ' + _data_.skope_id , _data_ );
                        deferred.resolve( _data_ );
                        //api.trigger( 'changeset-saved', _data_ );
                  } )
                  .fail( function requestChangesetUpdateFail( _data_ ) {
                        api.consoleLog('SKOPE CHANGESET FAIL FOR SKOPE ' + _data_.skope_id, _data_ );
                        deferred.reject( _data_ );
                        //api.trigger( 'changeset-error', _data_ );
                  } )
                  .always( function( _data_ ) {
                        if ( ! _.isUndefined( _data_ ) && _data_.setting_validities ) {
                              api._handleSettingValidities( {
                                    settingValidities: _data_.setting_validities,
                                    focusInvalidControl: true
                              } );
                        }
                  } );

            return deferred.promise();
      };
})( wp.customize , jQuery, _ );