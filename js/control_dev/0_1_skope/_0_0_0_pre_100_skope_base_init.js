

  //WHAT IS A SKOPE ?
  //A skope is an object describing a set of options for a given customization context
  //It is constructed by the czr_skopeModel constructor
  //it has a model with the following properties
  // - a name : 'global', 'all_posts'
  // - a corresponding database option name
  // - a database option type (dyn_type)
  // - a customization status : active, inactive. Are we currently customizing this skope ?
  // - a priority status that can be forced
  // - an applied status => is this skope the one that will be applied on front end in the current context?
  //  => this status depends on :
  //      1) a default priority local (post id ) > global specific (all posts) > global (default options)
  //      2) a user decision : a priority can be forced. For example who is the winner when two categories have been customized ?
  // - a dirtyness status : has this skope been customized ?
  // - a set of values, each one having a dirtyness state => the  : { optname#2 : { value : ..., _dirty : bool }, optname#2 : {...}, ...  }
  //
  // It is rendered with a view which includes DOM listeners.
  // Users can :
  //  - customize each skope separately,
  //  - force a priority
  //  - reset a skope set of option
  //  - copy the values of one skope to another
  //
  //  What is the default skope ?
  //  - 'global' when accessing the customizer from appearance > customize
  //  - 'local' when customizing from the front end, or an edit screen : post (post, cpt, page, attachment), tax term, user
  //
  //  What are the options eligibile for the skope customization ?
  //  - the skope customization can be applied to all theme settings 'hu_theme_options'. The option not eligible have been flagged 'no-skope' when registered server side.
  //  - the WP built-in settings like blogname, site-icon,... are also eligible
  //  - all other settings like menu, widgets, sidebars are excluded for the moment.
  //
  //  On init, the default skope is set as active.
  //  if the default skope is not 'global', then the switch to the relevant skope is triggered and the eligible settings values are updated "silently"
  //  the dirties are stored in each skope models when the user customize
  //
  //
  //  On skope switch,
  //  1) the values of the dirty values of the current skope are stored in the model
  //  2) the values of the new skope are fetched from the db if they have not been yet.
  //  3) all eligible settings are updated with the new values.
  //  4) if the new skope has no dirty value yet, the saved state is reset.
  //
  //
  //
  //
  //
  // WHAT IS THE SKOPE PRIORITY CONCEPT ?
  // Since a given option can have its value set differently for each skope level, a priority must be defined, in order to know what is the value to use.
  //
  //  => The skope priority defines which option value will be used if this option has been customized in several skopes.
  //
  // There are 3 main levels of skopes :
  // 1) GLOBAL : the options applied to the entire website. Those are saved in the regular (the old) theme options
  // 2) SPECIAL GROUP : those groups are dynamically set, depending on how a user creates a post or a page
  //      all posts from a specific author,
  //      all posts tagged with a specific tag,
  //      all posts tagged with a specific category,
  //      all pages using a specific template
  // 3) GROUP : the options applied to a group of contexts. Those are saved as long life transients
  //      all pages,
  //      all posts,
  //      all tags,
  //      all categories,
  //      all authors,
  // 4) LOCAL : the options applied to a specific context :
  //      a page,
  //      a post (or a CPT),
  //      an attachment,
  //      a tag archive page,
  //      a category archive page,
  //      an author archive page,
  //      the home page,
  //      the 404 page,
  //      the search results page,
  // Note: except for home, 404 and search which are saved as transients, the other local skopes are saved as metas : post metas, term metas, user metas
  //
  // Priorities without the special group (tag, cat, author):
  //    - For a post, page or term : LOCAL (this post id) > GROUP (all posts)  > GLOBAL (entire website options)
  //    - For home, 404, search : LOCAL > GLOBAL. There's no GROUP in this case.
  //    - for a term archive (tag, cat, custom tax) : LOCAL (the term id) > GROUP ( all terms of this type ) > GLOBAL
  //
  // Priorities with the special groups : this is relevant for post and pages only.
  // Let's take a post example.
  // A user can decide to define a set of option (a skope) for all posts tagged with a specific tag.
  // In this case the priority is : LOCAL > SPECIAL GROUP (the "post tagged with {tag}") > GROUP > GLOBAL
  // CONFLICT CASE : If a given post has several terms, and if more than one term have a customized skope.
  //  => since no priority can be defined between two terms, the priority is back to the default : LOCAL > GROUP > GLOBAL
  // How to fix a conflict case ?
  // It is possible to force a "winner" within the special groups. When editing a skope, the user can check an option (! => force this skope when relevant )
  // => if there's a forced winner the priority becomes : LOCAL > FORCED SPECIAL GROUP > GROUP > GLOBAL
  // In the customizer, only one special group winner can be set at a time.
  // If different winners have been set in separate customization sessions, and that the user add several winners term in the post edit screen, it might happen that
  // a the customizer ends up to have several special group winners. In this case, a conflict notice is displayed in the skope dialog box, explaining how to resolve this
  // winner conflict. As long as the winner conflict is unresolved, the priority falls back to : LOCAL > GROUP > GLOBAL.
  //
  //
  //
  //
  //
  //
  // WHAT IS THE SKOPE INHERITANCE CONCEPT ?
  // In the customizer, all skopes are partially customized => For example, a page can only have specific layout options set
  // The question to adress is then : What about all the un-customized options of this skope? Which value should be applied ?
  //
  // The skope inheritance is the complement of the skope priority.
  // It addresses the problem of which values should be used for un-customized options in a given skope.
  //
  // Taking the same page example, if the "skin" option has not been set locally, then it checks the lower skope priority level.
  // In this case, the previous level is "All Pages".
  // If nothing has been set in the "All Pages", we'll go to the previous one : "Global."
  //
  // In the customizer, this skope inheritance has to be reflected so that user can immediately understand which option is applied to which skope.
  // For a given skope, all un-customized settings will inherit their value from the lower priority levels, down to GLOBAL.
  //
  //
  //
  // HOW DOES THIS WORK ?
  // CZR_skopeBase listens to skope collection changes
  // 1) instantiate new models (CZR_skope), remove old ones and their view
  // 2) sets each skope models active skope state changes


  // CZR_skope
  // 1) instantiate, the skope view (CZR_skopeView)
  // 2) listens to the active state
  //   => store dirtyness on switch
  //   => fetch the db values, build the full set of values ( db + dirties + default) and update the settings

  // CZR_skopeView
  // 1) renders the view
  // 2) listens to model active state
  //   => change the view display elements
  // 3) listen to DOM interactions and set skope values : state, priority

  // @todo in the view, return the $() element to store the view.container




/*****************************************************************************
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
(function ( api, $, _ ) {
      $.extend( CZRSkopeBaseMths, {

          globalSettingVal : {},//will store the global setting val. Populated on init.

          initialize: function() {
                var self = this;
                ///////////////////// DEFINITIONS /////////////////////
                self.skope_colors = {
                      global : 'rgb(255, 255, 255)',
                      special_group : 'rgba(173, 213, 247, 0.55)',
                      group  : 'rgba(173, 213, 247, 0.55)',
                      local  : 'rgba(78, 122, 199, 0.35)'
                };
                //Deferred used to make sure the overridden api.previewer.query method has been taken into account
                api.czr_isPreviewerSkopeAware   = $.Deferred();
                //Store the state of the first skope collection state
                api.czr_initialSkopeCollectionPopulated = $.Deferred();
                //store the embed state
                self.skopeWrapperEmbedded       = $.Deferred();

                //the skope instance constructor
                api.czr_skope                   = new api.Values();

                //the czr_skopeCollection stores all skopes instantiated by the user
                //this collection is not updated directly
                //=> it's updated on skope() instance change
                api.czr_skopeCollection         = new api.Value([]);//all available skope, including the current skopes
                //the current skopes collection get updated each time the 'czr-skopes-synced' event is triggered on the api by the preview
                api.czr_currentSkopesCollection = new api.Value([]);


                //the currently active skope
                api.czr_activeSkopeId           = new api.Value();
                //Store the global dirtyness state of the API
                api.czr_dirtyness               = new api.Value( false );
                //store the resetting state
                api.czr_isResettingSkope        = new api.Value( false );

                //Add new state to the api
                api.state.create('switching-skope')( false );

                ///////////////////// SKOPIFY THE API AND THE PANEL /////////////////////
                //REACT TO API DIRTYNESS
                api.czr_dirtyness.callbacks.add( function() { return self.apiDirtynessReact.apply(self, arguments ); } );

                //LOADING ICON DURING INITIAL SKOPE SETUP
                //this api.Value() and its callback are declared in pre_base
                api.czr_isLoadingSkope( true );

                //LISTEN TO EACH API SETTING CHANGES
                // => POPULATE THE DIRTYNESS OF THE CURRENTLY ACTIVE SKOPE
                self.bindAPISettings();

                //LISTEN TO THE API STATES => SET SAVE BUTTON STATE
                //=> this value is set on control and skope reset
                //+ set by wp
                api.state.bind( 'change', function() {
                      self.setSaveButtonStates();
                });

                //EMBED THE SKOPE WRAPPER
                //=> WAIT FOR SKOPE TO BE READY api.czr_skopeReady.state == 'resolved'
                api.czr_skopeReady.then( function() {
                      if ( 'pending' == self.skopeWrapperEmbedded.state() ) {
                            $.when( self.embedSkopeWrapper() ).done( function() {
                                  self.skopeWrapperEmbedded.resolve();
                            });
                      }
                });


                ///////////////////// SKOPE COLLECTIONS SYNCHRONISATION AND LISTNENERS /////////////////////
                //LISTEN TO SKOPE SYNC => UPDATE SKOPE COLLECTION ON START AND ON EACH REFRESH
                //Will make sure server DB values are always synchronized with the instantiated skopes
                //the sent data look like :
                //{
                //  czr_skopes : _wpCustomizeSettings.czr_skopes || [],
                //  isChangesetDirty : boolean
                // }
                //
                //Bail if skope has not been properly instantiated 'rejected' == api.czr_skopeReady.state()
                api.previewer.bind( 'czr-skopes-synced', function( data ) {
                      if ( ! serverControlParams.isSkopOn || 'rejected' == api.czr_skopeReady.state() )
                        return;
                      //api.consoleLog('czr-skopes-ready DATA', data );
                      var preview = this,
                          previousSkopeCollection = api.czr_currentSkopesCollection();
                      //initialize skopes with the server sent data
                      if ( ! _.has( data, 'czr_skopes') ) {
                            api.errorLog( "On 'czr-skopes-synced' : missing skopes in the server data" );
                            return;
                      }

                      //1) Updated the collection with normalized skopes  => prepareSkopeForAPI + api.czr_currentSkopesCollection( collection )
                      //2) When the api.czr_currentSkopesCollection() Value is set => instantiates the missing skope
                      //3) Set the skope layout view when the skope embedded promise is resolved
                      try {
                            api.czr_skopeBase.updateSkopeCollection( data.czr_skopes , preview.channel() );
                      } catch ( er ) {
                            api.czr_skopeReady.reject( er );
                            return;
                      }

                      //Always wait for the initial collection to be populated
                      api.czr_initialSkopeCollectionPopulated.then( function() {
                            var refreshActiveSkope = _.isUndefined( _.findWhere( api.czr_currentSkopesCollection(), {id : api.czr_activeSkopeId() } ) );
                            api.czr_skopeBase.reactWhenSkopeSyncedDone( data ).done( function() {
                                  //if the current active skope has been removed from the current skopes collection
                                  //=> set relevant scope as active. Falls back on 'global'
                                  if ( refreshActiveSkope ) {
                                        try {
                                              api.czr_activeSkopeId( self.getActiveSkopeId() )
                                                    .done( function() {
                                                          if ( 'resolved' != api.czr_skopeReady.state() ) {
                                                                api.czr_skopeReady.resolve( self.getActiveSkopeId() );
                                                          }
                                                          //write the current skope title
                                                          self._writeCurrentSkopeTitle();
                                                    })
                                                    .fail( function() {
                                                          throw new Error( 'Error when trying to set the active skope after skope synced.' );
                                                    });
                                        } catch ( er ) {
                                              api.errorLog( 'In reactWhenSkopeSyncedDone => api.czr_activeSkopeId() : ' + er );
                                        }
                                  } else if ( ! _.isEmpty( previousSkopeCollection ) ) { //Rewrite the title when the local skope has changed
                                        var _prevLoc = _.findWhere( previousSkopeCollection , { skope : 'local' } ).opt_name,
                                            _newLoc  =_.findWhere( data.czr_skopes, { skope : 'local' } ).opt_name;

                                        if ( _newLoc !== _prevLoc && 'resolved' == api.czr_skopeReady.state() ) {
                                              //write the current skope title
                                              self._writeCurrentSkopeTitle();
                                        }
                                  }
                            });
                      });
                });


                //CURRENT SKOPE COLLECTION LISTENER
                //The skope collection is set on 'czr-skopes-synced' triggered by the preview
                //setup the callbacks of the skope collection update
                //on init and on preview change : the collection of skopes is populated with new skopes
                //=> instanciate the relevant skope object + render them
                api.czr_currentSkopesCollection.bind( function( to, from ) {
                      return self.currentSkopesCollectionReact( to, from );
                }, { deferred : true });


                //WHEN THE INITIAL SKOPE COLLECTION HAS BEEN POPULATED ( in currentSkopesCollectionReact )
                //LET'S BIND CALLBACKS TO ACTIVE SKOPE AND ACTIVE SECTION
                api.czr_initialSkopeCollectionPopulated.done( function() {
                      //LISTEN AND REACT TO ACTIVE SKOPE UPDATE
                      //api.czr_activeSkopeId.callbacks.add( function() { return self.activeSkopeReact.apply(self, arguments ); } );
                      api.czr_activeSkopeId.bind( function( to, from ) {
                              //Always close the mod option panel if exists
                              if ( _.has( api, 'czr_ModOptVisible') ) {
                                    api.czr_ModOptVisible( false );
                              }
                              return self.activeSkopeReact( to, from ).then( function( _updatedSetIds ) {
                                    api.trigger( 'skope-switched-done',
                                          {
                                                current_skope_id    : to,
                                                previous_skope_id   : from,
                                                updated_setting_ids : _updatedSetIds || []
                                          }
                                    );
                              });
                      }, { deferred : true } );

                      //REACT TO EXPANDED ACTIVE SECTION
                      //=> silently update all eligible controls of this sektion with the current skope values
                      api.czr_activeSectionId.callbacks.add( function() { return self.activeSectionReact.apply(self, arguments ); } );

                      //REACT TO EXPANDED ACTIVE PANEL
                      //=> silently update all eligible controls of this sektion with the current skope values
                      api.czr_activePanelId.callbacks.add( function() { return self.activePanelReact.apply(self, arguments ); } );

                      //GLOBAL SKOPE COLLECTION LISTENER
                      //api.czr_skopeCollection.callbacks.add( function() { return self.globalSkopeCollectionReact.apply(self, arguments ); } );
                });


                //////////////// LISTEN TO SKOPE SWITCH EVENT //////////////////
                //1) reset visibilities
                //2) update control skope notices
                //@args =
                //{
                //  current_skope_id : string
                //  previous_skope_id : string
                //  updated_setting_ids : [] //<= can be empty if no section was expanded
                //}
                api.bind( 'skope-switched-done', function( args ) {
                      args = _.extend(
                            {
                                  current_skope_id : '',
                                  previous_skope_id : '',
                                  updated_setting_ids : []
                            },
                            args
                      );
                      return self.skopeSwitchedDoneReact( args );
                });


                ///////////////////// LISTEN TO THE SERVER /////////////////////
                //SERVER NOTIFICATION SETUP
                api.czr_serverNotification   = new api.Value( {status : 'success', message : '', expanded : true} );
                api.czr_serverNotification.bind( function( to, from ) {
                        self.toggleServerNotice( to );
                });


                ///////////////////// TOP NOTE BLOCK /////////////////////
                api.czr_topNoteVisible = new api.Value( false );
                api.czr_skopeReady.then( function() {
                      api.czr_topNoteVisible.bind( function( visible ) {
                              var noteParams = {},
                                  _defaultParams = {
                                        title : '',
                                        message : '',
                                        actions : '',
                                        selfCloseAfter : 20000
                                  };
                              //noteParams is an object :
                              //{
                              // title : '',
                              // message : '',
                              // actions : fn(),
                              // selfCloseAfter : 20000 in ms
                              //}
                              noteParams = $.extend( _defaultParams , serverControlParams.topNoteParams );

                              //SPECIFIC AJAX ACTION FOR THE WELCOME NOTE
                              noteParams.actions = function() {
                                    var _query = $.extend(
                                          api.previewer.query(),
                                          { nonce:  api.previewer.nonce.save }
                                    );
                                    wp.ajax.post( 'czr_dismiss_top_note' , _query )
                                          .always( function () {})
                                          .fail( function ( response ) { api.consoleLog( 'czr_dismiss_top_note failed', _query, response ); })
                                          .done( function( response ) {});
                              };

                              self.toggleTopNote( visible, noteParams );
                      });

                      //Toggle the top note on initialization
                      _.delay( function() {
                            api.czr_topNoteVisible( ! _.isEmpty( serverControlParams.isTopNoteOn ) || 1 == serverControlParams.isTopNoteOn );
                      }, 2000 );
                });


                ///////////////////// SKOPE SWITCHER EVENT MAP /////////////////
                self.scopeSwitcherEventMap = [
                      //skope reset : do reset
                      {
                            trigger   : 'click keydown',
                            selector  : '.czr-dismiss-notification',
                            name      : 'dismiss-notification',
                            actions   : function() {
                                  api.czr_serverNotification( { expanded : false } );
                            }
                      },
                      //toggle title notice
                      {
                            trigger   : 'click keydown',
                            selector  : '.czr-toggle-title-notice',
                            name      : 'toggle-title-notice',
                            actions   : function( params ) {
                                  if ( _.isUndefined( self.skopeTitleNoticeVisible ) ) {
                                        self.skopeTitleNoticeVisible = new api.Value( false );
                                        self.skopeTitleNoticeVisible.bind( function( to ) {
                                              params.dom_el.find( '.czr-skope-title')
                                                    .toggleClass( 'notice-visible', to );
                                        });
                                  }

                                  self.skopeTitleNoticeVisible( ! self.skopeTitleNoticeVisible() );
                            }
                      }
                ];

                //Setup DOM user actions when api.czr_skopeReady => self.skopeWrapperEmbedded are resolved
                self.skopeWrapperEmbedded.then( function() {
                      api.CZR_Helpers.setupDOMListeners( self.scopeSwitcherEventMap , { dom_el : $('.czr-scope-switcher') }, self );
                });


                ///////////////////// VARIOUS /////////////////////
                //DECLARE THE LIST OF CONTROL TYPES FOR WHICH THE VIEW IS REFRESHED ON CHANGE
                self.refreshedControls = [ 'czr_cropped_image'];// [ 'czr_cropped_image', 'czr_multi_module', 'czr_module' ];

                //WIDGETS AND SIDEBAR SPECIFIC TREATMENTS
                self.initWidgetSidebarSpecifics();

                //LISTEN TO GLOBAL DB OPTION CHANGES
                //When an option is reset on the global skope,
                //we need to update it in the initially sent _wpCustomizeSettings.settings
                //api.czr_globalDBoptions.callbacks.add( function() { return self.globalDBoptionsReact.apply(self, arguments ); } );


                ///////////////////// LISTEN TO PAINT EVENT /////////////////////
                //The paint event occurs :
                //1) on skope switch
                //2) on sektion expansion
                //3) on panel expansion
                api.bind( 'czr-paint', function( params ) {
                      api.czr_skopeReady.then( function() {
                            self.wash( params ).paint( params );
                      });
                });
          },//initialize


          /*****************************************************************************
          * EMBED WRAPPER
          *****************************************************************************/
          //fired in initialize
          //=> embed the wrapper for all skope boxes
          //=> add a specific class to the body czr-skop-on
          //=> Listen to skope switch in main title
          embedSkopeWrapper : function() {
                var self = this;
                $('#customize-header-actions').append( $('<div/>', {class:'czr-scope-switcher', html:'<div class="czr-skopes-wrapper"></div>'}) );
                $('body').addClass('czr-skop-on');
                var _eventMap = [
                    //skope reset : do reset
                    {
                          trigger   : 'click keydown',
                          selector  : '.czr-skope-switch',
                          name      : 'control_skope_switch',
                          actions   : function( params ) {
                                var _skopeIdToSwithTo = $( params.dom_event.currentTarget, params.dom_el ).attr('data-skope-id');
                                if ( ! _.isEmpty( _skopeIdToSwithTo ) && api.czr_skope.has( _skopeIdToSwithTo ) )
                                  api.czr_activeSkopeId( _skopeIdToSwithTo );
                          }
                    }
                ];
                api.CZR_Helpers.setupDOMListeners( _eventMap , { dom_el : $('.czr-scope-switcher') }, self );
          },


          /*****************************************************************************
          * API DIRTYNESS REACTIONS
          *****************************************************************************/
          //cb of api.czr_dirtyness()
          apiDirtynessReact : function( is_dirty ) {
                $('body').toggleClass('czr-api-dirty', is_dirty );
                api.state( 'saved')( ! is_dirty );
          },


          /*****************************************************************************
          * OVERRIDE SAVE BUTTON STATES : api.state.bind( 'change') callback
          *****************************************************************************/
          //@return void()
          setSaveButtonStates : function() {
                //the 'saving' state was introduced in 4.7
                //For prior versions, let's declare it and add its callback that we need in the api.previewer.save() method
                if ( ! api.state.has('saving') ) {
                      api.state.create('saving');
                      api.state('saving').bind( function( isSaving ) {
                            $( document.body ).toggleClass( 'saving', isSaving );
                      } );
                }
                var saveBtn   = $( '#save' ),
                    closeBtn  = $( '.customize-controls-close' ),
                    saved     = api.state( 'saved'),
                    saving    = api.state( 'saving'),
                    activated = api.state( 'activated' ),
                    changesetStatus = api.state.has('changesetStatus' ) ? api.state( 'changesetStatus' )() : 'auto-draft';

                if ( api.czr_dirtyness() || ! saved() ) {
                      saveBtn.val( api.l10n.save );
                      closeBtn.find( '.screen-reader-text' ).text( api.l10n.cancel );
                } else {
                      saveBtn.val( api.l10n.saved );
                      closeBtn.find( '.screen-reader-text' ).text( api.l10n.close );
                }
                var canSave = ! saving() && ( ! activated() || ! saved() ) && 'publish' !== changesetStatus;
                saveBtn.prop( 'disabled', ! canSave );
          },


          //cb of 'skope-switched-done' event => fired when the api.czr_activeSkopeId().done() <=> refresh is done()
          //1) set the ctrl dependencies in the currently active section
          //2) update ctrl skope notices in the currently active section + expand the ctrl notice if skope is not 'global'
          //3) adds a skope level class to the #customize-controls wrapper
          //@args =
          //{
          //  current_skope_id : string
          //  previous_skope_id : string
          //  updated_setting_ids : [] //<= can be empty if no section was expanded
          //}
          skopeSwitchedDoneReact : function( args ) {
                var self = this,
                    _doWhenSkopeReady = function() {
                          //CURRENTLY EXPANDED SECTION : SET CTRL DEPENDENCIES WHEN POSSIBLE
                          api.czr_CrtlDependenciesReady.then( function() {
                            if ( ! _.isUndefined( api.czr_activeSectionId() ) && ! _.isEmpty( api.czr_activeSectionId() ) ) {
                                  try {
                                        api.czr_ctrlDependencies.setServiDependencies( api.czr_activeSectionId(), null, true );//target sec id, source sec id, refresh
                                  } catch( er ) {
                                        api.errorLog( 'On skope-switched-done : ' + er );
                                  }
                                }
                          });

                          //CURRENTLY EXPANDED SECTION : UPDATE CURRENT SKOPE CONTROL NOTICES AND MAYBE EXPAND THE NOTICE
                          self.updateCtrlSkpNot( api.CZR_Helpers.getSectionControlIds() );

                          //ADD A SKOPE LEVEL CSS CLASS TO THE #customize-controls wrapper
                          if ( api.czr_skope.has( args.previous_skope_id ) ) {
                                $( '#customize-controls' ).removeClass( [ 'czr-', api.czr_skope( args.previous_skope_id )().skope, '-skope-level'].join('') );
                          }
                          if ( api.czr_skope.has( args.current_skope_id ) ) {
                                $( '#customize-controls' ).addClass( [ 'czr-', api.czr_skope( args.current_skope_id )().skope, '-skope-level'].join('') );
                          }

                          //CURRENTLY EXPANDED SECTION
                          //=> Display ctrl notice if skope is not global
                          //=> Hide the reset dialog
                          var _setupSectionControlDialogs = function() {
                                if ( _.isUndefined( api.czr_activeSectionId() ) || _.isEmpty( api.czr_activeSectionId() ) )
                                  return;
                                var ctrls = api.CZR_Helpers.getSectionControlIds( api.czr_activeSectionId()  );
                                _.each( ctrls, function( ctrlId ) {
                                      api.control.when( ctrlId, function() {
                                            var ctrl = api.control( ctrlId );
                                            if ( ! _.has( ctrl, 'czr_states' ) )
                                              return;

                                            ctrl.deferred.embedded.then( function() {
                                                  //Always display the notice when skope is not global
                                                  //=> let user understand where the setting value is coming from
                                                  ctrl.czr_states( 'noticeVisible' )( self.isCtrlNoticeVisible( ctrlId ) );
                                                  ctrl.czr_states( 'resetVisible' )( false );
                                            });
                                      });
                                });
                          };

                          //Setup control dialogs after a delay on skope switched.
                          //=> the delay is needed for controls that have been re-rendered.
                          _.delay( function() {
                                _setupSectionControlDialogs();
                          }, 500 );
                    };


                //api.consoleLog('SKOPE SWITCHED TO', args.current_skope_id, api.czr_activeSectionId() );
                //Skope is ready when :
                //1) the initial skopes collection has been populated
                //2) the initial skope has been switched to
                api.czr_skopeReady.then( function() {
                      _doWhenSkopeReady();
                });
          }





          //cb of api.czr_globalDBoptions.callbacks
          //update the _wpCustomizeSettings.settings if they have been updated by a reset of global skope, or a control reset of global skope
          //When an option is reset on the global skope, we need to set the new value to default in _wpCustomizeSettings.settings
          // globalDBoptionsReact : function( to, from ) {
          //       var self = this,
          //           resetted_opts = _.difference( from, to );

          //       //reset option case
          //       if ( ! _.isEmpty(resetted_opts) ) {
          //             api.consoleLog( 'HAS RESET OPTIONS', resetted_opts );
          //             //reset each reset setting to its default val
          //             _.each( resetted_opts, function( shortSetId ) {
          //                   var wpSetId = api.CZR_Helpers.build_setId( shortSetId );
          //                   if ( _.has( api.settings.settings, wpSetId) )
          //                     api.settings.settings[wpSetId].value = serverControlParams.defaultOptionsValues[shortSetId];
          //                   self.processSilentUpdates( { refresh : false } );//silently update with no refresh
          //             });
          //       }

          //       //make sure the hasDBValues is synchronized with the server
          //       api.czr_skope( self.getGlobalSkopeId() ).hasDBValues( ! _.isEmpty( to ) );//might trigger cb hasDBValuesReact()
          // }
      });//$.extend()
})( wp.customize , jQuery, _);