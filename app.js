let session = new Session();
session = session.getSession();

if(session !== ''){
    window.location.href = 'hexa.html';
}



let signInBtn = document.querySelector('.signInButton');
let signUpBtn = document.querySelector('.signUpButton');
let formBox = document.querySelector('.formBox');
let body = document.querySelector('body');
let container = document.querySelector('.container');

signUpBtn.addEventListener('click', () =>{
    formBox.classList.add('active');
    body.classList.add('active');
    container.classList.add('grow');
});

signInBtn.addEventListener('click', () =>{
    formBox.classList.remove('active');
    body.classList.remove('active');
    container.classList.remove('grow');
});

// if(formBox.classList.contains('active')){
//     //container.classList.add('grow');
//     console.log('contains')
// }

let config = {
    'korisnicko_ime':{
        required: true,
        minlength: 5,
        maxlength: 50
    },
    'register_email':{
        required: true,
        email: true,
        minlength: 5,
        maxlength: 50
    },
    'register_lozinka':{
        required: true,
        minlength: 7,
        maxlength: 25,
        matching: 'ponovi_lozinku'
    },
    'ponovi_lozinku':{
        required: true,
        minlength: 7,
        maxlength: 25,
        matching: 'register_lozinka'
    }
};


let validator = new Validator(config, '#registrationForm');

document.querySelector('#registrationForm').addEventListener('submit', e =>{
    e.preventDefault();

    
    if(validator.validationPassed()){
        let user = new User();
        user.username = document.querySelector('#korisnicko_ime').value; 
        user.email = document.querySelector('#email').value; 
        user.password = document.querySelector('#lozinka').value; 
        user.create();
    }
    else{
        alert('Polja nisu popunjena kako treba');
    }
});

document.querySelector('#loginForm').addEventListener('submit', e =>{
    e.preventDefault();

    let email = document.querySelector('#login_email').value;
    let password = document.querySelector('#login_password').value;

    let user = new User();

    user.email = email;
    user.password = password;

    user.login();

})