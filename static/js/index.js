$(document).on("click",".img-update",function(e){
    var file_item = $(".img-upload")
    file_item.trigger("click")
});

$(".img-upload").change(function(e) {
   var form = new FormData();
   form.append( "file", e.currentTarget.files[0]);
       $.ajax({
        type:'POST',
        url:'/ajax_user_img_upload/',
        processData: false,
        contentType: false,
        data:form,
        success:function(json){
            location.reload()
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
});

