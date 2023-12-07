import React from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Button from "components/Button";
import Loader from "components/Loader";
import { useMergeState } from "utils/custom-hooks";
import { truncate } from "utils/string";
import { getPosts } from "api";
import { formatDate } from "utils/date";

export default function PostsContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [state, setState] = useMergeState({
    isLoading: false,
    posts: [],
  });

  const handleCreatePost = () => {
    navigate("/posts/create");
  };

  const init = async () => {
    try {
      setState({ isLoading: true });

      const response = await getPosts();

      if (response?.success) {
        setState({ posts: response?.data });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  return (
    <div>
      {state?.isLoading ? (
        <div className="mt-10 w-full h-screen flex justify-center">
          <Loader loading={state?.isLoading} />
        </div>
      ) : (
        <div>
          <div className="md:flex md:justify-between md:items-center">
            <div className="text-4xl font-semibold text-grey">Your Posts</div>

            <div className="md:flex mt-4 md:mt-0">
              <Button
                label="Create New Post"
                color="secondary"
                onClick={handleCreatePost}
                style={{
                  borderRadius: 4,
                  fontSize: 14,
                  color: "#FFFFFF",
                  fontWeight: 500,
                  height: 40,
                }}
              />
            </div>
          </div>

          <div className="mt-12">
            {state?.posts?.map((post: any) => (
              <div
                key={post?._id}
                className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-5 my-8 flex justify-between items-center h-24"
              >
                <div>{truncate(post?.content, 100)}</div>
                <div>{formatDate(post?.createdAt, "lll")}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
