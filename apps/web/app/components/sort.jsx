import { Link } from "@remix-run/react";
import { useState } from "react";

const Sort = () => {
  return (
    <div className="text-sm">
      Sort by:
      <Link
        to="?s=name"
        className="text-blue-600 hover:text-blue-800 ml-2"
      >
        Name
      </Link>{" "}
      |
      <Link
        to="?s=votes"
        className="text-blue-600 hover:text-blue-800 ml-2"
      >
        Upvotes
      </Link>{" "}
      |
      <Link
        to="?s=clickcount"
        className="text-blue-600 hover:text-blue-800 ml-2"
      >
        Listens
      </Link>{" "}
    </div>
  );
};

export default Sort;
