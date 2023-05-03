"use client";

import { ExternalLinkIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { NextPage } from "next";
import Image from "next/legacy/image";
import {
  FC,
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { isMobile } from "../../app/config";
import {
  GithubData,
  PortfolioItem,
  SectionId,
} from "../../library/data/dataDef";
import useDetectOutsideClick from "../../library/hooks/useDetectOutsideClick";
import Section from "./Section";

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
          <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
            {`#${t}`}
          </span>
        ))}
      </div>
    </div>
  );
});

const ItemOverlay: FC<{ item: PortfolioItem }> = memo(
  ({ item: { githubUrl, siteUrl, title, description } }) => {
    const [mobile, setMobile] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const linkRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
      // Avoid hydration styling errors by setting mobile in useEffect
      if (isMobile) {
        setMobile(true);
      }
    }, []);
    useDetectOutsideClick(linkRef, () => setShowOverlay(false));

    const handleItemClick = useCallback(
      (event: MouseEvent<HTMLElement>) => {
        if (mobile && !showOverlay) {
          event.preventDefault();
          setShowOverlay(!showOverlay);
        }
      },
      [mobile, showOverlay]
    );

    return (
      <div
        className={classNames(
          "absolute inset-0 h-full w-full  bg-gray-900 transition-all duration-300",
          { "opacity-0 hover:opacity-80": !mobile },
          showOverlay ? "opacity-80" : "opacity-0"
        )}
        onClick={handleItemClick}
      >
        <div className="relative h-full w-full p-4">
          <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto">
            <h2 className="text-center font-bold text-white opacity-100">
              {title}
            </h2>
            <p className="text-xs text-white opacity-100 sm:text-sm">
              {description}
            </p>
            <a
              className={classNames(
                "flex gap-x-2 rounded-full border-2 bg-none py-2 px-4 text-sm font-medium text-white ring-offset-gray-700/80 hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-base"
              )}
              href={githubUrl}
              onClick={handleItemClick}
              ref={linkRef}
              target="_blank"
            >
              Github
            </a>
            {siteUrl ? (
              <a
                className={classNames(
                  "flex gap-x-2 rounded-full border-2 bg-none py-2 px-4 text-sm font-medium text-white ring-offset-gray-700/80 hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-base"
                )}
                href={siteUrl}
                onClick={handleItemClick}
                ref={linkRef}
                target="_blank"
              >
                Site
              </a>
            ) : null}
          </div>
          <ExternalLinkIcon className="absolute bottom-1 right-1 h-4 w-4 shrink-0 text-white sm:bottom-2 sm:right-2" />
        </div>
      </div>
    );
  }
);
