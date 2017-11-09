
var CZRSkopeSaveMths = CZRSkopeSaveMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeSaveMths, {
      initialize: function() {
            var self = this;
            //<@4.9compat>
            //can take values : draft, future, publish, trash, ''
            this.changesetStatus    = function() {
                  return api.state.has( 'selectedChangesetStatus' ) ? api.state( 'selectedChangesetStatus' )() : 'publish';
            };
            this.selectedChangesetDate = function() {
                  return api.state.has( 'selectedChangesetDate' ) ? api.state( 'selectedChangesetDate' )() : null;
            };
            //</@4.9compat>
            this.saveBtn            = $( '#save' );
      },

      // No args are passed as of WP4.9
      // @4.9compat
      save: function( args ) {
            var self        = this,
                processing  = api.state( 'processing' ),
                submitWhenDoneProcessing,
                parent      = new api.Messenger({
                      url: api.settings.url.parent,
                      channel: 'loader',
                });//this has to be reinstantiated because not accessible from core

            //reset some properties on each save call
            self.globalSaveDeferred = $.Deferred();
            self.previewer          = api.previewer;
            self.globalSkopeId      = api.czr_skopeBase.getGlobalSkopeId();
            self.saveArgs           = args;

            if ( args && args.status ) {
                  self.changesetStatus = function() { return args.status; };
            }

            if ( api.state( 'saving' )() ) {
                  self.globalSaveDeferred.reject( 'already_saving' );
            }

            //api.state( 'processing' ).set( api.state( 'processing' ).get() + 1 );
            var alwaysAfterSubmission = function( response, state ) {
                      //WP default treatments
                      api.state( 'saving' )( false );
                      api.state( 'processing' ).set( 0 );
                      self.saveBtn.prop( 'disabled', false );
                      if ( ! _.isUndefined( response ) && response.setting_validities ) {
                            api._handleSettingValidities( {
                                  settingValidities: response.setting_validities,
                                  focusInvalidControl: true
                            } );
                      }

                      //<@4.9compat>
                      // Start a new changeset if the underlying changeset was published.
                      if ( response && 'changeset_already_published' === response.code && response.next_changeset_uuid ) {
                        api.settings.changeset.uuid = response.next_changeset_uuid;
                        api.state( 'changesetStatus' ).set( '' );
                        if ( api.settings.changeset.branching ) {
                          parent.send( 'changeset-uuid', api.settings.changeset.uuid );
                        }
                        api.previewer.send( 'changeset-uuid', api.settings.changeset.uuid );
                      }
                      //</@4.9compat>

                      if ( 'pending' == state ) {
                            api.czr_serverNotification( { message: response, status : 'error' } );
                      } else {
                            //api.czr_serverNotification( { message: 'Successfully published !' } );
                      }
                },
                //params : { saveGlobal : true, saveSkopes : true }
                resolveSave = function( params ) {
                      var response, resolveSaveDfd = $.Deferred();
                      // set saving state.
                      // => will be set to false when all saved promises resolved
                      api.state( 'saving' )( true );
                      self.fireAllSubmission( params )
                            .always( function( _response_ ) {
                                  response = _response_.response;
                                  alwaysAfterSubmission( response , this.state() );
                            })
                            .fail( function( _response_ ) {
                                  response = _response_.response;
                                  api.consoleLog('ALL SUBMISSIONS FAILED', response );
                                  self.globalSaveDeferred.reject( response );
                                  api.trigger( 'error', response );
                                  resolveSaveDfd.resolve( _response_.hasNewMenu );
                            })
                            //_response_ = { response : response,  hasNewMenu : boolean }
                            .done( function( _response_ ) {
                                  response = _response_.response;
                                  //api.previewer.refresh() method is resolved with an object looking like :
                                  //{
                                  //    previewer : api.previewer,
                                  //    skopesServerData : {
                                  //        czr_skopes : _wpCustomizeSettings.czr_skopes || [],
                                  //        isChangesetDirty : boolean
                                  //    },
                                  // }
                                  api.previewer.refresh( { waitSkopeSynced : true } )
                                        .fail( function( refresh_data ) {
                                              self.globalSaveDeferred.reject( self.previewer, [ response ] );
                                              api.consoleLog('SAVE REFRESH FAIL', refresh_data );
                                        })
                                        .done( function( refresh_data ) {
                                              api.previewer.send( 'saved', response );

                                              //response can be undefined, always set them as an object with 'publish' changet_setstatus by default
                                              //because this will be used in various api events ( 'saved', ... ) that does not accept an undefined val.
                                              response = _.extend( { changeset_status : 'publish' },  response || {} );

                                              //since 4.7 : if changeset is on, let's add stuff to the query object
                                              if ( api.czr_isChangeSetOn() ) {
                                                    var latestRevision = api._latestRevision;
                                                    api.state( 'changesetStatus' ).set( response.changeset_status );

                                                    //<@4.9compat>
                                                    if ( response.changeset_date ) {
                                                      api.state( 'changesetDate' ).set( response.changeset_date );
                                                    }
                                                    //</@4.9compat>

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
                                                          //<@4.9compat>
                                                          if ( api.settings.changeset.branching ) {
                                                            parent.send( 'changeset-uuid', api.settings.changeset.uuid );
                                                          }
                                                          //</@4.9compat>
                                                          else {
                                                            parent.send( 'changeset-uuid', api.settings.changeset.uuid );
                                                          }
                                                    }
                                                    //<@4.9compat>
                                                    // Prevent subsequent requestChangesetUpdate() calls from including the settings that have been saved.
                                                    api._lastSavedRevision = Math.max( latestRevision, api._lastSavedRevision );
                                                    //</@4.9compat>
                                              } else {
                                                    // Clear api setting dirty states
                                                    api.each( function ( value ) {
                                                          value._dirty = false;
                                                    } );
                                              }

                                              //let's use the data sent back by the server on refresh
                                              refresh_data = _.extend( {
                                                          previewer : refresh_data.previewer || self.previewer,
                                                          skopesServerData : refresh_data.skopesServerData || {},
                                                    },
                                                    refresh_data
                                              );

                                              //POST PROCESS AFTER SAVE
                                              //Reset dirtyness
                                              //check if synchronized with server
                                              self.reactWhenSaveDone( refresh_data.skopesServerData );

                                              //Resolve the general globalSaveDeferred
                                              self.globalSaveDeferred.resolveWith( self.previewer, [ response ] );

                                              api.trigger( 'saved', response || {} );
                                              resolveSaveDfd.resolve( _response_.hasNewMenu );
                                        });
                            });
                return resolveSaveDfd.promise();
            };//resolveSave

            if ( 0 === processing() ) {
                  resolveSave().done( function( hasNewMenu ) {
                        if ( hasNewMenu ) {
                              resolveSave( { saveGlobal :false, saveSkopes : true } );
                        }
                  } );
            } else {
                  submitWhenDoneProcessing = function () {
                        if ( 0 === processing() ) {
                              api.state.unbind( 'change', submitWhenDoneProcessing );
                              resolveSave();
                        }
                  };
                  api.state.bind( 'change', submitWhenDoneProcessing );
            }
            return self.globalSaveDeferred.promise();
      }//save
});//$.extend
})( wp.customize , jQuery, _ );