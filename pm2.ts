import {Context, NextFunction} from "grammy";
import io from "@pm2/io";

/** Measures the response time of the bot, and logs it to `console` */
export async function responseTime(
    ctx: Context,
    next: NextFunction // is an alias for: () => Promise<void>
): Promise<void> {
    // take time before
    const before = Date.now(); // milliseconds
    // invoke downstream middleware
    await next(); // make sure to `await`!
    // take time after
    const after = Date.now(); // milliseconds
    // log difference
    const latency = io.histogram({
        name: 'Response Time',
            //@ts-ignore
        measurement: 'mean',
      });
  
    console.log("Reponse time is: " + (after-before))
    latency.update(after - before);
}
export async function userCount(
    ctx: Context,
    next: NextFunction // is an alias for: () => Promise<void>
): Promise<void> {
    const currentReq = io.counter({
        name: 'Current updates handled',
      });
      currentReq.inc();

    await next(); // make sure to `await`!
    currentReq.dec();
    const currentReq2 = io.counter({
        name: 'Total Updates',
      });
      currentReq2.inc();
}
export async function errorCount(
    ctx: Context,
    next: NextFunction // is an alias for: () => Promise<void>
): Promise<void> {
          const errors = io.metric({
        name: 'Errors',
      });
      errors.set(1)
    await next(); // make sure to `await`!

}