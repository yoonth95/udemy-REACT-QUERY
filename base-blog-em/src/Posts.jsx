import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  /* 
  isFetching
  - 비동기 쿼리가 아직 해결되지 않음
  - 아직 fetch가 완료되지 않았지만 Axios, GraphQL 호출 같은 다른 종류의 데이터를 가져오는 작업

  isLoading
  - isFetching의 하위 집합으로, 로딩 중을 뜻함
  - 비동기 쿼리가 아직 미해결 상태 + 캐시된 데이터도 없음
  - 이 쿼리를 전에 실행한 적이 없어 데이터를 가져오는 중이고 캐시된 데이터도 없어서 로딩 중
  */

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) return <h3>Loding...</h3>;
  if (isError)
    return (
      <>
        <h3>에러 발생</h3>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      <ul>
        {data.map((post) => (
          <li key={post.id} className="post-title" onClick={() => setSelectedPost(post)}>
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
