//extends api.CZRDynModule

var CZRSlideModuleMths = CZRSlideModuleMths || {};

$.extend( CZRSlideModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          //run the parent initialize
          api.CZRDynModule.prototype.initialize.call( module, id, options );

          //extend the module with new template Selectors
          $.extend( module, {
                itemPreAddEl : 'czr-module-slide-pre-item-input-list',
                itemInputList : 'czr-module-slide-item-input-list',
                metasInputList : 'czr-module-slide-metas-input-list'
          } );

          //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
          module.inputConstructor = api.CZRInput.extend( module.CZRSliderInputMths || {} );
          //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor = api.CZRItem.extend( module.CZRSliderItem || {} );

          //declares a default Metas model
          this.defaultMetasModel = {
              'slider-speed' : '',
              'slider-layout' : '',
          };

          //declares a default Item model
          this.defaultItemModel = {
              id : '',
              title : '',
              'slide-background' : '',
              'slide-title'      : '',
              'slide-subtitle'   : '',
          };

          //overrides the default success message
          this.itemAddedMessage = serverControlParams.translatedStrings.slideAdded;
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
                //specific update for the item preModel on social-icon change
                module.preItem.bind( function( to, from ) {
                      if ( ! _.has(to, 'social-icon') )
                        return;
                      if ( _.isEqual( to['social-icon'], from['social-icon'] ) )
                        return;
                      module.updateItemModel( module.preItem, true );
                });
          });
  },//initialize


  CZRSliderInputMths : {
          ready : function() {
                var input = this;
                //update the item title on slide-title change
                input.bind('slide-title:changed', function(){
                      console.log('ALORS slide-title changed callback', input(), input, input.input_parent, input.input_parent() );
                      input.updateItemTitle();
                });
                api.CZRInput.prototype.ready.call( input);
          },

          //ACTIONS ON slide-title change
          //Fired on 'slide-title:changed'
          //Don't fire in pre item case
          updateItemTitle : function( _new_val ) {
                var input = this,
                    item = input.input_parent,
                    is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput;

                var _new_model  = $.extend( true, {}, item() ),
                    _new_title  = _new_model['slide-title'];

                $.extend( _new_model, { title : _new_title} );
                item.set( _new_model );
          },
  },//CZRSlidersInputMths




  CZRSliderItem : {
          //overrides the default parent method by a custom one
          //at this stage, the model passed in the obj is up to date
          writeItemViewTitle : function( model ) {
                var item = this,
                          module  = item.module,
                          _model = model || item(),
                          _title = _model.title ? _model.title : serverControlParams.translatedStrings.slideTitle;

                _title = api.CZR_Helpers.truncate(_title, 25);
                $( '.' + module.control.css_attr.item_title , item.container ).html( _title );
          }
  }
});