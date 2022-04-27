
import {useState} from 'react'
import './App.css';
import CreatePost from './post.js';
import React from 'react';


function App() {

  const username = ''
  let actual_answer;
  let user_email;
  var posts = []
  
  const [name, setName] = useState('')
  const [reg_email, setEmail] = useState('')
  const [reg_password, setPassword] = useState('')
  const [security_question, setQuestion] = useState('')
  const [security_answer, setAnswer] = useState('')
  const [login_email, getLoginEmail] = useState('')
  const [login_password, getLoginPassword] = useState('')
  const [club_tag, setClubTag] = useState('')
  const [user_to_find, setUserToFind] = useState('')
  const [guess, setGuess] = useState('')

  async function registerUser(event) {
    event.preventDefault()

    //sending registration info to server
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name,
        reg_email,
        reg_password,
        security_question,
        security_answer,
      })
    })

    //getting response from server
    const data = await response.json()
    console.log(data)
    if(data.status='exists_error'){
      alert('A user with that email already exists. Please try again.')
    }
  }

    async function loginUser(event) {
    event.preventDefault()

    //sending login info to server
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        login_email,
        login_password,

      })
    })

    const data = await response.json() //data contains user_info
    if(data.status == 'ok') {
      alert('Logged in successfully!')

    displayPosts()

    const see_favorites_btn = document.createElement('input');
        see_favorites_btn.addEventListener('click', function(){
          viewFavorites()
        })
        see_favorites_btn.value = 'View My Favorites!'; 
        see_favorites_btn.type = 'button';

        const element = document.getElementById("fav_div");
        element.appendChild(see_favorites_btn)

    document.getElementById("login_email").value = ""
    document.getElementById("login_password").value = ""

    }
    // console.log("GOT A RETURN")
    // console.log(data)
    // console.log('logged in the user!')
    // const user_info = data.user_info
    // username = user_info[0].name
    // console.log("did we get the name?")
    // console.log(username)

  }

  async function logoutUser(event) {
    event.preventDefault()
   //sending login info to server
    const response = await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username
      })
    })

    const data = await response.json() //data contains user_info
    console.log("GOT A RETURN")
    console.log(data)

    if(data.status == "ok") {
      alert('Logged out successfully!')
    }

  }


  async function deletePost(post_title){

    console.log('in delete post')
    console.log(post_title)

    const response = await fetch('http://localhost:5000/api/delete_post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        post_title
      })
    })

    const delete_info = await response.json()
  
    if(delete_info.error == 'not logged in'){
      alert('Only logged in users can favorite posts!')
      return
    }

    displayPosts()

  }

  async function displayPosts(){

    let display = 'display'

    console.log('in ap.js display posts')

    const response = await fetch('http://localhost:5000/api/display_posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          display
        })
      })

      console.log('back in display ap.js')
      const found = await response.json()
      console.log(found)

      found.posts.forEach(post => {

        const title = document.createElement("h3")
        const body = document.createElement('p')
        const current_div = document.createElement('div')
        current_div.id = 'individual_post'
        const node = document.createTextNode(post.title)
        const node1 = document.createTextNode(post.post_content)

        const heart_div = document.createElement('div')
        heart_div.id = 'like_button'
        heart_div.classList.add("button");
        const like_btn = document.createElement('input');
        like_btn.addEventListener('click', function(){
          favoritePost(post.title)
          // await db.addToFavorites(login_email)
        })
        like_btn.value = 'Add to Favorites!'; 
        like_btn.type = 'button'; 

        title.appendChild(node)
        body.appendChild(node1)

        heart_div.append(like_btn)
        current_div.appendChild(title)
        current_div.appendChild(body)
        current_div.append(heart_div)

        const element = document.getElementById("postDiv");
        element.appendChild(current_div)
          
      });

  }

  async function favoritePost(post_title){

    console.log('in fav post')
    console.log(post_title)

    const response = await fetch('http://localhost:5000/api/favorite_post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        post_title
      })
    })

    const favorites_info = await response.json()
  
    if(favorites_info.error == 'not logged in'){
      alert('Only logged in users can favorite posts!')
      return
    }
    
      // const see_favorites_btn = document.createElement('input');
      //   see_favorites_btn.addEventListener('click', function(){
      //     viewFavorites()
      //   })
      //   see_favorites_btn.value = 'View My Favorites!'; 
      //   see_favorites_btn.type = 'button';

      //   const element = document.getElementById("fav_div");
      //   element.appendChild(see_favorites_btn)

  }

  async function viewFavorites(){
    console.log('in view favorites')

    let view_favorites = 'view'

    const response = await fetch('http://localhost:5000/api/view_favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        view_favorites
      })
    })

    const found = await response.json()
    console.log(found)

    let found_favorites = found.found_favorites

    document.getElementById("postDiv").innerHTML = ""

    found_favorites.forEach(favorite => {

        const title = document.createElement("h3")
        const body = document.createElement('p')
        const current_div = document.createElement('div')
        current_div.id = 'individual_post'
        const node = document.createTextNode(favorite.post_title)
        const node1 = document.createTextNode(favorite.body)

        const heart_div = document.createElement('div')
        heart_div.id = 'like_button'
        heart_div.classList.add("button");
        const like_btn = document.createElement('input');
        like_btn.addEventListener('click', function(){
          favoritePost(favorite.title)
          // await db.addToFavorites(login_email)
        })
        like_btn.value = 'Add to Favorites!'; 
        like_btn.type = 'button'; 

        title.appendChild(node)
        body.appendChild(node1)

        heart_div.append(like_btn)
        current_div.appendChild(title)
        current_div.appendChild(body)
        current_div.append(heart_div)

        const element = document.getElementById("postDiv");
        element.appendChild(current_div)
        
      });



  }

   async function searchUserEmail(event){

    event.preventDefault()
    
    const response = await fetch('http://localhost:5000/api/search_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        user_to_find
      })
    })

    const user_info = await response.json()
    console.log(user_info)
    console.log("email")
    actual_answer = user_info.user_info[0]['security_answer']
    console.log(actual_answer)
    user_email = user_info.user_info[0]['email']
    console.log(user_email)
    console.log(user_info.user_info[0]['security_question'])
    alert(user_info.user_info[0]['security_question'])
  


  }

  async function checkGuess(event){

    event.preventDefault()
    
    const response = await fetch('http://localhost:5000/api/search_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        user_to_find
      })
    })

    const user_info = await response.json()


    console.log("email")
    actual_answer = user_info.user_info[0]['security_answer']

    user_email = user_info.user_info[0]['email']

    if(guess == actual_answer) {
      alert('Correct!' + " The user's email is " + user_email)

    } else {
      alert('Wrong!')
    }


  }

  async function editPost(){
    
    console.log('in editPost method')

    let title = document.getElementById('edit_title').value
    let body = document.getElementById('edit_body').value
    let original_title = document.getElementById('original_title').value

    const response = await fetch('http://localhost:5000/api/edit_post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title,
        body,
        original_title
      })
    })

    const found = await response.json()
    if(found.status==='ok'){
      document.getElementById('editPost').style.display = 'none'

    }

  }

  async function searchClubTag(event){

    event.preventDefault()

    console.log(club_tag)
    const response = await fetch('http://localhost:5000/api/search_club', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        club_tag
      })
    })

    const found = await response.json()

    console.log("HELLO")
    console.log(found)

    posts = found.found_posts
    document.getElementById("postDiv").innerHTML = ""

    posts.forEach(post => {

      const title = document.createElement("h3")
      const body = document.createElement('p')
      const current_div = document.createElement('div')
      current_div.id = 'individual_post'
      const node = document.createTextNode(post.title)
      const node1 = document.createTextNode(post.post_content)

      const heart_div = document.createElement('div')
      heart_div.id = 'like_button'
      heart_div.classList.add("button");
      const like_btn = document.createElement('input');
      like_btn.addEventListener('click', function(){
        favoritePost(post.title)
        // await db.addToFavorites(login_email)
      })
      like_btn.value = 'Add to Favorites!'; 
      like_btn.type = 'button'; 

      title.appendChild(node)
      body.appendChild(node1)

      heart_div.append(like_btn)
      current_div.appendChild(title)
      current_div.appendChild(body)
      current_div.append(heart_div)

      const element = document.getElementById("postDiv");
      element.appendChild(current_div)
      
    });

  }

  return (
    <div id="parent">

     <h1>Maya and Mariclare's 330 Yearbook - Spring 2022</h1>

    <div id='child'>
    <h3>Register</h3>
    <form onSubmit={registerUser}>

      <input 
      value={name} 
      onChange={(e) => setName(e.target.value)} 
      type="text" 
      placeholder="Name" 
      />
      <br />
      <input
      value={reg_email} 
      onChange={(e) => setEmail(e.target.value)}
      type="text" 
      placeholder="Email" 
      />
      <br />
      <input 
      value={reg_password} 
      onChange={(e) => setPassword(e.target.value)}
      type="password" 
      placeholder="Password" 
      />
      <br />
      <input 
      value={security_question} 
      onChange={(e) => setQuestion(e.target.value)}
      type="question" 
      placeholder="Security Question" 
      />
      <br />
      <input 
      value={security_answer} 
      onChange={(e) => setAnswer(e.target.value)}
      type="answer" 
      placeholder="Answer" 
      />
      <br />
      <input type='submit' value='Register' />

    </form>
    </div>

    <div id='child'>
    <h3>Login</h3>
    <form onSubmit={loginUser}>
      <input
      value={login_email} 
      onChange={(e) => getLoginEmail(e.target.value)}
      type="text" 
      placeholder="Email" 
      />
      <br />
      <input 
      value={login_password} 
      onChange={(e) => getLoginPassword(e.target.value)}
      type="password" 
      placeholder="Password" 
      />
      <br />
      <input type='submit' value='Login' />
    </form>
    </div>

    <div id="child">
    <h3>Search For Club Tag</h3>
    <form onSubmit={searchClubTag}>
      <input
      value={club_tag} 
      onChange={(e) => setClubTag(e.target.value)}
      type="text" 
      placeholder="Club Tag" 
      />
      <br />
      <input type='submit' value='Search' />
    </form>
    </div>

    <div id="child">
    <h3>Search For User Email</h3>
    <form onSubmit={searchUserEmail}>
      <input
      value={user_to_find} 
      onChange={(e) => setUserToFind(e.target.value)}
      type="text" 
      placeholder="User" 
      />
      <br />
      <input type='submit' value='Search' />
    </form>
    <form onSubmit={checkGuess}>
      <input
      value={guess} 
      onChange={(e) => setGuess(e.target.value)}
      type="text" 
      placeholder="Answer to Security Question" 
      />
      <br />
      <input type='submit' value='Submit' />
    </form>
    </div>
        
    <div id='child'>
    <h3>Logout</h3>
    <form onSubmit={logoutUser}>
      <input type='submit' value='Logout' />
    </form>
    </div>

    <CreatePost></CreatePost>

    <div id='editPost'>
      <input id='edit_title' type='text'></input>
      <input id='edit_body' type='text'></input>
      <input id='original_title' type='hidden'></input>
      <input id='edit_btn' onClick={editPost} type='submit' value='Edit Post'></input>
    </div>

    <div id= 'fav_div'></div>
    <div id= 'del_div'></div>
    <div id='postDiv'></div>

    </div>



  )


}

export default App;