//extends api.Value
//options:
  // id : modOpt.id,
  // modOpt_model : modOpt,
  // defaultModOptModel : module.defaultModOptModel,
  // module : module,
  // is_added_by_user : is_added_by_user || false
var CZRModOptMths = CZRModOptMths || {};
$.extend( CZRModOptMths , {
  //Fired on user click
  //creates the inputs based on the rendered modOpts
  setupInputCollectionFromDOM : function() {
        var modOpt = this,
            module = modOpt.module;

        //bail if already done
        if ( _.has( modOpt, 'czr_Input') && ! _.isEmpty( modOpt.inputCollection() ) )
          return;

        //INPUTS => Setup as soon as the view content is rendered
        //the modOpt is a collection of inputs, each one has its own view module.
        modOpt.czr_Input = new api.Values();

        //this can be overridden by extended classes to add and overrides methods
        modOpt.inputConstructor = module.inputModOptConstructor;

        if ( _.isEmpty(modOpt.defaultModOptModel) || _.isUndefined(modOpt.defaultModOptModel) ) {
          throw new Error('No default model found in modOpt ' + modOpt.id + '. Aborting');
        }

        //prepare and sets the modOpt value on api ready
        //=> triggers the module rendering + DOM LISTENERS
        var modOpt_model = $.extend( true, {}, modOpt() );

        if ( ! _.isObject( modOpt_model ) )
          modOpt_model = modOpt.defaultModOptModel;
        else
          modOpt_model = $.extend( modOpt.defaultModOptModel, modOpt_model );

        var dom_modOpt_model = {};

        //creates the inputs based on the rendered modOpts
        $( '.' + module.control.css_attr.sub_set_wrapper, modOpt.container).each( function( _index ) {
              var _id = $(this).find('[data-type]').attr('data-type'),
                  _value = _.has( modOpt_model, _id) ? modOpt_model[_id] : '';
              //skip if no valid input data-type is found in this node
              if ( _.isUndefined( _id ) || _.isEmpty( _id ) ) {
                    api.consoleLog('setupInputCollectionFromDOM : missing data-type for ' + module.id );
                    return;
              }
              //check if this property exists in the current modOpt model
              if ( ! _.has( modOpt_model, _id ) ) {
                    throw new Error('The modOpt property : ' + _id + ' has been found in the DOM but not in the modOpt model : '+ modOpt.id + '. The input can not be instantiated.');
              }

              //INSTANTIATE THE INPUT
              modOpt.czr_Input.add( _id, new modOpt.inputConstructor( _id, {
                    id : _id,
                    type : $(this).attr('data-input-type'),
                    input_value : _value,
                    container : $(this),
                    input_parent : modOpt,
                    is_mod_opt : true,
                    module : module
              } ) );

              //FIRE THE INPUT
              //fire ready once the input Value() instance is initialized
              modOpt.czr_Input(_id).ready();

              //populate the collection
              dom_modOpt_model[_id] = _value;
              //shall we trigger a specific event when the input collection from DOM has been populated ?
        });//each

        //stores the collection
        modOpt.inputCollection( dom_modOpt_model );
        return this;
  },


  removeInputCollection : function() {
        var modOpt = this;
        modOpt.czr_Input.each( function( input ) {
            modOpt.czr_Input.remove( input.id );
        });
        modOpt.inputCollection({});
  }


});//$.extend