import classNames from "classnames";
import { NextPage } from "next";
import Image from "next/legacy/image";
import { memo } from "react";

import { mapLabelToIcon } from "../../library/data/mapItemsToIcons";
import { AboutItem, GithubData, SectionId } from "../../library/data/dataDef";
import Section from "./Section";

const About: NextPage<GithubData> = memo(({ about }) => {
  const { descParagraphs, profileImageSrc } = about;
  const aboutItems: AboutItem[] = about.aboutItems.map((x: AboutItem) => {
    x.Icon = mapLabelToIcon(x.label);
    return x;
  });

  return (
    <Section className="bg-neutral-800" sectionId={SectionId.About}>
      <div
        className={classNames("grid grid-cols-1 gap-y-4", {
          "md:grid-cols-4": !!profileImageSrc,
        })}
      >
        {!!profileImageSrc && (
          <div className="col-span-1 flex justify-center md:justify-start">
            <div className="relative h-24 w-24 overflow-hidden rounded-xl md:h-32 md:w-32">
              <Image
                alt="about-me-image"
                layout="fill"
                objectFit="cover"
                src={profileImageSrc}
              />
            </div>
          </div>
        )}
        <div
          className={classNames("col-span-1 flex flex-col gap-y-6", {
            "md:col-span-3": !!profileImageSrc,
          })}
        >
          <div className="flex flex-col gap-y-2">
            <h2 className="text-2xl font-bold text-white">About me</h2>
            {descParagraphs.map((x: string, i: number) => {
              return (
                <p
                  className="prose prose-sm text-gray-300 sm:prose-base"
                  key={i}
                >
                  {x}
                </p>
              );
            })}
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {aboutItems.map(({ label, text, Icon }, idx) => (
              <li className="col-span-1 flex  items-start gap-x-2" key={idx}>
                {Icon && <Icon className="h-5 w-5 text-white" />}
                <span className="text-sm font-bold text-white">{label}:</span>
                <span className=" text-sm text-gray-300">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
});

About.displayName = "About";
export default About;
