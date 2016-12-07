

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
                      skope.setupDOMListeners( skope.userResetEventMap() , { dom_el : skope.resetPanel } );
                      //$('body').addClass('czr-reset-skope-pane-open');
                }).then( function() {
                      setTimeout( function() {
                            //set height
                            var _height = $('#customize-preview').height();
                            skope.resetPanel.css( 'line-height', _height +'px' ).css( 'height', _height + 'px' );
                            //display
                            $('body').addClass('czr-reset-skope-pane-open');
                      }, 50 );
                });
          } else {
                $.when( $('body').removeClass('czr-reset-skope-pane-open') ).done( function() {
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
              reset_method = skope.dirtyness() ? '_resetSkopeDirties' : '_resetSkopeAPIValues',
              _updateAPI = function() {
                    skope[reset_method]().done( function() {
                          api.czr_skopeBase.processSilentUpdates()
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
                    });


              };

          $('body').addClass('czr-resetting-skope');
          //$('.czr-reset-warning', skope.resetPanel ).hide();

          //When resetting the db value, wait for the ajax promise to be done before reseting the api values.
          if ( skope.dirtyness() ) {
                api.czr_skopeReset.resetChangeset( { skope_id : skope().id, is_skope : true } )
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
          } else {
                // api.previewer.czr_reset( skope().id )
                //       .done( function( r ) {
                //             _updateAPI();
                //       } )
                //       .fail( function( r ) {
                //             $('.czr-reset-fail', skope.resetPanel ).fadeIn('300');
                //             api.czr_isResettingSkope( false );
                //             skope.skopeResetDialogVisibility(false);
                //       });
          }
    },


    //fired in doResetSkopeValues
    //@uses The ctrl.czr_states values
    _resetSkopeDirties : function() {
          var skope = this, dfd = $.Deferred();
          //Clean the dirtyness state of dirty controls
          //skope.dirtyValues() is an object :
          //{
          //  skope_id2 : { setId1 : val 1, setId2, val2, ... }
          //  ...
          //}
          // if ( api.czr_activeSkopeId() == skope().id ) {
          //       _.each( skope.dirtyValues(), function( _v, setId ) {
          //             if (  ! _.has( api.control( setId ), 'czr_states' ) )
          //               return;
          //             api.control( setId ).czr_states( 'isDirty' )( false );
          //       });
          // }
          skope.dirtyValues({});
          skope.changesetValues({});
          return dfd.resolve().promise();
          //inform the api about the new dirtyness state
          //api.state('saved')( ! api.czr_dirtyness() );
    },

    //fired in doResetSkopeValues
    //@uses The ctrl.czr_states values
    _resetSkopeAPIValues : function() {
          var skope = this, dfd = $.Deferred();
              // current_model = $.extend( true, {}, skope() ),
              // reset_control_db_state = function( shortSetId ) {
              //       var wpSetId         = api.CZR_Helpers.build_setId( shortSetId );
              //       if (  ! _.has( api.control( wpSetId ), 'czr_states' ) )
              //         return;
              //       api.control( setId ).czr_states( 'hasDBVal' )( false );
              // },


          //set the db state of each control
          //Avoid cross skope actions
          // if ( api.czr_activeSkopeId() == skope().id ) {
          //       _.each( skope.dbValues(), function( _v, _setId ) {
          //             reset_control_db_state( _setId );
          //       });
          // }

          //update the skope model db property
          skope.dbValues( {} );
          return dfd.resolve().promise();
    }
  } );//$.extend(