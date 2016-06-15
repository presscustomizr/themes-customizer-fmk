//extends api.CZRWidgetModule

var CZRWidgetMetaModuleMths = CZRWidgetMetaModuleMths || {};

$.extend( CZRWidgetMetaModuleMths, {
  initialize: function( id, options ) {
          var module = this;

          //run the parent initialize
          api.CZRWidgetModule.prototype.initialize.call( module, id, options );

          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR INPUT
          module.inputConstructor = module.inputConstructor.extend( module.CZRWidgetMetaInputMths || {} );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor  = module.itemConstructor.extend( module.CZRWidgetMetaItem || {} );
  },//initialize
  //@override to define the type and the item titel (maybe localized in the future)
  getItemDefaultModel : function() {
          return {
              id             : '',
              title          : 'Meta:',
              'widget-title' : '',
              type           : 'WP_Widget_Meta'
          };
  },
  CZRWidgetMetaInputMths : {
  },//CZRwidgetssInputMths
  CZRWidgetMetaItem : {
  }
});