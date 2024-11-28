import Info from "./Info";
import Participents from "./Participents";
import Toolbar from "./Toolbar";

export default function Canvas () {
    return (
        <div className="h-full w-full realtive bg-neutral-100">
            <Info />
            <Participents />
            <Toolbar    />
        </div>
    )
}