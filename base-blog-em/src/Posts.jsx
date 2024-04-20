import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  /**
   * 일반적으로 useQuery를 사용하여 페이지네이션을 적용할 때, 다음 페이지는 캐싱되지 않기 때문에 isLoading이 계속 true로 되게 된다.
   * 이를 해결하고자 prefetchQuery를 사용하여 다음 페이지에 대한 데이터를 미리 가져와서 부드러운 페이지 전환을 제공
   * 사용자가 실제 해당 페이지를 요청하기 전에 데이터를 미리 로딩함으로써 네트워크 사용량을 더 효율적으로 관리할 수 있음
   * 미리 데이터를 가져오고 캐싱함으로써, 사용자가 같은 페이지를 다시 방문할 때, 즉시 데이터를 보여줄 수 있음
   *
   * 이전 페이지의 경우는 이미 캐싱되어 있기 때문에 다음 페이지로 넘어갈 때만 prefetchQuery를 사용하면 됨
   *
   * 만약 수시로 바뀌는 데이터라면 (댓글 등)
   * 다음 페이지에 대한 데이터를 미리 캐싱을 해 놓을 경우 다음 페이지로 넘어가기 전에 데이터가 바뀌었을 때,
   * 캐싱된 데이터를 보여주기 때문에 업데이트 되기 전 데이터를 보게 된다.
   * 이를 해결하기 위해 아래와 같이 useQuery에서 staleTime을 설정을 해놔서 2초 뒤에 다음 페이지로 넘어가면
   * 데이터는 stale 상태이기 때문에 re-fetching을 진행해 새로운 데이터를 보여주게 된다.
   */
  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({ queryKey: ["posts", nextPage], queryFn: () => fetchPosts(nextPage) });
    }
  }, [currentPage, queryClient]);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000,
  });

  /* 
    isFetching
    - 비동기 쿼리가 아직 해결되지 않았을 때, true
    - 캐시가 있든 없든 fetch가 해결되지 않는 경우 true
    - 아직 fetch가 완료되지 않았지만 Axios, GraphQL 호출 같은 다른 종류의 데이터를 가져오는 작업

    isLoading
    - isFetching의 하위 집합으로, 로딩 중을 뜻함
    - 비동기 쿼리가 아직 미해결 상태 + 캐시된 데이터도 없을 때, true
    - 이 쿼리를 전에 실행한 적이 없어 데이터를 가져오는 중이고 캐시된 데이터도 없어서 로딩 중
  */
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
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
