import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "文章",
    icon: "book",
    link: "/article",
  },
  {
    text: "博客分类",
    icon: "signs-post",
    prefix: "/",
    children: ["unity/README", "posts/README"]

  },
  {
    text: "VuePress使用手册",
    icon: "book-open",
    link: "https://theme-hope.vuejs.press/zh/guide/",
  },
  {
    text: "ChatGPT聊天助手",
    icon: "robot",
    link: "https://openai.liobio.cn",
  },

]);
