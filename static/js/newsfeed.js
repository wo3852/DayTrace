var switch_count = 0

$('.reply_button').click(function (e) {
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
