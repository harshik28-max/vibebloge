const users = JSON.parse(localStorage.getItem("users")) || [];
const posts = JSON.parse(localStorage.getItem("posts")) || [];

const authScreen = document.getElementById("authScreen");
const app = document.getElementById("app");
const profilePage = document.getElementById("profilePage");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const postsContainer = document.getElementById("postsContainer");
const profilePostsGrid = document.getElementById("profilePostsGrid");

const postModal = document.getElementById("postModal");
const toast = document.getElementById("toast");

const topUsername = document.getElementById("topUsername");

/* TOAST */

function showToast(message) {

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);

}

/* STORAGE */

function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

function savePosts() {
    localStorage.setItem("posts", JSON.stringify(posts));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

/* TABS */

loginTab.addEventListener("click", () => {

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

});

registerTab.addEventListener("click", () => {

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

});

/* REGISTER */

registerForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const exists = users.find(user => user.email === email);

    if (exists) {
        showToast("Email already exists");
        return;
    }

    users.push({ username, email, password });

    saveUsers();

    registerForm.reset();

    showToast("Registration successful");

    loginTab.click();

});

/* LOGIN */

loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const user = users.find(
        user => user.email === email && user.password === password
    );

    if (!user) {
        showToast("Invalid credentials");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    showApp();

});

/* SHOW APP */

function showApp() {

    authScreen.classList.add("hidden");
    profilePage.classList.add("hidden");

    app.classList.remove("hidden");

    const user = getCurrentUser();

    topUsername.innerText = user.username;

    renderPosts();

}

/* LOGOUT */

function logout() {

    localStorage.removeItem("currentUser");

    app.classList.add("hidden");
    profilePage.classList.add("hidden");

    authScreen.classList.remove("hidden");

    showToast("Logged out");

}

document.getElementById("logoutBtn")
    .addEventListener("click", logout);

document.getElementById("logoutBtn2")
    .addEventListener("click", logout);

/* MODAL */

function openModal() {
    postModal.classList.remove("hidden");
}

function closeModal() {
    postModal.classList.add("hidden");
}

document.getElementById("openPostModal")
    .addEventListener("click", openModal);

document.getElementById("openPostModal2")
    .addEventListener("click", openModal);

document.getElementById("closeModal")
    .addEventListener("click", closeModal);

/* CREATE POST */

document.getElementById("postForm")
    .addEventListener("submit", (e) => {

        e.preventDefault();

        const content = document.getElementById("postContent").value;

        const mediaFile = document.getElementById("postMedia").files[0];

        const currentUser = getCurrentUser();

        const reader = new FileReader();

        reader.onload = function() {

            const post = {
                id: Date.now(),
                author: currentUser.username,
                content,
                media: mediaFile ? reader.result : null,
                mediaType: mediaFile ? mediaFile.type : null,
                likes: 0,
                comments: []
            };

            posts.unshift(post);

            savePosts();

            renderPosts();

            document.getElementById("postForm").reset();

            closeModal();

            showToast("Post created");

        };

        if (mediaFile) {
            reader.readAsDataURL(mediaFile);
        } else {
            reader.onload();
        }

    });

/* RENDER POSTS */

function renderPosts() {

    postsContainer.innerHTML = "";

    const currentUser = getCurrentUser();

    if (posts.length === 0) {

        postsContainer.innerHTML = `<h2>No posts yet.</h2>`;

        return;

    }

    posts.forEach(post => {

                const div = document.createElement("div");

                div.classList.add("post-card");

                div.innerHTML = `

        <div class="post-top">

            <div class="user">

                <div class="avatar">
                    ${post.author.charAt(0).toUpperCase()}
                </div>

                <h4>${post.author}</h4>

            </div>

            ${
            currentUser.username===post.author
            ?
            `<button class="action-btn"
            onclick="deletePost(${post.id})">
            Delete
            </button>`
            :
            ""
            }

        </div>

        <div class="post-content">
            ${post.content}
        </div>

        ${
        post.media
        ?
        post.mediaType.startsWith("video")
        ?
        `<video controls class="post-image">
            <source src="${post.media}">
        </video>`
        :
        `<img src="${post.media}" class="post-image"/>`
        :
        ""
        }

        <div class="post-actions">

            <button
            class="action-btn"
            onclick="likePost(${post.id})">
            ❤️ ${post.likes}
            </button>

        </div>

        <div class="comments">

            <h4>Comments</h4>

            ${
            post.comments.map(comment=>`
                <div class="comment">
                    <strong>${comment.user}</strong>
                    ${comment.text}
                </div>
            `).join("")
            }

            <div class="comment-input">

                <input
                type="text"
                id="comment-${post.id}"
                placeholder="Write comment..."
                >

                <button
                class="action-btn"
                onclick="addComment(${post.id})">
                Post
                </button>

            </div>

        </div>

        `;

        postsContainer.appendChild(div);

    });

}

/* PROFILE */

function renderProfile(){

    const currentUser = getCurrentUser();

    const userPosts = posts.filter(
        post=>post.author===currentUser.username
    );

    document.getElementById("profileUsername")
    .innerText = currentUser.username;

    document.getElementById("profileAvatar")
    .innerText = currentUser.username.charAt(0).toUpperCase();

    document.getElementById("postsCount")
    .innerText = userPosts.length;

    profilePostsGrid.innerHTML = "";

    userPosts.forEach(post=>{

        const div = document.createElement("div");

        div.classList.add("profile-post-card");

        div.innerHTML = `

        ${
        post.media
        ?
        post.mediaType.startsWith("video")
        ?
        `<video controls>
            <source src="${post.media}">
        </video>`
        :
        `<img src="${post.media}">`
        :
        ""
        }

        <div class="profile-post-content">
            <p>${post.content}</p>
        </div>

        `;

        profilePostsGrid.appendChild(div);

    });

}

/* PROFILE BUTTON */

document.getElementById("profileBtn")
.addEventListener("click",()=>{

    app.classList.add("hidden");

    profilePage.classList.remove("hidden");

    renderProfile();

    feather.replace();

});

/* HOME */

document.getElementById("homeBtn")
.addEventListener("click",()=>{

    profilePage.classList.add("hidden");

    app.classList.remove("hidden");

});

/* LIKE */

function likePost(id){

    const post = posts.find(post=>post.id===id);

    post.likes++;

    savePosts();

    renderPosts();

}

/* COMMENT */

function addComment(id){

    const input = document.getElementById(`comment-${id}`);

    const text = input.value;

    if(text.trim()==="") return;

    const currentUser = getCurrentUser();

    const post = posts.find(post=>post.id===id);

    post.comments.push({
        user:currentUser.username,
        text
    });

    savePosts();

    renderPosts();

}

/* DELETE */

function deletePost(id){

    const index = posts.findIndex(post=>post.id===id);

    posts.splice(index,1);

    savePosts();

    renderPosts();

    showToast("Post deleted");

}

/* AUTO LOGIN */

if(getCurrentUser()){
    showApp();
}
fetch('https://vibebloge.onrender.com/api/projects')
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    })
    .catch((err) => console.log(err));
