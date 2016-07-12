
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

          $('.czr-scope-switcher', '#customize-header-actions').append( $( _tmpl ) );
          return $( '.' + skope.el , '.czr-scope-switcher' );
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
              _tmpl = '';

          try {
            _tmpl =  wp.template('czr-reset-skope')( _.extend( skope_model, { el : skope.el } ) );
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