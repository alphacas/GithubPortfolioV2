"use client";

import { memo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { WorkProps } from "../../../library/data/dataDef";
import TimelineItem from "./TimelineItem";

const Work = memo(({ experience }: WorkProps) => {
  const router = useRouter();
  const previewNum = 2;

  const [showExperience, setShowExperience] = useState(false);

  const togglerExperience = useCallback(() => {
    setShowExperience(!showExperience);
    if (showExperience) router.push("#resume");
  }, [showExperience, router]);

  return (
    <>
      {showExperience
        ? experience.map((item, index) => (
            <TimelineItem item={item} key={`${item.title}-${index}`} />
          ))
        : experience
            .slice(0, previewNum)
            .map((item, index) => (
              <TimelineItem item={item} key={`${item.title}-${index}`} />
            ))}
      {experience.length > previewNum ? (
        <button
          className="mt-3 w-32 bg-orange-500 px-5 py-2 text-white duration-300 hover:bg-orange-700"
          onClick={togglerExperience}
        >
          {showExperience ? "Show Less" : "Show More"}
        </button>
      ) : null}
    </>
  );
});

export default Work;
