export default `
<h1>Why is JavaScript not asynchronous?</h1>
<p>JavaScript can only handle a single sequential process at a time. It uses a LIFO (Last In, First Out) structure known as the call stack.
The last function added to the call stack is the first one to finish, allowing the others (waiting for the main thread) to continue.
In this sense, we can say the last function is resolved first. </p>
`;
