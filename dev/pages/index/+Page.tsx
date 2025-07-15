import { IconCheck, IconCopy } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoute } from "@/route-tree.gen";
import { useClipboard } from "bagon-hooks";
import { useMetadata } from "vike-metadata-solid";
import getTitle from "../../utils/get-title";

export default function Page() {
  useMetadata({
    title: getTitle("Home"),
  });

  const { copy, copied } = useClipboard();

  return (
    <>
      <div class="bg-background">
        <main class="container mx-auto px-4 py-12 md:py-24">
          <section class="mb-12 text-center">
            <h1 class="text-primary mb-4 text-4xl font-extrabold md:text-6xl">TSdot</h1>
            <p class="text-primary/80 mx-auto mb-8 max-w-md">
              The fastest + concise javascript template engine for Node.js and browsers. Just a
              minor fork of doT.js
            </p>
            <div class="flex justify-center space-x-4">
              <Button size="lg" as="a" href={getRoute("/demo")}>
                Try Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                as="a"
                href="https://github.com/blankeos/tsdot"
                target="_blank"
              >
                Learn More
              </Button>
            </div>
          </section>

          <section class="mb-12 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center">⚡️ Blazing Fast</CardTitle>
              </CardHeader>
              <CardContent>Compile-time optimizations for performance</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center">🧑‍💻 Typescript</CardTitle>
              </CardHeader>
              <CardContent>Full TypeScript support for a robust development experience</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center">🧑‍💻 Easy to Learn</CardTitle>
              </CardHeader>
              <CardContent>Revamped the docs so you can learn it!</CardContent>
            </Card>
          </section>

          <section class="flex flex-col items-center text-center">
            <h2 class="text-primary mb-4 text-lg font-bold">Add to your project</h2>
            <div class="flex w-max items-center gap-x-2 rounded-lg bg-gray-800 p-4 text-left text-white">
              <code>npm install tsdot</code>
              <button onClick={() => copy("npm install tsdot")}>
                {copied() ? <IconCheck class="h-4 w-4" /> : <IconCopy class="h-4 w-4" />}
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
