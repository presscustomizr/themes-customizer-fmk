
( function ( api, $, _ ) {
      /*****************************************************************************
      * DEFINE SOME USEFUL OBSERVABLE VALUES
      *****************************************************************************/
      //STORE THE CURRENTLY ACTIVE SECTION AND PANELS IN AN OBSERVABLE VALUE
      //BIND EXISTING AND FUTURE SECTIONS AND PANELS
      api.czr_activeSectionId = new api.Value('');
      api.czr_activePanelId = new api.Value('');

      /*****************************************************************************
      * OBSERVE UBIQUE CONTROL'S SECTIONS EXPANSION
      *****************************************************************************/
      if ( 'function' === typeof api.Section ) {
            //move controls back and forth in declared ubique sections
            //=> implemented in the customizr theme for the social links boolean visibility controls ( socials in header, sidebar, footer )
            api.control.bind( 'add', function( _ctrl ) {
                  if ( _ctrl.params.ubq_section && _ctrl.params.ubq_section.section ) {
                        //save original state
                        _ctrl.params.original_priority = _ctrl.params.priority;
                        _ctrl.params.original_section  = _ctrl.params.section;

                        api.section.when( _ctrl.params.ubq_section.section, function( _section_instance ) {
                                _section_instance.expanded.bind( function( expanded ) {
                                      if ( expanded ) {
                                            if ( _ctrl.params.ubq_section.priority ) {
                                                  _ctrl.priority( _ctrl.params.ubq_section.priority );
                                            }
                                            _ctrl.section( _ctrl.params.ubq_section.section );
                                      }
                                      else {
                                            _ctrl.priority( _ctrl.params.original_priority );
                                            _ctrl.section( _ctrl.params.original_section );
                                      }
                                });

                        } );
                  }
            });
      }


      /*****************************************************************************
      * OBSERVE UBIQUE CONTROL'S PANELS EXPANSION
      *****************************************************************************/
      if ( 'function' === typeof api.Panel ) {
            //move section back and forth in declared ubique panels
            api.section.bind( 'add', function( _sec ) {
                  if ( _sec.params.ubq_panel && _sec.params.ubq_panel.panel ) {
                        //save original state
                        _sec.params.original_priority = _sec.params.priority;
                        _sec.params.original_panel  = _sec.params.panel;

                        api.panel.when( _sec.params.ubq_panel.panel, function( _panel_instance ) {
                                _panel_instance.expanded.bind( function( expanded ) {
                                      if ( expanded ) {
                                            if ( _sec.params.ubq_panel.priority ) {
                                                  _sec.priority( _sec.params.ubq_panel.priority );
                                            }
                                            _sec.panel( _sec.params.ubq_panel.panel );
                                      }
                                      else {
                                            _sec.priority( _sec.params.original_priority );
                                            _sec.panel( _sec.params.original_panel );
                                      }
                                });

                        } );
                  }
            });
      }


      /*****************************************************************************
      * CLOSE THE MOD OPTION PANEL ( if exists ) ON : section change, panel change, skope switch
      *****************************************************************************/
      //@return void()
      var _closeModOpt = function() {
            if ( ! _.has( api, 'czr_ModOptVisible') )
              return;
            api.czr_ModOptVisible(false);
      };
      api.czr_activeSectionId.bind( _closeModOpt );
      api.czr_activePanelId.bind( _closeModOpt );

      /*****************************************************************************
      * OBSERVE SECTIONS AND PANEL EXPANSION
      * /store the current expanded section and panel
      *****************************************************************************/
      api.bind('ready', function() {
            if ( 'function' != typeof api.Section ) {
              throw new Error( 'Your current version of WordPress does not support the customizer sections needed for this theme. Please upgrade WordPress to the latest version.' );
            }
            var _storeCurrentSection = function( expanded, section_id ) {
                  api.czr_activeSectionId( expanded ? section_id : '' );
            };
            api.section.each( function( _sec ) {
                  //<@4.9compat>
                  // Bail if is 'publish_setting' section
                  if ( 'publish_settings' == _sec.id )
                    return;
                  //</@4.9compat>
                  _sec.expanded.bind( function( expanded ) { _storeCurrentSection( expanded, _sec.id ); } );
            });
            api.section.bind( 'add', function( section_instance ) {
                  //<@4.9compat>
                  // Bail if is 'publish_setting' section
                  if ( 'publish_settings' == section_instance.id )
                    return;
                  //</@4.9compat>
                  api.trigger('czr-paint', { active_panel_id : section_instance.panel() } );
                  section_instance.expanded.bind( function( expanded ) { _storeCurrentSection( expanded, section_instance.id ); } );
            });

            var _storeCurrentPanel = function( expanded, panel_id ) {
                  api.czr_activePanelId( expanded ? panel_id : '' );
                  //if the expanded panel id becomes empty (typically when switching back to the root panel), make sure that no section is set as currently active
                  //=> fixes the problem of add_menu section staying expanded when switching back to another panel
                  if ( _.isEmpty( api.czr_activePanelId() ) ) {
                        api.czr_activeSectionId( '' );
                  }
            };
            api.panel.each( function( _panel ) {
                  _panel.expanded.bind( function( expanded ) { _storeCurrentPanel( expanded, _panel.id ); } );
            });
            api.panel.bind( 'add', function( panel_instance ) {
                  panel_instance.expanded.bind( function( expanded ) { _storeCurrentPanel( expanded, panel_instance.id ); } );
            });
      });


})( wp.customize , jQuery, _);