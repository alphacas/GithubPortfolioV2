import { GithubData } from "./dataDef";
import { getLinkedinData } from "./archivedLinkedinData";
import { getPinnedRepos } from "./pinnedRepoData";
import { getReadmeAndProfileData } from "./readmeData";

import { Octokit } from "@octokit/rest";
export const octokit = new Octokit();

export async function getAllGithubData(username: string) {
  // Add all function calls here to collect all github data in one place
  const { about, contactSection, heroData, socialLinks, skills } =
    await getReadmeAndProfileData(username);
  const { education, experience, testimonialSection } = await getLinkedinData(
    username
  );
  const portfolioItems = await getPinnedRepos(username);
  const githubData: GithubData = {
    about,
    contactSection,
    education,
    experience,
    heroData,
    portfolioItems,
    socialLinks,
    skills,
    testimonialSection,
  };
  return githubData;
}
