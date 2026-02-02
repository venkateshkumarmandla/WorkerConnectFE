import React from "react";
import { format } from "date-fns";

import { Clock } from "lucide-react";

interface LastLoggedInProps {
  time?: string | Date | null;
  formatStr?: string;
}

const LastLoggedIn: React.FC<LastLoggedInProps> = ({ time, formatStr = "dd MMM yyyy, HH:mm" }) => {
  const displayTime = time ? format(new Date(time), formatStr) : "Never Logged In";

  return (
    <div className="flex items-center space-x-2">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Clock className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">Last Logged In</p>
        <p className="text-sm lg:text-base font-bold text-gray-900 whitespace-nowrap">
          {displayTime}
        </p>
      </div>
    </div>
  );
};

export default LastLoggedIn;
