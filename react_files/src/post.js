import {useState} from 'react'
import './App.css';

function CreatePost(){
    const [title, setPostTitle] = useState('')
    const [post_content, setPostContent] = useState('')
    const [tagged_clubs, setPostClubTag] = useState('')

    async function makeAPost(event) {
        event.preventDefault()
        const data = {title: title, post_content: post_content, tagged_clubs: tagged_clubs}
        console.log(data)

        const response = await fetch('http://localhost:5000/api/post', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        body: JSON.stringify(
            data
      )

    })

        const output = await response.json()
        console.log(output)
    }
    
    return(
    <div>
    <h1>Make a Post</h1>
    <form onSubmit={makeAPost}>
    <input
      value={title}
      onChange={(e) => setPostTitle(e.target.value)}
      type="text" 
      placeholder="title" 
      />
      <br />
    <input
      value={tagged_clubs}
      onChange={(e) => setPostClubTag(e.target.value)}
      type="text" 
      placeholder="tagged club" 
      />
    <br />
    <input
      value={post_content}
      onChange={(e) => setPostContent(e.target.value)}
      type="text" 
      placeholder="post content" 
      />
      <br />
      <input type='submit' value='Post' />
      </form>
    </div>
    )
    
}

export default CreatePost