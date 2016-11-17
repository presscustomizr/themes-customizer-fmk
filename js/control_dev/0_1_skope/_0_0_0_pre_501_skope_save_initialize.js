
var CZRSkopeSaveMths = CZRSkopeSaveMths || {};
$.extend( CZRSkopeSaveMths, {
      initialize: function() {
            this.changesetStatus    = 'publish';
            this.saveBtn            = $( '#save' );
      },

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
                  self.changesetStatus = args.status;
            }

            if ( api.state( 'saving' ).get() ) {
                  self.globalSaveDeferred.reject( 'already_saving' );
            }

            // set saving state.
            // => will be set to false when all saved promises resolved
            api.state( 'saving' ).set( true );
            //api.state( 'processing' ).set( api.state( 'processing' ).get() + 1 );

            var resolveSave = function() {
                  self.fireAllSubmission()
                        .fail( function( r ) {
                              api.consoleLog('ALL SUBMISSIONS FAILED', r );
                              self.globalSaveDeferred.reject( r );
                              api.trigger( 'error', r );
                        })
                        .done( function( response ) {
                              //console.log('ALL SUBMISSIONS DONE', response );

                              //api.previewer.refresh() method is resolved with an object looking like :
                              //{
                              //    previewer : api.previewer,
                              //    skopesServerData : {
                              //        czr_skopes : _wpCustomizeSettings.czr_skopes || [],
                              //        skopeGlobalDBOpt : _wpCustomizeSettings.skopeGlobalDBOpt || [],
                              //    },
                              // }
                              api.previewer.refresh( { waitSkopeSynced : true } )
                                    .fail( function( refresh_data ) {
                                          self.globalSaveDeferred.reject( self.previewer, [ response ] );
                                          api.consoleLog('SAVE REFRESH FAIL', refresh_data );
                                    })
                                    .always( function() {
                                          //WP default treatments
                                          api.state( 'saving' ).set( false );
                                          //api.state( 'processing' ).set( api.state( 'processing' ).get() - 1 );
                                          self.saveBtn.prop( 'disabled', false );
                                          if ( response.setting_validities ) {
                                                api._handleSettingValidities( {
                                                      settingValidities: response.setting_validities,
                                                      focusInvalidControl: true
                                                } );
                                          }
                                    })
                                    .done( function( refresh_data ) {
                                          //console.log('SAVE REFRESH DONE', refresh_data);

                                          api.previewer.send( 'saved', response );

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

                                          //let's use the data sent back by the server on refresh
                                          refresh_data = _.extend( {
                                                      previewer : refresh_data.previewer || self.previewer,
                                                      skopesServerData : refresh_data.skopesServerData || {},
                                                },
                                                refresh_data
                                          );

                                          //POST PROCESS AFTER SAVE
                                          //- Clean dirtyness
                                          //Reset api values
                                          //=> api.control(setId).czr_isDirty
                                          //=> api.control(setId).czr_hasDBVal
                                          self.reactWhenSaveDone( refresh_data.skopesServerData );

                                          //Resolve the general globalSaveDeferred
                                          self.globalSaveDeferred.resolveWith( self.previewer, [ response ] );

                                          api.trigger( 'saved', response || {} );
                                    });
                        });
            };

            if ( 0 === processing() ) {
                  resolveSave();
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
      }
});//$.extend