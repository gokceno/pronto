import { HeartIcon, Share1Icon, EyeOpenIcon } from '@radix-ui/react-icons';

export const GenreContextMenu = ({ t, popupRef }) => (
  <div 
    ref={popupRef}
    className="absolute left-[28rem] top-48 w-[14.0625rem] h-[11.5rem] bg-white rounded-xl p-4 gap-3 shadow-lg flex flex-col z-[9999]"
  >
    <div className="w-[12.0625rem] h-[6rem]">
      <div className="w-full py-1 px-2 flex flex-col gap-2">
        <div className='gap-2 flex flex-row items-center hover:bg-gray-100 rounded-md transition-all cursor-pointer'>
          <img
            src="/assets/music_list.svg"
            alt="music list"
            className="w-6 h-6"
          />
          <span className="font-jakarta font-medium text-sm/[1.375rem] text-[#00192C]">
            {t("addToList")}
          </span>
        </div>

        <div className='gap-2 flex flex-row items-center hover:bg-gray-100 rounded-md transition-all cursor-pointer'>
          <HeartIcon
            className="w-6 h-6"
          />
          <span className="font-jakarta font-medium text-sm/[1.375rem] text-[#00192C]">
            {t("addToFav")}
          </span>
        </div>

        <div className='gap-2 flex flex-row items-center hover:bg-gray-100 rounded-md transition-all cursor-pointer'>
          <EyeOpenIcon
            className="w-6 h-6"
          />
          <span className="font-jakarta font-medium text-sm/[1.375rem] text-[#00192C]">
            {t("showLess")}
          </span>
        </div>
      </div>
    </div>


    <div className="w-[12.0625rem] h-[2rem] mt-1">
     <div className="w-full h-[0.0625rem] mb-4 bg-gray-200"></div>
      <div className='gap-2 flex flex-row items-center hover:bg-gray-100 p-1 rounded-md transition-all cursor-pointer'>
          <Share1Icon
            className="w-6 h-6"
          />
          <span className="font-jakarta font-medium text-sm/[1.375rem] text-[#00192C]">
            {t("share")}
          </span>
      </div>
    </div>
  </div>
);