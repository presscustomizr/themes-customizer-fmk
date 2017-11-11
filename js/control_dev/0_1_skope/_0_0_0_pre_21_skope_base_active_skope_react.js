
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

    //declared in initialize
    //cb of api.czr_activeSkopeId.callbacks
    //react when the active skope has been set to a new value
    // => change the to and from skope active() state
    // => silently update each setting values with the skope set of vals
    activeSkopeReact : function( to, from ) {
          var self = this, dfd = $.Deferred();
          //set the to and from scope state on init and switch
          if ( ! _.isUndefined(from) && api.czr_skope.has(from) )
            api.czr_skope(from).active(false);
          else if ( ! _.isUndefined( from ) )
            throw new Error('listenToActiveSkope : previous scope does not exist in the collection', from );

          if ( ! _.isUndefined(to) && api.czr_skope.has(to) )
            api.czr_skope(to).active(true);
          else
            throw new Error('listenToActiveSkope : requested scope ' + to + ' does not exist in the collection');


          //BAIL AND RETURN PROMISE HERE IF SWITCHING TO A PANEL OR SECTION WITH ONLY UNSKOPED SETTINGS
          // => widgets and custom_css
          //Switch to global skope for not skoped panels
          var _switchBack = function( _title ) {
                api.czr_activeSkopeId( self.getGlobalSkopeId() );
                //<@4.9compat>
                if ( ! _.isUndefined( api.notifications ) ) {
                      api.notifications.add( new wp.customize.Notification( _title, {
                            type: 'info',
                            message: [ _title , 'is always customized sitewide.' ].join(' '),
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
                            message : [ _title , 'is always customized sitewide.' ].join(' ')
                      });
                }
                return dfd.resolve().promise();
          };


          if ( self.isExcludedSidebarsWidgets() && 'widgets' == api.czr_activePanelId() && to != self.getGlobalSkopeId() ) {
                //<@4.9compat>
                if ( ! _.isUndefined( api.notifications ) ) {
                      api.notifications.add( new wp.customize.Notification( 'widgets_are_sidewide', {
                            type: 'info',
                            message: serverControlParams.i18n.skope['Widgets are created sitewide.'],
                            dismissible: true
                      } ) );

                      // Removed if not dismissed after 5 seconds
                      _.delay( function() {
                            if ( api.notifications.has( 'widgets_are_sidewide' ) ) {
                                  var _notif_ = api.notifications( 'widgets_are_sidewide' );
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
                            message : [
                                  serverControlParams.i18n.skope['Widgets are created sitewide.']
                            ].join(' ')
                      });
                }

                //return dfd.resolve().promise();// _switchBack( api.panel( api.czr_activePanelId() ).params.title );
          }

          if ( self.isExcludedWPCustomCss() && 'custom_css' == api.czr_activeSectionId() && to != self.getGlobalSkopeId() ) {
                return _switchBack( api.section( api.czr_activeSectionId() ).params.title );
          }
          if ( 'admin_sec' == api.czr_activeSectionId() && to != self.getGlobalSkopeId() ) {
                return _switchBack( api.section( api.czr_activeSectionId() ).params.title );
          }
          if ( 'tc_font_customizer_settings' == api.czr_activeSectionId() && to != self.getGlobalSkopeId() ) {
                return _switchBack( api.section( api.czr_activeSectionId() ).params.title );
          }

          if ( ( 'nav_menu' == api.czr_activeSectionId().substring( 0, 'nav_menu'.length ) || 'add_menu' == api.czr_activeSectionId() ) && to != self.getGlobalSkopeId() )  {
                api.czr_serverNotification({
                      status:'success',
                      message : [
                            serverControlParams.i18n.skope['Menus are created sitewide.']
                      ].join(' ')
                });
                //_switchBack( api.section( api.czr_activeSectionId() ).params.title );
          }


          //AWAKE NOT CURRENTLY ACTIVE NAV MENUS SECTION
          //=> this solves the problem of nav menu location not being refreshed on skope switch
          if ( 'nav_menus' == api.czr_activePanelId() ) {
                _.each( api.panel( api.czr_activePanelId() ).sections(), function( _sec ) {
                      //PROCESS SILENT UPDATES
                      self.processSilentUpdates( { section_id : _sec.id, awake_if_not_active : true } );
                });
          }


          //Set state
          api.state('switching-skope')( true );
          //write the current skope title
          self._writeCurrentSkopeTitle( to );
          //paint skope color
          api.trigger( 'czr-paint', { is_skope_switch : true } );

          //CURRENT EXPANDED SECTION DEPENDANT ACTIONS
          //stop here if the active section is not set yet
          //=> the silent update will be fired on section expansion anyway
          //=> refresh now if the previewer is not skope aware, this will post the dyn_type used in the preview to get the proper option if the skope is not 'global'
          //=> otherwise simply refresh to set the new skope in the query params => needed for the preview frame
          if ( _.isUndefined( api.czr_activeSectionId() ) ) {
                // if ( 'pending' == api.czr_isPreviewerSkopeAware.state() ) {
                //     api.previewer.refresh();
                // } else {
                //     api.previewer.refresh();
                // }
                api.state('switching-skope')( false );
                api.previewer.refresh();
                return dfd.resolve().promise();
          }

          //close the module panel id needed
          if ( _.has( api, 'czrModulePanelState') )
            api.czrModulePanelState(false);

          //PROCESS SILENT UPDATES
          //Build the silent update candidates array
          //populates with the current section setting ids or the one provided
          var _silentUpdateCands = self._getSilentUpdateCandidates();

          //add the previous skope dirty settings ids
          if ( ! _.isUndefined( from ) ) {
            _.each( api.czr_skope( from ).dirtyValues(), function( val, _setId ) {
                  if ( ! _.contains( _silentUpdateCands, _setId ) )
                      _silentUpdateCands.push( _setId );
            } );
          }
          if ( ! _.isUndefined( to ) ) {
            _.each( api.czr_skope( to ).dirtyValues(), function( val, _setId ) {
                  if ( ! _.contains( _silentUpdateCands, _setId ) )
                      _silentUpdateCands.push( _setId );
            } );
          }

          //api.consoleLog('ACTIVE SKOPE REACT', to, from, _silentUpdateCands );

          //Process Silent Updates and
          //make sure that the visibility is processed after the silent updates
          var _debouncedProcessSilentUpdates = function() {
                self.processSilentUpdates( {
                            candidates : _silentUpdateCands,
                            section_id : null,
                            refresh : false//will be done on done()
                      })
                      .fail( function() {
                            dfd.reject();
                            api.state('switching-skope')( false );
                            throw new Error( 'Fail to process silent updates in _debouncedProcessSilentUpdates');
                      })
                      .done( function( _updatedSetIds ) {
                            api.previewer.refresh()
                                  .always( function() {
                                        dfd.resolve( _updatedSetIds );
                                        api.state( 'switching-skope' )( false );
                                  });

                            //on first skope reaction ( initialization phase ) , when from is still undefined : no need to refresh if the target skope is global
                            //=> improve speed performance on init
                            // if ( _.isUndefined( from ) && api.czr_skope.has( to ) && 'global' == api.czr_skope( to )().skope ) {
                            //       dfd.resolve( _updatedSetIds );
                            //       api.state( 'switching-skope' )( false );
                            // } else {
                            //       api.previewer.refresh()
                            //             .always( function() {
                            //                   dfd.resolve( _updatedSetIds );
                            //                   api.state( 'switching-skope' )( false );
                            //             });
                            // }
                      });
          };

          //Process silent updates
          //Collapse the current expanded module if any
          if ( _.has(api, 'czr_isModuleExpanded') && false !== api.czr_isModuleExpanded() ) {
                api.czr_isModuleExpanded().setupModuleViewStateListeners(false);
                _debouncedProcessSilentUpdates = _.debounce( _debouncedProcessSilentUpdates, 400 );
                _debouncedProcessSilentUpdates();
          } else {
                _debouncedProcessSilentUpdates();
          }
          return dfd.promise();
    },//activeSkopeReact



    //@return void()
    //Fired in activeSkopeReact()
    _writeCurrentSkopeTitle : function( skope_id ) {
          var self = this,
              current_title = api.czr_skope( skope_id || api.czr_activeSkopeId() )().long_title,
              _buildTitleHtml = function() {
                    var _inheritedFrom = self.getInheritedSkopeTitles(),
                        _overrides = self.getOverridenSkopeTitles();

                    return $.trim( [
                          '<span class="czr-main-title"><span class="czr-toggle-title-notice fa fa-info-circle"></span>',
                          'global' == api.czr_skope( skope_id || api.czr_activeSkopeId() )().skope ? current_title : ['Customizing', current_title ].join(' '),
                          '</span>',
                          '<span class="czr-skope-inherits-from">',
                          serverControlParams.i18n.skope['In this context :'],
                          _.isEmpty( _inheritedFrom ) ? ' ' : serverControlParams.i18n.skope['inherits from'],
                          _inheritedFrom,
                          _.isEmpty( _inheritedFrom ) ? '' : _.isEmpty( _overrides ) ? '.' : [',' , serverControlParams.i18n.skope['and'] ].join(' '),
                          _.isEmpty( _overrides ) ? ' ' : serverControlParams.i18n.skope['overridden by'],
                          _overrides,
                          _.isEmpty( _overrides ) ? '' : '.',
                          '</span>'
                    ].join(' ') );
              },
              _toggle_spinner = function( visible ) {
                    if ( visible ) {
                          $('.czr-scope-switcher').find('.spinner').fadeIn();
                    } else {
                          $('.czr-scope-switcher').find('.spinner').fadeOut();
                    }
              };

          //render / update the title
          self.skopeWrapperEmbedded
                .then( function() {
                      if ( ! $('.czr-scope-switcher').find('.czr-current-skope-title').length ) {
                            $('.czr-scope-switcher').prepend(
                                  $( '<h2/>', {
                                        class : 'czr-current-skope-title',
                                        html : [
                                              '<span class="czr-skope-title">',
                                              '<span class="spinner">',
                                              _buildTitleHtml(),
                                              '</span>',
                                              '</span>'
                                        ].join('')
                                  })
                            );
                      } else {
                            $.when( $('.czr-scope-switcher').find('.czr-skope-title').fadeOut(200) ).done( function() {
                                  $(this)
                                        .html( _buildTitleHtml() )
                                        .fadeIn(200);
                            });
                      }

                      if ( _.isUndefined( api.state( 'switching-skope' ).isBound ) ) {
                            api.state('switching-skope').bind( _toggle_spinner );
                            api.state( 'switching-skope' ).isBound = true;
                      }
          });
    }//_writeCurrentSkopeTitle
});//$.extend
})( wp.customize , jQuery, _ );