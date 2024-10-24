import PostList from './components/PostsLists'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import {PostProvider} from './contexts/PostContext'
import {Post} from './components/post'

function App() {
  
  return (
  <div className="container">
  <Routes>

    <Route path="/" element={<PostList />} />
    <Route path='/posts/:id' element={
      <PostProvider>
        <Post/>
      </PostProvider>
    }/>
    
    </Routes>
  </div>
  )
}

export default App  
