interface CardIconProps {
  className?: string;
  color?: string;
}

const CardIcon = ({ className = '', color }: CardIconProps) => {
  return (
    <svg
      className={className}
      fill={color || 'currentColor'}
      viewBox='0 0 128 177'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M11.6664 0.11084C5.56057 0.11084 0.61084 5.06057 0.61084 11.1664V165.944C0.61084 172.05 5.56057 176.999 11.6664 176.999H116.694C122.8 176.999 127.75 172.05 127.75 165.944V11.1664C127.75 5.06057 122.8 0.11084 116.694 0.11084H11.6664ZM22.722 16.6944C19.6691 16.6944 17.1942 19.1692 17.1942 22.2221V83.0276C17.1942 86.0805 19.6691 88.5554 22.722 88.5554H105.639C108.691 88.5554 111.166 86.0805 111.166 83.0276V22.2221C111.166 19.1692 108.691 16.6944 105.639 16.6944H22.722Z'
      />
    </svg>
  );
};

export default CardIcon;
