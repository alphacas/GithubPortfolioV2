import { StaticImageData } from "next/image";
import { FC, SVGProps } from "react";
import { IconProps } from "../(components)/Icon/Icon";

export interface GithubDataProps {
  githubData: GithubData;
}

export interface GithubData {
  about: About;
  contactSection: ContactSection;
  education: TimelineItem[];
  experience: TimelineItem[];
  heroData: Hero;
  socialLinks: Social[];
  skills: SkillGroup[];
  portfolioItems: PortfolioItem[];
  testimonialSection: TestimonialSection;
}

/**
 * Section definition
 */
export const SectionId = {
  Hero: "hero",
  About: "about",
  Contact: "contact",
  Portfolio: "portfolio",
  Resume: "resume",
  Skills: "skills",
  Stats: "stats",
  Testimonials: "testimonials",
} as const;

export type SectionId = (typeof SectionId)[keyof typeof SectionId];

export interface RawPinnedRepo {
  owner: string;
  repo: string;
  link: string;
  description: string;
  image: string;
  language: string;
  languageColor: string;
  stars: string;
  forks: number;
}

export interface HomepageMeta {
  title: string;
  description: string;
  ogImageUrl?: string;
  twitterCardType?: "summary" | "summary_large";
  twitterTitle?: string;
  twitterSite?: string;
  twitterCreator?: string;
  twitterDomain?: string;
  twitterUrl?: string;
  twitterDescription?: string;
  twitterImageUrl?: string;
}

/**
 * Hero section
 */
export interface Hero {
  imageSrc?: string;
  name: string;
  description: string[];
  actions: HeroActionItem[];
}

export interface HeroActionItem {
  href: string;
  text: string;
  primary?: boolean;
  download: boolean;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

/**
 * About section
 */
export interface About {
  profileImageSrc?: string;
  descParagraphs: string[];
  aboutItems: AboutItem[];
}

export interface AboutItem {
  label: string;
  text: string;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

/**
 * Stat section
 */
export interface Stat {
  title: string;
  value: number;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

/**
 * Skills section
 */

export interface Skill {
  name: string;
  level: number;
  max?: number;
}

export interface SkillGroup {
  name: string;
  skills: Skill[];
}

/**
 * Portfolio section
 */
export interface PortfolioItem {
  title: string;
  description: string;
  githubUrl: string;
  siteUrl?: string;
  image: string | StaticImageData;
  tags?: string[];
}

/**
 * Resume section
 */
export interface TimelineItem {
  date: string;
  location: string;
  title: string;
  content: string[];
}

/**
 * Testimonial section
 */
export interface TestimonialSection {
  imageSrc?: string | StaticImageData;
  testimonials: Testimonial[];
}

export interface Testimonial {
  image?: string;
  title?: string;
  company?: string;
  name: string;
  text: string;
}

/**
 * Contact section
 */
export interface ContactSection {
  headerText?: string;
  description: string;
  items: ContactItem[];
}

export const ContactType = {
  Email: "Email",
  Phone: "Phone",
  Location: "Location",
  Github: "Github",
  LinkedIn: "LinkedIn",
  Facebook: "Facebook",
  Twitter: "Twitter",
  Instagram: "Instagram",
} as const;

export type ContactType = (typeof ContactType)[keyof typeof ContactType];

export interface ContactItem {
  type: ContactType;
  text: string;
  href?: string;
}

export interface ContactValue {
  Icon: FC<IconProps> | ((props: SVGProps<SVGSVGElement>) => JSX.Element);
  srLabel: string;
}

/**
 * Social items
 */
export interface Social {
  label: string;
  Icon?: FC<IconProps>;
  href: string;
}
