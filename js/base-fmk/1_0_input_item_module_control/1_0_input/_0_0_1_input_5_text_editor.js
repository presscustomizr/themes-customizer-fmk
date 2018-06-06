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
            // @params = {
            //    input_id : '',
            //    html_content : '',
            //    modified_editor_element : ''//<= can be the visual / text editor tab
            // }
            // Note : this event is trigger when the visual AND the text tab of the editor are modified.
            // This means that the modified_editor_element can be different if it is the visual editor ( or the text html editor <textarea> element
            // @see sektions::setupTinyMceEditor()
            input.input_parent.control.bind( 'tinyMceEditorUpdated', function( params ) {
                  //console.log('in input => tinyMceEditorUpdated ', api.sekEditorSynchronizedInput(), input.input_parent.control.id );
                  //console.log('/// api.sekEditorSynchronizedInput', params );
                  if ( api.sekEditorSynchronizedInput().control_id != input.input_parent.control.id || api.sekEditorSynchronizedInput().input_id != input.id )
                    return;
                  input( wp.editor.removep( params.html_content || api.sekTinyMceEditor.getContent() ) );
                  if ( params.modified_editor_element && params.modified_editor_element.length > 0 ) {
                        params.modified_editor_element.focus();
                  } else {
                        api.sekTinyMceEditor.focus();
                  }

            });

      },//setupTextEditor

});//$.extend
})( wp.customize , jQuery, _ );