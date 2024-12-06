import { onMount, VoidProps } from "solid-js";
import { createStore } from "solid-js/store";
import { useMetadata } from "vike-metadata-solid";
import getTitle from "../../utils/get-title";

import { useDebouncedCallback } from "../../hooks/use-debounced-callback";

// import doT from "@/../src/index";
import doT from "../../../src/index";

type TemplateData = {
  name: string;
  messages: number;
};
const INITIAL_TEMPLATE = `
<h1>Hello, {{=it.name}}!</h1>
<p>You have {{=it.messages}} new messages.</p>
`;

export default function DemoPage() {
  useMetadata({
    title: getTitle("Demo"),
  });

  const [values, setValues] = createStore({
    template: "",
    data: "",
    result: "",
  });

  let templateFunction: (data: TemplateData) => string = () => "No result";

  function setTemplate(value: string) {
    setValues("template", value);
    compileTemplate(value);
  }

  const compileTemplate = useDebouncedCallback((template: string) => {
    templateFunction = doT.template<TemplateData>(template);
  }, 200);

  function setData(value: string) {
    setValues("data", value);
    try {
      compileData(JSON.parse(value) ?? "");
    } catch (e) {
      console.log("invalid json.");
    }
  }

  const compileData = useDebouncedCallback((value: Object) => {
    console.log("compiled data");
    setResult(templateFunction(value as TemplateData));
  }, 300);

  function setResult(value: string) {
    setValues("result", value);
  }

  onMount(() => {
    setTemplate(INITIAL_TEMPLATE);
    setData(`{ name: "John", messages: 5 }`);
  });

  return (
    <div>
      <h1>Demo</h1>
      <div class="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5">
        <CodeField value={values.template} onInput={(_) => setTemplate(_)} label="Template" />
        <div class="flex gap-4">
          <CodeField value={values.data} onInput={(_) => setData(_)} label="Data" />
          <CodeField value={values.result} onInput={(_) => setResult(_)} label="Result" />
        </div>

        <button
          onClick={() => {
            console.log("asd", templateFunction({ name: "John", messages: 1 }));
            templateFunction({ name: "John", messages: 1 });
          }}
        >
          COMPILE
        </button>
      </div>
    </div>
  );
}

type CodeFieldProps = {
  value: string;
  onInput: (value: string) => void;
  label?: string;
};

function CodeField(props: VoidProps<CodeFieldProps>) {
  return (
    <div class="relative min-h-40 w-full">
      <textarea
        class="absolute inset-0 rounded-xl border p-4 font-mono"
        value={props.value}
        onInput={(e) => {
          props.onInput(e.currentTarget.value);
        }}
      />
      <div class="absolute right-0 top-0 rounded-xl rounded-br-none rounded-tl-none bg-neutral-400 p-2 text-sm">
        {props.label}
      </div>
    </div>
  );
}
