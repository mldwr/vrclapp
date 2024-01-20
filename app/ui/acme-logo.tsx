import { GlobeAltIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      {/* <TrophyIcon className="h-12 w-12 rotate-[15deg]" /> */}
      {/* shrink-0 prevents the icon from shirnking, when the screens becomes smaller like on mobile */}
      <TrophyIcon className="h-12 w-12 shrink-0" width="0"/> 
      <p className="text-[44px]">GWV</p>
    </div>
  );
}
