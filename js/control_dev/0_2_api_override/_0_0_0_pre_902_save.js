
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
                  invalidControls;

              if ( args && args.status ) {
                    changesetStatus = args.status;
              }

              if ( api.state( 'saving' ).get() ) {
                  deferred.reject( 'already_saving' );
                  deferred.promise();
              }

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
                    request = wp.ajax.post( 'customize_save', query );

                    // Disable save button during the save request.
                    saveBtn.prop( 'disabled', true );

                    api.trigger( 'save', request );

                    // request.always( function () {
                    //       api.state( 'saving' ).set( false );
                    //       saveBtn.prop( 'disabled', false );
                    //       api.unbind( 'change', captureSettingModifiedDuringSave );
                    // } );

                    request.fail( function ( response ) {
                          api.consoleLog('ALORS FAIL ?', params.skope_id, response );
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
                          api.consoleLog('ALORS DONE ?', params.skope_id, response );
                          submit_dfd.resolve( response );
                    } );

                    //return the promise
                    return submit_dfd.promise();
              };//submit()



              var //skopeRequestDoneCollection = new api.Value( [] ),
                  //skopeRequests = $.Deferred(),
                  dirtySkopesToSubmit = _.filter( api.czr_skopeCollection(), function( _skop ) {
                        return api.czr_skope( _skop.id ).dirtyness();
                  }),
                  _saved_dirties = {};//will be used as param to update the skope model db val after all ajx requests are done


              //loop on the registered skopes and submit each save ajax request
              //@return an array of deferred promises()
              var getSubmitPromises = function() {
                    var promises = [];
                    var globalSkopeId = api.czr_skopeBase.getGlobalSkopeId();

                    //ARE THERE SKOPE EXCLUDED DIRTIES ?
                    //var _skopeExcludedDirties = api.czr_skopeBase.getSkopeExcludedDirties();

                    //////////////////////////////////SUBMIT EXCLUDED SETTINGS ////////////////////////////
                    ///@to do : do we need to check if we are not already in the global skope ?
                    // if ( ! _.isEmpty( _skopeExcludedDirties ) ) {
                    //       console.log('>>>>>>>>>>>>>>>>>>> submit request for _skopeExcludedDirties', _skopeExcludedDirties );
                    //       //each promise is a submit ajax query
                    //       promises.push( submit( {
                    //             skope_id : globalSkopeId,
                    //             the_dirties : _skopeExcludedDirties,
                    //             dyn_type : 'wp_default_type'
                    //           })
                    //       );
                    // }


                    //////////////////////////////////SUBMIT THE ELIGIBLE SETTINGS OF EACH SKOPE ////////////////////////////
                    _.each( dirtySkopesToSubmit, function( _skop ) {
                          var the_dirties = api.czr_skopeBase.getSkopeDirties( _skop.id );
                          api.consoleLog('submit request for skope : ', _skop, the_dirties );
                          //each promise is a submit ajax query
                          promises.push( submit( {
                                skope_id : _skop.id,
                                the_dirties : the_dirties,//{}
                                dyn_type : _skop.dyn_type
                            })
                          );
                    });


                    ///////////////////////////////////ALWAYS SUBMIT NOT YET REGISTERED WIDGETS TO GLOBAL OPTIONS
                    if ( ! api.czr_skopeBase.isExcludedSidebarsWidgets() ) {
                          _.each( dirtySkopesToSubmit, function( _skop ) {
                                if ( _skop.id == globalSkopeId )
                                  return;
                                console.log('>>>>>>>>>>>>>>>>>>> submit request for missing widgets globally', widget_dirties );
                                var widget_dirties = {};
                                var the_dirties = api.czr_skopeBase.getSkopeDirties( _skop.id );

                                //loop on each skop dirties and check if there's a new widget not yet registered globally
                                //if a match is found, add it to the widget_dirties, if not already added, and add it to the promises submission
                                _.each( the_dirties, function( _val, _setId ) {
                                      //must be a widget setting and not yet registered globally
                                      if ( 'widget_' == _setId.substring(0, 7) && ! api.czr_skopeBase.isWidgetRegisteredGlobally( _setId ) ) {
                                            if ( ! _.has( widget_dirties, _setId ) ) {
                                                  widget_dirties[ _setId ] = _val;
                                            }
                                      }
                                });


                                if ( ! _.isEmpty(widget_dirties) ) {
                                      //each promise is a submit ajax query
                                      promises.push( submit( {
                                            skope_id : globalSkopeId,
                                            the_dirties : widget_dirties,
                                            dyn_type : 'wp_default_type'
                                        } )
                                      );
                                }
                          });
                    }

                    ///////////////////////////////////ALWAYS SUBMIT GLOBAL SKOPE ELIGIBLE SETTINGS TO SPECIFIC GLOBAL OPTION
                    _.each( dirtySkopesToSubmit, function( _skop ) {
                          if ( _skop.skope != 'global' )
                                return;

                          if ( _.isUndefined( serverControlParams.globalSkopeOptName) ) {
                                throw new Error('serverControlParams.globalSkopeOptName MUST BE DEFINED TO SAVE THE GLOBAL SKOPE.');
                          }
                          //each promise is a submit ajax query
                          promises.push( submit( {
                                skope_id : globalSkopeId,
                                the_dirties : api.czr_skopeBase.getSkopeDirties( _skop.id ),
                                dyn_type : 'global_option',
                                opt_name : serverControlParams.globalSkopeOptName
                            } )
                          );
                    });

                    return promises;
              };//getSubmitPromises


              //defer some actions (included WP core ones ) when all promises are done
              var reactWhenPromisesDone = function( promises ) {
                    if ( _.isEmpty( promises ) ) {
                        console.log('THE SAVE SUBMIT PROMISES ARE EMPTY. PROBABLY BECAUSE THERE WAS ONLY EXCLUDED SKOPE SETTINGS TO SAVE', dirtySkopesToSubmit, api.czr_skopeBase.getSkopeExcludedDirties() );
                        //return deferred.promise();
                    }

                    $.when.apply( null, promises).done( function( response ) {
                          console.log('>>>>>>>>>>>>>>>>', promises, response, '<<<<<<<<<<<<<<<<<<<<<<<');
                          //store the saved dirties (will be used as param to update the db val property of each saved skope)
                          //and reset them
                          _.each( dirtySkopesToSubmit, function( _skp ) {
                                _saved_dirties[ _skp.id ] = api.czr_skopeBase.getSkopeDirties(_skp.id);
                                api.czr_skope(_skp.id).dirtyValues({});
                                //api.czr_skopeBase.getSkopeDirties();
                          });

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

                          /////////////////WP default treatments
                          api.state( 'saving' ).set( false );
                          saveBtn.prop( 'disabled', false );

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

                          deferred.resolveWith( previewer, [ response ] );
                          api.trigger( 'saved', response );

                          // Restore the global dirty state if any settings were modified during save.
                          // if ( ! _.isEmpty( modifiedWhileSaving ) ) {
                          //   api.state( 'saved' ).set( false );
                          // }
                    }).then( function() {
                          api.czr_savedDirties( { channel : api.previewer.channel() , saved : _saved_dirties });
                          api.czr_skopeBase.trigger('skopes-saved', _saved_dirties );
                    });//when()
              };//reactWhenPromisesDone



              //FIRE SUBMISSIONS
              if ( 0 === processing() ) {
                    $.when( getSubmitPromises() ).done( function( promises) {
                          reactWhenPromisesDone(promises);
                    });//submit();
              } else {
                    submitWhenDoneProcessing = function () {
                          if ( 0 === processing() ) {
                                api.state.unbind( 'change', submitWhenDoneProcessing );
                                $.when( getSubmitPromises() ).done( function( promises) {
                                      reactWhenPromisesDone(promises);
                                });//submit();
                          }
                      };
                    api.state.bind( 'change', submitWhenDoneProcessing );
              }

              return deferred.promise();
        };//save()

  });//api.bind('ready')

})( wp.customize , jQuery, _ );