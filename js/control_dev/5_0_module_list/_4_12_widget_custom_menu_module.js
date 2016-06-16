//extends api.CZRWidgetModule

var CZRWidgetCustomMenuModuleMths = CZRWidgetCustomMenuModuleMths || {};

$.extend( CZRWidgetCustomMenuModuleMths, {
  initialize: function( id, options ) {
          var module = this;

          //run the parent initialize
          api.CZRWidgetModule.prototype.initialize.call( module, id, options );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR INPUT
          module.inputConstructor = module.inputConstructor.extend( module.CZRWidgetCustomMenuInputMths || {} );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor  = module.itemConstructor.extend( module.CZRWidgetCustomMenuItem || {} );

          //Set Content Picker params
          module.custom_params = new api.Values();

          module.custom_params.add( 'widget-nav_menu', new api.Value({
            'object'                  : [],
            'type'                    : 'menus',
            'minimumResultsForSearch' : Infinity //do not display search form
          }) );

  },//initialize
  //@override 
  //to use a different viewContentTemplateEl
  // (would be good if it could be an array, so to use always the standard template - only title input - and add other inputs)
  getItemTemplates : function() {
          return {
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-widget-custom_menu-view-content',
          };
  },
  //@override to define the type and the item titel (maybe localized in the future)
  getItemDefaultModel : function() {
          return {
              id                    : '',
              title                 : 'Custom Menu:',
              type                  : 'WP_Nav_Menu_Widget',
              'widget-nav_menu'     : '',
          };
  },
  CZRWidgetCustomMenuInputMths : {
  },//CZRwidgetssInputMths
  CZRWidgetCustomMenuItem : {
  }
});