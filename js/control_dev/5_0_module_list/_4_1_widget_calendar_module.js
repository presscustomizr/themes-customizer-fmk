//extends api.CZRDynModule

var CZRWidgetCalendarModuleMths = CZRWidgetCalendarModuleMths || {};

$.extend( CZRWidgetCalendarModuleMths, {
  initialize: function( id, options ) {
          var module = this;

          //run the parent initialize
          api.CZRModule.prototype.initialize.call( module, id, options );

          //extend the module with new template Selectors
          $.extend( module, {
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-widget-calendar-view-content',
          } );
          //*/

          //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
          module.inputConstructor = api.CZRInput.extend( module.CZRWidgetCalendarInputMths || {} );
          //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor = api.CZRItem.extend( module.CZRWidgetCalendarItem || {} );

          //declares a default model
          this.defaultItemModel = {
              id : '',
              title : 'Calendar: ',
              'widget-title' : '',
          };

          //console.log(' NEW TEXT MODEL : ', module._initNewItem( module.defaultItemModel ) );

          //this is a static module. We only have one item
          module.savedItems = _.isEmpty( options.items ) ? [ module._initNewItem( module.defaultItemModel ) ] : options.items;

          api.section( module.control.section() ).expanded.bind(function(to) {
            if ( ! to || ! _.isEmpty( module.get() ) )
              return;
            module.ready();
          });
  },//initialize


  CZRWidgetCalendarInputMths : {
          ready : function() {
                var input = this;
                //update the item title on search widget title change
                input.bind('widget-title:changed', function(){
                  input.updateItemTitle();
                });
                api.CZRInput.prototype.ready.call( input);
          },
      
          //ACTIONS ON slide-title change
          //Fired on 'slide-title:changed'
          //Don't fire in pre item case
          updateItemTitle : function( _new_val ) {
                var input = this,
                    item = this.item;

                var _new_model  = _.clone( item.get() ),
                    _new_title  = _new_model.title.substr(0, _new_model.title.indexOf(':') + 1) + _new_model['widget-title'];

                $.extend( _new_model, { title : _new_title} );
                item.set( _new_model );
          },
  },//CZRwidgetssInputMths
  CZRWidgetCalendarItem : {
  }
});