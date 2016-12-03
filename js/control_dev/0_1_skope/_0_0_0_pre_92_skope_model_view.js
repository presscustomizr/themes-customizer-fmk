
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
              warning_message = 'Are you sure you want to reset your current customizations for skope : ' + skope().id + '?';
              success_message = 'Your customizations have been reset for skope ' + skope().id + '.';
          } else {
              warning_message = 'Are you sure you want to reset the options to defaults for skope : ' + skope().id + '?';
              success_message = 'The options have been reset to defaults for skope ' + skope().id + '.';
          }

          try {
            _tmpl =  wp.template('czr-reset-skope')(
                _.extend( skope_model, {
                  el : skope.el,
                  warning_message : warning_message,
                  success_message : success_message
                } )
            );
          }
          catch(e) {
            throw new Error('Error when parsing the the reset skope template : ' + e );
          }

          $('#customize-preview').after( $( _tmpl ) );

          return $( '#czr-reset-skope-pane' );
    },




    /*****************************************************************************
    * HELPERS
    *****************************************************************************/
    getEl : function() {
          var skope = this;
          return $( skope.el, '#customize-header-actions');
    }
});//$.extend()