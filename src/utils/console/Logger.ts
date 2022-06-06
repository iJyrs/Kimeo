import * as moment from "moment";
import Color from "./Color";

export default class Logger {

    static setTerminalTitle(title: string) {
        // Does not support "Color".
        process.stdout.write(String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7));
    }

    private static log(prefix: string, message: String, prefixColor?: Color, messageColor?: Color) {
        // [MMDD-hhmm-ss] [PREFIX] MESSAGE

        prefixColor === undefined ? prefixColor = Color.CONSTANTS.YELLOW : undefined;
        messageColor === undefined ? messageColor = Color.CONSTANTS.GRAY : undefined;

        let dateFormatted: string = moment().format("MMDD-hhmm-ss");

        console.log(Color.CONSTANTS.RESET+"["+dateFormatted+"] "+prefixColor+"[APP / "+prefix+"] "+messageColor+message);
    }

    public static info(message: string) {
        Logger.log("INFO", message, Color.CONSTANTS.DARK_AQUA);
    }

    public static warning(message: string) {
        Logger.log("WARNING", message, Color.CONSTANTS.YELLOW);
    }

    public static error(message: string) {
        Logger.log("ERROR", message, Color.CONSTANTS.RED);
    }

}