![launchpad](/.github/banner.png?raw=true)

**Note: This project is an experiment and not ready for anything serious yet.**

*tatao* is a small, extensible static site generator. It combines the best features of [Metalsmith](https://metalsmith.io/) and [Hugo](https://gohugo.io/). The main goals are:

* **Extensible**: The core of tatao is just a few hundred lines of code and everything else is implemented as a plugin.
* **Internationalization**: We live in a connected world with people from all over the globe coming to your website–that is why tatao has i18n baked in.
* **Performance**: The goal is to have reasonable performance (below 5s for 100 pages). Due to the language choice and plugin approach this project will probably never match the speed of Hugo, but that is ok.


```javascript
import { Builder, source, write, clean } from "@tatao/core";
import { mdx } from "@tatao/plugin-mdx";
import { react } from "@tatao/plugin-react";
import { layout } from "@tatao/plugin-layout";
import { ejs } from "@tatao/plugin-ejs";

new Builder()
  .use(clean(["./public"]))
  .use(source("./src/pages/", ["/**"]))
  .use(mdx())
  .use(react())
  .use(layout("./src/layouts", "ejs"))
  .use(ejs())
  .use(write("./public"))
  .run();
```
