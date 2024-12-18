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
