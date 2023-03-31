import { ChevronDownIcon, DownloadIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { NextPage } from "next";
import Image from "next/legacy/image";
import { memo } from "react";

import { SectionId } from "../../(library)/(data)/dataDef";
import { GithubData } from "../../(library)/(data)/dataDef";
import Section from "./Section";
import Socials from "../Socials";
import heroImage from "../../../public/background.webp";

const Hero: NextPage<GithubData> = memo((githubData) => {
  const imageSrc = heroImage;
  const { name, description, actions } = githubData.heroData;
  return (
    <Section noPadding sectionId={SectionId.Hero}>
      <div className="relative flex h-screen w-screen items-center justify-center">
        <Image
          alt={`${name}-image`}
          className="absolute z-0"
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          priority
          src={imageSrc}
        />
        <div className="z-10  max-w-screen-lg px-4 lg:px-0">
          <div className="flex flex-col items-center gap-y-6 rounded-xl bg-gray-800/40 p-6 text-center shadow-lg backdrop-blur-sm">
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-7xl">
              {name}
            </h1>
            <div className="prose-sm text-stone-200 sm:prose-base lg:prose-lg">
              {description.map((x, i) => (
                <p key={i}>{x}</p>
              ))}
            </div>
            <div className="flex gap-x-4 text-neutral-100">
              <Socials {...githubData} />
            </div>
            <div className="flex w-full justify-center gap-x-4">
              {actions.map(({ href, text, primary, download, Icon }) => {
                Icon = download ? DownloadIcon : Icon;
                return (
                  <a
                    className={classNames(
                      "flex gap-x-2 rounded-full border-2 bg-none py-2 px-4 text-sm font-medium text-white ring-offset-gray-700/80 hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-base",
                      primary
                        ? "border-orange-500 ring-orange-500"
                        : "border-white ring-white"
                    )}
                    href={href}
                    key={text}
                  >
                    {text}
                    {Icon && (
                      <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <a
            className="rounded-full bg-white p-1 ring-white ring-offset-2 ring-offset-gray-700/80 focus:outline-none focus:ring-2 sm:p-2"
            href={`/#${SectionId.About}`}
          >
            <ChevronDownIcon className="h-5 w-5 bg-transparent sm:h-6 sm:w-6" />
          </a>
        </div>
      </div>
    </Section>
  );
});

Hero.displayName = "Hero";
export default Hero;
