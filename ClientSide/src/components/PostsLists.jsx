
import {getPosts} from "../services/posts";
import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";

function PostList() {
    const {loading, error, value: posts } = useAsync(getPosts)// load state

    if (loading) return <h1>Loading...</h1>;
    if (error) return <h1 className ="error-msg">{error}</h1>;

    //links post ID to post title 
    return posts.map (post =>{
        return (
         <h1 key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
         </h1>
         )
    
    })
   
}

export default PostList;