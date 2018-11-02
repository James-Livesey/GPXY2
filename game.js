function getURLParameter(name) {
    return decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) || null;
}

var gameData = {};

function refreshCreatorPpic() {
    firebase.storage().ref("users/" + gameData.uid + "/_settings/ppic.png").getDownloadURL().then(function(data) {
        $(".creatorAccountPicture").attr("src", data);
    });
}

function like() {
    alert("Coming soon!");
};

$(function() {
    $(".gameVerified").hide();

    firebase.database().ref("games/" + getURLParameter("play")).once("value", function(snapshot) {
        gameData = snapshot.val();

        $(".gameName").text(gameData.title);
        $(".creatorAccountName").text(gameData.by);

        refreshCreatorPpic();

        if (gameData.src != undefined && gameData.src.endsWith(".swf")) {
            $("#gameFrame").html(`
                <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="100%" height="100%">
                    <param name="movie" value="` + gameData.src.replace(/http:\/\//g, "https://") + `" />
                    <param name="quality" value="high" />
                    <param name="scale" value="default" />
                    <embed src="` + gameData.src.replace(/http:\/\//g, "https://") + `" quality="high" type="application/x-shockwave-flash" width="100%" height="100%" scale="default" pluginspage="http://www.macromedia.com/go/getflashplayer" />
                </object>
            `);
        } else {
            $("#gameFrame").html(`
                <h3>The game creator has used a file type that we don't accept.</h3>
                <p>You may want to leave a comment for the creator below.</p>
                <button onclick="window.open('help/index.html?article=0001-supportedFileTypes');">Learn More...</button>
            `);
        }

        if (gameData.verified) {
            $(".gameVerified").show();
        }

        setInterval(function() {
            $("#gameLoader").hide();
            $("#gameFrame").show();
        }, 2000);
    });
});