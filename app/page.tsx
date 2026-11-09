import DiningExperience from "./dining-experience";
import { loadStories } from "./stories";

export default function Home() {
  return <DiningExperience stories={loadStories()} />;
}
