
var CZRSkopeSaveMths = CZRSkopeSaveMths || {};
$.extend( CZRSkopeSaveMths, {
      initialize: function() {
            var self = this;
            this.changesetStatus    = 'publish';
            this.saveBtn            = $( '#save' );
            api.czr_serverNotification   = new api.Value({status : 'success', message : '', expanded : true} );

            api.czr_serverNotification.bind( function( to, from ) {
                    self.toggleServerNotice( to );
            });

            self.userEventMap = [
                  //skope reset : do reset
                  {
                        trigger   : 'click keydown',
                        selector  : '.czr-dismiss-notification',
                        name      : 'dismiss-notification',
                        actions   : function() {
                              api.czr_serverNotification( { expanded : false } );
                        }
                  }
            ];
            api.CZR_Helpers.setupDOMListeners( self.userEventMap , { dom_el : $('.czr-scope-switcher') }, self );
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
            var alwaysAfterSubmission = function( response, state ) {
                      //WP default treatments
                      api.state( 'saving' ).set( false );
                      //api.state( 'processing' ).set( api.state( 'processing' ).get() - 1 );
                      self.saveBtn.prop( 'disabled', false );
                      if ( ! _.isUndefined( response ) && response.setting_validities ) {
                            api._handleSettingValidities( {
                                  settingValidities: response.setting_validities,
                                  focusInvalidControl: true
                            } );
                      }
                      if ( 'pending' == state ) {
                            api.czr_serverNotification( { message: response, status : 'error' } );
                      } else {
                            api.czr_serverNotification( { message: 'Successfully published !' } );
                      }
                },
                resolveSave = function() {
                      self.fireAllSubmission()
                            .always( function( response ) {
                                  alwaysAfterSubmission( response , this.state() );
                            })
                            .fail( function( response ) {
                                  api.consoleLog('ALL SUBMISSIONS FAILED', response );
                                  self.globalSaveDeferred.reject( response );
                                  api.trigger( 'error', response );
                            })
                            .done( function( response ) {
                                  //console.log('ALL SUBMISSIONS DONE', response );

                                  //api.previewer.refresh() method is resolved with an object looking like :
                                  //{
                                  //    previewer : api.previewer,
                                  //    skopesServerData : {
                                  //        czr_skopes : _wpCustomizeSettings.czr_skopes || [],
                                  //        isChangesetDirty : boolean
                                  //        skopeGlobalDBOpt : _wpCustomizeSettings.skopeGlobalDBOpt || [],
                                  //    },
                                  // }
                                  api.previewer.refresh( { waitSkopeSynced : true } )
                                        .fail( function( refresh_data ) {
                                              self.globalSaveDeferred.reject( self.previewer, [ response ] );
                                              api.consoleLog('SAVE REFRESH FAIL', refresh_data );
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
      },







      //callback of api.czr_serverNotification
      //notice is an object :
      //  {
      //    status : 'success',
      //    expanded : true,
      //    message : ''
      //  }
      toggleServerNotice : function( notice ) {
            notice = _.isObject( notice ) ? notice : {};
            notice = _.extend( {
                  status : 'success',
                  expanded : true,
                  message : ''
            }, notice );

            this.serverNoticeEmbedded = this.serverNoticeEmbedded || $.Deferred();

            var self = this,
                _embed = function() {
                      $('.czr-scope-switcher').prepend(
                            $( '<div/>', {
                                  class:'czr-server-notice',
                                  html:'<span class="czr-server-message"></span><span class="fa fa-times-circle czr-dismiss-notification"></span>'
                            } )
                      );
                },
                _toggleNotice = function() {
                      var $notif_wrap         = $( '.czr-server-notice', '.czr-scope-switcher' ),
                          $header             = $('.wp-full-overlay-header'),
                          $sidebar            = $('.wp-full-overlay-sidebar .wp-full-overlay-sidebar-content'),
                          _header_height,
                          _notif_wrap_height,
                          _set_height = function( _h ) {
                                $header.css( 'height', '');
                                $sidebar.css( 'top', '' );
                                if ( _.isUndefined( _h ) )
                                  return;
                                $header.css( 'height', _h + 'px' );
                                $sidebar.css( 'top', _h + 'px' );
                          };

                      if ( ! notice.expanded ) {
                            $notif_wrap
                                  .fadeOut( {
                                        duration : 200,
                                        complete : function() {
                                              $( this ).css( 'height', 'auto' );
                                  } } );
                            setTimeout( function() {
                                  _set_height();
                            } , 200 );

                      } else {
                            $notif_wrap.toggleClass( 'czr-server-error', 'error' == notice.status );
                            if ( 'error' == notice.status ) {
                                  $('.czr-server-message', $notif_wrap )
                                        .html( _.isEmpty( notice.message ) ? 'A problem occured.' : [ 'Error :' , notice.message ].join(' ') );
                            } else {
                                  $('.czr-server-message', $notif_wrap )
                                        .html( _.isEmpty( notice.message ) ? 'Success.' : [ 'Success :' , notice.message ].join(' ') );
                            }
                            _notif_wrap_height  = $( '.czr-server-notice', '.czr-scope-switcher' ).outerHeight();
                            _header_height  = $header.outerHeight() + _notif_wrap_height;

                            setTimeout( function() {
                                  $.when( _set_height( _header_height ) ).done( function() {
                                        $notif_wrap
                                        .fadeIn( {
                                              duration : 200,
                                              complete : function() {
                                                    $( this ).css( 'height', 'auto' );
                                        } } );
                                  } );
                            }, 400 );
                      }
                };

            //prepend the wrapper if needed
            if ( 'pending' == self.serverNoticeEmbedded.state() ) {
                  $.when( _embed() ).done( function() {
                        setTimeout( function() {
                              self.serverNoticeEmbedded.resolve();
                              _toggleNotice();
                        }, 200 );
                  });
            } else {
                  _toggleNotice();
            }
            if ( 'success' == notice.status ) {
                  setTimeout( function() {
                              api.czr_serverNotification( { expanded : false } );
                        },
                        3000
                  );
            }
      }
});//$.extend