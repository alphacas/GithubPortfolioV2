import { getAllGithubData } from "../library/data/main";
import { GithubData } from "../library/data/dataDef";

import Header from "../components/Sections/Header";
import Hero from "../components/Sections/Hero";
import About from "../components/Sections/About";
import Resume from "../components/Sections/Resume/main";
import Footer from "../components/Sections/Footer";
import Portfolio from "../components/Sections/Portfolio";
import Contact from "../components/Sections/Contact";

export const revalidate = 1800;

export default async function Home() {
  const username: string = process.env.GITHUB_USERNAME as string;
  const githubData: GithubData = await getAllGithubData(username);
  return (
    <main>
      <Header {...githubData} />
      <Hero {...githubData} />
      <About {...githubData} />
      <Resume {...githubData} />
      <Portfolio {...githubData} />
      <Contact {...githubData} />
      <Footer {...githubData} />
    </main>
  );
}
