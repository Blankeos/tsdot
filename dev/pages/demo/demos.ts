export type Demo = {
  id: string;
  name: string;
  template: string;
  data: string;
  description: string;
};

export const demos: Demo[] = [
  {
    id: "basic-interpolation",
    name: "Basic Interpolation",
    description: "Demonstrates basic interpolation with `{{=it.property}}`.",
    template: `<h1>Hello, \{\{=it.name}}!</h1>
<p>You have \{\{=it.messages}} new messages.</p>`,
    data: `{ "name": "John Doe", "messages": 5 }`,
  },
  // encode example does not work.
  //   {
  //     id: "interpolation-with-encoding",
  //     name: "Interpolation with Encoding",
  //     description: "Shows interpolation with HTML encoding using `{{!it.property}}` to prevent XSS.",
  //     template: `<h1>User Input (Encoded):</h1>
  // <p>\{\{!it.userInput\}}</p>

  // <h1>User Input (Unencoded - Dangerous!):</h1>
  // <p>\{\{=it.userInput\}}</p>`,
  //     data: `{ "userInput": "<script>alert('XSS Attack!');</script><b>Malicious Content</b>" }`,
  //   },
  {
    id: "conditionals",
    name: "Conditionals (`{{? ... }}`)",
    description: "Uses `{{? ... }}` for conditional rendering based on data properties.",
    template: `<h1>User Profile:</h1>
<p>Name: {{=it.user.name}}</p>
{{? it.user.isAdmin }}
  <p>Status: <strong>Administrator</strong></p>
{{??}}
  <p>Status: Regular User</p>
{{?}}

{{? it.notifications > 0 }}
  <p>You have {{=it.notifications}} unread notifications.</p>
{{?}}`,
    data: `{ "user": { "name": "Alice", "isAdmin": true }, "notifications": 3 }`,
  },
  {
    id: "array-iteration",
    name: "Array Iteration (`{{~ ... }}`)",
    description: "Demonstrates iterating over an array using `{{~ it.items :value:index }}`.",
    template: `<h1>Shopping List:</h1>
<ul>
{{~ it.items :item:index}}
  <li>{{=index + 1}}. {{=item.name}} (Quantity: {{=item.quantity}})</li>
{{~}}
</ul>

<h1>Users:</h1>
<ol>
{{~ it.users :user}}
  <li>{{=user.name}} - {{=user.email}}</li>
{{~}}
</ol>`,
    data: `{
  "items": [
    { "name": "Milk", "quantity": 1 },
    { "name": "Eggs", "quantity": 12 },
    { "name": "Bread", "quantity": 2 }
  ],
  "users": [
    { "name": "Bob", "email": "bob@example.com" },
    { "name": "Charlie", "email": "charlie@example.com" }
  ]
}`,
  },
  {
    id: "string-comparison-conditionals",
    name: "String Comparison Conditionals",
    description:
      "Demonstrates conditional rendering based on string value comparisons (e.g., `it.framework === 'react'`).",
    template: `<h1>Your Favorite Framework:</h1>
{{? it.framework === "react" }}
  <p>You are a React enthusiast!</p>
{{?? it.framework === "solid" }}
  <p>SolidJS is your go-to!</p>
{{??}}
  <p>You prefer {{=it.framework || "an unknown framework"}}.</p>
{{?}}`,
    data: `{ "framework": "angular" }`,
  },
];
