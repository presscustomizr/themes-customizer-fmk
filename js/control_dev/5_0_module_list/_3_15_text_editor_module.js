//extends api.CZRDynModule

var CZRTextEditorModuleMths = CZRTextEditorModuleMths || {};

$.extend( CZRTextEditorModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          //run the parent initialize
          api.CZRDynModule.prototype.initialize.call( module, id, options );

          //this module is not sortable
          module.is_sortable = false;

          //extend the module with new template Selectors
          $.extend( module, {
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-text_editor-view-content',
          } );

          //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
          module.inputConstructor = api.CZRInput.extend( module.CZRTextEditorInputMths || {} );
          //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor = api.CZRItem.extend( module.CZRTextEditorItem || {} );

          //declares a default model
          this.defaultItemModel   = {
            id : '',
            text: ''
          };

         //overrides the default success message
          this.itemAddedMessage = serverControlParams.translatedStrings.featuredPageAdded;
          api.section( module.control.section() ).expanded.bind(function(to) {
            if ( 'resolved' == module.isReady.state() )
                  return;
            module.ready();
          });
  },//initialize




  CZRTextEditorInputMths : {
  },//CZRTextEditorsInputMths



  CZRTextEditorItem : {

  },
});