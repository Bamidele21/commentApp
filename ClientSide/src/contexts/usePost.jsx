import { useContext } from 'react';
import { Context } from './PostContext';
export function usePost() {
    return useContext(Context);// hook to populate content
}