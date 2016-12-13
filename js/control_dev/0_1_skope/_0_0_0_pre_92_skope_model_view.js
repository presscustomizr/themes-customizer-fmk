
var CZRSkopeMths = CZRSkopeMths || {};
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
          }
          catch(e) {
            throw new Error('Error when parsing the template of a skope' + e );
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
                    'Please confirm that you want to reset your current customizations for : ',//@to_translate
                    skope().title,
                    '.'
              ].join('');
              success_message = [
                    'Your customizations have been reset for ',//@to_translate
                    skope().title,
                    '.'
              ].join('');
          } else {
              warning_message = [
                    'Please confirm that you want to reset your published customizations to defaults for : ',//@to_translate
                    skope().title,
                    '.'
              ].join('');
              success_message = [
                    'The options have been reset to defaults for ',//@to_translate
                    skope().title,
                    '.'
              ].join('');
          }

          try {
            _tmpl =  wp.template( 'czr-skope-pane' )(
                _.extend( skope_model, {
                      el : skope.el,
                      warning_message : warning_message,
                      success_message : success_message
                } )
            );
          }
          catch(e) {
            throw new Error('Error when parsing the the reset skope template : ' + e );//@to_translate
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