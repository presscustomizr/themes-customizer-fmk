//extends api.Value
//options:
  // id : item.id,
  // item_model : item,
  // defaultItemModel : module.defaultItemModel,
  // module : module,
  // is_added_by_user : is_added_by_user || false
var CZRItemMths = CZRItemMths || {};
$.extend( CZRItemMths , {
  //Fired on 'contentRendered'
  //creates the inputs based on the rendered items
  setupInputCollectionFromDOM : function() {
        var item = this,
            module = item.module;

        //INPUTS => Setup as soon as the view content is rendered
        //the item is a collection of inputs, each one has its own view module.
        item.czr_Input = new api.Values();

        //this can be overridden by extended classes to add and overrides methods
        item.inputConstructor = module.inputConstructor;

        if ( _.isEmpty(item.defaultItemModel) || _.isUndefined(item.defaultItemModel) ) {
          throw new Error('No default model found in item ' + item.id + '. Aborting');
        }

        //prepare and sets the item value on api ready
        //=> triggers the module rendering + DOM LISTENERS
        var item_model = $.extend( true, {}, item() );

        if ( ! _.isObject( item_model ) )
          item_model = item.defaultItemModel;
        else
          item_model = $.extend( item.defaultItemModel, item_model );

        var dom_item_model = {};

        //creates the inputs based on the rendered items
        $( '.' + module.control.css_attr.sub_set_wrapper, item.container).each( function( _index ) {
              var _id = $(this).find('[data-type]').attr('data-type'),
                  _value = _.has( item_model, _id) ? item_model[_id] : '';
              //skip if no valid input data-type is found in this node
              if ( _.isUndefined( _id ) || _.isEmpty( _id ) )
                return;
              //check if this property exists in the current item model
              if ( ! _.has( item_model, _id ) ) {
                    throw new Error('The item property : ' + _id + ' has been found in the DOM but not in the item model : '+ item.id + '. The input can not be instantiated.');
              }

              //INSTANTIATE THE INPUT
              item.czr_Input.add( _id, new item.inputConstructor( _id, {
                    id : _id,
                    type : $(this).attr('data-input-type'),
                    input_value : _value,
                    container : $(this),
                    input_parent : item,
                    module : module
              } ) );

              //FIRE THE INPUT
              //fire ready once the input Value() instance is initialized
              item.czr_Input(_id).ready();

              //populate the collection
              dom_item_model[_id] = _value;
              //shall we trigger a specific event when the input collection from DOM has been populated ?

        });//each

        //stores the collection
        item.inputCollection( dom_item_model );
  },


  removeInputCollection : function() {
        var item = this;
        item.czr_Input.each( function( input ) {
            item.czr_Input.remove( input.id );
        });
        item.inputCollection({});
  }


});//$.extend