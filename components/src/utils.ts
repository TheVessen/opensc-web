import fs from "fs";
import path from "path";
import YAML from "yaml";

export type Post = {
  metadata: any;
  slug: string;
  content: string;
};

export function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  if (!match) {
    throw new Error("Frontmatter not found");
  }
  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const metadata = YAML.parse(frontMatterBlock);

  return { metadata, content };
}

export function getMDXFiles(dir: string) {
  try {
    return fs
      .readdirSync(dir)
      .filter(
        (file) =>
          path.extname(file) === ".mdx" && !path.basename(file).startsWith("_"),
      );
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}

export function readMDXFile(filePath: string) {
  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    return parseFrontmatter(rawContent);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return { metadata: {}, content: "" };
  }
}

export function parseSlug(fileBasename: string) {
  const prefix = fileBasename.indexOf("-");
  if (prefix !== -1 && !isNaN(Number(fileBasename.slice(0, prefix)))) {
    return fileBasename.slice(prefix + 1);
  }
  return fileBasename;
}

export function getMDXData(dir: string): Post[] {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = parseSlug(path.basename(file, path.extname(file)));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getPosts(dir?: string) {
  return getMDXData(path.join(process.cwd(), "content", dir || ""));
}