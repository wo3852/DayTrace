var post;
var switch_count = 0

$(function(){
    $.ajax({
        type:'POST',
        url:'../post/ajax_get_post/',
        async:false,
        data:JSON.stringify({}),
        success:function(json){
            post = json
            $(".post_count").text(post.post_list.length)
            $(".user_name_title").text(post["user_last_name"])
            console.log(post)
            setData(post)
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
   });
});


function setData(list) {
    var html = ''
    for(i in list.post_list){
        var post_dict = list.post_list[i]
        html += '<div class="hero-body post-item">\n'+
                '<article class="media">\n'+
                '<figure class="media-left">\n'+
                '<p class="image is-64x64">\n'+
                '<img src="https://bulma.io/images/placeholders/128x128.png">\n'+
                '</p>\n'+
                '</figure>\n'+
                '<div class="media-content">\n'+
                '<div class="content">\n'+
                '<p>\n'+
                '<strong>'+post_dict["user_last_name"]+'</strong>\n'+
                '<br>\n'+
                post_dict["content"]+'\n'+
                '<br>\n'+
                '<small><a>좋아요 (0)</a> · <a class="reply_button">댓글</a> · '+post_dict["created_date"]+'</small>\n'+
                '</p>\n'+
                '</div>\n'+
                '<div class="comment_div" style="display:none;">\n'+
                '<article class="media">\n'+
                '<figure class="media-left">\n'+
                '<p class="image is-64x64">\n'+
                '<img src="https://bulma.io/images/placeholders/128x128.png">\n'+
                '</p>\n'+
                '</figure>\n'+
                '<div class="media-content">\n'+
                '<div class="field">\n'+
                '<p class="control">\n'+
                '<textarea class="textarea" placeholder="Add a comment..."></textarea>\n'+
                '</p>\n'+
                '</div>\n'+
                '<div class="field">\n'+
                '<p class="control">\n'+
                '<button class="button is-success reply_send">댓글달기</button>\n'+
                '</p>\n'+
                '</div>\n'+
                '</div>\n'+
                '</article>\n'+
                '<article class="media">\n'+
                '<figure class="media-left">\n'+
                '<p class="image is-48x48">\n'+
                '<img src="https://bulma.io/images/placeholders/96x96.png">\n'+
                '</p>\n'+
                '</figure>\n'+
                '<div class="media-content">\n'+
                '<div class="content">\n'+
                '<p>\n'+
                '<strong>Sean Brown</strong>\n'+
                '<br>\n'+
                'Donec sollicitudin urna eget eros malesuada sagittis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam blandit nisl a nulla sagittis, a lobortis leo feugiat.\n'+
                '<br>\n'+
                '<small><a>좋아요 (0)</a> 2 hrs</small>\n'+
                '</p>\n'+
                '</div>\n'+
                '</div>\n'+
                '</article>\n'+
                '</div>\n'+
                '</div>\n'+
                '</article>\n'+
                '</div>\n'

    }
    $(".posting_div")[0].insertAdjacentHTML('afterend',html);
}


$(document).on("click",".reply_button",function(e){

    var div = e.currentTarget.parentElement.parentElement.parentElement.parentElement.children[1]

    if (div.style.display == ""){
        div.style.display="none"
        switch_count -= 1
    }
    else{
        if(switch_count >= 1){
            $(".comment_div").css("display","none")
            switch_count = 0
        }
        div.style.display=""
        switch_count += 1
    }
});


$(document).on("click",".reply_send",function(e){
    var text = e.currentTarget.parentElement.parentElement.parentElement.children[0].children[0].children[0]
    $.ajax({
        type:'POST',
        url:'../post/ajax_send_reply/',
        data:JSON.stringify({"text" :text.value}),
        success:function(json){

        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
   });

   var div = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.children[1]
   var html = '<article class="media">\n'+
   '<figure class="media-left">\n'+
   '<p class="image is-48x48">\n'+
   '<img src="https://bulma.io/images/placeholders/96x96.png">\n'+
   '</p>\n'+
   '</figure>\n'+
   '<div class="media-content">\n'+
   '<div class="content">\n'+
   '<p>\n'+
   '<strong>'+post["user_last_name"]+'</strong>\n'+
   '<br>\n'+
    text.value+'\n'+
   '<br>\n'+
   '<small><a>좋아요 (0)</a> 2 hrs</small>\n'+
   '</p>\n'+
   '</div>\n'
   div.insertAdjacentHTML('beforebegin',html);
   text.value = ""
});