//extends api.CZRWidgetModule

var CZRWidgetPagesModuleMths = CZRWidgetPagesModuleMths || {};

$.extend( CZRWidgetPagesModuleMths, {
  initialize: function( id, options ) {
          var module = this;

          //run the parent initialize
          api.CZRWidgetModule.prototype.initialize.call( module, id, options );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR INPUT
          module.inputConstructor = module.inputConstructor.extend( module.CZRWidgetPagesInputMths || {} );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor  = module.itemConstructor.extend( module.CZRWidgetPagesItem || {} );

  },//initialize
  //@override 
  //to use a different viewContentTemplateEl
  // (would be good if it could be an array, so to use always the standard template - only title input - and add other inputs)
  getItemTemplates : function() {
          return {
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-widget-pages-view-content',
          };
  },
  //@override to define the type and the item titel (maybe localized in the future)
  getItemDefaultModel : function() {
          return {
              id                    : '',
              title                 : 'Pages:',
              type                  : 'WP_Widget_Pages',
              'widget-title'        : '',
              'widget-sortby'       : 'post-title',
              'widget-exclude'      : '',
          };
  },
  CZRWidgetPagesInputMths : {
          setupSelect : function() {
                var input   = this,
                    _model  = this.item.get(),
                    _choices = serverControlParams.selectPagesWidgetsortby;

                //generates the options
                _.each( _choices , function( value, k ) {

                      var _attributes = {
                            value : k,
                            html: value
                          };
                      if ( k == _model['widget-sortby'] )
                        $.extend( _attributes, { selected : "selected" } );

                      $( 'select[data-type="widget-sortby"]', input.container ).append( $('<option>', _attributes) );
                });
                //fire select2
                $( 'select[data-type="widget-sortby"]', input.container ).select2();
          },    
  },//CZRwidgetssInputMths
  CZRWidgetPagesItem : {
  }
});