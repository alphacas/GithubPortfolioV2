import { NextPage } from "next";
import { FC, memo } from "react";

import { IconProps } from "./Icon/Icon";
import { mapSocialToIcon } from "../library/data/mapItemsToIcons";
import { GithubData } from "../library/data/dataDef";

const Socials: NextPage<GithubData> = memo(({ socialLinks }) => (
  <>
    {socialLinks.map(({ label, href }) => {
      const Icon: FC<IconProps> = mapSocialToIcon(label);
      return (
        <a
          aria-label={label}
          className="-m-1.5 rounded-md p-1.5 transition-all duration-300 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500  sm:-m-3 sm:p-3"
          href={href}
          key={label}
        >
          <Icon className="h-5 w-5 align-baseline sm:h-6 sm:w-6" />
        </a>
      );
    })}
  </>
));

Socials.displayName = "Socials";
export default Socials;
