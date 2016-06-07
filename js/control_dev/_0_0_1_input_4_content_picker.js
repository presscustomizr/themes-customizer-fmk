/* Fix caching, select2 default one seems to not correctly work, or it doesn't what I think it should */
var CZRInputMethods = CZRInputMethods || {};
$.extend( CZRInputMethods , {
  setupContentPicker: function() {
    var input  = this;

    input.pages = [];

    /* Dummy for the prototype purpose */
    input.object = ['page']; //this.control.params.object_types  - array('page', 'post')
    input.type   = 'post_type'; //this.control.params.type  - post_type

    //binding             
    _.bindAll( input, 'submit');

    //setup selectedData
    input.selectedData = [];//input.setupSelectedContents();

    input.container.find('select').select2({
      placeholder: {
        id: '-1', // the value of the option
        title: 'Select'
      },
      data : input.selectedData,
      allowClear: true,
      ajax: {
        url: serverControlParams.AjaxUrl,
        type: 'POST',
        cache: true,
        dataType: 'json',
        delay: 250,
        debug: true,
        data: function ( params ) {
          //for some reason I'm not getting at the moment the params.page returned when searching is different
          var page = params.page ? params.page - 1 : 0;
          page = params.term ? params.page : page;
          return {
            action: params.term ? "search-available-content-items-customizer" : "load-available-content-items-customizer",
            search: params.term, 
            wp_customize: 'on',
            page: page,
            type: input.type,
            object: input.object
          };
        },
        transport: function (params, success, failure) {
          var $request = $.ajax(params);

          $request.then(success);
          $request.fail(failure);

          return $request;
        },
        processResults: function (data, params) {
          if ( ! data.success )
            return { results: [] };

          return {
            results: data.data.items,
            pagination: { more: data.data.items.length == 10 }
          };
        },  
      },
      templateSelection: input.czrFormatItem,
      templateResult: input.czrFormatItem,
      closeOnSelect: false,
      escapeMarkup: function (markup) { return markup; },
   })
   .on('select2:select', input.submit )
   .on('select2:unselect', input.submit );

   //input.setupSelectedContents();
  },
  czrFormatItem: function (item) {
      console.log(item);
      if (item.loading) return item.text;
      var markup = "<div class='content-picker-item clearfix'>" +
        "<div class='content-item-bar'>" +
          "<span class='item-title'>" + item.title + "</span>";

      if (item.type_label) {
        markup += "<span class='item-type'>" + item.type_label + "</span>";
      }

      markup += "</div></div>";

      return markup;
  },
  setupSelectedContents : function() {
    /* TODO */
    var input = this,
    _attributes = {
      value : '2',
      title: 'Sample page',
      //selected: 'selected'
    };
    return [_attributes];
  },
  // Adds a selected menu item to the menu.
  submit: function( event ) {
    var item = event.params.data;

    //If NOT MULTI
    //for the multi we need to match the removed one
    if ( ! item.selected ) {
      this.container.find('input').val('').trigger('change');
    }else {
      console.log( this.container.find('select').select2('data'));
      this.container.find('input').val(JSON.stringify([{
        'id'    : item.object_id,
        'type'  : item.object,
        'title'  : item.title
      }])).trigger('change');
    }
  },
});//$.extend