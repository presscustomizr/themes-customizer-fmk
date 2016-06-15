//extends api.CZRModule

var CZRWidgetModuleMths = CZRWidgetModuleMths || {};

$.extend( CZRWidgetModuleMths, {
  initialize: function( id, options ) {
          var module = this;

          //run the parent initialize
          api.CZRModule.prototype.initialize.call( module, id, options );

          //extend the module with new template Selectors
          $.extend( module, this.getItemTemplates() );

          //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
          module.inputConstructor = api.CZRInput.extend( module.CZRWidgetInputMths || {} );
          //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor  = api.CZRItem.extend( module.CZRWidgetItem || {} );

          //declares a default model
          this.defaultItemModel   = this.getItemDefaultModel();

          //this is a static module. We only have one item
          module.savedItems = _.isEmpty( options.items ) ? [ module._initNewItem( module.defaultItemModel ) ] : options.items;

          api.section( module.control.section() ).expanded.bind(function(to) {
            if ( ! to || ! _.isEmpty( module.get() ) )
              return;
            module.ready();
          });
  },//initialize
  getItemTemplates : function() {
          return {
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-widget-view-content',
          };
  },
  getItemDefaultModel : function() {
          return {
              id             : '',
              title          : '',
              'widget-title' : '',
              type           : ''
          };
  },
  CZRWidgetInputMths : {
          ready : function() {
                var input = this;
                //update the item title on search widget title change
                input.bind('widget-title:changed', function(){
                  input.updateItemTitle();
                });
                api.CZRInput.prototype.ready.call( input);
          },
          setupIcheck : function( obj ) {
                var input      = this;

                $( 'input[type=checkbox]', input.container ).each( function(e) {
                      if ( 0 !== $(this).closest('div[class^="icheckbox"]').length )
                        return;

                      $(this).iCheck({
                            checkboxClass: 'icheckbox_flat-grey',
                            checkedClass: 'checked',
                            radioClass: 'iradio_flat-grey',
                      })
                      .on( 'ifChanged', function(e){
                            $(this).val( false === $(this).is(':checked') ? 0 : 1 );
                            $(e.currentTarget).trigger('change');
                      });
                });
          },
          setupStepper: function( obj ) {
                var input     = this;
                  
                $('input[type="number"]', input.container ).each( function() {

                  $(this).stepper();
                });
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
  CZRWidgetItem : {
  }
});