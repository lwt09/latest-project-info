// todo: 导出 vite 插件， 功能是在 build 时候注入 share 内的 getProjectInfo 信息到window

import getProjectInfo from 'src/share/getProjectInfo';
import { Plugin } from 'vite';
import { IOptions } from '../types/IOptions';

export default function injectLastestProjectInfoForVitePlugin(
  inputOptions?: IOptions
): Plugin {
  return {
    name: 'lastestProjectInfoPlugin',
    transformIndexHtml(html) {
      const projectInfo = getProjectInfo()
      let injectInfo = JSON.stringify(getProjectInfo());
      if(inputOptions?.extraInfo) {
        injectInfo = JSON.stringify({...projectInfo, ...inputOptions.extraInfo})
      }
      const injectHtml = `setTimeout(() => {
        printInfo(projectInfo)
      }, 100);`;

      const printInfo = `function printInfo(injectInfo) {
        console.log('[latest-project-info] logInfo:');
        console.log(injectInfo);
      };`;

      let res = html;
      res = res.replace(
        '</body>',
        ` 
          <script>
            (function() {
              const projectInfo = ${injectInfo};
              ${injectHtml}
              ${printInfo}
            })()
          </script>
        </body>
      `
      );

      return res;
    },
  };
}
