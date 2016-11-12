
(function (api, $, _) {

  api.bind('ready', function() {
        if ( ! serverControlParams.isSkopOn )
          return;

        //the 'saving' state was introduced in 4.7
        //For prior versions, let's declare it and add its callback that we need in the api.previewer.save() method
        if ( ! api.state.has('saving') ) {
            api.state.create('saving');
            api.state('saving').bind( function( isSaving ) {
                  $( document.body ).toggleClass( 'saving', isSaving );
            } );
        }



        /*****************************************************************************
        * SAVE
        *****************************************************************************/
        //OVERRIDES WP
        //HOW DOES THE SAVE WORK ?
        //
        var _old_previewer_save = api.previewer.save;
        api.previewer.save = function( args ) {
              var parent = new api.Messenger({
                        url: api.settings.url.parent,
                        channel: 'loader',
                  }),//this has to be reinstantiated because not accessible from core
                  saveBtn = $( '#save' );

              var previewer = this,
                  deferred = $.Deferred(),
                  changesetStatus = 'publish',
                  processing = api.state( 'processing' ),
                  submitWhenDoneProcessing,
                  submit,
                  //modifiedWhileSaving = {},
                  invalidSettings = [],
                  invalidControls,
                  globalSkopeId = api.czr_skopeBase.getGlobalSkopeId(),
                  _saved_dirties = {};// will be used as param to update the skope model db val after all ajx requests are done

              if ( args && args.status ) {
                    changesetStatus = args.status;
              }

              if ( api.state( 'saving' ).get() ) {
                  deferred.reject( 'already_saving' );
                  deferred.promise();
              }

              // set saving state.
              // => will be set to false when all saved promises resolved
              api.state( 'saving' ).set( true );


              //WE WON'T USE THE FOLLOWING BECAUSE WE DON'T KNOW IN WHICH SKOPE THE SETTING MIGHT HAVE BEEN MODIFIED DURING SAVING
              // function captureSettingModifiedDuringSave( setting ) {
              //   modifiedWhileSaving[ setting.id ] = true;
              // }
              // api.bind( 'change', captureSettingModifiedDuringSave );

              //skope dependant submit()
              //the dyn_type can also be set to 'wp_default_type' when saving a skope excluded setting
              //@params = {
              //    skope_id : string,
              //    the_dirties : {},
              //    dyn_type : string,
              //    opt_name : string
              // }
              submit = function( params ) {
                    var default_params = {
                          skope_id : null,
                          the_dirties : {},
                          dyn_type : null,
                          opt_name : null
                        },
                        _defaults = $.extend( true, {}, default_params );

                    params = $.extend( _defaults, params );

                    console.log('SAVE SUBMIT PARAMS', params );
                    if ( _.isNull( params.skope_id ) ) {
                          throw new Error( 'OVERRIDEN SAVE::submit : MISSING skope_id');
                    }
                    if ( _.isNull( params.the_dirties ) ) {
                          throw new Error( 'OVERRIDEN SAVE::submit : MISSING the_dirties');
                    }
                    // if ( _.isEmpty( params.the_dirties ) ) {
                    //       throw new Error( 'OVERRIDEN SAVE::submit : empty the_dirties');
                    // }
                    var request, query, submit_dfd = $.Deferred();

                    //skope_id = skope_id || api.czr_activeSkope();
                    /*
                     * Block saving if there are any settings that are marked as
                     * invalid from the client (not from the server). Focus on
                     * the control.
                     */
                    if ( _.has( api, 'Notification') ) {
                          api.each( function( setting ) {
                                setting.notifications.each( function( notification ) {
                                      if ( 'error' === notification.type ) {
                                            console.log('NOTIFICATION ERROR on SUBMIT SAVE' , notification );
                                      }
                                      if ( 'error' === notification.type && ( ! notification.data || ! notification.data.from_server ) ) {
                                            invalidSettings.push( setting.id );
                                            if ( ! settingInvalidities[ setting.id ] ) {
                                                  settingInvalidities[ setting.id ] = {};
                                            }
                                            settingInvalidities[ setting.id ][ notification.code ] = notification;
                                      }
                                } );
                          } );
                          invalidControls = api.findControlsForSettings( invalidSettings );
                          if ( ! _.isEmpty( invalidControls ) ) {
                                _.values( invalidControls )[0][0].focus();
                                //api.unbind( 'change', captureSettingModifiedDuringSave );
                                deferred.rejectWith( previewer, [
                                      { setting_invalidities: settingInvalidities }
                                ] );
                                api.state( 'saving' ).set( false );
                                return deferred.promise();
                          }
                    }

                    //BUILD THE QUERY OBJECT
                    //the skope save query takes parameters
                    var query_params = {
                          skope_id : params.skope_id,
                          action : 'save',
                          the_dirties : params.the_dirties,
                          dyn_type : params.dyn_type,
                          opt_name : params.opt_name
                    };

                    //since 4.7 : if changeset is on, let's add stuff to the query params
                    if ( api.czr_isChangedSetOn() ) {
                          $.extend( query_params, { excludeCustomizedSaved: false } );
                    }

                    /*
                     * Note that excludeCustomizedSaved is intentionally false so that the entire
                     * set of customized data will be included if bypassed changeset update.
                     */
                    query = $.extend( previewer.query( query_params ), {
                          nonce:  previewer.nonce.save,
                          customize_changeset_status: changesetStatus
                    } );

                    //since 4.7 : if changeset is on, let's add stuff to the query object
                    if ( api.czr_isChangedSetOn() ) {
                          if ( args && args.date ) {
                            query.customize_changeset_date = args.date;
                          }
                          if ( args && args.title ) {
                            query.customize_changeset_title = args.title;
                          }
                    }



                    api.consoleLog('in submit : ', params.skope_id, query, api.previewer.channel() );

                    /*
                     * Note that the dirty customized values will have already been set in the
                     * changeset and so technically query.customized could be deleted. However,
                     * it is remaining here to make sure that any settings that got updated
                     * quietly which may have not triggered an update request will also get
                     * included in the values that get saved to the changeset. This will ensure
                     * that values that get injected via the saved event will be included in
                     * the changeset. This also ensures that setting values that were invalid
                     * will get re-validated, perhaps in the case of settings that are invalid
                     * due to dependencies on other settings.
                     */
                    request = wp.ajax.post(
                          'global' !== query.skope ? 'customize_skope_changeset_save' : 'customize_save',
                          query
                    );

                    // Disable save button during the save request.
                    saveBtn.prop( 'disabled', true );

                    api.trigger( 'save', request );

                    // request.always( function () {
                    //       api.state( 'saving' ).set( false );
                    //       saveBtn.prop( 'disabled', false );
                    //       api.unbind( 'change', captureSettingModifiedDuringSave );
                    // } );

                    request.fail( function ( response ) {
                          api.consoleLog('SUBMIT REQUEST FAIL ?', params.skope_id, response );
                          if ( '0' === response ) {
                                response = 'not_logged_in';
                          } else if ( '-1' === response ) {
                                // Back-compat in case any other check_ajax_referer() call is dying
                                response = 'invalid_nonce';
                          }

                          if ( 'invalid_nonce' === response ) {
                                previewer.cheatin();
                          } else if ( 'not_logged_in' === response ) {
                                previewer.preview.iframe.hide();
                                previewer.login().done( function() {
                                      previewer.save();
                                      previewer.preview.iframe.show();
                                } );
                          }
                          api.trigger( 'error', response );
                          submit_dfd.reject( response );
                    } );

                    request.done( function( response ) {
                          api.consoleLog('SUBMIT REQUEST DONE ?', params.skope_id, response );
                          submit_dfd.resolve( response );
                    } );

                    //return the promise
                    return submit_dfd.promise();
              };//submit()


              //loop on the registered skopes and submit each save ajax request
              //@return a promise()
              //
              var getSubmitPromise = function( skope_id ) {
                    var dfd = $.Deferred();

                    if ( _.isEmpty( skope_id ) || ! api.czr_skope.has( skope_id ) ) {
                          api.consoleLog( 'getSubmitPromise : no skope id requested OR skope_id not registered : ' + skope_id );
                          dfd.resolve();
                    }

                    var skopeObjectToSubmit = api.czr_skope( skope_id )();

                    // Resolve here if not dirty AND not global skope
                    // always submit the global skope, even if not dirty => required to properly clean the changeset post server side
                    if ( ! api.czr_skope( skope_id ).dirtyness() && skope_id !== globalSkopeId ) {
                        dfd.resolve();
                    }

                    //////////////////////////////////SUBMIT THE ELIGIBLE SETTINGS OF EACH SKOPE ////////////////////////////
                    //a submit call returns a promise resolved when the db ajax query is done().
                    var _submit_request = submit( {
                              skope_id : skope_id,
                              the_dirties : api.czr_skopeBase.getSkopeDirties( skope_id ),//{}
                              dyn_type : skopeObjectToSubmit.dyn_type
                        } );

                    api.consoleLog('submit request for skope : id, object, dirties : ', skope_id, skopeObjectToSubmit , api.czr_skopeBase.getSkopeDirties( skope_id ) );

                    _submit_request
                          .done( function( _resp) { console.log('GETSUBMIT DONE PROMISE SUCCEEDED', _resp); })
                          .fail( function( _resp ) { console.log('GETSUBMIT FAILED PROMISE', _resp ); })
                          .then( function( _resp ) {
                                console.log('GETSUBMIT THEN ', _resp );
                                dfd.resolve( _resp );
                          });

                    return dfd.promise();
              };//getSubmitPromise




              //defer some actions (included WP core ones ) when all submit promises are done
              var reactWhenSubmissionsDone = function( response ) {
                    var dfd = $.Deferred();

                    console.log('>>>>>>>>>>>>>>>> reactWhenSubmissionsDone response : ',response, '<<<<<<<<<<<<<<<<<<<<<<<');
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
                          saveBtn.prop( 'disabled', false );
                          console.log('WP DEFAULT REACTIUION', saveBtn , saveBtn.prop( 'disabled') );
                    };

                    _applyWPDefaultReaction( response );


                    //store the saved dirties (will be used as param to update the db val property of each saved skope)
                    //and reset them
                    _.each( api.czr_skopeCollection(), function( _skp_ ) {
                          _saved_dirties[ _skp_.id ] = api.czr_skopeBase.getSkopeDirties( _skp_.id );
                          api.czr_skope( _skp_.id ).dirtyValues({});
                          //api.czr_skopeBase.getSkopeDirties();
                    });

                    console.log('WHAT ARE THE SAVED DIRTIES', _saved_dirties );

                    if ( _.isEmpty( _saved_dirties ) ) {
                          console.log( 'NO SAVED DIRTIES, NO NEED TO REFRESH AFTER SAVE.');
                          dfd.resolve();
                    }

                    api.czr_savedDirties( { channel : api.previewer.channel() , saved : _saved_dirties });
                    api.previewer.refresh().done( function( previewer ) {
                          api.czr_skopeBase.trigger('skopes-saved', _saved_dirties );
                          dfd.resolve( previewer );
                    } );

                    // Restore the global dirty state if any settings were modified during save.
                    // if ( ! _.isEmpty( modifiedWhileSaving ) ) {
                    //   api.state( 'saved' ).set( false );
                    // }

                    return dfd.promise();
              };//reactWhenSubmissionsDone



              //PROCESS SUBMISSIONS
              //ALWAYS FIRE THE GLOBAL SKOPE WHEN ALL OTHER SKOPES HAVE BEEN DONE.
              //=> BECAUSE WHEN SAVING THE GLOBAL SKOPE, THE CHANGESET POST STATUS WILL BE CHANGED TO 'publish' AND THEREFORE NOT ACCESSIBLE ANYMORE
              var skopesToSave = [],
                  _recursivePushDeferred = $.Deferred(),
                  _responses_ = {};

              // build the skope ids array to submit recursively
              _.each( api.czr_skopeCollection(), function( _skp_ ) {
                    if ( 'global' !== _skp_.skope ) {
                          skopesToSave.push( _skp_.id );
                    }
              });


              // recursive pushes for not global skopes
              var recursivePush = function( _index ) {
                    //on first push run, set the api state to processing.
                    // Make sure that publishing a changeset waits for all changeset update requests to complete.
                    if ( _.isUndefined( _index ) || ( ( 0 * 0 ) == _index ) ) {
                        api.state( 'processing' ).set( api.state( 'processing' ).get() + 1 );
                    }

                    _index = _index || 0;
                    if ( _.isUndefined( skopesToSave[_index] ) ) {
                          _recursivePushDeferred.resolve( _responses_ );
                    } else {
                          $.when( getSubmitPromise( skopesToSave[ _index ] ) )
                                .done( function( response ) {
                                      console.log('RECURSIVE PUSH DONE FOR SKOPE : ', skopesToSave[_index] );
                                } )
                                .fail( function( response ) {
                                      console.log('RECURSIVE PUSH FAIL FOR SKOPE : ', skopesToSave[_index] );
                                } )
                                .then( function( response ) {
                                      response = response || {};

                                      //WE NEED TO BUILD A PROPER RESPONSE HERE
                                      if ( _.isEmpty( _responses_ ) ) {
                                            _responses_ = response || {};
                                      } else {
                                            _responses_ = $.extend( _responses_ , response );
                                      }
                                      //call me again
                                      recursivePush( _index + 1 );
                                } );
                    }
                    return _recursivePushDeferred.promise();
              };



              //FIRE SUBMISSIONS :
              //1) first all skopes but global, recursively
              //2) then global => will publish the changeset. Server side, the changeset post will be trashed and the next uuid will be returned to the API
              var fireAllSubmission = function() {
                    recursivePush()
                          .done( function( r ) { console.log('RECURSIVE PUSH DONE', r );  })
                          .fail( function( r ) { console.log('RECURSIVE PUSH FAIL', r );  })
                          .then( function( r ) {
                                console.log('RECURSIVE PUSH THEN', r );
                                getSubmitPromise( globalSkopeId )
                                      .done( function( r ) { console.log('GLOBAL SUBMIT DONE', r );  })
                                      .fail( function( r ) { console.log('GLOBAL SUBMIT FAIL', r );  })
                                      .then( function( r ) {
                                            console.log('GLOBAL SUBMIT THEN', r );
                                            //WE NEED TO BUILD A PROPER RESPONSE HERE
                                            if ( _.isEmpty( _responses_ ) ) {
                                                  _responses_ = r || {};
                                            } else {
                                                  _responses_ = $.extend( _responses_ , r );
                                            }
                                            console.log('CONCATENATED RESONSE : ', _responses_ );
                                            //EXECUTE POST SAVE ACTIONS => Resolved when refresh.done().
                                            //- Clean dirtyness
                                            //- send 'saved' event to previewer
                                            //- reset 'changesetStatus' to ''
                                            reactWhenSubmissionsDone( _responses_ )
                                                  .done( function( _previewer_ ) { console.log('reactWhenSubmissionsDone DONE', r );  })
                                                  .fail( function( _previewer_ ) { console.log('reactWhenSubmissionsDone FAIL', r );  })
                                                  .then( function( _previewer_ ) {
                                                        console.log('reactWhenSubmissionsDone THEN', _previewer_ );
                                                        //Resolve the general deferred.
                                                        deferred.resolveWith( _previewer_, [ _responses_ ] );
                                                  });

                                      });
                          });
              };

              if ( 0 === processing() ) {
                    fireAllSubmission();
              } else {
                    submitWhenDoneProcessing = function () {
                          if ( 0 === processing() ) {
                                api.state.unbind( 'change', submitWhenDoneProcessing );
                                fireAllSubmission();
                          }
                    };
                    api.state.bind( 'change', submitWhenDoneProcessing );
              }
              return deferred.promise();
        };//save()

  });//api.bind('ready')

})( wp.customize , jQuery, _ );