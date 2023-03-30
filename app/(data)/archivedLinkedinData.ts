import { octokit } from "./main";

import { Testimonial, TestimonialSection, TimelineItem } from "./dataDef";

async function getLinkedinRawData(user: string, path: string) {
  const { data } = await octokit.rest.repos.getContent({
    owner: user,
    repo: user,
    path: path,
  });
  if ("content" in data) {
    const content: string = Buffer.from(data.content, "base64").toString();
    return content;
  } else return "";
}

async function getLinkedinRawRecommendations(user: string) {
  return getLinkedinRawData(user, "Recommendations_Received.csv");
}

async function getLinkedinRawEducation(user: string) {
  return getLinkedinRawData(user, "Education.csv");
}

async function getLinkedinRawExperience(user: string) {
  return getLinkedinRawData(user, "Positions.csv");
}

// Return array of string values, or NULL if CSV string not well formed.
function csvToArray(text: string) {
  const re_valid =
    /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  const re_value =
    /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
  // Return NULL if input string is not well formed CSV string.
  if (!re_valid.test(text)) return null;
  const a = []; // Initialize array to receive values.
  text.replace(
    re_value, // "Walk" the string using replace with callback.
    function (_, m1, m2, m3) {
      // Remove backslash from \' in single quoted values.
      if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
      // Remove backslash from \" in double quoted values.
      else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
      else if (m3 !== undefined) a.push(m3);
      return ""; // Return empty string.
    }
  );
  // Handle special case of empty last value.
  if (/,\s*$/.test(text)) a.push("");
  return a;
}

function convertRawCsvToRecordList(raw: string) {
  const rawRows = raw.split("\n");
  const header = rawRows[0].split(",");
  const labels: string[] = header.map((x: string) => x.replace(" ", ""));
  const data = [];
  for (const row of raw
    .split("\n")
    .slice(1)
    .filter((x) => x !== "")) {
    const itemList = csvToArray(row);
    if (!itemList) continue;
    const init: Record<string, string> = {};
    const dataObj: Record<string, string> = itemList.reduce(
      (a, x: string, i) => {
        const key = labels[i];
        a[key] = x;
        return a;
      },
      init
    );
    data.push(dataObj);
  }
  return data;
}

async function createEducation_(githubUsername: string) {
  const raw = await getLinkedinRawEducation(githubUsername);
  const data: Record<string, string>[] = convertRawCsvToRecordList(raw);
  const education: TimelineItem[] = [];
  for (const record of data) {
    education.push({
      date: record["EndDate"],
      location: record["SchoolName"],
      title: record["DegreeName"],
      content: record["Notes"].split("  "),
    });
  }
  return education;
}

async function createEducation(githubUsername: string) {
  try {
    return await createEducation_(githubUsername);
  } catch (error) {
    const education: TimelineItem[] = [];
    return education;
  }
}

async function createExperience_(githubUsername: string) {
  const raw = await getLinkedinRawExperience(githubUsername);
  const data: Record<string, string>[] = convertRawCsvToRecordList(raw);
  const experience: TimelineItem[] = [];
  for (const record of data) {
    experience.push({
      date: `${record["StartedOn"]} - ${record["FinishedOn"]}`,
      location: record["CompanyName"],
      title: record["Title"],
      content: record["Description"].split("  "),
    });
  }
  return experience;
}

async function createExperience(githubUsername: string) {
  try {
    return await createExperience_(githubUsername);
  } catch (error) {
    const experience: TimelineItem[] = [];
    return experience;
  }
}

async function createTestimonials_(githubUsername: string) {
  const raw = await getLinkedinRawRecommendations(githubUsername);
  const data: Record<string, string>[] = convertRawCsvToRecordList(raw);
  const testimonials: Testimonial[] = [];
  for (const record of data) {
    const name = record["FirstName"] + " " + record["LastName"];
    const title = record["JobTitle"];
    const company = record["Company"];
    const text = record["Text"];
    testimonials.push({
      name,
      title,
      company,
      text,
    });
  }
  const testimonialSection: TestimonialSection = { testimonials };
  return testimonialSection;
}

async function createTestimonials(githubUsername: string) {
  try {
    return await createTestimonials_(githubUsername);
  } catch (error) {
    const testimonials: Testimonial[] = [];
    const testimonialSection: TestimonialSection = { testimonials };
    return testimonialSection;
  }
}

export async function getLinkedinData(githubUsername: string) {
  const testimonialSection = await createTestimonials(githubUsername);
  const education = await createEducation(githubUsername);
  const experience = await createExperience(githubUsername);
  return { education, experience, testimonialSection };
}
