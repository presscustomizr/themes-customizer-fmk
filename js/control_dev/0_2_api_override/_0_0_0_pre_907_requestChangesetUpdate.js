
(function (api, $, _) {
      if ( ! serverControlParams.isSkopOn || ! api.czr_isChangedSetOn() )
        return;

      //WP Changeset is requested for an update with an ajax query in the following situation :
      //1) before unloading the window
      //2) when focus removed from window.
      //3) on schedule : every 60 000 ms. ( api.settings.timeouts.changesetAutoSave )
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
       * Always calls the original method when the first promise (the skope changeset save) has been executed.
       * Returns the $ promise with the set of data from the original method
       *
       * @param {object} [changes] Mapping of setting IDs to setting params each normally including a value property, or mapping to null.
       *                           If not provided, then the changes will still be obtained from unsaved dirty settings.
       * @returns {jQuery.Promise}
       */
      api.requestChangesetUpdate = function( changes ) {
            var dfd = $.Deferred(),
                data,
                _skopesToUpdate = [],
                _promises = [],
                _global_skope_changes = changes || {};
                // _original = function( changes ) {
                //     _original_requestChangesetUpdate(changes).then( function( data ) {
                //         console.log('WP DEFERRED THEN', data );
                //         dfd.resolve( data );
                //     });
                // };

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

            console.log('SKOPE CHANGESETS TO UPDATE', _skopesToUpdate );

            var _pushPromise = function( _skp_id ) {
                  var dfrd = $.Deferred(),
                      _requestUpdate = api._requestSkopeChangetsetUpdate( changes, _skp_id );
                  _promises.push( _requestUpdate );
                  $.when( _requestUpdate ).done( function( _data_ ) {
                        setTimeout( function() {
                            dfrd.resolve( _data_ );
                        }, 0 );

                  });
                  return dfrd.promise();
            };

            var _recursivePushDeferred = $.Deferred(),
                _all_skopes_data_ = [];

            var recursivePush = function( _index ) {
                  //on first push run, set the api state to processing.
                  // Make sure that publishing a changeset waits for all changeset update requests to complete.
                  if ( _.isUndefined( _index ) || ( ( 0 * 0 ) == _index ) ) {
                      api.state( 'processing' ).set( api.state( 'processing' ).get() + 1 );
                  }

                  _index = _index || 0;
                  if ( _.isUndefined( _skopesToUpdate[_index] ) ) {
                        _recursivePushDeferred.resolve( _all_skopes_data_ );
                  } else {
                        $.when( _pushPromise( _skopesToUpdate[_index] ) ).done( function( _skope_data_ ) {
                              console.log('RECURSIVE PUSH DONE FOR SKOPE : ', _skopesToUpdate[_index] );
                              _all_skopes_data_.push( _skope_data_ );
                              recursivePush( _index + 1 );
                        } );
                  }
                  return _recursivePushDeferred.promise();
            };


            //RESOLVE WITH THE WP GLOBAL CHANGESET PROMISE WHEN ALL SKOPE PROMISES ARE DONE
            //PROBLEM TO SOLVE : in the core original changeset method, the api._lastSavedRevision property is incremented when global dirties are saved
            //=> between the core changeset update and before the skope changeset update, we need to reset the api._lastSavedRevision to its previous value
            //=> otherwise some dirties might not be taken into account in the skope.
            //=> This can happen typically for a setting dirty both in global and other skope(s)
            var _lastSavedRevisionBefore = api._lastSavedRevision;
            $.when( _original_requestChangesetUpdate( _global_skope_changes ) ).then( function( wp_original_response ) {
                    console.log('GLOBAL SKOPE CHANGESET UPDATE PROCESSED BY WP : ', _global_skope_changes, wp_original_response );
                    //console.log('WP DEFERRED THEN', wp_original_response );
                    // $.when.apply( null, _promises ).then( function() {
                    //       //console.log('OUR DEFERRED THEN => resolve WP');
                    //       dfd.resolve( wp_original_response );
                    // });
                    //Restore the _lastSavedRevision index to its previous state to not miss any setting that could have been updated by WP for global.
                     api._lastSavedRevision = _lastSavedRevisionBefore;
                    $.when( recursivePush() ).then( function() {
                          console.log('ALL RECURSIVE PUSHES ARE DONE NOW', _all_skopes_data_ );

                          var savedChangesetValues = {};

                          // Ensure that all settings updated subsequently will be included in the next changeset update request.
                          api._lastSavedRevision = Math.max( api._latestRevision, api._lastSavedRevision );

                          //api.state( 'changesetStatus' ).set( _data_.changeset_status );
                          // Make sure that publishing a changeset waits for all changeset update requests to complete.
                          api.state( 'processing' ).set( api.state( 'processing' ).get() - 1 );
                          dfd.resolve( wp_original_response );
                    });
            });

            return dfd.promise();
      };



      //@update the changeset meta for a given skope
      api._requestSkopeChangetsetUpdate = function( changes, skope_id ) {
            console.log( 'IN REQUEST SKOPE CHANGESET UPDATE', changes, skope_id );
            if ( _.isUndefined( skope_id ) || ! api.czr_skope.has( skope_id ) ) {
                  throw new Error( 'In api._requestSkopeChangetsetUpdate() : a valid and registered skope_id must be provided' );
            }

            var deferred = new $.Deferred(),
                request,
                submittedChanges = {},
                data;

            //if no skope has been provided, then let's use the active one
            skope_id = skope_id || api.czr_activeSkope();

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

            // Short-circuit when there are no pending changes.
            if ( _.isEmpty( submittedChanges ) ) {
                  console.log( 'NO CHANGES TO SUBMIT FOR SKOPE : ' + skope_id );
                  deferred.resolve( {} );
                  return deferred.promise();
            }

            if ( api._latestRevision <= api._lastSavedRevision ) {
                  console.log( 'SAVED REVISION IS OLDER OR == THAN THE LAST REVISION FOR SKOPE : ' + skope_id );
                  deferred.resolve( {} );
                  return deferred.promise();
            }

            // Allow plugins to attach additional params to the settings.
            api.trigger( 'skope-changeset-save', submittedChanges );

            console.log('CHANGESET UPDATE FOR SKOPE : ', skope_id, submittedChanges );

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



            console.log('DATA in SKOPE CHANGESET UPDATE FOR SKOPE ' + skope_id, data);

            // var _dumby_request = function( _data ) {
            //     var dfd = $.Deferred();
            //     setTimeout( function() {
            //         console.log('DUMBY REQUEST DONE FOR SKOPE : ', data.skope_id );
            //         dfd.resolve( _data );
            //     }, 5000 );
            //     return dfd.promise();
            // };

            ////////////////////// FIRE THE REQUEST //////////////////////
            //request = _dumby_request( data );
            request = wp.ajax.post( 'customize_skope_changeset_save', data );
            //////////////////////////////////////////////////////////////

            request.done( function requestChangesetUpdateDone( _data_ ) {
                  api.consoleLog('SKOPE CHANGETSET DONE FOR SKOPE ' + _data_.skope_id , _data_ );
                  deferred.resolve( _data_ );
                  //api.trigger( 'changeset-saved', _data_ );
            } );
            request.fail( function requestChangesetUpdateFail( _data_ ) {
                  api.consoleLog('SKOPE CHANGESET FAIL FOR SKOPE ' + _data_.skope_id, _data_ );
                  deferred.resolve( _data_ );
                  //api.trigger( 'changeset-error', _data_ );
            } );
            request.always( function( _data_ ) {
                  if ( _data_.setting_validities ) {
                    console.log('HANDLE SETTING VALIDITIES', _data_ );
                    api._handleSettingValidities( {
                      settingValidities: _data_.setting_validities
                    } );
                  }
            } );

            return deferred.promise();
      };

})( wp.customize , jQuery, _ );