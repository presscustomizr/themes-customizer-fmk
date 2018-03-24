

/*****************************************************************************
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {
    /*****************************************************************************
    * SETUP CONTROL RESET ON SECTION EXPANSION + SKOPE SWITCH
    *****************************************************************************/
    //fired on section expansion + skope switch, when silentlyUpdateSettings.done()
    //@param obj :
    //{
    //  controls : [] of controls or controlId string
    //  section_id : string
    //}
    //@return void()
    setupActiveSkopedControls : function( obj ) {
          var self = this, section_id, controls, setupParams, eligibleCtrls, dfd = $.Deferred();
              defaultSetupParams = {
                    controls : [],
                    section_id : api.czr_activeSectionId()
              };
          setupParams = $.extend( defaultSetupParams, obj );

          if ( ! _.isObject( setupParams ) || ! _.has( setupParams, 'controls' ) || ! _.has( setupParams, 'section_id' ) ) {
                throw new Error( 'setupActiveSkopedControls : the setupParams param must be an object with properties controls and section_id.');
          }

          section_id  = setupParams.section_id;
          controls    = setupParams.controls;
          eligibleCtrls = [];

          if ( _.isEmpty( section_id ) || ! _.isString( section_id ) ) {
                section_id = api.czr_activeSectionId();
          }
          if ( _.isEmpty( controls ) ) {
                controls = api.CZR_Helpers.getSectionControlIds( section_id  );
          }

          controls = _.isString( controls ) ? [controls] : controls;


          //1) Add CSS classes
          //2) filter only eligible ctrlIds
          eligibleCtrls = _.filter( controls, function( ctrlId ) {
                var setId = api.CZR_Helpers.getControlSettingId( ctrlId );
                if ( setId && ! self.isSettingSkopeEligible( setId ) ) {
                      api.control( ctrlId ).container.addClass('czr-not-skoped');
                }
                if ( setId && self.isWPAuthorizedSetting( setId ) ) {
                      api.control( ctrlId ).container.addClass('is-wp-authorized-setting');
                }
                return setId && self.isSettingSkopeEligible( setId );
                //return true;
                //return self.isSettingSkopeEligible( ctrlId );
                //return self.isSettingResetEligible( ctrlId );
          });

          //Bail before printing anything if 'nav_menu[' section
          if ( 'nav_menu[' == section_id.substring( 0, 'nav_menu['.length ) )
            return dfd.resolve().promise();

          //Render the reset icon ONLY for eligible controls
          //Setup the state for all controls, even not eligible ones
          if ( ! _.isEmpty( controls ) ) {
                api.czr_skopeReady.then( function() {
                      $.when( self.renderControlsSingleReset( eligibleCtrls ) ).done( function() {
                            //api.consoleLog('RENDER CONTROL SINGLE RESET DONE', controls );
                            //add observable Value(s) to the section control
                            _.each( controls, function( ctrlId ) {
                                  self.listenSkopedControl( ctrlId );
                            } );
                            dfd.resolve();
                      });
                });
                //paranoid line of code...
                if ( 'rejected' == api.czr_skopeReady.state() )
                  dfd.resolve();
          }

          //Prepare skope control notice for all controls, even the non eligible ones
          self.renderCtrlSkpNotIcon( controls );
          return dfd.promise();
    },//setupActiveSkopedControls



    //@params ctrlId = string control id candidate to setup
    listenSkopedControl : function( ctrlId ) {
          var self = this;

          if ( ! api.has( ctrlId ) || _.isUndefined( api.control( ctrlId ) ) )
            return;

          var ctrl        = api.control( ctrlId ),
              setId       = api.CZR_Helpers.getControlSettingId( ctrlId ),
              shortSetId  = api.CZR_Helpers.getOptionName( setId ),
              defaults    = {
                    hasDBVal : false,
                    isDirty : false,
                    noticeVisible : false,
                    resetVisible : false,
                    isResetting : false
              },
              initial_states = {};

          //Declare observable Values
          // + Bind them
          if ( ! _.has( ctrl, 'czr_states' ) ) {
                ctrl.czr_states = new api.Values();
                _.each( defaults, function( _state_val, _state_name ) {
                      ctrl.czr_states.create( _state_name );
                      ctrl.czr_states( _state_name )( _state_val );
                });
                //Then listen to their changes
                try { self.bindControlStates( ctrl ); } catch( er ) {
                      api.errorLog( 'bindControlStates : ' + er );
                }
          }

          //Set them
          // initial_states = _.extend(
          //       defaults,
          //       {
          //             hasDBVal : api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( ctrlId ),
          //             isDirty : api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( ctrlId )
          //       }
          // );
          ctrl.czr_states( 'hasDBVal' )( api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( setId ) );
          ctrl.czr_states( 'isDirty' )( api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( setId ) );

          //api.consoleLog( 'SETUP CONTROL VALUES ?', ctrlId, api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( ctrlId ) );


          if ( ! _.has( ctrl, 'userEventMap' ) ) {
                ctrl.userEventMap = [
                      //toggle reset dialog
                      {
                            trigger   : 'click keydown',
                            selector  : '.czr-setting-reset, .czr-cancel-button',
                            name      : 'control_reset_warning',
                            actions   : function() {
                                  if ( ! ctrl.czr_states('isDirty')() && ! ctrl.czr_states( 'hasDBVal' )() )
                                    return;
                                  //close all other warnings expanded in the section
                                  _.each( _.without( api.CZR_Helpers.getSectionControlIds( ctrl.section() ), ctrlId ) , function( _id ) {
                                        if ( _.has( api.control(_id), 'czr_states') ) {
                                              api.control(_id).czr_states( 'resetVisible' )( false );
                                        }
                                  });
                                  ctrl.czr_states( 'resetVisible' )( ! ctrl.czr_states( 'resetVisible' )() );
                                  //collapse the control notice expanded if resetting requested
                                  ctrl.czr_states( 'noticeVisible' )( ! ctrl.czr_states( 'resetVisible' )() );
                            }
                      },
                      //skope reset : do reset
                      {
                            trigger   : 'click keydown',
                            selector  : '.czr-control-do-reset',
                            name      : 'control_do_reset',
                            actions   : function() {
                                  self.doResetSetting( ctrlId );
                            }
                      },
                      //skope switch
                      {
                            trigger   : 'click keydown',
                            selector  : '.czr-skope-switch',
                            name      : 'control_skope_switch',
                            actions   : function( params ) {
                                  var _skopeIdToSwithTo = $( params.dom_event.currentTarget, params.dom_el ).attr('data-skope-id');
                                  if ( ! _.isEmpty( _skopeIdToSwithTo ) && api.czr_skope.has( _skopeIdToSwithTo ) )
                                    api.czr_activeSkopeId( _skopeIdToSwithTo );
                            }
                      },
                      //Toggle Notice
                      {
                            trigger   : 'click keydown',
                            selector  : '.czr-toggle-notice',
                            name      : 'control_toggle_notice',
                            actions   : function( params ) {
                                  ctrl.czr_states( 'noticeVisible' )( ! ctrl.czr_states( 'noticeVisible' )() );
                                  //collapse the control reset dialog expanded
                                  if ( ctrl.czr_states( 'noticeVisible' )() ) {
                                        ctrl.czr_states( 'resetVisible' )( false );
                                  }
                            }
                      }
                ];
                api.CZR_Helpers.setupDOMListeners( ctrl.userEventMap , { dom_el : ctrl.container }, self );
          }
    },

    //The ctrl.czr_states registered api.Values are :
    //hasDBVal : false,
    //isDirty : false,
    //noticeVisible : false,
    //resetVisible : false
    bindControlStates : function( ctrl ) {
          if ( ! api.control.has( ctrl.id ) ) {
                throw new Error( 'in bindControlStates, the provided ctrl id is not registered in the api : ' + ctrl.id );
          }
          var self = this,
              setId = api.CZR_Helpers.getControlSettingId( ctrl.id );

          //DB VALS
          ctrl.czr_states( 'hasDBVal' ).bind( function( bool ) {
                ctrl.container.toggleClass( 'has-db-val', bool );
                if ( bool ) {
                      _title = serverControlParams.i18n.skope['Reset your customized ( and published ) value'];
                } else if ( ctrl.czr_states('isDirty')() ) {
                      _title = serverControlParams.i18n.skope['Reset your customized ( but not yet published ) value'];
                } else {
                      _title = serverControlParams.i18n.skope['Not customized yet, nothing to reset'];
                }
                ctrl.container.find('.czr-setting-reset').attr( 'title', _title );
          });

          //API DIRTYNESS
          ctrl.czr_states( 'isDirty' ).bind( function( bool ) {
                ctrl.container.toggleClass( 'is-dirty', bool );
                var _title;
                if ( bool ) {
                      _title = serverControlParams.i18n.skope['Reset your customized ( but not yet published ) value'];
                } else if ( ctrl.czr_states('hasDBVal')() ) {
                      _title = serverControlParams.i18n.skope['Reset your customized ( and published ) value'];
                } else {
                      _title = serverControlParams.i18n.skope['Not customized yet, nothing to reset'];
                }
                ctrl.container.find('.czr-setting-reset').attr( 'title', _title );
          });

          //NOTICE VISIBILITY
          ctrl.czr_states( 'noticeVisible' ).bind( function( visible ) {
                ctrl.container.toggleClass( 'czr-notice-visible', visible );
                var $noticeContainer = ctrl.getNotificationsContainerElement();
                if ( false !== $noticeContainer && false !== $noticeContainer.length ) {
                      if ( ! visible ) {
                            $.when( $noticeContainer
                                  .stop()
                                  .slideUp( 'fast', null, function() {
                                        $( this ).css( 'height', 'auto' );
                                  } ) ).done( function() {
                                        self.removeCtrlSkpNot( ctrl.id );
                                  });
                      } else {
                            self.updateCtrlSkpNot( ctrl.id, true );//<= True for visible
                            $noticeContainer
                                  .stop()
                                  .slideDown( 'fast', null, function() {
                                        $( this ).css( 'height', 'auto' );
                                  } );
                      }
                }
          });

          //RESET VISIBILITY
          ctrl.czr_states( 'resetVisible' ).bind( function( visible ) {
                var section_id = ctrl.section() || api.czr_activeSectionId();
                if ( visible ) {
                      //self.renderControlResetWarningTmpl
                      //returns an object : { container : $(el), is_authorized : is_authorized }
                      $.when( self.renderControlResetWarningTmpl( ctrl.id ) ).done( function( _params ) {
                            if ( _.isEmpty( _params ) )
                              return;
                            ctrl.czr_resetDialogContainer = _params.container;
                            _params.container.slideToggle('fast');
                            //Close and remove automatically if the user attempted to reset a non authorized setting
                            //The setting can not be reset if :
                            //1) WP setting
                            //2) global skope
                            //3) setting not dirty => db reset
                            if ( ! _params.is_authorized ) {
                                  _.delay( function() {
                                        $.when( ctrl.czr_resetDialogContainer.slideToggle('fast') ).done( function() {
                                              ctrl.czr_resetDialogContainer.remove();
                                        });
                                  }, 3000 );
                            }
                      });
                } else {
                      if ( _.has( ctrl, 'czr_resetDialogContainer' ) && ctrl.czr_resetDialogContainer.length )
                            $.when( ctrl.czr_resetDialogContainer.slideToggle('fast') ).done( function() {
                                  ctrl.czr_resetDialogContainer.remove();
                            });
                }
          });
    }
});//$.extend()
})( wp.customize , jQuery, _ );