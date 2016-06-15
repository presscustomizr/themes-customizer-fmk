//extends api.CZRWidgetModule

var CZRWidgetRecentPostsModuleMths = CZRWidgetRecentPostsModuleMths || {};

$.extend( CZRWidgetRecentPostsModuleMths, {
  initialize: function( id, options ) {
          var module = this;

          //run the parent initialize
          api.CZRWidgetModule.prototype.initialize.call( module, id, options );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR INPUT
          module.inputConstructor = module.inputConstructor.extend( module.CZRWidgetRecentPostsInputMths || {} );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor  = module.itemConstructor.extend( module.CZRWidgetRecentPostsItem || {} );

  },//initialize
  //@override 
  //to use a different viewContentTemplateEl
  // (would be good if it could be an array, so to use always the standard template - only title input - and add other inputs)
  getItemTemplates : function() {
          return {
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-widget-recent_posts-view-content',
          };
  },
  //@override to define the type and the item titel (maybe localized in the future)
  getItemDefaultModel : function() {
          return {
              id                    : '',
              title                 : 'Recent Posts:',
              type                  : 'WP_Widget_Recent_Posts',
              'widget-title'        : '',
              'widget-number'       : 5,
              'widget-show_date'    : false,
          };
  },
  CZRWidgetRecentPostsInputMths : {
  },//CZRwidgetssInputMths
  CZRWidgetRecentPostsItem : {
  }
});