import fs from "fs/promises";
import path from "path";
import type { Plugin } from "vite";
import { getFunctionsPhp } from "./functions.js";

export type Options = {
  /**
   * The name of the directory & slug for your theme
   * @default "vitepress-theme"
   */
  themeSlug?: string;
};

const writeStyleCss = async (path: string) => {
  const content = `/**
   * Theme Name:        headless-wp
   * Theme URI:         https://example.com/
   * Description:       Custom theme description...
   * Version:           1.0.0
   * Author:            Your Name
   */

   .wp-site-blocks {
      width: 100%;
   };
   `;

  await fs.writeFile(path, content.trim(), { encoding: "utf8" });
};

export default (opts: Options = {}): Plugin => {
  const { themeSlug = "headless-vite" } = opts;
  let outDir: string = "";

  return {
    name: "wp-transform",

    apply: "build",

    config(config) {
      if (!config.experimental) config.experimental = {};

      config.experimental.renderBuiltUrl = (
        filename,
        { hostId, hostType, type },
      ) => {
        if (!filename.match(/\.(css|js)$/i)) {
          return `/wp-content/themes/${themeSlug}/${filename}`;
        }

        return { relative: true };
      };
    },

    configResolved(config) {
      outDir = config.build.outDir;
    },

    async transformIndexHtml(html, ctx) {
      await fs.writeFile(
        path.join(outDir, "index.php"),
        `<?php get_header(); ?>
        <div id="root"></div>
        <?php get_footer();`,
        {
          encoding: "utf8",
        },
      );

      await fs.writeFile(
        path.join(outDir, "header.php"),
        `<?php status_header(200) ?>
        <!DOCTYPE html>
        <html <?php language_attributes(); ?> class="no-js no-svg">

        <head>
            <meta charset="<?php bloginfo('charset'); ?>">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <?php wp_head(); ?>
        </head>

        <body <?php body_class(); ?>>
            <?php wp_body_open(); ?>`,
        {
          encoding: "utf8",
        },
      );

      await fs.writeFile(
        path.join(outDir, "footer.php"),
        `<?php wp_footer(); ?>
        </body>

        </html>`,
        {
          encoding: "utf8",
        },
      );

      const filenames = Object.keys(ctx.bundle!);

      await writeStyleCss(path.join(outDir, "style.css"));

      const functionsPhp = getFunctionsPhp(filenames);
      await fs.writeFile(path.join(outDir, "functions.php"), functionsPhp, {
        encoding: "utf8",
      });
    },

    async closeBundle() {
      const htmlPath = path.join(outDir, "index.html");
      await fs.unlink(htmlPath);
    },
  };
};
