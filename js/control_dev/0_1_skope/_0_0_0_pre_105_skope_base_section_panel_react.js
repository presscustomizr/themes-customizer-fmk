

var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
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
                    //COLLAPSE ANY RESET DIALOG OR CTRL NOTICE PREVIOUSLY EXPANDED
                    var controls = api.CZR_Helpers.getSectionControlIds( previous_sec_id  );
                    _.each( controls, function( ctrlId ) {
                          if ( ! api.has( ctrlId ) || _.isUndefined( api.control( ctrlId ) ) )
                            return;
                          var ctrl = api.control( ctrlId );
                          if ( ! _.has( ctrl, 'czr_states' ) )
                            return;
                          ctrl.czr_states( 'noticeVisible' )( false );
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
                                api.czr_serverNotification({
                                      status:'success',
                                      message : [ _title, 'can only be customized site wide.' ].join(' ')//@to_translate
                                });
                                api.czr_activeSkopeId( self.getGlobalSkopeId() );
                          };
                          //Switch to global skope for not skoped sections
                          if ( 'global' != api.czr_skope( api.czr_activeSkopeId() )().skope ) {
                                if (
                                  self.isExcludedWPCustomCss() &&
                                  ( 'custom_css' == active_sec_id || 'admin_sec' == active_sec_id )
                                ) {
                                      _switchBack( api.section( active_sec_id ).params.title );
                                }

                                if ( 'nav_menu[' == active_sec_id.substring( 0, 'nav_menu['.length ) || 'add_menu' == active_sec_id ) {
                                      api.czr_serverNotification({
                                            status:'success',
                                            message : [
                                                  'Menus are created site wide.'//@to_translate
                                            ].join(' ')
                                      });
                                      //_switchBack( api.section( active_sec_id ).params.title );
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
                      active_section.deferred.embedded.then( function() {
                            _doReactActive( active_section, active_sec_id );
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
                      api.czr_serverNotification({
                            status:'success',
                            message : [ _title, 'can only be customized site wide.' ].join(' ')
                      });
                      api.czr_activeSkopeId( self.getGlobalSkopeId() );
                };

                //Display a notifictation skoped panels
                api.czr_skopeReady.then( function() {
                      if ( 'global' != api.czr_skope( api.czr_activeSkopeId() )().skope ) {
                            if ( self.isExcludedSidebarsWidgets() && 'widgets' == active_panel_id ) {
                                  api.czr_serverNotification({
                                        status:'success',
                                        message : [
                                              'Widgets are created site wide.'//@to_translate
                                        ].join(' ')
                                  });
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