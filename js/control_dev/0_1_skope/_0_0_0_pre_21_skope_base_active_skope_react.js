
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {

    //declared in initialize
    //cb of api.czr_activeSkopeId.callbacks
    //react when the active skope has been set to a new value
    // => change the to and from skope active() state
    // => silently update each setting values with the skope set of vals
    activeSkopeReact : function( to, from ) {
          var self = this;
          //set the to and from scope state on init and switch
          if ( ! _.isUndefined(from) && api.czr_skope.has(from) )
            api.czr_skope(from).active(false);
          else if ( ! _.isUndefined(from) )
            throw new Error('listenToActiveSkope : previous scope does not exist in the collection');

          if ( ! _.isUndefined(to) && api.czr_skope.has(to) )
            api.czr_skope(to).active(true);
          else
            throw new Error('listenToActiveSkope : requested scope ' + to + ' does not exist in the collection');

          //write the current skope title
          self._writeCurrentSkopeTitle( to );

          //CURRENT EXPANDED SECTION DEPENDANT ACTIONS
          //stop here if the active section is not set yet
          //=> the silent update will be fired on section expansion anyway
          //=> refresh now if the previewer is not skope aware, this will post the dyn_type used in the preview to get the proper option if the skope is not 'global'
          //=> otherwise simply refresh to set the new skope in the query params => needed for the preview frame
          api.consoleLog('ACTIVE SKOPE SWITCH : ' + from + ' => ' + to );

          if ( _.isUndefined( api.czr_activeSectionId() ) ) {
                // if ( 'pending' == api.czr_isPreviewerSkopeAware.state() ) {
                //     api.previewer.refresh();
                // } else {
                //     api.previewer.refresh();
                // }
                api.previewer.refresh();
                return;
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


          //Process Silent Updates and
          //make sure that the visibility is processed after the silent updates
          var _debouncedProcessSilentUpdates = function() {
                self.processSilentUpdates( {
                            silent_update_candidates : _silentUpdateCands,
                            section_id : null
                      })
                      .fail( function() {
                            throw new Error( 'Fail to process silent updates in _debouncedProcessSilentUpdates');
                      })
                      .done( function() {
                            api.czr_visibilities.setServiVisibility( api.czr_activeSectionId() );
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
    },

    //@return void()
    //Fired in activeSkopeReact()
    _writeCurrentSkopeTitle : function( skope_id ) {
          var self = this,
              current_title = api.czr_skope( skope_id|| api.czr_activeSkopeId() ).long_title;

          self.skopeWrapperEmbedded.then( function() {
                if ( ! $('.czr-scope-switcher').find('.czr-current-skope-title').length )
                  $('.czr-scope-switcher').prepend( $( '<h2/>', { class : 'czr-current-skope-title'} ) );
                $('.czr-scope-switcher').find('.czr-current-skope-title').html(
                    '<strong>Current Options Scope : </strong></br>' + '<span class="czr-skope-title">' + current_title + '</span>'
                );
          });

    }
});//$.extend