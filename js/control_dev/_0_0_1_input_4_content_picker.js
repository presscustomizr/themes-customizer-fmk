var CZRInputMethods = CZRInputMethods || {};
$.extend( CZRInputMethods , {
  setupContentPicker: function() {
    var input  = this;

    input.pages = [];

    input.object = 'page';
    input.type   = 'post_type';
             
    _.bindAll( input, 'submit');

    input.container.find('select').select2({
      placeholder: {
        id: '-1', // the value of the option
        title: 'Select'
      },
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
        processResults: function (data, params) {
          console.log(params);
          if ( ! data.success )
            return {results: [] };
          return {
            results: data.data.items,
            pagination: { more: data.data.items.length == 10 }
          };
        },  
      },
      templateSelection: input.czrFormatItem,
      templateResult: input.czrFormatItem,
      escapeMarkup: function (markup) { return markup; },
      select: input.submit, // let our custom formatter work
   })
   .on('select2:select', input.submit );
  },
  czrFormatItem: function (item) {
      if (item.loading) return item.title;
      var markup = "<div class='select2-result-repository clearfix'>" +
        "<div class='select2-result-repository__meta'>" +
          "<div class='select2-result-repository__title'>" + item.title + "</div>";

      if (item.type_label) {
        markup += "<div class='select2-result-repository__description'>" + item.type_label + "</div>";
      }

      markup += "</div>";

      return markup;
  },
  // Adds a selected menu item to the menu.
  submit: function( event ) {
    var item = event.params.data;

    //If NOT MULTI
    this.container.find('input[data-type="content-picker"]').val(JSON.stringify([{
        'id'    : item.object_id,
        'type'  : item.object,
    }])).trigger('change');
  },
});//$.extend