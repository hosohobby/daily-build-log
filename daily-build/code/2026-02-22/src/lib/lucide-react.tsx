import { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function createIcon(path: ReactNode) {
  return function Icon({ size = 16, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {path}
      </svg>
    );
  };
}

export const CloudSun = createIcon(<><path d="M12 2a6 6 0 0 0-6 6"/><path d="M5 13a4 4 0 1 0 0 8h11a4 4 0 1 0-.5-8"/><path d="M14 6a4 4 0 0 1 4 4"/></>);
export const CheckCircle2 = createIcon(<><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></>);
export const TriangleAlert = createIcon(<><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></>);
export const Clock3 = createIcon(<><circle cx="12" cy="12" r="10"/><path d="M12 6v6h4"/></>);
export const LoaderCircle = createIcon(<><path d="M21 12a9 9 0 1 1-6.219-8.56"/></>);
export const Droplets = createIcon(<><path d="M7 16a5 5 0 1 0 10 0c0-2.5-2.5-6-5-9-2.5 3-5 6.5-5 9"/></>);
export const Thermometer = createIcon(<><path d="M14 14.76V3.5a2 2 0 1 0-4 0v11.26a4 4 0 1 0 4 0Z"/></>);
export const Umbrella = createIcon(<><path d="M22 12A10 10 0 0 0 2 12Z"/><path d="M12 12v8a2 2 0 0 0 4 0"/></>);
export const Wind = createIcon(<><path d="M17.7 7.7a2.5 2.5 0 1 1 3.5 3.6H3"/><path d="M9.6 4.6A2 2 0 1 1 12.5 7H3"/><path d="M12.6 19.4A2 2 0 1 0 15.5 17H3"/></>);
export const Settings2 = createIcon(<><path d="M14 17H5"/><path d="M19 7h-9"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></>);
