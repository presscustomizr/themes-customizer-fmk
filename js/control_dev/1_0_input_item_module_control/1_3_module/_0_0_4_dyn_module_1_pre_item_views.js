//MULTI CONTROL CLASS
//extends api.CZRBaseControl
//
//Setup the collection of items
//renders the module view
//Listen to items collection changes and update the module setting

var CZRDynModuleMths = CZRDynModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRDynModuleMths, {
      //////////////////////////////////////////////////
      /// PRE ADD MODEL DIALOG AND VIEW
      //////////////////////////////////////////////////
      renderPreItemView : function( obj ) {
              var module = this;
              //is this view already rendered ?
              if ( 'pending' != module.preItemEmbedded.state() ) //was ! _.isEmpty( module.czr_preItem('item_content')() ) )
                return;

              //do we have view template script?
              if ( ! _.has(module, 'itemPreAddEl') ||  0 === $( '#tmpl-' + module.itemPreAddEl ).length )
                return this;

              //print the html
              var pre_add_template = wp.template( module.itemPreAddEl );

              //do we have an html template and a module container?
              if ( ! pre_add_template  || ! module.container )
                return this;

              var $_pre_add_el = $('.' + module.control.css_attr.pre_add_item_content, module.container );
              $_pre_add_el.prepend( pre_add_template() );

              //say it
              module.preItemEmbedded.resolve( $_pre_add_el );
      },

      //@return $ el of the pre Item view
      _getPreItemView : function() {
              var module = this;
              return $('.' +  module.control.css_attr.pre_add_item_content, module.container );
      },


      //toggles the visibility of the Remove View Block
      //@param : obj = { event : {}, item : {}, view : ${} }
      setPreItemViewVisibility : function(obj) {
              var module = this;
              module.preItemExpanded.set( ! module.preItemExpanded() );
      },


      //callback of module.preItemExpanded
      //@_is_expanded = boolean.
      _togglePreItemViewExpansion : function( _is_expanded ) {
              var module = this,
                $_pre_add_el = $( '.' +  module.control.css_attr.pre_add_item_content, module.container );

              //toggle it
              $_pre_add_el.slideToggle( {
                    duration : 200,
                    done : function() {
                          var $_btn = $( '.' +  module.control.css_attr.open_pre_add_btn, module.container );

                          $(this).toggleClass('open' , _is_expanded );
                          //switch icons
                          if ( _is_expanded )
                            $_btn.find('.fa').removeClass('fa-plus-square').addClass('fa-minus-square');
                          else
                            $_btn.find('.fa').removeClass('fa-minus-square').addClass('fa-plus-square');

                          //set the active class to the btn
                          $_btn.toggleClass( 'active', _is_expanded );

                          //set the adding_new class to the module container wrapper
                          $( module.container ).toggleClass(  module.control.css_attr.adding_new, _is_expanded );
                          //make sure it's fully visible
                          module._adjustScrollExpandedBlock( $(this), 120 );
                  }//done
              } );
      },


      toggleSuccessMessage : function( status ) {
              var module = this,
                  _message = module.itemAddedMessage,
                  $_pre_add_wrapper = $('.' + module.control.css_attr.pre_add_wrapper, module.container );
                  $_success_wrapper = $('.' + module.control.css_attr.pre_add_success, module.container );

              if ( 'on' == status ) {
                  //write message
                  $_success_wrapper.find('p').text(_message);

                  //set various properties
                  $_success_wrapper.css('z-index', 1000001 )
                    .css('height', $_pre_add_wrapper.height() + 'px' )
                    .css('line-height', $_pre_add_wrapper.height() + 'px');
              } else {
                  $_success_wrapper.attr('style','');
              }
              module.container.toggleClass('czr-model-added', 'on' == status );
              return this;
      }
});//$.extend//CZRBaseControlMths
})( wp.customize , jQuery, _ );