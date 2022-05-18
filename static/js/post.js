var post;
var switch_count = 0
var targetTemp;
var eventTemp;
var indexTemp;
var typeTemp;

getData()
setData(post)

function getData() {
    $.ajax({
        type:'POST',
        url:'../post/ajax_get_post/',
        async:false,
        data:JSON.stringify({"request_url":document.URL}),
        success:function(json){
            post = json
            $(".post_count").text(post.post_list.length)
            $(".user_name_title").text(post["user_last_name"])
            $(".send_username").text("@"+post["user_username"])
            $(".send_id").text(post["user_last_name"])
            $(".post_send_user_img")[0].src = get_img(post["user_img"])
            if ($(".title-user-img")[0]){
                $(".title-user-img")[0].src = get_img(post["user_img"])
            }
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
   });
}


$('.post_send').click(function(){
    var text = $('.post-text')[0]
    if (text.value.trim() == ""){
        text.value = ""
        return
    }
    $.ajax({
        type:'POST',
        url:'../post/ajax_send_post/',
        data:JSON.stringify({"text" :text.value,"userid":post["user_id"]}),
        success:function(json){
            post_add(json)
            text.value = ""
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
   });
});

$(document).on("click",".post_delete",function(e){
    var item = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
    var target = get_target(item)
    $.ajax({
        type:'POST',
        url:'../post/ajax_post_delete/',
        data:JSON.stringify({"post_uuid" :target.uuid}),
        success:function(json){
            item.outerHTML = ""
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
   });
});

$(document).on("click",".reply_delete",function(e){
    var item = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
    var target = get_reply_target(item)
    $.ajax({
        type:'POST',
        url:'../post/ajax_reply_delete/',
        data:JSON.stringify({"reply_uuid" :target.reply_uuid}),
        success:function(json){
            item.outerHTML = ""
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
   });
});

$(document).on("click",".post_update",function(e){
    var item = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
    var target = get_target(item)

    var sizeX = 1000
    var sizeY = 500
    var popupX = (window.screen.width / 2) - (sizeX / 2);
    var popupY= (window.screen.height /2) - (sizeY/ 2);
    eventTemp = e
    targetTemp = target
    typeTemp = "post"
    indexTemp = [get_index(item)]
    openWin = window.open("../post_reply_pop/", "childForm",'status=no, resizable = no, scrollbars = no, height='+sizeY+', width='+sizeX+', left='+ popupX + ', top='+ popupY + ', screenX='+ popupX + ', screenY= '+ popupY);

});

$(document).on("click",".reply_update",function(e){
    var post_item = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
    var item = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
    var target = get_reply_target(item)

    var sizeX = 1000
    var sizeY = 500
    var popupX = (window.screen.width / 2) - (sizeX / 2);
    var popupY= (window.screen.height /2) - (sizeY/ 2);
    eventTemp = e
    targetTemp = target
    typeTemp = "reply"
    indexTemp = [get_index(post_item),get_index(item)]
    openWin = window.open("../post_reply_pop/", "childForm",'status=no, resizable = no, scrollbars = no, height='+sizeY+', width='+sizeX+', left='+ popupX + ', top='+ popupY + ', screenX='+ popupX + ', screenY= '+ popupY);
});

function setData(list) {
    var html = ''
    for(i in list.post_list){
        var post_dict = list.post_list[i]
        post_draw(post_dict,i.toString())
    }
}


$(document).on("click",".reply_button",function(e){
    var div = e.currentTarget.parentElement.parentElement.parentElement.parentElement.children[2]

    if (div.style.display == ""){
        e.currentTarget.style.color = ''
        div.style.display="none"
        switch_count -= 1
    }
    else{
        if(switch_count >= 1){
            $(".comment_div").css("display","none")
            $(".reply_button").css("color","")
            switch_count = 0
        }
        var post_item = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
        var post_index = get_index(post_item)
        var post_dic = get_target(post_item)
        e.currentTarget.style.color = 'pink'
        div.style.display= ""
        switch_count += 1
        var reply_list = post["post_list"][get_index(post_item)]["reply_list"]
        if (reply_list != undefined){
            return
        }
        $.ajax({
            type:'POST',
            url:'../post/ajax_get_reply/',
            data:JSON.stringify({"post_uuid":get_target(post_item).uuid,"userid":post["user_id"]}),
            success:function(json){
                  console.log(json)
                  post["post_list"][get_index(post_item)]["reply_list"] = json["reply_list"]
                  for (i in post["post_list"][get_index(post_item)]["reply_list"]){
                    reply_draw(post_item,i)
                  }
            },
            error : function(xhr,errmsg,err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
       });
    }
});

$(document).on("click",".post_like",function(e){
    var post_item = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
    var icon = e.currentTarget
    $.ajax({
        type:'POST',
        url:'../post/ajax_post_send_like/',
        data:JSON.stringify({"post_uuid":get_target(post_item).uuid}),
        success:function(json){
            check = json["like_check"]
            if(check){icon.style.color = "pink"}
            else{icon.style.color = ""}

        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
   });
});

$(document).on("click",".reply_like",function(e){
    var reply_item = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
    var icon = e.currentTarget
    $.ajax({
        type:'POST',
        url:'../post/ajax_reply_send_like/',
        data:JSON.stringify({"reply_uuid":get_reply_target(reply_item).reply_uuid}),
        success:function(json){
            check = json["like_check"]
            if(check){icon.style.color = "pink"}
            else{icon.style.color = ""}
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
   });
});

$(document).on("click",".reply_send",function(e){
    var text = e.currentTarget.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[2]
    var post_item = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement

    if (text.value.trim() == ""){
        text.value = ""
        return
    }
    $.ajax({
        type:'POST',
        url:'../post/ajax_send_reply/',
        data:JSON.stringify({"text" :text.value,"post_uuid":get_target(post_item).uuid}),
        success:function(json){
            reply_add(post_item,json,get_index(post_item))
            text.value = ""
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
   });
});

function post_add(dic){
    post["post_list"].push(dic)
    post_draw(dic,post["post_list"].length-1)
}

function reply_add(post_item,dic,index){
    post["post_list"][index]["reply_list"].push(dic)
    reply_draw(post_item,post["post_list"][index]["reply_list"].length-1)
}


function post_draw(dic,index) {
    html =
        '<article class="media post-item idx-'+index+'">\n'+
        '<div class="media-left">\n'+
        '<figure class="image is-64x64">\n'+
        '<img src="'+get_img(dic["user_img"])+'" alt="Image">\n'+
        '</figure>\n'+
        '</div>\n'+
        '<div class="media-content">\n'+
        '<div class="content">\n'+
        '<p>\n'+
        '<strong>'+dic["user_last_name"]+'</strong> <small>@'+dic["user_username"]+'</small> <small>'+dic["created_date"]+'</small>\n'+
        '<pre>\n'+
        naxt_line(dic["content"])+'\n'+
        '</pre>\n'+
        '</p>\n'+
        '</div>\n'+
        '<nav class="level is-mobile">\n'+
        '<div class="level-left">\n'+
        icon_show("post",dic["my_item_check"],dic["like_check"])+'\n'+
        '</div>\n'+
        '</nav>\n'+
        '<div class="comment_div" style="display:none;">\n'+
        '<div class="box send_reply_div">\n'+
        '<article class="media">\n'+
        '<div class="media-left">\n'+
        '<figure class="image is-64x64">\n'+
        '<img src="'+get_img(post["user_img"])+'" alt="Image">\n'+
        '</figure>\n'+
        '</div>\n'+
        '<div class="media-content">\n'+
        '<div class="content">\n'+
        '<p>\n'+
        '<strong>'+post["user_last_name"]+'</strong> <small>@'+post["user_username"]+'</small>\n'+
        '<textarea class="textarea reply-text" placeholder="Add a comment..." value=""></textarea>\n'+
        '</p>\n'+
        '</div>\n'+
        '<nav class="level is-mobile">\n'+
        '<div class="level-left">\n'+
        '<a class="level-item" aria-label="reply">\n'+
        '<span class="icon is-small reply_send">\n'+
        '<i class="fa fa-check" aria-hidden="true"></i>\n'+
        '</span>\n'+
        '</a>\n'+
        '</div>\n'+
        '</nav>\n'+
        '</div>\n'+
        '</article>\n'+
        '</div>\n'+
        '</div>\n'+
        '</div>\n'+
        '</article>\n'
        $(".posting_div")[0].insertAdjacentHTML('afterend',html);
}

function get_target(item) {
    var index = get_index(item)
    return post.post_list[index]
}

function get_reply_target(item) {
    var reply_index = get_index(item)
    var post_index = get_index(item.parentElement.parentElement.parentElement)
    return post.post_list[post_index]["reply_list"][reply_index]
}

function get_index(item){
    var target = item.classList.length-1
    var index = item.classList[target]
    return Number(index.split("-")[1])
}

function reply_draw(post_item,idx) {
    reply_item = post_item.children[1].children[2].children[0]
    index = get_index(post_item)
    dic = post["post_list"][index]["reply_list"][idx]

    html =
        '<article class="media index-'+String(idx)+'">\n'+
        '<div class="media-left">\n'+
        '<figure class="image is-64x64">\n'+
        '<img src="'+get_img(dic.user_img)+'" alt="Image">\n'+
        '</figure>\n'+
        '</div>\n'+
        '<div class="media-content">\n'+
        '<div class="content">\n'+
        '<p>\n'+
        '<strong>'+dic.user_last_name+'</strong> <small>@'+dic.user_username+'</small> <small>'+dic.created_date+'</small>\n'+
        '<pre>\n'+
        naxt_line(dic.reply_text)+'\n'+
        '</pre>\n'+
        '</p>\n'+
        '</div>\n'+
        '<nav class="level is-mobile">\n'+
        '<div class="level-left">\n'+
        icon_show("reply",dic["my_item_check"],dic["like_check"])+'\n'+
        '</div>\n'+
        '</nav>\n'+
        '</div>\n'+
        '</article>\n'
    reply_item.insertAdjacentHTML('afterend',html)
}

function naxt_line(text){
    text = text.split("\n")
    html = ""
    for (var i=0; i<text.length; i++){
        if (i == text.length-1){
            html += text[i]
        }
        else if (text[i] !== ""){
            html += "<p>"+text[i]+"</p>"
        }
        else{
            html += "<p> </p>"
        }
    }
    return html
}

function icon_show(type,my_item_check,like_check){
    var html = ""
    var s = ""
    if (like_check){
        s = '<span class="icon is-small '+type+'_like" style="color:pink;">'
    }
    else{
        s = '<span class="icon is-small '+type+'_like">'
    }

    if (type == "post"){
        html +=
        '<a class="level-item" aria-label="like">\n'+
        s+'\n'+
        '<i class="fas fa-heart" aria-hidden="true"></i>\n'+
        '</span>\n'+
        '</a>\n'+
        '<a class="level-item" aria-label="reply">\n'+
        '<span class="icon is-small reply_button">\n'+
        '<i class="fas fa-reply" aria-hidden="true"></i>\n'+
        '</span>\n'+
        '</a>\n'

        if (my_item_check){
            html +=
                    '<a class="level-item" aria-label="like">\n'+
                    '<span class="icon is-small post_delete">\n'+
                    '<i class="fa fa-times" aria-hidden="true"></i>\n'+
                    '</span>\n'+
                    '</a>\n'+
                    '<a class="level-item" aria-label="like">\n'+
                    '<span class="icon is-small post_update">\n'+
                    '<i class="fa fa-exchange" aria-hidden="true"></i>\n'+
                    '</span>\n'+
                    '</a>\n'
            }
        }

        else if(type == "reply"){
            html +=
            '<a class="level-item" aria-label="like">\n'+
            s+'\n'+
            '<i class="fas fa-heart" aria-hidden="true"></i>\n'+
            '</span>\n'+
            '</a>\n'

            if (my_item_check){
                html +=
                    '<a class="level-item" aria-label="like">\n'+
                    '<span class="icon is-small reply_delete">\n'+
                    '<i class="fa fa-times" aria-hidden="true"></i>\n'+
                    '</span>\n'+
                    '</a>\n'+
                    '<a class="level-item" aria-label="like">\n'+
                    '<span class="icon is-small reply_update">\n'+
                    '<i class="fa fa-exchange" aria-hidden="true"></i>\n'+
                    '</span>\n'+
                    '</a>\n'
            }
        }
    return html
}

function get_img(img){
    if(!img){
        return "https://bulma.io/images/placeholders/128x128.png"
    }
    return "/"+img
}
