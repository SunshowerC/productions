
//jsonp 获取数据
function getJSONP(url, callback) {
    var cbnum = "cb" + getJSONP.counter++;
    var cbname = "getJSONP." + cbnum;

    if (url.indexOf("?") == -1) {
        url += "?callback=" + cbname;
    } else {
        url += "&callback=" + cbname;
    }

    var script = document.createElement("script");
    getJSONP[cbnum] = function (response) {
        try {
            callback(response);
        }
        finally {
            delete getJSONP[cbnum];
            script.parentNode.removeChild(script);
        }
    };

    script.src = url;
    document.body.appendChild(script);
}
getJSONP.counter = 0;

//节流
function throttle(method, context) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function () {
        method.call(context);
    }, 300);
}


var photoAPI = {
    url: "http://www.wookmark.com/api/json?type=source&sourceId=",
    id: 0,
    currentLength: 0
}

function addPhoto(galleryWall) {
    photoAPI.id = Math.ceil(Math.random() * 2000);
    // console.log(photoAPI.id)
    getJSONP(photoAPI.url + photoAPI.id, function (response) {
        // console.log(response)

        var list = response;


        list.forEach(function (item) {
            galleryWall.appendPhoto({
                src: item.image,
                title: item.title,
                description: ''
            });
        });
        //确保第一次加载的图片量足够多，能产生滚动条
        if (photoAPI.currentLength < 20) {
            photoAPI.currentLength += list.length;
            addPhoto(galleryWall);
            // console.log(photoAPI.currentLength)
        }
    });
}

