//extends api.Value
//options:
  // id : metas.id,
  // metas_model : metas,
  // defaultMetasModel : module.defaultMetasModel,
  // module : module,
  // is_added_by_user : is_added_by_user || false
var CZRModMetasMths = CZRModMetasMths || {};
$.extend( CZRModMetasMths , {
  //Fired on metas.contentRendered.done()
  //creates the inputs based on the rendered metass
  setupInputCollectionFromDOM : function() {
        var metas = this,
            module = metas.module;

        //INPUTS => Setup as soon as the view content is rendered
        //the metas is a collection of inputs, each one has its own view module.
        metas.czr_Input = new api.Values();

        //this can be overridden by extended classes to add and overrides methods
        metas.inputConstructor = module.inputConstructor;

        if ( _.isEmpty(metas.defaultMetasModel) || _.isUndefined(metas.defaultMetasModel) ) {
          throw new Error('No default model found in metas ' + metas.id + '. Aborting');
        }

        //prepare and sets the metas value on api ready
        //=> triggers the module rendering + DOM LISTENERS
        var metas_model = $.extend( true, {}, metas() );

        if ( ! _.isObject( metas_model ) )
          metas_model = metas.defaultMetasModel;
        else
          metas_model = $.extend( metas.defaultMetasModel, metas_model );

        var dom_metas_model = {};

        //creates the inputs based on the rendered metass
        $( '.' + module.control.css_attr.sub_set_wrapper, metas.container).each( function( _index ) {
              var _id = $(this).find('[data-type]').attr('data-type'),
                  _value = _.has( metas_model, _id) ? metas_model[_id] : '';
              //skip if no valid input data-type is found in this node
              if ( _.isUndefined( _id ) || _.isEmpty( _id ) )
                return;
              //check if this property exists in the current metas model
              if ( ! _.has( metas_model, _id ) ) {
                    throw new Error('The metas property : ' + _id + ' has been found in the DOM but not in the metas model : '+ metas.id + '. The input can not be instantiated.');
              }

              //INSTANTIATE THE INPUT
              metas.czr_Input.add( _id, new metas.inputConstructor( _id, {
                    id : _id,
                    type : $(this).attr('data-input-type'),
                    input_value : _value,
                    container : $(this),
                    metas : metas,
                    module : module
              } ) );

              //FIRE THE INPUT
              //fire ready once the input Value() instance is initialized
              metas.czr_Input(_id).ready();

              //populate the collection
              dom_metas_model[_id] = _value;
              //shall we trigger a specific event when the input collection from DOM has been populated ?

        });//each
  },


  removeInputCollection : function() {
        var metas = this;
        metas.czr_Input.each( function( input ) {
            metas.czr_Input.remove( input.id );
        });
  }


});//$.extend