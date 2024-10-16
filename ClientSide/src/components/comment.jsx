

import PropTypes from 'prop-types';



function Comment({id, message}) {
    return (
        <>
        <div>{id}</div>
        <div>{message}</div>
        </>
        
    );
}

Comment.propTypes = {
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
    created_at: PropTypes.string.isRequired,
};

export default Comment;
