import { sidebar } from "vuepress-theme-hope";
export const zhSidebar = sidebar({
  "/": [
    "",
    {
      text: "Unity专栏",
      icon: "/unity.svg",
      prefix: "unity/",
      link: "unity/",
      children: "structure",
    },
    {
      text: "杂项",
      icon: "receipt",
      prefix: "posts/",
      link: "posts/",
      children: "structure",
    },
    "intro",
    "slides",
  ],
});
