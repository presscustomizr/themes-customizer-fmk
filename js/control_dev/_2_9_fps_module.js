//extends api.CZRDynModule

var CZRFeaturedPageModuleMths = CZRFeaturedPageModuleMths || {};

$.extend( CZRFeaturedPageModuleMths, {
  initialize: function( id, options ) {
    var module = this;
    //run the parent initialize
    api.CZRDynModule.prototype.initialize.call( module, id, options );

    //extend the module with new template Selectors
    $.extend( module, {
          viewPreAddEl : 'czr-module-fp-pre-add-view-content',
          viewTemplateEl : 'czr-module-item-view',
          viewContentTemplateEl : 'czr-module-fp-view-content',
    } );

    //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
    module.inputConstructor = api.CZRInput.extend( module.CZRFeaturedPagesInputMths || {} );
    //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
    module.itemConstructor = api.CZRItem.extend( module.CZRFeaturedPagesItem || {} );

    //declares a default model
    this.defaultItemModel = {
        id : '',
        title : '' ,
        'fp-post'  : '',
        'fp-title' : '',
        'fp-text'  : '',
        'fp-image' : '',
    };

    //overrides the default success message
    this.itemAddedMessage = serverControlParams.translatedStrings.socialLinkAdded;
    api.section( module.control.section() ).expanded.bind(function(to) {
      if ( ! to || ! _.isEmpty( module.get() ) )
        return;
      module.ready();
    });
  },//initialize



  CZRFeaturedPagesInputMths : {
    ready : function() {
      var input = this;
      //update the item model on fp-post change
      input.bind('fp-post:changed', function(){
        input.updateItemModel();
      });
      //update the item title on fp-title change
      input.bind('fp-title:changed', function(){
        input.updateItemTitle();
      });
      api.CZRInput.prototype.ready.call( input);
    },

    //ACTIONS ON fp-title change
    //Fired on 'fp-title:changed'
    //Don't fire in pre item case
    updateItemModel : function( _new_val ) {

      var input = this,
          item = this.item,
          is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput;

      //check if we are in the pre Item case => if so, the fp-post might be empty
      if ( ! _.has( item.get(), 'fp-post') || _.isEmpty( item.get()['fp-post'] ) )
        return;

      var _new_model  = _.clone( item.get() );

      var _fp_post        = _new_model['fp-post'][0],
          _new_title      = _fp_post.title,
          inputCollection = is_preItemInput ? input.module.czr_preItemInput : item.czr_Input;

      if ( is_preItemInput ) {
        $.extend( _new_model, { title : _new_title, 'fp-title' : _new_title } );
        item.set( _new_model );
      } else {
        item.czr_Input('fp-title').set( _new_title );
      }
    },
    updateItemTitle : function( _new_val ) {
      var input = this,
          item = this.item,
          is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput;

      if ( is_preItemInput )
        return;
      var _new_model  = _.clone( item.get() ),
          _new_title  = _new_model['fp-title'];

      $.extend( _new_model, { title : _new_title} );
      item.set( _new_model );
    },
  },//CZRFeaturedPagesInputMths
  CZRFeaturedPagesItem : {
  }
});