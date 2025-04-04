interface CardSeachIconProps {
  className?: string;
  color?: string;
}

const CardSeachIcon = ({ className = '', color }: CardSeachIconProps) => {
  return (
    <svg
      width='23'
      height='28'
      viewBox='0 0 23 28'
      className={className}
      fill={color || 'currentColor'}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0.40625 1.44099C0.40625 0.71041 0.998499 0.118164 1.72907 0.118164H14.2959C15.0265 0.118164 15.6187 0.710413 15.6187 1.44099V12.8752C14.7556 12.3355 13.7354 12.0236 12.6424 12.0236C9.53743 12.0236 7.02037 14.5406 7.02037 17.6456C7.02037 19.0329 7.52287 20.3029 8.35579 21.2834H1.72907C0.998497 21.2834 0.40625 20.6911 0.40625 19.9605V1.44099ZM2.39049 2.76381C2.39049 2.39853 2.68661 2.1024 3.0519 2.1024H12.9731C13.3384 2.1024 13.6345 2.39853 13.6345 2.76381V10.0393C13.6345 10.4046 13.3384 10.7008 12.9731 10.7008H3.0519C2.68661 10.7008 2.39049 10.4046 2.39049 10.0393V2.76381Z'
      />
      <path d='M12.642 21.945C11.4404 21.945 10.4236 21.5288 9.59152 20.6963C8.75946 19.8638 8.34321 18.847 8.34277 17.6459C8.34233 16.4447 8.75858 15.4279 9.59152 14.5954C10.4245 13.7629 11.4413 13.3467 12.642 13.3467C13.8426 13.3467 14.8597 13.7629 15.693 14.5954C16.5264 15.4279 16.9425 16.4447 16.9411 17.6459C16.9411 18.1309 16.864 18.5884 16.7096 19.0183C16.5553 19.4482 16.3459 19.8285 16.0813 20.1592L19.7852 23.8631C19.9065 23.9844 19.9671 24.1387 19.9671 24.3261C19.9671 24.5135 19.9065 24.6679 19.7852 24.7891C19.6639 24.9104 19.5096 24.971 19.3222 24.971C19.1348 24.971 18.9805 24.9104 18.8592 24.7891L15.1553 21.0852C14.8246 21.3498 14.4443 21.5592 14.0144 21.7135C13.5845 21.8679 13.127 21.945 12.642 21.945ZM12.642 20.6222C13.4687 20.6222 14.1716 20.333 14.7505 19.7544C15.3295 19.1759 15.6188 18.4731 15.6183 17.6459C15.6179 16.8187 15.3286 16.116 14.7505 15.5379C14.1725 14.9599 13.4696 14.6704 12.642 14.6695C11.8143 14.6686 11.1117 14.9581 10.534 15.5379C9.9564 16.1178 9.66692 16.8204 9.6656 17.6459C9.66428 18.4713 9.95375 19.1742 10.534 19.7544C11.1143 20.3347 11.817 20.624 12.642 20.6222Z' />
    </svg>
  );
};

export default CardSeachIcon;
