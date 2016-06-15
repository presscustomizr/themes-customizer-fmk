//extends api.CZRDynModule

var CZRWidgetCalendarModuleMths = CZRWidgetCalendarModuleMths || {};

$.extend( CZRWidgetCalendarModuleMths, {
  initialize: function( id, options ) {
          var module = this;

          //run the parent initialize
          api.CZRWidgetModule.prototype.initialize.call( module, id, options );

          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR INPUT
          module.inputConstructor = module.inputConstructor.extend( module.CZRWidgetCalendarInputMths || {} );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor  = module.itemConstructor.extend( module.CZRWidgetCalendarItem || {} );
  },//initialize
  //@override to define the type and the item titel (maybe localized in the future)
  getItemDefaultModel : function() {
          return {
              id             : '',
              title          : 'Calendar:',
              'widget-title' : '',
              type           : 'WP_Widget_Calendar'
          };
  },
  CZRWidgetCalendarInputMths : {
  },//CZRwidgetssInputMths
  CZRWidgetCalendarItem : {
  }
});