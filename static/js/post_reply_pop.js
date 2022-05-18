start()

function start(){
    if (opener.typeTemp == "post"){
        $(".text")[0].value = opener.targetTemp["content"]
    }
    else if (opener.typeTemp == "reply"){
        $(".text")[0].value = opener.targetTemp["reply_text"]
    }
}

$(document).on("click",".send",function(e){
    var text = $(".text")[0]
    var e = opener.eventTemp
    var index;

    if (text.value.trim() == ""){
        text.value = ""
        return
    }

    if (text.value == opener.targetTemp["content"]){
        window.close()
        return
    }

    if (opener.typeTemp == "post"){
        var index = opener.indexTemp[0]
        $.ajax({
        type:'POST',
        url:'../post/ajax_post_update/',
        data:JSON.stringify({"post_uuid" :opener.targetTemp.uuid,"post_content":text.value}),
        success:function(json){
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
   });
    $(e.currentTarget.parentElement.parentElement.parentElement.parentElement.children[0].children[1])[0].textContent = text.value
    opener.post["post_list"][index]["content"] = text.value
}

    else if (opener.typeTemp == "reply"){
        var index = opener.indexTemp
        $.ajax({
        type:'POST',
        url:'../post/ajax_reply_update/',
        data:JSON.stringify({"reply_uuid" :opener.targetTemp.reply_uuid,"reply_content":text.value}),
        success:function(json){
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
   });
    $(e.currentTarget.parentElement.parentElement.parentElement.parentElement.children[0].children[1])[0].textContent = text.value
    opener.post["post_list"][index[0]]["reply_list"][index[1]] = text.value
}

    opener.eventTemp = undefined
    opener.indexTemp = undefined
    opener.targetTemp = undefined
    opener.typeTemp = undefined
    window.close()
    return
});