
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {

    //Fired on 'czr-skopes-ready' triggered by the preview, each time the preview is refreshed.
    //On a Save Action, api.czr_savedDirties has been populated =>
    // 1) check if the server sends the same saved values
    // 2) update the skope db properties with the latests saved ones
    //
    //@see api_overrides
    updateSkopeCollection : function( sent_collection, sent_channel ) {
          //api.consoleLog('UPDATE SKOPE COLLECTION', sent_collection, sent_channel );
          var self = this;
              _api_ready_collection = [];

          //normalize the sent skopes
          _.each( sent_collection, function( _skope, _key ) {
                var skope_candidate = $.extend( true, {}, _skope );//deep clone to avoid any shared references
                _api_ready_collection.push( self.prepareSkopeForAPI( skope_candidate ) );
          });

          //keep the global skope unchanged
          //=> this is required because the server always sends an empty set of db options for the global skope, unlike the other skopes
          if ( self.isGlobalSkopeRegistered() ) {
                var _updated_api_ready_collection = [],
                    _global_skp_model = $.extend( true, {}, api.czr_skope( self.getGlobalSkopeId() )() );

                _.each( _api_ready_collection, function( _skp, _k ) {
                      if ( 'global' == _skp.skope )
                        _updated_api_ready_collection.push( _global_skp_model );
                      else
                        _updated_api_ready_collection.push( _skp );
                });
                _api_ready_collection = _updated_api_ready_collection;
          }


          //Shall we update the db values of the skopes ?
          //1) ON A SAVE ACTION, the czr_saveDirties has been populated,
          // => let's check if the server sends the same saved values
          // => update the skope db properties with the latests saved ones
          // => reset the czr_saveDirties to default.
          if ( ! _.isEmpty(api.czr_savedDirties().channel) && sent_channel != api.czr_savedDirties().channel ) {
                var not_sync = [];
                //lets check that we are synchronized
                _.each( api.czr_savedDirties().saved, function( skp_data, skp_id ) {
                      _.each( skp_data, function( _val, _setId ) {
                            //first, let's check if the sent skopes have not changed ( typically, if a user has opened another page in the preview )
                            if ( _.isUndefined( _.findWhere( _api_ready_collection, { id : skp_id} ) ) )
                              return;

                            var sent_skope_db_values = _.findWhere( _api_ready_collection, { id : skp_id} ).db,
                                shortSetId = api.CZR_Helpers.build_setId( _setId ),
                                sent_set_val = sent_skope_db_values[shortSetId];

                            if ( _.isUndefined( sent_set_val ) || ! _.isEqual(sent_set_val, _val ) ) {
                                not_sync.push( { skope_id : skp_id, setId : shortSetId, server_val : sent_set_val, api_val : _val } );
                            }
                      });
                });

                if ( ! _.isEmpty( not_sync) ) {
                    api.consoleLog('SOME SETTINGS HAVE NOT BEEN PROPERLY SAVED : ', not_sync);
                } else {
                    api.consoleLog('ALL RIGHT : SETTING VALUES ARE SYNCHRONIZED BETWEEN THE SERVER AND THE API');
                }

                //then update the skope db values, including the global skope
                $.when( self.updateSavedSkopesDbValues( api.czr_savedDirties().saved ) ).done( function() {
                      api.czr_savedDirties( { channel : '', saved : {} } );
                });

                //finally make sure the api.settings.settings values are always synchronized with the global skope
                self.maybeSynchronizeGlobalSkope();
          }

          //set the new collection of current skopes
          api.czr_currentSkopesCollection( _api_ready_collection );
    },



    prepareSkopeForAPI : function( skope_candidate ) {
          if ( ! _.isObject( skope_candidate ) ) {
              throw new Error('prepareSkopeForAPI : a skope must be an object to be API ready');
          }
          var self = this,
              api_ready_skope = {};

          _.each( serverControlParams.defaultSkopeModel , function( _value, _key ) {
                var _candidate_val = skope_candidate[_key];
                switch( _key ) {
                      case 'title' :
                          if ( ! _.isString( _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : a skope title property must a string');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'long_title' :
                          if ( ! _.isString( _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : a skope title property must a string');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
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
                              throw new Error('prepareSkopeForAPI : missing or invalid dyn type for skope ' + skope_candidate );
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
                      case  'is_forced' :
                          if ( ! _.isUndefined( _candidate_val) && ! _.isBoolean( _candidate_val )  ) {
                              throw new Error('prepareSkopeForAPI : skope property "is_primary" must be a boolean');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      //when the global db values have been changed, typically on save,
                      //the 'db' property will store the difference between api.settings.settings and the db options server generated
                      case  'db' :
                          if ( _.isArray( _candidate_val ) || _.isEmpty( _candidate_val ) )
                            _candidate_val = {};
                          if ( _.isUndefined( _candidate_val) || ! _.isObject( _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : skope property "db" must be an object');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case  'changeset' :
                          if ( _.isArray( _candidate_val ) || _.isEmpty( _candidate_val ) )
                            _candidate_val = {};
                          if ( _.isUndefined( _candidate_val) || ! _.isObject( _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : skope property "changeset" must be an object');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case  'has_db_val' :
                          if ( ! _.isUndefined( _candidate_val) && ! _.isBoolean( _candidate_val )  ) {
                              throw new Error('prepareSkopeForAPI : skope property "has_db_val" must be a boolean');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                }//switch
          });

          //Finally, generate the id and the title
          api_ready_skope.id = api_ready_skope.skope + '_' + api_ready_skope.level;
          if ( ! _.isString( api_ready_skope.id ) || _.isEmpty( api_ready_skope.id ) ) {
              throw new Error('prepareSkopeForAPI : a skope id must a string not empty');
          }
          if ( ! _.isString( api_ready_skope.title ) || _.isEmpty( api_ready_skope.title ) ) {
              api_ready_skope.title = id;
              api_ready_skope.long_title = id;
          }
          return api_ready_skope;
    },


    //cb of api.czr_currentSkopesCollection.callbacks
    //fired in initialize
    currentSkopesCollectionReact : function(to, from) {
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

          //Instantiate the new skopes
          //api.consoleLog('SKOPES TO INSTANTIATE?', _to_instantiate );
          _.each( _to_instantiate, function( _skope ) {
              _skope = $.extend( true, {}, _skope );//use a cloned skop to instantiate : @todo : do we still need that ?
              api.czr_skope.add( _skope.id , new api.CZR_skope( _skope.id , _skope ) );

              //fire this right after instantiation for the views (we need the model instances in the views)
              if ( ! api.czr_skope.has( _skope.id ) ) {
                  throw new Error( 'Skope id : ' + _skope.id + ' has not been instantiated.');
              }
              api.czr_skope( _skope.id ).ready();
          });

          //if the current acive skope has been removed from the current skopes collection
          //=> set relevant scope as active. Falls back on 'global'
          if ( _.isUndefined( _.findWhere( api.czr_currentSkopesCollection(), {id : api.czr_activeSkope() } ) ) )
            api.czr_activeSkope( self.getActiveSkopeId( _new_collection ) );

          //SET THE CONTEXTUALLY ACTIVE SKOPES VISIBILITY AND LAYOUT
          //Which skopes are visible ?
          //=> the ones sent by the preview
          var _activeSkopeNum = _.size( _new_collection ),
              _setLayoutClass = function( _skp_instance ) {
                    //remove previous layout class
                    var _newClasses = _skp_instance.container.attr('class').split(' ');
                    _.each( _skp_instance.container.attr('class').split(' '), function( _c ) {
                          if ( 'width-' == _c.substring( 0, 6) ) {
                              _newClasses = _.without( _newClasses, _c );
                          }
                    });
                    $.when( _skp_instance.container.attr('class', _newClasses.join(' ') ) )
                          .done( function() {
                                //set new layout class
                                _skp_instance.container.addClass( 'width-' + ( Math.round( 100 / _activeSkopeNum ) ) );
                          });
              };
          api.czr_skope.each( function( _skp_instance ){
                if ( _.isUndefined( _.findWhere( _new_collection, { id : _skp_instance().id } ) ) ) {
                      _skp_instance.visible(false);
                }
                else {
                      _skp_instance.visible(true);
                      if ( 'pending' == _skp_instance.embedded.state() ) {
                            _skp_instance.embedded.then( function() {
                                  _setLayoutClass( _skp_instance );
                            });
                      } else {
                            _setLayoutClass( _skp_instance );
                      }
                }
          } );

          //ON INITIAL COLLECTION POPULATE, RESOLVE THE DEFERRED STATE
          //=> this way we can defer earlier actions.
          //For example when autofocus is requested, the section might be expanded before the initial skope collection is sent from the preview.
          if ( _.isEmpty(from) && ! _.isEmpty(to) )
            api.czr_initialSkopeCollectionPopulated.resolve();

          //MAKE SURE TO SYNCHRONIZE api.settings.settings with the current global skope updated db values
          self.maybeSynchronizeGlobalSkope();

    },//listenToSkopeCollection()


    //fired in updateSkopeCollection
    maybeSynchronizeGlobalSkope : function() {
          var self = this;
          if ( self.isGlobalSkopeRegistered() ) {
                var _global_skp_db_values = api.czr_skope( self.getGlobalSkopeId() )().db;
                _.each( _global_skp_db_values, function( _val, shortSetId ){
                      var wpSetId = api.CZR_Helpers.build_setId( shortSetId );
                      if ( ! _.isEqual( api.settings.settings[wpSetId].value, _val ) ) {
                          api.settings.settings[wpSetId].value = _val;
                      }
                });
                //api.consoleLog('GLOBAL SKOPE HAS BEEN SYNCHRONIZED WITH THE API.');
          }
    },

    //fired in updateSkopeCollection
    updateSavedSkopesDbValues : function( _saved_dirties ) {
          _.each( _saved_dirties, function( _dirties, _skope_id ) {
                var _current_model = $.extend( true, {}, api.czr_skope( _skope_id )() ),
                    _new_db_val = ! _.isObject( _current_model.db ) ? {} : $.extend( true, {}, _current_model.db ),
                    _api_ready_dirties = {};
                //build the api ready db value for the skope.
                //=> it the full name, ex : 'hu_theme_options[background_color]'
                _.each( _dirties, function( _val, _wp_opt_name ) {
                      //var _k = api.CZR_Helpers.getOptionName( _wp_opt_name );
                      _api_ready_dirties[_wp_opt_name] = _val;
                });

                api.consoleLog('IN UPDATE SAVED SKOPES DB VALUES', _skope_id, _saved_dirties, _new_db_val, _api_ready_dirties);
                //merge current and new
                $.extend( _new_db_val, _api_ready_dirties );

                $.extend( _current_model, { db : _new_db_val, has_db_val : ! _.isEmpty(_api_ready_dirties) } );
                api.czr_skope( _skope_id )( _current_model );
          });
    },
});//$.extend