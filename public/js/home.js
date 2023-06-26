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


//Hamburger Menu
const hamburger = document.querySelector(".hamburger");
const navigation = document.querySelector(".nav-left");

// click event adds the class of active to display the hidden nav menu
hamburger.addEventListener("click", () => {
	navigation.classList.toggle("active");
});