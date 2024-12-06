import { type FlowProps } from "solid-js";
import { useMetadata } from "vike-metadata-solid";
import { Head } from "vike-solid/Head";
import { usePageContext } from "vike-solid/usePageContext";
import getTitle from "../utils/get-title";

import "@/styles/app.css";

useMetadata.setGlobalDefaults({
  title: getTitle("Home"),
  description: "Roll your own auth with the Lucia book with super easy to copy examples.",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
});

export default function RootLayout(props: FlowProps) {
  const pageContext = usePageContext();

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Demo showcasing Vike" />
        <link rel="icon" href={`${pageContext.urlParsed.origin}/logo.svg`} />
      </Head>

      <div>
        <nav>
          <a href="/">Home</a>
          <span>{" | "}</span>
          <a href="/demo">Demo</a>
          <span>{" | "}</span>
        </nav>
        {props.children}
      </div>
    </>
  );
}
