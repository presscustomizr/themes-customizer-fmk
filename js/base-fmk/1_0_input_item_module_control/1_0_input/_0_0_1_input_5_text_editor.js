var CZRInputMths = CZRInputMths || {};
( function ( api, $, _ ) {
$.extend( CZRInputMths , {
      setupTinyMceEditor : function() {
            var input        = this;

            //do we have an html template and a input container?
            if ( ! input.container ) {
                throw new Error( 'The input container is not set for WP text editor in module :' + input.module.id );
            }

            // This event is triggered from sektions::setupTinyMceEditor()
            input.input_parent.control.bind( 'tinyMceEditorUpdated', function() {
                  //console.log('in input => tinyMceEditorUpdated ', api.sekEditorSynchronizedInput(), input.input_parent.control.id );
                  //console.log('/// api.sekEditorSynchronizedInput', api.sekEditorSynchronizedInput );
                  if ( api.sekEditorSynchronizedInput().control_id != input.input_parent.control.id || api.sekEditorSynchronizedInput().input_id != input.id )
                    return;
                  input( wp.editor.removep( api.sekTinyMceEditor.getContent() ) );
                  api.sekTinyMceEditor.focus();
            });

      },//setupTextEditor

});//$.extend
})( wp.customize , jQuery, _ );