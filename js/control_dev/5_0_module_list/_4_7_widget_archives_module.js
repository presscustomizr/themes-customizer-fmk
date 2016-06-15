//extends api.CZRWidgetModule

var CZRWidgetArchivesModuleMths = CZRWidgetArchivesModuleMths || {};

$.extend( CZRWidgetArchivesModuleMths, {
  initialize: function( id, options ) {
          var module = this;

          //run the parent initialize
          api.CZRWidgetModule.prototype.initialize.call( module, id, options );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR INPUT
          module.inputConstructor = module.inputConstructor.extend( module.CZRWidgetArchivesInputMths || {} );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor  = module.itemConstructor.extend( module.CZRWidgetArchivesItem || {} );

  },//initialize
  //@override 
  //to use a different viewContentTemplateEl
  // (would be good if it could be an array, so to use always the standard template - only title input - and add other inputs)
  getItemTemplates : function() {
          return {
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-widget-archives-view-content',
                //category template is the same with the add of an additional checkbox..
          };
  },
  //@override to define the type and the item titel (maybe localized in the future)
  getItemDefaultModel : function() {
          return {
              id                    : '',
              title                 : 'Archives:',
              type                  : 'WP_Widget_Archives',
              'widget-title'        : '',
              'widget-dropdown'     : false,
              'widget-count'        : false,
          };
  },
  CZRWidgetArchivesInputMths : {
  },//CZRwidgetssInputMths
  CZRWidgetArchivesItem : {
  }
});