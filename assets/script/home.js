var slideIndex=0;

        show()
        function show(){
            var imageCont= document.getElementsByClassName('image-container');
            for(var i =0; i<imageCont.length; i++){
                imageCont[i].style.display="none";
            };

            slideIndex++;

            if(slideIndex>imageCont.length){slideIndex=1};

            imageCont[slideIndex-1].style.display="block";

            setTimeout(show,4000);
        };