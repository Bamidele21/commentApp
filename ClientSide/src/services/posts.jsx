import makeRquests from "./makeRequests";

export function getPosts() {
    return makeRquests("/posts");
}

export function getPost(id) {
    return makeRquests(`/posts/${id}`);
}
 
