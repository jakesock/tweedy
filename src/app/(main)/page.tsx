import PostEditor from "@/components/posts/editor/PostEditor";
import TrendingSidebar from "@/components/TrendingSidebar";
import ForYouFeed from "./ForYouFeed";

export default async function Home() {
  return (
    <main className="min-w-0f flex w-full gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouFeed />
      </div>
      <TrendingSidebar />
    </main>
  );
}
