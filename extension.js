const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const { Gio, UPowerGlib:UPowe } = imports.gi;

let settings;
let touchpadWatcher;


const switchOSK = () => {
    let status = settings.get_string("send-events");
    let value = status == "enabled" ? false : true; 
    try {
        let keyboardsettings = new Gio.Settings({schema_id: "org.gnome.desktop.a11y.applications"});  
        keyboardsettings.set_boolean("screen-keyboard-enabled", value)
    } catch (e) {
        logError(e);
    }
}

class Extension {
    constructor() {
    }

    enable() {
        settings = ExtensionUtils.getSettings(
            "org.gnome.desktop.peripherals.touchpad"
        );
        touchpadWatcher = settings.connect(
            "changed::send-events",
            switchOSK
        )
    }

    disable() {
        settings.disconnect(touchpadWatcher);
        settings = null;
    }
}

function init() {
    return new Extension();
}
