interface HomeIconProps {
  className?: string;
  color?: string; // Optionnel si tu veux encore passer un `fill` personnalisé
}

const HomeIcon = ({ className = '', color }: HomeIconProps) => {
  return (
    <svg
      viewBox='0 0 161 177'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      fill={color || 'currentColor'} // Utilise currentColor pour support Tailwind
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M128.588 5.55813C125.445 2.08938 120.982 0.11084 116.3 0.11084H45.0695C40.3882 0.11084 35.925 2.08938 32.7815 5.55813L4.6283 36.6237C1.86402 39.6739 0.333008 43.6433 0.333008 47.7597V160.416C0.333008 169.575 7.75761 176.999 16.9163 176.999H144.055C153.214 176.999 160.638 169.575 160.638 160.416V47.3199C160.638 43.2034 159.107 39.2341 156.343 36.1838L128.588 5.55813ZM80.4855 99.6109C66.7475 99.6109 55.6106 110.748 55.6106 124.486V160.416H105.36V124.486C105.36 110.748 94.2236 99.6109 80.4855 99.6109Z'
      />
    </svg>
  );
};

export default HomeIcon;
