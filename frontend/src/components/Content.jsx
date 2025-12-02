import React from "react";
import Arrowup from "../icons/Arrowup";
import Arrowdown from "../icons/Arrowdown";
import UserInfo from "./UserInfo";
import Write from "../icons/Write";
import Send from "../icons/Send";
import { useQuery } from "react-query";
import newRequests from "../utils/newRequest";
import { useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Loading from "./Loading";
import NothingHere from "./NothingHere";
import { mergeSort } from "../utils/dsa/mergeSort";

const Content = () => {
  const { topic } = useParams();
  const [openId, setOpenId] = React.useState([]);
  const [answer, setAnswer] = React.useState("");
  const [sortBy, setSortBy] = React.useState("newest");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");
  const [posts, setPosts] = React.useState([]);
  const [trending, setTrending] = React.useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = storedUser?._id;

  const { isLoading } = useQuery(
    ["getAllQuestions", topic, debouncedSearchQuery],
    async () => {
      if (debouncedSearchQuery.trim()) {
        const res = await newRequests.get(
          `/api/search?q=${encodeURIComponent(debouncedSearchQuery)}`
        );
        return res.data;
      }
      if (topic) {
        const res = await newRequests.get(`/find/${topic}`);
        return res.data;
      }
      const res = await newRequests.get("/questions");
      return res.data;
    },
    {
      onSuccess: (data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
        }
      },
    }
  );

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  React.useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await newRequests.get("/api/trending");
        setTrending(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Error fetching trending posts:", e);
      }
    };
    fetchTrending();
  }, []);

  // Memoize sorted posts to avoid re-sorting on every render
  const sortedPosts = React.useMemo(() => {
    const arr = Array.isArray(posts) ? posts : [];
    return mergeSort(arr, (a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "mostLikes") {
        const aLikes = Array.isArray(a.upvote) ? a.upvote.length : 0;
        const bLikes = Array.isArray(b.upvote) ? b.upvote.length : 0;
        return bLikes - aLikes;
      }
      if (sortBy === "mostComments") {
        const aComments = Array.isArray(a.replies) ? a.replies.length : 0;
        const bComments = Array.isArray(b.replies) ? b.replies.length : 0;
        return bComments - aComments;
      }
      return 0;
    });
  }, [posts, sortBy]);

  if (isLoading) return <Loading />;

  return (
    <div
      className="md:w-[60%] flex flex-col items-center gap-y-5 
    md:gap-8 my-8 "
    >
      <Toaster />

      {/* Search + Sort controls */}
      <div className="w-[96%] md:w-[80%] mx-12 mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex w-full md:w-2/3 gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="flex-1 h-10 px-3 rounded border border-gray-300 outline-none"
          />
          <button
            onClick={() => setDebouncedSearchQuery(searchQuery)}
            className="px-4 py-2 rounded bg-purple-600 text-white text-sm"
          >
            Search
          </button>
        </div>
        <div className="flex w-full md:w-1/3 justify-end">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3 rounded border border-gray-300 text-sm w-full md:w-auto"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="mostLikes">Most Liked</option>
            <option value="mostComments">Most Commented</option>
          </select>
        </div>
      </div>

      {/* Trending section */}
      {trending.length > 0 && (
        <div className="w-[96%] md:w-[80%] mx-12 mb-6 bg-yellow-50 dark:bg-slate-700 p-3 rounded-md shadow">
          <h2 className="text-sm md:text-base font-semibold mb-2">
            🔥 Trending Posts
          </h2>
          <ul className="list-disc list-inside text-xs md:text-sm">
            {trending.map((q) => (
              <li key={q._id} className="mb-1">
                {q.question}
              </li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(sortedPosts) && sortedPosts.length > 0 ? (
        sortedPosts.map((question, index) => {
          return (
            <div
              key={question._id}
              className="w-[96%] md:w-[80%] mx-12 flex flex-col 
              items-end  p-3 md:p-4 rounded-md bg-gray-300
               dark:bg-slate-400"
            >
              <div
                className="w-full bg-purple-100 dark:bg-[#1E212A]
               p-4 md:p-5 rounded-lg shadow-md flex items-start gap-5"
              >
                <div className="left-section space-y-1 text-center">
                  <Arrowup
                    id={question._id}
                    isActive={question?.upvote?.some(
                      (u) => u === currentUserId || u?._id === currentUserId
                    )}
                  />
                  <h3 className="text-sm md:text-base">
                    {question?.upvote?.length || 0}
                  </h3>
                  <Arrowdown
                    id={question._id}
                    isActive={question?.downvote?.some(
                      (u) => u === currentUserId || u?._id === currentUserId
                    )}
                  />
                </div>
                <div className="right-section w-full">
                  <h1 className="text-base md:text-lg dark:text-white">
                    {question?.question}
                  </h1>
                  <p className="text-sm text-black dark:text-white md:text-base">
                    {question?.description}
                  </p>
                  {question.image && (
                    <div className="mt-4">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/questions/${question._id}/image`}
                        alt="Question Attachment"
                        className="w-full max-h-60 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <hr />
                  <UserInfo
                    openId={openId}
                    index={index + 1}
                    setOpenId={setOpenId}
                    question={question}
                    userName={question.userName}
                  />
                </div>
              </div>
              {/* nested comment */}
              {openId.find((ele) => ele === index + 1) && (
                <>
                  {question?.replies?.map((answer, index) => {
                    return (
                      <div key={answer._id} className="flex items-center gap-4">
                        <img
                          className="h-4 md:h-6 w-4 md:w-6"
                          src="https://cdn.icon-icons.com/icons2/2596/PNG/512/nested_arrows_icon_155086.png"
                          alt=""
                        />
                        <div
                          className="bg-white dark:bg-[#32353F] dark:text-white
                          max-w-xl p-5 rounded-lg shadow-md flex flex-col items-start gap-5 mt-2"
                        >
                          <p className="text-inherit">{answer?.reply}</p>
                          <UserInfo answer={answer} />
                        </div>
                      </div>
                    );
                  })}
                  <div
                    className="w-full bg-white dark:bg-slate-900 flex items-center gap-4
                    px-5 py-2 rounded-lg shadow-md  mt-2"
                  >
                    <Write />
                    <input
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-full h-10 border-none outline-none 
                      rounded-md py-1 px-2 "
                      type="text"
                      value={answer}
                      placeholder="Write a comment"
                    />
                    <Send
                      questionId={question._id}
                      answer={answer}
                      setAnswer={setAnswer}
                    />
                  </div>
                </>
              )}
            </div>
          );
        })
      ) : (
        <NothingHere />
      )}
    </div>
  );
};

export default Content;
