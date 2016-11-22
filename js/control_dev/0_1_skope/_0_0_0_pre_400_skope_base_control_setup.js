

/*****************************************************************************
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {
    /*****************************************************************************
    * SETUP CONTROL RESET ON SECTION EXPANSION + SKOPE SWITCH
    *****************************************************************************/
    //fired on section expansion + skope switch
    //@param obj :
    //{
    //  controls : [] of controls or controlId string
    //  section_id : string
    //}
    setupCurrentControls : function( obj ) {
          var self = this, section_id, controls, setupParams,
              defaultSetupParams = {
                  controls : [],
                  section_id : api.czr_activeSectionId()
              };
          setupParams = $.extend( defaultSetupParams, obj );

          //api.consoleLog('SETUP CONTROLS RESET ?', obj.controls );

          if ( ! _.isObject( setupParams ) || ! _.has( setupParams, 'controls' ) || ! _.has( setupParams, 'section_id' ) ) {
                throw new Error( 'SetupControlsReset : the setupParams param must be an object with properties controls and section_id.');
          }

          section_id = setupParams.section_id;
          controls = setupParams.controls;

          if ( _.isEmpty( section_id ) || ! _.isString( section_id ) ) {
                section_id = api.czr_activeSectionId();
          }
          if ( _.isEmpty( controls ) ) {
                controls = api.CZR_Helpers.getSectionControlIds( section_id  );
          }

          controls = _.isString( controls ) ? [controls] : controls;

          //filter only eligible setIds
          controls = _.filter( controls, function( setId ) {
              return true;
              //return self.isSettingSkopeEligible( setId );
              //return self.isSettingResetEligible( setId );
          });

          if ( _.isEmpty(controls) )
            return;

          $.when( self.renderControlsSingleReset( controls ) ).done( function() {
                //add observable Value(s) to the section control
                self.setupControlsValues( controls );
          });

          self.renderControlSkopeNotice( controls );

    },


    //@params controls = array of control ids candidate to setup
    //Only the Settings eligible to skope
    setupControlsValues : function( controls ) {
          var self = this;
          _.each( controls, function( setId ) {
                if ( ! api.has( setId ) || _.isUndefined( api.control( setId ) ) )
                  return;
                var ctrl = api.control( setId ),
                    shortSetId = api.CZR_Helpers.getOptionName( setId );

                if ( ! _.has( ctrl, 'czr_hasDBVal' ) && ! _.has( ctrl, 'czr_isDirty' ) ) {
                      ctrl.czr_hasDBVal = new api.Value(false);
                      ctrl.czr_isDirty  = new api.Value(false);
                      ctrl.czr_noticeVisible = new api.Value(false);

                      //init observ. values + react to changes
                      ctrl.czr_hasDBVal.bind( function( has_dbval ) {
                            ctrl.container.toggleClass( 'has-db-val', has_dbval );
                      });
                      ctrl.czr_isDirty.bind( function( is_dirty ) {
                            ctrl.container.toggleClass( 'is-dirty', is_dirty );
                      });
                      ctrl.czr_noticeVisible.bind( function( visible ) {
                            ctrl.container.toggleClass('czr-notice-visible', visible );
                            var $noticeContainer = ctrl.getNotificationsContainerElement();
                            if ( ! $noticeContainer || ! $noticeContainer.length )
                              return;

                             if ( ! visible ) {
                                  $noticeContainer
                                        .stop()
                                        .slideUp( 'fast', null, function() {
                                              $( this ).css( 'height', 'auto' );
                                        } );
                            } else {
                                  $noticeContainer
                                        .stop()
                                        .slideDown( 'fast', null, function() {
                                              $( this ).css( 'height', 'auto' );
                                        } );
                            }
                      });
                }

                //api.consoleLog( 'SETUP CONTROL VALUES ?', setId, ctrl.czr_hasDBVal(), api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( setId ) );

                //set
                ctrl.czr_hasDBVal( api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( setId ) );
                //set
                ctrl.czr_isDirty( api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( setId ) );

                if ( ! _.has( ctrl, 'czr_resetVisibility' ) ) {
                      ctrl.czr_resetVisibility = new api.Value(false);
                      //Reset actions
                      ctrl.czr_resetVisibility.bind( function( visible ) {
                          self.controlResetVisibilityReact( visible, setId );
                      });
                }

                if ( ! _.has( ctrl, 'userEventMap' ) ) {
                      ctrl.userEventMap = [
                            {
                                  trigger   : 'click keydown',
                                  selector  : '.czr-setting-reset, .czr-cancel-button',
                                  name      : 'control_reset_warning',
                                  actions   : function() {
                                        if ( ! ctrl.czr_isDirty() && ! ctrl.czr_hasDBVal() )
                                          return;
                                        //close all other warnings expanded in the section
                                        _.each( _.without( api.CZR_Helpers.getSectionControlIds( ctrl.section() ), setId ) , function( _id ) {
                                              if ( _.has( api.control(_id), 'czr_resetVisibility') )
                                                api.control(_id).czr_resetVisibility(false);
                                        });
                                        ctrl.czr_resetVisibility( ! ctrl.czr_resetVisibility() );
                                  }
                            },
                            //skope reset : do reset
                            {
                                  trigger   : 'click keydown',
                                  selector  : '.czr-control-do-reset',
                                  name      : 'control_do_reset',
                                  actions   : function() {
                                        self.doResetSetting( setId );
                                  }
                            },
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
                                        ctrl.czr_noticeVisible( ! ctrl.czr_noticeVisible() );
                                  }
                            }
                      ];
                      api.CZR_Helpers.setupDOMListeners( ctrl.userEventMap , { dom_el : ctrl.container }, self );
                }
          });
    }
});//$.extend()