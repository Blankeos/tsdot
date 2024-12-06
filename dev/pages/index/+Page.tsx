import { useMetadata } from "vike-metadata-solid";
import getTitle from "../../utils/get-title";

export default function Page() {
  useMetadata({
    title: getTitle("Home"),
  });
  return (
    <>
      <div>
        <h1>My Vike + Solid app</h1>
        This page is:
      </div>
    </>
  );
}
