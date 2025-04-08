interface SVGProps {
  width?: string;
  height?: string;
}
export const TextAlignLeft: React.FC<SVGProps> = ({
  width = "24px",
  height = "24px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Edit / Text_Align_Left">
        <path
          id="Vector"
          d="M4 18H14M4 14H20M4 10H14M4 6H20"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const TextAlignRight: React.FC<SVGProps> = ({
  width = "24px",
  height = "24px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Edit / Text_Align_Right">
        <path
          id="Vector"
          d="M20 18H10M20 14H4M20 10H10M20 6H4"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const TextAlignCenter: React.FC<SVGProps> = ({
  width = "24px",
  height = "24px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Edit / Text_Align_Center">
        <path
          id="Vector"
          d="M17 18H7M20 14H4M17 10H7M20 6H4"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

//
export const TextLineThrough: React.FC<SVGProps> = ({
  width = "24px",
  height = "24px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 5H10C8.34315 5 7 6.34315 7 8V9C7 10.6569 8.34315 12 10 12H17M7 19H14C15.6569 19 17 17.6569 17 16V15"
        stroke="#000000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M5 12H19"
        stroke="#000000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const TextOverline: React.FC<SVGProps> = ({
  width = "24px",
  height = "24px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 3H20M12 21C9.23858 21 7 18.7614 7 16V12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12V16C17 18.7614 14.7614 21 12 21Z"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const TextDecorationNone: React.FC<SVGProps> = ({
  width = "24px",
  height = "24px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Edit / Remove_Minus">
        <path
          id="Vector"
          d="M6 12H18"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const TextUnderline: React.FC<SVGProps> = ({
  width = "24px",
  height = "24px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 21H19"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 3V10C5 13.87 8.13 17 12 17C15.87 17 19 13.87 19 10V3"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

//

export const TextNormal: React.FC<SVGProps> = ({
  width = "24px",
  height = "24px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="nonzero"
        clipRule="nonzero"
        d="M0 1.75C0 0.783501 0.783502 0 1.75 0H14.25C15.2165 0 16 0.783502 16 1.75V14.25C16 15.2165 15.2165 16 14.25 16H1.75C0.783501 16 0 15.2165 0 14.25V1.75ZM1.75 1.5C1.61193 1.5 1.5 1.61193 1.5 1.75V14.25C1.5 14.3881 1.61193 14.5 1.75 14.5H14.25C14.3881 14.5 14.5 14.3881 14.5 14.25V1.75C14.5 1.61193 14.3881 1.5 14.25 1.5H1.75ZM4.23621 3.29792C4.5287 3.18802 4.85868 3.27097 5.06443 3.50612L10.75 10.0039V4C10.75 3.58579 11.0858 3.25 11.5 3.25C11.9142 3.25 12.25 3.58579 12.25 4V12C12.25 12.3125 12.0563 12.5922 11.7638 12.7021C11.4713 12.812 11.1413 12.729 10.9356 12.4939L5.25 5.99609V12C5.25 12.4142 4.91421 12.75 4.5 12.75C4.08579 12.75 3.75 12.4142 3.75 12V4C3.75 3.68754 3.94371 3.40782 4.23621 3.29792Z"
        fill="#000000"
      />
    </svg>
  );
};

export const TextItalic: React.FC<SVGProps> = ({
  width = "24px",
  height = "24px",
}) => {
  return (
    <svg
      fill="#000000"
      width={width}
      height={height}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      //   xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 392.619 392.619"
      //   xml:space="preserve"
    >
      <g>
        <path
          d="M310.723,0.929H81.896C36.738,0.929,0,37.667,0,82.825v226.97c0,45.158,36.738,81.896,81.896,81.896h228.827
		c45.158,0,81.896-36.738,81.896-81.896V82.825C392.619,37.667,355.881,0.929,310.723,0.929z M362.619,309.794
		c0,28.616-23.28,51.896-51.896,51.896H81.896C53.28,361.69,30,338.41,30,309.794V82.825c0-28.616,23.28-51.896,51.896-51.896
		h228.827c28.616,0,51.896,23.28,51.896,51.896V309.794z"
        />
        <path
          d="M263.825,96.94h-91.03c-8.284,0-15,6.716-15,15s6.716,15,15,15h26.102l-36.177,138.739h-33.925c-8.284,0-15,6.716-15,15
		s6.716,15,15,15h45.402c0.041,0,0.082,0.004,0.123,0.004c0.031,0,0.062-0.004,0.093-0.004h45.411c8.284,0,15-6.716,15-15
		s-6.716-15-15-15h-26.102L229.9,126.94h33.925c8.284,0,15-6.716,15-15S272.109,96.94,263.825,96.94z"
        />
      </g>
    </svg>
  );
};
//
export const BorderBottom: React.FC<SVGProps> = ({
  width = "24px",
  height = "24px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 20H4M16 4H16.01M16 12H16.01M12 4H12.01M12 8H12.01M12 12H12.01M12 16H12.01M8 4H8.01M8 12H8.01M4 4H4.01M4 8H4.01M4 12H4.01M4 16H4.01M20 4H20.01M20 8H20.01M20 12H20.01M20 16H20.01"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const BorderLeft: React.FC<SVGProps> = ({
  width = "24px",
  height = "24px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 4H16.01M16 12H16.01M12 4H12.01M12 8H12.01M12 12H12.01M12 16H12.01M12 20H12.01M16 20H16.01M8 4H8.01M8 12H8.01M8 20H8.01M20 4H20.01M20 8H20.01M20 12H20.01M20 16H20.01M20 20H20.01M4 4V20"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const BorderRight: React.FC<SVGProps> = ({
  width = "24px",
  height = "24px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="20" r="1" fill="#000000" />
      <circle cx="8" cy="20" r="1" fill="#000000" />
      <circle cx="16" cy="12" r="1" fill="#000000" />
      <circle cx="16" cy="4" r="1" fill="#000000" />
      <circle cx="12" cy="12" r="1" fill="#000000" />
      <circle cx="12" cy="4" r="1" fill="#000000" />
      <circle cx="12" cy="20" r="1" fill="#000000" />
      <circle cx="8" cy="12" r="1" fill="#000000" />
      <circle cx="8" cy="4" r="1" fill="#000000" />
      <circle cx="12" cy="8" r="1" fill="#000000" />
      <circle cx="4" cy="12" r="1" fill="#000000" />
      <circle cx="4" cy="4" r="1" fill="#000000" />
      <circle cx="4" cy="20" r="1" fill="#000000" />
      <circle cx="4" cy="8" r="1" fill="#000000" />
      <circle cx="4" cy="16" r="1" fill="#000000" />
      <circle cx="12" cy="16" r="1" fill="#000000" />
      <path
        d="M20 4L20 20"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const BorderTop: React.FC<SVGProps> = ({
  width = "24px",
  height = "24px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="16" r="1" fill="#000000" />
      <circle cx="20" cy="20" r="1" fill="#000000" />
      <circle cx="16" cy="20" r="1" fill="#000000" />
      <circle cx="20" cy="8" r="1" fill="#000000" />
      <circle cx="8" cy="20" r="1" fill="#000000" />
      <circle cx="20" cy="12" r="1" fill="#000000" />
      <circle cx="16" cy="12" r="1" fill="#000000" />
      <circle cx="12" cy="12" r="1" fill="#000000" />
      <circle cx="12" cy="20" r="1" fill="#000000" />
      <circle cx="8" cy="12" r="1" fill="#000000" />
      <circle cx="12" cy="8" r="1" fill="#000000" />
      <path
        d="M4 4H20"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4" cy="12" r="1" fill="#000000" />
      <circle cx="4" cy="20" r="1" fill="#000000" />
      <circle cx="4" cy="8" r="1" fill="#000000" />
      <circle cx="4" cy="16" r="1" fill="#000000" />
      <circle cx="12" cy="16" r="1" fill="#000000" />
    </svg>
  );
};

<svg
  width="21"
  height="20"
  viewBox="0 0 21 20"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M10.5 2.5V17.5M8 17.5H13M16.3333 5V2.5H4.66667V5"
    stroke="black"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>;

export const SidebarText: React.FC<SVGProps> = ({
  width = "21px",
  height = "20px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5 2.5V17.5M8 17.5H13M16.3333 5V2.5H4.66667V5"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SidebarImage: React.FC<SVGProps> = ({
  width = "20px",
  height = "20px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 0H0V20H20V0Z" fill="white" />
      <path
        d="M17.5 13.3333V16.6667C17.5 17.1269 17.1269 17.5 16.6667 17.5H3.33333C2.8731 17.5 2.5 17.1269 2.5 16.6667V15M17.5 13.3333V3.33333C17.5 2.8731 17.1269 2.5 16.6667 2.5H3.33333C2.8731 2.5 2.5 2.8731 2.5 3.33333V15M17.5 13.3333L12.9024 10.2683C12.6536 10.1023 12.3349 10.0825 12.0674 10.2162L2.5 15"
        stroke="black"
        strokeLinejoin="round"
      />
      <path
        d="M6.66667 9.16666C7.58714 9.16666 8.33333 8.42047 8.33333 7.49999C8.33333 6.57952 7.58714 5.83333 6.66667 5.83333C5.74619 5.83333 5 6.57952 5 7.49999C5 8.42047 5.74619 9.16666 6.66667 9.16666Z"
        stroke="black"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SidebarLayers: React.FC<SVGProps> = ({
  width = "21px",
  height = "20px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.873 0.921304C10.6383 0.804003 10.3622 0.804003 10.1275 0.921304L1.79423 5.08797C1.51191 5.22913 1.33357 5.51769 1.33357 5.83333C1.33357 6.14897 1.51191 6.43753 1.79423 6.57869L10.1275 10.7453C10.3622 10.8627 10.6383 10.8627 10.873 10.7453L19.2063 6.57869C19.4885 6.43753 19.6669 6.14897 19.6669 5.83333C19.6669 5.51769 19.4885 5.22913 19.2063 5.08797L10.873 0.921304Z"
        fill="black"
      />
      <path
        d="M1.42149 13.794C1.62732 13.3823 2.12787 13.2155 2.53952 13.4212L10.5002 17.4016L18.4608 13.4212C18.8725 13.2155 19.3731 13.3823 19.5788 13.794C19.7847 14.2056 19.6178 14.7062 19.2062 14.912L10.8728 19.0787C10.6382 19.196 10.3621 19.196 10.1275 19.0787L1.79417 14.912C1.38252 14.7062 1.21567 14.2056 1.42149 13.794Z"
        fill="black"
      />
      <path
        d="M2.53952 9.25457C2.12787 9.04882 1.62732 9.21566 1.42149 9.62732C1.21567 10.0389 1.38252 10.5395 1.79417 10.7453L10.1275 14.912C10.3621 15.0293 10.6382 15.0293 10.8728 14.912L19.2062 10.7453C19.6178 10.5395 19.7847 10.0389 19.5788 9.62732C19.3731 9.21566 18.8725 9.04882 18.4608 9.25457L10.5002 13.2349L2.53952 9.25457Z"
        fill="black"
      />
    </svg>
  );
};

export const SidebarVariables: React.FC<SVGProps> = ({
  width = "21px",
  height = "20px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.0884 17.5C18.2053 15.2407 18.8333 12.6941 18.8333 10C18.8333 7.30592 18.2053 4.7593 17.0884 2.5M3.91161 2.5C2.79469 4.7593 2.16667 7.30592 2.16667 10C2.16667 12.6941 2.79469 15.2407 3.91161 17.5M14.2905 7.1875H14.2158C13.6713 7.1875 13.154 7.42668 12.7997 7.84227L8.32059 13.0952C7.96623 13.5108 7.44892 13.75 6.90442 13.75H6.82969M7.76236 7.1875H8.92408C9.3405 7.1875 9.70642 7.46497 9.82083 7.86745L11.2995 13.0701C11.4139 13.4725 11.7798 13.75 12.1962 13.75H13.358"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SidebarDev: React.FC<SVGProps> = ({
  width = "21px",
  height = "20px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_20_41)">
        <path
          d="M0.5 2V18H20.5V2H0.5ZM1.5 3H19.5V5H1.5V3ZM1.5 6H19.5V17H1.5V6ZM8.14648 8.14648L4.79297 11.5L8.14648 14.8535L8.85352 14.1465L6.20703 11.5L8.85352 8.85352L8.14648 8.14648ZM12.8535 8.14648L12.1465 8.85352L14.793 11.5L12.1465 14.1465L12.8535 14.8535L16.207 11.5L12.8535 8.14648Z"
          fill="#222222"
        />
      </g>
      <defs>
        <clipPath id="clip0_20_41">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export const SvgImage: React.FC<SVGProps> = ({
  width = "14px",
  height = "14px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 8.22222V10.4444C11 10.7513 10.7513 11 10.4444 11H1.55556C1.24873 11 1 10.7513 1 10.4444V9.33333M11 8.22222V1.55556C11 1.24873 10.7513 1 10.4444 1H1.55556C1.24873 1 1 1.24873 1 1.55556V9.33333M11 8.22222L7.93494 6.17883C7.76906 6.06822 7.55661 6.055 7.37828 6.14417L1 9.33333"
        stroke="black"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <path
        d="M3.7778 5.44444C4.39145 5.44444 4.88891 4.94697 4.88891 4.33332C4.88891 3.71968 4.39145 3.22221 3.7778 3.22221C3.16415 3.22221 2.66669 3.71968 2.66669 4.33332C2.66669 4.94697 3.16415 5.44444 3.7778 5.44444Z"
        stroke="black"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SvgLayout: React.FC<SVGProps> = ({
  width = "10px",
  height = "10px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.33333 0.833334H9.16667V9.16667H8.33333V0.833334ZM7.5 0L7.5 10H10V0H7.5ZM4.58333 0.833334H5.41667L5.41667 9.16667H4.58333L4.58333 0.833334ZM3.75 0L3.75 10H6.25L6.25 0H3.75ZM0.833333 0.833334H1.66667L1.66667 9.16667H0.833333L0.833333 0.833334ZM0 0L0 10H2.5L2.5 0H0Z"
        fill="#0B1719"
      />
    </svg>
  );
};

export const SvgLayoutOpen: React.FC<SVGProps> = ({
  width = "10px",
  height = "10px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.16667 8.33333V9.16667H0.833333V8.33333H9.16667ZM10 7.5H0V10H10V7.5ZM9.16667 4.58333V5.41667H0.833333V4.58333H9.16667ZM10 3.75H0V6.25H10V3.75ZM9.16667 0.833333V1.66667H0.833333V0.833333H9.16667ZM10 0H0V2.5H10V0Z"
        fill="#0B1719"
      />
    </svg>
  );
};

export const SvgText: React.FC<SVGProps> = ({
  width = "12px",
  height = "12px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 1V9M3.28571 9H6.71429M9 2.33333V1H1V2.33333"
        stroke="#6A6A6A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SvgVirtual: React.FC<SVGProps> = ({
  width = "10px",
  height = "10px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.42857 0H0V1.42857H1.42857V0Z" fill="#6A6A6A" />
      <path d="M1.42857 8.57143H0V10H1.42857V8.57143Z" fill="#6A6A6A" />
      <path d="M0 5.71429H1.42857V7.14286H0V5.71429Z" fill="#6A6A6A" />
      <path d="M1.42857 2.85714H0V4.28571H1.42857V2.85714Z" fill="#6A6A6A" />
      <path d="M2.85712 0H4.28569V1.42857H2.85712V0Z" fill="#6A6A6A" />
      <path d="M4.28569 8.57143H2.85712V10H4.28569V8.57143Z" fill="#6A6A6A" />
      <path d="M5.71429 0H7.14287V1.42857H5.71429V0Z" fill="#6A6A6A" />
      <path d="M7.14287 8.57143H5.71429V10H7.14287V8.57143Z" fill="#6A6A6A" />
      <path d="M8.57141 0H9.99998V1.42857H8.57141V0Z" fill="#6A6A6A" />
      <path d="M9.99998 8.57143H8.57141V10H9.99998V8.57143Z" fill="#6A6A6A" />
      <path
        d="M8.57141 5.71429H9.99998V7.14286H8.57141V5.71429Z"
        fill="#6A6A6A"
      />
      <path
        d="M9.99998 2.85714H8.57141V4.28571H9.99998V2.85714Z"
        fill="#6A6A6A"
      />
    </svg>
  );
};

export const ArrowDown: React.FC<SVGProps> = ({
  width = "12px",
  height = "12px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 8 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.152813 0.13518C0.356563 -0.04506 0.686915 -0.04506 0.890665 0.13518L4.00001 2.88572L7.10937 0.13518C7.31313 -0.04506 7.64343 -0.04506 7.84718 0.13518C8.05094 0.31542 8.05094 0.607654 7.84718 0.787876L4.36891 3.8648C4.2711 3.95138 4.13837 4 4.00001 4C3.86164 4 3.72891 3.95138 3.6311 3.8648L0.152813 0.787876C-0.0509375 0.607654 -0.0509375 0.31542 0.152813 0.13518Z"
        fill="#363853"
      />
    </svg>
  );
};

export const ArrowRight: React.FC<SVGProps> = ({
  width = "12px",
  height = "12px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 4 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.13518 7.84719C-0.04506 7.64344 -0.04506 7.31309 0.13518 7.10934L2.88572 3.99999L0.13518 0.890628C-0.04506 0.686872 -0.04506 0.356575 0.13518 0.152818C0.31542 -0.0509396 0.607654 -0.0509396 0.787876 0.152818L3.8648 3.63109C3.95138 3.7289 4 3.86163 4 3.99999C4 4.13836 3.95138 4.27109 3.8648 4.3689L0.787876 7.84719C0.607654 8.05094 0.31542 8.05094 0.13518 7.84719Z"
        fill="#363853"
      />
    </svg>
  );
};

export const PlusIcon: React.FC<SVGProps> = ({
  width = "20px",
  height = "20px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 0H0V20H20V0Z" fill="white" />
      <path
        d="M10 5V15"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 10H15"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const MinusIcon: React.FC<SVGProps> = ({
  width = "20px",
  height = "20px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 0H0V20H20V0Z" fill="white" />
      <path
        d="M5 10H15"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ArrowRight1: React.FC<SVGProps> = ({
  width = "12px",
  height = "12px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.19528 0.219668C6.45561 -0.0732226 6.87774 -0.0732226 7.13808 0.219668L11.8047 5.46968C12.0651 5.76256 12.0651 6.23746 11.8047 6.53034L7.13808 11.7803C6.87774 12.0732 6.45561 12.0732 6.19528 11.7803C5.93494 11.4875 5.93494 11.0126 6.19528 10.7197L9.72388 6.75001H0.666668C0.29848 6.75001 0 6.41424 0 6.00001C0 5.58578 0.29848 5.25001 0.666668 5.25001H9.72388L6.19528 1.28033C5.93494 0.987436 5.93494 0.512566 6.19528 0.219668Z"
        fill="black"
      />
    </svg>
  );
};

export const ArrowDown1: React.FC<SVGProps> = ({
  width = "12px",
  height = "12px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.7803 6.19528C12.0732 6.45561 12.0732 6.87774 11.7803 7.13808L6.53032 11.8047C6.23744 12.0651 5.76254 12.0651 5.46966 11.8047L0.219656 7.13808C-0.0732193 6.87774 -0.0732193 6.45561 0.219656 6.19528C0.512532 5.93494 0.987432 5.93494 1.28031 6.19528L5.24999 9.72388L5.24999 0.666668C5.24999 0.29848 5.58576 0 5.99999 0C6.41422 0 6.74999 0.29848 6.74999 0.666668L6.74999 9.72388L10.7197 6.19528C11.0126 5.93494 11.4874 5.93494 11.7803 6.19528Z"
        fill="black"
      />
    </svg>
  );
};

export const PaddingLeft: React.FC<SVGProps> = ({
  width = "12px",
  height = "13px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 12.5H12V0.5H0V12.5ZM2.25 1.25V2H3V1.25H11.25V11.75H2.25V11H1.5V11.75H0.75V11H1.5V10.25H0.75V9.5H1.5V8.75H0.75V8H1.5V7.25H0.75V6.5H1.5V5.75H0.75V5H1.5V4.25H0.75V3.5H1.5V2.75H0.75V2H1.5V1.25H2.25Z"
        fill="#838383"
      />
      <path d="M1.5 9.5H2.25V10.25H1.5V9.5Z" fill="#838383" />
      <path d="M2.25 10.25H3V11H2.25V10.25Z" fill="#838383" />
      <path d="M2.25 8.75H3V9.5H2.25V8.75Z" fill="#838383" />
      <path d="M2.25 7.25H3V8H2.25V7.25Z" fill="#838383" />
      <path d="M1.5 8H2.25V8.75H1.5V8Z" fill="#838383" />
      <path d="M1.5 6.5H2.25V7.25H1.5V6.5Z" fill="#838383" />
      <path d="M1.5 5H2.25V5.75H1.5V5Z" fill="#838383" />
      <path d="M2.25 5.75H3V6.5H2.25V5.75Z" fill="#838383" />
      <path d="M2.25 4.25H3V5H2.25V4.25Z" fill="#838383" />
      <path d="M2.25 2.75H3V3.5H2.25V2.75Z" fill="#838383" />
      <path d="M1.5 3.5H2.25V4.25H1.5V3.5Z" fill="#838383" />
      <path d="M1.5 2H2.25V2.75H1.5V2Z" fill="#838383" />
    </svg>
  );
};
export const PaddingRight: React.FC<SVGProps> = ({
  width = "12px",
  height = "13px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 0.5H0V12.5H12V0.5ZM9.75 11.75V11H9V11.75H0.75V1.25H9.75V2H10.5V1.25H11.25V2H10.5V2.75H11.25V3.5H10.5V4.25H11.25V5H10.5V5.75H11.25V6.5H10.5V7.25H11.25V8H10.5V8.75H11.25V9.5H10.5V10.25H11.25V11H10.5V11.75H9.75Z"
        fill="#838383"
      />
      <path d="M9.75 2.75H10.5V3.5H9.75V2.75Z" fill="#838383" />
      <path d="M9 2H9.75V2.75H9V2Z" fill="#838383" />
      <path d="M9 3.5H9.75V4.25H9V3.5Z" fill="#838383" />
      <path d="M9 5H9.75V5.75H9V5Z" fill="#838383" />
      <path d="M9.75 4.25H10.5V5H9.75V4.25Z" fill="#838383" />
      <path d="M9.75 5.75H10.5V6.5H9.75V5.75Z" fill="#838383" />
      <path d="M9.75 7.25H10.5V8H9.75V7.25Z" fill="#838383" />
      <path d="M9 6.5H9.75V7.25H9V6.5Z" fill="#838383" />
      <path d="M9 8H9.75V8.75H9V8Z" fill="#838383" />
      <path d="M9 9.5H9.75V10.25H9V9.5Z" fill="#838383" />
      <path d="M9.75 8.75H10.5V9.5H9.75V8.75Z" fill="#838383" />
      <path d="M9.75 10.25H10.5V11H9.75V10.25Z" fill="#838383" />
    </svg>
  );
};
export const PaddingTop: React.FC<SVGProps> = ({
  width = "12px",
  height = "12px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 0V12H12V0H0ZM11.25 2.25H10.5V3H11.25V11.25H0.75V2.25H1.5V1.5H0.75V0.75H1.5V1.5H2.25V0.75H3V1.5H3.75V0.75H4.5V1.5H5.25V0.75H6V1.5H6.75V0.75H7.5V1.5H8.25V0.75H9V1.5H9.75V0.75H10.5V1.5H11.25V2.25Z"
        fill="#838383"
      />
      <path d="M2.25 1.5H3V2.25H2.25V1.5Z" fill="#838383" />
      <path d="M1.5 2.25H2.25V3H1.5V2.25Z" fill="#838383" />
      <path d="M3 2.25H3.75V3H3V2.25Z" fill="#838383" />
      <path d="M4.5 2.25H5.25V3H4.5V2.25Z" fill="#838383" />
      <path d="M3.75 1.5H4.5V2.25H3.75V1.5Z" fill="#838383" />
      <path d="M5.25 1.5H6V2.25H5.25V1.5Z" fill="#838383" />
      <path d="M6.75 1.5H7.5V2.25H6.75V1.5Z" fill="#838383" />
      <path d="M6 2.25H6.75V3H6V2.25Z" fill="#838383" />
      <path d="M7.5 2.25H8.25V3H7.5V2.25Z" fill="#838383" />
      <path d="M9 2.25H9.75V3H9V2.25Z" fill="#838383" />
      <path d="M8.25 1.5H9V2.25H8.25V1.5Z" fill="#838383" />
      <path d="M9.75 1.5H10.5V2.25H9.75V1.5Z" fill="#838383" />
    </svg>
  );
};
export const PaddingBottom: React.FC<SVGProps> = ({
  width = "12px",
  height = "12px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 12V0H0V12H12ZM0.75 9.75H1.5V9H0.75V0.75H11.25V9.75H10.5V10.5H11.25V11.25H10.5V10.5H9.75V11.25H9V10.5H8.25V11.25H7.5V10.5H6.75V11.25H6V10.5H5.25V11.25H4.5V10.5H3.75V11.25H3V10.5H2.25V11.25H1.5V10.5H0.75V9.75Z"
        fill="#838383"
      />
      <path d="M9 9.75H9.75V10.5H9V9.75Z" fill="#838383" />
      <path d="M9.75 9H10.5V9.75H9.75V9Z" fill="#838383" />
      <path d="M8.25 9H9V9.75H8.25V9Z" fill="#838383" />
      <path d="M6.75 9H7.5V9.75H6.75V9Z" fill="#838383" />
      <path d="M7.5 9.75H8.25V10.5H7.5V9.75Z" fill="#838383" />
      <path d="M6 9.75H6.75V10.5H6V9.75Z" fill="#838383" />
      <path d="M4.5 9.75H5.25V10.5H4.5V9.75Z" fill="#838383" />
      <path d="M5.25 9H6V9.75H5.25V9Z" fill="#838383" />
      <path d="M3.75 9H4.5V9.75H3.75V9Z" fill="#838383" />
      <path d="M2.25 9H3V9.75H2.25V9Z" fill="#838383" />
      <path d="M3 9.75H3.75V10.5H3V9.75Z" fill="#838383" />
      <path d="M1.5 9.75H2.25V10.5H1.5V9.75Z" fill="#838383" />
    </svg>
  );
};

export const GroupLeft: React.FC<SVGProps> = ({
  width = "13px",
  height = "10px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 1H11.6667" stroke="black" strokeLinecap="round" />
      <path d="M1 3.66666H9.66667" stroke="black" strokeLinecap="round" />
      <path d="M1 6.33334H11.6667" stroke="black" strokeLinecap="round" />
      <path d="M1 9H4.66667" stroke="black" strokeLinecap="round" />
    </svg>
  );
};

export const GroupCenter: React.FC<SVGProps> = ({
  width = "12px",
  height = "10px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0.666626 1H11.3333" stroke="black" strokeLinecap="round" />
      <path d="M2.66663 3.66666H9.33329" stroke="black" strokeLinecap="round" />
      <path
        d="M0.666626 6.33334H11.3333"
        stroke="black"
        strokeLinecap="round"
      />
      <path d="M4 9H8" stroke="black" strokeLinecap="round" />
    </svg>
  );
};

export const GroupRight: React.FC<SVGProps> = ({
  width = "13px",
  height = "10px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.33337 1H12" stroke="black" strokeLinecap="round" />
      <path d="M3.33337 3.66666H12" stroke="black" strokeLinecap="round" />
      <path d="M1.33337 6.33334H12" stroke="black" strokeLinecap="round" />
      <path d="M8 9H12" stroke="black" strokeLinecap="round" />
    </svg>
  );
};

export const GroupRowRight: React.FC<SVGProps> = ({
  width = "14px",
  height = "11px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 4H6.5H12" stroke="black" strokeLinecap="round" />
      <path d="M7 1H9.5H12" stroke="black" strokeLinecap="round" />
      <path d="M1 7H12" stroke="black" strokeLinecap="round" />
      <path d="M7 10H12" stroke="black" strokeLinecap="round" />
    </svg>
  );
};

export const GroupRowCenter: React.FC<SVGProps> = ({
  width = "14px",
  height = "11px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 4H12" stroke="black" strokeLinecap="round" />
      <path d="M4 1H6.5H9" stroke="black" strokeLinecap="round" />
      <path d="M1 7H12" stroke="black" strokeLinecap="round" />
      <path d="M4 10H9" stroke="black" strokeLinecap="round" />
    </svg>
  );
};

export const GroupRowLeft: React.FC<SVGProps> = ({
  width = "14px",
  height = "11px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Group">
        <path
          id="Vector"
          d="M1 4H6.5H12"
          stroke="black"
          strokeLinecap="round"
        />
        <path
          id="Vector_2"
          d="M1 1H3.5H6"
          stroke="black"
          strokeLinecap="round"
        />
        <path id="Vector_3" d="M1 7H12" stroke="black" strokeLinecap="round" />
        <path id="Vector_4" d="M1 10H6" stroke="black" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export const RowLeftBottom: React.FC<SVGProps> = ({
  width = "14px",
  height = "11px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 9H1.33333" stroke="black" strokeLinecap="round" />
      <path d="M10 6.33334H1.33333" stroke="black" strokeLinecap="round" />
      <path d="M12 3.66666H1.33333" stroke="black" strokeLinecap="round" />
      <path d="M5.33337 1H1.33337" stroke="black" strokeLinecap="round" />
    </svg>
  );
};

export const RowCenterBottom: React.FC<SVGProps> = ({
  width = "14px",
  height = "11px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.6666 9H0.999959" stroke="black" strokeLinecap="round" />
      <path d="M9.66663 6.33334H2.99996" stroke="black" strokeLinecap="round" />
      <path
        d="M11.6666 3.66666H0.999959"
        stroke="black"
        strokeLinecap="round"
      />
      <path d="M8.33325 1H4.33325" stroke="black" strokeLinecap="round" />
    </svg>
  );
};
export const RowRightBottom: React.FC<SVGProps> = ({
  width = "14px",
  height = "11px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.6666 9H0.999959" stroke="black" strokeLinecap="round" />
      <path d="M11.6666 6.33334H2.99996" stroke="black" strokeLinecap="round" />
      <path
        d="M11.6666 3.66666H0.999959"
        stroke="black"
        strokeLinecap="round"
      />
      <path d="M11.6666 1H7.99996" stroke="black" strokeLinecap="round" />
    </svg>
  );
};
