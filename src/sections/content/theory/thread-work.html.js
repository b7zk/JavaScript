export default `
<h1>How JS thread works?</h1>
<ul>
<li>JavaScript is single-threaded, meaning it executes code in a single sequence.</li>
<li>Functions are executed one at a time, in the order they are called, using a call stack.</li>
<li>Asynchronous operations (like setTimeout, fetch) are handled using an event loop.</li>
<li>When an async operation completes, its callback is added to the event queue.</li>
<li>The event loop checks the call stack and, if it's empty, processes the next callback from the event queue.</li>
<li>This allows JavaScript to perform non-blocking operations, like handling user input or network requests.</li>
<ul>
`;
