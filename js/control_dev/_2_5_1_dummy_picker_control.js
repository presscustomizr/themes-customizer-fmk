//wp.customize, jQuery, _
var CZRDummyContentPickerMethods = CZRDummyContentPickerMethods || {};

//@extends CZRStaticMethods
$.extend( CZRDummyContentPickerMethods , {
  initialize: function( id, options ) {
          var control = this;
          api.CZRStaticControl.prototype.initialize.call( control, id, options );

          control.defaultModel = control.params.default_model;

          control.inputConstructor = api.CZRInput.extend( control.CZRDummyContentPickerMethods || {} );
/*
          //the map describing how to populate each particular select inputs
          control.select_map = {
              'background-repeat'     : $.extend( {'': serverControlParams.translatedStrings.selectBgRepeat}, control.params.bg_repeat_options ),
              'background-attachment' : $.extend( {'': serverControlParams.translatedStrings.selectBgAttachment}, control.params.bg_attachment_options ),
              'background-position'   : $.extend( {'': serverControlParams.translatedStrings.selectBgPosition}, control.params.bg_position_options ),
          };*/
  },//initialize
});//$.extend
