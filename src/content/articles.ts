import fm from "front-matter";
import { marked } from "marked";

export type ArticleFrontmatter = {
  title: string;
  date: string;
  tags: string[];
  slug: string;
};

export type Article = {
  frontmatter: ArticleFrontmatter;
  content: string;
  html: string;
};

type ArticleModule = {
  default: string;
};

// Import all markdown files at build time
const articleModules = import.meta.glob<ArticleModule>(
  "./articles/*.md",
  { eager: true, query: "?raw", import: "default" }
);

export function getAllArticles(): Article[] {
  const articles: Article[] = [];

  for (const path in articleModules) {
    const raw = articleModules[path] as unknown as string;
    const parsed = fm<ArticleFrontmatter>(raw);

    articles.push({
      frontmatter: parsed.attributes,
      content: parsed.body,
      html: marked(parsed.body) as string,
    });
  }

  // Sort by date, newest first
  return articles.sort((a, b) => {
    return (
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
    );
  });
}

export function getArticleBySlug(slug: string): Article | undefined {
  const articles = getAllArticles();
  return articles.find((article) => article.frontmatter.slug === slug);
}
