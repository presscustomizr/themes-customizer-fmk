

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
          var self = this;
          //create the control ids list if not set
          if ( _.isUndefined( controls ) || _.isEmpty( controls ) ) {
                controls = api.CZR_Helpers.getSectionControlIds( api.czr_activeSectionId() );
                //filter only eligible controlIds
                controls = _.filter( controls, function( _id ) {
                    var setId = api.CZR_Helpers.getControlSettingId( _id );
                    return self.isSettingSkopeEligible( setId );
                });
          }

          var controlIds = _.isArray(controls) ? controls : [controls],
              render_reset_icons = function( setIds ) {
                    //api.consoleLog('IN RENDER RESET ICONS', setIds );
                    _.each( controlIds, function( _id ) {
                          api.control.when( _id, function() {
                                var ctrl = api.control( _id );

                                // if ( ! _.has( ctrl, 'czr_hasDBVal' ) || ! _.has( ctrl, 'czr_isDirty' ) || ! _.has( ctrl, 'czr_resetVisibility' ) ) {
                                //       api.consoleLog('IN RENDER, TOGGLE CLASSES ?', _id );

                                //       self.setupControlsValues( _id );
                                // } else {
                                //     // //toggle classes when needed
                                //     ctrl.container.toggleClass( 'has-db-val', ctrl.czr_hasDBVal() );
                                //     ctrl.container.toggleClass( 'is-dirty', ctrl.czr_isDirty() );
                                // }

                                if( $('.czr-setting-reset', ctrl.container ).length )
                                  return;

                                ctrl.deferred.embedded.then( function() {
                                      $.when( ctrl.container
                                            .find('.customize-control-title').first()//was.find('.customize-control-title')
                                            .prepend( $( '<span/>', {
                                                  class : 'czr-setting-reset fa fa-refresh',
                                                  title : 'Reset'
                                            } ) ) )
                                      .done( function(){
                                            $('.czr-setting-reset', ctrl.container).fadeIn( 400 );
                                      });
                                });//then()
                          });//when()
                    });//_each
              };

          //debounce because some control like media upload are re-rendered on section expansion
          render_reset_icons = _.debounce( render_reset_icons , 500 );
          render_reset_icons( controlIds );
    },


    //@cb of : ctrl.czr_resetVisibility
    controlResetVisibilityReact : function( visible, setId ) {
          var self = this,
              ctrl = api.control( setId ),
              section_id = ctrl.section() || api.czr_activeSectionId();

          if ( visible ) {
                $.when( self.renderControlResetWarningTmpl(setId ) ).done( function( $_resetWarning ) {
                      ctrl.czr_resetWarning = $_resetWarning;
                      $_resetWarning.slideToggle('fast');
                });
          } else {
                if ( _.has( ctrl, 'czr_resetWarning' ) && ctrl.czr_resetWarning.length )
                      $.when( ctrl.czr_resetWarning.slideToggle('fast') ).done( function() {
                            ctrl.czr_resetWarning.remove();
                      });
          }

    },


    renderControlResetWarningTmpl : function( setId ) {
          var self = this,
              ctrl = api.control( setId ),
              _tmpl = '',
              warning_message,
              success_message;

          if ( ctrl.czr_isDirty() ) {
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
          }
          catch(e) {
            throw new Error('Error when parsing the the reset control template : ' + e );
          }

          $('.customize-control-title', ctrl.container).first().after( $( _tmpl ) );

          return $( '.czr-ctrl-reset-warning', ctrl.container );
    },

    //fired on user click
    doResetSetting : function( setId ) {
          var self = this,
              ctrl = api.control(setId),
              skope_id = api.czr_activeSkopeId(),
              reset_method = ctrl.czr_isDirty() ? '_resetControlDirtyness' : '_resetControlAPIVal',
              _do_reset = function( setId ) {

                    self[reset_method](setId);

                    $api.czr_skopeBase.processSilentUpdates( { candidates : setId } ).done( function() {
                          $('.czr-reset-success', ctrl.container ).fadeIn('300');
                          ctrl.container.removeClass('czr-resetting-control');//hides the spinner
                          ctrl.czr_resetVisibility(false);
                          self.setupCurrentControls( { controls : [ setId ] } );
                    });

              };

          ctrl.container.addClass('czr-resetting-control');
          api.consoleLog('DO RESET SETTING', setId );

          if ( ctrl.czr_isDirty() ) {
                _do_reset( setId );
          } else {
                api.previewer.czr_reset( skope_id, setId )
                      .done( function( r ) {
                            _do_reset( setId );
                      })
                      .fail( function( r ) {
                              $('.czr-reset-fail', ctrl.container ).fadeIn('300');
                              $('.czr-reset-fail', ctrl.container ).append('<p>' + response + '</p>');
                              ctrl.czr_resetVisibility(false);
                      });
          }

    },

    _resetControlDirtyness : function( setId ) {
          var skope_instance = api.czr_skope( api.czr_activeSkopeId() ),
              current_dirties = skope_instance.dirtyValues(),
              new_dirties = $.extend( true, {}, current_dirties );

          new_dirties = _.omit( new_dirties, setId );
          skope_instance.dirtyValues( new_dirties );
          //inform the api about the new dirtyness state
          api.state('saved')( ! api.czr_dirtyness() );
    },

    _resetControlAPIVal : function( setId ) {
          var skope_model       = api.czr_skope( api.czr_activeSkopeId() )(),
              new_skope_model   = $.extend( true, {}, skope_model ),
              current_skope_db  = api.czr_skope( api.czr_activeSkopeId() ).dbValues(),
              new_skope_db      = $.extend( true, {}, current_skope_db ),
              reset_control_db_state = function( setId ) {
                    if ( _.has(api.control( setId ), 'czr_hasDBVal') )
                        api.control(setId).czr_hasDBVal(false);
              };

          reset_control_db_state( setId );

          api.consoleLog('SKOPE DB VAL AFTER RESET?', new_skope_db );

          //update the skope db property and say it
          api.czr_skope( skope_model.id ).dbValues( _.omit( new_skope_db, setId ) );

          api.consoleLog('new_skope_model ?', new_skope_model );

          api.czr_skope( skope_model.id )( new_skope_model );
    }

});//$.extend()