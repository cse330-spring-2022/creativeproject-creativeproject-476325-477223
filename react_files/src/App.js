import {useState} from 'react'
import './App.css';
import CreatePost from './post.js';


function App() {
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

    const data = await response.json()
    console.log(data)
  }

    async function loginUser(event) {
    event.preventDefault()

    //sending login info to server
    const response = await fetch('http://localhost:5000/api/register', {
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

    const data = await response.json()
    console.log(data)
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

    const club_data = await response.json()
    console.log(club_data)

  }

  return (
    <div>

    <h1>Register</h1>
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

    <h1>Login</h1>
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

    <CreatePost></CreatePost>

    <h1>Search For Club Tag</h1>
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
  )
}

export default App;
