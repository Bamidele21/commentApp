import { render, waitFor } from '@testing-library/react';
import { PostProvider } from './PostContext';
import { useAsync } from '../hooks/useAsync';
import { getPost } from '../services/posts';

jest.mock('../hooks/useAsync');
jest.mock('../services/posts');

test('renders loading state when post data is being fetched', async () => {
  useAsync.mockImplementation(() => ({
    loading: true,
    error: null,
    value: null,
  }));

  const { getByText } = render(
    <PostProvider>
      <div>Hello, world!</div>
    </PostProvider>
  );

  expect(getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => expect(getByText('Loading...')).toBeInTheDocument());
});test('displays error message when post data fetch fails', async () => {
  useAsync.mockImplementation(() => ({
    loading: false,
    error: 'Failed to fetch post data',
    value: null,
  }));

  const { getByText } = render(
    <PostProvider>
      <div>Hello, world!</div>
    </PostProvider>
  );

  await waitFor(() => expect(getByText('Failed to fetch post data')).toBeInTheDocument());
});test('handles post data updates correctly', async () => {
  useAsync.mockImplementation(() => ({
    loading: false,
    error: null,
    value: { id: 1, comments: [{ id: 101, parent_id: null }, { id: 102, parent_id: 101 }] },
  }));

  const { getByText, rerender } = render(
    <PostProvider>
      <div>Hello, world!</div>
    </PostProvider>
  );

  await waitFor(() => expect(getByText('Hello, world!')).toBeInTheDocument());

  useAsync.mockImplementationOnce(() => ({
    loading: false,
    error: null,
    value: { id: 1, comments: [{ id: 101, parent_id: null }, { id: 102, parent_id: 101 }, { id: 103, parent_id: 101 }] },
  }));

  rerender(
    <PostProvider>
      <div>Hello, world!</div>
    </PostProvider>
  );

  await waitFor(() => expect(getByText('Hello, world!')).toBeInTheDocument());

  const rootComments = screen.getByText('Hello, world!').parentElement.parentElement.querySelectorAll('.comment');
  expect(rootComments.length).toBe(2); // Assuming there's a CSS class "comment" for comments

  const replies = screen.getByText('Hello, world!').parentElement.parentElement.querySelectorAll('.reply');
  expect(replies.length).toBe(1); // Assuming there's a CSS class "reply" for replies
});test('correctly groups comments by parent_id', () => {
  const comments = [
    { id: 101, parent_id: null },
    { id: 102, parent_id: 101 },
    { id: 103, parent_id: 101 },
    { id: 104, parent_id: 102 },
    { id: 105, parent_id: null },
  ];

  const expectedGroup = {
    null: [
      { id: 101, parent_id: null },
      { id: 105, parent_id: null },
    ],
    101: [
      { id: 102, parent_id: 101 },
      { id: 103, parent_id: 101 },
    ],
    102: [
      { id: 104, parent_id: 102 },
    ],
  };

  const resultGroup = useMemo(() => {
    const group = {};
    comments.forEach(comment => {
      group[comment.parent_id] ||= [];
      group[comment.parent_id].push(comment);
    });
    return group;
  }, [comments]);

  expect(resultGroup).toEqual(expectedGroup);
});test('returns an empty array when there are no comments', () => {
  const { result } = renderHook(() => {
    const post = { id: 1, comments: [] };
    const commentsByParentId = useMemo(() => {
      const group = {};
      post.comments.forEach(comment => {
        group[comment.parent_id] ||= [];
        group[comment.parent_id].push(comment);
      });
      return group;
    }, [post.comments]);

    return commentsByParentId;
  });

  expect(result.current[null]).toEqual([]);
});test('handles null or undefined post comments', () => {
  const { result } = renderHook(() => {
    const post = { id: 1, comments: null };
    const commentsByParentId = useMemo(() => {
      const group = {};
      if (post?.comments) {
        post.comments.forEach(comment => {
          group[comment.parent_id] ||= [];
          group[comment.parent_id].push(comment);
        });
      }
      return group;
    }, [post?.comments]);

    return commentsByParentId;
  });

  expect(result.current[null]).toEqual([]);
});test('handles null or undefined parent_id in comments', () => {
  const comments = [
    { id: 101, parent_id: null },
    { id: 102, parent_id: undefined },
    { id: 103, parent_id: 101 },
  ];

  const expectedGroup = {
    null: [
      { id: 101, parent_id: null },
    ],
    undefined: [
      { id: 102, parent_id: undefined },
    ],
    101: [
      { id: 103, parent_id: 101 },
    ],
  };

  const resultGroup = useMemo(() => {
    const group = {};
    comments.forEach(comment => {
      group[comment.parent_id] ||= [];
      group[comment.parent_id].push(comment);
    });
    return group;
  }, [comments]);

  expect(resultGroup).toEqual(expectedGroup);
});test('does not include replies in the rootComments array', () => {
  const post = { id: 1, comments: [{ id: 101, parent_id: null }, { id: 102, parent_id: 101 }] };
  const commentsByParentId = useMemo(() => {
    const group = {};
    post.comments.forEach(comment => {
      group[comment.parent_id] ||= [];
      group[comment.parent_id].push(comment);
    });
    return group;
  }, [post.comments]);

  const rootComments = commentsByParentId[null];
  const replies = rootComments.filter(comment => comment.parent_id !== null);

  expect(replies.length).toBe(0);
});test('correctly handles deeply nested comments', async () => {
  const post = { id: 1, comments: [{ id: 101, parent_id: null }, { id: 102, parent_id: 101 }, { id: 103, parent_id: 102 }] };
  const { result } = renderHook(() => usePost());

  act(() => {
    result.current.post = post;
  });

  const deeplyNestedComment = post.comments[2];
  const replies = result.current.getReplies(deeplyNestedComment.parent_id);

  expect(replies).toEqual([deeplyNestedComment]);
});test('handles cases where the post ID is not a number', () => {
  const invalidId = 'invalid';
  const { result } = renderHook(() => usePost());

  act(() => {
    result.current.post = { id: invalidId, comments: [] };
  });

  expect(result.current.post.id).toBe(invalidId);
  expect(result.current.rootComments).toEqual([]);
  expect(result.current.getReplies).toBeDefined();
});