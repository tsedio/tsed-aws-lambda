/**
 * A simple example of a Lambda handler.
 * @param event
 * @param context
 * @param callback
 */
export function handler(event: unknown, context: unknown, callback: (response: unknown) => void) {
  console.log("Hello, world!", event, context);

  callback({
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello, world!",
      input: event
    })
  });
}
