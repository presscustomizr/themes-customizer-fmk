
var CZRSkopeSaveMths = CZRSkopeSaveMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeSaveMths, {
      //@return a promise()
      getSubmitPromise : function( skope_id ) {
            var self = this,
                dfd = $.Deferred(),
                submittedChanges = {};

            if ( _.isEmpty( skope_id ) || ! api.czr_skope.has( skope_id ) ) {
                  api.consoleLog( 'getSubmitPromise : no skope id requested OR skope_id not registered : ' + skope_id );
                  return dfd.resolve().promise();
            }

            var skopeObjectToSubmit = api.czr_skope( skope_id )();

            // Resolve here if not dirty AND not global skope
            // always submit the global skope, even if not dirty => required to properly clean the changeset post server side
            if ( ! api.czr_skope( skope_id ).dirtyness() && skope_id !== self.globalSkopeId ) {
                return dfd.resolve().promise();
            }

            //////////////////////////////////SUBMIT THE ELIGIBLE SETTINGS OF EACH SKOPE ////////////////////////////
            //Ensure all revised settings (changes pending save) are also included, but not if marked for deletion in changes.

            // _.each( api.czr_skopeBase.getSkopeDirties( skope_id ) , function( dirtyValue, settingId ) {
            //       submittedChanges[ settingId ] = _.extend(
            //             { value: dirtyValue }
            //       );
            // } );

            _.each( api.czr_skope( skope_id ).dirtyValues(), function( dirtyValue, settingId ) {
                  submittedChanges[ settingId ] = _.extend(
                        { value: dirtyValue }
                  );
            } );

            //a submit call returns a promise resolved when the db ajax query is done().
            //api.consoleLog('submit request for skope : id, object, dirties : ', skope_id, skopeObjectToSubmit , api.czr_skopeBase.getSkopeDirties( skope_id ) );

            this.submit(
                  {
                        skope_id : skope_id,
                        customize_changeset_data : submittedChanges,//{}
                        dyn_type : skopeObjectToSubmit.dyn_type
                  })
                  .done( function(_resp) {
                        //api.consoleLog('GETSUBMIT DONE PROMISE FOR SKOPE : ', skope_id, _resp );
                        dfd.resolve( _resp );
                  } )
                  .fail( function( _resp ) {
                        api.consoleLog('GETSUBMIT FAILED PROMISE FOR SKOPE : ', skope_id, _resp );
                        dfd.reject( _resp );
                  } );

            return dfd.promise();
      },//getSubmitPromise



      // we do the WP 'customize_save' ajax request when skope is global => 'global' == query.skope
      submit : function( params ) {
            var self = this,
                default_params = {
                      skope_id : null,
                      the_dirties : {},
                      customize_changeset_data : {},
                      dyn_type : null,
                      opt_name : null
                },
                invalidSettings = [],
                settingInvalidities = [],
                modifiedWhileSaving = {},
                invalidControls = [],
                //<@4.9compat>
                invalidSettingLessControls = [],
                errorCode = 'client_side_error',
                //</@4.9compat>
                submit_dfd = $.Deferred();


            params = $.extend( default_params, params );

            if ( _.isNull( params.skope_id ) ) {
                  throw new Error( 'OVERRIDEN SAVE::submit : MISSING skope_id');
            }
            if ( _.isNull( params.the_dirties ) ) {
                  throw new Error( 'OVERRIDEN SAVE::submit : MISSING the_dirties');
            }

            //<@4.9compat>
            if ( _.has( api, 'notifications') ) {
                  api.notifications.remove( errorCode );
            }

            //</@4.9compat>
            //
            /*
             * Block saving if there are any settings that are marked as
             * invalid from the client (not from the server). Focus on
             * the control.
             */
            if ( _.has( api, 'notifications') ) {
                  api.each( function( setting ) {
                        setting.notifications.each( function( notification ) {
                              if ( 'error' === notification.type ) {
                                    api.consoleLog('NOTIFICATION ERROR on SUBMIT SAVE' , notification );
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

                  //<@4.9compat>
                  // Find all invalid setting less controls with notification type error.
                  api.control.each( function( control ) {
                    if ( ! control.setting || ! control.setting.id && control.active.get() ) {
                      control.notifications.each( function( notification ) {
                          if ( 'error' === notification.type ) {
                            invalidSettingLessControls.push( [ control ] );
                          }
                      } );
                    }
                  } );
                  invalidControls = _.union( invalidSettingLessControls, _.values( api.findControlsForSettings( invalidSettings ) ) );
                  // was : invalidControls = api.findControlsForSettings( invalidSettings );
                  //</@4.9compat>


                  if ( ! _.isEmpty( invalidControls ) ) {
                        _.values( invalidControls )[0][0].focus();
                        //api.unbind( 'change', captureSettingModifiedDuringSave );
                        //
                        //<@4.9compat>
                        if ( invalidSettings.length && _.has( api, 'notifications') && api.l10n.saveBlockedError ) {
                          api.notifications.add( new api.Notification( errorCode, {
                            message: ( 1 === invalidSettings.length ? api.l10n.saveBlockedError.singular : api.l10n.saveBlockedError.plural ).replace( /%s/g, String( invalidSettings.length ) ),
                            type: 'error',
                            dismissible: true,
                            saveFailure: true
                          } ) );
                        }
                        //</@4.9compat>

                        return submit_dfd.rejectWith( self.previewer, [
                              { setting_invalidities: settingInvalidities }
                        ] ).promise();
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
            if ( api.czr_isChangeSetOn() ) {
                  $.extend( query_params, { excludeCustomizedSaved: false } );
            }

            /*
             * Note that excludeCustomizedSaved is intentionally false so that the entire
             * set of customized data will be included if bypassed changeset update.
             */

            var query = $.extend( self.previewer.query( query_params ), {
                  nonce:  self.previewer.nonce.save,
                  // since 4.9 => api.state( 'selectedChangesetStatus' )() => draft || future || publish || trash || ''
                  customize_changeset_status: self.changesetStatus(),
                  customize_changeset_data : JSON.stringify( params.customize_changeset_data )
            } );

            //since 4.7 : if changeset is on, let's add stuff to the query object
            if ( api.czr_isChangeSetOn() ) {
                  if ( self.saveArgs && self.saveArgs.date ) {
                    query.customize_changeset_date = self.saveArgs.date;
                  }
                  //<@4.9compat>
                  else if ( 'future' === self.changesetStatus() && self.selectedChangesetDate() ) {
                    query.customize_changeset_date = self.selectedChangesetDate();
                  }
                  //</@4.9compat>
                  if ( self.saveArgs && self.saveArgs.title ) {
                    query.customize_changeset_title = self.saveArgs.title;
                  }
            }

            //<@4.9compat>
            // Allow plugins to modify the params included with the save request.
            api.trigger( 'save-request-params', query );
            //</@4.9compat>


            //api.consoleLog( 'in submit : ', params.skope_id, query, self.previewer.channel() );

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

            var request = wp.ajax.post(
                  'global' !== query.skope ? 'customize_skope_changeset_save' : 'customize_save',
                  query
            );

            // Disable save button during the save request.
            //<@4.9compat> => shall we keep that ?
            self.saveBtn.prop( 'disabled', true );
            //</@4.9compat>

            api.trigger( 'save', request );

            // request.always( function () {
            //       api.state( 'saving' ).set( false );
            //       self.saveBtn.prop( 'disabled', false );
            //       api.unbind( 'change', captureSettingModifiedDuringSave );
            // } );

            //<@4.9compat>
            // Remove notifications that were added due to save failures.
            if ( _.has( api, 'notifications') ) {
                  api.notifications.each( function( notification ) {
                    if ( notification.saveFailure ) {
                      api.notifications.remove( notification.code );
                    }
                  });
            }
            //</@4.9compat>

            request.fail( function ( response ) {
                  //<@4.9compat>
                  var notification, notificationArgs;
                  notificationArgs = {
                    type: 'error',
                    dismissible: true,
                    fromServer: true,
                    saveFailure: true
                  };
                  //</@4.9compat>
                  api.consoleLog('SUBMIT REQUEST FAIL', params.skope_id, response );
                  if ( '0' === response ) {
                        response = 'not_logged_in';
                  } else if ( '-1' === response ) {
                        // Back-compat in case any other check_ajax_referer() call is dying
                        response = 'invalid_nonce';
                  }

                  if ( 'invalid_nonce' === response ) {
                        self.previewer.cheatin();
                  } else if ( 'not_logged_in' === response ) {
                        self.previewer.preview.iframe.hide();
                        self.previewer.login().done( function() {
                              self.previewer.save();
                              self.previewer.preview.iframe.show();
                        } );
                  }
                  //<@4.9compat>
                  else if ( response.code ) {
                    if ( 'not_future_date' === response.code && api.section.has( 'publish_settings' ) && api.section( 'publish_settings' ).active.get() && api.control.has( 'changeset_scheduled_date' ) ) {
                      api.control( 'changeset_scheduled_date' ).toggleFutureDateNotification( true ).focus();
                    } else if ( 'changeset_locked' !== response.code ) {
                      notification = new api.Notification( response.code, _.extend( notificationArgs, {
                        message: response.message
                      } ) );
                    }
                  } else {
                    notification = new api.Notification( 'unknown_error', _.extend( notificationArgs, {
                      message: api.l10n.unknownRequestFail
                    } ) );
                  }
                  //</@4.9compat>

                  if ( notification ) {
                    api.notifications.add( notification );
                  }

                  //the response.setting_validities is done in alwaysAfterSubmission @see save()

                  api.trigger( 'error', response );
                  submit_dfd.reject( response );
            } );

            request.done( function( response ) {
                  //api.consoleLog('SUBMIT REQUEST DONE ?', params.skope_id, response );
                  submit_dfd.resolve( response );
            } );

            //return the promise
            return submit_dfd.promise();
      }//submit()
});//$.extend
})( wp.customize , jQuery, _ );