
//DOM READY :
//1) FIRE SPECIFIC INPUT PLUGINS
//2) ADD SOME COOL STUFFS
//3) SPECIFIC CONTROLS ACTIONS
( function ( wp, $ ) {
      $( function($) {
            var api = wp.customize || api;

            //WHAT IS HAPPENING IN THE MESSENGER
            // $(window.parent).on( 'message', function(e, o) {
            //   api.consoleLog('SENT STUFFS', JSON.parse( e.originalEvent.data), e );
            // });
            // $( window ).on( 'message', function(e, o) {
            //   api.consoleLog('INCOMING MESSAGE', JSON.parse( e.originalEvent.data), e );
            // });
            // $(window.document).bind("ajaxSend", function(e, o){
            //    api.consoleLog('AJAX SEND', e, arguments );
            // }).bind("ajaxComplete", function(e, o){
            //    api.consoleLog('AJAX COMPLETE', e, o);
            // });

            /* RECENTER CURRENT SECTIONS */
            $('.accordion-section').not('.control-panel').click( function () {
                  _recenter_current_section($(this));
            });

            function _recenter_current_section( section ) {
                  var $siblings               = section.siblings( '.open' );
                  //check if clicked element is above or below sibling with offset.top
                  if ( 0 !== $siblings.length &&  $siblings.offset().top < 0 ) {
                        $('.wp-full-overlay-sidebar-content').animate({
                              scrollTop:  - $('#customize-theme-controls').offset().top - $siblings.height() + section.offset().top + $('.wp-full-overlay-sidebar-content').offset().top
                        }, 700);
                  }
            }//end of fn


            /* CHECKBOXES */
            api.czrSetupCheckbox = function( controlId, refresh ) {
                  var _ctrl = api.control( controlId );
                  $('input[type=checkbox]', _ctrl.container ).each( function() {
                        //Exclude font customizer
                        if ( 'tc_font_customizer_settings' == _ctrl.params.section )
                          return;
                        //first fix the checked / unchecked status
                        if ( 0 === $(this).val() || '0' == $(this).val() || 'off' == $(this).val() || _.isEmpty($(this).val() ) ) {
                              $(this).prop('checked', false);
                        } else {
                              $(this).prop('checked', true);
                        }

                        //then render icheck if not done already
                        if ( 0 !== $(this).closest('div[class^="icheckbox"]').length )
                          return;

                        $(this).iCheck({
                              checkboxClass: 'icheckbox_flat-grey',
                              //checkedClass: 'checked',
                              radioClass: 'iradio_flat-grey',
                        })
                        .on( 'ifChanged', function(e){
                              $(this).val( false === $(this).is(':checked') ? 0 : 1 );
                              $(e.currentTarget).trigger('change');
                        });
                  });
            };//api.czrSetupCheckbox()

            /* SELECT INPUT */
            api.czrSetupSelect = function(controlId, refresh) {
                  //Exclude no-selecter-js
                  $('select[data-customize-setting-link]', api.control(controlId).container )
                        .not('.no-selecter-js')
                        .each( function() {
                              $(this).selecter({
                              //triggers a change event on the view, passing the newly selected value + index as parameters.
                              // callback : function(value, index) {
                              //   self.triggerSettingChange( window.event || {} , value, index); // first param is a null event.
                              // }
                              });
                        });
            };//api.czrSetupSelect()


            /* NUMBER INPUT */
            api.czrSetupStepper = function( controlId, refresh ) {
                  //Exclude no-selecter-js
                  var _ctrl = api.control( controlId );
                  $('input[type="number"]', _ctrl.container ).each( function() {
                        //Exclude font customizer steppers
                        //the font customizer plugin has its own way to instantiate the stepper, with custom attributes previously set to the input like step, min, etc...
                        if ( 'tc_font_customizer_settings' != _ctrl.params.section ) {
                            $(this).stepper();
                        }
                  });
            };//api.czrSetupStepper()

            api.control.each(function(control){
                  if ( ! _.has(control,'id') )
                    return;
                  //exclude widget controls and menu controls for checkboxes
                  if ( 'widget_' != control.id.substring(0, 'widget_'.length ) && 'nav_menu' != control.id.substring( 0, 'nav_menu'.length ) ) {
                        api.czrSetupCheckbox(control.id);
                  }
                  if ( 'nav_menu_locations' != control.id.substring( 0, 'nav_menu_locations'.length ) ) {
                        api.czrSetupSelect(control.id);
                  }
                  api.czrSetupStepper(control.id);
            });


            var fireHeaderButtons = function() {
                  var $home_button = $('<span/>', { class:'customize-controls-home fa fa-home', html:'<span class="screen-reader-text">Home</span>' } );
                  $.when( $('#customize-header-actions').append( $home_button ) )
                        .done( function() {
                              $home_button
                                    .keydown( function( event ) {
                                          if ( 9 === event.which ) // tab
                                            return;
                                          if ( 13 === event.which ) // enter
                                            this.click();
                                          event.preventDefault();
                                    })
                                    .on( 'click.customize-controls-home', function() {
                                          //event.preventDefault();
                                          //close everything
                                          if ( api.section.has( api.czr_activeSectionId() ) ) {
                                                api.section( api.czr_activeSectionId() ).expanded( false );
                                          } else {
                                                api.section.each( function( _s ) {
                                                    _s.expanded( false );
                                                });
                                          }
                                          api.panel.each( function( _p ) {
                                                _p.expanded( false );
                                          });
                                    });
                        });
            };

            fireHeaderButtons();

      });//end of $( function($) ) dom ready
})( wp, jQuery );