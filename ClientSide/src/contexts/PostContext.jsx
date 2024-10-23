import React, {useMemo} from 'react';
import { useAsync } from '../hooks/useAsync';
import { getPost } from '../services/posts';
import { useParams } from 'react-router-dom';
import PropTypes from "prop-types"





//const Context = React.createContext();
import  { useContext } from 'react';

export const Context = React.createContext();
export function usePost() {
    return useContext(Context);
}



export function PostProvider({ children }) {
    const { id } = useParams();

    PostProvider.propTypes = {
        children: PropTypes.node.isRequired,
    };

    const { loading, error, value: post } = useAsync(() => getPost(id), [id]);
    console.log(post)
    const commentsByParentId = useMemo(() => {
         if (post?.comments == null) return {};
        const group = {};
        post.comments.forEach(comment => {
            group[comment.parent_id] ||= []
            group[comment.parent_id].push(comment);
            
        });
        return group;
    }, [post?.comments]);

    console.log(post) // console.log returns 2 objects
    console.log(post.comments)// console.log returns 2 objects
    

    function getReplies(parent_id) {
        return commentsByParentId[parent_id];
    }

     //function rComments () {
       // return commentsByParentId[null]
   // }

   // console.log({rComments})
    // Render the context provider with the current post and root comment and child comments
 
    return (
        <Context.Provider value={{
            post: { id, ...post },
            rComments: commentsByParentId[null],
            getReplies,

            
              
        }
        }>
          {loading ? (<h1>Loading...</h1>) : error ? (<h1 className="error-msg">{error}</h1>) : (children)}
        </Context.Provider>
        
       
    );
    
   
}
 

