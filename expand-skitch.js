function appendImage(a, src){
    if( typeof src !== 'undefined' && src !== '' ){
        //src = src.replace('http:','https:');
        a.addClass('skitch').attr('target','_blank').prepend( '<br /><img src="' + src + '" /><br />' );
    }
} // appendImage

$(function(){
    $( 'a' ).each(function(){
        var a = $(this);
        if( a.attr('href') ){
            if( a.attr( 'href').search('skitch') > -1 ){
                $.getJSON("http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20html%20WHERE%20url%3D%22" + a.attr('href') + "%22%20AND%20xpath%3D%22%2F%2F*%5B%40id%3D'skitch-image'%5D%22&format=json&diagnostics=true&jsoncallback=", function(data){
                    var src = data.query.results.img.src;
                    appendImage(a, src);
                });
            } // if
            else if (a.attr('href').search('shard') > -1){
                var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + a.attr('href') + "%22%20and%20xpath%3D'%2Fhtml%2Fbody%2Fscript%5B1%5D'&format=json&diagnostics=true&callback=";

                $.getJSON(url, function(data){
                    var c = data.query.results.script.content,
                        src = c.match(/https[:\/\.\d\w%-]{1,}/)[0];

                        //funky imgur redirect due to.. who knows
                        $.post("http://api.imgur.com/2/upload.json",
                            {
                                key: "f3e92dfa31d0fa5a320ae03f8e45ca1e",
                                image: src

                            },
                            function(data){
                                appendImage(a, data.upload.links.original);
                            });

                });
            } // else if
        } // if
    });
}); // doc ready
