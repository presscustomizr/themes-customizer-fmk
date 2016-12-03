
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
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
          else if ( ! _.isUndefined(from) )
            throw new Error('listenToActiveSkope : previous scope does not exist in the collection', from );

          if ( ! _.isUndefined(to) && api.czr_skope.has(to) )
            api.czr_skope(to).active(true);
          else
            throw new Error('listenToActiveSkope : requested scope ' + to + ' does not exist in the collection');

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

          console.log('ACTIVE SKOPE REACT', to, from, _silentUpdateCands );

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
                      .done( function() {
                            api.previewer.refresh()
                                  .always( function() {
                                        api.trigger( 'skope-switched', to );
                                        dfd.resolve();
                                        api.state('switching-skope')( false );
                                  });
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
    },

    //@return void()
    //Fired in activeSkopeReact()
    _writeCurrentSkopeTitle : function( skope_id ) {
          var self = this,
              current_title = api.czr_skope( skope_id|| api.czr_activeSkopeId() ).long_title,
              _toggle_spinner = function( visible ) {
                    if ( visible ) {
                          $('.czr-scope-switcher').find('.spinner').fadeIn();
                    } else {
                          $('.czr-scope-switcher').find('.spinner').fadeOut();
                    }
              };

          self.skopeWrapperEmbedded.then( function() {
                if ( ! $('.czr-scope-switcher').find('.czr-current-skope-title').length ) {
                      $('.czr-scope-switcher').prepend(
                        $( '<h2/>', {
                              class : 'czr-current-skope-title',
                              html : '<span class="czr-skp-permanent-title"><span class="spinner"></span>CURRENT CUSTOMIZATION SCOPE</span></br><span class="czr-skope-title">' + current_title + '</span>'
                        })
                      );
                } else {
                      $.when( $('.czr-scope-switcher').find('.czr-skope-title').fadeOut(200) ).done( function() {
                            $(this).html( current_title ).fadeIn(200);
                      });
                }

                if ( _.isUndefined( api.state( 'switching-skope' ).isBound ) ) {
                      api.state('switching-skope').bind( _toggle_spinner );
                      api.state( 'switching-skope' ).isBound = true;
                }
          });

    }
});//$.extend