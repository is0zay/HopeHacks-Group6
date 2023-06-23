let i = 0;
const images = [];
const time = 2000;

images[0] = 'images/example1.jpeg';
images[1] = 'images/example2.jpeg';



function changeImg(){
    document.slide.src = images[i]

    if(i < images.length - 1){
        i++;
    } else {
        i = 0;
    }

    setTimeout("changeImg()", time)
}

window.onload = changeImg;

const backgroundJS = changeImg();

