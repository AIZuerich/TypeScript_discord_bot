import { Command} from "discord-akairo";
import { Message} from "discord.js";

export default class PingCommand extends Command {
    public constructor(){
        super("ping", {
            aliases:["ping","internet","ws"],
            category:"Public Command",
            description:{
                content: "Check the latency of the ping to the Discord API",
                usage:"<prefix><ping>",
                examples:[
                    "kkping"
                ]
            },
            ratelimit: 3   
        });
    }

    public exec(message: Message): Promise<Message>{
        return message.util.send(`>PING: \`${this.client.ws.ping}ms\``)
    }
}