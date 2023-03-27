import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { SignInButton, useUser } from "@clerk/nextjs";
import { api, RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  if (!user) return null;
  return (
    <div className="flex w-full gap-4">
      <Image
        width={56}
        height={56}
        src={user.profileImageUrl}
        className="rounded-full"
        alt="Your profile picture"
      />
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      
      <Image
        width={56}
        height={56}
        src={author.profileImageUrl}
        className="rounded-full"
        alt={`@${author.username}'s profile picture`}
      />
      <div className="flex flex-col">
        <div className="flex text-slate-300">
          <span>
            @{author.username} ·{" "}
            <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
          </span>
        </div>
        <span className="">{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();
  const { data, isLoading } = api.posts.getAll.useQuery();
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Something went wrong</div>;
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {user.isSignedIn ? <CreatePostWizard /> : <SignInButton />}
          </div>
          <div className="flex flex-col">
            {[...data, ...data]?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
