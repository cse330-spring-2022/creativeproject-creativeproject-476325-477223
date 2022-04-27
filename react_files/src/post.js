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
        like_btn.addEventListener('click', function(){
            favoritePost(post.title)
        })
        like_btn.value = 'Add to Favorites!'; 
        like_btn.type = 'button'; 

        const delete_div = document.createElement('div')
        delete_div.id = 'delete_button'
        delete_div.classList.add("button");
        const delete_btn = document.createElement('input');
        delete_btn.addEventListener('click', function(){
            deletePost(post.title)
        })
        delete_btn.value = 'Delete Post'; 
        delete_btn.type = 'button'; 

        title.appendChild(node)
        body.appendChild(node1)


        delete_div.append(delete_btn)
        heart_div.append(like_btn)
        current_div.appendChild(title)
        current_div.appendChild(body)
        current_div.append(heart_div)
        current_div.append(delete_div)

        const element = document.getElementById("postDiv");
        element.appendChild(current_div)

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
        alert('Only logged in users can delete posts!')
        return
      }
      
      // const see_delete_btn = document.createElement('input');
      //   see_delete_btn.addEventListener('click', function(){
      //     viewFavorites()
      //   })
      //   see_delete_btn.value = 'View Delete!'; 
      //   see_delete_btn.type = 'button';

      //   const element = document.getElementById("del_div");
      //   element.appendChild(see_delete_btn)

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
    
        found_favorites.forEach(favorite => {
          console.log(favorite.post_title)
        });
    
    
    
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