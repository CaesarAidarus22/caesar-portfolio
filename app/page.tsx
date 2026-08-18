import PortfolioClient from "./components/PortfolioClient";
import { getGithubActivity } from "@/lib/github";

export const revalidate = 3600;

export default async function Home() {
  const githubData = await getGithubActivity();

  return <PortfolioClient githubData={githubData} />;
}
