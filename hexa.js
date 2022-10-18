let session = new Session();
session_id = session.getSession();

if(session_id !== ''){
    
    // console.log(data);

    async function populateUserData(){
        let user = new User();
        user = await user.get(session_id);

        document.querySelector('#username').innerText = user.username;
        document.querySelector('#email').innerText = user.email;

        document.querySelector('#korisnicko_ime').value = user.username;
        document.querySelector('#edit_email').value = user.email;
        document.querySelector('.profile').style.backgroundImage = `url(${user.profile_picture})`;
        // document.querySelector('img.profile').src = user.profile_picture;
        // document.querySelector('.img-name').innerText = String(user.profile_picture);
    }

    populateUserData();

}
else{
    window.location.href = 'index.html';
}

document.querySelector('#logoutBtn').addEventListener('click', () =>{
    session = new Session();
    session.destroySession();
    window.location.href = 'index.html';
});


document.querySelector('#editAccount').addEventListener('click', () =>{
    document.querySelector('.custom-modal').style.display = 'block';
});

document.querySelector('#close-modal').addEventListener('click', () =>{
    document.querySelector('.custom-modal').style.display = 'none';
});

const imageInput = document.querySelector('#image_input');
let uploadImage = '';

// =================================================================

const MAX_WIDTH = 320;
const MAX_HEIGHT = 180;
const MIME_TYPE = "image/jpeg";
const QUALITY = 0.7;

imageInput.addEventListener('change', e =>{
    // const reader = new FileReader();
    // reader.addEventListener('load', () =>{
    //     uploadImage = reader.result;
    //     console.log(uploadImage)
    // });
    // reader.readAsDataURL(imageInput.files[0]);

    const file = e.target.files[0];
    const blobURL = URL.createObjectURL(file);
    const img = new Image();
    img.src = blobURL;

    img.onerror = function(){
        URL.revokeObjectURL(this.src);
        // Handle the failure properly
        console.log("Cannot load image");
    };
    
    img.onload = function newImage() {
        URL.revokeObjectURL(this.src);
        const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        canvas.toBlob(
          (blob) => {
            // Handle the compressed image. es. upload or save in local state
            // displayInfo('Original file', file);
            // displayInfo('Compressed file', blob);
          },
          MIME_TYPE,
          QUALITY
        );
      };

});


function calculateSize(img, maxWidth, maxHeight) {
    let width = img.width;
    let height = img.height;
  
    // calculate the width and height, constraining the proportions
    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }
    return [width, height];
  }
  
  // Utility functions for demo purpose
  
//   function displayInfo(label, file) {
//     const p = document.createElement('p');
//     p.innerText = `${label} - ${readableBytes(file.size)}`;
//     document.getElementById('root').append(p);
//   }
  
//   function readableBytes(bytes) {
//     const i = Math.floor(Math.log(bytes) / Math.log(1024)),
//       sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
//     return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
//   }

// ================================================================================

document.querySelector('#editForm').addEventListener('submit', e =>{
    e.preventDefault;

    let user = new User();

    user.username = document.querySelector('#korisnicko_ime').value;
    user.email = document.querySelector('#edit_email').value;
    user.profile_picture = img;

    user.edit();
});

document.querySelector('#deleteProfile').addEventListener('click', e =>{
    e.preventDefault();
    let text = "Do you realy want to delete your Profile?"

    if(confirm(text) === true){
        let user = new User(session_id);
        user.deleteUser();
    }
});

document.querySelector('#postForm').addEventListener('submit', e =>{
    e.preventDefault();

    async function createPost(){
        let content = document.querySelector('#postContent').value;
        document.querySelector('#postContent').value = '';
        let post = new Post();
        post.post_content = content;
        post = await post.createPost();

        let currentUser = new User();

        currentUser = await currentUser.get(session_id);

        let html = document.querySelector('#allPostsWrapper').innerHTML;

        let deletePostHtml = '';
        if(session_id === post.user_id){
            deletePostHtml = `<button class='remove-btn' onclick='removeMyPost(this)'>Remove</button>` 
        }

        document.querySelector('#allPostsWrapper').innerHTML = 
            `<div class="single-post" data-post-id="${post.id}">                                                           
                <div class="post-content">
                    ${post.content}
                </div>

                <div class="post-actions">
                    <p><b>Author:<b> ${currentUser.username}</p>
                    <div>
                        <button onclick="likePost(this) class="likePostJS like-btn"><span>${post.likes} </span>Likes</button>
                        <button class="comment-btn" onclick="commentPost(this)">Comments</button>
                        ${deletePostHtml}
                    </div>
                </div>

                <div class="post-comments">
                <form>
                    <input type="text" placeholder="Add Comment...">
                    <button onclick="comentPostSubmit(event)">Comment</button>
                </form>
            </div>                                                      
            </div>` + html;
    }

    createPost();

});

async function getAllPosts(){
    let allPosts = new Post();
    allPosts = await allPosts.getAllPosts();
    // console.log(allPosts)

    for(const post of allPosts){

        async function getPostUsers(){

            let user = new User();
            user = await user.get(post.user_id);

            let comments = new Comment();
            comments = await comments.getComments(post.id);

            let comment_html = '';
            if(comments.length > 0){
                // comments.foreach(comment =>{
                //     comment_html += `<div class='single-comment'>${comment.content}</div>`;
                // });
                for(const comment of comments){
                    comment_html += `<div class='single-comment'>${comment.content}</div>`;
                }
            }

            let html = document.querySelector('#allPostsWrapper').innerHTML;

            let deletePostHtml = '';
            if(session_id === post.user_id){
                deletePostHtml = `<button class='remove-btn' onclick='removeMyPost(this)'>Remove</button>` 
            }

            document.querySelector('#allPostsWrapper').innerHTML = 
                `<div class="single-post" data-post-id="${post.id}">                                                           
                <div class="post-content">
                    ${post.content}
                </div>

                <div class="post-actions">
                    <p><b>Author:<b> ${user.username}</p>
                    <div>
                        <button onclick="likePost(this)" class="likePostJS like-btn"><span>${post.likes} </span>Likes</button>
                        <button class="comment-btn" onclick="commentPost(this)">Comments</button>
                        ${deletePostHtml}
                    </div>
                </div>

                <div class="post-comments">
                <form>
                    <input type="text" placeholder="Add Comment...">
                    <button onclick="comentPostSubmit(event)">Comment</button>
                </form>
                ${comment_html}
                </div>                                                      
                </div>` + html;
        }

        getPostUsers();
    }
}

getAllPosts();

const comentPostSubmit = e =>{
    e.preventDefault();

    let btn = e.target;
    btn.setAttribute('disabled', 'true');

    let mainPostElement = btn.closest('.single-post');
    let postId = mainPostElement.getAttribute('data-post-id');
    console.log(postId)

    let html = mainPostElement.querySelector('.post-comments').innerHTML;

    let commentValue = mainPostElement.querySelector('input').value;

    mainPostElement.querySelector('input').value = '';

    mainPostElement.querySelector('.post-comments').innerHTML += `<div class='single-comment'>${commentValue}</div>`;

    let comment = new Comment();

    comment.content = commentValue;
    comment.user_id = session_id;
    comment.post_id = postId;

    comment.createComment();
}

const removeMyPost = btn =>{
    let postId = btn.closest('.single-post').getAttribute('data-post-id');

    btn.closest('.single-post').remove();

    let post = new Post();
    post.deletePost(postId);
}

const likePost = btn =>{
    let mainPostElement = btn.closest('.single-post');
    let postId = btn.closest('.single-post').getAttribute('data-post-id');
    let numberOfLikes = parseInt(btn.querySelector('span').innerText);

    console.log(numberOfLikes)

    btn.querySelector('span').innerText = numberOfLikes + 1;
    btn.setAttribute('disabled', 'true');

    let post = new Post();

    post.like(postId, numberOfLikes + 1);
}

const commentPost = btn =>{
    let mainPostElement = btn.closest('.single-post');
    let postId = mainPostElement.getAttribute('data-post-id');

    mainPostElement.querySelector('.post-comments').classList.add('comment-form');
}




