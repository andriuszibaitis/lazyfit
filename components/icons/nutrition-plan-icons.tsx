"use client";

interface IconProps {
  size?: number;
  className?: string;
}

export function SwimmingIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_swimming)">
        <path
          d="M16.5 9C17.7426 9 18.75 7.99264 18.75 6.75C18.75 5.50736 17.7426 4.5 16.5 4.5C15.2574 4.5 14.25 5.50736 14.25 6.75C14.25 7.99264 15.2574 9 16.5 9Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.75 18.151C10.5 12.555 13.5 23.445 20.25 17.8491"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.75 14.401C10.5 8.80502 13.5 19.695 20.25 14.0991"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.7731 15.5231L12.3862 10.1363C10.6985 8.4484 8.40941 7.50011 6.0225 7.5H3.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 12.7531L11.1516 9.10156"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_swimming">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function DumbbellIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.25 5.25H6C5.58579 5.25 5.25 5.58579 5.25 6V18C5.25 18.4142 5.58579 18.75 6 18.75H8.25C8.66421 18.75 9 18.4142 9 18V6C9 5.58579 8.66421 5.25 8.25 5.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 5.25H15.75C15.3358 5.25 15 5.58579 15 6V18C15 18.4142 15.3358 18.75 15.75 18.75H18C18.4142 18.75 18.75 18.4142 18.75 18V6C18.75 5.58579 18.4142 5.25 18 5.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 7.5H21C21.1989 7.5 21.3897 7.57902 21.5303 7.71967C21.671 7.86032 21.75 8.05109 21.75 8.25V15.75C21.75 15.9489 21.671 16.1397 21.5303 16.2803C21.3897 16.421 21.1989 16.5 21 16.5H18.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.25 16.5H3C2.80109 16.5 2.61032 16.421 2.46967 16.2803C2.32902 16.1397 2.25 15.9489 2.25 15.75V8.25C2.25 8.05109 2.32902 7.86032 2.46967 7.71967C2.61032 7.57902 2.80109 7.5 3 7.5H5.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.75 12H23.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.75 12H2.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LeafIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_leaf)">
        <path
          d="M5.98183 18.0181C1.49214 10.5359 7.48183 3.05368 20.1981 3.8018C20.9462 16.5218 13.464 22.5077 5.98183 18.0181Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 9L3.75 20.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_leaf">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function PotIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_pot)">
        <path
          d="M9 1.5V4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 1.5V4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 1.5V4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.75 7.5H20.25V17.25C20.25 17.8467 20.0129 18.419 19.591 18.841C19.169 19.2629 18.5967 19.5 18 19.5H6C5.40326 19.5 4.83097 19.2629 4.40901 18.841C3.98705 18.419 3.75 17.8467 3.75 17.25V7.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.25 9L20.25 11.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0.75 9L3.75 11.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_pot">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function YogaIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_yoga)">
        <path
          d="M14.25 7.5C15.4926 7.5 16.5 6.49264 16.5 5.25C16.5 4.00736 15.4926 3 14.25 3C13.0074 3 12 4.00736 12 5.25C12 6.49264 13.0074 7.5 14.25 7.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.25 9.89877C5.25 9.89877 8.25 7.4922 12.75 10.555C17.4816 13.7706 20.25 12.5097 20.25 12.5097"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.375 15.1094C12.0466 15.4694 16.5025 16.8756 16.5025 21.7506"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.6038 10.4531C12.0347 12.6778 9.26344 19.3753 3 18.7491"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_yoga">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function PlantIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_plant)">
        <path
          d="M12 21C10.0109 21 8.10322 20.2098 6.6967 18.8033C5.29018 17.3968 4.5 15.4891 4.5 13.5V11.25C6.48912 11.25 8.39678 12.0402 9.8033 13.4467C11.2098 14.8532 12 16.7609 12 18.75V21Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 3.75L19.5 20.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.4997 11.25V6C18.3131 5.99909 17.1432 6.28013 16.0866 6.81997C15.0299 7.35981 14.1165 8.14299 13.4219 9.105"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.2331 15.495C19.4114 14.845 19.5016 14.174 19.5012 13.5V11.25C18.3226 11.2482 17.1603 11.5254 16.1094 12.0591"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.7541 13.9297C12.6187 15.2791 11.9973 16.9868 12 18.7503V21.0003C13.0955 21.0013 14.1778 20.7618 15.1706 20.2989C16.1634 19.8359 17.0425 19.1607 17.7459 18.3209"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 11.25V6C5.317 5.99906 6.12865 6.13175 6.90281 6.39282"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.23438 4.5C10.0112 3.58749 10.9485 2.82492 12 2.25C12 2.25 15.0366 3.76781 16.125 6.80438"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_plant">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

// Icon options for selection
export const nutritionPlanIcons = [
  { id: "swimming", label: "Plaukimas", Icon: SwimmingIcon },
  { id: "plant", label: "Augalas", Icon: PlantIcon },
  { id: "dumbbell", label: "Svoriai", Icon: DumbbellIcon },
  { id: "leaf", label: "Lapas", Icon: LeafIcon },
  { id: "pot", label: "Puodas", Icon: PotIcon },
  { id: "yoga", label: "Joga", Icon: YogaIcon },
] as const;

export type NutritionPlanIconType = (typeof nutritionPlanIcons)[number]["id"];

// Helper to get icon component by id
export function getNutritionPlanIcon(iconId: string) {
  const iconOption = nutritionPlanIcons.find((i) => i.id === iconId);
  return iconOption?.Icon || SwimmingIcon;
}
