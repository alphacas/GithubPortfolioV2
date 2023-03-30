import { PortfolioItem, RawPinnedRepo } from "./dataDef";

async function getRawPinnedRepos(username: string) {
  let data: RawPinnedRepo[];
  let apiUrls: string[];
  try {
    const response = await fetch(
      `https://gh-pinned-repos.egoist.dev/?username=${username}`
    );
    data = await response.json();
    apiUrls = [];
    data.map((x) => {
      const { owner, repo } = x;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
      apiUrls.push(apiUrl);
    });
  } catch (error) {
    apiUrls = [];
  }
  return apiUrls;
}

async function getRepoInfo(url: string) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return {};
  }
}

async function createPortfolioItems(repoUrls: string[]) {
  const portfolioItems: PortfolioItem[] = [];

  for (const repoUrl of repoUrls) {
    const repo = await getRepoInfo(repoUrl);
    const githubUrl = `https://github.com/${repo.owner.login}/${repo.name}`;
    let imgUrl = `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/HEAD/app-screenshot.png`;
    const defaultImageUrl = "https://octodex.github.com/images/droidtocat.png";
    const response = await fetch(imgUrl);
    if (!(response.status === 200)) imgUrl = defaultImageUrl;
    const portfolioItemData: PortfolioItem = {
      title: repo.name,
      description: repo.description,
      githubUrl: githubUrl,
      siteUrl: repo.homepage,
      image: imgUrl,
      tags: repo.topics,
    };
    portfolioItems.push(portfolioItemData);
  }

  return portfolioItems;
}

export async function getPinnedRepos(username: string) {
  const repoUrls: string[] = await getRawPinnedRepos(username);
  const portfolioItems: PortfolioItem[] = await createPortfolioItems(repoUrls);
  return portfolioItems;
}
