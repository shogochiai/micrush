/* milkcocoa定義 */
var appid = "io-fi1eagrco";
var milkcocoa = new MilkCocoa("https://"+appid+".mlkcca.com");
var ds_crush = milkcocoa.dataStore("crush");
var ds_pics = milkcocoa.dataStore("pics");

/* セリフ定義 */
var serifs = [
    "痛い！痛いよぉ！",
    "きゃああああああっ！！",
    "腕がっ！！腕があああっ！！",
    "もう・・・やめて・・・",
    "ふっかーつ☆",
    "なかなか痛かったわ・・・",
    "ぐっ・・・生き返るのも大変なのよっ！",
    "いっ・・たぁ〜！",
    "ふええええええ＞＜"
];

/* 崩壊共有 */
ds_crush.on("push", function(e){
    $(document).trigger('click');
    ds_crush.query({}).done(function(e){
        /* コメント＆回数更新 */
        setTimeout(function(){
            $("p#comment").html(serifs[rand(0, serifs.length)]);
            $("p#num").html(e.length+"発目");
        }, 1600);
    })
});

/* チャット準備 */
window.chatpart.start({
    host : "https://" + appid + ".mlkcca.com",
    datastore  : "chat",
    milkcocoa : milkcocoa
});

/* 画像アップロード */
ds_pics.on("send", function(e){
  $("img#miku").attr("src", e.value.bin);
});

/* 画像を取得し埋め込み */
$("input#upload").click(function(e){
  e.stopPropagation();
});

$("input#upload").change(function(e){
    var file = e.target.files[0]
    if(file) readfile(file);
});

function readfile(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = loaded;
    reader.onerror = error;
}

function loaded(e){
    var str = e.target.result;
    ds_pics.send({"bin":str});
}

function error(){
    alert("ERROR");
}


$("document").ready(function() {
    ds_crush.query({}).done(function(e){
        var count = e.length;
        $("#num").append(count+"発目");

        /* コピー生成 */
        (genClips = function() {
            $t = $('.clipped-box');

            /* 破片の定義 */
            var amount = 10;
            var width = $t.width() / amount;
            var height = $t.height() / amount;
            var totalSquares = Math.pow(amount, 2);
            var html = $t.find('.content').html();
            var y = 0;

            /* 破片生成 */
            for(var z = 0; z <= (amount*width); z = z+width) {

                /* clip: rect でコピー */
                $('<div class="clipped" style="clip: rect('+y+'px, '+(z+width)+'px, '+(y+height)+'px, '+z+'px)">'+html+'</div>').appendTo($t);

                if(z === (amount*width)-width) {
                    y = y + height;
                    z = -width;
                }
                if(y === (amount*height)) z = 9999999;
            }
        })();
    });

    var first = false;
    var clicked = false;

    /* クリック時動作 */
    $(document).on('click', function() {
        if(clicked === false) {
            clicked = true;

            /* 他ユーザーに崩壊共有 */
            ds_crush.push({"hoge":"hoge"});

            /* コピー元を不可視に */
            $('.clipped-box .content').css({'display' : 'none'});

            /* 動きを定義 */
            $('.clipped-box div:not(.content)').each(function() {
                var v = rand(120, 90),
                angle = rand(80, 89),
                theta = (angle * Math.PI) / 180,
                g = -9.8;
                var self = $(this);
                var t = 0,
                z, r, nx, ny,
                totalt =  15;
                var negate = [1, -1, 0],
                direction = negate[ Math.floor(Math.random() * negate.length) ];
                var randDeg = rand(-5, 10),
                randScale = rand(0.9, 1.1),
                randDeg2 = rand(30, 5);
                var color = $(this).css('backgroundColor').split('rgb(')[1].split(')')[0].split(', '),
                colorR = rand(-20, 20),
                colorGB = rand(-20, 20),
                newColor = 'rgb('+(parseFloat(color[0])+colorR)+', '+(parseFloat(color[1])+colorGB)+', '+(parseFloat(color[2])+colorGB)+')';
                $(this).css({
                    'transform' : 'scale('+randScale+') skew('+randDeg+'deg) rotateZ('+randDeg2+'deg)',
                    'background' : newColor
                });
                z = setInterval(function() {
                    var ux = ( Math.cos(theta) * v ) * direction;
                    var uy = ( Math.sin(theta) * v ) - ( (-g) * t);
                    nx = (ux * t);
                    ny = (uy * t) + (0.5 * (g) * Math.pow(t, 2));
                    $(self).css({'bottom' : (ny)+'px', 'left' : (nx)+'px'});
                    t = t + 0.10;
                    if(t > totalt) {
                        clicked = false;
                        first = true;
                        $('.clipped-box').css({'top' : '-1000px', 'transition' : 'none'});
                        $(self).css({'left' : '0', 'bottom' : '0', 'opacity' : '1', 'transition' : 'none', 'transform' : 'none'});
                        clearInterval(z);
                    }
                }, 10);
            });
        }
    });
    r = setInterval(function() {
        if(first === true) {
            $('.clipped-box').css({'top' : '0', 'transition' : ''});
            $('.clipped-box div').css({'opacity' : '1', 'transition' : '', 'background-color' : ''});
            $('.content').css({'display' : 'block'});
            first = false;
        }
    }, 300);
});

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
