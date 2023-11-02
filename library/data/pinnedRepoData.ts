import { PortfolioItem, RawStarredRepo } from "./dataDef";

async function getRawStarredRepos(username: string) {
  let arrayStarredRepos: RawStarredRepo[];
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/starred`
    );
    arrayStarredRepos = await response.json();
  } catch (error) {
    console.log(error);
    arrayStarredRepos = [];
  }
  return arrayStarredRepos;
}

async function createPortfolioItems(arrayStarredRepos: RawStarredRepo[]) {
  const portfolioItems: PortfolioItem[] = [];

  for (const starredRepo of arrayStarredRepos) {
    let imgUrl = `https://raw.githubusercontent.com/${starredRepo.owner.login}/${starredRepo.name}/HEAD/app-screenshot.png`;
    const defaultImageUrl = "https://octodex.github.com/images/droidtocat.png";
    // const response = await fetch(imgUrl);
    // if (!(response.status === 200)) imgUrl = defaultImageUrl;
    const portfolioItemData: PortfolioItem = {
      title: starredRepo.name,
      description: starredRepo.description,
      githubUrl: starredRepo.html_url,
      siteUrl: starredRepo.homepage,
      image: imgUrl,
      tags: starredRepo.topics,
    };
    portfolioItems.push(portfolioItemData);
  }

  return portfolioItems;
}

export async function getPinnedRepos(username: string) {
  const arrayStarredRepos: RawStarredRepo[] = await getRawStarredRepos(
    username
  );
  const portfolioItems: PortfolioItem[] = await createPortfolioItems(
    arrayStarredRepos
  );
  return portfolioItems;
}
