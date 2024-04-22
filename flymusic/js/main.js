const open = document.getElementById('open')
const close = document.getElementById('close')
const container = document.querySelector('.container')
let recommend = document.querySelector('.recommend')
let hot = document.querySelector('.hot')
let content = document.querySelector('.content')
let top = document.querySelector('.top')
let night = document.getElementById('night')

let key='41231272180-2966873171a-f8116538172'

open.addEventListener('click', () => container.classList.add('show-nav'))

close.addEventListener('click', () => container.classList.remove('show-nav'))

function addmusic(el,name,i){
    let divmusic = document.createElement('div')
    divmusic.classList.add('music')
    let imgElment = document.createElement('img')
    let pElment1 = document.createElement('p')
    let pElment2 = document.createElement('p')
    let resdata
    axios
        .get(`https://api.linhun.vip/api/wyyyy?name=${name}&n=${i}&type=json&apiKey=${key}`)
        .then((response) => {
            // 请求成功
            const res = response.data; // 这里用 .data 获取响应数据
            resdata = res

            // 判定并处理数据
            if (res.code === 200) {
                console.log('Success');
                imgElment.src = resdata.img
                pElment1.textContent = resdata.name
                pElment2.textContent = resdata.author
                divmusic.appendChild(imgElment)
                divmusic.appendChild(pElment1)
                divmusic.appendChild(pElment2)
                el.appendChild(divmusic)
                imgElment.addEventListener('click',()=>{
                    let playerToremove = document.querySelector('.player')
                    if(playerToremove){
                        playerToremove.parentNode.removeChild(playerToremove)
                    }
                    let player = document.createElement('div')
                    player.classList.add('player')
                    let footerImg = document.createElement('img')
                    footerImg.src=resdata.img

                    let musicMsgDiv = document.createElement('div')
                    musicMsgDiv.classList.add('musicMsg')

                    let musicMsg = document.createElement('h3')
                    musicMsg.textContent = `《${resdata.name}》--${resdata.author}`

                    musicMsgDiv.appendChild(musicMsg)

                    let lyrics = document.createElement('div')
                    lyrics.classList.add('lyrics')
                    let audio = document.createElement('audio')
                    audio.controls = true
                    audio.autoplay = true
                    audio.src = resdata.mp3
                    audio.addEventListener('play',()=>{
                        footerImg.style.animation ="img_rotate 30s linear infinite" // 使用匀速动画，持续时间为2秒，无限循环
                    })
                    audio.addEventListener('pause',()=>{
                        footerImg.style.animation = "none"
                    })
                    player.appendChild(footerImg)
                    player.appendChild(musicMsgDiv)
                    player.appendChild(lyrics)
                    player.appendChild(audio)
                    audio.addEventListener('timeupdate', function() {
                        // 获取当前播放时间
                        var currentTime = audio.currentTime;

                        lyrics.innerText=getLyricByTime(resdata.lyric, currentTime)

                    });
                    document.body.appendChild(player)
                })
            }
        })
        .catch((error) => {
            // 请求失败
            console.error('Error:', error);
        });
}


function getLyricByTime(lyrics, currentTime) {
    // 遍历歌词数组
    for (let i = 0; i < lyrics.length; i++) {
        // 解析当前歌词的时间
        let lyricTime = parseTime(lyrics[i].time);

        // 当前时间与歌词时间的差值
        let timeDiff = currentTime - lyricTime;

        // 如果差值小于0，说明当前时间还未达到该歌词的时间
        // 返回前一个歌词
        if (timeDiff < 0) {
            if (i === 0) {
                // 如果是第一个歌词，直接返回
                return lyrics[i].name;
            } else {
                return lyrics[i - 1].name;
            }
        }
    }

    // 如果遍历完所有歌词，仍未找到合适的歌词，则返回最后一个歌词
    return lyrics[lyrics.length - 1].name;
}

// 辅助函数，将歌词时间转换为秒数

function parseTime(timeString) {
    let [minutes, seconds] = timeString.split(':').map(parseFloat);
    return minutes * 60 + seconds;
}


//监听表单

let search = document.querySelector('.search')

search.addEventListener('submit',(ev)=>{
    let LoadingMore_exist = document.querySelector('.More')
    if(LoadingMore_exist){
        LoadingMore_exist.parentNode.removeChild(LoadingMore_exist)
    }
    ev.preventDefault()
    let input = search.querySelector('input[type="text"]')
    let inputValue = input.value;
    input.value=''
    if (inputValue === '') {
        console.log(1)
        return; // 退出本次执行
    }
    let music = document.querySelectorAll('.music')
    music.forEach((music)=>{
        recommend.removeChild(music)
    })
    let i=1 //创建一个循环变量
    let loadedsong=6 //初始加载的歌曲数量

    i=musicLoading(i,inputValue,loadedsong)

    let loadingMore = document.createElement('div')
    loadingMore.classList.add("More")
    loadingMore.textContent='加载更多'
    let h1_strut = document.createElement('h1')
    h1_strut.style.height='20px'
    loadingMore.addEventListener("click",()=>{
        i=musicLoading(i,inputValue,3)
    })
    setTimeout(()=>{
        content.appendChild(loadingMore)
        content.appendChild(h1_strut)
    },3000)
})

function musicLoading(i,name,loadeedsong){
    for (let j=1;j<=loadeedsong;j++){
        addmusic(recommend,name,i)
        i++
    }
    return i
}

window.onscroll=()=>{
    scrollFunction()
}
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        top.style.display = 'block';
    } else {
        top.style.display = 'none';
    }
}

top.addEventListener('click', () => {
    scrollToTop(0, 2000); // Scroll to top with duration of 1000 milliseconds
});
function scrollToTop(to, duration) {
    const start = window.pageYOffset;
    const change = to - start;
    let currentTime = 0;
    const increment = 20;

    const animateScroll = function() {
        currentTime += increment;
        const val = Math.easeInOutQuad(currentTime, start, change, duration);
        window.scrollTo(0, val);
        if (currentTime < duration) {
            requestAnimationFrame(animateScroll);
        }
    };

    animateScroll();
}

Math.easeInOutQuad = function(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};

//设置切换夜间的监听:

night.addEventListener('change',()=>{
    let top = document.querySelector('.top')
    let search = document.querySelector('.search')
    let circle = document.querySelector('.circle')
    let container = document.querySelector('.container')

    if(night.checked){
        top.classList.add('night')
        search.classList.add('night')
        circle.classList.add('night')
        container.classList.add('night')
    }
    else {
        top.classList.remove('night')
        search.classList.remove('night')
        circle.classList.remove('night')
        container.classList.remove('night')
    }
})

//添加推荐
addmusic(recommend,'故乡',1)
addmusic(recommend,'杀死那个石家庄人',1)
addmusic(recommend,'国际歌',1)
addmusic(recommend,'流沙',1)
addmusic(recommend,'Melody',1)
addmusic(recommend,'月光奏鸣曲',1)
