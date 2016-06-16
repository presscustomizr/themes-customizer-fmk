//extends api.CZRWidgetModule

var CZRWidgetTagCloudModuleMths = CZRWidgetTagCloudModuleMths || {};

$.extend( CZRWidgetTagCloudModuleMths, {
  initialize: function( id, options ) {
          var module = this;

          //run the parent initialize
          api.CZRWidgetModule.prototype.initialize.call( module, id, options );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR INPUT
          module.inputConstructor = module.inputConstructor.extend( module.CZRWidgetTagCloudInputMths || {} );
          //EXTEND THE WIDGET BASE CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor  = module.itemConstructor.extend( module.CZRWidgetTagCloudItem || {} );
  },//initialize
  //@override 
  //to use a different viewContentTemplateEl
  // (would be good if it could be an array, so to use always the standard template - only title input - and add other inputs)
  getItemTemplates : function() {
          return {
                viewTemplateEl : 'czr-module-item-view',
                viewContentTemplateEl : 'czr-module-widget-tag_cloud-view-content',
          };
  },
  //@override to define the type and the item titel (maybe localized in the future)
  getItemDefaultModel : function() {
          return {
              id                    : '',
              title                 : 'Tag Cloud:',
              type                  : 'WP_Widget_Tag_Cloud',
              'widget-taxonomy'     : '',
          };
  },
  CZRWidgetTagCloudInputMths : {
          setupSelect : function() {
                var input      = this,
                    item       = input.item,
                    request,
                    _model     = item.get(),
                    $_select   = $( 'select[data-type="widget-taxonomy"]', input.container );

                $_select.hide();

                request = wp.ajax.post( 'load-tag-cloud-taxonomies', {
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
                  var taxonomies = data;

                  _.each( taxonomies , function( tax, k ) {
                      var _attributes = {
                        value : tax.id,
                        html: tax.title
                      };

                      if ( tax.id == _model['widget-taxonomy'] )
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
  CZRWidgetTagCloudItem : {
  }
});