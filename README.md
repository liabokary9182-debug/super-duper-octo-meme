# 静夜塔罗

一个无需账号、无需 API 密钥的中文塔罗网站。用户先提问，网站按问题推荐一张或三张牌；用户从洗好的 78 张马赛塔罗中亲手抽牌，最后在浏览器里查看结合问题焦点、牌位和正逆位的解读。界面包含书页式章节过场和浏览器本地生成的轻音效，可随时关闭。

## 本地运行

在此目录执行：

```sh
python -m http.server 8765
```

打开 `http://localhost:8765/`。网站为纯 HTML、CSS、JavaScript，无构建步骤或运行时依赖。

## 发布

把整个目录提交到 GitHub 仓库的根目录，在仓库 Settings → Pages 里选择 **Deploy from a branch**，来源选择 `main` / `(root)`。GitHub Pages 将以 HTTPS 提供站点。静态资源全部使用相对路径，项目仓库地址也可以正常工作。

GitHub Pages 的中国大陆连通性取决于当地网络，不能保证每个地区或运营商都能访问。若要提供中国大陆稳定访问，需要另行配置符合当地要求的中国大陆托管与域名；本项目可以原样作为静态文件部署到对象存储或其他静态主机。

## 隐私与安全

- 问题只在当前页面内存中处理，不保存到 Cookie 或本地存储，不向外部 API 发送。
- 页面没有第三方脚本、字体、图库或统计代码；牌图随站点一同发布。
- 内容安全策略限制资源来源。用户输入仅通过 `textContent` 呈现，不插入 HTML。
- 浏览器使用 `crypto.getRandomValues` 洗牌、抽取正逆位。
- 音效在用户点击后才通过 Web Audio API 合成，不加载音频文件；遵循系统的减少动态效果设置。
- 解读用于自我探索，不替代医疗、法律或财务建议。

## 牌图来源

完整的 78 张牌与牌背来自 [SONDLecT / woodcut-tarot](https://github.com/SONDLecT/woodcut-tarot)，采用 [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) 授权。该项目根据法国国家图书馆所藏的 17 世纪马赛塔罗木刻牌绘制。本站的界面与中文解读为独立创作。

牌阵参考 [Labyrinthos 的三张牌阵说明](https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/3-card-tarot-spreads-simple-tarot-spreads-organized-by-layout)。交互方向参考开源项目 [anois/tarot](https://github.com/anois/tarot)，视觉与代码为独立实现。

