import {useState} from 'react'
import './App.css';
import CreatePost from './post.js';
import React from 'react';


function App() {

  const username = ''
  var posts = []
  const [name, setName] = useState('')
  const [reg_email, setEmail] = useState('')
  const [reg_password, setPassword] = useState('')
  const [login_email, getLoginEmail] = useState('')
  const [login_password, getLoginPassword] = useState('')
  const [club_tag, setClubTag] = useState('')

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
    console.log("GOT A RETURN")
    console.log(data)
    // console.log('logged in the user!')
    // const user_info = data.user_info
    // username = user_info[0].name
    // console.log("did we get the name?")
    // console.log(username)

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
    
      const see_favorites_btn = document.createElement('input');
        see_favorites_btn.addEventListener('click', function(){
          viewFavorites()
        })
        see_favorites_btn.value = 'View My Favorites!'; 
        see_favorites_btn.type = 'button';

        const element = document.getElementById("fav_div");
        element.appendChild(see_favorites_btn)

  }

  function viewFavorites(){
    console.log('in view favorites')
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

    <CreatePost></CreatePost>

    <div id= 'fav_div'></div>

    <div id='postDiv'></div>

    </div>
  )


}

export default App;
