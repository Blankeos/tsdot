import { createSignal, onMount, VoidProps } from "solid-js";
import { createStore } from "solid-js/store";
import { useMetadata } from "vike-metadata-solid";
import getTitle from "../../utils/get-title";

import { Button } from "@/components/ui/button";
import { SelectComp } from "@/components/ui/select"; // Corrected import path
import { cn } from "@/utils/cn"; // Assuming @/utils/cn maps to your utility functions
import doT from "../../../src/index";
import { demos } from "./demos"; // Import Demo type and demos here

// Use the first demo as the initial state
const INITIAL_DEMO = demos[0];
// INITIAL_TEMPLATE and INITIAL_DATA_STRING are no longer directly used after onMount

export default function DemoPage() {
  useMetadata({
    title: getTitle("Demo"),
  });

  const [selectedDemoValue, setSelectedValueDemo] = createSignal<{
    value: string;
    label: string;
  } | null>(null);

  const [values, setValues] = createStore({
    template: "",
    data: "",
    result: "",
    error: "", // To store error messages during compilation or parsing
    selectedDemoId: INITIAL_DEMO.id, // New state to track selected demo
  });

  // Type for the data passed to doT.template
  // This type is just a generic example, the actual data structure will vary by demo
  type TemplateData = Record<string, any>;

  function handleCompile() {
    setValues("error", ""); // Clear previous errors

    try {
      // 1. Compile the template
      const templateFunction = doT.template<TemplateData>(values.template);

      // 2. Parse the data
      let parsedData: TemplateData;
      try {
        parsedData = JSON.parse(values.data);
      } catch (e) {
        setValues("error", "Error parsing data JSON. Please ensure it's valid JSON.");
        setValues("result", ""); // Clear result on data parse error
        return;
      }

      // 3. Render the template with data
      const renderedResult = templateFunction(parsedData);
      setValues("result", renderedResult);
    } catch (_e: any) {
      // Catch compilation errors from doT.template
      setValues("error", `Error compiling template: ${_e.message || _e}`);
      setValues("result", ""); // Clear result on template compile error
    }
  }

  // New handler for when a demo is selected from the dropdown
  function handleDemoChange(params: { label: string; value: string } | null) {
    console.log(params, "asd");
    if (!params) return;
    console.log(params, "asd2");
    const selected = demos.find((d) => d.id === params.value);

    if (selected) {
      setSelectedValueDemo(params);
      setValues("selectedDemoId", params.value);
      setValues("template", selected.template);
      setValues("data", selected.data);
      setValues("error", ""); // Clear any existing error when changing demo
      // Trigger compilation and render for the new demo
      handleCompile();
    }
  }

  onMount(() => {
    // Set initial values from the first demo
    setValues("template", INITIAL_DEMO.template);
    setValues("data", INITIAL_DEMO.data);
    setValues("selectedDemoId", INITIAL_DEMO.id);
    // Trigger initial compilation and render on mount
    handleCompile();
  });

  return (
    <div class="bg-background h-full px-4 py-20">
      <h1 class="text-foreground mb-6 text-center text-4xl font-bold">TSDot Demo</h1>
      <div class="bg-card border-border mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-lg border p-6 shadow-lg">
        {/* Demo Selector */}
        <div class="flex items-center gap-4">
          <div class="flex flex-col gap-1">
            <label for="demo-select" class="text-muted-foreground text-xs">
              Select Demo:
            </label>
            <SelectComp
              value={selectedDemoValue()}
              onChange={handleDemoChange}
              optionTextValue={(d) => d.label}
              optionValue={(d) => d.value}
              options={demos.map((d) => ({ value: d.id, label: d.name }))} // Map demos to their IDs as strings for the options
              placeholder="Select a demo"
              // The class for the trigger can be passed directly to SelectComp
              // as it will apply to the underlying SelectTrigger component.
              class="w-[280px]"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-muted-foreground text-xs">Description:</span>
            <span class="text-foreground text-sm">
              {demos.find((d) => d.id === values.selectedDemoId)?.description}
            </span>
          </div>
        </div>

        <CodeField
          value={values.template}
          onInput={(val) => setValues("template", val)}
          label="Template"
        />
        <div class="flex flex-col gap-6 md:flex-row">
          <CodeField
            value={values.data}
            onInput={(val) => setValues("data", val)}
            label="Data (JSON)"
            error={values.error}
          />
          <CodeField
            value={values.result}
            // onInput for result is generally not needed if it's read-only
            label="Rendered Result (HTML)"
            readonly
          />
        </div>

        {values.error && (
          <div class="text-destructive mt-2 text-center text-sm">{values.error}</div>
        )}

        <Button onClick={handleCompile} class="mt-4 w-fit self-end">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-play"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Compile & Render
        </Button>

        <div class="bg-muted text-muted-foreground border-border mt-4 rounded-md border p-4 font-mono">
          <h3 class="text-foreground mb-2 text-lg font-semibold">Live HTML Output:</h3>
          {/* Using innerHTML to display the rendered HTML is intentional for this demo to show results.
              In a production app, sanitize input or use a safer method if displaying user-generated HTML. */}
          <div innerHTML={values.result} class="prose text-foreground max-w-none"></div>
        </div>
      </div>
    </div>
  );
}

type CodeFieldProps = {
  value: string;
  onInput?: (value: string) => void; // Made onInput optional
  label?: string;
  readonly?: boolean;
  error?: string;
};

function CodeField(props: VoidProps<CodeFieldProps>) {
  return (
    <div class="relative w-full flex-1">
      <div class="bg-card text-muted-foreground absolute -top-3 left-4 px-2 text-xs font-semibold">
        {props.label}
      </div>
      <textarea
        class={cn(
          "block w-full resize-y rounded-xl border p-4 font-mono text-sm", // Removed absolute inset-0, added block w-full
          "min-h-[160px]", // Set a min-height directly on the textarea
          "mt-4", // Add top margin to account for the absolute label above it
          "text-foreground", // Ensure text color is consistent with shadcn theme
          "focus:ring-primary focus:border-transparent focus:ring-2 focus:outline-none",
          "transition-all",
          props.readonly ? "bg-muted-foreground/10 cursor-not-allowed" : "bg-background",
          props.error ? "border-destructive focus:ring-destructive" : "border-input"
        )}
        value={props.value}
        onInput={(e) => {
          if (!props.readonly) {
            props.onInput?.(e.currentTarget.value); // Added optional chaining
          }
        }}
        readOnly={props.readonly}
      />
      {/* Display error message below the field */}
      {props.error && (
        <span class="text-destructive absolute -bottom-6 left-4 text-xs">{props.error}</span>
      )}
    </div>
  );
}
// The warning about 'Empty components are self-closing' for SelectValue is handled
// by ensuring it's self-closed within the JSX: `<SelectValue placeholder="Select a demo" />`.
// The innerHTML warning is acknowledged as intentional for this demo's purpose.
