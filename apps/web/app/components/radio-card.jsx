import { usePlayer } from "../contexts/player.jsx";
import Truncate from "../components/truncate.jsx";

const RadioCard = ({
  // eslint-disable-next-line react/prop-types
  stationuuid,
  // eslint-disable-next-line react/prop-types
  name,
  // eslint-disable-next-line react/prop-types
  tags,
  // eslint-disable-next-line react/prop-types
  clickcount,
  // eslint-disable-next-line react/prop-types
  votes,
  // eslint-disable-next-line react/prop-types
  language,
  // eslint-disable-next-line react/prop-types
  url,
  // eslint-disable-next-line react/prop-types
  country,
  // eslint-disable-next-line react/prop-types
}) => {
  const { player, setPlayer } = usePlayer();

  return (
    //Main
    <div
      className={`flex flex-col flex-wrap max-w-sm mx-auto bg-white rounded-xl border border-gray-200 overflow-hidden p-4 h-[220px] w-[268px] flex-shrink-0 justify-between`}
    >
      {/* Title,likes, count */}
      <div className={`flex justify-between`}>
        <div
          className={`flex items-center flex-shrink-0 h-11 w-11 bg-gradient-to-tr from-[#5539B2] to-[#D4C7FD] rounded-full flex items-center justify-center text-white text-xs font-semibold select-none`}
        >
          {name.slice(0, 2).toUpperCase()}
        </div>
        <div className={`flex flex-col justify-around pl-2`}>
          <div className={`text-base font-semibold text-gray-900`}>
            <Truncate>{name}</Truncate>
          </div>
          <div className={`text-xs text-[#00192CA3]/[0.64]`}>
            {clickcount} kişi dinliyor • {votes} beğeni
          </div>
        </div>
      </div>

      {/* Tag */}
      <div className="h-[60px] ml-0.5 flex flex-wrap gap-1.5 select-none justify-start">
        {tags &&
          tags
            .split(",")
            .slice(0, 4)
            .map((tag, index) => (
              <button
                key={index}
                className="h-[27px] px-2 py-1 bg-blue-100 text-blue-800 rounded-lg font-normal text-xs"
              >
                {tag.trim().charAt(0).toUpperCase() + tag.trim().slice(1)}
              </button>
            ))}
      </div>
      {/* Play, like, context */}
      <div className={`flex justify-between`}>
        <div className={`flex items-center`}>
          <button
            className={`flex items-center text-white rounded-full hover:bg-blue-600 focus:outline-none cursor-pointer`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
            >
              <rect width="48" height="48" rx="24" fill="#167AFE" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M31.0732 22.4182L19.0166 15.2862C17.7043 14.5103 16.0001 15.4032 16.0001 16.8685V31.1308C16.0001 32.596 17.7043 33.4907 19.0166 32.713L31.0713 25.581C32.3094 24.852 32.3094 23.1491 31.0732 22.4182Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        <div className={`flex items-center gap-4`}>
          <button
            className={`text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.7 1C16.87 1 19 3.98 19 6.76C19 12.39 10.16 17 10 17C9.84 17 1 12.39 1 6.76C1 3.98 3.13 1 6.3 1C8.12 1 9.31 1.91 10 2.71C10.69 1.91 11.88 1 13.7 1Z"
                stroke="#8C9195"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <button
            className={`text-gray-400 hover:text-gray-500 focus:outline-none`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="4"
              height="14"
              viewBox="0 0 4 14"
              fill="none"
            >
              <path
                d="M1.99699 11.4982C1.72188 11.4982 1.49678 11.7233 1.49979 11.9984C1.49979 12.2735 1.72488 12.4986 1.99999 12.4986C2.27511 12.4986 2.5002 12.2735 2.5002 11.9984C2.5002 11.7233 2.27511 11.4982 1.99699 11.4982"
                stroke="#8C9195"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1.99699 6.49768C1.72188 6.49768 1.49678 6.72277 1.49979 6.99789C1.49979 7.273 1.72488 7.4981 1.99999 7.4981C2.27511 7.4981 2.5002 7.273 2.5002 6.99789C2.5002 6.72277 2.27511 6.49768 1.99699 6.49768"
                stroke="#8C9195"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1.99699 1.49731C1.72188 1.49731 1.49678 1.72241 1.49979 1.99752C1.49979 2.27264 1.72488 2.49773 1.99999 2.49773C2.27511 2.49773 2.5002 2.27264 2.5002 1.99752C2.5002 1.72241 2.27511 1.49731 1.99699 1.49731"
                stroke="#8C9195"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RadioCard;
