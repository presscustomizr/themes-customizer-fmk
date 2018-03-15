//extends api.CZRDynModule

var CZRRelatedPostsModMths = CZRRelatedPostsModMths || {};
( function ( api, $, _ ) {
$.extend( CZRRelatedPostsModMths, {
      initialize: function( id, constructorOptions ) {
            var module = this;

            module.initialConstrucOptions = $.extend( true, {}, constructorOptions );//detach from the original obj

            //run the parent initialize
            api.CZRDynModule.prototype.initialize.call( module, id, constructorOptions );

            //extend the module with new template Selectors
            $.extend( module, {
                  itemInputList : 'czr-module-related-posts-item-input-list',
            } );

            // //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUTS
            module.inputConstructor = api.CZRInput.extend( module.CZRRelPostsItemInputCtor || {} );

            // //EXTEND THE DEFAULT CONSTRUCTORS FOR ITEMS AND MODOPTS
            module.itemConstructor = api.CZRItem.extend( module.CZRRelPostsItemCtor || {} );

            //declares a default Item model
            // this.defaultItemModel = {
            //hidden properties
                // 'id'            => '',
                // 'title'         => '',

                // //design
                // 'enable'        => true,
                // 'col_number'    => 3,
                // 'cell_height'   => 'thin',
                // 'display_heading' => true,
                // 'heading_text'   => __('You may also like...', 'hueman'),
                // 'freescroll'    => true,

                // //post filters
                // 'post_number'   => 10,
                // 'order_by'      => 'rand',//can take rand, comment_count, date
                // 'related_by'    => 'categories'//can take : categories, tags, post_formats, all
            // };

            this.defaultItemModel = serverControlParams.relatedPostsModuleParams.defaultModel;

            //fired ready :
            //1) on section expansion
            //2) or in the case of a module embedded in a regular control, if the module section is alreay opened => typically when skope is enabled
            if ( _.has( api, 'czr_activeSectionId' ) && module.control.section() == api.czr_activeSectionId() && 'resolved' != module.isReady.state() ) {
               module.ready();
            }
            api.section( module.control.section() ).expanded.bind(function(to) {
                  if ( 'resolved' == module.isReady.state() )
                    return;
                  module.ready();
            });

            module.isReady.then( function() {

            });//module.isReady
      },//initialize





      //////////////////////////////////////////////////////////
      /// INPUT CONSTRUCTORS
      //////////////////////////////////////////
      CZRRelPostsItemInputCtor : {
            // ready : function() {
            //       api.CZRInput.prototype.ready.call( input);
            // },
            //overrides the default method
            setupSelect : function() {
                  if ( 'order_by' != this.id && 'related_by' != this.id )
                    return;

                  var input      = this,
                      input_parent  = input.input_parent,
                      module     = input.module,
                      _selectOptions  = {},
                      _model = input_parent();

                  switch( input.id ) {
                        // case 'cell_height' :
                        //       _selectOptions = serverControlParams.relatedPostsModuleParams.relPostsCellHeight;
                        // break;
                        case 'order_by' :
                              _selectOptions = serverControlParams.relatedPostsModuleParams.relPostsOrderBy;
                        break;
                        case 'related_by' :
                              _selectOptions = serverControlParams.relatedPostsModuleParams.relPostsRelatedBy;
                        break;
                  }
                  //generates the options
                  _.each( _selectOptions , function( _optName , _k ) {
                        var _attributes = {
                                  value : _k,
                                  html: _optName
                            };
                        if ( _k == _model[ input.id ] ) {
                              $.extend( _attributes, { selected : "selected" } );
                        }
                        $( 'select[data-czrtype="' + input.id + '"]', input.container ).append( $('<option>', _attributes) );
                  });
                  $( 'select[data-czrtype="' + input.id + '"]', input.container ).selecter();
            },
      },//CZRRelPostsItemInputCtor



      //////////////////////////////////////////////////////////
      /// ITEM CONSTRUCTOR
      //////////////////////////////////////////
      CZRRelPostsItemCtor : {
            //overrides the parent ready
            ready : function() {
                  var item = this,
                      module = item.module;
                  //wait for the input collection to be populated,
                  //and then set the input visibility dependencies
                  item.inputCollection.bind( function( col ) {
                        if( _.isEmpty( col ) )
                          return;
                        try { item.setInputVisibilityDeps(); } catch( er ) {
                              api.errorLog( 'item.setInputVisibilityDeps() : ' + er );
                        }
                  });//item.inputCollection.bind()

                  //fire the parent
                  api.CZRItem.prototype.ready.call( item );
            },


            //Fired when the input collection is populated
            //At this point, the inputs are all ready (input.isReady.state() === 'resolved') and we can use their visible Value ( set to true by default )
            setInputVisibilityDeps : function() {
                  var item = this,
                      module = item.module;

                  //Internal item dependencies
                  item.czr_Input.each( function( input ) {
                        switch( input.id ) {
                              case 'enable' :
                                    //Fire on init
                                    item.czr_Input.each( function( _inpt_ ) {
                                          if ( _inpt_.id == input.id )
                                            return;
                                          _inpt_.visible( module._isChecked( input() ) );
                                    });
                                    //React on change
                                    input.bind( function( to ) {
                                          item.czr_Input.each( function( _inpt_ ) {
                                              if ( _inpt_.id == input.id )
                                                return;
                                              _inpt_.visible( module._isChecked( to ) );
                                          });
                                    });
                              break;

                              case 'display_heading' :
                                    //Fire on init
                                    item.czr_Input('heading_text').visible( module._isChecked( input() ) && module._isChecked( item.czr_Input('enable')() ) );

                                    //React on change
                                    input.bind( function( to ) {
                                          item.czr_Input('heading_text').visible( module._isChecked( to ) && module._isChecked( item.czr_Input('enable')() ) );
                                    });
                              break;
                        }
                  });
            },
      },//CZRRelPostsItemCtor



      //////////////////////////////////////////
      /// MODULE HELPERS

      _isChecked : function( v ) {
            return 0 !== v && '0' !== v && false !== v && 'off' !== v;
      },

      _isSettingDirty : function() {
            if ( 'pending' == api.czr_skopeReady.state() )
              return false;
            var module = this,
                _setId = api.CZR_Helpers.getControlSettingId( module.control.id );
            return ( api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( _setId ) || api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( _setId ) );
      }
});//extend
})( wp.customize , jQuery, _ );