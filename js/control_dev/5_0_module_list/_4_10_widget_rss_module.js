//extends api.CZRWidgetModule

var CZRWidgetRSSModuleMths = CZRWidgetRSSModuleMths || {};

$.extend( CZRWidgetRSSModuleMths, {
  initialize: function( id, options ) {
          var module = this;

          //run the parent initialize
          api.CZRWidgetModule.prototype.initialize.call( module, id, options );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR INPUT
          module.inputConstructor = module.inputConstructor.extend( module.CZRWidgetRSSInputMths || {} );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor  = module.itemConstructor.extend( module.CZRWidgetRSSItem || {} );

  },//initialize
  //@override 
  //to use a different viewContentTemplateEl
  // (would be good if it could be an array, so to use always the standard template - only title input - and add other inputs)
  getItemTemplates : function() {
          return {
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-widget-rss-view-content',
          };
  },
  //@override to define the type and the item titel (maybe localized in the future)
  getItemDefaultModel : function() {
          return {
              id                    : '',
              title                 : 'RSS:',
              type                  : 'WP_Widget_RSS',
              'widget-title'        : '',
              'widget-items'        : 10,
              'widget-show_summary' : false,
              'widget-show_date'    : false,
              'widget-show_author'  : false
          };
  },
  CZRWidgetRSSInputMths : {
          setupSelect : function() {
                var input    = this,
                    _model   = this.item.get(),
                    //do we have to localize the numbers?
                    _choices = _.range(10, 20);

                //generates the options
                _.each( _choices , function( value ) {

                      var _attributes = {
                            value : value,
                            html: value
                          };
                      if ( value == _model['widget-items'] )
                        $.extend( _attributes, { selected : "selected" } );

                      $( 'select[data-type="widget-items"]', input.container ).append( $('<option>', _attributes) );
                });
                //fire select2
                $( 'select[data-type="widget-items"]', input.container ).select2();
          }, 
  },//CZRwidgetssInputMths
  CZRWidgetRSSItem : {
  }
});