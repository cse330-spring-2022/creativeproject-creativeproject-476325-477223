import {useState} from 'react'
import './App.css';

function CreatePost(){
    const [post_title, setPostTitle] = useState('')
    const [post_content, setPostContent] = useState('')
    const [tagged_clubs, setPostClubTag] = useState('')

    async function makeAPost(event) {

        event.preventDefault()

        document.getElementById('post_title').value = ''
        document.getElementById('tagged_clubs').value = ''
        document.getElementById('text_box').value = ''

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

        if(output.error==='title exists'){
            alert('A post with that title already exists. Please try a different one!')
            return
        }

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
        like_btn.addEventListener('click', function(){
            favoritePost(post.title)
        })
        like_btn.value = 'Add to Favorites!'; 
        like_btn.type = 'button'; 

        const edit_btn = document.createElement('input');
        edit_btn.addEventListener('click', function(){
            document.getElementById('original_title').value = post.title
            document.getElementById('edit_title').value = post.title
            document.getElementById('edit_body').value = post.post_content
            document.getElementById('editPost').style.display = 'block'
        })
        edit_btn.value = 'Edit'; 
        edit_btn.type = 'button';

        title.appendChild(node)
        body.appendChild(node1)

        heart_div.append(like_btn)
        heart_div.append(edit_btn)
        current_div.appendChild(title)
        current_div.appendChild(body)
        current_div.append(heart_div)

        const element = document.getElementById("postDiv")
        element.appendChild(current_div)

    }

    async function favoritePost(post_title){

        document.getElementById('post_title').value = ''
        document.getElementById('tagged_clubs').value = ''
        document.getElementById('text_box').value = ''

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
      
        if(favorites_info.error === 'not logged in'){
          alert('Only logged in users can favorite posts!')
          return
        }
    
      }
    
    return(
    <div>
    <h3>Share a Memory!</h3>
    <form onSubmit={makeAPost}>
    <input id = 'post_title'
      value={post_title}
      onChange={(e) => setPostTitle(e.target.value)}
      type="text" 
      placeholder="title" 
      />
      <br />
    <input id='tagged_clubs'
      value={tagged_clubs}
      onChange={(e) => setPostClubTag(e.target.value)}
      type="text" 
      placeholder="tagged club" 
      />
    <br />
    <textarea id = 'text_box'
      value={post_content}
      onChange={(e) => setPostContent(e.target.value)}
      type="text" 
      placeholder="Share a Memory!" 
      />
      <br />
        <input type='submit' value='Post' />
      </form>
    </div>
    )
    
}

export default CreatePost