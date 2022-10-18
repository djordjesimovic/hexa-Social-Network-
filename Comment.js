class Comment {
    post_id = '';
    user_id = '';
    content = '';
    api_url = 'https://62b18776c7e53744afbb18d4.mockapi.io';

    createComment(){
        let data = {
            post_id: this.post_id,
            user_id: this.user_id,
            content: this.content
        };

        data = JSON.stringify(data);

        fetch(this.api_url + '/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data
        })
        .then(response => response.json())
        .then(data => {console.log('postavljen komentar')});
    }

    async getComments(post_id){
        const response = await fetch(this.api_url + '/comments');
        const data = await response.json();
        let post_comments = [];

        let i = 0;

        data.forEach(item => {
            if(item.post_id === post_id){
                post_comments[i] = item;
                i++;
            }
        });

        return post_comments;
    }
}