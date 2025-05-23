interface BoosterIconProps {
  className?: string;
  color?: string;
}

const BoosterIcon = ({ className = '', color }: BoosterIconProps) => {
  return (
    <svg
      width='111'
      height='194'
      viewBox='0 0 111 194'
      className={className}
      fill={color || 'currentColor'}
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect x='0.276611' y='48.0752' width='104.934' height='145.924' />
      <rect
        x='6.27002'
        y='0.527832'
        width='106.162'
        height='31.1523'
        transform='rotate(11.0908 6.27002 0.527832)'
      />
    </svg>
  );
};

export default BoosterIcon;
