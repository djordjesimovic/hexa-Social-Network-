// Uploading Image

const imageInput = document.querySelector('#image_input');
let uploadImage = '';

imageInput.addEventListener('change', () =>{
    const reader = new FileReader();
    reader.addEventListener('load', () =>{
        uploadImage = reader.result;
        document.querySelector('.profile').style.backgroundImage = `url(${uploadImage})`;
    });
    reader.readAsDataURL(imageInput.files[0]);
})