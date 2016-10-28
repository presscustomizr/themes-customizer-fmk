
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
            console.log('OVERRIDEN REQUEST CHANGESET UPDATE', api._latestRevision, api._lastSavedRevision );
            var dfd = $.Deferred(),
                promises = [],
                data,
                _original = function( changes ) {
                    _original_requestChangesetUpdate(changes).then( function( data ) {
                        console.log('WP DEFERRED THEN', data );
                        dfd.resolve( data );
                    });
                };

            //If the 0 === api._lastSavedRevision OR is empty api.state( 'changesetStatus' )(),
            //and that we are not customizing the global skope,
            //it means that the changeset post ID will not be set yet, so let's fire the original
            if ( 0 === api._lastSavedRevision && _.isEmpty( api.state( 'changesetStatus' )() ) ) {
                  //Why this ?
                  //=> because the original WP function checks if some changes have been submitted
                  $.when( _original( {
                              blogname : { dummy_change : 'dummy_change' }
                        } ) ).then( function( data ) {
                              dfd.resolve( data );
                  });
            } else {
                  //POPULATE THE SKOPE CHANGESET UPDATES PROMISES
                  //Loop current skopes collection
                  //Exclude the global skope
                  _.each( api.czr_currentSkopesCollection(), function( _skp ) {
                        if ( 'global' == _skp.skope )
                          return;
                        promises.push( api._requestSkopeChangetsetUpdate( changes, _skp.id ) );
                  } );
                  //RESOLVE WITH THE WP GLOBAL CHANGESET PROMISE WHEN ALL SKOPE PROMISES ARE DONE
                  $.when( _original( changes ) ).then( function( data ) {
                          console.log('WP DEFERRED THEN', data );
                          $.when.apply( null, promises ).then( function() {
                                console.log('OUR DEFERRED THEN => resolve WP');
                                dfd.resolve( data );
                          });
                  });
            }

            return dfd.promise();
      };



      //@update the changeset meta for a given skope
      api._requestSkopeChangetsetUpdate = function( changes, skope_id ) {
            var deferred, request, submittedChanges = {}, data;
            deferred = new $.Deferred();
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
              deferred.resolve( {} );
              return deferred.promise();
            }

            if ( api._latestRevision <= api._lastSavedRevision ) {
              deferred.resolve( {} );
              return deferred.promise();
            }

            // Make sure that publishing a changeset waits for all changeset update requests to complete.
            api.state( 'processing' ).set( api.state( 'processing' ).get() + 1 );
            deferred.always( function() {
              api.state( 'processing' ).set( api.state( 'processing' ).get() - 1 );
            } );

            // Allow plugins to attach additional params to the settings.
            api.trigger( 'skope-changeset-save', submittedChanges );

            // Ensure that if any plugins add data to save requests by extending query() that they get included here.
            data = api.previewer.query( { excludeCustomizedSaved: true } );
            delete data.customized; // Being sent in customize_changeset_data instead.
            _.extend( data, {
                  nonce: api.settings.nonce.save,
                  customize_changeset_data: JSON.stringify( submittedChanges )
            } );

            console.log('DATA in SKOPE CHANGESET UPDATE', data);

            ////////////////////// FIRE THE REQUEST //////////////////////
            request = wp.ajax.post( 'customize_skope_changeset_save', data );
            //////////////////////////////////////////////////////////////

            request.done( function requestChangesetUpdateDone( data ) {
              console.log('SKOPE CHANGETSET DONE', data );
              var savedChangesetValues = {};

              // Ensure that all settings updated subsequently will be included in the next changeset update request.
              api._lastSavedRevision = Math.max( api._latestRevision, api._lastSavedRevision );

              api.state( 'changesetStatus' ).set( data.changeset_status );
              deferred.resolve( data );
              api.trigger( 'changeset-saved', data );

              if ( data.setting_validities ) {
                _.each( data.setting_validities, function( validity, settingId ) {
                  if ( true === validity && _.isObject( submittedChanges[ settingId ] ) && ! _.isUndefined( submittedChanges[ settingId ].value ) ) {
                    savedChangesetValues[ settingId ] = submittedChanges[ settingId ].value;
                  }
                } );
              }

              api.previewer.send( 'changeset-saved', _.extend( {}, data, { saved_changeset_values: savedChangesetValues } ) );
            } );
            request.fail( function requestChangesetUpdateFail( data ) {
              console.log('SKOPE CHANGETSET FAIL', data );
              deferred.reject( data );
              api.trigger( 'changeset-error', data );
            } );
            request.always( function( data ) {
              if ( data.setting_validities ) {
                api._handleSettingValidities( {
                  settingValidities: data.setting_validities
                } );
              }
            } );

            return deferred.promise();
      };




})( wp.customize , jQuery, _ );