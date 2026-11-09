import { readFileSync } from "node:fs";
import path from "node:path";

import { appetites, courses, type Appetite, type CourseId } from "./menu";

export type Stories = Record<Appetite, Record<CourseId, string[]>>;

const contentRoot = path.join(process.cwd(), "content");

function readParagraphs(appetite: Appetite, file: string) {
  const text = readFileSync(path.join(contentRoot, appetite.toLowerCase(), file), "utf8");
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.split("\n").map((line) => line.trim()).join(""))
    .filter(Boolean);
}

export function loadStories(): Stories {
  return Object.fromEntries(
    appetites.map((appetite) => [
      appetite,
      Object.fromEntries(courses.map((course) => [course.id, readParagraphs(appetite, course.file)])),
    ]),
  ) as Stories;
}
