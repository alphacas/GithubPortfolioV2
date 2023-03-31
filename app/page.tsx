import Hero from "./(components)/(Sections)/Hero";
import Header from "./(components)/(Sections)/Header";
import Footer from "./(components)/(Sections)/Footer";

import { getAllGithubData } from "./(library)/(data)/main";
import { GithubData } from "./(library)/(data)/dataDef";
import About from "./(components)/(Sections)/About";

export const revalidate = 1200;

export default async function Home() {
  const username: string = process.env.GITHUB_USERNAME as string;
  const githubData: GithubData = await getAllGithubData(username);
  return (
    <main>
      <Header {...githubData} />
      <Hero {...githubData} />
      <About {...githubData} />
      <Footer {...githubData} />
    </main>
  );
}
