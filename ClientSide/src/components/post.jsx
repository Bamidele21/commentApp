import { usePost } from "../contexts/usePost";
import { CommentList } from "./CommentList";

export function Post() {
    const { post, rootCommments } = usePost();
    console.log(post); // returns object with 2 arrays 
    console.log(rootCommments);// rootComments return undefined in post.jsx
    
    
    return (
        <>
        <h1>{post.title}</h1>
        <article>{post.body}</article>
        <h3> Comments</h3>
        <section>
            {rootCommments != null && rootCommments.length > 0 && (
                <div><CommentList/></div>
                 )}
                 
        </section>
        </>
    )
}