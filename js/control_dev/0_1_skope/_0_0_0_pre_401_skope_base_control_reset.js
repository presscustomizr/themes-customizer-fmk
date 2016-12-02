

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
                                      $.when( ctrl.container
                                            .find('.customize-control-title').first()//was.find('.customize-control-title')
                                            .prepend( $( '<span/>', {
                                                  class : 'czr-setting-reset fa fa-refresh',
                                                  title : 'Reset'
                                            } ) ) )
                                      .done( function(){
                                            $('.czr-setting-reset', ctrl.container).fadeIn( 400 );
                                            dfd.resolve();
                                      });
                                });//then()
                          });//when()
                    });//_each
              };

          //debounce because some control like media upload are re-rendered on section expansion
          render_reset_icons = _.debounce( render_reset_icons , 500 );
          render_reset_icons( controlIds );
          return dfd.promise();
    },



    //Fired in self.controlStateReact()
    //
    //The ctrl.czr_state value looks like :
    //{
    // hasDBVal : false,
    // isDirty : false,
    // noticeVisible : false,
    // resetVisible : false
    //}
    renderControlResetWarningTmpl : function( ctrlId ) {
          var self = this,
              ctrl = api.control( ctrlId ),
              _tmpl = '',
              warning_message,
              success_message;

          if ( ctrl.czr_state().isDirty ) {
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

    //Fired on user click
    //Defined in the ctrl user event map
    //The ctrl.czr_state value looks like :
    //{
    // hasDBVal : false,
    // isDirty : false,
    // noticeVisible : false,
    // resetVisible : false
    //}
    doResetSetting : function( ctrlId ) {
          var self = this,
              ctrl = api.control(ctrlId),
              skope_id = api.czr_activeSkopeId(),
              reset_method = ctrl.czr_state().isDirty ? '_resetControlDirtyness' : '_resetControlAPIVal',
              setResetVisibility = function( ctrl, val ) {
                    val = _.isUndefined( val ) ? false : val;

                    var _current_state  = $.extend( true, {}, ctrl.czr_state() ),
                        _new_state      = _.extend( _current_state, { resetVisible : false} );
                    ctrl.czr_state( _new_state );
              },
              _do_reset = function( ctrlId ) {

                    self[reset_method](ctrlId);

                    $api.czr_skopeBase.processSilentUpdates( { candidates : ctrlId } ).done( function() {
                          $('.czr-reset-success', ctrl.container ).fadeIn( '300' );
                          ctrl.container.removeClass('czr-resetting-control');//hides the spinner
                          setResetVisibility( ctrl );
                          self.setupActiveSkopedControls( { controls : [ ctrlId ] } );
                    });

              };

          ctrl.container.addClass('czr-resetting-control');
          api.consoleLog('DO RESET SETTING', ctrlId );

          if ( ctrl.czr_state().isDirty ) {
                _do_reset( ctrlId );
          } else {
                api.previewer.czr_reset( skope_id, ctrlId )
                      .done( function( r ) {
                            _do_reset( ctrlId );
                      })
                      .fail( function( r ) {
                              $('.czr-reset-fail', ctrl.container ).fadeIn('300');
                              $('.czr-reset-fail', ctrl.container ).append('<p>' + response + '</p>');
                              setResetVisibility( ctrl );
                      });
          }

    },

    _resetControlDirtyness : function( ctrlId ) {
          var skope_instance = api.czr_skope( api.czr_activeSkopeId() ),
              current_dirties = skope_instance.dirtyValues(),
              new_dirties = $.extend( true, {}, current_dirties );

          new_dirties = _.omit( new_dirties, ctrlId );
          skope_instance.dirtyValues( new_dirties );
          //inform the api about the new dirtyness state
          api.state('saved')( ! api.czr_dirtyness() );
    },


    //The control czr_state Value looks like :
    //{
    // hasDBVal : false,
    // isDirty : false,
    // noticeVisible : false,
    // resetVisible : false
    //}
    _resetControlAPIVal : function( ctrlId ) {
          var current_skope_db  = api.czr_skope( api.czr_activeSkopeId() ).dbValues(),
              new_skope_db      = $.extend( true, {}, current_skope_db ),
              reset_control_db_state = function( ctrlId ) {
                    if ( ! _.has( api.control( ctrlId ), 'czr_state') )
                      return;

                    var _current_state = $.extend( true, {}, api.control(ctrlId).czr_state() ),
                        _new_state = _.extend( _current_state, { hasDBVal : false } );

                    api.control(ctrlId).czr_state( _new_state );
              };

          reset_control_db_state( ctrlId );

          api.consoleLog('SKOPE DB VAL AFTER RESET?', new_skope_db );

          //update the skope db property and say it
          api.czr_skope( api.czr_activeSkopeId() ).dbValues( _.omit( new_skope_db, ctrlId ) );
    }

});//$.extend()