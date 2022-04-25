import {useState} from 'react'
import './App.css';

function CreatePost(){
    const [post_title, setPostTitle] = useState('')
    const [post_content, setPostContent] = useState('')
    const [tagged_clubs, setPostClubTag] = useState('')

    async function makeAPost(event) {
        event.preventDefault()
        const data = {title: post_title, post_content: post_content, tagged_clubs: tagged_clubs}
        console.log("in makeAPost")
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
        console.log('JSON response')
        console.log(output)
        var post = output.post
        console.log(post)
        
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

          
    }
    
    return(
    <div>
    <h1>Make a Post</h1>
    <form onSubmit={makeAPost}>
    <input
      value={post_title}
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
      placeholder="body" 
      />
      <br />
      <input type='submit' value='Post' />
      </form>
    </div>
    )
    
}

export default CreatePost