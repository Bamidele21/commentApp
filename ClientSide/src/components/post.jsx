import { usePost } from "../contexts/usePost";
import { CommentList } from "./CommentList";

export function Post() {
    const { post, rCommments } = usePost();
    console.log(post); // returns object with 2 arrays 
    console.log(rCommments);// rootComments return undefined in post.jsx
    
    
    return (
        <>
        <h1>{post.title}</h1>
        <article>{post.body}</article>
        <h3> Comments</h3>
        <section>
            {rCommments != null && rCommments.length > 0 && (
                <div><CommentList comments={rCommments}/></div>
                 )}
                 
        </section>
        </>
    )
}