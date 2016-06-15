//extends api.CZRWidgetModule

var CZRWidgetCategoriesModuleMths = CZRWidgetCategoriesModuleMths || {};

$.extend( CZRWidgetCategoriesModuleMths, {
  initialize: function( id, options ) {
          var module = this;

          //run the parent initialize
          api.CZRWidgetModule.prototype.initialize.call( module, id, options );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR INPUT
          module.inputConstructor = module.inputConstructor.extend( module.CZRWidgetCategoriesInputMths || {} );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor  = module.itemConstructor.extend( module.CZRWidgetCategoriesItem || {} );

  },//initialize
  //@override 
  //to use a different viewContentTemplateEl
  // (would be good if it could be an array, so to use always the standard template - only title input - and add other inputs)
  getItemTemplates : function() {
          return {
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-widget-categories-view-content',
          };
  },
  //@override to define the type and the item titel (maybe localized in the future)
  getItemDefaultModel : function() {
          return {
              id                    : '',
              title                 : 'Categories:',
              type                  : 'WP_Widget_Categories',
              'widget-title'        : '',
              'widget-dropdown'     : false,
              'widget-count'        : false,
              'widget-hierarchical' : false
          };
  },
  CZRWidgetCategoriesInputMths : {
  },//CZRwidgetssInputMths
  CZRWidgetCategoriesItem : {
  }
});