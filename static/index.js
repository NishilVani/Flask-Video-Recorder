let start_button = document.getElementById("start-record");
let stop_button = document.getElementById("stop-record");
let send = document.getElementById("send");
let stream = null;
let video = document.getElementById("video");
var data = new FormData();
let frame_num = 0;
let sec = 0;
let c_tmp, ctx_tmp;
rec = false;
var constraints = {
    video: { frameRate: { exact: 25 } },
    audio: false,
};

function init() {
    c_tmp = document.createElement("canvas");
    c_tmp.setAttribute("width", 800);
    c_tmp.setAttribute("height", 450);
    ctx_tmp = c_tmp.getContext("2d");
}
document.addEventListener("DOMContentLoaded", () => {
    init();
});

function DataURIToBlob(dataURI) {
    const splitDataURI = dataURI.split(",");
    const byteString =
        splitDataURI[0].indexOf("base64") >= 0 ?
        atob(splitDataURI[1]) :
        decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
}

function computeFrame() {
    if (rec) {
        ctx_tmp.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        var imagebase64data = c_tmp.toDataURL("image/png");
        const file = DataURIToBlob(imagebase64data);
        // imagebase64data = imagebase64data.replace("data:image/png;base64,", "");
        // console.log(imagebase64data);
        data.append(
            "frame" + frame_num.toString(),
            file,
            "frame" + frame_num.toString() + ".png"
        );
        frame_num += 1;
        setTimeout(computeFrame, 50);
    }
}
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(s) {
            stream = s;
            video.srcObject = s;
        })
        .catch(function(err0r) {
            console.log(err0r);
        });
}

function updateTimer() {
    if (rec) {
        if (sec == 60) {
            stop_button.click();
        } else {
            send.innerHTML = "Send Video: " + sec.toString() + "s";

            sec += 1;
        }
        setTimeout(updateTimer, 1000);
    }
}

start_button.addEventListener("click", function() {
    start_button.disabled = true;
    stop_button.disabled = false;
    send.disabled = true;
    send.innerHTML = "Send Video: 0s";
    rec = true;
    sec = 0;
    computeFrame();
    updateTimer();
});

stop_button.addEventListener("click", function() {
    start_button.disabled = false;
    stop_button.disabled = true;
    send.disabled = false;
    rec = false;
    frame_num = 0;
});

send.addEventListener("click", function() {
    // data = JSON.stringify(data);
    if (sec > 0) {
        data.append("Time", sec);
        var settings = {
            url: "http://127.0.0.1:5000/video",
            method: "POST",
            timeout: 0,
            // headers: {
            //     "Content-Type": "multipart/formdata",
            // },
            processData: false,
            mimeType: "multipart/form-data",
            contentType: false,
            data: data,
        };

        $.ajax(settings).done(function(response) {
            alert(response);
        });
    } else {
        alert("Video is too Short");
    }
});
