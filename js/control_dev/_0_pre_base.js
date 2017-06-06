var czr_debug = {
      log: function(o) {debug.queue.push(['log', arguments, debug.stack.slice(0)]); if (window.console && typeof window.console.log == 'function') {window.console.log(o);}},
      error: function(o) {debug.queue.push(['error', arguments, debug.stack.slice(0)]); if (window.console && typeof window.console.error == 'function') {window.console.error(o);}},
      queue: [],
      stack: []
};

//var api = api || wp.customize, $ = $ || jQuery;
( function ( api, $, _ ) {
      //@return [] for console method
      //@bgCol @textCol are hex colors
      //@arguments : the original console arguments
      var _prettyPrintLog = function( args ) {
            var _defaults = {
                  bgCol : '#5ed1f5',
                  textCol : '#000',
                  consoleArguments : []
            };
            args = _.extend( _defaults, args );

            var _toArr = Array.from( args.consoleArguments ),
                _truncate = function( string ){
                      if ( ! _.isString( string ) )
                        return '';
                      return string.length > 150 ? string.substr( 0, 149 ) : string;
                };

            //if the array to print is not composed exclusively of strings, then let's stringify it
            //else join(' ')
            if ( ! _.isEmpty( _.filter( _toArr, function( it ) { return ! _.isString( it ); } ) ) ) {
                  _toArr =  JSON.stringify( _toArr.join(' ') );
            } else {
                  _toArr = _toArr.join(' ');
            }
            return [
                  '%c ' + _truncate( _toArr ),
                  [ 'background:' + args.bgCol, 'color:' + args.textCol, 'display: block;' ].join(';')
            ];
      };
      //Dev mode aware and IE compatible api.consoleLog()
      api.consoleLog = function() {
            if ( ! serverControlParams.isDevMode )
              return;
            //fix for IE, because console is only defined when in F12 debugging mode in IE
            if ( ( _.isUndefined( console ) && typeof window.console.log != 'function' ) )
              return;
            console.log.apply( console, _prettyPrintLog( { consoleArguments : arguments } ) );
      };

      api.errorLog = function() {
            //fix for IE, because console is only defined when in F12 debugging mode in IE
            if ( ( _.isUndefined( console ) && typeof window.console.log != 'function' ) )
              return;

            console.log.apply( console, _prettyPrintLog( { bgCol : '#ffd5a0', textCol : '#000', consoleArguments : arguments } ) );
      };

      api.czr_isSkopOn = function() {
            return serverControlParams.isSkopOn && _.has( api, 'czr_skopeBase' );
      };

      api.czr_isChangeSetOn = function() {
            return serverControlParams.isChangeSetOn && true === true;//&& true === true is just there to hackily cast the returned value as boolean.
      };



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
                  _sec.expanded.bind( function( expanded ) { _storeCurrentSection( expanded, _sec.id ); } );
            });
            api.section.bind( 'add', function( section_instance ) {
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

      //SET THE ACTIVE STATE OF THE THEMES SECTION BASED ON WHAT THE SERVER SENT
      api.bind('ready', function() {
            var _do = function() {
                  api.section('themes').active.bind( function( active ) {
                        if ( ! _.has( serverControlParams, 'isThemeSwitchOn' ) || ! _.isEmpty( serverControlParams.isThemeSwitchOn ) )
                          return;
                        api.section('themes').active( serverControlParams.isThemeSwitchOn );
                        //reset the callbacks
                        api.section('themes').active.callbacks = $.Callbacks();
                  });
            };
            if ( api.section.has( 'themes') )
                _do();
            else
                api.section.when( 'themes', function( _s ) {
                      _do();
                });
      });


      /*****************************************************************************
      * FIRE SKOPE ON READY
      *****************************************************************************/
      //this promise will be resolved when
      //1) the initial skopes collection has been populated
      //2) the initial skope has been switched to
      api.czr_skopeReady = $.Deferred();
      api.bind( 'ready' , function() {
            if ( serverControlParams.isSkopOn ) {
                  api.czr_isLoadingSkope  = new api.Value( false );
                  api.czr_isLoadingSkope.bind( function( loading ) {
                        toggleSkopeLoadPane( loading );
                  });
                  api.czr_skopeBase   = new api.CZR_skopeBase();
                  api.czr_skopeSave   = new api.CZR_skopeSave();
                  api.czr_skopeReset  = new api.CZR_skopeReset();

                  api.trigger('czr-skope-started');

                  //@return void()
                  //This top note will be rendered 40s and self closed if not closed before by the user
                  var _toggleTopFailureNote = function() {
                        api.czr_skopeBase.toggleTopNote( true, {
                              title : serverControlParams.i18n.skope['There was a problem when trying to load the customizer.'],
                              message : [
                                    serverControlParams.i18n.skope['Please refer to'],
                                    '<a href="http://docs.presscustomizr.com/article/285-there-was-a-problem-when-trying-to-load-the-customizer" target="_blank">',
                                    serverControlParams.i18n.skope['this documentation page'],
                                    '</a>',
                                    serverControlParams.i18n.skope['to understand how to fix the problem.']
                              ].join(' '),
                              selfCloseAfter : 40000
                        });
                  };


                  api.czr_skopeReady
                        .done( function() {
                              api.trigger('czr-skope-ready');
                        })
                        .fail( function( error ) {
                              api.errorLog( 'Skope could not be instantiated : ' + error );
                              //This top note will be rendered 40s and self closed if not closed before by the user
                              _toggleTopFailureNote();
                              serverControlParams.isSkopOn = false;
                        })
                        .always( function() {
                              api.czr_isLoadingSkope( false );
                        });

                  //If skope was properly instantiated but there's another problem occuring after, display a self closing top notification after 30 s
                  if ( 'rejected' != api.czr_skopeReady.state() ) {
                        //Make sure the loading icon panel is destroyed after a moment
                        //Typically if there was a problem in the WP js API and the skope could not be initialized
                        //if the skopeReady state is still pending after 40 seconds, there's obviously a problem
                        setTimeout( function() {
                            if ( 'pending' == api.czr_skopeReady.state() )  {
                                  //This top note will be rendered 40s and self closed if not closed before by the user
                                  _toggleTopFailureNote();

                                  api.czr_isLoadingSkope( false );
                            }
                        }, 40000);
                  }
            }

            //let's set a lower autosave interval ( default is 60000 ms )
            if ( serverControlParams.isChangeSetOn ) {
                  api.settings.timeouts.changesetAutoSave = 10000;
            }
      } );

      //INCLUDE THE REVISION COUNT IF WP < 4.7
      if ( ! _.has( api, '_latestRevision') ) {
            /**
             * Current change count.
             */
            api._latestRevision = 0;

            /**
             * Latest revisions associated with the updated setting.
             */
            api._latestSettingRevisions = {};

            /*
             * Keep track of the revision associated with each updated setting so that
             * requestChangesetUpdate knows which dirty settings to include. Also, once
             * ready is triggered and all initial settings have been added, increment
             * revision for each newly-created initially-dirty setting so that it will
             * also be included in changeset update requests.
             */
            api.bind( 'change', function incrementChangedSettingRevision( setting ) {
                  api._latestRevision += 1;
                  api._latestSettingRevisions[ setting.id ] = api._latestRevision;
            } );
            api.bind( 'ready', function() {
                  api.bind( 'add', function incrementCreatedSettingRevision( setting ) {
                        if ( setting._dirty ) {
                              api._latestRevision += 1;
                              api._latestSettingRevisions[ setting.id ] = api._latestRevision;
                        }
                  } );
            } );
      }

      //@fired before skopeReady
      var toggleSkopeLoadPane = function( loading ) {
            loading = _.isUndefined( loading ) ? true : loading;
            var self = this, $skopeLoadingPanel,
                _render = function() {
                      var dfd = $.Deferred();
                      try {
                            _tmpl =  wp.template( 'czr-skope-pane' )({ is_skope_loading : true });
                      } catch( er ) {
                            api.errorLog( 'In toggleSkopeLoadPane : error when parsing the the reset skope template : ' + er );
                            dfd.resolve( false );
                      }
                      $.when( $('#customize-preview').after( $( _tmpl ) ) )
                            .always( function() {
                                  dfd.resolve( $( '#czr-skope-pane' ) );
                            });

                      return dfd.promise();
                },
                _destroy = function() {
                      _.delay( function() {
                            $.when( $('body').removeClass('czr-skope-pane-open') ).done( function() {
                                  _.delay( function() {
                                        $.when( $('body').removeClass('czr-skop-loading') ).done( function() {
                                              if ( false !== $( '#czr-skope-pane' ).length ) {
                                                    setTimeout( function() {
                                                          $( '#czr-skope-pane' ).remove();
                                                    }, 400 );
                                              }
                                        });
                                  }, 200);
                            });
                      }, 50);
                };

            //display load pane if skope is not yet ready and loading is true
            if ( 'pending' == api.czr_skopeReady.state() && loading ) {
                  $('body').addClass('czr-skop-loading');
                  _render()
                        .done( function( $_el ) {
                              $skopeLoadingPanel = $_el;
                        })
                        .then( function() {
                              if ( ! $skopeLoadingPanel.length )
                                return;

                              _.delay( function() {
                                    //set height
                                    var _height = $('#customize-preview').height();
                                    $skopeLoadingPanel.css( 'line-height', _height +'px' ).css( 'height', _height + 'px' );
                                    //display
                                    $('body').addClass('czr-skope-pane-open');
                              }, 50 );
                        });
            }

            api.czr_skopeReady.done( function() {
                  _destroy();
            });
            //if a destroy is requested, typically when the loading delay exceeds 15 seconds
            if ( ! loading ) {
                  _destroy();
            }
      };//toggleSkopeLoadPane


      /*****************************************************************************
      * REACT TO PREVIEW DEVICE SWITCH => send device to preview
      *****************************************************************************/
      api.bind( 'ready' , function() {
          if ( api.previewedDevice ) {
                api.previewedDevice.bind( function( device ) {
                      api.previewer.send( 'previewed-device', device );
                });
          }
      });

      /*****************************************************************************
      * ADD PRO BEFORE SPECIFIC SECTIONS AND PANELS
      *****************************************************************************/
      if ( serverControlParams.isPro ) {
            _.each( [ 'tc_font_customizer_settings', 'header_image_sec', 'content_blog_sec', 'static_front_page', 'content_single_sec' ], function( _secId ) {
                  _.delay( function() {
                      api.section.when( _secId, function( _sec_ ) {
                            if ( 1 >= _sec_.headContainer.length ) {
                                _sec_.headContainer.find('.accordion-section-title').prepend( '<span class="pro-title-block">Pro</span>' );
                            }
                      });
                  }, 1000 );
            });
            _.each( ['hu-header-panel', 'hu-content-panel' ], function( _secId ) {
                  api.panel.when( _secId, function( _sec_ ) {
                        if ( 1 >= _sec_.headContainer.length ) {
                            _sec_.headContainer.find('.accordion-section-title').prepend( '<span class="pro-title-block">Pro</span>' );
                        }
                  });
            });
      }


      /*****************************************************************************
      * ADD PRO BEFORE SPECIFIC SECTIONS AND PANELS
      *****************************************************************************/
      if ( ! serverControlParams.isPro && _.isFunction( api.Section ) ) {
            proSectionConstructor = api.Section.extend( {
                  active : true,
                  // No events for this type of section.
                  attachEvents: function () {},
                  // Always make the section active.
                  isContextuallyActive: function () {
                    return this.active();
                  },
                  _toggleActive: function(){ return true; },

            } );

            $.extend( api.sectionConstructor, {
                  'czr-customize-section-pro' : proSectionConstructor
            });
      }
})( wp.customize , jQuery, _);