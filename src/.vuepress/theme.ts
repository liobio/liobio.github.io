
import { hopeTheme } from "vuepress-theme-hope";
import { zhNavbar } from "./navbar/index.js";
import { zhSidebar } from "./sidebar/index.js";

export default hopeTheme({

  hostname: "https://blog.liobio.cn",

  author: {
    name: "Lio Bio",
    url: "https://blog.liobio.cn",
  },

  iconAssets: "fontawesome-with-brands",

  logo: "/liobio-logo.png",

  repo: "liobio/liobio.github.io",
  docsDir: "src",

  blog: {
    description: "银河小偷",
    intro: "/intro.html",
    roundAvatar: true,
    avatar: "avatar.jpg",
    medias: {
      BiliBili: "https://space.bilibili.com/17236901",
      // Bitbucket: "https://example.com",
      // Dingding: "https://example.com",
      // Discord: "https://example.com",
      // Dribbble: "https://example.com",
      // Email: "mailto:info@example.com",
      // Evernote: "https://example.com",
      // Facebook: "https://example.com",
      // Flipboard: "https://example.com",
      // Gitee: "https://example.com",
      // GitHub: "https://github.com/liobio",
      // Gitlab: "https://example.com",
      // Gmail: "mailto:info@example.com",
      // Instagram: "https://example.com",
      // Lark: "https://example.com",
      // Lines: "https://example.com",
      // Linkedin: "https://example.com",
      // Pinterest: "https://example.com",
      // Pocket: "https://example.com",
      QQ: "https://qr.api.cli.im/newqr/create?level=H&transparent=0&bgcolor=%23FFFFFF&forecolor=%23000000&blockpixel=12&marginblock=2&logourl=&size=0&text=&data=http%3A%2F%2Fqr61.cn%2Foj6vXN%2FqXi4Ymb&kid=bizcliim&time=1689244159&key=90761dba6c897c9b849c8b6d68ab3d7d&filename=%E6%9C%AA%E5%91%BD%E5%90%8D%E7%A0%81",
      // Qzone: "https://example.com",
      // Reddit: "https://example.com",
      // Rss: "https://example.com",
      // Steam: "https://example.com",
      // Twitter: "https://example.com",
      Wechat: "https://qr.api.cli.im/newqr/create?level=H&transparent=0&bgcolor=%23FFFFFF&forecolor=%23000000&blockpixel=12&marginblock=2&logourl=&size=0&text=&data=http%3A%2F%2Fqr61.cn%2Foj6vXN%2Fqwusec1&kid=bizcliim&time=1689243896&key=d240bec41a1993feff1f135fa66f8cde&filename=%E6%9C%AA%E5%91%BD%E5%90%8D%E7%A0%81",
      Weibo: "https://weibo.com/u/5936567564",
      // Whatsapp: "https://example.com",
      // Youtube: "https://example.com",
      Zhihu: "https://www.zhihu.com/people/chi-la-mi-fa-15",
    },
  },

  locales: {
    "/": {
      // navbar
      navbar: zhNavbar,
      // sidebar
      sidebar: zhSidebar,
      footer: "",
      displayFooter: true,
      // page meta
      metaLocales: {
        editLink: "在 GitHub 上编辑此页",
      },
    }
  },

  encrypt: {
    config: {
      "/demo/encrypt.html": ["1234"],
    },
  },
  fullscreen: true,
  plugins: {

    blog: true,
    copyCode: {
      showInMobile: true,
      duration: 3000,
    },
    comment: {
      // You should generate and use your own comment service
      provider: "Waline",
      serverURL: "https://waline-comment.vuejs.press",
    },
    // all features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: ["highlight", "math", "search", "notes", "zoom"],
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
    },

    // uncomment these if you want a PWA
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
