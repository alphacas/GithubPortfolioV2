import classNames from "classnames";
import { NextPage } from "next";
import Image from "next/legacy/image";
import React, { FC, memo } from "react";

import {
  GithubData,
  PortfolioItem,
  SectionId,
} from "../../../library/data/dataDef";

import Section from "../Section";
import ItemOverlay from "./ItemOverlay";

const Portfolio: NextPage<GithubData> = memo(({ portfolioItems }) => {
  return (
    <Section className="bg-neutral-800" sectionId={SectionId.Portfolio}>
      <div className="relative h-max">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <span className="absolute inset-x-0 -bottom-1 border-b-2 border-orange-400" />
      </div>
      <br />
      <div className="flex flex-col gap-y-8">
        <div className=" w-full columns-1 md:columns-2 lg:columns-3">
          {portfolioItems.map((item, index) => {
            const { title } = item;
            return (
              <div className="pb-6" key={`${title}-${index}`}>
                <div
                  className={classNames(
                    "relative h-max w-full overflow-hidden rounded-lg shadow-lg shadow-black/30 lg:shadow-xl"
                  )}
                >
                  <Card item={item} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
});

Portfolio.displayName = "Portfolio";
export default Portfolio;

const Card: FC<{ item: PortfolioItem }> = memo(({ item: item }) => {
  const { title, description, image, tags } = item;
  return (
    <div>
      <Image
        alt={title}
        height="100"
        layout="responsive"
        objectFit="contain"
        src={image}
        width="100"
      />
      <ItemOverlay item={item} />
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold text-white">{title}</div>
        <p className="text-xs text-white opacity-100 sm:text-sm">
          {description}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        {tags?.map((t) => (
          <span
            className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
            key={tags.indexOf(t)}
          >
            {`#${t}`}
          </span>
        ))}
      </div>
    </div>
  );
});
