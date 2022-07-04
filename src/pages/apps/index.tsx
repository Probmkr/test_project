import Layout from "../../components/layout/layout";
import Link from "next/link";
import { GetStaticProps, NextPage } from "next";
import path from "path";
import { globby } from "globby";
import { MyAppData, MyAppProps } from "../../types/app-data/app-data.d";
import dynamic from "next/dynamic";

const Apps: NextPage<{ appProps: MyAppProps[] }> = ({ appProps }) => {
  // console.log(appProps);
  // console.log(require.cache);
  return (
    <Layout pageTitle="Apps">
      <h1>全アプリ一覧</h1>
      <p>今はまだ作成途中なので IP を表示する超簡単なアプリをどうぞ</p>
      <Link href="/apps/2022/your-ip">あなたの IP アドレス</Link>
      <Link href="/apps/2022/your-req-header">あなたのリクエストヘッダー</Link>
      <Link href="/apps/2022/ping">Ping を実行</Link>
      <Link href="/apps/2022/caesar">Caesar 暗号解読機</Link>
    </Layout>
  );
};

const getStaticProps: GetStaticProps<{
  appProps: MyAppProps[];
}> = async () => {
  const CWD = path.join(process.cwd(), "src/pages/apps");
  console.log(CWD);
  const appDirs = await globby(["*/*/data.ts"], {
    cwd: CWD,
  });
  console.log("debug start", appDirs);
  const appProps: MyAppProps[] = await Promise.all(
    appDirs.map(async (appDataFile) => {
      const importPath = `./${appDataFile.replace(/\.ts$/, "")}`;
      // const importPath = `./${appDataFile}`;
      // delete require.cache[require.resolve("./" + appDataFile)];
      // const importPath = "./2022/caesar/data";
      // const appData = require(importPath).AppData;
      const appData = await import(`${importPath}`).then((mod) => mod.AppData);
      console.log(importPath.constructor.name);
      // const appData = require("./2022/caesar/data").AppData;
      // console.log(importPath === "./2022/caesar/data");
      console.log(appData);
      // const appData = {} as MyAppData;
      console.log(importPath);
      return {
        app_code: appDataFile.split("/").pop(),
        app_path: path.dirname(appDataFile),
        app_data: appData,
      };
    })
  );
  console.log("fuck");
  return {
    props: {
      appProps: appProps,
    },
  };
};

export { getStaticProps };

export default Apps;
