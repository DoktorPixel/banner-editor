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
