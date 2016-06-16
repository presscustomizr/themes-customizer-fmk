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
          setupSelect : function() {
                var input      = this,
                    item       = input.item,
                    request,
                    _model     = item.get(),
                    $_select   = $( 'select[data-type="widget-nav_menu"]', input.container );

                $_select.hide();

                request = wp.ajax.post( 'load-nav-menus', {
                    'wp_customize'    : 'on',
                    'CZRWidgetsNonce' : serverControlParams.CZRWidgetsNonce 
                });
                  
                request.fail( function( data ) {
                  /* TODO HANDLE UNAVAILABILITY */
                  if ( typeof console !== 'undefined' && console.error ) {
                    console.error( data );
                  }
                });

                request.done( function( data ) {
                  var navs = data;

                  _.each( navs , function( nav, k ) {
                      var _attributes = {
                        value : nav.id,
                        html: nav.title
                      };
                      if ( nav.id == _model['widget-nav_menu'] )
                        $.extend( _attributes, { selected : "selected" } ); 
                    
                    $_select.append( $('<option>', _attributes) );
                  });

                  //fire select2
                  $_select.select2({
                    'placeholder' : { id: '', text : 'Select' /* TODO:localize */ }
                  })
                  .show();
                });
          },          
  },//CZRwidgetssInputMths
  CZRWidgetCustomMenuItem : {
  }
});