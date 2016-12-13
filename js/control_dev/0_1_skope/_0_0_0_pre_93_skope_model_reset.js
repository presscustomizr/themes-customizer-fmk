

var CZRSkopeMths = CZRSkopeMths || {};


//The Active state is delegated to the skope base class
$.extend( CZRSkopeMths, {
    /*****************************************************************************
    * RESET
    *****************************************************************************/
    //Fired when on user click on ".czr-scope-reset", defined in skope model init
    //Handles several scenarios :
    //1) a reset ajax request (save, changeset, reset) can be currently processed, we need to wait for completion
    //2) another skope reset dialog panel might be already opened
    reactOnSkopeResetUserRequest : function() {
          var skope = this,
              _fireReaction = function() {
                    api.state( 'czr-resetting')( true );
                    if ( api.czr_activeSkopeId() != skope().id ) {
                          api.czr_activeSkopeId( skope().id )
                                .done( function() {
                                      skope.skopeResetDialogVisibility( ! skope.skopeResetDialogVisibility() ).done( function() {
                                            api.state( 'czr-resetting')( false );
                                      });

                                });
                    } else {
                          skope.skopeResetDialogVisibility( ! skope.skopeResetDialogVisibility() ).done( function() {
                                api.state( 'czr-resetting')( false );
                          });
                    }
              };

          //Bail if other process currenty running
          if ( ( api.state( 'czr-resetting')() || 0 !== api.state( 'processing' )() ) ) {
                  api.czr_serverNotification( {
                        message: 'Slow down, you move too fast !',//@to_translate
                        status : 'success',
                        auto_collapse : true
                  });
                  return;
          }
          //Close the current panel if a reset for a different skope is requested
          if ( api.czr_activeSkopeId() != skope().id && api.czr_skope( api.czr_activeSkopeId() ).skopeResetDialogVisibility() ) {
                api.czr_skope( api.czr_activeSkopeId() ).skopeResetDialogVisibility( false ).done( function() {
                      _fireReaction();
                });
          } else {
                _fireReaction();
          }
    },









    //cb of skope.skopeResetDialogVisibility.callbacks
    //Setup user DOM events listeners
    //Render the dialog box
    skopeResetDialogReact : function( visible ) {
          var skope = this, dfd = $.Deferred();
          //Are we currently performing a reset or any other processing task ? (reset setting or skope, saving )
          //=> if so, let's defer the current action when its possible
          // if ( api.state( 'czr-resetting')() || 0 !== api.state( 'processing' )() ) {
          //         var reactWhenPossible = function () {
          //               if ( 0 === api.state( 'processing' )() && false === api.state( 'czr-resetting' )() ) {
          //                     api.state.unbind( 'change', reactWhenPossible );
          //                     skope.skopeResetDialogReact( visible );
          //               }
          //         };
          //         api.state.bind( 'change', reactWhenPossible );
          //         return dfd.resolve().promise();
          // }

          //Event Map for the Reset Panel
          skope.userResetEventMap = skope.userResetEventMap || new api.Value( [
                //skope reset : display warning
                {
                      trigger   : 'click keydown',
                      selector  : '.czr-scope-reset-cancel',
                      name      : 'skope_reset_cancel',
                      actions   : function() {
                          skope.skopeResetDialogVisibility( ! skope.skopeResetDialogVisibility() );
                      }
                },
                //skope reset : do reset
                {
                      trigger   : 'click keydown',
                      selector  : '.czr-scope-do-reset',
                      name      : 'skope_do_reset',
                      actions   : 'doResetSkopeValues'
                }
            ]
          );

          if ( visible ) {
                //inform the api that we are resetting
                //=> some actions have to be frozen in this state
                //like for example, resetting another skope
                api.czr_isResettingSkope( skope().id );

                //render reset warning template
                $.when( skope.renderResetWarningTmpl() ).done( function( $_container ) {
                      skope.resetPanel = $_container;
                      //add the reset type class
                      skope.resetPanel.addClass( skope.dirtyness() ? 'dirty-reset' : 'db-reset' );
                      skope.setupDOMListeners( skope.userResetEventMap() , { dom_el : skope.resetPanel } );
                      //$('body').addClass('czr-skope-pane-open');
                }).then( function() {
                      setTimeout( function() {
                            //set height
                            var _height = $('#customize-preview').height();
                            skope.resetPanel.css( 'line-height', _height +'px' ).css( 'height', _height + 'px' );
                            //display
                            $('body').addClass('czr-skope-pane-open');
                      }, 50 );
                });
          } else {
                $.when( $('body').removeClass('czr-skope-pane-open') ).done( function() {
                      if ( _.has( skope, 'resetPanel') && false !== skope.resetPanel.length ) {
                            setTimeout( function() {
                                  skope.resetPanel.remove();
                                  api.czr_isResettingSkope( false );
                            }, 300 );
                      }
                });
          }

          //wait for panel sliding action before resolving
          _.delay( function() {
                dfd.resolve();
          }, 350 );

          return dfd.promise();
    },



    //fired on user click
    //Is used for both resetting customized and db values, depending on the skope customization state
    doResetSkopeValues : function() {
          var skope = this,
              skope_id = skope().id,
              reset_method = skope.dirtyness() ? '_resetSkopeDirties' : '_resetSkopeAPIValues',
              _updateAPI = function() {
                    var _silentUpdate = function() {
                          api.czr_skopeBase.processSilentUpdates( { refresh : false } )
                                .fail( function() { api.consoleLog( 'Silent update failed after resetting skope : ' + skope_id ); } )
                                .done( function() {
                                      $.when( $('.czr-reset-warning', skope.resetPanel ).fadeOut('300') ).done( function() {
                                            $.when( $('.czr-reset-success', skope.resetPanel ).fadeIn('300') ).done( function() {
                                                  _.delay( function() {
                                                        api.czr_isResettingSkope( false );
                                                        skope.skopeResetDialogVisibility( false );
                                                  }, 2000 );
                                            });
                                      });
                                });
                    };

                    skope[reset_method]()
                          .done( function() {
                                //api.previewer.refresh() method is resolved with an object looking like :
                                //{
                                //    previewer : api.previewer,
                                //    skopesServerData : {
                                //        czr_skopes : _wpCustomizeSettings.czr_skopes || [],
                                //        isChangesetDirty : boolean
                                //    },
                                // }
                                api.previewer.refresh()
                                      .fail( function( refresh_data ) {
                                            api.consoleLog('SKOPE RESET REFRESH FAILED', refresh_data );
                                      })
                                      .done( function( refresh_data ) {
                                            if ( 'global' == api.czr_skope( skope_id )().skope && '_resetSkopeAPIValues' == reset_method ) {
                                                  var _sentSkopeCollection,
                                                      _serverGlobalDbValues = {},
                                                      _skope_opt_name = api.czr_skope( skope_id )().opt_name;

                                                  if ( ! _.isUndefined( refresh_data.skopesServerData ) && _.has( refresh_data.skopesServerData, 'czr_skopes' ) ) {
                                                        _sentSkopeCollection = refresh_data.skopesServerData.czr_skopes;
                                                        if ( _.isUndefined( _.findWhere( _sentSkopeCollection, { opt_name : _skope_opt_name } ) ) ) {
                                                              _serverGlobalDbValues = _.findWhere( _sentSkopeCollection, { opt_name : _skope_opt_name } ).db || {};
                                                        }
                                                  }
                                                  api.czr_skopeBase.maybeSynchronizeGlobalSkope( { isGlobalReset : true, isSkope : true, skopeIdToReset : skope_id } )
                                                        .done( function() {
                                                              _silentUpdate();
                                                        });
                                            } else {
                                                  _silentUpdate();
                                            }
                                      });

                          });
              };//_updateAPI

          $('body').addClass('czr-resetting-skope');
          //$('.czr-reset-warning', skope.resetPanel ).hide();

          //When resetting the db value, wait for the ajax promise to be done before reseting the api values.
          api.czr_skopeReset[ skope.dirtyness() ? 'resetChangeset' : 'resetPublished' ](
                      { skope_id : skope().id, is_skope : true } )
                      .always( function() {
                            $('body').removeClass('czr-resetting-skope');//hides the spinner
                      })
                      .done( function( r ) {
                            _updateAPI();
                      })
                      .fail( function( r ) {
                              skope.skopeResetDialogVisibility( false );
                              api.consoleLog('Skope reset failed', r );
                      });
    },


    //fired in doResetSkopeValues
    //@uses The ctrl.czr_states values
    _resetSkopeDirties : function() {
          var skope = this, dfd = $.Deferred();
          skope.dirtyValues({});
          skope.changesetValues({});
          return dfd.resolve().promise();
    },

    //fired in doResetSkopeValues
    //@uses The ctrl.czr_states values
    _resetSkopeAPIValues : function() {
          var skope = this, dfd = $.Deferred();
          //update the skope model db property
          skope.dbValues( {} );
          return dfd.resolve().promise();
    }
  } );//$.extend(