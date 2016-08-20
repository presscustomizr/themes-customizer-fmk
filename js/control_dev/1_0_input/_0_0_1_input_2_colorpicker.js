var CZRInputMths = CZRInputMths || {};
$.extend( CZRInputMths , {
    setupColorPicker : function() {
        var input  = this;

        input.container.find('input').wpColorPicker( {
            change : function( e, o ) {
                  //if the input val is not updated here, it's not detected right away.
                  //weird
                  //is there a "change complete" kind of event for iris ?
                  //$(this).val($(this).wpColorPicker('color'));
                  //input.container.find('[data-type]').trigger('colorpickerchange');

                  //synchronizes with the original input
                  $(this).val( $(this).wpColorPicker('color') ).trigger('colorpickerchange').trigger('change');
            }
        });
    }
});//$.extend