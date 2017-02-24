
var CZRSkopeMths = CZRSkopeMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeMths, {
      embedSkopeDialogBox : function() {
            var skope = this,
                skope_model = $.extend( true, {}, skope() ),
                _tmpl = '';

            //@todo will need to be refreshed on scopes change in the future
            if ( ! $('#customize-header-actions').find('.czr-scope-switcher').length ) {
                throw new Error('The skope switcher wrapper is not printed, the skope can not be embedded.');
            }
            try {
                  _tmpl =  wp.template('czr-skope')( _.extend( skope_model, { el : skope.el } ) );
            } catch( er ) {
                  api.errorLog( 'Error when parsing the template of a skope' + er );
                  return false;
            }

            $('.czr-skopes-wrapper', '#customize-header-actions').append( $( _tmpl ) );
            return $( '.' + skope.el , '.czr-skopes-wrapper' );
      },




      // setSkopeSwitcherButtonActive : function( dyn_type ) {
      //       $('.button', '.czr-scope-switcher').each( function( ind ) {
      //         $(this).toggleClass( 'active', dyn_type == $(this).attr('data-dyn-type') );
      //       });
      // },



      /*****************************************************************************
      * RESET
      *****************************************************************************/
      renderResetWarningTmpl : function() {
            var skope = this,
                skope_model = $.extend( true, {}, skope() ),
                _tmpl = '',
                warning_message,
                success_message;

            if ( skope.dirtyness() ) {
                  warning_message = [
                        serverControlParams.i18n.skope['Please confirm that you want to reset your current ( not published ) customizations for'],
                        skope().ctx_title
                  ].join(' ');
                  success_message = [
                        serverControlParams.i18n.skope['Your customizations have been reset for'],
                        skope().ctx_title
                  ].join(' ');
            } else {
                  warning_message = [
                        'global' == skope().skope ? serverControlParams.i18n.skope['Please confirm that you want to reset your sitewide published customizations. Note : this will not reset the customizations made in other option scopes'] : serverControlParams.i18n.skope['Please confirm that you want to reset your published customizations for'],
                        'global' == skope().skope ? '' : skope().ctx_title
                  ].join(' ');
                  success_message = [
                        serverControlParams.i18n.skope['Your published customizations have been reset for'],
                        skope().title
                  ].join(' ');
            }

            try {
                  _tmpl =  wp.template( 'czr-skope-pane' )(
                        _.extend( skope_model, {
                              el : skope.el,
                              warning_message : warning_message + '.',
                              success_message : success_message + '.'
                        } )
                  );
            } catch( er ) {
                  api.errorLog( 'Error when parsing the the reset skope template : ' + er );
                  return false;
            }

            $('#customize-preview').after( $( _tmpl ) );

            return $( '#czr-skope-pane' );
      },




      /*****************************************************************************
      * HELPERS
      *****************************************************************************/
      getEl : function() {
            var skope = this;
            return $( skope.el, '#customize-header-actions');
      }
});//$.extend()
})( wp.customize , jQuery, _ );