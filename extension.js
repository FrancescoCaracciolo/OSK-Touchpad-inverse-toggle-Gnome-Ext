const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const { Gio, UPowerGlib:UPower } = imports.gi;

let settings;
let touchpadWatcher;

const switchOSK = () => {
    let status = settings.get_string("send-events")
    log(status);
    let value = status == "enabled" ? "false" : "true"; 
    log(value);
    try {
        Gio.Subprocess.new(
            ["gsettings", "set", "org.gnome.desktop.a11y.applications", "screen-keyboard-enabled", value],
            Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
        );
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
