import { Bot, BotError, Context, NextFunction } from "grammy";
import { run } from "@grammyjs/runner";
require("dotenv").config();
const bot = new Bot(process.env.TOKEN || ""); // <-- place your token inside this string
import {responseTime, errorCount, userCount} from "./pm2";
// 2. Reply to text messages with the raw data
bot.use(responseTime)
bot.use(userCount)
bot.on("msg", async (ctx) => {
  if (ctx.message?.forward_from) {
    await ctx.reply(
      "<b>Telegram ID's:</b>\nForwarded User ID: <code>" +
        ctx.message.forward_from.id +
        "</code>\nOwn User ID:\n<code>" +
        ctx.from.id +
        "</code>\n\n" +
        "<b>Raw Update Data:</b>\n" +
        JSON.stringify(ctx.update, null, 3),
      { parse_mode: "HTML" }
    );
  } else {
    await ctx.reply(
      "<b>Own User ID:</b> <code>" +
        ctx.from?.id +
        "</code>\n\n" +
        "<b>Raw Update Data:</b>\n" +
        JSON.stringify(ctx.update, null, 3),
      { parse_mode: "HTML" }
    );
  }
});

bot.catch(errorHandler);

function errorHandler(err: BotError) {
  bot.use(errorCount);
    //@ts-ignore
  console.error(new Date(), err.error.error_code, err.error.description);
}

run(bot);
