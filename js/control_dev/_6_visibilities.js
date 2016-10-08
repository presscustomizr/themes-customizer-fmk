
(function (api, $, _) {
  var $_nav_section_container,
      translatedStrings = serverControlParams.translatedStrings || {};

  api.bind( 'ready' , function() {
    if ( ! _.has( api, 'czr_visibilities') )
      api.czr_visibilities = new api.CZR_visibilities();
  } );


  api.CZR_visibilities = api.Class.extend( {
          dominosDeps : [],
          initialize: function() {
                var self = this;

                this.defaultDominusParams = {
                      dominus : '',
                      servos : [],
                      visibility : null,
                      actions : null,
                      onSectionExpand : true
                };

                //store the default control dependencies
                this.dominosDeps = _.extend( this.dominosDeps, this._getControlDeps() );
                if ( ! _.isArray( self.dominosDeps ) ) {
                    throw new Error('Visibilities : the dominos dependency array is not an array.');
                }
                api.czr_activeSectionId.bind( function( section_id ) {
                    self.setServosVisibility( section_id );
                });

                //FAVICON SPECIFICS
                //@todo => move to the theme ?
                //favicon note on load and on change(since wp 4.3)
                this._handleFaviconNote();
          },


          //map each setting with its dependencies
          //@param _id.
          //This method can take the setId param.
          //=> useful if a control has been re-rendered on skope switch to re-bind the visibility actions
          setServosVisibility : function( section_id, _id ) {
                var self = this, params;

                if ( ! _.isUndefined( _id ) && api.control.has( api.CZR_Helpers.build_setId( _id ) ) ) {
                          params = self._prepareDominusParams( self.dominosDeps[_id] );
                          self._processDominusCallbacks( _id, params );
                    }
                else
                    {
                          if ( _.isUndefined( section_id ) || ! api.section.has( section_id ) ) {
                            throw new Error( 'Visibilities : the section_id is missing or not registered : ' + section_id );
                          }
                          _.each( self.dominosDeps , function( params ) {
                                params = self._prepareDominusParams( params );
                                var wpDominusId = api.CZR_Helpers.build_setId( params.dominus );
                                if ( api.control( wpDominusId ).section() != section_id )
                                  return;
                                self._processDominusCallbacks( params.dominus, params );
                          });
                    }




                //check if the current expanded section contains controls for which the visibility can be set by a setting not included in this section.
                //Let's call this setting external
                //if so, then don't wait for this external setting to be bound on section expansion. Prepare its visibilities now.
                // api.czr_activeSectionId.bind( function( current_section_id ){
                //     var _ctrls = api.CZR_Helpers.getSectionControlIds( current_section_id ),
                //         _earlyPrepare = [];

                //     console.log('PRRRRRRRRRRRRRROUT', current_section_id, _ctrls );
                //     //create the list of early preparation controls
                //     _.each( _ctrls, function( intSetId ) {
                //           var _shortSetId = api.CZR_Helpers.getOptionName( intSetId );

                //           _.each( self.dominosDeps, function( data, extSetId ){
                //                 var _wpExtSetId = api.CZR_Helpers.build_setId( extSetId );

                //                 if ( ! api.control.has(_wpExtSetId) || api.control( _wpExtSetId ).section() == current_section_id )
                //                   return;

                //                 if ( ! _.contains( data.controls, _shortSetId ) || ! api.control.has( intSetId ) )
                //                   return;
                //                 if ( ! _.contains(_earlyPrepare, extSetId ) )
                //                   _earlyPrepare.push( extSetId );
                //           } );
                //     });

                //     //prepare
                //     _.each( _earlyPrepare, function( _id ){
                //           console.log('A MATCH HAS BEEN FOUND => extSetId is : ', _id);
                //           o = self.dominosDeps[_id];
                //           $.extend( o, { onSectionExpand : false } );
                //           //self._processDominusCallbacks( _id, o );
                //     });

                // });
          },


          /*
          * @return void
          * show or hide setting according to the dependency + callback pair
          * @params setId = the short setting id, whitout the theme option prefix OR the WP built-in setting
          * @params o = { controls [], callback fn, onSectionExpand bool }
          */
          _processDominusCallbacks : function( shortDominusId, dominusParams ) {
                var self = this,
                    wpDominusId = api.CZR_Helpers.build_setId( shortDominusId ),
                    dominusSetInst = api( wpDominusId );

                //loop on the dominus servos and apply + bind the visibility cb
                _.each( dominusParams.servos , function( servusShortSetId ) {
                        if ( ! api.control.has( api.CZR_Helpers.build_setId( servusShortSetId ) ) ) {
                            return;
                        }
                        //set visibility when control is embedded
                        //or when control is added to the api
                        //=> solves the problem of visibility callbacks lost when control are re-rendered
                        var _fireDominusCallbacks = function( dominusSetVal, servusShortSetId, dominusParams ) {
                                  var _toFire = [],
                                      _args = arguments;
                                  _.each( dominusParams, function( _item, _key ) {
                                        switch( _key ) {
                                            case 'visibility' :
                                                self._setVisibility.apply( null, _args );
                                            break;
                                            case 'actions' :
                                                if ( _.isFunction( _item ) )
                                                    _item.apply( null, _args );
                                            break;
                                        }
                                  });
                            },
                            _deferCallbacks = function( dominusSetVal ) {
                                  dominusSetVal = dominusSetVal  || dominusSetInst();
                                  var wpServusSetId = api.CZR_Helpers.build_setId( servusShortSetId );
                                  if ( api.control.has( wpServusSetId ) ) {
                                        if ( 'resolved' == api.control( wpServusSetId ).deferred.embedded.state() ) {
                                              _fireDominusCallbacks( dominusSetVal, servusShortSetId, dominusParams );
                                        } else {
                                              api.control( wpServusSetId ).deferred.embedded.then( function(){
                                                    _fireDominusCallbacks( dominusSetVal, servusShortSetId, dominusParams );
                                              });
                                        }
                                  } else {
                                        api.control.when( wpServusSetId, function() {
                                            api.control( wpServusSetId ).deferred.embedded.then( function(){
                                                  _fireDominusCallbacks( dominusSetVal, servusShortSetId, dominusParams );
                                            });
                                        });
                                  }
                            };


                        //APPLY THE VISIBILITY
                        _deferCallbacks();

                        //BIND THE DOMINUS SETTING INSTANCE
                        //store the visibility bound state
                        if ( ! _.has( dominusSetInst, 'czr_visibilityServos' ) )
                            dominusSetInst.czr_visibilityServos = new api.Value( [] );

                        //Maybe bind to react on setting _dirty change
                        var _currentDependantBound = dominusSetInst.czr_visibilityServos();
                        //Make sure a dependant visibility action is bound only once for a setting id to another setting control id
                        if ( ! _.contains( _currentDependantBound, servusShortSetId ) ) {
                              dominusSetInst.bind( function( dominusSetVal ) {
                                  _deferCallbacks( dominusSetVal );
                              });
                              dominusSetInst.czr_visibilityServos( _.union( _currentDependantBound, [ servusShortSetId ] ) );
                        }
                } );//_.each
          },



          //@return void()
          _setVisibility : function ( dominusSetVal, servusShortSetId, dominusParams ) {
                var wpServusSetId = api.CZR_Helpers.build_setId( servusShortSetId ),
                    visibility = dominusParams.visibility( dominusSetVal, servusShortSetId, dominusParams.dominus );

                //Allows us to filter between visibility callbacks and other actions
                //a non visibility callback shall return null
                if ( ! _.isBoolean( visibility ) || 'unchanged' == visibility )
                  return;
                api.control( wpServusSetId, function( _controlInst ) {
                      var _args = {
                            duration : 'fast',
                            completeCallback : function() {},
                            unchanged : false
                      };

                      if ( _.has( _controlInst, 'active' ) )
                        visibility = visibility && _controlInst.active();

                      if ( _.has( _controlInst, 'defaultActiveArguments' ) )
                        _args = control.defaultActiveArguments;

                      _controlInst.onChangeActive( visibility , _controlInst.defaultActiveArguments );
                });
          },



          /*****************************************************************************
          * HELPERS
          *****************************************************************************/
          /*
          * Abstract
          * Will be provided by the theme
          * @return main control dependencies object
          */
          _getControlDeps : function() {
            return {};
          },


          //@return a visibility ready object of param describing the dependencies between a dominus and its servos.
          //this.defaultDominusParams = {
          //       dominus : '',
          //       servos : [],
          //       visibility : fn() {},
          //       actions : fn() {},
          //       onSectionExpand : true
          // };
          _prepareDominusParams : function( params_candidate ) {
                var self = this,
                    _ready_params = {};

                //Check mandatory conditions
                if ( ! _.isObject( params_candidate ) ) {
                    throw new Error('Visibilities : a dominus param definition must be an object.');
                }
                if ( ! _.has( params_candidate, 'visibility' ) && ! _.has( params_candidate, 'actions' ) ) {
                    throw new Error('Visibilities : a dominus definition must include a visibility or an actions callback.');
                }
                if ( ! _.has( params_candidate, 'dominus' ) || ! _.isString( params_candidate.dominus ) || _.isEmpty( params_candidate.dominus ) ) {
                      throw new Error( 'Visibilities : a dominus control id must be a not empty string.');
                }
                var wpDominusId = api.CZR_Helpers.build_setId( params_candidate.dominus );
                if ( ! api.control.has( wpDominusId ) ) {
                      throw new Error( 'Visibilities : a dominus control id is not registered : ' + wpDominusId );
                }
                if ( ! _.has( params_candidate, 'servos' ) || _.isUndefined( params_candidate.servos ) || ! _.isArray( params_candidate.servos ) || _.isEmpty( params_candidate.servos ) ) {
                      throw new Error( 'Visibilities : servos must be set as an array not empty.');
                }

                _.each( self.defaultDominusParams , function( _value, _key ) {
                    var _candidate_val = params_candidate[ _key ];

                    switch( _key ) {
                          case 'visibility' :
                              if ( ! _.isUndefined( _candidate_val ) && ! _.isEmpty( _candidate_val ) && ! _.isFunction( _candidate_val ) ) {
                                    throw new Error( 'Visibilities : a dominus visibility callback must be a function : ' + params_candidate.dominus );
                              }
                          break;
                          case 'actions' :
                              if ( ! _.isUndefined( _candidate_val ) && ! _.isEmpty( _candidate_val ) && ! _.isFunction( _candidate_val ) ) {
                                    throw new Error( 'Visibilities : a dominus actions callback must be a function : ' + params_candidate.dominus );
                              }
                          break;
                          case 'onSectionExpand' :
                              if ( ! _.isUndefined( _candidate_val ) && ! _.isEmpty( _candidate_val ) && ! _.isBoolean( _candidate_val ) ) {
                                    throw new Error( 'Visibilities : a dominus onSectionExpand param must be a boolean : ' + params_candidate.dominus );
                              }
                          break;
                    }
                    _ready_params[_key] = _candidate_val;
                });

                return _ready_params;
          },



          /*****************************************************************************
          * FAVICON SPECIFICS
          *****************************************************************************/
          /**
          * Fired on api ready
          * May change the site_icon description on load
          * May add a callback to site_icon
          * @return void()
          */
          _handleFaviconNote : function() {
                var self = this,
                    _fav_setId = api.CZR_Helpers.build_setId( serverControlParams.faviconOptionName );
                //do nothing if (||)
                //1) WP version < 4.3 where site icon has been introduced
                //2) User had not defined a favicon
                //3) User has already set WP site icon
                if ( ! api.has('site_icon') || ! api.control('site_icon') || ( api.has( _fav_setId ) && 0 === + api( _fav_setId )() ) || + api('site_icon')() > 0 )
                  return;

                var _oldDes     = api.control('site_icon').params.description;
                    _newDes     = ['<strong>' , translatedStrings.faviconNote || '' , '</strong><br/><br/>' ].join('') + _oldDes;

                //on api ready
                self._printFaviconNote(_newDes );

                //on site icon change
                api('site_icon').callbacks.add( function(to) {
                  if ( +to > 0 ) {
                    //reset the description to default
                    api.control('site_icon').container.find('.description').text(_oldDes);
                    //reset the previous favicon setting
                    if ( api.has( _fav_setId ) )
                      api( _fav_setId ).set("");
                  }
                  else {
                    self._printFaviconNote(_newDes );
                  }
                });
          },

          //Add a note to the WP control description if user has already defined a favicon
          _printFaviconNote : function( _newDes ) {
                api.control('site_icon').container.find('.description').html(_newDes);
          }
    }
  );//api.Class.extend() //api.CZR_visibilities

})( wp.customize, jQuery, _);