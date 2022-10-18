class User{
    user_id = '';
    username = '';
    email = '';
    password = ''
    api_url = 'https://62b18776c7e53744afbb18d4.mockapi.io';

    create(){
        let data = {
            username: this.username,
            email: this.email,
            password: this.password,
            profile_picture: this.profile_picture
        }

        data = JSON.stringify(data);

        fetch(this.api_url + '/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        .then(response => response.json())
        .then(data => {
            let session = new Session();

            session.user_id = data.id;
            session.startSession();

            window.location.href = 'hexa.html';
        }) 
    }

    async get(user_id){
        // let api_url = this.api_url + '/users' + user_id;

        let response = await fetch(this.api_url + '/users/' + user_id);
        let data = await response.json();

        return data;
    }

    edit(){
        let data = {
            username: this.username,
            email: this.email,
            profile_picture: this.profile_picture
        };

        data = JSON.stringify(data);

        let session = new Session();
        session_id = session.getSession();

        fetch(this.api_url + '/users/' + session_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        .then(response => response.json())
        .then(data => {
            window.location.href = 'hexa.html';
        })
    }

    login(){
        fetch(this.api_url + '/users').then(response => response.json())
        .then(data =>{

            let loginSuccessful = 0;

            for (const user of data) {
                if(user.username === this.email && user.password === this.password){
                    let session = new Session();
                    session.user_id = user.id;
                    session.startSession();
                    loginSuccessful = 1;
                    window.location.href = 'hexa.html';
                }
                if(loginSuccessful === 0){
                    console.log('Wrong email or password');
                }
            }
        })
    }

    deleteUser(){
        let session = new Session();
        session_id = session.getSession();

        fetch(this.api_url + '/users/' + session_id, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            session.destroySession();

            window.location.href = 'index.html';
        })
    }

}