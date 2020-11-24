
import { AkairoClient, CommandHandler, ListenerHandler, BotOptions} from "discord-akairo";
import {User, Message} from "discord.js";
import {join} from "path";
import {token, owners, prefix} from "../Config";


declare module "discord-akairo" {
    interface AkairoClient{
        commandHandler:CommandHandler;
        listenerHandler: ListenerHandler;

    }

    interface BotOptions {
        token?:string;
        owners?:string|string[];

    }

    
}

export default class BotClient extends AkairoClient {
    public config: BotOptions;
    public listenerHandler: ListenerHandler = new ListenerHandler(this,{
       directory: join(__dirname, "..", "listener") 
    })
    public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: join(__dirname, "..", "commands"),
    prefix: prefix,
    allowMention:true,
    handleEdits: true,
    commandUtil:true,
    commandUtilLifetime:3e5,
    defaultCooldown:6e4,
    argumentDefaults:{
        prompt:{
            modifyStart:(_:Message, str:string):string => `${str}\n\nType \`cancel\` to cancel the command...`,
            modifyRetry:(_:Message, str:string):string => `${str}\n\nType \`cancel\` to cancel the command...`,
            timeout:"You took to long. Your command is cancelled",
            ended: "You exceeded the maximum amount of using this command",
            cancel: "This command has been cancelled",
            retries:3,
            time:3e4   

        },
        otherwise:"",
    },
    ignorePermissions: owners
    });


    public constructor(config: BotOptions){
        super({
            ownerID: config.owners
        });
        
        this.config = config;
    }

    private async _init(): Promise<void>{
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler:this.listenerHandler,
            process
        })

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }


    public async start(): Promise<string>{
        await this._init();
        return this.login(this.config.token);
    }

}