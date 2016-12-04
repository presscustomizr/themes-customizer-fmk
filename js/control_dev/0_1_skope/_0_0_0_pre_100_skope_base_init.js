

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
          //Deferred used to make sure the overriden api.previewer.query method has been taken into account
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
          api.state.create('switching-skope')(false);

          ///////////////////// SKOPIFY THE API AND THE PANEL /////////////////////
          //ON DOM READY : RENDER AND BIND HEADER BUTTONS : HOME, GENERAL RESET
          $( function($) {
                self.fireHeaderButtons();
          } );
          //REACT TO API DIRTYNESS
          api.czr_dirtyness.callbacks.add( function() { return self.apiDirtynessReact.apply(self, arguments ); } );

          //LISTEN TO EACH API SETTING CHANGES
          //=>POPULATE THE DIRTYNESS OF THE CURRENTLY ACTIVE SKOPE
          self.bindAPISettings();

          //LISTEN TO THE API STATES => SET SAVE BUTTON STATE
          //=> this value is set on control and skope reset
          //+ set by wp
          api.state.bind( 'change', function() {
                self.setSaveButtonStates();
          });

          //EMBED THE SKOPE WRAPPER
          if ( 'pending' == self.skopeWrapperEmbedded.state() ) {
                $.when( self.embedSkopeWrapper() ).done( function() {
                      self.skopeWrapperEmbedded.resolve();
                });
          }



          ///////////////////// SKOPE COLLECTIONS SYNCHRONISATION AND LISTNENERS /////////////////////
          //LISTEN TO SKOPE SYNC => UPDATE SKOPE COLLECTION ON START AND ON EACH REFRESH
          //the sent data look like :
          //{
          //  czr_skopes : _wpCustomizeSettings.czr_skopes || [],
          //  isChangesetDirty : boolean
          // }
          //
          api.previewer.bind( 'czr-skopes-synced', function( data ) {
                if ( ! serverControlParams.isSkopOn )
                  return;
                //api.consoleLog('czr-skopes-ready DATA', data );
                var preview = this;
                //initialize skopes with the server sent data
                if ( ! _.has( data, 'czr_skopes') ) {
                      throw new Error('Missing skopes in the server data');
                }
                api.czr_skopeBase.updateSkopeCollection( data.czr_skopes , preview.channel() );

                //always wait for the initial collection to be populated
                api.czr_initialSkopeCollectionPopulated.then( function() {
                      api.czr_skopeBase.reactWhenSkopeSyncedDone( data ).done( function() {
                            //if the current acive skope has been removed from the current skopes collection
                            //=> set relevant scope as active. Falls back on 'global'
                            if ( _.isUndefined( _.findWhere( api.czr_currentSkopesCollection(), {id : api.czr_activeSkopeId() } ) ) ) {
                                  api.czr_activeSkopeId( self.getActiveSkopeId() )
                                        .done( function() {
                                              api.consoleLog('INITIAL ACTIVE SKOPE SET : ' + arguments[1] + ' => ' + arguments[0] );
                                              if ( 'pending' == api.czr_skopeReady.state() ) {
                                                    api.czr_skopeReady.resolve( self.getActiveSkopeId() );
                                              }
                                        });
                            }
                      });
                });
          });


          //CURRENT SKOPE COLLECTION LISTENER
          //The skope collection is set on 'czr-skopes-synced' triggered by the preview
          //setup the callbacks of the skope collection update
          //on init and on preview change : the collection of skopes is populated with new skopes
          //=> instanciate the relevant skope object + render them
          api.czr_currentSkopesCollection.callbacks.add( function() { return self.currentSkopesCollectionReact.apply(self, arguments ); } );


          //WHEN THE INITIAL SKOPE COLLECTION HAS BEEN POPULATED ( in currentSkopesCollectionReact )
          //LET'S BIND CALLBACKS TO ACTIVE SKOPE AND ACTIVE SECTION
          api.czr_initialSkopeCollectionPopulated.done( function() {
                //REACT TO ACTIVE SKOPE UPDATE
                //api.czr_activeSkopeId.callbacks.add( function() { return self.activeSkopeReact.apply(self, arguments ); } );
                api.czr_activeSkopeId.bind( function( to, from ) {
                        return self.activeSkopeReact( to, from );
                        // var dfd = $.Deferred();
                        // self.activeSkopeReact( to, from )
                        //       .done( function() {
                        //             api.trigger( 'skope-switched', to );
                        //             dfd.resolve();
                        //       })
                        //       .fail( function() {
                        //             dfd.reject();
                        //             throw new Error( 'activeSkopeReact failed');
                        //       });
                        // return dfd.promise();
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



          //LISTEN TO SKOPE SWITCH EVENT :
          //1) reset visibilities
          //2) update control skope notices
          api.bind( 'skope-switched', function( skope_id ) {
                //api.consoleLog('SKOPE SWITCHED TO', skope_id, api.czr_activeSectionId() );
                //Skope is ready when :
                //1) the initial skopes collection has been populated
                //2) the initial skope has been switched to
                api.czr_skopeReady.then( function() {
                      api.czr_CrtlDependenciesReady.then( function() {
                            if ( ! _.isUndefined( api.czr_activeSectionId() ) && ! _.isEmpty( api.czr_activeSectionId() ) ) {
                                  //SET VISIBILITIES
                                  api.czr_ctrlDependencies.setServiDependencies( api.czr_activeSectionId() );
                            }
                      });
                      //UPDATE CURRENT SKOPE CONTROL NOTICES IN THE CURRENTLY EXPANDED SECTION
                      self.renderControlSkopeNotice( api.CZR_Helpers.getSectionControlIds() );
                });
          });



          ///////////////////// LISTEN TO THE SERVER /////////////////////
          //SERVER NOTIFICATION SETUP
          api.czr_serverNotification   = new api.Value({status : 'success', message : '', expanded : true} );
          api.czr_serverNotification.bind( function( to, from ) {
                  self.toggleServerNotice( to );
          });
          self.notificationsEventMap = [
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
          api.CZR_Helpers.setupDOMListeners( self.notificationsEventMap , { dom_el : $('.czr-scope-switcher') }, self );



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
                self.wash( params ).paint( params );
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
    * WORDPRESS API ACTIONS ON INIT
    *****************************************************************************/
    //fired in initialize
    //Listen to each api settings changes
    //1) update the current skope dirties with the user val
    //2) Refresh the controls reset state
    //can be fired when a setting is dynamically added. For example a widget.
    //In this case, the param SetId is not null
    bindAPISettings : function( requestedSetId ) {
          var self = this,
              _settingChangeReact = function( new_val, old_val, o ) {
                    //"this" is the setting instance
                    var setId = this.id,
                        skope_id;

                    if ( ! _.has( api, 'czr_activeSkopeId') || _.isUndefined( api.czr_activeSkopeId() ) ) {
                      api.consoleLog( 'The api.czr_activeSkopeId() is undefined in the api.previewer._new_refresh() method.');
                      //return;
                    }

                    //For skope eligible settings : Update the skope dirties with the new val of this setId
                    //=> not eligibile skope will update the global skope dirties
                    if ( api( setId )._dirty ) {
                          //api.consoleLog('ELIGIBLE SETTING HAS CHANGED', setId, old_val + ' => ' +  new_val, o );
                          skope_id = self.isSettingSkopeEligible( setId ) ? api.czr_activeSkopeId() : self.getGlobalSkopeId();
                          api.czr_skope( skope_id ).updateSkopeDirties( setId, new_val );
                    }

                    //collapse any expanded reset modifications
                    if ( _.has( api.control(setId), 'czr_states' ) ) {
                          api.control(setId).czr_states( 'resetVisible' )( false );
                    }

                    //Update the skope inheritance notice for the setting control
                    if ( self.isSettingSkopeEligible( setId ) ) {
                          self.renderControlSkopeNotice( setId );
                    }
              };//bindListener()

          //if a setting Id is requested
          if ( ! _.isUndefined( requestedSetId ) ) {
                api( requestedSetId ).bind( _settingChangeReact );
          }
          else {
                //parse the current eligible skope settings and write a setting val object
                api.each( function ( _setting ) {
                    _setting.bind( _settingChangeReact );
                });
          }

          //BIND SETTINGS ADDED LATER : Typical example : menus
          var _dynamicallyAddedSettingsReact = function( setting_instance ) {
                if ( setting_instance.callbacks.has( _settingChangeReact ) )
                  return;
                setting_instance.bind( _settingChangeReact );
          };

          if ( ! api.topics.change.has( _dynamicallyAddedSettingsReact ) ) {
                api.bind( 'change', _dynamicallyAddedSettingsReact );
          }
    },


    /*****************************************************************************
    * REACT ON SKOPE SYNCED
    *****************************************************************************/
    //Fired on 'czr-skopes-synced'
    //with param :
    //{
    //  czr_skopes : _wpCustomizeSettings.czr_skopes || [],
    //  isChangesetDirty : boolean,
    // }
    reactWhenSkopeSyncedDone : function( server_params ) {
          var self = this, dfd = $.Deferred();
          if ( ! _.has( server_params, 'czr_skopes' ) || _.isEmpty( server_params.czr_skopes ) ) {
                throw new Error( 'Missing skope data after refresh', server_params );
          }
          //API DIRTYNESS UPDATE
          if ( ! api.czr_dirtyness() ) {
                api.czr_dirtyness( _.isBoolean( server_params.isChangesetDirty ) ? server_params.isChangesetDirty : false );
          }

          var _sentSkopeCollection = server_params.czr_skopes;
          //CHANGESET UPDATE
          //always update the changesets of the sent skope collection after a refresh
          //match them with the opt_name, because they don't have an id when emitted from server
          _.each( api.czr_skopeCollection(), function( _skp ) {
                var _sent_skope = _.findWhere( _sentSkopeCollection, { opt_name : _skp.opt_name } );
                //do we have a match based on opt_name with the _sentSkopeCollection ?
                if ( _.isUndefined( _sent_skope ) )
                  return;
                //if so then let's update the skope model with the new db values
                var _changeset_candidate = _.isEmpty( _sent_skope.changeset || {} ) ? {} : _sent_skope.changeset,
                    _api_ready_chgset = {};

                //We only update the changeset with registered setting id
                _.each( _changeset_candidate, function( _val, _setId ) {
                      if ( ! api.has( _setId ) ) {
                            api.consoleLog( 'In reactWhenSkopeSyncedDone : attempting to update the changeset with a non registered setting : ' + _setId );
                      }
                      _api_ready_chgset[_setId] = _val;
                });

                //_new_changeset = $.extend( api.czr_skope( _skp.id ).changesetValues(), _sent_changeset );
                //=> updating the changeset will also trigger a skope dirtyValues() update
                api.czr_skope( _skp.id ).changesetValues( _api_ready_chgset );
          });

          //DB VALUES UPDATE
          //UPDATE EACH SKOPE MODEL WITH THE NEW DB VAL SENT BY THE SERVER
          //The sent skope have no id (because assigned in the api)
          //=> however we can match them with their unique opt_name property
          //then update the skope db values, including the global skope
          _.each( api.czr_skopeCollection(), function( _skp ) {
                var _sent_skope = _.findWhere( _sentSkopeCollection, { opt_name : _skp.opt_name } );
                //do we have a match based on opt_name with the _sentSkopeCollection ?
                if ( _.isUndefined( _sent_skope ) )
                  return;

                //if so then let's update the skope model with the new db values
                var _current_db_vals  = $.extend( true, {}, api.czr_skope( _skp.id ).dbValues() ),
                    _dbVals_candidate = $.extend( _current_db_vals , _sent_skope.db || {} ),
                    _api_ready_dbvals = {};

                //We only update the dbValues with registered setting id
                _.each( _dbVals_candidate, function( _val, _setId ) {
                      if ( ! api.has( _setId ) ) {
                            api.consoleLog( 'In reactWhenSkopeSyncedDone : attempting to update the db values with a non registered setting : ' + _setId );
                      }
                      _api_ready_dbvals[_setId] = _val;
                });


                api.czr_skope( _skp.id ).dbValues( _api_ready_dbvals );
          });
          //introduce a small delay to let the api values be fully updated
          //useful when attempting to refresh the control notices after a save action
          _.delay( function() {
              dfd.resolve();
          }, 500 );
          return dfd.promise();
    },


    /*****************************************************************************
    * REACT ON ACTIVE SECTION SETUP DONE
    *****************************************************************************/
    // fired on 'active-section-setup'
    // params looks like : { controls : controls, section_id : section_id }
    _maybeSetupAssignedMenuLocations : function( active_section ) {
          console.log('in _maybeSetupAssignedMenuLocations', active_section );
          if ( _.isUndefined( active_section ) || _.isEmpty( active_section ) || ! api.section.has( active_section.id ) ) {
                api.consoleLog( 'In _maybeSetupAssignedMenuLocations : no valid section_id provided.');
          }
          var self = this;
          //is this a menu section ? and does it have assigned locations ?
          if ( ! active_section.assignedLocations )
            return;
          console.log('in _maybeSetupAssignedMenuLocations, section.assignedLocations() ', active_section.assignedLocations() );

          //locations is an array of locations for a menu
          //=> we want to synchronize the reset button of this menu location in this section, with the one of the nav_menu_location setting
          var _assignedLocReact = function( locations ) {

          };
          if ( ! active_section.assignedLocations.callbacks.has( _assignedLocReact ) ) {
                active_section.assignedLocations.bind( _assignedLocReact );
          }
    },



    /*****************************************************************************
    * REACT TO ACTIVE SECTION EXPANSION
    *****************************************************************************/
    //cb of api.czr_activeSectionId()
    activeSectionReact : function( active_sec_id , previous_sec_id ) {
          console.log('ACTIVE SECTION REACT', active_sec_id );
          //PAINT
          api.trigger('czr-paint', { active_section_id : active_sec_id } );

          //bail here if we just went out of a section
          if ( _.isEmpty( active_sec_id ) )
            return;

          var self = this;

          //defer the callback execution when the first skope collection has been populated
          //=> otherwise it might be to early. For example in autofocus request cases.
          api.czr_initialSkopeCollectionPopulated.then( function() {
                api.section.when( active_sec_id , function( active_section ) {
                      active_section.deferred.embedded.then( function() {

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
                            api.trigger('active-section-setup', active_section );
                      });
                });
          });
    },


    /*****************************************************************************
    * REACT TO ACTIVE PANEL EXPANSION
    *****************************************************************************/
    //cb of api.czr_activeSectionId()
    activePanelReact : function( active_panel_id , previous_panel_id ) {
          api.czr_initialSkopeCollectionPopulated.then( function() {
                api.trigger('czr-paint', { active_panel_id : active_panel_id } );
          });
    },


    /*****************************************************************************
    * PAINT AND WASH
    *****************************************************************************/
    //fired on 'czr-paint'
    //params = {
    //  active_panel_id : '',
    //  active_section_id : '',
    //  is_skope_switch : false
    //}
    wash : function( params ) {
          var self = this,
              //@param element = { el : ${}, color : string }
              _do_wash = function( element ) {
                    if ( ! _.has( element, 'el') || ! element.el.length )
                      return;
                    $.when( element.el.removeClass('czr-painted') ).done( function() {
                          $(this).css( 'background', '' );
                    });
              };
          if ( api.czr_skopeBase.paintedElements ) {
                _.each( api.czr_skopeBase.paintedElements(), function( _el ) { _do_wash( _el ); } );
                api.czr_skopeBase.paintedElements( [] );
          }
          return this;
    },

    //fired on 'czr-paint'
    //params = {
    //  active_panel_id : '',
    //  active_section_id : '',
    //  is_skope_switch : false
    //}
    paint : function( params ) {
          var _color = 'inherit',
              defaults = {
                    active_panel_id : api.czr_activePanelId(),
                    active_section_id : api.czr_activeSectionId(),
                    is_skope_switch : false
              },
              _paint_candidates = [];
          params = $.extend( defaults, params );

          if ( ! _.isUndefined( api.czr_activeSkopeId() ) && api.czr_skope.has( api.czr_activeSkopeId() ) ) {
                  _color = api.czr_skope( api.czr_activeSkopeId() ).color;
          }

          //@param element = { el : ${}, color : string }
          var _do_paint = function( element ) {
                if ( ! _.has( element, 'el') || ! element.el.length )
                  return;
                //If is skope switch, add a css class to handle a smoother background color transition
                if ( params.is_skope_switch ) {
                      $.when( element.el.addClass('czr-painted') ).done( function() {
                            $(this).css( 'background', element.color || _color );
                      });
                } else {
                      element.el.css( 'background', element.color || _color );
                }

          };

          api.czr_skopeBase.paintedElements = api.czr_skopeBase.paintedElements || new api.Value( [] );

          //CASE 1 : NO ACTIVE PANEL, NO ACTIVE SECTION => WE ARE ON ROOT
          if ( _.isEmpty( params.active_panel_id ) && _.isEmpty( params.active_section_id ) ) {
                _paint_candidates.push( {
                      el : $( '#customize-info' ).find('.accordion-section-title').first()
                });
                api.panel.each( function( _panel ) {
                      // _panel.container.css('background', _color );
                      _paint_candidates.push( {
                            el : _panel.container.find( '.accordion-section-title').first()
                      });
                });
          }

          //CASE 2 : ACTIVE PANEL, NO ACTIVE SECTION => WE ARE IN A PANEL ROOT
          if ( ! _.isEmpty( params.active_panel_id ) && _.isEmpty( params.active_section_id ) ) {
                api.panel.when( params.active_panel_id , function( active_panel ) {
                      active_panel.deferred.embedded.then( function() {
                            //active_panel.container.css('background', _color );
                            _paint_candidates.push( {
                                  el : active_panel.container.find( '.accordion-section-title, .customize-panel-back' )
                            });
                      });
                });
          }

          //CASE 3 : ACTIVE SECTION
          if ( ! _.isEmpty( params.active_section_id ) ) {
                api.section.when( params.active_section_id , function( active_section ) {
                      active_section.deferred.embedded.then( function() {
                            _paint_candidates.push(
                                  {
                                        el : active_section.container.find( '.customize-section-title, .customize-section-back' ),
                                        color : 'inherit'
                                  },
                                  {
                                        el : active_section.container
                                  }
                            );
                      });
                });
          }

          //PROCESS PAINT AND POPULATE THE VALUE
          _.each( _paint_candidates, function( _el ) { _do_paint( _el ); } );
          api.czr_skopeBase.paintedElements( _paint_candidates );
          return this;
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
          var saveBtn   = $( '#save' ),
              closeBtn  = $( '.customize-controls-close' ),
              saved     = api.state( 'saved'),
              saving    = api.state( 'saving'),
              activated = api.state( 'activated' ),
              changesetStatus = api.state( 'changesetStatus' );

          if ( api.czr_dirtyness() || ! saved() ) {
                saveBtn.val( api.l10n.save );
                closeBtn.find( '.screen-reader-text' ).text( api.l10n.cancel );
          } else {
                saveBtn.val( api.l10n.saved );
                closeBtn.find( '.screen-reader-text' ).text( api.l10n.close );
          }
          var canSave = ! saving() && ( ! activated() || ! saved() ) && 'publish' !== changesetStatus();
          saveBtn.prop( 'disabled', ! canSave );
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