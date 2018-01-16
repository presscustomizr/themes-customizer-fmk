//extends api.Value

var CZRSektionMths = CZRSektionMths || {};
( function ( api, $, _ ) {
$.extend( CZRSektionMths, {
      toggleModuleListPanel : function( obj ) {
            var module = this;
            // if ( 'pending' == api.czrModulePanelEmbedded.state() ) {
            //     $.when( module.renderModulePanel() ).done( function(){
            //         api.consoleLog('MODULE PANEL EMBEDDED!');
            //         api.czrModulePanelEmbedded.resolve();
            //     });
            // }

            //close the sek setting panel if needed
            api.czrSekSettingsPanelState.set(false);

            api.czrModulePanelState.set( ! api.czrModulePanelState() );


            //close all sektions but the one from which the button has been clicked
            if ( ! api.czrModulePanelState() ) {
                module.closeAllOtherSektions( $(obj.dom_event.currentTarget, obj.dom_el ) );
            } else {
                module.czr_Item.each( function( _sektion ){
                    _sektion.viewState.set( 'expanded' != _sektion.viewState() ? 'expanded_noscroll' : 'expanded' );
                });
            }
      },

      //fired once, on first expansion
      renderModulePanel : function() {
            var module = this;
            //do we have template script?
            if ( 0 === $( '#tmpl-czr-available-modules' ).length ) {
              throw new Error('No template found to render the module panel list' );
            }

            $('#widgets-left').after( $( wp.template( 'czr-available-modules' )() ) );

            _.each( api.czrModuleMap, function( _data, _mod_type ) {
                    var $_mod_candidate = $('<li/>', {
                          class : 'czr-module-candidate',
                          'data-module-type' : _mod_type,
                          html : '<h3><span class="czr-mod-drag-handler fas fa-expand-arrows-alt"></span>' + _data.name + '</h3>'
                    });
                    $('#czr-available-modules-list').append(  $_mod_candidate );
            });
      }
});//$.extend
})( wp.customize , jQuery, _ );