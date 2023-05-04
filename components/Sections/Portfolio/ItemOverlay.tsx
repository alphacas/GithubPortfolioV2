"use client";

import classNames from "classnames";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import {
  FC,
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { PortfolioItem } from "../../../library/data/dataDef";

import { isMobile } from "../../../app/config";
import useDetectOutsideClick from "../../../library/hooks/useDetectOutsideClick";

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

export default ItemOverlay;
