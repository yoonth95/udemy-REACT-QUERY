import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "./api";
import "./PostDetail.css";

export function PostDetail({ post }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id),
  });

  /**
   * queryFn가 어떤 변수에 의존적이라면 그 변수는 쿼리 키에 포함되어야 함
   * 쿼리 키는 요청하는 데이터를 정확하게 설명해야 함
   * 만약 쿼리 함수가 변수에 의존적이라면, 그 변수의 값이 바뀔 때마다 다른 데이터를 요청하게 됩니다.
   * 따라서, 그 변수를 쿼리 키에 포함시켜서, 변수의 값이 바뀔 때마다 새로운 데이터를 올바르게 요청하고 캐싱할 수 있도록 해야 합니다.
   */

  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  if (isError) {
    return (
      <>
        <h3>에러 발생</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button>Delete</button> <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
