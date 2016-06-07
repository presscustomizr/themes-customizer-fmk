//MULTI CONTROL CLASS
//extends api.CZRBaseControl
//
//Setup the collection of items
//renders the element view
//Listen to items collection changes and update the control setting

var CZRElementMths = CZRElementMths || {};

$.extend( CZRElementMths, {


  //Returns the default item defined in initialize
  //Each chid class can override the default item and the following method
  getDefaultModel : function( id ) {
          var element = this;
          return $.extend( _.clone(element.defaultItem), { id : id || '' } );
  },



  //////////////////////////////////
  ///MODEL HELPERS
  //////////////////////////////////
  //make sure the item and it's properties are ready to be added to the collection
  //a item should :
  //1) be an object
  //2) have a unique id
  //3) have all the default properties set (default item is defined in each child class initialize() method)
  _normalizeItem : function( item, key ) {
          if ( ! _.isObject(item) )
            return;
          //id unicity
          item = this._initNewItem(item, key);
          return item;
  },

  //helper
  //@return bool
  _isItemIdPossible : function( _id ) {
          var element = this,
              _collection = _.clone( element.get() );
          return ! _.isEmpty(_id) && ! _.findWhere( _collection, { id : _id });
  },

  //the job of this function is to return a new item ready to be added to the collection
  //the new item shall have a unique id
  //!!recursive
  _initNewItem : function( _item , _next_key ) {
          var element = this,
              _new_item = { id : '' },
              _id;

          //get the next available key of the collection
          _next_key = 'undefined' != typeof(_next_key) ? _next_key : _.size( element.get() );

          if ( _.isNumber(_next_key) ) {
            _id = element.type + '_' + _next_key;
          }
          else {
            _id = _next_key;
            //reset next key to 0 in case a recursive loop is needed later
            _next_key = 0;
          }

          if ( _item && ! _.isEmpty( _item) )
            _new_item = $.extend( _item, { id : _id } );
          else
            _new_item = this.getDefaultModel( _id );

          //check the id existence, and its unicity
          if ( _.has(_new_item, 'id') && element._isItemIdPossible(_id) ) {
            //make sure that the provided item has all the default properties set
            _.map( element.getDefaultModel() , function( value, property ){
              if ( ! _.has(_new_item, property) )
                _new_item[property] = value;
            });

            return _new_item;
          }

          //if id already exists, then test a new one
          return element._initNewItem( _new_item, _next_key + 1);
  }

});//$.extend