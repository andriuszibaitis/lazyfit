import { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

// Lengvas - 1 stulpelis užpildytas
export function DifficultyLevel1Icon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        y="8.72656"
        width="4.36364"
        height="7.27273"
        rx="0.727273"
        fill="currentColor"
      />
      <mask id="path-2-inside-1_level1" fill="white">
        <rect
          x="5.81836"
          y="5.81836"
          width="4.36364"
          height="10.1818"
          rx="0.727273"
        />
      </mask>
      <rect
        x="5.81836"
        y="5.81836"
        width="4.36364"
        height="10.1818"
        rx="0.727273"
        stroke="currentColor"
        strokeWidth="3"
        mask="url(#path-2-inside-1_level1)"
      />
      <mask id="path-3-inside-2_level1" fill="white">
        <rect x="11.6362" width="4.36364" height="16" rx="0.727273" />
      </mask>
      <rect
        x="11.6362"
        width="4.36364"
        height="16"
        rx="0.727273"
        stroke="currentColor"
        strokeWidth="3"
        mask="url(#path-3-inside-2_level1)"
      />
    </svg>
  );
}

// Vidutinis - 2 stulpeliai užpildyti
export function DifficultyLevel2Icon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="2"
        y="10.7273"
        width="4.36364"
        height="7.27273"
        rx="0.727273"
        fill="currentColor"
      />
      <rect
        x="7.81836"
        y="7.81824"
        width="4.36364"
        height="10.1818"
        rx="0.727273"
        fill="currentColor"
      />
      <mask id="path-3-inside-1_level2" fill="white">
        <rect x="13.6362" y="2" width="4.36364" height="16" rx="0.727273" />
      </mask>
      <rect
        x="13.6362"
        y="2"
        width="4.36364"
        height="16"
        rx="0.727273"
        stroke="currentColor"
        strokeWidth="3"
        mask="url(#path-3-inside-1_level2)"
      />
    </svg>
  );
}

// Sudėtingas - 3 stulpeliai užpildyti
export function DifficultyLevel3Icon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="2"
        y="10.7273"
        width="4.36364"
        height="7.27273"
        rx="0.727273"
        fill="currentColor"
      />
      <rect
        x="7.81836"
        y="7.81824"
        width="4.36364"
        height="10.1818"
        rx="0.727273"
        fill="currentColor"
      />
      <rect
        x="13.6362"
        y="2"
        width="4.36364"
        height="16"
        rx="0.727273"
        fill="currentColor"
      />
    </svg>
  );
}

export function AppleIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.5 11.5C13.1 12.6 12.6 13.6 11.8 14.4C11.1 15.1 10.3 15.5 9.4 15.5C8.7 15.5 7.9 15.3 7.2 14.9C6.5 14.5 5.8 14.3 5.2 14.3C4.5 14.3 3.8 14.5 3.1 14.9C2.4 15.3 1.8 15.5 1.3 15.5C0.3 15.5 -0.6 14.9 -1.4 13.8C-2.4 12.5 -2.9 10.9 -2.9 9.1C-2.9 7.4 -2.5 6 -1.6 4.9C-0.9 4 0.1 3.5 1.3 3.5C2 3.5 2.8 3.7 3.7 4.1C4.6 4.5 5.2 4.7 5.5 4.7C5.7 4.7 6.4 4.5 7.4 4C8.4 3.6 9.2 3.4 9.9 3.5C11.6 3.6 12.9 4.3 13.7 5.6C12.2 6.5 11.5 7.7 11.5 9.3C11.5 10.6 12 11.7 13 12.5C13.2 12.2 13.4 11.9 13.5 11.5ZM10 0.5C10 1.5 9.6 2.4 8.9 3.2C8.1 4.1 7.1 4.6 6 4.5C6 4.4 6 4.3 6 4.1C6 3.2 6.5 2.2 7.1 1.5C7.4 1.1 7.9 0.8 8.4 0.5C9 0.2 9.5 0 10 0C10 0.2 10 0.3 10 0.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LeafIcon({ size = 14, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13 1C13 1 11.5 1.5 9.5 2.5C7.5 3.5 5.5 5 4.5 7C3.5 9 3 11 3 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M1 7C1 7 3 6 5 5C7 4 9 3 11 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ClockIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_clock)">
        <path
          d="M12.1499 2.40039C10.2215 2.40039 8.33648 2.97222 6.7331 4.04356C5.12972 5.11491 3.88004 6.63765 3.14208 8.41923C2.40413 10.2008 2.21104 12.1612 2.58725 14.0525C2.96346 15.9438 3.89205 17.6811 5.25562 19.0447C6.61918 20.4082 8.35646 21.3368 10.2478 21.713C12.1391 22.0893 14.0995 21.8962 15.8811 21.1582C17.6626 20.4203 19.1854 19.1706 20.2567 17.5672C21.3281 15.9638 21.8999 14.0788 21.8999 12.1504C21.8972 9.56537 20.8691 7.087 19.0412 5.25911C17.2133 3.43123 14.7349 2.40312 12.1499 2.40039ZM17.3999 12.9004H13.9602L16.4305 15.3698C16.5002 15.4394 16.5555 15.5222 16.5932 15.6132C16.6309 15.7043 16.6503 15.8018 16.6503 15.9004C16.6503 15.9989 16.6309 16.0965 16.5932 16.1876C16.5555 16.2786 16.5002 16.3613 16.4305 16.431C16.3608 16.5007 16.2781 16.556 16.1871 16.5937C16.096 16.6314 15.9985 16.6508 15.8999 16.6508C15.8014 16.6508 15.7038 16.6314 15.6127 16.5937C15.5217 16.556 15.439 16.5007 15.3693 16.431L11.6193 12.681C11.5143 12.5761 11.4427 12.4424 11.4138 12.2969C11.3848 12.1513 11.3996 12.0004 11.4564 11.8633C11.5133 11.7262 11.6095 11.609 11.7329 11.5266C11.8564 11.4442 12.0015 11.4003 12.1499 11.4004H17.3999C17.5988 11.4004 17.7896 11.4794 17.9302 11.6201C18.0709 11.7607 18.1499 11.9515 18.1499 12.1504C18.1499 12.3493 18.0709 12.5401 17.9302 12.6807C17.7896 12.8214 17.5988 12.9004 17.3999 12.9004Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_clock">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function ChevronDownIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartIcon({ size = 13, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 13 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.8138 3.54666C12.8138 7.55096 6.87653 10.7922 6.62368 10.926C6.55704 10.9619 6.48255 10.9806 6.40688 10.9806C6.33121 10.9806 6.25672 10.9619 6.19007 10.926C5.93723 10.7922 0 7.55096 0 3.54666C0.00105984 2.60636 0.375066 1.70486 1.03996 1.03996C1.70486 0.375066 2.60636 0.00105984 3.54666 0C4.72793 0 5.76219 0.507974 6.40688 1.36661C7.05157 0.507974 8.08582 0 9.26709 0C10.2074 0.00105984 11.1089 0.375066 11.7738 1.03996C12.4387 1.70486 12.8127 2.60636 12.8138 3.54666Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FilterIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_filter)">
        <path
          d="M7.07812 11.6875H16.9243"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 8H20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.1484 15.3828H13.8407"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_filter">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function NutritionIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 16.3125C12.1066 16.3125 14.625 13.7941 14.625 10.6875C14.625 7.5809 12.1066 5.0625 9 5.0625C5.8934 5.0625 3.375 7.5809 3.375 10.6875C3.375 13.7941 5.8934 16.3125 9 16.3125Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 5.0625C9 4.01821 9.41484 3.01669 10.1533 2.27827C10.8917 1.53984 11.8932 1.125 12.9375 1.125H13.5C13.5 2.16929 13.0852 3.17081 12.3467 3.90923C11.6083 4.64766 10.6068 5.0625 9.5625 5.0625H9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 5.0625C9 4.01821 8.58516 3.01669 7.84673 2.27827C7.10831 1.53984 6.10679 1.125 5.0625 1.125H4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.375 11.25C12.2495 11.9499 11.9127 12.5946 11.4099 13.0974C10.9071 13.6002 10.2624 13.937 9.5625 14.0625"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
