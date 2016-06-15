//extends api.CZRWidgetModule

var CZRWidgetTextModuleMths = CZRWidgetTextModuleMths || {};

$.extend( CZRWidgetTextModuleMths, {
  initialize: function( id, options ) {
          var module = this;

          //run the parent initialize
          api.CZRWidgetModule.prototype.initialize.call( module, id, options );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR INPUT
          module.inputConstructor = module.inputConstructor.extend( module.CZRWidgetTextInputMths || {} );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor  = module.itemConstructor.extend( module.CZRWidgetTextItem || {} );

  },//initialize
  //@override 
  //to use a different viewContentTemplateEl
  // (would be good if it could be an array, so to use always the standard template - only title input - and add other inputs)
  getItemTemplates : function() {
          return {
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-widget-text-view-content',
          };
  },
  //@override to define the type and the item titel (maybe localized in the future)
  getItemDefaultModel : function() {
          return {
              id             : '',
              title          : 'Text:',
              type           : 'WP_Widget_Text',
              'widget-title' : '',
              'widget-text'  : '',
              'widget-filter': false
          };
  },
  CZRWidgetTextInputMths : {
  },//CZRwidgetssInputMths
  CZRWidgetTextItem : {
  }
});