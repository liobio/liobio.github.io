import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchProPlugin } from "vuepress-plugin-search-pro";

export default defineUserConfig({

  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "BLOGS-LIOBIO",
      description: "blogs",
    }
  },
  plugins: [
    // searchProPlugin(
    //   {
    //     indexContent: true,
    //     hotReload: true,
    //     customFields: [
    //       {
    //         getter: (page) => page.frontmatter.category as string[],
    //         formatter: "分类：$content",
    //       },
    //       {
    //         getter: (page) => page.frontmatter.tag as string[],
    //         formatter: "标签：$content",
    //       },
    //     ],
    //   }),

    searchProPlugin({
      indexContent: true,
      hotReload: true,
      customFields: [
        {
          getter: ({ frontmatter }) => frontmatter.tag as string[],
          formatter: `Tag: $content`,
        },
      ],
    }),
  ],
  theme,

});

