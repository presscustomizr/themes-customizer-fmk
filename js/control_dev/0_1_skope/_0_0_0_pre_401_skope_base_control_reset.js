

/*****************************************************************************
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {
    //fired on
    //1) active section expansion
    //2) and on skope switch
    //render each control reset icons with a delay
    //=> because some control like media upload are re-rendered on section expansion
    //@params controls = array of skope eligible control ids
    renderControlsSingleReset : function( controls ) {
          var self = this, dfd = $.Deferred();
          //create the control ids list if not set
          if ( _.isUndefined( controls ) || _.isEmpty( controls ) ) {
                controls = api.CZR_Helpers.getSectionControlIds( api.czr_activeSectionId() );
                //filter only eligible controlIds
                controls = _.filter( controls, function( _id ) {
                      var setId = api.CZR_Helpers.getControlSettingId( _id );
                      return setId && self.isSettingSkopeEligible( setId );
                });
          }

          var controlIds = _.isArray(controls) ? controls : [controls],
              render_reset_icons = function( ctrlIds ) {
                    //api.consoleLog('IN RENDER RESET ICONS', ctrlIds );
                    _.each( controlIds, function( _id ) {
                          api.control.when( _id, function() {
                                var ctrl = api.control( _id );
                                if( $('.czr-setting-reset', ctrl.container ).length ) {
                                      dfd.resolve();
                                      return;
                                }

                                ctrl.deferred.embedded.then( function() {
                                      $.when(
                                            ctrl.container
                                                  .find('.customize-control-title').first()//was.find('.customize-control-title')
                                                  .prepend( $( '<span/>', {
                                                        class : 'czr-setting-reset fa fa-refresh',
                                                        title : 'Reset'
                                                  } ) ) )
                                      .done( function(){
                                            ctrl.container.addClass('czr-skoped');
                                            $('.czr-setting-reset', ctrl.container).fadeIn( 400 );
                                            dfd.resolve();
                                      });
                                });//then()
                          });//when()
                    });//_each
              };

          //debounce because some control like media upload are re-rendered on section expansion
          render_reset_icons = _.debounce( render_reset_icons , 200 );
          render_reset_icons( controlIds );
          return dfd.promise();
    },



    //Fired in self.bindControlStates()
    //
    //@uses The ctrl.czr_states('isDirty') value
    renderControlResetWarningTmpl : function( ctrlId ) {
          var self = this,
              ctrl = api.control( ctrlId ),
              _tmpl = '',
              warning_message,
              success_message;

          if ( ctrl.czr_states( 'isDirty' )() ) {
                warning_message = 'Are you sure you want to reset your current customizations for this control?';
                success_message = 'Your customizations have been reset.';
          } else {
                warning_message = 'Are you sure you want to reset this option to default?';
                success_message = 'The options have been reset to defaults.';
          }

          try {
                _tmpl =  wp.template('czr-reset-control')(
                    {
                          warning_message : warning_message,
                          success_message : success_message
                    }
                );
          } catch(e) {
                throw new Error('Error when parsing the the reset control template : ' + e );
          }

          $('.customize-control-title', ctrl.container).first().after( $( _tmpl ) );

          return $( '.czr-ctrl-reset-warning', ctrl.container );
    },


    //Fired on user click
    //Defined in the ctrl user event map
    //@uses The ctrl.czr_states values
    //Will fire a different callback, whether the setting is dirty or has db val
    doResetSetting : function( ctrlId ) {
          var self = this,
              setId = api.CZR_Helpers.getControlSettingId( ctrlId ),
              ctrl = api.control( ctrlId ),
              skope_id = api.czr_activeSkopeId(),
              reset_method = ctrl.czr_states( 'isDirty' )() ? '_resetControlDirtyness' : '_resetControlAPIVal',
              _setResetVisibility = function( ctrl, val ) {
                    val = _.isUndefined( val ) ? false : val;//@todo why this ?
                    ctrl.czr_states( 'resetVisible' )( false );
              },
              _do_reset = function( ctrlId ) {
                    self[reset_method](ctrlId).done( function() {
                          api.czr_skopeBase.processSilentUpdates( { candidates : ctrlId } )
                                .always( function() {
                                      ctrl.container.removeClass('czr-resetting-control');//hides the spinner
                                })
                                .fail( function() { api.consoleLog( 'Silent update failed after resetting control : ' + ctrlId ); } )
                                .done( function() {
                                      $.when( $('.czr-reset-success', ctrl.container ).fadeIn( '300' ) ).done( function() {
                                            _setResetVisibility( ctrl );
                                            self.setupActiveSkopedControls( { controls : [ ctrlId ] } );
                                      });
                                });
                    });
              };

          ctrl.container.addClass('czr-resetting-control');

          api.consoleLog('DO RESET SETTING', ctrlId );

          if ( ctrl.czr_states( 'isDirty' )() ) {
                api.czr_skopeReset.reset_changeset( { skope_id : skope_id, setId : setId, is_setting : true } )
                      .always( function() {
                            ctrl.container.removeClass('czr-resetting-control');
                            _setResetVisibility( ctrl );
                      })
                      .done( function( r ) {
                            _do_reset( ctrlId );
                      })
                      .fail( function( r ) {
                              $('.czr-reset-fail', ctrl.container ).fadeIn('300');
                              $('.czr-reset-fail', ctrl.container ).append('<p>' + r + '</p>');
                      });
          } else {
                // api.czr_skopeReset.reset_published( skope_id, ctrlId )
                //       .done( function( r ) {
                //             _do_reset( ctrlId );
                //       })
                //       .fail( function( r ) {
                //               $('.czr-reset-fail', ctrl.container ).fadeIn('300');
                //               $('.czr-reset-fail', ctrl.container ).append('<p>' + response + '</p>');
                //               _setResetVisibility( ctrl );
                //       });
          }

    },

    //updates the current skope dirties and the changeset dirties
    _resetControlDirtyness : function( ctrlId ) {
          var setId           = api.CZR_Helpers.getControlSettingId( ctrlId ),
              skope_instance  = api.czr_skope( api.czr_activeSkopeId() ),
              current_dirties = $.extend( true, {}, skope_instance.dirtyValues() ),
              new_dirties     = {},
              current_changeset = $.extend( true, {}, skope_instance.changesetValues() ),
              new_changeset     = {},
              dfd             = $.Deferred();

          new_dirties   = _.omit( current_dirties, setId );
          new_changeset = _.omit( current_changeset, setId );
          skope_instance.dirtyValues( new_dirties );
          skope_instance.changesetValues( new_dirties );

          return dfd.resolve().promise();
    },


    //@uses The ctrl.czr_states values
    //updates the current skope dbValues
    //update the ctrl state
    _resetControlAPIVal : function( ctrlId ) {
          var setId = api.CZR_Helpers.getControlSettingId( ctrlId ),
              current_skope_db  = api.czr_skope( api.czr_activeSkopeId() ).dbValues(),
              new_skope_db      = $.extend( true, {}, current_skope_db ),
              dfd = $.Deferred();

          if ( ! _.has( api.control( ctrlId ), 'czr_states') )
            return;

          api.control(ctrlId).czr_states( 'hasDBVal' )( false );
          api.consoleLog('SKOPE DB VAL AFTER RESET?', new_skope_db );
          //update the skope db property and say it
          api.czr_skope( api.czr_activeSkopeId() ).dbValues( _.omit( new_skope_db, setId ) );
          return dfd.resolve().promise();
    }

});//$.extend()