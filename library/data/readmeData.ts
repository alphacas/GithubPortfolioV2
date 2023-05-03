import {
  About,
  AboutItem,
  ContactItem,
  ContactSection,
  ContactType,
  Hero,
  HeroActionItem,
  SectionId,
  Skill,
  SkillGroup,
  Social,
} from "./dataDef";

import { octokit } from "./main";

async function getRawFile(user: string, repo: string, path: string) {
  const { data } = await octokit.rest.repos.getContent({
    owner: user,
    repo: repo,
    path: path,
  });
  if ("content" in data) {
    const content: string = Buffer.from(data.content, "base64").toString();
    return content;
  } else return "";
}

async function getUserReadMeRawData(user: string) {
  return getRawFile(user, user, "README.md");
}

export function getRawTaggedData(str: string, tagName: string) {
  let data;
  const openTag = `<!-- ${tagName}-start -->`;
  const closeTag = `<!-- ${tagName}-end -->`;
  data = str.split(openTag)[1];
  data = data.split(closeTag)[0];
  return data;
}

function trimEmptyLines(str: string) {
  if (!str) return str;
  return str.replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, "").trim();
}

function formatDescription(str: string) {
  return trimEmptyLines(str)
    .split("\n")
    .filter((x) => x !== "");
}

function formatAboutMeList(str: string) {
  str = trimEmptyLines(str);
  const aboutItems: AboutItem[] = [];
  const aboutContactItems: ContactItem[] = [];
  let blogHref: string | null = null;
  for (let item of str.split("\n")) {
    item = item.slice(0, 2) === "- " ? item.slice(2) : item;
    const [label, text] = item.split(": ");

    // about items
    if (!["Email", "Blog"].includes(label)) {
      aboutItems.push({ label, text });
    }

    // contact items
    if (label === "Email") {
      aboutContactItems.push({
        type: ContactType.Email,
        text,
        href: `mailto:${text}`,
      });
    } else if (label === "Location") {
      aboutContactItems.push({
        type: ContactType.Location,
        text,
        href: `https://www.google.com/maps/place/${text}/`,
      });
    }

    // blog
    if (label === "Blog") blogHref = text;
  }
  return { aboutItems, aboutContactItems, blogHref };
}

function formatRawSkill(str: string) {
  const [name, levelStr] = str.split(": ");
  const level = Number(levelStr?.replace("/10", ""));
  return { name, level };
}

function formatSkillGroup(str: string) {
  const name = str.substring(0, str.indexOf(": "));
  const levelsRaw = str.substring(str.indexOf(": ") + 2);
  const skillLevelListRaw = levelsRaw.split(", ");
  const skills: Skill[] = [];
  skillLevelListRaw.forEach((x: string) => {
    skills.push(formatRawSkill(x));
  });
  return { name, skills };
}

function formatSkillsList(str: string) {
  str = trimEmptyLines(str);
  const skills: SkillGroup[] = [];
  for (let item of str.split("\n")) {
    item = item.slice(0, 2) === "- " ? item.slice(2) : item;
    skills.push(formatSkillGroup(item));
  }
  return skills;
}

async function getUserInfo(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}`);
  return res.json();
}

async function getProfileImgSrc(userId: number) {
  return `https://avatars.githubusercontent.com/u/${userId}`;
}

async function createAboutData(raw: string, userId: number) {
  const rawDescription: string = getRawTaggedData(raw, "description");
  const descParagraphs: string[] = formatDescription(rawDescription);
  const rawAboutMe: string = getRawTaggedData(raw, "aboutme-list");
  const { aboutItems, aboutContactItems, blogHref } =
    formatAboutMeList(rawAboutMe);
  const profileImageSrc: string = await getProfileImgSrc(userId);
  const about: About = { descParagraphs, aboutItems, profileImageSrc };
  return { about, aboutContactItems, blogHref };
}

function createSkillsData(raw: string) {
  const rawSkills: string = getRawTaggedData(raw, "skills");
  const skills: SkillGroup[] = formatSkillsList(rawSkills);
  return skills;
}

async function createHeroData(
  username: string,
  name: string,
  bio: string,
  blogHref: string | null
) {
  // trt all these hrefs in this order and use the first one that works
  const hrefs = [
    `https://github.com/${username}/${username}/blob/HEAD/resume.pdf`,
    `https://github.com/${username}/resume/blob/HEAD/resume.pdf`,
  ];
  let href = "";
  let i = 0;
  while (href === "") {
    if (i === hrefs.length) break;
    href = hrefs[i];
    const response = await fetch(href);
    if (response.status === 200) break;
    href = "";
    i++;
  }

  const actions: HeroActionItem[] = [
    {
      href,
      text: "Resume",
      primary: true,
      download: true,
    },
    {
      href: `#${SectionId.Contact}`,
      text: "Contact",
      primary: false,
      download: false,
    },
  ];
  if (blogHref) {
    actions.push({
      href: blogHref,
      text: "Blog",
      primary: false,
      download: false,
    });
  }
  const heroData: Hero = {
    name,
    description: bio.split("\n"),
    actions,
  };
  return heroData;
}

async function createSocialLinks(username: string) {
  const res = await fetch(
    `https://api.github.com/users/${username}/social_accounts`
  );
  const data = await res.json();

  const socialLinks: Social[] = [
    {
      label: "Github",
      href: `https://github.com/${username}`,
    },
  ];
  const possibleSocials: Record<string, string> = {
    twitter: "Twitter",
    linkedin: "LinkedIn",
    instagram: "Instagram",
  };
  for (const item of data) {
    let label: string;
    let href: string;
    if (item["provider"] in possibleSocials) {
      const key = item["provider"];
      label = possibleSocials[key];
      href = item["url"];
      socialLinks.push({ label, href });
    } else if (item["url"].includes("stackoverflow")) {
      // stackoverflow shows up in 'generic'
      label = "Stack Overflow";
      href = item["url"];
      socialLinks.push({ label, href });
    } else {
      break;
    }
  }

  // contact items
  const socialContactItems: ContactItem[] = [];
  for (const { label, href } of socialLinks) {
    if (label === "Github") {
      socialContactItems.push({
        type: ContactType.Github,
        text: href.split("/")[href.split("/").length - 1],
        href,
      });
    } else if (label === "LinkedIn") {
      socialContactItems.push({
        type: ContactType.LinkedIn,
        text: href.split("/")[href.split("/").length - 2],
        href,
      });
    } else if (label === "Twitter") {
      socialContactItems.push({
        type: ContactType.Twitter,
        text: href.split("/")[href.split("/").length - 1],
        href,
      });
    }
  }
  return { socialLinks, socialContactItems };
}

export async function getReadmeAndProfileData(username: string) {
  const user = await getUserInfo(username);
  const raw = await getUserReadMeRawData(username);

  const { about, aboutContactItems, blogHref } = await createAboutData(
    raw,
    user.id
  );
  const skills: SkillGroup[] = createSkillsData(raw);
  const heroData = await createHeroData(
    username,
    user.name,
    user.bio,
    blogHref
  );
  const { socialLinks, socialContactItems } = await createSocialLinks(username);

  const contactSection: ContactSection = {
    headerText: "Get in touch.",
    description:
      "Feel free to get in touch if you'd like to ask me about my work or if you'd like to collaborate on a project together",
    items: aboutContactItems.concat(socialContactItems),
  };
  return { about, contactSection, heroData, socialLinks, skills };
}
