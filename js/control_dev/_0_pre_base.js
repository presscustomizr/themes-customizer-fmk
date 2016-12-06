var czr_debug = {
      log: function(o) {debug.queue.push(['log', arguments, debug.stack.slice(0)]); if (window.console && typeof window.console.log == 'function') {window.console.log(o);}},
      error: function(o) {debug.queue.push(['error', arguments, debug.stack.slice(0)]); if (window.console && typeof window.console.error == 'function') {window.console.error(o);}},
      queue: [],
      stack: []
};

var api = api || wp.customize, $ = $ || jQuery;
(function (api, $, _) {
      //Dev mode aware and IE compatible api.consoleLog()
      api.consoleLog = function() {
            //fix for IE, because console is only defined when in F12 debugging mode in IE
            if ( ( _.isUndefined( console ) && typeof window.console.log != 'function' ) || ! serverControlParams.isDevMode )
              return;
            console.log.apply( console, arguments );
      };

      api.czr_isSkopOn = function() {
            return serverControlParams.isSkopOn && _.has( api, 'czr_skopeBase' );
      };

      api.czr_isChangedSetOn = function() {
            return serverControlParams.isChangedSetOn && true === true;//&& true === true is just there to hackily cast the returned value as boolean.
      };

      /*****************************************************************************
      * CAPTURE PREVIEW INFORMATIONS ON REFRESH + REACT TO THEM
      *****************************************************************************/
      /* WP CONDITIONAL TAGS => stores and observes the WP conditional tags sent by the preview */
      api.czr_wp_conditionals = new api.Value();

      /* SIDEBAR INSIGHTS => stores and observes the sidebars and widgets settings sent by the preview */
      api.czr_widgetZoneSettings = new api.Value();//will store all widget zones data sent by preview as an observable object
      api.sidebar_insights = new api.Values();
      api.sidebar_insights.create('candidates');//will store the sidebar candidates on preview refresh
      api.sidebar_insights.create('actives');//will record the refreshed active list of active sidebars sent from the preview
      api.sidebar_insights.create('inactives');
      api.sidebar_insights.create('registered');
      api.sidebar_insights.create('available_locations');


      /*****************************************************************************
      * DEFINE SOME USEFUL OBSERVABLE VALUES
      *****************************************************************************/
      //PARTIAL REFRESHS => stores and observes the partials sent by the preview
      api.czr_partials = new api.Value();

      //STORE THE CURRENTLY ACTIVE SECTION AND PANELS IN AN OBSERVABLE VALUE
      //BIND EXISTING AND FUTURE SECTIONS AND PANELS
      api.czr_activeSectionId = new api.Value('');
      api.czr_activePanelId = new api.Value('');
      api.bind('ready', function() {
            if ( 'function' != typeof api.Section ) {
              throw new Error( 'Your current version of WordPress does not support the customizer sections needed for this theme. Please upgrade WordPress to the latest version.' );
            }
            var _bindSectionExpanded = function( expanded, section_id ) {
                  api.czr_activeSectionId( expanded ? section_id : '' );
            };
            api.section.each( function( _sec ) {
                  _sec.expanded.bind( function( expanded ) { _bindSectionExpanded( expanded, _sec.id ); } );
            });
            api.section.bind( 'add', function( section_instance ) {
                  section_instance.expanded.bind( function( expanded ) { _bindSectionExpanded( expanded, section_instance.id ); } );
            });

            var _bindPanelExpanded = function( expanded, panel_id ) {
                  api.czr_activePanelId( expanded ? panel_id : '' );
            };
            api.panel.each( function( _panel ) {
                  _panel.expanded.bind( function( expanded ) { _bindPanelExpanded( expanded, _panel.id ); } );
            });
            api.panel.bind( 'add', function( panel_instance ) {
                  panel_instance.expanded.bind( function( expanded ) { _bindPanelExpanded( expanded, panel_instance.id ); } );
            });

      });

      //SET THE ACTIVE STATE OF THE THEMES SECTION BASED ON WHAT THE SERVER SENT
      api.bind('ready', function() {
            var _do = function() {
                  api.section('themes').active.bind( function( active ) {
                        if ( ! _.has( serverControlParams, 'isThemeSwitchOn' ) || ! _.isEmpty( serverControlParams.isThemeSwitchOn ) )
                          return;
                        api.section('themes').active(false);
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

      //FIRE SKOPE ON READY
      //this promise will be resolved when
      //1) the initial skopes collection has been populated
      //2) the initial skope has been switched to
      api.czr_skopeReady = $.Deferred();
      api.bind( 'ready' , function() {
            if ( serverControlParams.isSkopOn ) {
                  api.czr_skopeBase   = new api.CZR_skopeBase();
                  api.czr_skopeSave   = new api.CZR_skopeSave();
                  api.czr_skopeReset  = new api.CZR_skopeReset();
                  api.trigger('czr-skope-started');
                  api.czr_skopeReady.done( function() {
                        api.trigger('czr-skope-ready');
                  });
            }

            //let's set a lower autosave interval ( default is 60000 ms )
            if ( serverControlParams.isChangedSetOn ) {
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

})( wp.customize , jQuery, _);