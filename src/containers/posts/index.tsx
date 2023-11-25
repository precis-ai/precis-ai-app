import { useNavigate } from "react-router-dom";
import Button from "components/Button";
import Loader from "components/Loader";
import { useMergeState } from "utils/custom-hooks";
import { truncate } from "utils/string";

export default function PostsContainer() {
  const navigate = useNavigate();

  const [state, setState] = useMergeState({
    isLoading: false,
    posts: [
      {
        id: "1",
        createdAt: "23rd Nov",
        content:
          "🦃 Gratitude is the heart's memory. 🍂 Wishing you a Thanksgiving filled with warmth, love, and cherished moments. May your day be as bountiful as your blessings. Happy Thanksgiving! 🍁🥧 #ThankfulHeart #GratefulEveryday #AcmeThanks",
      },
      {
        id: "2",
        createdAt: "17th Nov",
        content:
          "✨ Sending good vibes your way! ✨ Whether you're conquering the day or taking a moment to unwind, here's to positivity, joy, and making the most of every moment. 🌟 #PositiveVibes #GoodDayFromAcme",
      },
      {
        id: "3",
        createdAt: "14th Nov",
        content:
          "🎈 Happy Children's Day! 🌈 Embrace the joy, laughter, and endless imagination that kids bring into our lives. Cheers to the little ones who inspire us every day! 🚀🎨 #ChildrensDay #KidAtHeart #AcmeKids",
      },
      {
        id: "4",
        createdAt: "10th Nov",
        content:
          "🌿 Take a breather and focus on your well-being today. Whether it's a walk in nature, meditation, or a good book, prioritize self-care. Your mind and body will thank you! 🧘‍♀️🍃 #WellnessWednesday #SelfCare #AcmeWellness",
      },
      {
        id: "5",
        createdAt: "31st Oct",
        content:
          "🎃 Trick or treat! 👻 Wishing you a spook-tacular Halloween filled with frightful fun and sweet treats. Stay safe and have a hauntingly good time! 🕷️🕸️ #HappyHalloween #BooFromAcme",
      },
    ],
  });

  const handleCreatePost = () => {
    navigate("/posts/create");
  };

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
                key={post?.id}
                className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-5 my-8 flex justify-between items-center h-24"
              >
                <div>{truncate(post?.content, 100)}</div>
                <div>{post?.createdAt}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
