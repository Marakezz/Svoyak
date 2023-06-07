import React from "react";
import socket from "../../socket";

function GameDisplay({role}) {

    return( 
        <div 
            className="
                w-full
                md:w-2/4
                lg:w-3/5
                flex
                flex-row
                bg-neutral-50
                h-1/2
                md:h-[600px]
            "
        >
            I am {role}
        </div>
    )
}

export default GameDisplay;