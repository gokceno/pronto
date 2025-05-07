import React from "react";
import { formatStationName } from "../utils/helpers";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

export function ListCard({ title, stationList }) {
  return (
    <div
      className="bg-white min-w-[18.875rem] min-h-[7.25rem] rounded-lg border border-[#BDC0C2] p-3 gap-8 hover:scale-105 transition-all"
    >
        <div className="w-full h-full gap-6 flex flex-col">
            <div className="w-full h-[1.75rem] flex flex-row gap-2 items-center justify-between">
                <span className="font-jakarta font-semibold text-xl text-[#00192C]">{title}</span>
                <DotsVerticalIcon className="w-6 h-6 text-[#A1A1AA]"/>
            </div>

            <div className="w-full h-10 flex items-center">
                {stationList?.map((station, idx) => (
                    <div
                        key={station}
                        className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-sm"
                        style={{
                            background: "#8C8CE4",
                            marginLeft: idx === 0 ? 0 : -16, 
                            zIndex: stationList.length + idx, 
                        }}
                    >
                        <span className="font-jakarta font-semibold text-[0.75rem]">
                          {formatStationName(station)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    
    </div>
  );
}
