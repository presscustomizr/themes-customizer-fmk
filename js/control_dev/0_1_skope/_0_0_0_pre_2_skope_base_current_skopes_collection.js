
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {

    //fired on 'czr-skopes-ready' triggered by the preview
    //@see api_overrides
    updateSkopeCollection : function( sent_collection ) {
          console.log('skope Collection sent by preview ?', sent_collection );
          var self = this;
              _api_ready_collection = [];
          _.each( sent_collection, function( _skope, _key ) {
              _api_ready_collection.push( self.prepareSkopeForAPI( _skope ) );
          });
          //set the new collection of current skopes
          api.czr_currentSkopesCollection( _api_ready_collection );
    },




    //setup the czr_currentSkopesCollection callbacks
    //fired in initialize
    currentSkopesCollectionReact : function(to, from) {
          console.log('SKOPES SENT BY THE PREVIEW, FROM AND TO : ', from, to);
          var self = this,
              _new_collection = $.extend( true, [], to ) || [],
              _old_collection = $.extend( true, [], from ) || [];

          //what are the skope to instantiate ?
          //=>on init, instantiate them all
          //=>on refresh, instantiate the new ones and remove the non relevant
          var _to_instantiate = [];
          var _to_remove = [];
          var _to_update = [];

          //TO INSTANTIATE
          _.each( _new_collection, function( _sent_skope ) {
              if ( ! api.czr_skope.has( _sent_skope.id  ) )
                _to_instantiate.push( _sent_skope );
          });


          _to_update = _.filter( _new_collection, function( _skope ) {
              if ( api.czr_skope.has(_skope.id) ) {
                // console.log('in to update', _skope.id);
                // console.log('has changed', _skope.id, ! _.isEqual( api.czr_skope( _skope.id)(), _skope ) );
                // console.log('skope API model', api.czr_skope( _skope.id )() );
                // console.log('collection model', _skope );
                // console.log('server sent model', _.findWhere( _new_collection , { id : _skope.id } ) );
                return ! _.isEqual( api.czr_skope( _skope.id)(), _skope );
              }
              return false;
          });

          console.log( '_to_instantiate', _to_instantiate);
          console.log( '_to_update', _to_update);

          //Update the skope models
          _.each( _to_update, function( _skope ) {
              var _new_model = $.extend( api.czr_skope( _skope.id )(), _skope );
              if ( 'global' == _skope.skope  ) {
                  _new_model.db = self.getChangedGlobalDBSettingValues( _skope.db );
              }
              api.czr_skope( _skope.id )( _new_model );
          });



          //Instantiate the new skopes
          _.each( _to_instantiate, function( _skope ) {
              var params = $.extend( true, {}, _skope );//IMPORTANT => otherwise the data object is actually a copy and share the same reference as the model and view params
              api.czr_skope.add( _skope.id , new api.CZR_skope( _skope.id , _skope ) );

              //fire this right after instantiation for the views (we need the model instances in the views)
              if ( ! api.czr_skope.has( _skope.id ) ) {
                  throw new Error( 'Skope id : ' + _skope.id + ' has not been instantiated.');
              }
              api.czr_skope( _skope.id ).ready();
          });


          //Which skope is active ? @todo improve this, not working on preview page change
          //on init
          //OR
          //if the current acive skope has been removed from the collection
          //=> set relevant scope as active. Falls back on 'global't
          api.czr_activeSkope( self.getActiveSkope( _new_collection ) );


          //Which skopes are visible ?
          //=> the ones sent by the preview
          api.czr_skope.each( function( _skp_instance ){
              if ( _.isUndefined( _.findWhere( _new_collection, { id : _skp_instance().id } ) ) )
                _skp_instance.visible(false);
              else
                _skp_instance.visible(true);
          } );


          //TO REMOVE
          // api.czr_skope.each( function( _skope ){
          //     if ( _.isUndefined( _.findWhere( _new_collection, { opt_name : _skope().id } ) ) )
          //         _to_remove.push( _skope() );
          // });

          //Destroy the previous scopes views and models
          // _.each( _to_remove, function( _skope ) {
          //     //remove the view DOM el
          //     api.czr_skope( _skope.id ).container.hide();
          //     //remove the model from the collection
          //     api.czr_skope.remove( _skope.id );
          // });
    },//listenToSkopeCollection()



    prepareSkopeForAPI : function( skope_candidate ) {
          if ( ! _.isObject( skope_candidate ) ) {
              throw new Error('prepareSkopeForAPI : a skope must be an object to be API ready');
          }
          var self = this,
              api_ready_skope = {};

          _.each( serverControlParams.defaultSkopeModel , function( _value, _key ) {
                var _candidate_val = skope_candidate[_key];
                switch( _key ) {
                      case 'skope' :
                          if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : a skope "skope" property must a string not empty');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'level' :
                          if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : a skope level must a string not empty for skope ' + _candidate_val.skope );
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'dyn_type' :
                          if ( ! _.isString( _candidate_val ) || ! _.contains( serverControlParams.skopeDynTypes, _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : missing or invalid dyn type for skope ' + _candidate_val.skope );
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'opt_name' :
                          if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : invalid "opt_name" property for skope ' + _candidate_val.skope );
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'obj_id' :
                          if ( ! _.isString( _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : invalid "obj_id" for skope ' + _candidate_val.skope );
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case  'is_default' :
                          if ( ! _.isUndefined( _candidate_val) && ! _.isBoolean( _candidate_val )  ) {
                              throw new Error('prepareSkopeForAPI : skope property "is_default" must be a boolean');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case  'is_winner' :
                          if ( ! _.isUndefined( _candidate_val) && ! _.isBoolean( _candidate_val )  ) {
                              throw new Error('prepareSkopeForAPI : skope property "is_winner" must be a boolean');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case  'is_primary' :
                          if ( ! _.isUndefined( _candidate_val) && ! _.isBoolean( _candidate_val )  ) {
                              throw new Error('prepareSkopeForAPI : skope property "is_primary" must be a boolean');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      //when the global db values have been changed, typically on save,
                      //the 'db' property will store the difference between api.settings.settings and the db options server generated
                      case  'db' :
                          if ( _.isUndefined( _candidate_val) && ! _.isArray( _candidate_val ) && ! _.isObject( _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : skope property "db" must be a empty array or an object');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                }//switch
          });

          //Finally, generate the id
          api_ready_skope.id = api_ready_skope.skope + '_' + api_ready_skope.level;
          if ( ! _.isString( api_ready_skope.id ) || _.isEmpty( api_ready_skope.id ) ) {
              throw new Error('prepareSkopeForAPI : a skope id must a string not empty');
          }

          return api_ready_skope;
    }
});//$.extend