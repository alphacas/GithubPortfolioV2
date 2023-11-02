import { NextPage } from "next";
import { memo } from "react";

import { GithubData, SectionId } from "../../../library/data/dataDef";
import Section from "../Section";
import ResumeSection from "./ResumeSection";
import { SkillGroup } from "./Skills";
import TimelineItem from "./TimelineItem";
import Work from "./Work";

const Resume: NextPage<GithubData> = memo(
  ({ education, experience, skills }) => {
    return (
      <Section className="bg-neutral-100" sectionId={SectionId.Resume}>
        <div className="flex flex-col divide-y-2 divide-neutral-300">
          {experience.length ? (
            <ResumeSection title="Work">
              <Work experience={experience} />
            </ResumeSection>
          ) : null}

          <ResumeSection title="Skills">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {skills.map((skillgroup, index) => (
                <SkillGroup
                  key={`${skillgroup.name}-${index}`}
                  skillGroup={skillgroup}
                />
              ))}
            </div>
          </ResumeSection>

          {education.length ? (
            <ResumeSection title="Education">
              {education.map((item, index) => (
                <TimelineItem item={item} key={`${item.title}-${index}`} />
              ))}
            </ResumeSection>
          ) : null}
        </div>
      </Section>
    );
  }
);

Resume.displayName = "Resume";
export default Resume;
