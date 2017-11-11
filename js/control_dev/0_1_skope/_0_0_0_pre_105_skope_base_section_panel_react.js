

var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

    /*****************************************************************************
    * REACT ON ACTIVE SECTION SETUP DONE
    *****************************************************************************/
    // fired on 'active-section-setup'
    // params looks like : { controls : controls, section_id : section_id }
    _maybeSetupAssignedMenuLocations : function( active_section ) {
          if ( _.isUndefined( active_section ) || _.isEmpty( active_section ) || ! api.section.has( active_section.id ) ) {
                api.consoleLog( 'In _maybeSetupAssignedMenuLocations : no valid section_id provided.');
          }
          var self = this;
          //is this a menu section ? and does it have assigned locations ?
          if ( ! active_section.assignedLocations )
            return;

          //locations is an array of locations for a menu
          //=> we want to synchronize the reset button of this menu location in this section, with the one of the nav_menu_location setting
          var _assignedLocReact = function( locations ) {};

          if ( ! active_section.assignedLocations.callbacks.has( _assignedLocReact ) ) {
                active_section.assignedLocations.bind( _assignedLocReact );
          }
    },



    /*****************************************************************************
    * REACT TO ACTIVE SECTION EXPANSION
    *****************************************************************************/
    //cb of api.czr_activeSectionId()
    activeSectionReact : function( active_sec_id , previous_sec_id ) {
          //PAINT
          if ( 'add_menu' != active_sec_id ) {
                api.trigger('czr-paint', { active_section_id : active_sec_id } );
          }

          var self = this,
              _doReactPrevious = function( previous_sec_id ) {
                    //COLLAPSE ANY RESET DIALOG
                    var controls = api.CZR_Helpers.getSectionControlIds( previous_sec_id  );
                    _.each( controls, function( ctrlId ) {
                          if ( ! api.has( ctrlId ) || _.isUndefined( api.control( ctrlId ) ) )
                            return;
                          var ctrl = api.control( ctrlId );
                          if ( ! _.has( ctrl, 'czr_states' ) )
                            return;

                          ctrl.czr_states( 'resetVisible' )( false );
                    });
              },
              _doReactActive = function( active_section, active_sec_id ) {
                    //PRE RENDER THE CONTROL RESET ICONS + NOTICE
                    self.setupActiveSkopedControls( {
                          section_id : active_sec_id
                    });

                    //PROCESS SILENT UPDATES
                    self.processSilentUpdates( { section_id : active_sec_id  } )
                          .fail( function() {
                                throw new Error( 'Fail to process silent updates after initial skope collection has been populated' );
                          })
                          .done( function() {
                                // var _update_candidates = self._getSilentUpdateCandidates( active_sec_id  );
                                // self.processSilentUpdates( { candidates : _update_candidates } );
                                // //add control single reset + observable values
                                // self.setupActiveSkopedControls();

                                //Always display the notice when skope is not global
                                //=> let user understand where the setting value is coming from
                                var _setupSectionCtrlNotices = function() {
                                      var controls = api.CZR_Helpers.getSectionControlIds( active_sec_id );
                                      _.each( controls, function( ctrlId ) {
                                            if ( ! api.has( ctrlId ) || _.isUndefined( api.control( ctrlId ) ) )
                                              return;
                                            var ctrl = api.control( ctrlId );
                                            if ( ! _.has( ctrl, 'czr_states' ) )
                                              return;
                                            ctrl.czr_states( 'noticeVisible' )( self.isCtrlNoticeVisible( ctrlId ) );
                                      });
                                };

                                //Setup ctrol notices after a delay
                                //=>the delay is needed for controls that have been re-rendered.
                                _.delay( function() {
                                      _setupSectionCtrlNotices();
                                }, 700 );

                                //Sidebar Widget specific
                                if ( ! self.isExcludedSidebarsWidgets() ) {
                                      self.forceSidebarDirtyRefresh( active_sec_id , api.czr_activeSkopeId() );
                                }
                          });

                    //TRIGGER AN OBJECT RICH EVENT
                    //LISTEN TO ACTIVE SECTION SETUP : RESET ICONS + CONTROL NOTICES ARE WRITEEN
                    //=> handles the synchronized assigned locations for menus
                    // 'skoped-controls-setup' is triggered when self.setupActiveSkopedControls()
                    // params looks like : { controls : controls, section_id : section_id }
                    if ( ! _.has( api.topics, 'active-section-setup' ) ) {
                          api.bind( 'active-section-setup', function( params ) {
                                var defaults = {
                                      controls : [],
                                      section_id : ''
                                };
                                params = _.extend( defaults, params );
                                self._maybeSetupAssignedMenuLocations( params );
                          });
                    }

                    //Switch to global skope for not skoped sections
                    api.czr_skopeReady.then( function() {
                          var _switchBack = function( _title ) {
                                //<@4.9compat>
                                if ( ! _.isUndefined( api.notifications ) ) {
                                      api.notifications.add( new wp.customize.Notification( _title, {
                                            type: 'info',
                                            message: [ _title, serverControlParams.i18n.skope['is always customized sitewide.'] ].join(' '),
                                            dismissible: true
                                      } ) );

                                      // Removed if not dismissed after 5 seconds
                                      _.delay( function() {
                                            if ( api.notifications.has( _title ) ) {
                                                  var _notif_ = api.notifications( _title );
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
                                            status:'success',
                                            message : [ _title, serverControlParams.i18n.skope['is always customized sitewide.'] ].join(' ')
                                      });
                                }

                                api.czr_activeSkopeId( self.getGlobalSkopeId() );
                          };
                          //Switch to global skope for not skoped sections
                          if ( 'global' != api.czr_skope( api.czr_activeSkopeId() )().skope ) {
                                if ( self.isExcludedWPCustomCss() && 'custom_css' == active_sec_id ) {
                                      _switchBack( api.section( active_sec_id ).params.title );
                                }
                                if ( _.contains( ['admin_sec', 'tc_font_customizer_settings' ], active_sec_id ) ) {
                                      _switchBack( api.section( active_sec_id ).params.title );
                                }

                                if ( 'nav_menu[' == active_sec_id.substring( 0, 'nav_menu['.length ) || 'add_menu' == active_sec_id ) {
                                      //<@4.9compat>
                                      if ( ! _.isUndefined( api.notifications ) ) {
                                            api.notifications.add( new wp.customize.Notification( 'nav_menus_sitewide', {
                                                  type: 'info',
                                                  message: serverControlParams.i18n.skope['Menus are created sitewide.'],
                                                  dismissible: true
                                            } ) );

                                            // Removed if not dismissed after 5 seconds
                                            _.delay( function() {
                                                  if ( api.notifications.has( 'nav_menus_sitewide' ) ) {
                                                        var _notif_ = api.notifications( 'nav_menus_sitewide' );
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
                                                  status:'success',
                                                  message : serverControlParams.i18n.skope['Menus are created sitewide.']
                                            });
                                      }
                                }
                          }
                    });

                    //SAY IT
                    api.trigger('active-section-setup', active_section );
              };



          //defer the callback execution when the first skope collection has been populated
          //=> otherwise it might be to early. For example in autofocus request cases.
          api.czr_initialSkopeCollectionPopulated.then( function() {
                api.section.when( active_sec_id , function( active_section ) {
                      //<@4.9compat>
                      // Bail if is opening the publish_setting section
                      if ( 'publish_settings' == active_sec_id )
                        return;
                      //</@4.9compat>
                      active_section.deferred.embedded.then( function() {
                            try { _doReactActive( active_section, active_sec_id ); } catch( er ) {
                                  api.errorLog( 'activeSectionReact => _doReactActive : ' + er );
                            }

                      });
                });
                if ( ! _.isEmpty( previous_sec_id ) && api.section.has( previous_sec_id ) ) {
                      _doReactPrevious( previous_sec_id );
                }
          });
    },


    /*****************************************************************************
    * REACT TO ACTIVE PANEL EXPANSION
    *****************************************************************************/
    //cb of api.czr_activePanelId()
    activePanelReact : function( active_panel_id , previous_panel_id ) {
          var self = this;
          api.czr_initialSkopeCollectionPopulated.then( function() {
                api.trigger('czr-paint', { active_panel_id : active_panel_id } );
                var _switchBack = function( _title ) {
                      //<@4.9compat>
                      if ( ! _.isUndefined( api.notifications ) ) {
                            api.notifications.add( new wp.customize.Notification( _title, {
                                  type: 'info',
                                  message: [ _title, serverControlParams.i18n.skope['is always customized sitewide.'] ].join(' '),
                                  dismissible: true
                            } ) );

                            // Removed if not dismissed after 5 seconds
                            _.delay( function() {
                                  if ( api.notifications.has( _title ) ) {
                                        var _notif_ = api.notifications( _title );
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
                                  status:'success',
                                  message : [ _title, serverControlParams.i18n.skope['is always customized sitewide.'] ].join(' ')
                            });
                      }

                      api.czr_activeSkopeId( self.getGlobalSkopeId() );
                };

                //Display a notifictation skoped panels
                api.czr_skopeReady.then( function() {
                      if ( 'global' != api.czr_skope( api.czr_activeSkopeId() )().skope ) {
                            if ( self.isExcludedSidebarsWidgets() && 'widgets' == active_panel_id ) {
                                  //<@4.9compat>
                                  if ( ! _.isUndefined( api.notifications ) ) {
                                        api.notifications.add( new wp.customize.Notification( 'widgets_are_sitewide', {
                                              type: 'info',
                                              message: serverControlParams.i18n.skope['Widgets are created sitewide.'],
                                              dismissible: true
                                        } ) );

                                        // Removed if not dismissed after 5 seconds
                                        _.delay( function() {
                                              if ( api.notifications.has( 'widgets_are_sitewide' ) ) {
                                                    var _notif_ = api.notifications( 'widgets_are_sitewide' );
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
                                              status:'success',
                                              message : serverControlParams.i18n.skope['Widgets are created sitewide.']
                                        });
                                  }
                                  //_switchBack( api.panel( active_panel_id ).params.title );
                            }
                      }
                });

                //Silently update all sections of the nav_menus panel each time it's switch to
                //=> fixes the problem of locations not being refreshd below the menu titles
                api.czr_skopeReady.then( function() {
                      if ( 'nav_menus' == active_panel_id ) {
                            _.each( api.panel( active_panel_id ).sections(), function( _sec ) {
                                  //PROCESS SILENT UPDATES
                                  self.processSilentUpdates( { section_id : _sec.id, awake_if_not_active : true } );
                            });
                      }
                });
          });
    }
});//$.extend()
})( wp.customize , jQuery, _ );